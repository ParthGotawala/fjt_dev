/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const { Op } = require('sequelize');
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');
const _ = require('lodash');
const qs = require('querystring');
const http = require('https');
const Arrowhttp = require('http');
const redirectshttps = require('follow-redirects').https;
const Request = require('request');

const currentModuleName = DATA_CONSTANT.SETTINGS.NAME;
const PricingModuleName = DATA_CONSTANT.PRICING.NAME;
const componentModule = DATA_CONSTANT.PARTUPDATE.NAME;
const Pricing = DATA_CONSTANT.PRICING;
const DigiKey = DATA_CONSTANT.PRICING.DIGI_KEY;
const Avnet = DATA_CONSTANT.PRICING.AVNET;
const Newark = DATA_CONSTANT.PRICING.NEWARK;
const Mouser = DATA_CONSTANT.PRICING.Mouser;
const Arrow = DATA_CONSTANT.PRICING.Arrow;
const TTI = DATA_CONSTANT.PRICING.TTI;
const HEILIND = DATA_CONSTANT.PRICING.HEILIND;
const OctoPart = DATA_CONSTANT.PRICING.OCTOPART;

const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const Bson = require('bson');
var convert = require('xml-js');
var CryptoJS = require('crypto-js');
var XMLHttpRequest = require('xhr2');
const moment = require('moment');
const { stringFormat } = require('../../constant/Common');


