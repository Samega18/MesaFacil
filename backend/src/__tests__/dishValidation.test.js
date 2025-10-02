const request = require('supertest');
const express = require('express');
const { createDishValidation, updateDishValidation, idValidation, handleValidationErrors } = require('../middlewares/dishValidation');

// Criar app de teste
const createTestApp = (validations) => {
  const app = express();
  app.use(express.json());
  
  app.post('/test', validations, handleValidationErrors, (req, res) => {
    res.status(200).json({ success: true, data: req.body });
  });
  
  app.put('/test/:id', validations, handleValidationErrors, (req, res) => {
    res.status(200).json({ success: true, data: req.body, id: req.params.id });
  });
  
  app.get('/test/:id', validations, handleValidationErrors, (req, res) => {
    res.status(200).json({ success: true, id: req.params.id });
  });
  
  return app;
};

describe('DishValidation Middleware Tests', () => {
  describe('createDishValidation', () => {
    const app = createTestApp(createDishValidation);

    it('deve aceitar dados válidos', async () => {
      const validData = {
        name: 'Pizza Margherita',
        description: 'Pizza tradicional italiana com molho de tomate e manjericão',
        price: 35.90,
        category: 'MAIN_COURSE',
        active: true,
        image: 'https://example.com/pizza.jpg'
      };

      const response = await request(app)
        .post('/test')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(validData);
    });

    it('deve rejeitar nome vazio', async () => {
      const invalidData = {
        name: '',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Dados inválidos');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: 'Nome é obrigatório'
        })
      );
    });

    it('deve rejeitar nome muito curto', async () => {
      const invalidData = {
        name: 'A',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: 'Nome deve ter entre 2 e 100 caracteres'
        })
      );
    });

    it('deve rejeitar nome muito longo', async () => {
      const invalidData = {
        name: 'A'.repeat(101),
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: 'Nome deve ter entre 2 e 100 caracteres'
        })
      );
    });

    it('deve rejeitar descrição muito curta', async () => {
      const invalidData = {
        name: 'Pizza',
        description: 'Curta',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: 'Descrição deve ter entre 10 e 500 caracteres'
        })
      );
    });

    it('deve rejeitar descrição muito longa', async () => {
      const invalidData = {
        name: 'Pizza',
        description: 'A'.repeat(501),
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: 'Descrição deve ter entre 10 e 500 caracteres'
        })
      );
    });

    it('deve rejeitar preço zero ou negativo', async () => {
      const invalidData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 0,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'price',
          message: 'Preço deve ser um número positivo maior que 0'
        })
      );
    });

    it('deve rejeitar categoria inválida', async () => {
      const invalidData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'INVALID_CATEGORY'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'category',
          message: 'Categoria deve ser: APPETIZER, MAIN_COURSE, DESSERT ou DRINK'
        })
      );
    });

    it('deve aceitar active como opcional', async () => {
      const validData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE'
      };

      const response = await request(app)
        .post('/test')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('deve rejeitar active não booleano', async () => {
      const invalidData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE',
        active: 'not_boolean'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'active',
          message: 'Active deve ser um valor booleano'
        })
      );
    });

    it('deve aceitar image vazia', async () => {
      const validData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE',
        image: ''
      };

      const response = await request(app)
        .post('/test')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('deve aceitar image null', async () => {
      const validData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE',
        image: null
      };

      const response = await request(app)
        .post('/test')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('deve rejeitar URL de imagem inválida', async () => {
      const invalidData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE',
        image: 'invalid-url'
      };

      const response = await request(app)
        .post('/test')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'image',
          message: 'Image deve ser uma URL válida ou vazio'
        })
      );
    });

    it('deve aceitar URL de imagem válida', async () => {
      const validData = {
        name: 'Pizza',
        description: 'Descrição válida com mais de 10 caracteres',
        price: 25.90,
        category: 'MAIN_COURSE',
        image: 'https://example.com/image.jpg'
      };

      const response = await request(app)
        .post('/test')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('updateDishValidation', () => {
    const app = createTestApp(updateDishValidation);

    it('deve aceitar atualização parcial válida', async () => {
      const validData = {
        name: 'Novo Nome'
      };

      const response = await request(app)
        .put('/test/550e8400-e29b-41d4-a716-446655440000')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Novo Nome');
    });

    it('deve rejeitar ID inválido', async () => {
      const response = await request(app)
        .put('/test/invalid-uuid')
        .send({ name: 'Novo Nome' })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'id',
          message: 'ID deve ser um UUID válido'
        })
      );
    });

    it('deve aceitar objeto vazio', async () => {
      const response = await request(app)
        .put('/test/550e8400-e29b-41d4-a716-446655440000')
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('deve validar campos fornecidos', async () => {
      const invalidData = {
        price: -10
      };

      const response = await request(app)
        .put('/test/550e8400-e29b-41d4-a716-446655440000')
        .send(invalidData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'price',
          message: 'Preço deve ser um número positivo maior que 0'
        })
      );
    });
  });

  describe('idValidation', () => {
    const app = createTestApp(idValidation);

    it('deve aceitar UUID válido', async () => {
      const response = await request(app)
        .get('/test/550e8400-e29b-41d4-a716-446655440000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('deve rejeitar UUID inválido', async () => {
      const response = await request(app)
        .get('/test/invalid-uuid')
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'id',
          message: 'ID deve ser um UUID válido'
        })
      );
    });
  });

  describe('handleValidationErrors', () => {
    it('deve formatar erros corretamente', async () => {
      const app = createTestApp(createDishValidation);

      const response = await request(app)
        .post('/test')
        .send({
          name: '',
          description: 'Curta',
          price: -10,
          category: 'INVALID'
        })
        .expect(400);

      expect(response.body.error).toBe('Dados inválidos');
      expect(response.body.details).toBeInstanceOf(Array);
      expect(response.body.details.length).toBeGreaterThan(0);
      
      response.body.details.forEach(detail => {
        expect(detail).toHaveProperty('field');
        expect(detail).toHaveProperty('message');
        expect(detail).toHaveProperty('value');
      });
    });
  });
});