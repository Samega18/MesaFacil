const prisma = require('../../database/prisma');

class DishService {
  // Validações de entrada
  _validateDishData(data, isUpdate = false) {
    const errors = [];

    // Validação do nome
    if (!isUpdate || data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Nome é obrigatório e deve ser uma string não vazia');
      } else if (data.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
      } else if (data.name.trim().length > 100) {
        errors.push('Nome deve ter no máximo 100 caracteres');
      }
    }

    // Validação da descrição
    if (!isUpdate || data.description !== undefined) {
      if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push('Descrição é obrigatória e deve ser uma string não vazia');
      } else if (data.description.trim().length < 10) {
        errors.push('Descrição deve ter pelo menos 10 caracteres');
      } else if (data.description.trim().length > 500) {
        errors.push('Descrição deve ter no máximo 500 caracteres');
      }
    }

    // Validação do preço
    if (!isUpdate || data.price !== undefined) {
      if (data.price === undefined || data.price === null) {
        errors.push('Preço é obrigatório');
      } else if (typeof data.price !== 'number' || isNaN(data.price)) {
        errors.push('Preço deve ser um número válido');
      } else if (data.price <= 0) {
        errors.push('Preço deve ser maior que zero');
      } else if (data.price > 9999.99) {
        errors.push('Preço deve ser menor que R$ 9.999,99');
      }
    }

    // Validação da categoria
    const validCategories = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'DRINK'];
    if (!isUpdate || data.category !== undefined) {
      if (!data.category || !validCategories.includes(data.category)) {
        errors.push(`Categoria deve ser uma das seguintes: ${validCategories.join(', ')}`);
      }
    }

    // Validação do status ativo
    if (data.active !== undefined && typeof data.active !== 'boolean') {
      errors.push('Status ativo deve ser um valor booleano');
    }

    // Validação da imagem (URL)
    if (data.image !== undefined && data.image !== null) {
      if (typeof data.image !== 'string') {
        errors.push('URL da imagem deve ser uma string');
      } else if (data.image.trim().length > 0) {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(data.image.trim())) {
          errors.push('URL da imagem deve ser uma URL válida (http ou https)');
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join('; ')}`);
    }
  }

  async create(data) {
    // Validar dados de entrada
    this._validateDishData(data);

    const { name, description, price, category, active = true, image } = data;

    // Normalizar dados
    const normalizedName = name.trim();
    const normalizedDescription = description.trim();
    const normalizedImage = image ? image.trim() : null;

    // Verificar se já existe um prato com o mesmo nome (case-insensitive)
    const existingDish = await prisma.dish.findFirst({
      where: { 
        name: {
          equals: normalizedName,
          mode: 'insensitive'
        }
      }
    });

    if (existingDish) {
      throw new Error('Já existe um prato com este nome');
    }

    try {
      const dish = await prisma.dish.create({
        data: {
          name: normalizedName,
          description: normalizedDescription,
          price: Number(price.toFixed(2)), // Garantir 2 casas decimais
          category,
          active,
          image: normalizedImage
        }
      });

      return dish;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Já existe um prato com este nome');
      }
      throw new Error('Erro ao criar prato: ' + error.message);
    }
  }

  async findAll() {
    return await prisma.dish.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }

  async findOne(id) {
    return await prisma.dish.findUnique({
      where: { id }
    });
  }

  // Método removido - filtros são feitos no frontend

  async update(id, data) {
    // Validar ID
    if (!id || typeof id !== 'string') {
      throw new Error('ID é obrigatório e deve ser uma string válida');
    }

    // Validar dados de entrada para atualização
    this._validateDishData(data, true);

    const { name, description, price, category, active, image } = data;

    // Verificar se o prato existe
    const existingDish = await prisma.dish.findUnique({
      where: { id }
    });

    if (!existingDish) {
      throw new Error('Prato não encontrado');
    }

    // Normalizar dados se fornecidos
    const normalizedName = name ? name.trim() : undefined;
    const normalizedDescription = description ? description.trim() : undefined;
    const normalizedImage = image !== undefined ? (image ? image.trim() : null) : undefined;

    // Verificar se o novo nome já existe em outro prato (case-insensitive)
    if (normalizedName && normalizedName.toLowerCase() !== existingDish.name.toLowerCase()) {
      const dishWithSameName = await prisma.dish.findFirst({
        where: { 
          name: {
            equals: normalizedName,
            mode: 'insensitive'
          },
          id: { not: id }
        }
      });

      if (dishWithSameName) {
        throw new Error('Já existe um prato com este nome');
      }
    }

    try {
      // Preparar dados para atualização (apenas campos fornecidos)
      const updateData = {};
      if (normalizedName !== undefined) updateData.name = normalizedName;
      if (normalizedDescription !== undefined) updateData.description = normalizedDescription;
      if (price !== undefined) updateData.price = Number(price.toFixed(2));
      if (category !== undefined) updateData.category = category;
      if (active !== undefined) updateData.active = active;
      if (normalizedImage !== undefined) updateData.image = normalizedImage;

      const updatedDish = await prisma.dish.update({
        where: { id },
        data: updateData
      });

      return updatedDish;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Já existe um prato com este nome');
      }
      if (error.code === 'P2025') {
        throw new Error('Prato não encontrado');
      }
      throw new Error('Erro ao atualizar prato: ' + error.message);
    }
  }

  async delete(id) {
    // Validar ID
    if (!id || typeof id !== 'string') {
      throw new Error('ID é obrigatório e deve ser uma string válida');
    }

    try {
      // Verificar se o prato existe
      const existingDish = await prisma.dish.findUnique({
        where: { id }
      });

      if (!existingDish) {
        throw new Error('Prato não encontrado');
      }

      // Verificar se o prato tem pedidos associados
      const ordersWithDish = await prisma.orderItem.findFirst({
        where: { dishId: id }
      });

      if (ordersWithDish) {
        throw new Error('Este prato não pode ser deletado pois possui pedidos associados');
      }

      await prisma.dish.delete({
        where: { id }
      });

      return { success: true, message: 'Prato deletado com sucesso' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Prato não encontrado');
      }
      if (error.message.includes('pedidos associados')) {
        throw error; // Re-throw business logic errors
      }
      throw new Error('Erro ao deletar prato: ' + error.message);
    }
  }
}

module.exports = new DishService();