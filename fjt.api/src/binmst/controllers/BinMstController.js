const _ = require('lodash');
const fs = require('fs');
var mime = require('mime');
const uuidv1 = require('uuid/v1');
var csv = require('fast-csv');
const fsextra = require('fs-extra');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const {
    STATE,
    COMMON
} = require('../../constant');
const TransferStockController = require('../../transfer_stock/controllers/TransferStockController');

const binModuleName = DATA_CONSTANT.BINMST.NAME;
const inputFields = ['id', 'Name', 'Description', 'WarehouseID', 'nickname', 'isActive', 'isPermanentBin', 'systemGenerated', 'isDeleted', 'createdBy', 'updatedBy', 'deletedBy', 'deletedAt', 'isDeleted', 'isRandom', 'prefix', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'];

module.exports = {
    // Retrive list of bin
    // GET : /api/v1/binmst/retriveBinList
    // @return list of bin
    retriveBinList: (req, res) => {
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

            return sequelize.query('CALL Sproc_RetrieveBin(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pWarehouseId,:pSearchOnlyEmptyBin)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pWarehouseId: req.body.warehouseId || null,
                    pSearchOnlyEmptyBin: req.body.searchOnlyEmptyBin === 'true' ? true : false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                bin: _.values(response[1]),
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
    // Retrive detail of bin
    // GET : /api/v1/binmst/:id
    // @param {id} int
    // @return detail of bin
    retriveBin: (req, res) => {
        if (req.params.id) {
            const {
                BinMst,
                WarehouseMst
            } = req.app.locals.models;
            return BinMst.findOne({
                where: {
                    isActive: true,
                    id: req.params.id
                },
                model: BinMst,
                attributes: ['id', 'Name', 'WarehouseID', 'nickname', 'isPermanentBin', 'isActive', 'isRandom', 'prefix', 'systemGenerated'],
                required: false,
                include: [{
                    model: WarehouseMst,
                    as: 'warehousemst',
                    attributes: ['id', 'Name', 'parentWHID'],
                    required: false,
                    include: [{
                        model: WarehouseMst,
                        as: 'parentWarehouseMst',
                        attributes: ['id', 'Name'],
                        required: false
                    }]
                }]
            }).then(bin =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, null)
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

    deleteBin: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Bin.Name;
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
            }).then((binDetail) => {
                if (binDetail.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binDetail, MESSAGE_CONSTANT.DELETED(binModuleName));
                } else {
                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        transactionDetails: binDetail,
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

    getAllWarehouse: (req, res) => {
        const {
            BinMst,
            WarehouseMst
        } = req.app.locals.models;

        const whereClause = {
            isDepartment: (req.query && (req.query.isDepartment === 'true' || req.query.isDepartment === true)) ? true : false,
            id: (req.query && (req.query.isDepartment === 'true' || req.query.isDepartment === true)) ? {
                [Op.lt]: 0
            } : {
                [Op.gt]: 0
            }
        };

        if (req.query && req.query.parentWHType) {
            whereClause.parentWHType = req.query.parentWHType;
        }

        WarehouseMst.findAll({
            attributes: ['Name', 'ID', 'nickname', 'parentWHID', 'parentWHType', 'allMovableBin', 'isPermanentWH', 'isActive', 'cartMfr', 'refEqpID', 'warehouseType'],
            order: [
                ['Name', 'ASC']
            ],
            where: whereClause,
            include: [{
                model: BinMst,
                as: 'binMst',
                attributes: ['id', 'Name', 'isRandom', 'prefix', 'suffix'],
                required: false
            }]
        }).then(binlist =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, binlist, null)
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

    // eslint-disable-next-line no-unused-vars
    updateBinCount: (req, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (t && t.connection) {
            return sequelize.query('CALL Sproc_UpdateBinCount (:pWHId, :pUpdatedBy)', {
                replacements: {
                    pWHId: req.body.WarehouseID,
                    pUpdatedBy: req.user.id
                },
                transaction: t
            });
        } else {
            return sequelize.query('CALL Sproc_UpdateBinCount (:pWHId, :pUpdatedBy)', {
                replacements: {
                    pWHId: req.body.WarehouseID,
                    pUpdatedBy: req.user.id
                }
            });
        }
    },

    updateBin: (req, res) => {
        const {
            BinMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            req.body.Name = req.body.Name.toUpperCase();
            return BinMst.findOne({
                where: {
                    Name: req.body.Name,
                    id: req.body.id
                }
            }).then(binDetail => sequelize.transaction().then((t) => {
                COMMON.setModelUpdatedByFieldValue(req);
                return BinMst.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: inputFields,
                    transaction: t
                }).then(() => {
                    if (binDetail && binDetail.isActive !== req.body.isActive) {
                        return module.exports.updateBinCount(req, t).then(() => {
                            t.commit().then(() => {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(binModuleName));
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
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(binModuleName));
                        // resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(binModuleName));
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
            }).catch((err) => {
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

    getAllBin: (req, res) => {
        const {
            BinMst,
            WarehouseMst
        } = req.app.locals.models;

        const whereClause = {
            isActive: true,
            deletedAt: null
        };

        if (req.query.warehouseID) {
            whereClause.WarehouseID = req.query.warehouseID;
        }

        if (req.query.nickname) {
            whereClause[Op.or] = [{
                nickname: null
            },
            {
                nickname: req.query.nickname
            }
            ];
        }

        if (req.query.searchString) {
            whereClause.Name = {
                [Op.like]: `%${req.query.searchString}%`
            };
        }

        const deptWhereClause = {};

        if (req.query.parentWHID) {
            deptWhereClause.parentWHID = req.query.parentWHID;
        }

        BinMst.findAll({
            where: whereClause,
            model: BinMst,
            attributes: ['id', 'Name', 'WarehouseID', 'isActive', 'isRandom', 'systemGenerated'],
            required: false,
            order: [
                ['Name', 'ASC']
            ],
            include: [{
                where: deptWhereClause,
                model: WarehouseMst,
                as: 'warehousemst',
                attributes: ['id', 'Name', 'parentWHID'],
                required: true,
                include: [{
                    model: WarehouseMst,
                    as: 'parentWarehouseMst',
                    attributes: ['id', 'Name'],
                    required: false
                }]
            }]
        }).then(bin =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, null)
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

    getBinCountList: (req, res) => {
        const {
            BinMst,
            sequelize
        } = req.app.locals.models;
        BinMst.findAll({
            where: {
                WarehouseID: req.body.objIDs,
                isActive: true
            },
            model: BinMst,
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('BinMst.Name')), 'CountBin'], 'WarehouseID', 'isActive'
            ],
            required: false
        }).then(bin =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, null)
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

    getAllNickNameOfAssembly: (req, res) => {
        const {
            Component,
            ComponentPartStatus,
            sequelize
        } = req.app.locals.models;

        Component.findAll({
            where: {
                category: 3
            },
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('nickName')), 'nickName'], 'id'
            ],
            include: [{
                model: ComponentPartStatus,
                as: 'componentPartStatus',
                attributes: ['id', 'name'],
                where: {
                    name: {
                        [Op.ne]: 'Obsolete'
                    }
                }
            }]
        }).then(nickNameList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, nickNameList, null)
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

    // Retrive history of bin
    // POST : /api/v1/binmst/history
    // @param {id} int
    // @return history of bin
    getBinHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveBin_History(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pBinID, :pClusterWHID)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pBinID: req.body.binId || null,
                pClusterWHID: req.body.clusterWHID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                bin: _.values(response[1]),
                Count: response[0][0]['TotalRecord'],
                currentBinDet: response[2][0]
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
    // Create Bin
    // POST : /api/v1/binmst/createBin
    // @return new created bin
    createBin: (req, res) => {
        const {
            BinMst,
            WarehouseMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.singleBin) {
            req.body.Name = req.body.Name.toUpperCase();
            return BinMst.findOne({
                where: {
                    Name: req.body.Name
                }
            }).then((binDetail) => {
                if (binDetail) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_UNIQUE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.warehouseType === DATA_CONSTANT.warehouseType.Equipment.key ? 'Feeder' : DATA_CONSTANT.BINMST.NAME, req.body.Name);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: null,
                        data: null
                    });
                } else { // create
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelCreatedByFieldValue(req);
                        return BinMst.create(req.body, {
                            fields: inputFields
                        }).then(bin => module.exports.updateBinCount(req, t).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, MESSAGE_CONSTANT.CREATED(binModuleName))))).catch((err) => {
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
        } else if (req.body.multipleBin) {
            let BinList = [];
            const BinName = [];
            const promises = [];
            if (req.body.rangeBin) {
                if (req.body.binPrifix) {
                    req.body.binPrifix = req.body.binPrifix.toUpperCase();
                }
                if (!req.body.isDuplicate) {
                    let i;
                    const binFrom = req.body.binFrom ? parseInt(req.body.binFrom) : 0;
                    const binTo = req.body.binTo ? parseInt(req.body.binTo) : 0;
                    for (i = binFrom; i <= binTo; i++) {
                        const objData = {};
                        if (req.body.binPrifix) {
                            if (req.body.isRandom) {
                                if (req.body.isBinPrifix) {
                                    objData.Name = COMMON.stringFormat('{0}{1}', req.body.binPrifix, i);
                                } else {
                                    objData.Name = COMMON.stringFormat('{0}{1}', i, req.body.binPrifix);
                                }
                            }
                            if (req.body.isBinPrifix) {
                                objData.Name = COMMON.stringFormat('{0}+{1}{2}', req.body.WarehouseName, req.body.binPrifix, i);
                            } else {
                                objData.Name = COMMON.stringFormat('{0}+{1}{2}', req.body.WarehouseName, i, req.body.binPrifix);
                            }
                        } else if (req.body.isRandom) {
                            objData.Name = i;
                        } else {
                            objData.Name = COMMON.stringFormat('{0}+{1}', req.body.WarehouseName, i);
                        }
                        COMMON.setModelCreatedObjectFieldValue(req.user, objData);
                        objData.WarehouseID = req.body.WarehouseID;
                        objData.nickname = req.body.nickname;
                        objData.prefix = req.body.prefix;
                        objData.suffix = req.body.suffix;
                        objData.isRandom = req.body.isRandom;
                        objData.isActive = req.body.isActive;
                        objData.isPermanentBin = req.body.isPermanentBin;
                        BinName.push(objData.Name);
                        BinList.push(objData);
                    }
                } else {
                    BinList = req.body.unique_Warehouse_List;
                    _.each(BinList, (data) => {
                        BinName.push(data.Name);
                    });
                }
            } else if (req.body.manualBin) {
                if (!req.body.isDuplicate) {
                    _.each(req.body.multipleBinList, (data) => {
                        const objData = {};
                        if (data.binPrefix) {
                            objData.Name = COMMON.stringFormat('{0}{1}', data.binPrefix, data.Name.toUpperCase());
                        } else {
                            objData.Name = data.Name.toUpperCase();
                        }
                        COMMON.setModelCreatedObjectFieldValue(req.user, objData);
                        objData.WarehouseID = req.body.WarehouseID;
                        objData.nickname = req.body.nickname;
                        objData.prefix = req.body.prefix;
                        objData.isRandom = req.body.isRandom;
                        objData.isActive = req.body.isActive;
                        objData.isPermanentBin = req.body.isPermanentBin;
                        BinName.push(objData.Name);
                        BinList.push(objData);
                    });
                } else {
                    BinList = req.body.unique_Warehouse_List;
                    _.each(BinList, (data) => {
                        BinName.push(data.Name);
                    });
                }
            }
            promises.push(
                BinMst.findAll({
                    where: {
                        Name: {
                            [Op.in]: BinName
                        }
                    },
                    model: BinMst,
                    attributes: ['id', 'Name']
                }));


            promises.push(
                WarehouseMst.findAll({
                    where: {
                        Name: {
                            [Op.in]: BinName
                        }
                    },
                    model: WarehouseMst,
                    attributes: ['id', 'Name']
                }));
            return Promise.all(promises).then((resp) => {
                if (resp && resp.length > 0 && (resp[0].length > 0 || resp[1].length > 0)) {
                    const DuplicateList = resp[0];
                    const UniqueList = [];
                    _.each(resp[1], (data) => {
                        DuplicateList.push(data);
                    });
                    _.filter(BinList, (data) => {
                        const findBin = _.find(DuplicateList, item => item.Name === data.Name);
                        if (!findBin) {
                            UniqueList.push(data);
                        }
                    });
                    resp = [];
                    resp.push(DuplicateList);
                    resp.push(UniqueList);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
                } else {
                    return sequelize.transaction().then(t => BinMst.bulkCreate(BinList, {
                        fields: inputFields,
                        transaction: t
                    }).then(() => module.exports.updateBinCount(req, t).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(binModuleName))))).catch((err) => {
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

    // Retrive detail of bin by ID
    // GET : /api/v1/binmst/getbindetail/id
    // @param {id} int
    // @return detail of bin by ID
    getBinDetail: (req, res) => {
        const {
            BinMst,
            WarehouseMst
        } = req.app.locals.models;
        BinMst.findAll({
            where: {
                isActive: true,
                id: req.params.id
            },
            model: BinMst,
            attributes: ['id', 'Name', 'WarehouseID', 'nickname', 'isPermanentBin', 'isActive', 'isRandom', 'prefix'],
            required: false,
            include: [{
                model: WarehouseMst,
                as: 'warehousemst',
                attributes: ['id', 'Name'],
                required: false
            }]
        }).then(bin =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, null)
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

    // Check Bin Status With UMID
    // GET : /api/v1/binmst/checkBinStatusWithUMID
    checkBinStatusWithUMID: (req, res) => {
        const {
            ComponentSidStock,
            VUUMIDCreationPending
        } = req.app.locals.models;
        if (req.body) {
            return ComponentSidStock.findOne({
                where: {
                    binID: {
                        [Op.in]: req.body
                    }
                },
                model: ComponentSidStock,
                attributes: ['id', 'uid'],
                paranoid: false
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                } else {
                    return VUUMIDCreationPending.findAll({
                        where: {
                            BinID: {
                                [Op.in]: req.body
                            }
                        },
                        model: VUUMIDCreationPending,
                        attributes: ['BinID', 'PartId', 'InQty', 'BalanceQty']
                    }).then((resp) => {
                        if (resp && resp.length > 0) {
                            const findBin = _.find(resp, data => data.BalanceQty !== 0);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, findBin, null);
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

    // Retrive detail of bin by name
    // POST : /api/v1/binmst/getBinDetailByName/:name
    // @param {name} string
    // @return detail of bin by name
    getBinDetailByName: (req, res) => {
        const {
            BinMst,
            WarehouseMst
        } = req.app.locals.models;

        if (req.body && req.body.name) {
            return BinMst.findOne({
                where: {
                    isActive: true,
                    Name: req.body.name,
                    deletedAt: null,
                    id: {
                        [Op.gt]: 0
                    }
                },
                model: BinMst,
                attributes: ['id', 'Name', 'WarehouseID', 'nickname', 'isActive', 'isRandom', 'prefix', 'isPermanentBin', 'systemGenerated'],
                required: true,
                include: [{
                    model: WarehouseMst,
                    as: 'warehousemst',
                    attributes: ['id', 'Name', 'parentWHID', 'warehouseType', 'cartMfr'],
                    required: false,
                    include: [{
                        model: WarehouseMst,
                        as: 'parentWarehouseMst',
                        attributes: ['id', 'Name', 'parentWHType'],
                        required: false
                    }]
                }]
            }).then(bin =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, null)
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
    // Retrive Warehouse Detail and Transfer Bin
    // POST : /api/v1/binmst/getBinDetailByName
    // @param {name} string
    // @return detail of bin by name
    getWarehouseAndTransferBin: (req, res) => {
        const {
            WarehouseMst,
            VUUMIDCreationPending,
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.whName) {
            return WarehouseMst.findOne({
                where: {
                    isActive: true,
                    Name: req.body.whName,
                    deletedAt: null,
                    ID: {
                        [Op.gt]: 0
                    }
                },
                model: WarehouseMst,
                attributes: ['ID', 'Name', 'parentWHID', 'warehouseType'],
                required: false,
                include: [{
                    model: WarehouseMst,
                    as: 'parentWarehouseMst',
                    attributes: ['ID', 'Name'],
                    required: false
                }]
            }).then((whDetail) => {
                if (whDetail) {
                    if (whDetail.ID === req.body.fromWHId) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_ALREADY_IN_WAREHOUSE);
                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.fromBin, whDetail.Name);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        }
                        );
                    } else if (whDetail.warehouseType !== DATA_CONSTANT.warehouseType.ShelvingCart.key) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.OTHER_THAN_SHELVING_CART_NOT_TRANSFER);
                        messageContent.message = COMMON.stringFormat(messageContent.message, whDetail.Name);
                        return resHandler.successRes(
                            res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        }
                        );
                    } else {
                        return VUUMIDCreationPending.findAll({
                            where: {
                                BinID: req.body.fromBinID,
                                BalanceQty: {
                                    [Op.gt]: 0
                                }
                            },
                            model: VUUMIDCreationPending,
                            attributes: ['packingSlipID', 'BinID', 'BalanceQty'],
                            paranoid: false
                        }).then((nonUMIDList) => {
                            if (nonUMIDList && nonUMIDList.length > 0) {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.NOT_TRANSFER_PENDING_UMID_PART_BIN);
                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.fromBin);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
                                });
                            } else if (whDetail.parentWarehouseMst.ID !== req.body.fromDepartmentId) {
                                if (req.body.allowValidationFlage && !req.body.allowValidationFlage.confirmContainKitValidation) {
                                    return sequelize.query('Select fun_getKitContainInBinByBin(:pBinId)', {
                                        replacements: {
                                            pBinId: req.body.fromBinID
                                        },
                                        type: sequelize.QueryTypes.SELECT
                                    }).then((kitStrValue) => {
                                        const kitStr = _.values(kitStrValue[0])[0];
                                        if (kitStr) {
                                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                                messageContent: messageContent,
                                                err: null,
                                                data: null,
                                                validationType: 'BINCONTAINKIT',
                                                kitName: kitStr
                                            });
                                        } else if (req.body.allowValidationFlage && !req.body.allowValidationFlage.confirmUnAllocatedUMIDValidation) {
                                            return module.exports.validationUnallocatedUMID(req, whDetail, res);
                                        } else {
                                            return module.exports.transferBin(req, whDetail, res);
                                        }
                                    }).catch((err) => {
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
                                } else if (req.body.allowValidationFlage && !req.body.allowValidationFlage.confirmUnAllocatedUMIDValidation) {
                                    return module.exports.validationUnallocatedUMID(req, whDetail, res);
                                } else {
                                    return module.exports.transferBin(req, whDetail, res);
                                }
                            } else {
                                return module.exports.transferBin(req, whDetail, res);
                            }
                        }).catch((err) => {
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
                    }
                } else {
                    return resHandler.successRes(
                        res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS,
                        null,
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    validationUnallocatedUMID: (req, toWH, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('Select fun_checkFromBinUMIDAllocate(:pFromBinId, :pTransferType)', {
                replacements: {
                    pFromBinId: req.body.fromBinID,
                    pTransferType: toWH.parentWarehouseMst.ID === req.body.fromDepartmentId ? DATA_CONSTANT.UMID_History.Trasaction_Type.WithinDept : DATA_CONSTANT.UMID_History.Trasaction_Type.OtherDept
                },
                type: sequelize.QueryTypes.SELECT
            }).then((binResponse) => {
                const allowToTransfer = _.values(binResponse[0])[0];
                if (allowToTransfer) {
                    return module.exports.transferBin(req, toWH, res);
                } else {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.TRANSFER_BIN_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.fromBin, req.body.fromDepartment, toWH.parentWarehouseMst.Name);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        messageContent: messageContent,
                        err: null,
                        data: null,
                        validationType: 'UNALLOCATEUMID'
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    transferBin: (req, toWH, res) => {
        req.body.toWHID = toWH.ID;
        req.body.userID = req.user.id;
        req.body.toParentWarehouseName = toWH.parentWarehouseMst.Name;
        req.body.actionPerformed = DATA_CONSTANT.UMID_History.Action_Performed.BinTransfer;

        if (toWH.parentWarehouseMst.ID === req.body.fromDepartmentId) {
            req.body.transType = DATA_CONSTANT.UMID_History.Trasaction_Type.Bin_WH_Transfer;
            req.body.transferType = DATA_CONSTANT.UMID_History.TrasferStockType.StockTransfer;
        } else {
            req.body.transType = DATA_CONSTANT.UMID_History.Trasaction_Type.Bin_WH_Transfer;
            req.body.transferType = DATA_CONSTANT.UMID_History.TrasferStockType.StockTransferToOtherDept;
        }

        TransferStockController.tranferStockDetail(req, req.body, false, res);
    },

    downloadBinTemplate: (req, res) => {
        const fileName = DATA_CONSTANT.BIN_TEMPLATE.FileName;
        const path = DATA_CONSTANT.BIN_TEMPLATE.DOWNLOAD_PATH + fileName;
        fs.chmodSync(path, '0666');
        // eslint-disable-next-line consistent-return
        fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_NotFound,
                        err: null,
                        data: null
                    });
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.DownloadFileErrorMsg_AccessDenied,
                        err: null,
                        data: null
                    });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                }
            } else {
                const file = path;
                res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    },

    importBin: (req, res) => {
        const dir = './uploads/genericfiles/generic_category/';
        if (typeof (req.files) === 'object' && Array.isArray(req.files.documents)) {
            const file = req.files.documents[0];
            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
            const fileName = `${uuidv1()}.${ext}`;
            const path = dir + fileName;
            fsextra.move(file.path, path, (err) => {
                if (err) {
                    console.trace();
                    console.error(err);
                }
                module.exports.importBinDetail(req, res, path);
            });
        }
    },

    importBinDetail: (req, res, filepath) => {
        const BinDataList = [];
        const AllDataWithError = [];
        let index = 0;
        let onErrorIndex = 0;
        let isAnyInvalidData = false;
        const path = filepath;
        const stream = fs.createReadStream(path);
        const BinImportErrors = DATA_CONSTANT.BinImportErrors;
        const FailureOperationStatus = DATA_CONSTANT.BinImportErrors.FailureOperationStatus;
        fs.unlinkSync(path);
        csv.fromStream(stream, {
            headers: true,
            ignoreEmpty: true
        }).validate((data) => {
            if (data) {
                let isValid = true;
                data.index = index++;
                data.ErrorLog = '';
                data.OperationStatus = '';
                data.errorMessageList = [];
                if (!data.Warehouse) {
                    data.errorMessageList.push(COMMON.stringFormat(BinImportErrors.Required, DATA_CONSTANT.WAREHOUSEMST.NAME));
                    isValid = false;
                    data.OperationStatus = FailureOperationStatus;
                }
                if (!data.BinName || (data.BinName && data.BinName.length < 0)) {
                    data.errorMessageList.push(COMMON.stringFormat(BinImportErrors.Required, DATA_CONSTANT.BINMST.NAME));
                    isValid = false;
                    data.OperationStatus = FailureOperationStatus;
                }
                if (data.BinName && data.BinName.length > 50) {
                    data.errorMessageList.push(BinImportErrors.InvalidLengthBin);
                    isValid = false;
                    data.OperationStatus = FailureOperationStatus;
                }
                if (data.Description && data.Description.length > 255) {
                    data.errorMessageList.push(BinImportErrors.InvalidLengthDescription);
                    data.OperationStatus = FailureOperationStatus;
                    isValid = false;
                }
                return isValid;
            }
            return false;
        }).on('data-invalid', (data) => {
            if (data) {
                isAnyInvalidData = true;
                AllDataWithError.push(data);
            }
        }).on('data', (data) => {
            if (data) {
                BinDataList.push(data);
            }
        })
            // eslint-disable-next-line consistent-return
            .on('end', () => {
                if (BinDataList.length > 0) {
                    const listDataIndex = 0;
                    // eslint-disable-next-line no-use-before-define
                    checkValidation(saveBin, BinDataList, req, AllDataWithError, listDataIndex, path, res);
                } else if (isAnyInvalidData && AllDataWithError.length > 0) {
                    /* AllDataWithError - data list of original data with error that need to be downloaded in case of error  */
                    // eslint-disable-next-line no-use-before-define
                    DownloadCSVFile(req, path, res, AllDataWithError);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(binModuleName),
                        err: null,
                        data: null
                    });
                }
            })
            // eslint-disable-next-line consistent-return
            .on('error', (error) => {
                console.trace();
                console.error(error);
                onErrorIndex++;
                /* data in loop called error part everytime if error so to display error only once put condition */
                if (onErrorIndex === 1) {
                    stream.destroy();
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: error,
                        data: null
                    });
                }
            });
    }
};
let checkValidation = (callback, BinDataList, req, AllDataWithError, listDataIndex, path, res) => {
    const data = BinDataList[listDataIndex];
    const {
        WarehouseMst,
        BinMst,
        sequelize
    } = req.app.locals.models;
    const Promises = [];
    Promises.push(WarehouseMst.findOne({
        where: {
            Name: data.Warehouse,
            ID: {
                [Op.gt]: 0
            }
        },
        model: WarehouseMst,
        attributes: ['ID', 'allMovableBin', 'isActive']
    }));
    Promises.push(
        BinMst.findOne({
            where: {
                Name: data.BinName
            },
            model: BinMst
        }));
    Promise.all(Promises).then((resp) => {
        if (resp && (resp[0] || resp[1])) {
            if (resp[0] && resp[0].dataValues) {
                const warehouseData = resp[0].dataValues;
                if (warehouseData.isActive) {
                    data.warehouseID = warehouseData.ID ? warehouseData.ID : null;
                    data.allMovableBin = warehouseData.allMovableBin ? warehouseData.allMovableBin : null;
                } else {
                    data.errorMessageList.push(DATA_CONSTANT.BinImportErrors.inActiveWarehouse);
                    data.OperationStatus = DATA_CONSTANT.BinImportErrors.FailureOperationStatus;
                }
            } else {
                data.errorMessageList.push(DATA_CONSTANT.BinImportErrors.WareohouseNotFound);
                data.OperationStatus = DATA_CONSTANT.BinImportErrors.FailureOperationStatus;
            }
            if (resp[1] && resp[1].dataValues) {
                data.errorMessageList.push(DATA_CONSTANT.BinImportErrors.BinExist);
                data.OperationStatus = DATA_CONSTANT.BinImportErrors.FailureOperationStatus;
            }
        }
        callback(data, req, BinDataList, AllDataWithError, listDataIndex, path, res);
    }).catch((err) => {
        console.trace();
        console.error(err);
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
            err: err,
            data: null
        });
    });
};
let saveBin = (data, req, BinDataList, AllDataWithError, listDataIndex, path, res) => {
    const FailureOperationStatus = DATA_CONSTANT.BinImportErrors.FailureOperationStatus;
    if (data.errorMessageList.length > 0) {
        data.OperationStatus = FailureOperationStatus;
        AllDataWithError.push(data);
        listDataIndex++;
        if (listDataIndex <= BinDataList.length - 1) {
            checkValidation(saveBin, BinDataList, req, AllDataWithError, listDataIndex, path, res);
        } else {
            // eslint-disable-next-line no-use-before-define
            DownloadCSVFile(req, res, path, AllDataWithError);
        }
    } else {
        const {
            BinMst
        } = req.app.locals.models;
        const binData = BinDataList[listDataIndex];
        const binObj = {
            Name: binData.BinName.toUpperCase(),
            WarehouseID: binData.warehouseID,
            Description: binData.Description ? binData.Description : null,
            isPermanentBin: binData.allMovableBin ? false : true,
            isRandom: 1,
            isDeleted: false,
            isActive: true
        };
        COMMON.setModelCreatedObjectFieldValue(req.user, binObj);
        BinMst.create(binObj, {
            fields: inputFields
        }).then((bin) => {
            listDataIndex++;
            req.body.WarehouseID = binObj.WarehouseID;
            // eslint-disable-next-line consistent-return
            module.exports.updateBinCount(req).then(() => {
                if (listDataIndex <= BinDataList.length - 1) {
                    checkValidation(saveBin, BinDataList, req, AllDataWithError, listDataIndex, path, res);
                } else if (AllDataWithError.length > 0) {
                    // eslint-disable-next-line no-use-before-define
                    DownloadCSVFile(req, res, path, AllDataWithError);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, MESSAGE_CONSTANT.CREATED(binModuleName));
                }
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            data.errorMessageList.push(DATA_CONSTANT.BinImportErrors.ErrorInDataProcessing);
            data.OperationStatus = DATA_CONSTANT.BinImportErrors.FailureOperationStatus;
            AllDataWithError.push(data);
            listDataIndex++;
            if (listDataIndex <= BinDataList.length - 1) {
                checkValidation(saveBin, BinDataList, req, AllDataWithError, listDataIndex, path, res);
            } else {
                // eslint-disable-next-line no-use-before-define
                DownloadCSVFile(req, res, path, AllDataWithError);
            }
        });
    }
};
let DownloadCSVFile = (req, res, path, AllDataWithError) => {
    const PrintAllData = [];
    const promises = [];
    const fileName = DATA_CONSTANT.BIN_TEMPLATE.FileName;
    const {
        sequelize
    } = req.app.locals.models;
    let ws;
    _.each(AllDataWithError, (item) => {
        item = _.omit(item, ['index']);
        item.ErrorLog = _.map(item.errorMessageList, (message, index) => `${(index + 1)}. ${message}`).join(' ');
        delete item.warehouseID;
        delete item.allMovableBin;
        delete item.errorMessageList;
        PrintAllData.push(item);
    });
    promises.push(ws = fs.createWriteStream(path));
    promises.push(
        csv.write(PrintAllData, {
            headers: true
        }).pipe(ws));
    Promise.all(promises).then(() => {
        var file = path;
        var mimetype = mime.lookup(`${file}.text/csv`);
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
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
};