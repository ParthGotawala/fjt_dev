/* eslint-disable no-eval */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const dbVersionModuleName = DATA_CONSTANT.DBVersion.NAME;
const dynamicMessageConfigName = DATA_CONSTANT.MESSAGE_CONFIGURATION_CONSTANT.NAME;
var fs = require('fs');
var address = require('address');
var path = require('path');
var Sequelize = require('sequelize');
const jsonfile = require('jsonfile');
const moment = require('moment');
const bson = require('bson');
const https = require('https');
const { Op } = require('sequelize');

const { development } = require('./../../../config/config');
const configData = require('../../../config/config.js'); // Used to get local flag for backup folder generation


module.exports = {

    // update all remaining db script for current mysql db used in project
    // GET : /api/v1/dbversion/executeAllRemainingDbScript
    // @return success or failure message for update db script or not
    executeAllRemainingDbScript: (req, res, sequelizeObj) => {
        const isForIdentityDB = sequelizeObj.isForIdentityDB;
        const { sequelize, DBVersion } = isForIdentityDB ? sequelizeObj : req.app.locals.models;
        const operationByUser = (req.user && req.user.id) ? req.user.id : '1';

        // return sequelize.transaction({ autocommit: false }, (t) => {
        return sequelize.transaction({ autocommit: false }).then((t) => {
            return DBVersion.max('buildNumber', {
                where: {
                    schemaVersion: req.body.scriptExecutionObj.currentBranchExecution
                },
                transaction: t
            }).then((maxBuildNumber) => {
                maxBuildNumber = maxBuildNumber ? maxBuildNumber : 0;
                let getAllDBChange = null;

                // For IdentityDB.
                if (isForIdentityDB) {
                    /* first branch selection - (applied MainBranch executed first) */
                    switch (req.body.scriptExecutionObj.currentBranchExecution) {
                        case COMMON.ProjectBranches.MainBranch:
                            /* then file selection to execute script */
                            switch (true) {
                                case (maxBuildNumber >= 0): /* first Db-Script file contain build number from 0. */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranchIdentity.Db_Script_Identity_1, 'utf8'));
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case COMMON.ProjectBranches.DevBranch:
                            switch (true) {
                                case (maxBuildNumber >= 0):
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranchIdentity.Db_Script_Identity_1, 'utf8'));
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    /* first branch selection - (applied MainBranch executed first) */
                    switch (req.body.scriptExecutionObj.currentBranchExecution) {
                        case COMMON.ProjectBranches.MainBranch:
                            /* then file selection to execute script */
                            switch (true) {
                                case (maxBuildNumber < 158): /* first Db-Script file contain build number from 1-157 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_1, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 158 && maxBuildNumber < 346): /* second Db-Script file contain build number from 158-346 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_2, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 346 && maxBuildNumber < 574):  /* third Db-Script file contain build number from 347-574 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_3, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 574 && maxBuildNumber < 747): /* third Db-Script file contain build number from 574-747 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_4, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 747 && maxBuildNumber < 1011): /* Fifth Db-Script file contain build number from 747-1011 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_5, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1011 && maxBuildNumber < 1122): /* Sixth Db-Script file contain build number from 1011-1121 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_6, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1122 && maxBuildNumber < 1235):
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_7, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1235):
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranch.Db_Script_8, 'utf8'));
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case COMMON.ProjectBranches.DevBranch:
                            switch (true) {
                                case (maxBuildNumber < 198):
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_1, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 198 && maxBuildNumber < 462): /* second Db-Script file contain build number from 198-462 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_2, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 462 && maxBuildNumber < 770): /* third Db-Script file contain build number from 462-769 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_3, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 770 && maxBuildNumber < 994):  /* fourth Db-Script file contain build number from 770-993 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_4, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 994 && maxBuildNumber < 1182):  /* fifth Db-Script file contain build number from 994-1181 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_5, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1182 && maxBuildNumber < 1315): /* six Db-Script file contain build number from 1182-1314  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_6, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1315 && maxBuildNumber < 1434):  /* seven Db-Script file contain build number from 1315-1433  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_7, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1434 && maxBuildNumber < 1549): /* Eight Db-Script file contain build number from 1434-1548  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_8, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1549 && maxBuildNumber < 1699): /* Db-Script Nine file contain build number from 1549-  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_9, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 1699 && maxBuildNumber < 2035): /* Db-Script Ten file contain build number from 1699-  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_10, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 2035 && maxBuildNumber < 2214): /* Db-Script Ten file contain build number from 2035-  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_11, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 2214 && maxBuildNumber < 2385): /* Db-Script contain build number from 2035-2384  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_12, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 2385 && maxBuildNumber < 2561): /* Db-Script-13 contain build number from 2385-2560  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_13, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 2561 && maxBuildNumber < 2797): /* Db-Script-14 contain build number from 2561-2796  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_14, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 2797 && maxBuildNumber < 3028): /* Db-Script-15 contain build number from 2797-3027  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_15, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 3028 && maxBuildNumber < 3400): /* Db-Script-16 contain build number from 3028-3399  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_16, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 3400 && maxBuildNumber < 3742): /* Db-Script-17 contain build number from 3400-  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_17, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 3742 && maxBuildNumber < 4037): /* Db-Script-18 contain build number from 3743-4037  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_18, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 4037 && maxBuildNumber < 4228): /* Db-Script-19 contain build number from 4038-4228  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_19, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 4228 && maxBuildNumber < 4450): /* Db-Script-20 contain build number from 4229-4450  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_20, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 4450 && maxBuildNumber < 4588): /* Db-Script-21 contain build number from 4451-  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_21, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 4588 && maxBuildNumber < 4776): /* Db-Script-22 contain build number from 4589-4775  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_22, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 4776 && maxBuildNumber < 4980): /* Db-Script-23 contain build number from 4776-4979  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_23, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 4980 && maxBuildNumber < 5136): /* Db-Script-24 contain build number from 4980-5135  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_24, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5136 && maxBuildNumber < 5231): /* Db-Script-25 contain build number from 5136-5230  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_25, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5231 && maxBuildNumber < 5362): /* Db-Script-26 contain build number from 5231-5362  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_26, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5362 && maxBuildNumber < 5495): /* Db-Script-27 contain build number from 5362-5495  */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_27, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5495 && maxBuildNumber < 5659): /* Db-Script-28 contain build number from 5495-5659 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_28, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5659 && maxBuildNumber < 5821): /* Db-Script-29 contain build number from 5659-5821 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_29, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5821 && maxBuildNumber < 5980): /* Db-Script-30 contain build number from 5821 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_30, 'utf8'));
                                    break;
                                case (maxBuildNumber >= 5980): /* Db-Script-31 contain build number from 5980 */
                                    getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranch.Db_Script_31, 'utf8'));
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                }

                const requiredDet = {
                    ipAddress: req.body.scriptExecutionObj.userIPAddress
                };
                const allDbChangesQueryArray = getAllDBChange(maxBuildNumber, operationByUser, requiredDet);
                if (!allDbChangesQueryArray) {
                    if (isForIdentityDB) {
                        return Promise.resolve({ status: STATE.FAILED, resobj: { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName) } });
                    }
                    return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName));
                }

                const dropTblMatchPattern = /(DROP TABLE IF EXISTS|DROP TABLE)([ ]+)([A-Za-z0-9]+)/i;
                if (allDbChangesQueryArray[0] && dropTblMatchPattern.test(allDbChangesQueryArray[0])) {
                    if (!t.finished) {
                        t.rollback();
                    }
                    if (isForIdentityDB) {
                        return Promise.resolve({ status: STATE.FAILED, resobj: { messageContent: MESSAGE_CONSTANT.STATICMSG(COMMON.stringFormat(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.SCRIPT_EXEC_NOT_ALLOWED_FOR_DROP_TABLE, maxBuildNumber)) } });
                    }
                    return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.STATICMSG(COMMON.stringFormat(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.SCRIPT_EXEC_NOT_ALLOWED_FOR_DROP_TABLE, maxBuildNumber)));
                }

                if (allDbChangesQueryArray.length === 0) {
                    if (req.body.scriptExecutionObj.currentBranchExecution === COMMON.ProjectBranches.MainBranch) {
                        req.body.scriptExecutionObj.currentBranchExecution = COMMON.ProjectBranches.DevBranch;

                        req.body.scriptExecutionObj.branchwiseCompletedExecution.push({
                            branchName: COMMON.ProjectBranchesKey.MainBranch,
                            fromBuildNumber: req.body.scriptExecutionObj.fromBuildNumber,
                            toBuildNumber: req.body.scriptExecutionObj.fromBuildNumber ? maxBuildNumber : null
                        });

                        req.body.scriptExecutionObj.fromBuildNumber = null;
                        req.body.scriptExecutionObj.toBuildNumber = null;
                        return t.commit().then(() =>
                            module.exports.executeAllRemainingDbScript(req, res, sequelizeObj)
                        );
                    } else if (req.body.scriptExecutionObj.currentBranchExecution === COMMON.ProjectBranches.DevBranch) {
                        /* check main branch and following branch contain any new script to execute , if not than no script msg */
                        if (!req.body.scriptExecutionObj.branchwiseCompletedExecution[0].fromBuildNumber
                            && (!req.body.scriptExecutionObj.fromBuildNumber || !req.body.isScriptExecutionContinue)) {
                            return t.commit().then(() => {
                                if (isForIdentityDB) {
                                    return Promise.resolve({ status: STATE.SUCCESS, resobj: { userMessage: MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.SCRIPT_UPTODATE } });
                                } else {
                                    return resHandler.successRes(res, 200, STATE.SUCCESS, null, null);// { userMessage: MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.SCRIPT_UPTODATE });
                                }
                            });
                        } else {
                            req.body.scriptExecutionObj.branchwiseCompletedExecution.push({
                                branchName: COMMON.ProjectBranchesKey.DevBranch,
                                fromBuildNumber: req.body.scriptExecutionObj.fromBuildNumber,
                                toBuildNumber: req.body.scriptExecutionObj.fromBuildNumber ? maxBuildNumber : null
                            });
                            return t.commit().then(() => {
                                if (isForIdentityDB) {
                                    return Promise.resolve({
                                        status: STATE.SUCCESS,
                                        resobj: { userMessage: MESSAGE_CONSTANT.UPDATED(dbVersionModuleName), branchwiseCompletedExecution: req.body.scriptExecutionObj.branchwiseCompletedExecution }
                                    });
                                } else {
                                    return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(dbVersionModuleName), branchwiseCompletedExecution: req.body.scriptExecutionObj.branchwiseCompletedExecution });
                                }
                            });
                        }
                        // }
                    } else {
                        req.body.scriptExecutionObj.branchwiseCompletedExecution.push({
                            branchName: COMMON.ProjectBranchesKey.DevBranch,
                            fromBuildNumber: req.body.scriptExecutionObj.fromBuildNumber,
                            toBuildNumber: req.body.scriptExecutionObj.fromBuildNumber ? maxBuildNumber : null
                        });
                        return t.commit().then(() => {
                            if (isForIdentityDB) {
                                return Promise.resolve({
                                    status: STATE.SUCCESS,
                                    resobj: { userMessage: MESSAGE_CONSTANT.UPDATED(dbVersionModuleName), branchwiseCompletedExecution: req.body.scriptExecutionObj.branchwiseCompletedExecution }
                                });
                            } else {
                                return resHandler.successRes(res, 200, STATE.SUCCESS, {
                                    userMessage: MESSAGE_CONSTANT.UPDATED(dbVersionModuleName),
                                    branchwiseCompletedExecution: req.body.scriptExecutionObj.branchwiseCompletedExecution
                                });
                            }
                        });
                    }
                }

                if (!req.body.scriptExecutionObj.fromBuildNumber || !req.body.isScriptExecutionContinue) {
                    req.body.scriptExecutionObj.fromBuildNumber = null;
                    req.body.scriptExecutionObj.fromBuildNumber = maxBuildNumber + 1;
                }

                const promises = [];
                for (let i = 0; i < allDbChangesQueryArray.length; i++) {
                    promises.push(
                        sequelize.query(allDbChangesQueryArray[i], {
                            transaction: t
                        }).then((response) => {
                            req.body.scriptExecutionObj.toBuildNumber = maxBuildNumber + 1;
                            return Promise.resolve(response);
                        }));
                }
                return Promise.all(promises).then(() => {
                    return t.commit().then(() => {
                        req.body['isScriptExecutionContinue'] = true;
                        // req.body.scriptExecutionObj.retryCount = 0;
                        return module.exports.executeAllRemainingDbScript(req, res, sequelizeObj);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (isForIdentityDB) {
                            return Promise.resolve({ status: STATE.FAILED, resobj: { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName), err: err, data: null } });
                        }
                        return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName));
                    });
                }).catch((err) => {
                    let errorInScriptExecutionInfo = {};
                    // if (err.original.code.toUpperCase() === "ER_DUP_ENTRY" && req.body.scriptExecutionObj && req.body.scriptExecutionObj.retryCount < 3) {
                    //    req.body.scriptExecutionObj.retryCount = req.body.scriptExecutionObj.retryCount + 1;
                    //    return module.exports.executeAllRemainingDbScript(req, res);
                    // } else {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    let errorInBranch = null;
                    if (req.body.scriptExecutionObj.currentBranchExecution === COMMON.ProjectBranches.MainBranch) {
                        errorInBranch = COMMON.ProjectBranchesKey.MainBranch;
                    } else if (req.body.scriptExecutionObj.currentBranchExecution === COMMON.ProjectBranches.DevBranch) {
                        errorInBranch = COMMON.ProjectBranchesKey.DevBranch;
                    }
                    errorInScriptExecutionInfo = {
                        branchName: errorInBranch,
                        fromBuildNumber: req.body.scriptExecutionObj.fromBuildNumber,
                        toBuildNumber: maxBuildNumber
                    };

                    // need to implement code.
                    if (isForIdentityDB) {
                        // need to implement code
                        return Promise.resolve({
                            status: STATE.FAILED,
                            resobj: { userMessage: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName), message: err.original.message, errorInScriptExecutionInfo: errorInScriptExecutionInfo }
                        });
                    }

                    return resHandler.errorRes(res, 200, STATE.EMPTY, {
                        userMessage: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName),
                        message: err.original.message,
                        errorInScriptExecutionInfo: errorInScriptExecutionInfo
                    });
                    // }
                });
            }).catch((err) => {
                // code removed after discussion with ketanbhai . As this code done for initial dbVersion table check
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                if (isForIdentityDB) {
                    return Promise.resolve({ status: STATE.FAILED, resobj: { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName), err: err, data: null } });
                }
                return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName));
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (isForIdentityDB) {
                return Promise.resolve({ status: STATE.FAILED, resobj: { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName), err: err, data: null } });
            }
            return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName));
        });
    },

    retrieveCurrDBInfo: (req, res) => {
        var mongodb = global.mongodb;
        const { sequelize } = req.app.locals.models;

        return sequelize.query('CALL Sproc_GetMaxBuildNumberForAllBranchs (:pMainDBName,:pIdentityDBName)', {
            replacements: {
                pMainDBName: development.database,
                pIdentityDBName: development.identityDatabase
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            const dbObj = {
                dbName: sequelize.config.database,
                host: sequelize.config.host,
                identityDBName: development.identityDatabase,
                branches: [{
                    branchName: COMMON.ProjectBranchesKey.MainBranch,
                    maxBuildNumber: response[0][0].maxBuildNumberMain,
                    schemaVersion: COMMON.ProjectBranches.MainBranch
                }, {
                    branchName: COMMON.ProjectBranchesKey.DevBranch,
                    maxBuildNumber: response[0][0].maxBuildNumberDev,
                    schemaVersion: COMMON.ProjectBranches.DevBranch
                }],
                identityBranches: [{
                    branchName: COMMON.ProjectBranchesKey.MainBranch,
                    maxBuildNumber: response[0][0].maxBuildNumberIdentityMain,
                    schemaVersion: COMMON.ProjectBranches.MainBranch
                }, {
                    branchName: COMMON.ProjectBranchesKey.DevBranch,
                    maxBuildNumber: response[0][0].maxBuildNumberIdentityDev,
                    schemaVersion: COMMON.ProjectBranches.DevBranch
                }]
            };

            const msgDB = {
                branchName: '',
                maxBuildNumber: 0
            };
            mongodb.collection('dbVersionMsg').aggregate([
                {
                    $group: {
                        _id: '$schemaVersion',
                        maxBuildNumber: { $max: '$buildNumber' }
                    }
                }
            ]).toArray().then((result) => {
                if (result && result.length > 0) {
                    _.each(result, (item) => {
                        // eslint-disable-next-line no-underscore-dangle
                        msgDB.schemaVersion = item._id;
                        // eslint-disable-next-line no-underscore-dangle
                        msgDB.branchName = (item._id === '1.00' ? COMMON.ProjectBranchesKey.MainMsgBranch : COMMON.ProjectBranchesKey.DevMsgBranch);
                        msgDB.maxBuildNumber = item.maxBuildNumber;
                        dbObj.branches.push(Object.assign({}, msgDB));
                    });
                }
                // get mac address and check valid user to execute db-script
                dbObj.isValidUserToExecuteDbScript = false;
                address.mac((addErr, macAddr) => {
                    if (addErr || !macAddr) {
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { dbObj: dbObj });
                    } else {
                        return sequelize.query('CALL Sproc_CheckValidUserForDBScriptExecution (:puserDeviceMACAddress)', {
                            replacements: {
                                puserDeviceMACAddress: macAddr || null
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then((respOfValidUserByMacAddr) => {
                            if (respOfValidUserByMacAddr && respOfValidUserByMacAddr[0] && respOfValidUserByMacAddr[0][0]['isValidUserToExecuteDbScript']) {
                                dbObj.isValidUserToExecuteDbScript = true;
                            }
                            return resHandler.successRes(res, 200, STATE.SUCCESS, { dbObj: dbObj });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, null);
                        });
                    }
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    checkValidUserToExecuteDbScript: (req, res) => {
        try {
            const { sequelize } = req.app.locals.models;
            // get mac address and check valid user to execute db-script
            let isValidUserToExecuteDbScript = false;
            return address.mac((addErr, macAddr) => {
                if (addErr || !macAddr) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, null);
                } else {
                    return sequelize.query('CALL Sproc_CheckValidUserForDBScriptExecution (:puserDeviceMACAddress)', {
                        replacements: {
                            puserDeviceMACAddress: macAddr || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((respOfValidUserByMacAddr) => {
                        if (respOfValidUserByMacAddr && respOfValidUserByMacAddr[0] && respOfValidUserByMacAddr[0][0]['isValidUserToExecuteDbScript']) {
                            isValidUserToExecuteDbScript = true;
                        }
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { isValidUser: isValidUserToExecuteDbScript });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, null);
                    });
                }
            });
        } catch (e) {
            return resHandler.errorRes(res, 200, STATE.EMPTY, null);
        }
    },

    executeMsgDBScript: (req, res) => {
        var mongodb = global.mongodb;
        var getAllDBChange; // function created on run time based on dbscript.js file will be call for further execution
        var newBuild;
        var exeMessage;
        var msgForIns = [];
        var msgForUpd = [];
        var msgForDel = [];
        var allSuccess = '';
        var promises = [];

        if (req && req.body) {
            let msgScriptObj = {
                fromMsgBuild: req.body.msgScriptObj.fromMsgBuild ? req.body.msgScriptObj.fromMsgBuild : 0,
                toMsgBuild: 0,
                schemaVersion: (req.body.msgScriptObj && req.body.msgScriptObj.schemaVersion) ? req.body.msgScriptObj.schemaVersion : '2.00',
                branchwiseCompletedExecution: []
            };

            mongodb.collection('dbVersionMsg').find({ schemaVersion: msgScriptObj.schemaVersion })
                .toArray().then((result) => {
                    if (result) {
                        if (result.length === 0) {
                            newBuild = 0;
                        } else {
                            newBuild = Math.max(...result.map(o => o.buildNumber));
                        }
                        msgScriptObj.toMsgBuild = newBuild;
                        msgScriptObj.fromMsgBuild = (req.body.msgScriptObj.fromMsgBuild || req.body.msgScriptObj.fromMsgBuild !== null) ? req.body.msgScriptObj.fromMsgBuild : newBuild;
                        switch (msgScriptObj.schemaVersion) {
                            case COMMON.ProjectBranches.MainBranch:
                                switch (true) {
                                    case (newBuild <= 500):
                                        getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.MainBranchMessage.Db_Script_Msg_1, 'utf8'));
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case COMMON.ProjectBranches.DevBranch:
                                switch (true) {
                                    case (newBuild < 500):
                                        getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranchMessage.Db_Script_Msg_1, 'utf8'));
                                        break;
                                    case (newBuild >= 500 && newBuild <= 2000):
                                        getAllDBChange = eval(fs.readFileSync(DATA_CONSTANT.dbChangesFilePath.DevBranchMessage.Db_Script_Msg_2, 'utf8'));
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        const allDbChangesQuery = getAllDBChange(newBuild);
                        if (allDbChangesQuery) {
                            exeMessage = allDbChangesQuery.message;
                        }
                        msgForIns = [];
                        msgForUpd = [];
                        msgForDel = [];
                        if (exeMessage) {
                            try {
                                exeMessage.forEach((element) => {
                                    element.developer = allDbChangesQuery.developer;
                                    element.buildNumber = newBuild + 1;
                                    element.schemaVersion = msgScriptObj.schemaVersion ? msgScriptObj.schemaVersion : '2.00';
                                    switch (element.action) {
                                        case 'I':
                                            delete element['action'];
                                            msgForIns.push(element);
                                            break;
                                        case 'U':
                                            delete element['action'];
                                            msgForUpd.push(element);
                                            break;
                                        case 'D':
                                            delete element['action'];
                                            msgForDel.push(element);
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            } catch (err) {
                                console.trace();
                                console.error(err);
                            }
                        }

                        if (msgForIns && msgForIns.length > 0) {
                            req.body.data = msgForIns;
                            promises.push(
                                module.exports.addMessageFromScript(req).then((response) => {
                                    allSuccess = response.state;
                                    return response;
                                })
                            );
                        }
                        if (msgForUpd && msgForUpd.length > 0) {
                            req.body.data = msgForUpd;
                            promises.push(
                                module.exports.updateMessageFromScript(req).then((response) => {
                                    allSuccess = response.state;
                                    return response;
                                })
                            );
                        }
                        if (msgForDel && msgForDel.length > 0) {
                            req.body.data = msgForDel;
                            promises.push(
                                module.exports.delMessageFromScript(req).then((response) => {
                                    allSuccess = response.state;
                                    return response;
                                })
                            );
                        }
                        // eslint-disable-next-line consistent-return
                        return Promise.all(promises).then((scriptResult) => {
                            if (allSuccess === STATE.SUCCESS) {
                                msgScriptObj.toMsgBuild = newBuild;
                                req.body.msgScriptObj.toMsgBuild = msgScriptObj.toMsgBuild;
                                req.body.msgScriptObj.fromMsgBuild = req.body.msgScriptObj.fromMsgBuild ? req.body.msgScriptObj.fromMsgBuild : msgScriptObj.fromMsgBuild;
                                module.exports.executeMsgDBScript(req, res);
                            } else if (allSuccess === STATE.FAILED) {
                                return resHandler.errorRes(res, 200, STATE.FAILED, COMMON.stringFormat(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.SCRIPT_NOT_SUCCESS, dynamicMessageConfigName, scriptResult[0].message));
                            } else if (req.body.msgScriptObj.schemaVersion === COMMON.ProjectBranches.MainBranch) {
                                req.body.msgScriptObj.branchwiseCompletedExecution = [];
                                req.body.msgScriptObj.toMsgBuild = newBuild;
                                req.body.msgScriptObj.branchwiseCompletedExecution.push({
                                    branchName: COMMON.ProjectBranchesKey.MainMsgBranch,
                                    fromBuildNumber: (msgScriptObj.fromMsgBuild !== msgScriptObj.toMsgBuild) ? msgScriptObj.fromMsgBuild : '-',
                                    toBuildNumber: (msgScriptObj.fromMsgBuild !== msgScriptObj.toMsgBuild && msgScriptObj.toMsgBuild > 0) ? msgScriptObj.toMsgBuild : '-'
                                });
                                req.body.msgScriptObj.fromMsgBuild = null;
                                req.body.msgScriptObj.toMsgBuild = null;
                                req.body.msgScriptObj.schemaVersion = COMMON.ProjectBranches.DevBranch;
                                module.exports.executeMsgDBScript(req, res);
                            } else if (req.body.msgScriptObj.schemaVersion === COMMON.ProjectBranches.DevBranch) {
                                req.body.msgScriptObj.toMsgBuild = req.body.msgScriptObj.fromMsgBuild ? newBuild : null;
                                req.body.msgScriptObj.branchwiseCompletedExecution.push({
                                    branchName: COMMON.ProjectBranchesKey.DevMsgBranch,
                                    fromBuildNumber: (req.body.msgScriptObj.fromMsgBuild !== req.body.msgScriptObj.toMsgBuild) ? (req.body.msgScriptObj.fromMsgBuild + 1) : '-',
                                    toBuildNumber: (req.body.msgScriptObj.fromMsgBuild !== req.body.msgScriptObj.toMsgBuild) ? req.body.msgScriptObj.toMsgBuild : '-'
                                });
                                msgScriptObj = req.body.msgScriptObj;
                                req.body.msgScriptObj.isMessageUpdated = (req.body.msgScriptObj.fromMsgBuild !== req.body.msgScriptObj.toMsgBuild) ? true : false;
                                return resHandler.successRes(res, 200, STATE.SUCCESS, { msgScriptObj });
                            }
                        });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.FAILED, {});
                    }
                })
                .catch((err) => {
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.FAILED, {});
                });
        }
    },

    executeIdentityDBScript: (req, res) => {
        return module.exports.openIdentitySequelize(req, res).then((result) => {
            if (result && result.status === STATE.SUCCESS) {
                const sequelizeObj = result.sequelizeObj;
                sequelizeObj.isForIdentityDB = true;
                return module.exports.executeAllRemainingDbScript(req, res, sequelizeObj).then((response) => {
                    if (response && response.status === STATE.SUCCESS) {
                        module.exports.closeIdentitySequelize(req, res, result.sequelizeObj);
                        return resHandler.successRes(res, 200, STATE.SUCCESS, response.resobj);
                    } else {
                        module.exports.closeIdentitySequelize(req, res, result.sequelizeObj);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, response && response.resobj ? response.resobj : MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    module.exports.closeIdentitySequelize(req, res, result.sequelizeObj);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName), err: err, data: null });
                });
            } else {
                // BT - Need to move in Dynamic Message generate Dynamic Message.
                const messageContent = {
                    message: 'Connection could not be established to Identity database.',
                    messageType: 'Error',
                    messageCode: ''
                };

                return resHandler.errorRes(res, 200, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dbVersionModuleName), err: err, data: null });
        });
    },

    openIdentitySequelize: (req, res) => {
        var db = {};
        var sequelize = new Sequelize(development.identityDatabase, development.username, development.password, development);
        fs.readdirSync(`${__dirname}/../../../identityModels`).filter(function (file) {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        }).forEach(function (file) {
            const model = require(path.join(`${__dirname}/../../../identityModels`, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });

        Object.keys(db).forEach(function (modelName) {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        return db.sequelize.authenticate().then(() => {
            return Promise.resolve({ status: STATE.SUCCESS, sequelizeObj: db });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return Promise.resolve({ status: STATE.FAILED, error: err });
        });
    },

    closeIdentitySequelize: (req, res, sequelizeObj) => {
        return sequelizeObj.sequelize.close();
    },

    addMessageFromScript: (req) => {
        var mongodb = global.mongodb;
        var newData = {};
        var newVersion = {};
        var promiseAddScript = [];
        var query = '';
        // var whereUpdate ={};
        if (req && req.body.data) {
            // eslint-disable-next-line consistent-return
            _.each(req.body.data, (element) => {
                newVersion = {
                    buildNumber: element.buildNumber,
                    schemaVersion: element.schemaVersion,
                    description: `Insert script for message configuration ${element.schemaVersion}`,
                    releaseName: 'V1',
                    developer: element.developer,
                    createdAt: new Date(COMMON.getCurrentUTC())
                };
                query = {
                    category: element.category,
                    messageKey: element.messageKey,
                    isDeleted: { $in: [false, null] }
                };
                if (element && element.messageKey) {
                    promiseAddScript.push(mongodb.collection('dynamic_messages').findOne(query).then((result) => {
                        newData = {};
                        if (!result) {
                            newData['_id'] = new (bson.ObjectID)();
                            newData.messageKey = (element.messageKey) ? element.messageKey : null;
                            newData.category = (element.category) ? element.category : null;
                            newData.messageType = (element.messageType) ? element.messageType : null;
                            newData.messageCode = element.messageCode;
                            newData.message = (element.message) ? element.message : null;
                            newData.createdByName = 'System generated';
                            newData.createdDate = new Date(COMMON.getCurrentUTC());
                            newData.modifiedByName = 'System generated';
                            newData.modifiedDate = new Date(COMMON.getCurrentUTC());
                            newData.isDeleted = false;
                            newData.versionNumber = 0;
                            newData.previousVersion = [];
                            newData.developer = element.developer;
                            return mongodb.collection('dynamic_messages').insertOne(newData).then(() => ({
                                state: STATE.SUCCESS,
                                message: `${newData.messageKey}: ${STATE.SUCCESS}`,
                                newVersion: newVersion
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    state: STATE.FAILED,
                                    message: `${newData.messageKey}: ${err.message}`
                                };
                            });
                        } else {
                            return {
                                state: STATE.FAILED,
                                message: COMMON.stringFormat(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.MESSAGE_UNIQUE, element.category, element.messageKey)
                            };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            state: STATE.FAILED,
                            message: `${element.messageKey}: ${err.message}`
                        };
                    }));
                } else {
                    return {
                        state: STATE.FAILED,
                        message: ''
                    };
                }
            });
            return Promise.all(promiseAddScript).then((result) => {
                var resObj = _.find(result, res => res.state === STATE.FAILED);
                if (resObj) {
                    result.state = STATE.FAILED;
                } else {
                    result.state = STATE.SUCCESS;
                }
                if (result && result.state === STATE.SUCCESS) {
                    return mongodb.collection('dbVersionMsg').insertOne(result[0].newVersion).then(() => ({
                        state: result.state,
                        message: result[0].message
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            state: STATE.FAILED,
                            message: result[0].message
                        };
                    });
                } else {
                    return ({
                        state: STATE.FAILED,
                        message: result[0].message
                    });
                }
            }).catch(() => ({
                state: STATE.FAILED,
                message: ''
            }));
        } else {
            return ({
                state: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            });
        }
    },
    // eslint-disable-next-line consistent-return
    updateMessageFromScript: (req) => {
        var mongodb = global.mongodb;
        var promiseUpdateScript = [];
        var newData = {};
        var oldData = {};
        var newVersion = {};
        var query = '';

        if (req && req.body.data) {
            _.each(req.body.data, (element) => {
                if (element && element.messageKey) {
                    newVersion = {
                        buildNumber: element.buildNumber,
                        schemaVersion: element.schemaVersion,
                        description: `Update script for message configuration${element.schemaVersion}`,
                        releaseName: 'V1',
                        developer: element.developer,
                        createdAt: new Date(COMMON.getCurrentUTC())
                    };
                    newData = element;
                    query = {
                        category: element.category,
                        messageKey: element.messageKey,
                        isDeleted: { $in: [false, null] }
                    };
                    promiseUpdateScript.push(mongodb.collection('dynamic_messages').findOne(query).then((result) => {
                        if (result) {
                            oldData = result;
                            if (oldData) {
                                newData.versionNumber = parseInt(oldData.versionNumber || 0) + 1;
                                newData.previousVersion = oldData.previousVersion;
                                delete oldData['previousVersion'];
                                if (newData.previousVersion) {
                                    newData.previousVersion.push(oldData);
                                }
                            } else { newData.previousVersion = []; }
                            const newvalues = {
                                $set: {
                                    messageType: newData.messageType,
                                    messageCode: newData.messageCode,
                                    message: newData.message,
                                    versionNumber: newData.versionNumber,
                                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                                    modifiedByName: 'System generated',
                                    previousVersion: newData.previousVersion,
                                    isDeleted: false,
                                    developer: newData.developer
                                }
                            };
                            return mongodb.collection('dynamic_messages').updateOne(query, newvalues).then(() => ({
                                state: STATE.SUCCESS,
                                message: `${element.messageKey}: ${STATE.SUCCESS}`,
                                newVersion: newVersion
                            })).catch((error) => {
                                console.trace();
                                console.error(error);
                                return {
                                    state: STATE.FAILED,
                                    message: `${element.messageKey}: ${error.message}`
                                };
                            });
                        } else {
                            return {
                                state: STATE.FAILED,
                                message: COMMON.stringFormat(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.MESSAGE_NOTFOUND, element.category, element.messageKey)
                            };
                        }
                    }).catch((error) => {
                        console.trace();
                        console.error(error);
                        return {
                            state: STATE.FAILED,
                            message: `${element.messageKey}: ${error.message}`
                        };
                    }));
                }
            });
            return Promise.all(promiseUpdateScript).then((result) => {
                var resObj = _.find(result, res => res.state === STATE.FAILED);
                if (resObj) {
                    result.state = STATE.FAILED;
                } else {
                    result.state = STATE.SUCCESS;
                }
                if (result && result.state === STATE.SUCCESS) {
                    return mongodb.collection('dbVersionMsg').insertOne(result[0].newVersion).then(() => ({
                        state: result.state,
                        message: result[0].message
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            state: STATE.FAILED,
                            message: result[0].message
                        };
                    });
                } else {
                    return ({
                        state: STATE.FAILED,
                        message: result[0].message
                    });
                }
            });
        }
    },

    delMessageFromScript: (req) => {
        var mongodb = global.mongodb;
        var promiseDelScript = [];
        var newVersion = {};
        var query = '';

        if (req && req.body.data) {
            // eslint-disable-next-line consistent-return
            _.each(req.body.data, (element) => {
                if (element && element.messageKey) {
                    query = {
                        messageKey: element.messageKey,
                        category: element.category,
                        isDeleted: { $in: [false, null] }
                    };
                    newVersion = {
                        buildNumber: element.buildNumber,
                        schemaVersion: element.schemaVersion,
                        description: `Delete script for message configuration${element.schemaVersion}`,
                        releaseName: 'V1',
                        developer: element.developer,
                        createdAt: new Date(COMMON.getCurrentUTC())
                    };
                    promiseDelScript.push(mongodb.collection('dynamic_messages').findOne(query).then((result) => {
                        var newvalues = {};
                        if (result) {
                            newvalues = {
                                $set: {
                                    modifiedDate: element.deletedDate,
                                    modifiedByName: 'System generated',
                                    deletedDate: new Date(COMMON.getCurrentUTC()),
                                    deletedByName: 'System generated',
                                    isDeleted: true,
                                    developer: element.developer
                                }
                            };
                            return mongodb.collection('dynamic_messages').updateOne(query, newvalues).then(() => ({
                                state: STATE.SUCCESS,
                                message: `${element.messageKey}: ${STATE.SUCCESS}`,
                                newVersion: newVersion
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    state: STATE.FAILED,
                                    message: `${element.messageKey}: ${err.message}`
                                };
                            });
                        } else {
                            return {
                                state: STATE.FAILED,
                                message: COMMON.stringFormat(MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.MESSAGE_NOTFOUND, element.category, element.messageKey)
                            };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            state: STATE.FAILED,
                            message: `${element.messageKey}: ${err.message}`
                        };
                    }));
                } else { return STATE.FAILED; }
            });
            return Promise.all(promiseDelScript).then((result) => {
                var resObj = _.find(result, res => res.state === STATE.FAILED);
                if (resObj) {
                    result.state = STATE.FAILED;
                } else {
                    result.state = STATE.SUCCESS;
                }
                if (result && result.state === STATE.SUCCESS) {
                    return mongodb.collection('dbVersionMsg').insertOne(result[0].newVersion).then(() => ({
                        state: result.state,
                        message: result[0].message
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            state: STATE.FAILED,
                            message: result[0].message
                        };
                    });
                } else {
                    return ({
                        state: STATE.FAILED,
                        message: result[0].message
                    });
                }
            });
        } else {
            return ({
                state: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            });
        }
    },

    generateJSonFromMongoDBFromDBScript: async (req, res) => {
        if (req) {
            let rawdata = {};
            const mongodb = global.mongodb;
            let filePath = '';
            let fileName = '';
            let promises = [];
            let backupRes;
            try {
                const dataConstantForMessage = COMMON.DYNAMIC_MESSAGE_CONFIGURATION;

                if (!dataConstantForMessage) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
                filePath = process.cwd() + dataConstantForMessage.UPLOAD_FOLDER_PATH;

                /* copy old files*/
                let continueGeneration = false;
                if (configData.generateJSONBackup) {
                    backupRes = await module.exports.generateBackupJSON();
                } else {
                    continueGeneration = true;
                }
                continueGeneration = configData.generateJSONBackup ? backupRes && backupRes.state && backupRes.state === STATE.SUCCESS : continueGeneration;
                promises = [];
                if (continueGeneration) {
                    /* Read data from mongoDB*/
                    return mongodb.collection('dynamic_messages').find({ isDeleted: { $in: [false, null] } }).toArray().then((result) => {
                        if (result) {
                            _.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (item) => {
                                if (item) {
                                    fileName = `${filePath + item}.json`;
                                    // change file from read only mode to writable
                                    promises.push(fs.chmodSync(fileName, 666), (errChange) => {
                                        if (errChange) { throw errChange; }
                                    });
                                }
                            });
                            Promise.all(promises).then(() => {
                                promises = [];
                                _.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (item) => {
                                    rawdata = {};
                                    if (item) {
                                        fileName = `${filePath + item}.json`;
                                        const messageList = _.filter(result, { category: item });
                                        messageList.forEach((element) => {
                                            if (element) {
                                                rawdata[element.messageKey] = {
                                                    messageCode: element.messageCode,
                                                    message: element.message,
                                                    messageType: element.messageType
                                                };
                                            } else { console.error('End of read data'); }
                                        });
                                        promises.push(jsonfile.writeFileSync(fileName, rawdata, (err) => {
                                            if (err) { throw err; }
                                        })
                                        );
                                    }
                                });
                                try {
                                    return Promise.all(promises).then(() => {
                                        _.each(COMMON.DYNAMIC_MESSAGE_CATEGORY, (item) => {
                                            const allAPIConstantMessages = jsonfile.readFileSync(`${filePath + item}.json`);
                                            MESSAGE_CONSTANT[item] = Object.assign(MESSAGE_CONSTANT[item] || {}, allAPIConstantMessages);
                                        });
                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.DYNAMIC_MESSAGE_CONFIG.GENERATED);
                                        messageContent.message = COMMON.stringFormat(messageContent.message, dynamicMessageConfigName);
                                        messageContent.displayDialog = true;
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
                                    });
                                } catch (error) {
                                    console.trace();
                                    console.error(error);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                                }
                            });
                        }
                    })
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    /** ******************** */
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: backupRes, data: null });
                }
            } catch (error) {
                console.trace();
                console.error(error);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }, /* end of generateJSonFromMongoDB */


    generateBackupJSON: () => {
        var dynamicMessageConfiguration = COMMON.DYNAMIC_MESSAGE_CONFIGURATION;
        var folder = process.cwd() + dynamicMessageConfiguration.UPLOAD_FOLDER_PATH;
        var currDateTime = moment(new Date()).format(COMMON.TIMESTAMP_FORMAT_FOR_APPEND_UNIQUE.toUpperCase()).replace(/:/g, '-').replace(' ', '_')
            .replace('.', '-');
        var backupPath = process.cwd() + dynamicMessageConfiguration.BACKUP_FOLDER_UPLOAD_PATH + dynamicMessageConfiguration.BACKUP_FOLDER + currDateTime;
        var copyFileTo = '';

        if (!dynamicMessageConfiguration) {
            return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER.message };
        }
        /* Check Back Up file path */

        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath);
            backupPath += '/';
        }
        try {
            fs.readdir(folder, (errFolder, files) => {
                files.forEach((file) => {
                    const fileName = file.substring(0, file.indexOf('.'));
                    if (file.indexOf('.json') > 0) {
                        copyFileTo = `${backupPath + fileName}.json`;
                        try {
                            fs.copyFileSync(folder + file, copyFileTo);
                        } catch (error) {
                            return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: error };
                        }
                    }
                });
                if (errFolder) {
                    return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: errFolder };
                }
                return { status: DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, state: STATE.SUCCESS };
            });
            return { status: DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, state: STATE.SUCCESS };
        } catch (error) {
            return { status: DATA_CONSTANT.API_RESPONSE_CODE.ERROR, state: STATE.FAILED, message: error };
        }
    },

    // update Customer location where latitude / longitude is null.
    // GET : /api/v1/dbversion/synchronizeAddressLocations
    // @return synchronizeAddressLocations
    synchronizeAddressLocations: (req, res) => {
        const { CustomerAddresses } = req.app.locals.models;
        return CustomerAddresses.findAll({
            where: {
                latitude: null,
                longitude: null,
                postcode: {
                    [Op.ne]: null
                }
            },
            attributes: ['id', 'postcode', 'latitude', 'longitude']
        }).then((response) => {
            if (response && response.length > 0) {
                const promises = [];
                _.forEach(response, (address) => {
                    if (address && address.postcode && (!address.latitude || !address.longitude)) {
                        promises.push(module.exports.getLatLongByPostalCode(req, res, address));
                    }
                });

                return Promise.all(promises).then((result) => {
                    if (result && Array.isArray(result)) {
                        const failedResult = _.find(result, item => item && item.status === STATE.FAILED);
                        if (failedResult) {
                            if (failedResult.data && failedResult.data.postcode) {
                                console.trace();
                                console.error("got error in postcode : " + failedResult.data.postcode);
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: failedResult.messageContent ? failedResult.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: failedResult.err,
                                data: null
                            });
                        } else {
                            const updateLatLngPromise = [];
                            _.forEach(result, (item) => {
                                updateLatLngPromise.push(CustomerAddresses.update(item.data, {
                                    where: {
                                        id: item.data.id
                                    },
                                    fields: ['latitude', 'longitude']
                                }));
                            });
                            return Promise.all(updateLatLngPromise).then((resp) => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, 'Records updated Successfully.')).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
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
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, 'No Records to update.');
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

    // @return getLatLongByPostalCode
    getLatLongByPostalCode: (req, res, addressObj) => {
        // addressObj is temprary for synchronizeAddressLocations API.
        if ((req.body && req.body.postcode) || (addressObj && addressObj.postcode)) {
            try {
                const URL = COMMON.stringFormat(DATA_CONSTANT.API_URL_FOR_GET_LANG_LONG, req.body.postcode || addressObj.postcode);
                return new Promise((resolve) => {
                    https.get(URL, (resp) => {
                        let data = '';

                        // A chunk of data has been received.
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            const dataObj = (JSON.parse(data));
                            if (dataObj && dataObj.status === 'OK' && dataObj.results && dataObj.results.length > 0) {
                                const geometryObj = dataObj.results[0];
                                if (geometryObj.geometry && geometryObj.geometry.location && geometryObj.geometry.location.lat && geometryObj.geometry.location.lng) {
                                    resolve({ status: STATE.SUCCESS, data: { latitude: geometryObj.geometry.location.lat, longitude: geometryObj.geometry.location.lng, id: addressObj ? addressObj.id : null } });
                                } else {
                                    resolve({ status: STATE.FAILED, data: { postcode: req.body.postcode || addressObj.postcode } });
                                }
                            } else {
                                console.error("invalid postcode: " + addressObj.postcode);
                                resolve({ status: STATE.EMPTY, data: { postcode: req.body.postcode || addressObj.postcode } });
                            }
                        });
                    }).on('error', err => ({ status: STATE.FAILED, err: err.toString() }));
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            }
        } else {
            return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER };
        }
    },

    // Write Log file on local system.
    saveTractActivityLog: (req, res) => {
        if (req.body && req.body.tractActivityLog) {
            const folders = configData.identityServerLogFilePath.split('/');
            let folderPath = '';
            _.each(folders, (folder) => {
                folderPath = `${folderPath}${folder}/`;
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
            });

            const timeStamp = Math.floor(new Date().getTime() / 1000);
            const fileName = `${timeStamp}.txt`;
            const fileNameWithPath = `${folderPath}${fileName}`;
            const buff = new Buffer.from(JSON.stringify(req.body.tractActivityLog));
            fs.writeFile(fileNameWithPath, buff, (err) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            });
        }
    }
};

