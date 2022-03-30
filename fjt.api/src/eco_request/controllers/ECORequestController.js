const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound } = require('../../errors');

const timelineObjForEcoRequest = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.ECO_REQUEST;
const EcoRequestConstObj = DATA_CONSTANT.TIMLINE.ECO_REQUEST;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const ecoReqModuleName = DATA_CONSTANT.ECO_REQUEST.NAME;
const dfmReqModuleName = DATA_CONSTANT.DFM_REQUEST.NAME;
const ecoReqValModuleName = DATA_CONSTANT.ECO_REQUEST_TYPE_VALUES.NAME;

const ecoRequestFields = [
    'ecoNumber',
    'fromPartID',
    'toPartID',
    'woID',
    'opID',
    'woOPID',
    'custECONumber',
    'FCAECONumber',
    'requestorName',
    'reasonForChange',
    'description',
    'initiateBy',
    'initiateDate',
    'approvalBy',
    'approvalDate',
    'rejectedBy',
    'rejectedDate',
    'status',
    'isDeleted',
    'createdAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'comments',
    'finalStatus',
    'finalStatusInit',
    'finalStatusDate',
    'finalStatusReason',
    'isAllProductConf',
    'isFutureProd',
    'isTemp',
    'requestedWOOPID',
    'ECOImplemetTo',
    'implemetToWOID',
    'closedDate',
    'requestType',
    'ecoDfmTypeID',
    'mountingTypeID',
    'documentPath',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const ecoRequestTypeValuesFields = [
    'ecoReqID',
    'ecoTypeCatID',
    'ecoTypeValID',
    'isDeleted',
    'createdBy',
    'createdAt',
    'note',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of ECO requests
    // GET : /api/v1/ecorequest/retriveECORequestsList
    // @return list of ECO requests
    retriveECORequestsList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            // create where clause
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            // created SP as we are displaying Assy. Number, Assy. Revision and Assy. Nick name which
            // are from another table and for filter and order we cannot use sequelize query
            return sequelize.query('CALL Sproc_GetECORequest (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pRequestType,:pPartID,:pEcoDfmNum)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pRequestType: req.body.requestType || null,
                    pPartID: req.body.partID || null,
                    pEcoDfmNum: req.body.ecodfmnum || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ecoRequests: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName), err: err, data: null });
                // return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive detail of ECO requests
    // GET : /api/v1/ecorequest
    // @param {ecoReqID} int
    // @return detail of ECO requests
    retriveECORequests: (req, res) => {
        if (req.params.ecoReqID) {
            const { ECORequest, Employee, Workorder, ECORequestTypeValues, sequelize } = req.app.locals.models;
            return ECORequest.findByPk(req.params.ecoReqID, {
                include: [{
                    model: Workorder,
                    as: 'workOrder'
                }, {
                    model: ECORequestTypeValues,
                    as: 'ecoRequestTypeValues',
                    attributes: ['ecoReqTypeValID', 'ecoReqID', 'ecoTypeCatID', 'ecoTypeValID', 'note']
                }, {
                    model: Employee,
                    as: 'employee',
                    attributes: [[sequelize.literal('CONCAT(employee.firstName , \' \' , employee.lastName)'), 'fullName']]
                }, {
                    model: Employee,
                    as: 'employee_finalStatusInit',
                    attributes: [[sequelize.literal('CONCAT(employee_finalStatusInit.firstName , \' \' , employee_finalStatusInit.lastName)'), 'fullName']]
                }]
            }).then((ecoRequest) => {
                if (!ecoRequest) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName), err: null, data: null });
                }
                ecoRequest.description = COMMON.getTextAngularValueFromDB(ecoRequest.description);
                ecoRequest.reasonForChange = COMMON.getTextAngularValueFromDB(ecoRequest.reasonForChange);
                ecoRequest.comments = COMMON.getTextAngularValueFromDB(ecoRequest.comments);
                ecoRequest.finalStatusReason = COMMON.getTextAngularValueFromDB(ecoRequest.finalStatusReason);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ecoRequest, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName), err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive ECO detail for Header
    // GET : /api/v1/ecorequest/getECOHeaderDetail
    // @param {ecoReqID,partID} int
    // @return ECO requests detail
    getECOHeaderDetail: (req, res) => {
        const { ECORequest, Component, Workorder, RFQRoHS } = req.app.locals.models;

        if (req.params.partID) {
            const include = [{
                model: RFQRoHS,
                as: 'rfq_rohsmst',
                attributes: ['id', 'name', 'rohsIcon']
            }];
            if (req.query.ecoReqID) {
                const ecoWhereclause = { ecoReqID: req.query.ecoReqID };
                include.push({
                    model: ECORequest,
                    where: ecoWhereclause,
                    as: 'fromEcoRequest',
                    attributes: ['ecoReqID', 'woID', 'ecoNumber', 'finalStatus', 'status'],
                    require: false,
                    include: [{
                        model: Workorder,
                        as: 'workOrder',
                        require: false,
                        attributes: ['woID', 'woNumber', 'woVersion', 'woStatus', 'woSubStatus']

                    }]
                });
            }
            return Component.findOne({
                where: {
                    id: req.params.partID
                },
                attributes: ['id', 'RoHSStatusID', 'PIDCode', 'mfgPN', 'isCustom', 'nickName'],
                include: include
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, response);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName), err));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
        }
    },
    // Save ECO requests
    // POST : /api/v1/ecorequest
    // @return API response
    saveECORequest: (req, res) => {
        const { ECORequest, ECORequestTypeValues, sequelize } = req.app.locals.models;
        if (req.body.ecoReqID) {
            ECORequest.count({
                where: {
                    ecoReqID: { [Op.ne]: req.body.ecoReqID },
                    ecoNumber: req.body.ecoNumber
                }
            }).then((count) => {
                if (!count) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                    req.body.reasonForChange = COMMON.setTextAngularValueForDB(req.body.reasonForChange);
                    req.body.comments = COMMON.setTextAngularValueForDB(req.body.comments);
                    req.body.finalStatusReason = COMMON.setTextAngularValueForDB(req.body.finalStatusReason);
                    return sequelize.transaction().then(t => ECORequest.update(req.body, {
                        where: {
                            ecoReqID: req.body.ecoReqID
                        },
                        fields: ecoRequestFields,
                        transaction: t
                    }).then(() => ECORequestTypeValues.findAll({
                        where: { ecoReqID: req.body.ecoReqID },
                        transaction: t
                    }).then((response) => {
                        var newAddedTypes = [];
                        var deletedTypes = [];
                        var updatedTypes = [];

                        if (req.body.ecoTypeValuesList && req.body.ecoTypeValuesList.length) {
                            response.forEach((item) => {
                                var typeObj = req.body.ecoTypeValuesList.find(x => parseInt(x.ecoTypeValID) === parseInt(item.ecoTypeValID));
                                if (!typeObj) { deletedTypes.push(item.ecoReqTypeValID); } else if (typeObj.noteRequired) { updatedTypes.push(typeObj); }
                            });

                            req.body.ecoTypeValuesList.forEach((item) => {
                                var typeObj = response.find(x => parseInt(x.ecoTypeValID) === parseInt(item.ecoTypeValID));
                                if (!typeObj) {
                                    item.ecoReqID = req.body.ecoReqID;
                                    item.createdBy = req.user.id;
                                    item.updatedBy = req.user.id;
                                    item.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                    item.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                    newAddedTypes.push(item);
                                }
                            });
                        } else {
                            deletedTypes = response.map(x => x.ecoReqTypeValID);
                        }

                        const promises = [];

                        if (newAddedTypes.length) {
                            promises.push(ECORequestTypeValues.bulkCreate(newAddedTypes, {
                                fields: ecoRequestTypeValuesFields,
                                transaction: t
                            }));
                        }

                        if (deletedTypes.length) {
                            COMMON.setModelDeletedByFieldValue(req);
                            promises.push(ECORequestTypeValues.update(req.body, {
                                where: {
                                    ecoReqTypeValID: deletedTypes,
                                    deletedAt: null
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy'],
                                transaction: t
                            }));
                        }

                        if (updatedTypes.length) {
                            updatedTypes.forEach((x) => {
                                x.updatedBy = req.user.id;
                                x.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                promises.push(ECORequestTypeValues.update(x, {
                                    fields: ['note', 'updatedAt', 'updatedBy', 'updateByRoleId'],
                                    where: { ecoReqID: req.body.ecoReqID, ecoTypeValID: x.ecoTypeValID },
                                    transaction: t
                                }));
                            });
                        }

                        Promise.all(promises).then(() => {
                            t.commit();

                            // [S] add log of updating eco request for work order for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: EcoRequestConstObj.UPDATE.title,
                                eventDescription: COMMON.stringFormat(EcoRequestConstObj.UPDATE.description, req.body.assyPN, req.user.username),
                                refTransTable: EcoRequestConstObj.refTransTableName,
                                refTransID: req.body.ecoReqID,
                                eventType: timelineObjForEcoRequest.id,
                                url: COMMON.stringFormat(EcoRequestConstObj.url, req.body.requestTypeName, req.body.partID, req.body.ecoReqID),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of updating eco request for work order for timeline users

                            resHandler.successRes(res, 200, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName));

                            if (parseInt(req.user.employeeID) !== parseInt(req.body.initiateBy) && ['A', 'R'].indexOf(req.body.finalStatus) !== -1) {
                                const data = {
                                    ecoNumber: req.body.ecoNumber,
                                    ecoReqID: req.body.ecoReqID,
                                    senderID: req.user.employeeID,
                                    partID: req.body.partID,
                                    assyPN: req.body.assyPN,
                                    finalStatus: req.body.finalStatus,
                                    receiver: [req.body.initiateBy]
                                };
                                NotificationMstController.sendECORequestStatus(req, data);
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(ecoReqValModuleName)));
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
                    });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(parseInt(req.body.requestType) === 1 ? MESSAGE_CONSTANT.ECO_REQUEST.ECONUMBER_UNIQUE : MESSAGE_CONSTANT.ECO_REQUEST.DFMNUMBER_UNIQUE));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
            });
        } else {
            ECORequest.count({
                where: {
                    ecoNumber: req.body.ecoNumber
                }
            }).then((count) => {
                if (!count) {
                    COMMON.setModelCreatedByFieldValue(req);
                    req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
                    req.body.reasonForChange = COMMON.setTextAngularValueForDB(req.body.reasonForChange);
                    req.body.comments = COMMON.setTextAngularValueForDB(req.body.comments);
                    req.body.finalStatusReason = COMMON.setTextAngularValueForDB(req.body.finalStatusReason);
                    return sequelize.transaction().then(t => ECORequest.create(req.body, {
                        fields: ecoRequestFields,
                        transaction: t
                    }).then((response) => {
                        if (req.body.ecoTypeValuesList && req.body.ecoTypeValuesList.length) {
                            req.body.ecoTypeValuesList.forEach((element) => {
                                element.ecoReqID = response.ecoReqID;
                                element.createdBy = req.body.createdBy;
                                element.updatedBy = req.user.id;
                                element.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                element.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                            });

                            return ECORequestTypeValues.bulkCreate(req.body.ecoTypeValuesList, {
                                fields: ecoRequestTypeValuesFields,
                                transaction: t
                            }).then(() => {
                                t.commit();

                                // [S] add log of adding eco request for work order for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: EcoRequestConstObj.CREATE.title,
                                    eventDescription: COMMON.stringFormat(EcoRequestConstObj.CREATE.description, req.body.assyPN, req.user.username),
                                    refTransTable: EcoRequestConstObj.refTransTableName,
                                    refTransID: req.body.ecoReqID,
                                    eventType: timelineObjForEcoRequest.id,
                                    url: COMMON.stringFormat(EcoRequestConstObj.url, req.body.requestTypeName, req.body.partID, req.body.ecoReqID),
                                    eventAction: timelineEventActionConstObj.CREATE
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of adding eco request for work order for timeline users
                                if (parseInt(req.user.employeeID) !== parseInt(req.body.initiateBy) && ['A', 'R'].indexOf(req.body.finalStatus) !== -1) {
                                    const data = {
                                        ecoNumber: req.body.ecoNumber,
                                        ecoReqID: req.body.ecoReqID,
                                        senderID: req.user.employeeID,
                                        partID: req.body.partID,
                                        assyPN: req.body.assyPN,
                                        finalStatus: req.body.finalStatus,
                                        receiver: [req.body.initiateBy]
                                    };
                                    NotificationMstController.sendECORequestStatus(req, data);
                                }
                                return resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName));
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(ecoReqValModuleName)));
                            });
                        } else {
                            t.commit();

                            // [S] add log of adding eco request for work order for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: EcoRequestConstObj.CREATE.title,
                                eventDescription: COMMON.stringFormat(EcoRequestConstObj.CREATE.description, req.body.assyPN, req.user.username),
                                refTransTable: EcoRequestConstObj.refTransTableName,
                                refTransID: req.body.ecoReqID,
                                eventType: timelineObjForEcoRequest.id,
                                url: COMMON.stringFormat(EcoRequestConstObj.url, req.body.requestTypeName, req.body.partID, req.body.ecoReqID),
                                eventAction: timelineEventActionConstObj.CREATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of adding eco request for work order for timeline users
                            if (parseInt(req.user.employeeID) !== parseInt(req.body.initiateBy) && ['A', 'R'].indexOf(req.body.finalStatus) !== -1) {
                                const data = {
                                    ecoNumber: req.body.ecoNumber,
                                    ecoReqID: req.body.ecoReqID,
                                    senderID: req.user.employeeID,
                                    partID: req.body.partID,
                                    assyPN: req.body.assyPN,
                                    finalStatus: req.body.finalStatus,
                                    receiver: [req.body.initiateBy]
                                };
                                NotificationMstController.sendECORequestStatus(req, data);
                            }
                            return resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
                    });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.ECO_REQUEST.ECONUMBER_UNIQUE));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_CREATED(parseInt(req.body.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
            });
        }
    },
    // Delete ECO requests
    // DELETE : /api/v1/ecorequest
    // @param {ecoReqID} int
    // @return API response
    deleteECORequest: (req, res) => {
        const { ECORequest } = req.app.locals.models;
        if (req.params.ecoReqID) {
            const ecoTypeIDArr = req.params.ecoReqID.split(',') || [];
            COMMON.setModelDeletedByFieldValue(req);
            return ECORequest.update(req.body, {
                where: {
                    ecoReqID: ecoTypeIDArr,
                    deletedAt: null
                },
                fields: ['isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId']
            }).then((response) => {
                // [S] add log of delete eco request for work order for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: EcoRequestConstObj.DELETE.title,
                    eventDescription: COMMON.stringFormat(EcoRequestConstObj.DELETE.description, req.query.ecoNumber, req.query.woNumber, req.user.username),
                    refTransTable: EcoRequestConstObj.refTransTableName,
                    refTransID: req.params.ecoReqID,
                    eventType: timelineObjForEcoRequest.id,
                    url: null,
                    eventAction: timelineEventActionConstObj.DELETE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of delete eco request for work order for timeline users

                return resHandler.successRes(res, 200, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_DELETED(parseInt(req.query.requestType) === 1 ? ecoReqModuleName : dfmReqModuleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of workorder for Implement ECO request
    // GET : /api/v1/ecorequest/getImplementToWorkorderList
    // @param {woID} int, {partID} int
    // @return list of Workorder
    getImplementToWorkorderList: (req, res) => {
        if (req.query.partID) {
            const { Workorder } = req.app.locals.models;
            const where = {
                partID: req.query.partID
            };
            if (req.query.woSubStatus) {
                where.woSubStatus = { [Op.in]: req.query.woSubStatus };
                if (req.query.woID) { where.woID = { [Op.ne]: req.query.woID }; }
            } else {
                where.terminateWOID = req.query.woID;
            }
            return Workorder.findAll({
                where: where,
                attributes: ['woID', 'woNumber', 'terminateWOID', 'woType', 'terminateWOOPID', 'woStatus', 'woSubStatus', 'isRevisedWO']
            }).then(WorkorderList => resHandler.successRes(res, 200, STATE.SUCCESS, WorkorderList)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(ecoReqModuleName), err));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(ecoReqModuleName)));
        }
    },

    // Generate DFMNumber
    // GET : /api/v1/ecorequest/generateDFMNumber
    // @param {woID} int
    // @return generated DFMNumber
    generateDFMNumber: (req, res) => {
        if (req.query.requestType) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('Select fun_generateDFMNumber(:pWOID,:prequestType)', {
                replacements: {
                    pWOID: req.query.woID || null,
                    prequestType: req.query.requestType
                },
                type: sequelize.QueryTypes.SELECT
            }).then(DFMNumber => resHandler.successRes(res, 200, STATE.SUCCESS, { DFMNumber: _.values(DFMNumber[0]) })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(dfmReqModuleName), err));
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(dfmReqModuleName)));
        }
    },

    // Get ECO/DFM request Number List
    // GET: /api/v1/ecorequest/getAllECODFMRequestNumber
    // @param {requestType} int, {searchQuery} string
    // return list of eco/dfm
    getAllECODFMRequestNumber: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.query.requestType) {
            sequelize
                .query('CALL sproc_getAllECODFMRequestNumber (:pSearchQuery, :pRequestType)', {
                    replacements: {
                        pSearchQuery: req.query.searchquery,
                        pRequestType: req.query.requestType
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        }
    }

};