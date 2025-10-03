const request = require('supertest');
const app = require('../app');
const OrderService = require('../modules/orders/orders.service');

// Mock do OrderService
jest.mock('../modules/orders/orders.service');

describe('OrderController Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    const validOrderData = {
      items: [
        {
          dishId: '550e8400-e29b-41d4-a716-446655440000',
          quantity: 2
        }
      ],
      notes: 'Sem cebola'
    };

    it('deve criar um pedido com dados válidos', async () => {
      const mockCreatedOrder = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        totalValue: 64.00,
        status: 'RECEIVED',
        notes: 'Sem cebola',
        items: [
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            dishId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 2,
            unitPrice: 32.00,
            subtotal: 64.00,
            dish: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'Hambúrguer Artesanal',
              price: 32.00,
              category: 'MAIN_COURSE'
            }
          }
        ]
      };
      
      OrderService.create.mockResolvedValue(mockCreatedOrder);

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Pedido criado com sucesso',
        data: mockCreatedOrder
      });
      expect(OrderService.create).toHaveBeenCalledWith(validOrderData);
    });

    it('deve retornar 400 para dados inválidos', async () => {
      const invalidData = {
        items: []
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 400 quando items não é fornecido', async () => {
      const invalidData = {
        notes: 'Sem cebola'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 404 quando prato não é encontrado', async () => {
      OrderService.create.mockRejectedValue(new Error('Pratos não encontrados ou inativos: 550e8400-e29b-41d4-a716-446655440000'));

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Recurso não encontrado',
        message: 'Pratos não encontrados ou inativos: 550e8400-e29b-41d4-a716-446655440000'
      });
    });

    it('deve retornar 500 para erro interno do servidor', async () => {
      OrderService.create.mockRejectedValue(new Error('Erro inesperado'));

      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao processar sua solicitação'
      });
    });
  });

  describe('GET /api/orders', () => {
    it('deve listar todos os pedidos', async () => {
      const mockOrders = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          totalValue: 64.00,
          status: 'RECEIVED',
          notes: null,
          items: []
        }
      ];

      OrderService.findAll.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockOrders,
        count: mockOrders.length
      });
      expect(OrderService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('deve filtrar pedidos por status', async () => {
      const mockOrders = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          totalValue: 64.00,
          status: 'PREPARING',
          notes: null,
          items: []
        }
      ];

      OrderService.findAll.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/orders?status=PREPARING')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockOrders,
        count: mockOrders.length
      });
      expect(OrderService.findAll).toHaveBeenCalledWith('PREPARING');
    });

    it('deve retornar 500 para erro interno', async () => {
      OrderService.findAll.mockRejectedValue(new Error('Erro inesperado'));

      const response = await request(app)
        .get('/api/orders')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar pedidos'
      });
    });
  });

  describe('GET /api/orders/:id', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve retornar um pedido por ID', async () => {
      const mockOrder = {
        id: validId,
        totalValue: 64.00,
        status: 'RECEIVED',
        notes: 'Sem cebola',
        createdAt: '2025-10-02T01:25:39.651Z',
        updatedAt: '2025-10-02T01:25:39.651Z',
        items: [
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 2,
            dish: {
              id: '550e8400-e29b-41d4-a716-446655440003',
              name: 'Hambúrguer Clássico',
              price: 32.00
            }
          }
        ]
      };

      OrderService.findOne.mockResolvedValue(mockOrder);

      const response = await request(app)
        .get(`/api/orders/${validId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockOrder);
      expect(OrderService.findOne).toHaveBeenCalledWith(validId);
    });

    it('deve retornar 404 quando pedido não for encontrado', async () => {
      OrderService.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/orders/${validId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Pedido não encontrado');
    });

    it('deve retornar 400 para ID inválido', async () => {
      const invalidId = 'invalid-id';

      // Não precisamos mockar o service aqui porque o middleware de validação
      // vai interceptar antes de chegar no controller
      const response = await request(app)
        .get(`/api/orders/${invalidId}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Parâmetro inválido');
    });

    it('deve retornar 500 para erro interno', async () => {
      OrderService.findOne.mockRejectedValue(new Error('Erro interno'));

      const response = await request(app)
        .get(`/api/orders/${validId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Erro interno do servidor');
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve atualizar o status de um pedido', async () => {
      const updatedOrder = { 
        id: validId, 
        status: 'PREPARING',
        totalValue: 25.50,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: []
      };
      
      OrderService.updateStatus.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('PREPARING');
      expect(OrderService.updateStatus).toHaveBeenCalledWith(validId, 'PREPARING');
    });

    it('deve retornar 404 quando pedido não for encontrado', async () => {
      OrderService.updateStatus.mockResolvedValue(null);

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Pedido não encontrado');
    });

    it('deve retornar 400 para status inválido', async () => {
      // Não precisamos mockar o service aqui porque o middleware de validação
      // vai interceptar antes de chegar no controller
      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('deve retornar 400 para ID inválido', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app)
        .patch(`/api/orders/${invalidId}/status`)
        .send({ status: 'PREPARING' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Parâmetro inválido');
    });

    it('deve retornar 500 para erro interno', async () => {
      OrderService.updateStatus.mockRejectedValue(new Error('Erro interno'));

      const response = await request(app)
        .patch(`/api/orders/${validId}/status`)
        .send({ status: 'PREPARING' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Erro interno do servidor');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440001';

    it('deve excluir um pedido', async () => {
      OrderService.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/api/orders/${validId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Pedido excluído com sucesso');
      expect(OrderService.delete).toHaveBeenCalledWith(validId);
    });

    it('deve retornar 404 quando pedido não for encontrado', async () => {
      OrderService.delete.mockResolvedValue(false);

      const response = await request(app)
        .delete(`/api/orders/${validId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Pedido não encontrado');
    });

    it('deve retornar 400 para ID inválido', async () => {
      const invalidId = 'invalid-id';

      // Não precisamos mockar o service aqui porque o middleware de validação
      // vai interceptar antes de chegar no controller
      const response = await request(app)
        .delete(`/api/orders/${invalidId}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Parâmetro inválido');
    });

    it('deve retornar 500 para erro interno', async () => {
      OrderService.delete.mockRejectedValue(new Error('Erro interno'));

      const response = await request(app)
        .delete(`/api/orders/${validId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Erro interno do servidor');
    });
  });
});