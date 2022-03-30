const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { InvalidPerameter, NotUpdate } = require('../../errors');

const timelineReqForReviewObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_REQFORREVIEW;
const timelineWoOpReqForReviewObj = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_REQFORREVIEW;
const workorderReqForReviewConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_REQFORREVIEW;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
const WorkOrderReqForReviewValuesController = require('../../workorder_reqforreview_values/controllers/Workorder_ReqForReview_ValuesController');

const saveFields = [
    'woID',
    'opID',
    'woOPID',
    'reqGenEmployeeID',
    'woAuthorID',
    'requestType',
    'changeType',
    'threadTitle',
    'description',
    'accRejStatus',
    'woRevnumber',
    'woOpRevNumber',
    'isDeleted',
    'createdAt',
    'createdBy',
    'updatedBy',
    'updatedAt'
];

const updateFields = [
    'changeType',
    'threadTitle',
    'description',
    'updatedBy',
    'updatedAt'
];

const woReqRevInvitedEmpFields = [
    'woRevReqID',
    'woID',
    'departmentID',
    'employeeID',
    'timeLine',
    'isCompulsory',
    'requestStatus',
    'requstedEmployeeID',
    'isDeleted',
    'createdAt',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'empRequestType'
];

const setStatusFields = [
    'accRejStatus',
    'accRejDate',
    'accRejBy',
    'updatedBy',
    'updatedAt'
];

