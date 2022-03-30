/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const reserveStockRequestModuleName = DATA_CONSTANT.RESERVE_STOCK_REQUEST.Name;
const reserveStockRequestInputFields = [
    'id',
    'partID',
    'customerID',
    'nickName',
    'assyID',
    'transactionDate',
    'count',
    'unit',
    'uom',
    'description',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrieve list of packing slip
    // GET : /api/v1/reserve_stock_request/getRequestList
    // @return list of reserve stock request
    getRequestList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        if (req.query.chequeNumber) { filter.where.chequeNumber = req.query.chequeNumber; }
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveReserveStockRequestList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                pPageIndex: req.query.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { stockRequestList: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get detail of reserve stock request
    // GET : /api/v1/reserve_stock_request/getRequestDet/:id
    // @return detail of reserve stock request
    getRequestDet: (req, res) => {
        const { Component, MfgCodeMst, RFQRoHS, UOMs, ReserveStockRequest } = req.app.locals.models;

        if (req.params.id) {
            return ReserveStockRequest.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'mfgcodeID', 'mfgPN', 'RoHSStatusID', 'uom'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    },
                    {
                        model: UOMs,
                        as: 'UOMs',
                        attributes: ['id', 'abbreviation', 'unitName'],
                        required: false
                    },
                    {
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'rohsIcon', 'name'],
                        required: false
                    }]
                }, {
                    model: Component,
                    as: 'assembly',
                    attributes: ['id', 'PIDCode'],
                    required: false
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.FAILED, null, MESSAGE_CONSTANT.NOT_FOUND(reserveStockRequestModuleName));
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Add/Update reserve stock request
    // POST : /api/v1/reserve_stock_request/saveRequest
    saveRequest: (req, res) => {
        const { ReserveStockRequest } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            ReserveStockRequest.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: reserveStockRequestInputFields
            }).then((response) => {
                // Update Reserve Stock Request detail into Elastic Search Engine for Enterprise Search
                if (req.body.id) {
                    req.params['pId'] = req.body.id;
                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageReserveStockRequestInElastic);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(reserveStockRequestModuleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            COMMON.setModelCreatedByFieldValue(req);
            ReserveStockRequest.create(req.body, {
                fields: reserveStockRequestInputFields
            }).then((response) => {
                // Add Reserve Stock Request detail into Elastic Search Engine for Enterprise Search
                if (response.id) {
                    req.params['pId'] = response.id;
                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageReserveStockRequestInElastic);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(reserveStockRequestModuleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },

    // Delete reserve stock request (soft delete)
    // POST : /api/v1/reserve_stock_request/deleteRequest
    deleteRequest: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const currentModuleName = reserveStockRequestModuleName;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.ReserveStockRequest.Name;
            const entityID = COMMON.AllEntityIDS.ReserveStockRequest.ID;
            const refrenceIDs = null;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                const requestDetail = response[0];
                if (requestDetail && requestDetail.TotalCount === 0) {
                    // Delete Reserve Stock Request record from Elastic engine
                    if (req.body.objIDs.id && req.body.objIDs.id.toString()) {
                        EnterpriseSearchController.deleteReserveStockRequestInElastic(req.body.objIDs.id.toString());
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, requestDetail, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, requestDetail, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    }
};