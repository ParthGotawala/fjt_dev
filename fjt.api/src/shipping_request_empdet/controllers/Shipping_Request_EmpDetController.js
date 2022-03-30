const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const timelineObjForShippingRequestEmpDet = DATA_CONSTANT.TIMLINE.EVENTS.SHIPPING_REQUEST.SHIPPING_REQUEST_EMPDET;
const ShippingRequestEmpDetConstObj = DATA_CONSTANT.TIMLINE.SHIPPING_REQUEST_EMPDET;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const moduleName = DATA_CONSTANT.REQUEST_FOR_SHIPEMPDET.NAME;

module.exports = {
    // Get shipping request employee details
    // GET : /api/v1/shippingrequestempdet/getShippingRequestEmpDet
    // @param {shippingRequestID} int
    // @return API response
    getShippingRequestEmpDet: (req, res) => {
        const { ShippingRequestEmpDet } = req.app.locals.models;
        ShippingRequestEmpDet.findAll({
            where: {
                shippingRequestID: req.params.shippingRequestID
            },
            attributes: ['id', 'employeeID', 'shippingRequestID', 'isAck', 'acceptedDate']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Save shipping request employee details
    // POST : /api/v1/shippingrequestempdet/saveShippingRequestEmpDet
    // @param {model} object
    // @return API response
    saveShippingRequestEmpDet: (req, res) => {
        const { ShippingRequestEmpDet, ShippingRequest } = req.app.locals.models;

        var where = {
            employeeID: req.body.employeeID,
            shippingRequestID: req.body.shippingRequestID
        };

        if (req.body.id) { where.id = { [Op.ne]: req.body.id }; }

        ShippingRequestEmpDet.count({
            where: where
        }).then((count) => {
            if (count > 0) {
                const model = {
                    error: 'employee'
                };
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, model, null);
            }

            if (req.body.id) {
                COMMON.setModelUpdatedByFieldValue(req);
                return ShippingRequestEmpDet.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: ['employeeID', 'updatedBy']
                }).then(() => {
                    // [S] add log of update employee shipping request details for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: ShippingRequestEmpDetConstObj.UPDATE.title,
                        eventDescription: COMMON.stringFormat(ShippingRequestEmpDetConstObj.UPDATE.description,
                            req.body.empName, req.body.shipReqNote, req.user.username),
                        refTransTable: ShippingRequestEmpDetConstObj.refTransTableName,
                        refTransID: req.body.id,
                        eventType: timelineObjForShippingRequestEmpDet.id,
                        url: COMMON.stringFormat(ShippingRequestEmpDetConstObj.url, req.body.shippingRequestID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of update employee shipping request details for timeline users
                    ShippingRequest.findOne({
                        where: {
                            id: req.body.shippingRequestID
                        },
                        attributes: ['requestedBy', 'note']
                    }).then((shippingReq) => {
                        if (shippingReq && shippingReq.requestedBy) {
                            const data = {
                                shippingReqEmpDetID: req.body.id,
                                shippingRequestID: req.body.shippingRequestID,
                                senderID: req.user.employeeID,
                                receiver: [req.body.employeeID],
                                message: COMMON.stringFormat('#{0}- {1}', req.body.shippingRequestID, shippingReq.note)
                            };
                            NotificationMstController.sendShippingReqEmpDet(req, data);
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName));
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
                req.body.isAck = false;
                return ShippingRequestEmpDet.create(req.body, {
                    fields: ['shippingRequestID', 'employeeID', 'createdBy', 'isAck']
                }).then((response) => {
                    // [S] add log of create employee shipping request details for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: ShippingRequestEmpDetConstObj.CREATE.title,
                        eventDescription: COMMON.stringFormat(ShippingRequestEmpDetConstObj.CREATE.description,
                            req.body.empName, req.body.shipReqNote, req.user.username),
                        refTransTable: ShippingRequestEmpDetConstObj.refTransTableName,
                        refTransID: response.id,
                        eventType: timelineObjForShippingRequestEmpDet.id,
                        url: COMMON.stringFormat(ShippingRequestEmpDetConstObj.url, req.body.shippingRequestID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of create employee shipping request details for timeline users
                    ShippingRequest.findOne({
                        where: {
                            id: req.body.shippingRequestID
                        },
                        attributes: ['requestedBy', 'note']
                    }).then((shippingReq) => {
                        if (shippingReq && shippingReq.requestedBy) {
                            const data = {
                                shippingReqEmpDetID: response.id,
                                shippingRequestID: response.shippingRequestID,
                                senderID: req.user.employeeID,
                                receiver: [req.body.employeeID],
                                message: COMMON.stringFormat('#{0}- {1}', req.body.shippingRequestID, shippingReq.note)
                            };
                            NotificationMstController.sendShippingReqEmpDet(req, data);
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName));
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
    },
    // Delete multiple shipping request employee details
    // POST : /api/v1/shippingrequestempdet/deleteShippingRequestEmpDet
    // @param {IDs with model} object
    // @return API response
    deleteShippingRequestEmpDet: (req, res) => {
        const { ShippingRequestEmpDet, ShippingRequest, Employee } = req.app.locals.models;
        if (req.params.id) {
            const idArr = req.params.id.split(',') || [];

            const model = {
                isDeleted: true,
                deletedBy: COMMON.getRequestUserID(req),
                deletedAt: COMMON.getCurrentUTC()
            };

            return ShippingRequestEmpDet.update(model, {
                where: {
                    id: idArr,
                    deletedAt: null
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt']
            }).then((response) => {
                ShippingRequestEmpDet.findOne({
                    where: {
                        id: idArr[0]
                    },
                    paranoid: false,
                    attributes: ['id'],
                    include: [{
                        model: ShippingRequest,
                        as: 'shippingRequest',
                        required: true,
                        attributes: ['id', 'note']
                    },
                    {
                        model: Employee,
                        as: 'employee',
                        required: true,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                    ]
                }).then((resOfShipReqEmpDet) => {
                    if (resOfShipReqEmpDet) {
                        // [S] add log of delete shipping request employee details for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: ShippingRequestEmpDetConstObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(ShippingRequestEmpDetConstObj.DELETE.description
                                , (COMMON.stringFormat('{0} {1}', resOfShipReqEmpDet.employee.firstName, resOfShipReqEmpDet.employee.lastName))
                                , resOfShipReqEmpDet.shippingRequest.note, req.user.username),
                            refTransTable: ShippingRequestEmpDetConstObj.refTransTableName,
                            refTransID: idArr.toString(),
                            eventType: timelineObjForShippingRequestEmpDet.id,
                            url: COMMON.stringFormat(ShippingRequestEmpDetConstObj.url, resOfShipReqEmpDet.shippingRequest.id),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of delete shipping request employee details for timeline users
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(moduleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Acknowledge shipping request
    // POST : /api/v1/shippingrequestempdet/ackShippingRequestEmpDet
    // @param {id} int
    // @param {shippingRequestID} int
    // @return API response
    ackShippingRequestEmpDet: (req, res) => {
        const { ShippingRequestEmpDet, ShippingRequest } = req.app.locals.models;

        COMMON.setModelUpdatedByFieldValue(req);
        req.body.acceptedDate = COMMON.getCurrentUTC();
        return ShippingRequestEmpDet.update(req.body, {
            where: {
                id: req.body.id
            },
            fields: ['isAck', 'acceptedDate', 'updatedBy']
        }).then((response) => {
            // [S] add log of update employee acknowledgement shipping request details for timeline users
            const objEvent = {
                userID: req.user.id,
                eventTitle: ShippingRequestEmpDetConstObj.ACK.title,
                eventDescription: COMMON.stringFormat(ShippingRequestEmpDetConstObj.ACK.description,
                    req.body.empName, req.body.shipReqNote, req.user.username),
                refTransTable: ShippingRequestEmpDetConstObj.refTransTableName,
                refTransID: req.body.id,
                eventType: timelineObjForShippingRequestEmpDet.id,
                url: COMMON.stringFormat(ShippingRequestEmpDetConstObj.url, req.body.shippingRequestID),
                eventAction: timelineEventActionConstObj.UPDATE
            };
            req.objEvent = objEvent;
            TimelineController.createTimeline(req);
            // [E] add log of update employee acknowledgement shipping request details for timeline users


            ShippingRequest.findOne({
                where: {
                    id: req.body.shippingRequestID
                },
                attributes: ['requestedBy', 'note']
            }).then((resp) => {
                if (!resp || !resp.requestedBy) { return; }
                const data = {
                    shippingReqEmpDetID: req.body.id,
                    shippingRequestID: req.body.shippingRequestID,
                    senderID: req.user.employeeID,
                    receiver: [resp.requestedBy],
                    message: COMMON.stringFormat('#{0}- {1}', req.body.shippingRequestID, resp.note)
                };
                NotificationMstController.sendAckShippingReqEmpDet(req, data);
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.SHIPPING_REQUEST_EMPDET.ACK);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};