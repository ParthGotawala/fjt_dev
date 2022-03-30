const util = require('util');

function Failed(message = 'Failed') {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
util.inherits(Failed, Error);
module.exports = Failed;
