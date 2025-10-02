const DishService = require('../modules/dishes/dishes.service');
const prisma = require('../database/prisma');

// Mock do Prisma
jest.mock('../database/prisma', () => ({
  dish: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
  },
  orderItem: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
}));

describe('DishService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validDishData = {
      name: 'Hambúrguer Artesanal',
      description: 'Delicioso hambúrguer com ingredientes frescos e molho especial',
      price: 25.90,
      category: 'MAIN_COURSE',
      active: true,
      image: 'https://example.com/image.jpg'
    };

    it('deve criar um prato com dados válidos', async () => {
      const mockCreatedDish = { id: 1, ...validDishData };
      
      prisma.dish.findFirst.mockResolvedValue(null); // Não existe prato com mesmo nome
      prisma.dish.create.mockResolvedValue(mockCreatedDish);

      const result = await DishService.create(validDishData);

      expect(prisma.dish.findFirst).toHaveBeenCalledWith({
        where: { 
          name: {
            equals: validDishData.name.trim(),
            mode: 'insensitive'
          }
        }
      });
      expect(prisma.dish.create).toHaveBeenCalledWith({
        data: {
          name: validDishData.name.trim(),
          description: validDishData.description.trim(),
          price: validDishData.price,
          category: validDishData.category,
          active: validDishData.active,
          image: validDishData.image.trim()
        }
      });
      expect(result).toEqual(mockCreatedDish);
    });

    it('deve lançar erro se prato com mesmo nome já existir', async () => {
      const existingDish = { id: 1, name: 'Hambúrguer Artesanal' };
      
      prisma.dish.findFirst.mockResolvedValue(existingDish);

      await expect(DishService.create(validDishData))
        .rejects.toThrow('Já existe um prato com este nome');
    });

    it('deve lançar erro para nome inválido', async () => {
      const invalidData = { ...validDishData, name: '' };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('Nome é obrigatório e deve ser uma string não vazia');
    });

    it('deve lançar erro para nome muito curto', async () => {
      const invalidData = { ...validDishData, name: 'A' };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro para nome muito longo', async () => {
      const invalidData = { ...validDishData, name: 'A'.repeat(101) };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('Nome deve ter no máximo 100 caracteres');
    });

    it('deve lançar erro para descrição inválida', async () => {
      const invalidData = { ...validDishData, description: 'Curta' };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('Descrição deve ter pelo menos 10 caracteres');
    });

    it('deve lançar erro para preço inválido', async () => {
      const invalidData = { ...validDishData, price: -5 };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('Preço deve ser maior que zero');
    });

    it('deve lançar erro para categoria inválida', async () => {
      const invalidData = { ...validDishData, category: 'INVALID_CATEGORY' };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('Categoria deve ser uma das seguintes: APPETIZER, MAIN_COURSE, DESSERT, DRINK');
    });

    it('deve lançar erro para URL de imagem inválida', async () => {
      const invalidData = { ...validDishData, image: 'invalid-url' };

      await expect(DishService.create(invalidData))
        .rejects.toThrow('URL da imagem deve ser uma URL válida (http ou https)');
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pratos', async () => {
      const mockDishes = [
        { id: 1, name: 'Prato 1', active: true },
        { id: 2, name: 'Prato 2', active: false }
      ];

      prisma.dish.findMany.mockResolvedValue(mockDishes);

      const result = await DishService.findAll();

      expect(prisma.dish.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' }
      });
      expect(result).toEqual(mockDishes);
    });

    it('deve retornar array vazio se não houver pratos', async () => {
      prisma.dish.findMany.mockResolvedValue([]);

      const result = await DishService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um prato pelo ID', async () => {
      const mockDish = { id: 1, name: 'Prato Teste' };
      
      prisma.dish.findUnique.mockResolvedValue(mockDish);

      const result = await DishService.findOne(1);

      expect(prisma.dish.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual(mockDish);
    });

    it('deve retornar null se prato não existir', async () => {
      prisma.dish.findUnique.mockResolvedValue(null);

      const result = await DishService.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateData = {
      name: 'Prato Atualizado',
      description: 'Descrição atualizada do prato com mais detalhes',
      price: 30.00
    };

    it('deve atualizar um prato existente', async () => {
      const existingDish = { id: 1, name: 'Prato Original' };
      const updatedDish = { id: 1, ...updateData };

      prisma.dish.findUnique.mockResolvedValue(existingDish);
      prisma.dish.findFirst.mockResolvedValue(null); // Não há conflito de nome
      prisma.dish.update.mockResolvedValue(updatedDish);

      const result = await DishService.update('550e8400-e29b-41d4-a716-446655440000', updateData);

      expect(prisma.dish.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      });
      expect(prisma.dish.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          name: updateData.name.trim(),
          description: updateData.description.trim(),
          price: updateData.price
        }
      });
      expect(result).toEqual(updatedDish);
    });

    it('deve lançar erro se prato não existir', async () => {
      prisma.dish.findUnique.mockResolvedValue(null);

      await expect(DishService.update('550e8400-e29b-41d4-a716-446655440000', updateData))
        .rejects.toThrow('Prato não encontrado');
    });

    it('deve lançar erro se nome já existir em outro prato', async () => {
      const existingDish = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Prato Original' };
      const conflictDish = { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Prato Atualizado' };

      prisma.dish.findUnique.mockResolvedValue(existingDish);
      prisma.dish.findFirst.mockResolvedValue(conflictDish);

      await expect(DishService.update('550e8400-e29b-41d4-a716-446655440000', updateData))
        .rejects.toThrow('Já existe um prato com este nome');
    });
  });

  describe('delete', () => {
    it('deve excluir um prato sem pedidos associados', async () => {
      const existingDish = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Prato para Excluir' };

      prisma.dish.findUnique.mockResolvedValue(existingDish);
      prisma.orderItem.findFirst.mockResolvedValue(null); // Sem pedidos associados
      prisma.dish.delete.mockResolvedValue(existingDish);

      const result = await DishService.delete('550e8400-e29b-41d4-a716-446655440000');

      expect(prisma.dish.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      });
      expect(prisma.orderItem.findFirst).toHaveBeenCalledWith({
        where: { dishId: '550e8400-e29b-41d4-a716-446655440000' }
      });
      expect(prisma.dish.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      });
      expect(result).toEqual({ success: true, message: 'Prato deletado com sucesso' });
    });

    it('deve lançar erro se prato não existir', async () => {
      prisma.dish.findUnique.mockResolvedValue(null);

      await expect(DishService.delete('550e8400-e29b-41d4-a716-446655440000'))
        .rejects.toThrow('Prato não encontrado');
    });

    it('deve lançar erro se prato tiver pedidos associados', async () => {
      const existingDish = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Prato com Pedidos' };
      const associatedOrders = [{ id: '550e8400-e29b-41d4-a716-446655440001', dishId: '550e8400-e29b-41d4-a716-446655440000' }];

      prisma.dish.findUnique.mockResolvedValue(existingDish);
      prisma.orderItem.findFirst.mockResolvedValue(associatedOrders[0]);

      await expect(DishService.delete('550e8400-e29b-41d4-a716-446655440000'))
        .rejects.toThrow('Este prato não pode ser deletado pois possui pedidos associados');
    });
  });

  describe('Validações gerais', () => {
    it('deve aceitar dados mínimos válidos', async () => {
      const minimalData = {
        name: 'Prato Simples',
        description: 'Descrição básica do prato',
        price: 10.00,
        category: 'APPETIZER'
      };

      prisma.dish.findFirst.mockResolvedValue(null);
      prisma.dish.create.mockResolvedValue({ id: 1, ...minimalData, active: true });

      const result = await DishService.create(minimalData);

      expect(result).toBeDefined();
      expect(result.active).toBe(true); // Valor padrão
    });

    it('deve normalizar espaços em branco nos campos de texto', async () => {
      const dataWithSpaces = {
        name: '  Prato com Espaços  ',
        description: '  Descrição com espaços extras  ',
        price: 15.00,
        category: 'MAIN_COURSE',
        image: '  https://example.com/image.jpg  '
      };

      prisma.dish.findFirst.mockResolvedValue(null);
      prisma.dish.create.mockResolvedValue({ id: 1, ...dataWithSpaces });

      await DishService.create(dataWithSpaces);

      expect(prisma.dish.create).toHaveBeenCalledWith({
        data: {
          name: 'Prato com Espaços',
          description: 'Descrição com espaços extras',
          price: 15.00,
          category: 'MAIN_COURSE',
          active: true,
          image: 'https://example.com/image.jpg'
        }
      });
    });
  });
});