const resHandler = require('../resHandler');
const { STATE } = require('../constant');
const { TokenExpired, TokenNotFound } = require('../errors');

const jwtErrorHandler = (err, req, res, next) => {
    if (err) {
        switch (err.message) {
            case 'jwt expired':
                return resHandler.errorRes(res, err.status, STATE.FAILED,
                    new TokenExpired());
            case 'jwt malformed':
                return resHandler.errorRes(res, err.status, STATE.FAILED,
                    new TokenNotFound());
            default:
                return resHandler.errorRes(res, 500, STATE.FAILED,
                    err.message);
        }
        // TODO: add other error handlers
    }
    return next();
};

module.exports = jwtErrorHandler;
