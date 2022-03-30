const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');
const { Op } = require('sequelize');

const purchaseModuleName = DATA_CONSTANT.PURCHASE.Name;
const PricingModuleName = DATA_CONSTANT.PRICING.NAME;
const inputFields = [
    'refAssyId',
    'refBOMLineID',
    'refComponentId',
    'distMfgCodeID',
    'poNumber',
    'poDate',
    'poQty',
    'poPricePerUnit',
    'soNumber',
    'createdBy'
];
const pricingInputFields = [
    'refMongoTrnsID',
    'refPricePartID',
    'refquoteQtyEach',
    'refQuoteQtyPriceEach',
    'refQuoteUnitQty',
    'refQuoteUnitPriceEach',
    'refpackagingID',
    'refsupplierID',
    'refLeadTime',
    'refSelectedPartQtyStock',
    'refSelectedPartUnitStock',
    'refsupplierQtyStcok',
    'refsupplierUnitStock',
    'refCumulativeStock',
    'refPriceselectionMode',
    'refCumulativeStockSuppliers'
];

module.exports = {

    // Get kit release list
    // POST : /api/v1/purchase/getPurchaseList
    // @param Pagination model
    // @return API response
    getPurchaseList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrivePurchaseList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartId,:pRefSalesOrderDetailId,:pLineId,:pPackagingAlias,:pCustomerId)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pPartId: req.body.partID || null,
                pRefSalesOrderDetailId: req.body.refSalesOrderDetailId,
                pLineId: req.body.lineId || 0,
                pPackagingAlias: req.body.packagingAlias ? JSON.parse(req.body.packagingAlias) : false,
                pCustomerId: req.body.customerId || 0
            },
            type: sequelize.QueryTypes.SELECT
        }).then((responseDetail) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                kitReleaseList: _.values(responseDetail[1]),
                Count: responseDetail[0][0]['TotalRecord']
            }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get kit Allocate assembly List
    // GET : /api/v1/purchase/kitAllocationAssyList
    // @param {id} int
    // @return List of umid
    kitAllocationAssyList: (req, res) => {
        const {
            KitAllocationAssyDetail,
            Component,
            ComponentBOMSetting,
            RFQRoHS
        } = req.app.locals.models;

        if (req.params && req.params.id) {
            return KitAllocationAssyDetail.findAll({
                where: {
                    refSalesOrderDetID: req.params.id
                },
                model: KitAllocationAssyDetail,
                attributes: ['id', 'partId', 'refSalesOrderDetID', 'perAssyBuildQty', 'totalAssyBuildQty', 'kitQty', 'totalAssyMrpQty', 'mrpQty', 'bomInternalVersion', 'bomInternalVersionString', 'bomAssyLevel'],
                include: [{
                    model: Component,
                    as: 'kit_allocation_component',
                    attributes: ['id', 'mfgPN', 'PIDCode'],
                    required: false,
                    include: [{
                        model: RFQRoHS,
                        as: 'rfq_rohsmst',
                        attributes: ['id', 'name', 'rohsIcon']
                    }]
                }]
            }).then((asseblyList) => {
                if (asseblyList.length > 0) {
                    const obj = _.find(asseblyList, data => data.bomAssyLevel === 0);
                    if (obj) {
                        return ComponentBOMSetting.findOne({
                            where: {
                                refComponentID: obj.partId
                            },
                            model: ComponentBOMSetting,
                            attributes: [ ['refComponentID','id'], 'liveInternalVersion', 'liveVersion']
                        }).then((objComponent) => {
                            asseblyList.push(objComponent);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, asseblyList, null);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, asseblyList, null);
                    }
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, asseblyList, null);
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

    // Get purchase Consolidated List
    // POST : /api/v1/purchase/getPurchaseConsolidatedList
    // @param Pagination model
    // @return API response
    getPurchaseConsolidatedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrivePurchaseConsolidatedList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartId,:pKitQty,:pPOQty,:pMRPQty,:pPackagingAlias,:pRefSalesOrderDetID,:pLineId,:pCustomerId)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pPartId: req.body.partID || null,
                pKitQty: req.body.kitQty,
                pPOQty: req.body.poQty,
                pMRPQty: req.body.mrpQty,
                pPackagingAlias: req.body.packagingAlias ? JSON.parse(req.body.packagingAlias) : false,
                pRefSalesOrderDetID: req.body.SalesOrderDetailId || null,
                pLineId: req.body.lineId || null,
                pCustomerId: req.body.customerId || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            purchaseConsolidatedList: _.values(response[1]),
            Count: response[0][0]['TotalRecord'],
            autoPricingStatus: _.values(response[2])
        }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get List of PID code for purchase PID Autocomplete list
    // POST : /api/v1/purchase/getPurchasePIDcodeSearch
    // @return List of PID code
    getPurchasePIDcodeSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetPurchasePIDcodeSearch(:pRfqLineitemId,:pIsPackagingAlias,:pSearch)', {
            replacements: {
                pRfqLineitemId: req.body.listObj.rfqLineitemId || null,
                pIsPackagingAlias: req.body.listObj.isPackagingAlias || null,
                pSearch: req.body.listObj.query || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            data: _.values(response[0])
        }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Create Purchase Parts Details
    // POST : /api/v1/purchase/createPurchaseParts
    // @return New create Purchase Part
    createPurchaseParts: (req, res) => {
        const {
            PurchasePartsDetails
        } = req.app.locals.models;
        var messageContent = {};
        if (req.body.purchaseObj) {
            COMMON.setModelCreatedByFieldValue(req);
            req.body.purchaseObj.createdBy = req.body.createdBy;
            req.body.purchaseObj.updatedBy = req.body.updatedBy;
            req.body.purchaseObj.isDeleted = false;

            const purchaseObj = req.body.purchaseObj;

            return PurchasePartsDetails.findOne({
                where: {
                    refAssyId: purchaseObj.refAssyId,
                    refBOMLineID: purchaseObj.refBOMLineID,
                    refComponentId: purchaseObj.refComponentId,
                    distMfgCodeID: purchaseObj.distMfgCodeID,
                    isDeleted: false
                }
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.RECEIVING.PURCHASE_PART_DUPLICATE, err: null, data: null });
                } else {
                    return PurchasePartsDetails.findOne({
                        where: {
                            poNumber: purchaseObj.poNumber,
                            isDeleted: false
                        }
                    }).then((isExistsPONumber) => {
                        if (isExistsPONumber && COMMON.formatDate(isExistsPONumber.poDate) !== COMMON.formatDate(purchaseObj.poDate)) {
                            const podate = COMMON.formatDate(isExistsPONumber.poDate);
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PURCHASE_PART_PO_NUMBER_DUPLICATE);
                            messageContent.message = COMMON.stringFormat(messageContent.message, purchaseObj.poNumber, podate);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                        } else {
                            return PurchasePartsDetails.create(purchaseObj, {
                                fields: inputFields
                            }).then(purchaseParts => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, purchaseParts, MESSAGE_CONSTANT.CREATED(purchaseModuleName))
                            ).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get kit release list
    // POST : /api/v1/purchase/getPurchasePartsDetailList
    // @param Pagination model
    // @return API response
    getPurchasePartsDetailList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize
            .query('CALL Sproc_RetrivePurchasePartsDetailsList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pRefAssyId,:pRefBOMLineID)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pRefAssyId: req.body.refAssyId || null,
                    pRefBOMLineID: req.body.refBOMLineID
                },
                type: sequelize.QueryTypes.SELECT
            })
            .then((responseDetail) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    purchasePartsDetail: _.values(responseDetail[1]),
                    Count: responseDetail[0][0]['COUNT(1)']
                }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // update Purchase Parts Details
    // PUT : /api/v1/purchase/updatePurchasePartsDetails
    // @param {id} int
    // @return Upadted Purchase Parts Details
    updatePurchasePartsDetails: (req, res) => {
        const {
            PurchasePartsDetails
        } = req.app.locals.models;
        var messageContent = {};
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req);
            return PurchasePartsDetails.findOne({
                where: {
                    poNumber: req.body.poNumber,
                    id: {
                        [Op.ne]: req.params.id
                    },
                    isDeleted: false
                }
            }).then((isExists) => {
                if (isExists && COMMON.formatDate(isExists.poDate) !== COMMON.formatDate(req.body.poDate)) {
                    const podate = COMMON.formatDate(isExists.poDate);
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PURCHASE_PART_PO_NUMBER_DUPLICATE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.poNumber, podate);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    return PurchasePartsDetails.update(req.body, {
                        where: {
                            id: req.params.id,
                            isDeleted: false
                        },
                        fields: inputFields
                    }).then(rowsUpdated => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rowsUpdated, MESSAGE_CONSTANT.UPDATED(purchaseModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // delete Purchase Parts Details
    // PUT : /api/v1/purchase/deletePurchasePartsDetails
    // @param {id} int
    // @return delete Purchase Parts details
    deletePurchasePartsDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.PurchasePartsDetails.Name;
            const entityID = COMMON.AllEntityIDS.PurchasePartsDetails.ID;
            sequelize.query('CALL Sproc_checkDelete(:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, MESSAGE_CONSTANT.DELETED(purchaseModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: response,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getComponnetMfgDescription: (req, res) => {
        const {
            Component
        } = req.app.locals.models;
        if (req.params && req.params.id) {
            return Component.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['mfgPNDescription']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get List of PO# for Autocomplete list
    // POST : /api/v1/purchase/getPONumberSearch
    // @return List of PO#
    getPONumberSearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetPONumberSearch(:pSearch,:pMfgCodeId)', {
            replacements: {
                pSearch: req.body.listObj.searchQuery || null,
                pMfgCodeId: (req.body.listObj.mfgcodeID || req.body.listObj.mfgcodeID === 0) ? req.body.listObj.mfgcodeID : null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            data: _.values(response[0])
        }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get purchase selected parts List
    // POST : /api/v1/purchase/getPurchaseSelectedPartsList
    // @param Pagination model
    // @return API response
    getPurchaseSelectedPartsList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize
            .query('CALL Sproc_RetrivePurchaseSelectedPartsList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pMultiplePartNumbers)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pMultiplePartNumbers: req.body.multiplePartNumbers.toString() || null
                },
                type: sequelize.QueryTypes.SELECT
            })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                purchaseConsolidatedList: _.values(response[1]),
                Count: response[0][0]['COUNT(1)']
            }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },
    // Save Pricing for selected Part of Kit Line Item
    // POST : /api/v1/purchase/savePurchasePrice
    // @return detail of selected part
    savePurchasePrice: (req, res) => {
        const {
            KitAllocationLineitems
        } = req.app.locals.models;
        var promises = [];
        if (req.body) {
            let pricingListObj = req.body.pricingObj;
            if (!pricingListObj) {
                pricingListObj = [];
            }
            _.each(pricingListObj, (price) => {
                price.updatedBy = req.user.id;
                promises.push(KitAllocationLineitems.update(price, {
                    where: {
                        refRfqLineitem: price.id,
                        isDeleted: false
                    },
                    fields: pricingInputFields
                }).then(() => true)
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        return false;
                    }));
            });
            return Promise.all(promises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(PricingModuleName)));
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};