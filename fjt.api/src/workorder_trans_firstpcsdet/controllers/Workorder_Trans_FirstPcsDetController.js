const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const timelineObjForWoTransFPDet = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_TRANS_FIRSTPCSDET;
const WoTransFPDetConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS_FIRSTPCSDET;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const woTransFirstPecElemModuleName = DATA_CONSTANT.WORKORDER_TRANS_FIRSTPCSDET.NAME;

// const inputFields = [
//    'woTransFirstpcsDetID',
//    'woTransFirstPieceID',
//    'serialno',
//    'issue',
//    'resolution',
//    'woOPID',
//    'employeeID',
//    'isDeleted',
//    'deletedAt',
//    'createdBy',
//    'updatedBy',
//    'deletedBy',
//    'remark'
// ];

module.exports = {
    // save transaction first piece serials
    // GET : /api/v1/workorder_trans_firstpcsdet/saveWorkorderTransFirstpcsDetails
    // @return status for added serials
    saveWorkorderTransFirstpcsDetails: (req, res) => {
        if (req.body) {
            const { WorkorderOperationFirstPiece, WorkorderTransFirstPcsDet, sequelize } = req.app.locals.models;
            if (req.body.workorderTransFirstPcsDetails) {
                if (req.body.workorderTransFirstPcsDetails.issue) { req.body.workorderTransFirstPcsDetails.issue = COMMON.setTextAngularValueForDB(req.body.workorderTransFirstPcsDetails.issue); }
                if (req.body.workorderTransFirstPcsDetails.resolution) { req.body.workorderTransFirstPcsDetails.resolution = COMMON.setTextAngularValueForDB(req.body.workorderTransFirstPcsDetails.resolution); }
            }
            if (req.body && req.body.workorderTransFirstPcsDetails.woTransFirstpcsDetID) {
                // update case of wo trans first piece det
                return WorkorderTransFirstPcsDet.findOne({
                    where: {
                        woTransFirstpcsDetID: req.body.workorderTransFirstPcsDetails.woTransFirstpcsDetID
                    }
                }).then((woTransFirstpcsAvailable) => {
                    if (!woTransFirstpcsAvailable) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(woTransFirstPecElemModuleName), err: null, data: null });
                    }
                    const updateFATransPromises = [];
                    COMMON.setModelUpdatedByObjectFieldValue(req.user, req.body.workorderTransFirstPcsDetails);

                    return sequelize.transaction().then((t) => {
                        // update wo trans first piece det
                        updateFATransPromises.push(WorkorderTransFirstPcsDet.update(req.body.workorderTransFirstPcsDetails, {
                            where: {
                                woTransFirstpcsDetID: req.body.workorderTransFirstPcsDetails.woTransFirstpcsDetID
                            },
                            fields: ['issue', 'resolution', 'remark', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                            transaction: t
                        }));

                        // update status to wo op first piece serials
                        const WoOpFirstPieceObj = {
                            currStatus: req.body.workorderTransFirstPcsDetails.currStatus
                        };
                        COMMON.setModelUpdatedByObjectFieldValue(req.user, WoOpFirstPieceObj);

                        updateFATransPromises.push(WorkorderOperationFirstPiece.update(WoOpFirstPieceObj, {
                            where: {
                                wofirstpieceID: req.body.workorderTransFirstPcsDetails.woTransFirstPieceID
                            },
                            fields: ['currStatus', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                            transaction: t
                        }));

                        // [S] add log of updating 1st article serials information to wo op for timeline users
                        const objEventEqp = {
                            userID: req.user.id,
                            eventTitle: WoTransFPDetConstObj.UPDATE.title,
                            eventDescription: COMMON.stringFormat(WoTransFPDetConstObj.UPDATE.description, req.body.workorderTransFirstPcsDetails.serialno
                                , req.body.workorderTransFirstPcsDetails.opName, req.body.workorderTransFirstPcsDetails.woNumber, req.user.username),
                            refTransTable: WoTransFPDetConstObj.refTransTableName,
                            refTransID: req.body.workorderTransFirstPcsDetails.woTransFirstpcsDetID,
                            eventType: timelineObjForWoTransFPDet.id,
                            url: COMMON.stringFormat(WoTransFPDetConstObj.url, req.body.workorderTransFirstPcsDetails.woOPID, req.body.workorderTransFirstPcsDetails.employeeID),
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEventEqp;
                        updateFATransPromises.push(TimelineController.createTimeline(req, res, t));
                        // [E] add log of updating 1st article serials information to wo op for timeline users

                        return Promise.all(updateFATransPromises).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_TRANS_FIRSTPCSDET.WO_TRANS_FIRSTPCSDET_SAVED))).catch((err) => {
                            t.rollback();
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
            } else {  // create case of wo trans first piece det
                COMMON.setModelCreatedObjectFieldValue(req.user, req.body.workorderTransFirstPcsDetails);
                return sequelize.transaction().then(t => WorkorderTransFirstPcsDet.create(req.body.workorderTransFirstPcsDetails, {
                    fields: ['woTransFirstPieceID', 'serialno', 'issue', 'resolution', 'remark', 'woOPID', 'employeeID', 'createdBy', 'createdAt', 'createByRoleId'],
                    transaction: t
                }).then((woTransFirstpcsdet) => {
                    if (!woTransFirstpcsdet) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }

                    const createUpdateFATransPromises = [];

                    // update wo op first piece status
                    const WoOpFirstPieceObj = {
                        currStatus: req.body.workorderTransFirstPcsDetails.currStatus
                    };
                    COMMON.setModelUpdatedByObjectFieldValue(req.user, WoOpFirstPieceObj);

                    createUpdateFATransPromises.push(WorkorderOperationFirstPiece.update(WoOpFirstPieceObj, {
                        where: {
                            wofirstpieceID: req.body.workorderTransFirstPcsDetails.woTransFirstPieceID
                        },
                        fields: ['currStatus', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                        transaction: t
                    }));

                    // [S] add log of updating 1st article serials information to wo op for timeline users
                    const objEventEqp = {
                        userID: req.user.id,
                        eventTitle: WoTransFPDetConstObj.UPDATE.title,
                        eventDescription: COMMON.stringFormat(WoTransFPDetConstObj.UPDATE.description, req.body.workorderTransFirstPcsDetails.serialno
                            , req.body.workorderTransFirstPcsDetails.opName, req.body.workorderTransFirstPcsDetails.woNumber, req.user.username),
                        refTransTable: WoTransFPDetConstObj.refTransTableName,
                        refTransID: req.body.workorderTransFirstPcsDetails.woTransFirstpcsDetID,
                        eventType: timelineObjForWoTransFPDet.id,
                        url: COMMON.stringFormat(WoTransFPDetConstObj.url, req.body.workorderTransFirstPcsDetails.woOPID, req.body.workorderTransFirstPcsDetails.employeeID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEventEqp;
                    createUpdateFATransPromises.push(TimelineController.createTimeline(req, res, t));
                    // [E] add log of updating 1st article serials information to wo op for timeline users

                    return Promise.all(createUpdateFATransPromises).then(() => t.commit().then(() =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_TRANS_FIRSTPCSDET.WO_TRANS_FIRSTPCSDET_SAVED))).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                }).catch((err) => {
                    t.rollback();
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Delete workorder transaction first piece details
    // DELETE : /api/v1/workorder_trans_firstpcsdet/deleteWorkorderTransFirstpcsdet
    // @return API response
    deleteWorkorderTransFirstpcsdet: (req, res) => {
        if (req.body && req.body.deleteObj) {
            const { sequelize, WorkorderTransFirstPcsDet, WorkorderOperationFirstPiece } = req.app.locals.models;
            COMMON.setModelDeletedByFieldValue(req);
            const promises = [];

            return sequelize.transaction().then((t) => {
                if (req.body.deleteObj.woTransFirstpcsDetIDs && req.body.deleteObj.woTransFirstpcsDetIDs.length > 0) {
                    promises.push(
                        WorkorderTransFirstPcsDet.update(req.body, {
                            where: {
                                woTransFirstpcsDetID: req.body.deleteObj.woTransFirstpcsDetIDs,
                                deletedAt: null
                            },
                            fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId'],
                            transaction: t
                        })
                    );
                }

                promises.push(
                    WorkorderOperationFirstPiece.update(req.body, {
                        where: {
                            wofirstpieceID: req.body.deleteObj.woTransFirstPieceIDs,
                            deletedAt: null
                        },
                        fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId'],
                        transaction: t
                    })
                );

                // time line log for delete work order trans first piece serial
                const objEventEqp = {
                    userID: req.user.id,
                    eventTitle: WoTransFPDetConstObj.DELETE.title,
                    eventDescription: COMMON.stringFormat(WoTransFPDetConstObj.DELETE.description, req.body.deleteObj.serialno ? `"${req.body.deleteObj.serialno}"` : ''
                        , req.body.deleteObj.opName, req.body.deleteObj.woNumber, req.user.username),
                    refTransTable: WoTransFPDetConstObj.refTransTableName,
                    refTransID: req.body.deleteObj.woTransFirstpcsDetIDs.toString(),
                    eventType: timelineObjForWoTransFPDet.id,
                    url: COMMON.stringFormat(WoTransFPDetConstObj.url, req.body.deleteObj.woOPID, req.body.deleteObj.employeeID),
                    eventAction: timelineEventActionConstObj.DELETE
                };
                req.objEvent = objEventEqp;
                promises.push(TimelineController.createTimeline(req, res, t));

                return Promise.all(promises).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(woTransFirstPecElemModuleName)))).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
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
    // Retrieve list of work order transaction first piece added serials
    // GET : /api/v1/workorder_trans_firstpcsdet/getWOTransFirstpcsSerialsDet
    // @return list of work order transaction first piece for display on traveler page
    getWOTransFirstpcsSerialsDet: (req, res) => {
        if (req.body.woOPID) {
            const { WorkorderOperationFirstPiece, WorkorderTransFirstPcsDet } = req.app.locals.models;
            return WorkorderOperationFirstPiece.findAll({
                where: {
                    woOPID: req.body.woOPID
                },
                include: [
                    {
                        model: WorkorderTransFirstPcsDet,
                        as: 'workorderTransFirstPcsDet',
                        required: false,
                        attributes: ['woTransFirstpcsDetID', 'issue', 'resolution', 'remark', 'updatedAt']
                    }]
            }).then((workorderTransFirstPieceDetList) => {
                if (workorderTransFirstPieceDetList && workorderTransFirstPieceDetList.length > 0) {
                    _.each(workorderTransFirstPieceDetList, (item) => {
                        if (item && item.workorderTransFirstPcsDet) {
                            if (item.workorderTransFirstPcsDet.issue) { item.workorderTransFirstPcsDet.issue = COMMON.getTextAngularValueFromDB(item.workorderTransFirstPcsDet.issue); }
                            if (item.workorderTransFirstPcsDet.resolution) { item.workorderTransFirstPcsDet.resolution = COMMON.getTextAngularValueFromDB(item.workorderTransFirstPcsDet.resolution); }
                        }
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { workorderTransFirstPieceDetList: workorderTransFirstPieceDetList }, null);
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
