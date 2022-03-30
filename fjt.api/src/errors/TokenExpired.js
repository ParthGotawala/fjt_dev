const util = require('util');

function TokenExpired(message = 'Your session has expired, please login again.') {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(TokenExpired, Error);
module.exports = TokenExpired;
