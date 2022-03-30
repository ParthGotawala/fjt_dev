const _ = require("lodash");
const uuidv1 = require("uuid/v1");
const fs = require("fs");
const { STATE, COMMON } = require("../constant");
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require("../../constant");
const { IDENTITY_SERVER } = require("../../constant/data_constant");

const resHandler = require("../resHandler");
const https = require("https");
const { identity_server } = require("../../config/config");

module.exports = {
  // Update Scope fo Users
  // POST : https://localhost:44372/Uitility/ManageClientUserMapping
  // @return failed users entry if any
  updateScoprOfUser: (body, token) => {
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };

    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.UPDATE_SCOPE_OF_USER.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path:
          identity_server.IdentityPrefix +
          IDENTITY_SERVER.UPDATE_SCOPE_OF_USER.PATH,
        headers: HEADER,
        strictSSL: false,
      };

      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          resolve(str);
        });
      };

      var req = https.request(options, callback);
      req.write(JSON.stringify(body));
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },
  // Removeuser from Identity server
  // POST : https://localhost:44372/account/removeuser
  // @return
  removeUserFromIdentity: (body, token) => {
    const newBody = { UserIds: body };
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };

    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.REMOVE_USER.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path: identity_server.IdentityPrefix + IDENTITY_SERVER.REMOVE_USER.PATH,
        headers: HEADER,
        strictSSL: false,
      };

      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          resolve(str);
        });
      };

      var req = https.request(options, callback);
      req.write(JSON.stringify(newBody));
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },

  // Removeuser from Identity server
  // POST : https://localhost:44372/account/UpdateUser
  // @return
  UpdateUser: (body, token) => {
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };

    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.Update_USER.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path: identity_server.IdentityPrefix + IDENTITY_SERVER.Update_USER.PATH,
        headers: HEADER,
        strictSSL: false,
      };

      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          resolve(str);
        });
      };

      var req = https.request(options, callback);
      req.write(JSON.stringify(body));
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },

  // get download agreement List.
  // Post : https://localhost:44372/Agreement/GetAgreementTemplateDetails
  // @return download agreement list
  getDownloadAgreementlist: (body, token) => {
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };

    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.GET_DOWNLOAD_AGREEMENT_DETAILS_LIST.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path:
          identity_server.IdentityPrefix +
          IDENTITY_SERVER.GET_DOWNLOAD_AGREEMENT_DETAILS_LIST.PATH,
        headers: HEADER,
        strictSSL: false,
      };

      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          resolve(str);
        });
      };

      var req = https.request(options, callback);
      req.write(JSON.stringify(body));
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },

  // Validate user Passwordregister
  // Post : https://localhost:44372/api/Authentication/ValidatePassword
  // @return password is matched or not.
  validateuserPassword: (body, token) => {
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };

    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.VALIDATE_USER_PASSWORD.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path:
          identity_server.IdentityPrefix +
          IDENTITY_SERVER.VALIDATE_USER_PASSWORD.PATH,
        headers: HEADER,
        strictSSL: false,
      };

      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          resolve(str);
        });
      };

      var req = https.request(options, callback);
      req.write(JSON.stringify(body));
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },

  setSuperAdmin: (identityUserId, isSuperAdmin, token) => {
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };

    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.SET_SUPER_ADMIN.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path:
          identity_server.IdentityPrefix +
          IDENTITY_SERVER.SET_SUPER_ADMIN.PATH +
          "/?userId=" +
          identityUserId +
          "&isSuperAdmin=" +
          isSuperAdmin,
        headers: HEADER,
        strictSSL: false,
      };

      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          resolve(str);
        });
      };

      var req = https.request(options, callback);
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },
  // Create User on Identity Server.
  // POST : https://localhost:44372/account/register
  // @return ID of user from Identity Server if successful else send message.
  createUserOnIdentityServer: (body, token) => {
    https.globalAgent.options.rejectUnauthorized = false;
    const HEADER = { ...identity_server.HEADER, Authorization: token };
    return new Promise((resolve) => {
      var options = {
        method: IDENTITY_SERVER.REGISTER_ON_IDENTITY_SERVER.METHOD,
        host: identity_server.HOST,
        port: identity_server.PORT,
        path:
          identity_server.IdentityPrefix +
          IDENTITY_SERVER.REGISTER_ON_IDENTITY_SERVER.PATH,
        headers: HEADER,
        strictSSL: false,
      };
      callback = function (response) {
        var str = "";
        response.on("data", (chunk) => {
          str += chunk;
        });
        response.on("end", () => {
          resolve(str);
        });
      };
      var req = https.request(options, callback);
      req.write(JSON.stringify(body));
      req.on("error", (err) => {
        const res = { status: STATE.FAILED, message: err.toString() };
        resolve(res);
      });
      req.end();
    });
  },
};
