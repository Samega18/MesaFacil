const express = require('express');
require('express-async-errors'); // Para capturar erros em rotas async
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurante API',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos de um restaurante',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/modules/**/*.routes.js'], // Caminho para os arquivos de rotas
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);

// Middleware para tratamento de erros
app.use((error, request, response, next) => {
  console.error('Error:', error.message);
  
  // Se o erro tem um status específico, usar esse status
  const status = error.status || error.statusCode || 500;
  
  // Retornar a mensagem de erro para o cliente
  response.status(status).json({
    error: error.message || 'Erro interno do servidor'
  });
});

module.exports = app;