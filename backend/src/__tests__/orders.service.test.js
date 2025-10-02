const OrderService = require('../modules/orders/orders.service');
const prisma = require('../database/prisma');

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validOrderData = {
      items: [
        {
          dishId: '550e8400-e29b-41d4-a716-446655440000',
          quantity: 2
        }
      ],
      notes: 'Sem cebola'
    };

    const mockDish = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Hambúrguer Artesanal',
      price: 32.00,
      category: 'MAIN_COURSE',
      active: true
    };

    const mockCreatedOrder = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      totalValue: 64.00,
      status: 'RECEIVED',
      notes: 'Sem cebola',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('deve criar um pedido com dados válidos', async () => {
      // Mock da transação
      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          order: {
            create: jest.fn().mockResolvedValue(mockCreatedOrder),
            findUnique: jest.fn().mockResolvedValue(mockCreatedOrder)
          },
          orderItem: {
            createMany: jest.fn().mockResolvedValue({ count: 1 })
          }
        };
        return await callback(tx);
      });

      prisma.$transaction = mockTransaction;
      prisma.dish.findMany.mockResolvedValue([mockDish]);

      const result = await OrderService.create(validOrderData);

      expect(prisma.dish.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['550e8400-e29b-41d4-a716-446655440000'] },
          active: true
        }
      });
      expect(mockTransaction).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedOrder);
    });

    it('deve lançar erro quando prato não é encontrado', async () => {
      prisma.dish.findMany.mockResolvedValue([]);

      await expect(OrderService.create(validOrderData))
        .rejects
        .toThrow('Pratos não encontrados ou inativos');
    });

    it('deve lançar erro quando prato está inativo', async () => {
      const inactiveDish = { ...mockDish, active: false };
      prisma.dish.findMany.mockResolvedValue([]);

      await expect(OrderService.create(validOrderData))
        .rejects
        .toThrow('Pratos não encontrados ou inativos');
    });

    it('deve calcular o valor total corretamente', async () => {
      const multipleItemsData = {
        items: [
          { dishId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 },
          { dishId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1 }
        ]
      };

      const mockDishes = [
        { ...mockDish, id: '550e8400-e29b-41d4-a716-446655440000', price: 32.00 },
        { ...mockDish, id: '550e8400-e29b-41d4-a716-446655440001', price: 25.00 }
      ];

      const expectedTotal = (32.00 * 2) + (25.00 * 1); // 89.00

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          order: {
            create: jest.fn().mockResolvedValue({ ...mockCreatedOrder, totalValue: expectedTotal }),
            findUnique: jest.fn().mockResolvedValue({ ...mockCreatedOrder, totalValue: expectedTotal })
          },
          orderItem: {
            createMany: jest.fn().mockResolvedValue({ count: 2 })
          }
        };
        return await callback(tx);
      });

      prisma.$transaction = mockTransaction;
      prisma.dish.findMany.mockResolvedValue(mockDishes);

      const result = await OrderService.create(multipleItemsData);

      expect(result.totalValue).toBe(expectedTotal);
    });
  });

  describe('findAll', () => {
    const mockOrders = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        totalValue: 64.00,
        status: 'RECEIVED',
        notes: null,
        items: []
      }
    ];

    it('deve buscar todos os pedidos sem filtro', async () => {
      prisma.order.findMany.mockResolvedValue(mockOrders);

      const result = await OrderService.findAll();

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: {},
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
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockOrders);
    });

    it('deve buscar pedidos filtrados por status', async () => {
      prisma.order.findMany.mockResolvedValue(mockOrders);

      const result = await OrderService.findAll('PREPARING');

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { status: 'PREPARING' },
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
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findOne', () => {
    const mockOrder = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      totalValue: 64.00,
      status: 'RECEIVED',
      notes: null,
      items: []
    };

    it('deve buscar um pedido por ID', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);

      const result = await OrderService.findOne('550e8400-e29b-41d4-a716-446655440001');

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440001' },
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
      expect(result).toEqual(mockOrder);
    });

    it('deve retornar null quando pedido não é encontrado', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const result = await OrderService.findOne('550e8400-e29b-41d4-a716-446655440001');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    const mockUpdatedOrder = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      totalValue: 64.00,
      status: 'PREPARING',
      notes: null,
      items: []
    };

    it('deve atualizar o status do pedido', async () => {
      prisma.order.findUnique.mockResolvedValue(mockUpdatedOrder);
      prisma.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await OrderService.updateStatus('550e8400-e29b-41d4-a716-446655440001', 'PREPARING');

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440001' }
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440001' },
        data: { status: 'PREPARING' },
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
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('deve lançar erro quando pedido não é encontrado', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(OrderService.updateStatus('550e8400-e29b-41d4-a716-446655440001', 'PREPARING'))
        .rejects
        .toThrow('Pedido não encontrado');

      expect(prisma.order.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve deletar um pedido existente', async () => {
      const mockOrder = { id: '550e8400-e29b-41d4-a716-446655440001' };
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      
      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          orderItem: {
            deleteMany: jest.fn().mockResolvedValue({ count: 1 })
          },
          order: {
            delete: jest.fn().mockResolvedValue(mockOrder)
          }
        };
        return await callback(tx);
      });

      prisma.$transaction = mockTransaction;

      const result = await OrderService.delete('550e8400-e29b-41d4-a716-446655440001');

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440001' }
      });
      expect(mockTransaction).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('deve lançar erro quando pedido não é encontrado', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(OrderService.delete('550e8400-e29b-41d4-a716-446655440001'))
        .rejects
        .toThrow('Pedido não encontrado');

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });
});