const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotUpdate } = require('../../errors');

const timelineReqForReviewObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_REQFORREVIEW;
const workorderReqForReviewConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_REQFORREVIEW;
const timelineReqRevInvitedEmpObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_REQREVINVITEDEMP;
const workorderReqRevInvitedEmpConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_REQREVINVITEDEMP;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
const TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const woReqRevModuleName = DATA_CONSTANT.WORKORDER_REQFORREVIEW.NAME;
const woRevReqCommModuleName = DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.NAME;
const woCoOwnerName = DATA_CONSTANT.WORKORDER_COOWNER.NAME;
const saveFields = [
    'woID',
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
    'updatedAt'
];

module.exports = {
    // Get invited employee for workorder review
    // POST : /api/v1/workorder_ReqRev_Invited_Emp/getInvitedEmployeeForWorkorderReview
    // @return invited employee for workorder review
    getInvitedEmployeeForWorkorderReview: (req, res) => {
        const { WorkorderReqForReview, WorkorderReqRevInvitedEmp } = req.app.locals.models;
        if (req.body) {
            WorkorderReqForReview.findOne({
                where: {
                    woRevReqID: req.body.woRevReqID
                },
                attributes: ['woRevReqID', 'threadTitle', 'reqGenEmployeeID', 'woID', 'accRejStatus', 'accRejDate', 'requestType', 'changeType'],
                include: [{
                    model: WorkorderReqRevInvitedEmp,
                    as: 'workorderReqRevInvitedEmp',
                    attributes: ['woRevReqInvitedID', 'woRevReqID', 'woID', 'departmentID', 'employeeID', 'timeLine', 'isCompulsory', 'requestStatus', 'requstedEmployeeID'],
                    required: false
                }]
            }).then(invitedEmp => resHandler.successRes(res, 200, STATE.SUCCESS, invitedEmp)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, null);
            });
        }
    },

    // get all employee list which has access rights to defined page route
    getEmpListOfPageRouteAccess: (req, data) => {
        const { sequelize } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_GetEmpListOfPageRouteAccess (:ppageRoute)',
                {
                    replacements: {
                        ppageRoute: data.woInviteReqRevEmpPageRoute
                    }
                });
    },

    // Invite employee for workorder review
    // POST : /api/v1/workorder_ReqRev_Invited_Emp/inviteEmployeeForWorkorderReview
    // @return API response
    inviteEmployeeForWorkorderReview: (req, res) => {
        const { WorkorderReqForReview, WorkorderReqRevInvitedEmp, sequelize } = req.app.locals.models;

        const getSetDataPromise = [];
        // get all emp which has wo invite people rights for socket call to refresh screen
        if (req.body.woInviteReqRevEmpPageRoute) {
            const userAccessData = {
                woInviteReqRevEmpPageRoute: req.body.woInviteReqRevEmpPageRoute
            };
            getSetDataPromise.push(module.exports.getEmpListOfPageRouteAccess(req, userAccessData));
        }
        Promise.all(getSetDataPromise).then((respOfGetSetDataPromise) => {
            let empListOfPageRouteAccess = [];
            if (respOfGetSetDataPromise && respOfGetSetDataPromise[0] && respOfGetSetDataPromise[0].length > 0) {
                empListOfPageRouteAccess = respOfGetSetDataPromise[0];
                _.remove(empListOfPageRouteAccess, empItem => empItem.employeeID === req.user.employeeID);
            }

            if (req.body.woRevReqID) {
                COMMON.setModelUpdatedByFieldValue(req);

                return sequelize.transaction().then(t => WorkorderReqForReview.update(req.body, {
                    where: {
                        woRevReqID: req.body.woRevReqID
                    },
                    fields: updateFields,
                    transaction: t
                }).then(() => {
                    // [S] add log to update review request of work order
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: workorderReqForReviewConstObj.UPDATE.title,
                        eventDescription: COMMON.stringFormat(workorderReqForReviewConstObj.UPDATE.description, req.body.woNumber, req.user.username),
                        refTransTable: workorderReqForReviewConstObj.refTransTableName,
                        refTransID: req.body.woRevReqID,
                        eventType: timelineReqForReviewObj.id,
                        url: COMMON.stringFormat(workorderReqForReviewConstObj.url, req.body.woID),
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log to update review request of work order

                    return WorkorderReqRevInvitedEmp.findAll({
                        where: { woRevReqID: req.body.woRevReqID },
                        transaction: t
                    }).then((woReqRevInvitedEmp) => {
                        var newAddedTypes = [];
                        var deletedTypes = [];
                        var updatedTypes = [];

                        if (req.body.workorderReqRevInvitedEmp && req.body.workorderReqRevInvitedEmp.length) {
                            // check existing db invited person exits or deleted
                            woReqRevInvitedEmp.forEach((item) => {
                                var typeObj = req.body.workorderReqRevInvitedEmp.find(x => x.employeeID === item.employeeID);
                                if (!typeObj) {
                                    // add new condition for check current user in invite list
                                    // let isInvited = item.employeeID == req.user.employeeID;
                                    // if (!isInvited)
                                    deletedTypes.push(item.woRevReqInvitedID);
                                    // else
                                    //    updatedTypes.push(item.dataValues);
                                } else {
                                    updatedTypes.push(typeObj);
                                }
                            });

                            // check for added new invited person list
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
                                        createdBy: req.user.id
                                    });
                                }
                            });
                        } else {
                            deletedTypes = woReqRevInvitedEmp.map(x => x.woRevReqInvitedID);
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
                            COMMON.setModelUpdatedByFieldValue(req);
                            updatedTypes.forEach((x) => {
                                x.updatedBy = req.body.updatedBy;
                                promises.push(WorkorderReqRevInvitedEmp.update(x, {
                                    fields: ['timeLine', 'isCompulsory', 'updatedBy', 'updatedAt'],
                                    where: { woRevReqID: req.body.woRevReqID, employeeID: x.employeeID },
                                    transaction: t
                                }));
                            });
                        }

                        Promise.all(promises).then(() => {
                            t.commit();
                            resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_GENERATED });

                            if (newAddedTypes.length) {
                                // [S] add log to invite employee for review work order
                                const objCreateEmpEvent = {
                                    userID: req.user.id,
                                    eventTitle: workorderReqRevInvitedEmpConstObj.CREATE.title,
                                    eventDescription: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.CREATE.description, req.body.woNumber, req.user.username),
                                    refTransTable: workorderReqRevInvitedEmpConstObj.refTransTableName,
                                    refTransID: null,
                                    eventType: timelineReqRevInvitedEmpObj.id,
                                    url: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.url, req.body.woID),
                                    eventAction: timelineEventActionConstObj.CREATE
                                };
                                req.objEvent = objCreateEmpEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log to invite employee for review work order

                                const data = {
                                    senderID: req.body.reqGenEmployeeID,
                                    woID: req.body.woID,
                                    opID: req.body.opID,
                                    woOPID: req.body.woOPID,
                                    woRevReqID: req.body.woRevReqID,
                                    // message: req.body.threadTitle,
                                    changeType: req.body.changeType,
                                    requestType: req.body.requestType,
                                    // subject: req.body.threadTitle,
                                    receiver: (newAddedTypes).map(x => x.employeeID)
                                };
                                if (data.receiver && data.receiver.length > 0) {
                                    NotificationMstController.sendWOReviewInvitation(req, data);
                                }
                            }

                            if (updatedTypes.length) {
                                // [S] add log to update invited employee for review work order
                                const objUpdateEmpEvent = {
                                    userID: req.user.id,
                                    eventTitle: workorderReqRevInvitedEmpConstObj.UPDATE.title,
                                    eventDescription: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.UPDATE.description, req.body.woNumber, req.user.username),
                                    refTransTable: workorderReqRevInvitedEmpConstObj.refTransTableName,
                                    refTransID: _.map(updatedTypes, 'woRevReqInvitedID').join(),
                                    eventType: timelineReqRevInvitedEmpObj.id,
                                    url: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.url, req.body.woID),
                                    eventAction: timelineEventActionConstObj.UPDATE
                                };
                                req.objEvent = objUpdateEmpEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log to update invited employee for review work order
                            }

                            if (deletedTypes.length) {
                                // [S] add log to delete invited employee for review work order
                                const objDeleteEmpEvent = {
                                    userID: req.user.id,
                                    eventTitle: workorderReqRevInvitedEmpConstObj.DELETE.title,
                                    eventDescription: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.DELETE.description, req.body.woNumber, req.user.username),
                                    refTransTable: workorderReqRevInvitedEmpConstObj.refTransTableName,
                                    refTransID: deletedTypes.toString(),
                                    eventType: timelineReqRevInvitedEmpObj.id,
                                    url: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.url, req.body.woID),
                                    eventAction: timelineEventActionConstObj.DELETE
                                };
                                req.objEvent = objDeleteEmpEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log to delete invited employee for review work order
                            }

                            // update socket call for all users to refresh screen
                            if (empListOfPageRouteAccess && empListOfPageRouteAccess.length > 0) {
                                const socketCallData = {
                                    empListOfPageRouteAccess: empListOfPageRouteAccess.map(x => x.employeeID)
                                };
                                NotificationMstController.socketCallForWOReviewInvitationChange(req, socketCallData);
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(woRevReqCommModuleName)));
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.NOT_FOUND));
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(woReqRevModuleName)));
                }));
            } else {
                COMMON.setModelCreatedByFieldValue(req);

                return sequelize.transaction().then(t => WorkorderReqForReview.create(req.body, {
                    fields: saveFields,
                    transaction: t
                }).then((response) => {
                    // [S] add log to review request of work order
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: workorderReqForReviewConstObj.CREATE.title,
                        eventDescription: COMMON.stringFormat(workorderReqForReviewConstObj.CREATE.description, req.body.woNumber, req.user.username),
                        refTransTable: workorderReqForReviewConstObj.refTransTableName,
                        refTransID: response.woRevReqID,
                        eventType: timelineReqForReviewObj.id,
                        url: COMMON.stringFormat(workorderReqForReviewConstObj.url, req.body.woID),
                        eventAction: timelineEventActionConstObj.CREATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log to review request of work order

                    const empList = [];
                    req.body.workorderReqRevInvitedEmp.forEach((item) => {
                        empList.push({
                            woRevReqID: response.woRevReqID,
                            woID: response.woID,
                            departmentID: null,
                            employeeID: item.employeeID,
                            timeLine: item.timeLine,
                            isCompulsory: item.isCompulsory,
                            requestStatus: DATA_CONSTANT.WORKORDER_REQREVINVITEDEMP.REQUEST_STATUS.PENDING,
                            requstedEmployeeID: response.reqGenEmployeeID,
                            isDeleted: false,
                            createdBy: req.user.id
                        });
                    });

                    return WorkorderReqRevInvitedEmp.bulkCreate(empList, {
                        fields: woReqRevInvitedEmpFields,
                        transaction: t
                    }).then(() => {
                        t.commit();

                        // [S] add log to invite employee for review work order
                        const objEventDet = {
                            userID: req.user.id,
                            eventTitle: workorderReqRevInvitedEmpConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.CREATE.description, req.body.woNumber, req.user.username),
                            refTransTable: workorderReqRevInvitedEmpConstObj.refTransTableName,
                            refTransID: null,
                            eventType: timelineReqRevInvitedEmpObj.id,
                            url: COMMON.stringFormat(workorderReqRevInvitedEmpConstObj.url, req.body.woID),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEventDet;
                        TimelineController.createTimeline(req);
                        // [E] add log to invite employee for review work order

                        resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_REQFORREVIEW.REQUEST_GENERATED, data: response });

                        const data = {
                            senderID: req.body.reqGenEmployeeID,
                            woID: req.body.woID,
                            opID: req.body.opID,
                            woOPID: response.woOPID,
                            woRevReqID: response.woRevReqID,
                            // message: req.body.threadTitle,
                            changeType: req.body.changeType,
                            requestType: req.body.requestType,
                            receiver: (_.filter(empList, type => type.employeeID !== req.body.reqGenEmployeeID)).map(x => x.employeeID)
                        };
                        if (data.receiver && data.receiver.length > 0) {
                            NotificationMstController.sendWOReviewInvitation(req, data);

                            // update socket call for all users to refresh screen
                            const socketCallData = {
                                empListOfPageRouteAccess: empListOfPageRouteAccess.map(x => x.employeeID)
                            };
                            NotificationMstController.socketCallForWOReviewInvitationChange(req, socketCallData);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_CREATED(woReqRevModuleName)));
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_CREATED(woReqRevModuleName)));
                }));
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get list request review invited employee
    // GET : /api/v1/workorder_ReqRev_Invited_Emp/getReqRevInvitedEmpList
    // @return list request review invited employee
    getReqRevInvitedEmpList: (req, res) => {
        const { WorkorderReqRevInvitedEmp, Employee } = req.app.locals.models;

        WorkorderReqRevInvitedEmp.findAll({
            where: {
                woRevReqID: req.params.woRevReqID
            },
            attributes: ['woRevReqInvitedID', 'employeeID', 'createdAt'],
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['firstName', 'lastName', 'initialName']
            }]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get list owner and co owner
    // GET : /api/v1/workorder_ReqRev_Invited_Emp/getCoOwnerEmpList
    // @return list request co owner employee list
    getCoOwnerEmpList: (req, res) => {
        const { WorkOrderCoOwner, Employee } = req.app.locals.models;
        WorkOrderCoOwner.findAll({
            where: {
                woID: req.params.woID
            },
            attributes: ['coOwnerID', 'woID', 'employeeID', 'createdAt'],
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['firstName', 'lastName', 'initialName']
            }]
        }).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, response)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, null);
        });
    },
    // Save co owner employee list
    // GET : /api/v1/workorder_ReqRev_Invited_Emp/saveCoOwnerEmployeeDetail
    // @return saved list of co owner
    saveCoOwnerEmployeeDetail: (req, res) => {
        const { WorkOrderCoOwner, sequelize } = req.app.locals.models;
        if (req.body) {
            const woID = req.body.objCoOwner.woID;
            const coownerList = req.body.objCoOwner.coOwnerList;
            const employeeID = req.body.objCoOwner.employeeID;
            return sequelize.transaction().then((t) => {
                WorkOrderCoOwner.findAll({
                    where: {
                        woID: woID,
                        isDeleted: false
                    },
                    attributes: ['coOwnerID', 'woID', 'employeeID']
                }).then((response) => {
                    if (response) {
                        const newcoOwnerIds = _.map(coownerList, 'coOwnerID');
                        const saveCoownerIds = _.map(response, 'coOwnerID');
                        const removecoOwnerIds = _.difference(saveCoownerIds, newcoOwnerIds);
                        const addcoOwners = _.filter(coownerList, lst => !lst.coOwnerID);
                        const coownerPromise = [];
                        // add new co owners
                        _.each(addcoOwners, (item) => {
                            const objAddNewCoOwner = {
                                woID: woID,
                                employeeID: item.id,
                                createdBy: req.user.id,
                                updatedBy: req.user.id
                            };
                            coownerPromise.push(WorkOrderCoOwner.create(objAddNewCoOwner, {
                                fields: ['woID', 'employeeID', 'createdBy', 'updatedBy'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                        });
                        // remove co owner
                        const objRemoveCoOwner = {
                            deletedBy: req.user.id,
                            deletedAt: COMMON.getCurrentUTC(),
                            updatedBy: req.user.id
                        };
                        coownerPromise.push(
                            WorkOrderCoOwner.update(objRemoveCoOwner, {
                                where: {
                                    coOwnerID: { [Op.in]: removecoOwnerIds },
                                    isDeleted: false
                                },
                                fields: ['isDeleted', 'deletedBy', 'deletedAt'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            })
                        );
                        return Promise.all(coownerPromise).then((resp) => {
                            if (_.find(resp, status => status === STATE.FAILED)) {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_ADDED(woCoOwnerName)));
                            } else {
                                return t.commit().then(() => {
                                    const getSetDataPromise = [];
                                    // get all emp which has wo invite people rights for socket call to refresh screen
                                    if (req.body.objCoOwner.woInviteReqRevEmpPageRoute) {
                                        const userAccessData = {
                                            woInviteReqRevEmpPageRoute: req.body.objCoOwner.woInviteReqRevEmpPageRoute
                                        };
                                        getSetDataPromise.push(module.exports.getEmpListOfPageRouteAccess(req, userAccessData));
                                    }
                                    return Promise.all(getSetDataPromise).then((respOfGetSetDataPromise) => {
                                        let empListOfPageRouteAccess = [];
                                        if (respOfGetSetDataPromise && respOfGetSetDataPromise[0] && respOfGetSetDataPromise[0].length > 0) {
                                            empListOfPageRouteAccess = respOfGetSetDataPromise[0];
                                            _.remove(empListOfPageRouteAccess, empItem => empItem.employeeID === req.user.employeeID);
                                        }

                                        if (addcoOwners.length > 0) {
                                            const addData = {
                                                senderID: employeeID,
                                                woID: woID,
                                                receiver: (addcoOwners).map(x => x.id)
                                            };
                                            if (req.user.employeeID !== req.body.objCoOwner.woAuthorID) {
                                                addData.receiver.push(req.body.objCoOwner.woAuthorID);
                                            }
                                            NotificationMstController.sendWOReviewOwnership(req, addData);
                                        }
                                        if (removecoOwnerIds.length > 0) {
                                            const newcoOwnerEmp = _.map(coownerList, 'id');
                                            const saveCoowneremp = _.map(response, 'employeeID');
                                            const removecoOwnerEmps = _.difference(saveCoowneremp, newcoOwnerEmp);
                                            const removeData = {
                                                senderID: employeeID,
                                                woID: woID,
                                                receiver: removecoOwnerEmps
                                            };
                                            if (req.user.employeeID !== req.body.objCoOwner.woAuthorID) {
                                                removeData.receiver.push(req.body.objCoOwner.woAuthorID);
                                            }
                                            NotificationMstController.sendWOReviewOwnershipRemoveRequest(req, removeData);
                                        }

                                        // update socket call for all users to refresh screen
                                        if (empListOfPageRouteAccess && empListOfPageRouteAccess.length > 0) {
                                            const socketCallData = {
                                                empListOfPageRouteAccess: empListOfPageRouteAccess.map(x => x.employeeID)
                                            };
                                            NotificationMstController.socketCallForWOReviewCoOwnerChange(req, socketCallData);
                                        }
                                        return resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(woCoOwnerName));
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                });
                            }
                        });
                    } else {
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(woRevReqCommModuleName)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, null);
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};