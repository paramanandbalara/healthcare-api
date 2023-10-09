'use strict';
const { ApiError } = require('./apiError');

function validateRequest(schema, stripUnknown = true, sync = true) {
    return async function(req, res, next) {
        try {
            const validatedData = sync ?
                schema.validateSync(
                    {
                        body: req.body,
                        query: req.query,
                        params: req.params
                    },
                    { stripUnknown },
                ) :
                await schema.validate(
                    {
                        body: req.body,
                        query: req.query,
                        params: req.params
                    },
                    { stripUnknown },
                );
            ['body', 'query', 'params'].forEach((key) => {
                req[key] = validatedData[key];
            });
            return next();
        } catch (error) {
            return next(new ApiError(error, 400));
        }
    };
}

module.exports = validateRequest;
