const util = require('util');

function TokenNotFound(message = 'Session error, please login again.') {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(TokenNotFound, Error);
module.exports = TokenNotFound;
