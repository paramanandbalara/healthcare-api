'use strict';

const { Router } = require('express');
const router = Router();
const { validateRequest } = require('../../../middelware');

router.get('/', validateRequest(), consultancyType);

async function consultancyType(req, res, next) {
    try { } catch (err) {
        next(err);
    }
}


module.exports = router;