const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const resHandler = require('../../resHandler');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const currentModuleName = DATA_CONSTANT.Component_Price_Break_Details.PARTS_PRICE_PRICE_BREAK_NAME;
const assySalesPriceModuleName = DATA_CONSTANT.Component_Price_Break_Details.ASSEMBLY_SALES_PRICE;

// MODE FIELDS
const inputFields = [
    'id',
    'mfgPNID',
    'priceBreak',
    'unitPrice',
    'createdBy',
    'updatedBy',
    'deletedAt',
    'deletedBy',
    'updatedOn',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'type'
];

// to check valid price break value
const validatePriceBreak = (req, res, result) => {
    const priceBreak = {};
    if (result && result.length === 0) {
        priceBreak.isValidPriceBreak = true;
    } else if (result && result.length > 0) {
        // Check unique price break
        const findUniq = _.find(result, data => data.priceBreak === req.body.priceBreak);
        if (findUniq) {
            priceBreak.isSamePriceBreak = true;
        } else {
            const compareObj = _.maxBy(_.filter(result, data => req.body.priceBreak > data.priceBreak), 'priceBreak');
            const compareObjMin = _.maxBy(_.filter(result, data => req.body.priceBreak < data.priceBreak), 'priceBreak');
            if ((compareObj && req.body.priceBreak > compareObj.priceBreak && req.body.unitPrice > compareObj.unitPrice) || (compareObjMin && req.body.priceBreak < compareObjMin.priceBreak && req.body.unitPrice < compareObjMin.unitPrice)) {
                priceBreak.isValidPriceBreak = false;
            } else {
                priceBreak.isValidPriceBreak = true;
            }
        }
    } else {
        return priceBreak;
    }
    return priceBreak;
};

