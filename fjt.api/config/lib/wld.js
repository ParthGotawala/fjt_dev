'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

function WLD(logger) {
  this.transport = logger.transports[_.keys(logger.transports)[0]];
}

/**
 * return logs for provided options
 *
 * @param options
 * @returns {bluebird}
 */
WLD.prototype.list = function (options) {
  let logCount = 0;
  options.limit = _.get(options, 'limit', 50);
  options.offset = _.get(options, 'offset', 0);

  return new Promise((resolve, reject) => {
    this.transport.query({
      start: options.offset,
      limit: Infinity //options.limit,
    }, (error, logs) => {
      if (error) {
        return reject(error);
      }
      //Solved pagination issue in log list:Ekta Mistry [28-11-2019]
      let allLogs = _.chunk(logs, options.limit);
      if (options.page != 1) {
        logCount = options.page - 1;
      }
      logs = allLogs[logCount];
      resolve(logs);
    });
  });
};

module.exports = WLD;
