// /**
// * Module dependencies.
// */
// const app = require('./config/lib/app');

// app.start();

// module.exports = app;

// Don't Remove added for avnet API tls issue.
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Don't Remove added for avnet API tls issue.

/* eslint-disable import/no-dynamic-require, import/no-unresolved */
const env = process.env.NODE_ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const methodOverride = require("method-override");
const path = require("path");
const morgan = require("morgan");
const models = require("./models");
const config = require("./config/app_config");
const cors = require("cors");
const multipart = require("connect-multiparty");
const rabbitmqConfig = require("./config/config.js");
var MongoClient = require("mongodb").MongoClient;

const https = require("https");
https.globalAgent.options.rejectUnauthorized = false; //alter: process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var fs = require("fs");
const configDev = require("./config/config");
var privateKey = fs.readFileSync(configDev.sslCertificate.key, "utf8");
var certificate = fs.readFileSync(configDev.sslCertificate.crt, "utf8");

var credentials = { key: privateKey, cert: certificate };
var app = express();
var httpsServer = https.createServer(credentials, app);

const InoAutoIntegrationAPI = require("./src/InoAutoIntegration/InoAutoIntegrationAPI");

const { DATA_CONSTANT } = require("./constant");

const logger = require("./config/logger_config.js");
require("./config/logger.js")(app, logger);

// eslint-disable-next-line no-underscore-dangle
global.__basedir = __dirname;

const BluebirdPromise = require("bluebird");

global.PromiseData = BluebirdPromise;

PromiseData.onPossiblyUnhandledRejection((e, promise) => {
  throw e;
});
global.requestObject = null;

app.use(cors());
// parse application/json
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));

// Enable logger (morgan)
app.use(morgan("dev"));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.set("view engine", "ejs");

// local variables to the app
app.locals.models = models;
app.locals.config = config;

// backend routes ==================================================
// only listen to backend routes for production as front end will be handled by nginx
app.use(express.static(__dirname));
app.use(multipart());
require(path.resolve(config.ROUTES))(app); // configure our routes

var server, io;
// connection for rabbitmq with node js
var amqp = require("amqplib/callback_api");
var amqpMQ = require("amqp");

function connectRabbitMQForPricing() {
  amqp.connect(rabbitmqConfig.rabbitmq.host, function (err, conn) {
    if (err) {
      setTimeout(() => connectRabbitMQForPricing(), 50000);
    }
    if (conn) {
      conn.createChannel(function (err, ch) {
        global.channel = ch;
        console.log("Rabbitmq pricing Connected");
      });
      conn.on("error", function (error) {
        if (error.code !== "ECONNRESET") {
          global.channel = null;
          console.log("[AMQP] pricing conn error", error.message);
          connectRabbitMQForPricing();
        }
      });
      conn.on("close", function () {
        console.log("[AMQP] pricing reconnecting");
        if (global.channel) {
          global.channel = null;
          connectRabbitMQForPricing();
        }
      });
    }
  });
}
connectRabbitMQForPricing(); // start for pricing rabbitmq service

function connectRabbitMQForEmail() {
  amqp.connect(rabbitmqConfig.rabbitmq.Emailvirtualhost, function (err, conn) {
    if (err) {
      setTimeout(() => connectRabbitMQForEmail(), 50000);
    }
    if (conn) {
      conn.createChannel(function (err, ch) {
        global.Emailchannel = ch;
        console.log("Rabbitmq email Connected");
      });
      conn.on("error", function (error) {
        if (error.code !== "ECONNRESET") {
          global.Emailchannel = null;
          console.log("[AMQP] email conn error", error.message);
          connectRabbitMQForEmail();
        }
      });
      conn.on("close", function () {
        console.log("[AMQP] email reconnecting");
        if (global.Emailchannel) {
          global.Emailchannel = null;
          connectRabbitMQForEmail();
        }
      });
    }
  });
}
connectRabbitMQForEmail(); // start for email rabbitmq service

function connectRabbitMQForElastic() {
  amqp.connect(
    rabbitmqConfig.rabbitmq.EnterPriseSearchvirtualhost,
    function (err, conn) {
      if (err) {
        setTimeout(() => connectRabbitMQForElastic(), 50000);
      }
      if (conn) {
        conn.createChannel(function (err, ch) {
          global.EnterpriseSearchchannel = ch;
          console.log("Rabbitmq enterprise Connected");
        });
        conn.on("error", function (error) {
          if (error.code !== "ECONNRESET") {
            global.EnterpriseSearchchannel = null;
            console.log("[AMQP] enterprise conn error", error.message);
            connectRabbitMQForElastic();
          }
        });
        conn.on("close", function () {
          console.log("[AMQP] enterprise reconnecting");
          if (global.EnterpriseSearchchannel) {
            global.EnterpriseSearchchannel = null;
            connectRabbitMQForElastic();
          }
        });
      }
    }
  );
}
connectRabbitMQForElastic(); // start for enterprise rabbitmq service

