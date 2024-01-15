'use strict';
const express = require('express');
const router = express.Router();
const users = require('./user');
const auth = require('./auth')
const cart = require('./cart');
// const booking = require('./booking');
const orders = require('./orders');
const products = require('./products');
const rating_reviews = require('./rating_reviews');

router.use(auth);
router.use(users);
router.use(cart);
router.use(orders);
router.use(products);
router.use(rating_reviews);

module.exports = router;