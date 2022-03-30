const uuidv1 = require('uuid/v1');
const fsextra = require('fs-extra');
const fs = require('fs');
const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'attributeName',
    'fieldType',
    'icon',
    'defaultValue',
    'description',
    'isActive',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId'
];

const ComponentDynamicAttributeModuleName = DATA_CONSTANT.COMPONENT_PART_DYNAMIC_ATTRIBUTE.NAME;
module.exports = {
    // Create Part Dynamic Attribute
    // POST : /api/v1/rfqsetting/createPartDynamicAttribute
    // @return created Part Dynamic Attribute
    createPartDynamicAttribute: (req, res) => {
        const dir = DATA_CONSTANT.COMPONENT_PART_DYNAMIC_ATTRIBUTE.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && req.files.fileArray) {
                const file = req.files.fileArray;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.icon = fileName;
                return fsextra.move(file.path, path, err => module.exports.addPartAttribute(req, res, err));
            } else {
                return module.exports.addPartAttribute(req, res, null);
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    // Common method for add part attribute detail
    addPartAttribute: (req, res, pErr) => {
        const ComponentDynamicAttribute = req.app.locals.models.ComponentDynamicAttribute;
        if (!pErr) {
            COMMON.setModelCreatedByFieldValue(req);
            req.body.defaultValue = req.body.defaultValue === 'null' ? null : req.body.defaultValue;
            return ComponentDynamicAttribute.create(req.body, {
                fields: inputFields
            }).then((result) => {
                if (result) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, MESSAGE_CONSTANT.CREATED(ComponentDynamicAttributeModuleName));
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(ComponentDynamicAttributeModuleName), err: null, data: null });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            console.trace();
            console.error(pErr);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: pErr, data: null });
        }
    },
    // Update Part Dynamic Attribute
    // POST : /api/v1/rfqsetting/updatePartDynamicAttribute
    // @return updated Part Dynamic Attribute
    updatePartDynamicAttribute: (req, res) => {
        const dir = DATA_CONSTANT.COMPONENT_PART_DYNAMIC_ATTRIBUTE.UPLOAD_PATH;
        try {
            if (typeof (req.files) === 'object' && req.files.fileArray) {
                const file = req.files.fileArray;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${file.fieldName}-${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.body.icon = fileName;
                return fsextra.move(file.path, path, err => module.exports.editPartDynamicAttribute(req, res, err));
            } else {
                return module.exports.editPartDynamicAttribute(req, res, null);
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    // Common method for update part attribute
    editPartDynamicAttribute: (req, res, pErr) => {
        const ComponentDynamicAttribute = req.app.locals.models.ComponentDynamicAttribute;
        if (req.body.id) {
            if (!pErr) {
                return ComponentDynamicAttribute.findOne({
                    where: { id: req.body.id },
                    attributes: ['icon']
                }).then((result) => {
                    if (!req.body.icon || (req.body.icon && result && result.icon && req.body.icon !== result.icon)){
                        const path = DATA_CONSTANT.COMPONENT_PART_DYNAMIC_ATTRIBUTE.UPLOAD_PATH;
                        fs.unlink(`${path}${result.icon}`, () => { });
                    }
                    return ComponentDynamicAttribute.findOne({
                        where: {
                            id: { [Op.ne]: req.body.id },
                            attributeName: { [Op.eq]: req.body.attributeName }
                        }
                    }).then((isExists) => {
                        let fieldName;
                        if (isExists) {
                            if (isExists.dataValues.attributeName === req.body.attributeName) {
                                fieldName = DATA_CONSTANT.COMPONENT_DYNAMIC_ATTRIBUTE_UNIQUE_FIELD.NAME;
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, null);
                            }
                        }
                        COMMON.setModelUpdatedByFieldValue(req);
                        req.body.defaultValue = req.body.defaultValue === 'null' ? null : req.body.defaultValue;
                        return ComponentDynamicAttribute.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: inputFields
                        }).then((rowsUpdated) => {
                            if (rowsUpdated[0] === 1) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rowsUpdated, MESSAGE_CONSTANT.UPDATED(ComponentDynamicAttributeModuleName));
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(ComponentDynamicAttributeModuleName), err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    });
                });
            } else {
                console.trace();
                console.error(pErr);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: pErr, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Part Dynamic Attribute
    // POST : /api/v1/rfqsetting/retrivePartDynamicAttributeList
    // @return list of Part dynamic attribute
    retrivePartDynamicAttributeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrievePartDynamicAttributeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { PartStatus: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        });
    },
    // Retrive list of Part Dynamic Attribute
    // GET : /api/v1/rfqsetting/retrivePartDynamicAttribute
    // @return list of Part dynamic attribute
    retrivePartDynamicAttribute: (req, res) => {
        const { ComponentDynamicAttribute } = req.app.locals.models;
        if (req.params.id) {
            return ComponentDynamicAttribute.findOne({
                where: { id: req.params.id }
            }).then((result) => {
                if (!result) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },

    // Remove Part Dynamic Attribute
    // POST : /api/v1/rfqsetting/deletePartDynamicAttribute
    // @return list of Part Dynamic Attribute by ID
    deletePartDynamicAttribute: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: DATA_CONSTANT.COMPONENT_PART_DYNAMIC_ATTRIBUTE.TableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(ComponentDynamicAttributeModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
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
    // Check part dynamic atrribute exist or not
    // post:/api/v1/rfqsetting/checkDuplicatePartDynamicAttribute
    // @retrun validity of part dynamic attribute
    checkDuplicatePartDynamicAttribute: (req, res) => {
        const { ComponentDynamicAttribute } = req.app.locals.models;
        if (req.body) {
            const whereClauseStatus = {
                attributeName: req.body.attributeName
            };
            if (req.body.id) {
                whereClauseStatus.id = { [Op.ne]: req.body.id };
            }
            return ComponentDynamicAttribute.findOne({
                where: whereClauseStatus,
                attributes: ['id']
            }).then((result) => {
                if (result) {
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
    },

    // Get List of Component Dynamic attribute
    // GET : /api/v1/rfqsetting/getPartDynamicAttributeList
    // @param {id} int
    // @return List of Component Dynamic attribute
    getPartDynamicAttributeList: (req, res) => {
        const { ComponentDynamicAttribute, sequelize } = req.app.locals.models;
        ComponentDynamicAttribute.findAll({
            where: {
                isDeleted: false
                // isActive: true
            },
            paranoid: false,
            attributes: ['id', 'attributeName', 'fieldType', 'defaultValue', 'icon', 'description', 'isActive'],
            order: [sequelize.fn('ISNULL', sequelize.col('ComponentDynamicAttribute.displayOrder')), ['displayOrder', 'ASC'], ['attributeName', 'ASC']]
        }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // update Display Order
    // POST:/api/v1/rfqsetting/updateDynamicAttributeDisplayOrder
    updateDynamicAttributeDisplayOrder: (req, res) => {
        const { ComponentDynamicAttribute } = req.app.locals.models;
        var messageContent = {};
        var updateobj = {};
        if (req.body) {
            return ComponentDynamicAttribute.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    displayOrder: req.body.displayOrder,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (isexist && req.body.displayOrder) {
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Display Order');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    updateobj = {
                        displayOrder: req.body.displayOrder,
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: req.body.updateByRoleId
                    };
                    return ComponentDynamicAttribute.update(updateobj, {
                        where: {
                            id: req.body.id,
                            isDeleted: false
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(ComponentDynamicAttributeModuleName))).catch((err) => {
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
    }
};
