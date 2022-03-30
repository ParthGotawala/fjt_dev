const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const timelineObjForWoAssyDesig = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_ASSY_DESIGNATORS;
const WoAssyDesigConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_ASSY_DESIGNATORS;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;

const inputFields = [
    'wodesignatorID',
    'woID',
    'designatorName',
    'defectCatid',
    'createdBy',
    'noOfPin'
];
const moduleName = DATA_CONSTANT.WORKORDER_ASSY_DESIGNATORS.NAME;

module.exports = {
    // Save work-order assembly designators
    // POST : /api/v1/workorder_assy_designators
    // @return new created workorder assembly designator
    createWorkOrderAssyDesignator: (req, res) => {
        if (req.body && req.body.designatorName) {
            const WorkorderAssyDesignators = req.app.locals.models.WorkorderAssyDesignators;
            req.body.designatorName = req.body.designatorName.trim().toUpperCase();
            req.body.noOfPin = req.body.noOfPin ? req.body.noOfPin : null;

            return WorkorderAssyDesignators.findOne({
                where: {
                    woID: req.body.woID,
                    designatorName: req.body.designatorName,
                    noOfPin: req.body.noOfPin,
                    defectCatid: req.body.defectCatid
                }
            }).then((woAssyDesigExistsDet) => {
                if (!woAssyDesigExistsDet) {
                    COMMON.setModelCreatedByFieldValue(req);
                    return WorkorderAssyDesignators.create(req.body, {
                        fields: inputFields
                    }).then((workOrderAssydesignatos) => {
                        // [S] add log of adding WorkOrder Assembly Designator for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoAssyDesigConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(WoAssyDesigConstObj.CREATE.description, req.body.designatorName,
                                req.body.defectcatName, req.body.opName, req.body.woNumber, req.user.username),
                            refTransTable: WoAssyDesigConstObj.refTransTableName,
                            refTransID: workOrderAssydesignatos.wodesignatorID,
                            eventType: timelineObjForWoAssyDesig.id,
                            url: COMMON.stringFormat(WoAssyDesigConstObj.url, req.body.woOPID, req.body.employeeID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of adding WorkOrder Assembly Designator for timeline users

                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { wodesignatorID: workOrderAssydesignatos.wodesignatorID }, MESSAGE_CONSTANT.CREATED(moduleName));
                        const opID = req.body.opID;
                        const employeeID = req.body.employeeID;
                        module.exports.getWOOperationEmployees(req, req.body.woID, opID, employeeID).then((resp) => {
                            var data = {
                                senderID: employeeID,
                                woID: req.body.woID,
                                opID: opID,
                                data: {
                                    defectCatid: workOrderAssydesignatos.defectCatid,
                                    designatorName: workOrderAssydesignatos.designatorName,
                                    wodesignatorID: workOrderAssydesignatos.wodesignatorID,
                                    woID: workOrderAssydesignatos.woID,
                                    opID: opID,
                                    employeeID: employeeID
                                },
                                receiver: resp
                            };
                            NotificationMstController.sendWOAssyDesignator(req, data);
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
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY,
                        {
                            isSameDesignatorAlreadyExists: true,
                            woAssyDesigExistsDet: woAssyDesigExistsDet,
                            userDefinedMessage: MESSAGE_CONSTANT.MFG.WORKORDER_ASSY_DESIGNATORS_EXISTS
                        }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Delete work-order assembly designators
    // DELETE : /api/v1/workorder_assy_designators/deleteDesignator
    // @return API response
    deleteWorkOrderTransAssyDesignator: (req, res) => {
        const { WorkorderTransAssyDefectdet, WorkorderAssyDesignators } = req.app.locals.models;
       return WorkorderTransAssyDefectdet.count({
            where: {
                wodesignatorID: req.body.wodesignatorID,
                defectCnt: { [Op.gt]: 0 }
            }
        }).then((count) => {
            if (!count) {
                COMMON.setModelDeletedByFieldValue(req);
               return WorkorderAssyDesignators.update(req.body, {
                    where: {
                        wodesignatorID: req.body.wodesignatorID,
                        deletedAt: null
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                }).then((rowsDeleted) => {
                    if (rowsDeleted > 0) {
                        // [S] add log of removing WorkOrder Assembly Designator for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoAssyDesigConstObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(WoAssyDesigConstObj.DELETE.description, req.body.designatorName,
                                req.body.opName, req.body.woNumber, req.user.username),
                            refTransTable: WoAssyDesigConstObj.refTransTableName,
                            refTransID: req.body.wodesignatorID,
                            eventType: timelineObjForWoAssyDesig.id,
                            url: COMMON.stringFormat(WoAssyDesigConstObj.url, req.body.woOPID, req.body.employeeID),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of removing WorkOrder Assembly Designator for timeline users

                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null,
                            MESSAGE_CONSTANT.DELETED(moduleName));

                        const opID = req.body.opID;
                        const employeeID = req.body.employeeID;
                       return module.exports.getWOOperationEmployees(req, req.body.woID, opID, employeeID).then((resp) => {
                            var data = {
                                senderID: employeeID,
                                woID: req.body.woID,
                                opID: opID,
                                data: {
                                    wodesignatorID: req.body.wodesignatorID,
                                    woID: req.body.woID,
                                    opID: opID
                                },
                                receiver: resp
                            };
                            NotificationMstController.sendWOAssyDesignatorRemove(req, data);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
               return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isAlreadyUsed: true }, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get list of workorder operation employee
    // @return list of workorder operation employee
    getWOOperationEmployees: (req, woID, opID, employeeID) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployees (:woOPID, :woID, :opID)',
                {
                    replacements: {
                        woOPID: null,
                        woID: woID,
                        opID: opID
                    }
                })
            .then((response) => {
                if (response) { return _.remove(response.map(x => x.employeeID), x => x !== employeeID); } else { return []; }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return [];
            });
    },

    // update work-order assembly designator details
    // POST : /api/v1/workorder_assy_designators/updateWorkOrderAssyDesignator
    // @return updated workorder assembly designator
    updateWorkOrderAssyDesignator: (req, res) => {
        if (req.body && req.body.designatorName && req.body.wodesignatorID) {
            const { WorkorderAssyDesignators, WorkorderTransAssyDefectdet } = req.app.locals.models;
            return WorkorderTransAssyDefectdet.count({
                where: {
                    wodesignatorID: req.body.wodesignatorID,
                    defectCnt: { [Op.gt]: 0 }
                }
            }).then((count) => {
                if (count) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { isDefectAlreadyAdded: true }, null);
                }

                req.body.designatorName = req.body.designatorName.toUpperCase();
                req.body.noOfPin = req.body.noOfPin ? req.body.noOfPin : null;

                return WorkorderAssyDesignators.findOne({
                    where: {
                        woID: req.body.woID,
                        designatorName: req.body.designatorName,
                        noOfPin: req.body.noOfPin,
                        defectCatid: req.body.defectCatid,
                        wodesignatorID: { [Op.ne]: req.body.wodesignatorID }
                    },
                    fields: ['wodesignatorID']
                }).then((woAssyDesigExistsDet) => {
                    if (!woAssyDesigExistsDet) {
                        COMMON.setModelUpdatedByFieldValue(req);
                        return WorkorderAssyDesignators.update(req.body, {
                            where: {
                                wodesignatorID: req.body.wodesignatorID
                            },
                            fields: ['designatorName', 'noOfPin', 'updatedBy', 'updatedAt']
                        }).then(() => {
                            // [S] add log of updating WorkOrder Assembly Designator for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: WoAssyDesigConstObj.UPDATE.title,
                                eventDescription: COMMON.stringFormat(WoAssyDesigConstObj.UPDATE.description, req.body.designatorName,
                                    req.body.defectcatName, req.body.opName, req.body.woNumber, req.user.username),
                                refTransTable: WoAssyDesigConstObj.refTransTableName,
                                refTransID: req.body.wodesignatorID,
                                eventType: timelineObjForWoAssyDesig.id,
                                url: COMMON.stringFormat(WoAssyDesigConstObj.url, req.body.woOPID, req.body.employeeID),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of adding WorkOrder Assembly Designator for timeline users

                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null,
                                MESSAGE_CONSTANT.UPDATED(moduleName));
                            const opID = req.body.opID;
                            const employeeID = req.body.employeeID;
                            module.exports.getWOOperationEmployees(req, req.body.woID, opID, employeeID).then((resp) => {
                                var data = {
                                    senderID: employeeID,
                                    woID: req.body.woID,
                                    opID: opID,
                                    data: {
                                        defectCatid: req.body.defectCatid,
                                        designatorName: req.body.designatorName,
                                        wodesignatorID: req.body.wodesignatorID,
                                        woID: req.body.woID,
                                        opID: opID,
                                        employeeID: employeeID
                                    },
                                    receiver: resp
                                };
                                NotificationMstController.sendWOAssyDesignatorUpdate(req, data);
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
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY,
                            {
                                isSameDesignatorAlreadyExists: true,
                                woAssyDesigExistsDet: woAssyDesigExistsDet,
                                userDefinedMessage: MESSAGE_CONSTANT.MFG.WORKORDER_ASSY_DESIGNATORS_EXISTS
                            }, null);
                    }
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    }
};