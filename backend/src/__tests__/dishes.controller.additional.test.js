const request = require('supertest');
const app = require('../app');
const DishService = require('../modules/dishes/dishes.service');

// Mock do DishService
jest.mock('../modules/dishes/dishes.service');

describe('DishController Additional Tests - Coverage Improvement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/dishes - Additional Error Scenarios', () => {
    const validDishData = {
      name: 'Hambúrguer Artesanal',
      description: 'Delicioso hambúrguer com ingredientes frescos',
      price: 32.00,
      category: 'MAIN_COURSE',
      active: true,
      image: 'https://example.com/burger.jpg'
    };

    it('deve retornar 409 para prato que já existe - "already exists"', async () => {
      DishService.create.mockRejectedValue(new Error('Dish already exists'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Dish already exists',
        code: 'DISH_ALREADY_EXISTS'
      });
    });

    it('deve retornar 409 para prato que já existe - "já existe"', async () => {
      DishService.create.mockRejectedValue(new Error('Prato já existe'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Prato já existe',
        code: 'DISH_ALREADY_EXISTS'
      });
    });

    it('deve retornar 409 para prato que já existe - "Já existe"', async () => {
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

    it('deve retornar 400 para dados inválidos - "invalid"', async () => {
      DishService.create.mockRejectedValue(new Error('Data is invalid'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Data is invalid',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 400 para dados inválidos - "inválido"', async () => {
      DishService.create.mockRejectedValue(new Error('Preço inválido fornecido'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Preço inválido fornecido',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 400 para dados inválidos - "Dados inválidos"', async () => {
      DishService.create.mockRejectedValue(new Error('Dados inválidos fornecidos'));

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Dados inválidos fornecidos',
        code: 'VALIDATION_ERROR'
      });
    });
  });

  describe('GET /api/dishes - Additional Error Scenarios', () => {
    it('deve retornar 500 para erro interno do service', async () => {
      DishService.findAll.mockRejectedValue(new Error('Database connection error'));

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

  describe('GET /api/dishes/:id - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';

    it('deve retornar 404 quando prato não é encontrado', async () => {
      DishService.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/dishes/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'O prato solicitado não foi encontrado',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 500 para erro interno do service', async () => {
      DishService.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(`/api/dishes/${validId}`)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Não foi possível carregar o prato',
        code: 'FETCH_ERROR'
      });
    });

    it('deve retornar prato quando encontrado', async () => {
      const mockDish = {
        id: validId,
        name: 'Hambúrguer Artesanal',
        description: 'Delicioso hambúrguer',
        price: 32.00,
        category: 'MAIN_COURSE',
        active: true
      };

      DishService.findOne.mockResolvedValue(mockDish);

      const response = await request(app)
        .get(`/api/dishes/${validId}`)
        .expect(200);

      expect(response.body).toEqual(mockDish);
    });
  });

  describe('PUT /api/dishes/:id - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const updateData = {
      name: 'Hambúrguer Atualizado',
      price: 35.00
    };

    it('deve retornar 404 para prato não encontrado - "not found"', async () => {
      DishService.update.mockRejectedValue(new Error('Dish not found'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'Dish not found',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 404 para prato não encontrado - "não encontrado"', async () => {
      DishService.update.mockRejectedValue(new Error('Prato não encontrado'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'Prato não encontrado',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 409 para conflito - "already exists"', async () => {
      DishService.update.mockRejectedValue(new Error('Dish already exists'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Dish already exists',
        code: 'DISH_ALREADY_EXISTS'
      });
    });

    it('deve retornar 409 para conflito - "já existe"', async () => {
      DishService.update.mockRejectedValue(new Error('Prato já existe'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Prato já existe',
        code: 'DISH_ALREADY_EXISTS'
      });
    });

    it('deve retornar 400 para dados inválidos - "invalid"', async () => {
      DishService.update.mockRejectedValue(new Error('Price is invalid'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Price is invalid',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 400 para dados inválidos - "inválido"', async () => {
      DishService.update.mockRejectedValue(new Error('Preço inválido'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Preço inválido',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 400 para dados inválidos - "Dados inválidos"', async () => {
      DishService.update.mockRejectedValue(new Error('Dados inválidos fornecidos'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        message: 'Dados inválidos fornecidos',
        code: 'VALIDATION_ERROR'
      });
    });

    it('deve retornar 500 para outros erros', async () => {
      DishService.update.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao atualizar o prato',
        code: 'INTERNAL_ERROR'
      });
    });

    it('deve atualizar prato com sucesso', async () => {
      const mockUpdatedDish = {
        id: validId,
        name: 'Hambúrguer Atualizado',
        price: 35.00,
        category: 'MAIN_COURSE',
        active: true
      };

      DishService.update.mockResolvedValue(mockUpdatedDish);

      const response = await request(app)
        .put(`/api/dishes/${validId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedDish);
    });
  });

  describe('DELETE /api/dishes/:id - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000';

    it('deve retornar 404 para prato não encontrado - "not found"', async () => {
      DishService.delete.mockRejectedValue(new Error('Dish not found'));

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'Dish not found',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 404 para prato não encontrado - "não encontrado"', async () => {
      DishService.delete.mockRejectedValue(new Error('Prato não encontrado'));

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Prato não encontrado',
        message: 'Prato não encontrado',
        code: 'DISH_NOT_FOUND'
      });
    });

    it('deve retornar 409 para prato com pedidos - "cannot be deleted"', async () => {
      DishService.delete.mockRejectedValue(new Error('Dish cannot be deleted'));

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Dish cannot be deleted',
        code: 'DISH_HAS_ORDERS'
      });
    });

    it('deve retornar 409 para prato com pedidos - "não pode ser deletado"', async () => {
      DishService.delete.mockRejectedValue(new Error('Prato não pode ser deletado'));

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Prato não pode ser deletado',
        code: 'DISH_HAS_ORDERS'
      });
    });

    it('deve retornar 409 para prato com pedidos - "pedidos associados"', async () => {
      DishService.delete.mockRejectedValue(new Error('Existem pedidos associados a este prato'));

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(409);

      expect(response.body).toEqual({
        error: 'Conflito',
        message: 'Existem pedidos associados a este prato',
        code: 'DISH_HAS_ORDERS'
      });
    });

    it('deve retornar 500 para outros erros', async () => {
      DishService.delete.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao deletar o prato',
        code: 'INTERNAL_ERROR'
      });
    });

    it('deve deletar prato com sucesso', async () => {
      DishService.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/api/dishes/${validId}`)
        .expect(204);

      expect(response.body).toEqual({});
    });
  });

  describe('Success Cases - Complete Coverage', () => {
    it('deve criar prato com sucesso', async () => {
      const validDishData = {
        name: 'Hambúrguer Artesanal',
        description: 'Delicioso hambúrguer',
        price: 32.00,
        category: 'MAIN_COURSE',
        active: true
      };

      const mockCreatedDish = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...validDishData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      };

      DishService.create.mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...validDishData,
        createdAt: '2025-10-02T19:38:23.498Z',
        updatedAt: '2025-10-02T19:38:23.498Z'
      });

      const response = await request(app)
        .post('/api/dishes')
        .send(validDishData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: validDishData.name,
        description: validDishData.description,
        price: validDishData.price,
        category: validDishData.category,
        active: validDishData.active
      });
    });

    it('deve listar pratos com sucesso', async () => {
      const mockDishes = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Hambúrguer',
          price: 32.00,
          category: 'MAIN_COURSE',
          active: true
        }
      ];

      DishService.findAll.mockResolvedValue(mockDishes);

      const response = await request(app)
        .get('/api/dishes')
        .expect(200);

      expect(response.body).toEqual(mockDishes);
    });
  });
});