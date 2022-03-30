const util = require('util');

function UnauthorizedError(message = 'You don\'t have sufficient privileges to perform this action') {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(UnauthorizedError, Error);
module.exports = UnauthorizedError;