module.exports = {
    // Get Digikey Access token and refresh token
    // GET : /api/v1/pricing/getDigikeyAccessToken
    // @param {code} varchar
    // @return Access token/refresh token
    // eslint-disable-next-line consistent-return
    getDigikeyAccessToken: (req, res) => {
        if (req.params.code) {
            const options = {
                method: DigiKey.POST,
                hostname: DigiKey.HOST_NAME_CODE,
                path: DigiKey.CODEGETAPI,
                headers: {
                    'content-type': DigiKey.CONTENT_TYPE_CODE,
                    'cache-control': DigiKey.CACHE
                }
            };
            const request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                });
            });
            request.write(qs.stringify({
                code: req.params.code,
                client_id: DigiKey.CLIENT_ID,
                client_secret: DigiKey.CLIENT_SECREATKEY,
                redirect_uri: DigiKey.REDIRECT_URI,
                grant_type: DigiKey.GRANT_TYPE
            }));
            request.end();
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Digikey cardential
    // GET : /api/v1/pricing/getDigikeyCardential
    // @return digikey detail
    getDigikeyCardential: (req, res) => {
        const { Settings } = req.app.locals.models;
        Settings.findOne({
            where: {
                key: [Pricing.DigiKeyClientID]
            },
            attributes: ['id', 'key', 'values', 'clusterName']
        }).then(responseDK => resHandler.successRes(res, 200, STATE.SUCCESS, responseDK)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)));
        });
    },

    // Get Digikey cardential
    // GET : /api/v1/pricing/getDigikeyExternalCardential
    // @return digikey detail
    getDigikeyExternalCardential: (req, res) => {
        const { ExternalAPIConfigurationSettings } = req.app.locals.models;
        ExternalAPIConfigurationSettings.findOne({
            where: {
                defaultAccess: true,
                appID: req.params.appID
            },
            attributes: ['id', 'clientID', 'secretID', 'redirectUrl']
        }).then(responseDK => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseDK, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get Digikey Access token and refresh token
    // GET : /api/v1/pricing/getAndUpdateAccessTokenExternalDK
    // @param {code} varchar
    // @return Access token/refresh token
    // eslint-disable-next-line consistent-return
    getAndUpdateAccessTokenExternalDK: (req, res) => {
        if (req.body.setting) {
            const setting = req.body.setting;
            const { ExternalAPIConfigurationSettings } = req.app.locals.models;
            ExternalAPIConfigurationSettings.findOne({
                where: {
                    id: setting.id
                },
                attributes: ['clientID', 'secretID', 'id', 'redirectUrl']
            }).then((settingsData) => {
                const DigiKeyClientID = settingsData.clientID;
                const DigiKeySecretID = settingsData.secretID;
                var options = {
                    method: DigiKey.POST,
                    hostname: setting.isNewVersion ? DigiKey.HOST_NAME_API : DigiKey.HOST_NAME_CODE,
                    path: setting.isNewVersion ? DigiKey.CODEGETAPIV3 : DigiKey.CODEGETAPI,
                    headers: {
                        'content-type': DigiKey.CONTENT_TYPE_CODE,
                        'cache-control': DigiKey.CACHE
                    }
                };
                var request = http.request(options, (responseDK) => {
                    var chunks = [];
                    responseDK.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    // eslint-disable-next-line consistent-return
                    responseDK.on('end', () => {
                        var body = Buffer.concat(chunks);
                        const jsonData = JSON.parse(body.toString());
                        if (jsonData.error || jsonData.error_description || jsonData.ErrorMessage || jsonData.ErrorMessage) {
                            return resHandler.errorRes(res,
                                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DIGIKEY_AUTH_FAILED, err: null, data: null });
                        }
                        const objSettingsUpdate = {
                            refreshToken: jsonData.refresh_token,
                            accessToken: jsonData.access_token
                        };
                        ExternalAPIConfigurationSettings.update(objSettingsUpdate, {
                            where: {
                                id: setting.id
                            },
                            fields: ['refreshToken', 'accessToken']
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(currentModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            // message content is empty as no messsage sent in previous response
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: err, data: null });
                        });
                    });
                });
                request.write(qs.stringify({
                    code: setting.code,
                    client_id: DigiKeyClientID,
                    client_secret: DigiKeySecretID,
                    redirect_uri: settingsData.redirectUrl,
                    grant_type: DigiKey.GRANT_TYPE
                }));
                request.end();
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Digikey Access token and refresh token
    // GET : /api/v1/pricing/getAndUpdateAccessToken
    // @param {code} varchar
    // @return Access token/refresh token
    // eslint-disable-next-line consistent-return
    getAndUpdateAccessToken: (req, res) => {
        if (req.params.code) {
            let settingsDataArr = [];
            const { Settings } = req.app.locals.models;
            Settings.findAll({
                where: {
                    key: [Pricing.DigiKeyClientID, Pricing.DigiKeySecretID, Pricing.DigiKeyCode, Pricing.DigiKeyRefreshToken, Pricing.DigiKeyAccessToken]
                },
                attributes: ['id', 'key', 'values', 'clusterName']
            }).then((settingsData) => {
                settingsDataArr = settingsData;
                let DigiKeyClientID;
                let DigiKeySecretID;
                _.each(settingsData, (itemData) => {
                    if (itemData.key === Pricing.DigiKeyClientID) {
                        DigiKeyClientID = itemData.values;
                    } else if (itemData.key === Pricing.DigiKeySecretID) {
                        DigiKeySecretID = itemData.values;
                    }
                });
                const options = {
                    method: DigiKey.POST,
                    hostname: DigiKey.HOST_NAME_CODE,
                    path: DigiKey.CODEGETAPI,
                    headers: {
                        'content-type': DigiKey.CONTENT_TYPE_CODE,
                        'cache-control': DigiKey.CACHE
                    }
                };
                const request = http.request(options, (responseDK) => {
                    var chunks = [];
                    responseDK.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    // eslint-disable-next-line consistent-return
                    responseDK.on('end', () => {
                        var body = Buffer.concat(chunks);
                        const jsonData = JSON.parse(body.toString());
                        if (jsonData.error || jsonData.error_description) {
                            return resHandler.errorRes(res,
                                200,
                                STATE.FAILED,
                                new InvalidPerameter(jsonData.error_description));
                        }
                        const systemConfigArr = [];
                        _.each(settingsDataArr, (configData) => {
                            const itemObj = {};
                            if (configData.key === Pricing.DigiKeyRefreshToken) {
                                itemObj.id = configData.id;
                                itemObj.key = configData.key;
                                itemObj.values = jsonData.refresh_token;
                                itemObj.updatedBy = req.user.id;
                                systemConfigArr.push(itemObj);
                            } else if (configData.key === Pricing.DigiKeyAccessToken) {
                                itemObj.id = configData.id;
                                itemObj.key = configData.key;
                                itemObj.values = jsonData.access_token;
                                itemObj.updatedBy = req.user.id;
                                systemConfigArr.push(itemObj);
                            } else if (configData.key === Pricing.DigiKeyCode) {
                                itemObj.id = configData.id;
                                itemObj.key = configData.key;
                                itemObj.values = req.params.code;
                                itemObj.updatedBy = req.user.id;
                                systemConfigArr.push(itemObj);
                            }
                        });
                        Settings.bulkCreate(systemConfigArr, {
                            updateOnDuplicate: ['key', 'values']
                        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(currentModuleName) })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    });
                });
                request.write(qs.stringify({
                    code: req.params.code,
                    client_id: DigiKeyClientID,
                    client_secret: DigiKeySecretID,
                    redirect_uri: DigiKey.REDIRECT_URI,
                    grant_type: DigiKey.GRANT_TYPE
                }));
                request.end();
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Packing slip detail from sales order
    // GET : /api/v1/pricing/getPackingSlipDetails
    // @param {code} salesorder
    // @return packing slip details
    // eslint-disable-next-line consistent-return
    getPackingSlipDetails: (req, res) => {
        if (req.params.salesorderID) {
            const { ExternalAPIConfigurationSettings } = req.app.locals.models;
            ExternalAPIConfigurationSettings.findOne({
                where: {
                    appID: DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3
                },
                attributes: ['id', 'clientID', 'accessToken']
            }).then((settingsData) => {
                const DigiKeyClientID = settingsData.clientID;
                const DigikeyAccessToken = settingsData.accessToken;

                var options = {
                    method: DigiKey.GET,
                    hostname: DigiKey.HOST_NAME_API,
                    path: COMMON.stringFormat(DigiKey.SALESORDER_DETAIL, req.params.salesorderID),
                    headers: {
                        authorization: COMMON.stringFormat('Bearer {0}', DigikeyAccessToken),
                        accept: DigiKey.CONTENT_TYPE_PART,
                        'content-type': DigiKey.CONTENT_TYPE_PART,
                        'X-DIGIKEY-Client-Id': DigiKeyClientID,
                        'cache-control': DigiKey.CACHE
                    }
                };

                var request = http.request(options, (responsePS) => {
                    var chunks = [];

                    responsePS.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    responsePS.on('end', () => {
                        var body = Buffer.concat(chunks);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, body.toString(), null);
                    });
                });

                request.end();
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    getDigiKeyword: (req, partNumber, AccessToken, ClientID, CustomerID, DKRecordCount) => {
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_API,
            path: DigiKey.PARTGETAPI,
            headers: {
                authorization: AccessToken,
                accept: DigiKey.CONTENT_TYPE_PART,
                'content-type': DigiKey.CONTENT_TYPE_PART,
                'x-ibm-client-id': ClientID,
                'X-DIGIKEY-Customer-Id': CustomerID ? CustomerID : '',
                'cache-control': DigiKey.CACHE
            }
        };
        return new Promise((resolve, reject) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    const parts = JSON.parse(body.toString());
                    const objApi = {
                        PartString: body.toString(),
                        PartObject: parts
                    };
                    resolve(objApi);
                });
                responseDK.on('error', (err) => {
                    reject(err);
                });
            });
            request.write(JSON.stringify({ Keywords: partNumber, RecordCount: DKRecordCount }));
            request.end();
        });
    },
    getDigiKeywordVersion3: (req, partNumber, AccessToken, ClientID, CustomerID, DKRecordCount) => {
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_API,
            path: DigiKey.PARTGETAPIV3,
            headers: {
                Accept: DigiKey.CONTENT_TYPE_PART,
                Authorization: COMMON.stringFormat('Bearer {0}', AccessToken),
                'Content-Type': DigiKey.CONTENT_TYPE_PART,
                'X-DIGIKEY-Client-Id': ClientID,
                'cache-control': DigiKey.CACHE
            }
        };
        return new Promise((resolve, reject) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    const parts = JSON.parse(body.toString());
                    const objApi = {
                        PartString: body.toString(),
                        PartObject: parts
                    };
                    resolve(objApi);
                });
                responseDK.on('error', (err) => {
                    reject(err);
                });
            });
            request.write(JSON.stringify({ Keywords: partNumber, RecordCount: DKRecordCount }));
            request.end();
        });
    },

    getdigiPartDetail: (req, partNumber, AccessToken, ClientID, CustomerID) => {
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_API,
            path: DigiKey.PART_SEARCHAPI,
            headers: {
                authorization: AccessToken,
                accept: DigiKey.CONTENT_TYPE_PART,
                'content-type': DigiKey.CONTENT_TYPE_PART,
                'x-ibm-client-id': ClientID,
                'X-DIGIKEY-Customer-Id': CustomerID ? CustomerID : '',
                'cache-control': DigiKey.CACHE
            }
        };
        return new Promise((resolve, reject) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    var responseParts = JSON.parse(body.toString());
                    responseParts.header = responseDK.headers;
                    resolve(responseParts);
                });
                responseDK.on('error', (err) => {
                    reject(err);
                });
            });
            request.write(JSON.stringify({ Part: partNumber, IncludeAllAssociatedProducts: true }));
            request.end();
        });
    },

    getdigiPartDetailV3: (req, partNumber, AccessToken, ClientID, specialPriceCustomerID) => {
        var options = {
            method: DigiKey.GET,
            hostname: DigiKey.HOST_NAME_API,
            path: COMMON.stringFormat(DigiKey.PART_SEARCHAPIV3, encodeURIComponent(partNumber)),
            headers: {
                authorization: COMMON.stringFormat('Bearer {0}', AccessToken),
                accept: DigiKey.CONTENT_TYPE_PART,
                'content-type': DigiKey.CONTENT_TYPE_PART,
                'X-DIGIKEY-Client-Id': ClientID,
                'cache-control': DigiKey.CACHE
            }
        };
        if (specialPriceCustomerID) {
            options.headers['X-DIGIKEY-Customer-Id'] = specialPriceCustomerID;
        }
        return new Promise((resolve, reject) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    var responseParts = JSON.parse(body.toString());
                    responseParts.header = responseDK.headers;
                    resolve(responseParts);
                });
                responseDK.on('error', (err) => {
                    reject(err);
                });
            });
            request.end();
        });
    },

    // check digikey access token expired or not
    // Get:/api/v1/pricing/checkAppAccessTokenActive
    // @return digikey access token status
    checkAppAccessTokenActive: (req, res) => {
        const { ExternalAPIConfigurationSettings, Settings } = req.app.locals.models;
        Settings.findOne({
            where: {
                key: DATA_CONSTANT.DKVersion
            },
            attributes: ['id', 'values']
            // eslint-disable-next-line consistent-return
        }).then((settings) => {
            if (settings != null) {
                ExternalAPIConfigurationSettings.findAll({
                    where: {
                        Version: settings.values
                    },
                    attributes: ['id', 'appID']
                }).then((extsettings) => {
                    if (extsettings && extsettings.length) {
                        const PromisesData = [];
                        _.each(extsettings, (data) => {
                            req.appID = data.appID;
                            PromisesData.push(module.exports.checkAccessToken(req, res).then(auth =>
                                // data.auth = auth;
                                auth));
                        });
                        Promise.all(PromisesData).then((digikeyResponse) => {
                            var failStatus = _.find(digikeyResponse, status => status === STATE.FAILED);
                            if (failStatus) {
                                return resHandler.successRes(res, 200, STATE.SUCCESS, failStatus);
                            } else {
                                return resHandler.successRes(res, 200, STATE.SUCCESS, null);
                            }
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                return resHandler.successRes(res, 200, STATE.SUCCESS, { status: STATE.FAILED });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // check digikey access token expired or not
    // Get:/api/v1/pricing/checkAppAccessToken
    // @return digikey access token status
    // eslint-disable-next-line consistent-return
    checkAppAccessToken: (req, res) => {
        if (req.params && req.params.appID) {
            req.appID = req.params.appID;
            module.exports.checkAccessToken(req, res).then(auth => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, auth, null));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null);
        }
    },
    // check digikey access token expired or not
    // Get:/api/v1/pricing/checkAccessToken
    // @return digikey access token status
    checkAccessToken: (req, res) => {
        const { ExternalAPIConfigurationSettings, Settings } = req.app.locals.models;
        return Settings.findOne({
            where: {
                key: DATA_CONSTANT.DKVersion
            },
            attributes: ['id', 'values']
        }).then((settings) => {
            if (settings != null) {
                return ExternalAPIConfigurationSettings.findOne({
                    where: {
                        defaultAccess: true,
                        appID: req.appID ? req.appID : (DATA_CONSTANT.DIGIKEY_VERSION.DKV2 === settings.values ? DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJT : DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJTV3),
                        supplierID: DigiKey.DIGI_KEY_SUPPLIER
                    },
                    attributes: ['id', 'clientID', 'accessToken', 'secretID', 'refreshToken']
                }).then((extsettings) => {
                    if (DATA_CONSTANT.DIGIKEY_VERSION.DKV2 === settings.values) {
                        return module.exports.getDigiKeyPartNumber(req, Pricing.Manufacturer, extsettings.accessToken, extsettings.clientID, 1).then((checkdigikey) => {
                            if (checkdigikey.httpCode === Pricing.ERR_AUTH) {
                                req.id = extsettings.id;
                                req.clientID = extsettings.clientID;
                                req.secretID = extsettings.secretID;
                                req.accessToken = extsettings.accessToken;
                                req.refreshToken = extsettings.refreshToken;
                                if (extsettings.refreshToken) {
                                    return module.exports.RegenerateExternalAccessToken(req, res).then((result) => {
                                        if (result === STATE.FAILED) {
                                            return req.appID ? STATE.FAILED : resHandler.successRes(res, 200, STATE.SUCCESS, { status: STATE.FAILED });
                                        } else { return req.appID ? STATE.SUCCESS : resHandler.successRes(res, 200, STATE.SUCCESS, null); }
                                    });
                                } else {
                                    return req.appID ? STATE.FAILED : resHandler.successRes(res, 200, STATE.SUCCESS, { status: STATE.FAILED });
                                }
                            } else { return req.appID ? STATE.SUCCESS : resHandler.successRes(res, 200, STATE.SUCCESS, null); }
                        });
                    } else {
                        return module.exports.getDigiKeyPartNumberV3(req, Pricing.Manufacturer, extsettings.accessToken, extsettings.clientID, 1).then((checkdigikey) => {
                            if (checkdigikey.StatusCode === Pricing.ERR_AUTH) {
                                req.id = extsettings.id;
                                req.clientID = extsettings.clientID;
                                req.secretID = extsettings.secretID;
                                req.accessToken = extsettings.accessToken;
                                req.refreshToken = extsettings.refreshToken;
                                if (extsettings.refreshToken) {
                                    return module.exports.RegenerateExternalAccessTokenV3(req, res).then((result) => {
                                        if (result === STATE.FAILED) {
                                            return req.appID ? STATE.FAILED : resHandler.successRes(res, 200, STATE.SUCCESS, { status: STATE.FAILED });
                                        } else { return req.appID ? STATE.SUCCESS : resHandler.successRes(res, 200, STATE.SUCCESS, null); }
                                    });
                                } else {
                                    return req.appID ? STATE.FAILED : resHandler.successRes(res, 200, STATE.SUCCESS, { status: STATE.FAILED });
                                }
                            } else { return req.appID ? STATE.SUCCESS : resHandler.successRes(res, 200, STATE.SUCCESS, null); }
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return req.appID ? STATE.FAILED : resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                return req.appID ? STATE.FAILED : resHandler.successRes(res, 200, STATE.SUCCESS, { status: STATE.FAILED });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return req.appID ? STATE.FAILED : resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // check digikey regenerate access token expired or not
    // Get:/api/v1/pricing/RegenerateExternalAccessToken
    // @return digikey access token status
    RegenerateExternalAccessToken: (req) => {
        const { ExternalAPIConfigurationSettings } = req.app.locals.models;
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_CODE,
            path: DigiKey.CODEGETAPI,
            headers: {
                'Content-Type': DigiKey.CONTENT_TYPE_CODE
            },
            maxRedirects: DigiKey.MaxRedirects
        };

        return new Promise((resolve) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                // eslint-disable-next-line consistent-return
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    var responseParts = JSON.parse(body.toString());
                    if (req.accessToken === responseParts.access_token) {
                        resolve(STATE.FAILED);
                    } else if (responseParts.access_token && responseParts.refresh_token) {
                        const updateObject = {
                            refreshToken: responseParts.refresh_token,
                            accessToken: responseParts.access_token
                        };
                        return ExternalAPIConfigurationSettings.update(updateObject, {
                            where: {
                                id: req.id
                            },
                            fields: ['refreshToken', 'accessToken']
                        }).then(() => {
                            resolve(STATE.SUCCESS);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            resolve(STATE.FAILED);
                        });
                    } else {
                        resolve(STATE.FAILED);
                    }
                });
                responseDK.on('error', (err) => {
                    console.trace();
                    console.error(err);
                    resolve(STATE.FAILED);
                });
            });
            var postData = qs.stringify({
                grant_type: DigiKey.REFRESH_TOKEN,
                refresh_token: req.refreshToken,
                client_id: req.clientID,
                client_secret: req.secretID
            });

            request.write(postData);
            request.end();
        });
    },

    // check digikey regenerate access token expired or not
    // Get:/api/v1/pricing/RegenerateExternalAccessTokenV3
    // @return digikey access token status
    RegenerateExternalAccessTokenV3: (req) => {
        const { ExternalAPIConfigurationSettings } = req.app.locals.models;
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_API,
            path: DigiKey.CODEGETAPIV3,
            headers: {
                'Content-Type': DigiKey.CONTENT_TYPE_CODE
            },
            maxRedirects: DigiKey.MaxRedirects
        };

        return new Promise((resolve) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                // eslint-disable-next-line consistent-return
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    var responseParts = JSON.parse(body.toString());
                    if (req.accessToken === responseParts.access_token) {
                        resolve(STATE.FAILED);
                    } else if (responseParts.access_token && responseParts.refresh_token) {
                        const updateObject = {
                            refreshToken: responseParts.refresh_token,
                            accessToken: responseParts.access_token
                        };
                        return ExternalAPIConfigurationSettings.update(updateObject, {
                            where: {
                                id: req.id
                            },
                            fields: ['refreshToken', 'accessToken']
                        }).then(() => {
                            resolve(STATE.SUCCESS);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            resolve(STATE.FAILED);
                        });
                    } else {
                        resolve(STATE.FAILED);
                    }
                });
                responseDK.on('error', (err) => {
                    console.trace();
                    console.error(err);
                    resolve(STATE.FAILED);
                });
            });
            var postData = qs.stringify({
                grant_type: DigiKey.REFRESH_TOKEN,
                refresh_token: req.refreshToken,
                client_id: req.clientID,
                client_secret: req.secretID
            });

            request.write(postData);
            request.end();
        });
    },

    // Get Pricing Detail for part number
    // POST : /api/v1/pricing/getPartDetail
    // @return Part number details
    // eslint-disable-next-line consistent-return
    getPartDetail: (req, res) => {
        const { ExternalAPIConfigurationSettings } = req.app.locals.models;
        if (req.body.pricingObj) {
            const priceDetail = req.body.pricingObj;
            ExternalAPIConfigurationSettings.findOne({
                where: {
                    defaultAccess: true,
                    appID: DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATE,
                    supplierID: DATA_CONSTANT.PRICING_SUPPLIER[0].ID
                },
                attributes: ['secretID', 'clientID', 'accessToken', 'specialPriceCustomerID', 'perCallRecordCount']
            }).then(settings => module.exports.getDigiKeyword(req, priceDetail.partNo, settings.accessToken, settings.clientID, priceDetail.isCustom ? settings.specialPriceCustomerID : '', settings.perCallRecordCount).then((digikey) => {
                const PromisesData = [];
                if (digikey.PartObject.httpCode === Pricing.ERR_AUTH) {
                    const digikeyResponse = {
                        DigiKeyClientID: settings.clientID,
                        digikey: digikey.PartObject
                    };
                    return resHandler.successRes(res, 200, STATE.SUCCESS, digikeyResponse);
                } else if (digikey.PartObject.httpCode === Pricing.ERR_RATE) {
                    const digikeyResponse = {
                        DigiKeyIssue: digikey.PartObject.httpCode,
                        Message: digikey.PartObject.moreInformation,
                        digikey: digikey.PartObject
                    };
                    return resHandler.successRes(res, 200, STATE.FAILED, digikeyResponse);
                } else if (digikey.PartObject.Parts.length === 0) {
                    const digikeyResponse = {
                        DigiKeyClientID: settings.clientID,
                        digikey: digikey.PartObject
                    };
                    return resHandler.successRes(res, 200, STATE.SUCCESS, digikeyResponse);
                }
                for (let i = 1; i <= digikey.PartObject.Parts.length; i += 1) {
                    PromisesData.push(module.exports.getdigiPartDetail(req, digikey.PartObject.Parts[i - 1].DigiKeyPartNumber, settings.accessToken, settings.clientID, priceDetail.isCustom ? settings.specialPriceCustomerID : '').then(digikeyPartsearch =>
                        digikeyPartsearch
                    ));
                }
                return Promise.all(PromisesData).then((digikeyResponse) => {
                    digikey.PartObject.Parts = _.map(digikeyResponse, 'PartDetails');
                    digikey.PartObject.Header = digikeyResponse[0].header;
                    const digikeyResponses = {
                        DigiKeyClientID: settings.clientID,
                        digikey: digikey.PartObject
                    };
                    return resHandler.successRes(res, 200, STATE.SUCCESS, digikeyResponses);
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.FAILED, null);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Pricing Detail for part number
    // POST : /api/v1/pricing/getPartDetail
    // @return Part number details
    // eslint-disable-next-line consistent-return
    getPartDetailVersion3: (req, res) => {
        const { ExternalAPIConfigurationSettings } = req.app.locals.models;
        if (req.body.pricingObj) {
            const priceDetail = req.body.pricingObj;
            ExternalAPIConfigurationSettings.findOne({
                where: {
                    defaultAccess: true,
                    appID: DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3,
                    supplierID: DATA_CONSTANT.PRICING_SUPPLIER[0].ID
                },
                attributes: ['secretID', 'clientID', 'accessToken', 'specialPriceCustomerID', 'perCallRecordCount']
                // eslint-disable-next-line consistent-return
            }).then(settings => module.exports.getDigiKeywordVersion3(req, priceDetail.partNo, settings.accessToken, settings.clientID, priceDetail.isCustom ? settings.specialPriceCustomerID : '', settings.perCallRecordCount).then((digikey) => {
                const PromisesData = [];
                if (digikey.PartObject.StatusCode) {
                    if (digikey.PartObject.StatusCode === Pricing.ERR_AUTH) {
                        const digikeyResponse = {
                            DigiKeyClientID: settings.clientID,
                            appID: DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJT_SCHEDULE_PARTUPDATEV3,
                            digikey: digikey.PartObject
                        };
                        return resHandler.successRes(res, 200, STATE.SUCCESS, digikeyResponse);
                    } else if (digikey.PartObject.StatusCode === Pricing.ERR_RATE) {
                        const digikeyResponse = {
                            DigiKeyIssue: digikey.PartObject.StatusCode,
                            Message: digikey.PartObject.moreInformation,
                            digikey: digikey.PartObject
                        };
                        return resHandler.successRes(res, 200, STATE.FAILED, digikeyResponse);
                    }
                }
                if (digikey.PartObject.Products.length === 0) {
                    const digikeyResponse = {
                        DigiKeyClientID: settings.clientID,
                        digikey: digikey.PartObject
                    };
                    return resHandler.successRes(res, 200, STATE.SUCCESS, digikeyResponse);
                }
                for (let i = 1; i <= digikey.PartObject.Products.length; i += 1) {
                    PromisesData.push(module.exports.getdigiPartDetailV3(req, digikey.PartObject.Products[i - 1].DigiKeyPartNumber, settings.accessToken, settings.clientID, priceDetail.isCustom ? settings.specialPriceCustomerID : '').then(digikeyPartsearch => digikeyPartsearch));
                }
                Promise.all(PromisesData).then((digikeyResponse) => {
                    digikey.PartObject.Products = digikeyResponse;
                    digikey.PartObject.Header = digikeyResponse[0].header;
                    const digikeyResponses = {
                        DigiKeyClientID: settings.clientID,
                        digikey: digikey.PartObject
                    };
                    return resHandler.successRes(res, 200, STATE.SUCCESS, digikeyResponses);
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.FAILED, null);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get Avnet Part number  detail
    // GET : /api/v1/pricing/getAvnetPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getAvnetPartDetail: (req, res) => {
        const { Settings } = req.app.locals.models;
        if (req.body) {
            Settings.findAll({
                where: {
                    clusterName: Pricing.AvnetCluster
                },
                attributes: ['id', 'key', 'values', 'clusterName']
            }).then((AvnetKeys) => {
                const avnetAPI = _.find(AvnetKeys, avnet => avnet.key === Pricing.AvnetAPIPath);
                const AvnetSubscriptionKey = _.find(AvnetKeys, avnet => avnet.key === Pricing.AvnetSubscriptionKey);
                const AvnetStoreID = _.find(AvnetKeys, avnet => avnet.key === Pricing.AvnetStoreID);
                const AvnetHostName = _.find(AvnetKeys, avnet => avnet.key === Pricing.AvnetHostName);
                const pricingObj = req.body.pricingObj;
                const apiUrl = COMMON.stringFormat('{0}?STORE_ID={1}&searchTerm={2}&searchType=MFPARTNUMBER&infoLevel=COMPLETE', avnetAPI.values,
                    AvnetStoreID.values, pricingObj.partNo);
                const options = {
                    method: Avnet.GET,
                    hostname: AvnetHostName.values,
                    path: apiUrl,
                    headers: {
                        Accept: Avnet.ACCEPT,
                        'cache-control': Avnet.CACHE,
                        'Ocp-Apim-Subscription-Key': AvnetSubscriptionKey.values
                    },
                    maxRedirects: 20
                };
                const request = redirectshttps.request(options, (responseRequest) => {
                    var chunks = [];
                    responseRequest.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    responseRequest.on('end', () => {
                        var body = Buffer.concat(chunks);
                        return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                    });
                });
                request.end();
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Mouser Part number  detail
    // GET : /api/v1/pricing/getMouserJsonPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getMouserJsonPartDetail: (req, res) => {
        const { Settings } = req.app.locals.models;
        if (req.body) {
            Settings.findOne({
                where: {
                    key: Pricing.MouserApiKey
                },
                attributes: ['id', 'key', 'values']
            }).then((settingsData) => {
                const apiPath = COMMON.stringFormat(Mouser.MO_API_PATH, settingsData.values);
                var options = {
                    method: Mouser.POST,
                    url: apiPath,
                    headers: {
                        'Content-Type': Mouser.CONTENT_TYPE
                    },
                    body: JSON.stringify({ SearchByPartRequest: { mouserPartNumber: req.body.pricingObj.partNo } })
                };
                Request(options, function (error, responseMO) {
                    if (error) throw new Error(error);
                    return resHandler.successRes(res, 200, STATE.SUCCESS, responseMO.body);
                });
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Heilind Part number  detail
    // GET : /api/v1/pricing/getHeilindPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getHeilindPartDetail: (req, res) => {
        const { Settings } = req.app.locals.models;
        if (req.body) {
            Settings.findAll({
                where: {
                    clusterName: Pricing.HeilindCluster
                },
                attributes: ['id', 'key', 'values', 'clusterName']
            }).then((heilindApiKeys) => {
                const heilindPartner = _.find(heilindApiKeys, avnet => avnet.key === Pricing.HeilindPartner);
                const heilindToken = _.find(heilindApiKeys, avnet => avnet.key === Pricing.HeilindToken);
                const pricingObj = req.body.pricingObj;
                const options = {
                    method: HEILIND.GET,
                    hostname: HEILIND.HOST,
                    path: COMMON.stringFormat('/parts?partner={0}&partstring={1}', heilindPartner.values, pricingObj.partNo),
                    headers: {
                        Authorization: COMMON.stringFormat('Basic {0}', heilindToken.values)
                    },
                    maxRedirects: 20
                };
                const request = redirectshttps.request(options, (responseRequest) => {
                    var chunks = [];
                    responseRequest.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    responseRequest.on('end', () => {
                        var body = Buffer.concat(chunks);
                        return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                    });
                });
                request.end();
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Newark Part number  detail
    // GET : /api/v1/pricing/getNewarkPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getNewarkPartDetail: (req, res) => {
        const { Settings } = req.app.locals.models;
        if (req.body) {
            const pricingObj = req.body.pricingObj;
            Settings.findAll({
                where: {
                    key: [Pricing.NewarkCustomerID, Pricing.NewarkSecretKey, Pricing.NewarkApiKey]
                },
                attributes: ['id', 'key', 'values', 'clusterName']
            }).then((Newarks) => {
                const NewarkKey = _.find(Newarks, newark => newark.key === Pricing.NewarkApiKey);
                const NewarkSecretKey = _.find(Newarks, newark => newark.key === Pricing.NewarkSecretKey);
                const NewarkCustomer = _.find(Newarks, newark => newark.key === Pricing.NewarkCustomerID);
                var iscustom = JSON.parse(pricingObj.isCustom);
                let apiUrl = COMMON.stringFormat('{0}?term=manuPartNum:{1}&storeInfo.id={2}&resultsSettings.responseGroup=large&callInfo.omitXmlSchema=false&callInfo.responseDataFormat=json&callinfo.apiKey={3}', Newark.API, pricingObj.partNo, Newark.SEARCH_ID, NewarkKey.values);
                if (iscustom) {
                    const currDateTime = ((new Date()).toISOString()).replace('Z', '');// (moment().format(currentTime,'yyyy-MM-ddTHH:mm:ss.fff'));
                    const signature = COMMON.stringFormat('{0}{1}', 'searchByManufacturerPartNumber', currDateTime);
                    let key = CryptoJS.HmacSHA1(signature, NewarkSecretKey.values);
                    key = CryptoJS.enc.Base64.stringify(key);
                    apiUrl = COMMON.stringFormat('{0}?term=manuPartNum:{1}&storeInfo.id={2}&resultsSettings.responseGroup=large&callInfo.omitXmlSchema=false&callInfo.responseDataFormat=json&callinfo.apiKey={3}&userInfo.signature={4}&userInfo.timestamp={5}&userInfo.customerId={6}', Newark.API, pricingObj.partNo, Newark.SEARCH_ID, NewarkKey.values, key, currDateTime, NewarkCustomer.values);
                }
                const options = {
                    method: Newark.GET,
                    hostname: Newark.HOST,
                    path: apiUrl,
                    headers: {
                        'cache-control': Newark.CACHE
                    }
                };
                const request = http.request(options, (responseNW) => {
                    var chunks = [];
                    responseNW.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    responseNW.on('end', () => {
                        var body = Buffer.concat(chunks);
                        return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                    });
                });
                request.end();
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Mouser Part number  detail
    // GET : /api/v1/pricing/getMouserPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getMouserPartDetail: (req, res) => {
        const { Settings } = req.app.locals.models;
        if (req.body) {
            Settings.findOne({
                where: {
                    key: Pricing.MouserApiKey
                },
                attributes: ['id', 'key', 'values']
            }).then((settingsData) => {
                if (settingsData) {
                    const mouserkey = settingsData.values;

                    const pricingObj = req.body.pricingObj;
                    const data = COMMON.stringFormat('<soap:Envelope xmlns:soap="{0}">\r\n <soap:Header>\r\n <MouserHeader xmlns="{1}">\r\n <AccountInfo>\r\n <PartnerID>{2}</PartnerID>\r\n </AccountInfo>\r\n </MouserHeader>\r\n </soap:Header>\r\n<soap:Body>\r\n<SearchByPartNumber xmlns="{1}">\r\n <mouserPartNumber>{3}</mouserPartNumber>\r\n<partSearchOptions>id</partSearchOptions>\r\n    </SearchByPartNumber>\r\n </soap:Body>\r\n</soap:Envelope>', Mouser.SOAP_URI, Mouser.HEADER, mouserkey, pricingObj.partNo);
                    const xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;
                    // eslint-disable-next-line func-names
                    // eslint-disable-next-line consistent-return
                    xhr.addEventListener('readystatechange', function () {
                        if (this.readyState === 4) {
                            const result = convert.xml2json(this.responseText, { compact: true, spaces: 4 });
                            return resHandler.successRes(res, 200, STATE.SUCCESS, result);
                        }
                    });
                    xhr.open(Mouser.POST, Mouser.API);
                    xhr.setRequestHeader('content-type', Mouser.CONTENT);
                    xhr.setRequestHeader('cache-control', Mouser.CACHE);
                    xhr.send(data);
                }
            }).catch(() => resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER)));
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get Arrow Part number  detail
    // GET : /api/v1/pricing/getArrowPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getArrowPartDetail: (req, res) => {
        if (req.body) {
            const pricingObj = req.body.pricingObj;
            const apiUrl = COMMON.stringFormat(Arrow.PATH_URL, Arrow.LOGIN, Arrow.API_KEY, pricingObj.partNo);
            const options = {
                method: Arrow.GET,
                hostname: Arrow.HOST,
                path: apiUrl,
                headers: {
                    'cache-control': Arrow.NO_CACHE
                }
            };
            const request = Arrowhttp.request(options, (responseAR) => {
                var chunks = [];
                responseAR.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseAR.on('end', () => {
                    var body = Buffer.concat(chunks);
                    return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                });
            });
            request.end();
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get TTI Part number  detail
    // GET : /api/v1/pricing/getTTIPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getTTIPartDetail: (req, res) => {
        if (req.body) {
            const pricingObj = req.body.pricingObj;
            const apiUrl = COMMON.stringFormat(TTI.PATH_URL, pricingObj.partNo, TTI.ACCESS_TOKEN, TTI.SOURCE);
            const options = {
                method: TTI.GET,
                hostname: TTI.HOST,
                path: apiUrl,
                headers: {
                    'user-agent': TTI.HEADER,
                    'cache-control': TTI.NO_CACHE
                }
            };
            const request = http.request(options, (responseTTI) => {
                var chunks = [];
                responseTTI.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseTTI.on('end', () => {
                    var body = Buffer.concat(chunks);
                    return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                });
            });
            request.end();
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get OctoPart Part number  detail
    // GET : /api/v1/pricing/getOctoPartDetail
    // @param {partno} varchar
    // @return part number detail
    // eslint-disable-next-line consistent-return
    getOctoPartDetail: (req, res) => {
        if (req.body) {
            const pricingObj = req.body.pricingObj;
            const { Settings } = req.app.locals.models;
            const partno = pricingObj.partNo;
            Settings.findAll({
                where: {
                    key: [Pricing.OctoPartApiKey]
                },
                attributes: ['id', 'key', 'values', 'clusterName']
                // eslint-disable-next-line consistent-return
            }).then((octos) => {
                if (octos && octos.length > 0) {
                    const OctoPartKey = _.find(octos, octo => octo.key === Pricing.OctoPartApiKey);
                    const apiUrl = COMMON.stringFormat(OctoPart.PATH_URL, OctoPartKey.values, partno);
                    const options = {
                        method: OctoPart.GET,
                        hostname: OctoPart.HOST,
                        path: apiUrl,
                        headers: {
                            'content-type': OctoPart.ACCEPT,
                            'cache-control': OctoPart.NO_CACHE
                        }
                    };
                    const request = http.request(options, (responseOCT) => {
                        var chunks = [];

                        responseOCT.on('data', (chunk) => {
                            chunks.push(chunk);
                        });

                        responseOCT.on('end', () => {
                            var body = Buffer.concat(chunks);
                            return resHandler.successRes(res, 200, STATE.SUCCESS, body.toString());
                        });
                    });
                    request.end();
                } else {
                    return resHandler.errorRes(res,
                        200,
                        STATE.FAILED,
                        new NotFound(MESSAGE_CONSTANT.NOT_FOUND(Pricing.OctoPartApiKey)));
                }
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    getComponentVerification: (req, res) => {
        const { sequelize, Settings } = req.app.locals.models;
        if (req.body) {
            return Settings.findOne({
                where: {
                    key: DATA_CONSTANT.PricingServiceStatus
                },
                attributes: ['id', 'values']
            }).then((settingsExt) => {
                if (settingsExt && settingsExt.values === DATA_CONSTANT.Pricing_Start_Status) {
                    const pricingObj = req.body;
                    if (pricingObj.partID) {
                        const myquery = { partID: pricingObj.partID };
                        if (pricingObj.transactionID) {
                            myquery.transactionID = pricingObj.transactionID;
                        }
                        if (pricingObj.isAppend) {
                            return module.exports.proceedExternalCall(req, res, pricingObj);
                        } else {
                            return module.exports.removeBOMStatus(req, myquery).then(() => sequelize.query('CALL Sproc_removeExternalVerifiedPart (:pPartID,:ptransactionID,:pPartNumber)',
                                {
                                    replacements: {
                                        pPartID: pricingObj.partID,
                                        ptransactionID: pricingObj.transactionID || null,
                                        pPartNumber: pricingObj.importMPN || null
                                    }
                                })
                                .then(() => {
                                    return module.exports.proceedExternalCall(req, res, pricingObj);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, 200, STATE.FAILED, null);
                                }));
                        }
                    } else {
                        return resHandler.errorRes(res, 200, STATE.FAILED, null);
                    }
                } else {
                    return resHandler.errorRes(res,
                        200,
                        STATE.FAILED,
                        MESSAGE_CONSTANT.BOM.PricingStatus);
                }
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    /// proceed External call internalcall
    proceedExternalCall: (req, res, pricingObj) => {
        const { ComponentBOMSetting, ExternalPartVerificationRequestLog } = req.app.locals.models;
        var partList = _.uniqBy(pricingObj.parts, 'partNumber');
        var bomMFRList = _.uniqBy(pricingObj.bomMFR, 'mfgName');
        var bomSupplierList = _.uniqBy(pricingObj.bomSupplier, 'supplierName');
        const mfgPromises = [];
        if (bomMFRList.length > 0) {
            mfgPromises.push(module.exports.getMFRVerification(req, bomMFRList));
        }
        if (bomSupplierList.length > 0) {
            mfgPromises.push(module.exports.getSupplierVerification(req, bomSupplierList));
        }

        return Promise.all(mfgPromises).then(() => {
            if (partList.length === 0) {
                return resHandler.successRes(res, 200, STATE.SUCCESS, 2);
            } else {
                const assyObj = {
                    updatedBy: req.user.id,
                    exteranalAPICallStatus: 0
                };
                const promises = [];
                promises.push(ComponentBOMSetting.update(assyObj, {
                    where: {
                        refComponentID: pricingObj.partID,
                        isDeleted: false
                    },
                    fields: ['exteranalAPICallStatus', 'updatedBy']
                }));
                promises.push(ExternalPartVerificationRequestLog.bulkCreate(partList, {
                    individualHooks: true,
                    returning: true,
                    fields: ['partID', 'partNumber', 'partStatus', 'supplier', 'type']
                }).then(() => STATE.SUCCESS));
                return Promise.all(promises).then(() => {
                    var channel = global.channel;
                    var queue = pricingObj.DKVersion === DATA_CONSTANT.DIGIKEY_VERSION.DKV2 ? DATA_CONSTANT.SERVICE_QUEUE_PART.BOM_CLEAN_QUEUE : DATA_CONSTANT.SERVICE_QUEUE_PART.BOM_CLEANV3_QUEUE;
                    channel.assertQueue(queue, { durable: false, autoDelete: false, exclusive: false });
                    _.each(partList, (apiPart) => {
                        apiPart.userID = req.user.id;
                        apiPart.employeeID = req.user.employeeID;
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(apiPart)));
                    });
                    return resHandler.successRes(res, 200, STATE.SUCCESS, 0);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.FAILED, null);
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.FAILED, null);
        });
    },
    getPartDetailFromExternalApi: (req, res) => {
        const { Settings, ExternalPartVerificationRequestLog } = req.app.locals.models;
        if (req.body) {
            const pricingObj = req.body;
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.DKVersion, DATA_CONSTANT.PricingServiceStatus]
                },
                attributes: ['id', 'key', 'values', 'clusterName']
            }).then((settingsExt) => {
                var status = _.find(settingsExt, pstatus => pstatus.key === DATA_CONSTANT.PricingServiceStatus);
                if (status && status.values === DATA_CONSTANT.Pricing_Start_Status) {
                    if (pricingObj.length === 0) { return resHandler.successRes(res, 200, STATE.SUCCESS, 0); }
                    const myquery = { transactionID: pricingObj[0].transactionID };
                    return module.exports.removeBOMStatus(req, myquery).then(() => {
                        var mfrPromises = [];
                        if (pricingObj[0].type) {
                            return ExternalPartVerificationRequestLog.findOne({
                                where: {
                                    type: pricingObj[0].type,
                                    partStatus: 0
                                },
                                attributes: ['id', 'transactionID']
                            }).then((Extsettings) => {
                                _.each(pricingObj, (objPart) => {
                                    objPart.partStatus = 0;
                                    objPart.supplier = Pricing.DIGIKEY;
                                    objPart.transactionID = Extsettings && Extsettings.transactionID ? Extsettings.transactionID : objPart.transactionID;
                                    mfrPromises.push(ExternalPartVerificationRequestLog.findOne({
                                        where: {
                                            type: objPart.type,
                                            partStatus: 0,
                                            partID: objPart.partID,
                                            partNumber: objPart.partNumber
                                        },
                                        attributes: ['id', 'transactionID']
                                    }).then((logExternal) => {
                                        if (!logExternal) {
                                            return ExternalPartVerificationRequestLog.create(objPart, {
                                                attributes: ['partStatus', 'supplier', 'transactionID', 'partNumber', 'type', 'partID']
                                            }).then(() => STATE.SUCCESS).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return STATE.FAILED;
                                            });
                                        } else {
                                            objPart.isAlreadyExist = true;
                                            return STATE.SUCCESS;
                                        }
                                    }));
                                });
                                return Promise.all(mfrPromises).then(() => {
                                    var channel = global.channel;
                                    var queue = DATA_CONSTANT.SERVICE_QUEUE_PART.PART_CLEANV3_QUEUE; // settingsExt && settingsExt.values == DATA_CONSTANT.DIGIKEY_VERSION.DKV2 ? DATA_CONSTANT.SERVICE_QUEUE_PART.PART_CLEAN_QUEUE :
                                    channel.assertQueue(queue, { durable: false, autoDelete: false, exclusive: false });
                                    _.each(pricingObj, (apiPart) => {
                                        apiPart.userID = req.user.id;
                                        apiPart.employeeID = req.user.employeeID;
                                        if (!apiPart.isAlreadyExist) {
                                            channel.sendToQueue(queue, Buffer.from(JSON.stringify(apiPart)));
                                        }
                                    });
                                    RFQSocketController.sendPartUpdatedNotificationToAllUsers(req);
                                    return resHandler.successRes(res, 200, STATE.SUCCESS, 0);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, 200, STATE.FAILED, null);
                                });
                            });
                        } else {
                            _.each(pricingObj, (objPart) => {
                                objPart.partStatus = 0;
                                objPart.supplier = Pricing.DIGIKEY;
                                objPart.type = null;
                                mfrPromises.push(ExternalPartVerificationRequestLog.create(objPart, {
                                    attributes: ['partStatus', 'supplier', 'transactionID', 'partNumber', 'partID', 'type']
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                }));
                            });
                            return Promise.all(mfrPromises).then(() => {
                                var channel = global.channel;
                                var queue = DATA_CONSTANT.SERVICE_QUEUE_PART.PART_CLEANV3_QUEUE; // settingsExt && settingsExt.values == DATA_CONSTANT.DIGIKEY_VERSION.DKV2 ? DATA_CONSTANT.SERVICE_QUEUE_PART.PART_CLEAN_QUEUE :
                                channel.assertQueue(queue, { durable: false, autoDelete: false, exclusive: false });
                                _.each(pricingObj, (apiPart) => {
                                    apiPart.userID = req.user.id;
                                    apiPart.employeeID = req.user.employeeID;
                                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(apiPart)));
                                });
                                return resHandler.successRes(res, 200, STATE.SUCCESS, 0);
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200, STATE.FAILED, null);
                            });
                        }
                    });
                } else {
                    return resHandler.errorRes(res, 200, STATE.FAILED, MESSAGE_CONSTANT.BOM.PricingStatus);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.FAILED, MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // remove all bom status
    removeBOMStatus: (req, myquery) => {
        var mongodb = global.mongodb;
        return mongodb.collection('bomStatus').deleteMany(myquery).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // remove all bom status
    removePartStatus: (req, res) => {
        if (req.body) {
            const mongodb = global.mongodb;
            mongodb.collection('bomStatus').deleteMany({ transactionID: req.body.transactionID }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.FAILED, null);
            });
        }
    },

    // Get Pricing Detail for part number
    // POST : /api/v1/pricing/getPartDetail
    // @return Part number details
    getDiGiKeyPartDetail: (req, partNumber, AccessToken, ClientID, DKRecordCount) => {
        const parts = [];
        return module.exports.getDigiKeyword(req, partNumber, AccessToken, ClientID, '', DKRecordCount).then((digikey) => {
            const PromisesData = [];
            if (digikey.PartObject.httpCode === Pricing.ERR_AUTH) {
                return digikey.PartObject;
            } else if (digikey.PartObject.httpCode === Pricing.ERR_RATE) {
                return digikey.PartObject;
            } else if (digikey.PartObject.Parts.length === 0) {
                return digikey.PartObject;
            }
            for (let i = 1; i <= digikey.PartObject.Parts.length; i += 1) {
                // eslint-disable-next-line consistent-return
                PromisesData.push(module.exports.getdigiPartDetail(req, digikey.PartObject.Parts[i - 1].DigiKeyPartNumber, AccessToken, ClientID, '').then((digikeyPartsearch) => {
                    parts.push(digikeyPartsearch.PartDetails);
                    if (i === digikey.PartObject.Parts.length) {
                        digikey.PartObject.Parts = parts;
                        return digikey.PartObject;
                    }
                }));
            }
            return Promise.all(PromisesData).then((digikeyResponse) => {
                var objResponse = _.find(digikeyResponse, item => item !== undefined);
                return objResponse;
            });
        });
    },
    // Get digikey part number details
    // @return digikey part number
    getDigiKeyPartNumber: (req, partNumber, AccessToken, ClientID, DKRecordCount) => {
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_API,
            path: DigiKey.PARTGETAPI,
            headers: {
                authorization: AccessToken,
                accept: DigiKey.CONTENT_TYPE_PART,
                'content-type': DigiKey.CONTENT_TYPE_PART,
                'x-ibm-client-id': ClientID,
                'cache-control': DigiKey.CACHE
            }
        };
        return new Promise((resolve, reject) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    var result1 = JSON.parse(body.toString());
                    resolve(result1);
                });
                responseDK.on('error', (err) => {
                    reject(err);
                });
            });
            request.write(JSON.stringify({ Keywords: partNumber, RecordCount: DKRecordCount }));
            request.end();
        });
    },

    getDigiKeyPartNumberV3: (req, partNumber, AccessToken, ClientID, DKRecordCount) => {
        var options = {
            method: DigiKey.POST,
            hostname: DigiKey.HOST_NAME_API,
            path: DigiKey.PARTGETAPIV3,
            headers: {
                Accept: DigiKey.CONTENT_TYPE_PART,
                Authorization: COMMON.stringFormat('Bearer {0}', AccessToken),
                'Content-Type': DigiKey.CONTENT_TYPE_PART,
                'X-DIGIKEY-Client-Id': ClientID,
                'cache-control': DigiKey.CACHE
            }
        };
        return new Promise((resolve, reject) => {
            var request = http.request(options, (responseDK) => {
                var chunks = [];
                responseDK.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                responseDK.on('end', () => {
                    var body = Buffer.concat(chunks);
                    const parts = JSON.parse(body.toString());
                    resolve(parts);
                });
                responseDK.on('error', (err) => {
                    reject(err);
                });
            });
            request.write(JSON.stringify({ Keywords: partNumber, RecordCount: DKRecordCount }));
            request.end();
        });
    },

    // Get digikey part number details
    // @return digikey part number
    getManufacturerDetail: (req, manufacturerName, type) => {
        const { MfgCodeMst, MfgCodeAlias, sequelize } = req.app.locals.models;
        var mfgObj = {
            mfgCodeID: null,
            mfgCode: null,
            mfgName: null
        };
        manufacturerName = manufacturerName ? manufacturerName.toUpperCase() : manufacturerName;
        const mfgCodeMstPromise = MfgCodeMst.findOne({
            where: {
                mfgCode: manufacturerName,
                isDeleted: false,
                isActive: true,
                mfgType: type
            },
            attributes: ['id', 'mfgCode', 'mfgName', 'isCustOrDisty', 'salesCommissionTo',
                [sequelize.fn('fun_getUserNameByID', sequelize.col('MfgCodeMst.createdBy')), 'employeeName'],
                [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('MfgCodeMst.createdAt')), 'createdAt']]
        });

        const mfgCodeAliasPromise = MfgCodeAlias.findOne({
            where: {
                alias: manufacturerName,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'mfgcodeId',
                [sequelize.fn('fun_getUserNameByID', sequelize.col('MfgCodeAlias.createdBy')), 'employeeName'],
                [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('MfgCodeAlias.createdAt')), 'createdAt']],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    deletedAt: null,
                    mfgType: type
                },
                attributes: ['id', 'mfgCode', 'mfgName', 'mfgType', 'isCustOrDisty']
            }]
        });
        const promises = [mfgCodeMstPromise, mfgCodeAliasPromise];
        return Promise.all(promises).then((responses) => {
            var mfgCodeMst = responses[0];
            var mfgCodeAlias = responses[1];
            if (mfgCodeMst) {
                mfgObj.mfgCodeID = mfgCodeMst.id;
                mfgObj.salesCommissionTo = mfgCodeMst.salesCommissionTo;
                mfgObj.mfgCode = mfgCodeMst.mfgCode;
                mfgObj.mfgName = mfgCodeMst.mfgName;
                mfgObj.employeeName = mfgCodeMst.dataValues.employeeName;
                mfgObj.createdAt = mfgCodeMst.dataValues.createdAt;
                mfgObj.isCustOrDisty = mfgCodeMst.dataValues.isCustOrDisty;
            } else if (mfgCodeAlias && mfgCodeAlias.mfgCodemst && mfgCodeAlias.mfgCodemst.mfgType === type) {
                mfgObj.mfgCodeID = mfgCodeAlias.mfgcodeId;
                mfgObj.mfgCode = mfgCodeAlias.mfgCodemst.mfgCode;
                mfgObj.mfgName = mfgCodeAlias.mfgCodemst.mfgName;
                mfgObj.employeeName = mfgCodeAlias.dataValues.employeeName;
                mfgObj.createdAt = mfgCodeAlias.dataValues.createdAt;
                mfgObj.mfgCodeAliasID = mfgCodeAlias.id;
                mfgObj.isCustOrDisty = mfgCodeAlias.mfgCodemst.isCustOrDisty;
            }
            mfgObj.AliasNotExists = !mfgCodeAlias ? true : false;
            return mfgObj;
        }).catch((err) => {
            mfgObj.status = STATE.FAILED;
            console.trace();
            console.error(err);
            return mfgObj;
        });
    },

    digikeyAccessToken: (req, res) => {
        const { Settings } = req.app.locals.models;
        return Settings.findAll({
            where: {
                key: [Pricing.DigiKeyAccessToken, Pricing.DigiKeyClientID],
                clusterName: Pricing.DigiKeyCluster
            },
            attributes: ['id', 'key', 'values', 'clusterName']
        }).then((responseSettings) => {
            if (responseSettings.length > 1) {
                const digiKeyToken = _.find(responseSettings, token => token.key === Pricing.DigiKeyAccessToken);
                return resHandler.successRes(res, 200, STATE.SUCCESS, digiKeyToken.values);
            } else {
                return resHandler.successRes(res, 200, STATE.SUCCESS, '');
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // manage status for component verification
    // @return component status message
    saveComponentStatus: (req, statusObject) => {
        var mongodb = global.mongodb;
        return mongodb.collection('bomStatus').findOne({ partNumber: statusObject.partNumber, partID: statusObject.partID, errorType: statusObject.ErrorType }).then((result) => {
            if (result != null) {
                const myquery = { partNumber: statusObject.partNumber, partID: statusObject.partID, errorType: statusObject.ErrorType };
                const newvalues = { $set: { errorMsg: statusObject.Message, errorType: statusObject.ErrorType, MFGCode: statusObject.MFGCode, Type: statusObject.Type, PIDCode: statusObject.PIDCode, ClientID: statusObject.ClientID, ActualPart: statusObject.ActualPart, DataField: statusObject.DataField, CategoryID: statusObject.CategoryID, mountingTypeID: statusObject.mountingTypeID, partType: statusObject.partType, Source: statusObject.Source, appID: statusObject.appID } };
                return mongodb.collection('bomStatus').updateOne(myquery, newvalues).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
            } else {
                const bomStatus = {
                    partID: statusObject.partID,
                    partNumber: statusObject.partNumber,
                    errorMsg: statusObject.Message,
                    errorType: statusObject.ErrorType,
                    MFGCode: statusObject.MFGCode,
                    Type: statusObject.Type,
                    PIDCode: statusObject.PIDCode,
                    ClientID: statusObject.ClientID,
                    ActualPart: statusObject.ActualPart,
                    DataField: statusObject.DataField,
                    CategoryID: statusObject.CategoryID,
                    mountingTypeID: statusObject.mountingTypeID,
                    partType: statusObject.partType,
                    Source: statusObject.Source,
                    appID: statusObject.appID
                };
                const ObjectID = Bson.ObjectID;
                // eslint-disable-next-line no-underscore-dangle
                bomStatus._id = new ObjectID();
                return mongodb.collection('bomStatus').insertOne(bomStatus).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },


    // get mounting type id from table
    // @return mounting type id
    getMountingTypeID: (req, mountintypetext) => {
        const { RFQMountingType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var mountObj = {
            mountTypeID: null
        };
        var rfqMountMstPromise = RFQMountingType.findOne({
            where: {
                name: mountintypetext,
                isDeleted: false
            },
            attributes: ['id', 'name']
        });
        var componentFieldAliasPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                refTableName: DATA_CONSTANT.MOUNTING_TYPE.TableName,
                alias: mountintypetext,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });
        var allPromises = [rfqMountMstPromise, componentFieldAliasPromise];
        return Promise.all(allPromises).then((responses) => {
            var mountMst = responses[0];
            var componentCodeAlias = responses[1];
            if (mountMst) {
                mountObj.mountTypeID = mountMst.id;
            } else if (componentCodeAlias) {
                mountObj.mountTypeID = componentCodeAlias.refId;
            }
            return mountObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return mountObj;
        });
    },

    // get connecter type id from table
    // @return connecter type id
    getConnecterTypeID: (req, connectorTypeText) => {
        const { RFQConnecterType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var connectObj = {
            connecterTypeID: null
        };
        var rfqConnecterMstPromise = RFQConnecterType.findOne({
            where: {
                name: connectorTypeText,
                isDeleted: false
            },
            attributes: ['id', 'name']
        });
        var componentFieldAliasPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                refTableName: DATA_CONSTANT.CONNECTER_TYPE.TableName,
                alias: connectorTypeText,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });
        var allPromises = [rfqConnecterMstPromise, componentFieldAliasPromise];
        return Promise.all(allPromises).then((responses) => {
            var connecteMst = responses[0];
            var componentCodeAlias = responses[1];
            if (connecteMst) {
                connectObj.connecterTypeID = connecteMst.id;
            } else if (componentCodeAlias) {
                connectObj.connecterTypeID = componentCodeAlias.refId;
            }
            return connectObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return connectObj;
        });
    },

    // get connecter type id from table
    // @return connecter type id
    getPackagingTypeID: (req, packagingTypeText) => {
        const { ComponentPackagingMst, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var packageObj = {
            packagingTypeID: null
        };
        var rfqPackagingMstPromise = ComponentPackagingMst.findOne({
            where: {
                name: packagingTypeText,
                isDeleted: false
            },
            attributes: ['id', 'name']
        });
        var componentFieldAliasPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                refTableName: DATA_CONSTANT.PACKAGING_TYPE.refTransTableName,
                alias: packagingTypeText,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });
        var allPromises = [rfqPackagingMstPromise, componentFieldAliasPromise];
        return Promise.all(allPromises).then((responses) => {
            var packagingMst = responses[0];
            var componentCodeAlias = responses[1];
            if (packagingMst) {
                packageObj.packagingTypeID = packagingMst.id;
            } else if (componentCodeAlias) {
                packageObj.packagingTypeID = componentCodeAlias.refId;
            }
            return packageObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return packageObj;
        });
    },

    // get rohs exist or not from table
    // @return rohs exist
    getRohsValid: (req, rohstext) => {
        const { sequelize } = req.app.locals.models;
        var objRoHs = {
            id: null,
            name: null
        };
        return sequelize
            .query('CALL Sproc_GetRohsValid (:prohstext)',
                {
                    replacements: {
                        prohstext: rohstext ? rohstext : null
                    }
                })
            .then((responseRohs) => {
                if (responseRohs.length > 0) {
                    const rohsData = responseRohs[0];
                    objRoHs = rohsData;
                }
                return objRoHs;
            }).catch((err) => {
                console.trace();
                console.error(err);
                return objRoHs;
            });
    },

    // get cost category exist or not from table
    // @return cost category id
    getCostCategory: (req, price) => {
        const { sequelize } = req.app.locals.models;
        var objcategory = {
            id: null
        };
        return sequelize
            .query('CALL Sproc_getPriceCategory (:price)',
                {
                    replacements: {
                        price: price ? price : null
                    }
                })
            .then((responseCost) => {
                if (responseCost && responseCost.length > 0) {
                    const priceCat = responseCost[0];
                    objcategory.id = priceCat ? priceCat.id : null;
                }
                return objcategory;
            }).catch((err) => {
                console.trace();
                console.error(err);
                return objcategory;
            });
    },

    // get uom id  from table
    // @return uom id id
    getUomID: (req, uomtext) => {
        const { UOMs, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var uomObj = {
            uomID: null
        };
        var uomPromise = UOMs.findOne({
            where: {
                unitName: uomtext,
                isDeleted: false
            },
            attributes: ['id', 'unitName']
        });
        var componentFieldAliasPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                refTableName: DATA_CONSTANT.UOM.TableName,
                alias: uomtext,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });
        var allPromises = [uomPromise, componentFieldAliasPromise];
        return Promise.all(allPromises).then((responses) => {
            var uomMst = responses[0];
            var componentCodeAlias = responses[1];
            if (uomMst) {
                uomObj.uomID = uomMst.id;
            } else if (componentCodeAlias) {
                uomObj.uomID = componentCodeAlias.refId;
            }
            return uomObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return uomObj;
        });
    },


    // get componnet detail from mfgcodeid and mfgpn
    // @return component id
    getComponentDetail: (req, MfgPN, mfgCode) => {
        const { Component } = req.app.locals.models;
        var objComponent = {
            id: null
        };
        var where = {
            mfgPN: MfgPN,
            isDeleted: false
        };
        if (mfgCode) { where.mfgcodeID = mfgCode; }
        return Component.findOne({
            where: where,
            attributes: ['id']
        }).then((responseCOMP) => {
            if (responseCOMP) {
                objComponent.id = responseCOMP.id;
            }
            return objComponent;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return objComponent;
        });
    },

    // get part type id from table
    // @return part type id
    getPartTypeID: (req, partTypeText) => {
        const { RFQPartType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var partTypeObj = {
            id: null,
            partTypeName: null
        };
        var partTypePromise = RFQPartType.findOne({
            where: {
                partTypeName: partTypeText,
                isDeleted: false
            },
            attributes: ['id', 'partTypeName']
        });
        var componentFieldAliasPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                refTableName: DATA_CONSTANT.PART_TYPE.refTransTableName,
                alias: partTypeText,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });
        var allPromises = [partTypePromise, componentFieldAliasPromise];
        return Promise.all(allPromises).then((responses) => {
            var partTypeMst = responses[0];
            var componentCodeAlias = responses[1];
            if (partTypeMst) {
                partTypeObj.id = partTypeMst.id;
            } else if (componentCodeAlias) {
                partTypeObj.id = componentCodeAlias.refId;
            }
            return partTypeObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return partTypeObj;
        });
    },
    // manage status for component verification
    // @return component status message
    // as per discussed with dixit sir no need to remove bad-good mapping once it mapped
    // champak caudhary
    // removeComponentStatus: (req, statusObject) => {
    //    var mongodb = global.mongodb;
    //    return mongodb.collection("bomStatus").findOne({ partNumber: statusObject.partNumber, rfqAssyID: statusObject.rfqAssyID }).then(function (result) {
    //        if (result != null) {
    //            var myquery = { partNumber: statusObject.partNumber, rfqAssyID: statusObject.rfqAssyID };
    //            return mongodb.collection("bomStatus").deleteOne(myquery, function (obj) {
    //                return STATE.SUCCESS;
    //            });
    //        }
    //        else {
    //            return STATE.SUCCESS;
    //        }
    //    });
    // },

    // Get List of pricing for part number
    // GET : /api/v1/pricingapi/retrievePricing;
    // @return List of pricing for partnumber
    retrievePricing: async (req, res) => {
        if (req.body) {
            const mongodb = global.mongodb;
            const { MfgCodeMst, sequelize } = req.app.locals.models;
            try {
                var mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            if (mongodb) {
                const pricingObj = req.body.pricingObj;
                const objPrice = {
                    IsDeleted: pricingObj.IsDeleted
                };
                if (pricingObj.refAssyID) {
                    objPrice.rfqAssyID = parseInt(pricingObj.refAssyID);
                }
                if (pricingObj.assyID) {
                    objPrice.rfqAssyID = parseInt(pricingObj.assyID);
                }
                if (pricingObj.consolidateID) {
                    objPrice.ConsolidateID = pricingObj.consolidateID;
                }
                // eslint-disable-next-line no-underscore-dangle
                if (pricingObj._id) {
                    // eslint-disable-next-line no-underscore-dangle
                    objPrice._id = new Bson.ObjectId(pricingObj._id);
                }
                if (!pricingObj.isPurchaseApi) {
                    objPrice.isPurchaseApi = { $ne: true };
                }
                const responsePricing = {};

                return await mongodb.collection('FJTMongoQtySupplier').aggregate([
                    { $match: objPrice },
                    { $lookup: { from: 'AssemblyQtyBreak', localField: '_id', foreignField: 'qtySupplierID', as: 'assemblyQtyBreak' } }
                ]).toArray((err, result) => {
                    if (err) {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                    responsePricing.pricing = result;
                    if (result.length > 0) {
                        const mfgIdList = responsePricing.pricing.reduce(function (mfgIds, wizard) {
                            mfgIds.push(wizard.mfgCodeID);
                            mfgIds.push(wizard.SupplierID);
                            return mfgIds;
                        }, []);
                        if (mfgIdList.length > 0) {
                            return MfgCodeMst.findAll({
                                attributes: ['id',
                                    [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'), mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName'],
                                ],
                                where: {
                                    id: mfgIdList
                                },
                                paranoid: false
                            }).then(response => {
                                let mfgList = [];
                                if (response && Array.isArray(response) && response.length > 0) {
                                    mfgList = response.map(a => { return { id: a.dataValues.id, mfgCodeName: a.dataValues.mfgCodeName } });
                                }
                                responsePricing.pricing.forEach((priceDet) => {
                                    const supplierDet = mfgList.find(a => a && a.id === priceDet.SupplierID);
                                    priceDet.SupplierName = supplierDet ? supplierDet.mfgCodeName : priceDet.SupplierName;
                                    const mfgDet = mfgList.find(a => a && a.id === priceDet.mfgCodeID);
                                    priceDet.ManufacturerName = mfgDet ? mfgDet.mfgCodeName : priceDet.ManufacturerName;
                                });
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responsePricing, null);
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });;
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responsePricing, null);
                        }
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responsePricing, null);
                });
            } else {
                return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            }
        } else {
            return await resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of price break for part number  
    // GET : /api/v1/pricingapi/retrievePriceBreak;
    // @return List of price  break for partnumber
    retrievePriceBreak: (req, res) => {
        if (req.body) {
            const objPrice = req.body.pricingObj;
            if (objPrice.qtySupplierID) { objPrice.qtySupplierID = new Bson.ObjectId(objPrice.qtySupplierID); }
            if (objPrice.timeStamp && objPrice.toDate) { objPrice.timeStamp = { $gte: (new Date(objPrice.timeStamp)), $lte: (new Date(objPrice.toDate)) }; } else if (objPrice.timeStamp) { objPrice.timeStamp = { $gte: new Date(objPrice.timeStamp) }; }
            if (objPrice.toDate) { delete objPrice.toDate; }
            if (objPrice.componentID && objPrice.componentID.length > 0) { objPrice.componentID = { $in: objPrice.componentID }; }
            const responsePricing = {};
            const mongodb = global.mongodb;
            return mongodb.collection('PriceBreakComponent').aggregate([
                { $match: objPrice }
            ]).toArray((err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
                responsePricing.qtyBreak = result;
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responsePricing, null);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Save Pricing for component related to Quantity
    // POST : /api/v1/pricingapi/savePriceForQuantity;
    // @return Upadted Pricing details
    savePriceForQuantity: (req, res) => {
        const { RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        if (req.body) {
            const pricingObj = req.body.pricingObj;
            const qtySupplierID = _.clone(pricingObj.qtySupplierID);
            const ConsolidateID = pricingObj.ConsolidateID;
            const mongodb = global.mongodb;
            // eslint-disable-next-line no-underscore-dangle
            const id = new Bson.ObjectId(pricingObj._id);
            const myquery = { _id: id };
            return mongodb.collection('AssemblyQtyBreak').findOne(myquery, (err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)),
                        err.errors, err.fields);
                } else {
                    // eslint-disable-next-line no-underscore-dangle
                    pricingObj._id = result._id;
                    pricingObj.qtySupplierID = result.qtySupplierID;
                    const newvalues = { $set: pricingObj };
                    return mongodb.collection('AssemblyQtyBreak').updateOne(myquery, newvalues, (errs) => {
                        if (errs) {
                            console.trace();
                            console.error(errs);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)),
                                errs.errors, errs.fields);
                        }
                        return RFQConsolidatedMFGPNLineItemQuantity.findOne({
                            where: {
                                qtyID: pricingObj.RfqAssyQtyId,
                                consolidateID: ConsolidateID,
                                rfqQtySupplierID: qtySupplierID,
                                isDeleted: false
                            },
                            attributes: ['id', 'finalPrice', 'unitPrice']
                        }).then((quantity) => {
                            if (quantity && quantity.finalPrice) {
                                const consolidateObj = {
                                    finalPrice: pricingObj.TotalDollar,
                                    unitPrice: pricingObj.PricePerPart,
                                    availableInternalStock: pricingObj.availableInternalStock,
                                    availableInternalStockTimeStamp: COMMON.getCurrentUTC(),
                                    leadTime: pricingObj.leadTime
                                };
                                return RFQConsolidatedMFGPNLineItemQuantity.update(consolidateObj, {
                                    where: {
                                        qtyID: pricingObj.RfqAssyQtyId,
                                        consolidateID: ConsolidateID,
                                        isDeleted: false
                                    },
                                    fields: ['finalPrice', 'unitPrice', 'availableInternalStock', 'availableInternalStockTimeStamp', 'leadTime']
                                }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null, null)).catch((er) => {
                                    console.trace();
                                    console.error(er);
                                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)),
                                        er.errors, er.fields);
                                });
                            } else {
                                return resHandler.successRes(res, 200, STATE.SUCCESS, null, null);
                            }
                        }).catch((error) => {
                            console.trace();
                            console.error(error);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)),
                                error.errors, error.fields);
                        });
                    });
                }
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Save final pricing for related quantity and line item
    // POST : /api/v1/pricingapi/saveFinalPrice;
    // @return Upadted Pricing details
    saveFinalPrice: (req, res) => {
        const { RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            const pricingListObj = req.body.pricingObj.pricelist;
            const Modified = req.body.pricingObj.isModified;
            const mongodb = global.mongodb;
            _.each(pricingListObj, (pricingObj) => {
                COMMON.setModelUpdatedByObjectFieldValue(req.user, pricingObj);
                pricingObj.availableInternalStockTimeStamp = COMMON.getCurrentUTC();
                if (pricingObj.rfqQtySupplierID) {
                    const myquery = { _id: new Bson.ObjectId(pricingObj.rfqQtySupplierID) };
                    promises.push(
                        mongodb.collection('FJTMongoQtySupplier').findOne(myquery).then((result) => {
                            if (result) {
                                return RFQConsolidatedMFGPNLineItemQuantity.update(pricingObj, {
                                    where: {
                                        id: pricingObj.id,
                                        isDeleted: false
                                    },
                                    fields: ['finalPrice', 'unitPrice', 'selectionMode', 'updatedBy', 'selectedMpn', 'supplier', 'min', 'mult', 'currentStock', 'leadTime', 'supplierStock', 'grossStock', 'selectedPIDCode', 'apiLead', 'componentID', 'packaging', 'rfqQtySupplierID', 'quoteQty', 'pricingSuppliers', 'pricenotselectreason', 'availableInternalStock', 'availableInternalStockTimeStamp', 'isBomUpdate', 'LOAprice', 'unitEachPrice', 'quoteQtyEach', 'supplierEachStcok', 'updatedAt', 'updateByRoleId', 'refSupplierID']
                                }).then(() => STATE.SUCCESS).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                });
                            }
                            else {
                                return STATE.FAILED;
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                } else {
                    promises.push(RFQConsolidatedMFGPNLineItemQuantity.update(pricingObj, {
                        where: {
                            id: pricingObj.id,
                            isDeleted: false
                        },
                        fields: ['finalPrice', 'unitPrice', 'selectionMode', 'updatedBy', 'selectedMpn', 'supplier', 'min', 'mult', 'currentStock', 'leadTime', 'supplierStock', 'grossStock', 'selectedPIDCode', 'apiLead', 'componentID', 'packaging', 'rfqQtySupplierID', 'quoteQty', 'pricingSuppliers', 'pricenotselectreason', 'availableInternalStock', 'availableInternalStockTimeStamp', 'isBomUpdate', 'LOAprice', 'unitEachPrice', 'quoteQtyEach', 'supplierEachStcok', 'updatedAt', 'updateByRoleId', 'refSupplierID']
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                }
            });
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, !Modified ? MESSAGE_CONSTANT.UPDATED(PricingModuleName) : null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // get pricing from mongo database based on consolidate id
    // POST : /api/v1/pricingapi/getComponentPricing;
    // @return pricing list
    getComponentPricing: (req, res) => {
        if (req.body.pricingObj) {
            const pricingObj = req.body.pricingObj;
            const mongodb = global.mongodb;
            return mongodb.collection('FJTMongoQtySupplier').find({ ConsolidateID: pricingObj.consolidateID, SourceOfPrice: pricingObj.SourceOfPrice, Packaging: pricingObj.Packaging, SupplierName: pricingObj.SupplierName, ManufacturerPartNumber: pricingObj.ManufacturerPartNumber }).toArray((err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)),
                        err.errors, err.fields);
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, result, null);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get part status list
    // @return part status id
    getPartStatusID: (req, partstatus) => {
        const { ComponentFieldsGenericaliasMst, ComponentPartStatus } = req.app.locals.models;
        var partStatusObj = {
            partStatusID: null
        };
        var rfqPartStatusMstPromise = ComponentPartStatus.findOne({
            where: {
                name: partstatus,
                isDeleted: false
            },
            attributes: ['id', 'name']
        });
        var componentFieldAliasPromise = ComponentFieldsGenericaliasMst.findOne({
            where: {
                refTableName: DATA_CONSTANT.COMPONENT_PARTSTATUS.TableName,
                alias: partstatus,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'refId']
        });
        var allPromises = [rfqPartStatusMstPromise, componentFieldAliasPromise];
        return Promise.all(allPromises).then((responses) => {
            var statusMst = responses[0];
            var componentCodeAlias = responses[1];
            if (statusMst) {
                partStatusObj.partStatusID = statusMst.id;
            } else if (componentCodeAlias) {
                partStatusObj.partStatusID = componentCodeAlias.refId;
            }
            return partStatusObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return partStatusObj;
        });
    },

    // get component list from mongo database
    // @return component list
    getComponentList: (req, searchPartNumber) => {
        var mongodb = global.mongodb;
        var compPromise = [];
        compPromise.push(mongodb.collection('component').find({ searchPartNumber: searchPartNumber }).toArray());
        return Promise.all(compPromise).then(responseComp => responseComp[0]).catch((err) => {
            console.trace();
            console.error(err);
            return [];
        });
    },
    // save duplicate component for manual
    // POST : /api/v1/pricingapi/saveCopyPricing;
    // @return saved component
    saveCopyPricing: (req, res) => {
        var mongodb = global.mongodb;
        if (req.body.copyPrice) {
            const promises = [];
            const updateTime = _.clone(req.body.copyPrice.objQtySupplier.UpdatedTimeStamp);
            const copyPrice = _.clone(req.body.copyPrice);
            // eslint-disable-next-line no-underscore-dangle
            copyPrice.objQtySupplier._id = new Bson.ObjectId();
            copyPrice.objQtySupplier.TimeStamp = moment.utc().format(COMMON.TIMESTAMP_COMMON);// MM/dd/yyyy hh:mm a
            copyPrice.objQtySupplier.UpdatedTimeStamp = moment.utc().format(COMMON.DATEFORMAT_COMMON);
            copyPrice.objQtySupplier.copyFromID = new Bson.ObjectId(copyPrice.objQtySupplier.copyFromID);
            promises.push(
                mongodb.collection('FJTMongoQtySupplier').insertOne(copyPrice.objQtySupplier).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            _.each(copyPrice.assyQtylist, (objAssyQty) => {
                // eslint-disable-next-line no-underscore-dangle
                objAssyQty._id = new Bson.ObjectId();
                // eslint-disable-next-line no-underscore-dangle
                objAssyQty.qtySupplierID = copyPrice.objQtySupplier._id;
                promises.push(
                    mongodb.collection('AssemblyQtyBreak').insertOne(objAssyQty).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    })
                );
            });
            const objPriceBreak = {
                supplier: copyPrice.objQtySupplier.SupplierName,
                supplierPN: copyPrice.objQtySupplier.SupplierPN,
                Packaging: copyPrice.objQtySupplier.Packaging,
                componentID: copyPrice.objQtySupplier.PartNumberId,
                isCustomPrice: copyPrice.objQtySupplier.PriceType === 'Standard' ? false : true,
                UpdatedTimeStamp: updateTime,
                Type: copyPrice.orgSourcePrice
            };
            // eslint-disable-next-line no-underscore-dangle
            if (copyPrice.orgSourcePrice !== 'Auto') { objPriceBreak.qtySupplierID = new Bson.ObjectId(copyPrice._id); }
            promises.push(mongodb.collection('PriceBreakComponent').find(objPriceBreak).toArray().then((result) => {
                const allPromises = [];
                _.each(result, (priceBreak) => {
                    var objPriceBreaks = priceBreak;
                    // eslint-disable-next-line no-underscore-dangle
                    objPriceBreaks._id = new Bson.ObjectId();
                    // eslint-disable-next-line no-underscore-dangle
                    objPriceBreaks.qtySupplierID = copyPrice.objQtySupplier._id;
                    objPriceBreaks.UpdatedTimeStamp = moment.utc().format(COMMON.DATEFORMAT_COMMON);
                    objPriceBreaks.timeStamp = COMMON.getCurrentUTC();
                    objPriceBreaks.leadTime = parseInt(objPriceBreaks.leadTime);
                    objPriceBreaks.Type = copyPrice.objQtySupplier.SourceOfPrice;
                    objPriceBreaks.qty = parseInt(objPriceBreaks.qty);
                    objPriceBreaks.price = parseFloat(objPriceBreaks.price);
                    allPromises.push(mongodb.collection('PriceBreakComponent').insertOne(objPriceBreaks).then(() => STATE.SUCCESS).catch(() => STATE.FAILED));
                });
                return Promise.all(allPromises).then(() => STATE.SUCCESS);
            })
                .catch(() => STATE.FAILED));
            return Promise.all(promises).then(responses => resHandler.successRes(res, 200, STATE.SUCCESS, responses, MESSAGE_CONSTANT.PRICING.MODIFY_PRICE_SAVE));
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // remove status from mongodb table
    removeComponentStatus: (req, res) => {
        var mongodb = global.mongodb;
        const statusObject = req.body.statusObject;
        var removePromise = [];
        try {
            _.each(statusObject.list, (removestatus) => {
                removePromise.push(mongodb.collection('bomStatus').findOne({ _id: new Bson.ObjectId(removestatus) }).then((result) => {
                    if (result != null) {
                        const myquery = { _id: new Bson.ObjectId(removestatus) };
                        return mongodb.collection('bomStatus').deleteOne(myquery, () => STATE.SUCCESS);
                    } else {
                        return STATE.SUCCESS;
                    }
                }));
            });
            return Promise.all(removePromise).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null, null));
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName), err: null, data: null });
        }
    },

    saveUpdatedPIDCode: (req, res) => {
        var mongodb = global.mongodb;
        if (req.body.pidObject) {
            const data = {
                PartNumber: req.body.pidObject.partNumber,
                MFGCode: req.body.pidObject.MFGCode,
                ValidPIDCode: req.body.pidObject.validPIDCode,
                PIDCode: req.body.pidObject.PIDCode,
                transactionID: req.body.pidObject.transactionID || null,
                PartID: req.body.pidObject.partID || null,
                // eslint-disable-next-line no-underscore-dangle
                timestamp: (moment.utc())._d
            };
            return mongodb.collection('partPIDCodeStatus').insertOne(data)
                .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of supplier quotes
    // POST : /api/v1/pricingapi/getSupplierQuotes
    // @return list of supplier quotes
    getSupplierQuotes: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.query.partID) {
            let partIds = (`'${req.query.partID}'`);
            if (Array.isArray(req.query.partID) && req.query.partID.length > 0) {
                partIds = (`'${req.query.partID.join('\',\'')}'`);
            }
            return sequelize.query('CALL Sproc_GetSupplierQuoteByPartID (:pPartID)', {
                replacements: {
                    pPartID: partIds
                },
                type: sequelize.QueryTypes.SELECTresponseresponseresponse
            }).then((responseQuote) => {
                if (responseQuote && responseQuote.length > 0) {
                    const promises = [];
                    const supplieQuoteIds = _.map(responseQuote, 'supplierQuoteID');
                    req.query.objSupplieQuoteIds = supplieQuoteIds;
                    promises.push(module.exports.getSupplierQuoteDetails(req, res));
                    return Promise.all(promises).then((resp) => {
                        var SupplierQuoteDetResponse = resp[0];
                        if (SupplierQuoteDetResponse && SupplierQuoteDetResponse.status === STATE.SUCCESS) {
                            SupplierQuoteDetResponse = SupplierQuoteDetResponse.data;
                        } else {
                            return SupplierQuoteDetResponse;
                        }
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { quote: responseQuote, quoteDet: SupplierQuoteDetResponse });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)),
                            err.errors, err.fields);
                    });
                } else {
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { quote: responseQuote });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(PricingModuleName)));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    getSupplierQuoteDetails: (req) => {
        const { SupplierQuoteMst, SupplierQuotePartsDet, SupplierQuotePartPrice,
            SupplierQuotePartPriceAttribute, SupplierQuotePartAttribute, ComponentPartStatus, Component, MfgCodeMst, RFQPartType, RFQMountingType, RFQRoHS, UOMs } = req.app.locals.models;
        const objSupplieQuoteIds = req.query.objSupplieQuoteIds;
        return SupplierQuoteMst.findAll({
            where: {
                id: objSupplieQuoteIds
            },
            attributes: ['id', 'supplierID', 'quoteNumber', 'quoteDate', 'reference', 'shippingAddressID', 'billingAddressID', 'quoteStatus'],
            required: false,
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: { isDeleted: false },
                attributes: ['id', 'mfgCode', 'mfgName', 'authorizeType'],
                required: false
            },
            {
                model: SupplierQuotePartsDet,
                as: 'supplier_quote_parts_det',
                where: { isDeleted: false },
                attributes: ['id', 'supplierQuoteMstID', 'partID', 'supplierPartID', 'isActive'],
                required: false,
                include: [
                    {
                        model: SupplierQuotePartPrice,
                        as: 'supplier_quote_part_price_det',
                        where: { isDeleted: false },
                        attributes: ['id', 'supplierQuotePartDetID', 'itemNumber', 'qty', 'leadTime', 'UnitOfTime', 'UnitPrice', 'min', 'mult', 'stock', 'packageID', 'reeling', 'NCNR'],
                        required: false,
                        include: [{
                            model: SupplierQuotePartPriceAttribute,
                            as: 'supplier_Quote_Part_Price_Attribute',
                            where: { isDeleted: false },
                            attributes: ['id', 'supplierQuotePartPriceID', 'attributeID', 'Price'],
                            required: false
                        }]
                    },
                    {
                        model: SupplierQuotePartAttribute,
                        as: 'supplier_quote_part_attributes',
                        where: { isDeleted: false },
                        attributes: ['id', 'supplierQuotePartDetID', 'attributeID'],
                        required: false
                    },
                    {
                        model: Component,
                        as: 'component',
                        where: { isDeleted: false },
                        attributes: ['id', 'mfgPN', 'PIDCode', 'mfgcodeID', 'partStatus', 'mfgPNDescription', 'partPackage', 'RoHSStatusID', 'noOfPosition', 'noOfRows', 'uom', 'unit', 'mountingtypeID', 'functionalCategoryID', 'imageURL', 'documentPath', 'packageQty', 'connecterTypeID'],
                        required: false,
                        include: [{
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['mfgCode', 'mfgName']
                        }, {
                            model: ComponentPartStatus,
                            as: 'componentPartStatus',
                            attributes: ['name'],
                            required: false
                        }, {
                            model: RFQPartType,
                            as: 'rfqPartType',
                            attributes: ['partTypeName'],
                            required: false
                        },
                        {
                            model: RFQMountingType,
                            as: 'rfqMountingType',
                            attributes: ['name'],
                            required: false
                        }, {
                            model: RFQRoHS,
                            as: 'rfq_rohsmst',
                            attributes: ['id', 'isActive', 'name', 'rohsIcon']
                        }, {
                            model: UOMs,
                            as: 'UOMs',
                            attributes: ['unitName'],
                            required: false
                        }]
                    },
                    {
                        model: Component,
                        as: 'supplierComponent',
                        where: { isDeleted: false },
                        attributes: ['id', 'mfgPN', 'PIDCode'],
                        required: false
                    }]
            }]
        }).then(responseQuote => ({
            status: STATE.SUCCESS,
            data: responseQuote
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                error: err
            };
        });
    },


    // clear selected price
    // POST : /api/v1/pricingapi/clearSelectedqtyPrice;
    // @return Upadted Pricing details
    clearSelectedqtyPrice: (req, res) => {
        const { RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            const objClear = {
                finalPrice: null,
                unitPrice: null,
                selectionMode: null,
                updatedBy: null,
                selectedMpn: null,
                supplier: null,
                min: null,
                mult: null,
                currentStock: null,
                leadTime: null,
                supplierStock: null,
                grossStock: null,
                selectedPIDCode: null,
                apiLead: null,
                componentID: null,
                packaging: null,
                rfqQtySupplierID: null,
                quoteQty: null,
                pricingSuppliers: null,
                pricenotselectreason: null,
                availableInternalStock: null,
                availableInternalStockTimeStamp: null,
                isBomUpdate: null,
                LOAprice: null,
                unitEachPrice: null,
                quoteQtyEach: null,
                supplierEachStcok: null
            };
            promises.push(RFQConsolidatedMFGPNLineItemQuantity.update(objClear, {
                where: {
                    consolidateID: req.body.id
                },
                fields: ['finalPrice', 'unitPrice', 'selectionMode', 'updatedBy', 'selectedMpn', 'supplier', 'min', 'mult', 'currentStock', 'leadTime', 'supplierStock', 'grossStock', 'selectedPIDCode', 'apiLead', 'componentID', 'packaging', 'rfqQtySupplierID', 'quoteQty', 'pricingSuppliers', 'pricenotselectreason', 'availableInternalStock', 'availableInternalStockTimeStamp', 'isBomUpdate', 'LOAprice', 'unitEachPrice', 'quoteQtyEach', 'supplierEachStcok']
            }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.PRICING.CLEAR_PRICE));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // stop external part update
    // POST : /api/v1/pricingapi/stopExternalPartUpdate;
    stopExternalPartUpdate: (req, res) => {
        const { ExternalPartVerificationRequestLog } = req.app.locals.models;
        if (req.body) {
            const objUpdate = {
                partStatus: 2,
                isPartVerificationStop: true
            };
            return ExternalPartVerificationRequestLog.update(objUpdate, {
                where: {
                    type: req.body.type
                },
                fields: ['partStatus', 'isPartVerificationStop']
            }).then(() => {
                RFQSocketController.sendPartUpdateStopNotificationToAllUsers(req);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.STOPPED(componentModule));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get MFR/Supplier list by given Name list array
    // @return List Of MFR/Supplier
    findMFRlistByNamelist: (req, mfrNameList, type) => {
        const { MfgCodeMst, MfgCodeAlias, sequelize } = req.app.locals.models;
        return MfgCodeAlias.findAll({
            where: {
                alias: mfrNameList,
                isDeleted: false
            },
            attributes: ['id', 'alias', 'mfgcodeId',
                [sequelize.fn('fun_getUserNameByID', sequelize.col('MfgCodeAlias.createdBy')), 'employeeName'],
                [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('MfgCodeAlias.createdAt')), 'createdAt']],
            include: [{
                model: MfgCodeMst,
                as: 'mfgCodemst',
                where: {
                    deletedAt: null,
                    mfgType: type
                },
                attributes: ['id', 'mfgCode', 'mfgName', 'mfgType']
            }]
        }).then(responsePrice => responsePrice);
    },

    // Add all Invalid MFR in Error list
    getMFRVerification: (req, bomMFRList) => {
        var mongodb = global.mongodb;

        const mfrNameList = _.map(bomMFRList, 'mfgName');
        const mfgType = DATA_CONSTANT.MFGCODE.MFGTYPE.MFG;
        const mfgTypeName = DATA_CONSTANT.MFGCODE.NAME;
        const mfrNotFoundErrorType = DATA_CONSTANT.COMPONENT_ERROR_TYPE.MFGNOTADDED;
        const NotFoundErroMsg = DATA_CONSTANT.COMPONENT_AIP_ERROR_MESSAGE.NOT_ADDED;
        const errorSource = 'BOM';
        return module.exports.findMFRlistByNamelist(req, mfrNameList, mfgType).then((responseMFR) => {
            if (responseMFR) {
                _.each(bomMFRList, (objMFR) => {
                    const objresMFR = _.find(responseMFR, x => x.alias === objMFR.mfgName);
                    if (!objresMFR) {
                        const errorMsg = stringFormat(NotFoundErroMsg, objMFR.mfgName, mfgTypeName);
                        const bomStatus = {
                            partID: objMFR.partID,
                            partNumber: objMFR.partNumber,
                            errorMsg: errorMsg,
                            errorType: mfrNotFoundErrorType,
                            MFGCode: null,
                            Type: mfgType,
                            DataField: objMFR.mfgName,
                            description: objMFR.description,
                            bomMFG: objMFR.mfgName,
                            Source: errorSource,
                            lineID: objMFR.lineID
                        };
                        const ObjectID = Bson.ObjectID;
                        // eslint-disable-next-line no-underscore-dangle
                        bomStatus._id = new ObjectID();
                        mongodb.collection('bomStatus').insertOne(bomStatus);
                    }
                });
            }
            return STATE.SUCCESS;
        });
    },
    // Add all Invalid Supplier in Error list
    getSupplierVerification: (req, bomSupplierList) => {
        var mongodb = global.mongodb;
        const mfrNameList = _.map(bomSupplierList, 'supplierName');
        const mfgType = DATA_CONSTANT.MFGCODE.MFGTYPE.DIST;
        const mfgTypeName = DATA_CONSTANT.MFGCODE.DIST_NAME;
        const mfrNotFoundErrorType = DATA_CONSTANT.COMPONENT_ERROR_TYPE.DISTNOTADDED;
        const NotFoundErroMsg = DATA_CONSTANT.COMPONENT_AIP_ERROR_MESSAGE.NOT_ADDED;
        const errorSource = 'BOM';
        return module.exports.findMFRlistByNamelist(req, mfrNameList, mfgType).then((responseSUPP) => {
            if (responseSUPP) {
                _.each(bomSupplierList, (objMFR) => {
                    const objresMFR = _.find(responseSUPP, x => x.alias === objMFR.supplierName);
                    if (!objresMFR) {
                        const errorMsg = stringFormat(NotFoundErroMsg, objMFR.supplierName, mfgTypeName);
                        const bomStatus = {
                            partID: objMFR.partID,
                            partNumber: objMFR.partNumber,
                            errorMsg: errorMsg,
                            errorType: mfrNotFoundErrorType,
                            MFGCode: null,
                            Type: mfgType,
                            DataField: objMFR.supplierName,
                            description: objMFR.description,
                            bomMFG: objMFR.supplierName,
                            Source: errorSource,
                            lineID: objMFR.lineID
                        };
                        const ObjectID = Bson.ObjectID;
                        // eslint-disable-next-line no-underscore-dangle
                        bomStatus._id = new ObjectID();
                        mongodb.collection('bomStatus').insertOne(bomStatus);
                    }
                });
            }
            return STATE.SUCCESS;
        });
    }
};
