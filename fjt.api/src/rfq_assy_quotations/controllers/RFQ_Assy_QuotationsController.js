/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const { NotCreate } = require('../../errors');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const _ = require('lodash');
const { Op } = require('sequelize');

const inputFields = [
    'rfqAssyID',
    'rfqAssyQtyID',
    'rfqAssyQtyTurnTimeID',
    'requestedQty',
    'turnTime',
    'timeType',
    'unitPrice',
    'materialCost',
    'excessQtyTotalPrice',
    'days',
    'total',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'manualTurnTime',
    'manualTurnType',
    'nonQuotedConsolidatelineItemIDs',
    'historyID'
];
const inputassyQuoteFields = [
    'rfqAssyID',
    'quoteNumber',
    'quoteInDate',
    'quoteDueDate',
    'quoteSubmitDate',
    'bomInternalVersion',
    'bomLastVersion',
    'BOMIssues',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt'
];
const summaryModuleName = DATA_CONSTANT.SUMMARY_QUOTE.NAME;

module.exports = {

    // Save Quote for summary
    // GET : /api/v1/summaryquote/saveSummaryQuote
    // @return saved part for
    saveSummaryQuote: (req, res) => {
        const { sequelize, RFQAssyQuotations, RFQAssembliesQuotationSubmitted, RFQAssemblies } = req.app.locals.models;
        if (req.body.summaryQuoteObj) {
            const summaryObject = req.body.summaryQuoteObj;
            const summaryQuoteObj = summaryObject.summaryQuote ? summaryObject.summaryQuote : summaryObject;
            const rfqAssyID = summaryObject.rfqAssyID;
            const isSubmit = summaryObject.isFinalSubmit;
            const promises = [];
            if (isSubmit) {
                return sequelize.transaction().then((t) => {
                    var date = new Date();
                    var year = date.getFullYear().toString();
                    var month = (date.getMonth() + 1).toString();
                    var day = date.getDate().toString();
                    var num = `%${year.slice(2, 4) + (`0${month}`).slice(-2) + (`0${day}`).slice(-2)}-%`;
                    RFQAssembliesQuotationSubmitted.findOne({
                        where: {
                            quoteNumber: { [Op.like]: num }
                        },
                        attributes: ['id', 'rfqAssyID', 'quoteNumber'],
                        order: [['id', 'DESC']]
                    }).then((assyQuote) => {
                        if (assyQuote) {
                            let QuoteNumber = assyQuote.quoteNumber.split('-');
                            const dateDet = new Date();
                            const yearDet = dateDet.getFullYear().toString();
                            const monthDet = (dateDet.getMonth() + 1).toString();
                            const dayDet = dateDet.getDate().toString();
                            QuoteNumber = QuoteNumber[1].split(' ');
                            QuoteNumber = parseInt(QuoteNumber[0]);
                            num = `Q${yearDet.slice(2, 4) + (`0${monthDet}`).slice(-2) + (`0${dayDet}`).slice(-2)}-`;
                            num += (QuoteNumber + 1);
                            const objAssyQuote = {
                                rfqAssyID: rfqAssyID,
                                quoteNumber: num,
                                quoteInDate: req.body.summaryQuoteObj.QuoteInDate,
                                quoteDueDate: req.body.summaryQuoteObj.QuoteDueDate,
                                quoteSubmitDate: new Date(),
                                bomInternalVersion: req.body.summaryQuoteObj.internalVersion || '123',
                                BOMIssues: req.body.summaryQuoteObj.BOMIssue,
                                bomLastVersion: req.body.summaryQuoteObj.bomLastVersion,
                                createdBy: req.user.id,
                                id: req.body.summaryQuoteObj.quoteID
                            };

                            return RFQAssembliesQuotationSubmitted.update(objAssyQuote, {
                                where: {
                                    id: req.body.summaryQuoteObj.quoteID
                                },
                                fields: inputassyQuoteFields,
                                transaction: t
                            }).then(() => {
                                var objAssembly = {
                                    updatedBy: req.user.id,
                                    quoteNumber: num,
                                    quoteSubmitDate: new Date(),
                                    isSummaryComplete: true,
                                    quoteSubmittedBy: req.user.id,
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                    isCustomPartDetShowInReport: req.body.summaryQuoteObj.isCustomPartDetShowInReport
                                };
                                return RFQAssemblies.update(objAssembly, {
                                    where: {
                                        id: rfqAssyID,
                                        isDeleted: false
                                    },
                                    fields: ['quoteNumber', 'quoteSubmittedBy', 'quoteSubmitDate', 'isSummaryComplete', 'updatedBy', 'updateByRoleId', 'isCustomPartDetShowInReport'],
                                    transaction: t
                                }).then(() => {
                                    _.each(summaryQuoteObj, (summary) => {
                                        promises.push(RFQAssyQuotations.findOne({
                                            where: {
                                                rfqAssyID: summary.rfqAssyID,
                                                rfqAssyQtyID: summary.rfqAssyQtyID,
                                                rfqAssyQtyTurnTimeID: summary.rfqAssyQtyTurnTimeID,
                                                refSubmittedQuoteID: null
                                            },
                                            transaction: t,
                                            attributes: ['id', 'requestedQty']
                                        }).then((quote) => {
                                            if (quote && quote.id) {
                                                summary.id = quote.id;
                                                summary.updatedBy = req.user.id;
                                                summary.refSubmittedQuoteID = req.body.summaryQuoteObj.quoteID;
                                                return RFQAssyQuotations.update(summary, {
                                                    where: {
                                                        id: quote.id,
                                                        IsDeleted: false
                                                    },
                                                    transaction: t,
                                                    fields: ['id', 'unitPrice', 'materialCost', 'excessQtyTotalPrice', 'total', 'updatedBy', 'days', 'refSubmittedQuoteID', 'manualTurnTime', 'manualTurnType', 'turnTime', 'timeType', 'laborCost', 'laborDays', 'materialDays', 'nreDays', 'nreCost', 'nonQuotedConsolidatelineItemIDs', 'historyID', 'toolingDays', 'toolingCost', 'laborunitPrice', 'laborday', 'overheadCost', 'overheadDays', 'allCost', 'allDays', 'overheadUnitPrice', 'overheadDay']
                                                }).then(() => {
                                                    const addditionalCostPromise = [];
                                                    if (summary.rfqAssyQuotationsAdditionalCost) {
                                                        addditionalCostPromise.push(module.exports.saveAdditionalCost(req, summary.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalcost => resAdditionalcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    }
                                                    if (summary.deletedrfqAssyQuotationsAdditionalCost && summary.deletedrfqAssyQuotationsAdditionalCost.length > 0) {
                                                        addditionalCostPromise.push(module.exports.removeAdditionalCost(req, summary.deletedrfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost));
                                                    }
                                                    if (summary.customPartList) {
                                                        _.each(summary.customPartList, (objcustPart) => {
                                                            objcustPart.rfqAssyQuoteId = quote.id;
                                                        });
                                                        addditionalCostPromise.push(module.exports.saveCustomPartCost(req, summary.customPartList, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    } else if (summary.id) {
                                                        addditionalCostPromise.push(module.exports.deleteCustomPartCost(req, summary.id, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    }
                                                    return Promise.all(addditionalCostPromise).then((responses) => {
                                                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                                        if (promisResObj) {
                                                            return STATE.FAILED;
                                                        } else {
                                                            return STATE.SUCCESS;
                                                        }
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return STATE.FAILED;
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return STATE.FAILED;
                                                });
                                            } else {
                                                summary.createdBy = req.user.id;
                                                summary.refSubmittedQuoteID = req.body.summaryQuoteObj.quoteID;
                                                return RFQAssyQuotations.create(summary, {
                                                    fields: inputFields,
                                                    transaction: t
                                                }).then((resAssyQuote) => {
                                                    const addditionalCostPromise = [];
                                                    if (summary.rfqAssyQuotationsAdditionalCost) {
                                                        _.each(summary.rfqAssyQuotationsAdditionalCost, (objAddCost) => {
                                                            objAddCost.rfqAssyQuoteID = resAssyQuote.id;
                                                        });
                                                        addditionalCostPromise.push(module.exports.saveAdditionalCost(req, summary.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost));
                                                    }
                                                    if (summary.deletedrfqAssyQuotationsAdditionalCost && summary.deletedrfqAssyQuotationsAdditionalCost.length > 0) {
                                                        addditionalCostPromise.push(module.exports.removeAdditionalCost(req, summary.deletedrfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost));
                                                    }
                                                    if (summary.customPartList) {
                                                        _.each(summary.customPartList, (objcustPart) => {
                                                            objcustPart.rfqAssyQuoteId = resAssyQuote.id;
                                                        });
                                                        addditionalCostPromise.push(module.exports.saveCustomPartCost(req, summary.customPartList, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    } else if (summary.id) {
                                                        addditionalCostPromise.push(module.exports.deleteCustomPartCost(req, summary.id, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    }
                                                    return Promise.all(addditionalCostPromise).then((responses) => {
                                                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                                        if (promisResObj) {
                                                            return STATE.FAILED;
                                                        } else {
                                                            return STATE.SUCCESS;
                                                        }
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return STATE.FAILED;
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return STATE.FAILED;
                                                });
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        }));
                                    });

                                    Promise.all(promises).then((responses) => {
                                        var promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                        if (promisResObj) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(summaryModuleName)),
                                                null, null);
                                        } else {
                                            return t.commit().then(() => sequelize.query('CALL Sproc_CreateQuoteSubmittedSummaryDetails (:prfqAssyID,:pUserID,:pRoleID)', {
                                                replacements: {
                                                    prfqAssyID: rfqAssyID,
                                                    pUserID: req.user.id,
                                                    pRoleID: COMMON.getRequestUserLoginRoleID()
                                                },
                                                type: sequelize.QueryTypes.SELECT
                                            }).then(() => {
                                                RFQSocketController.sendSubmittedQuote(req, { assyID: rfqAssyID, quoteID: req.body.summaryQuoteObj.quoteID });
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: req.body.summaryQuoteObj.quoteID, quoteNumber: num }, isSubmit ? MESSAGE_CONSTANT.SUBMIT(summaryModuleName) : MESSAGE_CONSTANT.SAVED(summaryModuleName));
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                            }));
                                        }
                                    }).catch((err) => {
                                        if (!t.finished) { t.rollback(); }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            const QuoteNum = 11;
                            const dateDet = new Date();
                            const yearDet = dateDet.getFullYear().toString();
                            const monthDet = (dateDet.getMonth() + 1).toString();
                            const dayDet = dateDet.getDate().toString();
                            num = `Q${yearDet.slice(2, 4) + (`0${monthDet}`).slice(-2) + (`0${dayDet}`).slice(-2)}-`;
                            num += QuoteNum;
                            const objAssyQuote = {
                                rfqAssyID: rfqAssyID,
                                quoteNumber: num,
                                quoteInDate: req.body.summaryQuoteObj.QuoteInDate,
                                quoteDueDate: req.body.summaryQuoteObj.QuoteDueDate,
                                quoteSubmitDate: date,
                                bomInternalVersion: req.body.summaryQuoteObj.internalVersion,
                                BOMIssues: req.body.summaryQuoteObj.BOMIssue,
                                bomLastVersion: req.body.summaryQuoteObj.bomLastVersion,
                                createdBy: req.user.id,
                                id: req.body.summaryQuoteObj.quoteID
                            };

                            return RFQAssembliesQuotationSubmitted.update(objAssyQuote, {
                                where: {
                                    id: req.body.summaryQuoteObj.quoteID
                                },
                                fields: inputassyQuoteFields,
                                transaction: t
                            }).then((resAssyQuoteSubmit) => {
                                var objAssembly = {
                                    updatedBy: req.user.id,
                                    quoteNumber: num,
                                    quoteSubmitDate: date,
                                    isSummaryComplete: true,
                                    quoteSubmittedBy: req.user.id,
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                    isCustomPartDetShowInReport: req.body.summaryQuoteObj.isCustomPartDetShowInReport
                                };
                                return RFQAssemblies.update(objAssembly, {
                                    where: {
                                        id: rfqAssyID,
                                        isDeleted: false
                                    },
                                    fields: ['quoteNumber', 'quoteSubmittedBy', 'quoteSubmitDate', 'isSummaryComplete', 'updatedBy', 'updateByRoleId', 'isCustomPartDetShowInReport'],
                                    transaction: t
                                }).then(() => {
                                    _.each(summaryQuoteObj, (summary) => {
                                        promises.push(RFQAssyQuotations.findOne({
                                            where: {
                                                rfqAssyID: summary.rfqAssyID,
                                                rfqAssyQtyID: summary.rfqAssyQtyID,
                                                rfqAssyQtyTurnTimeID: summary.rfqAssyQtyTurnTimeID,
                                                refSubmittedQuoteID: null
                                            },
                                            transaction: t,
                                            attributes: ['id', 'requestedQty']
                                        }).then((quote) => {
                                            if (quote && quote.id) {
                                                summary.id = quote.id;
                                                summary.updatedBy = req.user.id;
                                                summary.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                                                summary.refSubmittedQuoteID = req.body.summaryQuoteObj.quoteID;
                                                return RFQAssyQuotations.update(summary, {
                                                    where: {
                                                        id: quote.id,
                                                        IsDeleted: false
                                                    },
                                                    transaction: t,
                                                    fields: ['id', 'unitPrice', 'materialCost', 'excessQtyTotalPrice', 'total', 'updatedBy', 'days', 'refSubmittedQuoteID', 'turnTime', 'timeType', 'manualTurnTime', 'manualTurnType', 'laborCost', 'laborDays', 'materialDays', 'nreDays', 'nreCost', 'nonQuotedConsolidatelineItemIDs', 'historyID', 'toolingDays', 'toolingCost', 'laborunitPrice', 'laborday', 'updateByRoleId', 'overheadCost', 'overheadDays', 'allCost', 'allDays', 'overheadUnitPrice', 'overheadDay']
                                                }).then(() => {
                                                    const addditionalCostPromise = [];
                                                    if (summary.rfqAssyQuotationsAdditionalCost) {
                                                        _.each(summary.rfqAssyQuotationsAdditionalCost, (objAddCost) => {
                                                            objAddCost.rfqAssyQuoteID = quote.id;
                                                        });
                                                        return module.exports.saveAdditionalCost(req, summary.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalcost => resAdditionalcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        });
                                                    }
                                                    if (summary.customPartList) {
                                                        _.each(summary.customPartList, (objcustPart) => {
                                                            objcustPart.rfqAssyQuoteId = quote.id;
                                                        });
                                                        addditionalCostPromise.push(module.exports.saveCustomPartCost(req, summary.customPartList, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    } else if (summary.id) {
                                                        addditionalCostPromise.push(module.exports.deleteCustomPartCost(req, summary.id, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    }
                                                    return Promise.all(addditionalCostPromise).then((responses) => {
                                                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                                        if (promisResObj) {
                                                            return STATE.FAILED;
                                                        } else {
                                                            return STATE.SUCCESS;
                                                        }
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return STATE.FAILED;
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return STATE.FAILED;
                                                });
                                            } else {
                                                summary.createdBy = req.user.id;
                                                summary.refSubmittedQuoteID = resAssyQuoteSubmit.id;
                                                return RFQAssyQuotations.create(summary, {
                                                    fields: inputFields,
                                                    transaction: t
                                                }).then((resAssyQuote) => {
                                                    const addditionalCostPromise = [];
                                                    if (summary.rfqAssyQuotationsAdditionalCost) {
                                                        _.each(summary.rfqAssyQuotationsAdditionalCost, (objAddCost) => {
                                                            objAddCost.rfqAssyQuoteID = resAssyQuote.id;
                                                        });
                                                        return module.exports.saveAdditionalCost(req, summary.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost);
                                                    }
                                                    if (summary.customPartList) {
                                                        _.each(summary.customPartList, (objcustPart) => {
                                                            objcustPart.rfqAssyQuoteId = resAssyQuote.id;
                                                        });
                                                        addditionalCostPromise.push(module.exports.saveCustomPartCost(req, summary.customPartList, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    } else if (summary.id) {
                                                        addditionalCostPromise.push(module.exports.deleteCustomPartCost(req, summary.id, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            return STATE.FAILED;
                                                        }));
                                                    }
                                                    return Promise.all(addditionalCostPromise).then((responses) => {
                                                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                                        if (promisResObj) {
                                                            return STATE.FAILED;
                                                        } else {
                                                            return STATE.SUCCESS;
                                                        }
                                                    }).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        return STATE.FAILED;
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return STATE.FAILED;
                                                });
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        }));
                                    });
                                    return Promise.all(promises).then((responses) => {
                                        var promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                        if (promisResObj) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(summaryModuleName)));
                                        } else {
                                            t.commit();
                                            // return sequelize.query('CALL Sproc_updateAssyQuoteDetails (:rfqAssyID )', {
                                            return sequelize.query('CALL Sproc_CreateQuoteSubmittedSummaryDetails (:prfqAssyID,:pUserID,:pRoleID )', {
                                                replacements: {
                                                    prfqAssyID: rfqAssyID,
                                                    pUserID: req.user.id,
                                                    pRoleID: COMMON.getRequestUserLoginRoleID()
                                                },
                                                type: sequelize.QueryTypes.SELECT
                                            }).then(() => {
                                                RFQSocketController.sendSubmittedQuote(req, { assyID: rfqAssyID, quoteID: req.body.summaryQuoteObj.quoteID });
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: req.body.summaryQuoteObj.quoteID, quoteNumber: num }, isSubmit ? MESSAGE_CONSTANT.SUBMIT(summaryModuleName) : MESSAGE_CONSTANT.SAVED(summaryModuleName));
                                            }).catch((err) => {
                                                if (!t.finished) { t.rollback(); }
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                            });
                                        }
                                    }).catch((err) => {
                                        if (!t.finished) { t.rollback(); }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                }).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return sequelize.transaction().then((t) => {
                    const objAssembly = {
                        updatedBy: req.user.id,
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        isCustomPartDetShowInReport: req.body.summaryQuoteObj.isCustomPartDetShowInReport
                    };
                    if (req.body.summaryQuoteObj && req.body.summaryQuoteObj.isCustomPartDetShowInReport != null) {
                        promises.push(RFQAssemblies.update(objAssembly, {
                            where: {
                                id: rfqAssyID,
                                isDeleted: false
                            },
                            fields: ['updatedBy', 'updateByRoleId', 'isCustomPartDetShowInReport'],
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                    }
                    _.each(summaryQuoteObj, (summary) => {
                        promises.push(RFQAssyQuotations.findOne({
                            where: {
                                rfqAssyID: summary.rfqAssyID,
                                rfqAssyQtyID: summary.rfqAssyQtyID,
                                rfqAssyQtyTurnTimeID: summary.rfqAssyQtyTurnTimeID,
                                refSubmittedQuoteID: null
                            },
                            transaction: t,
                            attributes: ['id', 'requestedQty']
                        }).then((quote) => {
                            if (quote && quote.id) {
                                summary.id = quote.id;
                                summary.updatedBy = req.user.id;
                                return RFQAssyQuotations.update(summary, {
                                    where: {
                                        id: quote.id,
                                        IsDeleted: false
                                    },
                                    transaction: t,
                                    fields: summary.isPartCosting ? ['id', 'unitPrice', 'excessQtyTotalPrice', 'updatedBy', 'turnTime', 'timeType', 'nonQuotedConsolidatelineItemIDs', 'historyID', 'days'] : ['id', 'unitPrice', 'materialCost', 'excessQtyTotalPrice', 'total', 'updatedBy', 'days', 'manualTurnTime', 'manualTurnType', 'turnTime', 'timeType', 'laborCost', 'laborDays', 'materialDays', 'nreDays', 'nreCost', 'toolingDays', 'toolingCost', 'laborunitPrice', 'laborday', 'overheadCost', 'overheadDays', 'allCost', 'allDays', 'overheadUnitPrice', 'overheadDay']
                                }).then(() => {
                                    var addditionalCostPromise = [];
                                    if (summary.rfqAssyQuotationsAdditionalCost) {
                                        _.each(summary.rfqAssyQuotationsAdditionalCost, (objAddCost) => {
                                            objAddCost.rfqAssyQuoteID = quote.id;
                                        });
                                        addditionalCostPromise.push(module.exports.saveAdditionalCost(req, summary.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost));
                                    }
                                    if (summary.deletedrfqAssyQuotationsAdditionalCost && summary.deletedrfqAssyQuotationsAdditionalCost.length > 0) {
                                        addditionalCostPromise.push(module.exports.removeAdditionalCost(req, summary.deletedrfqAssyQuotationsAdditionalCost, t).then(resRemoveAdditionalCost => resRemoveAdditionalCost));
                                    }
                                    if (summary.customPartList) {
                                        _.each(summary.customPartList, (objcustPart) => {
                                            objcustPart.rfqAssyQuoteId = quote.id;
                                        });
                                        addditionalCostPromise.push(module.exports.saveCustomPartCost(req, summary.customPartList, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        }));
                                    } else if (summary.id) {
                                        addditionalCostPromise.push(module.exports.deleteCustomPartCost(req, summary.id, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        }));
                                    }
                                    return Promise.all(addditionalCostPromise).then((responses) => {
                                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                        if (promisResObj) {
                                            return STATE.FAILED;
                                        } else {
                                            return STATE.SUCCESS;
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                });
                            } else {
                                summary.createdBy = req.user.id;
                                return RFQAssyQuotations.create(summary, {
                                    fields: inputFields,
                                    transaction: t
                                }).then((resAssyQuote) => {
                                    const addditionalCostPromise = [];
                                    if (summary.rfqAssyQuotationsAdditionalCost) {
                                        _.each(summary.rfqAssyQuotationsAdditionalCost, (objAddCost) => {
                                            objAddCost.rfqAssyQuoteID = resAssyQuote.id;
                                        });
                                        addditionalCostPromise.push(module.exports.saveAdditionalCost(req, summary.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost));
                                    }
                                    if (summary.deletedrfqAssyQuotationsAdditionalCost && summary.deletedrfqAssyQuotationsAdditionalCost.length > 0) {
                                        addditionalCostPromise.push(module.exports.removeAdditionalCost(req, summary.deletedrfqAssyQuotationsAdditionalCost, t).then(resRemoveAdditionalCost => resRemoveAdditionalCost));
                                    }
                                    if (summary.customPartList) {
                                        _.each(summary.customPartList, (objcustPart) => {
                                            objcustPart.rfqAssyQuoteId = resAssyQuote.id;
                                        });
                                        addditionalCostPromise.push(module.exports.saveCustomPartCost(req, summary.customPartList, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        }));
                                    } else if (summary.id) {
                                        addditionalCostPromise.push(module.exports.deleteCustomPartCost(req, summary.id, t).then(resCustomPartcost => resCustomPartcost).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        }));
                                    }
                                    return Promise.all(addditionalCostPromise).then((responses) => {
                                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                                        if (promisResObj) {
                                            return STATE.FAILED;
                                        } else {
                                            return STATE.SUCCESS;
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return STATE.FAILED;
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                    });

                    return Promise.all(promises).then((responses) => {
                        const promisResObj = _.find(responses, resobj => resobj === STATE.FAILED);
                        if (promisResObj) {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(summaryModuleName)),
                                null, null);
                        } else {
                            t.commit();
                            // return resHandler.successRes(res, 200, STATE.SUCCESS, null, isSubmit ? MESSAGE_CONSTANT.SUBMIT(summaryModuleName) : MESSAGE_CONSTANT.SAVED(summaryModuleName));
                            return sequelize.query('CALL Sproc_updateAssyQuoteDetails (:prfqAssyID )', {
                                replacements: {
                                    prfqAssyID: summaryQuoteObj[0].rfqAssyID
                                }
                            }).then(() => {
                                if (summaryQuoteObj[0].isPartCosting) {
                                    const resObj = {
                                        isLabor: false,
                                        rfqAssyID: summaryQuoteObj[0].rfqAssyID
                                    };
                                    RFQSocketController.updateSummaryQuote(req, resObj);
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, isSubmit ? MESSAGE_CONSTANT.SUBMIT(summaryModuleName) : MESSAGE_CONSTANT.SAVED(summaryModuleName));
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // retrive summary for quote
    // GET : /api/v1/summaryquote/retriveSummaryQuote
    // @return list of quotations
    retriveSummaryQuote: (req, res) => {
        const { RFQAssyQuotations, RFQPriceGroup, RFQAssembliesQuotationSubmitted, RFQAssyQuotationsAdditionalCost, RFQAssyQuotationsCustomparts, Component } = req.app.locals.models;
        if (req.body.summaryGetobj.rfqAssyID) {
            if (req.body.summaryGetobj.isSummaryComplete) {
                return RFQAssembliesQuotationSubmitted.findOne({
                    where: {
                        rfqAssyID: req.body.summaryGetobj.rfqAssyID,
                        quoteNumber: { [Op.ne]: null }
                    },
                    order: [
                        ['id', 'DESC']
                    ]
                }).then((quotesubmittedRes) => {
                    if (quotesubmittedRes) {
                        return RFQAssyQuotations.findAll({
                            where: {
                                rfqAssyID: req.body.summaryGetobj.rfqAssyID,
                                refSubmittedQuoteID: quotesubmittedRes.id,
                                IsDeleted: false
                            },
                            order: [['rfqPriceGroupId', 'ASC'], ['requestedQty', 'ASC'], ['turnTime', 'ASC']],
                            attributes: ['id', 'rfqAssyID', 'rfqAssyQtyID', 'rfqAssyQtyTurnTimeID', 'requestedQty', 'turnTime', 'timeType', 'unitPrice', 'materialCost', 'excessQtyTotalPrice', 'total', 'days', 'manualTurnTime', 'manualTurnType', 'laborCost', 'laborDays', 'materialDays', 'nreDays', 'nreCost', 'nonQuotedConsolidatelineItemIDs', 'historyID', 'toolingDays', 'toolingCost', 'laborunitPrice', 'laborday', 'rfqPriceGroupId', 'rfqPriceGroupDetailId', 'overheadCost', 'overheadDays', 'allCost', 'allDays', 'overheadUnitPrice', 'overheadDay'],
                            include: [{
                                model: RFQAssyQuotationsAdditionalCost,
                                as: 'rfqAssyQuotationsAdditionalCost',
                                where: { isDeleted: false },
                                attributes: ['id', 'rfqAssyQuoteID', 'quoteChargeDynamicFieldID', 'amount', 'percentage', 'margin', 'days', 'toolingQty', 'refCustomPartQuoteID'],
                                required: false
                            }, {
                                model: RFQPriceGroup,
                                as: 'rfqPriceGroup',
                                require: false
                            }, {
                                model: RFQAssyQuotationsCustomparts,
                                as: 'rfqAssyQuotationsCustomParts',
                                where: { isDeleted: false },
                                attributes: ['id', 'rfqAssyQuoteId', 'mfgPNID', 'unitPrice', 'totalPrice', 'leadTimeDays', 'totalLeadTimeDays'],
                                required: false,
                                include: [{
                                    model: Component,
                                    as: 'customParts',
                                    attributes: ['id', 'PIDCode', 'mfgPN', 'RoHSStatusID'],
                                    required: false
                                }]
                            }]
                        }).then(quote => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quote, null)).catch((err) => {
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
                return RFQAssyQuotations.findAll({
                    where: {
                        rfqAssyID: req.body.summaryGetobj.rfqAssyID,
                        refSubmittedQuoteID: null,
                        IsDeleted: false
                    },
                    order: [['rfqPriceGroupId', 'ASC'], ['requestedQty', 'ASC'], ['turnTime', 'ASC']],
                    attributes: ['id', 'rfqAssyID', 'rfqAssyQtyID', 'rfqAssyQtyTurnTimeID', 'requestedQty', 'turnTime', 'timeType', 'unitPrice', 'materialCost', 'excessQtyTotalPrice', 'total', 'days', 'manualTurnTime', 'manualTurnType', 'laborCost', 'laborDays', 'materialDays', 'nreDays', 'nreCost', 'nonQuotedConsolidatelineItemIDs', 'historyID', 'toolingDays', 'toolingCost', 'laborunitPrice', 'laborday', 'rfqPriceGroupId', 'rfqPriceGroupDetailId', 'overheadCost', 'overheadDays', 'allCost', 'allDays', 'overheadUnitPrice', 'overheadDay'],
                    include: [{
                        model: RFQAssyQuotationsAdditionalCost,
                        as: 'rfqAssyQuotationsAdditionalCost',
                        where: { isDeleted: false },
                        attributes: ['id', 'rfqAssyQuoteID', 'quoteChargeDynamicFieldID', 'amount', 'percentage', 'margin', 'days', 'toolingQty', 'refCustomPartQuoteID'],
                        required: false
                    }, {
                        model: RFQPriceGroup,
                        as: 'rfqPriceGroup',
                        require: false
                    }, {
                        model: RFQAssyQuotationsCustomparts,
                        as: 'rfqAssyQuotationsCustomParts',
                        where: { isDeleted: false },
                        attributes: ['id', 'rfqAssyQuoteId', 'mfgPNID', 'unitPrice', 'totalPrice', 'leadTimeDays', 'totalLeadTimeDays'],
                        required: false,
                        include: [{
                            model: Component,
                            as: 'customParts',
                            attributes: ['id', 'PIDCode', 'mfgPN', 'RoHSStatusID'],
                            required: false
                        }]
                    }]
                }).then(quote => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quote, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // retrive dynamic field
    // GET : /api/v1/summaryquote/retriveDynamicFields
    // @return list of dynamic field or summary
    retriveDynamicFields: (req, res) => {
        const { QuoteDynamicFields } = req.app.locals.models;
        QuoteDynamicFields.findAll({
            order: [
                ['displayOrder', 'ASC']
            ],
            attributes: ['id', 'fieldName', 'dataType', 'costingType', 'displayPercentage', 'displayMargin', 'displayOrder', 'isDaysRequire', 'defaultMarginValue', 'marginApplicableType', 'defaultuomValue', 'selectionType', 'affectType', 'defaultuomType', 'toolingQty', 'toolingPrice', 'applyToAll', 'isActive', 'isIncludeInOtherAttribute', 'refAttributeID', 'isCommission']

        }).then(quote => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, quote, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // save additional cost value
    saveAdditionalCost: (req, additionalCostList, t) => {
        const { RFQAssyQuotationsAdditionalCost } = req.app.locals.models;
        if (additionalCostList && additionalCostList.length > 0) {
            const apiPromises = [];
            _.each(additionalCostList, (costItem) => {
                if (!costItem.id && costItem.quoteChargeDynamicFieldID) {
                    costItem.createdBy = req.user.id;
                    costItem.amount = costItem.amount === '' ? null : (costItem.amount || costItem.amount === 0) ? costItem.amount : null;
                    costItem.percentage = costItem.percentage === '' ? null : (costItem.percentage || costItem.percentage === 0) ? costItem.percentage : null;
                    costItem.margin = costItem.margin === '' ? null : (costItem.margin || costItem.margin === 0) ? costItem.margin : null;
                    costItem.days = costItem.days === '' ? null : (costItem.days || costItem.days === 0) ? costItem.days : null;
                    costItem.toolingQty = costItem.toolingQty === '' ? null : (costItem.toolingQty || costItem.toolingQty === 0) ? costItem.toolingQty : null;
                    apiPromises.push(
                        RFQAssyQuotationsAdditionalCost.create(costItem, {
                            fields: ['rfqAssyQuoteID', 'quoteChargeDynamicFieldID', 'amount', 'percentage', 'margin', 'createdBy', 'days', 'toolingQty', 'refCustomPartQuoteID'],
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                } else if (costItem.quoteChargeDynamicFieldID) {
                    costItem.updatedBy = req.user.id;
                    costItem.amount = costItem.amount === '' ? null : (costItem.amount || costItem.amount === 0) ? costItem.amount : null;
                    costItem.percentage = costItem.percentage === '' ? null : (costItem.percentage || costItem.percentage === 0) ? costItem.percentage : null;
                    costItem.margin = costItem.margin === '' ? null : (costItem.margin || costItem.margin === 0) ? costItem.margin : null;
                    costItem.days = costItem.days === '' ? null : (costItem.days || costItem.days === 0) ? costItem.days : null;
                    costItem.toolingQty = costItem.toolingQty === '' ? null : (costItem.toolingQty || costItem.toolingQty === 0) ? costItem.toolingQty : null;
                    apiPromises.push(RFQAssyQuotationsAdditionalCost.update(costItem, {
                        where: {
                            id: costItem.id,
                            IsDeleted: false
                        },
                        fields: ['id', 'rfqAssyQuoteID', 'quoteChargeDynamicFieldID', 'amount', 'percentage', 'margin', 'updatedBy', 'days', 'toolingQty', 'refCustomPartQuoteID'],
                        transaction: t
                    }).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                }
            });
            return Promise.all(apiPromises).then((responses) => {
                var resobj = _.find(responses, res => res === STATE.FAILED);
                if (resobj) {
                    return STATE.FAILED;
                } else {
                    return STATE.SUCCESS;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        } else {
            return STATE.SUCCESS;
        }
    },

    // save additional cost value
    saveCustomPartCost: (req, customPartList, t) => {
        const { RFQAssyQuotationsCustomparts } = req.app.locals.models;
        if (customPartList && customPartList.length > 0) {
            return RFQAssyQuotationsCustomparts.findAll({
                where: {
                    rfqAssyQuoteId: _.map(customPartList, 'rfqAssyQuoteId')
                }
            }).then((existCustompart) => {
                var apiPromises = [];
                _.each(customPartList, (costItem) => {
                    const existCustPart = _.find(existCustompart, item => item.rfqAssyQuoteId === costItem.rfqAssyQuoteId && item.mfgPNID === costItem.mfgPNID);
                    if (existCustPart) {
                        costItem.id = existCustPart.id;
                    }
                    if (!costItem.id) {
                        costItem.createdBy = COMMON.getRequestUserID(req);
                        costItem.createByRoleId = COMMON.getRequestUserLoginRoleID(req);
                        costItem.unitPrice = costItem.unitPrice === '' ? null : (costItem.unitPrice || costItem.unitPrice === 0) ? costItem.unitPrice : null;
                        costItem.leadTimeDays = costItem.leadTimeDays === '' ? null : (costItem.leadTimeDays || costItem.leadTimeDays === 0) ? costItem.leadTimeDays : null;
                        costItem.totalPrice = costItem.totalPrice === '' ? null : (costItem.totalPrice || costItem.totalPrice === 0) ? costItem.totalPrice : null;
                        costItem.totalLeadTimeDays = costItem.totalLeadTimeDays === '' ? null : (costItem.totalLeadTimeDays || costItem.totalLeadTimeDays === 0) ? costItem.totalLeadTimeDays : null;
                        apiPromises.push(
                            RFQAssyQuotationsCustomparts.create(costItem, {
                                fields: ['rfqAssyQuoteId', 'mfgPNID', 'unitPrice', 'totalPrice', 'leadTimeDays', 'totalLeadTimeDays', 'createdBy', 'createByRoleId'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                    } else if (costItem.id) {
                        costItem.updatedBy = COMMON.getRequestUserID(req);
                        costItem.updateByRoleId = COMMON.getRequestUserLoginRoleID(req);
                        costItem.unitPrice = costItem.unitPrice === '' ? null : (costItem.unitPrice || costItem.unitPrice === 0) ? costItem.unitPrice : null;
                        costItem.leadTimeDays = costItem.leadTimeDays === '' ? null : (costItem.leadTimeDays || costItem.leadTimeDays === 0) ? costItem.leadTimeDays : null;
                        costItem.totalPrice = costItem.totalPrice === '' ? null : (costItem.totalPrice || costItem.totalPrice === 0) ? costItem.totalPrice : null;
                        costItem.totalLeadTimeDays = costItem.totalLeadTimeDays === '' ? null : (costItem.totalLeadTimeDays || costItem.totalLeadTimeDays === 0) ? costItem.totalLeadTimeDays : null;
                        apiPromises.push(RFQAssyQuotationsCustomparts.update(costItem, {
                            where: {
                                id: costItem.id,
                                IsDeleted: false
                            },
                            fields: ['unitPrice', 'totalPrice', 'leadTimeDays', 'totalLeadTimeDays', 'updatedBy', 'updateByRoleId'],
                            transaction: t
                        }).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                    }
                });
                return Promise.all(apiPromises).then((responses) => {
                    var resobj = _.find(responses, res => res === STATE.FAILED);
                    if (resobj) {
                        return STATE.FAILED;
                    } else {
                        return STATE.SUCCESS;
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        } else {
            return STATE.SUCCESS;
        }
    },

    // save additional cost value
    deleteCustomPartCost: (req, rfqAssyQuoteId, t) => {
        const { RFQAssyQuotationsCustomparts, RFQAssyQuotationsAdditionalCost } = req.app.locals.models;
        if (rfqAssyQuoteId != null) {
            return RFQAssyQuotationsCustomparts.findAll({
                where: {
                    rfqAssyQuoteId: rfqAssyQuoteId
                },
                attributes: ['id'],
                include: [{
                    model: RFQAssyQuotationsAdditionalCost,
                    as: 'rfqAssyQuotationsAdditionalCost',
                    where: { isDeleted: false },
                    attributes: ['id', 'rfqAssyQuoteID', 'quoteChargeDynamicFieldID', 'refCustomPartQuoteID'],
                    required: false
                }]
            }).then((existCustompart) => {
                var apiPromises = [];
                _.each(existCustompart, (costItem) => {
                    if (costItem.id) {
                        apiPromises.push(RFQAssyQuotationsCustomparts.update(
                            { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) },
                            {
                                where: {
                                    id: costItem.id,
                                    IsDeleted: false
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            }));
                        if (costItem.rfqAssyQuotationsAdditionalCost && costItem.rfqAssyQuotationsAdditionalCost.length > 0) {
                            apiPromises.push(module.exports.removeAdditionalCost(req, costItem.rfqAssyQuotationsAdditionalCost, t).then(resAdditionalCost => resAdditionalCost));
                        }
                    }
                });
                return Promise.all(apiPromises).then((responses) => {
                    var resobj = _.find(responses, res => res === STATE.FAILED);
                    if (resobj) {
                        return STATE.FAILED;
                    } else {
                        return STATE.SUCCESS;
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        } else {
            return STATE.SUCCESS;
        }
    },

    // remove additional cost value
    removeAdditionalCost: (req, additionalCostList, t) => {
        const { RFQAssyQuotationsAdditionalCost } = req.app.locals.models;
        if (additionalCostList && additionalCostList.length > 0) {
            const apiPromises = [];
            _.each(additionalCostList, (costItem) => {
                if (!costItem.id && costItem.quoteChargeDynamicFieldID) {
                    // Need to check this condition
                } else if (costItem.quoteChargeDynamicFieldID) {
                    apiPromises.push(RFQAssyQuotationsAdditionalCost.update(
                        { isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC() },
                        {
                            where: {
                                id: costItem.id,
                                quoteChargeDynamicFieldID: costItem.quoteChargeDynamicFieldID,
                                IsDeleted: false
                            },
                            fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                            transaction: t
                        }).then(() => STATE.SUCCESS)
                        .catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                }
            });
            return Promise.all(apiPromises).then((responses) => {
                var resobj = _.find(responses, res => res === STATE.FAILED);
                if (resobj) {
                    return STATE.FAILED;
                } else {
                    return STATE.SUCCESS;
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        } else {
            return STATE.SUCCESS;
        }
    },

    // retrive summary terms and condition
    // GET : /api/v1/summaryquote/getSummaryTermsCondition
    // @return list of terms and condition
    getSummaryTermsCondition: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.rfqAssyID) {
            return sequelize.query('CALL Sproc_GetSummaryTermsAndCondition (:prfqAssyID)',
                {
                    replacements: {
                        prfqAssyID: req.params.rfqAssyID
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(terms => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(terms[0]), null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Copy Quote info and save new rev
    // GET : /api/v1/summaryquote/revisedQuote
    // @return list of
    revisedQuote: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.rfqAssyID) {
            return sequelize.query('CALL Sproc_CopyAssyQuoteSummary (:prfqAssyID,:pUserID,:pRoleID)', {
                replacements: {
                    prfqAssyID: req.body.rfqAssyID || null,
                    pUserID: req.user.id,
                    pRoleID: COMMON.getRequestUserLoginRoleID()
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                // socket call
                RFQSocketController.sendrevisedQuote(req, req.body.rfqAssyID);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Remove Quotation Summary
    // GET : /api/v1/summaryquote/removeQuoteSummary
    // @return list of
    removeQuoteSummary: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.rfqAssyID) {
            return sequelize.query('CALL Sproc_removeQuoteSummary (:puserID,:prfqAssyID)', {
                replacements: {
                    puserID: req.user.id,
                    prfqAssyID: req.body.rfqAssyID || null
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Price Group Detail
    // GET : /api/v1/summaryquote/getPriceGroupDetail
    // @return list of
    getPriceGroupDetail: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.query.priceGroupId) {
            return sequelize.query('CALL Sproc_GetPriceGroupDetailByID (:pPriceGroupId)', {
                replacements: {
                    pPriceGroupId: req.query.priceGroupId
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get Assembly current status
    // GET : /api/v1/summaryquote/getAssemblyCurrentStatus
    // @return status of assembly
    getAssemblyCurrentStatus: (req, res) => {
        const { RFQAssemblies } = req.app.locals.models;
        if (req.params.rfqAssyID) {
            return RFQAssemblies.findOne({
                where: {
                    id: req.params.rfqAssyID,
                    isDeleted: false
                },
                attributes: ['id', 'status']
            }).then((assy) => {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assy, null);
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
