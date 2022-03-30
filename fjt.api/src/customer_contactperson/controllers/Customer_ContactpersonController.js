const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { proceedTransction, manageContactPersonInElastic, deleteContactPersonDetailInElastic, manageMFGCodeDetailInElastic } = require('../../enterprise_search/controllers/Enterprise_SearchController');

const customerContactModule = DATA_CONSTANT.CUSTOMER_CONTACTPERSON;

const inputFields = [
    //'customerId',
    'refTransID',
    'refTableName',
    'firstName',
    'middleName',
    'lastName',
    'email',
    'division',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'isDeleted',
    'deletedAt',
    'isDefault',
    'systemGenerated',
    'additionalComment',
    'isPrimary',
    'title',
    'isActive',
    'phoneNumber',
    'mailToCategory'
];

module.exports = {
    // Retrive list of Contact Person
    // POST : /api/v1/customer_contactperson/retrieveContactPersonList
    // @returns list of Contact Person
    retrieveContactPersonList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveContactPersonList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:prefEntityType,:pisPrimary,:pisDefault,:pmfgId,:padditionalComment,:pempId,:pnameSearch,:pcheckNameType)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    prefEntityType: req.body.refEntityType || null,
                    pisPrimary: req.body.isPrimary || false,
                    pisDefault: req.body.isDefault || false,
                    pmfgId: req.body.mfgIds || null,
                    padditionalComment: req.body.additionalComment || null,
                    pempId: req.body.empIds || null,
                    pnameSearch: req.body.nameSearch || null,
                    pcheckNameType: req.body.checkNameType || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                ContactPerson: _.values(response[1]),
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

    // Create customer contact person
    // POST : /api/v1/customer_contactperson
    // @return API response
    createCustomerContactPerson: (req, res) => {
        const { ContactPerson, sequelize } = req.app.locals.models;
        if (req.body.refTableName && (req.body.refTableName === customerContactModule.REF_TABLE_NAMES.Personnel || req.body.refTransID)) {
            if (req.body.firstName) { req.body.firstName = COMMON.TEXT_WORD_CAPITAL(req.body.firstName, false); }
            if (req.body.middleName) { req.body.middleName = COMMON.TEXT_WORD_CAPITAL(req.body.middleName, false); }
            if (req.body.lastName) { req.body.lastName = COMMON.TEXT_WORD_CAPITAL(req.body.lastName, false); }
            if (req.body.email) { req.body.email = req.body.email.toLowerCase(); }

            return sequelize.transaction().then((t) => {
                const promises = [];
                if (req.body.isDefault && req.body.refTransID) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    promises.push(ContactPerson.update({ isDefault: false }, {
                        where: {
                            refTableName: req.body.refTableName,
                            refTransID: req.body.refTransID,
                            isDefault: true
                        },
                        fields: ['isDefault'],
                        transaction: t
                    }));
                } else if (req.body.refTransID) {
                    promises.push(module.exports.getActiveContPersonCountByEntity(req, res).then((response) => {
                        if (response && response.status === STATE.SUCCESS) {
                            // If It is First Contact person of customer, then make it as default contact person.
                            if (response.data === 0) {
                                req.body.isDefault = true;
                            }
                            return Promise.resolve(true);
                        } else {
                            return response;
                        }
                    }));
                }

                return Promise.all(promises).then((result) => {
                    if (result && Array.isArray(result)) {
                        const resObj = _.find(result, resp => resp && (resp.status === STATE.FAILED));
                        if (resObj) {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: resObj.messageContent ? resObj.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: resObj.err || null,
                                data: null
                            });
                        } else {
                            COMMON.setModelCreatedByFieldValue(req);
                            return ContactPerson.create(req.body, {
                                fields: inputFields,
                                transaction: t
                            }).then(contactperson => t.commit().then(() => {
                                if (contactperson) {
                                    req.params['personId'] = contactperson.personId;
                                    proceedTransction(req, manageContactPersonInElastic);
                                    if (contactperson.isPrimary && contactperson.refTransID && contactperson.refTableName === DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.TABLE_NAME) {
                                        req.params['mfgId'] = contactperson.refTransID;
                                        proceedTransction(req, manageMFGCodeDetailInElastic);
                                    }
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, contactperson, MESSAGE_CONSTANT.CREATED(customerContactModule.NAME));
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            })).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) t.rollback();
                                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                                } else {
                                    resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                }
                            });
                        }
                    } else {
                        if (!t.finished) t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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

    // Update customer contact person
    // PUT : /api/v1/customer_contactperson
    // @param {personId} int
    // @return API response
    updateCustomerContactPerson: (req, res) => {
        const { ContactPerson, sequelize } = req.app.locals.models;
        if (req.body.refTableName && (req.body.refTableName === customerContactModule.REF_TABLE_NAMES.Personnel || req.body.refTransID)) {
            if (req.body.firstName) { req.body.firstName = COMMON.TEXT_WORD_CAPITAL(req.body.firstName, false); }
            if (req.body.middleName) { req.body.middleName = COMMON.TEXT_WORD_CAPITAL(req.body.middleName, false); }
            if (req.body.lastName) { req.body.lastName = COMMON.TEXT_WORD_CAPITAL(req.body.lastName, false); }
            if (req.body.email) { req.body.email = req.body.email.toLowerCase(); }

            return sequelize.transaction().then((t) => {
                COMMON.setModelUpdatedByFieldValue(req);

                const promises = [];
                if (req.body.isDefault && req.body.refTransID) {
                    promises.push(ContactPerson.update({ isDefault: false }, {
                        where: {
                            personId: { [Op.ne]: req.params.personId },
                            refTransID: req.body.refTransID,
                            refTableName: req.body.refTableName,
                            isDefault: true
                        },
                        fields: ['isDefault', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                        transaction: t
                    }));
                } if (!req.body.isActive && req.body.refTransID) {
                    promises.push(module.exports.getActiveContPersonCountByEntity(req, res).then((response) => {
                        if (response && response.status === STATE.SUCCESS) {
                            if (response.data === 1) {
                                return ContactPerson.findOne({
                                    where: {
                                        personId: { [Op.ne]: req.params.personId },
                                        refTableName: req.body.refTableName,
                                        refTransID: req.body.refTransID,
                                        isActive: true,
                                        isDefault: false,
                                        isDeleted: false
                                    },
                                    order: [
                                        ['personId', 'ASC']
                                    ],
                                    transaction: t,
                                    attributes: ['personId']
                                }).then((contPerson) => {
                                    if (contPerson) {
                                        const updateObj = {
                                            isDefault: true
                                        };
                                        COMMON.setModelUpdatedByFieldValue(updateObj);
                                        return ContactPerson.update(updateObj, {
                                            where: {
                                                personId: contPerson.dataValues.personId
                                            },
                                            fields: ['isDefault', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            transaction: t
                                        });
                                    } else {
                                        return Promise.resolve(true);
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
                                return Promise.resolve(true);
                            }
                        } else {
                            return response;
                        }
                    }));
                }

                return Promise.all(promises).then((result) => {
                    if (result && Array.isArray(result)) {
                        return ContactPerson.update(req.body, {
                            where: {
                                personId: req.params.personId
                            },
                            fields: inputFields,
                            transaction: t
                        }).then(response => t.commit().then(() => {
                            if (response && response[0] > 0) {
                                req.params['personId'] = req.params.personId;
                                proceedTransction(req, manageContactPersonInElastic);
                                if (req.body.isRefTypeChanged || req.body.isPrimaryChanged) {
                                    if (req.body.refTransID && (req.body.refTableName === DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.TABLE_NAME)) {
                                        req.params['mfgId'] = req.body.refTransID;
                                        proceedTransction(req, manageMFGCodeDetailInElastic);
                                    }
                                    if (req.body.isRefTypeChanged) {
                                        const reqObj = _.cloneDeep(req);
                                        if (reqObj.body.oldRefTransID && (reqObj.body.oldRefTableName === DATA_CONSTANT.ELASTIC_MODELS.MFG_CODE_MASTER_FIELD.TABLE_NAME)) {
                                            reqObj.params['mfgId'] = reqObj.body.oldRefTransID;
                                            proceedTransction(reqObj, manageMFGCodeDetailInElastic);
                                        }
                                    }
                                }
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { personId: req.params.personId, isDefault: req.body.isDefault }, MESSAGE_CONSTANT.UPDATED(customerContactModule.NAME));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            }
                        });
                    } else {
                        if (!t.finished) t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) { t.rollback(); }
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
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

    // Delete customer contact person
    // POST : /api/v1/customer_contactperson/deleteCustomerContactPerson
    // @return API response
    deleteCustomerContactPerson: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.CONTACTPERSON.Name;
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
                if (response) {
                    if (response.length === 0 && !req.body.objIDs.isForOnlyCountList) {
                        deleteContactPersonDetailInElastic(req.body.objIDs.id.toString());
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(customerContactModule.NAME));
                    } else {
                        return resHandler.successRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            transactionDetails: response,
                            IDs: req.body.objIDs.id
                        }, null);
                    }
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get List of contact Person
    // GET : /api/v1/getCustomerContactPersons
    // @return List of contact Person
    getContactPersons: async (req, res) => {
        if (req.body.refTransID && req.body.refTableName) {
            const { ContactPerson, sequelize } = req.app.locals.models;

            try {
                var cpNamefunDetail = await sequelize.query('Select fun_getContPersonNameDisplayFormat() as contPersonNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            const whereClause = {
                refTransID: req.body.refTransID,
                refTableName: req.body.refTableName,
                isDeleted: false
            };
            if (req.body.activePerson) {
                whereClause.isActive = true;
            }
            if (req.body.isOnlyPrimaryPerson) {
                whereClause.isPrimary = true;
            }
            return await ContactPerson.findAll({
                where: whereClause,
                order: [
                    ['isDefault', 'DESC'],
                    ['isPrimary', 'DESC'],
                    ['firstName', 'ASC'],
                ],
                attributes: ['personId', 'refTransID', 'refTableName', 'isActive',
                    [sequelize.literal('CONCAT(firstName , \' \' ,IFNULL(middleName,\'\'),\' \' , lastName)'), 'fullName'], 'firstName', 'middleName', 'lastName', 'email', 'division', 'customerId', 'isDefault', 'isPrimary', 'additionalComment', 'title', 'phoneNumber', 'isActive',
                    [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('ContactPerson.firstName'), sequelize.col('ContactPerson.middleName'), sequelize.col('ContactPerson.lastName'), cpNamefunDetail[0].contPersonNameFormat), 'personFullName'], [sequelize.fn('fun_convertJsonEmailToCommaSepList', sequelize.col('ContactPerson.email')), 'emailList'],
                    [sequelize.fn('fun_getCategoryWisePhonesFromJsonList', sequelize.col('ContactPerson.phoneNumber')), 'phoneList'], [sequelize.fn('fun_getPrimaryEmailFromJsonList', sequelize.col('ContactPerson.email')), 'primaryEmail']]
            }).then(entity => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of contact Person for selected customer/supplier/manufacturer
    // GET : /api/v1/customer_contactperson/getCustomerContactPersonList
    // @return List of contact Person for customer/supplier/manufacturer
    getCustomerContactPersonList: async (req, res) => {
        //if (req.body.customerId) {
        if (req.body.refTransID && req.body.refTableName) {
            const { ContactPerson, sequelize } = req.app.locals.models;

            try {
                var cpNamefunDetail = await sequelize.query('Select fun_getContPersonNameDisplayFormat() as contPersonNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }

            return await ContactPerson.findAll({
                where: {
                    //customerId: req.body.customerId,
                    refTransID: req.body.refTransID,
                    refTableName: req.body.refTableName,
                    deletedAt: null
                },
                order: [
                    ['isDefault', 'DESC'],
                    ['isPrimary', 'DESC'],
                    ['firstName', 'ASC'],
                ],
                attributes: ['personId', 'refTransID', 'refTableName', 'firstName', 'middleName', 'lastName', 'email', 'division', 'customerId', 'isDefault', 'isPrimary', 'additionalComment', 'title', 'phoneNumber', 'isActive', [sequelize.fn('fun_GetFormattedContactPersonName', sequelize.col('ContactPerson.firstName'), sequelize.col('ContactPerson.middleName'), sequelize.col('ContactPerson.lastName'), cpNamefunDetail[0].contPersonNameFormat), 'personFullName'], [sequelize.fn('fun_convertJsonEmailToCommaSepList', sequelize.col('ContactPerson.email')), 'emailList'], [sequelize.fn('fun_getCategoryWisePhonesFromJsonList', sequelize.col('ContactPerson.phoneNumber')), 'phoneList']]
            }).then(contactList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, contactList, null)).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            resHandler.errorRes(res, 200, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    
    // Set Customer contact person as default
    // PUT : /api/v1/customer_contactperson/setCustContactPersonDefault
    // @return API response
    setCustContactPersonDefault: (req, res) => {
        if (req.body.personId && req.body.refTransID && req.body.refTableName) {
            const { ContactPerson, sequelize } = req.app.locals.models;
            const removeSetDefaultContPrsnObj = {
                isDefault: false
            };
            COMMON.setModelUpdatedByObjectFieldValue(req.user, removeSetDefaultContPrsnObj);

            return sequelize.transaction().then(t => ContactPerson.update(removeSetDefaultContPrsnObj, {
                where: {
                    refTransID: req.body.refTransID,
                    refTableName: req.body.refTableName,
                    isDefault: true,
                    isDeleted: false
                },
                fields: ['isDefault', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                transaction: t
            }).then(() => {
                if (req.body.isDefault) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return ContactPerson.update(req.body, {
                        where: {
                            personId: req.body.personId
                        },
                        fields: ['isDefault', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                        transaction: t
                    }).then(() => t.commit().then(() => {
                        const msgContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ITEM_SET_AS_DEFAULT);
                        msgContent.message = COMMON.stringFormat(msgContent.message, 'Contact');
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msgContent);
                    })).catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return t.commit().then(() => {
                        const msgContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ITEM_REMOVE_AS_DEFAULT);
                        msgContent.message = COMMON.stringFormat(msgContent.message, 'Contact');
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msgContent);
                    });
                }
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrive list of Employees / Contact Persons
    // POST : /api/v1/customer_contactperson/retrieveEmployeeContactpersonList
    // @returns list of Employees / Contact Persons
    retrieveEmployeeContactpersonList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && (req.body.personId || req.body.empId)) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveEmployeeContactpersonList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:ppersonId,:pempId)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    ppersonId: req.body.personId || null,
                    pempId: req.body.empId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                EmpOrCpList: _.values(response[1]),
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

    // get Contact person List for Autocomplete.
    // POST : /api/v1/customer_contactperson/getContactPersonList
    // @return Contact person List
    getContactPersonList: async (req, res) => {
        if (req.body && req.body.contactPersonInfo) {
            const { sequelize, ContactPerson, EmployeeContactPerson, Employee } = req.app.locals.models;
            let whereClause = { isActive: true };

            if (req.body.contactPersonInfo.searchObj && req.body.contactPersonInfo.searchObj.searchQuery) {
                whereClause[Op.and] = [
                    sequelize.where(sequelize.fn('fun_GetContactPersonNameForAutocomplete', sequelize.col('ContactPerson.firstName'), sequelize.col('ContactPerson.middleName'), sequelize.col('ContactPerson.lastName'), sequelize.col('ContactPerson.title'), sequelize.col('ContactPerson.division')), { [Op.like]: `%${req.body.contactPersonInfo.searchObj.searchQuery}%` }),
                ]
            }

            if (req.body.contactPersonInfo && req.body.contactPersonInfo.refTableName) {
                whereClause.refTableName = req.body.contactPersonInfo.refTableName;
            }
            if (req.body.contactPersonInfo.searchObj && req.body.contactPersonInfo.searchObj.personId) {
                whereClause.personId = {
                    [Op.eq]: `${req.body.contactPersonInfo.searchObj.personId}`
                };
            }
            if (req.body.contactPersonInfo.id && req.body.contactPersonInfo.id) {
                whereClause.personId = {
                    [Op.ne]: `${req.body.contactPersonInfo.id}`
                };
            }
            try {
                var functionDetail = await sequelize.query('Select fun_getEmployeeDisplayFormat() as employeeNameFormat ', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }

            return await ContactPerson.findAll({
                where: whereClause,
                order: [
                    ['firstName', 'ASC']
                ],
                include: [{
                    model: EmployeeContactPerson,
                    as: 'employeeContactPerson',
                    where: {
                        releasedAt: null
                    },
                    attributes: ['id'],
                    required: false,
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: [[sequelize.fn('fun_GetEmployeeFormattedName', sequelize.col('employeeContactPerson.employee.firstName'), sequelize.col('employeeContactPerson.employee.middleName'), sequelize.col('employeeContactPerson.employee.lastName'), sequelize.col('employeeContactPerson.employee.initialName'), functionDetail[0].employeeNameFormat), 'formattedEmpName']],
                        required: false
                    }]
                }],
                attributes: ['personId', 'title', 'division', [sequelize.fn('fun_GetContactPersonNameForAutocomplete', sequelize.col('ContactPerson.firstName'), sequelize.col('ContactPerson.middleName'), sequelize.col('ContactPerson.lastName'), sequelize.col('ContactPerson.title'), sequelize.col('ContactPerson.division')), 'fullName']]
            }).then((response) => {
                //const contactPersonList = _.filter(response, (item) => ((item && item.dataValues.employeeContactPerson && item.dataValues.employeeContactPerson.length > 0) ? (item.dataValues.employeeContactPerson[0].id ? false : true) : true));
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    contactPersonList: response
                }, null);
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

    // To retrieve ContactPerson by id
    // Get: /api/v1/customer_contactperson/getContactPersonById
    // @return ContactPersons
    getContactPersonById: (req, res) => {
        const { ContactPerson } = req.app.locals.models;
        if (req.params.id) {
            return ContactPerson.findOne({
                where: {
                    personId: req.params.id,
                    isDeleted: false
                },
                attributes: ['personId', 'refTransID', 'refTableName', 'firstName', 'middleName', 'lastName', 'email', 'division', 'isDefault', 'systemGenerated', 'additionalComment', 'isPrimary', 'title', 'isActive', 'phoneNumber', 'mailToCategory']
            }).then((response) => {
                if (response) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(customerContactModule.NAME), err: null, data: null });
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

    // Set/Remove Customer contact person(s) as Primary Person
    // PUT : /api/v1/customer_contactperson/managePrimaryContactPersons
    // @return API response
    managePrimaryContactPersons: (req, res) => {
        if (req.body.personIds && req.body.personIds.length > 0) {
            const { ContactPerson } = req.app.locals.models;

            const updateObj = {
                isPrimary: req.body.isPrimary
            };
            COMMON.setModelUpdatedByFieldValue(updateObj);
            return ContactPerson.update(updateObj, {
                where: {
                    personId: { [Op.in]: req.body.personIds }
                },
                fields: ['isPrimary', 'updatedBy', 'updateByRoleId', 'updatedAt']
            }).then(() => {
                _.forEach(req.body.personIds, (item) => {
                    if (item) {
                        const reqObj = _.cloneDeep(req);
                        reqObj.params['personId'] = item;
                        proceedTransction(reqObj, manageContactPersonInElastic);
                    }
                });
                if (req.body.refTransID && req.body.refTableName) {
                    req.params['mfgId'] = req.body.refTransID;
                    proceedTransction(req, manageMFGCodeDetailInElastic);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(customerContactModule.NAME));
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

    // Create customer contact person
    // POST : /api/v1/
    // @return API response
    createPrimaryContactPersons: (req, res, t) => {
        const { ContactPerson } = req.app.locals.models;

        if (req.body.primaryContPersonsDet && req.body.primaryContPersonsDet.length > 0) {
            const promises = [];

            // Validation: Always Need refTransID.
            const invalidRecord = _.some(req.body.primaryContPersonsDet, (contPerson) => (!contPerson.refTableName || (!contPerson.refTransID && req.body.refTableName !== customerContactModule.REF_TABLE_NAMES.Personnel)));
            if (invalidRecord) {
                return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER };
            }

            const isDefaultPersonAdded = _.find(req.body.primaryContPersonsDet, (contPerson) => contPerson.isDefault);
            if (isDefaultPersonAdded) {
                // Validation: Only one Contact person can set as Deafult Person at time.
                const isDefaultObj = { isDefault: false };
                COMMON.setModelUpdatedByFieldValue(isDefaultObj);
                promises.push(ContactPerson.update(isDefaultObj, {
                    where: {
                        refTableName: isDefaultPersonAdded.refTableName,
                        refTransID: isDefaultPersonAdded.refTransID,
                        isDefault: true
                    },
                    fields: ['isDefault', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                    transaction: t
                }));
            } else if (req.body.primaryContPersonsDet.length === 1) {
                req.body.primaryContPersonsDet[0].isDefault = true;
            }

            return Promise.all(promises).then((result) => {
                if (result && Array.isArray(result)) {
                    _.forEach(req.body.primaryContPersonsDet, (contPerson) => {
                        COMMON.setModelCreatedByFieldValue(contPerson);
                        if (contPerson.firstName) { contPerson.firstName = COMMON.TEXT_WORD_CAPITAL(contPerson.firstName, false); }
                        if (contPerson.middleName) { contPerson.middleName = COMMON.TEXT_WORD_CAPITAL(contPerson.middleName, false); }
                        if (contPerson.lastName) { contPerson.lastName = COMMON.TEXT_WORD_CAPITAL(contPerson.lastName, false); }
                        if (contPerson.email) { contPerson.email = contPerson.email.toLowerCase(); }
                    });

                    return ContactPerson.bulkCreate(req.body.primaryContPersonsDet, {
                        fields: inputFields,
                        transaction: t
                    }).then((contactperson) => {
                        const personIds = _.map(contactperson, (item) => item.dataValues.personId);
                        return { status: STATE.SUCCESS, data: { personIds: personIds } };
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, err: err };
                    });
                } else {
                    return { status: STATE.FAILED };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            });
        } else {
            return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER };
        }
    },

    // To retrieve Entity wise Active Contactperson Count.
    getActiveContPersonCountByEntity: (req, res) => {
        const { ContactPerson } = req.app.locals.models;
        if (req.body.refTableName && req.body.refTransID) {
            const whereClause = {
                refTableName: req.body.refTableName,
                refTransID: req.body.refTransID,
                isActive: true,
                isDeleted: false
            };
            if (req.body.personId) {
                whereClause.personId = { [Op.ne]: req.body.personId };
            }
            return ContactPerson.count({
                where: whereClause
            }).then(response => ({ status: STATE.SUCCESS, data: response })).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED };
            });
        } else {
            return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER };
        }
    }
};
