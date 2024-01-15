const express = require('express');
const router = express.Router();
const ordersController = require('../controller/ordersController');

// POST route to place an order
router.post('/order/place', ordersController.placeOrder);

// GET route to fetch all orders for a user
router.get('/order/user/:userId', ordersController.getUserOrders);

// GET route to fetch a single order by its ID
router.get('/order/:orderId', ordersController.getSingleOrder);

// PUT route to update an order
router.put('/order/update/:orderId', ordersController.updateOrder);

module.exports = router;
