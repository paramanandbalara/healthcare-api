const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

// POST route to add a product to the cart
router.post('/cart/add', cartController.addToCart);

// PUT route to update the quantity of a product in the cart
router.put('/cart/update/:productId', cartController.updateCartProduct);

// DELETE route to remove a product from the cart
router.delete('/cart/remove/:productId', cartController.removeProductFromCart);

// GET route to fetch the user's cart
router.get('/cart', cartController.getUserCart);

// GET route to get the number of items in the cart
router.get('/cart/count', cartController.getCartItemCount);

module.exports = router;
