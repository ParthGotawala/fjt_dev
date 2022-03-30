// / <reference path="../../../constant/message_constant.js" />
const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const masterTemplateStatusModuleName = DATA_CONSTANT.MASTER_TEMPLATE;

const inputFields = [
    'masterTemplate',
    'description',
    'isMasterTemplate',
    'systemGenerated',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const OperationMasterTemplatesInputFields = [
    'masterTemplateId',
    'operationId',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {
    // Retrive list of mastertemplate
    // POST : /api/v1/mastertemplate/retriveMasterTemplateList
    // @return list of mastertemplate
    retriveMasterTemplateList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveMasterTemplate (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:poperationIds,:pdescription,:pfilterStatus)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    poperationIds: req.body.operationIds,
                    pdescription: req.body.description || null,
                    pfilterStatus: req.body.filterStatus || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { mastertemplate: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                // new NotFound(MASTERTEMPLATE.NOT_FOUND));
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive MasterTemplate by ID
    // GET : /api/v1/mastertemplate/:id
    // @param {id} int
    retriveMasterTemplate: (req, res) => {
        if (req.params.id) {
            const MasterTemplate = req.app.locals.models.MasterTemplate;
            return MasterTemplate.findByPk(req.params.id).then((mastertemplate) => {
                if (!mastertemplate) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {});
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mastertemplate, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createMasterTemplate: (req, res) => {
        const MasterTemplate = req.app.locals.models.MasterTemplate;
        if (req.body) {
            return MasterTemplate.findOne({
                where: {
                    masterTemplate: req.body.masterTemplate,
                    isDeleted: false
                },
                model: MasterTemplate,
                attributes: ['id', 'masterTemplate']
            }).then((duplicateTemplate) => {
                if (duplicateTemplate && duplicateTemplate.id) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, MESSAGE_CONSTANT.MASTER.MASTER_TEMPLATE_UNIQUE);
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return MasterTemplate.create(req.body, {
                        fields: inputFields
                    }).then(mastertemplate => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mastertemplate, MESSAGE_CONSTANT.MASTER.MASTERTEMPLATE_CREATED)).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update master template
    // POST : /api/v1/mastertemplate/updateMasterTemplate
    // @return updated detail for master template
    updateMasterTemplate: (req, res) => {
        const { MasterTemplate } = req.app.locals.models;
        if (req.params.id) {
            return MasterTemplate.findOne({
                where: {
                    masterTemplate: req.body.masterTemplate,
                    isDeleted: false,
                    id: { [Op.ne]: req.params.id }
                },
                model: MasterTemplate,
                attributes: ['id', 'masterTemplate']
            }).then((duplicateTemplate) => {
                if (duplicateTemplate && duplicateTemplate.id) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.MASTER_TEMPLATE_UNIQUE, err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return MasterTemplate.update(req.body, {
                        where: {
                            id: req.params.id
                        },
                        fields: inputFields
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: req.params.id }, MESSAGE_CONSTANT.MASTER.MASTERTEMPLATE_UPDATED);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.MASTERTEMPLATE_NOT_UPDATED, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deleteMasterTemplate: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const tableName = COMMON.AllEntityIDS.MasterTemplate.Name;

        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete(:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((templateDetail) => {
                if (templateDetail.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.MASTERTEMPLATE_DELETED);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: templateDetail, IDs: req.body.objIDs.id }, null);
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

    retrieveOperationMasterTemplate: (req, res) => {
        const { sequelize, MasterTemplate, Operation, OperationMasterTemplates } = req.app.locals.models;
        if (req.params.id) {
            return MasterTemplate.findByPk(req.params.id).then((data) => {
                if (data) {
                    const obj = {};
                    obj.mastertemplate = data;
                    Operation.findAll({
                        attributes: ['opID', 'opName', 'opNumber', 'opStatus', 'shortDescription', 'isMoveToStock', [sequelize.fn('fun_getMountingTypeNameByID', sequelize.col('Operation.mountingTypeId')), 'mountingType'],
                            [sequelize.fn('fun_getGenericCategoryNameByID', sequelize.col('Operation.operationTypeID')), 'operationType'], [sequelize.fn('fun_getOpStatusNameByID', sequelize.col('Operation.opStatus')), 'opStatusConvertedValue']],
                        include: [{
                            model: OperationMasterTemplates,
                            as: 'operationMasterTemplates'
                        }]
                    }).then((mastertemplate) => {
                        if (!mastertemplate) {
                            return Promise.reject(MESSAGE_CONSTANT.MASTER.MASTERTEMPLATE_NOT_FOUND);
                        }
                        obj.operationList = mastertemplate;
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(masterTemplateStatusModuleName.Name), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                // new NotFound(MASTERTEMPLATE.NOT_FOUND), err.errors, err.fields);
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createOperation_MasterTemplateList: (req, res) => {
        const { sequelize, OperationMasterTemplates } = req.app.locals.models;
        if (req.body && req.body.listObj) {
            if (req.body && req.body.listObj && req.body.listObj.operationList) {
                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.operationList);
                return sequelize.transaction().then(t => OperationMasterTemplates.bulkCreate(req.body.listObj.operationList, {
                    individualHooks: true,
                    transaction: t
                }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_SAVED_FOR_MASTERTEMPLATE))).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
            }
            if (req.body && req.body.listObj && req.body.listObj.masterTemplateList) {
                COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.masterTemplateList);
                return sequelize.transaction().then(t => OperationMasterTemplates.bulkCreate(req.body.listObj.masterTemplateList, {
                    individualHooks: true,
                    transaction: t
                }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVED_FOR_MASTERTEMPLATE))).catch((err) => {
                    if (t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }));
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deleteOperation_MasterTemplateList: (req, res) => {
        const { sequelize, OperationMasterTemplates } = req.app.locals.models;
        var where = {};
        if (req.query) {
            if (req.query && req.query.masterTemplateId && req.query.operationIds) {
                where = {
                    masterTemplateId: req.query.masterTemplateId,
                    operationId: req.query.operationIds,
                    deletedAt: null
                };
            }
            if (req.query && req.query.operationId && req.query.masterTemplateIds) {
                where = {
                    masterTemplateId: req.query.masterTemplateIds,
                    operationId: req.query.operationId,
                    deletedAt: null
                };
            }
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then(t => OperationMasterTemplates.update(req.body, {
                where: where,
                fields: OperationMasterTemplatesInputFields
            }).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, (req.query.masterTemplateIds ? MESSAGE_CONSTANT.MASTER.REMOVED_FROM_MASTERTEMPLATE : MESSAGE_CONSTANT.MASTER.OPERATION_REMOVED_FROM_MASTERTEMPLATE)))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getMasterTemplateList: (req, res) => {
        const MasterTemplate = req.app.locals.models.MasterTemplate;
        const whereClause = {
            isActive: true
        };
        if (req.query.searchquery) {
            whereClause.masterTemplate = {
                [Op.like]: `%${req.query.searchquery}%`
            };
            whereClause.systemGenerated = { [Op.ne]: true };
        }
        MasterTemplate.findAll({
            where: whereClause,
            attributes: ['masterTemplate', 'id']
        }).then((mastertemplate) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mastertemplate, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    getMasterTemplateOperationList: (req, res) => {
        const { Operation, OperationMasterTemplates } = req.app.locals.models;
        if (req.params.id) {
            Operation.findAll({
                where: { opStatus: COMMON.DisplayStatus.Published.ID },
                attributes: ['opID', 'opName', 'opNumber', 'opStatus'],
                include: [{
                    model: OperationMasterTemplates,
                    as: 'operationMasterTemplates',
                    where: {
                        masterTemplateId: req.params.id
                    },
                    attributes: []
                }]
            }).then(opmastertemplate => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, opmastertemplate, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                // new NotFound(OperationMasterTemplates.NOT_FOUND));
            });
        }
    },

    // Copy master template check template name unique validation
    // POST : /api/v1/mastertemplate/copyMasterTemplate
    // @return List of copy operation and template
    copyMasterTemplate: (req, res) => {
        const { MasterTemplate, Operation, OperationMasterTemplates, sequelize } = req.app.locals.models;
        if (req.body && req.body.objCopyMasterTemplate) {
            const copyMaster = req.body.objCopyMasterTemplate;
            if (copyMaster.isCheckForDraftOperation) {
                return OperationMasterTemplates.findAll({
                    where: { masterTemplateId: copyMaster.copyID },
                    include: [{
                        model: Operation,
                        as: 'operations',
                        where: { opStatus: 0 },
                        attributes: ['opID'],
                        required: true
                    }],
                    attributes: []
                }).then(template => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDraftOperations: template.length > 0 ? true : false }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                return MasterTemplate.findOne({
                    where: { masterTemplate: copyMaster.masterTemplate, isDeleted: false },
                    model: MasterTemplate,
                    attributes: ['id', 'masterTemplate']
                }).then((template) => {
                    if (template && template.id) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.MASTER_TEMPLATE_UNIQUE, err: null, data: null });
                    } else {
                        copyMaster.createdBy = req.user.id;
                        return MasterTemplate.create(copyMaster, {
                            fields: inputFields
                        }).then((copyTemplate) => {
                            return sequelize.query('CALL Sproc_copyMasterTemplate (:pcopyTemplate,:puserID,:pTemplateID)', {
                                replacements: {
                                    pcopyTemplate: copyMaster.copyID,
                                    puserID: req.user.id,
                                    pTemplateID: copyTemplate.id
                                },
                                type: sequelize.QueryTypes.SELECT
                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { id: copyTemplate.id }, MESSAGE_CONSTANT.MASTER.COPY_TEMPLATE)).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Check Role Name exist or not
    // post:/api/v1/checkDuplicateRoleName
    // @retrun validity of Role Name
    checkDublicateMasterTemplate: (req, res) => {
        const { MasterTemplate } = req.app.locals.models;
        if (req.body) {
            const whereClause = {
                masterTemplate: req.body.masterTemplate
            };
            if (req.body.id) {
                whereClause.id = { [Op.notIn]: [req.body.id] };
            }
            return MasterTemplate.findOne({
                where: whereClause,
                attributes: ['id']
            }).then((mastertemplate) => {
                if (mastertemplate) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateMasterTemplate: true } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateMasterTemplate: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update master template status (Draft/Publish)
    // POST : /api/v1/mastertemplate/saveMasterTemplateStatus
    // @return updated status detail for master template
    saveMasterTemplateStatus: (req, res) => {
        if (req.body.masterTemplateID) {
            const { MasterTemplate } = req.app.locals.models;
            return MasterTemplate.findOne({
                where: {
                    id: req.body.masterTemplateID
                },
                attributes: ['masterTemplate']
            }).then((existsTemplate) => {
                if (!existsTemplate) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return MasterTemplate.update(req.body, {
                        where: {
                            id: req.body.masterTemplateID
                        },
                        fields: ['masterTemplateStatus', 'updatedBy', 'updatedAt', 'updateByRoleId']
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(masterTemplateStatusModuleName.Status));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(masterTemplateStatusModuleName.Status), err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get all master template by template status
    // POST : /api/v1/mastertemplate/getMasterTemplateListByTemplateStatus
    // @return all required master template list
    getMasterTemplateListByTemplateStatus: (req, res) => {
        if (req.body && req.body.masterTemplateStatus && req.body.masterTemplateStatus.toString().length > 0) {
            const MasterTemplate = req.app.locals.models.MasterTemplate;
            return MasterTemplate.findAll({
                where: {
                    isActive: true,
                    masterTemplateStatus: req.body.masterTemplateStatus
                },
                attributes: ['masterTemplate', 'id']
            }).then(mastertemplate => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mastertemplate, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};