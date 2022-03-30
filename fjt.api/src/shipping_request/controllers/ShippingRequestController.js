const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const timelineObjForShippingRequest = DATA_CONSTANT.TIMLINE.EVENTS.SHIPPING_REQUEST;
const ShippingRequestConstObj = DATA_CONSTANT.TIMLINE.SHIPPING_REQUEST;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');

const moduleName = DATA_CONSTANT.REQUEST_FOR_SHIP.NAME;

module.exports = {
    // Get all shipping request
    // GET : /api/v1/shippingrequest/getShippingRequest
    // @param {Paging model} object
    // @return list of all shipping request
    getShippingRequest: (req, res) => {
        const { ShippingRequest, sequelize } = req.app.locals.models;

        if (req.params.id) {
            ShippingRequest.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'requestDate', 'status', 'requestedBy', 'note']
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            // create where clause
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            sequelize.query('CALL Sproc_GetShippingRequestList(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Insert and update shipping request
    // POST : /api/v1/shippingrequest/saveRequestForShip
    // @param {Shipping request model} object
    // @return API response
    saveRequestForShip: (req, res) => {
        const { ShippingRequest, ShippingRequestEmpDet, ShippingRequestDet, sequelize } = req.app.locals.models;
        var dtlList = req.body.dtlList;
        if (req.body.dtl.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            req.body.dtl.updatedBy = req.body.updatedBy;
            req.body.dtl.updateByRoleId = req.body.updateByRoleId;
            req.body.dtl.updatedAt = req.body.updatedAt;
            return sequelize.transaction().then(t => ShippingRequest.update(req.body.dtl, {
                    where: {
                        id: req.body.dtl.id
                    },
                    fields: ['note', 'updatedBy', 'status', 'updateByRoleId'],
                    transaction: t
                }).then(() => {
                    // [S] add log of update shipping request for timeline users
                    const objEvent = {
                        userID: req.user.id,
                        eventTitle: ShippingRequestConstObj.UPDATE.title,
                        eventDescription: COMMON.stringFormat(ShippingRequestConstObj.UPDATE.description, req.body.dtl.note, req.user.username),
                        refTransTable: ShippingRequestConstObj.refTransTableName,
                        refTransID: req.body.dtl.id,
                        eventType: timelineObjForShippingRequest.id,
                        url: ShippingRequestConstObj.url,
                        eventAction: timelineEventActionConstObj.UPDATE
                    };
                    req.objEvent = objEvent;
                    TimelineController.createTimeline(req);
                    // [E] add log of update shipping request for timeline users

                    // Update Request for Shipment detail into Elastic Search Engine for Enterprise Search
                    if (req.body.dtl.id) {
                        req.params['pId'] = req.body.dtl.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageRequestForShipmentInElastic);
                    }
                    if (req.body.dtl.id) {
                        if (dtlList) {
                            // update, remove & create detail here
                            return module.exports.updateShippingRequestDtl(req, res, t).then((resDtl) => {
                                if (resDtl.state === STATE.SUCCESS) {
                                    if (parseInt(req.body.dtl.status) === DATA_CONSTANT.REQUEST_FOR_SHIP.STATUS.PUBLISHED) {
                                        ShippingRequestEmpDet.findAll({
                                            where: {
                                                shippingRequestID: req.body.dtl.id
                                            },
                                            attributes: ['employeeID']
                                        }).then((shippingReqEmpDet) => {
                                            if (shippingReqEmpDet.length) {
                                                const data = {
                                                    shippingRequestID: req.body.dtl.id,
                                                    senderID: req.user.employeeID,
                                                    receiver: shippingReqEmpDet.map(x => x.employeeID)
                                                };
                                                NotificationMstController.sendShippingReqStatus(req, data);
                                            }
                                        });
                                    }
                                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName)));
                                } else {
                                    if (!t.finished) t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            }).catch((err) => {
                                if (!t.finished) t.rollback();
                                console.error(err);
                                console.trace();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            // create new entry
            COMMON.setModelCreatedByFieldValue(req);
            req.body.dtl.requestedBy = req.user.employeeID;
            req.body.dtl.createdBy = req.user.id;
            req.body.dtl.createByRoleID = req.user.defaultLoginRoleID;
            req.body.dtl.requestDate = COMMON.getCurrentUTC();
            req.body.dtl.status = 0;

           return ShippingRequest.create(req.body.dtl, {
                fields: ['note', 'createdBy', 'status', 'requestDate', 'requestedBy', 'createByRoleID']
            }).then((response) => {
                // [S] add log of create shipping request for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: ShippingRequestConstObj.CREATE.title,
                    eventDescription: COMMON.stringFormat(ShippingRequestConstObj.CREATE.description, req.body.dtl.note, req.user.username),
                    refTransTable: ShippingRequestConstObj.refTransTableName,
                    refTransID: response.id,
                    eventType: timelineObjForShippingRequest.id,
                    url: ShippingRequestConstObj.url,
                    eventAction: timelineEventActionConstObj.CREATE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of create shipping request for timeline users

                // Update Request for Shipment detail into Elastic Search Engine for Enterprise Search
                if (response.id) {
                    req.params['pId'] = response.id;
                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageRequestForShipmentInElastic);
                }
                if (response.id && dtlList) {
                    _.each(dtlList, (item) => {
                        item.shippingRequestID = response.id;
                        item.createdBy = req.user.id;
                    });

                   return ShippingRequestDet.bulkCreate(dtlList, {
                        fields: ['id', 'shippingRequestID', 'woID', 'note', 'qty', 'createdBy']
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: response.id }, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(moduleName));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    updateShippingRequestDtl: (req, res, t) => {
        const { ShippingRequestDet } = req.app.locals.models;
        var requestPromises = [];
        var dtlList = req.body.dtlList;
        // return sequelize.transaction().then((t) => {
        return ShippingRequestDet.findAll({
            where: {
                shippingRequestID: req.body.dtl.id,
                isDeleted: false
            },
            attributes: ['id', 'note', 'qty', 'woID'],
            transaction: t
        }).then((detailList) => {
            let updateDetail = _.filter(dtlList, item => item.id);
            const createDetail = _.filter(dtlList, item => !item.id);
            const updateIds = _.map(updateDetail, 'id');
            const detailIds = _.map(detailList, 'id');
            const removeDetail = _.difference(detailIds, updateIds);
            _.each(removeDetail, (item) => {
                updateDetail = _.reject(updateDetail, o => parseInt(o.id) === parseInt(item));
            });
            // DELETE
            if (removeDetail.length > 0) {
                COMMON.setModelDeletedByFieldValue(req);
                _.each(removeDetail, (item) => {
                    var obj = {
                        deletedBy: req.body.deletedBy,
                        deletedAt: req.body.deletedAt,
                        isDeleted: req.body.isDeleted,
                        updateByRoleId: req.body.updateByRoleId,
                        deleteByRoleId: req.body.deleteByRoleId
                    };
                    requestPromises.push(
                        ShippingRequestDet.update(obj, {
                            where: {
                                shippingRequestID: req.body.dtl.id,
                                id: item
                            },
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        })
                    );
                });
            }
            // CREATE
            if (createDetail.length > 0) {
                COMMON.setModelCreatedByFieldValue(req);
                _.each(createDetail, (item) => {
                    item.shippingRequestID = req.body.dtl.id;
                    item.createdBy = req.body.createdBy;
                    item.updatedBy = req.body.updatedBy;
                    item.updateByRoleId = req.body.updateByRoleId;
                    item.createByRoleId = req.body.createByRoleId;

                    requestPromises.push(
                        ShippingRequestDet.create(item, {
                            fields: ['shippingRequestID', 'woID', 'note', 'qty', 'createdBy', 'createdByRoleId', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.ERROR;
                        })
                    );
                });
            }

            // UPDATE
            if (updateDetail.length > 0) {
                COMMON.setModelUpdatedByFieldValue(req);
                _.each(updateDetail, (item) => {
                    item.updatedBy = req.body.updatedBy;
                    item.updatedAt = req.body.updatedAt;
                    item.updateByRoleId = req.body.updateByRoleId;
                    requestPromises.push(
                        ShippingRequestDet.update(item, {
                            where: {
                                id: item.id,
                                isDeleted: false
                            },
                            fields: ['id', 'shippingRequestID', 'woID', 'note', 'qty', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.error(err);
                            console.trace();
                            return STATE.FAILED;
                        })
                    );
                });
            }
            return Promise.all(requestPromises).then((resp) => {
                if (_.find(resp, sts => (sts === STATE.FAILED))) {
                    // if (!t.finished) t.rollback();
                    return { state: STATE.FAILED };
                    // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                } else {
                    return { state: STATE.SUCCESS };
                    // return t.commit().then(() => {
                        // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName));
                    // });
                }
            });
        }).catch((err) => {
            console.error(err);
            console.trace();
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
        // });
    },

    // Get Shipped quantity and Requested quantity
    // GET : /api/v1/shippingrequest/getReadyForShipQtyByWOID
    // @param {woID} int
    // @return API response
    getReadyForShipQtyByWOID: (req, res) => {
        const { ShippedAssembly, ShippingRequestDet } = req.app.locals.models;
        var promises = [];

        // Get ShippedQty quantity
        promises.push(ShippedAssembly.sum('shippedqty', {
            where: {
                workorderID: req.params.woID
            }
        }));


        promises.push(ShippingRequestDet.sum('qty', {
            where: {
                woID: req.params.woID
            }
        }));

        Promise.all(promises).then((resp) => {
            var shippedAssemblyResp = resp[0];
            var shippingReqDetResp = resp[1];

            var model = {
                shippedQty: shippedAssemblyResp || 0,
                requestedQty: shippingReqDetResp || 0
            };
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Delete multiple shipping request
    // POST : /api/v1/shippingrequest/deleteRequestForShip
    // @param {IDs with model} object
    // @return API response
    deleteRequestForShip: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs) {
            const tableName = COMMON.ShippingRequestDet;
            COMMON.setModelDeletedByFieldValue(req);

           return sequelize.query('CALL Sproc_checkDelete(:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                EnterpriseSearchController.deleteRequestForShipmentInElastic(req.body.objIDs.id.toString());
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(moduleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Request status request id wise
    // GET : /api/v1/shippingrequest/getShippingRequestStatus
    // @param {id} int
    // @return API response
    getShippingRequestStatus: (req, res) => {
        const { ShippingRequest } = req.app.locals.models;
        if (req.query && req.query.id) {
           return ShippingRequest.findOne({
                where: {
                    id: req.query.id
                },
                attributes: ['id', 'status']
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Assembly details(WOID , WoNumber , Req. Qty, Shipped Qty, Customer , Build Qty ) as per WoID
    // GET : /api/v1/shippingrequest/getShippingQtyAndAssyDetailByWOID
    // @param {WoID} int
    // @return API response
    getShippingQtyAndAssyDetailByWOID: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.query.woID) {
           return sequelize.query('CALL Sproc_GetShippingQtyAndAssyDetailByWOID (:pWOID)', {
                replacements: {
                    pWOID: req.query.woID
                },
type: sequelize.QueryTypes.SELECT
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get RequestedBy & Status  for Approval tab
    // GET : /api/v1/shippingrequest/getShippingRequestByDet
    // @param {id} int
    // @return API response
    getShippingRequestByDet: (req, res) => {
        const { ShippingRequest } = req.app.locals.models;
        if (req.query && req.query.id) {
           return ShippingRequest.findOne({
                where: {
                    id: req.query.id
                },
                attributes: ['id', 'requestedBy', 'status']
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get shipping request details
    // GET : /api/v1/shippingrequestdet/getShippingRequestDet
    // @param {Paging Model} object
    // @return API response
    getShippingRequestDet: (req, res) => {
        const { sequelize } = req.app.locals.models;

        /* Call common ui grid filter function */
        const filter = COMMON.UiGridFilterSearch(req);

        // create where clause
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        var order = null;
        if (filter.order[0]) { order = `${filter.order[0][0]} ${filter.order[0][1]}`; }

        // created SP as we are displaying Assy. Number, Assy. Revision and Assy. Nick name which
        // are from another table and for filter and order we cannot use sequelize query
        sequelize
            .query('CALL Sproc_GetShippingRequestDet (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: order,
                        pWhereClause: strWhere
                    },
type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Get shipping request details
    // GET : /api/v1/shippingrequestdet/getShippingRequestDet
    // @param {Paging Model} object
    // @return API response
    getGetShippingReqList: (req, res) => {
        const { ShippingRequest } = req.app.locals.models;
        const whereClause = { isDeleted: false };
        if (req) {
            if (req.query && req.query.searchquery) {
                whereClause.note = {
                    [Op.like]: `%${req.query.searchquery}%`
                };
            }
           return ShippingRequest.findAll({
                attributes: ['id', 'note'],
                order: [['note', 'ASC']],
                where: whereClause
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};