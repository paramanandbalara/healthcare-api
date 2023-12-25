const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET route to fetch all products
router.get('/', productsController.getAllProducts);

// GET route to fetch a single product by ID
router.get('/:productId', productsController.getSingleProduct);

module.exports = router;
