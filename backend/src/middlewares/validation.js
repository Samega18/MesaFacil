const { z } = require('zod');

// Schemas de validação para Dishes
const createDishSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição deve ter no máximo 500 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.enum(['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'DRINK'], {
    errorMap: () => ({ message: 'Categoria deve ser APPETIZER, MAIN_COURSE, DESSERT ou DRINK' })
  }),
  active: z.boolean().default(true),
  image: z.string().url('URL da imagem inválida').optional()
});

const updateDishSchema = createDishSchema.partial();

// Schemas de validação para Orders
const createOrderSchema = z.object({
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional().nullable(),
  status: z.enum(['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'], {
    errorMap: () => ({ message: 'Status deve ser RECEIVED, PREPARING, READY ou DELIVERED' })
  }).optional(),
  items: z.array(z.object({
    dishId: z.string().uuid('ID do prato deve ser um UUID válido'),
    quantity: z.number()
      .int('Quantidade deve ser um número inteiro')
      .positive('Quantidade deve ser um número positivo')
      .min(1, 'Quantidade deve ser pelo menos 1')
      .max(99, 'Quantidade não pode exceder 99 unidades')
  })).min(1, 'Pedido deve ter pelo menos um item').max(50, 'Pedido não pode ter mais de 50 itens diferentes')
});

const updateOrderSchema = z.object({
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional().nullable(),
  items: z.array(z.object({
    dishId: z.string().uuid('ID do prato deve ser um UUID válido'),
    quantity: z.number()
      .int('Quantidade deve ser um número inteiro')
      .positive('Quantidade deve ser um número positivo')
      .min(1, 'Quantidade deve ser pelo menos 1')
      .max(99, 'Quantidade não pode exceder 99 unidades')
  })).min(1, 'Pedido deve ter pelo menos um item').max(50, 'Pedido não pode ter mais de 50 itens diferentes').optional()
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'], {
    errorMap: () => ({ message: 'Status deve ser RECEIVED, PREPARING, READY ou DELIVERED' })
  })
});

// Middleware de validação genérico
const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: (error.issues || []).map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// Middleware para validar parâmetros UUID
const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    const uuidSchema = z.string().uuid(`${paramName} deve ser um UUID válido`);
    
    try {
      uuidSchema.parse(req.params[paramName]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Parâmetro inválido',
          details: (error.issues || []).map(err => ({
            field: paramName,
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

module.exports = {
  validateSchema,
  validateUUID,
  createDishSchema,
  updateDishSchema,
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema
};