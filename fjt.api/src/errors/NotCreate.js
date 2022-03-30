const util = require('util');

function NotCreate(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(NotCreate, Error);
module.exports = NotCreate;
