const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { getSystemIdPromise } = require('../../utility/controllers/UtilityController');
const { proceedTransction, manageAccountTypeInElastic, deleteAccountTypeDetailInElastic } = require('../../enterprise_search/controllers/Enterprise_SearchController');

const accountTypeModuleName = DATA_CONSTANT.ACCOUNT_TYPE.NAME;

const inputFields = [
    'systemid',
    'class_code',
    'class_name',
    'parent_class_id',
    'description',
    'disp_order',
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
    'isSubType'
];

module.exports = {
    // Get detail of Account Types list
    // GET : /api/v1/acctclassmst/getAccountTypeList
    // @return detail of Account Type
    getAccountTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_GetAccountTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { AccountTypeList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get detail of Account Types list for auto complate or all records of the `acct_classmst` table
    // GET : /api/v1/acctclassmst/getAllAccountTypeList
    // @return detail of Account Type
    getAllAccountTypeList: (req, res) => {
        const AcctClassMst = req.app.locals.models.AcctClassMst;

        AcctClassMst.findAll({
            order: [
                ['disp_order', 'ASC']
            ]
        }).then(accountTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, accountTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // get list of Account type by search key
    // GET : /api/v1/acctclassmst/getAccountTypeBySearch
    // @return list of Account Type Detail
    getAccountTypeBySearch: (req, res) => {
        const AcctClassMst = req.app.locals.models.AcctClassMst;

        if (req.body) {
            const where = {};

            if (req.body.searchString) {
                where.class_name =
                {
                    [Op.like]: `%${req.body.searchString}%`
                };
            }

            if (req.body.parent_class_id) {
                where.class_id = {
                    [Op.ne]: req.body.parent_class_id
                };
            }

            if (req.body.class_id) {
                where.class_id = req.body.class_id;
            }

            return AcctClassMst.findAll({
                where: where,
                attributes: ['class_id', 'class_name', 'class_code']
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

    // get detail of account class by ID
    // GET : /api/v1/acctclassmst/getAccountType/:id
    // @return detail of Account Type
    getAccountTypeById: (req, res) => {
        if (req.params && req.params.id) {
            const { AcctClassMst } = req.app.locals.models;

            return AcctClassMst.findByPk(req.params.id).then((response) => {
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

    // Create Account Type
    // POST : /api/v1/acctclassmst/saveAccountType
    // @return created account
    saveAccountType: (req, res) => {
        if (req.body) {
            const { AcctClassMst, sequelize } = req.app.locals.models;
            if (req.body.class_code) {
                req.body.class_code = req.body.class_code.toUpperCase();
            }
            const where = {
                [Op.or]: [{
                    class_code: req.body.class_code,
                    isDeleted: false
                }, {
                    class_name: req.body.class_name,
                    isDeleted: false
                }]
            };
            if (req.body.class_id) {
                where.class_id = {
                    [Op.ne]: req.body.class_id
                };
            }

            return sequelize.transaction().then(t => AcctClassMst.findOne({
                where: where,
                transaction: t
            }).then((accountTypeResponse) => {
                if (accountTypeResponse) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, accountTypeResponse.class_name === req.body.class_name ? 'Account Type Name' : 'Account Type Code');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                } else if (req.body.class_id) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return sequelize.query('CALL Sproc_checkAccountTypeRef (:pParentClassId)', {
                        replacements: {
                            pParentClassId: req.body.parent_class_id
                        },
                        transaction: t
                    }).then((accountTypeRefId) => {
                        if (accountTypeRefId) {
                            const isParent = accountTypeRefId.find(item => item.id === req.body.class_id);
                            if (isParent) {
                                if (!t.finished) { t.rollback(); }
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.PREVENT_UPDATE_PARENT_ACCOUNT);
                                messageContent.message = COMMON.stringFormat(messageContent.message, isParent.class_name, req.body.class_name, ' Type');
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
                                });
                            }
                        }
                        return AcctClassMst.update(req.body, {
                            where: {
                                class_id: req.body.class_id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then((response) => {
                            if (response) {
                                proceedTransction(req, manageAccountTypeInElastic);
                            }
                            t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(accountTypeModuleName)));
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
                    return getSystemIdPromise(req, res, DATA_CONSTANT.ACCOUNTTYPESYSTEMID, t).then((response) => {
                        if (response.status === STATE.SUCCESS) {
                            req.body.systemid = response.systemId;
                            return AcctClassMst.create(req.body, {
                                fields: inputFields,
                                transaction: t
                            }).then((accountType) => {
                                if (accountType) {
                                    req.params['id'] = accountType.class_id;
                                    proceedTransction(req, manageAccountTypeInElastic);
                                }
                                t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, accountType, MESSAGE_CONSTANT.CREATED(accountTypeModuleName)));
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
                            });
                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: response.message || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: response.err ? response.err : null,
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Remove Account Type
    // POST : /api/v1/acct_classmst/deleteAccountType
    // @return list of Account Types by ID
    deleteAccountType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.class_id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.ACCOUNT_TYPE.Name,
                    IDs: req.body.objIDs.class_id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    deleteAccountTypeDetailInElastic(req.body.objIDs.class_id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(accountTypeModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.class_id }, null);
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

    // Check Account Type Name and code exist or not
    // post:/api/v1/acct_classmst/checkDuplicateAccountTypeFormField
    // @return validity of account type form field
    checkDuplicateAccountTypeFormField: (req, res) => {
        const { AcctClassMst } = req.app.locals.models;
        if (req.body) {
            const where = {};

            if (req.body.class_name) { where.class_name = req.body.class_name; }
            if (req.body.class_code) { where.class_code = req.body.class_code; }
            if (req.body.class_id) { where.class_id = { [Op.ne]: req.body.class_id }; }

            return AcctClassMst.findOne({
                where: where,
                attributes: ['class_id']
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