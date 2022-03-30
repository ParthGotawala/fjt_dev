const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotUpdate, NotDelete } = require('../../errors');

const timelineObjForWoTrans = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER;
const WoTransConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const moment = require('moment');
const { stringFormat } = require('../../constant/Common');

const inputFieldsWorkorderTrans = [
    'woTransID',
    'woID',
    'opID',
    'woOPID',
    'issueQty',
    'checkinEmployeeID',
    'workstationID',
    'isSetup',
    'equipmentID',
    'checkinTime',
    'checkoutTime',
    'checkoutEmployeeID',
    'totalTime',
    'productionTime',
    'checkoutSetupTime',
    'remark',
    'woentrytype',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt'
];

const inputFieldsWorkorderTransInOut = [
    'woTransinoutID',
    'woTransID',
    'woID',
    'opID',
    'woOPID',
    'employeeID',
    'workstationID',
    'equipmentID',
    'checkinTime',
    'checkoutTime',
    'totalTime',
    'productionTime',
    'checkoutSetupTime',
    'isPaused',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt'
];

module.exports = {
    // Checkin operation and employee
    // POST : /api/v1/workorder_trans/checkInOperation
    // @return API response
    checkInOperation: (req, res) => {
        if (req.body && req.body.woOPID && req.body.employeeID) {
            const { sequelize, WorkorderTransEmpinout, Employee, User } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);
            req.body.checkinTime = COMMON.getCurrentUTC();

            return WorkorderTransEmpinout.findOne({
                where: {
                    employeeID: req.body.employeeID,
                    woOPID: req.body.woOPID,
                    checkoutTime: null
                }
            }).then((foundEmployee) => {
                if (foundEmployee) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null, err: null, data: { isActivityAlreadyStarted: true }
                    });
                }

                // Check if start operation activity for single employee in operation than do checkin
                if (req.body.isSingleEmployee) {
                    //  check employee is active or not
                    return Employee.findOne({
                        where: {
                            id: req.body.employeeID,
                            isDeleted: false,
                            isActive: true
                        },
                        attributes: ['id', 'email'],
                        include: [{
                            model: User,
                            as: 'user',
                            attributes: ['username', 'emailAddress', 'passwordDigest', 'employeeID']
                        }]
                    }).then((employee) => {
                        if (employee) {
                            const user = _.first(employee.user);
                            if (user) {
                                req.body.password = COMMON.DECRYPT_AES(req.body.password);
                                return user.authenticate(req.body.password).then(() => sequelize.transaction().then(t =>
                                    // add new employee in Inout table
                                    sequelize
                                        // eslint-disable-next-line no-multi-str
                                        .query('CALL Sproc_checkInEmployeeForOperation (\
                                                    :pWoID, \
                                                    :pOpID, \
                                                    :pWoOPID, \
                                                    :pEquipmentID, \
                                                    :pWorkstationID, \
                                                    :pisSetup, \
                                                    :pIsSingleEmployee, \
                                                    :pEmployeeID, \
                                                    :pWoTransID, \
                                                    :pIssueQty, \
                                                    :pCreatedBy)',
                                            {
                                                replacements: {
                                                    pWoID: req.body.woID,
                                                    pOpID: req.body.opID,
                                                    pWoOPID: req.body.woOPID,
                                                    pEquipmentID: req.body.equipmentID || null,
                                                    pWorkstationID: req.body.workstationID || null,
                                                    pisSetup: req.body.isSetup ? req.body.isSetup : false,
                                                    pIsSingleEmployee: req.body.isSingleEmployee || null,
                                                    pEmployeeID: req.body.employeeID,
                                                    pWoTransID: req.body.isSingleEmployee ? (req.body.woTransID) : (null),
                                                    pIssueQty: req.body.issueQty || null,
                                                    pCreatedBy: req.body.createdBy
                                                },
                                                transaction: t,
                                                type: sequelize.QueryTypes.SELECT
                                            }).then((response) => {
                                                // convert to array your response
                                                const resultObj = _.values(response[response.length - 2]);
                                                if (resultObj.length === 0) {
                                                    return t.commit().then(() => {
                                                        const successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.MFG.ACTIVITY_STARTED_WO_OP_COMMON.message, 'Personnel');
                                                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, successMsg);

                                                        // if check-in done send notification to all employee for same operation
                                                        module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                                            var data = {
                                                                woID: req.body.woID,
                                                                opID: req.body.opID,
                                                                woOPID: req.body.woOPID,
                                                                employeeID: req.body.employeeID,
                                                                senderID: req.body.employeeID,
                                                                // receiver: employees.filter((x) => { return x != req.body.employeeID }),
                                                                receiver: employees
                                                            };
                                                            NotificationMstController.sendTeamOperationCheckIn(req, data);

                                                            if (!req.body.isProductionStarted) {
                                                                const dataTosendFirstCheckInDet = {
                                                                    senderID: req.body.employeeID,
                                                                    receiver: employees,
                                                                    isProductionStarted: true
                                                                };
                                                                NotificationMstController.sendFirstCheckInDetForIsProductionStart(req, dataTosendFirstCheckInDet);
                                                            }
                                                        }).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            /* Empty */
                                                        });
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                    });
                                                } else {
                                                    t.rollback();
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, resultObj.map(e => e.errorText).join('<br/>'));
                                                }
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                t.rollback();
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                            })).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                            })).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_PASSWORD_INCORRECT, err: null, data: null });
                                            });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    // check employee is active or not
                    return Employee.findOne({
                        where: {
                            id: req.body.employeeID,
                            isDeleted: false,
                            isActive: true
                        }
                    }).then((employee) => {
                        if (employee) {
                            return sequelize.transaction().then(t =>
                                // add new employee in Inout table
                                sequelize
                                    // eslint-disable-next-line no-multi-str
                                    .query('CALL Sproc_checkInEmployeeForOperation (\
                                            :pWoID,\
                                            :pOpID,\
                                            :pWoOPID,\
                                            :pEquipmentID,\
                                            :pWorkstationID,\
                                            :pisSetup,\
                                            :pIsSingleEmployee,\
                                            :pEmployeeID,\
                                            :pWoTransID,\
                                            :pIssueQty,\
                                            :pCreatedBy)',
                                        {
                                            replacements: {
                                                pWoID: req.body.woID,
                                                pOpID: req.body.opID,
                                                pWoOPID: req.body.woOPID,
                                                pEquipmentID: req.body.equipmentID || null,
                                                pWorkstationID: req.body.workstationID || null,
                                                pisSetup: req.body.isSetup ? req.body.isSetup : false,
                                                pIsSingleEmployee: req.body.isSingleEmployee || null,
                                                pEmployeeID: req.body.employeeID,
                                                pWoTransID: req.body.isSingleEmployee ? (req.body.woTransID) : (null),
                                                pIssueQty: req.body.issueQty || null,
                                                pCreatedBy: req.body.createdBy
                                            },
                                            transaction: t,
                                            type: sequelize.QueryTypes.SELECT
                                        }).then((response) => {
                                            // convert to array your response
                                            const resultObj = _.values(response[response.length - 2]);
                                            if (resultObj.length === 0) {
                                                return t.commit().then(() => {
                                                    const successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.MFG.ACTIVITY_STARTED_WO_OP_COMMON.message, 'Operation');

                                                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, successMsg);

                                                    // if check-in done send notification to all employee for same operation
                                                    module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                                        var data = {
                                                            woID: req.body.woID,
                                                            opID: req.body.opID,
                                                            woOPID: req.body.woOPID,
                                                            employeeID: req.body.employeeID,
                                                            senderID: req.body.employeeID,
                                                            // receiver: employees.filter((x) => { return x != req.body.employeeID })
                                                            receiver: employees
                                                        };
                                                        NotificationMstController.sendTeamOperationCheckIn(req, data);

                                                        if (!req.body.isProductionStarted) {
                                                            const dataTosendFirstCheckInDet = {
                                                                senderID: req.body.employeeID,
                                                                receiver: employees,
                                                                isProductionStarted: true
                                                            };
                                                            NotificationMstController.sendFirstCheckInDetForIsProductionStart(req, dataTosendFirstCheckInDet);
                                                        }
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        /* Empty */
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                });
                                            } else {
                                                t.rollback();
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, resultObj.map(e => e.errorText).join('<br/>'));
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            t.rollback();
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Stop operation Activity and it's employee (full stop operation activity for individual & team)
    // POST : /api/v1/workorder_trans/checkOutOperation
    // @return API response
    checkOutOperation: (req, res) => {
        if (req.body.woTransID && req.body.woOPID && req.body.opID && req.body.woID && req.body.checkoutEmployeeID) {
            const { sequelize, WorkorderTransEmpinout } = req.app.locals.models;
            return WorkorderTransEmpinout.findOne({
                where: {
                    employeeID: req.body.checkoutEmployeeID,
                    woOPID: req.body.woOPID,
                    // woTransinoutID: req.body.woTransinoutID,
                    woTransID: req.body.woTransID,
                    checkoutTime: null
                }
            }).then((foundEmployee) => {
                if (!foundEmployee) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null, err: null, data: { isActivityAlreadyStopped: true }
                    });
                }

                const checkoutTimeConst = COMMON.getCurrentUTC();
                COMMON.setModelCreatedByFieldValue(req);
                COMMON.setModelUpdatedByFieldValue(req);
                req.body.checkoutTime = checkoutTimeConst;

                const checkinTime = new Date(req.body.checkinTime);
                const checkoutTime = new Date(checkoutTimeConst);
                const timeDiff = Math.abs(checkoutTime.getTime() - checkinTime.getTime());
                const timeSDiffInSeconds = Math.round(timeDiff / 1000);

                /* validation that checkoutSetupTime is not more than taken time (difference) */
                if (req.body.checkoutSetupTime) { // converted milliseconds to seconds
                    if (parseInt(req.body.checkoutSetupTime || 0) > parseInt(timeSDiffInSeconds)) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.PROCESS_SETUP_TIME_NOT_MORE_THAN_TOTAL, err: null, data: null });
                    }
                }
                if (req.body.remark) {
                    req.body.remark = COMMON.setTextAngularValueForDB(req.body.remark);
                }
                if (req.body.qtyControl) {
                    // qty control operation
                    return sequelize.query('CALL Sproc_ValidateWOOperationAtCheckOut (:pWoID,:pOpID, :pWoOPID, :pWOTransID, :pTotalQty, :pPassQty, :pScrapQty , :pIsCheckUnique)',
                        {                           
                            replacements: {
                                pWoID: req.body.woID,
                                pOpID: req.body.opID,
                                pWoOPID: req.body.woOPID,
                                pWOTransID: req.body.woTransID,
                                pTotalQty: req.body.totalQty || 0,
                                pPassQty: req.body.passQty || null,
                                pScrapQty: req.body.scrapQty || null,
                                pIsCheckUnique: req.body.isCheckUnique || null
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then((validInfo) => {                           
                            if (validInfo && validInfo[0] && validInfo[0][0] && validInfo[0][0].hasError) {
                                const errorDetail = validInfo[0][0];
                                const travelerUrl = DATA_CONSTANT.TRAVELER_URL;
                                if ((errorDetail.errCode === DATA_CONSTANT.WO_TRANS_ERROR.TRANS01)) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.PROCESS_QTY_NOT_VALID, err: null, data: null });
                                } else if (req.body.isCheckUnique && errorDetail.errCode === DATA_CONSTANT.WO_TRANS_ERROR.TRANS02) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { stockDetails: validInfo[0][1] }, null);
                                } else if (errorDetail.errCode === DATA_CONSTANT.WO_TRANS_ERROR.TRANS03) {
                                    const opNameDet = COMMON.operationDisplayFormat(MESSAGE_CONSTANT.OPERATION.OPERATION_DISPlAY_FORMAT, errorDetail.vEquipOpName, errorDetail.vEquipOpNumber);
                                    const messageText = `<a target='blank' href='${COMMON.stringFormat(travelerUrl, errorDetail.vEquipWoOPID, req.body.employeeID, errorDetail.vEquipWoOPID)}'> WO#: ${errorDetail.vWoNumber} - ${opNameDet}</a>`;
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.EQUIPMENT_ONLINE_ERROR);    
                                    messageContent.message = COMMON.stringFormat(messageContent.message, messageText);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                                }
                            }
                            return sequelize.transaction().then(t => sequelize
                                .query('CALL Sproc_workorder_operationfullcheckout (:pWOTransID, :pCheckoutEmployeeID, :pCheckoutSetupTime, :pRemark, :pQtyControl, :pEmployeeID, :pTotalQty, :pPassQty, :pReprocessQty,:pObservedQty, :pReworkQty, :pScrapQty, :pIsFirstArticle, :pUserId, :pRoleID,:pBoardWithMissingPartsQty,:pBypassQty)',
                                    {
                                        replacements: {
                                            pWOTransID: req.body.woTransID,
                                            pCheckoutEmployeeID: req.body.checkoutEmployeeID,
                                            pCheckoutSetupTime: req.body.checkoutSetupTime,
                                            pRemark: req.body.remark || null,
                                            pQtyControl: req.body.qtyControl || null,
                                            pEmployeeID: req.body.employeeID || null,
                                            pTotalQty: req.body.totalQty || null,
                                            pPassQty: req.body.passQty || null,
                                            pReprocessQty: req.body.reprocessQty || null,
                                            pObservedQty: req.body.observedQty || null,
                                            pReworkQty: req.body.reworkQty || null,
                                            pScrapQty: req.body.scrapQty || null,
                                            pIsFirstArticle: req.body.isFirstArticle || null,
                                            pUserId: req.user.id,
                                            pRoleID: COMMON.getRequestUserLoginRoleID(req),
                                            pBoardWithMissingPartsQty: req.body.boardWithMissingPartsQty || null,
                                            pBypassQty: req.body.bypassQty || null
                                        },
                                        transaction: t
                                    }).then(() =>
                                        // Add Traveler detail into Elastic Search Engine for Enterprise Search
                                        t.commit().then(() => {
                                            req.params = {
                                                woTransID: req.body.woTransID
                                            };

                                            // Add Traveler detail into Elastic Search Engine for Enterprise Search
                                            // Need to change timeout code due to trasaction not get updated record
                                            EnterpriseSearchController.manageTravelerDetailInElastic(req);

                                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MFG.OPERATION_CHECK_OUT);

                                            // if check-out done send and notification to all operation employee
                                            module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                                var data = {
                                                    woID: req.body.woID,
                                                    opID: req.body.opID,
                                                    woOPID: req.body.woOPID,
                                                    employeeID: req.body.employeeID,
                                                    senderID: req.body.employeeID,
                                                    // receiver: employees.filter((x) => { return x != req.body.employeeID })
                                                    receiver: employees
                                                };
                                                NotificationMstController.sendTeamOperationCheckOut(req, data);
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                /* Empty */
                                            });
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            t.rollback();
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                } else {
                    // not qty control operation
                    return sequelize.transaction().then(t => sequelize
                        .query('CALL Sproc_workorder_operationfullcheckout (:pWOTransID, :pCheckoutEmployeeID, :pCheckoutSetupTime, :pRemark, :pQtyControl, :pEmployeeID, :pTotalQty, :pPassQty, :pReprocessQty,:pObservedQty, :pReworkQty, :pScrapQty, :pIsFirstArticle, :pUserId, :pRoleID,:pBoardWithMissingPartsQty,:pBypassQty)',
                            {
                                replacements: {
                                    pWOTransID: req.body.woTransID,
                                    pCheckoutEmployeeID: req.body.checkoutEmployeeID,
                                    pCheckoutSetupTime: req.body.checkoutSetupTime,
                                    pRemark: req.body.remark || null,
                                    pQtyControl: req.body.qtyControl || null,
                                    pEmployeeID: req.body.employeeID || null,
                                    pTotalQty: req.body.totalQty || null,
                                    pPassQty: req.body.passQty || null,
                                    pReprocessQty: req.body.reprocessQty || null,
                                    pObservedQty: req.body.observedQty || null,
                                    pReworkQty: req.body.reworkQty || null,
                                    pScrapQty: req.body.scrapQty || null,
                                    pIsFirstArticle: req.body.isFirstArticle || null,
                                    pUserId: req.user.id,
                                    pRoleID: COMMON.getRequestUserLoginRoleID(req),
                                    pBoardWithMissingPartsQty: req.body.boardWithMissingPartsQty || null,
                                    pBypassQty: req.body.bypassQty || null
                                },
                                transaction: t
                            }).then(() =>
                                // Add Traveler detail into Elastic Search Engine for Enterprise Search
                                t.commit().then(() => {
                                    req.params = {
                                        woTransID: req.body.woTransID
                                    };
                                    // Add Traveler detail into Elastic Search Engine for Enterprise Search
                                    // Need to change timeout code due to trasaction not get updated record
                                    EnterpriseSearchController.manageTravelerDetailInElastic(req);

                                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MFG.OPERATION_CHECK_OUT);

                                    // if check-out done send and notification to all operation employee
                                    module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                        var data = {
                                            woID: req.body.woID,
                                            opID: req.body.opID,
                                            woOPID: req.body.woOPID,
                                            employeeID: req.body.employeeID,
                                            senderID: req.body.employeeID,
                                            // receiver: employees.filter((x) => { return x != req.body.employeeID }),
                                            receiver: employees
                                        };
                                        NotificationMstController.sendTeamOperationCheckOut(req, data);
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        /* Empty */
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Stop employee from operation activity and if last employee than stop from operation activity too
    // POST : /api/v1/workorder_trans/checkOutEmployeeFromOperation
    // @return API response
    checkOutEmployeeFromOperation: (req, res) => {
        if (req.body.woTransinoutID && req.body.checkoutEmployeeID && req.body.woID && req.body.opID) {
            const { sequelize, WorkorderTransEmpinout } = req.app.locals.models;

            return WorkorderTransEmpinout.findOne({
                where: {
                    employeeID: req.body.checkoutEmployeeID,
                    woTransinoutID: req.body.woTransinoutID,
                    checkoutTime: null
                }
            }).then((foundEmployee) => {
                if (!foundEmployee) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null, err: null, data: { isActivityAlreadyStopped: true }
                    });
                }

                const checkoutTimeConst = COMMON.getCurrentUTC();
                COMMON.setModelCreatedByFieldValue(req);
                COMMON.setModelUpdatedByFieldValue(req);
                req.body.checkoutTime = checkoutTimeConst;

                const checkinTime = new Date(req.body.checkinTime);
                const checkoutTime = new Date(checkoutTimeConst);
                const timeDiff = Math.abs(checkoutTime.getTime() - checkinTime.getTime());
                const timeSDiffInSeconds = Math.round(timeDiff / 1000);

                /* validation that checkoutSetupTime is not more than taken time (difference) */
                if (req.body.checkoutSetupTime) { // converted milliseconds to seconds
                    if (parseInt(req.body.checkoutSetupTime || 0) > parseInt(timeSDiffInSeconds)) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.PROCESS_SETUP_TIME_NOT_MORE_THAN_TOTAL, err: null, data: null });
                    }
                }

                if (req.body.remark) {
                    req.body.remark = COMMON.setTextAngularValueForDB(req.body.remark);
                }

                return sequelize.query('CALL Sproc_ValidateWOOperationAtCheckOut (:pWoID,:pOpID, :pWoOPID, :pWOTransID, :pTotalQty, :pPassQty, :pScrapQty, :pIsCheckUnique)',
                    {
                        replacements: {
                            pWoID: req.body.woID,
                            pOpID: req.body.opID,
                            pWoOPID: req.body.woOPID,
                            pWOTransID: req.body.woTransID,
                            pTotalQty: req.body.totalQty || 0,
                            pPassQty: req.body.passQty || null,
                            pScrapQty: req.body.scrapQty || null,
                            pIsCheckUnique: req.body.isCheckUnique || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((validInfo) => {
                        const travelerUrl = DATA_CONSTANT.TRAVELER_URL;
                        if (validInfo && validInfo[0] && validInfo[0][0] && validInfo[0][0].hasError) {
                            const errorDetail = validInfo[0][0];
                            if ((errorDetail.errCode === DATA_CONSTANT.WO_TRANS_ERROR.TRANS01)) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.PROCESS_QTY_NOT_VALID, err: null, data: null });
                            } else if (req.body.isCheckUnique && errorDetail.errCode === DATA_CONSTANT.WO_TRANS_ERROR.TRANS02) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { stockDetails: validInfo[0][1] }, null);
                            } else if (errorDetail.errCode === DATA_CONSTANT.WO_TRANS_ERROR.TRANS03) {
                                const opNameDet = COMMON.operationDisplayFormat(MESSAGE_CONSTANT.OPERATION.OPERATION_DISPlAY_FORMAT, errorDetail.vEquipOpName, errorDetail.vEquipOpNumber);
                                const messageText = `<a target='blank' href='${COMMON.stringFormat(travelerUrl, errorDetail.vEquipWoOPID, req.body.employeeID, errorDetail.vEquipWoOPID)}'> WO#: ${errorDetail.vWoNumber} - ${opNameDet}</a>`;
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.EQUIPMENT_ONLINE_ERROR);
                                messageContent.message = COMMON.stringFormat(messageContent.message, messageText);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                            }
                        }
                        return sequelize.transaction().then(t => sequelize
                            // eslint-disable-next-line no-multi-str
                            .query('CALL Sproc_checkoutEmployeeFromOperation (:pWOTransID, :pWOTransinoutID, :pCheckoutEmployeeID, \
                 :pCheckoutSetupTime, :pRemark,:pTotalQty,:pPassQty,:pObservedQty,:pReworkQty,:pScrapQty,:pReprocessQty,:pQtyControl,:pIsFirstArticle,:pRoleID, \
                 :pBoardWithMissingPartsQty,:pBypassQty)',
                                {
                                    replacements: {
                                        pWOTransID: req.body.woTransID,
                                        pWOTransinoutID: req.body.woTransinoutID,
                                        pCheckoutEmployeeID: req.body.checkoutEmployeeID,
                                        pCheckoutSetupTime: req.body.checkoutSetupTime,
                                        pRemark: req.body.remark || null,
                                        pTotalQty: req.body.totalQty,
                                        pPassQty: req.body.passQty,
                                        pObservedQty: req.body.observedQty,
                                        pReworkQty: req.body.reworkQty,
                                        pScrapQty: req.body.scrapQty,
                                        pReprocessQty: req.body.reprocessQty || null,
                                        pQtyControl: req.body.qtyControl,
                                        pIsFirstArticle: req.body.isFirstArticle,
                                        pRoleID: COMMON.getRequestUserLoginRoleID(req),
                                        pBoardWithMissingPartsQty: req.body.boardWithMissingPartsQty || null,
                                        pBypassQty: req.body.bypassQty || null
                                    },
                                    transaction: t
                                }).then(() => t.commit().then(() => {
                                    // Add Traveler detail into Elastic Search Engine for Enterprise Search
                                    req.params = {
                                        woTransinoutID: req.body.woTransinoutID
                                    };
                                    EnterpriseSearchController.manageTravelerDetailInElastic(req);

                                    const successMsg = COMMON.stringFormat(MESSAGE_CONSTANT.MFG.ACTIVITY_STOPPED_WO_OP_COMMON.message, 'Personnel');
                                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, successMsg);

                                    module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                        var data = {
                                            woID: req.body.woID,
                                            opID: req.body.opID,
                                            woOPID: req.body.woOPID,
                                            employeeID: req.body.employeeID,
                                            senderID: req.body.employeeID,
                                            // receiver: employees.filter((x) => { return x != req.body.employeeID })
                                            receiver: employees
                                        };
                                        NotificationMstController.sendTeamOperationCheckOut(req, data);
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        /* Empty */
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Pause employee from operation
    // POST : /api/v1/workorder_trans/pauseEmployeeFromOperation
    // @return API response
    pauseEmployeeFromOperation: (req, res) => {
        if (req.body && req.body.woTransinoutID) {
            const { sequelize } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);

            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_pauseEmployeeForOperation (:pWOTransinoutID, :pCreatedBy)',
                    {
                        replacements: {
                            pWOTransinoutID: req.body.woTransinoutID,
                            pCreatedBy: req.body.createdBy
                        },
                        transaction: t
                    }).then((response) => {
                        if (response.length === 0) {
                            return t.commit().then(() => {
                                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, COMMON.stringFormat(MESSAGE_CONSTANT.MFG.WO_OP_PAUSED_SUCCESS_COMMON.message, 'Operation'));

                                module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                    var data = {
                                        woID: req.body.woID,
                                        opID: req.body.opID,
                                        woOPID: req.body.woOPID,
                                        employeeID: req.body.employeeID,
                                        senderID: req.body.employeeID,
                                        // receiver: employees.filter((x) => { return x != req.body.employeeID }),
                                        receiver: employees
                                    };
                                    NotificationMstController.sendTeamOperationPause(req, data);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    /* Empty */
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.map(e => e.errorText).join('<br/>'));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Pause All employee of wo operation transaction (team case)
    // POST : /api/v1/workorder_trans/pauseAllEmployeeFromOperation
    // @return API response
    pauseAllEmployeeFromOperation: (req, res) => {
        if (req.body && req.body.woOPID && req.body.woTransID) {
            const { sequelize } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);

            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_PauseAllEmployeeForOperation (:pwoOPID,:pwoTransID, :pCreatedBy)',
                    {
                        replacements: {
                            pwoOPID: req.body.woOPID,
                            pwoTransID: req.body.woTransID,
                            pCreatedBy: req.body.createdBy
                        },
                        transaction: t
                    }).then((response) => {
                        if (response.length === 0) {
                            return t.commit().then(() => {
                                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                    null, COMMON.stringFormat(MESSAGE_CONSTANT.MFG.WO_OP_PAUSED_SUCCESS_COMMON.message, 'Operation'));

                                module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                    var data = {
                                        woID: req.body.woID,
                                        opID: req.body.opID,
                                        woOPID: req.body.woOPID,
                                        employeeID: req.body.employeeID,
                                        senderID: req.body.employeeID,
                                        // receiver: employees.filter((x) => { return x != req.body.employeeID })
                                        receiver: employees
                                    };
                                    NotificationMstController.sendTeamOperationPause(req, data);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    /* Empty */
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.map(e => e.errorText).join('<br/>'));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Resume employee in operation
    // POST : /api/v1/workorder_trans/resumeEmployeeForOperation
    // @return API response
    resumeEmployeeForOperation: (req, res) => {
        if (req.body && req.body.woTransemppausedID && req.body.woTransinoutID) {
            const { sequelize } = req.app.locals.models;
            COMMON.setModelUpdatedByFieldValue(req);

            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_resumeEmployeeForOperation (:pWOTransemppausedID, :pWOTransinoutID, :pUpdatedBy)',
                    {
                        replacements: {
                            pWOTransemppausedID: req.body.woTransemppausedID,
                            pWOTransinoutID: req.body.woTransinoutID,
                            pUpdatedBy: req.body.updatedBy
                        },
                        transaction: t
                    }).then((response) => {
                        if (response.length === 0) {
                            return t.commit().then(() => {
                                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, COMMON.stringFormat(MESSAGE_CONSTANT.MFG.WO_OP_RESUMED_SUCCESS_COMMON.message, 'Current operation'));

                                module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                                    var data = {
                                        woID: req.body.woID,
                                        opID: req.body.opID,
                                        woOPID: req.body.woOPID,
                                        employeeID: req.body.employeeID,
                                        senderID: req.body.employeeID,
                                        // receiver: employees.filter((x) => { return x != req.body.employeeID })
                                        receiver: employees
                                    };
                                    NotificationMstController.sendTeamOperationResume(req, data);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    /* Empty */
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                response.map(e => e.errorText).join('<br/>'));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // Get traveler page details for employee, operation and transaction
    // POST : /api/v1/workorder_trans/getTravelerDetails
    // @return get traveler page details for employee, operation and transaction
    getTravelerDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetTravelerPageDetails (:pWOOPID, :pEmployeeID);',
                        {
                            replacements: {
                                pWOOPID: req.body.listObj ? req.body.listObj.woOPID : null,
                                pEmployeeID: req.body.listObj ? req.body.listObj.employeeID : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then((response) => {
                const objData = {
                    woOperationDetails: _.values(response[0][0]).length > 0 ? (_.first(_.values(response[0][0]))) : (null),
                    employeeDetails: _.values(response[0][1]).length > 0 ? (_.first(_.values(response[0][1]))) : (null),
                    wpOperationList: _.values(response[0][2]),
                    woHoldDetails: _.values(response[0][3]).length > 0 ? (_.first(_.values(response[0][3]))) : (null),
                    woOPHoldDetails: _.values(response[0][4]).length > 0 ? (_.first(_.values(response[0][4]))) : (null),
                    woTransactionDetails: _.values(response[0][5]).length > 0 ? (_.first(_.values(response[0][5]))) : (null),
                    woOperationEmployeeList: _.values(response[0][6]),
                    woActiveOperationList: _.values(response[0][7]),
                    woPausedOperationList: _.values(response[0][8]),
                    woLatestStockDetails: _.values(response[0][9]).length > 0 ? (_.first(_.values(response[0][9]))) : (null),
                    woSalesOrderDetails: _.values(response[0][10])
                };
                if (objData.woOperationDetails) {
                    if (objData.woOperationDetails.opDescription) { objData.woOperationDetails.opDescription = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.opDescription); }
                    if (objData.woOperationDetails.opDoes) { objData.woOperationDetails.opDoes = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.opDoes); }
                    if (objData.woOperationDetails.opDonts) { objData.woOperationDetails.opDonts = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.opDonts); }
                    if (objData.woOperationDetails.opDeferredInstruction) { objData.woOperationDetails.opDeferredInstruction = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.opDeferredInstruction); }
                    if (objData.woOperationDetails.opManagementInstruction) { objData.woOperationDetails.opManagementInstruction = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.opManagementInstruction); }
                    if (objData.woOperationDetails.opWorkingCondition) { objData.woOperationDetails.opWorkingCondition = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.opWorkingCondition); }
                    if (objData.woOperationDetails.firstPcsConclusion) { objData.woOperationDetails.firstPcsConclusion = COMMON.getTextAngularValueFromDB(objData.woOperationDetails.firstPcsConclusion); }
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, objData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },


    // Get traveler page details for employee, operation and transaction
    // POST : /api/v1/workorder_trans/getTravelerLatestDetails
    // @return get traveler page details for transaction
    getTravelerLatestDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_GetTravelerLatestDetails (:pWOOPID, :pEmployeeID, :pWOID);',
                        {
                            replacements: {
                                pWOOPID: req.body.listObj ? req.body.listObj.woOPID : null,
                                pEmployeeID: req.body.listObj ? req.body.listObj.employeeID : null,
                                pWOID: req.body.listObj ? req.body.listObj.woID : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
                woTransactionDetails: _.values(response[0][0]).length > 0 ? (_.first(_.values(response[0][0]))) : (null),
                woOperationEmployeeList: _.values(response[0][1]),
                woActiveOperationList: _.values(response[0][2]),
                woPausedOperationList: _.values(response[0][3]),
                woLatestStockDetails: _.values(response[0][4]).length > 0 ? (_.first(_.values(response[0][4]))) : (null)
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get active operation details for employee
    // POST : /api/v1/workorder_trans/getActiveOperationListByEmployeeID
    // @return get active operation details for employee
    getActiveOperationListByEmployeeID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            promises.push(
                sequelize
                    .query('CALL Sproc_getActiveOperationListByEmployeeID (:pEmployeeID);',
                        {
                            replacements: {
                                pEmployeeID: req.body.listObj ? req.body.listObj.employeeID : null
                            },
                            type: sequelize.QueryTypes.SELECT
                        })
            );
            return Promise.all(promises).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
                activeOperationList: _.values(response[0][0])
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },


    // Retrieve list of workorder transDetails
    // POST : /api/v1/workorder_trans/retrieveWorkorderTransDetails
    // @return list of workorder transDetails
    retrieveWorkorderTransDetails: (req, res) => {
        const { sequelize, WorkorderTrans, WorkorderTransEmpinout, Employee } = req.app.locals.models;
        if (req.body.operationObj) {
            let woTransAllDetails = {};
            return WorkorderTrans.findAll({
                where: {
                    woOPID: req.body.operationObj.woOPID
                    // checkOutTime: { [Op.ne]: null }   commented as per requirement/show interim checkout details too 30/04/2020
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('WorkorderTrans.issueQty')), 'totalIssueQty'],
                    [sequelize.fn('SUM', sequelize.col('WorkorderTrans.totalTime')), 'totalTotalTime'],
                    [sequelize.fn('SUM', sequelize.col('WorkorderTrans.productionTime')), 'totalProductionTime'],
                    'woOPID'],
                group: ['woOPID']
            }).then((woTransDetails) => {
                if (woTransDetails) {
                    if (woTransDetails.length > 0) {
                        woTransAllDetails = _.first(woTransDetails);
                    }
                    return WorkorderTrans.findAll({
                        where: {
                            woOPID: req.body.operationObj.woOPID
                            // checkOutTime: { [Op.ne]: null }, commented as per requirement/show interim checkout details too 30/04/2020
                        },

                        attributes: [
                            [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('WorkorderTrans.checkinTime')), 'checkinTime'],
                            [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('WorkorderTrans.checkoutTime')), 'checkoutTime'],
                            'totalTime', 'productionTime', 'isSetup', 'issueQty'],
                        order: [['checkinTime', 'DESC']],
                        include: [{
                            model: WorkorderTransEmpinout,
                            as: 'workorderTransEmpinoutAll',
                            required: false,
                            where: {
                                woOPID: req.body.operationObj.woOPID,
                                checkOutTime: { [Op.ne]: null }
                            },
                            order: [['checkinTime', 'DESC']],
                            attributes: [[sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('workorderTransEmpinoutAll.checkinTime')), 'checkinTime'],
                            [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('workorderTransEmpinoutAll.checkoutTime')), 'checkoutTime'], 'totalTime', 'productionTime'],
                            include: [{
                                model: Employee,
                                as: 'employee',
                                require: false,
                                attributes: ['initialName']
                            }]
                        }, {
                            model: Employee,
                            as: 'checkOutEmployee',
                            attributes: ['initialName']
                        }]
                    }).then((woTransEmpInoutDetails) => {
                        if (woTransEmpInoutDetails && woTransEmpInoutDetails.length > 0) {
                            woTransAllDetails.dataValues.woTransEmpInoutDetails = [];
                            woTransAllDetails.dataValues.woTransEmpInoutDetails = woTransEmpInoutDetails;
                        }
                        return resHandler.successRes(res, 200, STATE.SUCCESS, woTransAllDetails);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                    });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND));
        }
    },
    // Retrieve list of workorder operation stock details
    // POST : /api/v1/workorder_trans/retrieveWorkorderOperationStockDetails
    // @return list of workorder operation stock details
    retrieveWorkorderOperationStockDetails: (req, res) => {
        const { sequelize, WorkorderTrans, WorkorderOperation, WorkorderTransProduction, Employee } = req.app.locals.models;
        if (req.body.operationObj) {
            let woTransAllDetails = {};
            return WorkorderTrans.findAll({
                where: {
                    woOPID: req.body.operationObj.woOPID
                    // checkOutTime: { [Op.ne]: null }, //commented as per requirement/show interim checkout details too 30/04/2020
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('WorkorderTrans.issueQty')), 'totalIssueQty'],
                    [sequelize.fn('SUM', sequelize.col('WorkorderTrans.totalTime')), 'totalTotalTime'],
                    [sequelize.fn('SUM', sequelize.col('WorkorderTrans.productionTime')), 'totalProductionTime'],
                    'woOPID'],
                group: ['woOPID']
            }).then((woTransDetails) => {
                if (woTransDetails) {
                    if (woTransDetails.length > 0) {
                        woTransAllDetails = _.first(woTransDetails);
                    }
                    return WorkorderTransProduction.findAll({
                        attributes: ['woTransprodID', 'woTransID', 'employeeID', 'totalQty', 'passQty', 'reprocessQty',
                            'observedQty', 'reworkQty', 'scrapQty', 'isFirstArticle', 'boardWithMissingPartsQty', 'bypassQty',
                            [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('WorkorderTransProduction.createdAt')), 'createdAt']],
                        include: [{
                            model: WorkorderTrans,
                            as: 'workorderTrans',
                            attributes: ['woTransID', 'woOPID',
                                [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('workorderTrans.checkinTime')), 'checkinTime'],
                                [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('workorderTrans.checkOutTime')), 'checkOutTime'],
                                'checkinEmployeeID', 'checkoutEmployeeID', 'isSetup', 'issueQty'],
                            where: {
                                woTransID: { [Op.col]: 'WorkorderTransProduction.woTransID' },
                                woOPID: req.body.operationObj.woOPID,
                                // checkOutTime: { [Op.ne]: null }, //commented as per requirement/show interim checkout details too 30/04/2020
                                isSetup: false
                            },
                            order: [['checkinTime', 'DESC']],
                            include: [{
                                model: WorkorderOperation,
                                as: 'workorderOperation',
                                attributes: ['woOPID', 'qtyControl'],
                                where: {
                                    qtyControl: true
                                }
                            }, {
                                model: Employee,
                                as: 'checkInEmployee',
                                require: false,
                                attributes: ['id', 'firstName', 'lastName', 'initialName']
                            }, {
                                model: Employee,
                                as: 'checkOutEmployee',
                                require: false,
                                attributes: ['id', 'firstName', 'lastName', 'initialName']
                            }]
                        }, {
                            model: Employee,
                            as: 'employee',
                            require: false,
                            attributes: ['id', 'firstName', 'lastName', 'initialName']
                        }]
                    }).then((woTransProductionDetails) => {
                        if (woTransProductionDetails && woTransProductionDetails.length > 0) {
                            woTransAllDetails.dataValues.woTransProductionDetails = [];
                            woTransAllDetails.dataValues.woTransProductionDetails = woTransProductionDetails;
                        }
                        return resHandler.successRes(res, 200, STATE.SUCCESS, woTransAllDetails);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                    });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND));
        }
    },
    // Retrieve workorder transaction detail
    // GET : /api/v1/workorder_trans
    // @return workorder transaction detail
    retrieveWorkorder_Trans: (req, res) => {
        if (req.params.woTransID) {
            const { WorkorderTrans, WorkorderTransProduction } = req.app.locals.models;
            return WorkorderTrans.findByPk(req.params.woTransID, {
                where: {
                    isDeleted: false
                },
                include: [
                    {
                        model: WorkorderTransProduction,
                        as: 'workorderTransProduction',
                        attributes: ['woTransprodID', 'scrapQty', 'employeeID',
                            'totalQty', 'passQty', 'reprocessQty', 'observedQty', 'reworkQty', 'boardWithMissingPartsQty', 'bypassQty']
                    }]
            }).then((workordertrans) => {
                if (!workordertrans) {
                    return Promise.reject(new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND));
                }
                if (workordertrans.remark) {
                    workordertrans.remark = COMMON.getTextAngularValueFromDB(workordertrans.remark);
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, workordertrans);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_FOUND, err));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list workorder transaction
    // GET : /api/v1/workorder_trans/retrieveWorkorder_TransList
    // @return list of workorder transaction
    retrieveWorkorder_TransList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveWorkorderTransForWOManualEntry (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWoID)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pWoID: req.body.woID ? req.body.woID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, { workordertrans: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create workorder transaction
    // POST : /api/v1/workorder_trans/createWorkorder_Trans
    // @return new created workorder transaction
    createWorkorder_Trans: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            let checkOutTimeFromate;
            const checkInTimeFromate = new Date(req.body.checkinTime);
            if (req.body.checkoutTime) {
                checkOutTimeFromate = new Date(req.body.checkoutTime);
            }
            let timeSDiffInSeconds = 0;
            if (req.body.checkoutTime) {
                const timeDiff = Math.abs(checkOutTimeFromate.getTime() - checkInTimeFromate.getTime());
                timeSDiffInSeconds = Math.round(timeDiff / 1000);
                /* validation that checkoutSetupTime is not more than taken time (difference) */
                if (parseInt(req.body.checkoutSetupTime || 0) > parseInt(timeSDiffInSeconds)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.PROCESS_SETUP_TIME_NOT_MORE_THAN_TOTAL, err: null, data: null });
                }
            }

            return sequelize
                .query('CALL Sproc_Workorder_Manual_Entry(:pwoID,:popID,:pwoOPID,:pemployeeID,:pequipmentID,:pcheckinTime,:pisSetup,:pcheckoutTime,:pcheckoutSetupTime,:ptotalTime,:pproductionTime,:pcreatedBy,:pupdatedBy,:premark,:pwoentrytype,:pworkstationID,:ptotalQty,:ppassQty,:pobservedQty,:preworkQty,:pscrapQty,:pissueQty,:preprocessQty,:pqtyControl,:ptransID,:ptransProdctionID,:pCreateByRoleId,:pUpdateByRoleId,:pboardWithMissingPartsQty,:pbypassQty)',
                    {
                        replacements: {
                            pwoID: req.body.woID,
                            popID: req.body.opID,
                            pwoOPID: req.body.woOPID,
                            pemployeeID: req.body.checkinEmployeeID,
                            pequipmentID: req.body.equipmentID || null,
                            pcheckinTime: moment.utc(checkInTimeFromate, 'hh:mma').format(COMMON.MySqlDateTime),
                            pisSetup: req.body.isSetup ? req.body.isSetup : false,
                            pcheckoutTime: checkOutTimeFromate ? moment.utc(checkOutTimeFromate, 'hh:mma').format(COMMON.MySqlDateTime) : null,
                            pcheckoutSetupTime: req.body.checkoutSetupTime || null,
                            ptotalTime: timeSDiffInSeconds,
                            pproductionTime: (parseInt(timeSDiffInSeconds) - parseInt(req.body.checkoutSetupTime || 0)),
                            pcreatedBy: req.user.id,
                            pupdatedBy: req.user.id,
                            premark: req.body.remark || null,
                            pwoentrytype: req.body.woentrytype,
                            pworkstationID: req.body.workstationID || null,
                            ptotalQty: parseInt(req.body.totalQty || 0),
                            ppassQty: parseInt(req.body.passQty || 0),
                            pobservedQty: parseInt(req.body.observedQty || 0),
                            preworkQty: parseInt(req.body.reworkQty || 0),
                            pscrapQty: parseInt(req.body.scrapQty || 0),
                            pissueQty: parseInt(req.body.issueQty || 0),
                            preprocessQty: parseInt(req.body.reprocessQty || 0),
                            pqtyControl: req.body.qtyControl,
                            ptransID: req.body.woTransID || null,
                            ptransProdctionID: req.body.transProductionID || null,
                            pCreateByRoleId: req.user.defaultLoginRoleID,
                            pUpdateByRoleId: req.user.defaultLoginRoleID,
                            pboardWithMissingPartsQty: parseInt(req.body.boardWithMissingPartsQty) || null,
                            pbypassQty: parseInt(req.body.bypassQty) || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((resultData) => {
                    // if (resultData[0].length - 2) {
                    //     resHandler.successRes(res, 200, STATE.SUCCESS, MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_CREATED);
                    // }
                    // else{
                    var sprocQtyResp = resultData[1][0] ? resultData[1][0] : null;
                    var wotransID = resultData[2][0] ? resultData[2][0] : null;
                    const respOfCreateManualEntry = sprocQtyResp && sprocQtyResp.wotransID ? sprocQtyResp : wotransID;
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { woTransID: respOfCreateManualEntry, userMessage: MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_CREATED });
                    // }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_NOT_CREATED));
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Update workorder trasaction by woTransID
    // PUT : /api/v1/workorder_trans/updateWorkorder_Trans
    // @param {woTransID} int
    // @return API response
    updateWorkorder_Trans: (req, res) => {
        const { sequelize, WorkorderTrans, WorkorderTransEmpinout } = req.app.locals.models;
        if (req.body) {
            const checkInTimeFromate = new Date(req.body.checkinTime);
            const checkOutTimeFromate = new Date(req.body.checkoutTime);
            let timeSDiffInSeconds = 0;
            if (req.body.checkoutTime) {
                const timeDiff = Math.abs(checkOutTimeFromate.getTime() - checkInTimeFromate.getTime());
                timeSDiffInSeconds = Math.round(timeDiff / 1000);

                /* validation that checkoutSetupTime is not more than taken time (difference) */
                if (parseInt(req.body.checkoutSetupTime || 0) > parseInt(timeSDiffInSeconds)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.PROCESS_SETUP_TIME_NOT_MORE_THAN_TOTAL, err: null, data: null });
                }
            }

            COMMON.setModelUpdatedByFieldValue(req);
            req.body.totalTime = timeSDiffInSeconds;
            req.body.productionTime = (parseInt(timeSDiffInSeconds) - parseInt(req.body.checkoutSetupTime || 0));
            if (req.body.remark) {
                req.body.remark = COMMON.setTextAngularValueForDB(req.body.remark);
            }
            return sequelize.transaction(t => WorkorderTrans.update(req.body, {
                where: {
                    woTransID: req.params.woTransID
                },
                fields: inputFieldsWorkorderTrans,
                transaction: t
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] === 1) {
                    const empinoutObj = {};
                    empinoutObj.equipmentID = req.body.equipmentID;
                    empinoutObj.checkinTime = req.body.checkinTime;
                    empinoutObj.isSetup = req.body.isSetup;
                    empinoutObj.checkoutTime = req.body.checkoutTime;
                    empinoutObj.checkoutSetupTime = req.body.checkoutSetupTime;
                    empinoutObj.totalTime = timeSDiffInSeconds;
                    empinoutObj.productionTime = (parseInt(timeSDiffInSeconds) - parseInt(empinoutObj.checkoutSetupTime || 0));
                    empinoutObj.updatedBy = req.user.id;

                    return WorkorderTransEmpinout.update(empinoutObj, {
                        where: {
                            woTransID: req.params.woTransID
                        },
                        fields: inputFieldsWorkorderTransInOut,
                        transaction: t
                    }).then(() => {
                        if (req.body.woentrytype && req.body.woentrytype === COMMON.WorkorderEntryType.Manual) {
                            // [S] add log of update work order manual entry for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: WoTransConstObj.MANUAL_ENTRY.UPDATE.title,
                                eventDescription: COMMON.stringFormat(WoTransConstObj.MANUAL_ENTRY.UPDATE.description, req.body.woNumber, req.user.username),
                                refTransTable: WoTransConstObj.MANUAL_ENTRY.refTransTableName,
                                refTransID: req.params.woTransID,
                                eventType: timelineObjForWoTrans.id,
                                url: COMMON.stringFormat(WoTransConstObj.MANUAL_ENTRY.url, req.body.woID, req.params.woTransID),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of update work order manual entry for timeline users
                        }

                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_UPDATED });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_NOT_UPDATED));
                    });
                } else {
                    t.rollback();
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_NOT_UPDATED));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.WORKORDER_TRANS.MANUAL_ENTRY_NOT_UPDATED));
            }));
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Delete workorder transaction by woTransID
    // DELETE : /api/v1/workorder_trans/deleteWorkorder_Trans
    // @param {woTransID} int
    // @return API response
    deleteWorkorder_Trans: (req, res) => {
        const { WorkorderTrans, Workorder } = req.app.locals.models;
        if (req.params.woTransID) {
            COMMON.setModelDeletedByFieldValue(req);
            const woTransIDs = req.params.woTransID.split(',') || [];

            return WorkorderTrans.findOne({
                where: {
                    woTransID: woTransIDs[0]
                },
                attributes: ['woentrytype'],
                include: [{
                    model: Workorder,
                    as: 'workorder',
                    attributes: ['woNumber']
                }]
            }).then((tranRowData) => {
                WorkorderTrans.update(req.body, {
                    where: {
                        woTransID: woTransIDs,
                        deletedAt: null
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                }).then((rowsDeleted) => {
                    if (rowsDeleted[0] > 0) {
                        if (tranRowData && tranRowData.woentrytype && tranRowData.woentrytype === COMMON.WorkorderEntryType.Manual) {
                            // [S] add log of delete work order manual entry for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: WoTransConstObj.MANUAL_ENTRY.DELETE.title,
                                eventDescription: COMMON.stringFormat(WoTransConstObj.MANUAL_ENTRY.DELETE.description,
                                    tranRowData.workorder.woNumber, req.user.username),
                                refTransTable: WoTransConstObj.MANUAL_ENTRY.refTransTableName,
                                refTransID: woTransIDs.toString(),
                                eventType: timelineObjForWoTrans.id,
                                url: null,
                                eventAction: timelineEventActionConstObj.DELETE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of delete work order manual entry for timeline users
                        }
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_TRANS.DELETED });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_DELETED));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_DELETED));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.WORKORDER_TRANS.NOT_DELETED));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get list of workorder operation employee by woOPID
    // @param {woOPID} int
    // @return list of workorder opration employee
    getWOOPEmployees: (req, woOPID) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployees (:woOPID, :woID, :opID)',
                {
                    replacements: {
                        woOPID: woOPID,
                        woID: null,
                        opID: null
                    }
                })
            .then((response) => {
                if (response) { return response.map(x => x.employeeID); } else { return []; }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return [];
            });
    },

    // check work order production started
    // POST : /api/v1/workorder_trans/checkWorkorderProductionStarted
    // @return API response
    checkWorkorderProductionStarted: (req, res) => {
        const { WorkorderTransEmpinout } = req.app.locals.models;
        if (req.body && req.body.woID) {
            return WorkorderTransEmpinout.findOne({
                where: {
                    woID: req.body.woID
                }
            }).then((foundTrans) => {
                if (foundTrans) {
                    return resHandler.successRes(res, 200, STATE.EMPTY, { isProductionStarted: true });
                } else {
                    return resHandler.successRes(res, 200, STATE.EMPTY, { isProductionStarted: false });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_TRANS.CHECK_IN_FAILED));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // get time status of employees that checked-in for any operation in traveler flow
    // @param {woTransID} int
    // @param {woOPID} int
    // POST : /api/v1/workorder_trans/getTravelerEmpWorkingTimeStatus
    // @return enmployee current timing status for traveling operation
    getTravelerEmpWorkingTimeStatus: (req, res) => {
        if (req.body && req.body.woOPID) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_getTravelerEmpWorkingTimeStatus (:pwoOPID,:pwoTransID)', {
                    replacements: {
                        pwoOPID: req.body.woOPID,
                        pwoTransID: req.body.woTransID ? req.body.woTransID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (!response) {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, null);
                    }
                    const headerDetails = {
                        timerData: _.values(response[0]).length > 0 ? (_.first(_.values(response[0]))) : (null),
                        timerCurrentData: _.values(response[1]).length > 0 ? (_.first(_.values(response[1]))) : (null)
                    };
                    return resHandler.successRes(res, 200, STATE.SUCCESS, headerDetails);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.SUCCESS, null);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, null);
        }
    },

    // get expired and expiring part(UMID) used in traveler flow include wo op supplies,material and tools and assembly parts
    // @param {woOPID} int
    // @param {keyNameOfexpireDaysLeft} string
    // POST : /api/v1/workorder_trans/getWoOpExpiredExpiringPartDetails
    // @return expired and expiring part
    getWoOpExpiredExpiringPartDetails: (req, res) => {
        if (req.body && req.body.woOPID && req.body.keyNameOfexpireDaysLeft) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_getWoOpExpiredExpiringPartDetails (:pwoOPID,:pkeyNameOfexpireDaysLeft,:pshowAllParts)', {
                    replacements: {
                        pwoOPID: req.body.woOPID ? req.body.woOPID : null,
                        pkeyNameOfexpireDaysLeft: req.body.keyNameOfexpireDaysLeft,
                        pshowAllParts: req.body.showAllParts ? req.body.showAllParts : null
                    }
                }).then((response) => {
                    if (!response || response === 'invalid key') {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, null);
                    }
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { expirePartList: response });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.FAILED, null);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, null);
        }
    },
    // Get wo op employee wise pending acknowledge notification list
    // POST : /api/v1/workorder_trans/getWOOPUserWiseAckPendingNotificationList
    // @param {woOPID} int
    // @param {userID} int
    // @return list of notification
    getWOOPUserWiseAckPendingNotificationList: (req, res) => {
        if (req.body && req.body.userID && req.body.woOPID) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_getWOOPUserWiseAckPendingNotification (:preceiverID,:pwoOPID,:pwoID,:pwoNotiCategoryList)',
                    {
                        replacements: {
                            preceiverID: req.body.userID,
                            pwoOPID: req.body.woOPID,
                            pwoID: req.body.woID,
                            pwoNotiCategoryList: req.body.woNotiCategoryList.toString()
                        }
                    })
                .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, { allPendingAckNotifications: response })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.FAILED, null);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get scan detail for rack master
    // POST : /api/v1/workorder_trans/scanIncomingOutgoingRack
    // @return rack detail for outgoing
    scanIncomingOutgoingRack: (req, res) => {
        if (req.body) {
            const objRack = req.body.objScan;
            const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_scanAndTransferRackMaterial (:pRackNumber,:pScanType,:pwoTransID,:pwoOPID,:pwoID,:ppartID,:popStatus,:pemployeeID,:puserId,:proleID,:pConfirm)',
                    {
                        replacements: {
                            pRackNumber: objRack.pRackNumber,
                            pScanType: objRack.pScanType,
                            pwoTransID: objRack.pwoTransID,
                            pwoOPID: objRack.pwoOPID,
                            pwoID: objRack.pwoID,
                            ppartID: objRack.ppartID,
                            popStatus: objRack.pStatus,
                            pemployeeID: objRack.pemployeeID,
                            puserId: req.user.id,
                            proleID: COMMON.getRequestUserLoginRoleID(req),
                            pConfirm: objRack.pConfirm
                        }
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { scanMaterial: response }, response[0].statusCode === DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS ? MESSAGE_CONSTANT.INCOMING_OUTGOING.SCANNED : null)).catch((err) => {
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

    // Get scan detail to clear rack
    // POST : /api/v1/workorder_trans/scanClearMaterial
    // @return rack detail to clear
    scanClearMaterial: (req, res) => {
        if (req.body) {
            const objRack = req.body.objScan;
            const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_scanClearMaterial (:pRackNumber,:pwoTransID,:pisClean,:puserID,:pissuperadmin,:puserroleID)',
                    {
                        replacements: {
                            pRackNumber: objRack.pRackNumber,
                            pwoTransID: objRack.pwoTransID || null,
                            pisClean: objRack.pisClean || false,
                            puserID: req.user.id,
                            pissuperadmin: objRack.issuperadmin,
                            puserroleID: req.user.defaultLoginRoleID
                        }
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { scanMaterial: response }, (response[0].statusCode === DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS && !response[0].currentOperation) ? MESSAGE_CONSTANT.CLEAR_RACK.SCANNED : null)).catch((err) => {
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
    // Get scan rack detail to show history
    // POST : /api/v1/workorder_trans/scanRackforHistory
    // @return rack detail to show history
    scanRackforHistory: (req, res) => {
        if (req.body) {
            const objRack = req.body.objScan;
            const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_scanRackHistory (:pRackNumber)',
                    {
                        replacements: {
                            pRackNumber: objRack.pRackNumber
                        }
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { scanRack: response }, null)).catch((err) => {
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

    // Get scan rack detail
    // POST : /api/v1/workorder_trans/getCurrentRackStatus
    // @return rack detail of current rack
    getCurrentRackStatus: (req, res) => {
        if (req.body) {
            const objRack = req.body.objScan;
            const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_GetCurrentRackDetails (:prackNumber)',
                    {
                        replacements: {
                            prackNumber: objRack.pRackNumber
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { scanMaterial: _.values(response[0]), operationDet: response.length > 1 ? _.values(response[1]) : [] }, null)).catch((err) => {
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
    // Get active operation details for employee/work order
    // POST : /api/v1/workorder_trans/getActiveOperationListByEmployeeID
    // @return get active operation details for employee
    getActiveOperationList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order && filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }
            if (!strWhere) strWhere = null;
            return sequelize.query('CALL Sproc_GetActiveOperationsList (:ppageIndex, :precordPerPage, :pOrderBy, :pWhereClause, :pEmployeeID, :pWoID , :pCount);',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: req.body.pageSize,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pEmployeeID: req.body.employeeID ? req.body.employeeID : null,
                        pWoID: req.body.woID ? req.body.woID : null,
                        pCount: req.body.count ? req.body.count : 0
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    const responseObject = req.body.count ? { activeOperationList: _.values(response[0]) } : { activeOperationList: _.values(response[1]), Count: response[0][0]['TotalRecord'] };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseObject);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};
