const express = require('express');
const router = express.Router();
const ordersController = require('../controller/ordersController');

// Order routes
router.post('/order/create', ordersController.createOrder);
router.get('/order/history', ordersController.getOrderHistory);
router.get('/admin/orders', ordersController.getAllOrderHistory);
router.post('/admin/order/status', ordersController.updateStatus);
router.get('/order/details', ordersController.getOrderDetails);
router.get('/order/purchased', ordersController.getPurchaseDetails);

module.exports = router;
