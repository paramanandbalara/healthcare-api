'use strict';

const { Router } = require('express');
const router = Router();
const { validateRequest } = require('../../../middelware');
const {
    registrationValidations: { registrationSchema, registrationVerifySchema }
} = require('../../validations');

router.post('/registration', validateRequest(registrationSchema), userRegistration);

router.post('/registration/verify', validateRequest(registrationVerifySchema), userRegistrationVerify);


async function userRegistration(req, res, next) {
    try { } catch (err) {
        next(err);
    }
}

async function userRegistrationVerify(req, res, next) {
    try { } catch (err) {
        next(err);
    }
}

module.exports = router;
