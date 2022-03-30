const _ = require('lodash');
const { Op } = require('sequelize');
const {
    STATE,
    COMMON
} = require('../../constant');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.ComponentAlternatePNValidations.NAME;

const inputFields = [
    'id',
    'refRfqPartTypeId',
    'type',
    'fieldTitle',
    'fieldNameToValidate',
    'fieldDataType',
    'matchCriteria',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
module.exports = {
    // Retrieve list of alias parts validation
    // POST : /api/v1/aliasPartsValidation/retrieveAliasPartsValidation
    // @return list of alias Parts Validation
    retrieveAliasPartsValidation: (req, res) => {
        if (req.body) {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        return sequelize.query('CALL Sproc_RetrieveAliasPartsValidation(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.Page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            aliasPartsValidation: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        })).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    } else {
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    }
    },
    // create  alias parts validation
    // POST : /api/v1/aliasPartsValidation/createAliasPartsValidation
    createAliasPartsValidation: (req, res) => {
        const ComponentAlternatePNValidations = req.app.locals.models.ComponentAlternatePNValidations;
        var userID = COMMON.getRequestUserID(req);
        ComponentAlternatePNValidations.findAll({
            where:
            {
                refRfqPartTypeId: req.body.refRfqPartTypeId,
                type: req.body.type,
                isDeleted: false
            },
            attributes: ['id']
        }).then((response) => {
            var newAddedList = [];
            var deletedList = [];
            response.forEach((item) => {
                var typeObj = req.body.aliasPartsValidationList.find(x => x.id === item.id);
                if (!typeObj) {
                    deletedList.push(item.id);
                }
            });
            const aliasList = req.body.aliasPartsValidationList;
            aliasList.forEach((aliasdata) => {
                var data = {
                    createdBy: userID,
                    fieldDataType: aliasdata.fieldDataType,
                    fieldNameToValidate: aliasdata.fieldNameToValidate,
                    fieldTitle: aliasdata.fieldTitle,
                    id: aliasdata.id,
                    matchCriteria: aliasdata.matchCriteria,
                    refRfqPartTypeId: aliasdata.refRfqPartTypeId,
                    type: aliasdata.type
                };
                newAddedList.push(data);
            });
            module.exports.manageAliasForCreate(newAddedList, deletedList, req, res);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    manageAliasForCreate: (newAddedList, deletedList, req, res) => {
        const { ComponentAlternatePNValidations } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);

        var promises = [];
        if (newAddedList.length) {
            _.each(newAddedList, (item) => {
                var whereClause = {};
                if (item.type && item.fieldNameToValidate) {
                    whereClause.refRfqPartTypeId = item.refRfqPartTypeId;
                    whereClause.type = item.type;
                    whereClause.fieldNameToValidate = item.fieldNameToValidate;
                    whereClause.deletedAt = null;
                }
                if (item.id && item.fieldNameToValidate) {
                    whereClause.id = {
                        [Op.notIn]: [item.id]
                    };
                }
                promises.push(ComponentAlternatePNValidations.findOne({
                    where: whereClause
                }).then((isExists) => {
                    if (isExists) {
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.MASTER.FUNCTIONALTYPE_VALIDATIONTYPE_FIELD_UNIQUE
                        };
                    } else if (item.id) {
                        return ComponentAlternatePNValidations.findOne({
                            where: { id: item.id }
                        }).then((response) => {
                            if (!response) {
                                return {
                                    status: STATE.FAILED
                                };
                            } else {
                                item.updatedBy = req.user.id;
                                item.createdAt = COMMON.getCurrentUTC();
                                item.updatedAt = COMMON.getCurrentUTC();
                                item.updateByRoleId = req.user.defaultLoginRoleID;
                                item.createByRoleId = req.user.defaultLoginRoleID;
                                return ComponentAlternatePNValidations.update(item, {
                                    fields: inputFields,
                                    where: { id: item.id }
                                }).then(() => ({
                                    status: STATE.SUCCESS
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED
                                    };
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                            };
                        });
                    } else {
                        item.updatedBy = req.user.id;
                        item.createdAt = COMMON.getCurrentUTC();
                        item.updatedAt = COMMON.getCurrentUTC();
                        item.updateByRoleId = req.user.defaultLoginRoleID;
                        item.createByRoleId = req.user.defaultLoginRoleID;
                        return ComponentAlternatePNValidations.create(item, {
                            fields: inputFields
                        }).then(() => ({
                            status: STATE.SUCCESS
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return {
                                status: STATE.FAILED
                            };
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
            });
        }
        if (deletedList.length) {
            COMMON.setModelDeletedByFieldValue(req);
            const updatedData = {
                deletedAt: COMMON.getCurrentUTC(req),
                isDeleted: true,
                deletedBy: userID
            };
            promises.push(ComponentAlternatePNValidations.update(updatedData, {
                where: {
                    id: { [Op.in]: deletedList }
                },
                fields: ['deletedBy', 'deletedAt', 'isDeleted']
            }).then(() => ({
                status: STATE.SUCCESS
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED
                };
            }));
        }
        return Promise.all(promises).then((AliasPartsValidation) => {
            var resObj = _.find(AliasPartsValidation, resp => resp.status === STATE.FAILED);
            if (resObj) {
                if (resObj.message) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: resObj.message, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(moduleName), err: null, data: null });
                }
            } else {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, AliasPartsValidation, MESSAGE_CONSTANT.CREATED(moduleName));
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // update alias parts validation
    // PUT : /api/v1/aliasPartsValidation/updateAliasPartsValidation
    updateAliasPartsValidation: (req, res) => {
        const ComponentAlternatePNValidations = req.app.locals.models.ComponentAlternatePNValidations;
        var userID = COMMON.getRequestUserID(req);
        ComponentAlternatePNValidations.findAll({
            where: {
                refRfqPartTypeId: req.body.aliasPartsValidationInfo.refRfqPartTypeId,
                type: req.body.aliasPartsValidationInfo.type,
                isDeleted: false
            },
            attributes: ['id']
        }).then((response) => {
            var newAddedList = [];
            var deletedList = [];
            response.forEach((item) => {
                var typeObj = req.body.aliasPartsValidationInfo.aliasPartsValidationList.find(x => x.id === item.id);
                if (!typeObj) {
                    deletedList.push(item.id);
                }
            });
            const aliasList = req.body.aliasPartsValidationInfo.aliasPartsValidationList;
            aliasList.forEach((aliasdata) => {
                var data = {
                    createdBy: userID,
                    updatedBy: userID,
                    fieldDataType: aliasdata.fieldDataType,
                    fieldNameToValidate: aliasdata.fieldNameToValidate,
                    fieldTitle: aliasdata.fieldTitle,
                    id: aliasdata.id,
                    matchCriteria: aliasdata.matchCriteria,
                    refRfqPartTypeId: aliasdata.refRfqPartTypeId,
                    type: aliasdata.type,
                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                newAddedList.push(data);
            });

            module.exports.manageAlias(newAddedList, deletedList, req, res);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    manageAlias: (newAddedList, deletedList, req, res) => {
        const { ComponentAlternatePNValidations } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        var promises = [];
        if (newAddedList.length) {
            _.each(newAddedList, (item) => {
                var whereClause = {};
                if (item.type && item.fieldNameToValidate) {
                    whereClause.refRfqPartTypeId = item.refRfqPartTypeId;
                    whereClause.type = item.type;
                    whereClause.fieldNameToValidate = item.fieldNameToValidate;
                    whereClause.deletedAt = null;
                }
                if (item.id && item.fieldNameToValidate) {
                    whereClause.id = {
                        [Op.notIn]: [item.id]
                    };
                }
                promises.push(ComponentAlternatePNValidations.findOne({
                    where: whereClause
                }).then((isExists) => {
                    if (isExists) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.FUNCTIONALTYPE_VALIDATIONTYPE_FIELD_UNIQUE, err: null, data: null });
                    } else if (item.id) {
                        return ComponentAlternatePNValidations.findOne({
                            where: { id: item.id }
                        }).then((response) => {
                            if (!response) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { type: item.type }, null);
                            } else {
                                // COMMON.setModelCreatedByFieldValue(req);
                                const updateObj = {
                                    fieldNameToValidate: item.fieldNameToValidate,
                                    fieldTitle: item.fieldTitle,
                                    matchCriteria: item.matchCriteria,
                                    updatedBy: userID,
                                    updatedAt: COMMON.getCurrentUTC(),
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                };
                                return ComponentAlternatePNValidations.update(updateObj, {
                                    fields: inputFields,
                                    where: { id: item.id }
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        // COMMON.setModelCreatedByFieldValue(req);
                        return ComponentAlternatePNValidations.create(item, {
                            fields: inputFields
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
            });
        }
        if (deletedList.length) {
            COMMON.setModelDeletedByFieldValue(req);
            const updatedData = {
                deletedAt: COMMON.getCurrentUTC(req),
                isDeleted: true,
                deletedBy: userID,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            promises.push(ComponentAlternatePNValidations.update(updatedData, {
                where: {
                    id: { [Op.in]: deletedList }
                },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
            }));
        }
        return Promise.all(promises).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName))
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Delete alias parts validation
    // POST : /api/v1/aliasPartsValidation/deleteAliasPartsValidation
    // @return API response
    deleteAliasPartsValidation: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objDelete.type) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.ComponentAlternatepnValidations.Name,
                    IDs: req.body.objDelete.type.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: req.body.objDelete.refRfqPartTypeId.toString(),
                    refrenceIDs: null,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName))
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    checkAlternatePartValidationUsed: (req, res) => {
        const { ComponentAlternatePN, Component } = req.app.locals.models;
        if (req.body) {
            const whereClause = {
                type: req.body.objIDs.type
            };

            ComponentAlternatePN.findAll({
                where: whereClause,
                include: [{
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'functionalCategoryID'],
                    required: false
                }]
            }).then((Count) => {
                if (Count) {
                    let fuctinalList = [];
                    fuctinalList = _.filter(Count, data => data.component && data.component.functionalCategoryID === req.body.objIDs.functionalCategoryID);

                    if (fuctinalList.length > 0) {
                        const obj = {
                            cnt: fuctinalList.length,
                            msg: MESSAGE_CONSTANT.PARTS.NAME
                        };
                        // check message
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, fuctinalList.length, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Retrive detail getColumnField
    // GET : /api/v1/aliasPartsValidation/getColumnField
    // @return detail getFiled
    getColumnField: (req, res) => {
        const { BRLabelTemplateManualField } = req.app.locals.models;
        BRLabelTemplateManualField.findAll({
            where: {
                tableName: COMMON.AllEntityIDS.Component.Name,
                deletedAt: null
            },
            attributes: ['tableField', 'displayName', 'fieldDataType']
        }).then(validationsFields => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, validationsFields)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrieve list of alias parts validation
    // GET : /api/v1/aliasPartsValidation/retrieveAliasPartsValidation
    // @return list of alias Parts Validation
    retrieveAliasPartsValidationDetails: (req, res) => {
        const { ComponentAlternatePNValidations } = req.app.locals.models;
        if (req.body.listObj.type) {
            ComponentAlternatePNValidations.findAll({
                where: {
                    refRfqPartTypeId: req.body.listObj.refRfqPartTypeId,
                    type: req.body.listObj.type,
                    isDeleted: false
                },
                attributes: ['id', 'refRfqPartTypeId', 'fieldNameToValidate', 'fieldDataType', 'matchCriteria', 'fieldTitle', 'type']
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // check ipAddress Already Exists
    // POST : /api/v1/scanner/checkipAddressAlreadyExists
    // @return API response
    checkAliasPartsValidationExists: (req, res) => {
        const { ComponentAlternatePNValidations } = req.app.locals.models;
        var whereClause = {};
        if (req.body && req.body.objs.fieldNameToValidate) {
            whereClause = {};
            if (req.body.objs.type && req.body.objs.fieldNameToValidate) {
                whereClause.refRfqPartTypeId = req.body.objs.refRfqPartTypeId;
                whereClause.type = req.body.objs.type;
                whereClause.fieldNameToValidate = req.body.objs.fieldNameToValidate;
                whereClause.deletedAt = null;
            }
            if (req.body.objs.id && req.body.objs.fieldNameToValidate) {
                whereClause.id = {
                    [Op.notIn]: [req.body.objs.id]
                };
            }
            ComponentAlternatePNValidations.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.FUNCTIONALTYPE_VALIDATIONTYPE_FIELD_UNIQUE, err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },
    // Copy alias part validations
    // GET : /api/v1/aliasPartsValidation/copyAliasPartalidations
    // aliasPartsValidation/copyAliasPartalidations
    copyAliasPartalidations: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_CopyAliasPartValidations(:pFromFunctionalTypeId,:pFromPartGroupId,:pFromValidationsDetailsId,:pToFunctionalTypeIds,:pUserRoleId,:pUserid,:pIsOverride)', {
            replacements: {
                pFromFunctionalTypeId: req.body.fromFunctionalTypeId,
                pFromPartGroupId: req.body.fromPartGroupId,
                pFromValidationsDetailsId: req.body.fromValidationsDetailsId || null,
                pToFunctionalTypeIds: req.body.toFunctionalTypeIds,
                pUserRoleId: COMMON.getRequestUserLoginRoleID(req),
                pUserid: req.user.id,
                pIsOverride: req.body.isOverride || false
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.PARTS.PART_ALIAS_VALIDATIONS_COPIED_SUCCESSFULL)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};