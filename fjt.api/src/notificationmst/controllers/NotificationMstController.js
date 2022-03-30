const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, InvalidPerameter } = require('../../errors');
const NotificationSocketController = require('../controllers/NotificationSocketController');

const saveNotMstFields = [
    'senderID',
    'subject',
    'message',
    'messageType',
    'messageSubType',
    'jsonData',
    'refNotificationID',
    'isSenderDelete',
    'notificationDate',
    'redirectUrl',
    'isDeleted',
    'createdAt',
    'createdBy',
    'isActive',
    'updatedAt',
    'updatedBy',
    'updateByRoleId',
    'createByRoleId',
    'refTransID',
    'refTable'
];

const saveNotDetFields = [
    'notificationID',
    'receiverID',
    'isRead',
    'requestStatus',
    'isDeleted',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'updateByRoleId',
    'createByRoleId'
];

const notificationModel = {
    pageIndex: 1,
    recordPerPage: 1,
    sortBy: null,
    receiverID: null,
    notificationID: null
};
const notificationModuleName = DATA_CONSTANT.NOTIFICATIONMST.NAME;

module.exports = {
    // Get list of notification
    // POST : /api/v1/notificationmst/getNotificationList
    // @return list of notification
    getNotificationList: (req, res) => {
        // console.error("socket: getNotificationList");
        var pageIndex = req.body.pageIndex;
        let recordPerPage = req.body.recordPerPage;

        if (req.body.notificationID) {
            pageIndex = 1;
            recordPerPage = 1;
        }

        const model = {
            pageIndex: pageIndex,
            recordPerPage: recordPerPage,
            sortBy: req.body.sortBy || null,
            receiverID: req.body.receiverID,
            notificationID: req.body.notificationID || null
        };

        module.exports.getNotificationListFn(req, model).then((notificationList) => {
            if (notificationList) { resHandler.successRes(res, 200, STATE.SUCCESS, notificationList); } else { resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND)); }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
        });
    },
    // Get notification count by receiverID
    // GET : /api/v1/notificationmst/getNotificationCount
    // @param {receiverID} int
    // @return notification count
    getNotificationCount: (req, res) => {
        // console.error("socket: getNotificationCount");
        const { NotificationDet, NotificationMst } = req.app.locals.models;

        NotificationDet.count({
            where: {
                receiverID: req.params.receiverID,
                isRead: false
            },
            include: [{
                model: NotificationMst,
                as: 'notificationMst',
                where: {
                    isActive: true
                },
                attributes: [],
                required: true
            }]
        }).then((count) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, count);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
        });
    },
    // Clear notification count
    // POST : /api/v1/notificationmst/clearNotificationCount
    // @return API Response
    clearNotificationCount: (req, res) => {
        // console.error("socket: clearNotificationCount");
        const { NotificationDet } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);
        req.body.isRead = true;

        NotificationDet.update(req.body, {
            where: {
                receiverID: req.body.receiverID
            },
            fields: ['isRead', 'updatedAt', 'updatedBy']
        }).then(() => {
            resHandler.successRes(res, 200, STATE.SUCCESS);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
        });
    },
    // Send notification
    // POST : /api/v1/notificationmst/sendNotification
    // @return API Response
    sendNotification: (req, res) => {
        // console.error("socket: sendNotification");
        switch (req.body.messageType) {
            case DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE: {
                module.exports.getWOOPEmployees(req, req.body.woOPID).then((employees) => {
                    var data = req.body;
                    data.receiver = employees.filter(x => parseInt(x) !== parseInt(req.body.employeeID));
                    data.senderID = req.body.employeeID;
                    module.exports.sendWOOPVersionChange(req, data);
                    resHandler.successRes(res, 200, STATE.SUCCESS);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(notificationModuleName)));
                });
                break;
            }
            case DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.TYPE: {
                module.exports.getWOEmployees(req, req.body.woID).then((employees) => {
                    var data = req.body;
                    data.receiver = employees.filter(x => parseInt(x) !== parseInt(req.body.employeeID));
                    data.senderID = req.body.employeeID;
                    module.exports.sendWOVersionChange(req, data);
                    resHandler.successRes(res, 200, STATE.SUCCESS);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(notificationModuleName)));
                });
                break;
            }
            default:
                break;
        }
    },
    // Send notification
    // POST : /api/v1/notificationmst/ackNotification
    // @return API Response
    ackNotification: (req, res) => {
        // console.error("socket: ackNotification");
        const { NotificationDet, NotificationMst } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);
        req.body.isRead = true;

        NotificationDet.update(req.body, {
            where: {
                notificationID: req.body.notificationID,
                receiverID: req.body.receiverID,
                requestStatus: DATA_CONSTANT.NOTIFICATIONMST.REQUEST_STATUS.PENDING
            },
            fields: ['isRead', 'updatedAt', 'updatedBy', 'requestStatus']
        }).then((response) => {
            if (response[0] > 0) {
                return NotificationMst.findOne({
                    where: {
                        id: req.body.notificationID
                    }
                }).then((notiMst) => {
                    resHandler.successRes(res, 200, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.NOTIFICATIONMST.ACK_NOTI);

                    let message = '';
                    if (req.body.requestStatus === DATA_CONSTANT.NOTIFICATIONMST.REQUEST_STATUS.ACCEPTED) { message = '[ACKNOWLEDGED] {0}'; } else if (req.body.requestStatus === DATA_CONSTANT.NOTIFICATIONMST.REQUEST_STATUS.REJECTED) { message = '[REJECTED] {0}'; } else { message = '{0}'; }

                    const notificationMst = {
                        subject: COMMON.stringFormat(message, notiMst.subject),
                        messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACKNOWLEDGED.TYPE,
                        messageSubType: null,
                        jsonData: null,
                        redirectUrl: null,
                        isActive: true
                    };

                    // add all ref notification (noti mst) json data to new creating ack noti json data
                    // replace sender and receiver as in ack case it will be reverse
                    if (notiMst && notiMst.dataValues.jsonData) {
                        try {
                            const notiJsonDataObj = JSON.parse(notiMst.dataValues.jsonData);
                            if (notiJsonDataObj && _.isObject(notiJsonDataObj)) {
                                if (notiJsonDataObj.receiver) {
                                    notiJsonDataObj.receiver = [notiMst.senderID];
                                }
                                if (notiJsonDataObj.senderID) {
                                    notiJsonDataObj.senderID = req.body.receiverID;
                                }
                                if (notiJsonDataObj.employeeID) {
                                    notiJsonDataObj.employeeID = req.body.receiverID;
                                }
                                notificationMst.jsonData = JSON.stringify(notiJsonDataObj);
                            }
                        } catch (ex) {
                            // console.log(ex);
                        }
                    }

                    const data = {
                        message: COMMON.stringFormat(message, notiMst.message),
                        senderID: req.body.receiverID,
                        refNotificationID: notiMst.id,
                        receiver: [notiMst.senderID]
                    };
                    module.exports.updateCommonDetails(notificationMst, data);
                    module.exports.saveCommNotificationFn(req, notificationMst);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
                });
            } else { return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.ALREADY_ACK)); }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
        });
    },
    // <--------- notification methods ----------->
    // Send notification for work-order review invitation
    sendWOReviewInvitation: (req, data) => {
        // console.error("socket: sendWOReviewInvitation");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const dataObjForJson = {};
                module.exports.setAssyWOCommonInfoForNotiJsonData(dataObjForJson, workorder);
                dataObjForJson.woRevReqID = data.woRevReqID;
                const userFullName = COMMON.getLoginUserFullName(req);
                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.SUBJECT,
                        assyWOCommonInfo, userFullName),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.JSONDATA(dataObjForJson),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.REDIRECTURL, data.woID, data.woRevReqID),
                    isActive: true
                };
                data.message = DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.MESSAGE;
                module.exports.updateCommonDetails(notificationMst, data);
                module.exports.saveCommNotificationFn(req, notificationMst);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },

    socketCallForWOReviewInvitationChange: (req, data) => {
        // send socket call for refresh all user screen (except login user)
        NotificationSocketController.send(req, {
            data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW.TYPE, data: data },
            receiver: data.empListOfPageRouteAccess
        });
    },

    // <--------- notification methods ----------->
    // Send notification for work-order review invitation
    sendWOReviewOwnership: (req, data) => {
        // console.error("socket: sendWOReviewInvitation");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            const userFullName = COMMON.getLoginUserFullName(req);
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.SUBJECT,
                        assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.REDIRECTURL, data.woID),
                    isActive: true
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.MESSAGE,
                    userFullName, assyWOCommonInfo);
                module.exports.updateCommonDetails(notificationMst, data);

                // // send socket call for all new invited co-owner (except login user)
                // NotificationSocketController.send(req, {
                //    data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.TYPE, data: data },
                //    receiver: data.receiver.filter(x => { return x.id != req.user.employeeID; })
                // });

                // send notification
                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order review invitation
    sendWOReviewOwnershipRemoveRequest: (req, data) => {
        // console.error("socket: sendWOReviewInvitation");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            const userFullName = COMMON.getLoginUserFullName(req);
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER_REMOVE.SUBJECT,
                        assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER_REMOVE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER_REMOVE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER_REMOVE.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER_REMOVE.REDIRECTURL, data.woID),
                    isActive: true
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER_REMOVE.MESSAGE,
                    userFullName, assyWOCommonInfo);
                module.exports.updateCommonDetails(notificationMst, data);

                // // send socket call for all removed co-owner (except login user)
                // NotificationSocketController.send(req, {
                //    data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.TYPE, data: data },
                //    receiver: data.receiver.filter(x => { return x.id != req.user.employeeID; })
                // });

                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    socketCallForWOReviewCoOwnerChange: (req, data) => {
        // send socket call for refresh all user screen (except login user)
        NotificationSocketController.send(req, {
            data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_CO_OWNER.TYPE, data: data },
            receiver: data.empListOfPageRouteAccess
        });
    },

    // Send notification for work-order change review invitation
    sendWOChangeReviewInvitation: (req, data) => {
        // console.error("socket: sendWOChangeReviewInvitation");

        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const userFullName = COMMON.getLoginUserFullName(req);
                let redirectUrl;
                if (DATA_CONSTANT.WORKORDER_REQFORREVIEW.WO_OP_CHANGE_TYPES.indexOf(data.changeType) !== -1) {
                    redirectUrl = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.REDIRECTURL_OPERATION, data.woOPID, data.woRevReqID, true);
                } else {
                    redirectUrl = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.REDIRECTURL, data.woID, data.woRevReqID);
                }

                const dataObjForJson = {};
                module.exports.setAssyWOCommonInfoForNotiJsonData(dataObjForJson, workorder);
                dataObjForJson.opID = parseInt(data.opID) || null;
                dataObjForJson.woOPID = parseInt(data.woOPID) || null;
                dataObjForJson.woRevReqID = parseInt(data.woRevReqID) || null;

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.SUBJECT,
                        userFullName, assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.JSONDATA(dataObjForJson),
                    redirectUrl: redirectUrl,
                    isActive: true
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_CHANGE_REVIEW.MESSAGE, req.body.description);
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order review comment
    sendWOReviewComment: (req, data) => {
        // console.error("socket: sendWOReviewComment");

        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const dataObjForJson = {};
                module.exports.setAssyWOCommonInfoForNotiJsonData(dataObjForJson, workorder);
                dataObjForJson.opID = parseInt(data.opID) || null;
                dataObjForJson.woRevReqID = parseInt(data.woRevReqID) || null;
                dataObjForJson.woRevReqcommID = parseInt(data.woRevReqcommID) || null;

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT.SUBJECT, assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT.JSONDATA(dataObjForJson),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT.REDIRECTURL, data.woID, data.woRevReqID),
                    isActive: true
                };

                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order review comment status
    sendWOReviewCommentStatus: (req, data) => {
        // console.error("socket: sendWOReviewCommentStatus");

        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const userFullName = COMMON.getLoginUserFullName(req);
                const statusText = (data.accRejStatus === DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_STATUS.ACCEPTED ? 'accepted' : 'rejected');

                const dataObjForJson = {};
                module.exports.setAssyWOCommonInfoForNotiJsonData(dataObjForJson, workorder);
                dataObjForJson.opID = parseInt(data.opID) || null;
                dataObjForJson.woRevReqID = parseInt(data.woRevReqID) || null;
                dataObjForJson.woRevReqcommID = parseInt(data.woRevReqcommID) || null;

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT_STATUS.SUBJECT,
                        statusText, assyWOCommonInfo, userFullName),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT_STATUS.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT_STATUS.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT_STATUS.JSONDATA(dataObjForJson),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT_STATUS.REDIRECTURL, data.woID, data.woRevReqID),
                    isActive: true
                };

                // data.message = DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT_STATUS.MESSAGE;
                data.message = notificationMst.subject;
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },
    // Send notification for work-order review status
    sendWOReviewStatus: (req, data) => {
        // console.error("socket: sendWOReviewStatus");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const statusText = (data.accRejStatus === DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_STATUS.ACCEPTED ? 'accepted' : 'rejected');

                const dataObjForJson = {};
                module.exports.setAssyWOCommonInfoForNotiJsonData(dataObjForJson, workorder);
                dataObjForJson.opID = parseInt(data.opID) || null;
                dataObjForJson.woRevReqID = parseInt(data.woRevReqID) || null;
                dataObjForJson.woRevReqcommID = parseInt(data.woRevReqcommID) || null;

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_STATUS.SUBJECT,
                        assyWOCommonInfo, statusText),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_STATUS.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_STATUS.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_STATUS.JSONDATA(dataObjForJson),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_STATUS.REDIRECTURL, data.woID, data.woRevReqID),
                    isActive: true
                };

                module.exports.updateCommonDetails(notificationMst, data);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_STATUS.MESSAGE, assyWOCommonInfo, statusText);


                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order trasaction assembly defect
    sendWOTransAssyDefect: (req, obj) => {
        // console.error("socket: sendWOTransAssyDefect");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);

                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.SUBJECT, assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_ASSY_DEFECT.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });

                    /* if rework operation then update DPMO (Defects Per Million Opportunities) details for all users of current work order traveler */
                    if (obj.isReworkOperation) {
                        NotificationSocketController.send(req, {
                            data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REWORK_OP_DEFECT_CHANGE_DPMO.TYPE, data: obj.data },
                            receiver: obj.receiver
                        });
                    }
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order assembly designator
    sendWOAssyDesignator: (req, obj) => {
        // console.error("socket: sendWOAssyDesignator");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);

                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);
                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.SUBJECT, assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order assembly designator update
    sendWOAssyDesignatorUpdate: (req, obj) => {
        // console.error("socket: sendWOAssyDesignatorUpdate");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);

                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);
                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.SUBJECT,
                        assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_UPDATE.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order assembly designator remove
    sendWOAssyDesignatorRemove: (req, obj) => {
        // console.error("socket: sendWOAssyDesignatorRemove");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);

                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);
                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.SUBJECT,
                        assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_ASSY_DESIGNATOR_REMOVE.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order opreation version change
    sendWOOPVersionChange: (req, data) => {
        // console.error("socket: sendWOOPVersionChange");
        module.exports.getWorkorderOperationDetails(req, data.woID, data.opID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const woOPCommonInfo = module.exports.setWOOPCommonInfoForNotiMessage(workorder);
                // var jsonData = {
                //    woID: data.woID,
                //    opID: data.opID,
                //    woOPID: data.woOPID,
                //    opVersion: data.opVersion,
                //    woVersion: data.woVersion
                // };

                module.exports.setAssyWOOPCommonInfoForNotiJsonData(data, workorder);
                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.SUBJECT,
                        woOPCommonInfo, assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.REDIRECTURL, data.woOPID),
                    isActive: true
                };
                data.message = notificationMst.subject;

                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id
                        };
                    }
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_VERSION_CHANGE.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order version change
    sendWOVersionChange: (req, data) => {
        // console.error("socket: sendWOVersionChange");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                // var jsonData = {
                //    woID: parseInt(data.woID) || null,
                //    woVersion: data.woVersion
                // };

                module.exports.setAssyWOCommonInfoForNotiJsonData(data, workorder);
                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.SUBJECT,
                        assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.REDIRECTURL, data.woID),
                    isActive: true
                };
                data.message = notificationMst.subject;
                module.exports.updateCommonDetails(notificationMst, data);


                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id
                        };
                    }
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_VERSION_CHANGE.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for ECO department approval
    sendECODeptApproval: (req, data) => {
        // console.error("socket: sendECODeptApproval");
        const assyWOCommonInfo = module.exports.setAssyWOinfoForECONotiMessage(data);
        // module.exports.setAssyWOCommonInfoForECONotiJsonData(data);
        data.ecoReqID = parseInt(data.ecoReqID) || null;
        const userFullName = COMMON.getLoginUserFullName(req);

        const notificationMst = {
            subject: COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.SUBJECT : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.SUBJECT,
                data.ecoNumber, assyWOCommonInfo),
            messageType: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.TYPE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.TYPE,
            messageSubType: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.SUBTYPE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.SUBTYPE,
            jsonData: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.JSONDATA(data) : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.JSONDATA(data),
            redirectUrl: COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.REDIRECTURL : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.REDIRECTURL, data.partID, data.ecoReqID),
            isActive: true
        };
        data.message = COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.MESSAGE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.MESSAGE,
            data.ecoNumber, userFullName);

        module.exports.updateCommonDetails(notificationMst, data);
        return module.exports.saveCommNotificationFn(req, notificationMst);
    },
    // Send notification for ECO department approval acknowledged
    sendECODeptApprovalAck: (req, data) => {
        // console.error("socket: sendECODeptApprovalAck");
        const assyWOCommonInfo = module.exports.setAssyWOinfoForECONotiMessage(data);
        const userFullName = COMMON.getLoginUserFullName(req);
        //  module.exports.setAssyWOCommonInfoForECONotiJsonData(data);
        data.ecoReqID = parseInt(data.ecoReqID) || null;

        const notificationMst = {
            subject: COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL_ACK.SUBJECT : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL_ACK.SUBJECT,
                data.ecoNumber, assyWOCommonInfo),
            messageType: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL_ACK.TYPE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL_ACK.TYPE,
            messageSubType: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL_ACK.SUBTYPE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL_ACK.SUBTYPE,
            jsonData: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL_ACK.JSONDATA(data) : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL_ACK.JSONDATA(data),
            redirectUrl: COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL.REDIRECTURL : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL.REDIRECTURL, data.partID, data.ecoReqID),
            isActive: true
        };
        data.message = COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_DEPT_APPROVAL_ACK.MESSAGE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_DEPT_APPROVAL_ACK.MESSAGE, data.ecoNumber, userFullName);

        module.exports.updateCommonDetails(notificationMst, data);
        return module.exports.saveCommNotificationFn(req, notificationMst);
    },

    // common method to set Assy and WO info in notification title and description
    setAssyWOinfoForECONotiMessage: assyWOOPDet => `${COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.NotiAssyWODisplayFormat,
        assyWOOPDet.assyPN, assyWOOPDet.PIDCode, assyWOOPDet.nickName)
        } ${assyWOOPDet.woNumber ? COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.NotiWODisplayFormat, assyWOOPDet.woNumber, assyWOOPDet.woVersion) : ''}`,
    // Send notification for ECO request status
    sendECORequestStatus: (req, data) => {
        // console.error("socket: sendECORequestStatus");
        module.exports.getworkorderoperationdetails(req, req.body.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const finalStatus = data.finalStatus === 'A' ? 'accepted' : 'rejected';
                // var notificationMst = {
                //     subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.SUBJECT, data.ecoNumber, finalStatus),
                //     messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.TYPE,
                //     messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.SUBTYPE,
                //     jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.JSONDATA(data),
                //     redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.REDIRECTURL, data.woID, data.ecoReqID),
                //     isActive: true
                // };

                module.exports.setAssyWOCommonInfoForNotiJsonData(data, workorder);
                const notificationMst = {
                    subject: COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.SUBJECT : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_REQUEST_STATUS.SUBJECT,
                        data.ecoNumber, assyWOCommonInfo),
                    messageType: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.TYPE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_REQUEST_STATUS.TYPE,
                    messageSubType: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.SUBTYPE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_REQUEST_STATUS.SUBTYPE,
                    jsonData: parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.JSONDATA(data) : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_REQUEST_STATUS.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.REDIRECTURL : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_REQUEST_STATUS.REDIRECTURL, data.partID, data.ecoReqID),
                    isActive: true
                };

                data.message = COMMON.stringFormat(parseInt(data.requestType) === 1 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ECO_REQUEST_STATUS.MESSAGE : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.DFM_REQUEST_STATUS.MESSAGE, finalStatus);
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst);
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for team operation activity start
    sendTeamOperationCheckIn: (req, data) => {
        // console.error("socket: sendTeamOperationCheckIn");
        module.exports.sendWorkorderOperationTrans(req, data, DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_CHECKIN);
    },
    // Send notification for team operation activity stop
    sendTeamOperationCheckOut: (req, data) => {
        // console.error("socket: sendTeamOperationCheckOut");
        module.exports.sendWorkorderOperationTrans(req, data, DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_CHECKOUT);
    },
    // Send notification for team operation pause
    sendTeamOperationPause: (req, data) => {
        // console.error("socket: sendTeamOperationPause");
        module.exports.sendWorkorderOperationTrans(req, data, DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_PAUSE);
    },
    // Send notification for team operation resume
    sendTeamOperationResume: (req, data) => {
        // console.error("socket: sendTeamOperationResume");
        module.exports.sendWorkorderOperationTrans(req, data, DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_RESUME);
    },
    // Send notification for operation reprocess required quantity added
    sendTeamOperationReprocessQtyChange: (req, data) => {
        // console.error("socket: sendTeamOperationReprocessQtyChange");
        module.exports.sendWorkorderOperationTrans(req, data, DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_REPROCESS_QTY_UPDATE);
    },

    // Send notification for work-order operation transaction
    // Common method to send notification for all team type of notifications
    sendWorkorderOperationTrans: (req, data, messageType) => {
        // console.error("socket: sendWorkorderOperationTrans");
        module.exports.getWorkorderOperationDetails(req, data.woID, data.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(data, workorder);
                const notificationMst = {
                    subject: COMMON.stringFormat(messageType.SUBJECT, assyWOOPCommonInfo),
                    messageType: messageType.TYPE,
                    messageSubType: messageType.SUBTYPE,
                    jsonData: messageType.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(messageType.REDIRECTURL, data.woOPID),
                    isActive: true
                };

                data.message = COMMON.stringFormat(messageType.MESSAGE, assyWOOPCommonInfo);
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        data.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }
                    data.subject = notificationMst.subject;
                    // data.socketReceiversForRefresh = [];
                    if (messageType.TYPE === DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_CHECKIN.TYPE
                        || messageType.TYPE === DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_CHECKOUT.TYPE
                        || messageType.TYPE === DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_PAUSE.TYPE
                        || messageType.TYPE === DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_TEAM_RESUME.TYPE) {
                        // get all wo emp in which defined emp exists for socket call
                        return module.exports.getAllWOEmpListContainDefinedWOEmp(req, data.employeeID).then((respOfAllWOEmpList) => {
                            // data.socketReceiversForRefresh = respOfAllWOEmpList;
                            NotificationSocketController.send(req, {
                                data: { event: messageType.TYPE, data: data },
                                receiver: respOfAllWOEmpList  // respOfAllWOEmpList.filter((x) => { return x != req.body.employeeID })
                            });
                        });
                    } else {
                        NotificationSocketController.send(req, {
                            data: { event: messageType.TYPE, data: data },
                            receiver: data.receiver
                        });
                        return STATE.SUCCESS;
                    }
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order operation halted
    sendWOOPHold: (req, data) => {
        // console.error("socket: sendWOOPHold");
        module.exports.getWorkorderOperationDetails(req, data.woID, data.opID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const woOPCommonInfo = module.exports.setWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.SUBJECT,
                        woOPCommonInfo, assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.REDIRECTURL, data.woOPID),
                    isActive: true,
                    refTable: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.refTable,
                    refTransID: data.refTransID
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.MESSAGE, req.body.reason);

                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }
                    req.body.subject = notificationMst.subject;
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order operation resumed
    sendWOOPUnHold: (req, data) => {
        // console.error("socket: sendWOOPUnHold");
        module.exports.getWorkorderOperationDetails(req, data.woID, data.opID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                const woOPCommonInfo = module.exports.setWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.SUBJECT,
                        woOPCommonInfo, assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.REDIRECTURL, data.woOPID),
                    isActive: true,
                    refTable: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.refTable,
                    refTransID: data.refTransID
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_HOLD.MESSAGE, req.body.resumeReason);
                // data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.MESSAGE, workorder.woNumber, COMMON.operationDisplayFormat(MESSAGE_CONSTANT.OPERATION.OPERATION_DISPlAY_FORMAT, workorder.operation.opName, workorder.operation.opNumber));
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }

                    req.body.subject = notificationMst.subject;
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_OP_UNHOLD.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // send notification for purchase-order stopped
    sendHoldResumePONotification: (req, data) => {
        if (data) {
            const notificationMst = {
                subject: COMMON.stringFormat(data.notificationDetail.SUBJECT, data.poNumber, data.soNumber, data.assyPID, data.message),
                messageType: data.notificationDetail.TYPE,
                messageSubType: data.notificationDetail.SUBTYPE,
                jsonData: data.notificationDetail.JSONDATA(data),
                redirectUrl: data.redirecUrl,
                isActive: true,
                refTable: data.refTable,
                refTransID: data.refTransID
            };
            data.message = COMMON.stringFormat(data.notificationDetail.MESSAGE, data.message);
            module.exports.updateCommonDetails(notificationMst, data);
            return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                if (resp && resp.notificationMst) {
                    req.body.notificationMst = {
                        id: resp.notificationMst.id,
                        senderID: data.senderID
                    };
                }
                req.body.subject = notificationMst.subject;
                NotificationSocketController.send(req, {
                    data: { event: data.notificationDetail.TYPE, data: req.body },
                    receiver: data.receiver
                });
            });
        } else {
            return STATE.FAILED;
        }
    },


    // Send notification for work-order start
    sendWOStart: (req, data) => {
        // console.error("socket: sendWOStart");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.SUBJECT,
                        assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.REDIRECTURL, workorder.firstwoOPID),
                    isActive: true,
                    refTable: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.refTable,
                    refTransID: data.refTransID
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.MESSAGE, req.body.resumeReason);
                // data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.MESSAGE, workorder.woNumber);
                // data.message = req.body.resumeReason;
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }
                    req.body.subject = notificationMst.subject;
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_START.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // Send notification for work-order stopped
    sendWOStop: (req, data) => {
        // console.error("socket: sendWOStop");
        module.exports.getWorkorderOperationDetails(req, data.woID).then((workorder) => {
            if (workorder) {
                const assyWOCommonInfo = module.exports.setAssyWOCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.SUBJECT,
                        assyWOCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.REDIRECTURL, workorder.firstwoOPID),
                    isActive: true,
                    refTable: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.refTable,
                    refTransID: data.refTransID
                };
                data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.MESSAGE, req.body.reason);

                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }

                    req.body.subject = notificationMst.subject;
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_STOP.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for chat message
    sendChatMessage: (req, obj) => {
        // console.error("socket: sendChatMessage");
        NotificationSocketController.sendChat(obj, {
            data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CHAT_MESSAGE.TYPE, data: obj }
        });
    },
    sendUpdateChatMessage: (req, obj) => {
        // console.error("socket: sendUpdateChatMessage");
        NotificationSocketController.sendUpdateChat(obj, {
            data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CHAT_MESSAGE.TYPE, data: obj }
        });
    },
    // Send notification for work-order trasaction pre-programming part
    sendWOTransPreprogComp: (req, obj) => {
        // console.error("socket: sendWOTransPreprogComp");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);

                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.SUBJECT,
                        assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_TRANS_PREPROG_COMP.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order pre-programming part designator
    sendWOPreprogCompDesignator: (req, obj) => {
        // console.error("socket: sendWOPreprogCompDesignator");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);

                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.SUBJECT,
                        assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for work-order pre-programming part designator remove
    sendWOPreprogCompDesignatorRemove: (req, obj) => {
        // console.error("socket: sendWOPreprogCompDesignatorRemove");
        module.exports.getWorkorderOperationDetails(req, obj.woID, obj.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(obj, workorder);

                const notificationMst = {
                    subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.SUBJECT,
                        assyWOOPCommonInfo),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.JSONDATA(obj),
                    redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.REDIRECTURL,
                    isActive: false
                };

                module.exports.updateCommonDetails(notificationMst, obj);
                notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.MESSAGE,
                    assyWOOPCommonInfo);
                return module.exports.saveCommNotificationFn(req, notificationMst).then(() => {
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PREPROG_COMP_DESIGNATOR_REMOVE.TYPE, data: obj.data },
                        receiver: obj.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for Shipping request employee detail
    sendShippingReqEmpDet: (req, data) => {
        // console.error("socket: sendShippingReqEmpDet");
        var jsonData = {
            shippingReqEmpDetID: parseInt(data.shippingReqEmpDetID) || null,
            shippingRequestID: parseInt(data.shippingRequestID) || null
        };
        const userFullName = COMMON.getLoginUserFullName(req);
        var notificationMst = {
            subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_EMP_DET.SUBJECT, userFullName),
            messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_EMP_DET.TYPE,
            messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_EMP_DET.SUBTYPE,
            jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_EMP_DET.JSONDATA(jsonData),
            redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_EMP_DET.REDIRECTURL, data.shippingRequestID),
            isActive: true
        };
        data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_EMP_DET.MESSAGE, userFullName);

        module.exports.updateCommonDetails(notificationMst, data);
        return module.exports.saveCommNotificationFn(req, notificationMst);
    },
    sendAckShippingReqEmpDet: (req, data) => {
        // console.error("socket: sendAckShippingReqEmpDet");
        var jsonData = {
            shippingReqEmpDetID: parseInt(data.shippingReqEmpDetID) || null,
            shippingRequestID: parseInt(data.shippingRequestID) || null
        };
        const userFullName = COMMON.getLoginUserFullName(req);
        var notificationMst = {
            subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACK_SHIPPING_REQ_EMP_DET.SUBJECT, userFullName),
            messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACK_SHIPPING_REQ_EMP_DET.TYPE,
            messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACK_SHIPPING_REQ_EMP_DET.SUBTYPE,
            jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACK_SHIPPING_REQ_EMP_DET.JSONDATA(jsonData),
            redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACK_SHIPPING_REQ_EMP_DET.REDIRECTURL, data.shippingRequestID),
            isActive: true
        };
        data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.ACK_SHIPPING_REQ_EMP_DET.MESSAGE, userFullName);

        module.exports.updateCommonDetails(notificationMst, data);
        return module.exports.saveCommNotificationFn(req, notificationMst);
    },
    sendShippingReqStatus: (req, data) => {
        // console.error("socket: sendShippingReqStatus");
        var jsonData = {
            shippingRequestID: parseInt(data.shippingRequestID) || null
        };

        var notificationMst = {
            subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_STATUS.SUBJECT,
                'Publish', 'Draft'),
            messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_STATUS.TYPE,
            messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_STATUS.SUBTYPE,
            jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_STATUS.JSONDATA(jsonData),
            redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_STATUS.REDIRECTURL, data.shippingRequestID),
            isActive: true
        };
        data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.SHIPPING_REQ_STATUS.MESSAGE,
            'Publish', 'Draft');

        module.exports.updateCommonDetails(notificationMst, data);
        return module.exports.saveCommNotificationFn(req, notificationMst);
    },
    // Send notification for work order operation start operation activity at first time to check isProduction Start
    sendFirstCheckInDetForIsProductionStart: (req, data) => {
        // console.error("socket: sendFirstCheckInDetForIsProductionStart");
        NotificationSocketController.send(req, {
            data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_PRODUCTION_START_AS_FIRST_CHECKIN.TYPE, data: data },
            receiver: data.receiver
        });
    },


    // <--------- common methods ----------->
    // Update common details
    updateCommonDetails: (model, data) => {
        // console.error("socket: updateCommonDetails");
        var commonObj =
        {
            senderID: data.senderID,
            message: data.message,
            refNotificationID: data.refNotificationID,
            isSenderDelete: false,
            notificationDate: COMMON.getCurrentUTC(),
            isDeleted: false,
            createdBy: data.senderID,
            notificationDet: data.receiver ? module.exports.getNotificationDetObj(data.senderID, data.receiver) : null
        };

        return Object.assign(model, commonObj);
    },
    // Save notification detail
    // @return added notification detail
    saveCommNotificationFn: (req, notificationMst) =>
        // console.error("socket: saveCommNotificationFn");
        module.exports.saveNotificationFn(req, notificationMst).then((response) => {
            if (response.status === STATE.SUCCESS) {
                notificationModel.notificationID = response.data.id;
                return module.exports.getNotificationListFn(req, notificationModel).then((notificationList) => {
                    if (notificationMst.isActive) { NotificationSocketController.sendNotification(req, notificationList); }
                    return {
                        notificationMst: response.data.dataValues,
                        notificationDet: notificationList
                    };
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return null;
                });
            } else {
                return { status: STATE.FAILED, erorr: null };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, erorr: err };
        }),
    // Save notification
    // @return added notification detail
    // removing transaction due to not getting updated list we require.
    saveNotificationFn: (req, notificationMst) => {
        // console.error("socket: saveNotificationFn");
        const { NotificationMst, NotificationDet, GenericCategory } = req.app.locals.models;
        notificationMst.refNotificationID = notificationMst.refNotificationID || null;
        // return sequelize.transaction().then((t) => {
        return GenericCategory.findOne({
            where: {
                categoryType: COMMON.CategoryType.NotificationCategory.Name,
                gencCategoryCode: notificationMst.messageType  // generic category code from constant
            },
            attributes: ['gencCategoryID']
        }).then((notiCatDetails) => {
            if (notificationMst.jsonData) {
                const notiJsonDataObj = JSON.parse(notificationMst.jsonData);
                if (notiJsonDataObj && _.isObject(notiJsonDataObj)) {
                    notiJsonDataObj['notificationCategoryID'] = notiCatDetails ? notiCatDetails.dataValues.gencCategoryID : null;
                    notificationMst.jsonData = JSON.stringify(notiJsonDataObj);
                }
                // else {
                //    let notiJsonDataObj = {
                //        notificationCategoryID: null
                //    };
                //    notificationMst.jsonData = JSON.stringify(notiJsonDataObj);
                // }
            } else {
                const notiJsonDataObj = {
                    notificationCategoryID: notiCatDetails ? notiCatDetails.dataValues.gencCategoryID : null
                };
                notificationMst.jsonData = JSON.stringify(notiJsonDataObj);
            }
            COMMON.setModelCreatedObjectFieldValue(req.user, notificationMst);

            return NotificationMst.create(notificationMst, {
                fields: saveNotMstFields
                // transaction: t
            }).then((notiMst) => {
                notificationMst.notificationDet.forEach((item) => {
                    item.notificationID = notiMst.id;
                    COMMON.setModelCreatedObjectFieldValue(req.user, item);
                    // item.createdBy = req.user.id;
                    // item.updatedBy = req.user.id;
                });
                return NotificationDet.bulkCreate(notificationMst.notificationDet, {
                    fields: saveNotDetFields
                    // transaction: t
                }).then(() =>
                    // t.commit();
                    ({ status: STATE.SUCCESS, data: notiMst })).catch((err) => {
                        console.trace();
                        console.error(err);
                        // if (!t.finished)
                        //     t.rollback();
                        return { status: STATE.FAILED, erorr: err };
                    });
            }).catch((err) => {
                console.trace();
                console.error(err);
                // if (!t.finished)
                //     t.rollback();
                return { status: STATE.FAILED, erorr: err };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            // if (!t.finished)
            //     t.rollback();
            return { status: STATE.FAILED, erorr: err };
        });
        // });
    },

    // Get notification detail object
    // @return notification detail object
    getNotificationDetObj: (senderID, receiverIDs) =>
        // console.error("socket: getNotificationDetObj");
        (receiverIDs || []).map(id => ({
            notificationID: null,
            receiverID: id,
            isRead: false,
            requestStatus: DATA_CONSTANT.NOTIFICATIONMST.REQUEST_STATUS.PENDING,
            isDeleted: false,
            createdBy: senderID
        })),
    // Get list notifications
    // @return list of notifications
    getNotificationListFn: (req, model) => {
        // console.error("socket: getNotificationListFn");
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetNotificationList (:pPageIndex, :pRecordPerPage,:pSortBy,:pReceiverID,:pNotificationID)',
                {
                    replacements: {
                        pPageIndex: model.pageIndex,
                        pRecordPerPage: model.recordPerPage,
                        pSortBy: model.sortBy,
                        pReceiverID: model.receiverID,
                        pNotificationID: model.notificationID
                    }
                })
            .then(notificationList => notificationList).catch((err) => {
                console.trace();
                console.error(err);
                return null;
            });
    },
    // Get work-order operation details
    // @return work-order opration details
    getWorkorderOperationDetails: (req, woID, opID) => {
        // console.error("socket: getWorkorderOperationDetails");
        const { Workorder, WorkorderOperation, Component } = req.app.locals.models;
        var promises = [];
        promises.push(Workorder.findOne({
            where: {
                woID: woID
            },
            attributes: ['woID', 'woNumber', 'woVersion'],
            include: [
                {
                    model: WorkorderOperation,
                    as: 'workorderOperation',
                    order: [['opNumber', 'ASC']],
                    attributes: ['opID', 'woOPID', 'opName', 'opNumber', 'opVersion']
                },
                {
                    model: Component,
                    as: 'componentAssembly',
                    attributes: ['id', 'PIDCode', 'mfgPN', 'nickName']
                }]
        }));

        // if (opID) {
        //     promises.push(WorkorderOperation.findOne({
        //         where: {
        //             woID: woID,
        //             opID: opID
        //         },
        //         attributes: ['woOPID', 'opName', 'opNumber', 'opVersion']
        //     }));
        // }

        return Promise.all(promises).then((resp) => {
            var woResp = resp[0];
            var woOPResp = {};
            // var woOPResp = resp[1];
            // get first operation of work order
            var firstwoOP = _.first(woResp.workorderOperation);
            var firstwoOPID = firstwoOP ? firstwoOP.woOPID : 0;

            if (opID) {
                // get operation by opID
                woOPResp = _.find(woResp.workorderOperation, wooperation => parseInt(wooperation.opID) === parseInt(opID));
            }

            return {
                woID: woResp ? woResp.woID : null,
                woNumber: woResp ? woResp.woNumber : null,
                revision: woResp ? woResp.revision : null,
                firstwoOPID: firstwoOPID,
                woVersion: woResp.woVersion,
                operation: woOPResp ? {
                    woOPID: woOPResp.woOPID,
                    opName: woOPResp.opName,
                    opNumber: woOPResp.opNumber,
                    opVersion: woOPResp.opVersion,
                    opID: woOPResp.opID
                } : null,
                componentAssyDet: {
                    id: woResp.componentAssembly.id,
                    PIDCode: woResp.componentAssembly.PIDCode,
                    mfgPN: woResp.componentAssembly.mfgPN,
                    nickName: woResp.componentAssembly.nickName
                }
            };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },

    // Get work-order operation employees
    // @return list of work-order operation employees
    getWOOPEmployees: (req, woOPID) => {
        // console.error("socket: getWOOPEmployees");
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
    // Get work-order employees
    // @return list of work-order employees
    getWOEmployees: (req, woID) => {
        // console.error("socket: getWOEmployees");
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployees (:woOPID, :woID, :opID)',
                {
                    replacements: {
                        woOPID: null,
                        woID: woID,
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

    // Get work-order all employees in which defined emp available
    // @return list of specific work-order employees
    getAllWOEmpListContainDefinedWOEmp: (req, woEmpID) => {
        // console.error("socket: getAllWOEmpListContainDefinedWOEmp");
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetAllWOEmpListContainWOEmpID (:pwoEmpID)',
                {
                    replacements: {
                        pwoEmpID: woEmpID
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
    // Send notification for work-order employee
    sendRestrictUMID: (req, data) => {
        // console.error("socket: sendWOOPUnHold");
        var notificationMst = {
            subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.UMID_RESTRICT.SUBJECT, req.body.restrictDetail.scanUMID, req.body.restrictDetail.PIDCode, req.body.restrictDetail.kitString),
            messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.UMID_RESTRICT.TYPE,
            messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.UMID_RESTRICT.SUBTYPE,
            jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.UMID_RESTRICT.JSONDATA(data),
            redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.UMID_RESTRICT.REDIRECTURL,
            isActive: true
        };

        module.exports.updateCommonDetails(notificationMst, data);
        return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
            if (resp && resp.notificationMst) {
                req.body.notificationMst = {
                    id: resp.notificationMst.id,
                    senderID: data.senderID
                };
            }

            req.body.subject = notificationMst.subject;
            NotificationSocketController.send(req, {
                data: {
                    event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.UMID_RESTRICT.TYPE,
                    data: req.body
                },
                receiver: data.receiver
            });
        });
    },
    // Send notification for equipment online
    sendEquipmentOnline: (req, data) => {
        // console.error("socket: sendEquipmentOnline");
        module.exports.getWorkorderOperationDetails(req, data.woID, data.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.SUBJECT, data.equipment.assetName),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.REDIRECTURL, data.woOPID),
                    isActive: true
                };

                // eslint-disable-next-line no-multi-assign
                data.message = notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.MESSAGE,
                    assyWOOPCommonInfo, data.equipment.assetName);
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }
                    req.body.subject = notificationMst.subject;
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_ONLINE.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send notification for equipment offline
    sendEquipmentOffline: (req, data) => {
        // console.error("socket: sendEquipmentOffline");
        module.exports.getWorkorderOperationDetails(req, data.woID, data.opID).then((workorder) => {
            if (workorder) {
                const assyWOOPCommonInfo = module.exports.setAssyWOOPCommonInfoForNotiMessage(workorder);
                module.exports.setAssyWOOPCommonInfoForNotiJsonData(data, workorder);

                const notificationMst = {
                    subject: data.subject || COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.SUBJECT, data.equipment.assetName),
                    messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.TYPE,
                    messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.SUBTYPE,
                    jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.JSONDATA(data),
                    redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.REDIRECTURL, data.woOPID),
                    isActive: true
                };

                // eslint-disable-next-line no-multi-assign
                data.message = notificationMst.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.MESSAGE,
                    assyWOOPCommonInfo, data.equipment.assetName);
                module.exports.updateCommonDetails(notificationMst, data);
                return module.exports.saveCommNotificationFn(req, notificationMst).then((resp) => {
                    if (resp && resp.notificationMst) {
                        req.body.notificationMst = {
                            id: resp.notificationMst.id,
                            senderID: data.senderID
                        };
                    }

                    req.body.subject = notificationMst.subject;
                    NotificationSocketController.send(req, {
                        data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EQUIPMENT_OFFLINE.TYPE, data: req.body },
                        receiver: data.receiver
                    });
                });
            } else {
                return STATE.FAILED;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // Get employee wise list of received notification
    // POST : /api/v1/notificationmst/getEmployeeWiseInboxNotificationList
    // @return list of notification
    getEmployeeWiseInboxNotificationList: (req, res) => {
        if (req.body && req.body.receiverID && req.body.pageIndex) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                // eslint-disable-next-line no-multi-str
                .query('CALL Sproc_GetEmpWiseInboxNotificationList (:ppageIndex, :precordPerPage, \
                                    :pOrderBy,:pWhereClause,:pReceiverID,:pisDisplayAllUserNotification,:psearchText, \
                                    :pnotificationCategoryIDForFilter,:pwoIDForFilter,:pwoOPIDForFilter,:popIDForFilter,:pnotiSenderIDForFilter, \
                                    :pfromDateRangeForFilter,:ptoDateRangeForFilter , \
                                    :passyIDForFilter,:psearchNickNameText)',
                    {
                        replacements: {
                            ppageIndex: req.body.pageIndex,
                            precordPerPage: req.body.recordPerPage,
                            pOrderBy: req.body.sortBy || null,
                            pWhereClause: null,
                            pReceiverID: req.body.receiverID,
                            pisDisplayAllUserNotification: req.body.isDisplayAllUserNotification ? req.body.isDisplayAllUserNotification : 0,
                            psearchText: req.body.searchText ? req.body.searchText.toString().replace(/'/g, '\'\'') : null,
                            pnotificationCategoryIDForFilter: req.body.notificationCategoryIDForFilter || null,
                            pwoIDForFilter: req.body.woIDForFilter || null,
                            pwoOPIDForFilter: req.body.woOPIDForFilter || null,
                            popIDForFilter: req.body.opIDForFilter || null,
                            pnotiSenderIDForFilter: req.body.notiSenderIDForFilter || null,
                            pfromDateRangeForFilter: req.body.fromDateRangeForFilter || null,
                            ptoDateRangeForFilter: req.body.toDateRangeForFilter || null,
                            passyIDForFilter: req.body.assyIDForFilter || null,
                            psearchNickNameText: req.body.searchNickNameText ? req.body.searchNickNameText.toString().replace(/'/g, '\'\'') : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
                    allNotifications: _.values(response[1]),
                    Count: response[0][0]['TotalRecord'],
                    totCountOfUnreadNotifications: response[2][0]['totCountOfUnreadNotifications']
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Get all notification that employee had already send
    // POST : /api/v1/notificationmst/getEmployeeWiseSendboxNotificationList
    // @return list of notification that employee had send
    getEmployeeWiseSendboxNotificationList: (req, res) => {
        if (req.body && req.body.senderID && req.body.pageIndex) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                // eslint-disable-next-line no-multi-str
                .query('CALL Sproc_GetEmpWiseSendboxNotificationList (:ppageIndex, :precordPerPage,\
                                    :pOrderBy,:pWhereClause,:pSenderID,:pisDisplayAllUserNotification,:psearchText ,\
                                    :pnotificationCategoryIDForFilter,:pwoIDForFilter,:pwoOPIDForFilter,:popIDForFilter,:pnotiReceiverIDForFilter, \
                                    :pfromDateRangeForFilter,:ptoDateRangeForFilter , \
                                    :passyIDForFilter,:psearchNickNameText)',
                    {
                        replacements: {
                            ppageIndex: req.body.pageIndex,
                            precordPerPage: req.body.recordPerPage,
                            pOrderBy: req.body.sortBy || null,
                            pWhereClause: null,
                            pSenderID: req.body.senderID,
                            pisDisplayAllUserNotification: req.body.isDisplayAllUserNotification ? req.body.isDisplayAllUserNotification : 0,
                            psearchText: req.body.searchText ? req.body.searchText.toString().replace(/'/g, '\'\'') : null,
                            pnotificationCategoryIDForFilter: req.body.notificationCategoryIDForFilter || null,
                            pwoIDForFilter: req.body.woIDForFilter || null,
                            pwoOPIDForFilter: req.body.woOPIDForFilter || null,
                            popIDForFilter: req.body.opIDForFilter || null,
                            pnotiReceiverIDForFilter: req.body.notiReceiverIDForFilter || null,
                            pfromDateRangeForFilter: req.body.fromDateRangeForFilter || null,
                            ptoDateRangeForFilter: req.body.toDateRangeForFilter || null,
                            passyIDForFilter: req.body.assyIDForFilter || null,
                            psearchNickNameText: req.body.searchNickNameText ? req.body.searchNickNameText.toString().replace(/'/g, '\'\'') : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, { allNotifications: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // update Notification As Read/unread
    // POST : /api/v1/notificationmst/updateNotificationAsRead
    // @return API Response
    updateNotificationAsReadUnread: (req, res) => {
        if (req.body && req.body.notificationdetMasterIDs && req.body.notificationdetMasterIDs.length > 0) {
            const { NotificationDet } = req.app.locals.models;
            COMMON.setModelUpdatedByFieldValue(req);

           return NotificationDet.update(req.body, {
                where: {
                    id: { [Op.in]: req.body.notificationdetMasterIDs }
                },
                fields: ['isRead', 'updatedAt', 'updatedBy']
            }).then(() => {
                // socket call to update count of read notification while any notification read by user
                NotificationSocketController.send(req, {
                    data: { event: DATA_CONSTANT.Socket_IO_Events.CommonNotification.ANY_NOTIFICATION_READ, data: null },
                    receiver: [req.user.employeeID]
                });

                if (req.body.isRequiredReturnMessage) {
                    const userMsg = COMMON.stringFormat(MESSAGE_CONSTANT.NOTIFICATIONMST.MARKED_AS_READ_UNREAD, req.body.isRead ? 'read' : 'unread');
                    return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: userMsg });
                } else {
                    return resHandler.successRes(res, 200, STATE.SUCCESS);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Get all receivers by defined sender notification
    // POST : /api/v1/notificationmst/getAllReceiversOfSenderNotification
    // @return list of notification that employee receive
    getAllReceiversOfSenderNotification: (req, res) => {
        if (req.body && req.body.notificationID) {
            const { sequelize } = req.app.locals.models;

           return sequelize
                .query('CALL Sproc_GetAllReceiversOfSenderNotification (:pnotificationID)',
                    {
                        replacements: {
                            pnotificationID: req.body.notificationID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, 200, STATE.SUCCESS, { allReceivers: _.values(response[0]) })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOTIFICATIONMST.NOT_FOUND));
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Send ack/message for work-order change request comment added
    sendWOChangeReqNewCommentAddedAck: (req, data) => {
        if (data && data.woRevReqID && data.receiver && data.receiver.length > 0) {
            NotificationSocketController.send(req, {
                data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.WO_REVIEW_COMMENT.TYPE, data: data },
                receiver: data.receiver
            });
        }
    },
    // socket call for remove employees from work-order change request review
    socketCallForRemoveEmpFromWoReqRev: (req, data) => {
        if (data && data.woRevReqID && data.receiver && data.receiver.length > 0) {
            NotificationSocketController.send(req, {
                data: { event: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.REMOVE_EMP_FROM_WO_REQ_REVIEW.TYPE, data: data },
                receiver: data.receiver
            });
        }
    },

    // common method to set Assy and WO info in notification title and description
    setAssyWOCommonInfoForNotiMessage: assyWOOPDet => `${COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.NotiAssyWODisplayFormat,
        assyWOOPDet.componentAssyDet.mfgPN, assyWOOPDet.componentAssyDet.PIDCode, assyWOOPDet.componentAssyDet.nickName)
        } ${COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.NotiWODisplayFormat, assyWOOPDet.woNumber, assyWOOPDet.woVersion)}`,

    // common method to set Assy, WO and WOOP info in notification title and description
    setAssyWOOPCommonInfoForNotiMessage: assyWOOPDet => `${module.exports.setAssyWOCommonInfoForNotiMessage(assyWOOPDet)
        } ${COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.NotiWOOPDisplayFormat,
            COMMON.convertToThreeDecimal(assyWOOPDet.operation.opNumber), assyWOOPDet.operation.opVersion)}`,

    // common method to set WOOP info in notification title and description
    setWOOPCommonInfoForNotiMessage: assyWOOPDet => COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.NotiWOOPDisplayFormat,
        COMMON.convertToThreeDecimal(assyWOOPDet.operation.opNumber), assyWOOPDet.operation.opVersion),

    // common method to set Assy and WO info in notification json data field
    setAssyWOCommonInfoForNotiJsonData: (dataObjForJson, assyWOOPDet) => {
        if (dataObjForJson) {
            dataObjForJson.woID = assyWOOPDet.woID;
            // dataObjForJson.woNumber = assyWOOPDet.woNumber;
            // dataObjForJson.woVersion = assyWOOPDet.woVersion;
            dataObjForJson.partID = assyWOOPDet.componentAssyDet.id;
            dataObjForJson.mfgPN = assyWOOPDet.componentAssyDet.mfgPN;
            dataObjForJson.PIDCode = assyWOOPDet.componentAssyDet.PIDCode;
            dataObjForJson.nickName = assyWOOPDet.componentAssyDet.nickName;
        }
    },

    // common method to set Assy, WO and WOOPID info in notification json data field
    setAssyWOOPCommonInfoForNotiJsonData: (dataObjForJson, assyWOOPDet) => {
        if (dataObjForJson) {
            module.exports.setAssyWOCommonInfoForNotiJsonData(dataObjForJson, assyWOOPDet);
            dataObjForJson.woOPID = assyWOOPDet.operation.woOPID;
            dataObjForJson.opID = assyWOOPDet.operation.opID;
        }
    },
    // Send notification to all admin users
    // POST : /api/v1/notificationmst/sendExceedLimitNotification
    sendExceedLimitNotification: (req) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            sequelize
                .query('CALL Sproc_GetAllReceiversOfRateLimitExceedNotification (:puserId)',
                    {
                        replacements: {
                            puserId: req.body.userID || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    const employeeList = _.values(response[0]);
                    const userDetail = _.values(response[1]);
                    if (employeeList.length > 0 && userDetail.length > 0) {
                        const objNotification = {
                            receiver: employeeList.map(x => x.employeeId),
                            supplier: req.body.Source,
                            applicationID: req.body.appID,
                            currentTime: userDetail[0].createdAt,
                            senderID: userDetail[0].employeeID,
                            userID: userDetail[0].id
                        };
                        module.exports.sendRateLimitExceeds(req, objNotification);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                });
        }
    },
    // Send notification for ECO department approval
    sendRateLimitExceeds: (req, data) => {
        var notificationMst = {
            subject: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.SUBJECT,
            messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.TYPE,
            messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.SUBTYPE,
            jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.JSONDATA(data),
            redirectUrl: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.REDIRECTURL,
            isActive: true
        };
        data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.MESSAGE,
            data.supplier, data.currentTime, data.applicationID);
        data.message = COMMON.stringFormat('{0} {1}', data.message, data.applicationID === DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJTV3 ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.MESSAGEPRICE :
            data.applicationID === DATA_CONSTANT.DIGIKEY_TYPE_ACC.FJTV3_BOM_CLEAN ? DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.MESSAGEBOM : DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.RATE_LIMIT_EXCEED.MESSAGEPART);
        req.user = {
            id: data.userID
        };
        module.exports.updateCommonDetails(notificationMst, data);
        module.exports.saveCommNotificationFn(req, notificationMst);
    },

    // Retrieve list wo halt resume notification and receivers
    // GET : /api/v1/getNotificationWithReceiversByTableRefID
    // @param {refTransID} int
    // @param {refTable} string
    // @param {notificationcategory} string
    // @return list of employee
    getNotificationWithReceiversByTableRefID: (req, res) => {
        if (req.body.notificationID || (req.body.refTransID && req.body.refTable && req.body.notificationCategory)) {
            const { sequelize } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

           return sequelize.query('CALL Sproc_GetNotificationWithReceiversByTableRefID (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prefTransID,:prefTable,:pnotificationCategory,:pnotificationID,:pwoID)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    prefTransID: req.body.refTransID,
                    prefTable: req.body.refTable,
                    pnotificationCategory: req.body.notificationCategory,
                    pnotificationID: req.body.notificationID || null,
                    pwoID: req.body.woID
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (!response || response.length === 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }

                const isSuccessResp = _.values(response[0]) && _.values(response[0]).length > 0 ? _.first(_.values(response[0])) : false;
                if (isSuccessResp && parseInt(isSuccessResp.issuccess) === 200) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        {
                            isNotificationMstDetExists: true,
                            Count: response[1][0]['TotalRecord'],
                            notiReceivers: _.values(response[2])
                        }, null);
                } else if (isSuccessResp && parseInt(isSuccessResp.issuccess) === 404) {
                    // when no any master notification found for halt/resume
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        {
                            isNotificationMstDetExists: false
                        }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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

    /* send socket call for redirect user to work order details page
    (case: "auto terminated" when user transfered all qty to revised WO) */
    socketCallForAutoTerminateWOOnTransfer: (req, socketCallData) => {
        NotificationSocketController.sendByType(DATA_CONSTANT.Socket_IO_Events.Traveler.Auto_Terminate_WO_On_Transfer, socketCallData);
    }

};