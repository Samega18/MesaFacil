const { Router } = require('express');
const dishesRoutes = require('../modules/dishes/dishes.routes');
const ordersRoutes = require('../modules/orders/orders.routes');

const router = Router();

router.use('/api', dishesRoutes);
router.use('/api', ordersRoutes);

module.exports = router;