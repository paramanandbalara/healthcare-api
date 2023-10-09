'use strict';
// const customErrorCodes = require('../../stg-static/error_codes.json');
class ApiError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.errorCode = errorCode;
        this.name = this.constructor.name;
    }
}

class ApiErrorHandler {
    // eslint-disable-next-line no-unused-vars
    static handle(error, req, res, next) {
        !(error instanceof ApiError) && console.error(error);
        const { errorCode = 500, message } = error;
        const errorMessage = error instanceof ApiError ?
            message :
            'Internal server error';

        const logout = errorCode === 401 ? true : undefined;

        res.status(errorCode).json({
            success: false,
            status: 'error',
            message: errorMessage,
            logout,
        });
    }
}

module.exports = { ApiError, ApiErrorHandler };
