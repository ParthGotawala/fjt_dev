const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotUpdate } = require('../../errors');

const timelineReqRevCommentsObj = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_REQREVCOMMENTS;
const workorderReqRevCommentsConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_REQREVCOMMENTS;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

// const woRevReqCommModuleName = DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.NAME;

const saveCommentFields = [
    'woRevReqID',
    'woID',
    'commentemployeeID',
    'commentDate',
    'description',
    'accRejStatus',
    'createdAt',
    'createdBy',
    'isDeleted'
];

const setStatusFields = [
    'accRejStatus',
    'accRejDate',
    'accRejBy',
    'updatedBy',
    'updatedAt'
];

module.exports = {
    // Save workorder review request comment
    // POST : /api/v1/workorder_reqrev_comments/saveWorkorderRevReqComments
    // @return new added workorder review request comment
    saveWorkorderRevReqComments: (req, res) => {
        const { WorkorderReqRevComments, sequelize } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);
        const saveReqRevCommPromise = [];
        req.body.commentDate = COMMON.getCurrentUTC();
        req.body.accRejStatus = DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_STATUS.PENDING;
        req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
        return sequelize.transaction().then(t => WorkorderReqRevComments.create(req.body, {
            fields: saveCommentFields,
            transaction: t
        }).then((response) => {
            if (response && typeof (response) === 'object') {
                req.params['pId'] = response.woRevReqcommID;
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageChangeRequestInElastic);
            }
            // [S] add log of adding review comments for work order
            const objEvent = {
                userID: req.user.id,
                eventTitle: workorderReqRevCommentsConstObj.CREATE.title,
                eventDescription: COMMON.stringFormat(workorderReqRevCommentsConstObj.CREATE.description, req.body.woNumber, req.user.username),
                refTransTable: workorderReqRevCommentsConstObj.refTransTableName,
                refTransID: response.woRevReqcommID,
                eventType: timelineReqRevCommentsObj.id,
                url: COMMON.stringFormat(workorderReqRevCommentsConstObj.CREATE.url, req.body.woID),
                eventAction: timelineEventActionConstObj.CREATE
            };
            req.objEvent = objEvent;
            saveReqRevCommPromise.push(TimelineController.createTimeline(req, res, t));
            // [E] add log of adding review comments for work order

            return Promise.all(saveReqRevCommPromise).then(() => t.commit().then(() => module.exports.getWorkorderRevReqCommentByID(req, response.woRevReqID, response.woRevReqcommID).then((data) => {
                // send notification to all users
                module.exports.sendCommentNotification(req, response);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: data }, MESSAGE_CONSTANT.MFG.WORKORDER_REQREVCOMMENTS_REQUEST_GENERATED);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }))
            );
        }).catch((err) => {
            console.trace();
            console.error(err);
            t.rollback();
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        })
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get list of workorder review request comments
    // POST : /api/v1/workorder_reqrev_comments/getWorkorderRevReqComments
    // @return list of workorder review request comments
    getWorkorderRevReqComments: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const woRevReqID = req.body.woRevReqID;
            const pageIndex = req.body.pageIndex;
            const recordPerPage = req.body.recordPerPage;
            const status = req.body.status;
            const sortBy = req.body.sortBy;
            const sortByOrder = req.body.sortByOrder;
            const reviewBy = req.body.reviewBy;
            return sequelize
                .query('CALL Sproc_GetWOReqRevComments (:pWORevReqcommID, :pWORevReqID, :pPageIndex, :pRecordPerPage, :pStatus, :pSortBy, :pSortByOrder, :pCommentBy)',
                    {
                        replacements: {
                            pWORevReqcommID: null,
                            pWORevReqID: woRevReqID,
                            pPageIndex: pageIndex,
                            pRecordPerPage: recordPerPage,
                            pStatus: status || null,
                            pSortBy: sortBy || null,
                            pSortByOrder: sortByOrder || null,
                            pCommentBy: reviewBy || null
                        }
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get list of workorder review request comments
    // @return list of workorder review request comments by woRevReqID and woRevReqcommID
    // @param {woRevReqID} int
    // @param {woRevReqcommID} int
    // @return list of workorder review request comments
    getWorkorderRevReqCommentByID: (req, woRevReqID, woRevReqcommID) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWOReqRevComments (:pWORevReqcommID, :pWORevReqID, :pPageIndex, :pRecordPerPage, :pStatus, :pSortBy, :pSortByOrder, :pCommentBy)',
                {
                    replacements: {
                        pWORevReqcommID: woRevReqcommID,
                        pWORevReqID: woRevReqID,
                        pPageIndex: 1,
                        pRecordPerPage: 1,
                        pStatus: null,
                        pSortBy: null,
                        pSortByOrder: null,
                        pCommentBy: null
                    }
                })
            .then(response => response[0]).catch((err) => {
                console.trace();
                console.error(err);
                return null;
            });
    },
    // Set workorder review request comment status
    // POST : /api/v1/workorder_reqrev_comments/setWORevReqCommentStatus
    // @return updated workorder review request comment detail
    setWORevReqCommentStatus: (req, res) => {
        const { WorkorderReqRevComments, sequelize } = req.app.locals.models;
        const woReqRevCommentPromise = [];
        COMMON.setModelUpdatedByFieldValue(req);

        req.body.accRejDate = COMMON.getCurrentUTC();

        if (req.body) {
            return sequelize.transaction().then(t => WorkorderReqRevComments.update(req.body, {
                where: { woRevReqcommID: req.body.woRevReqcommID },
                fields: setStatusFields,
                transaction: t
            }).then(() => {
                req.params['pId'] = req.body.woRevReqcommID;
                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageChangeRequestInElastic);

                // [S] add log of updating status for review comments for work order
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: workorderReqRevCommentsConstObj.UPDATESTATUS.title,
                    eventDescription: COMMON.stringFormat(workorderReqRevCommentsConstObj.UPDATESTATUS.description, req.body.woNumber, req.user.username),
                    refTransTable: workorderReqRevCommentsConstObj.refTransTableName,
                    refTransID: req.body.woRevReqcommID,
                    eventType: timelineReqRevCommentsObj.id,
                    url: COMMON.stringFormat(workorderReqRevCommentsConstObj.UPDATESTATUS.url, req.body.woID),
                    eventAction: timelineEventActionConstObj.UPDATE
                };
                req.objEvent = objEvent;
                woReqRevCommentPromise.push(TimelineController.createTimeline(req, res, t));
                // [E] add log of updating status for review comments for work order

                let message = null;
                if (req.body.accRejStatus === DATA_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_STATUS.ACCEPTED) {
                    message = MESSAGE_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_ACCEPTED;
                } else {
                    message = MESSAGE_CONSTANT.WORKORDER_REQREVCOMMENTS.REQUEST_REJECTED;
                }
                return Promise.all(woReqRevCommentPromise).then(() => t.commit().then(() => {
                    module.exports.setCommentStatusNotification(req, req.body);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: req.body }, message);
                })
                );
            }).catch((err) => {
                console.trace();
                console.error(err);
                t.rollback();
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Send comment notificatoion
    sendCommentNotification: (req, model) => {
        // eslint-disable-next-line consistent-return
        module.exports.getWORevReqEmployees(req, model.woRevReqID, model.commentemployeeID).then((response) => {
            if (response) {
                const { WorkOrderCoOwner } = req.app.locals.models;
                return WorkOrderCoOwner.findAll({
                    where: {
                        woID: model.woID
                    },
                    attributes: ['employeeID']
                }).then((woCoOwnerList) => {
                    if (woCoOwnerList && woCoOwnerList.length > 0) {
                        response = _.unionBy(response, woCoOwnerList, 'employeeID');
                    }

                    const data = {
                        senderID: model.commentemployeeID,
                        woID: req.body.woID,
                        opID: req.body.opID,
                        woOPID: req.body.woOPID,
                        woRevReqID: req.body.woRevReqID,
                        woRevReqcommID: model.woRevReqcommID,
                        message: req.body.description,
                        // subject: req.body.threadTitle,
                        receiver: response.map(x => x.employeeID)
                    };
                    NotificationMstController.sendWOReviewComment(req, data);

                    // Send ack/message for work-order change request comment added
                    const notifyData = {
                        woRevReqID: model.woRevReqID,
                        receiver: response.map(x => x.employeeID)
                    };
                    NotificationMstController.sendWOChangeReqNewCommentAddedAck(req, notifyData);
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
    // Set comment status notification
    setCommentStatusNotification: (req, model) => {
        const { WorkorderReqRevComments } = req.app.locals.models;

        return WorkorderReqRevComments.findOne({
            where: {
                woRevReqcommID: model.woRevReqcommID
            },
            attributes: ['commentemployeeID']
        }).then((resp) => {
            // if (resp.commentemployeeID == model.accRejBy) return;

            const { WorkOrderCoOwner } = req.app.locals.models;
            return WorkOrderCoOwner.findAll({
                where: {
                    woID: req.body.woID
                },
                attributes: ['employeeID']
            }).then((woCoOwnerList) => {
                const notiReceiverList = [];
                let isCommentEmpIDExistsInRecv = false;
                if (woCoOwnerList && woCoOwnerList.length > 0) {
                    _.each(woCoOwnerList, (coownerItem) => {
                        // login user as co-owner then not required
                        if (coownerItem.dataValues.employeeID !== req.user.employeeID) {
                            notiReceiverList.push(coownerItem.dataValues.employeeID);
                        }
                    });
                    isCommentEmpIDExistsInRecv = _.some(notiReceiverList, recvItem => recvItem.employeeID === resp.commentemployeeID);
                }
                // commented emp
                if (!isCommentEmpIDExistsInRecv) {
                    notiReceiverList.push(resp.commentemployeeID);
                }
                // wo-owner
                if (req.user.employeeID !== req.body.woAuthorEmpID) {
                    notiReceiverList.push(req.body.woAuthorEmpID);
                }

                const data = {
                    senderID: model.accRejBy,
                    woID: model.woID,
                    woRevReqID: model.woRevReqID,
                    accRejStatus: req.body.accRejStatus,
                    woRevReqcommID: model.woRevReqcommID,
                    // receiver: [resp.commentemployeeID]
                    receiver: notiReceiverList
                };
                NotificationMstController.sendWOReviewCommentStatus(req, data);
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
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
    }
};