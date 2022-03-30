const util = require('util');

function InvalidPerameter(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(InvalidPerameter, Error);
module.exports = InvalidPerameter;
