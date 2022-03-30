const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
var TimelineController = require('../../timeline/controllers/TimelineController');
// const { stringFormat } = require('../../constant/Common');

const timelineObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_SALESORDER_DETAILS;
const workorderSalesOrderDetConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_SALESORDER_DETAILS;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const currentModuleName = DATA_CONSTANT.WORKORDER_SALESORDER_DETAILS.Name;
// const woTaskConfirmationObj = DATA_CONSTANT.TIMLINE.TASK_CONFIRMATION;
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'woSalesOrderDetID',
    'woID',
    'partID',
    'salesOrderDetailID',
    'poQty',
    'scrapQty',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'qpa',
    'parentPartID'
];

const taskConfirmationInputFields = [
    'confID',
    'confirmationType',
    'signaturevalue',
    'reason',
    'autoRemark',
    'refTablename',
    'refId',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of workorder sales order detail by woID
    // GET : /api/v1/workorder_salesorder_detail
    // @param {woID} int
    // @return list of workorder sales order detail
    getSalesOrderWoIDwise: (req, res) => {
        const { WorkorderSalesOrderDetails, SalesOrderDet, SalesOrderMst, SalesOrderPlanDetailsMst, sequelize } = req.app.locals.models;
        return WorkorderSalesOrderDetails.findAll({
            attributes: ['woSalesOrderDetID', 'woID', 'salesOrderDetailID', 'poQty', 'scrapQty', 'partID', 'parentPartID', 'qpa',
                [sequelize.literal('fun_getPONumber(salesOrderDetailID)'), 'refPONumber']],
            where: {
                woID: req.params.woID,
                deletedAt: null
            },
            include: [{
                model: SalesOrderDet,
                as: 'SalesOrderDetails',
                attributes: ['id', 'refSalesOrderID', 'qty', 'mrpQty', 'lineID', 'partID'
                    // [sequelize.fn('count', sequelize.col('SalesOrderDetails.kitRelease.id')), 'kitReleaseCnt']
                ],
                include: [{
                    model: SalesOrderMst,
                    as: 'salesOrderMst',
                    attributes: ['id', 'salesOrderNumber']
                }]
            }]
        }).then(WosalesOrderDetail =>
            // return resHandler.successRes(res, 200, STATE.SUCCESS, WosalesOrderDetail);
            SalesOrderPlanDetailsMst.findAll({
                attributes: ['id', 'salesOrderDetID'],
                where: {
                    salesOrderDetID: { [Op.in]: _.map(WosalesOrderDetail, 'salesOrderDetailID') },
                    kitStatus: 'R'
                }
            }).then((salesPlanDtl) => {
                _.each(WosalesOrderDetail, (woSales) => {
                    woSales.dataValues.SalesOrderDetails.dataValues.kitReleaseCnt = 0;
                    const planFound = _.find(salesPlanDtl, { salesOrderDetID: woSales.dataValues.salesOrderDetailID });
                    woSales.dataValues.SalesOrderDetails.dataValues.kitReleaseCnt = planFound ? 1 : 0;
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, WosalesOrderDetail, null);
            })).catch((err) => {
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Create workorder sales order detail
    // POST : /api/v1/workorder_salesorder_detail
    // @return created list of workorder sales order detail
    saveWoSalesOrder: (req, res) => {
        if (req.body && req.body.woID) {
            const { sequelize, WorkorderSalesOrderDetails } = req.app.locals.models;
            COMMON.setModelCreatedByFieldValue(req);

            return sequelize.query('CALL Sproc_ValidatePOQtyForSalesOrder (:pwoSalesOrderDetID, :psalesOrderDetailID, :pwoID, :ppartID, :pscrapQty, :ppoQty, :pisDelete)',
                {
                    replacements: {
                        pwoSalesOrderDetID: req.body.woSalesOrderDetID,
                        psalesOrderDetailID: req.body.salesOrderDetailID,
                        pwoID: req.body.woID,
                        ppartID: req.body.parentPartID,
                        pscrapQty: req.body.scrapQty,
                        ppoQty: req.body.poQty,
                        pisDelete: false
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    if (resultData.length > 0 && _.isEmpty(resultData[0])) {
                        req.body.qpa = resultData[1] && resultData[1][0].soQPA ? resultData[1][0].soQPA : null;
                        return sequelize.transaction().then(t => WorkorderSalesOrderDetails.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((WosalesOrderDetail) => {
                            const saveWOSalesOrderDetPromises = [];
                            // [S] add log of create work order sales order details for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: workorderSalesOrderDetConstObj.CREATE.title,
                                eventDescription: COMMON.stringFormat(workorderSalesOrderDetConstObj.CREATE.description, req.body.woNumber, req.user.username),
                                refTransTable: workorderSalesOrderDetConstObj.refTransTableName,
                                refTransID: WosalesOrderDetail.woSalesOrderDetID,
                                eventType: timelineObj.id,
                                url: COMMON.stringFormat(workorderSalesOrderDetConstObj.url, req.body.woID),
                                eventAction: timelineEventActionConstObj.CREATE
                            };
                            req.objEvent = objEvent;
                            saveWOSalesOrderDetPromises.push(TimelineController.createTimeline(req, res, t));
                            // [E] add log of create work order sales order details for timeline users
                            saveWOSalesOrderDetPromises.push(module.exports.updateWorkOrderDetails(req, t));
                            return Promise.all(saveWOSalesOrderDetPromises).then(() => t.commit().then(() => {
                                // Add Work Order Detail into Elastic Search Engine for Enterprise Search
                                req.params.woID = req.body.woID;
                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWorkOrderDetailInElastic);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                    WosalesOrderDetail, MESSAGE_CONSTANT.ADDED(currentModuleName));
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        let messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DYNAMIC_ERROR);
                        messageContent.message = COMMON.stringFormat(messageContent.message, _.values(resultData[0]).map(e => e.errorText).join('<br/>'));
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
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

    // Update workorder sales order detail
    // PUT : /api/v1/workorder_salesorder_detail
    // @param {id} int
    // @return Upadted workorder sales order detail
    updateWoSalesOrder: (req, res) => {
        if (req.params.woSalesOrderDetID) {
            const { sequelize, WorkorderSalesOrderDetails } = req.app.locals.models;
            COMMON.setModelUpdatedByFieldValue(req);

            return sequelize.query('CALL Sproc_ValidatePOQtyForSalesOrder (:pwoSalesOrderDetID, :psalesOrderDetailID, :pwoID, :ppartID, :pscrapQty, :ppoQty, :pisDelete)',
                {
                    replacements: {
                        pwoSalesOrderDetID: req.body.woSalesOrderDetID,
                        psalesOrderDetailID: req.body.salesOrderDetailID,
                        pwoID: req.body.woID,
                        ppartID: req.body.parentPartID,
                        pscrapQty: req.body.scrapQty,
                        ppoQty: req.body.poQty,
                        pisDelete: false
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    if (resultData.length > 0 && _.isEmpty(resultData[0])) {
                        req.body.qpa = resultData[1] && resultData[1][0].soQPA ? resultData[1][0].soQPA : null;
                        return sequelize.transaction().then(t => WorkorderSalesOrderDetails.update(req.body, {
                            where: {
                                woSalesOrderDetID: req.params.woSalesOrderDetID,
                                deletedAt: null
                            },
                            fields: inputFields,
                            transaction: t
                        }).then((WosalesOrderDetail) => {
                            const updateWOSalesOrderDetPromises = [];

                            // [S] add log of update work order sales order details for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: workorderSalesOrderDetConstObj.UPDATE.title,
                                eventDescription: COMMON.stringFormat(workorderSalesOrderDetConstObj.UPDATE.description, req.body.woNumber, req.user.username),
                                refTransTable: workorderSalesOrderDetConstObj.refTransTableName,
                                refTransID: req.params.woSalesOrderDetID,
                                eventType: timelineObj.id,
                                url: COMMON.stringFormat(workorderSalesOrderDetConstObj.url, req.body.woID),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            updateWOSalesOrderDetPromises.push(TimelineController.createTimeline(req, res, t));
                            // [E] add log of update work order sales order details for timeline users
                            updateWOSalesOrderDetPromises.push(module.exports.updateWorkOrderDetails(req, t));

                            return Promise.all(updateWOSalesOrderDetPromises).then(() => t.commit().then(() => {
                                // Add Work Order Detail into Elastic Search Engine for Enterprise Search
                                req.params.woID = req.body.woID;
                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageWorkOrderDetailInElastic);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                    WosalesOrderDetail, MESSAGE_CONSTANT.UPDATED(currentModuleName));
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.DYNAMIC_ERROR);
                        messageContent.message = COMMON.stringFormat(messageContent.message, resultData.map(e => e.errorText).join('<br/>'));
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: resultData.map(e => e.errorText).join('<br/>'), data: null });
                        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, resultData.map(e => e.errorText).join('<br/>'));
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

    // Delete workorder sales order detail
    // PUT : /api/v1/workorder_salesorder_detail
    // @param {id} int
    // @return Upadted workorder sales order detail
    deleteWoSalesOrder: (req, res) => {
        if (req.params.woSalesOrderDetID) {
            const { sequelize, WorkorderSalesOrderDetails } = req.app.locals.models;
            COMMON.setModelDeletedByFieldValue(req);
            const woSalesOrderDetObj = req.query.woSalesOrderDetObj ? JSON.parse(req.query.woSalesOrderDetObj) : null;

            return sequelize.query('CALL Sproc_ValidatePOQtyForSalesOrder (:pwoSalesOrderDetID, :psalesOrderDetailID, :pwoID, :ppartID, :pscrapQty, :ppoQty, :pisDelete)',
                {
                    replacements: {
                        pwoSalesOrderDetID: req.params.woSalesOrderDetID,
                        psalesOrderDetailID: (woSalesOrderDetObj && woSalesOrderDetObj.salesOrderDetailID) ? woSalesOrderDetObj.salesOrderDetailID : null,
                        pwoID: (woSalesOrderDetObj && woSalesOrderDetObj.woID) ? woSalesOrderDetObj.woID : null,
                        ppartID: (woSalesOrderDetObj && woSalesOrderDetObj.parentPartID) ? woSalesOrderDetObj.parentPartID : null,
                        pscrapQty: (woSalesOrderDetObj && woSalesOrderDetObj.scrapQty) ? woSalesOrderDetObj.scrapQty : null,
                        ppoQty: (woSalesOrderDetObj && woSalesOrderDetObj.poQty) ? woSalesOrderDetObj.poQty : null,
                        pisDelete: true
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    if (resultData.length > 0 && _.isEmpty(resultData[0])) {
                        return sequelize.transaction().then(t => WorkorderSalesOrderDetails.update(req.body, {
                            where: {
                                woSalesOrderDetID: req.params.woSalesOrderDetID,
                                deletedAt: null
                            },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                            transaction: t
                        }).then((WosalesOrderDetail) => {
                            const deleteWOSalesOrderDetPromises = [];
                            if (woSalesOrderDetObj) {
                                // [S] add log of delete work order sales order details for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: workorderSalesOrderDetConstObj.DELETE.title,
                                    eventDescription: COMMON.stringFormat(workorderSalesOrderDetConstObj.DELETE.description, woSalesOrderDetObj.woNumber, req.user.username),
                                    refTransTable: workorderSalesOrderDetConstObj.refTransTableName,
                                    refTransID: req.params.woSalesOrderDetID,
                                    eventType: timelineObj.id,
                                    url: null,
                                    eventAction: timelineEventActionConstObj.DELETE
                                };
                                req.objEvent = objEvent;
                                deleteWOSalesOrderDetPromises.push(TimelineController.createTimeline(req, res, t));
                                // [E] add log of delete work order sales order details for timeline users
                            }
                            deleteWOSalesOrderDetPromises.push(module.exports.updateWorkOrderDetails(req, t));
                            return Promise.all(deleteWOSalesOrderDetPromises).then(() => t.commit().then(() =>
                                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, WosalesOrderDetail, MESSAGE_CONSTANT.DELETED(currentModuleName))
                            )).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
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
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: null, err: null, data: resultData.map(e => e.errorText).join('<br/>') });
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

    deleteWoSalesOrderAssyRevisionWise: (req, res) => {
        if (req.params.woID) {
            const { WorkorderSalesOrderDetails } = req.app.locals.models;
            COMMON.setModelDeletedByFieldValue(req);

            return WorkorderSalesOrderDetails.update(req.body, {
                where: {
                    woID: req.params.woID,
                    deletedAt: null
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt']
            }).then(WosalesOrderDetail => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, WosalesOrderDetail, MESSAGE_CONSTANT.DELETED(currentModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Check kit release for Sales Order detail
    // GET : /api/v1/checkKitReleaseBySalesOrderDetID
    // @param {woID} int
    // @return kit release found or not
    checkKitReleaseBySalesOrderDetID: (req, res) => {
        const { WorkorderSalesOrderDetails, SalesOrderPlanDetailsMst } = req.app.locals.models;
        var planFound = 0;
        return WorkorderSalesOrderDetails.findAll({
            where: {
                woID: req.params.woID,
                salesOrderDetailID: req.params.salesOrderDetID,
                deletedAt: null
            }
        }).then(WosalesOrderDetail =>
            SalesOrderPlanDetailsMst.findAll({
                attributes: ['id', 'salesOrderDetID'],
                where: {
                    salesOrderDetID: { [Op.in]: _.map(WosalesOrderDetail, 'salesOrderDetailID') },
                    kitStatus: 'R'
                }
            }).then((salesPlanDtl) => {
                _.each(WosalesOrderDetail, (woSales) => {
                    woSales.dataValues.kitReleaseCnt = 0;
                    planFound = 0;
                    planFound = _.find(salesPlanDtl, { salesOrderDetID: woSales.dataValues.salesOrderDetailID });
                    woSales.dataValues.kitReleaseCnt = planFound ? 1 : 0;
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, WosalesOrderDetail[0], null);
            })
        ).catch((err) => {
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Update work order details
    // POST: /api/v1/updateWorkOrderDetails
    updateWorkOrderDetails: (req, t) => {
        const { Workorder, TaskConfirmation } = req.app.locals.models;
        return Workorder.update(req.body, {
            where: {
                woID: req.body.woID
            },
            fields: ['buildQty'],
            transaction: t
        }).then(() => {
            const updateWODetPromises = [];
            if (req.body.taskConfirmationInfo) {
                // const TaskConfirmation = req.app.locals.models.TaskConfirmation;
                COMMON.setModelCreatedObjectFieldValue(req.user, req.body.taskConfirmationInfo);
                req.body.taskConfirmationInfo.reason = COMMON.setTextAngularValueForDB(req.body.taskConfirmationInfo.reason);

                updateWODetPromises.push(
                    TaskConfirmation.create(req.body.taskConfirmationInfo, {
                        fields: taskConfirmationInputFields,
                        transaction: t
                    }));
            }
            return Promise.all(updateWODetPromises).then(() => {
                return { status: STATE.SUCCESS };
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) t.rollback();
                return { status: STATE.FAILED };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) t.rollback();
            return { status: STATE.FAILED };
        });
    }
};