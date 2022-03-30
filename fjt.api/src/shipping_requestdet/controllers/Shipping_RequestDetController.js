const { STATE, COMMON } = require('../../constant');
const { NotFound, NotDelete } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const timelineObjForShippingRequestDet = DATA_CONSTANT.TIMLINE.EVENTS.SHIPPING_REQUEST.SHIPPING_REQUESTDET;
const ShippingRequestDetConstObj = DATA_CONSTANT.TIMLINE.SHIPPING_REQUESTDET;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const moduleName = DATA_CONSTANT.REQUEST_FOR_SHIPDET.NAME;

module.exports = {


    // Save shipping request details
    // POST : /api/v1/shippingrequestdet/saveShippingRequestDet
    // @param {Model} object
    // @return API response
    saveShippingRequestDet: (req, res) => {
        const { ShippingRequestDet } = req.app.locals.models;

        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            ShippingRequestDet.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: ['shippingRequestID', 'woID', 'qty', 'note', 'updatedBy']
            }).then((response) => {
                // [S] add log of update shipping request details for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: ShippingRequestDetConstObj.UPDATE.title,
                    eventDescription: COMMON.stringFormat(ShippingRequestDetConstObj.UPDATE.description, req.body.assyNameForTimelineLog, req.user.username),
                    refTransTable: ShippingRequestDetConstObj.refTransTableName,
                    refTransID: req.body.id,
                    eventType: timelineObjForShippingRequestDet.id,
                    url: COMMON.stringFormat(ShippingRequestDetConstObj.url, req.body.shippingRequestID),
                    eventAction: timelineEventActionConstObj.UPDATE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of update shipping request details for timeline users

                return resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.NOT_UPDATED(moduleName)));
            });
        } else {
            ShippingRequestDet.count({
                where: {
                    woID: req.body.woID,
                    shippingRequestID: req.body.shippingRequestID
                }
            }).then((count) => {
                if (count > 0) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, MESSAGE_CONSTANT.SHIPPING_REQUEST_DET.WORKORDER_EXISTS);
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                   return ShippingRequestDet.create(req.body, {
                        fields: ['shippingRequestID', 'woID', 'qty', 'note', 'createdBy']
                    }).then((response) => {
                        // [S] add log of create shipping request details for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: ShippingRequestDetConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(ShippingRequestDetConstObj.CREATE.description, req.body.assyNameForTimelineLog, req.user.username),
                            refTransTable: ShippingRequestDetConstObj.refTransTableName,
                            refTransID: response.id,
                            eventType: timelineObjForShippingRequestDet.id,
                            url: COMMON.stringFormat(ShippingRequestDetConstObj.url, req.body.shippingRequestID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of create shipping request details for timeline users

                        return resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
            });
        }
    },
    // Delete multiple shipping request details
    // POST : /api/v1/shippingrequestdet/deleteRequestForShip
    // @param {IDs with model} object
    // @return API response
    deleteRequestForShip: (req, res) => {
        const { ShippingRequestDet, ShippingRequest } = req.app.locals.models;
        if (req.params.id) {
            const idArr = req.params.id.split(',') || [];

            const model = {
                isDeleted: true,
                deletedBy: COMMON.getRequestUserID(req),
                deletedAt: COMMON.getCurrentUTC()
            };

            return ShippingRequestDet.update(model, {
                where: {
                    id: idArr,
                    deletedAt: null
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt']
            }).then((response) => {
                ShippingRequestDet.findOne({
                    where: {
                        id: idArr[0]
                    },
                    paranoid: false,
                    attributes: ['note'],
                    include: [{
                        model: ShippingRequest,
                        as: 'shippingRequest',
                        required: true,
                        attributes: ['id', 'note']
                    }]
                }).then((resOfShipReqDet) => {
                    if (resOfShipReqDet) {
                        // [S] add log of delete shipping request details for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: ShippingRequestDetConstObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(ShippingRequestDetConstObj.DELETE.description, resOfShipReqDet.shippingRequest.note, req.user.username),
                            refTransTable: ShippingRequestDetConstObj.refTransTableName,
                            refTransID: idArr.toString(),
                            eventType: timelineObjForShippingRequestDet.id,
                            url: COMMON.stringFormat(ShippingRequestDetConstObj.url, resOfShipReqDet.shippingRequest.id),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of delete shipping request details for timeline users
                    }
                    resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(moduleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_DELETED(moduleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_DELETED(moduleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};