const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// POST route to add a product to the cart
router.post('/add', cartController.addToCart);

// PUT route to update the quantity of a product in the cart
router.put('/update/:productId', cartController.updateCartProduct);

// DELETE route to remove a product from the cart
router.delete('/remove/:productId', cartController.removeProductFromCart);

// GET route to fetch the user's cart
router.get('/', cartController.getUserCart);

// GET route to get the number of items in the cart
router.get('/count', cartController.getCartItemCount);

module.exports = router;
