const util = require('util');

function ServerError(message = 'Something wen\'t wrong on server.') {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(ServerError, Error);
module.exports = ServerError;
