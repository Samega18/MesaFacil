const { Router } = require('express');
const OrderController = require('./orders.controller');
const { validateSchema, validateUUID, createOrderSchema, updateOrderSchema, updateOrderStatusSchema } = require('../../middlewares/validation');
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         totalValue:
 *           type: number
 *           minimum: 0
 *         status:
 *           type: string
 *           enum: [RECEIVED, PREPARING, READY, DELIVERED]
 *         notes:
 *           type: string
 *           maxLength: 500
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dishId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/orders', validateSchema(createOrderSchema), OrderController.create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [RECEIVED, PREPARING, READY, DELIVERED]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/orders', OrderController.findAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/orders/:id', validateUUID(), OrderController.findOne);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Atualizar pedido
 *     tags: [Orders]
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
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/orders/:id', validateUUID(), validateSchema(updateOrderSchema), OrderController.update);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Orders]
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
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [RECEIVED, PREPARING, READY, DELIVERED]
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/orders/:id/status', validateUUID(), validateSchema(updateOrderStatusSchema), OrderController.updateStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Deletar pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Pedido deletado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/orders/:id', validateUUID(), OrderController.delete);

module.exports = router;