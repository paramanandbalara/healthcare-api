'use strict';
const express = require('express');
const router = express.Router();
const ratingsAndReviewsController = require('../controller/ratingsAndReviewsController');


router.get('/rating/:id', ratingsAndReviewsController.getRatingByProduct);
router.get('/reviews/:id', ratingsAndReviewsController.getReviewsByProduct);
router.post('/reviews/add', ratingsAndReviewsController.addReviewsByProduct);

module.exports = router;