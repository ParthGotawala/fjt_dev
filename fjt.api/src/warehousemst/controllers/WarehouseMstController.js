const _ = require('lodash');
const {
    Op
} = require('sequelize');
const fs = require('fs');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');
var csv = require('fast-csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var mime = require('mime');
const resHandler = require('../../resHandler');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    NotFound
} = require('../../errors');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const InoAutoIntegrationAPI = require('../../InoAutoIntegration/InoAutoIntegrationAPI');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const warehouseModuleName = DATA_CONSTANT.WAREHOUSEMST.NAME;

const inputFields = ['ID', 'Name', 'Description', 'nickname', 'parentWHID', 'isActive', 'isPermanentWH', 'isDeleted',
    'createdBy', 'updatedBy', 'deletedBy', 'deletedAt', 'isDepartment', 'uniqueCartID', 'scanWH', 'scanBin', 'allMovableBin',
    'userAccessMode', 'domain', 'cartMfr', 'cartMachineName', 'refEqpID', 'warehouseType', 'isCartOnline', 'slotCount',
    'createByRoleId', 'updateByRoleId', 'deleteByRoleId', 'leftSideWHLabel', 'rightSideWHLabel'
];


function checkValidation(callback, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData) {
    const data = WarehouseDataList[listDataIndex];
    const {
        WarehouseMst,
        BinMst
    } = req.app.locals.models;
    const SmartCart = DATA_CONSTANT.warehouseType.SmartCart.value.toUpperCase();
    const FailureOperationStatus = DATA_CONSTANT.WarehouseErrors.FailureOperationStatus;
    const inCondtion = [data.CartName, data.side1, data.side2];
    const promises = [];
    const uniqueCartID = data.WarehouseType.toUpperCase() === SmartCart ? data.UniqueCartID : '';
    const whereBin = {
        [Op.or]: {
            Name: {
                [Op.in]: inCondtion
            }
        },
        deletedAt: null
    };
    const whereWarehouse = {
        [Op.or]: {
            Name: {
                [Op.in]: inCondtion
            },
            leftSideWHLabel: {
                [Op.in]: inCondtion
            },
            rightSideWHLabel: {
                [Op.in]: inCondtion
            },
            uniqueCartID: uniqueCartID
        },

        deletedAt: null

    };
    promises.push(BinMst.findOne({
        where: whereBin,
        model: BinMst,
        attributes: ['id', 'Name', 'WarehouseID'],
        paranoid: false
    }));
    promises.push(WarehouseMst.findAll({
        where: whereWarehouse,
        model: WarehouseMst,
        attributes: ['id', 'Name', 'leftSideWHLabel', 'rightSideWHLabel', 'uniqueCartID'],
        paranoid: false
    }));

    Promise.all(promises).then((resp) => {
        let binWarehouseData = null;
        const EquipmentCon = DATA_CONSTANT.warehouseType.Equipment.value.toUpperCase();
        if (resp && (resp[0] || resp[1])) {
            if (resp[0] && resp[0].length > 0) {
                if (data.CartName === resp[0].Name) {
                    data.errorMessageList.push(COMMON.stringFormat(MESSAGE_CONSTANT.WAREHOUSE.WAREHOUSE_UNIQUE_IN_BIN, data.WarehouseType.toUpperCase() === EquipmentCon ? 'Equipment' : 'Warehouse', data.CartName));
                }
            }
            if (resp[1] && resp[1].length > 0) {
                _.filter(resp[1], (isExists) => {
                    let flagLR = true;
                    if (data.CartName === isExists.Name) {
                        flagLR = false;
                        data.errorMessageList.push(COMMON.stringFormat(MESSAGE_CONSTANT.WAREHOUSE.WAREHOUSE_UNIQUE_API, data.WarehouseType.toUpperCase() === EquipmentCon ? 'Equipment' : 'Warehouse', data.CartName));
                    }
                    if (data.WarehouseType.toUpperCase() === SmartCart) {
                        if (flagLR) {
                            if (data.CartName === isExists.rightSideWHLabel || data.side2 === isExists.rightSideWHLabel || data.side2 === isExists.Name) {
                                data.errorMessageList.push(COMMON.stringFormat(MESSAGE_CONSTANT.WAREHOUSE.WAREHOUSE_UNIQUE_API, data.WarehouseType.toUpperCase() === EquipmentCon ? 'Equipment' : 'Warehouse', COMMON.stringFormat('{0} (Side 2)', data.CartName)));
                            }
                            if (data.CartName === isExists.leftSideWHLabel || data.side1 === isExists.leftSideWHLabel || data.side1 === isExists.Name) {
                                data.errorMessageList.push(COMMON.stringFormat(MESSAGE_CONSTANT.WAREHOUSE.WAREHOUSE_UNIQUE_API, data.WarehouseType.toUpperCase() === EquipmentCon ? 'Equipment' : 'Warehouse', COMMON.stringFormat('{0} (Side 1)', data.CartName)));
                            }
                        }
                        if (data.UniqueCartID === isExists.uniqueCartID) {
                            data.errorMessageList.push(DATA_CONSTANT.WarehouseErrors.UniqueCartIdNonUnique);
                        }
                    }
                });
            }
            binWarehouseData = resp[0] ? resp[0] : resp[1];
        }
        data.OperationStatus = FailureOperationStatus;
        callback(data, binWarehouseData, req, WarehouseDataList, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
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

function DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData) {
    const PrintAllData = [];
    const promises = [];
    let ws;
    _.each(AllDataWithError, (item) => {
        if (item.WarehouseType.toUpperCase() === DATA_CONSTANT.warehouseType.SmartCart.value.toUpperCase()) {
            delete item.side1;
            delete item.side2;
        }
        delete item.warehouseStore;
        item = _.omit(item, ['index']);
        item.ErrorLog = _.map(item.errorMessageList, (message, index) => `${(index + 1)}. ${message}`).join(' ');
        delete item.errorMessageList;
        PrintAllData.push(item);
    });
    if (ElasticData.length > 0) {
        promises.push(module.exports.manageWarehouseElasticData(req, res, ElasticData));
    }
    promises.push(ws = fs.createWriteStream(path));
    promises.push(
        csv.write(PrintAllData, {
            headers: true
        }).pipe(ws));
    Promise.all(promises).then(() => {
        const file = path;
        const mimetype = mime.lookup(`${file}.text/csv`);
        res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
        res.setHeader('Content-type', mimetype);
        const filestream = fs.createReadStream(file);
        fs.unlinkSync(path);
        filestream.pipe(res);
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

function saveWarehouse(data, isExists, req, WarehouseDataList, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData) {
    const {
        Equipment
    } = req.app.locals.models;
    const EquipmentCon = DATA_CONSTANT.warehouseType.Equipment.value.toUpperCase();
    const FailureOperationStatus = DATA_CONSTANT.WarehouseErrors.FailureOperationStatus;
    if (isExists.length > 0) {
        data.OperationStatus = FailureOperationStatus;
        AllDataWithError.push(data);
        listDataIndex++;
        if (listDataIndex <= WarehouseDataList.length - 1) {
            checkValidation(saveWarehouse, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
        } else {
            DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData);
        }
    } else {
        const warehouseData = WarehouseDataList[listDataIndex];
        if (warehouseData.WarehouseType.toUpperCase() === EquipmentCon) {
            Equipment.findOne({
                where: {
                    isActive: true,
                    equipmentAs: {
                        [Op.in]: ['E']
                    },
                    assetName: warehouseData.Equipment
                },
                model: Equipment,
                attributes: ['eqpID', 'assetName'],
                paranoid: false
            }).then((result) => {
                if (result) {
                    warehouseData.EquipmentID = result.eqpID;
                    warehouseData.EquipmentWHName = result.assetName;
                    // eslint-disable-next-line no-use-before-define
                    saveData(warehouseData, req, WarehouseDataList, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
                } else {
                    warehouseData.errorMessageList.push(COMMON.stringFormat(DATA_CONSTANT.WarehouseErrors.NotFound, DATA_CONSTANT.warehouseType.Equipment.value));
                    warehouseData.OperationStatus = FailureOperationStatus;
                    AllDataWithError.push(warehouseData);
                    listDataIndex++;
                    if (listDataIndex <= WarehouseDataList.length - 1) {
                        checkValidation(saveWarehouse, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
                    } else {
                        DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData);
                    }
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                warehouseData.errorMessageList.push(COMMON.stringFormat(DATA_CONSTANT.WarehouseErrors.NotFound, DATA_CONSTANT.warehouseType.Equipment.value));
                warehouseData.OperationStatus = FailureOperationStatus;
                AllDataWithError.push(warehouseData);
                listDataIndex++;
                if (listDataIndex <= WarehouseDataList.length - 1) {
                    checkValidation(saveWarehouse, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
                } else {
                    DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData);
                }
            });
        } else {
            // eslint-disable-next-line no-use-before-define
            saveData(warehouseData, req, WarehouseDataList, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
        }
    }
}

function saveData(data, req, WarehouseDataList, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData) {
    const {
        WarehouseMst
    } = req.app.locals.models;
    const SmartCart = DATA_CONSTANT.warehouseType.SmartCart.value.toUpperCase();
    const ShelvingCart = DATA_CONSTANT.warehouseType.ShelvingCart.value.toUpperCase();
    const MainMaterialWarehouse = DATA_CONSTANT.warehouseDepartmentType[0].value.toUpperCase();
    const PWHID = DATA_CONSTANT.warehouseDepartmentType;
    const Yes = DATA_CONSTANT.WarehouseImportConfirmations.Yes;
    const No = DATA_CONSTANT.WarehouseImportConfirmations.No;
    const WarehouseType = data.WarehouseType.toUpperCase();
    const parentWHID = data.ParentWarehouse.toUpperCase() === MainMaterialWarehouse ? PWHID[0].id : PWHID[1].id;
    const isPermanentWH = WarehouseType === SmartCart ? 0 : (WarehouseType === ShelvingCart ? (data.PermanentWarehouse ? (data.PermanentWarehouse.toUpperCase() === Yes ? 1 : 0) : 1) : 1);
    const AllBinMovable = WarehouseType === SmartCart ? 0 : (WarehouseType === ShelvingCart ? (data.AllBinMovable ? (data.AllBinMovable.toUpperCase() === No ? 0 : 1) : 1) : 0);
    const nickname = WarehouseType === ShelvingCart ? data.Nickname.toUpperCase() : null;
    const uniqueCartID = WarehouseType === SmartCart ? data.UniqueCartID : null;
    const domain = WarehouseType === SmartCart ? data.Domain : null;
    const FailureOperationStatus = DATA_CONSTANT.WarehouseErrors.FailureOperationStatus;
    const cartMfr = WarehouseType === SmartCart ? (data.CartManufacturer.toUpperCase() === DATA_CONSTANT.WarehouseCartManufacturer[0].id.toUpperCase() ? DATA_CONSTANT.WarehouseCartManufacturer[0].id : DATA_CONSTANT.WarehouseCartManufacturer[1].id) : null;
    const importInputFields = ['warehouseType', 'parentWHID', 'Name', 'refEqpID', 'isPermanentWH', 'allMovableBin', 'nickname', 'uniqueCartID', 'domain', 'cartMfr', 'cartMachineName', 'Description', 'isActive', 'isDeleted', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'createByRoleId', 'updateByRoleId', 'leftSideWHLabel', 'rightSideWHLabel'];

    const warehouseData = {
        warehouseType: data.warehouseStore ? data.warehouseStore : '',
        parentWHID: parentWHID ? parentWHID : '',
        Name: data.CartName ? data.CartName.toUpperCase() : '',
        refEqpID: data.EquipmentID ? data.EquipmentID : null,
        isPermanentWH: isPermanentWH,
        allMovableBin: AllBinMovable,
        nickname: nickname,
        uniqueCartID: uniqueCartID,
        domain: domain,
        cartMfr: cartMfr,
        cartMachineName: data.CartMachineName ? data.CartMachineName : null,
        Description: data.Description ? data.Description : null,
        isActive: 1,
        leftSideWHLabel: data.side1 ? data.side1.toUpperCase() : null,
        rightSideWHLabel: data.side2 ? data.side2.toUpperCase() : null
    };
    COMMON.setModelCreatedObjectFieldValue(req.user, warehouseData);
    WarehouseMst.create(warehouseData, {
        fields: importInputFields
    }).then((WHDATA) => {
        ElasticData.push(warehouseData.Name);
        listDataIndex++;
        if (listDataIndex <= WarehouseDataList.length - 1) {
            checkValidation(saveWarehouse, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
        } else if (AllDataWithError.length > 0) {
            DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData);
        } else {
            module.exports.manageWarehouseElasticData(req, res, ElasticData).then(() =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, WHDATA, MESSAGE_CONSTANT.CREATED(warehouseModuleName))
            );
        }
    }).catch((err) => {
        console.trace();
        console.error(err);
        data.errorMessageList.push(DATA_CONSTANT.WarehouseErrors.ErrorInDataProcessing);
        data.OperationStatus = FailureOperationStatus;
        AllDataWithError.push(data);
        listDataIndex++;
        if (listDataIndex <= WarehouseDataList.length - 1) {
            checkValidation(saveWarehouse, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
        } else {
            DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData);
        }
    });
}

module.exports = {
    // Retrive list of warehouse
    // POST : /api/v1/warehousemst/retriveWarehouseList
    // @return list of warehouse
    retriveWarehouseList: (req, res) => {
        if (req.body) {
            const {
                sequelize
            } = req.app.locals.models;
            const searchColumns = _.chain(req.body.SearchColumns).groupBy('isExternalSearch').map((value, key) => ({
                searchList: value,
                isExternalSearch: key === 'true' ? true : false
            })).value();
            let filter = null;
            let strWhere = '';
            if (searchColumns.length > 0) {
                _.each(searchColumns, (columns) => {
                    let filterTypeWhereClause = '';
                    if (columns.searchList.length > 0) {
                        req.body.SearchColumns = columns.searchList;
                        filter = COMMON.UiGridFilterSearch(req);
                        if (columns.isExternalSearch) { // isExternalSearch means external filter else grid filter
                            filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);
                        } else {
                            filterTypeWhereClause = COMMON.UIGridWhereToQueryWhere(filter.where);
                        }

                        if (strWhere) {
                            strWhere += ' AND ';
                        }
                        strWhere += ` ( ${filterTypeWhereClause} ) `;
                    }
                });
            } else {
                filter = COMMON.UiGridFilterSearch(req);
            }

            return sequelize.query('CALL Sproc_RetrieveWarehouse (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    warehouse: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
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

    // Retrive detail of warehouse
    // GET : /api/v1/warehousemst
    // @param {Id} int
    // @return detail of warehouse
    retriveWarehouse: (req, res) => {
        const WarehouseMst = req.app.locals.models.WarehouseMst;
        if (req.params.id) {
            return WarehouseMst.findOne({
                where: {
                    isActive: true,
                    ID: req.params.id
                },
                model: WarehouseMst,
                attributes: ['ID', 'Name', 'Description', 'nickname', 'parentWHID', 'isPermanentWH', 'isActive', 'refEqpID', 'warehouseType'],
                required: false,
                include: [{
                    model: WarehouseMst,
                    as: 'parentWarehouseMst',
                    attributes: ['id', 'Name'],
                    required: false
                }]
            }).then((Warehouse) => {
                if (!Warehouse) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, Warehouse, null);
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

    // Delete Warehouse
    // DELETE : /api/v1/warehousemst
    // @param {Id} int
    // @return API response
    deleteWarehouse: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Warehouse.Name;
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
            }).then((warehouseDetail) => {
                if (warehouseDetail.length === 0) {
                    if (req.body.objIDs.id.length > 0) {
                        EnterpriseSearchController.deleteWarehouseDetailInElastic(req.body.objIDs.id.toString());
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, warehouseDetail, MESSAGE_CONSTANT.DELETED(warehouseModuleName));
                } else {
                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        transactionDetails: warehouseDetail,
                        IDs: req.body.objIDs.id
                    }, null);
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

    // Create warehouse
    // POST : /api/v1/warehousemst
    // @return new created warehouse
    createWarehouse: (req, res) => {
        const {
            WarehouseMst,
            BinMst,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.Name) {
                req.body.Name = req.body.Name.toUpperCase();
            }

            let where = {};
            if (req.body.Name) {
                where = {
                    deletedAt: null,
                    [Op.or]: [{
                        Name: req.body.Name
                    }]
                };
            }

            if (req.body.domain && req.body.uniqueCartID) {
                where[Op.or].push({
                    domain: req.body.domain,
                    uniqueCartID: req.body.uniqueCartID
                });
            }

            if (req.body.ID) {
                where.ID = {
                    [Op.ne]: req.body.ID
                };
            }

            return WarehouseMst.findOne({
                where: where
            }).then((warehouseDet) => {
                if (warehouseDet) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    const uniqueError = {
                        name: false,
                        domainCart: false
                    };
                    if (warehouseDet.Name === req.body.Name) {
                        uniqueError.name = true;
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'Warehouse');
                        // messageContent.message = MESSAGE_CONSTANT.WAREHOUSE.WAREHOUSE_UNIQUE;
                    } else if (warehouseDet.domain === req.body.domain || warehouseDet.cartMfr === req.body.cartMfr) {
                        uniqueError.domainCart = true;
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'Domain and UniqueCartID');
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: null,
                        data: uniqueError
                    });
                } else if (req.body.ID) {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);
                        WarehouseMst.update(req.body, {
                            where: {
                                ID: req.body.ID
                            },
                            fields: inputFields,
                            transaction: t
                        }).then((response) => {
                            if (response && response.length > 0) {
                                const updateBin = {
                                    isPermanentBin: req.body.allMovableBin ? 0 : 1,
                                    updatedBy: COMMON.getRequestUserID(req),
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                };
                                BinMst.update(updateBin, {
                                    where: {
                                        warehouseID: req.body.ID
                                    },
                                    fields: ['isPermanentBin', 'updatedBy', 'updateByRoleId'],
                                    transaction: t
                                }).then(() => {
                                    if (!req.body.allMovableBin && req.body.isActive) {
                                        const objBin = {
                                            isActive: true,
                                            updatedBy: COMMON.getRequestUserID(req),
                                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                        };
                                        return BinMst.update(objBin, {
                                            where: {
                                                WarehouseID: req.body.ID,
                                                isActive: false,
                                                isPermanentBin: true
                                            },
                                            fields: ['isActive', 'updatedBy', 'updateByRoleId'],
                                            transaction: t
                                        }).then(() => {
                                            t.commit().then(() => {
                                                // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                                req.params = {
                                                    ID: req.body.ID
                                                };
                                                // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                                // Need to change timeout code due to trasaction not get updated record
                                                setTimeout(() => {
                                                    EnterpriseSearchController.manageWarehouseDetailInElastic(req);
                                                }, 2000);
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(warehouseModuleName));
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
                                        t.commit().then(() => {
                                            // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                            req.params = {
                                                ID: req.body.ID
                                            };
                                            // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                            // Need to change timeout code due to trasaction not get updated record
                                            setTimeout(() => {
                                                EnterpriseSearchController.manageWarehouseDetailInElastic(req);
                                            }, 2000);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(warehouseModuleName));
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
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelCreatedByFieldValue(req);
                        WarehouseMst.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((warehouse) => {
                            if (req.body.binFrom && req.body.binTo) {
                                const binList = [];
                                let i;
                                const from = req.body.binFrom;
                                const to = req.body.binTo;
                                for (i = from; i <= to; i++) {
                                    const objData = {};
                                    if (req.body.binPrifix) {
                                        if (req.body.isBinPrifix) {
                                            objData.Name = COMMON.stringFormat('{0}+{1}{2}', req.body.Name, req.body.binPrifix, i);
                                        } else {
                                            objData.Name = COMMON.stringFormat('{0}+{1}{2}', req.body.Name, i, req.body.binPrifix);
                                        }
                                    } else {
                                        objData.Name = COMMON.stringFormat('{0}+{1}', req.body.Name, i);
                                    }

                                    objData.WarehouseID = warehouse.ID;
                                    objData.isActive = req.body.isActive;
                                    objData.isPermanentBin = !req.body.allMovableBin;
                                    objData.createdBy = req.user.id;
                                    objData.prefix = req.body.prefix;
                                    objData.Name = objData.Name.toUpperCase();
                                    binList.push(objData);
                                }
                                COMMON.setModelCreatedArrayFieldValue(req.user, binList);
                                return BinMst.bulkCreate(binList, {
                                    fields: ['Name', 'WarehouseID', 'isActive', 'isPermanentBin', 'createdBy', 'prefix', 'updatedBy', 'createByRoleId', ' updateByRoleId'],
                                    transaction: t
                                }).then(() => {
                                    t.commit().then(() => {
                                        // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                        req.params = {
                                            ID: warehouse.ID
                                        };
                                        // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                        // Need to change timeout code due to trasaction not get updated record
                                        setTimeout(() => {
                                            EnterpriseSearchController.manageWarehouseDetailInElastic(req);
                                        }, 2000);

                                        InoAutoIntegrationAPI.sendRequestToGetMultipleCartDetail({
                                            Towers: [req.body.uniqueCartID]
                                        });
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, warehouse, MESSAGE_CONSTANT.CREATED(warehouseModuleName));
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
                                t.commit().then(() => {
                                    // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                    req.params = {
                                        ID: warehouse.ID
                                    };
                                    // Add Warehouse detail into Elastic Search Engine for Enterprise Search
                                    // Need to change timeout code due to trasaction not get updated record
                                    setTimeout(() => {
                                        EnterpriseSearchController.manageWarehouseDetailInElastic(req);
                                    }, 2000);
                                    InoAutoIntegrationAPI.sendRequestToGetMultipleCartDetail({
                                        Towers: [req.body.uniqueCartID]
                                    });
                                    // Transferstockcontroller.sendRequestToAssignDepartment({ TowerID: req.body.uniqueCartID});
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, warehouse, MESSAGE_CONSTANT.CREATED(warehouseModuleName));
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrive history of warehouse
    // POST : /api/v1/warehousemst/getHistory
    // @return history of warehouse
    getHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveWarehouse_History (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWarehouseID)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pWarehouseID: req.body.warehouseID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                warehouse: _.values(response[1]),
                Count: response[0][0]['TotalRecord'],
                currentWHDet: response[2][0]
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

    // Check Unique warehouse-bin
    // POST : /api/v1/warehouse/checkNameUnique
    checkNameUnique: (req, res) => {
        const {
            BinMst,
            WarehouseMst
        } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            const inCondtion = [req.body.name, req.body.leftside, req.body.rightside];

            const whereBin = {
                [Op.or]: {
                    Name: {
                        [Op.in]: inCondtion
                    }
                },
                deletedAt: null
            };

            const whereWarehouse = {
                [Op.or]: {
                    Name: {
                        [Op.in]: inCondtion
                    },
                    leftSideWHLabel: {
                        [Op.in]: inCondtion
                    },
                    rightSideWHLabel: {
                        [Op.in]: inCondtion
                    }
                },
                deletedAt: null
            };

            if (req.body.type === 'Bins' && req.body.id) {
                whereBin.id = {
                    [Op.ne]: req.body.id
                };
            }

            promises.push(BinMst.findOne({
                where: whereBin,
                model: BinMst,
                attributes: ['id', 'Name', 'WarehouseID']
            }));

            if (req.body.type === 'Warehouse' && req.body.id) {
                whereWarehouse.id = {
                    [Op.ne]: req.body.id
                };
            }

            promises.push(WarehouseMst.findOne({
                where: whereWarehouse,
                model: WarehouseMst,
                attributes: ['id', 'Name', 'leftSideWHLabel', 'rightSideWHLabel']
            }));

            return Promise.all(promises).then((resp) => {
                let binWarehouseData = null;
                if (resp && (resp[0] || resp[1])) {
                    binWarehouseData = resp[0] ? resp[0] : resp[1];
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binWarehouseData, null);
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

    // Generat warehouse
    // POST : /api/v1/warehouse/generateWarehouse
    // @return new created warehouse
    generateWarehouse: (req, res) => {
        const {
            WarehouseMst,
            BinMst,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.whPrifix) {
                req.body.whPrifix = req.body.whPrifix.toUpperCase();
            }

            let WHList = [];
            const whName = [];
            if (!req.body.isDuplicate) {
                let i;
                const whFrom = req.body.whFrom;
                const whTo = req.body.whTo;
                for (i = whFrom; i <= whTo; i++) {
                    const objData = {};
                    objData.Name = COMMON.stringFormat('{0}{1}', req.body.whPrifix, i);
                    objData.nickname = req.body.nickname;
                    objData.parentWHID = req.body.parentWHID;
                    objData.isActive = req.body.isActive;
                    objData.isPermanentWH = req.body.isPermanentWH;
                    objData.allMovableBin = req.body.allMovableBin;
                    objData.warehouseType = req.body.warehouseType;
                    objData.createdBy = req.user.id;
                    whName.push(objData.Name.toUpperCase());
                    WHList.push(objData);
                }
            } else {
                WHList = req.body.unique_Warehouse_List;
                _.each(WHList, (data) => {
                    whName.push(data.Name);
                });
            }

            const promises = [];
            return sequelize.transaction().then((t) => {
                promises.push(BinMst.findAll({
                    where: {
                        Name: {
                            [Op.in]: whName
                        }
                    },
                    model: BinMst,
                    attributes: ['id', 'Name'],
                    paranoid: true,
                    transaction: t
                }));

                promises.push(WarehouseMst.findAll({
                    where: {
                        Name: {
                            [Op.in]: whName
                        }
                    },
                    model: WarehouseMst,
                    attributes: ['id', 'Name'],
                    paranoid: true,
                    transaction: t
                }));

                Promise.all(promises).then((resp) => {
                    t.commit().then(() => {
                        if (resp && resp.length > 0 && (resp[0].length > 0 || resp[1].length > 0)) {
                            const DuplicateList = resp[0];
                            const UniqueList = [];
                            _.each(resp[1], (data) => {
                                DuplicateList.push(data);
                            });
                            _.filter(WHList, (data) => {
                                const findWH = _.find(DuplicateList, item => item.Name === data.Name);
                                if (!findWH) {
                                    UniqueList.push(data);
                                }
                            });
                            resp = [];
                            resp.push(DuplicateList);
                            resp.push(UniqueList);
                            return resHandler.successRes(res, 200, STATE.SUCCESS, resp);
                        } else {
                            COMMON.setModelCreatedArrayFieldValue(req.user, WHList);
                            return WarehouseMst.bulkCreate(WHList, {
                                // individualHooks: true,
                                // returning: true,
                                fields: ['ID', 'Name', 'nickname', 'parentWHID', 'isActive', 'isPermanentWH', 'allMovableBin', 'createdBy', 'refEqpID', 'warehouseType', 'isCartOnline', 'updatedBy', 'createByRoleId', 'updateByRoleId']
                            }).then((warehouse) => {
                                if (warehouse && warehouse.length > 0) {
                                    const binList = [];
                                    let j;
                                    const binFrom = req.body.binFrom;
                                    const binTo = req.body.binTo;
                                    _.each(warehouse, (data) => {
                                        for (j = binFrom; j <= binTo; j++) {
                                            const objData = {};
                                            objData.Name = COMMON.stringFormat('{0}+{1}{2}', data.Name, req.body.binPrifix, j).toUpperCase();
                                            objData.WarehouseID = data.ID;
                                            objData.isActive = data.isActive;
                                            objData.isPermanentBin = !data.allMovableBin;
                                            objData.createdBy = req.user.id;
                                            binList.push(objData);
                                        }
                                    });
                                    COMMON.setModelCreatedArrayFieldValue(req.user, binList);
                                    return BinMst.bulkCreate(binList, {
                                        fields: ['Name', 'WarehouseID', 'isActive', 'isPermanentBin', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId']
                                    }).then(() =>
                                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(warehouseModuleName))
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
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName),
                                        err: null,
                                        data: null
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
                        }
                    });
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

    // Check Unique Cart Id
    // GET : /api/v1/warehouse/checkCartIdUnique
    checkCartIdUnique: (req, res) => {
        const {
            WarehouseMst
        } = req.app.locals.models;
        if (req.params) {
            return WarehouseMst.findOne({
                where: {
                    uniqueCartID: req.params.cartId,
                    id: {
                        [Op.ne]: req.params.id
                    }
                },
                model: WarehouseMst,
                attributes: ['id', 'Name'],
                paranoid: true
            }).then(resp =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null)
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName),
                err: null,
                data: null
            });
        }
    },

    // Check Active Bin
    // GET : /api/v1/warehouse/checkActiveBin
    checkActiveBin: (req, res) => {
        const {
            BinMst
        } = req.app.locals.models;
        if (req.params) {
            return BinMst.findOne({
                where: {
                    WarehouseID: req.params.id,
                    isActive: true
                },
                model: BinMst,
                attributes: ['id', 'Name']
            }).then(resp =>
                resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null)
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName),
                err: null,
                data: null
            });
        }
    },

    // Check unique combination of (Domain + Cart Manufacturer)
    // POST : /api/v1/warehouse/checkNameUnique
    checkCartWiseUniqueDomain: (req, res) => {
        const {
            WarehouseMst
        } = req.app.locals.models;
        if (req.body) {
            const whereClause = {
                domain: req.body.domain,
                uniqueCartID: req.body.uniqueCartID,
                deletedAt: null
            };

            if (req.body.id) {
                whereClause.id = {
                    [Op.ne]: req.body.id
                };
            }

            return WarehouseMst.findOne({
                where: whereClause,
                attributes: ['id', 'Name'],
                paranoid: false
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName),
                err: null,
                data: null
            });
        }
    },

    // Retrive detail of warehouse by name
    // POST : /api/v1/warehouse/getWarehouseDetailByName
    // @param {name} string
    // @return detail of warehouse by name
    getWarehouseDetailByName: (req, res) => {
        const {
            WarehouseMst
        } = req.app.locals.models;
        WarehouseMst.findOne({
            where: {
                isActive: true,
                Name: req.body.name,
                deletedAt: null
            },
            model: WarehouseMst,
            as: 'warehousemst',
            attributes: ['id', 'Name', 'parentWHID', 'isPermanentWH', 'warehouseType', 'allMovableBin'],
            required: false,
            include: [{
                model: WarehouseMst,
                as: 'parentWarehouseMst',
                attributes: ['id', 'Name', 'parentWHType'],
                required: false
            }]
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)
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


    // Send Request To Check Cart Status
    // POST : /api/v1/warehouse/sendRequestToCheckCartStatus
    sendRequestToCheckCartStatus: (req, res) => InoAutoIntegrationAPI.sendRequestToCheckSingleCartStatus(req.body).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }

        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.error);
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
    }),

    // Send Request To Check Status of all cart
    // POST : /api/v1/warehouse/sendRequestToCheckStatusOfAllCarts
    sendRequestToCheckStatusOfAllCarts: (req, res) => {
        var exchange = global.inoAutoexchange;
        if (exchange) {
            const {
                WarehouseMst
            } = req.app.locals.models;

            return WarehouseMst.findAll({
                where: {
                    warehouseType: DATA_CONSTANT.warehouseType.SmartCart.key,
                    deletedAt: null
                },
                attributes: ['id', 'Name', 'uniqueCartID']
            }).then((response) => {
                if (response && response.length > 0) {
                    const towers = _.map(response, 'uniqueCartID');
                    req.body.Towers = towers;

                    // Update those cart which is online and not comes in response
                    return WarehouseMst.update({
                        isCartOnline: false,
                        updatedBy: COMMON.getRequestUserID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                        updatedAt: COMMON.getCurrentUTC()
                    }, {
                        where: {
                            warehouseType: DATA_CONSTANT.warehouseType.SmartCart.key,
                            isDeleted: 0
                        },
                        fields: ['isCartOnline', 'updatedAt', 'updateByRoleId', 'updatedBy']
                    }).then(() =>
                        InoAutoIntegrationAPI.sendRequestToGetMultipleCartDetail(req.body).then((inoAutoResponse) => {
                            if (inoAutoResponse.state === STATE.SUCCESS) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, inoAutoResponse.error);
                            // return resHandler.errorRes(res, 200, STATE.FAILED, null, response.error);
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
                        }));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
            // return {
            //     state: STATE.FAILED,
            //     error: MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected
            // };
            // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
            //    messageContent: MESSAGE_CONSTANT.NOT_FOUND(MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected),
            //    err: null,
            //    data: null
            // });

            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, new NotFound(MESSAGE_CONSTANT.Ino_Auto_API.Server_Not_Connected));
        }
    },

    // Send Request To cancel cart Request
    // POST : /api/v1/warehouse/sendRequestToCheckInCart
    sendRequestToCancelCartRequest: (req, res) => InoAutoIntegrationAPI.sendRequestToCancelCartRequest(req.body).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }
        return resHandler.errorRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
            STATE.FAILED,
            response.error
        );
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
    }),

    // Send Request To cancel cart Request
    // POST : /api/v1/warehouse/sendRequestToCheckInCart
    sendRequestToCheckOutCart: (req, res) => InoAutoIntegrationAPI.sendRequestToCheckOutCart(req.body).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.error);
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
            err: err,
            data: null
        });
    }),

    // Send Request To Checkin Cart
    // POST : /api/v1/warehouse/sendRequestToCheckInCart
    sendRequestToCheckInCart: (req, res) => InoAutoIntegrationAPI.sendRequestToCheckInCart(req.body, req.user.id).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }
        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        //    messageContent: response.error,
        //    err: null,
        //    data: null
        // });
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.error);
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
        //    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
        //    err: err,
        //    data: null
        // });
    }),

    // Send Request To Search Part by UMID
    // POST : /api/v1/warehouse/sendRequestToSearchPartByUMID
    sendRequestToSearchPartByUMID: (req, res) => InoAutoIntegrationAPI.sendRequestToSearchPartByUMID(req.body, req.user.id).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }
        return resHandler.errorRes(
            res,
            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
            STATE.FAILED,
            response.error
        );
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
    }),

    // Send Request To Search Part by CartID
    // POST : /api/v1/warehouse/sendRequestToSearchPartByCartID
    sendRequestToSearchPartByCartID: (req, res) => InoAutoIntegrationAPI.sendRequestToSearchPartByCartID(req.body, req.user.id).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }
        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
        //    messageContent: response.error,
        //    err: null,
        //    data: null
        // });
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.error);
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
        // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
        //    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
        //    err: err,
        //    data: null
        // });
    }),

    // Send Request To Clear Unauthorize Request
    // POST : /api/v1/warehouse/sendRequestToClearUnauthorizeRequest
    sendRequestToClearUnauthorizeRequest: (req, res) => InoAutoIntegrationAPI.sendRequestToClearUnauthorize(req.body, req.user.id).then((response) => {
        if (response.state === STATE.SUCCESS) {
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, null, null);
        }

        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, response.error);
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
    }),

    // test api for send checkin request to inovaxe [101, 108, 110]
    sendCheckInRequestToInovex: (req, res) => {
        if (req.body) {
            const exchange = global.inoAutoexchange; // global.inoAutochannel;

            req.body.TransactionID = req.body.TransactionID || COMMON.getGUID();
            req.body.TimeStamp = COMMON.getCurrentUTC();
            if (exchange) {
                const directive = COMMON.stringFormat('{0}.{1}', 'DESKTOP-6R9TNT0', req.body.MessageType);
                exchange.publish(directive, Buffer.from(JSON.stringify(req.body), null, null));
            }
            return resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, req.body, null);
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrive umid list from cart id
    // GET : /api/v1/warehousemst/getUMIDListFromCartID
    // @return history of warehouse
    getUMIDListFromCartID: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.params.pwareHouseID) {
            return sequelize.query('CALL Sproc_GetUMIDListFromCartID (:pwareHouseID)', {
                replacements: {
                    pwareHouseID: req.params.pwareHouseID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    umidList: _.values(response[0])
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
    downloadWarehouseTemplate: (req, res) => {
        if (req.params.module) {
            const categoryTypeName = `${req.params.module}.csv`;
            const path = DATA_CONSTANT.WAREHOUSE_TEMPLATE.DOWNLOAD_PATH + categoryTypeName;
            fs.chmodSync(path, '0666');
            fs.readFile(path, (fileErr) => {
                if (fileErr) {
                    if (fileErr.code === COMMON.FileErrorMessage.NotFound) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_NotFound,
                            err: null,
                            data: null
                        });
                    } else if (fileErr.code === COMMON.FileErrorMessage.AccessDenied) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_AccessDenied,
                            err: null,
                            data: null
                        });
                    } else {
                        console.trace();
                        console.error(fileErr);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: fileErr,
                            data: null
                        });
                    }
                } else {
                    const file = path;
                    const {
                        WarehouseMst
                    } = req.app.locals.models;

                    return WarehouseMst.findAll({
                        where: {
                            deletedAt: null,
                            systemGenerated: {
                                [Op.ne]: 1
                            }
                        }
                    }).then((response) => {
                        if (response && response.length > 0) {
                            const MainMaterialWarehouse = DATA_CONSTANT.warehouseDepartmentType[0].value;
                            const MainProductionWarehouse = DATA_CONSTANT.warehouseDepartmentType[1].value;
                            const PWHID = DATA_CONSTANT.warehouseDepartmentType[0].id;
                            const Equipment = DATA_CONSTANT.warehouseType.Equipment.key;
                            const PrintAllData = _.map(response, (item) => {
                                const parentWarehouse = item.dataValues.parentWHID === PWHID ? MainMaterialWarehouse : MainProductionWarehouse;
                                const objWarehouse = {
                                    WarehouseType: COMMON.getWarehouseType(item.dataValues.warehouseType),
                                    ParentWarehouse: parentWarehouse,
                                    CartName: item.dataValues.warehouseType === Equipment ? '' : item.dataValues.Name,
                                    Equipment: item.dataValues.warehouseType === Equipment ? item.dataValues.Name : '',
                                    PermanentWarehouse: item.dataValues.isPermanentWH === 1 ? 'Yes' : 'No',
                                    AllBinMovable: item.dataValues.allMovableBin === 1 ? 'Yes' : 'No',
                                    Nickname: item.dataValues.nickname,
                                    UniqueCartID: item.dataValues.uniqueCartID,
                                    Domain: item.dataValues.domain,
                                    CartManufacturer: item.dataValues.cartMfr,
                                    CartMachineName: item.dataValues.cartMachineName,
                                    Description: item.dataValues.Description
                                };
                                return objWarehouse;
                            });

                            const csvWriter = createCsvWriter({
                                path: file,
                                header: [
                                    { id: 'WarehouseType', title: 'WarehouseType' },
                                    { id: 'ParentWarehouse', title: 'ParentWarehouse' },
                                    { id: 'CartName', title: 'CartName' },
                                    { id: 'Equipment', title: 'Equipment' },
                                    { id: 'PermanentWarehouse', title: 'PermanentWarehouse' },
                                    { id: 'AllBinMovable', title: 'AllBinMovable' },
                                    { id: 'Nickname', title: 'Nickname' },
                                    { id: 'UniqueCartID', title: 'UniqueCartID' },
                                    { id: 'Domain', title: 'Domain' },
                                    { id: 'CartManufacturer', title: 'CartManufacturer' },
                                    { id: 'CartMachineName', title: 'CartMachineName' },
                                    { id: 'Description', title: 'Description' }
                                ]
                            });
                            csvWriter
                                .writeRecords(PrintAllData)
                                .then(() => {
                                    const mimetype = mime.lookup(`${file}.text/csv`);
                                    res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
                                    res.setHeader('Content-type', mimetype);
                                    const filestream = fs.createReadStream(file);
                                    filestream.pipe(res);
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
                            res.setheader('content-disposition', `attachment; filename=${categoryTypeName}`);
                            res.setheader('content-type', 'application/vnd.ms-excel');
                            const filestream = fs.createreadstream(file);
                            filestream.pipe(res);
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
                }
            });
        } else {
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    uploadWarehouseDocuments: (req, res) => {
        const dir = './uploads/genericfiles/generic_category/';
        if (typeof (req.files) === 'object' && Array.isArray(req.files.documents)) {
            const file = req.files.documents[0];
            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
            const fileName = `${uuidv1()}.${ext}`;
            const path = dir + fileName;
            fsextra.move(file.path, path, (err) => {
                if (err) {
                    console.error(err);
                }
                module.exports.importWarehouseDetail(req, res, path);
            });
        }
        // const storage = multer.diskStorage({
        //     destination: (destReq, file, cb) => {
        //         const dir = "./uploads/genericfiles/generic_category/";
        //         mkdirp(dir, (err) => cb(err, dir));
        //     },
        //     filename: (fileReq, file, cb) => {
        //         const ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname) : null;
        //         let fname = file.originalname;
        //         //categoryTypeName = fname.substr(0, fname.lastIndexOf('.')) || fname;
        //         cb(null, `${uuidv1()}.${ext}`);
        //     },
        // });
        // const upload = multer({
        //     storage,
        // }).any();


        // upload(req, res, (err) => {
        //     module.exports.importWarehouseDetail(req,res, path);
        // });
    },

    importWarehouseDetail: (req, res, filepath) => {
        const categoryTypeName = req.body.categoryType;
        const WarehouseDataList = [];
        const AllDataWithError = [];
        const ElasticData = [];
        let index = 0;
        let onErrorIndex = 0;
        let isAnyInvalidData = false;
        const path = filepath;
        const stream = fs.createReadStream(path);
        const SmartCart = DATA_CONSTANT.warehouseType.SmartCart.value.toUpperCase();
        const EquipmentCon = DATA_CONSTANT.warehouseType.Equipment.value.toUpperCase();
        const ShelvingCart = DATA_CONSTANT.warehouseType.ShelvingCart.value.toUpperCase();
        const MainMaterialWarehouse = DATA_CONSTANT.warehouseDepartmentType[0].value.toUpperCase();
        const MainProductionWarehouse = DATA_CONSTANT.warehouseDepartmentType[1].value.toUpperCase();
        const InoAuto = DATA_CONSTANT.WarehouseCartManufacturer[0].id.toUpperCase();
        const Cluso = DATA_CONSTANT.WarehouseCartManufacturer[1].id.toUpperCase();
        const Yes = DATA_CONSTANT.WarehouseImportConfirmations.Yes;
        const No = DATA_CONSTANT.WarehouseImportConfirmations.No;
        const warehouseError = DATA_CONSTANT.WarehouseErrors;
        const CartName = warehouseError.CartName;
        const ParentWarehouse = warehouseError.ParentWarehouse;
        const CartManufacturer = warehouseError.CartManufacturer;
        const UniqueCartId = warehouseError.UniqueCartId;
        const Domain = warehouseError.Domain;
        const WarehouseType = warehouseError.WarehouseType;
        const FailureOperationStatus = DATA_CONSTANT.WarehouseErrors.FailureOperationStatus;
        fs.unlinkSync(path);
        csv.fromStream(stream, {
            headers: true,
            ignoreEmpty: true
        }).validate((data) => {
            if (data) {
                let isValid = true;
                if (data.WarehouseType.toUpperCase() === SmartCart) {
                    // data.WarehouseType=SmartCart;
                    data.warehouseStore = DATA_CONSTANT.warehouseType.SmartCart.key;
                    data.side1 = `${data.CartName}-L`;
                    data.side2 = `${data.CartName}-R`;
                }
                if (data.WarehouseType.toUpperCase() === ShelvingCart) {
                    data.warehouseStore = DATA_CONSTANT.warehouseType.ShelvingCart.key;
                    //   data.WarehouseType=ShelvingCart;
                    if (data.Nickname && !data.CartName) {
                        data.CartName = data.Nickname;
                    }
                }
                if (data.WarehouseType.toUpperCase() === EquipmentCon) {
                    data.warehouseStore = DATA_CONSTANT.warehouseType.Equipment.key;
                    //   data.WarehouseType=EquipmentCon;
                    data.CartName = data.Equipment;
                }
                data.index = index++;
                data.ErrorLog = '';
                data.OperationStatus = '';
                data.errorMessageList = [];
                if (!data.ParentWarehouse) {
                    data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, warehouseError.ParentWarehouse));
                    // return false;
                    isValid = false;
                    data.OperationStatus = FailureOperationStatus;
                } else if (data.ParentWarehouse.toUpperCase() !== MainMaterialWarehouse && data.ParentWarehouse.toUpperCase() !== MainProductionWarehouse) {
                    data.errorMessageList.push(COMMON.stringFormat(warehouseError.Invalid, ParentWarehouse));
                    // return false;
                    isValid = false;
                    data.OperationStatus = FailureOperationStatus;
                }
                if (data.WarehouseType.toUpperCase() !== SmartCart && data.WarehouseType.toUpperCase() !== ShelvingCart && data.WarehouseType.toUpperCase() !== EquipmentCon) {
                    data.errorMessageList.push(COMMON.stringFormat(warehouseError.Invalid, WarehouseType));
                    // return false;
                    isValid = false;
                }
                if (data.WarehouseType.toUpperCase() === SmartCart && data.CartManufacturer.toUpperCase() !== InoAuto && data.CartManufacturer.toUpperCase() !== Cluso &&
                    (!data.CartName || data.CartName.length < 0 || data.CartName.length > 50 ||
                        !data.UniqueCartID || data.UniqueCartID.length < 0 || data.UniqueCartID.length > 50 ||
                        !data.Domain || data.Domain.length < 0 || data.Domain.length > 50 ||
                        !data.CartManufacturer || data.PermanentWarehouse.toUpperCase() === Yes || data.AllBinMovable.toUpperCase() === Yes)) {
                    if (!data.CartManufacturer) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, CartManufacturer));
                    }
                    if (data.CartManufacturer.toUpperCase() !== InoAuto && data.CartManufacturer.toUpperCase() !== Cluso) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Invalid, CartManufacturer));
                    }
                    if (data.CartName.length < 0) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, CartName));
                    }
                    if (data.CartName.length > 50) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.InvalidLength, CartName));
                    }
                    if (!data.UniqueCartID.length) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, UniqueCartId));
                    }
                    if (data.UniqueCartID.length < 0) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, UniqueCartId));
                    }
                    if (data.UniqueCartID.length > 50) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.InvalidLength, UniqueCartId));
                    }
                    if (!data.Domain.length) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, Domain));
                    }
                    if (data.Domain.length < 0) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, Domain));
                    }
                    if (data.Domain.length > 50) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.InvalidLength, Domain));
                    }
                    if (data.PermanentWarehouse.toUpperCase() === Yes) {
                        data.errorMessageList.push(warehouseError.InvalidPermanentWarehouse);
                    }
                    if (data.AllBinMovable.toUpperCase() === Yes) {
                        data.errorMessageList.push(warehouseError.InvalidAllBinsMovable);
                    }
                    data.OperationStatus = FailureOperationStatus;
                    // return false;
                    isValid = false;
                } else if (data.WarehouseType.toUpperCase() === ShelvingCart &&
                    (!data.CartName || data.CartName.length < 0 || data.CartName.length > 50)) {
                    if (!data.CartName) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, warehouseError.CartName));
                    }
                    if (data.CartName.length < 0) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, CartName));
                    }
                    if (data.CartName.length > 50) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.InvalidLength, CartName));
                    }
                    data.OperationStatus = FailureOperationStatus;
                    // return false;
                    isValid = false;
                } else if (data.WarehouseType.toUpperCase() === EquipmentCon &&
                    (!data.Equipment || data.Equipment.length < 0 || data.PermanentWarehouse.toUpperCase() === No || data.AllBinMovable.toUpperCase() === Yes)) {
                    if (!data.Equipment) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, DATA_CONSTANT.warehouseType.Equipment.value));
                    }
                    if (data.Equipment.length < 0) {
                        data.errorMessageList.push(COMMON.stringFormat(warehouseError.Required, DATA_CONSTANT.warehouseType.Equipment.value));
                    }
                    if (data.PermanentWarehouse.toUpperCase() === No) {
                        data.errorMessageList.push(warehouseError.InvalidPermanentWarehouseEquipment);
                    }
                    if (data.AllBinMovable.toUpperCase() === Yes) {
                        data.errorMessageList.push(warehouseError.InvalidBinEquipment);
                    }
                    data.OperationStatus = FailureOperationStatus;
                    // return false;
                    isValid = false;
                }
                //  else {
                //     return true;
                // }
                return isValid;
            }
            return false;
        })
            .on('data-invalid', (data) => {
                if (data) {
                    isAnyInvalidData = true;
                    AllDataWithError.push(data);
                }
            })
            .on('data', (data) => {
                if (data) {
                    WarehouseDataList.push(data);
                }
            })
            .on('end', () => {
                if (WarehouseDataList.length > 0) {
                    const listDataIndex = 0;
                    checkValidation(saveWarehouse, WarehouseDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res, ElasticData);
                } else if (isAnyInvalidData && AllDataWithError.length > 0) {
                    /* AllDataWithError - data list of original data with error that need to be downloaded in case of error  */
                    DownloadCSVFile(req, path, categoryTypeName, res, AllDataWithError, ElasticData);
                } else {
                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(warehouseModuleName),
                        err: null,
                        data: null
                    });
                }
            })
            // eslint-disable-next-line consistent-return
            .on('error', (Error) => {
                onErrorIndex++;
                /* data in loop called error part everytime if error so to display error only once put condition */
                if (onErrorIndex === 1) {
                    stream.destroy();
                    console.trace();
                    console.error(Error);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: Error,
                        data: null
                    });
                }
            });
    },
    // Retrieve list of inovaxe notification log
    // POST : /api/v1/retriveInovaxeTransactionLogList
    // @param {Id} int
    // @return list of inovaxe log
    retriveInovaxeTransactionLogList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let filter;
        let strWhere = '';
        if (req.body.SearchText) {
            const searchFilterList = req.body.SearchColumns;
            const filterTypeListWithData = _.partition(searchFilterList, o => o.isExternalSearch);
            _.each(filterTypeListWithData, (listitem, index) => {
                let filterTypeWhereClause = '';
                if (listitem.length > 0) {
                    filter = null;
                    req.body.search = JSON.stringify(listitem);
                    filter = COMMON.UiGridFilterSearch(req);
                    listitem[0].isExternalSearch = true;
                    filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);

                    if (index > 0 && strWhere && filterTypeWhereClause) {
                        filterTypeWhereClause = `${' AND  ( '}${filterTypeWhereClause} ) `;
                    } else {
                        filterTypeWhereClause = ` ( ${filterTypeWhereClause} ) `;
                    }
                    strWhere += filterTypeWhereClause;
                }
            });
        } else {
            filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        }

        sequelize.query('CALL Sproc_RetrieveInovaxeTransactionLogList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                InovaxeTransaction: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
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

    // Retrieve list of inovaxe notification log
    // POST : /api/v1/retriveInovaxeUnAuthorizeTransactionLogList
    // @param {Id} int
    // @return list of inovaxe log
    retriveInovaxeUnAuthorizeTransactionLogList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let filter;
        let strWhere = '';
        if (req.body.SearchText) {
            const searchFilterList = req.body.SearchColumns;
            const filterTypeListWithData = _.partition(searchFilterList, o => o.isExternalSearch);

            _.each(filterTypeListWithData, (listitem, index) => {
                let filterTypeWhereClause = '';
                if (listitem.length > 0) {
                    filter = null;
                    req.body.search = JSON.stringify(listitem);
                    filter = COMMON.UiGridFilterSearch(req);
                    listitem[0].isExternalSearch = true;
                    filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);

                    if (index > 0 && strWhere && filterTypeWhereClause) {
                        filterTypeWhereClause = `${' AND  ( '}${filterTypeWhereClause} ) `;
                    } else {
                        filterTypeWhereClause = ` ( ${filterTypeWhereClause} ) `;
                    }
                    strWhere += filterTypeWhereClause;
                }
            });
        } else {
            filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        }

        sequelize.query('CALL Sproc_RetrieveInovaxeUnAuthorizeTransactionLogList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                InovaxeTransaction: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
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

    // Retrive list of inovaxe notification server  log
    // GET : /api/v1/retriveInovaxeTransactionServerLog
    // @return list of inovaxe Server log
    retriveInovaxeTransactionServerLog: (req, res) => {
        const {
            Settings
        } = req.app.locals.models;
        var mongodb = global.mongodb;
        const filter = COMMON.UIGridMongoDBFilterSearch(req);
        const order = filter.order[0];
        const option = {
            skip: filter.offset,
            sort: {},
            limit: filter.limit
        };
        if (order) {
            option.sort[order[0]] = order[1] === 'asc' ? 1 : -1;
        }
        const promises = [
            mongodb.collection('InovaxeServerStatus').find(filter.where, option).toArray(),
            mongodb.collection('InovaxeServerStatus').find(filter.where).count()
        ];

        if (filter.where.MessageType === DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Server_Heartbeat) {
            promises.push(Settings.findAll({
                where: {
                    key: [DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerHeartbeatStatus, DATA_CONSTANT.INO_AUTO.DATA_KEYS.InoAutoServerName]
                },
                fields: ['id', 'key', 'values']
            }));
        }

        Promise.all(promises).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                InovaxeTransaction: response[0],
                Count: response[1],
                InoAutoServerHeartbeatStatus: filter.where.MessageType === DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Server_Heartbeat ? response[2][0] : null,
                InoAutoServerName: filter.where.MessageType === DATA_CONSTANT.INO_AUTO.MESSAGE_TYPE.Server_Heartbeat ? response[2][1] : null
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
    // send request to update carts
    // POST : /api/v1/SendRequestToupdateCartStatus
    // Below comment by Champak
    // eslint-disable-next-line no-unused-vars
    SendRequestToupdateCartStatus: (req, res) => {
        const {
            WarehouseMst
        } = req.app.locals.models;
        WarehouseMst.findAll({
            where: {
                warehouseType: DATA_CONSTANT.warehouseType.SmartCart.key,
                deletedAt: null
            },
            attributes: ['id', 'Name', 'uniqueCartID']
        }).then((response) => {
            _.each(response, (item) => {
                InoAutoIntegrationAPI.sendRequestToCheckSingleCartStatus({
                    TransactionID: COMMON.getGUID(),
                    TowerID: item.uniqueCartID
                });
            });
        });
    },
    // get bunslot count side wise
    // POST : /api/v1/getSidewiseBinSlotDetails

    getSidewiseBinSlotDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_RetriveBinSlotCount (:pwarehouseID,:pside)', {
            replacements: {
                pwarehouseID: req.params.warehouseID,
                pside: req.params.side
            }
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                slotData: response
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
    // remove unauthorize request
    // POST: /api/v1/removeUnauthorizeRequest
    removeUnauthorizeRequest: (req, res) => {
        const {
            SmartCartTransaction,
            sequelize
        } = req.app.locals.models;
        const objunauthoruizeRemove = {
            isDeleted: true,
            deletedAt: COMMON.getCurrentUTC(),
            deletedBy: req.user.id,
            deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
        };
        if (req.body.objIDs) {
            return sequelize.transaction().then((t) => {
                SmartCartTransaction.update(objunauthoruizeRemove, {
                    where: {
                        id: {
                            [Op.in]: req.body.objIDs.id
                        }
                    },
                    fields: ['isDeleted', 'deletedAt', 'deletedBy', 'deleteByRoleId'],
                    transaction: t
                }).then((unauthorizeNotification) => {
                    t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unauthorizeNotification, MESSAGE_CONSTANT.DELETED(DATA_CONSTANT.UNAUTHORIZE_NOTIFICATION.Name)));
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
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // update smart cart for pick user diffrent
    // POST : /api/v1/warehouse/setPickUserDeatil
    setPickUserDeatil: (req, res) => {
        const {
            SmartCartTransaction
        } = req.app.locals.models;
        if (req.body) {
            return SmartCartTransaction.update({
                pickColorUserID: null
            }, {
                where: {
                    pickColorUserID: req.body.userID,
                    isDeleted: false
                },
                fields: ['pickColorUserID']
            }).then(() =>
                SmartCartTransaction.findOne({
                    where: {
                        id: req.body.id
                    },
                    attributes: ['id'],
                    paranoid: false
                }).then((response) => {
                    if (response) {
                        const objUpdate = {
                            pickColorUserID: req.body.userID
                        };
                        return SmartCartTransaction.update(objUpdate, {
                            where: {
                                id: response.id,
                                isDeleted: false
                            },
                            fields: ['pickColorUserID']
                        }).then(() => {
                            // eslint-disable-next-line global-require
                            const SocketIOConnection = require('../../socket_io_connection/socket_io_connection');
                            var sockets = SocketIOConnection.findReceiverSocket();
                            sockets.forEach((socket) => {
                                socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateUsertoMapandPick, {
                                    response: req.body
                                });
                            });

                            return resHandler.successRes(res,
                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                STATE.SUCCESS, null, req.body.userID ? DATA_CONSTANT.INO_AUTO.MESSAGE.ColorPick : null);
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
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_NotFound,
                            err: null,
                            data: null
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
                })
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

    // update smart cart for pick user diffrent
    // POST : /api/v1/warehouse/setPickUserDeatil
    setDropUserDeatil: (req, res) => {
        const {
            SmartCartTransaction
        } = req.app.locals.models;
        if (req.body) {
            return SmartCartTransaction.update({
                pickColorUserID: null
            }, {
                where: {
                    pickColorUserID: req.body.userID,
                    isDeleted: false
                },
                fields: ['pickColorUserID']
            }).then(() => {
                // eslint-disable-next-line global-require
                const SocketIOConnection = require('../../socket_io_connection/socket_io_connection');
                var sockets = SocketIOConnection.findReceiverSocket();
                sockets.forEach((socket) => {
                    socket.emit(DATA_CONSTANT.Socket_IO_Events.InoAuto.updateUsertoMapandPick, {
                        response: req.body
                    });
                });

                return resHandler.successRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                    STATE.SUCCESS, null, DATA_CONSTANT.INO_AUTO.MESSAGE.ColorDrop);
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

    // update smart cart empty for user while destroy page
    // POST : /api/v1/warehouse/removePickUserDeatil
    // Below comment added by CC
    // eslint-disable-next-line no-unused-vars
    removePickUserDeatil: (req, res) => {
        const {
            SmartCartTransaction
        } = req.app.locals.models;
        if (req.body) {
            SmartCartTransaction.findOne({
                where: {
                    transactionID: req.body.transactionID
                },
                attributes: ['id'],
                paranoid: false
            }).then((response) => {
                if (response) {
                    const objUpdate = {
                        pickColorUserID: null
                    };
                    SmartCartTransaction.update(objUpdate, {
                        where: {
                            transactionID: req.body.transactionID
                        },
                        fields: ['pickColorUserID']
                    }).then(() => { }).catch((err) => {
                        console.trace();
                        console.error(err);
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
            });
        }
    },
    manageWarehouseElasticData: (req, res, ElasticData) => {
        const {
            WarehouseMst
        } = req.app.locals.models;
        return WarehouseMst.findAll({
            where: {
                Name: {
                    [Op.in]: ElasticData
                },
                isActive: true
            },
            attributes: ['ID']
        }).then((warehouse) => {
            req.params.ID = _.map(warehouse, 'ID');
            // Add Warehouse detail into Elastic Search Engine for Enterprise Search
            // Need to change timeout code due to trasaction not get updated record
            setTimeout(() => {
                EnterpriseSearchController.manageWarehouseDetailInElastic(req);
            }, 2000);
            return warehouse;
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
};