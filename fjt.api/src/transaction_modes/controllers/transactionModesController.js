const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { proceedTransction, manageTransactionModesInElastic, deleteTransactionModesDetailInElastic } = require('../../enterprise_search/controllers/Enterprise_SearchController');


const payableTransactionMode = DATA_CONSTANT.TRANSACTION_MODE.PAYABLE;
const receivableTransactionMode = DATA_CONSTANT.TRANSACTION_MODE.RECEIVABLE;
const transactionModeInputFields = [
    'id',
    'modeType',
    'modeCode',
    'modeName',
    'displayOrder',
    'isActive',
    'systemGenerated',
    'description',
    'ref_acctid',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {

    // Retrive list of TransactionModes
    // POST : /api/v1/transactionModes/retrieveTransactionModesList
    // @returns list of Transaction Modes
    retrieveTransactionModesList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.TransMode) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveTransactionModesList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pTransMode)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pTransMode: req.body.TransMode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                TransactionModes: _.values(response[1]),
                Count: response[0][0].TotalRecord
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

    // Validate TransactionMode
    // POST : /api/v1/transactionModes/checkTransactionModeUnique
    // @returns list of TransactionMode
    checkTransactionModeUnique: (req, res, isFromApi) => {
        const { TransactionModeMst } = req.app.locals.models;
        if (req.body && req.body.modeType) {
            const whereClause = {
                modeType: req.body.modeType,
                isDeleted: false,
                [Op.or]: []
            };
            if (req.body.id) {
                whereClause.id = {
                    [Op.ne]: req.body.id
                };
            }
            if (req.body.modeName) {
                whereClause[Op.or].push({ modeName: { [Op.eq]: req.body.modeName } });
            }
            if (req.body.modeCode) {
                whereClause[Op.or].push({ modeCode: { [Op.eq]: req.body.modeCode } });
            }
            if (req.body.displayOrder) {
                whereClause[Op.or].push({ displayOrder: { [Op.eq]: req.body.displayOrder } });
            }

            return TransactionModeMst.findOne({
                where: whereClause,
                attributes: ['id', 'modeName', 'modeCode', 'displayOrder']
            }).then((response) => {
                if (isFromApi === true) {
                    return Promise.resolve({ state: STATE.SUCCESS, data: response });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (isFromApi === true) {
                    return Promise.resolve({ state: STATE.FAILED, err: err });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
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

    // To retrieve TransactionMode by id
    // Get: /api/v1/transactionModes/getTransactionModeID
    // @return TransactionMode
    getTransactionModeByID: (req, res) => {
        const { TransactionModeMst, AcctAcctMst } = req.app.locals.models;
        if (req.params.id) {
            return TransactionModeMst.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                attributes: transactionModeInputFields,
                include: [{
                    model: AcctAcctMst,
                    as: 'acct_acctmst',
                    attributes: ['acct_id', 'acct_name'],
                    required: false
                }]
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND('Transaction Mode'), err: null, data: null });
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

    // // To retrieve TransactionMode List by TransactionMode type
    // // Post: /api/v1/transactionModes/getTransactionModesListByModeType
    // // @return TransactionMode List
    // getTransactionModesListByModeType: (req, res) => {
    //     const { TransactionModeMst } = req.app.locals.models;
    //     if (req.body && req.body.modeType) {
    //         return TransactionModeMst.findAll({
    //             where: {
    //                 modeType: req.body.modeType
    //             },
    //             order: [
    //                 ['modeName', 'ASC']
    //             ],
    //             attributes: ['id', 'modeType', 'modeCode', 'modeName', 'isActive']
    //         }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
    //             customerTransModeNameList: response || []
    //         }, null)).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                 messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                 err: err,
    //                 data: null
    //             });
    //         }).catch((err) => {
    //             console.trace();
    //             console.error(err);
    //             return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
    //                 messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
    //                 err: err,
    //                 data: null
    //             });
    //         });
    //     } else {
    //         return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
    //             messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
    //             err: null,
    //             data: null
    //         });
    //     }
    // },

    // get Transaction Mode List of based on modeType
    // POST : /api/v1/generic_transMode/getTransModeList
    // @return Generic transaction mode list
    getTransModeList: (req, res) => {
        if (req.body && req.body.transInfo && req.body.transInfo.modeType) {
            const { TransactionModeMst } = req.app.locals.models;
            const whereClause = {
                isDeleted: false,
                modeType: req.body.transInfo.modeType
            };
            if (req.body.transInfo.searchObj && req.body.transInfo.searchObj.searchQuery) {
                whereClause.modeName = {
                    [Op.like]: `%${req.body.transInfo.searchObj.searchQuery}%`
                };
            }
            if (req.body.transInfo.searchObj && req.body.transInfo.searchObj.id) {
                whereClause.id = {
                    [Op.eq]: `${req.body.transInfo.searchObj.id}`
                };
            }
            return TransactionModeMst.findAll({
                where: whereClause,
                order: [
                    ['modeName', 'ASC']
                ],
                attributes: ['id', 'modeType', 'modeCode', 'modeName', 'isActive']
            }).then(TransModeNameList =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    customerTransModeNameList: TransModeNameList || []
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

    // save TransactionMode
    // POST : /api/v1/transactionModes/saveTransactionMode
    // @return TransactionMode
    saveTransactionMode: (req, res) => {
        const { TransactionModeMst } = req.app.locals.models;
        if (req.body && req.body.modeType) {
            return module.exports.checkTransactionModeUnique(req, res, true).then((validationResponse) => {
                if (validationResponse && validationResponse.state === STATE.SUCCESS) {
                    if (validationResponse.data) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: validationResponse.data
                        });
                    } else {
                        if (req.body.id) {
                            COMMON.setModelUpdatedByFieldValue(req);
                            return TransactionModeMst.update(req.body, {
                                where: {
                                    id: req.body.id
                                },
                                fields: ['modeCode', 'modeName', 'displayOrder', 'isActive', 'description', 'ref_acctid', 'updatedAt', 'updatedBy', 'updateByRoleId']
                            }).then((response) => {
                                if (response && response.length > 0) {
                                    req.params['id'] = req.body.id;
                                    req.params['modeType'] = req.body.modeType;
                                    proceedTransction(req, manageTransactionModesInElastic);
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(req.body.modeType === payableTransactionMode.ModeType ? payableTransactionMode.Name : receivableTransactionMode.Name));
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
                            COMMON.setModelCreatedByFieldValue(req);
                            return TransactionModeMst.create(req.body, {
                                fields: transactionModeInputFields
                            }).then((response) => {
                                if (response) {
                                    req.params['id'] = response.id;
                                    req.params['modeType'] = response.modeType;
                                    proceedTransction(req, manageTransactionModesInElastic);
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(req.body.modeType === payableTransactionMode.ModeType ? payableTransactionMode.Name : receivableTransactionMode.Name));
                            }).catch((err) => {
                                console.trace();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: validationResponse && validationResponse.err ? validationResponse.err : null,
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // TransactionModes
    // POST : /api/v1/transactionModes/deleteTransactionModes
    // @return delete TransactionModes
    deleteTransactionModes: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs && req.body.objIDs.id && req.body.modeType) {
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = COMMON.AllEntityIDS.TRANSACTIONMODE_MST.Name;
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
            }).then((response) => {
                if (response.length === 0) {
                    deleteTransactionModesDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(req.body.modeType === payableTransactionMode.ModeType ? payableTransactionMode.Name : receivableTransactionMode.Name));
                } else {
                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        transactionDetails: response,
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
    }
};