const InovaxeProductionConnection = () => {
  // connect to inoauto rabbitmq vhost: rabbitmqConfig.inoautorabbitmq.virtualhost
  var connection = amqpMQ.createConnection({
    url: rabbitmqConfig.inoautorabbitmq.host,
  });
  connection.on("error", function (err) {
    console.error("Connection error", err);
    if (InoAutoIntegrationAPI && InoAutoIntegrationAPI.updateServerHeartbeat) {
      InoAutoIntegrationAPI.updateServerHeartbeat({
        status: DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Offline,
      });
    }
  });
  connection.on("ready", function () {
    exchange = connection.exchange(
      "ExternalDirectives",
      { durable: true, autoDelete: false },
      function (exchange) {
        console.log("exchange Connected");
        global.inoAutoexchange = exchange;
      }
    );
    exchange.on("error", function (err) {
      console.error("exchange error", err);
      if (
        InoAutoIntegrationAPI &&
        InoAutoIntegrationAPI.updateServerHeartbeat
      ) {
        InoAutoIntegrationAPI.updateServerHeartbeat({
          status: DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Offline,
        });
      }
    });
    exchangeN = connection.exchange(
      "ExternalNotifications",
      { durable: true, autoDelete: false },
      function (exchangeN) {
        // console.log('exchangeN Connected');
        if (!global.inoAutoexchangeSender) {
          global.inoAutoexchangeSender = exchangeN;
          connection.queue("", function (queue) {
            queue.bind("ExternalNotifications", "*.*");
            queue.subscribe(function (message) {
              // Handle message here
              var chunks = [];
              chunks.push(message.data);
              var body = Buffer.concat(chunks);
              // console.log('Got message', body.toString());
              if (
                InoAutoIntegrationAPI &&
                InoAutoIntegrationAPI.responseReceived
              ) {
                InoAutoIntegrationAPI.responseReceived(
                  JSON.parse(body.toString())
                );
              }
            });
          });
        } else {
          global.inoAutoexchangeSender = exchangeN;
        }
      }
    );
  });
  connection.connect();
};
// end of code for inoauto
function connectToDb() {
  models.sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
      //process.env.PORT
      var server = httpsServer.listen(config.PORT, () => {
        console.log("-----------------------------");
        console.log(chalk.green(config.APP.TITLE));
        console.log(chalk.green("Environment:\t" + env));
        console.log(chalk.green("Port:\t\t" + config.PORT));
        console.log(chalk.green("App version:\t" + config.APP.VERSION));
        console.log("-----------------------------");
        logger.log("info", "Db Connected");
      });

      io = require("socket.io").listen(server);
      io.set("transports", ["websocket"]);
      io.set("origins", "*:*");
      // io.set("polling duration", 10);
      // io.set('origins', '*yourfusebox.com*:*');
      require("./src/socket/controllers/socketCtrl")(io, app);
      global.socketIO = io;
      console.log("Initalize Socket.io");

      //var mongodb = require('./mongodb.js');
      //mongodb.connect().then((db) => {
      //    app.locals.mongoDB = db;
      //    global.mongodb = db;
      //});
    })
    .catch((err) => {
      console.trace();
      console.error(err);
      console.error(
        chalk.red("Connection could not be established to database.")
      );
      console.error(chalk.red("Retrying to connect in 5 sec."));
      setTimeout(() => connectToDb(), 5000);
    });
}
connectToDb();

function mongoDBConnect() {
  var url = "mongodb://fjt:triveni123@localhost:27017";
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function (db) {
      var dbo = db.db("fjtpricing_dev");
      db.on("serverClosed", function (err) {
        console.log("Error...disconnect");
        if (global.mongodb) {
          app.locals.mongoDB = null;
          global.mongodb = null;
          setTimeout(() => mongoDBConnect(), 50000);
        }
      });
      app.locals.mongoDB = dbo;
      global.mongodb = dbo;
    })
    .catch(function (err) {
      app.locals.mongoDB = null;
      global.mongodb = null;
      setTimeout(() => mongoDBConnect(), 50000);
    });
}
mongoDBConnect();

if (rabbitmqConfig && rabbitmqConfig.InoAutoProductionEnable) {
  InovaxeProductionConnection();
}
