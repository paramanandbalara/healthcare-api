'use strict';

const yup = require('yup');

const registrationSchema = yup.object({
    body: yup.object({
        name: yup.string().required('Please your enter name'),
        email: yup.string().email().required('Please your enter email'),
        contact: yup
            .number()
            .integer()
            .positive()
            .required('Please enter your contact no.')
    })
});

const registrationVerifySchema = yup.object({
    body: yup.object({
        email: yup.string().email().required('Please your enter email'),
        otp: yup
            .number()
            .integer()
            .positive()
            .min(100000)
            .max(999999)
            .required('Please enter otp'),
        source: yup.number().integer().positive().required()
    })
});
module.exports = { registrationSchema, registrationVerifySchema };
