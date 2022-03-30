const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter, NotUpdate } = require('../../errors');

const timelineObjForWoTransProduction = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_TRANS_PRODUCTION;
const WoTransProductionConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS_PRODUCTION;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;

var TimelineController = require('../../timeline/controllers/TimelineController');
const WorkorderTransController = require('../../workorder_trans/controllers/Workorder_TransController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const woTranProModuleName = DATA_CONSTANT.WORKORDER_TRANS_PRODUCTION.NAME;

const inputFields = [
    'woTransprodID',
    'woTransID',
    'employeeID',
    'totalQty',
    'passQty',
    'reprocessQty',
    'observedQty',
    'reworkQty',
    'scrapQty',
    'boardWithMissingPartsQty',
    'bypassQty',
    'isFirstArticle',
    'isDeleted',
    'remark',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt'
];

module.exports = {
    // Create workorder transacation production (In-trim stop operation activity)
    // POST : /api/v1/workorder_trans_production
    // @return new created workorder transaction production
    // createWorkorderTransProduction: (req, res) => {
    //     const { sequelize, WorkorderTransProduction, WorkorderTransSerialNo } = req.app.locals.models;
    //     if (req.body) {
    //         COMMON.setModelCreatedByFieldValue(req);
    //         return sequelize.query('CALL Sproc_GetopReadyStock (:pwoID,:pOPID)',
    //             {
    //                 replacements: {
    //                     pwoID: req.body.woID,
    //                     pOPID: req.body.opID
    //                 }
    //             }).then((stockInfo) => {
    //                 if (stockInfo && stockInfo.length > 0 && ((parseInt(req.body.totalQty || 0) > parseInt(stockInfo[0].returnPending))
    //                     || (parseInt(stockInfo[0].OPProdQty) + (parseInt(req.body.totalQty || 0))) > (parseInt(stockInfo[0].BuildQty) - parseInt(stockInfo[0].TillProcessScrapQty)))) {
    //                     return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.WORKORDER_TRANS.PROCESS_QTY_NOT_VALID));
    //                 }
    //                 req.body.checkInTime = COMMON.getCurrentUTC();
    //                 return WorkorderTransProduction.create(req.body, {
    //                     fields: inputFields
    //                 }).then((workorderHistory) => {
    //                     const updateSerialNumberDet = {
    //                         woTransprodID: workorderHistory.woTransprodID,
    //                         updatedBy: req.user.id,
    //                         updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
    //                         updatedAt: COMMON.getCurrentUTC(req)
    //                     };
    //                     return WorkorderTransSerialNo.update(updateSerialNumberDet,
    //                         {
    //                             where: {
    //                                 woTransID: req.body.woTransID,
    //                                 woTransprodID: null
    //                             },
    //                             fields: ['woTransprodID', 'updateByRoleId,', 'updatedAt', 'updatedBy']
    //                         }).then((workorderHistoryDet) => {
    //                             // [S] add log of adding wo op production stock details for timeline users
    //                             const objEvent = {
    //                                 userID: req.user.id,
    //                                 eventTitle: WoTransProductionConstObj.CREATE.title,
    //                                 eventDescription: COMMON.stringFormat(WoTransProductionConstObj.CREATE.description, req.body.opName, req.body.woNumber, req.user.username),
    //                                 refTransTable: WoTransProductionConstObj.refTransTableName,
    //                                 refTransID: workorderHistoryDet.woTransprodID,
    //                                 eventType: timelineObjForWoTransProduction.id,
    //                                 url: COMMON.stringFormat(WoTransProductionConstObj.url, req.body.woOPID, req.body.employeeID),
    //                                 eventAction: timelineEventActionConstObj.CREATE
    //                             };
    //                             req.objEvent = objEvent;
    //                             TimelineController.createTimeline(req);
    //                             // [E] add log of adding wo op production stock details for timeline users

    //                             return resHandler.successRes(res, 200, STATE.SUCCESS, { workorderHistory: workorderHistoryDet, userMessage: MESSAGE_CONSTANT.CREATED(woTranProModuleName) });
    //                         }).catch((err) => {
    //                             console.trace();
    //                             console.error(err);
    //                             if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                                 return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
    //                             } else {
    //                                 return resHandler.errorRes(res, 200,
    //                                     STATE.EMPTY,
    //                                     new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(woTranProModuleName)));
    //                             }
    //                         });
    //                 }).catch((err) => {
    //                     console.trace();
    //                     console.error(err);
    //                     if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                         return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
    //                     } else {
    //                         return resHandler.errorRes(res, 200,
    //                             STATE.EMPTY,
    //                             new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(woTranProModuleName)));
    //                     }
    //                 });
    //             }).catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
    //                     return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
    //                 } else {
    //                     return resHandler.errorRes(res, 200,
    //                         STATE.EMPTY,
    //                         new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(woTranProModuleName)));
    //                 }
    //             });
    //     } else {
    //         return resHandler.errorRes(res,
    //             200,
    //             STATE.FAILED,
    //             new InvalidPerameter(REQUEST.INVALID_PARAMETER));
    //     }
    // },

    createWorkorderTransProduction: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.query('CALL Sproc_AddWorkOrderProductionDetails (:pwoID,:pOPID,:pWOTransID,:pQtyControl,:pEmployeeID,:pTotalQty,:pPassQty,:pReprocessQty,:pObservedQty,:pReworkQty,:pScrapQty,:pIsFirstArticle,:pUserId,:pRemark,:pRoleID,:pBoardWithMissingPartsQty,:pBypassQty)',
                {
                    replacements: {
                        pwoID: req.body.woID,
                        pOPID: req.body.opID,
                        pWOTransID: req.body.woTransID,
                        pQtyControl: req.body.qtyControl ? true : false,
                        pEmployeeID: req.body.employeeID,
                        pTotalQty: req.body.totalQty || null,
                        pPassQty: req.body.passQty || null,
                        pReprocessQty: req.body.reprocessQty || null,
                        pObservedQty: req.body.observedQty || null,
                        pReworkQty: req.body.reworkQty || null,
                        pScrapQty: req.body.scrapQty || null,
                        pIsFirstArticle: req.body.isFirstArticle ? true : false,
                        pUserId: req.user.id,
                        pRemark: req.body.remark || null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req),
                        pBoardWithMissingPartsQty: req.body.boardWithMissingPartsQty || null,
                        pBypassQty: req.body.bypassQty || null
                    }
                }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.CREATED(woTranProModuleName) })).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                    } else {
                        return resHandler.errorRes(res, 200,
                            STATE.EMPTY,
                            new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(woTranProModuleName)));
                    }
                });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrieve list of workorder transaction details
    // POST : /api/v1/workorder_trans_production/retrieveWorkorderTransactionDetails
    // @return list of workorder transaction detail
    retrieveWorkorderTransactionDetails: (req, res) => {
        const { WorkorderTransProduction, Employee, sequelize } = req.app.locals.models;
        if (req.body.operationObj) {
            return WorkorderTransProduction.findAll({
                where: {
                    woTransID: req.body.operationObj.woTransID
                },
                attributes: ['woTransprodID', 'employeeID', 'totalQty', 'passQty',
                    'reprocessQty', 'observedQty', 'reworkQty', 'scrapQty', 'isFirstArticle', 'remark', 'boardWithMissingPartsQty', 'bypassQty',
                    [sequelize.fn('fun_ConvertUTCDatetimeToDataKeyTimeZone', sequelize.col('WorkorderTransProduction.createdAt')), 'createdAt']],
                order: [['createdAt', 'DESC']],
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'profileImg', 'initialName']
                }]
            }).then(productionDetails => resHandler.successRes(res, 200, STATE.SUCCESS, productionDetails)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woTranProModuleName)));
        }
    },
    // Retrieve list of workorder transaction ready stock
    // POST : /api/v1/workorder_trans_production/retrieveWorkorderTransReadyStock
    // @return list of workorder transaction ready stock
    retrieveWorkorderTransReadyStock: (req, res) => {
        const { sequelize, VUReadyWOPCBComponent } = req.app.locals.models;
        if (req.body.operationObj) {
            const stockInfoDet = {};
            return sequelize.query('CALL Sproc_GetopReadyStock (:pwoID,:pOPID)',
                {
                    replacements: {
                        pwoID: req.body.operationObj.woID,
                        pOPID: req.body.operationObj.opID
                    }
                }).then((stockInfo) => {
                    stockInfoDet.stockInfo = stockInfo;
                    return VUReadyWOPCBComponent.findOne({
                        where: {
                            woID: req.body.operationObj.woID,
                            refStkWOOPID: req.body.operationObj.woOPID
                        },
                        paranoid: false,
                        attributes: ['woID', 'opID', 'refStkWOOPID', 'readyForPCB']
                    }).then((readyPCBComponentDet) => {
                        stockInfoDet.readyPCBComponentDet = readyPCBComponentDet;
                        return resHandler.successRes(res, 200, STATE.SUCCESS, stockInfoDet);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, err);
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woTranProModuleName)));
        }
    },

    // save workorder transacation production for reprocess required quantity
    // POST : /api/v1/workorder_trans_production/saveReprocessQtyForOperation
    // @return new created/updated workorder transaction production
    saveReprocessQtyForOperation: (req, res) => {
        const { WorkorderTransProduction } = req.app.locals.models;
        if (req.body && req.body.woTransID) {
            if (parseInt(req.body.reprocessQty || 0) > parseInt(req.body.buildQty || 0)) {
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.TRAVELER.INVALID_REPROCESS_QTY));
            }

            COMMON.setModelCreatedByFieldValue(req);
            return WorkorderTransProduction.create(req.body, {
                fields: inputFields
            })
                .then((workorderHistory) => {
                    // [S] add log of adding wo op production stock details for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: WoTransProductionConstObj.CREATE.title,
                        eventDescription: COMMON.stringFormat(WoTransProductionConstObj.CREATE.description, req.body.opName, req.body.woNumber, req.user.username),
                        refTransTable: WoTransProductionConstObj.refTransTableName,
                        refTransID: workorderHistory.woTransprodID,
                        eventType: timelineObjForWoTransProduction.id,
                        url: COMMON.stringFormat(WoTransProductionConstObj.url, req.body.woOPID, req.body.employeeID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of adding wo op production stock details for timeline users

                    resHandler.successRes(res, 200, STATE.SUCCESS, { workorderHistory: workorderHistory, userMessage: MESSAGE_CONSTANT.UPDATED(woTranProModuleName) });

                    if (req.body.isTeamOperation) {
                        /* notify other employee */
                        WorkorderTransController.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                            const data = {
                                woID: req.body.woID,
                                opID: req.body.opID,
                                woOPID: req.body.woOPID,
                                employeeID: req.body.employeeID,
                                senderID: req.body.employeeID,
                                receiver: employees.filter(x => x !== req.body.employeeID)
                            };
                            NotificationMstController.sendTeamOperationReprocessQtyChange(req, data);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            /* Empty */
                        });
                    }
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woTranProModuleName)));
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};
