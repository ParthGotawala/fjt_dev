const _ = require('lodash');
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

const bank = DATA_CONSTANT.BANK.Name;
const bankInputFields = [
    'id',
    'accountCode',
    'bankName',
    'accountNumber',
    'isActive',
    'isDeleted',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'typeOfAccount',
    'creditDebitType',
    'acctId'
];

module.exports = {

    // Retrive list of Bank
    // POST : /api/v1/bank/retrieveBankList
    // @returns list of bank List
    retrieveBankList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveBank (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                Bank: _.values(response[1]),
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

    // Validate Bank
    // POST : /api/v1/bank/checkBankUnique
    // @returns list of bank List
    checkBankUnique: (req, res, isFromApi) => {
        const {
            BankMst
        } = req.app.locals.models;
        if (req.body) {
            const isFromApiCheck = isFromApi === true ? true : false;
            const validationPromise = [];
            const whereClauseBank = {
                bankName: req.body.bankName,
                accountNumber: req.body.accountNumber
            };
            const whereClauseCode = {
                accountCode: req.body.accountCode
            };
            if (req.body.id) {
                whereClauseBank.id = {
                    [Op.ne]: req.body.id
                };
                whereClauseCode.id = {
                    [Op.ne]: req.body.id
                };
            }
            if (req.body.bankValidation || isFromApiCheck) {
                validationPromise.push(BankMst.findOne({
                    where: whereClauseBank,
                    attributes: ['id', 'bankName']
                }));
            }
            if (req.body.accountCodeValidation || isFromApiCheck) {
                validationPromise.push(BankMst.findOne({
                    where: whereClauseCode,
                    attributes: ['id', 'bankName']
                }));
            }
            return Promise.all(validationPromise).then((response) => {
                if (isFromApiCheck) {
                    return Promise.resolve(response);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], null);
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

    // To retrieve Bank by id
    // GET
    // @return Bank
    getBankByID: (req, res) => {
        const {
            BankMst
        } = req.app.locals.models;
        if (req.params.id) {
            return BankMst.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'accountCode', 'bankName', 'accountNumber', 'isActive', 'typeOfAccount', 'creditDebitType', 'acctId']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // save Bank
    // POST : /api/v1/bank/saveBank
    saveBank: (req, res) => {
        const {
            BankMst,
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            return sequelize.transaction().then(t => module.exports.checkBankUnique(req, res, true).then((validation) => {
                if (validation && validation[0] && validation[0].length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            duplicateBank: true
                        }
                    });
                } else if (validation && validation[1] && validation[1].length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            duplicateCode: true
                        }
                    });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return BankMst.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: bankInputFields,
                        transaction: t
                    }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(bank)))).catch((err) => {
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
                }
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
            return sequelize.transaction().then(t => module.exports.checkBankUnique(req, res, true).then((validation) => {
                if (validation && validation[0]) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            duplicateBank: true
                        }
                    });
                } else if (validation && validation[1]) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            duplicateCode: true
                        }
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return BankMst.create(req.body, {
                        fields: bankInputFields,
                        transaction: t
                    }).then(response => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.CREATED(bank)))).catch((err) => {
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
                }
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
    },

    // Bank delete
    // POST : /api/v1/bank/deleteBank
    // @return delete bank
    deleteBank: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = COMMON.AllEntityIDS.Bank.Name;
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
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(bank));
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
    },
    // To retrieve Bank for autocomplete
    // POST : /api/v1/bank/deleteBank
    // @return Bank list
    getBankList: (req, res) => {
        const {
            BankMst
        } = req.app.locals.models;
        return BankMst.findAll({
            attributes: ['id', 'accountCode', 'bankName', 'accountNumber', 'isActive', 'typeOfAccount', 'creditDebitType', 'acctId']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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