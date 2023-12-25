const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// POST route to place an order
router.post('/place', ordersController.placeOrder);

// GET route to fetch all orders for a user
router.get('/user/:userId', ordersController.getUserOrders);

// GET route to fetch a single order by its ID
router.get('/:orderId', ordersController.getSingleOrder);

// PUT route to update an order
router.put('/update/:orderId', ordersController.updateOrder);

module.exports = router;
