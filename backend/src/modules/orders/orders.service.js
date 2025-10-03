const prisma = require('../../database/prisma');

class OrderService {
  async create(data) {
    const { items, notes, status } = data;

    // Validações de entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Items são obrigatórios e devem ser um array não vazio');
    }

    // Validar estrutura dos itens
    for (const item of items) {
      if (!item.dishId || typeof item.dishId !== 'string') {
        throw new Error('Todos os itens devem ter um dishId válido');
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error('Todos os itens devem ter uma quantidade válida maior que zero');
      }
      if (!Number.isInteger(item.quantity)) {
        throw new Error('A quantidade deve ser um número inteiro');
      }
    }

    // Validar se todos os pratos existem e estão ativos
    const dishIds = items.map(item => item.dishId);
    const uniqueDishIds = [...new Set(dishIds)];
    
    const dishes = await prisma.dish.findMany({
      where: {
        id: { in: uniqueDishIds },
        active: true
      }
    });

    if (dishes.length !== uniqueDishIds.length) {
      const foundIds = dishes.map(dish => dish.id);
      const missingIds = uniqueDishIds.filter(id => !foundIds.includes(id));
      throw new Error(`Pratos não encontrados ou inativos: ${missingIds.join(', ')}`);
    }

    // Calcular o valor total e preparar itens do pedido
    let totalValue = 0;
    const orderItems = items.map(item => {
      const dish = dishes.find(d => d.id === item.dishId);
      if (!dish) {
        throw new Error(`Prato com ID ${item.dishId} não encontrado`);
      }
      
      const subtotal = dish.price * item.quantity;
      totalValue += subtotal;
      
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
        subtotal
      };
    });

    // Validar valor total
    if (totalValue <= 0) {
      throw new Error('O valor total do pedido deve ser maior que zero');
    }

    try {
      // Criar o pedido e os itens em uma transação
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            totalValue,
            status: status || 'RECEIVED', // Usa o status enviado ou 'RECEIVED' como padrão
            notes: notes || null
          }
        });

        // Criar os itens do pedido
        await tx.orderItem.createMany({
          data: orderItems.map(item => ({
            orderId: newOrder.id,
            dishId: item.dishId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.subtotal
          }))
        });

        // Retornar o pedido com os itens
        return await tx.order.findUnique({
          where: { id: newOrder.id },
          include: {
            items: {
              include: {
                dish: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    category: true,
                    image: true
                  }
                }
              }
            }
          }
        });
      });

      return order;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Erro de duplicação de dados');
      }
      if (error.code === 'P2003') {
        throw new Error('Referência inválida a dados relacionados');
      }
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }
  }

  async findAll(status) {
    const where = status ? { status } : {};
    
    return await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        }
      }
    });
  }

  async update(id, data) {
    const { notes } = data;
    
    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      throw new Error('Pedido não encontrado');
    }

    // Atualizar apenas as notas (outros campos como items não devem ser alterados após criação)
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { notes },
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        }
      }
    });

    return updatedOrder;
  }

  async updateStatus(id, status) {
    const validStatuses = ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Status inválido. Valores aceitos: ${validStatuses.join(', ')}`);
    }

    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      throw new Error('Pedido não encontrado');
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        }
      }
    });

    return updatedOrder;
  }

  async delete(id) {
    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      throw new Error('Pedido não encontrado');
    }

    // Deletar em transação (primeiro os itens, depois o pedido)
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });

      await tx.order.delete({
        where: { id }
      });
    });

    return true;
  }
}

module.exports = new OrderService();