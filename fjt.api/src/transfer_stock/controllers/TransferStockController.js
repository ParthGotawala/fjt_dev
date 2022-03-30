const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, InvalidPerameter } = require('../../errors');
const _ = require('lodash');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const models = require('../../../models');


module.exports = {
    // Retrive list of  active warehouse to transfer stock
    // GET : /api/v1/transfer_stock/getActiveWarehouse
    // @return list of  active warehouse to transfer stock
    getActiveWarehouse: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_retrive_warehouse_to_transfer(:pPageIndex, :pRecordPerPage, :pDeptID, :pGlobalSearchWHString, :pGlobalSearchBinString, :pGlobalSearchUIDString, :pParamSearchWHId, :pSearchWHString, :pSearchString, :pGlobalSearchClusterWHID, :pRefSalesOrderDetID, :pAssyId)', {
                replacements: {
                    pPageIndex: req.body.page || 0,
                    pRecordPerPage: req.body.pageSize || 0,
                    pDeptID: req.body.deptID || null,
                    pGlobalSearchWHString: req.body.globalSearchWHString || null,
                    pGlobalSearchBinString: req.body.globalSearchBinString || null,
                    pGlobalSearchUIDString: req.body.globalSearchUIDString || null,
                    pParamSearchWHId: req.body.paramSearchWHId || null,
                    pSearchWHString: req.body.searchWHId || null,
                    pSearchString: req.body.searchString || null,
                    pGlobalSearchClusterWHID: req.body.globalSearchClusterWHID || null,
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pAssyId: req.body.assyID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                warehouseList: _.values(response[1]),
                TotalWarehouse: response[0][0]['TotalRecord']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of  active bin to transfer stock
    // GET : /api/v1/transfer_stock/getActiveBin
    // @return list of  active bin to transfer stock
    getActiveBin: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_retrive_bin_to_transfer(:pPageIndex, :pRecordPerPage, :pWarehouseID, :pGlobalSearchBinString, :pGlobalSearchUIDString, :pSearchBinString, :pSearchString, :pGlobalSearchClusterWHID, :pKitSalesOrderDetID, :pKitAssyID, :pDeptID)', {
                replacements: {
                    pPageIndex: req.body.page || 0,
                    pRecordPerPage: req.body.pageSize || 0,
                    pWarehouseID: req.body.warehouseID || null,
                    pGlobalSearchBinString: req.body.globalSearchBinString || null,
                    pGlobalSearchUIDString: req.body.globalSearchUIDString || null,
                    pSearchBinString: req.body.searchBinId || null,
                    pSearchString: req.body.searchString || null,
                    pGlobalSearchClusterWHID: req.body.globalSearchClusterWHID || null,
                    pKitSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pKitAssyID: req.body.assyID || null,
                    pDeptID: req.body.deptID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                binList: _.values(response[1]),
                TotalBin: response[0][0]['TotalRecord']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // Retrive list of part detail to transfer stock
    // GET : /api/v1/transfer_stock/getUIDDetail
    // @return list of  part detail to transfer stock
    getUIDDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_retrive_UID_to_transfer(:pPageIndex, :pRecordPerPage, :pBinID, :pGlobalSearchUIDString, :pSearchUIDString, :pSearchString, :pClusterWHID, :pKitSalesOrderDetID, :pKitAssyID)', {
                replacements: {
                    pPageIndex: req.body.page || 0,
                    pRecordPerPage: req.body.pageSize || 0,
                    pBinID: req.body.binID || null,
                    pGlobalSearchUIDString: req.body.globalSearchUIDString || null,
                    pSearchUIDString: req.body.searchUIDId || null,
                    pSearchString: req.body.searchString || null,
                    pClusterWHID: req.body.clusterWHID || null,
                    pKitSalesOrderDetID: req.body.refSalesOrderDetID || null,
                    pKitAssyID: req.body.assyID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                component: _.values(response[1]),
                TotalComponent: response[0][0]['TotalRecord']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of part detail to transfer stock
    // GET : /api/v1/transfer_stock/managestock
    // @return list of  part detail to transfer stock
    managestock: (req, res) => {
        req.body.userID = req.user.id;
        // module.exports.tranferStockDetail(req.body, false, res);
        return module.exports.checkForSmartCart(req, req.body, false, res);
    },

    checkForSmartCart: (req, objTrans, isInoAuto, res) => {
        const { Settings } = models;

        if (!isInoAuto) {
            if ((objTrans.transferType === DATA_CONSTANT.INO_AUTO.TransferType.StockTransfer ||
                objTrans.transferType === DATA_CONSTANT.INO_AUTO.TransferType.Department) && objTrans.fromWHID) {
                return module.exports.getWareHouseCartDetail(objTrans.fromWHID).then((whSmartCart) => {
                    if (whSmartCart.uniqueCartID) {
                        return Settings.findAll({
                            where: {
                                key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus]
                            }
                        }).then((serverStatus) => {
                            var serverStatusKeyDetail = _.find(serverStatus, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                            var exchange = global.inoAutoexchange;
                            if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values === DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                                if (whSmartCart.isCartOnline) {
                                    return module.exports.tranferStockDetail(req, objTrans, false, res);
                                } else {
                                    // Smart Cart is not online
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SMARTCART_IS_NOT_ONLINE);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, whSmartCart.uniqueCartID);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: messageContent,
                                        err: null,
                                        data: null
                                    });
                                }
                            } else {
                                // Inoauto Server is not connected
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, new NotFound(MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected));
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
                        return module.exports.tranferStockDetail(req, objTrans, false, res);
                    }
                });
            } else {
                return module.exports.tranferStockDetail(req, objTrans, false, res);
            }
        } else {
            return module.exports.tranferStockDetail(req, objTrans, false, res);
        }
    },

    // return transfered stock
    tranferStockDetail: (req, objTrans, isInoAuto, res) => {
        const {
            sequelize
        } = models;

        objTrans.unallocatedXferHistorylist = [];
        objTrans.countApprovalHistoryList = [];
        COMMON.setModelCreatedByFieldValue(objTrans);
        if (objTrans.unallocatedXferHistoryData) {
            objTrans.unallocatedXferHistoryData.createdBy = objTrans.createdBy || null;
            objTrans.unallocatedXferHistoryData.updatedBy = objTrans.updatedBy || null;
            objTrans.unallocatedXferHistoryData.updateByRoleId = objTrans.updateByRoleId || null;
            objTrans.unallocatedXferHistoryData.createByRoleId = objTrans.createByRoleId || null;
            objTrans.unallocatedXferHistorylist.push(objTrans.unallocatedXferHistoryData);
        }
        if (objTrans.countApprovalHistoryData) {
            objTrans.countApprovalHistoryData.approvedBy = objTrans.createdBy || null;
            objTrans.countApprovalHistoryData.approvedByRoleId = objTrans.createByRoleId || null;
            objTrans.countApprovalHistoryList.push(objTrans.countApprovalHistoryData);
        }
        sequelize.query('CALL Sproc_transfer_stock(:pTransferType, :pFromWHID, :pToWHID, :pFromBinID ,:pToBinID, :pUIDID, :pCreatedBy, :pKitSalesOrderDetID, :pKitAssyID, :pFromParentWH, :pToParentWH, :pParentWHType, :pPkgCount, :pPkgUnit, :pAdjustCount, :pAdjustUnit, :pKitReturnDetail, :pTransferStockType, :pTransType, :pActionPerformed, :pWOTransID, :pIsKitSelected, :pNotes, :pUserInputDetail,:punallocatedXferHistoryData,:pCountApprovalHistoryData)', {
            replacements: {
                pTransferType: objTrans.transferType || null,
                pFromWHID: objTrans.fromWHID || null,
                pToWHID: objTrans.toWHID || null,
                pFromBinID: objTrans.fromBinID || null,
                pToBinID: objTrans.toBinID || null,
                pUIDID: objTrans.uidID || null,
                pCreatedBy: objTrans.userID,
                pKitSalesOrderDetID: objTrans.refSalesOrderDetID || null,
                pKitAssyID: objTrans.assyID || null,
                pFromParentWH: objTrans.fromParentWH || null,
                pToParentWH: objTrans.toParentWH || null,
                pParentWHType: objTrans.parentWHType || null,
                pPkgCount: objTrans.pkgCount != null ? objTrans.pkgCount : null,
                pPkgUnit: objTrans.pkgUnit != null ? objTrans.pkgUnit : null,
                pAdjustCount: objTrans.adjustCount != null ? objTrans.adjustCount : null,
                pAdjustUnit: objTrans.adjustUnit != null ? objTrans.adjustUnit : null,
                pKitReturnDetail: objTrans.kitReturnDetail && objTrans.kitReturnDetail.length > 0 ? JSON.stringify(objTrans.kitReturnDetail) : null,
                pTransferStockType: objTrans.transferStockType || null,
                pTransType: objTrans.transType || null,
                pActionPerformed: objTrans.actionPerformed || null,
                pWOTransID: objTrans.woTransID || null,
                pIsKitSelected: objTrans.isKitSelected || null,
                pNotes: objTrans.notes || null,
                pUserInputDetail: objTrans.userInputDetail ? JSON.stringify(objTrans.userInputDetail) : null,
                punallocatedXferHistoryData: objTrans.unallocatedXferHistorylist && objTrans.unallocatedXferHistorylist.length > 0 ? JSON.stringify(objTrans.unallocatedXferHistorylist) : null,
                pCountApprovalHistoryData: objTrans.countApprovalHistoryList && objTrans.countApprovalHistoryList.length > 0 ? JSON.stringify(objTrans.countApprovalHistoryList) : null
            },
            type: sequelize.QueryTypes.SELECT
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            if (objTrans.uidID && objTrans.toBinID) {
                module.exports.updateSmartCartPick(objTrans.uidID, objTrans.toBinID, objTrans.userID);
            }
            if (!isInoAuto) {
                if ((objTrans.transferType === DATA_CONSTANT.INO_AUTO.TransferType.StockTransfer || objTrans.transferType === DATA_CONSTANT.INO_AUTO.TransferType.Department) && objTrans.fromWHID) {
                    return module.exports.getWareHouseCartDetail(objTrans.fromWHID).then((whCart) => {
                        if (whCart.uniqueCartID) {
                            const request = { TowerID: whCart.uniqueCartID };
                            module.exports.sendRequestToAssignDepartment(request);
                        }
                        module.exports.manageUMIDKitElasticData(req, objTrans);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            transferDetail: _.values(response[0])
                        },
                            MESSAGE_CONSTANT.Transfer_Material.Trsnafer_Success
                        );
                    });
                } else {
                    const transferDetail = _.values(response[0]);
                    if (objTrans.toParentWarehouseName && transferDetail[0]) {
                        transferDetail[0].toParentWarehouseName = objTrans.toParentWarehouseName;
                    }
                    module.exports.manageUMIDKitElasticData(req, objTrans);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transferDetail: transferDetail
                    }, MESSAGE_CONSTANT.Transfer_Material.Trsnafer_Success);
                }
            }
            // eslint-disable-next-line consistent-return
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!isInoAuto) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }
        });
    },

    manageUMIDKitElasticData: (req, objTrans) => {
        req.params = {};
        if (objTrans.uidID) {
            req.params['umID'] = objTrans.uidID;
            // Add UMID detail into Elastic Search Engine for Enterprise Search
            EnterpriseSearchController.manageUMIDDetailInElastic(req);
        }
        if (objTrans.kitReturnDetail && objTrans.kitReturnDetail.length > 0) {
            const kitDetail = _.find(objTrans.kitReturnDetail, 'id');
            // Add Kit Allocation Detail into Elastic Search Engine for Enterprise Search
            if (typeof (kitDetail) === 'object') {
                req.params['pId'] = kitDetail.id;
                EnterpriseSearchController.manageKitAllocationInElastic(req);
            }
        }
    },

    updateSmartCartPick: (UID, binID, userID) => {
        const {
            SmartCartTransaction,
            ComponentSidStock
        } = models;
        // eslint-disable-next-line global-require
        const InoAutoIntegrationAPI = require('../../InoAutoIntegration/InoAutoIntegrationAPI');
        return ComponentSidStock.findOne({
            where: {
                id: UID,
                deletedAt: null
            },
            model: ComponentSidStock,
            attributes: ['uid', 'id'],
            required: false
        }).then((objSid) => {
            if (objSid && objSid.uid) {
                return SmartCartTransaction.findOne({
                    where: {
                        reelBarCode: objSid.uid,
                        isInTransit: true
                        // messageType: DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Checkin
                    },
                    fields: ['id', 'messageType', 'transactionID', 'towareHouseID', 'refDepartmentID', 'illegalPick', 'toBinID']
                }).then((response) => {
                    if (response) {
                        const objUpdate = {
                            isInTransit: false
                        };
                        return SmartCartTransaction.update(objUpdate, {
                            where: {
                                reelBarCode: objSid.uid,
                                isInTransit: true
                            },
                            fields: ['isInTransit']
                        }).then(() => {
                            if (response.messageType === DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.UnAuthorized_Checkin) {
                                return module.exports.getBinNameByID(response.toBinID).then((objBin) => {
                                    if (objBin) {
                                        const objClearReq = response;
                                        objClearReq.slotName = objBin.Name;
                                        objClearReq.clearUnauthorizeRequstReason = DATA_CONSTANT.INO_AUTO.MESSAGE.ClearReason;
                                        return InoAutoIntegrationAPI.sendRequestToClearUnauthorize(objClearReq, userID).then((inoAutoResponse) => {
                                            if (inoAutoResponse.state === STATE.SUCCESS) {
                                                return STATE.SUCCESS;
                                            }
                                            return STATE.FAILED;
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return STATE.FAILED;
                                        });
                                    } else {
                                        return STATE.FAILED;
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return STATE.FAILED;
                                });
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
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
            } else {
                return STATE.SUCCESS;
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },

    // Retrive bin name by binID
    // @param {binID} string
    // @return bin name by binID
    getBinNameByID: (binID) => {
        const { BinMst } = models;
        var objBin = {
            binID: null,
            Name: null
        };
        return BinMst.findOne({
            where: {
                isActive: true,
                id: binID,
                deletedAt: null
            },
            model: BinMst,
            attributes: ['id', 'Name'],
            required: false
        }).then((bin) => {
            if (bin) {
                objBin.Name = bin.Name;
                objBin.binID = bin.id;
            }
            return objBin;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return objBin;
        });
    },

    // Get List of Component Sid Stock
    // GET : /api/v1/transfer_stock/history
    // @return retrive history of transferred stock
    history: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);

        // create where clause
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (strWhere === '') {
            strWhere = null;
        }

        sequelize.query('CALL Sproc_Transfer_Stock_History (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUID)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pUID: req.body.uid ? parseInt(req.body.uid) : null || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, 200, STATE.SUCCESS, {
            component: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        })).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG));
        });
    },

    // Retrive list of  kit to transfer stock
    // GET : /api/v1/transfer_stock/getKitToTransferStock
    // @return list of  kit to transfer stock
    getKitToTransferStock: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_retrive_kit_to_transfer(:pPageIndex, :pRecordPerPage, :pDeptID, :pSearchString, :pGlobalSearchKitSalesOrderDetID, :pGlobalSearchKitAssyID, :pSearchKitSalesOrderDetID, :pSearchKitAssyID, :pGlobalSearchBinString, :pGlobalSearchUIDString, :pIsCheckMRP, :pIsCheckMWS, :pIsCheckMRE, :pIsCheckMRR, :pIsCheckPRE, :pIsCheckPPR, :pIsCheckPNR)', {
                replacements: {
                    pPageIndex: req.body.page || 0,
                    pRecordPerPage: req.body.pageSize || 0,
                    pDeptID: req.body.deptID || null,
                    pSearchString: req.body.searchString || null,
                    pGlobalSearchKitSalesOrderDetID: req.body.globalSearchRefSalesOrderDetID || null,
                    pGlobalSearchKitAssyID: req.body.globalSearchAssyID || null,
                    pSearchKitSalesOrderDetID: req.body.searchRefSalesOrderDetID || null,
                    pSearchKitAssyID: req.body.searchAssyID || null,
                    pGlobalSearchBinString: req.body.globalSearchBinString || null,
                    pGlobalSearchUIDString: req.body.globalSearchUIDString || null,
                    pIsCheckMRP: (req.body.isCheckMRP !== null && req.body.isCheckMRP !== undefined) ? req.body.isCheckMRP : true,
                    pIsCheckMWS: (req.body.isCheckMWS !== null && req.body.isCheckMWS !== undefined) ? req.body.isCheckMWS : true,
                    pIsCheckMRE: (req.body.isCheckMRE !== null && req.body.isCheckMRE !== undefined) ? req.body.isCheckMRE : false,
                    pIsCheckMRR: (req.body.isCheckMRR !== null && req.body.isCheckMRR !== undefined) ? req.body.isCheckMRR : false,
                    pIsCheckPRE: (req.body.isCheckPRE !== null && req.body.isCheckPRE !== undefined) ? req.body.isCheckPRE : true,
                    pIsCheckPPR: (req.body.isCheckPPR !== null && req.body.isCheckPPR !== undefined) ? req.body.isCheckPPR : true,
                    pIsCheckPNR: (req.body.isCheckPNR !== null && req.body.isCheckPNR !== undefined) ? req.body.isCheckPNR : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                kitList: _.values(response[1]),
                TotalKit: response[0][0]['TotalRecord']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of other kit which is allocated in same warehouse
    // GET : /api/v1/transfer_stock/getKitWarehouseDetail
    // @return list of other kit which is allocated in same warehouse
    getKitWarehouseDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetKitWarehouseDetail(:pRefSalesOrderDetID, :pAssyID, :pFromParentWHType, :pWarehouseId, :pBinId)', {
            replacements: {
                pRefSalesOrderDetID: req.query.refSalesOrderDetID || null,
                pAssyID: req.query.assyID || null,
                pFromParentWHType: req.query.fromParentWHType || null,
                pWarehouseId: req.query.warehouseId || null,
                pBinId: req.query.binId || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            kitList: _.values(response[0]),
            UMIDList: response && response.length > 1 ? _.values(response[1]) : [],
            UnallocatedUMIDSummary: response && response.length > 2 ? _.values(response[2]) : [],
            transferKitWHList: response && response.length > 3 ? _.values(response[3]) : [],
            nonUMIDList: response && response.length > 4 ? _.values(response[4]) : []
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

    // Transfer empty bin to selected warehouse
    // GET : /api/v1/transfer_stock/tranferEmptyBinToWH
    tranferEmptyBinToWH: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        sequelize.query('CALL Sproc_Transfer_Empty_Bin_To_WH(:pWarehouseIDs, :pTransferToWHID, :pUpdatedBy)', {
            replacements: {
                pWarehouseIDs: req.body.warehouseIDs || null,
                pTransferToWHID: req.body.transferToWHID || null,
                pUpdatedBy: req.user.id
            }
        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.FAILED, new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG));
        });
    },


    // Retrive warehouse detail by ID
    // @param {name} string
    // @return detail of parent warehouse name
    getWareHouseCartDetail: (whID) => {
        const { WarehouseMst } = models;
        var whCartObj = {
            uniqueCartID: null,
            isCartOnline: false
        };
        return WarehouseMst.findOne({
            where: {
                isActive: true,
                ID: whID,
                deletedAt: null,
                warehouseType: DATA_CONSTANT.warehouseType.SmartCart.key
            },
            model: WarehouseMst,
            attributes: ['id', 'uniqueCartID', 'isCartOnline'],
            required: false
        }).then((wareHouse) => {
            if (wareHouse) {
                whCartObj.uniqueCartID = wareHouse.uniqueCartID;
                whCartObj.isCartOnline = (wareHouse.isCartOnline === 1);
            }
            return whCartObj;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return whCartObj;
        });
    },

    // Retrive warehouse department name
    // POST : /api/v1/binmst/getWareHouseDepartmentName
    // @param {name} string
    // @return detail of parent warehouse name
    getWareHouseDepartmentName: (name) => {
        const { WarehouseMst } = models;
        const objDept = {};
        return WarehouseMst.findOne({
            where: {
                isActive: true,
                uniqueCartID: name,
                deletedAt: null
            },
            model: WarehouseMst,
            attributes: ['ID', 'Name'],
            required: false,
            include: [{
                model: WarehouseMst,
                as: 'parentWarehouseMst',
                attributes: ['id', 'Name']
            }]
        }).then((wareHouse) => {
            if (wareHouse) {
                objDept.wareHouseID = wareHouse.ID;
                objDept.warehouseName = wareHouse.Name;
                objDept.deptID = wareHouse.parentWarehouseMst.dataValues.id;
                objDept.deptname = wareHouse.parentWarehouseMst.Name;
                return objDept;
            }
            return objDept;
        }).catch((err) => {
            console.trace();
            console.error(err);
            return objDept;
        });
    },

    sendCommonRequestToInoauto: (req) => {
        const { Settings } = models;
        Settings.findOne({
            where: {
                key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName
            }
            // eslint-disable-next-line consistent-return
        }).then((response) => {
            var exchange = global.inoAutoexchange;
            if (response) {
                const objTrans = {
                    messageType: req.MessageType,
                    startDate: COMMON.getCurrentUTC(),
                    requestMessage: JSON.stringify(req),
                    createdBy: DATA_CONSTANT.ADMIN_ID,
                    updatedBy: DATA_CONSTANT.ADMIN_ID,
                    transactionID: req.TransactionID,
                    isfromSystem: true,
                    refDepartmentID: req.deptID
                };
                return module.exports.createTransactionHistory(objTrans).then(() => {
                    delete req.deptID;
                    const directive = COMMON.stringFormat('{0}.{1}', response.values, req.MessageType);
                    exchange.publish(directive, Buffer.from(JSON.stringify(req), null, null));
                });
            }
        });
    },

    createTransactionHistory: (objTransaction) => {
        const { SmartCartTransaction } = models;
        return SmartCartTransaction.create(objTransaction, {
            fields: ['messageType', 'startDate', 'isfromSystem', 'requestMessage', 'createdBy', 'updatedBy', 'transactionID', 'refDepartmentID']
        }).then(() => STATE.SUCCESS).catch((err) => {
            console.trace();
            console.error(err);
            return STATE.FAILED;
        });
    },
    // Send Request to assign department
    RequestToAssignDepartment: (req, res) => module.exports.sendRequestToAssignDepartment(req.body).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS,
                null,
                null
            );
        }
        return resHandler.successRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.FAILED,
            null,
            response.error
        );
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
            err: err,
            data: null
        });
    }),

    /**
     * Send Request To Assign Department to cartID
     * @param MessageType {String} 1030 Assign Department Request
     * @param TransactionID {String} Unique Request ID from FJT
     * @param TimeStamp {DateTime} Date/Time Stamp UTC JSON format  "\/Date(\"2018-04-25T19:52:45.281Z\")\/"
     */
    sendRequestToAssignDepartment: (req) => {
        const {
            Settings
        } = models;
        if (req) {
            return Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus]
                }
            }).then((response) => {
                var serverStatusKeyDetail = _.find(response, { key: DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus });
                var exchange = global.inoAutoexchange;
                if (exchange && serverStatusKeyDetail && serverStatusKeyDetail.values === DATA_CONSTANT.INO_AUTO.SERVER_STATUS.Online) {
                    req.MessageType = DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Assign_Department;
                    req.TransactionID = req.TransactionID || COMMON.getGUID();
                    req.TimeStamp = COMMON.getCurrentUTC();
                    return module.exports.getWareHouseDepartmentName(req.TowerID).then((warehouse) => {
                        req.Department = warehouse.deptname;
                        req.deptID = warehouse.deptID;
                        module.exports.sendCommonRequestToInoauto(req);
                        return { state: STATE.SUCCESS };
                    });
                }
                return { state: STATE.FAILED, error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { state: STATE.FAILED, error: new NotFound(MESSAGE_CONSTANT.COMMON.SOMTHING_WRONG) };
            });
        } else {
            return { state: STATE.FAILED, error: new InvalidPerameter(REQUEST.INVALID_PARAMETER) };
        }
    },

    // Get UMID Work Order History
    // POST : /api/v1/transfer_stock/getUMIDWOHistory
    // @param Pagination model
    // @return API response
    getUMIDWorkOrderHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.query) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetUMIDWorkOrderHistory (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pUID)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pUID: req.body.uid ? parseInt(req.body.uid) : null || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(woList => resHandler.successRes(res, 200, STATE.SUCCESS, {
                woList: _.values(woList[1]),
                Count: woList[0][0]['TotalRecord']
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

    // Get UMID Kit Allocation History
    // POST : /api/v1/transfer_stock/getUMIDKitAllocationHistory
    // @param Pagination model
    // @return API response
    getUMIDKitAllocationHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.query) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetUMIDKitAllocationHistory (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pUID)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pUID: req.body.uid ? parseInt(req.body.uid) : null || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(kitAllocationList => resHandler.successRes(res, 200, STATE.SUCCESS, {
                kitAllocationList: _.values(kitAllocationList[1]),
                Count: kitAllocationList[0][0]['TotalRecord']
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

    // Get Mismatch Item For Kit
    // POST : /api/v1/transfer_stock/getMismatchItemForKit
    // @return mismatch item
    getMismatchItemForKit: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.refSalesOrderDetID && req.body.assyId) {
            return sequelize.query('Select func_MismatchItemForKit(:pRefSalesOrderDetID, :pAssyID, :pParentWHType, :pWarehouseId, :pBinId)', {
                replacements: {
                    pRefSalesOrderDetID: req.body.refSalesOrderDetID,
                    pAssyID: req.body.assyId,
                    pParentWHType: req.body.parentWHType ? req.body.parentWHType : null,
                    pWarehouseId: req.body.warehouseId ? req.body.warehouseId : null,
                    pBinId: req.body.binId ? req.body.binId : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(responce =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    mismatchCount: _.values(responce[0])[0]
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
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
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    }

};