const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const fs = require('fs');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
var Excel = require('exceljs');

Excel.config.setValue('promise');
const kitAllocationModuleName = DATA_CONSTANT.KIT_ALLOCATION.Name;
const approvalInputFields = ['id', 'transactionType', 'approveFromPage', 'confirmationType', 'refTableName', 'refID', 'approvedBy', 'approvalReason',
    'isDeleted', 'createdBy', 'updatedBy', 'deletedBy'
];

module.exports = {

    // Get kit release list
    // POST : /api/v1/kit_allocation/getKitAllocationList
    // @param Pagination model
    // @return API response
    getKitAllocationList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        var promises = [];
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        promises.push(
            sequelize.query('CALL Sproc_RetriveKitAllocationList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartId,:pRefSalesOrderDetailId,:pLineId,:pShortageLines,:pPackagingAlias,:pFunctionalType,:pMountingType,:pCartType,:pWarehouse,:pFeasibilityQty,:pIsCallFromFeasibility,:pCustomerId)', {
                replacements: {
                    pPageIndex: req.body.Page,
                    pRecordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPartId: req.body.partID || null,
                    pRefSalesOrderDetailId: req.body.refSalesOrderDetailId,
                    pLineId: req.body.lineId || 0,
                    pShortageLines: req.body.shortageLines ? req.body.shortageLines : false,
                    pPackagingAlias: req.body.packagingAlias ? req.body.packagingAlias : false,
                    pFunctionalType: req.body.functionalType || null,
                    pMountingType: req.body.mountingType || null,
                    pCartType: req.body.cartType || null,
                    pWarehouse: req.body.warehouse || null,
                    pFeasibilityQty: req.body.feasibilityQty || null,
                    pIsCallFromFeasibility: req.body.isCallFromFeasibility ? req.body.isCallFromFeasibility : false,
                    pCustomerId: req.body.customerId || 0
                },
                type: sequelize.QueryTypes.SELECT
            })
        );

        promises.push(
            sequelize.query('CALL Sproc_GetKitAllocationFilterDetail (:pRefSalesOrderDetID,:pAssyId,:pIsConsolidated)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetailId,
                    pAssyId: req.body.partID,
                    pIsConsolidated: false
                },
                type: sequelize.QueryTypes.SELECT
            })
        );

        return Promise.all(promises).then(responseData => resHandler.successRes(res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            Count: responseData[0][0][0]['COUNT(*)'],
            kitReleaseList: _.values(responseData[0][1]),
            UOMMismatchLine: responseData[0][2][0]['UOMMismatchLine'],
            BOMLineCount: responseData[0][3][0]['BOMLineCount'],
            FunctionalTypeList: _.values(responseData[1][0]),
            MountingTypeList: _.values(responseData[1][1]),
            WarehouseList: _.values(responseData[1][2])
        }, null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get Stock Allocate List
    // GET : /api/v1/kit_allocation/getStockAllocateList
    // @param {id} int
    // @return List of umid
    getStockAllocateList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.partIds) {
            return sequelize.query('CALL Sproc_GetStockAllocateList (:pRefSalesOrderDetID, :pAssyId, :pPartId, :pToUOM, :pRfqLineItemIds, :pCustomerId, :pType, :pStockType)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetId || null,
                    pAssyId: req.body.assyId || null,
                    pPartId: req.body.partIds || null,
                    pToUOM: req.body.toUom || null,
                    pRfqLineItemIds: req.body.rfqLineItemIds || null,
                    pCustomerId: req.body.customerId || null,
                    pType: req.body.rowField || null,
                    pStockType: req.body.stockType || null
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then(response => resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    stockList: _.values(response[0])
                }, null
                )).catch((err) => {
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

    // Save Stock Allocate List
    // POST : /api/v1/kit_allocation/saveStockAllocateList
    // @param Pagination model
    // @return API response
    saveStockAllocateList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.stockObj) {
            return sequelize.transaction().then(t =>
                sequelize.query('CALL Sproc_ValiationAndSaveStockAllocation (:pStockDetail,:pRefSalesOrderDetID,:pAssyID,:pPartIds,:pUMIDs,:pUserId,:pCheckForSameUmid,:pToUOM,:pSubAssyID,:pUnitFilterDecimal)', {
                    replacements: {
                        pStockDetail: req.body.stockObj.jsonStockAllocateList,
                        pRefSalesOrderDetID: req.body.stockObj.refSalesOrderDetID,
                        pAssyID: req.body.stockObj.assyID,
                        pPartIds: req.body.stockObj.partIds,
                        pUMIDs: req.body.stockObj.umIds,
                        pUserId: req.user.id,
                        pCheckForSameUmid: req.body.stockObj.checkForSameUmid,
                        pToUOM: req.body.stockObj.uomID,
                        pSubAssyID: req.body.stockObj.subAssyID || null,
                        pUnitFilterDecimal: req.body.stockObj.unitFilterDecimal
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((response) => {
                    if (response[0]) {
                        if (response[0][0]['IsSuccess']) {
                            return t.commit().then(() => {
                                // Add Kit Allocation Detail into Elastic Search Engine for Enterprise Search
                                if (response[0][0].KitIds) {
                                    const kitIds = response[0][0].KitIds.split(',');
                                    req.params['pId'] = kitIds;
                                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageKitAllocationInElastic);
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    IsSuccess: response[0][0]['IsSuccess']
                                }, MESSAGE_CONSTANT.KIT_ALLOCATION.KIT_ALLOCATE_SUCCESS);
                            });
                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                IsSuccess: response[0][0]['IsSuccess'],
                                UMIDString: response[0][0]['UMID'],
                                TransName: response[0][0]['TransName'],
                                ErrorCode: response[0][0]['ErrorCode'],
                                Reason: response[0][0]['Reason'],
                                StartDate: response[0][0]['StartDate']
                            }, null);
                        }
                    } else {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.NOT_CREATED(kitAllocationModuleName),
                            err: null,
                            data: null
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Check BOM And Get kit Allocate assembly List
    // POST : /api/v1/kit_allocation/checkBOMAndGetKitAllocationList
    // @param {id} int
    // @param {partId} int
    checkBOMAndGetKitAllocationList: (req, res) => {
        const {
            KitAllocationAssyDetail,
            RFQLineItems,
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.salesOrderDetailId && req.body.partId) {
            const promises = [];

            promises.push(KitAllocationAssyDetail.findAll({
                where: {
                    refSalesOrderDetID: req.body.salesOrderDetailId
                },
                model: KitAllocationAssyDetail,
                attributes: ['id', 'partId', 'refSalesOrderDetID']
            }));

            promises.push(RFQLineItems.findAll({
                where: {
                    partID: req.body.partId
                },
                model: KitAllocationAssyDetail,
                attributes: ['id', 'partID']
            }));

            // eslint-disable-next-line consistent-return
            return Promise.all(promises).then((responseData) => {
                req.params.id = req.body.salesOrderDetailId;
                if (responseData[0].length > 0 && (responseData[1].length > 0 || responseData[1].length === 0)) {
                    module.exports.kitAllocationAssyList(req, res);
                } else if (responseData[0].length === 0 && responseData[1].length > 0) {
                    return sequelize.transaction().then(t => sequelize.query('CALL Sproc_CreateKitAllocationConsolidateLine (:pRefSalesOrderDetId, :pAssyId, :pUserId, :pRoleId)', {
                        replacements: {
                            pRefSalesOrderDetId: req.body.salesOrderDetailId,
                            pAssyId: req.body.partId,
                            pUserId: req.user.id,
                            pRoleId: req.user.defaultLoginRoleID
                        },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    }).then((insertConsolidate) => {
                        const consolidateCount = insertConsolidate[0][0]['kitConsolidateLine'];
                        if (consolidateCount > 0) {
                            return sequelize.query('CALL Sproc_CreateKitAllocationAssyDetail (:pPartID,:pSalesOrderDetailID,:pKitQty,:pMrpQty,:pUserID,:pActionStatus,:pRoleID,:pIsOnlyQtyChange)', {
                                replacements: {
                                    pPartID: req.body.partId,
                                    pSalesOrderDetailID: req.body.salesOrderDetailId,
                                    pKitQty: req.body.kitQty,
                                    pMrpQty: req.body.mrpQty,
                                    pUserID: req.user.id,
                                    pActionStatus: 'CREATE',
                                    pRoleID: req.user.defaultLoginRoleID,
                                    pIsOnlyQtyChange: false
                                },
                                type: sequelize.QueryTypes.SELECT,
                                transaction: t
                                // eslint-disable-next-line consistent-return
                            }).then((kitResponse) => {
                                if (kitResponse && kitResponse[0] && kitResponse[0][0] && kitResponse[0][0]['IsSuccess'] === 1) {
                                    t.commit().then(() => {
                                        module.exports.kitAllocationAssyList(req, res);
                                    });
                                } else if (!t.finished) {
                                    t.rollback();
                                    return resHandler.successRes(
                                        res,
                                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                        STATE.SUCCESS, {
                                        calculated: kitResponse[0][0]
                                    },
                                        null
                                    );
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
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
                } else if (responseData[0].length === 0 && responseData[1].length === 0) {
                    module.exports.kitAllocationAssyList(req, res);
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
    },

    // Get kit Allocate assembly List
    // GET : /api/v1/kit_allocation/kitAllocationAssyList
    // @param {id} int
    // @return List of umid
    kitAllocationAssyList: (req, res) => {
        const {
            KitAllocationAssyDetail,
            Component,
            ComponentBOMSetting,
            RFQRoHS,
            sequelize
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
                    attributes: ['id', 'mfgPN', 'PIDCode', 'mfgPNDescription', 'specialNote', [sequelize.fn('fun_replaceSpecialCharacters', sequelize.col('kit_allocation_component.mfgPN')), 'mfgPNwithOutSpacialChar'], [sequelize.fn('fun_replaceSpecialCharacters', sequelize.col('kit_allocation_component.PIDCode')), 'pidCodewithOutSpacialChar']],
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
                            return resHandler.successRes(res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS,
                                asseblyList,
                                null
                            );
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
                        return resHandler.successRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            asseblyList,
                            null
                        );
                    }
                } else {
                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        asseblyList,
                        null
                    );
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get kit Allocation Consolidated List
    // POST : /api/v1/kit_allocation/getKitAllocationConsolidatedList
    // @param Pagination model
    // @return API response
    getKitAllocationConsolidatedList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        var promises = [];
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        promises.push(sequelize.query('CALL Sproc_RetriveKitAllocationConsolidatedList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pRefSalesOrderDetID,:pLineId,:pPartId,:pKitQty,:pShortageLines,:pPackagingAlias,:pFunctionalType,:pMountingType,:pCartType,:pWarehouse,:pIsCallFromFeasibility,:pCustomerId)', {
            replacements: {
                pPageIndex: req.body.Page,
                pRecordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pRefSalesOrderDetID: req.body.refSalesOrderDetailId,
                pLineId: req.body.lineId || null,
                pPartId: req.body.partID || null,
                pKitQty: req.body.kitQty,
                pShortageLines: req.body.shortageLines ? req.body.shortageLines : false,
                pPackagingAlias: req.body.packagingAlias ? req.body.packagingAlias : false,
                pFunctionalType: req.body.functionalType || null,
                pMountingType: req.body.mountingType || null,
                pCartType: req.body.cartType || null,
                pWarehouse: req.body.warehouse || null,
                pIsCallFromFeasibility: req.body.isCallFromFeasibility ? req.body.isCallFromFeasibility : false,
                pCustomerId: req.body.customerId || null
            },
            type: sequelize.QueryTypes.SELECT
        }));

        promises.push(sequelize.query('CALL Sproc_GetKitAllocationFilterDetail (:pRefSalesOrderDetID,:pAssyId,:pIsConsolidated)', {
            replacements: {
                pRefSalesOrderDetID: req.body.refSalesOrderDetailId,
                pAssyId: req.body.partID,
                pIsConsolidated: true
            },
            type: sequelize.QueryTypes.SELECT
        }));

        return Promise.all(promises).then(responseData => resHandler.successRes(res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            Count: responseData[0][0][0]['TotalRecord'],
            kitAllocationConsolidatedList: _.values(responseData[0][1]),
            UOMMismatchLine: responseData[0][2][0]['UOMMismatchLine'],
            BOMLineCount: responseData[0][3][0]['BOMLineCount'],
            FunctionalTypeList: _.values(responseData[1][0]),
            MountingTypeList: _.values(responseData[1][1]),
            WarehouseList: _.values(responseData[1][2])
        }, null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get Re Calculate KitAllocation
    // POST : /api/v1/kit_allocation/reCalculateKitAllocation
    reCalculateKitAllocation: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.partId) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_CreateKitAllocationConsolidateLine (:pRefSalesOrderDetId, :pAssyId, :pUserId, :pRoleId)', {
                replacements: {
                    pRefSalesOrderDetId: req.body.sodid,
                    pAssyId: req.body.partId,
                    pUserId: req.user.id,
                    pRoleId: req.user.defaultLoginRoleID
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then(() => sequelize.query('CALL Sproc_CreateKitAllocationAssyDetail (:pPartID,:pSalesOrderDetailID,:pKitQty,:pMrpQty,:pUserID,:pActionStatus,:pRoleID,:pIsOnlyQtyChange)', {
                replacements: {
                    pPartID: req.body.partId,
                    pSalesOrderDetailID: req.body.sodid,
                    pKitQty: req.body.kitQty,
                    pMrpQty: req.body.mrpQty,
                    pUserID: req.user.id,
                    pActionStatus: 'CALCULATEKITALLOCATION',
                    pRoleID: req.user.defaultLoginRoleID,
                    pIsOnlyQtyChange: false
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then((response) => {
                t.commit().then(() => resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    calculated: response[0][0]
                }, null));
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get Allocated Kit List
    // GET : /api/v1/kit_allocation/getAllocatedKitList
    getAllocatedKitList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetAllocatedKitList()', {
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS,
            _.values(_.first(response)),
            null
        )).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get allocated kit for UMID
    // GET : /api/v1/kit_allocation/getAllocatedKitForUMID
    getAllocatedKitForUMID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.query.umidId) {
            return sequelize.query('CALL Sproc_GetAllocatedKitForUMID (:pUMIDId)', {
                replacements: {
                    pUMIDId: req.query.umidId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                _.values(_.first(response)),
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Deallocated UMID for kit
    // POST : /api/v1/kit_allocation/deallocateUMIDFromKit
    deallocateUMIDFromKit: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req);
            if (req.body.fromScreen === 'Allocated Kit') {
                req.body.remark = COMMON.stringFormat(MESSAGE_CONSTANT.KIT_ALLOCATION.DEALLOCAT_FROM_RESTRICT_UMID, 'Allocated Kit');
            } else if (req.body.fromScreen === 'Allocated Unit') {
                req.body.remark = COMMON.stringFormat(MESSAGE_CONSTANT.KIT_ALLOCATION.DEALLOCAT_FROM_RESTRICT_UMID, 'Allocated Unit');
            } else if (req.body.fromScreen === 'Kit Allocation') {
                req.body.remark = COMMON.stringFormat(MESSAGE_CONSTANT.KIT_ALLOCATION.DEALLOCAT_FROM_RESTRICT_UMID, 'Kit Allocation');
            } else if (req.body.fromScreen === 'Kit Preparation') {
                req.body.remark = COMMON.stringFormat(MESSAGE_CONSTANT.KIT_ALLOCATION.DEALLOCAT_FROM_RESTRICT_UMID, 'Kit Preparation');
            }
            return sequelize.query('CALL Sproc_DeallocateUMIDFromKit (:pRefSalesOrderDetID, :pAssyId, :pUIDIds, :pKitAllocationIds, :pRefBOMLineID, :pRemark, :pUserID, :pUserRoleID)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pAssyId: req.body.assyID || null,
                    pUIDIds: req.body.umidID && req.body.umidID.length > 0 ? req.body.umidID.toString() : null,
                    pKitAllocationIds: req.body.id && req.body.id.length > 0 ? req.body.id.toString() : null,
                    pRefBOMLineID: req.body.refRfqLineitem || null,
                    pRemark: req.body.remark,
                    pUserID: req.body.updatedBy,
                    pUserRoleID: req.body.updateByRoleId
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const manageResponse = _.values(response[0])[0];
                if (manageResponse && manageResponse.IsSuccess) {
                    // Add Kit Allocation Detail into Elastic Search Engine for Enterprise Search
                    req.params['pId'] = manageResponse.id;
                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageKitAllocationInElastic);

                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        req.body,
                        MESSAGE_CONSTANT.UPDATED(DATA_CONSTANT.KIT_ALLOCATION.Kit)
                    );
                } else {
                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.FAILED,
                        null,
                        MESSAGE_CONSTANT.KIT_ALLOCATION.ALLOCATED_TO_EQUIPMENT
                    );
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
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get feasibility for kit
    // POST : /api/v1/kit_allocation/getKitFeasibility
    getKitFeasibility: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetKitFeasibility (:pRefSalesOrderDetID, :pAssyID, :pIsConsolidated, :pInputQty)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pAssyID: req.body.assyID || null,
                    pIsConsolidated: req.body.isConsolidated || null,
                    pInputQty: req.body.inputQty || 0
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                _.values(_.first(response)),
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Release kit for production
    // POST : /api/v1/kit_allocation/kitRelease
    kitRelease: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.refSalesOrderDetID) {
            return sequelize.query('CALL Sproc_KitRelease (:pRefSalesOrderDetID, :pAssyID, :pSubAssyID, :pPlanDetID, :pWOID, :pToDeptId, :pDescription, :pCreatedBy, :pCreateByRoleId,:pIsReRelease,:pIsMainKitRelease,:pIsCurrentKitRelease,:pPlanKitNumber)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pAssyID: req.body.assyID || null,
                    pSubAssyID: req.body.subAssyID || null,
                    pPlanDetID: req.body.planDetID || null,
                    pWOID: req.body.woID || null,
                    pToDeptId: req.body.deptId || null,
                    pDescription: req.body.description || null,
                    pCreatedBy: req.user.id || null,
                    pCreateByRoleId: COMMON.getRequestUserLoginRoleID(req) || null,
                    pIsReRelease: req.body.isReRelease && JSON.parse(req.body.isReRelease) ? 1 : 0,
                    pIsMainKitRelease: req.body.isMaintainKit && JSON.parse(req.body.isMaintainKit) ? 1 : 0,
                    pIsCurrentKitRelease: req.body.isChangeKit && JSON.parse(req.body.isChangeKit) ? 1 : 0,
                    pPlanKitNumber: req.body.planKitNumber || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((responseData) => {
                var responseList = _.values(_.first(responseData));
                return resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    (_.find(responseList, { isUpdateRelease: 1 })) ? MESSAGE_CONSTANT.UPDATED(DATA_CONSTANT.KIT_ALLOCATION.Release) : (!(_.find(responseList, { isCurrentKitPlan: 1 })) ? MESSAGE_CONSTANT.RECEIVING.KIT_RELEASE_SUCCESS : null)
                );
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get list of workorders for kit release
    // GET : /api/v1/kit_allocation/getWOForKitRelease
    getWOForKitRelease: (req, res) => {
        const {
            PartSubAssyRelationship,
            Workorder,
            WorkorderSalesOrderDetails,
            Component,
            sequelize
        } = req.app.locals.models;

        PartSubAssyRelationship.findAll({
            where: {
                prPerPartID: req.query.assyID,
                deletedAt: null
            },
            model: PartSubAssyRelationship,
            attributes: ['id', 'partID', 'level']
        }).then((assembly) => {
            const parentAssemblyIds = _.map(assembly, 'partID');
            const WOWhereClause = {
                deletedAt: null,
                woStatus: {
                    [Op.notIn]: [
                        DATA_CONSTANT.WORKORDER.WOSUBSTATUS.COMPLETED_WITH_MISSING_PART,
                        DATA_CONSTANT.WORKORDER.WOSTATUS.TERMINATED,
                        DATA_CONSTANT.WORKORDER.WOSTATUS.VOID,
                        DATA_CONSTANT.WORKORDER.WOSTATUS.COMPLETED
                    ]
                },
                [Op.or]: [{
                    partid: req.query.assyID
                }]
            };
            if (parentAssemblyIds.length > 0) {
                WOWhereClause[Op.or].push({
                    partid: {
                        [Op.in]: parentAssemblyIds
                    }
                });
            }
            Workorder.findAll({
                where: WOWhereClause,
                attributes: ['woID', 'woNumber', 'partid'],
                include: [{
                    model: Component,
                    as: 'componentAssembly',
                    attributes: ['id', 'PIDCode'],
                    required: true
                },
                {
                    model: WorkorderSalesOrderDetails,
                    as: 'WoSalesOrderDetails',
                    attributes: ['woID', 'poQty', [sequelize.literal('fun_getPONumber(salesOrderDetailID)'), 'refPONumber']],
                    required: false,
                    where: {
                        salesOrderDetailID: req.query.refSalesOrderDetID,
                        deletedAt: null
                    }
                }
                ]
            }).then((workorder) => {
                if (!workorder) {
                    return resHandler.errorRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(DATA_CONSTANT.WORKORDER.NAME),
                        err: null,
                        data: null
                    }
                    );
                }

                return resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS,
                    workorder,
                    null
                );
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
    },

    // Get release detail to show release information like release count, release status, release percentage, etc.
    // GET : /api/v1/kit_allocation/getKitReleaseSummaryAndStatus
    getKitReleaseSummaryAndStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.query && req.query.refSalesOrderDetID) {
            return sequelize.query('CALL Sproc_GetKitReleaseSummaryAndStatus (:pRefSalesOrderDetID, :pAssyID, :pMainAssyID, :pIsConsolidated)', {
                replacements: {
                    pRefSalesOrderDetID: req.query.refSalesOrderDetID || null,
                    pAssyID: req.query.assyID || null,
                    pMainAssyID: req.query.mainAssyId || null,
                    pIsConsolidated: req.query.isConsolidated ? JSON.parse(req.query.isConsolidated) : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                _.values(_.first(response)),
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get kit allocation filter list
    // POST : /api/v1/kit_allocation/getKitAllocationFilterList
    // @param Pagination model
    // @return API response
    getKitAllocationFilterList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize
            .query('CALL Sproc_GetKitAllocationFilterDetail (:pRefSalesOrderDetID,:pAssyId,:pIsConsolidated)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetailId,
                    pAssyId: req.body.partID,
                    pIsConsolidated: req.body.isConsolidated
                },
                type: sequelize.QueryTypes.SELECT
            }).then(responseData => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                FunctionalTypeList: _.values(responseData[0]),
                MountingTypeList: _.values(responseData[1]),
                WarehouseList: _.values(responseData[2])
            },
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
    },

    // Get kit release detail with plan
    // POST : /api/v1/kit_allocation/getKitReleasePlanDetail
    getKitReleasePlanDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_GetKitReleasePlanDetail (:pRefSalesOrderDetID, :pAssyID, :pSubAssyID)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pAssyID: req.body.assyID || null,
                    pSubAssyID: req.body.subAssyID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                planDetails: _.values(response[0]),
                shipDate: _.values(response[1])
            },
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get allocated UMID count
    // POST : /api/v1/kit_allocation/getAllocatedUMIDCount
    getAllocatedUMIDCount: (req, res) => {
        const {
            KitAllocation
        } = req.app.locals.models;
        const promises = [];
        if (req.body) {
            promises.push(KitAllocation.count({
                where: {
                    refSalesOrderDetID: req.body.refSalesOrderDetID,
                    assyID: req.body.assyID,
                    status: 'A'
                },
                paranoid: false
            }));
            promises.push(KitAllocation.findAll({
                where: {
                    refSalesOrderDetID: req.body.refSalesOrderDetID,
                    assyID: req.body.assyID,
                    status: 'A'
                },
                attributes: ['uid'],
                paranoid: false
            }));
            return Promise.all(promises).then(resp => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                UMIDCount: resp[0],
                UMIDS: _.values(resp[1])
            },
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Return released kit
    // POST : /api/v1/kit_allocation/returnKit
    returnKit: (req, res) => {
        const {
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;
        if (req.body) {
            return SalesOrderPlanDetailsMst.findAll({
                attributes: ['id'],
                where: {
                    id: {
                        [Op.in]: req.body.id
                    },
                    kitReturnStatus: DATA_CONSTANT.KIT_RETURN.ReturnStatus.FullyReturned
                }
            }).then((response) => {
                if (response && response.length > 0) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.FULLY_KIT_RETUNRED);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'return kit');
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageContent: messageContent,
                        err: null,
                        data: null,
                        ErrorCode: 'FULLY_KIT_RETUNRED'
                    }, null);
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    req.body.kitReturnStatus = req.body.isWithShortage ? DATA_CONSTANT.KIT_RETURN.ReturnStatus.ReturnWithShortage : DATA_CONSTANT.KIT_RETURN.ReturnStatus.FullyReturned;
                    req.body.kitReturnDate = COMMON.getCurrentUTC();
                    req.body.kitReturnBy = COMMON.getRequestUserID(req);
                    return SalesOrderPlanDetailsMst.update(req.body, {
                        where: {
                            id: {
                                [Op.in]: req.body.id
                            }
                        },
                        fields: ['kitReturnStatus', 'kitReturnDate', 'kitReturnBy', 'updatedBy', 'updatedAt', 'updateByRoleId']
                    }).then(() =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.RECEIVING.RETURN_KIT_SUCCESS)
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },
    getHoldResumeStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetHoldResumeTransStatusDetails(:pSalesOrderDetID,:pRefType,:pWOID,:pIsFromWO)', {
            replacements: {
                pSalesOrderDetID: req.query.salesOrderDetId ? req.query.salesOrderDetId : null,
                pRefType: req.query.refType ? `'${req.query.refType.join('\',\'')}'` : null,
                pWOID: req.query.woID ? req.query.woID : null,
                pIsFromWO: req.query.isFromWo && JSON.parse(req.query.isFromWo) ? 1 : 0
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)
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

    // update kit initiate return details
    // POST : /api/v1/kit_allocation/InitiatekitReturn
    initiateKitReturn: (req, res) => {
        const {
            SalesOrderPlanDetailsMst
        } = req.app.locals.models;
        if (req.body) {
            return SalesOrderPlanDetailsMst.findAll({
                attributes: ['id'],
                where: {
                    id: {
                        [Op.in]: req.body.id
                    },
                    kitReturnStatus: DATA_CONSTANT.KIT_RETURN.ReturnStatus.FullyReturned
                }
            }).then((response) => {
                if (response && response.length > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        err: null,
                        data: null,
                        ErrorCode: 'FULLY_KIT_RETUNRED'
                    }, null);
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    req.body.kitReturnStatus = DATA_CONSTANT.KIT_RETURN.ReturnStatus.ReadyToReturn;
                    req.body.initiateReturnBy = COMMON.getRequestUserID(req);
                    req.body.initiateReturnAt = COMMON.getCurrentUTC();
                    return SalesOrderPlanDetailsMst.update(req.body, {
                        where: {
                            id: {
                                [Op.in]: req.body.id
                            }
                        },
                        fields: ['kitReturnStatus', 'initiateReturnBy', 'initiateReturnAt', 'updatedBy', 'updatedAt', 'updateByRoleId']
                    }).then(() => {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.INITIATE_KIT_RETURN_SUCCESS);
                        return resHandler.successRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS,
                            req.body,
                            messageContent
                        );
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },
    // Get Search Material Result Of BOM
    // POST : /api/v1/kit_allocation/getSearchMaterialDetailOfBOM
    // @return list of BOM
    getSearchMaterialDetailOfBOM: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_getBOMDataForSearchMaterial (:pAssyId, :pSearchString, :pSearchType, :pNickName)', {
                replacements: {
                    pAssyId: req.body.assyId || null,
                    pSearchString: req.body.searchString || null,
                    pSearchType: req.body.searchType || null,
                    pNickName: req.body.nickName || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(responseData => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                BOMList: _.values(responseData[0])
            }, null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },
    // Get Search Material Result Of UMID
    // POST : /api/v1/kit_allocation/getSearchMaterialDetailOfUMID
    // @return list of UMID
    getSearchMaterialDetailOfUMID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_getUMIDDataForSearchMaterial (:pPageIndex, :pRecordPerPage, :pOrderBy, :pWhereClause, :pAssyId,:pNickName, :pSearchString, :pSearchType)', {
                replacements: {
                    pPageIndex: 0,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pAssyId: req.body.assyId || null,
                    pNickName: req.body.nickName || null,
                    pSearchString: req.body.searchString || null,
                    pSearchType: req.body.searchType || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(responseData =>
                resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    UMIDList: _.values(responseData[0])
                }, null)
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },
    // Retrieve Kit Allocation Export functionality
    // GET : /api/v1/kit_allocation/getKitAllocationExportFile
    // @return Kit Allocation Export
    getKitAllocationExportFile: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.refSalesOrderDetID && req.body.customerId) {
            const workbook1 = new Excel.Workbook();
            // if (req.body.data.length > 0) {
            const sheet1 = req.body.isConsolidatedTab ? workbook1.addWorksheet(req.body.refSalesOrderDetID) : workbook1.addWorksheet(req.body.partID);
            sheet1.columns = [];
            const columns = [];
            let sumOfAvailabelStock = null;

            return sequelize.query('CALL Sproc_GetKitAllocationLineItemsForExport (:pPartID, :pRefSalesOrderDetID, :pIsConsolidated, :pCustomerId)', {
                replacements: {
                    pPartID: req.body.partID || 0,
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID,
                    pIsConsolidated: req.body.isConsolidatedTab,
                    pCustomerId: req.body.customerId
                }
            }).then((bomResult) => {
                if (bomResult && bomResult.length > 0) {
                    req.body.data = _.values(bomResult);
                }
                _.each(req.body.header, (key) => {
                    const width = 15;
                    if (key.field === '_lineID' || key.field === 'custPN' || key.field === 'mfgName' || key.field === 'mfgPN' || key.field === 'purchaseQty' ||
                        key.field === 'dnpQPA' || key.field === 'uom') {
                        const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                        columns.push(obj);
                    }
                    if (req.body.isSubAssemblyTab && req.body.format === 1) {
                        if (key.field === 'qpaMultiplier') {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    }
                    if (req.body.format === 1) {
                        if (key.field === 'kitQty' || key.field === 'poQty' || key.field === 'mrpQty' ||
                            key.field === 'requiredMrpQty' || key.field === 'requirePinsMrpQty' || key.field === 'shortageMrpQty') {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    }
                    if (req.body.format === 2) {
                        if (key.field === 'PIDCode' || key.field === 'productionPN' || key.field === 'serialNumber' || key.field === 'partPackage' ||
                            key.field === 'deviceMarking') {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    }
                    if (req.body.format === 1 && !req.body.isConsolidatedTab) {
                        if (key.field === 'availabelStock' || key.field === 'availabelStockCustomerConsign') {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    }
                    if (req.body.format === 1 && !req.body.isConsolidatedTab) {
                        if (key.field === 'numOfPosition' || key.field === 'numOfRows' || key.field === 'isBuyDNPQty' || key.field === 'substitutesAllow') {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    }
                    if (!(req.body.format === 2 && !req.body.isConsolidatedTab)) {
                        if (key.field === 'allocatedQty' || key.field === 'allocatedUnit' || key.field === 'allocatedPins' ||
                            key.field === 'requiredKitQty' || key.field === 'requirePinsKitQty' || key.field === 'shortagePerKitQty') {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    }
                    if (req.body.isConsolidatedTab) {
                        if (key.field === 'partTypeName' || key.field === 'mountingTypeName' || key.field === 'scrapedPins' || key.field === 'consumeQty' ||
                            key.field === 'consumeUnits' || key.field === 'isNotRequiredKitAllocationValue' || key.field === 'notRequiredKitAllocationReason'
                        ) {
                            const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                            columns.push(obj);
                        }
                    } else if (key.field === 'cust_lineID' || key.field === 'customerRev' || key.field === 'customerDescription' || key.field === 'refDesig' ||
                        key.field === 'isInstall' || key.field === 'isPurchase' || key.field === 'dnpQty' || key.field === 'programingStatus' ||
                        key.field === 'customerPartDesc' || key.field === 'qpa' || key.field === 'dnpDesig' || key.field === 'customerApprovalComment') {
                        const obj = { header: key.header, key: key.field, width: width, wrapText: true };
                        columns.push(obj);
                    }
                });
                const groupbyItem = req.body.isConsolidatedTab ? _.groupBy(_.clone(req.body.data), 'id') : _.groupBy(_.clone(req.body.data), '_lineID');
                _.each(groupbyItem, (data) => {
                    if (req.body.format === 1 || !req.body.isConsolidatedTab) {
                        sumOfAvailabelStock = _.sumBy(data, 'availabelStock');
                    }
                    _.each(data, (item, i) => {
                        if (req.body.format === 1 || !req.body.isConsolidatedTab) {
                            item.availabelStock = sumOfAvailabelStock;
                        }
                        if (i !== 0) {
                            const width = 15;
                            const mfgColumn = (`mfgName${i}`);
                            const mfgPNColumn = (`mfgPN${i}`);
                            if (!_.find(columns, { key: mfgColumn })) {
                                const obj = { header: 'MFR', key: mfgColumn, width: width, wrapText: true };
                                columns.push(obj);
                            }
                            if (!_.find(columns, { key: mfgPNColumn })) {
                                const obj = { header: 'MFR PN', key: mfgPNColumn, width: width, wrapText: true };
                                columns.push(obj);
                            }
                            if (req.body.format === 2) {
                                const pidColumn = (`PIDCode${i}`);
                                const productionPNColumn = (`productionPN${i}`);
                                const serialNumberColumn = (`serialNumber${i}`);
                                const partPackageColumn = (`partPackage${i}`);
                                const deviceMarkingColumn = (`deviceMarking${i}`);
                                if (!_.find(columns, { key: pidColumn })) {
                                    const obj = { header: 'PID', key: pidColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: productionPNColumn })) {
                                    const obj = { header: 'Production PN', key: productionPNColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                } if (!_.find(columns, { key: serialNumberColumn })) {
                                    const obj = { header: 'SystemID', key: serialNumberColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: partPackageColumn })) {
                                    const obj = { header: 'Package/Case(Shape) Type', key: partPackageColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                                if (!_.find(columns, { key: deviceMarkingColumn })) {
                                    const obj = { header: 'Device Marking', key: deviceMarkingColumn, width: width, wrapText: true };
                                    columns.push(obj);
                                }
                            }
                        }
                    });
                    sumOfAvailabelStock = null;
                });
                sheet1.columns = columns;
                _.each(groupbyItem, (data) => {
                    let row = {};
                    _.each(data, (item, i) => {
                        if (i === 0) {
                            row = item;
                        } else {
                            const mfgColumn = (`mfgName${i}`);
                            const mfgPNColumn = (`mfgPN${i}`);
                            row[mfgColumn] = item.mfgName;
                            row[mfgPNColumn] = item.mfgPN;
                            if (req.body.format === 2) {
                                const pidColumn = (`PIDCode${i}`);
                                const productionPNColumn = (`productionPN${i}`);
                                const serialNumberColumn = (`serialNumber${i}`);
                                const partPackageColumn = (`partPackage${i}`);
                                const deviceMarkingColumn = (`deviceMarking${i}`);
                                row[pidColumn] = item.PIDCode;
                                row[productionPNColumn] = item.productionPN;
                                row[serialNumberColumn] = item.serialNumber;
                                row[partPackageColumn] = item.partPackage;
                                row[deviceMarkingColumn] = item.deviceMarking;
                            }
                        }
                    });
                    sheet1.addRow(row);
                });

                let currentLineID = null;
                sheet1.eachRow((row, rowNumber) => {
                    if (rowNumber > 1) {
                        row.eachCell((cell, colNumber) => {
                            // eslint-disable-next-line no-underscore-dangle
                            if (cell.value && cell._column._key === '_lineID') {
                                currentLineID = cell.value;
                            }
                            // eslint-disable-next-line no-underscore-dangle
                            if (cell.value && cell._column._key.includes('mfgPN') && currentLineID) {
                                const packagingPart = _.find(req.body.data, { _lineID: currentLineID, mfgPN: cell.value });
                                if (packagingPart) {
                                    if (packagingPart.isGoodPart === 2 || packagingPart.restrictUseInBOMExcludingAliasStep || packagingPart.restrictUseInBOMExcludingAliasWithPermissionStep || packagingPart.restrictUseInBOMStep || packagingPart.restrictUseInBOMWithPermissionStep || packagingPart.restrictPackagingUsePermanently || packagingPart.restrictPackagingUseWithpermission || packagingPart.restrictUsePermanently || packagingPart.restrictUSEwithpermission) {
                                        row.getCell(colNumber).font = { strike: true };
                                    }
                                    if (packagingPart.customerApproval !== 'P') {
                                        row.getCell(colNumber).fill = {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'CCEECC' }
                                        };
                                    }
                                }
                            }
                        });
                    }
                });
                const path = DATA_CONSTANT.GENERICCATEGORY.UPLOAD_PATH;
                mkdirp(path, () => { });
                const filename = req.body.filename;
                res.setHeader('Content-Type', 'application/vnd.ms-excel');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                return workbook1.xlsx.writeFile(path + filename).then(() => {
                    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
                    res.setHeader('Content-type', 'application/vnd.ms-excel');
                    const filestream = fs.createReadStream(path + filename);
                    fs.unlink(path + filename, () => { });
                    filestream.pipe(res);
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

    // Retrieve Kit Allocation Line details
    // GET : /api/v1/kit_allocation/getKitallocationLineDetails
    // @return Kit Allocation Line details
    getKitallocationLineDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.kitAllocationLineItemId && req.body.refSalesOrderDetID) {
            COMMON.setModelUpdatedByFieldValue(req);

            return sequelize.query('CALL Sproc_GetKitallocationLineDetails(:pAssyID, :pRefSalesOrderDetID, :pkitAllocationLineItemId,:pIsConsolidated)', {
                replacements: {
                    pAssyID: req.body.assyId || 0,
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID,
                    pkitAllocationLineItemId: req.body.kitAllocationLineItemId,
                    pIsConsolidated: req.body.isConsolidatedTab || 0
                }
            }).then(responseData =>
                resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    KitAllocationLineDetail: _.values(responseData)
                }, null)
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

    // Save Customer Consign value for selected Part of Kit Line Item
    // POST : /api/v1/kit_allocation/saveCustconsignStatusForKitLineItem
    // @return detail of selected part
    saveCustconsignStatusForKitLineItem: (req, res) => {
        const { KitAllocationLineitems, GenericAuthenticationMst, sequelize } = req.app.locals.models;
        if (req.body && req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then(t =>
                KitAllocationLineitems.update(req.body, {
                    where: {
                        id: req.body.id,
                        isDeleted: false
                    },
                    fields: ['isPurchase', 'updatedBy', 'updatedAt', 'updateByRoleId'],
                    transaction: t
                }).then(() => {
                    // Add log for approval of kit line customer consign value of kit allocation line item
                    if (req.body.approvalReasonList && req.body.approvalReasonList.length > 0) {
                        const objApprovalReason = _.first(req.body.approvalReasonList);
                        objApprovalReason.refID = req.body.id;
                        return GenericAuthenticationMst.create(objApprovalReason, {
                            fields: approvalInputFields,
                            transaction: t
                        }).then(() => {
                            t.commit().then(() => {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.UPDATED);
                                messageContent.message = COMMON.stringFormat(messageContent.message, DATA_CONSTANT.KIT_ALLOCATION.Kit);
                                return resHandler.successRes(res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS,
                                    req.body,
                                    messageContent
                                );
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                            err: null,
                            data: null
                        }
                        );
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Retrieve Kit Allocation Line Customer Consign value is mismatch with BOM line
    // GET : /api/v1/kit_allocation/getCustConsignMismatchKitAllocationDetails
    // @return mismatch data of kit allocation line
    getCustConsignMismatchKitAllocationDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body && req.body.refSalesOrderDetID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.query('CALL Sproc_GetCustConsignMismatchKitAllocationDetails(:pRefSalesOrderDetID, :pAssyID)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID,
                    pAssyID: req.body.assyID || 0
                }
            }).then(responseData =>
                resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    KitLineDetail: _.values(responseData)
                }, null)
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
    // get list of kit release return history
    // POST : /api/v1/kit_allocation/getReleaseReturnHistoryList
    // @return list of kit release return history
    getReleaseReturnHistoryList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (req.body && req.body.salesOrderDetID && req.body.refAssyId) {
            return sequelize.query('CALL Sproc_GetReleaseReturnHistoryList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pSalesOrderDetID,:pRefAssyId)', {
                replacements: {
                    ppageIndex: req.body.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pSalesOrderDetID: req.body.salesOrderDetID,
                    pRefAssyId: req.body.refAssyId
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { responseList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },
    // Get List of Kit Assembly and Sub Assembly
    // POST : /api/v1/kit_allocation/retrieveKitList
    // @return List of Kit Assembly and Sub Assembly
    retrieveKitList: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            if (req.body && req.body.customerId) {
                strWhere = COMMON.stringFormat('{0} {1} {2} {3}', strWhere ? strWhere : '', strWhere ? ' AND ' : '', ' customerID =', req.body.customerId);
            }
            return sequelize
                .query('CALL Sproc_GetKitList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pIsSubAssembly,:pPlannedStatus,:pSalesOrderDetailId,:pIsPendingWOCreationList,:pCustomPendingWOCreationWhereClause, :pIsPendingCustPackingSlipList,:pfilterStatus,:pcustomerIds,:pshippingMethodId,:ptermsIds,:psearchposotext,:psearchposotype,:pfromDate,:ptoDate,:prushJob,:ppartIds,:pworkorders,:pkitreturnStatus,:pkitReleaseStatus,:pfilterPOStatus,:pfromPODate,:ptoPODate,:pSubAssemblyTab)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pIsSubAssembly: req.body.isSubAssembly || false,
                        pPlannedStatus: req.body.PlannedStatus ? req.body.PlannedStatus : null,
                        pSalesOrderDetailId: req.body.SalesOrderDetailId ? req.body.SalesOrderDetailId : 0,
                        pIsPendingWOCreationList: req.body.isPendingWOCreationList && req.body.isPendingWOCreationList ? 1 : 0,
                        pCustomPendingWOCreationWhereClause: req.body.customPendingWOCreationWhereClause ? req.body.customPendingWOCreationWhereClause : null,
                        pIsPendingCustPackingSlipList: req.body.isPendingCustPackingSlipList ? req.body.isPendingCustPackingSlipList : 0,
                        pfilterStatus: req.body.filterStatus || null,
                        pcustomerIds: req.body.customerID || null,
                        pshippingMethodId: req.body.shippingMethodId || null,
                        ptermsIds: req.body.termsIds || null,
                        psearchposotext: req.body.posoSearch || null,
                        psearchposotype: req.body.posoSearchType || null,
                        pfromDate: req.body.pfromDate || null,
                        ptoDate: req.body.ptoDate || null,
                        prushJob: req.body.isRushJob || false,
                        ppartIds: req.body.partIds || null,
                        pworkorders: req.body.woIds || null,
                        pkitreturnStatus: req.body.kitReturnFilterStatus || null,
                        pkitReleaseStatus: req.body.kitReleaseFilterStatus || null,
                        pfilterPOStatus: req.body.filterPOStatus || null,
                        pfromPODate: req.body.pfromPODate || null,
                        ptoPODate: req.body.ptoPODate || null,
                        pSubAssemblyTab: req.body.isSubAssemblyTab || false
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    kitList: _.values(response[1]),
                    Count: response[0][0]['TotalRecord'],
                    UnPlannedCount: response[2] && response[2][0] ? response[2][0]['UnPlannedCount'] : 0,
                    PartiallyPlannedCount: response[2] && response[2][0] ? response[2][0]['PartiallyPlannedCount'] : 0
                }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null
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
    // Retrieve count of kit having sub assemblies
    // GET : /api/v1/kit_allocation/getCountOfSubAssemblyKits
    // @return api response
    getCountOfSubAssemblyKits: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('Select fun_getCountOfSubAssemblyKits()', {
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                subAssyCount: _.values(response[0])[0]
            }, null)
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
    // Retrieve Kit Tree view list based on level
    // POST : /api/v1/kit_allocation/getAssemblyTreeViewList
    // @return api response
    getAssemblyTreeViewList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.query('CALL Sproc_GetAssemblyTreeViewList(:pSalesOrderDetID,:pPartID,:pViewType,:pIsKitAllocation)', {
                replacements: {
                    pSalesOrderDetID: req.body.salesOrderDetailId,
                    pPartID: req.body.partID,
                    pViewType: req.body.viewType,
                    pIsKitAllocation: req.body.isKitAllocation === true ? true : false
                }
            }).then(responseData =>
                resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, {
                    levelTreeList: _.values(responseData)
                }, null)
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
    }
};