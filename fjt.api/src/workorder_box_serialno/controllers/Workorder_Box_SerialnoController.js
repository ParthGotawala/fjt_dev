const _ = require('lodash');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const inputFields = [
    'id',
    'woID',
    'assyStockID',
    'employeeID',
    'uniqueID',
    'partID',
    'soDetID',
    'assyID',
    'woTransID',
    'qtyPerBox',
    'boxWeight',
    'boxWeightUOM',
    'status',
    'binID',
    'whID',
    'datecode',
    'remark',
    'woNumber'
];

const moduleName = DATA_CONSTANT.WORKORDER_BOX_SERIAL_NO.NAME;
const serialModuleName = DATA_CONSTANT.WORKORDER_SERIAL_NO.NAME;

module.exports = {
    // get assyID list
    // POST : /api/v1/workorderBoxSerialno/getAssemblyIDList
    // @return assyID list
    getAssemblyIDList: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.query) {
            const { sequelize } = req.app.locals.models;

            return sequelize.query('CALL Spoc_GetAssyIDWithUnitForBoxSNByPIDCode (:pPIDCode)', {
                replacements: {
                    pPIDCode: req.body.listObj.query
                },
                type: sequelize.QueryTypes.SELECT
            }).then(assyIDList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(assyIDList[0]), null)).catch((err) => {
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
    // Retrive list of Work Order Number
    // GET : /api/v1/workorderBoxSerialno/getWorkorderList
    // @return list of Work Order Number
    getWorkorderList: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.query) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Spoc_GetWOByPartIDAndWoNumberText (:pPartId,:pWoNumber,:pBoxSerialNo)', {
                replacements: {
                    pPartId: req.body.partID || null,
                    pWoNumber: req.body.listObj.query,
                    pBoxSerialNo: req.body.listObj.boxSerialID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(workorderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(workorderList[0]), null)).catch((err) => {
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
    // Retrive list of Part by passed PIDcode text
    // GET : /api/v1/workorderBoxSerialno/getPackageingMaterialPartList
    // @return list of Part by passed PIDcode text
    getPackageingMaterialPartList: (req, res) => {
        if (req.body && req.body.listObj && req.body.listObj.query) {
            const { sequelize } = req.app.locals.models;
            return sequelize.query('CALL Spoc_GetPackaginmaterialPartList (:pPIDCode)', {
                replacements: {
                    pPIDCode: req.body.listObj.query
                },
                type: sequelize.QueryTypes.SELECT
            }).then(workorderList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(workorderList[0]), null)).catch((err) => {
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
    // Retrive list of Box Serial#
    // GET : /api/v1/workorderBoxSerialno/retriveBoxSerialNoList
    // @return list of Box Serial#
    retriveBoxSerialNoList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        return sequelize.query('CALL Sproc_RetrieveBoxSerialNoList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pAssyID,:pWOID,:pAssyStockId)', {
            replacements: {
                ppageIndex: req.body.Page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pAssyID: req.body.assyID || null,
                pWOID: req.body.woID || null,
                pAssyStockId: req.body.assyStockId || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { serialList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrieve list of workorder sales order detail by woID
    // GET : /api/v1/workorderBoxSerialno/retriveBoxSerialNoById
    // @param {woID} int
    // @return list of workorder sales order detail
    getSalesOrderWoIDwise: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_getCustCodeSOPONumberByWOID (:pWOID)', {
            replacements: {
                pWOID: req.body.woID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(poList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(poList[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive work order box serial number
    // GET : /api/v1/workorderBoxSerialno/retriveBoxSerialNoById
    // @return box serial number
    retriveBoxSerialNoById: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.id) {
            return sequelize.query('CALL Sproc_GetBoxSerialNoDetailById(:pBoxId)', {
                replacements: {
                    pBoxId: req.body.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const boxDetail = _.values(response[0])[0];
                if (boxDetail) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, boxDetail, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    });
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
    // get Available Qty By StockID and WoID
    // POST : /api/v1/workorderBoxSerialno/getAssemblyIDList
    // @return Available Qty By StockID and WoID
    getAvailableQtyByStockIdOrWoID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('Select fun_getAvailableQtyByAssyStockIDAndWoID(:passyStockID,:pwoID,:pBoxSerialID)', {
            replacements: {
                passyStockID: req.query.assyStockID || null,
                pwoID: req.query.woID || null,
                pBoxSerialID: req.query.boxSerialId || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            const qty = _.values(response[0])[0];
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, qty);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Save Box Serial No Detail
    // GET : /api/v1/workorderBoxSerialno/saveBoxSerialNoList
    // @return Box Serial No Detail
    saveBoxSerialNoList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        COMMON.setModelCreatedByFieldValue(req);
        if (req.body.woID) {
            return sequelize.query('Select fun_getWODateCodeByWOID(:pwoID)', {
                replacements: {
                    pwoID: req.body.woID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const dateCode = _.values(response[0])[0];
                if (!dateCode) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MFG.DATECODE_SAVE_BOX_SERIALNO_REQUIRED, err: null, data: null });
                } else {
                    return module.exports.saveBoxSerialDetail(req, res);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return module.exports.saveBoxSerialDetail(req, res);
        }
    },
    saveBoxSerialDetail: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_SaveBoxSerialNumber(:pid,:pWoID ,:pAssyStockID,:pPartID,:pSoDetID,:pAssyID,:pWoTransID,:pQtyPerBox,:pBoxWeight,:pBoxWeightUOM,:pStatus,:pBinID,:pWhID,:pDatecode,:pEmployeeID,:pCreateBy,:pRemark,:pWoNumber,:pRoleId )', {
            replacements: {
                pid: req.body.id || null,
                pWoID: req.body.woID || null,
                pAssyStockID: req.body.assyStockID,
                pPartID: req.body.partID || null,
                pSoDetID: req.body.soDetID || null,
                pAssyID: req.body.assyID,
                pWoTransID: req.body.woTransID || null,
                pQtyPerBox: req.body.qtyPerBox,
                pBoxWeight: req.body.boxWeight || null,
                pBoxWeightUOM: req.body.boxWeightUOM || null,
                pStatus: req.body.status,
                pBinID: req.body.binID,
                pWhID: req.body.whID,
                pDatecode: req.body.datecode || null,
                pEmployeeID: req.user.employeeID,
                pCreateBy: req.body.createdBy,
                pRemark: req.body.remark || null,
                pWoNumber: req.body.woNumber || null,
                pRoleId: req.body.createByRoleId
            }
        }).then((boxSerialList) => {
            const detail = (Array.isArray(boxSerialList)) && (boxSerialList.length > 0) ? boxSerialList : null;
            if (req.body.id && !detail) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
            } else {
                const isContainError = detail.find((item => item && item.errorText));
                if (isContainError) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MFG.NOT_MORE_THAN_AVAILABLEQTY, err: null, data: detail });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, (req.body.id) ? null : detail[0]
                        , (req.body.id) ? MESSAGE_CONSTANT.UPDATED(moduleName) : MESSAGE_CONSTANT.CREATED(moduleName));
                }
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Delete Country
    // DELETE : /api/v1/workorderBoxSerialno/deleteBoxSerialNo
    // @param {countryId} int
    // @return API response
    deleteBoxSerialNo: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.WORORDER_BOX_SERIAL_NUMBER.Name;
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
            }).then((deleteReportDet) => {
                if (deleteReportDet.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, deleteReportDet, MESSAGE_CONSTANT.DELETED(moduleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: deleteReportDet, IDs: req.body.objIDs.id }, null);
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
    // Retrive list of Box Scan Serial#
    // GET : /api/v1/workorderBoxSerialno/retriveBoxScanSerialNoList
    // @return list of Box Scan Serial#
    retriveBoxScanSerialNoList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (req.query.boxSerialId) {
            return sequelize.query('CALL Sproc_RetrieveBoxScanSerialNoList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pBoxSerialNoId)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pBoxSerialNoId: req.query.boxSerialId
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { serialList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                serialList: [], Count: 0
            }, null);
        }
    },
    // Get and Validate of serial number detail
    // POST : /api/v1/workorderBoxSerialno/getValidateBoxSerialNumberDetails
    // @return serial number details
    getValidateBoxSerialNumberDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.woID) {
            return sequelize.query('CALL Sproc_GetScannedWOBoxSerialNoDetial (:pWoID,:pSerialNo)', {
                replacements: {
                    pWoID: req.body.woID,
                    pSerialNo: req.body.serialNo
                }
            }).then(workorderSerials => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorderSerials[0])).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get and Validate of serial number detail
    // POST : /api/v1/workorderBoxSerialno/getValidateBoxSerialNumberDetailsList
    // @return list of serial number details
    getValidateBoxSerialNumberDetailsList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.woID) {
            return sequelize.query('CALL Sproc_GetValidateWOBoxSerialNumber (:pWoID,:pFromSerialNo,:pToSerialNo,:pQty,:pSearchType)', {
                replacements: {
                    pWoID: req.body.woID,
                    pFromSerialNo: req.body.fromSerialNo,
                    pToSerialNo: req.body.toSerialNo || null,
                    pQty: req.body.Qty || null,
                    pSearchType: req.body.selectionType
                },
                type: sequelize.QueryTypes.SELECT
            }).then(woSerialNoList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woSerialNoList: _.values(woSerialNoList[0]) })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Generate Box Serial no
    // POST : /api/v1/workorderBoxSerialno/generateBoxSerialno
    // @return API response
    generateBoxSerialno: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            // let serialNoList = '';
            return sequelize.query('Select fun_getAvailableQtyByAssyStockIDAndWoID(:passyStockID,:pwoID,:pBoxSerialID)', {
                replacements: {
                    passyStockID: null,
                    pwoID: req.body.woID || null,
                    pBoxSerialID: req.body.boxSerialId
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const qty = _.values(response[0])[0];
                if (Array.isArray(req.body.woTransSerialNoList) && req.body.woTransSerialNoList.length > qty) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MFG.NOT_MORE_THAN_AVAILABLEQTY, err: null, data: null });
                } else {
                    // serialNoList = Array.isArray(req.body.woTransSerialNoList) ? req.body.woTransSerialNoList.join(',') : req.body.woTransSerialNoList;
                    const serialNoList = [];
                    if (Array.isArray(req.body.woTransSerialNoList)) {
                        _.each(req.body.woTransSerialNoList, (detItem) => {
                            serialNoList.push({ serialNo: detItem || {} });
                        });
                    } else {
                        serialNoList.push(req.body.woTransSerialNoList);
                    }
                    return sequelize.query('CALL Sproc_BoxSerialQty(:pWONumber,:pWOID,:pWOTransID,:pQty,:pSerialNoList,:pBoxSerialID,:pEmployeeID,:pUserId,:pRoleId)', {
                        replacements: {
                            pWOID: req.body.woID || null,
                            pWONumber: req.body.woNumber || null,
                            pWOTransID: req.body.woTransID || null,
                            pQty: req.body.qty || null,
                            pSerialNoList: JSON.stringify(serialNoList),
                            pBoxSerialID: req.body.boxSerialId,
                            pEmployeeID: req.body.employeeID,
                            pUserId: req.user.id,
                            pRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }
                    }).then((boxSerialNoListResp) => {
                        if (Array.isArray(boxSerialNoListResp) && boxSerialNoListResp.length > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, boxSerialNoListResp, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MFG.SCAN_BOX_SERIAL);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
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
    // Delete Workorder Trans Serial number
    // DELETE : /api/v1/workorderBoxSerialno/deleteTransBoxSerialNo
    // @param {countryId} int
    // @return API response
    deleteTransBoxSerialNo: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.WORKORDER_TRANS_BOX_SERIALNO.Name;
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
            }).then((deleteReportDet) => {
                if (deleteReportDet.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, deleteReportDet, MESSAGE_CONSTANT.DELETED(serialModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: deleteReportDet, IDs: req.body.objIDs.id }, null);
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
    // Get Box Serial No Detail
    // GET : /api/v1/workorderBoxSerialno/getBoxDetailByBoxID
    // @return list of Box Scan Serial#
    getBoxDetailByBoxID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.uniqueID) {
            const whereClause = {};
            whereClause.uniqueID = req.body.uniqueID;

            if (req.body.woNumber) {
                whereClause.woNumber = req.body.woNumber;
            }
            if (req.body.assyId) {
                whereClause.assyId = req.body.assyId;
            }
            return sequelize.query('CALL Sproc_GetBoxSerialNoDetailByAssyIdUniqueId(:pUniqueID,:pAssyId,:pWoNumber)', {
                replacements: {
                    pUniqueID: req.body.uniqueID,
                    pAssyId: req.body.assyId || null,
                    pWoNumber: req.body.woNumber || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                const boxDetail = _.values(response[0])[0];
                if (boxDetail) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, boxDetail, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.MFG.SCAN_VALID_BOX_SERIAL_NUMBER,
                        err: null,
                        data: null
                    });
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
    // Get and Validate of serial number detail
    // POST : /api/v1/workorderBoxSerialno/getScanBoxSerialNumberDetails
    // @return serial number details
    getScanBoxSerialNumberDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.fromBoxSRId) {
            return sequelize.query('CALL Sproc_GetScannedBoxSerialNoDetial (:pSerialNo,:pWOID,:pFromSerialNoId)', {
                replacements: {
                    pWOID: req.body.woID,
                    pSerialNo: req.body.serialNo,
                    pFromSerialNoId: req.body.fromBoxSRId
                }
            }).then(workorderSerials => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, workorderSerials[0])).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Generate Box Serial no
    // POST : /api/v1/workorderBoxSerialno/moveBoxSerialno
    // @return API response
    moveBoxSerialno: (req, res) => {
        const { sequelize, WorkorderBoxSerialno } = req.app.locals.models;
        if (req.body && req.body.fromBoxSRId && req.body.toBoxSRId) {
            // let serialNoList = '';
            return WorkorderBoxSerialno.findOne({
                where: { id: req.body.fromBoxSRId },
                attributes: ['qtyPerBox']
            }).then((boxserialDet) => {
                const moveQty = Array.isArray(req.body.moveSerialNoList) ? req.body.moveSerialNoList.length : req.body.qty;
                if (!boxserialDet) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName),
                        err: null,
                        data: null
                    });
                } else if (boxserialDet && boxserialDet.qtyPerBox && boxserialDet.qtyPerBox < moveQty) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MFG.NOT_MORE_THAN_AVAILABLEQTY, err: null, data: null });
                } else {
                    // serialNoList = Array.isArray(req.body.woTransSerialNoList) ? req.body.woTransSerialNoList.join(',') : req.body.woTransSerialNoList;
                    const serialNoList = [];
                    if (Array.isArray(req.body.woTransSerialNoList)) {
                        _.each(req.body.woTransSerialNoList, (detItem) => {
                            serialNoList.push({ serialNo: detItem || {} });
                        });
                    } else {
                        serialNoList.push(req.body.woTransSerialNoList);
                    }
                    return sequelize.query('CALL Sproc_MoveBoxSerialNoQty(:pWOID,:pQty,:pSerialNoList,:pFromBoxSerialId,:pToBoxSerialId,:pEmployeeID,:pUserId,:pRoleId)', {
                        replacements: {
                            pWOID: req.body.woID,
                            pQty: req.body.qty || null,
                            pSerialNoList: JSON.stringify(serialNoList),
                            pFromBoxSerialId: req.body.fromBoxSRId,
                            pToBoxSerialId: req.body.toBoxSRId,
                            pEmployeeID: req.body.employeeID,
                            pUserId: req.user.id,
                            pRoleId: COMMON.getRequestUserLoginRoleID(req)
                        }
                    }).then((boxSerialNoListResp) => {
                        if (Array.isArray(boxSerialNoListResp) && boxSerialNoListResp.length > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, boxSerialNoListResp, null);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MFG.BOX_SERIAL_NO_MOVED);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
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
    // Retrive list of Box Scan Serial# History
    // GET : /api/v1/workorderBoxSerialno/retriveBoxSerialNoHistory
    // @return list of Box Scan Serial# History
    retriveBoxSerialNoHistory: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        if (req.query.serialID || req.query.woBoxSerialID) {
            return sequelize.query('CALL Sproc_RetrieveBoxScanSerialNoHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pSerialNoId,:pWoBoxSerialID)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pSerialNoId: req.query.serialID || null,
                    pWoBoxSerialID: req.query.woBoxSerialID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { serialList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                serialList: [], Count: 0
            }, null);
        }
    }
};