const util = require("util");
const app = require("express")();
const winston = require("winston");
require("winston-mongodb");
const moment = require("moment");

const tsFormat = () => moment().format("YYYY-MM-DD hh:mm:ss A").trim();
const path = require("path");
const fs = require("fs");

const baseDir = process.cwd();
const logDirectory = path.join(baseDir, "logs");
// eslint-disable-next-line no-unused-expressions
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// check logs on - http://localhost:2003/logs/

/* Log should be saved in mongoDB START:Ekta Mistry [29-11-2019] */
// const transport = [
//    new (winston.transports.File)({
//        filename: `${logDirectory}/FJT.log`
//        , level: 'error'
//        , timestamp: tsFormat
//        , handleExceptions: true
//        , maxsize: 100000000//100mb
//    }),
// ]
// const logger = new (winston.createLogger)({
//    transports: [
//        transport
//    ]
//    , exitOnError: false,
// });
const options = {
  file: {
    filename: `${logDirectory}\\FJT.log`,
    level: "error",
    timestamp: tsFormat,
    handleExceptions: true,
    maxsize: 100000000, // 100mb
    format: winston.format.json(),
  },
  database: {
    db: "mongodb://fjt:triveni123@localhost:27017/fjtpricing_dev?authSource=admin",
    // db: 'mongodb://admin:admin123@localhost:27017/fjtpricing_main?authSource=fjtpricing_dev',
    collection: "error_log",
    level: "error",
    handleExceptions: true,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    format: winston.format.json(),
  },
};
// eslint-disable-next-line new-cap
const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.MongoDB(options.database),
    new winston.transports.Console({
      level: "error",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
/* Log should be saved in mongoDB END:Ekta Mistry [29-11-2019] */

/* Console Error Add lo Start */
module.exports = {
  middleware: (req, res, next) => {
    console.error(req.method, req.url, res.statusCode);
    next();
  },
};

console.error = (params1, params2, params3, params4) => {
  if (logger) {
    if (params1 || params2 || params3 || params4) {
      let errorIDet = "Date: " + new Date().toUTCString() + " ";
      errorIDet += params1 || params1;  
      errorIDet += errorIDet && params2 ? ` ${params2}` : "";
      errorIDet += errorIDet && params3 ? ` ${params3}` : "";
      errorIDet += errorIDet && params4 ? ` ${params4}` : "";
      logger.log("error", errorIDet);
    }
  }
};
/* Console Error Add lo End */

require("../config/logger.js")(app, logger);

module.exports = logger;
