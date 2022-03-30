const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotUpdate } = require('../../errors');
const { Op } = require('sequelize');

const timelineObjForDeptApprovalEcoRequest = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL;
const DeptApprovalEcoRequestConstObj = DATA_CONSTANT.TIMLINE.ECO_REQUEST_DEPARTMENT_APPROVAL;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const ecoReqDepModuleName = DATA_CONSTANT.ECO_REQUEST_DEPARTMENT_APPROVAL.NAME;

const ecoRequestDeptApprovalFields = [
    'deptID',
    'ecoReqID',
    'createdAt',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'updatedAt'
];

const ecoDepartmentEmployee = [
    'ecoReqID',
    'ecoDeptApprovalID',
    'employeeID',
    'isDeleted',
    'createdBy',
    'createdAt'
];

const ecoDeptApprovalAckFields = [
    'isAck',
    'initiateDate',
    'comment',
    'updatedBy',
    'updatedAt'
];

module.exports = {
    // Retrive list of ECO requests department
    // GET : /api/v1/ecorequestdeptapproval
    // @param {ecoReqID} int
    // @return list of ECO requests department
    retriveECORequestDept: (req, res) => {
        const { ECORequestDepartmentApproval, Employee, ECORequestDepartmentEmployee, sequelize } = req.app.locals.models;
        return ECORequestDepartmentApproval.findAll({
            where: { ecoReqID: req.params.ecoReqID },
            include: [{
                model: Employee,
                as: 'ecoEmployee',
                attributes: [[sequelize.literal('CONCAT(ecoEmployee.firstName , \' \' , ecoEmployee.lastName)'), 'fullName']]
            },
            {
                model: ECORequestDepartmentEmployee,
                as: 'eco_request_department_employee',
                attributes: ['ecoDeptApprovalID', 'employeeID']
            }]
        }).then((response) => {
            resHandler.successRes(res, 200, STATE.SUCCESS, response);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(ecoReqDepModuleName)));
        });
    },
    // Save ECO request department
    // POST : /api/v1/ecorequestdeptapproval
    // @return API response
    saveECORequestDept: (req, res) => {
        const { ECORequest, ECORequestDepartmentApproval, ECORequestDepartmentEmployee, sequelize } = req.app.locals.models;
        if (req.body.ecoDeptApprovalID) {
            ECORequestDepartmentApproval.count({
                where: {
                    ecoDeptApprovalID: { [Op.ne]: req.body.ecoDeptApprovalID },
                    ecoReqID: req.body.ecoReqID,
                    deptID: req.body.deptID
                }
            }).then((count) => {
                if (count === 0) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return sequelize.transaction().then(t => ECORequestDepartmentApproval.update(req.body, {
                            where: { ecoDeptApprovalID: req.body.ecoDeptApprovalID },
                            fields: ecoRequestDeptApprovalFields,
                            transaction: t
                        }).then(response => ECORequestDepartmentEmployee.findAll({
                                where: { ecoDeptApprovalID: req.body.ecoDeptApprovalID },
                                transaction: t
                            }).then((ecoDeptEmployee) => {
                                var newAddedTypes = [];
                                var deletedTypes = [];

                                if (req.body.employeeIds && req.body.employeeIds.length) {
                                    req.body.departentEmployee = [];
                                    req.body.employeeIds.forEach((element) => {
                                        var employee = {
                                            employeeID: element,
                                            ecoDeptApprovalID: req.body.ecoDeptApprovalID,
                                            createdBy: req.body.updatedBy,
                                            updatedBy: req.user.id,
                                            initiateDate: parseInt(element) === parseInt(req.body.employeeID) ? req.body.initiateDate : null
                                        };
                                        req.body.departentEmployee.push(employee);
                                    });

                                    if (req.body.departentEmployee && req.body.departentEmployee.length) {
                                        ecoDeptEmployee.forEach((item) => {
                                            var typeObj = req.body.departentEmployee.find(x => parseInt(x.employeeID) === parseInt(item.employeeID));
                                            if (!typeObj) { deletedTypes.push(item.ecoDeptDetailID); }
                                        });

                                        req.body.departentEmployee.forEach((item) => {
                                            var typeObj = ecoDeptEmployee.find(x => parseInt(x.employeeID) === parseInt(item.employeeID));
                                            if (!typeObj) {
                                                newAddedTypes.push(item);
                                            }
                                        });
                                    } else {
                                        deletedTypes = ecoDeptEmployee.map(x => x.ecoDeptDetailID);
                                    }

                                    const promises = [];

                                    if (newAddedTypes.length) {
                                        promises.push(ECORequestDepartmentEmployee.bulkCreate(newAddedTypes, {
                                            fields: ecoDepartmentEmployee,
                                            transaction: t
                                        }));
                                    }

                                    if (deletedTypes.length) {
                                        COMMON.setModelDeletedByFieldValue(req);
                                        promises.push(ECORequestDepartmentEmployee.update({
                                            deletedBy: req.body['deletedBy'],
                                            deletedAt: req.body['deletedAt'],
                                            isDeleted: req.body['isDeleted'],
                                            updatedBy: req.body['updatedBy']
                                        }, {
                                            where: {
                                                ecoDeptDetailID: deletedTypes,
                                                deletedAt: null
                                            },
                                            fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                                            transaction: t
                                        }));
                                    }

                                    Promise.all(promises).then(() => {
                                        t.commit();

                                        // [S] add log of updating department approval request of work order for timeline users
                                        const objEvent = {
                                            userID: req.user.id,
                                            eventTitle: DeptApprovalEcoRequestConstObj.UPDATE.title,
                                            eventDescription: COMMON.stringFormat(DeptApprovalEcoRequestConstObj.UPDATE.description, req.body.ecoNumber, req.body.assyPN, req.user.username),
                                            refTransTable: DeptApprovalEcoRequestConstObj.refTransTableName,
                                            refTransID: req.body.ecoDeptApprovalID,
                                            eventType: timelineObjForDeptApprovalEcoRequest.id,
                                            url: COMMON.stringFormat(DeptApprovalEcoRequestConstObj.url, req.body.requestTypeName, req.body.partID, req.body.ecoReqID),
                                            eventAction: timelineEventActionConstObj.UPDATE
                                        };
                                        req.objEvent = objEvent;
                                        TimelineController.createTimeline(req);
                                        // [E] add log of updating department approval request of work order for timeline users

                                        resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.UPDATED(ecoReqDepModuleName) });

                                        ECORequest.findOne({
                                            where: {
                                                ecoReqID: req.body.ecoReqID
                                            },
                                            attributes: ['initiateBy', 'ecoNumber']
                                        }).then((ecoRequest) => {
                                            if (ecoRequest && ecoRequest.initiateBy) {
                                                const data = {
                                                    ecoNumber: ecoRequest.ecoNumber,
                                                    senderID: req.user.employeeID,
                                                    partID: req.body.partID,
                                                    assyPN: req.body.assyPN,
                                                    deptID: req.body.deptID,
                                                    ecoReqID: req.body.ecoReqID,
                                                    receiver: newAddedTypes.map(x => x.employeeID),
                                                    requestType: req.body.requestType
                                                };
                                                NotificationMstController.sendECODeptApproval(req, data);
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            /* Empty */
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_UPDATED(ecoReqDepModuleName)));
                                    });
                                } else {
                                    t.commit();
                                    resHandler.successRes(res, 200, STATE.SUCCESS, response);
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(ecoReqDepModuleName)));
                            })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_UPDATED(ecoReqDepModuleName)));
                        }));
                } else {
                   return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.ECO_REQUEST_DEPARTMENT_APPROVAL.DUPLICATE_DEPARTMENT));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.NOT_UPDATED(ecoReqDepModuleName)));
            });
        } else {
            ECORequestDepartmentApproval.count({
                where: {
                    ecoReqID: req.body.ecoReqID,
                    deptID: req.body.deptID
                }
            }).then((count) => {
                if (count === 0) {
                    COMMON.setModelCreatedByFieldValue(req);
                    return sequelize.transaction().then(t => ECORequestDepartmentApproval.create(req.body, {
                            where: { ecoDeptApprovalID: req.body.ecoDeptApprovalID },
                            fields: ecoRequestDeptApprovalFields,
                            transaction: t
                        }).then((response) => {
                            if (req.body.employeeIds && req.body.employeeIds.length) {
                                req.body.departentEmployee = [];
                                req.body.employeeIds.forEach((element) => {
                                    var employee = {
                                        employeeID: element,
                                        ecoDeptApprovalID: response.dataValues.ecoDeptApprovalID,
                                        createdBy: req.body.createdBy,
                                        updatedBy: req.user.id
                                    };
                                    req.body.departentEmployee.push(employee);
                                });
                                return ECORequestDepartmentEmployee.bulkCreate(req.body.departentEmployee, {
                                    fields: ecoDepartmentEmployee,
                                    transaction: t
                                }).then(() => {
                                    t.commit();

                                    // [S] add log of adding department approval request of work order for timeline users
                                    const objEvent = {
                                        userID: req.user.id,
                                        eventTitle: DeptApprovalEcoRequestConstObj.CREATE.title,
                                        eventDescription: COMMON.stringFormat(DeptApprovalEcoRequestConstObj.CREATE.description, req.body.ecoNumber, req.body.assyPN, req.user.username),
                                        refTransTable: DeptApprovalEcoRequestConstObj.refTransTableName,
                                        refTransID: response.ecoDeptApprovalID,
                                        eventType: timelineObjForDeptApprovalEcoRequest.id,
                                        url: COMMON.stringFormat(DeptApprovalEcoRequestConstObj.url, req.body.requestTypeName, req.body.partID, req.body.ecoReqID),
                                        eventAction: timelineEventActionConstObj.CREATE
                                    };
                                    req.objEvent = objEvent;
                                    TimelineController.createTimeline(req);
                                    // [E] add log of adding department approval request of work order for timeline users

                                    resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.CREATED(ecoReqDepModuleName), data: response });

                                    ECORequest.findOne({
                                        where: {
                                            ecoReqID: req.body.ecoReqID
                                        },
                                        attributes: ['initiateBy', 'ecoNumber']
                                    }).then((ecoRequest) => {
                                        if (ecoRequest && ecoRequest.initiateBy) {
                                            const data = {
                                                ecoNumber: ecoRequest.ecoNumber,
                                                senderID: req.user.employeeID,
                                                partID: req.body.partID,
                                                assyPN: req.body.assyPN,
                                                deptID: req.body.deptID,
                                                ecoReqID: req.body.ecoReqID,
                                                receiver: req.body.employeeIds,
                                                requestType: req.body.requestType,
                                                PIDCode: req.body.PIDCode,
                                                woNumber: req.body.woNumber,
                                                woVersion: req.body.woVersion,
                                                nickName: req.body.nickName
                                            };
                                            NotificationMstController.sendECODeptApproval(req, data);
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        /* Empty */
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(ecoReqDepModuleName)));
                                });
                            } else {
                                t.commit();
                               return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.CREATED(ecoReqDepModuleName), data: response });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(ecoReqDepModuleName)));
                        })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(ecoReqDepModuleName)));
                    });
                } else {
                   return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.ECO_REQUEST_DEPARTMENT_APPROVAL.DUPLICATE_DEPARTMENT));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(ecoReqDepModuleName)));
            });
        }
    },
    // Delete ECO requests department approval
    // DELETE : /api/v1/ecorequestdeptapproval
    // @param {ecoDeptApprovalID} int
    // @return API response
    deleteECORequestDept: (req, res) => {
        const { ECORequestDepartmentApproval } = req.app.locals.models;
        if (req.params.ecoDeptApprovalID) {
            COMMON.setModelDeletedByFieldValue(req);
            return ECORequestDepartmentApproval.update(req.body, {
                where: {
                    ecoDeptApprovalID: req.params.ecoDeptApprovalID,
                    deletedAt: null
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt']
            }).then((response) => {
                // [S] add log of delete department approval request for work order for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: DeptApprovalEcoRequestConstObj.DELETE.title,
                    eventDescription: COMMON.stringFormat(DeptApprovalEcoRequestConstObj.DELETE.description, req.query.ecoNumber, req.query.assyPN, req.user.username),
                    refTransTable: DeptApprovalEcoRequestConstObj.refTransTableName,
                    refTransID: req.params.ecoDeptApprovalID,
                    eventType: timelineObjForDeptApprovalEcoRequest.id,
                    url: COMMON.stringFormat(DeptApprovalEcoRequestConstObj.url, req.body.requestTypeName, req.query.partID, req.query.ecoReqID),
                    eventAction: timelineEventActionConstObj.DELETE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of delete department approval request for work order for timeline users

                resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.DELETED(ecoReqDepModuleName), data: response });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_DELETED(ecoReqDepModuleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Acknowledgement ECO requests department approval
    // POST : /api/v1/ecorequestdeptapproval/ackECODepartmentApproval
    // @return API response
    ackECODepartmentApproval: (req, res) => {
        const { ECORequest, ECORequestDepartmentApproval, ECORequestDepartmentEmployee } = req.app.locals.models;

        COMMON.setModelUpdatedByFieldValue(req);

        req.body.isAck = true;
        ECORequestDepartmentEmployee.update(req.body, {
            where: {
                ecoDeptApprovalID: req.body.ecoDeptApprovalID,
                employeeID: req.body.employeeID
            },
            fields: ecoDeptApprovalAckFields
        }).then(() => {
            ECORequestDepartmentApproval.update(req.body, {
                where: {
                    ecoDeptApprovalID: req.body.ecoDeptApprovalID
                },
                fields: ['employeeID', 'comment', 'updatedAt', 'updatedBy', 'isAck', 'initiateDate']
            }).then(() => {
                resHandler.successRes(res, 200, STATE.SUCCESS, req.body);

                ECORequest.findOne({
                    where: {
                        ecoReqID: req.body.ecoReqID
                    },
                    attributes: ['initiateBy', 'ecoNumber']
                }).then((ecoRequest) => {
                    if (ecoRequest && ecoRequest.initiateBy) {
                        const data = {
                            ecoNumber: ecoRequest.ecoNumber,
                            ecoReqID: req.body.ecoReqID,
                            senderID: req.user.employeeID,
                            partID: req.body.partID,
                            assyPN: req.body.assyPN,
                            deptID: req.body.deptID,
                            receiver: [ecoRequest.initiateBy],
                            requestType: req.body.requestType,
                            PIDCode: req.body.PIDCode,
                            woNumber: req.body.woNumber,
                            woVersion: req.body.woVersion,
                            nickName: req.body.nickName
                        };
                        NotificationMstController.sendECODeptApprovalAck(req, data);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    /* Empty */
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.ECO_REQUEST_DEPARTMENT_APPROVAL.NOT_ACK));
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.ECO_REQUEST_DEPARTMENT_APPROVAL.NOT_ACK));
        });
    }
};