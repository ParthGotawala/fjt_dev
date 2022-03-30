const NotFound = require('./NotFound');
const NotCreate = require('./NotCreate');
const InvalidPerameter = require('./InvalidPerameter');
const NotUpdate = require('./NotUpdate');
const NotDelete = require('./NotDelete');
const NotMatchingPassword = require('./NotMatchingPassword');
const TokenExpired = require('./TokenExpired');
const TokenNotFound = require('./TokenNotFound');
const ServerError = require('./ServerError');
const UnauthorizedError = require('./Unauthorized');
const Failed = require('./Failed');

module.exports = {
    NotFound,
    NotCreate,
    InvalidPerameter,
    NotUpdate,
    NotDelete,
    NotMatchingPassword,
    TokenExpired,
    ServerError,
    TokenNotFound,
    UnauthorizedError,
    Failed,
    ECONNREFUSED: 'ECONNREFUSED',
    ETIMEDOUT: 'ETIMEDOUT',
    ENOTFOUND: 'ENOTFOUND',
    ERR_SOCKET_BAD_PORT: 'ERR_SOCKET_BAD_PORT'
};
