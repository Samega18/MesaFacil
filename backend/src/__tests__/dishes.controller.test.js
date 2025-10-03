const request = require('supertest');
const app = require('../app');
const DishService = require('../modules/dishes/dishes.service');

// Mock do DishService
jest.mock('../modules/dishes/dishes.service');

describe('DishController Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/dishes', () => {
    const validDishData = {
      name: 'Hambúrguer Artesanal',
      description: 'Delicioso hambúrguer com ingredientes frescos e molho especial',
      price: 25.90,
      category: 'MAIN_COURSE',
      active: true,
      image: 'https://example.com/image.jpg'
    };

    it('deve criar um prato com dados válidos', async () => {
      const mockCreatedDish = { id: '550e8400-e29b-41d4-a716-446655440000', ...validDishData };
      DishService.create.mockResolvedValue(mockCreatedDish);

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(201);

      expect(response.body).toEqual(mockCreatedDish);
      expect(DishService.create).toHaveBeenCalledWith(validDishData);
    });

    it('deve retornar 409 se prato já existir', async () => {
      DishService.create.mockRejectedValue(new Error('Já existe um prato com este nome'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Já existe um prato com este nome',
        code: 'DISH_ALREADY_EXISTS'
      });
    });

    it('deve retornar 400 para dados inválidos do service', async () => {
      DishService.create.mockRejectedValue(new Error('Dados inválidos: Nome é obrigatório'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Dados inválidos: Nome é obrigatório',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 400 para validação de middleware - nome vazio', async () => {
      const invalidData = { ...validDishData, name: '' };

      const response = await request(app)
        .post('/api/dishes')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Dados inválidos');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('deve retornar 400 para validação de middleware - categoria inválida', async () => {
      const invalidData = { ...validDishData, category: 'INVALID_CATEGORY' };

      const response = await request(app)
        .post('/api/dishes')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Dados inválidos');
      expect(response.body).toHaveProperty('details');
    });

    it('deve retornar 500 para erro interno', async () => {
      DishService.create.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao criar o prato',
        code: 'INTERNAL_ERROR'
      });
    });
  });

  describe('GET /api/dishes', () => {
    it('deve retornar lista de pratos', async () => {
      const mockDishes = [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Prato 1', price: 15.00 },
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Prato 2', price: 20.00 }
      ];
      
      DishService.findAll.mockResolvedValue(mockDishes);

      const response = await request(app)
        .get('/api/dishes')
        .expect(200);

      expect(response.body).toEqual(mockDishes);
      expect(DishService.findAll).toHaveBeenCalled();
    });

    it('deve retornar array vazio se não houver pratos', async () => {
      DishService.findAll.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/dishes')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('deve retornar 500 para erro interno', async () => {
      DishService.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/dishes')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Não foi possível carregar a lista de pratos',
        code: 'FETCH_ERROR'
      });
    });
  });

  describe('GET /api/dishes/:id', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';

    it('deve retornar um prato específico', async () => {
      const mockDish = { id: validUUID, name: 'Prato Teste', price: 25.00 };
      
      DishService.findOne.mockResolvedValue(mockDish);

      const response = await request(app)
        .get(`/api/dishes/${validUUID}`)
        .expect(200);

      expect(response.body).toEqual(mockDish);
      expect(DishService.findOne).toHaveBeenCalledWith(validUUID);
    });

    it('deve retornar 404 se prato não existir', async () => {
      DishService.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/dishes/${validUUID}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'O prato solicitado não foi encontrado',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/api/dishes/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Dados inválidos');
      expect(response.body).toHaveProperty('details');
    });

    it('deve retornar 500 para erro interno', async () => {
      DishService.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(`/api/dishes/${validUUID}`)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Não foi possível carregar o prato',
        code: 'FETCH_ERROR'
      });
    });
  });

  describe('PUT /api/dishes/:id', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const updateData = {
      name: 'Prato Atualizado',
      description: 'Descrição atualizada do prato com mais detalhes',
      price: 30.00
    };

    it('deve atualizar um prato existente', async () => {
      const mockUpdatedDish = { id: validUUID, ...updateData };
      
      DishService.update.mockResolvedValue(mockUpdatedDish);

      const response = await request(app)
        .put(`/api/dishes/${validUUID}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedDish);
      expect(DishService.update).toHaveBeenCalledWith(validUUID, updateData);
    });

    it('deve retornar 404 se prato não existir', async () => {
      DishService.update.mockRejectedValue(new Error('Prato não encontrado'));

      const response = await request(app)
        .put(`/api/dishes/${validUUID}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'Prato não encontrado',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 409 se nome já existir', async () => {
      DishService.update.mockRejectedValue(new Error('Prato já existe com este nome'));

      const response = await request(app)
        .put(`/api/dishes/${validUUID}`)
        .send(updateData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Prato já existe com este nome',
        code: 'DISH_ALREADY_EXISTS'
      });
    });

    it('deve retornar 400 para dados inválidos do service', async () => {
      DishService.update.mockRejectedValue(new Error('Dados inválidos: Preço deve ser maior que zero'));

      const response = await request(app)
        .put(`/api/dishes/${validUUID}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Dados inválidos: Preço deve ser maior que zero',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 400 para validação de middleware - ID inválido', async () => {
      const response = await request(app)
        .put('/api/dishes/invalid-id')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Dados inválidos');
      expect(response.body).toHaveProperty('details');
    });

    it('deve retornar 500 para erro interno', async () => {
      DishService.update.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .put(`/api/dishes/${validUUID}`)
        .send(updateData)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao atualizar o prato',
        code: 'INTERNAL_ERROR'
      });
    });
  });

  describe('DELETE /api/dishes/:id', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';

    it('deve excluir um prato existente', async () => {
      DishService.delete.mockResolvedValue();

      const response = await request(app)
        .delete(`/api/dishes/${validUUID}`)
        .expect(204);

      expect(response.body).toEqual({});
      expect(DishService.delete).toHaveBeenCalledWith(validUUID);
    });

    it('deve retornar 404 se prato não existir', async () => {
      DishService.delete.mockRejectedValue(new Error('Prato não encontrado'));

      const response = await request(app)
        .delete(`/api/dishes/${validUUID}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'Prato não encontrado',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 409 se prato tiver pedidos associados', async () => {
      DishService.delete.mockRejectedValue(new Error('Prato não pode ser deletado pois possui pedidos associados'));

      const response = await request(app)
        .delete(`/api/dishes/${validUUID}`)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Prato não pode ser deletado pois possui pedidos associados',
        code: 'DISH_HAS_ORDERS'
      });
    });

    it('deve retornar 400 para ID inválido', async () => {
      const response = await request(app)
        .delete('/api/dishes/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Dados inválidos');
      expect(response.body).toHaveProperty('details');
    });

    it('deve retornar 500 para erro interno', async () => {
      DishService.delete.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .delete(`/api/dishes/${validUUID}`)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao deletar o prato',
        code: 'INTERNAL_ERROR'
      });
    });
  });
});