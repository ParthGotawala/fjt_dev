const util = require('util');

function NotDelete(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(NotDelete, Error);
module.exports = NotDelete;
