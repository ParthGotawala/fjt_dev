const util = require('util');

function NotUpdate(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(NotUpdate, Error);
module.exports = NotUpdate;
