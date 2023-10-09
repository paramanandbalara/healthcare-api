'use strict';

const { Router } = require('express');
const router = Router();
const { validateRequest } = require('../../../middelware');

router.get('/', validateRequest(), booking);

async function booking(req, res, next) {
    try {
    } catch (err) {
        next(err);
    }
}



module.exports = router;
