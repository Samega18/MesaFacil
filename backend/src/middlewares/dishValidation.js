const { body, param, validationResult } = require('express-validator');

// Validações para criação de pratos
const createDishValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Preço deve ser um número positivo maior que 0')
    .toFloat(),
  
  body('category')
    .isIn(['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'DRINK'])
    .withMessage('Categoria deve ser: APPETIZER, MAIN_COURSE, DESSERT ou DRINK'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active deve ser um valor booleano')
    .toBoolean(),
  
  body('image')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Permite valores vazios
      }
      // Se não for vazio, deve ser uma URL válida
      const urlRegex = /^https?:\/\/.+/;
      return urlRegex.test(value);
    })
    .withMessage('Image deve ser uma URL válida ou vazio')
    .trim()
];

// Validações para atualização de pratos
const updateDishValidation = [
  param('id')
    .isUUID()
    .withMessage('ID deve ser um UUID válido'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Preço deve ser um número positivo maior que 0')
    .toFloat(),
  
  body('category')
    .optional()
    .isIn(['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'DRINK'])
    .withMessage('Categoria deve ser: APPETIZER, MAIN_COURSE, DESSERT ou DRINK'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active deve ser um valor booleano')
    .toBoolean(),
  
  body('image')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Permite valores vazios
      }
      // Se não for vazio, deve ser uma URL válida
      const urlRegex = /^https?:\/\/.+/;
      return urlRegex.test(value);
    })
    .withMessage('Image deve ser uma URL válida ou vazio')
    .trim()
];

// Validação para parâmetros de ID
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID deve ser um UUID válido')
];

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: 'Dados inválidos',
      details: formattedErrors
    });
  }
  
  next();
};

module.exports = {
  createDishValidation,
  updateDishValidation,
  idValidation,
  handleValidationErrors
};