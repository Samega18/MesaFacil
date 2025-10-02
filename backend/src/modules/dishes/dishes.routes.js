const { Router } = require('express');
const DishController = require('./dishes.controller');
const { 
  createDishValidation, 
  updateDishValidation, 
  idValidation, 
  handleValidationErrors 
} = require('../../middlewares/dishValidation');
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 500
 *         price:
 *           type: number
 *           minimum: 0
 *         category:
 *           type: string
 *           enum: [APPETIZER, MAIN_COURSE, DESSERT, DRINK]
 *         active:
 *           type: boolean
 *         image:
 *           type: string
 *           format: uri
 */

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     summary: Criar um novo prato
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       201:
 *         description: Prato criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Prato já existe
 */
router.post('/dishes', createDishValidation, handleValidationErrors, DishController.create);

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Listar todos os pratos
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: Lista de pratos
 */
router.get('/dishes', DishController.findAll);

// Rota removida - filtros são feitos no frontend

/**
 * @swagger
 * /api/dishes/{id}:
 *   get:
 *     summary: Buscar prato por ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Prato encontrado
 *       404:
 *         description: Prato não encontrado
 */
router.get('/dishes/:id', idValidation, handleValidationErrors, DishController.findOne);

/**
 * @swagger
 * /api/dishes/{id}:
 *   put:
 *     summary: Atualizar prato
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Prato atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Prato não encontrado
 *       409:
 *         description: Nome já existe
 */
router.put('/dishes/:id', updateDishValidation, handleValidationErrors, DishController.update);

/**
 * @swagger
 * /api/dishes/{id}:
 *   delete:
 *     summary: Deletar prato
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Prato deletado
 *       404:
 *         description: Prato não encontrado
 *       409:
 *         description: Prato não pode ser deletado (tem pedidos associados)
 */
router.delete('/dishes/:id', idValidation, handleValidationErrors, DishController.delete);

module.exports = router;