/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');
const { Op } = require('sequelize');

const timelineObjForShipAssy = DATA_CONSTANT.TIMLINE.EVENTS.SHIPPEDASSEMBLY;
const ShipAssyConstObj = DATA_CONSTANT.TIMLINE.SHIPPEDASSEMBLY;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const inputFields = [
    'id',
    'partID',
    'shippingId',
    'workorderID',
    'shippedqty',
    //'outwinvoiceno',
    //'outwinvoicedate',
    'customerID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'woOPID',
    'shippedNotes',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'refsidid',
    'refBoxSerialID',
    'originalQty'
];
const shippedModuleName = DATA_CONSTANT.SHIPPED_ASSEMBLY.NAME;
module.exports = {
    // Get List of shipped assembly
    // GET : /api/v1/Shipped/retrieveShippedAssembly
    // @param {id} int
    // @return List of Shipped Assembly
    retrieveShippedAssembly: (req, res) => {
        const { ShippedAssembly, Component, WorkorderOperation, sequelize } = req.app.locals.models;
        if (req.params.id) {
            ShippedAssembly.findOne({
                where: { id: req.params.id, isDeleted: false },
                model: ShippedAssembly,
                attributes: ['id', 'partID', 'shippingId', 'shippedqty', 'workorderID', 'woOPID', 'customerID', 'shippedNotes'],
                include: [
                    {
                        model: Component,
                        as: 'componentAssembly',
                        where: { isDeleted: false },
                        attributes: ['id', 'mfgPN', 'PIDCode', 'rev'],
                        required: false
                    },
                    {
                        model: WorkorderOperation,
                        as: 'workorderoperation',
                        where: { isDeleted: false },
                        attributes: ['woOPID', 'opName'],
                        required: false
                    }]
            }).then((shippedData) => {
                if (!shippedData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shippedData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            const filter = COMMON.UiGridFilterSearch(req);

            // create where clause
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') { strWhere = null; }

            // created SP as we are displaying Assy. Number, Assy. Revision and Assy. Nick name which
            // are from another table and for filter and order we cannot use sequelize query
            sequelize.query('CALL Sproc_GetShippedAssembly (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { shippeds: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Create Shipped Assembly
    // POST : /api/v1/createShippedAssembly
    // @return New create Shipped assembly detail
    createShippedAssembly: (req, res) => {
        const { ShippedAssembly, VUWorkorderProductionStk } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return VUWorkorderProductionStk.findOne({
                where: {
                    woID: { [Op.eq]: req.body.workorderID },
                    woOPID: { [Op.eq]: req.body.woOPID }
                },
                paranoid: false,
                attributes: ['StockQty', 'ShippedQty', 'ReadyForShippQty']
            }).then((shippedDetail) => {
                // check server side while add shipped data validation must be less than ready shipp quantity
                if (shippedDetail && req.body.shippedqty <= (parseFloat(shippedDetail.ReadyForShippQty))) {
                    return ShippedAssembly.create(req.body, {
                        fields: inputFields
                    }).then((shipped) => {
                        // [S] add log of create shipped assembly for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: ShipAssyConstObj.CREATE.title,
                            eventDescription: COMMON.stringFormat(ShipAssyConstObj.CREATE.description, req.body.woNumber
                                , req.body.shippedqty, req.user.username),
                            refTransTable: ShipAssyConstObj.refTransTableName,
                            refTransID: shipped.id,
                            eventType: timelineObjForShipAssy.id,
                            url: COMMON.stringFormat(ShipAssyConstObj.url, shipped.id),
                            eventAction: timelineEventActionConstObj.CREATE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of create shipped assembly for timeline users

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shipped, MESSAGE_CONSTANT.CREATED(shippedModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                        } else {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SHIPPED_INVALID_QTY, err: null, data: null });
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


    // Update Shipped Assembly
    // PUT : /api/v1/updateShippedAssembly
    // @param {id} int
    // @return Upadted Shipped Assembly details
    updateShippedAssembly: (req, res) => {
        const { VUWorkorderProductionStk, ShippedAssembly } = req.app.locals.models;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return VUWorkorderProductionStk.findOne({
                where: {
                    woID: { [Op.eq]: req.body.workorderID },
                    woOPID: { [Op.eq]: req.body.woOPID }
                },
                paranoid: false,
                attributes: ['StockQty', 'ShippedQty', 'ReadyForShippQty']
            }).then((shippedDetail) => {
                // check server side while add shipped data validation must be less than ready shipp quantity
                if (shippedDetail && req.body.shippedqty <= (parseFloat(shippedDetail.ReadyForShippQty) + parseFloat(req.body.shippedOldQty))) {
                    return ShippedAssembly.update(req.body, {
                        where: {
                            id: req.params.id,
                            isDeleted: false
                        },
                        fields: inputFields
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            // [S] add log of update shipped assembly for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: ShipAssyConstObj.UPDATE.title,
                                eventDescription: COMMON.stringFormat(ShipAssyConstObj.UPDATE.description, req.body.woNumber
                                    , req.body.shippedqty, req.user.username),
                                refTransTable: ShipAssyConstObj.refTransTableName,
                                refTransID: req.params.id,
                                eventType: timelineObjForShipAssy.id,
                                url: COMMON.stringFormat(ShipAssyConstObj.url, req.params.id),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of update shipped assembly for timeline users

                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(shippedModuleName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(shippedModuleName), err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                        } else {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SHIPPED_INVALID_QTY, err: null, data: null });
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
    // Remove shipped Assembly
    // PUT : /api/v1/deleteShippedAssembly
    // @param {id} int
    // @return Remove shipped Assembly details
    deleteShippedAssembly: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const currentModuleName = shippedModuleName;

        if (req.body.objIDs.id) {
            const tableName = 'shippedassembly';
            const entityID = null;
            const refrenceIDs = null;
           return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((shipped) => {
                if (shipped && (shipped.length > 0)) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: shipped, IDs: req.body.objIDs.id }, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, shipped, MESSAGE_CONSTANT.DELETED(currentModuleName));
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

    // get workorder list
    // POST : /api/v1/getWorkorderList
    // @return workorder list
    getWorkorderList: (req, res) => {
        const { Workorder } = req.app.locals.models;
        if (req.body) {
          return Workorder.findAll({
                where: {
                    isDeleted: false,
                    partID: req.body.workorderObj.partID,
                    woStatus: {
                        [Op.in]: req.body.workorderObj.woSubStatus
                    }
                },
                model: Workorder,
                attributes: ['woID', 'woNumber', 'partID']
            }).then(workorderlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorderlist, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* get all part list including assembly and work order supplies,material and tools which contain export controlled certification */
    // POST : /api/v1/shipped/getExportControlledAssyPartOfWO
    // @return component list
    getExportControlledAssyPartOfWO: (req, res) => {
        if (req.body && req.body.woID && req.body.woAssyID && req.body.shippingID) {
            const { sequelize } = req.app.locals.models;
           return sequelize.query('CALL Sproc_getExportControlledAssyPartOfWO (:pwoAssyID,:pwoID,:pshippingID)', {
                replacements: {
                    pwoAssyID: req.body.woAssyID,
                    pwoID: req.body.woID,
                    pshippingID: req.body.shippingID
                },
type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const errorMsgResp = response[0][0]['errorMsg'];
                let errorMsg = '';
                let exportControlledAssyPartList = [];
                if (errorMsgResp) {
                    switch (errorMsgResp) {
                        case 'ec1111':      // default company billing address not found
                            errorMsg = MESSAGE_CONSTANT.RECEIVING.DEFAULT_COMPNAY_BILL_ADDRESS_MISSING;
                            break;
                        case 'ec1112':      // customer shipping address not found
                            errorMsg = MESSAGE_CONSTANT.RECEIVING.CUST_SHIP_ADDRESS_MISSING;
                            break;
                        case 'ec1113':      // shipping not allowed
                            errorMsg = MESSAGE_CONSTANT.RECEIVING.SHIP_ADDRESS_COUNTRY_MISMATCH;
                            exportControlledAssyPartList = _.values(response[1]);
                            break;
                        case 'ec1114':      // all valid
                            errorMsg = '';
                            break;
                        default:
                            errorMsg = '';
                            break;
                    }
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { errorMsg: errorMsg, exportControlledAssyParts: exportControlledAssyPartList });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};
