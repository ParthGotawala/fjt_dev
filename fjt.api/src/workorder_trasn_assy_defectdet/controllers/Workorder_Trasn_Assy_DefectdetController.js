const _ = require('lodash');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const timelineObjForWoTransAssyDefectdet = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_TRANS_ASSY_DEFECTDET;
const WoTransAssyDefectdetConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS_ASSY_DEFECTDET;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
var NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const woTransAssDefDesiModuleName = DATA_CONSTANT.WORKORDER_TRANS_ASSY_DEFECTDET.NAME;

const inputFields = [
    'woTransID',
    'woID',
    'opID',
    'employeeID',
    'defectCnt',
    'serialNo',
    'wodesignatorID',
    'createdBy',
    'isRework'
];

module.exports = {
    // Get list of defect category with workorder assembly desigantor
    // GET : /api/v1/workorder_trasn_assy_defectdet/getAllDefectCategoryWithList
    // @param {woID} int
    // @return list of defect category with workorder assembly desigantor
    getAllDefectCategoryWithList: (req, res) => {
        const { DefectCategory, WorkorderAssyDesignators, WorkorderTransAssyDefectdet, sequelize } = req.app.locals.models;
        if (req.params && req.params.woID) {
            const where = {
                woID: req.params.woID
            };

            return DefectCategory.findAll({
                attributes: ['defectCatId', 'defectcatName', 'description', 'colorCode', 'order'],
                order: [['order', 'ASC']],
                include: [{
                    attributes: ['defectCatid', 'wodesignatorID', 'designatorName', 'noOfPin',
                        [sequelize.fn('SUM', sequelize.col('workorder_assy_designators.workorder_trans_assy_defectdet.defectCnt')), 'Count']],
                    model: WorkorderAssyDesignators,
                    as: 'workorder_assy_designators',
                    where: where,
                    required: false,
                    include: [{
                        attributes: ['defectCnt'],
                        model: WorkorderTransAssyDefectdet,
                        as: 'workorder_trans_assy_defectdet',
                        where: {
                            isRework: JSON.parse(req.params.isRework)
                        },
                        required: false
                    }],
                    group: ['wodesignatorID']
                }],
                group: ['defectCatId', 'workorder_assy_designators.wodesignatorID']
            }).then(DefectCategorylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, DefectCategorylist, null)).catch((err) => {
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
    // Add workorder transacation assembly desigantor
    // POST : /api/v1/workorder_trasn_assy_defectdet
    // @return workorder transaction assembly designator detail
    addWorkOrderTransAssyDesignator: (req, res) => {
        const { WorkorderTransAssyDefectdet } = req.app.locals.models;
        if (req.body) {
            const serialNo = req.body.serialNo || null;
            return WorkorderTransAssyDefectdet.findOne({
                where: {
                    woID: req.body.woID,
                    woTransID: req.body.woTransID,
                    wodesignatorID: req.body.wodesignatorID,
                    employeeID: req.body.employeeID,
                    serialNo: serialNo,
                    isRework: req.body.isRework
                },
                attributes: ['woTransDefectId', 'defectCnt']
            }).then((response) => {
                if (response) {
                    const total = response.dataValues.defectCnt + req.body.defectCnt;
                    req.body.defectCnt = total <= 0 ? 0 : total;

                    COMMON.setModelUpdatedByFieldValue(req);
                    WorkorderTransAssyDefectdet.update(req.body, {
                        where: {
                            woTransDefectId: response.dataValues.woTransDefectId
                        },
                        fields: ['defectCnt', 'updatedAt', 'updatedBy']
                    }).then(() => {
                        // [S] add log of updating WorkOrder trans Assembly defect details for timeline users
                        let descriptionSt = null;
                        if (serialNo) {
                            descriptionSt = COMMON.stringFormat(WoTransAssyDefectdetConstObj.UPDATE.descriptionWithSerial, req.body.designatorName,
                                serialNo, req.body.opName, req.body.woNumber, req.user.username);
                        } else {
                            descriptionSt = COMMON.stringFormat(WoTransAssyDefectdetConstObj.UPDATE.descriptionWithoutSerial, req.body.designatorName,
                                req.body.opName, req.body.woNumber, req.user.username);
                        }
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoTransAssyDefectdetConstObj.UPDATE.title,
                            eventDescription: descriptionSt,
                            refTransTable: WoTransAssyDefectdetConstObj.refTransTableName,
                            refTransID: response.dataValues.woTransDefectId,
                            eventType: timelineObjForWoTransAssyDefectdet.id,
                            url: COMMON.stringFormat(WoTransAssyDefectdetConstObj.url, req.body.woOPID, req.body.employeeID),
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of updating WorkOrder trans Assembly defect details for timeline users

                        module.exports.getWorkOrderTransAssyDesignatorDetail(req, response.dataValues.woTransDefectId).then((woDefect) => {
                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, woDefect, MESSAGE_CONSTANT.UPDATED(woTransAssDefDesiModuleName));

                            const woDefectObj = woDefect[0];
                            if (woDefectObj) {
                                module.exports.getWOOperationEmployees(req, woDefectObj.woID, woDefectObj.opID, woDefectObj.employeeID).then((resp) => {
                                    var data = {
                                        senderID: woDefectObj.employeeID,
                                        woID: woDefectObj.woID,
                                        opID: woDefectObj.opID,
                                        isReworkOperation: req.body.isRework,
                                        data: woDefectObj,
                                        receiver: resp
                                    };
                                    NotificationMstController.sendWOTransAssyDefect(req, data);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                });
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
                    COMMON.setModelCreatedByFieldValue(req);
                    WorkorderTransAssyDefectdet.create(req.body, {
                        fields: inputFields
                    }).then((resp) => {
                        // [S] add log of adding WorkOrder trans Assembly defect details for timeline users
                        let descriptionSt = null;
                        if (serialNo) {
                            descriptionSt = COMMON.stringFormat(WoTransAssyDefectdetConstObj.CREATE.descriptionWithSerial, req.body.designatorName,
                                serialNo, req.body.opName, req.body.woNumber, req.user.username);
                        } else {
                            descriptionSt = COMMON.stringFormat(WoTransAssyDefectdetConstObj.CREATE.descriptionWithoutSerial, req.body.designatorName,
                                req.body.opName, req.body.woNumber, req.user.username);
                        }
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoTransAssyDefectdetConstObj.CREATE.title,
                            eventDescription: descriptionSt,
                            refTransTable: WoTransAssyDefectdetConstObj.refTransTableName,
                            refTransID: resp.woTransDefectId,
                            eventType: timelineObjForWoTransAssyDefectdet.id,
                            url: COMMON.stringFormat(WoTransAssyDefectdetConstObj.url, req.body.woOPID, req.body.employeeID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of adding WorkOrder trans Assembly defect details for timeline users

                        module.exports.getWorkOrderTransAssyDesignatorDetail(req, resp.dataValues.woTransDefectId).then((woDefect) => {
                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, woDefect, MESSAGE_CONSTANT.UPDATED(woTransAssDefDesiModuleName));

                            const woDefectObj = woDefect[0];
                            if (woDefectObj) {
                                module.exports.getWOOperationEmployees(req, woDefectObj.woID, woDefectObj.opID, woDefectObj.employeeID).then((respData) => {
                                    var data = {
                                        senderID: woDefectObj.employeeID,
                                        woID: woDefectObj.woID,
                                        opID: woDefectObj.opID,
                                        isReworkOperation: req.body.isRework,
                                        data: woDefectObj,
                                        receiver: respData
                                    };
                                    NotificationMstController.sendWOTransAssyDefect(req, data);
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                });
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
    // Get workorder transaction assembly designator detail by woTransDefectId
    // @param {woTransID} int
    // @return workorder transaction assembly designator detail
    getWorkOrderTransAssyDesignatorDetail: (req, woTransDefectId) => {
        const { sequelize } = req.app.locals.models;

        var employeeID = req.body.employeeID;
        var woTransID = req.body.woTransID;
        var woID = req.body.woID;
        var opID = req.body.opID;
        var serialNo = req.body.serialNo;

        return sequelize
            .query('CALL Sproc_GetTransAssyDefects (:pEmployeeID, :pwoTransID, :pwoID, :popID, :pwoTransDefectId,:pSerialNo)',
                { replacements: { pEmployeeID: employeeID, pwoTransID: woTransID, pwoID: woID, popID: opID, pwoTransDefectId: woTransDefectId || null, pSerialNo: serialNo || null } })
            .then(response => response).catch((err) => {
                console.trace();
                console.error(err);
                return null;
            });
    },
    // Get list of workorder transaction assembly designators
    // POST : /api/v1/workorder_trasn_assy_defectdet/getWorkOrderTransAssyDesignators
    // @return list of workorder transaction assembly designators
    getWorkOrderTransAssyDesignators: (req, res) => {
        module.exports.getWorkOrderTransAssyDesignatorDetail(req, null).then((woDefect) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, woDefect, null);
        }).catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
    },
    // Get list workorder operation employee by woID and opID or employeeID
    // @param {woID} int
    // @param {opID} int
    // @param {employeeID} int
    // @return list workorder operation employee
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
            }).catch(() => []);
    },
    // get DPMO (Defects per million opportunities) details for all rework operations with defined wo
    // @param {woID} int
    // POST : /api/v1/workorder_trasn_assy_defectdet/calculateAndGetDPMOForWoAssy
    // @return DPMO details for wo all rework op
    calculateAndGetDPMOForWoAssy: (req, res) => {
        if (req.body && req.body.woID) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                .query('CALL Sproc_CalculateAndGetDPMOForWOAssy (:pwoID)', {
                    replacements: {
                        pwoID: req.body.woID
                    }
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { DPMO: response && response[0] ? response[0].DPMO : null }, null)).catch((err) => {
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