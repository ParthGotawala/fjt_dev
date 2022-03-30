﻿const M = require("minimatch");
var Sequelize = require("sequelize");

module.exports = {
  WebsiteBaseUrl: "https://192.168.0.130:3000",
  APIUrl: "https://192.168.0.130:2003",
  CompanyLogoImage: "/assets/images/logos/FJT-logo.png",
  Default_DB_Name: "FlextTron",
  sslCertificate: {
    key: "sslcert/server.key",
    crt: "sslcert/server.crt",
  },
  development: {
    username: "root",
    password: "triveni@123",
    // database: 'flexjobtracking_main_shubham', // 'flexjobtracking_champ',
    database: "flexjobtracking_dev", // 'flexjobtracking_champ',
    identityDatabase: "fjt_identity_dev",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    // retry: {
    //     max: 10,
    //     timeout: 10000,
    //     match: [
    //         Sequelize.ConnectionError,
    //         Sequelize.ConnectionRefusedError,
    //         Sequelize.ConnectionTimedOutError,
    //         Sequelize.OptimisticLockError,
    //         Sequelize.TimeoutError,
    //         /Deadlock/i
    //     ]
    // },
    dialectOptions: {
      multipleStatements: true,
      decimalNumbers: true,
      typeCast: (field, next) => {
        if (field.type === "DATE") {
          return new Date(field.string() + "Z");
        }
        return next();
      },
      // If you want to give a custom name to the deletedAt column
      // deletedAt: 'isDeleted'
      charset: "utf8_general_ci", // added to resolve charater set issue after sequalize version update: Error Code: 1267. Illegal mix of collations (utf8mb4_bin,NONE) and (utf8mb4_unicode_ci,COERCIBLE) for operation 'like'
    },
    logQueryParameters: true, // default: false. To display query value in sequelize log make it true
  },
  identity_server: {
    PORT: 443,
    HOST: "192.168.0.130",
    HEADER: { "Content-Type": "application/json" },
    IdentityServerUrl: "https://192.168.0.130/identityserver",
    // IdentityServerUrl: 'https://localhost:44372',
    IdentityPrefix: "/identityserver", // when use local IIS Identity server then only Value is '/identityserver-main' otherwise it will be ��.
    Q2CClients: {
      Q2CUI: "Q2C UI",
      Q2CReportDesigner: "Q2C Report Designer",
      Q2CReportViewer: "Q2C Report Viewer",
    },
    Q2CApiResources: {
      Q2CAPI: "Q2CAPI",
      IdentityServerAPI: "Identity Server API",
    },
  },
  report_viewer: {
    PORT: 443, // on server need to update port as on configured in IIS
    ReportViewerPrefix: "/FJT.ReportViewer", // when use local IIS ReportViewer then only Value is '/FJT.ReportViewer' otherwise it will be null.
  },
  identityServerLogFilePath: "D:/ID_Log_Files/tractActivityLog", // You can set path for log file. Do not use '\' only use '/'. (e.g. not use 'D:\\ID_Log_Files\\' instead use ''D:/ID_Log_Files/')
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
  rabbitmq: {
    username: "admin",
    password: "admin",
    virtualhost: "PricingService_Dev",
    Emailvirtualhost: "amqp://admin:admin@localhost/FJTEmailService_Dev",
    EnterPriseSearchvirtualhost:
      "amqp://admin:admin@localhost/EnterPriseSearchService_Dev",
    host: "amqp://admin:admin@localhost/PricingService_Dev",
  },
  SCAN: {
    HOST: "localhost",
    PORT: "3143",
    CONTENT_TYPE: "application/json",
    CACHE_CONTROL: "no-cache",
  },
  ELASTIC_URL: {
    UI_URL: "/#!/",
  },
  inoautorabbitmq: {
    username: "admin",
    password: "admin",
    virtualhost: "production",
    host: "amqp://admin:admin@192.168.1.126/production",
  },
  generateJSONBackup: false,
  InoAutoProductionEnable: false,
  autoGeneratedPaymentNumberPrefix: "FCA",
};