module.exports = {
    // Get List of ComponentPriceBreakDetails Class
    // GET : /api/v1/componentPriceBreakDetails/retrieveComponentPriceBreakDetailsList
    // @return retrive list of ComponentPriceBreakDetails Class
    retrieveComponentPriceBreakDetailsList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveComponentPriceBreakDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { componentpricebreakdetails: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of ComponentPriceBreakDetails Class
    // GET : /api/v1/componentPriceBreakDetails/:id
    // @param {id} int
    // @return retrive detail of ComponentPriceBreakDetails Class
    getComponentPriceBreakDetails: (req, res) => {
        const { ComponentPriceBreakDetails } = req.app.locals.models;
        if (req.params.Id) {
            return ComponentPriceBreakDetails.findByPk(req.params.Id).then((PriceBreak) => {
                if (!PriceBreak) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, PriceBreak, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create ComponentPriceBreakDetails Class
    // POST : /api/v1/componentPriceBreakDetails
    // @return New created ComponentPriceBreakDetails Class detail
    createComponentPriceBreakDetails: (req, res) => {
        const { ComponentPriceBreakDetails } = req.app.locals.models;
        return ComponentPriceBreakDetails.findAll({
            where: {
                [Op.and]: [{
                    mfgPNID: req.body.mfgPNID,
                    isDeleted: false
                }],
                type: DATA_CONSTANT.Component_Price_Break_Details.Type.PriceBreak
            },
            order: [['PriceBreak', 'ASC']]
        }).then((result) => {
            // pricebreak must greater than last price break details in qty more than last
            if (result) {
                const priceBreak = validatePriceBreak(req, res, result);
                if (priceBreak.isSamePriceBreak === true) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.PARTS.UNIQUE_PRICE_BREAK, err: null, data: null });
                } else if (priceBreak.isValidPriceBreak === false) {
                    const messageContentPriceBreakError = Object.assign({}, MESSAGE_CONSTANT.PARTS.PRICE_BREAK_VALIDATION_MESSAGE);
                    messageContentPriceBreakError.message = COMMON.stringFormat(messageContentPriceBreakError.message, req.body.priceBreak);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContentPriceBreakError, err: null, data: null });
                } else if (priceBreak.isValidPriceBreak === true) {
                    req.body.updatedOn = COMMON.getCurrentUTC();
                    req.body.type = DATA_CONSTANT.Component_Price_Break_Details.Type.PriceBreak;
                    COMMON.setModelCreatedByFieldValue(req);
                    return ComponentPriceBreakDetails.create(req.body, {
                        fields: inputFields
                    }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(currentModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Update ComponentPriceBreakDetails Class
    // PUT : /api/v1/componentPriceBreakDetails
    // @return API Response
    updateComponentPriceBreakDetails: (req, res) => {
        if (req.body) {
            const { ComponentPriceBreakDetails } = req.app.locals.models;
            ComponentPriceBreakDetails.findAll({
                where: {
                    [Op.and]: [{
                        isDeleted: false,
                        mfgPNID: req.body.mfgPNID,
                        id: {
                            [Op.ne]: req.body.id
                        },
                        type: DATA_CONSTANT.Component_Price_Break_Details.Type.PriceBreak
                    }]
                }
            }).then((result) => {
                // pricebreak must greater than last price break details in qty more than last
                if (result) {
                    const priceBreak = validatePriceBreak(req, res, result);
                    if (priceBreak.isSamePriceBreak === true) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.PARTS.UNIQUE_PRICE_BREAK, err: null, data: null });
                    } else if (priceBreak.isValidPriceBreak === false) {
                        const messageContentPriceBreakError = Object.assign({}, MESSAGE_CONSTANT.PARTS.PRICE_BREAK_VALIDATION_MESSAGE);
                        messageContentPriceBreakError.message = COMMON.stringFormat(messageContentPriceBreakError.message, req.body.priceBreak);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContentPriceBreakError, err: null, data: null });
                    } else if (priceBreak.isValidPriceBreak === true) {
                        return ComponentPriceBreakDetails.count({
                            where: {
                                isDeleted: false,
                                id: req.body.id,
                                type: DATA_CONSTANT.Component_Price_Break_Details.Type.PriceBreak
                            }
                        }).then((count) => {
                            if (count === 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(currentModuleName), err: null, data: null });
                            } else {
                                COMMON.setModelUpdatedByFieldValue(req);
                                return ComponentPriceBreakDetails.update(req.body, {
                                    where: {
                                        id: req.body.id
                                    },
                                    fields: inputFields
                                }).then((rowsUpdated) => {
                                    if (rowsUpdated[0] === 1) {
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(currentModuleName));
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(currentModuleName), err: null, data: null });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // Delete ComponentPriceBreakDetails Class
    // DELETE : /api/v1/componentPriceBreakDetails
    // @return API response
    deletePriceBreakDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Component_Price_Break_Details.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((priceBreakDetail) => {
                if (priceBreakDetail.length > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, priceBreakDetail, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: priceBreakDetail, IDs: req.body.objIDs.id }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create Assembly Sales Price
    // POST : /api/v1/componentPriceBreakDetails
    // @return Assembly Sales Price
    saveAssySalesPrice: (req, res) => {
        const {
            sequelize,
            Component,
            ComponentPriceBreakDetails
        } = req.app.locals.models;
        var promiseDelete = [];
        var promiseAddUpdate = [];
        if (req.body && req.body.salesPriceObj) {
            return sequelize.transaction().then((t) => {
                const deletedIds = req.body.salesPriceObj.deletedIds;
                if (deletedIds && deletedIds.length > 0) {
                    const deleteObj = {
                        isDeleted: true,
                        deletedBy: COMMON.getRequestUserID(req),
                        deleteByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        deletedAt: COMMON.getCurrentUTC()
                    };
                    promiseDelete.push(
                        ComponentPriceBreakDetails.update(deleteObj, {
                            where: {
                                id: {
                                    [Op.in]: _.map(deletedIds, 'id')
                                },
                                type: DATA_CONSTANT.Component_Price_Break_Details.Type.AssySalesPrice,
                                isHistory: false/* ,
                                mfgPNID: req.body.salesPriceObj.mfgPNID*/
                            },
                            transaction: t
                        }).then((deletedRes) => {
                            if (!deletedRes || !deletedRes[0]) {
                                return {
                                    status: STATE.FAILED
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
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                error: err
                            };
                        })
                    );
                }
                return Promise.all(promiseDelete).then((retresponse) => {
                    var resObj = _.find(retresponse, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(assySalesPriceModuleName),
                            err: resObj.error,
                            data: null
                        });
                    } else {
                        const updatedRecords = req.body.salesPriceObj.updatedRecords;
                        if (updatedRecords && updatedRecords.length > 0) {
                            _.each(updatedRecords, (item) => {
                                promiseAddUpdate.push(module.exports.udpateSalesPricePromise(req, item, t));
                            });
                        }
                        const addedRecords = req.body.salesPriceObj.addedRecords;
                        if (addedRecords && addedRecords.length > 0) {
                            _.each(addedRecords, (item) => {
                                promiseAddUpdate.push(module.exports.createSalesPricePromise(req, item, t));
                            });
                        }

                        const componentObj = {
                            rfqNumber: req.body.salesPriceObj.isReQuote ? null : (req.body.salesPriceObj.rfqNumber || null),
                            quoteValidTillDate: req.body.salesPriceObj.isReQuote ? null : (req.body.salesPriceObj.quoteValidTillDate || null),
                            updatedAt: COMMON.getCurrentUTC(),
                            updatedBy: COMMON.getRequestUserID(req),
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                        };
                        promiseAddUpdate.push(
                            Component.update(componentObj, {
                                where: {
                                    id: req.body.salesPriceObj.mfgPNID,
                                    isDeleted: false
                                },
                                transaction: t
                            }).then(() => ({
                                status: STATE.SUCCESS
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                return {
                                    status: STATE.FAILED,
                                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                                };
                            })
                        );

                        return Promise.all(promiseAddUpdate).then((response) => {
                            var resObjAddUpdate = _.find(response, resp => resp.status === STATE.FAILED);
                            if (resObjAddUpdate) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                if (resObjAddUpdate.message) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: resObjAddUpdate.message,
                                        err: resObjAddUpdate.err,
                                        data: null
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(assySalesPriceModuleName),
                                        err: resObjAddUpdate.err,
                                        data: null
                                    });
                                }
                            } else {
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(assySalesPriceModuleName)));
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(assySalesPriceModuleName),
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // to be called in promise from API only
    udpateSalesPricePromise: (req, updateObj, t) => {
        const {
            ComponentPriceBreakDetails
        } = req.app.locals.models;
        var promises = [];
        if (updateObj) {
            promises.push(module.exports.assySalesPriceDuplicateValidationPromise(req, updateObj, t));
            return Promise.all(promises).then((response) => {
                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resObj;
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    const obj = {
                        priceBreak: updateObj.priceBreak,
                        turnTime: updateObj.turnTime,
                        unitOfTime: updateObj.unitOfTime,
                        unitPrice: updateObj.unitPrice,
                        salesCommissionPercentage: updateObj.salesCommissionPercentage,
                        salesCommissionAmount: updateObj.salesCommissionAmount,
                        salesCommissionNotes: updateObj.salesCommissionNotes,
                        isHistory: updateObj.isHistory,
                        updatedAt: COMMON.getCurrentUTC(),
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };

                    return ComponentPriceBreakDetails.update(obj, {
                        where: {
                            id: updateObj.id,
                            type: DATA_CONSTANT.Component_Price_Break_Details.Type.AssySalesPrice
                        },
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS,
                        id: updateObj.id
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.NOT_CREATED(assySalesPriceModuleName),
                            err: err
                        };
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // to be called in promise from API only
    createSalesPricePromise: (req, createObj, t) => {
        const {
            ComponentPriceBreakDetails
        } = req.app.locals.models;
        var promises = [];
        if (createObj) {
            promises.push(module.exports.assySalesPriceDuplicateValidationPromise(req, createObj, t));
            return Promise.all(promises).then((response) => {
                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                if (resObj) {
                    return resObj;
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    const obj = {
                        mfgPNID: req.body.salesPriceObj.mfgPNID,
                        rfqNumber: req.body.salesPriceObj.rfqNumber,
                        type: DATA_CONSTANT.Component_Price_Break_Details.Type.AssySalesPrice,
                        priceBreak: createObj.priceBreak,
                        turnTime: createObj.turnTime,
                        unitOfTime: createObj.unitOfTime,
                        unitPrice: createObj.unitPrice,
                        salesCommissionPercentage: createObj.salesCommissionPercentage,
                        salesCommissionAmount: createObj.salesCommissionAmount,
                        salesCommissionNotes: createObj.salesCommissionNotes,
                        isHistory: createObj.isHistory,
                        createdBy: req.body.createdBy,
                        updatedBy: req.body.createdBy,
                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updatedOn: COMMON.getCurrentUTC(),
                        isDeleted: 0
                    };

                    return ComponentPriceBreakDetails.create(obj, {
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS,
                        id: createObj.id
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.NOT_CREATED(assySalesPriceModuleName),
                            err: err,
                            data: null
                        };
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // to be called in promise from API only
    assySalesPriceDuplicateValidationPromise: (req, objValues, t) => {
        const {
            ComponentPriceBreakDetails
        } = req.app.locals.models;
        if (req.body) {
            const whereCriteria = {
                type: DATA_CONSTANT.Component_Price_Break_Details.Type.AssySalesPrice,
                mfgPNID: req.body.salesPriceObj.mfgPNID,
                priceBreak: objValues.priceBreak,
                turnTime: objValues.turnTime,
                unitOfTime: objValues.unitOfTime,
                isHistory: false,
                isDeleted: 0
            };
            if (objValues.id > 0) {
                whereCriteria.id = {
                    [Op.ne]: objValues.id
                };
            }
            return ComponentPriceBreakDetails.findOne({
                where: whereCriteria,
                transaction: t
            }).then((isexist) => {
                if (isexist) {
                    const messageObj = Object.assign({}, MESSAGE_CONSTANT.PARTS.COMPONENT_ASSY_SALES_PRICE_DUPLICATE);
                    let unitOfTimeText = 'Business Days';
                    if (isexist.unitOfTime === 'D') {
                        unitOfTimeText = 'Weekdays';
                    } else if (isexist.unitOfTime === 'W') {
                        unitOfTimeText = 'Week';
                    }
                    messageObj.message = COMMON.stringFormat(messageObj.message, isexist.priceBreak, isexist.turnTime, unitOfTimeText);
                    return {
                        status: STATE.FAILED,
                        message: messageObj
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
                    message: MESSAGE_CONSTANT.NOT_CREATED(assySalesPriceModuleName)
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // get Assembly Sales Price List
    // POST : /api/v1/componentPriceBreakDetails
    // @return get Assembly Sales Price List
    getAssySalesPriceListByAssyId: (req, res) => {
        const {
            ComponentPriceBreakDetails
        } = req.app.locals.models;
        if (req.body.partId) {
            const whereclause = {
                mfgPNID: req.body.partId,
                type: DATA_CONSTANT.Component_Price_Break_Details.Type.AssySalesPrice,
                isHistory: req.body.isHistory ? true : false,
                isDeleted: false
            };
            if (req.body.rfqQuoteNumber) {
                whereclause.rfqNumber = req.body.rfqQuoteNumber;
            }
            return ComponentPriceBreakDetails.findAll({
                where: whereclause,
                attributes: ['id', 'mfgPNID', 'priceBreak', 'unitPrice', 'turnTime', 'unitOfTime', 'salesCommissionPercentage', 'salesCommissionAmount', 'salesCommissionNotes', 'rfqNumber', 'isHistory', 'rfqAssyID'],
                order: [['PriceBreak', 'ASC'], ['turnTime', 'ASC']]
            }).then(component =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, component, null)
            ).catch((err) => {
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

    // get Sales Commission History list
    // POST :/api/v1/componentPriceBreakDetails/getSalesCommissionDetailsFromRfq
    // @return Sales Commission Details From Rfq
    getSalesCommissionDetailsFromRfq: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.transaction().then(t =>
                sequelize.query('CALL Sproc_getSalesCommissionDetailsFromRfq(:pPartId,:pRfqQuoteNumber,:pIsPushToPartMaster,:pUserId,:pRoleId,:pIsCallFromPartMaster,:pProceedOverriderQuote)', {
                    replacements: {
                        pPartId: req.body.partId || null,
                        pRfqQuoteNumber: req.body.rfqQuoteNumber || null,
                        pIsPushToPartMaster: req.body.isPushToPartMaster || false,
                        pUserId: COMMON.getRequestUserID(req),
                        pRoleId: COMMON.getRequestUserLoginRoleID(req),
                        pIsCallFromPartMaster: req.body.isCallFromPartMaster || false,
                        pProceedOverriderQuote: req.body.proceedOverriderQuote || false
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    const responseDetail = _.values(response[0])[0];
                    if (responseDetail && responseDetail.alreadyExistQuote) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
                    } else {
                        return t.commit().then(() => {
                            let messageContent = null;
                            // if (req.body.isPushToPartMaster) {
                            //     messageContent = MESSAGE_CONSTANT.RFQ.QUOTE_DATA_PUSHED_SUCCESSFULLY;
                            // }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                salesCommissionDetails: _.values(response[0])
                            }, messageContent);
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                })
            ).catch((err) => {
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
    // get Sales Commission Details From Rfq History
    // GET :/api/v1/componentPriceBreakDetails/getSalesCommissionHistoryList
    // @return Sales Commission Details RFQ History
    getSalesCommissionHistoryList: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_GetComponentSalesPriceHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pmfgPnID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pmfgPnID: req.body.partId
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                quoteHistoryList: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
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
    // Get Sales Commission History Details
    // GET : /api/v1/componentPriceBreakDetails/getSalesCommissionHistoryDetList
    // @return API response
    getSalesCommissionHistoryDetList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        if (req.body) {
            return sequelize.query('CALL Sproc_GetComponentSalesPriceHistoryDetail (:pOrderBy,:pWhereClause,:pmfgPnID,:prfqNumber)',
                {
                    replacements: {
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pmfgPnID: req.body.partId,
                        prfqNumber: req.body.rfqNumber
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                        { historyDetail: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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