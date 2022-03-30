const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');
const { proceedTransction, manageChartOfAccountsInElastic, deleteChartOfAccountsDetailInElastic } = require('../../enterprise_search/controllers/Enterprise_SearchController');

const chartOfAccountsModuleName = DATA_CONSTANT.CHART_OF_ACCOUNTS.NAME;

const inputFields = [
    'acct_code',
    'acct_name',
    'sub_class_id',
    'class_id',
    'description',
    'disp_order',
    'isSubAccount',
    'parent_acct_id',
    'tax_acct_id',
    'm3_acct_id',
    'createdBy',
    'createdAt',
    'createByRoleId',
    'updatedBy',
    'updatedAt',
    'updateByRoleId',
    'isDeleted',
    'deletedAt',
    'deletedBy',
    'deleteByRoleId',
    'systemid'
];

module.exports = {
    // Get detail of Chart of Accounts list
    // GET : /api/v1/acctacctmst/getChartOfAccountsList
    // @param {id} int
    // @return detail of Chart of Accounts
    getChartOfAccountsList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetChartOfAccountsList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { AccountsList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // get detail of chart of account by ID
    // GET : /api/v1/acctacctmst/getChartOfAccountById/:id
    // @return detail of Chart of Account
    getChartOfAccountById: (req, res) => {
        if (req.params && req.params.id) {
            const { AcctAcctMst } = req.app.locals.models;

            return AcctAcctMst.findByPk(req.params.id).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
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

    // get list of chart of account by search key
    // GET : /api/v1/acctacctmst/getChartOfAccountBySearch
    // @return list of chart of Account Detail
    getChartOfAccountBySearch: (req, res) => {
        const AcctAcctMst = req.app.locals.models.AcctAcctMst;

        if (req.body) {
            const where = {
                isDeleted: false
            };

            if (req.body.searchString) {
                where.acct_name =
                {
                    [Op.like]: `%${req.body.searchString}%`
                };
            }

            if (req.body.class_id) {
                where.class_id = req.body.class_id;
            }
            if (req.body.sub_class_id) {
                where.sub_class_id = req.body.sub_class_id;
            }

            if (req.body.parent_acct_id) {
                where.acct_id = {
                    [Op.ne]: req.body.parent_acct_id
                };
            }

            if (req.body.acct_id) {
                where.acct_id = req.body.acct_id;
            }

            return AcctAcctMst.findAll({
                where: where,
                paranoid: false,
                attributes: ['acct_id', 'acct_name', 'acct_code']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Create Account
    // POST : /api/v1/acctacctmst/saveChartOfAccount
    // @return created account
    saveChartOfAccount: (req, res) => {
        if (req.body) {
            const { AcctAcctMst, sequelize, AcctClassMst } = req.app.locals.models;
            if (req.body.acct_code) {
                req.body.acct_code = req.body.acct_code.toUpperCase();
            }
            const where = {
                [Op.or]: [{
                    acct_code: req.body.acct_code,
                    isDeleted: false
                }, {
                    acct_name: req.body.acct_name,
                    isDeleted: false
                }]
            };
            if (req.body.acct_id) {
                where.acct_id = {
                    [Op.ne]: req.body.acct_id
                };
            }
            return AcctClassMst.findOne({
                where: { class_id: req.body.sub_class_id }
            }).then((response) => {
                req.body.class_id = response.parent_class_id ? response.parent_class_id : req.body.sub_class_id;
                return sequelize.transaction().then(t => AcctAcctMst.findOne({
                    where: where,
                    transaction: t
                }).then((accountResponse) => {
                    if (accountResponse) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                        messageContent.message = COMMON.stringFormat(messageContent.message, accountResponse.acct_name === req.body.acct_name ? 'Account Name' : 'Account Code');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                    } else if (req.body.acct_id) {
                        COMMON.setModelUpdatedByFieldValue(req);
                        return sequelize.query('CALL Sproc_checkChartOfAccountRef (:pParentAcctId)', {
                            replacements: {
                                pParentAcctId: req.body.parent_acct_id
                            },
                            transaction: t
                        }).then((chartOfAccountRefId) => {
                            if (chartOfAccountRefId) {
                                const isParent = chartOfAccountRefId.find(item => item.id === req.body.acct_id);
                                if (isParent) {
                                    if (!t.finished) { t.rollback(); }
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.PREVENT_UPDATE_PARENT_ACCOUNT);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, isParent.acct_name, req.body.acct_name, '');
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: messageContent,
                                        err: null,
                                        data: null
                                    });
                                }
                            }
                            return AcctAcctMst.update(req.body, {
                                where: {
                                    acct_id: req.body.acct_id
                                },
                                fields: inputFields,
                                transaction: t
                            }).then((chartofaccount) => {
                                if (chartofaccount) {
                                    proceedTransction(req, manageChartOfAccountsInElastic);
                                }
                                t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(chartOfAccountsModuleName)));
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err.errors.map(e => e.message).join(','),
                                        data: null
                                    });
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        COMMON.setModelCreatedByFieldValue(req);
                        return getSystemIdPromise(req, res, DATA_CONSTANT.CHARTOFACCOUNTSSYSTEMID, t).then((chartofaccount) => {
                            if (chartofaccount.status === STATE.SUCCESS) {
                                req.body.systemid = chartofaccount.systemId;
                                return AcctAcctMst.create(req.body, {
                                    fields: inputFields,
                                    transaction: t
                                }).then((chartofaccountResponse) => {
                                    if (chartofaccountResponse) {
                                        req.params['id'] = chartofaccountResponse.acct_id;
                                        proceedTransction(req, manageChartOfAccountsInElastic);
                                    }
                                    t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, chartofaccountResponse, MESSAGE_CONSTANT.CREATED(chartOfAccountsModuleName)));
                                }
                                ).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err.errors.map(e => e.message).join(','),
                                            data: null
                                        });
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
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: chartofaccount.message,
                                    err: chartofaccount.err ? chartofaccount.err : null,
                                    data: null
                                });
                            }
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err.errors.map(e => e.message).join(','),
                            data: null
                        });
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                }));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Remove Chart of Accounts
    // POST : /api/v1/acct_acctmst/deleteChartOfAccount
    // @return list of Chart of Accounts by ID
    deleteChartOfAccount: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs && req.body.objIDs.acct_id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.CHART_OF_ACCOUNT.Name,
                    IDs: req.body.objIDs.acct_id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    deleteChartOfAccountsDetailInElastic(req.body.objIDs.acct_id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(chartOfAccountsModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.acct_id }, null);
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

    // Check Account Name and code exist or not
    // post:/api/v1/acct_acctmst/checkDuplicateChartOfAccountFormField
    // @retrun validity of chart of accout form field
    checkDuplicateChartOfAccountFormField: (req, res) => {
        const { AcctAcctMst } = req.app.locals.models;
        if (req.body) {
            const where = {};

            if (req.body.acct_name) { where.acct_name = req.body.acct_name; }
            if (req.body.acct_code) { where.acct_code = req.body.acct_code; }
            if (req.body.acct_id) { where.acct_id = { [Op.ne]: req.body.acct_id }; }

            return AcctAcctMst.findOne({
                where: where,
                attributes: ['acct_id']
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
                }
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
