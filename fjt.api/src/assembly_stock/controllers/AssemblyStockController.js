const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const StockAdjustmentController = require('../../stock_adjustment/controllers/StockAdjustmentController');

const inputFields = [
    'openingStock',
    'openingdate',
    'woNumber',
    'serialNo',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'partID',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'type',
    'whID',
    'binID',
    'dateCode',
    'poNumber',
    'dateCodeFormat',
    'poQty',
    'soNumber',
    'refSalesOrderDetID',
    'refSalesOrderID',
    'isPOAdded'
];

const moduleName = DATA_CONSTANT.ASSEMBLY_STOCK.DISPLAYNAME;

module.exports = {
    // Get List of AssemblyStock
    // GET : /api/v1/assemblyStocks/retriveAssemblyStockList
    // @return retrive list of AssemblyStock
    retriveAssemblyStockList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        sequelize
            .query('CALL Sproc_GetAssemblyStock (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pStockType)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: req.body.isExport ? null: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pStockType: req.body.stockType.toString() || 'OS'
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                stock: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },
    // Get List of AssemblyStock
    // GET : /api/v1/assemblyStocks
    // @param {id} int
    // @return retrive list of AssemblyStock
    retriveAssemblyStock: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.id) {
            return sequelize
                .query('CALL Sproc_GetAssyStockDetailByID (:passyStockID)', {
                    replacements: {
                        passyStockID: req.params.id
                    }
                }).then((type) => {
                    if (!type) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                            err: null,
                            data: null
                        });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, type, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },
    workOrderUniqueValidationPromise: (req) => {
        const { Workorder } = req.app.locals.models;
        if (req.body && req.body.woNumber) {
            return Workorder.findOne({
                where: {
                    woNumber: req.body.woNumber,
                    isDeleted: false
                },
                attributes: ['woID', 'woNumber']
            }).then((existWODet) => {
                if (existWODet) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_EXISTS_IN_PROD_FOR_SAVE_OPENING_PART_BAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, existWODet.dataValues.woNumber);
                    return {
                        status: STATE.FAILED,
                        message: messageContent
                    };
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // Create AssemblyStock
    // POST : /api/v1/assemblyStocks
    // @return API response
    createAssemblyStock: (req, res) => {
        const {
            AssemblyStock
        } = req.app.locals.models;
        var promises = [];
        if (req.body && req.body.woNumber) {
            if (DATA_CONSTANT.ProdWONumPatternNotAllowedForOtherTypeWONum.test(req.body.woNumber.toUpperCase())) {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_EXISTS_IN_PROD_FOR_SAVE_OPENING_PART_BAL);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'WOXXXXX-XX');
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: messageContent,
                    err: null,
                    data: null
                });
            }

            COMMON.setModelCreatedByFieldValue(req);
            promises.push(module.exports.workOrderUniqueValidationPromise(req));
            return Promise.all(promises).then((response) => {
                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    if (resObj.message) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: resObj.message,
                            err: null,
                            data: null
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(moduleName),
                            err: null,
                            data: null
                        });
                    }
                } else {
                    return AssemblyStock.create(req.body, {
                        fields: inputFields
                    }).then(assStock => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assStock, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
    // Update AssemblyStock
    // PUT : /api/v1/assemblyStocks
    // @param {id} int
    // @return API response
    updateAssemblyStock: (req, res) => {
        const {
            AssemblyStock
        } = req.app.locals.models;
        var promises = [];

        if (req.params.id && req.body.woNumber) {
            return AssemblyStock.findOne({
                where: {
                    ID: req.params.id,
                    isDeleted: false
                },
                attributes: ['openingStock']
            }).then((respOfAssyStockDBDet) => {
                if (!respOfAssyStockDBDet) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null
                    });
                }

                if (DATA_CONSTANT.ProdWONumPatternNotAllowedForOtherTypeWONum.test(req.body.woNumber.toUpperCase())) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_EXISTS_IN_PROD_FOR_SAVE_OPENING_PART_BAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'WOXXXXX-XX');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                }

                promises.push(module.exports.workOrderUniqueValidationPromise(req));
                return Promise.all(promises).then((response) => {
                    var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        if (resObj.message) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: resObj.message,
                                err: null,
                                data: null
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        }
                    } else {
                        // check how much opening stock allowed to change. if less than min qty then error
                        req.body.isCallFromInternalAPI = true;
                        return StockAdjustmentController.getAvailableQty(req, res, true).then((respOfAvailStock) => {
                            if (respOfAvailStock) {
                                let openingStockRequiredMinQty = 0;
                                const currWOQtyExcludeUMIDQty = respOfAvailStock.actualAvalilableQty - (respOfAssyStockDBDet.openingStock || 0);
                                if (currWOQtyExcludeUMIDQty >= 0) {
                                    openingStockRequiredMinQty = 0;
                                } else {
                                    openingStockRequiredMinQty = Math.abs(currWOQtyExcludeUMIDQty);
                                }

                                if (req.body.openingStock < openingStockRequiredMinQty) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: null,
                                        err: null,
                                        data: {
                                            openingStockMinQtyRequiredValidation: true,
                                            openingStockRequiredMinQty: openingStockRequiredMinQty
                                        }
                                    });
                                }
                            }

                            COMMON.setModelUpdatedByFieldValue(req);
                            return AssemblyStock.update(req.body, {
                                where: {
                                    ID: req.params.id
                                },
                                fields: inputFields
                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
    // Delete AssemblyStock
    // DELETE : /api/v1/assemblyStocks
    // @param {id} int
    // @return API response
    deleteAssemblyStock: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_DeleteAssemblyInitialStock (:pAssyStockMstIDs,:pUserID,:pUserRoleID)', {
                replacements: {
                    pAssyStockMstIDs: req.body.objIDs.id.toString(),
                    pUserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID
                },
                transaction: t
            }).then((respOfDeleteAssyStock) => {
                const respOfDeleteAssyStockList = respOfDeleteAssyStock;
                if (!respOfDeleteAssyStockList) {
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
                } else {
                    if (req.body.objIDs.id.length === respOfDeleteAssyStockList.length) {
                        if (!t.finished) { t.rollback(); }
                    } else {
                        t.commit();
                    }
                    if (respOfDeleteAssyStockList.length === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
                    } else {
                        // this is success with list of failed records
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: null,
                            err: null,
                            data: {
                                notAllowedToDeleteAssyStockList: respOfDeleteAssyStockList
                            }
                        });
                    }
                }
            }).catch((err) => {
                if (!t.finished) { t.rollback(); }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
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
    // get same Assembly Stock work order details if entry already exists
    // POST : /api/v1/assemblyStocks/getSameAssyStockWOEntryData
    // @param {assyID} int , {woNumber} varchar
    // @return API response with data if contain
    getSameAssyStockWOEntryData: (req, res) => {
        if (req.body && req.body.assyID && req.body.woNumber) {
            const promises = [];
            const { AssemblyStock, Component, SalesOrderDet, SalesOrderMst } = req.app.locals.models;
            // Check WO# used with other assembly
            promises.push(AssemblyStock.findAll({
                where: {
                    partID: { [Op.ne]: req.body.assyID },
                    woNumber: req.body.woNumber
                },
                attributes: ['partID'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['assyCode', 'mfgPN', 'PIDCode'],
                    required: false
                }
                ]
            }).then((duplicateWOResp) => {
                if (duplicateWOResp && duplicateWOResp.length === 0) {
                    return { status: STATE.SUCCESS };
                } else {
                    const detail = _.values(duplicateWOResp[0])[0].componentAssembly;
                    return { status: STATE.FAILED, duplicateWO: true, mfgPN: detail.mfgPN, PIDCode: detail.PIDCode };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            }));
            // Get existing WO# detail
            promises.push(AssemblyStock.findAll({
                where: {
                    partID: req.body.assyID,
                    woNumber: req.body.woNumber,
                    type: 'OS'
                },
                attributes: ['ID', 'poNumber', 'dateCodeFormat', 'dateCode', 'soNumber', 'isPOAdded', 'poQty', 'refSalesOrderDetID', 'refSalesOrderID', 'poQty', 'createdAt'],
                include: [{
                    model: SalesOrderDet,
                    as: 'assemblySalesOrderDet',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['originalPOQty', 'qty'],
                    required: false
                },
                {
                    model: SalesOrderMst,
                    as: 'assemblySalesOrderMst',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['isLegacyPO', 'poRevision'],
                    required: false
                }]
            }).then(respOfAssyStockList => ({ status: STATE.SUCCESS, data: respOfAssyStockList })).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            }));
            return Promise.all(promises).then((respOfPromises) => {
                if (respOfPromises && respOfPromises.length > 0 && respOfPromises[0].status === STATE.SUCCESS) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, respOfPromises[1].data, null);
                } else {
                    if (respOfPromises[0].duplicateWO) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.WO_SERIES_ALREADY_EXISTS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.woNumber, respOfPromises[0].mfgPN, respOfPromises[0].PIDCode);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: respOfPromises[0].err, data: null });
                    }
                }
            }).catch((err) => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    }
};