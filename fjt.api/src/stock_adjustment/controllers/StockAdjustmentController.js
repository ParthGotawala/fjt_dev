const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const moduleName = DATA_CONSTANT.STOCKADJUSTMENT.NAME;
const inputFields = [
    'ID',
    'partID',
    'woNumber',
    'serialNo',
    'openingStock',
    'openingdate',
    'type',
    'woID',
    'binID',
    'whID',
    'cumulativeAssyQty',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Get detail of stock adjustment
    // GET : /api/v1/stockAdjustment
    // @param {id} int
    // @return detail of stock adjustment
    retrieveStockAdjustment: (req, res) => {
        if (req.params.id) {
            const { AssemblyStock, Component } = req.app.locals.models;
            return AssemblyStock.findOne({
                where: { id: req.params.id, isDeleted: false, type: 'AS' },
                attributes: ['ID', 'partID', 'woNumber', 'serialNo', 'openingStock', 'openingdate'],
                include: [
                    {
                        model: Component,
                        as: 'componentAssembly',
                        where: { isDeleted: false },
                        attributes: ['PIDCode'],
                        required: false
                    }]
            })
                .then((assemblyStock) => {
                    if (!assemblyStock) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assemblyStock, null);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of stock adjustment
    // POST : /api/v1/stockAdjustment/retrieveStockAdjustmentList
    // @return List of stock adjustment
    retrieveStockAdjustmentList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query(
                    'CALL Sproc_RetriveStockAdjustmentList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                )
                .then(response =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        {
                            stockAdjustment: _.values(response[1]),
                            Count: response[0][0].TotalRecord
                        },
                        null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create stockAdjustment
    // POST : /api/v1/stockAdjustment
    // @return new created stockAdjustment
    createStockAdjustment: (req, res) => {
        if (req.body && req.body.PIDCode) {
            const { AssemblyStock, BinMst } = req.app.locals.models;

            return BinMst.findOne({
                where: {
                    Name: req.body.PIDCode,
                    isActive: true
                },
                attributes: ['id', 'WarehouseID']
            }).then((binResp) => {
                if (!binResp) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null
                        });
                }
                COMMON.setModelCreatedByFieldValue(req);
                req.body.whID = binResp.dataValues.WarehouseID;
                req.body.binID = binResp.dataValues.id;

                return AssemblyStock.create(req.body, {
                    fields: inputFields
                }).then(assemblyStock =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assemblyStock, MESSAGE_CONSTANT.CREATED(moduleName)))
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err.errors.map(e => e.message).join(','),
                                    data: null
                                });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                                {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
                                });
                        }
                    });
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
        }
    },

    // Update stockAdjustment
    // PUT : /api/v1/stockAdjustment/:id
    // @param {id} int
    // @return API response
    updateStockAdjustment: (req, res) => {
        if (req.params.id) {
            const AssemblyStock = req.app.locals.models.AssemblyStock;

            return AssemblyStock.findByPk(req.params.id, {
                attributes: ['ID'],
                where: { isDeleted: false }
            }).then((ifExists) => {
                if (ifExists) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return AssemblyStock.update(req.body, {
                        where: {
                            ID: req.params.id
                        },
                        fields: ['serialNo', 'openingStock', 'updatedBy', 'updateByRoleId', 'updatedAt']
                    })
                        .then((rowsUpdated) => {
                            if (rowsUpdated[0] === 1) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rowsUpdated, MESSAGE_CONSTANT.UPDATED(moduleName));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY,
                                    {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                            }
                        })
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            if (
                                err.message === COMMON.VALIDATION_ERROR &&
                                err.errors &&
                                err.errors.length > 0
                            ) {
                                return resHandler.errorRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.FAILED,
                                    {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err.errors.map(e => e.message).join(','),
                                        data: null
                                    }
                                );
                            } else {
                                return resHandler.errorRes(
                                    res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY,
                                    {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    }
                                );
                            }
                        });
                } else {
                    return resHandler.errorRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.FAILED,
                        {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                            err: null,
                            data: null
                        }
                    );
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },

    // get workorder list
    // POST : /api/v1/stockAdjustment/getWorkorderList
    // @return workorder list
    getWorkorderList: (req, res) => {
        if (req.body && req.body.listObj) {
            const { AssemblyStock, Workorder } = req.app.locals.models;
            let whereClause = {};
            if (req.body.listObj.query) {
                whereClause = {
                    isDeleted: false,
                    woNumber: { [Op.like]: '%'.concat(req.body.listObj.query, '%') },
                    partID: req.body.listObj.partID
                };
            } else {
                whereClause = {
                    isDeleted: false,
                    partID: req.body.listObj.partID
                };
            }

            return AssemblyStock.findAll({
                where: whereClause,
                attributes: ['woNumber'],
                group: ['woNumber', 'workorder.woID'],
                include: [{
                    model: Workorder,
                    as: 'workorder',
                    attributes: ['woID'],
                    required: false
                }]
            }).then(workorderlist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorderlist, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },

    // get assyID list
    // POST : /api/v1/stockAdjustment/getAssemblyIDList
    // @return assyID list
    getAssemblyIDList: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.query) {
            const { sequelize } = req.app.locals.models;
            const likeQuery = '%'.concat(req.body.listObj.query, '%');
            return sequelize.query('CALL Sproc_getStockAdjustAssyIDList(:pWhereValue)', {
                replacements: {
                    pWhereValue: likeQuery
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then(assyIDList =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, Object.values(assyIDList[0]), null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },
    // get cummulative assy qty and available qty(assy+wo) of wo
    // POST : /api/v1/stockAdjustment/getAvailableQty
    // @return cummulative assy qty and available qty(assy+wo) of wo
    getAvailableQty: (req, res) => {
        if (req.body && req.body.woNumber && req.body.partID) {
            const { sequelize } = req.app.locals.models;

            return sequelize
                .query(
                    'CALL Sproc_getAssyQtyAndAvailableQty(:ppartID,:pwoNumber);',
                    {
                        replacements: {
                            ppartID: req.body.partID,
                            pwoNumber: req.body.woNumber.toString()
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                ).then((availableQty) => {
                    if (req.body.isCallFromInternalAPI) {
                        return availableQty && availableQty[0] ? availableQty[0][0] : null;
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { availableStock: _.values(availableQty[0]) }, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                }
            );
        }
    },
    // Delete stockAdjustment
    // DELETE : /api/v1/stockAdjustment/deleteStockAdjustment
    // @return API response
    deleteStockAdjustment: (req, res) => {
        if (req.body.objIDs && req.body.objIDs.id) {
            const { AssemblyStock, sequelize } = req.app.locals.models;
            const tableName = COMMON.AllEntityIDS.AssemblyStock.Name;
            const entityID = COMMON.AllEntityIDS.AssemblyStock.ID;

            return AssemblyStock.findAll({
                where: {
                    ID: { [Op.in]: req.body.objIDs.id }
                },
                attributes: ['ID']
            }).then((assyStockData) => {
                if (assyStockData.length === req.body.objIDs.id.length) {
                    return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                        replacements: {
                            tableName: tableName,
                            IDs: req.body.objIDs.id.toString(),
                            deletedBy: req.user.id,
                            entityID: entityID,
                            refrenceIDs: null,
                            countList: req.body.objIDs.CountList,
                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                        }
                    }).then((result) => {
                        if (result.length === 0) {
                            // in case of records deleted
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
                        } else {
                            // in case of dependent records exsist
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: result, IDs: req.body.objIDs.id }, null);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
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
