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

const supplierAttributeTemplate = DATA_CONSTANT.SUPPLIER_ATTRIBUTE_TEMPLATE.Name;
const supplierAttributeTemplateInputFields = [
    'id',
    'name',
    'supplierID',
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

const supplierAttributeTemplateDetailInputFields = [
    'id',
    'supplierAttributeTemplateID',
    'attributeID',
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

    // Retrive list of Supplier Attribute Template
    // POST : /api/v1/supplierAttributeTemplate/retrieveSupplierAttributeList
    // @returns list of Supplier Attribute Template List
    retrieveSupplierAttributeList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveSupplierAttributeTemplate (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    SupplierAttributeTemplate: _.values(response[1]),
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


    // validate Supplier Attribute template name
    // GET : /api/v1/supplierAttributeTemplate/checkSupplierAttributeTemplateUnique
    // @return Supplier Attribute Template name Exist
    checkSupplierAttributeTemplateUnique: (req, res) => {
        const {
            SupplierAttributeTemplateMst
        } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            const whereClauseName = {
                name: req.body.name
            };
            const whereClauseSupplier = {
                supplierID: req.body.supplierID
            };

            if (req.body.id) {
                whereClauseSupplier.id = {
                    [Op.ne]: req.body.id
                };
                whereClauseName.id = {
                    [Op.ne]: req.body.id
                };
            }
            if (req.body.name) {
                promises.push(SupplierAttributeTemplateMst.findAll({
                    where: whereClauseName,
                    attributes: ['id', 'name']
                }));
            }
            if (req.body.supplierID) {
                promises.push(SupplierAttributeTemplateMst.findAll({
                    where: whereClauseSupplier,
                    attributes: ['id', 'supplierID']
                }));
            }

            return Promise.all(promises).then((resp) => {
                if (resp) {
                    if ((resp[0] && resp[0].length > 0) && (resp[1] && resp[1].length > 0)) {
                        return {
                            duplicateRecord: true
                        };
                    } else if (resp[0] && resp[0].length > 0) {
                        return {
                            name: true,
                            supplier: false
                        };
                    } else if (resp[1] && resp[1].length > 0) {
                        return {
                            name: false,
                            supplier: true
                        };
                    } else {
                        return false;
                    }
                } else {
                    return false;
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
    // validate Supplier Attribute template name and supplier
    // GET : /api/v1/supplierAttributeTemplate/checkSupplierAttributeTemplateUniqueUI
    // @return Supplier Attribute Template name and supplier Exist
    checkSupplierAttributeTemplateUniqueUI: (req, res) => {
        const {
            SupplierAttributeTemplateMst
        } = req.app.locals.models;
        if (req.body) {
            const promises = [];
            const whereClauseName = {
                name: req.body.name
            };
            const whereClauseSupplier = {
                supplierID: req.body.supplierID
            };

            if (req.body.id) {
                whereClauseSupplier.id = {
                    [Op.ne]: req.body.id
                };
                whereClauseName.id = {
                    [Op.ne]: req.body.id
                };
            }
            if (req.body.name) {
                promises.push(SupplierAttributeTemplateMst.findAll({
                    where: whereClauseName,
                    attributes: ['id', 'name']
                }));
            } else {
                promises.push(SupplierAttributeTemplateMst.findAll({
                    where: whereClauseSupplier,
                    attributes: ['id', 'supplierID']
                }));
            }
            return Promise.all(promises).then((resp) => {
                if (resp) {
                    if (resp[0] && resp[0].length > 0) {
                        const errorObj = req.body.name ? {
                            name: true
                        } : {
                            supplier: true
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, errorObj, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                    }
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // To retrieve supplier attribute template
    // @return supplier attribute template
    getSupplierAttributeTemplateByID: (req, res) => {
        const {
            SupplierAttributeTemplateMst,
            SupplierAttributeTemplateDet
        } = req.app.locals.models;
        if (req.params.id) {
            return SupplierAttributeTemplateMst.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'name', 'supplierID'],
                include: [{
                    model: SupplierAttributeTemplateDet,
                    as: 'supplier_attribute_template_det',
                    attributes: ['id', 'attributeID'],
                    required: false
                }]
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
    // To check duplication of attributes for template
    // @return duplicate attributes
    checkDuplicateAttribute: (req, res, createAttribute) => {
        const {
            SupplierAttributeTemplateDet,
            QuoteDynamicFields
        } = req.app.locals.models;
        const attributeIDs = _.map(createAttribute, 'id');
        return SupplierAttributeTemplateDet.findAll({
            where: {
                supplierAttributeTemplateID: req.body.id,
                attributeID: {
                    [Op.in]: attributeIDs
                }
            },
            include: [{
                model: QuoteDynamicFields,
                as: 'quotecharges_dynamic_fields_mst',
                attributes: ['id', 'fieldName'],
                required: false
            }]
        }).then((response) => {
            if (response) {
                return response;
            } else {
                return false;
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
    },
    // save Supplier Attribute template
    // POST : /api/v1/supplierAttributeTemplate/saveSupplierAttributeTemplate
    saveSupplierAttributeTemplate: (req, res) => {
        const {
            SupplierAttributeTemplateMst,
            SupplierAttributeTemplateDet,
            sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            return sequelize.transaction().then(t => module.exports.checkSupplierAttributeTemplateUnique(req, res).then((data) => {
                    if (data) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: data
                        });
                    } else {
                        return SupplierAttributeTemplateDet.findAll({
                            where: {
                                supplierAttributeTemplateID: req.body.id
                            },
                            attributes: ['id', 'attributeID']
                        }).then((response) => {
                            const createAttribute = _.filter(req.body.selectedAttributes, item => !item.supplierAttributeTemplateDetID);
                            const updateAttributes = _.filter(req.body.selectedAttributes, item => item.supplierAttributeTemplateDetID);
                            const updateAttributeIDs = _.map(updateAttributes, 'supplierAttributeTemplateDetID');
                            const attributeIDs = _.map(response, 'id');
                            const removeAttributes = _.difference(attributeIDs, updateAttributeIDs);
                            const supplierAttributePromise = [];
                            return module.exports.checkDuplicateAttribute(req, res, createAttribute).then((isExist) => {
                                if (isExist && isExist.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: null,
                                        err: null,
                                        data: isExist
                                    });
                                } else {
                                    COMMON.setModelUpdatedByFieldValue(req);
                                    supplierAttributePromise.push(
                                        SupplierAttributeTemplateMst.update(req.body, {
                                            where: {
                                                id: req.body.id
                                            },
                                            fields: supplierAttributeTemplateInputFields,
                                            transaction: t
                                        }));
                                    if (createAttribute.length > 0) {
                                        const createList = _.map(createAttribute, item => ({
                                                supplierAttributeTemplateID: req.body.id,
                                                attributeID: item.id
                                            }));
                                        COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                                        supplierAttributePromise.push(
                                            SupplierAttributeTemplateDet.bulkCreate(createList, {
                                                fields: supplierAttributeTemplateDetailInputFields,
                                                transaction: t
                                            }));
                                    }
                                    if (removeAttributes.length > 0) {
                                        const deleteObj = {
                                            isDeleted: 1
                                        };
                                        const whereClause = {
                                            supplierAttributeTemplateID: req.body.id,
                                            id: {
                                                [Op.in]: removeAttributes
                                            }
                                        };
                                        COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                                        supplierAttributePromise.push(SupplierAttributeTemplateDet.update(deleteObj, {
                                            where: whereClause,
                                            fields: supplierAttributeTemplateDetailInputFields,
                                            transaction: t
                                        }));
                                    }
                                    return Promise.all(supplierAttributePromise).then(() => {
                                        t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(supplierAttributeTemplate)));
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
            return sequelize.transaction().then(t => module.exports.checkSupplierAttributeTemplateUnique(req, res).then((data) => {
                    if (data) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: null,
                            err: null,
                            data: data
                        });
                    } else {
                        COMMON.setModelCreatedByFieldValue(req);
                        return SupplierAttributeTemplateMst.create(req.body, {
                            fields: supplierAttributeTemplateInputFields,
                            transaction: t
                        }).then((response) => {
                            const createList = _.map(req.body.selectedAttributes, item => ({
                                    supplierAttributeTemplateID: response.id,
                                    attributeID: item.id
                                }));
                            COMMON.setModelCreatedArrayFieldValue(req.user, createList);
                            return SupplierAttributeTemplateDet.bulkCreate(createList, {
                                fields: supplierAttributeTemplateDetailInputFields,
                                transaction: t
                            }).then((result) => {
                                t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, MESSAGE_CONSTANT.CREATED(supplierAttributeTemplate)));
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

    // Supplier Attribute template delete
    // POST : /api/v1/supplierAttributeTemplate/deleteSupplierAttributeTemplate
    // @return delete supplier quote
    deleteSupplierAttributeTemplate: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = COMMON.AllEntityIDS.SUPPLIER_ATTRIBUTE_TEMPLATE_MST.Name;

            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(supplierAttributeTemplate))).catch((err) => {
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

    // GET : /api/v1/supplierAttributeTemplate/getSupplierList
    // @return List of Supplier
    getSupplierList: (req, res) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        return MfgCodeMst.findAll({
            where: {
                [Op.or]: {
                    mfgType: DATA_CONSTANT.MFGCODE.MFGTYPE.DIST,
                    id: -7
                },
                isActive: true
            },
            attributes: ['mfgCode', 'mfgName', 'id'],
            order: [
                ['mfgName', 'ASC']
            ]
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