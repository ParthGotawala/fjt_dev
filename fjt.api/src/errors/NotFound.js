const util = require('util');

function NotFound(message = 'Not found') {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(NotFound, Error);
module.exports = NotFound;
