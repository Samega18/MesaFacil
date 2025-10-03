const request = require('supertest');
const app = require('../app');
const OrderService = require('../modules/orders/orders.service');

// Mock do OrderService
jest.mock('../modules/orders/orders.service');

describe('OrderController Additional Tests - Coverage Improvement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders - Additional Error Scenarios', () => {
    const validOrderData = {
      items: [
        {
          dishId: '550e8400-e29b-41d4-a716-446655440000',
          quantity: 2
        }
      ],
      notes: 'Sem cebola'
    };

    it('deve retornar 400 para erro de validação - campo obrigatório', async () => {
      OrderService.create.mockRejectedValue(new Error('Campo obrigatório não fornecido'));

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Campo obrigatório não fornecido'
      });
    });

    it('deve retornar 400 para erro de validação - valor não válido', async () => {
      OrderService.create.mockRejectedValue(new Error('Valor não válido fornecido'));

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Valor não válido fornecido'
      });
    });

    it('deve retornar 400 para erro de quantidade inválida', async () => {
      OrderService.create.mockRejectedValue(new Error('Quantidade deve ser um inteiro maior que zero'));

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Quantidade deve ser um inteiro maior que zero'
      });
    });

    it('deve retornar 409 para erro de duplicação', async () => {
      OrderService.create.mockRejectedValue(new Error('Erro de duplicação de dados'));

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        error: 'Conflito de dados',
        message: 'Erro de duplicação de dados'
      });
    });
  });

  describe('PUT /api/orders/:id - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';
    const updateData = {
      notes: 'Observações atualizadas'
    };

    it('deve retornar 404 quando service retorna null', async () => {
      OrderService.update.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/orders/${validId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: `Pedido com ID ${validId} não foi encontrado`
      });
    });

    it('deve retornar 404 para erro "not found" do service', async () => {
      OrderService.update.mockRejectedValue(new Error('Order not found'));

      const response = await request(app)
        .put(`/api/orders/${validId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: 'Order not found'
      });
    });

    it('deve retornar 404 para erro "não encontrado" do service', async () => {
      OrderService.update.mockRejectedValue(new Error('Pedido não encontrado no banco'));

      const response = await request(app)
        .put(`/api/orders/${validId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: 'Pedido não encontrado no banco'
      });
    });

    it('deve retornar 500 para outros erros', async () => {
      OrderService.update.mockRejectedValue(new Error('Erro de conexão com banco'));

      const response = await request(app)
        .put(`/api/orders/${validId}`)
        .send(updateData)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao atualizar pedido'
      });
    });
  });

  describe('PATCH /api/orders/:id/status - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve retornar 404 quando service retorna null', async () => {
      OrderService.updateStatus.mockResolvedValue(null);

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: `Pedido com ID ${validId} não foi encontrado`
      });
    });

    it('deve retornar 404 para erro "not found" do service', async () => {
      OrderService.updateStatus.mockRejectedValue(new Error('Order not found'));

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: 'Order not found'
      });
    });

    it('deve retornar 404 para erro "não encontrado" do service', async () => {
      OrderService.updateStatus.mockRejectedValue(new Error('Pedido não encontrado'));

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: 'Pedido não encontrado'
      });
    });

    it('deve retornar 400 para status inválido - "invalid"', async () => {
      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        details: [
          {
            field: 'status',
            message: 'Invalid option: expected one of "RECEIVED"|"PREPARING"|"READY"|"DELIVERED"'
          }
        ]
      });
    });

    it('deve retornar 400 para status inválido - "inválido"', async () => {
      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Dados inválidos',
        details: [
          {
            field: 'status',
            message: 'Invalid option: expected one of "RECEIVED"|"PREPARING"|"READY"|"DELIVERED"'
          }
        ]
      });
    });
  });

  describe('DELETE /api/orders/:id - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve retornar 404 para erro "not found" do service', async () => {
      OrderService.delete.mockRejectedValue(new Error('Order not found'));

      const response = await request(app)
        .delete(`/api/orders/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: 'Order not found'
      });
    });

    it('deve retornar 404 para erro "não encontrado" do service', async () => {
      OrderService.delete.mockRejectedValue(new Error('Pedido não encontrado'));

      const response = await request(app)
        .delete(`/api/orders/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: 'Pedido não encontrado'
      });
    });
  });

  describe('GET /api/orders/:id - Additional Error Scenarios', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve retornar 404 quando service retorna null', async () => {
      OrderService.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/orders/${validId}`)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Pedido não encontrado',
        message: `Pedido com ID ${validId} não foi encontrado`
      });
    });

    it('deve retornar 500 para erro interno do service', async () => {
      OrderService.findOne.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .get(`/api/orders/${validId}`)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar pedido'
      });
    });
  });

  describe('Success Cases - Complete Coverage', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve atualizar pedido com sucesso', async () => {
      const updateData = { notes: 'Observações atualizadas' };
      const mockUpdatedOrder = {
        id: validId,
        notes: 'Observações atualizadas',
        totalValue: 64.00,
        status: 'RECEIVED'
      };

      OrderService.update.mockResolvedValue(mockUpdatedOrder);

      const response = await request(app)
        .put(`/api/orders/${validId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Pedido atualizado com sucesso',
        data: mockUpdatedOrder
      });
    });

    it('deve atualizar status com sucesso', async () => {
      const mockUpdatedOrder = {
        id: validId,
        status: 'PREPARING',
        totalValue: 64.00
      };

      OrderService.updateStatus.mockResolvedValue(mockUpdatedOrder);

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Status do pedido atualizado com sucesso',
        data: mockUpdatedOrder
      });
    });

    it('deve buscar pedido por ID com sucesso', async () => {
      const mockOrder = {
        id: validId,
        totalValue: 64.00,
        status: 'RECEIVED',
        notes: 'Sem cebola'
      };

      OrderService.findOne.mockResolvedValue(mockOrder);

      const response = await request(app)
        .get(`/api/orders/${validId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockOrder
      });
    });
  });
});