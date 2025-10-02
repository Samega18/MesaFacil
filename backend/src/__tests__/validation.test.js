const { validateSchema, validateUUID, createDishSchema, updateDishSchema, createOrderSchema, updateOrderSchema, updateOrderStatusSchema } = require('../middlewares/validation');

describe('Validation Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateSchema', () => {
    it('deve validar dados corretos e chamar next()', () => {
      req.body = {
        name: 'Hambúrguer',
        description: 'Delicioso hambúrguer',
        price: 25.90,
        category: 'MAIN_COURSE',
        active: true
      };

      const middleware = validateSchema(createDishSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para dados inválidos com detalhes do erro', () => {
      req.body = {
        name: '',
        description: 'Descrição',
        price: -10,
        category: 'INVALID_CATEGORY'
      };

      const middleware = validateSchema(createDishSchema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Dados inválidos',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String)
          }),
          expect.objectContaining({
            field: 'price',
            message: expect.any(String)
          }),
          expect.objectContaining({
            field: 'category',
            message: expect.any(String)
          })
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) para erros não relacionados ao Zod', () => {
      const mockError = new Error('Erro não relacionado ao Zod');
      const mockSchema = {
        parse: jest.fn().mockImplementation(() => {
          throw mockError;
        })
      };

      const middleware = validateSchema(mockSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('validateUUID', () => {
    it('deve validar UUID correto e chamar next()', () => {
      req.params.id = '550e8400-e29b-41d4-a716-446655440000';

      const middleware = validateUUID('id');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para UUID inválido', () => {
      req.params.id = 'invalid-uuid';

      const middleware = validateUUID('id');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Parâmetro inválido',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'id',
            message: expect.any(String)
          })
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve usar parâmetro padrão "id" quando não especificado', () => {
      req.params.id = 'invalid-uuid';

      const middleware = validateUUID();
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Parâmetro inválido',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'id',
            message: expect.any(String)
          })
        ])
      });
    });

    it('deve validar parâmetro customizado', () => {
      req.params.dishId = 'invalid-uuid';

      const middleware = validateUUID('dishId');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Parâmetro inválido',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'dishId',
            message: expect.any(String)
          })
        ])
      });
    });
  });

  describe('createDishSchema', () => {
    it('deve validar prato com todos os campos obrigatórios', () => {
      const validDish = {
        name: 'Pizza Margherita',
        description: 'Pizza tradicional italiana',
        price: 35.90,
        category: 'MAIN_COURSE',
        active: true,
        image: 'https://example.com/pizza.jpg'
      };

      expect(() => createDishSchema.parse(validDish)).not.toThrow();
    });

    it('deve aplicar valor padrão para active', () => {
      const dish = {
        name: 'Pizza',
        description: 'Descrição',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const result = createDishSchema.parse(dish);
      expect(result.active).toBe(true);
    });

    it('deve rejeitar nome vazio', () => {
      expect(() => createDishSchema.parse({ name: '', description: 'Descrição', price: 10, category: 'MAIN_COURSE' }))
        .toThrow();
    });

    it('deve rejeitar preço negativo', () => {
      expect(() => createDishSchema.parse({ name: 'Nome', description: 'Descrição', price: -10, category: 'MAIN_COURSE' }))
        .toThrow();
    });

    it('deve rejeitar categoria inválida', () => {
      expect(() => createDishSchema.parse({ name: 'Nome', description: 'Descrição', price: 10, category: 'INVALID' }))
        .toThrow();
    });

    it('deve validar URL da imagem quando fornecida', () => {
      const dish = {
        name: 'Pizza',
        description: 'Descrição',
        price: 25.90,
        category: 'MAIN_COURSE',
        image: 'invalid-url'
      };

      expect(() => createDishSchema.parse(dish)).toThrow();
    });

    it('deve aceitar imagem como opcional', () => {
      const dish = {
        name: 'Pizza',
        description: 'Descrição',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      expect(() => createDishSchema.parse(dish)).not.toThrow();
    });
  });

  describe('createOrderSchema', () => {
    it('deve validar pedido com dados corretos', () => {
      const validOrder = {
        notes: 'Sem cebola',
        status: 'RECEIVED',
        items: [
          {
            dishId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 2
          }
        ]
      };

      expect(() => createOrderSchema.parse(validOrder)).not.toThrow();
    });

    it('deve rejeitar pedido sem itens', () => {
      const order = {
        notes: 'Teste',
        items: []
      };

      expect(() => createOrderSchema.parse(order)).toThrow();
    });

    it('deve rejeitar pedido com mais de 50 itens', () => {
      const items = Array(51).fill().map((_, i) => ({
        dishId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 1
      }));

      const order = { items };

      expect(() => createOrderSchema.parse(order)).toThrow();
    });

    it('deve rejeitar quantidade inválida', () => {
      const order = {
        items: [
          {
            dishId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 0
          }
        ]
      };

      expect(() => createOrderSchema.parse(order)).toThrow('Quantidade deve ser pelo menos 1');
    });

    it('deve rejeitar quantidade maior que 99', () => {
      const order = {
        items: [
          {
            dishId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 100
          }
        ]
      };

      expect(() => createOrderSchema.parse(order)).toThrow('Quantidade não pode exceder 99 unidades');
    });

    it('deve aceitar notes como null', () => {
      const order = {
        notes: null,
        items: [
          {
            dishId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 1
          }
        ]
      };

      expect(() => createOrderSchema.parse(order)).not.toThrow();
    });
  });

  describe('updateOrderStatusSchema', () => {
    it('deve validar status válido', () => {
      const validStatuses = ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'];

      validStatuses.forEach(status => {
        expect(() => updateOrderStatusSchema.parse({ status })).not.toThrow();
      });
    });

    it('deve rejeitar status inválido', () => {
      expect(() => updateOrderStatusSchema.parse({ status: 'INVALID_STATUS' }))
        .toThrow();
    });
  });

  describe('updateDishSchema', () => {
    it('deve aceitar campos parciais', () => {
      const partialUpdate = {
        name: 'Novo nome'
      };

      expect(() => updateDishSchema.parse(partialUpdate)).not.toThrow();
    });

    it('deve validar campos fornecidos', () => {
      const invalidUpdate = {
        price: -10
      };

      expect(() => updateDishSchema.parse(invalidUpdate)).toThrow('Preço deve ser positivo');
    });
  });

  describe('updateOrderSchema', () => {
    it('deve aceitar apenas notes', () => {
      const update = {
        notes: 'Observação atualizada'
      };

      expect(() => updateOrderSchema.parse(update)).not.toThrow();
    });

    it('deve aceitar apenas items', () => {
      const update = {
        items: [
          {
            dishId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 3
          }
        ]
      };

      expect(() => updateOrderSchema.parse(update)).not.toThrow();
    });

    it('deve aceitar objeto vazio', () => {
      expect(() => updateOrderSchema.parse({})).not.toThrow();
    });

    it('deve rejeitar itens com dishId inválido', () => {
      const order = {
        items: [{ dishId: 'invalid-uuid', quantity: 1 }]
      };

      expect(() => createOrderSchema.parse(order))
        .toThrow();
    });
  });
});