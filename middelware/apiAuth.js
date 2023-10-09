'use strict';

const jwt = require('jsonwebtoken');
const { ApiError } = require('./apiError');
const authStatic = require('../../stg-static/auth.json');
const {
    authTokenModel: { getAuthToken, updateAuthToken }
} = require('../models');

const verifyAccessToken = (accessToken, authSecretKey) => {
    return jwt.verify(accessToken, authSecretKey);
};

const decodeToken = (accessToken, authSecretKey) => {
    return jwt.decode(accessToken, authSecretKey);
};

const validateAccessToken = async (accessToken, userId) => {
    const { dbCode, rid: refreshTokenId } = decodeToken(
        accessToken,
        process.env.AUTH_SECRET_KEY
    );
    if (!dbCode) {
        throw new Error('Unauthorised! please login again');
    }
    try {
        const verifiedToken = verifyAccessToken(
            accessToken,
            process.env.AUTH_SECRET_KEY
        );

        const { userId: decodedUserId, orgId } = verifiedToken;

        if (decodedUserId !== userId) {
            throw new Error('Invalid token, please login again');
        }

        const [authToken] = await getAuthToken(dbCode, refreshTokenId);

        if (!authToken) {
            throw new Error('Invalid token, please login again');
        }

        const { sessionStatus, refreshToken } =
			authToken;

        if (sessionStatus !== 1) {
            throw new Error('Invalid token, please login again');
        }

        const decodedRefreshToken = decodeToken(
            refreshToken,
            process.env.AUTH_REFRESH_SECRECT_KEY
        );

        const { dbCode: rDbCode } = decodedRefreshToken;

        if (dbCode !== rDbCode) {
            throw new Error('Invalid token, please login again');
        }

        return { dbCode, orgId };
    } catch (error) {
        throw error;
    }
};

const validateRefreshToken = async (accessToken, userId) => {
    try {
        const {
            dbCode,
            rid: refreshTokenId,
            orgId
        } = decodeToken(accessToken, process.env.AUTH_SECRET_KEY);
        const [authToken] = await getAuthToken(dbCode, refreshTokenId);
        if (!authToken) throw new Error('Invalid token, please login again');

        const { sessionStatus,  refreshToken } =
			authToken;
        if (sessionStatus !== 1)
            throw new Error('Invalid token, please login again');

        const {
            exp: rExpire,
            userId: rUserId,
            dbCode: rDbCode,
            orgId : rOrgId
        } = decodeToken(refreshToken, process.env.AUTH_REFRESH_SECRECT_KEY);

        if (orgId !== rOrgId)
            throw new Error('Invalid token, please login again');

        if (dbCode !== rDbCode)
            throw new Error('Invalid token, please login again');

        if (+new Date() / 1000 - rExpire > 0)
            throw new Error('Session Expired! Please login again');

        if (userId !== rUserId)
            throw new Error('Unauthorised! please login again');

        const payload = {
            userId,
            dbCode
        };

        const newAccessToken = jwt.sign(payload, process.env.AUTH_SECRET_KEY, {
            expiresIn: authStatic.AUTH_TOKEN_EXPIRE_TIME
        });

        updateAuthToken(dbCode, refreshTokenId, {
            access_token: newAccessToken
        }).catch((err) => console.error(err));

        return { dbCode, newAccessToken, orgId };
    } catch (error) {
        throw error;
    }
};


/**
 * 
 * An attribute is added to req object - additionalData which is an object with following keys - userId, dbCode, orgId

 */
const apiAuth = async (req, res, next) => {
    try {
        const accessToken = req.header('accesstoken');
        const userId = Number(req.header('userid'));

        if (!(accessToken && userId))
            throw new Error('Invalid token, please login again');

        try {
            const { dbCode, orgId } = await validateAccessToken(
                accessToken,
                userId
            );
            req.additionalData = {
                dbCode,
                userId,
                orgId
            };

            return next();
        } catch (error) {
            const { message: errorMessage } = error;
            if (errorMessage.includes('jwt expired')) {
                try {
                    const { dbCode, newAccessToken, orgId } =
						await validateRefreshToken(accessToken, userId);

                    res.append('accesstoken', newAccessToken);
                    req.additionalData = {
                        dbCode,
                        userId,
                        orgId
                    };
                    return next();
                } catch (error) {
                    throw error;
                }
            }
            throw new Error('Session Expired! Please login again');
        }
    } catch (error) {
        console.log(error);
        next(new ApiError(error, 401));
    }
};

module.exports = apiAuth;
