const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotDelete } = require('../../errors');

const timelineObjForInHouseAssyStkLoc = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION;
const InHouseAssyStkLocConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const moduleName = DATA_CONSTANT.WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION.NAME;

module.exports = {
    // Get all work order assembly excess stock Geolocations details
    // POST : /api/v1/workorder_assembly_excessstock_location/getWOAssyExcessStockLocationList
    // @return list of all work order assembly excess stock Geolocations details
    getWOAssyExcessStockLocationList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            // create where clause
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            // created SP as we are displaying Assy. Number, Assy. Revision and Assy. Nick name which
            // are from another table and for filter and order we cannot use sequelize query
            return sequelize.query('CALL Sproc_GetWorkorderAssemblyExcessstockLocation (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* Commented code as Not in Use. */
    // Get all work order assembly excess stock Geolocations details
    // GET : /api/v1/workorder_assembly_excessstock_location/getWOAssyExcessStockLocation
    // @param {Paging model} object
    // @return list of all work order assembly excess stock Geolocations details
    // getWOAssyExcessStockLocation: (req, res) => {
    //     if (req.params.id) {
    //         const WorkorderAssemblyExcessstockLocation = req.app.locals.models.WorkorderAssemblyExcessstockLocation;
    //         return WorkorderAssemblyExcessstockLocation.findOne({
    //             where: {
    //                 id: req.params.id
    //             },
    //             attributes: ['id', 'woID', 'partID', 'location', 'serialNoDescription', 'notes', 'isdefault']
    //         }).then((response) => {
    //             resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    //     }
    // },
    
    // Get all work order assembly excess stock Geolocations details
    // POST : /api/v1/workorder_assembly_excessstock_location/getVUWorkorderReadyassyStk
    // @param {Paging model} object
    // @return list of all work order assembly excess stock Geolocations details
    getVUWorkorderReadyassyStk: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;

            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            // create where clause
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            // created SP as we are displaying Assy. Number, Assy. Revision and Assy. Nick name which
            // are from another table and for filter and order we cannot use sequelize query
            return sequelize.query('CALL Sproc_GetVUWorkorderReadyassyStk (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { assyStockList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Save work order assembly excess stock Geolocations details
    // POST : /api/v1/workorder_assembly_excessstock_location/saveWOAssyExcessStockLocation
    // @param {model} object
    // @return API response
    saveWOAssyExcessStockLocation: (req, res) => {
        const { WorkorderAssemblyExcessstockLocation, VUWorkorderReadyassyStk, sequelize } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then(t => WorkorderAssemblyExcessstockLocation.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: ['serialNoDescription', 'notes', 'updatedBy', 'updateByRoleId', 'geolocationId'],
                transaction: t
            }).then(() => t.commit().then(() => {
                // [S] add log of update in house assembly stock Geolocations for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: InHouseAssyStkLocConstObj.UPDATE.title,
                    eventDescription: COMMON.stringFormat(InHouseAssyStkLocConstObj.UPDATE.description,
                        req.body.location, req.body.woNumber, req.body.partID, req.user.username),
                    refTransTable: InHouseAssyStkLocConstObj.refTransTableName,
                    refTransID: req.body.id,
                    eventType: timelineObjForInHouseAssyStkLoc.id,
                    url: InHouseAssyStkLocConstObj.url,
                    eventAction: timelineEventActionConstObj.UPDATE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of update in house assembly stock Geolocations for timeline users
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName));
            })).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return VUWorkorderReadyassyStk.findOne({
                where: {
                    woID: req.body.woID
                },
                attributes: ['partID', 'inHouseStockQty']
            }).then((response) => {
                if (response) {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelCreatedByFieldValue(req);
                        req.body.partID = response.partID;
                        req.body.qty = response.inHouseStockQty;
                        return WorkorderAssemblyExcessstockLocation.create(req.body,
                            {
                                fields: ['woID', 'partID', 'qty', 'serialNoDescription', 'notes', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId', 'geolocationId'],
                                transaction: t
                            }).then(responseDet => WorkorderAssemblyExcessstockLocation.update({ isdefault: false },
                                {
                                    where: {
                                        id: { [Op.ne]: responseDet.id },
                                        woID: responseDet.woID
                                    },
                                    fields: ['isdefault'],
                                    transaction: t
                                }).then(updateResponse => t.commit().then(() => {
                                    // [S] add log of adding in house assembly stock Geolocations for timeline users
                                    const objEvent = {
                                        userID: req.user.id,
                                        eventTitle: InHouseAssyStkLocConstObj.CREATE.title,
                                        eventDescription: COMMON.stringFormat(InHouseAssyStkLocConstObj.CREATE.description,
                                            req.body.location, req.body.woNumber, req.body.partID, req.user.username),
                                        refTransTable: InHouseAssyStkLocConstObj.refTransTableName,
                                        refTransID: updateResponse.id,
                                        eventType: timelineObjForInHouseAssyStkLoc.id,
                                        url: InHouseAssyStkLocConstObj.url,
                                        eventAction: timelineEventActionConstObj.CREATE
                                    };
                                    req.objEvent = objEvent;
                                    TimelineController.createTimeline(req);
                                    // [E] add log of adding in house assembly stock Geolocations for timeline users

                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updateResponse, MESSAGE_CONSTANT.CREATED(moduleName));
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null }); }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
            });
        }
    },
    // Delete work order assembly excess stock Geolocations details
    // POST : /api/v1/workorder_assembly_excessstock_location/deleteWOAssyExcessStockLocation
    // @param {model} obj with ids and woID
    // @return API response
    deleteWOAssyExcessStockLocation: (req, res) => {
        const { WorkorderAssemblyExcessstockLocation } = req.app.locals.models;
        if (req.body.ids && req.body.ids.length) {
            COMMON.setModelDeletedByFieldValue(req);
            req.body.isdefault = false;
            return WorkorderAssemblyExcessstockLocation.update(req.body, {
                where: {
                    id: req.body.ids,
                    deletedAt: null
                },
                fields: ['isdefault', 'isDeleted', 'deletedBy', 'deletedAt', 'deleteByRoleId']
            }).then(() => {
                // [S] add log of delete in house assembly stock Geolocations for timeline users
                const objEvent = {
                    userID: req.user.id,
                    eventTitle: InHouseAssyStkLocConstObj.DELETE.title,
                    eventDescription: COMMON.stringFormat(InHouseAssyStkLocConstObj.DELETE.description,
                        req.body.location, req.body.woNumber, req.body.partID, req.user.username),
                    refTransTable: InHouseAssyStkLocConstObj.refTransTableName,
                    refTransID: req.body.ids.toString(),
                    eventType: timelineObjForInHouseAssyStkLoc.id,
                    url: null,
                    eventAction: timelineEventActionConstObj.DELETE
                };
                req.objEvent = objEvent;
                TimelineController.createTimeline(req);
                // [E] add log of delete in house assembly stock Geolocations for timeline users

                return WorkorderAssemblyExcessstockLocation.findOne({
                    where: {
                        woID: req.body.woID
                    },
                    order: [['id', 'DESC']]
                }).then((response) => {
                    if (response) {
                        return WorkorderAssemblyExcessstockLocation.update({
                            isdefault: true
                        }, {
                            where: {
                                id: response.id
                            },
                            fields: ['isdefault']
                        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(moduleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
                        });
                    } else { return resHandler.successRes(res, 200, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.DELETED(moduleName)); }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotDelete(MESSAGE_CONSTANT.NOT_DELETED(moduleName)));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};