module.exports = {
    // Get workorder operation details by woID and opID
    // GET : /api/v1/workorder_request_for_review/getWorkorderOperationDetails
    // @param {woID} int
    // @param {opID} int
    // @return workorder operation details
    getWorkorderOperationDetails: (req, res) => {
        const { WorkorderOperation, Workorder, User, Component, WorkorderSalesOrderDetails, SalesOrderDet, SalesOrderMst } = req.app.locals.models;
        WorkorderOperation.findOne({
            where: {
                woID: req.params.woID,
                opID: req.params.opID
            },
            attributes: ['woOPID', 'opVersion', 'opName', 'opNumber', 'woID'],
            include: [
                {
                    model: Workorder,
                    as: 'workorder',
                    attributes: ['createdBy', 'woNumber', 'woVersion'],
                    include: [
                        {
                            model: Component,
                            as: 'componentAssembly',
                            attributes: ['mfgPN', 'nickName']
                        },
                        {
                            model: WorkorderSalesOrderDetails,
                            as: 'WoSalesOrderDetails',
                            attributes: ['woSalesOrderDetID', 'partID', 'salesOrderDetailID', 'woID', 'qpa', 'parentPartID'],
                            require: false,
                            include: [{
                                model: SalesOrderDet,
                                as: 'SalesOrderDetails',
                                attributes: ['refSalesOrderID', 'partID'],
                                require: false,
                                include: [{
                                    model: SalesOrderMst,
                                    as: 'salesOrderMst',
                                    attributes: ['id', 'salesOrderNumber', 'poNumber'],
                                    require: false
                                }]
                            }]
                        }
                    ]
                }
            ]
        }).then((response) => {
            if (response && response.dataValues && response.workorder) {
                return User.findOne({
                    where: {
                        id: response.workorder.createdBy
                    },
                    attributes: ['employeeID']
                }).then((resp) => {
                    var model = {
                        woOPID: response.dataValues.woOPID,
                        opVersion: response.dataValues.opVersion,
                        opName: response.dataValues.opName,
                        opNumber: response.dataValues.opNumber,
                        workorder: response.workorder.dataValues
                    };
                    model.workorder.createdBy = resp.employeeID;
                    return resHandler.successRes(res, 200, STATE.SUCCESS, model);
                }).catch((err) => {
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
    },
    // Save change request
    // POST : /api/v1/workorder_request_for_review
    // @return API response
    saveChangeRequest: (req, res) => {
        const { WorkorderReqForReview, WorkorderReqRevInvitedEmp, sequelize, WorkOrderCoOwner } = req.app.locals.models;

        WorkOrderCoOwner.findAll({
            where: {
                woID: req.body.woID
            },
            attributes: ['employeeID']
        }).then((woCoOwnerList) => {
            if (req.body.woRevReqID) {
                COMMON.setModelUpdatedByFieldValue(req);
                req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                return sequelize.transaction().then(t => WorkorderReqForReview.update(req.body, {
                    where: {
                        woRevReqID: req.body.woRevReqID
                    },
                    fields: updateFields,
                    transaction: t
                }).then(() => WorkorderReqRevInvitedEmp.findAll({
                    where: { woRevReqID: req.body.woRevReqID },
                    transaction: t
                }).then((woReqRevInvitedEmp) => {
                    var newAddedTypes = [];
                    var deletedTypes = [];
                    var deletedEmpIDs = [];
                    var updatedTypes = [];

                    if (req.body.workorderReqRevInvitedEmp && req.body.workorderReqRevInvitedEmp.length) {
                        woReqRevInvitedEmp.forEach((item) => {
                            var typeObj = req.body.workorderReqRevInvitedEmp.find(x => x.employeeID === item.employeeID);
                            if (!typeObj) {
                                deletedTypes.push(item.woRevReqInvitedID);
                                deletedEmpIDs.push(item.employeeID);
                            } else { updatedTypes.push(typeObj); }
                        });

                        req.body.workorderReqRevInvitedEmp.forEach((item) => {
                            var typeObj = woReqRevInvitedEmp.find(x => x.employeeID === item.employeeID);
                            if (!typeObj) {
                                newAddedTypes.push({
                                    woRevReqID: req.body.woRevReqID,
                                    woID: req.body.woID,
                                    departmentID: null,
                                    employeeID: item.employeeID,
                                    timeLine: item.timeLine,
                                    isCompulsory: item.isCompulsory,
                                    requestStatus: DATA_CONSTANT.WORKORDER_REQREVINVITEDEMP.REQUEST_STATUS.PENDING,
                                    requstedEmployeeID: req.body.reqGenEmployeeID,
                                    isDeleted: false,
                                    createdBy: req.body.updatedBy,
                                    empRequestType: item.empRequestType
                                });
                            }
                        });
                    } else {
                        deletedTypes = woReqRevInvitedEmp.map(x => x.woRevReqInvitedID);
                        deletedEmpIDs = woReqRevInvitedEmp.map(x => x.employeeID);
                    }

                    const promises = [];

                    if (newAddedTypes.length) {
                        promises.push(WorkorderReqRevInvitedEmp.bulkCreate(newAddedTypes, {
                            fields: woReqRevInvitedEmpFields,
                            transaction: t
                        }));
                    }

                    if (deletedTypes.length) {
                        COMMON.setModelDeletedByFieldValue(req);
                        promises.push(WorkorderReqRevInvitedEmp.update({
                            deletedBy: req.body['deletedBy'],
                            deletedAt: req.body['deletedAt'],
                            isDeleted: req.body['isDeleted'],
                            updatedBy: req.body['updatedBy']
                        }, {
                            where: {
                                woRevReqInvitedID: deletedTypes,
                                deletedAt: null
                            },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                            transaction: t
                        }));
                    }

                    if (updatedTypes.length) {
                        updatedTypes.forEach((x) => {
                            COMMON.setModelUpdatedByFieldValue(req);
                            x.updatedBy = req.body.updatedBy;
                            promises.push(WorkorderReqRevInvitedEmp.update(x, {
                                fields: ['timeLine', 'isCompulsory', 'updatedBy'],
                                where: { woRevReqID: req.body.woRevReqID, employeeID: x.employeeID },
                                transaction: t
                            }));
                        });
                    }

                    Promise.all(promises).then(() => {
                        t.commit();


                        // [S] add log to update review request of work order operation
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: workorderReqForReviewConstObj.UPDATE_FOR_WO_OP.title,
                            eventDescription: COMMON.stringFormat(workorderReqForReviewConstObj.UPDATE_FOR_WO_OP.description, req.body.timelineObj.opName, req.body.timelineObj.woNumber, req.user.username),
                            refTransTable: workorderReqForReviewConstObj.refTransTableName,
                            refTransID: req.body.woRevReqID,
                            eventType: timelineWoOpReqForReviewObj.id,
                            url: COMMON.stringFormat(workorderReqForReviewConstObj.travelerUrl, req.body.woOPID, req.body.reqGenEmployeeID),
                            eventAction: timelineEventActionConstObj.UPDATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log to update review request of work order operation


                        resHandler.successRes(res, 200, STATE.SUCCESS, {
                            userMessage: MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_GENERATED
                        });

                        if (newAddedTypes.length) {
                            let notiReceiversForUpdateChangeReq = [];
                            if (woCoOwnerList && woCoOwnerList.length > 0) {
                                notiReceiversForUpdateChangeReq = _.unionBy(newAddedTypes, woCoOwnerList, 'employeeID');
                            }

                            const data = {
                                senderID: req.body.reqGenEmployeeID,
                                woID: req.body.woID,
                                opID: req.body.opID,
                                woOPID: req.body.woOPID,
                                woRevReqID: req.body.woRevReqID,
                                message: req.body.threadTitle,
                                changeType: req.body.changeType,
                                requestType: req.body.requestType,
                                // subject: req.body.threadTitle,
                                receiver: notiReceiversForUpdateChangeReq.map(x => x.employeeID)
                            };
                            NotificationMstController.sendWOChangeReviewInvitation(req, data);
                        }
                        if (deletedTypes.length && deletedEmpIDs.length) {
                            const data = {
                                woRevReqID: req.body.woRevReqID,
                                receiver: deletedEmpIDs
                            };
                            NotificationMstController.socketCallForRemoveEmpFromWoReqRev(req, data);
                        }

                        WorkOrderReqForReviewValuesController.addWorkorderReqForReviewValue(req);
                    }).catch((err) => {
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
                    t.rollback();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
            } else {
                req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                COMMON.setModelCreatedByFieldValue(req);

                return sequelize.transaction().then(t => WorkorderReqForReview.create(req.body, {
                    fields: saveFields,
                    transaction: t
                }).then((response) => {
                    if (!response) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }

                    const empList = [];
                    req.body.woRevReqID = response.woRevReqID;
                    req.body.workorderReqRevInvitedEmp.forEach((item) => {
                        empList.push({
                            woRevReqID: req.body.woRevReqID,
                            woID: response.woID,
                            departmentID: null,
                            employeeID: item.employeeID,
                            timeLine: item.timeLine,
                            isCompulsory: item.isCompulsory,
                            requestStatus: DATA_CONSTANT.WORKORDER_REQREVINVITEDEMP.REQUEST_STATUS.PENDING,
                            requstedEmployeeID: response.reqGenEmployeeID,
                            isDeleted: false,
                            createdBy: req.body.createdBy,
                            empRequestType: item.empRequestType
                        });
                    });

                    return WorkorderReqRevInvitedEmp.bulkCreate(empList, {
                        fields: woReqRevInvitedEmpFields,
                        transaction: t
                    }).then(() => {
                        t.commit();

                        // [S] add log for new review request of work order operation
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: workorderReqForReviewConstObj.CREATE_FOR_WO_OP.title,
                            eventDescription: COMMON.stringFormat(workorderReqForReviewConstObj.CREATE_FOR_WO_OP.description, req.body.timelineObj.opName, req.body.timelineObj.woNumber, req.user.username),
                            refTransTable: workorderReqForReviewConstObj.refTransTableName,
                            refTransID: req.body.woRevReqID,
                            eventType: timelineWoOpReqForReviewObj.id,
                            url: COMMON.stringFormat(workorderReqForReviewConstObj.travelerUrl, req.body.woOPID, req.body.workorderReqRevInvitedEmp[0].employeeID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log for review request of work order operation


                        resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_GENERATED, data: response });

                        let notiReceiversForChangeReqAdded = [];
                        if (woCoOwnerList && woCoOwnerList.length > 0) {
                            notiReceiversForChangeReqAdded = _.unionBy(empList, woCoOwnerList, 'employeeID');
                        }
                        const data = {
                            senderID: req.body.reqGenEmployeeID,
                            woID: req.body.woID,
                            opID: req.body.opID,
                            woOPID: response.woOPID,
                            woRevReqID: req.body.woRevReqID,
                            message: req.body.threadTitle,
                            changeType: req.body.changeType,
                            requestType: req.body.requestType,
                            // subject: req.body.threadTitle,
                            receiver: notiReceiversForChangeReqAdded.filter(x => x.employeeID !== req.body.reqGenEmployeeID).map(x => x.employeeID)
                        };
                        NotificationMstController.sendWOChangeReviewInvitation(req, data);

                        WorkOrderReqForReviewValuesController.addWorkorderReqForReviewValue(req);
                    }).catch((err) => {
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
                }));
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get default workorder review request for review by woID and empID or (woRevReqID)
    // GET : /api/v1/workorder_request_for_review/getDefaultWORevReqForReview
    // @param {woID} int
    // @param {empID} int
    // @param {woRevReqID} int
    // @return default workorder review request for review
    getDefaultWORevReqForReview: (req, res) => {
        const { sequelize } = req.app.locals.models;

        var woID = req.params.woID;
        var woRevReqID = req.params.woRevReqID;
        var empID = req.params.empID;

        sequelize
            .query('CALL Sproc_GetDefaultWORevReqForReview (:pEmpID, :pWOID, :pWORevReqID)',
                { replacements: { pEmpID: empID, pWOID: woID, pWORevReqID: woRevReqID || null } })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0]), null).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Get list of workorder review request for review by woID and empID
    // GET : /api/v1/workorder_request_for_review/getWORevReqForReviewList
    // @param {woID} int
    // @param {empID} int
    // @return list of workorder review request for review
    getWORevReqForReviewList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        var woID = req.params.woID;
        var empID = req.params.empID;

        return sequelize
            .query('CALL Sproc_GetWORevReqForReviewList (:pEmpID, :pWOID)',
                { replacements: { pEmpID: empID, pWOID: woID } })
            .then((response) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Get workorder request for review
    // GET : /api/v1/workorder_request_for_review
    // @param {woRevReqID} int
    // @return workorder request for review
    getWORequestForReviewByID: (req, res) => {
        const { WorkorderReqForReview, Employee } = req.app.locals.models;

        var woRevReqID = req.params.woRevReqID;

        WorkorderReqForReview.findOne({
            where: {
                woRevReqID: woRevReqID
            },
            attributes: ['woRevReqID', 'woID', 'reqGenEmployeeID', 'woAuthorID', 'requestType', 'threadTitle',
                'description', 'accRejStatus', 'accRejDate', 'accRejBy', 'woRevnumber', 'woOpRevNumber', 'createdAt', 'changeType'],
            include: [{
                model: Employee,
                as: 'reqGenEmployee',
                attributes: ['firstName', 'lastName', 'initialName']
            },
            {
                model: Employee,
                as: 'accRejEmployee',
                attributes: ['firstName', 'lastName', 'initialName']
            }
            ]
        }).then((response) => {
            response.description = COMMON.getTextAngularValueFromDB(response.description);
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Set status for workorder review request
    // POST : /api/v1/workorder_request_for_review/setWORevReqStatus
    // @return updated workorder review request status
    setWORevReqStatus: (req, res) => {
        const { WorkorderReqRevComments } = req.app.locals.models;

        WorkorderReqRevComments.count({
            where: {
                accRejStatus: DATA_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_STATUS.PENDING,
                woRevReqID: req.body.woRevReqID,
                commentemployeeID: { [Op.ne]: req.body.woAuthorID }
                // commentemployeeID: { [Op.ne]: req.body.accRejBy }
            }
        }).then((count) => {
            if (count === 0) {
                module.exports.updateWORevReqStatus(req).then((response) => {
                    if (response) {
                        resHandler.successRes(res, 200, STATE.SUCCESS, response);

                        module.exports.setReviewStatusNotification(req);
                    } else {
                        resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.STATUS_NOT_CHANGED));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                resHandler.successRes(res, 200, STATE.SUCCESS, { count: count });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Update workorder review request status
    // @return update workorder review request status
    updateWORevReqStatus: (req) => {
        const { WorkorderReqForReview } = req.app.locals.models;
        COMMON.setModelUpdatedByFieldValue(req);
        req.body.accRejDate = COMMON.getCurrentUTC();

        return WorkorderReqForReview.update(req.body, {
            where: { woRevReqID: req.body.woRevReqID },
            fields: setStatusFields
        }).then(() => {
            // [S] add log of updating status for review request for work order
            const objEvent = {
                userID: req.user.id,
                eventTitle: workorderReqForReviewConstObj.UPDATESTATUS.title,
                eventDescription: COMMON.stringFormat(workorderReqForReviewConstObj.UPDATESTATUS.description, req.body.woNumber, req.user.username),
                refTransTable: workorderReqForReviewConstObj.refTransTableName,
                refTransID: req.body.woRevReqID,
                eventType: timelineReqForReviewObj.id,
                url: COMMON.stringFormat(workorderReqForReviewConstObj.url, req.body.woID),
                eventAction: timelineEventActionConstObj.UPDATE
            };
            req.objEvent = objEvent;
            TimelineController.createTimeline(req);
            // [E] add log of updating status for review request for work order

            let message = null;
            if (req.body.accRejStatus === DATA_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_STATUS.ACCEPTED) { message = MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_ACCEPTED; } else { message = MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_REJECTED; }

            return { userMessage: message, data: req.body };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },
    // Get list of request for review by woID
    // POST : /api/v1/workorder_request_for_review/getRequestForReviewBywoID
    // @param {woID} int
    // @return list of request for review
    getRequestForReviewBywoID: (req, res) => {
        if (req.body.woID) {
            const { WorkorderReqForReview, sequelize, Employee, WorkorderReqRevInvitedEmp } = req.app.locals.models;
            const reqRevCommnetStatusConst = DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_STATUS;

            const whereClause = {
                woID: req.body.woID
            };
            if (req.body.reqForReviewStatus) {
                whereClause.accRejStatus = req.body.reqForReviewStatus;
            }

            return WorkorderReqForReview.findAll({
                where: whereClause,
                attributes: ['threadTitle', 'createdAt', 'accRejStatus', 'woID', 'opID', 'woOPID', 'woRevReqID', 'reqGenEmployeeID', 'woAuthorID',
                    [sequelize.literal(` EXISTS ( SELECT 1 FROM workorder_reqrevinvitedemp wrrie WHERE deletedAt IS NULL \
                                    AND wrrie.woRevReqID = WorkorderReqForReview.woRevReqID \
                                       AND wrrie.employeeID = "${req.user.employeeID}")`), 'isLoginUserInvitedForReview'],
                    // [sequelize.literal(' ( SELECT COUNT(*) FROM workorder_reqrevinvitedemp wrrie WHERE deletedAt IS NULL \
                    //                AND wrrie.woRevReqID = WorkorderReqForReview.woRevReqID )'), 'totalInvitedMembersForReview'],
                    [sequelize.literal(` ( SELECT COUNT(*) FROM workorder_reqrevcomments wrrc WHERE deletedAt IS NULL \
                                    AND wrrc.woRevReqID = WorkorderReqForReview.woRevReqID \
                                    AND wrrc.commentemployeeID != WorkorderReqForReview.woAuthorID \
                                    AND wrrc.accRejStatus = "${reqRevCommnetStatusConst.PENDING}")`), 'totalPendingComment']
                    // [sequelize.literal(' ( SELECT COUNT(*) FROM workorder_reqrevcomments wrrc WHERE deletedAt IS NULL \
                    //                AND wrrc.woRevReqID = WorkorderReqForReview.woRevReqID \
                    //                AND wrrc.accRejStatus = "'+ reqRevCommnetStatusConst.ACCEPTED + '")'), 'totalAcceptedComment'],
                    // [sequelize.literal(' ( SELECT COUNT(*) FROM workorder_reqrevcomments wrrc WHERE deletedAt IS NULL \
                    //                AND wrrc.woRevReqID = WorkorderReqForReview.woRevReqID \
                    //                AND wrrc.accRejStatus = "'+ reqRevCommnetStatusConst.REJECTED + '")'), 'totalRejectedComment']
                ],
                include: [{
                    model: Employee,
                    as: 'reqGenEmployee',
                    attributes: ['firstName', 'lastName', 'initialName'],
                    required: false
                },
                {
                    model: WorkorderReqRevInvitedEmp,
                    as: 'workorderReqRevInvitedEmp',
                    attributes: ['employeeID'],
                    required: false
                }
                ]
            }).then((response) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, response);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Set review status notification
    setReviewStatusNotification: (req) => {
        // eslint-disable-next-line consistent-return
        module.exports.getWORevReqEmployees(req, req.body.woRevReqID, req.body.accRejBy).then((response) => {
            if (response) {
                const { WorkOrderCoOwner } = req.app.locals.models;
                return WorkOrderCoOwner.findAll({
                    where: {
                        woID: req.body.woID
                    },
                    attributes: ['employeeID']
                }).then((woCoOwnerList) => {
                    if (woCoOwnerList && woCoOwnerList.length > 0) {
                        response = _.unionBy(response, woCoOwnerList, 'employeeID');
                    }

                    const data = {
                        senderID: req.body.accRejBy,
                        woID: req.body.woID,
                        opID: null,
                        woOPID: null,
                        woRevReqID: req.body.woRevReqID,
                        message: null,
                        accRejStatus: req.body.accRejStatus,
                        // subject: req.body.threadTitle,
                        receiver: response.filter(x => x.employeeID !== req.body.accRejBy).map(x => x.employeeID)
                    };
                    NotificationMstController.sendWOReviewStatus(req, data);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
        });
    },
    // Get list of workorder review request employee by worwoRevReqID and employeeID
    // @param {woRevReqID} int
    // @param {employeeID} int
    // @return list of workorder review request employee
    getWORevReqEmployees: (req, woRevReqID, employeeID) => {
        const { WorkorderReqRevInvitedEmp } = req.app.locals.models;

        return WorkorderReqRevInvitedEmp.findAll({
            where: {
                woRevReqID: woRevReqID,
                employeeID: { [Op.ne]: employeeID }
            },
            attributes: ['employeeID']
        }).then(response => response).catch((err) => {
            console.trace();
            console.error(err);
            return null;
        });
    },
    // Get initial Draft Req and invited employee for workorder review
    // POST : /api/v1/workorder_request_for_review/getInitialDraftWOReviewReq
    // @return invited employee for workorder review
    getInitialDraftWOReviewReq: (req, res) => {
        if (req.body.woID && req.body.requestType) {
            const { WorkorderReqForReview, WorkorderReqRevInvitedEmp } = req.app.locals.models;

            return WorkorderReqForReview.findOne({
                where: {
                    woID: req.body.woID,
                    requestType: req.body.requestType
                },
                attributes: ['woRevReqID', 'threadTitle', 'reqGenEmployeeID', 'woID', 'accRejStatus', 'accRejDate', 'requestType', 'changeType'],
                include: [{
                    model: WorkorderReqRevInvitedEmp,
                    as: 'workorderReqRevInvitedEmp',
                    attributes: ['woRevReqInvitedID', 'woRevReqID', 'woID', 'departmentID', 'employeeID', 'timeLine', 'isCompulsory', 'requestStatus', 'requstedEmployeeID'],
                    required: false
                }]
            }).then((initialDraftReqDesc) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, initialDraftReqDesc);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }
};