/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const { NotFound, NotCreate } = require('../../errors');
const _ = require('lodash');
const { Op } = require('sequelize');
const RFQSocketController = require('../controllers/RFQSocketController');
const Bson = require('bson');
const fs = require('fs');
const moment = require('moment');
const request = require('request');
const PricingController = require('../../pricing/controllers/PricingController');
const SupplierQuoteController = require('../../supplier_quote/controllers/SupplierQuoteController');
// const Axios = require('axios');

const consolidateModuleName = DATA_CONSTANT.CONSOLIDATE_MFGPN_RFQLINEITEM.Name;
const PRICING_STATUS = DATA_CONSTANT.PRICING_STATUS;
const PRICE_FILTER = DATA_CONSTANT.PRICE_FILTER;
module.exports = {
    // Get List of Common line items
    // GET : /api/v1/consolidatepart/retrieveConsolidatedParts
    // @param {id} int
    // @return List of consolidated parts
    retrieveConsolidatedParts: (req, res) => {
        const { RFQAssemblies, RFQForms } = req.app.locals.models;
        return RFQAssemblies.findOne({
            where: {
                id: req.query.id,
                isDeleted: false
            },
            attributes: ['id', 'status', 'isReadyForPricing', 'rfqrefID', 'isSummaryComplete'],
            include: [{
                model: RFQForms,
                as: 'rfqForms',
                where: { isDeleted: false },
                attributes: ['id', 'customerId'],
                required: false
            }]
        }).then((assy) => {
            if (assy) {
                if (assy.isReadyForPricing) {
                    return module.exports.retrievePricingAssyWise(req, assy.id).then((pricingList) => {
                        if (parseInt(req.query.filterID) === PRICE_FILTER.GetLeadTimeRiskLineItems.ID) {
                            return module.exports.retrieveCommonLeadTimeRiskLineItems(req, res, assy).then((status) => {
                                status.pricingList = pricingList;
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, status, null);
                            });
                        } else if (parseInt(req.query.filterID) === PRICE_FILTER.GetRFQCustomRulesLineItems.ID) {
                            return module.exports.retrieveCommonCustomRulesLineItems(req, res, assy).then((status) => {
                                status.pricingList = pricingList;
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, status, null);
                            });
                        } else if (parseInt(req.query.filterID) === PRICE_FILTER.GetRFQConsolidateRfqLineItem.ID ||
                            parseInt(req.query.filterID) === PRICE_FILTER.GetRFQUnQuotedLineItems.ID ||
                            parseInt(req.query.filterID) === PRICE_FILTER.GetExcessMaterialLineItems.ID ||
                            parseInt(req.query.filterID) === PRICE_FILTER.GetRFQMaterialAtRiskLineItems.ID ||
                            parseInt(req.query.filterID) === PRICE_FILTER.GetCostingNotRequiredDNP.ID ||
                            parseInt(req.query.filterID) === PRICE_FILTER.GetRFQManualSelectPrice.ID) {
                            return module.exports.retrieveConsolidatedPartsandNotQuoted(req, res, assy).then((status) => {
                                status.pricingList = pricingList;
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, status, null);
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(consolidateModuleName)));
                        }
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isReadyForPricing: assy.isReadyForPricing }, null);
                }
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(consolidateModuleName)));
            }
        });
    },
    // Get List of consolidated mfgpn line items
    // GET : /api/v1/consolidatepart/retrieveConsolidatedParts
    // @param {id} int
    // @return List of consolidated parts
    retrieveConsolidatedPartsandNotQuoted: (req, res, assy) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        } else {
            strWhere = strWhere.replace('componentExcel', 'mfgPN');
        }
        if (filter && filter.strOrderBy) {
            filter.strOrderBy = filter.strOrderBy.replace('componentExcel', 'mfgPN');
        }
        const ProcedureName = COMMON.stringFormat('CALL {0} (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prfqAssyID, :puserID,:ppackageing,:pcustomerID)', req.query.spName);
        return sequelize.query(ProcedureName, {
            replacements: {
                ppageIndex: req.query.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                prfqAssyID: assy.id,
                puserID: req.user.id,
                ppackageing: req.query.ppackageing ? true : false,
                pcustomerID: assy.rfqForms.customerId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => ({
            consolidateParts: _.values(response[1]),
            Count: response[0][0]['COUNT(1)'],
            autoPricingStatus: _.values(response[2]),
            qtyTurnTime: _.values(response[3]),
            quantitydetails: _.values(response[4]),
            quantityTotals: _.values(response[5]),
            lineItemCustoms: _.values(response[6]),
            restrictPartsAssy: _.values(response[7]),
            custompartDetails: _.values(response[8]),
            isReadyForPricing: true,
            rfqID: assy.rfqrefID,
            customerID: assy.rfqForms.customerId,
            isSummaryComplete: assy.isSummaryComplete
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {};
        });
    },

    retrieveCommonCustomRulesLineItems: (req, res, assy) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        } else {
            strWhere = strWhere.replace('componentExcel', 'mfgPN');
        }
        if (filter && filter.strOrderBy) {
            filter.strOrderBy = filter.strOrderBy.replace('componentExcel', 'mfgPN');
        }
        return sequelize.query('CALL Sproc_GetRFQCustomRulesLineItems (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereColumnName,:pWhereFilterValue,:pCustomWhere,:pWhereClause,:prfqAssyID, :puserID,:ppackageing,:pcustomerID)', {
            replacements: {
                ppageIndex: req.query.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereColumnName: filter.whereColumnName ? filter.whereColumnName : null,
                pWhereFilterValue: (filter.whereFilterValue || filter.whereFilterValue === 0) ? filter.whereFilterValue : null,
                pCustomWhere: filter.customWhere ? filter.customWhere : null,
                pWhereClause: strWhere,
                prfqAssyID: assy.id,
                puserID: req.user.id,
                ppackageing: req.query.ppackageing ? true : false,
                pcustomerID: assy.rfqForms.customerId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => ({
            consolidateParts: _.values(response[1]),
            Count: response[0][0]['COUNT(1)'],
            autoPricingStatus: _.values(response[2]),
            qtyTurnTime: _.values(response[3]),
            quantitydetails: _.values(response[4]),
            quantityTotals: _.values(response[5]),
            lineItemCustoms: _.values(response[6]),
            restrictPartsAssy: _.values(response[7]),
            isReadyForPricing: true,
            rfqID: assy.rfqrefID,
            customerID: assy.rfqForms.customerId,
            isSummaryComplete: assy.isSummaryComplete
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {};
        });
    },

    retrieveCommonLeadTimeRiskLineItems: (req, res, assy) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        } else {
            strWhere = strWhere.replace('componentExcel', 'mfgPN');
        }
        if (filter && filter.strOrderBy) {
            filter.strOrderBy = filter.strOrderBy.replace('componentExcel', 'mfgPN');
        }
        return sequelize.query('CALL Sproc_GetLeadTimeRiskLineItems (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prfqAssyID, :puserID,:pleadTime,:ppackageing,:pcustomerID)', {
            replacements: {
                ppageIndex: req.query.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                prfqAssyID: assy.id,
                puserID: req.user.id,
                pleadTime: req.query.leadTime ? req.query.leadTime : 1,
                ppackageing: req.query.ppackageing ? true : false,
                pcustomerID: assy.rfqForms.customerId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => ({
            consolidateParts: _.values(response[1]),
            Count: response[0][0]['COUNT(1)'],
            autoPricingStatus: _.values(response[2]),
            qtyTurnTime: _.values(response[3]),
            quantitydetails: _.values(response[4]),
            quantityTotals: _.values(response[5]),
            lineItemCustoms: _.values(response[6]),
            restrictPartsAssy: _.values(response[7]),
            isReadyForPricing: true,
            rfqID: assy.rfqrefID,
            customerID: assy.rfqForms.customerId,
            isSummaryComplete: assy.isSummaryComplete
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {};
        });
    },
    // send request to service via rabbitmq and insert record lineitem autopricing and assy autopricing for maintain status.
    // POST : /api/v1/consolidatepart/getPricingFromApis
    // @return none.
    getPricingFromApis: (req, res) => {
        const { sequelize, Settings } = req.app.locals.models;
        if (req.body.pricingApiObj.pricingApiList.length > 0) {
            return Settings.findOne({
                where: {
                    key: DATA_CONSTANT.PricingServiceStatus
                },
                attributes: ['id', 'values']
            }).then((settingsExt) => {
                if (settingsExt && settingsExt.values === DATA_CONSTANT.Pricing_Start_Status) {
                    const promises = [];
                    if (req && req.body.pricingApiObj.consolidateIds) {
                        if (!req.body.pricingApiObj.isPurchaseApi) {
                            promises.push(module.exports.removeSelectedPrice(req, req.body.pricingApiObj.consolidateIds));
                        } else {
                            promises.push(module.exports.removeSelectedPurchasePrice(req, req.body.pricingApiObj.consolidateIds));
                        }
                    }
                    _.each(req.body.pricingApiObj.selectSupplierList, (api) => {
                        promises.push(module.exports.updateAssyPricing(res, req, api.id, req.body.pricingApiObj.pricingApiList[0].rfqAssyID, req.body.pricingApiObj.isPurchaseApi));
                    });
                    _.each(req.body.pricingApiObj.pricingApiList, (pricingObj) => {
                        _.each(pricingObj.pricingList, (suppliers) => {
                            // promises.push(module.exports.updateAssyPricing(res, req, suppliers, pricingObj,req.body.pricingApiObj.isPurchaseApi));
                            promises.push(module.exports.updateLineItemPricing(res, req, suppliers, pricingObj, req.body.pricingApiObj.isPurchaseApi));
                        });
                    });
                    Promise.all(promises).then(() => {
                        var channel = global.channel;
                        if (req.body.pricingApiObj.pricingApiList.length > 0) {
                            _.each(req.body.pricingApiObj.pricingApiList, (pricingObj) => {
                                _.each(pricingObj.pricingList, (supplierapi) => {
                                    var supplierObj = _.find(DATA_CONSTANT.PRICING_SUPPLIER, supplier => supplier.ID === parseInt(supplierapi.id));
                                    if (supplierObj) {
                                        const queue = (supplierObj.QueueName === DATA_CONSTANT.PRICING_SUPPLIER[0].QueueName && req.body.pricingApiObj.DKVersion === DATA_CONSTANT.DIGIKEY_VERSION.DKV3) ? DATA_CONSTANT.DK_PRICING_SUPPLIER_QUEUE :
                                            supplierObj.QueueName;
                                        channel.assertQueue(queue, { durable: false, autoDelete: false, exclusive: false });
                                        // Note: on Node 6 Buffer.from(msg) should be used
                                        const obj = {
                                            AssyID: pricingObj.rfqAssyID,
                                            ConsolidateID: pricingObj.id,
                                            PricingAPIName: supplierObj.Name,
                                            IsCustomPrice: req.body.pricingApiObj.isCustomPrice,
                                            isStockUpdate: req.body.pricingApiObj.isStockUpdate,
                                            isPurchaseApi: req.body.pricingApiObj.isPurchaseApi,
                                            supplierID: supplierapi.id,
                                            apiName: supplierapi.mfgName,
                                            type: DATA_CONSTANT.PRICING.NAME,
                                            userID: req.user.id,
                                            employeeID: req.user.employeeID
                                        };
                                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(obj)));
                                    }
                                });
                            });
                            if (!req.body.pricingApiObj.isPurchaseApi && req.body.pricingApiObj.pricingApiList.length > 0) {
                                sequelize.query('CALL Sproc_saveInternalVersionAssy (:pAssyId,:isPricing,:issubmit)', {
                                    replacements: {
                                        pAssyId: req.body.pricingApiObj.pricingApiList[0].rfqAssyID,
                                        isPricing: true,
                                        issubmit: false
                                    }
                                }).then(() => {
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                });
                            }
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.BOM.PricingStatus);
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

    // remove selected pricing
    removeSelectedPrice: (req, consolidateIds) => {
        const { RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        var objItem = {
            finalPrice: null,
            unitPrice: null,
            supplier: null,
            selectedMpn: null,
            selectionMode: null,
            min: null,
            mult: null,
            currentStock: null,
            selectedPIDCode: null,
            leadTime: null,
            supplierStock: null,
            grossStock: null,
            pricingSuppliers: null,
            apiLead: null,
            componentID: null,
            packaging: null,
            rfqQtySupplierID: null,
            quoteQty: null
        };
        return RFQConsolidatedMFGPNLineItemQuantity.update(objItem, {
            where: {
                consolidateID: { [Op.in]: consolidateIds },
                IsDeleted: false
            },
            fields: ['rfqQtySupplierID', 'quoteQty', 'packaging', 'componentID', 'finalPrice', 'unitPrice', 'supplier', 'selectedMpn', 'selectionMode', 'min', 'mult', 'currentStock',
                'selectedPIDCode', 'leadTime', 'supplierStock', 'grossStock', 'pricingSuppliers', 'apiLead']
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // remove selected purchase pricing
    removeSelectedPurchasePrice: (req, consolidateIds) => {
        const { KitAllocationLineitems } = req.app.locals.models;
        var objItem = {
            refMongoTrnsID: null,
            refPricePartID: null,
            refquoteQtyEach: null,
            refQuoteQtyPriceEach: null,
            refQuoteUnitQty: null,
            refQuoteUnitPriceEach: null,
            refpackagingID: null,
            refsupplierID: null,
            refLeadTime: null,
            refSelectedPartQtyStock: null,
            refSelectedPartUnitStock: null,
            refsupplierQtyStcok: null,
            refsupplierUnitStock: null,
            refCumulativeStock: null,
            refPriceselectionMode: null,
            refCumulativeStockSuppliers: null,
            updatedBy: req.user.id
        };
        return KitAllocationLineitems.update(objItem, {
            where: {
                id: { [Op.in]: consolidateIds },
                IsDeleted: false
            },
            fields: ['refMongoTrnsID', 'refPricePartID', 'refquoteQtyEach', 'refQuoteQtyPriceEach', 'refQuoteUnitQty', 'refQuoteUnitPriceEach', 'refpackagingID', 'refsupplierID', 'refLeadTime', 'refSelectedPartQtyStock', 'refSelectedPartUnitStock', 'refsupplierQtyStcok',
                'refsupplierUnitStock', 'refCumulativeStock', 'refPriceselectionMode', 'refCumulativeStockSuppliers', 'updatedBy']
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Get count for NRND and not quote counts
    // GET : /api/v1/consolidatepart/getNotQuoteNRNDCount
    // @param {id} int
    // @return count for NRND and not quote counts
    getNotQuoteNRNDCount: (req, res) => {
        const { sequelize, RFQAssemblies, RFQForms } = req.app.locals.models;
        RFQAssemblies.findOne({
            where: {
                id: req.query.id,
                isDeleted: false
            },
            attributes: ['id', 'status', 'isReadyForPricing', 'rfqrefID', 'isSummaryComplete'],
            include: [{
                model: RFQForms,
                as: 'rfqForms',
                where: { isDeleted: false },
                attributes: ['id', 'customerId'],
                required: false
            }]
        }).then((assy) => {
            if (assy) {
                if (assy.isReadyForPricing) {
                    return sequelize.query('CALL Sproc_GetCountForFilter (:prfqAssyID,:pcustomerID)',
                        {
                            replacements: {
                                prfqAssyID: assy.id,
                                pcustomerID: assy.rfqForms.customerId
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                            CountNotQuote: response[0][0]['COUNT(1)'],
                            NotQuotedList: _.values(response[1]),
                            DNPItemCount: response[2][0]['COUNT(1)'],
                            CountObsolate: response[3][0]['COUNT(1)'],
                            CountManual: response[4][0]['COUNT(1)']
                        }, null)).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isReadyForPricing: assy.isReadyForPricing }, null);
                }
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(consolidateModuleName)));
            }
        });
    },
    // internal method to update assy data
    updateAssyPricing: (res, req, supplierID, rfqAssyID, isPurchaseApi) => {
        const { sequelize } = req.app.locals.models;

        const PromisesAssy = [];
        var supplierObj = _.find(DATA_CONSTANT.PRICING_SUPPLIER, supplier => supplier.ID === parseInt(supplierID));
        PromisesAssy.push(sequelize
            .query('CALL Sproc_SetAssyAutoPricingStatus (:prfqAssyID, :ppricingApiName, :pstatus,:pisPurchaseApi,:ppricingSupplierID)',
                {
                    replacements: {
                        prfqAssyID: rfqAssyID,
                        ppricingApiName: supplierObj.Name,
                        pstatus: PRICING_STATUS.SendRequest,
                        pisPurchaseApi: isPurchaseApi,
                        ppricingSupplierID: supplierObj.ID
                    }
                })
            .then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.EMPTY;
            }));
        return Promise.all(PromisesAssy).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.EMPTY;
        });
    },


    // internal method to update line item data
    updateLineItemPricing: (res, req, suppliers, pricingObj, isPurchaseApi) => {
        const { sequelize } = req.app.locals.models;
        var supplierObj = _.find(DATA_CONSTANT.PRICING_SUPPLIER, supplier => supplier.ID === parseInt(suppliers.id));
        var PromisesLineItem = [];
        PromisesLineItem.push(sequelize.query('CALL Sproc_SetLineItemAutoPricingStatus (:prfqAssyID, :pconsolidateID, :ppricingApiName, :pstatus,:pisPurchaseApi,:ppricingSupplierID)', {
            replacements: {
                prfqAssyID: pricingObj.rfqAssyID,
                pconsolidateID: pricingObj.id,
                ppricingApiName: supplierObj.Name,
                pstatus: PRICING_STATUS.SendRequest,
                pisPurchaseApi: isPurchaseApi,
                ppricingSupplierID: supplierObj.ID
            }
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.EMPTY;
        }));
        return Promise.all(PromisesLineItem).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.EMPTY;
        });
    },

    // stop pricing request and update all to success
    // POST : /api/v1/consolidatepart/stopPricingRequests
    // @return none.
    stopPricingRequests: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.pricingApiObj && req.body.pricingApiObj.rfqAssyID > 0) {
            const errorMessage = COMMON.stringFormat(MESSAGE_CONSTANT.PRICING.PRICING_STOP, req.user.username, new Date());
            return sequelize.query('CALL Sproc_StopPricingRequests (:passyID, :pmessage,:pisPurchaseApi)', {
                replacements: {
                    passyID: req.body.pricingApiObj.rfqAssyID,
                    pmessage: errorMessage,
                    pisPurchaseApi: req.body.pricingApiObj.isPurchaseApi
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { msg: errorMessage }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get Status update for line item wise and assy wise status if it will get any error related to authenticate code.
    // POST : /api/v1/consolidatepart/updatePricingStatusDigiKeyError
    // @return websocket call to ui for update
    updatePricingStatusDigiKeyError: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const pricingObj = req.body;
            return sequelize.query('CALL Sproc_UpdateDigiKeyErrorStatus (:passyID, :pConsolidateID, :pstatus, :pmsg, :perrorMsg,:pisPurchaseApi,:ppricingSupplierID)', {
                replacements: {
                    passyID: pricingObj.AssyID,
                    pConsolidateID: pricingObj.ConsolidateID ? pricingObj.ConsolidateID : null,
                    pstatus: pricingObj.Status ? pricingObj.Status : null,
                    pmsg: pricingObj.Message ? pricingObj.Message : null,
                    perrorMsg: pricingObj.ErrorMessage ? pricingObj.ErrorMessage : null,
                    pisPurchaseApi: pricingObj.isPurchaseApi,
                    ppricingSupplierID: pricingObj.supplierID
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response.length > 0) {
                    const lineItemData = response[0][0];
                    req.body.isPurchaseApi = pricingObj.isPurchaseApi;
                    if (lineItemData) {
                        RFQSocketController.updateLineItemAutoPricingStatus(req, lineItemData);
                    }
                    const assemblyData = _.values(response[1]);
                    if (assemblyData.length === 0) {
                        RFQSocketController.updateAssemblyAutoPricingStatus(req, lineItemData);
                    }
                    pricingObj.userID = pricingObj.UserID;
                    RFQSocketController.askDigikeyAuthentication(req, pricingObj);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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

    // Get Status update for line item wise and assy wise status if it will get any error.
    // POST : /api/v1/consolidatepart/updatePricingStatusForError
    // @return websocket call to ui for update
    updatePricingStatusForError: (req, res) => {
        module.exports.updatePricingStatus(req, res);
    },
    // give web socket call to
    // POST : /api/v1/consolidatepart/externalPartBOMUpdate
    // @return websocket call to ui for update
    externalPartBOMUpdate: (req) => {
        const { ComponentBOMSetting } = req.app.locals.models;
        if (req.body) {
            const objExternalPrice = req.body;
            ComponentBOMSetting.findOne({
                where: {
                    refComponentID: objExternalPrice.partID,
                    isDeleted: false,
                    exteranalAPICallStatus: { [Op.ne]: 4 }
                },
                attributes: ['refComponentID', 'exteranalAPICallStatus']
            }).then((assy) => {
                if (assy) {
                    const consolidatePart = {
                        exteranalAPICallStatus: 4
                    };
                    ComponentBOMSetting.update(consolidatePart, {
                        where: {
                            refComponentID: objExternalPrice.partID,
                            isDeleted: false
                        },
                        fields: ['exteranalAPICallStatus']
                    }).then(() => {
                        RFQSocketController.sendBOMStatusVerification(req, objExternalPrice);
                    });
                }
            });
        }
    },
    // give web socket call to
    // POST : /api/v1/consolidatepart/ExternalPartUpdate
    // @return websocket call to ui for update
    ExternalPartUpdate: (req) => {
        if (req.body) {
            const objExternalPrice = req.body;
            RFQSocketController.sendPartUpdateVerification(req, objExternalPrice);
        }
    },
    // give web socket call to
    // POST : /api/v1/consolidatepart/externalPartBOMUpdateProgressbar
    // @return websocket call to ui for update
    externalPartBOMUpdateProgressbar: (req) => {
        if (req.body) {
            RFQSocketController.sendBOMStatusProgressbarUpdate(req, req.body);
        }
    },

    // Get Status update for line item wise and assy wise status it will update success status.
    // POST : /api/v1/consolidatepart/updatePricingStatusForSuccess
    // @return websocket call to ui for update
    updatePricingStatusForSuccess: (req, res) => {
        module.exports.updatePricingStatus(req, res);
    },

    // Common method to update status and call sp for update princing status and return data
    // @return websocket call to ui for update
    updatePricingStatus: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const pricingObj = req.body;
            return sequelize
                .query('CALL Sproc_SetAutoPricingStatus (:passyID, :pconsolidateID, :pstatus, :pmsg, :perrorMsg,:pisPurchaseApi,:ppricingSupplierID)',
                    {
                        replacements: {
                            passyID: pricingObj.AssyID,
                            pconsolidateID: pricingObj.ConsolidateID ? pricingObj.ConsolidateID : null,
                            pstatus: pricingObj.Status ? pricingObj.Status : null,
                            pmsg: pricingObj.Message ? pricingObj.Message : null,
                            perrorMsg: pricingObj.ErrorMessage ? pricingObj.ErrorMessage : null,
                            pisPurchaseApi: pricingObj.isPurchaseApi,
                            ppricingSupplierID: pricingObj.supplierID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then((response) => {
                    if (response.length > 0) {
                        const lineItemData = response[0][0];
                        const assemblyData = _.values(response[1]);
                        const remainingTime = _.values(response[2]);
                        req.body.isPurchaseApi = pricingObj.isPurchaseApi;
                        pricingObj.remainTime = remainingTime;
                        if (lineItemData) {
                            lineItemData.remainTime = remainingTime;
                            RFQSocketController.updateLineItemAutoPricingStatus(req, lineItemData);
                        }
                        if (assemblyData.length === 0) {
                            pricingObj.status = PRICING_STATUS.Success;
                            RFQSocketController.updateAssemblyAutoPricingStatus(req, pricingObj);
                        } else {
                            pricingObj.status = PRICING_STATUS.SendRequest;
                            RFQSocketController.updateAssemblyAutoPricingStatus(req, pricingObj);
                        }
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update consolidate part number attration rate and lead quantity
    // GET : /api/v1/consolidatepart/updateConsolidatePart;
    // @return success of updation
    updateConsolidatePart: (req, res) => {
        const { RFQConsolidatedMFGPNLineItem, RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        if (req.body) {
            const consolidateObj = req.body.consolidateObj;
            const consolidatePart = {
                attritionRate: consolidateObj.attritionRate,
                leadQty: consolidateObj.leadQty,
                updatedBy: req.user.id
            };
            return RFQConsolidatedMFGPNLineItem.update(consolidatePart, {
                where: {
                    id: consolidateObj.id,
                    IsDeleted: false
                },
                fields: ['id', 'attritionRate', 'leadQty', 'updatedBy']
            }).then(() => {
                const ConsolidateQty = {
                    finalPrice: null,
                    updatedBy: req.user.id,
                    unitPrice: null,
                    supplier: null,
                    selectedMpn: null,
                    selectionMode: null
                };
                return RFQConsolidatedMFGPNLineItemQuantity.update(ConsolidateQty, {
                    where: {
                        consolidateID: consolidateObj.id,
                        IsDeleted: false
                    },
                    fields: ['id', 'finalPrice', 'updatedBy', 'unitPrice', 'supplier', 'selectedMpn', 'selectionMode']
                }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(consolidateObj.column))).catch((err) => {
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get consolidate part quantity
    // GET : /api/v1/consolidatepart/getConsolidatePartQty;
    // @return consolidate final price list
    getConsolidatePartQty: (req, res) => {
        const { RFQConsolidatedMFGPNLineItemQuantity, RFQAssyQuantity, RFQAssyQuantityTurnTime, RFQConsolidatedMFGPNLineItem, RFQConsolidatedMFGPNLineItemAlternate } = req.app.locals.models;
        if (req.params.id) {
            return RFQConsolidatedMFGPNLineItem.findAll({
                where: {
                    isDeleted: false,
                    rfqAssyID: req.params.id
                },
                attributes: ['id', 'qpa'],
                required: false,
                include: [{
                    model: RFQConsolidatedMFGPNLineItemQuantity,
                    as: 'rfqConsolidatedMFGPNLineItemQuantity',
                    where: { isDeleted: false },
                    attributes: ['qtyID', 'finalPrice', 'supplier', 'unitPrice', 'selectedMpn', 'selectionMode', 'min', 'mult'],
                    required: false,
                    include: [{
                        model: RFQAssyQuantity,
                        as: 'rfqAssyQuantity',
                        where: { isDeleted: false },
                        attributes: ['id', 'requestQty'],
                        required: false,
                        include: [{
                            model: RFQAssyQuantityTurnTime,
                            as: 'rfqAssyQtyTurnTime',
                            where: { isDeleted: false },
                            attributes: ['id', 'turnTime', 'unitOfTime', 'rfqAssyQtyID'],
                            required: false
                        }]
                    }]
                }, {
                    model: RFQConsolidatedMFGPNLineItemAlternate,
                    as: 'rfqConsolidatedMFGPNLineItemAlternate',
                    where: { isDeleted: false },
                    attributes: ['PIDCode', 'id', 'mfgPN'],
                    required: false
                }]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // save manual price for selected consolidate part
    // POST : /api/v1/consolidatepart/saveManualPrice;
    // @return saved price
    saveManualPrice: (req, res) => {
        const { SupplierQuotePartPrice } = req.app.locals.models;
        if (req.body.objManualPrice) {
            const objManualPrice = req.body.objManualPrice;
            const mongodb = global.mongodb;
            // eslint-disable-next-line no-underscore-dangle
            objManualPrice.pricingObject._id = new Bson.ObjectId();
            objManualPrice.pricingObject.UpdatedTimeStamp = moment.utc().format('MM/DD/YYYY');
            objManualPrice.pricingObject.TimeStamp = new Date(moment.utc());
            if (objManualPrice.pricingObject.refSupplierQuotePartPriceID) {
                req.body.refSupplierQuotePartPriceIDs.push(objManualPrice.pricingObject.refSupplierQuotePartPriceID);
            }
            const promises = [];
            const partPricingObj = {
                isPartCosting: true
            };
            COMMON.setModelUpdatedByObjectFieldValue(req.user, partPricingObj);
            promises.push(
                SupplierQuotePartPrice.update(partPricingObj, {
                    where: {
                        id: {
                            [Op.in]: req.body.refSupplierQuotePartPriceIDs
                        }
                    },
                    fields: ['isPartCosting', 'updatedBy', 'updatedAt', 'updateByRoleId']
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            promises.push(mongodb.collection('FJTMongoQtySupplier').insertOne(objManualPrice.pricingObject).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
            _.each(objManualPrice.priceBreakList, (priceBreak) => {
                // eslint-disable-next-line no-underscore-dangle
                priceBreak._id = new Bson.ObjectId();
                // =>> Changes Done as per direction from Champak to solve date formate in mongo in case of manual price on 01-09-2020
                // priceBreak.timeStamp = moment.utc().format('MM/DD/YYYY hh:mm A');
                // eslint-disable-next-line no-underscore-dangle
                priceBreak.timeStamp = (moment.utc())._d;
                // <<= Changes Done as per direction from Champak to solve date formate in mongo in case of manual price on 01-09-2020
                priceBreak.UpdatedTimeStamp = moment.utc().format('MM/DD/YYYY');
                // eslint-disable-next-line no-underscore-dangle
                priceBreak.qtySupplierID = objManualPrice.pricingObject._id;
                promises.push(mongodb.collection('PriceBreakComponent').insertOne(priceBreak).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            });
            _.each(objManualPrice.assyPrice, (assyPrice) => {
                // eslint-disable-next-line no-underscore-dangle
                assyPrice._id = new Bson.ObjectId();
                // eslint-disable-next-line no-underscore-dangle
                assyPrice.qtySupplierID = objManualPrice.pricingObject._id;
                promises.push(mongodb.collection('AssemblyQtyBreak').insertOne(assyPrice).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            });
            return Promise.all(promises).then((responses) => {
                if (req.body.fromController) {
                    return {
                        status: STATE.SUCCESS,
                        data: responses
                    };
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.RFQ.MANUAL_PRICING_SAVE);
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

    // save supplier price for selected consolidate part
    // POST : /api/v1/consolidatepart/saveSupplierQuotePrice;
    // @return saved price
    saveSupplierQuotePrice: (req, res) => {
        if (req.body.supplierQuoteObj) {
            const supplierQuoteObj = req.body.supplierQuoteObj;
            const promises = [];
            req.body.refSupplierQuotePartPriceIDs = [];
            _.each(supplierQuoteObj, (item) => {
                req.body.objManualPrice = item;
                req.body.fromController = true;
                promises.push(module.exports.saveManualPrice(req, res));
            });
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.PRICING.MANUAL_PRICING_SAVE)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_FOUND(consolidateModuleName)),
                    err.errors, err.fields);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // save price for new added qty
    // POST : /api/v1/consolidatepart/saveAssyPriceQtyBreak;
    // @return saved price for new qty
    saveAssyPriceQtyBreak: (req, res) => {
        const objAssyQtyBreak = req.body.assyQtyBreak;
        var mongodb = global.mongodb;
        var promises = [];
        _.each(objAssyQtyBreak, (qtyBreak) => {
            qtyBreak.qtySupplierID = new Bson.ObjectId(qtyBreak.qtySupplierID);
            // eslint-disable-next-line no-underscore-dangle
            if (qtyBreak._id) {
                // eslint-disable-next-line no-underscore-dangle
                qtyBreak._id = new Bson.ObjectId(qtyBreak._id);
                // eslint-disable-next-line no-underscore-dangle
                const myquery = { _id: qtyBreak._id };
                const newvalues = { $set: qtyBreak };
                promises.push(mongodb.collection('AssemblyQtyBreak').updateOne(myquery, newvalues).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            } else {
                // eslint-disable-next-line no-underscore-dangle
                qtyBreak._id = new Bson.ObjectId();
                promises.push(mongodb.collection('AssemblyQtyBreak').insertOne(qtyBreak).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            }
        });

        Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // update manual price for selected consolidate part
    // POST : /api/v1/consolidatepart/updateManualPrice;
    // @return updated price
    updateManualPrice: (req, res) => {
        if (req.body.objManualPrice) {
            const objManualPrice = req.body.objManualPrice;
            const mongodb = global.mongodb;
            // eslint-disable-next-line no-underscore-dangle
            objManualPrice.pricingObject._id = new Bson.ObjectId(objManualPrice.pricingObject._id);
            objManualPrice.pricingObject.UpdatedTimeStamp = moment.utc().format('MM/DD/YYYY');
            objManualPrice.pricingObject.TimeStamp = new Date(moment.utc());
            const promises = [];
            // eslint-disable-next-line no-underscore-dangle
            const myquery = { _id: objManualPrice.pricingObject._id };
            const newvalues = { $set: objManualPrice.pricingObject };
            promises.push(mongodb.collection('FJTMongoQtySupplier').updateOne(myquery, newvalues).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
            // eslint-disable-next-line no-underscore-dangle
            const newPriceBreaks = _.filter(objManualPrice.priceBreakList, pbreak => !pbreak._id);
            // eslint-disable-next-line no-underscore-dangle
            const existPriceBreaks = _.filter(objManualPrice.priceBreakList, pbreak => pbreak._id);
            // eslint-disable-next-line no-underscore-dangle
            promises.push(mongodb.collection('PriceBreakComponent').find({ qtySupplierID: objManualPrice.pricingObject._id }).toArray().then((result) => {
                const pricingResults = result;
                var allpromises = [];
                _.each(pricingResults, (existBreak) => {
                    // eslint-disable-next-line no-underscore-dangle
                    var priceBreak = _.find(existPriceBreaks, priceB => priceB._id === existBreak._id.toString());
                    if (priceBreak) {
                        // eslint-disable-next-line no-underscore-dangle
                        priceBreak._id = existBreak._id;
                        // eslint-disable-next-line no-underscore-dangle
                        priceBreak.qtySupplierID = objManualPrice.pricingObject._id;
                        // eslint-disable-next-line no-underscore-dangle
                        priceBreak.timeStamp = (moment.utc())._d;
                        priceBreak.UpdatedTimeStamp = moment.utc().format('MM/DD/YYYY');
                        // eslint-disable-next-line no-underscore-dangle
                        const myqueryprice = { _id: priceBreak._id };
                        const newvaluesprice = { $set: priceBreak };
                        allpromises.push(mongodb.collection('PriceBreakComponent').updateOne(myqueryprice, newvaluesprice).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                    } else {
                        // eslint-disable-next-line no-underscore-dangle
                        const myqueryBreak = { _id: existBreak._id };
                        allpromises.push(mongodb.collection('PriceBreakComponent').deleteOne(myqueryBreak, () => STATE.SUCCESS));
                    }
                });
                _.each(newPriceBreaks, (newBreak) => {
                    // eslint-disable-next-line no-underscore-dangle
                    newBreak._id = new Bson.ObjectId();
                    // eslint-disable-next-line no-underscore-dangle
                    newBreak.qtySupplierID = objManualPrice.pricingObject._id;
                    // eslint-disable-next-line no-underscore-dangle
                    newBreak.timeStamp = (moment.utc())._d;
                    newBreak.UpdatedTimeStamp = moment.utc().format('MM/DD/YYYY');
                    allpromises.push(mongodb.collection('PriceBreakComponent').insertOne(newBreak).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
                return Promise.all(allpromises).then(() => STATE.SUCCESS);
            })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            _.each(objManualPrice.assyPrice, (assyPrice) => {
                // eslint-disable-next-line no-underscore-dangle
                var myqueryAssy = { _id: new Bson.ObjectId(assyPrice._id) };
                // eslint-disable-next-line no-underscore-dangle
                assyPrice.qtySupplierID = objManualPrice.pricingObject._id;
                // eslint-disable-next-line no-underscore-dangle
                assyPrice._id = new Bson.ObjectId(assyPrice._id);
                const newvaluesAssy = { $set: assyPrice };
                promises.push(mongodb.collection('AssemblyQtyBreak').updateOne(myqueryAssy, newvaluesAssy).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
            });
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.RFQ.MANUAL_PRICING_UPDATE)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of consolidated mfgpn for next and previous detail
    // GET : /api/v1/consolidatepart/retrieveAllQtyPricing
    // @param {id} int
    // @return List of consolidated parts quantity
    retrieveAllQtyPricing: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.prfqAssyID) {
            return sequelize.query('CALL Sproc_GetAllQtyPricing (:prfqAssyID)', {
                replacements: {
                    prfqAssyID: req.params.prfqAssyID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                // return resHandler.successRes(res, 200, STATE.SUCCESS, { consolidateQty: _.values(response[0]) });
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { consolidateQty: _.values(response[0]) }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // clean pricing status
    // POST : /api/v1/consolidatepart/cleanPrice
    // @return Clean Price of all assembly
    cleanPrice: (req, res) => {
        const { RFQAssyAutoPricingStatus, RFQLineItemAutoPricingStatus } = req.app.locals.models;
        if (req.body.priceClean) {
            const priceClean = req.body.priceClean;
            const objStatus = {
                status: null,
                msg: '',
                errorMsg: ''
            };
            const promises = [];
            promises.push(module.exports.updateConsolidateSelectPrice(req, priceClean.rfqAssyID, null).then(status => status));
            const myquery = { rfqAssyID: priceClean.rfqAssyID, SourceOfPrice: 'Auto' };

            promises.push(module.exports.updatePricing(req, myquery).then(status => status));
            promises.push(RFQAssyAutoPricingStatus.update(objStatus, {
                where: {
                    rfqAssyID: priceClean.rfqAssyID
                },
                fields: ['status', 'msg', 'errorMsg']
            }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));

            promises.push(RFQLineItemAutoPricingStatus.update(objStatus, {
                where: {
                    rfqAssyID: priceClean.rfqAssyID
                },
                fields: ['status', 'msg', 'errorMsg']
            }).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            }));
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.RFQ.RESET_PRICING)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // clean pricing status
    // POST : /api/v1/consolidatepart/cleanPrice
    // @return Clean Price of all assembly
    cleanSelectionPrice: (req, res) => {
        if (req.body.priceClean) {
            const priceClean = req.body.priceClean;
            const promises = [];
            promises.push(module.exports.updateConsolidateSelectPrice(req, priceClean.rfqAssyID, priceClean.qtyID).then(status => status));
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.RFQ.RESET)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // update consolidate selected price object
    updateConsolidateSelectPrice: (req, rfqAssyID, qtyID) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_UpdateAssyConsolidateQuantity (:prfqAssyID,:qtyID)', {
            replacements: {
                prfqAssyID: rfqAssyID,
                qtyID: qtyID
            }
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // update pricing detail in mongo db
    updatePricing: (req, myquery) => {
        var mongodb = global.mongodb;
        var newvalues = { $set: { IsDeleted: true } };
        return mongodb.collection('FJTMongoQtySupplier').updateMany(myquery, newvalues).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // Get List of all parts
    // GET : /api/v1/consolidatepart/getAlternatePartList
    // @param {id} int
    // @return List of consolidated parts
    getAlternatePartList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_getAlternatePartList (:pconsolidateID,:pisPurchaseApi)', {
            replacements: {
                pconsolidateID: req.query.consolidateID,
                pisPurchaseApi: req.query.pisPurchaseApi === 'false' ? false : true
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { alternateParts: _.values(response[0]), consolidateQty: _.values(response[1]) }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get List of supplier for pricing
    // GET : /api/v1/consolidatepart/getSupplierList
    // @param {id} int
    // @return list of pricing supplier
    getSupplierList: (req, res) => {
        const { MfgCodeMst } = req.app.locals.models;
        var where = {
            isDeleted: false,
            mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.DIST
        };
        if (req.query.isPricing) {
            where.isPricingApi = true;
        }
        MfgCodeMst.findAll({
            where: where,
            attributes: ['id', 'mfgcode', 'mfgName', 'isSupplierEnable'],
            paranoid: false
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get List of all parts
    // GET : /api/v1/consolidatepart/getAssyIDAlternatePartList
    // @param {id} int
    // @return List of consolidated parts
    // getAssyIDAlternatePartList: (req, res) => {
    //    const {  RFQConsolidatedMFGPNLineItemAlternate,Component,MfgCodeMst,RFQRoHS,ComponentPartStatus,RFQConsolidatedMFGPNLineItem,UOMs,RFQPartType,RFQMountingType } = req.app.locals.models;
    //    RFQConsolidatedMFGPNLineItem.findAll({
    //        where: {
    //            rfqAssyID:req.query.rfqAssyID,
    //            isDeleted: false
    //        },
    //        attributes: ['id', 'numOfRows', 'numOfposition'],
    //        include:[{
    //            model: RFQConsolidatedMFGPNLineItemAlternate,
    //            as: 'rfqConsolidatedMFGPNLineItemAlternate',
    //            where: { isDeleted: false },
    //            attributes: ['mfgPN', 'mfgPNID', 'mfgCodeID','customerApproval'],
    //            required: false,
    //            include: [{
    //                model: MfgCodeMst,
    //                as: 'mfgCodeMst',
    //                where: { isDeleted: false },
    //                attributes: ['mfgCode', 'mfgName','mfgType'],
    //                required: false,
    //            },
    //       {
    //           model: Component,
    //           as: 'component',
    //           where: { isDeleted: false },
    //           attributes: ['mfgPNDescription', 'RoHSStatusID','PIDCode','partPackage','partStatus','noOfPosition','noOfRows','uomText','unit','packageQty','connecterTypeID','mountingtypeID','functionalCategoryID'],
    //           required: false,
    //           include:[{
    //               model: ComponentPartStatus,
    //               as: 'componentPartStatus',
    //               where: { isDeleted: false },
    //               attributes: ['id', 'name'],
    //               required: false,
    //           },
    //           {
    //               model: RFQRoHS,
    //               as: 'rfq_rohsmst',
    //               where: { isDeleted: false },
    //               attributes: ['id', 'name','isActive','rohsIcon'],
    //               required: false,
    //           },
    //           {
    //               model: UOMs,
    //               as: 'UOMs',
    //               where: { isDeleted: false },
    //               attributes: ['id', 'unitName','abbreviation'],
    //               required: false,
    //           },
    //        {
    //            model: RFQPartType,
    //            as: 'rfqPartType',
    //            where: { isDeleted: false },
    //            attributes: ['id', 'partTypeName','isActive'],
    //            required: false,
    //        },
    //        {
    //            model: RFQMountingType,
    //            as: 'rfqMountingType',
    //            where: { isDeleted: false },
    //            attributes: ['id', 'name','isActive'],
    //            required: false,
    //        }
    //           ]
    //       }
    //            ]
    //        }]
    //    }).then((response) => {
    //        return resHandler.successRes(res, 200, STATE.SUCCESS, response,null);
    //    }).catch(() => {
    //        console.trace();
    //        console.error(err);
    //        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
    //    });
    // },

    getAssyIDAlternatePartList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_getAssyIDAlternatePartList (:pAssyID)', {
            replacements: {
                pAssyID: req.query.rfqAssyID
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partList: _.values(response[0]) }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // save manual price for import details
    // POST : /api/v1/consolidatepart/saveImportPricing;
    // @return saved price
    saveImportPricing: (req, res) => {
        if (req.body.objManualPrice) {
            const objManualPrice = req.body.objManualPrice;
            const mongodb = global.mongodb;
            const promises = [];
            _.each(objManualPrice, (manualPrice) => {
                // eslint-disable-next-line no-underscore-dangle
                manualPrice.supplierQty._id = new Bson.ObjectId();
                manualPrice.supplierQty.UpdatedTimeStamp = moment.utc().format(COMMON.DATEFORMAT_COMMON);
                manualPrice.supplierQty.TimeStamp = new Date(moment.utc());
                promises.push(mongodb.collection('FJTMongoQtySupplier').insertOne(manualPrice.supplierQty).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));
                _.each(manualPrice.priceBreakList, (priceBreak) => {
                    if (priceBreak.supplierPN && priceBreak.supplierID) {
                        promises.push(module.exports.getSupplierPartNumberID(req, priceBreak.supplierPN, priceBreak.supplierID).then((ID) => {
                            // eslint-disable-next-line no-underscore-dangle
                            priceBreak._id = new Bson.ObjectId();
                            priceBreak.timeStamp = new Date(moment.utc());
                            priceBreak.UpdatedTimeStamp = moment.utc().format(COMMON.DATEFORMAT_COMMON);
                            // eslint-disable-next-line no-underscore-dangle
                            priceBreak.qtySupplierID = manualPrice.supplierQty._id;
                            priceBreak.supplierPartID = ID;
                            return mongodb.collection('PriceBreakComponent').insertOne(priceBreak).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            });
                        }));
                    } else {
                        // eslint-disable-next-line no-underscore-dangle
                        priceBreak._id = new Bson.ObjectId();
                        priceBreak.timeStamp = new Date(moment.utc());
                        priceBreak.UpdatedTimeStamp = moment.utc().format(COMMON.DATEFORMAT_COMMON);
                        // eslint-disable-next-line no-underscore-dangle
                        priceBreak.qtySupplierID = manualPrice.supplierQty._id;
                        promises.push(mongodb.collection('PriceBreakComponent').insertOne(priceBreak).then(() => STATE.SUCCESS).catch((err) => {
                            console.trace();
                            console.error(err);
                            return STATE.FAILED;
                        }));
                    }
                });
                _.each(manualPrice.assyQtyBreak, (assyPrice) => {
                    // eslint-disable-next-line no-underscore-dangle
                    assyPrice._id = new Bson.ObjectId();
                    // eslint-disable-next-line no-underscore-dangle
                    assyPrice.qtySupplierID = manualPrice.supplierQty._id;
                    promises.push(mongodb.collection('AssemblyQtyBreak').insertOne(assyPrice).then(() => STATE.SUCCESS).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
            });
            return Promise.all(promises).then(responses => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.RFQ.MANUAL_PRICING_SAVE)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // save pricing history
    // POST:api/v1/consolidatepart/savePricingHistory
    // @save pricing history
    savePricingHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const historyObj = req.body.historyObj;
        sequelize.query('CALL Sproc_savePricingHistory (:rfqAssyID,:created)', {
            replacements: {
                rfqAssyID: historyObj.rfqAssyID,
                created: req.user.id
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (!historyObj.isSubmit) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(DATA_CONSTANT.PRICING_HISTORY.NAME));
            } else {
                const historyID = (_.values(response[0]))[0];
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, historyID, null);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Get Available stock for consolidate line item.
    // GET : /api/v1/consolidatepart/getConsolidateAvailableStock
    // @return Available stock
    getConsolidateAvailableStock: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.pconsolidateID) {
            return sequelize.query('CALL Sproc_GetLineItemAvailableStock (:pconsolidateID)', {
                replacements: {
                    pconsolidateID: req.params.pconsolidateID
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response.length > 0) {
                    const assemblyData = _.values(response[0]);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, assemblyData, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(consolidateModuleName), err: null, data: null });
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
    // Get List of pricing for assembly id
    // GET : /api/v1/consolidatepart/retrievePricingList;
    // @return List of pricing for partnumber
    retrievePricingList: (req, res) => {
        if (req.params.rfqAssyID) {
            const objPrice = {
                rfqAssyID: parseInt(req.params.rfqAssyID),
                IsDeleted: false,
                isPurchaseApi: { $ne: true }
            };
            if (req.params.isPurchaseApi === 'true') {
                objPrice.isPurchaseApi = true;
            }
            const response = {};
            const mongodb = global.mongodb;
            return mongodb.collection('FJTMongoQtySupplier').aggregate([
                { $match: objPrice },
                { $lookup: { from: 'AssemblyQtyBreak', localField: '_id', foreignField: 'qtySupplierID', as: 'assemblyQtyBreak' } }
            ]).toArray((err, result) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(consolidateModuleName)),
                        err.errors, err.fields);
                }
                response.pricing = result;
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of pricing for assembly id
    // GET : /api/v1/consolidatepart/retrievePricingAssyWise;
    // @return List of pricing for partnumber
    retrievePricingAssyWise: (req, rfqAssyID) => {
        if (rfqAssyID) {
            const objPrice = {
                rfqAssyID: rfqAssyID,
                IsDeleted: false
            };
            const mongodb = global.mongodb;
            return mongodb.collection('FJTMongoQtySupplier').aggregate([
                { $match: objPrice },
                { $lookup: { from: 'AssemblyQtyBreak', localField: '_id', foreignField: 'qtySupplierID', as: 'assemblyQtyBreak' } }
            ]).toArray().then(result => result)
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return [];
                });
        } else {
            return [];
        }
    },
    // Get List of non quoted line item qty and price selection setting
    // GET : /api/v1/consolidatepart/getnonQuotedQty;
    // @return List of non quoted line item qty and price selection setting
    getnonQuotedQty: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.rfqAssyID) {
            return sequelize.query('CALL Sproc_GetNotQuotedListForPricing (:prfqAssyID,:pisPurchaseApi)', {
                replacements: {
                    prfqAssyID: req.params.rfqAssyID,
                    pisPurchaseApi: req.params.isPurchaseApi === 'true' ? true : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                var Apiresponse = {
                };
                if (response.length > 0) {
                    const notQuoteQtyList = _.values(response[0]) ? _.values(response[0]) : [];
                    const priceSetting = _.values(response[1]) ? _.values(response[1]) : [];
                    Apiresponse.notQuoteQtyList = notQuoteQtyList;
                    Apiresponse.priceSetting = priceSetting;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, Apiresponse, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of qty and pricing history combine
    // GET : /api/v1/consolidatepart/getPricingHistoryList;
    // @return List of pricing history for drop down and assy qty list
    getPricingHistoryList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.rfqAssyID) {
            return sequelize.query('CALL Sproc_GetPricingHistory (:prfqAssyID)', {
                replacements: {
                    prfqAssyID: req.params.rfqAssyID
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                var Apiresponse = {
                };
                if (response.length > 0) {
                    const pricingHistoryList = _.values(response[0]) ? _.values(response[0]) : [];
                    const assyQtyList = _.values(response[1]) ? _.values(response[1]) : [];
                    Apiresponse.pricingHistoryList = pricingHistoryList;
                    Apiresponse.assyQtyList = assyQtyList;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, Apiresponse, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // Get List of consolidated mfgpn line items
    // GET : /api/v1/consolidatepart/getPricingHistoryforAssembly
    // @param {id} int
    // @return List of consolidated parts
    getPricingHistoryforAssembly: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        }
        const replace = {
            ppageIndex: req.query.page,
            precordPerPage: filter.limit,
            pOrderBy: filter.strOrderBy || null,
            pWhereClause: strWhere,
            prfqAssyID: req.query.prfqAssyID,
            passyQtyID: req.query.passyQtyID
        };
        let ProcedureName = '';
        if (req.query.spName === 'Sproc_GetPricingHistoryLastFive') { ProcedureName = COMMON.stringFormat('CALL {0} (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prfqAssyID,:passyQtyID)', req.query.spName); } else {
            ProcedureName = COMMON.stringFormat('CALL {0} (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prfqAssyID,:passyQtyID,:pstartHistory,:plastHistory)', req.query.spName);
            replace.pstartHistory = req.query.pstartHistory;
            replace.plastHistory = req.query.plastHistory;
        }
        return sequelize.query(ProcedureName, {
            replacements: replace, type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            consolidateParts: _.values(response[1]),
            Count: response[0][0]['COUNT(1)'],
            totalCount: _.values(response[2])
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // download datasheet link
    getAvailableUpdateDatasheetLinkList: (req, res) => {
        if (req.body) {
            module.exports.saveDataSheetFile(req, req.body, res);
        }
    },
    // download file at specific location
    saveDataSheetFile: (req, objDataSheet, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
            replacements: {
                pGencFileOwnerType: COMMON.AllEntityIDS.Component.Name,
                pRefTransID: req.body.refComponentID || null,
                pIsReturnDetail: true
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            const genFilePath = `${DATA_CONSTANT.COMPONENT.DATASHEET_BASE_PATH}/`;
            const documentCreatedDateInfo = _.first(_.values(response[0]));

            if (!fs.existsSync(`${genFilePath}${documentCreatedDateInfo.newDocumentPath}/${DATA_CONSTANT.COMPONENT.DATASHEET_FOLDER_NAME}`)) {
                fs.mkdirSync(`${genFilePath}${documentCreatedDateInfo.newDocumentPath}/${DATA_CONSTANT.COMPONENT.DATASHEET_FOLDER_NAME}`, { recursive: true });
            }

            let fileName;
            const originalURL = objDataSheet.datasheetURL;
            const strobj = objDataSheet.datasheetURL.split('/');
            if (_.includes(objDataSheet.datasheetURL, '.pdf')) {
                fileName = strobj[strobj.length - 1];
                // commented due to it create issue if file name has two pdf words including extension
                // this part has above case:    33+ SUPER (3/4"X66')

                /* var fileData = fileName.split('pdf');
                fileName = COMMON.stringFormat("{0}pdf", fileData[0]);*/
                const dataSheet = objDataSheet.datasheetURL.split('.pdf');
                objDataSheet.datasheetURL = COMMON.stringFormat('{0}.pdf', dataSheet[0]);
            } else {
                fileName = COMMON.stringFormat('{0}.pdf', strobj[strobj.length - 2]);
            }
            // used trim to handle empty stace issue in file name for part "DP190-GRAY" sheet name ""
            fileName = fileName.trim();
            objDataSheet.name = fileName;
            // originalURL = objDataSheet.datasheetURL;
            const destPath = COMMON.stringFormat('{0}{1}', `${genFilePath}${documentCreatedDateInfo.newDocumentPath}/${DATA_CONSTANT.COMPONENT.DATASHEET_FOLDER_NAME}/`, fileName);
            if (!fs.existsSync(destPath)) {
                try {
                    const file = fs.createWriteStream(destPath);
                    try {
                        // bug id: 23661, 23853
                        // var resp = request(objDataSheet.datasheetURL).pipe(file);
                        // Axios({
                        //     url: originalURL,
                        //     method: 'GET',
                        //     responseType: 'stream'
                        // }).then((response) => {
                        //     response.data.pipe(file);
                        //     return new Promise((resolve, reject) => {
                        //         file.on('finish', resolve);
                        //         file.on('error', reject);
                        //         return STATE.SUCCESS;
                        //     });
                        // }).catch((error) => {
                        //     console.trace();
                        //     console.error(error);
                        //     return STATE.FAILED;
                        // });
                        const options = {
                            method: 'GET',
                            url: originalURL,
                            headers: {
                                Accept: '*/*'
                            }
                        };
                        request(options, (error) => {
                            if (error) {
                                console.trace();
                                console.error(error);
                            }
                        }).pipe(file);

                        module.exports.updateDataSheetLink(req, objDataSheet);
                        // eslint-disable-next-line no-empty
                    } catch (e) {
                        return STATE.FAILED;
                    }
                    module.exports.updateDataSheetLink(req, objDataSheet);
                } catch (e) {
                    return STATE.FAILED;
                }
            } else {
                module.exports.updateDataSheetLink(req, objDataSheet);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // update datasheetlink
    updateDataSheetLink: (req, objDataSheet) => {
        const { ComponentDataSheets } = req.app.locals.models;
        var obj = {
            // datasheetName: objDataSheet.name,
            isDownloadCompleted: 1,
            updatedBy: 'Auto',
            updateByRoleId: DATA_CONSTANT.USER_ROLE.SUPER_ADMIN.ID,
            updatedAt: COMMON.getCurrentUTC()
        };
        return ComponentDataSheets.update(obj, {
            where: {
                id: objDataSheet.id,
                isDeleted: false
            },
            fields: ['isDownloadCompleted', 'updatedBy']
        }).then(() => {
            const dataObj = {
                datasheetURL: objDataSheet.name,
                datasheetName: objDataSheet.name,
                refComponentID: req.body.refComponentID,
                createdBy: 'Auto',
                updatedBy: 'Auto',
                createByRoleId: DATA_CONSTANT.USER_ROLE.SUPER_ADMIN.ID,
                updateByRoleId: DATA_CONSTANT.USER_ROLE.SUPER_ADMIN.ID,
                isDeleted: 0,
                isDownloadCompleted: 1
            };
            return ComponentDataSheets.create(dataObj, {}).then(() => STATE.SUCCESS).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // give web socket call to
    // POST : /api/v1/consolidatepart/externalPartBOMUpdateProgressbar
    // @return websocket call to ui for update
    externalPartMasterUpdateProgressbar: (req) => {
        if (req.body) {
            RFQSocketController.externalPartMasterUpdateProgressbar(req, req.body);
        }
    },


    // remove status from mongodb table
    getSupplierPartNumberID: (req, partNumber, id) => {
        const { Component } = req.app.locals.models;
        let partID = null;
        return Component.findOne({
            where: {
                mfgPN: partNumber,
                mfgcodeID: id,
                isDeleted: false
            },
            attributes: ['id']
        }).then((assy) => {
            if (assy) {
                partID = assy.id;
            }
            return partID;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return partID;
        });
    },
    // Get list of Used Pricing
    // POST : /api/v1/consolidatepart/getUsedPricing
    // @param {id} int
    // @return List of consolidated qty
    getUsedPricing: (req, res) => {
        const { RFQConsolidatedMFGPNLineItemQuantity } = req.app.locals.models;
        if (req.body.rfqSupplierID) {
            return RFQConsolidatedMFGPNLineItemQuantity.findOne({
                where: {
                    rfqQtySupplierID: req.body.rfqSupplierID,
                    isDeleted: false
                },
                attributes: ['id']
            }).then(Apiresponse => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, Apiresponse, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Pricing
    // POST : /api/v1/consolidatepart/removeSelectedQuotePrice
    // @param {id} int
    // @return updated pricing
    removeSelectedQuotePrice: (req, res) => {
        if (req.body) {
            const myquery = {
                rfqAssyID: req.body.rfqAssyID,
                ConsolidateID: req.body.ConsolidateID
            };
            return SupplierQuoteController.manageSupplierQuotePartPricePartCosting(req, myquery).then(() => {
                const newquery = { _id: new Bson.ObjectId(req.body.id) };
                module.exports.updatePricing(req, newquery).then((response) => {
                    if (response === STATE.SUCCESS) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                });
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
