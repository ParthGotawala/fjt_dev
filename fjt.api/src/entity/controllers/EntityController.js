const _ = require('lodash');
const { Op } = require('sequelize');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const entityModuleName = DATA_CONSTANT.ENTITY.NAME;
const entityEmployeeModuleName = DATA_CONSTANT.ENTITY.ENTITY_EMPLOYEE_NAME;
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const { stringFormat } = require('../../constant/Common');
// const { USER } = require('../../../constant/data_constant');

const inputFields = [
    'entityID',
    'entityName',
    'remark',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'columnView',
    'entityStatus',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'entityPermission',
    'isDataEntity'
];

module.exports = {
    // Retrive list of entities
    // POST : /api/v1/entities/retriveEntitiesList
    // @return list of entities
    retriveEntitiesList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveEntities (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pisUserSuperAdmin,:ploginEmployeeID,:pisSystemGeneratedEntity)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pisUserSuperAdmin: req.body.isUserSuperAdmin,
                    ploginEmployeeID: req.body.loginEmployeeID ? req.body.loginEmployeeID : null,
                    pisSystemGeneratedEntity: req.body.isSystemGeneratedEntity
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive detail of entities
    // GET : /api/v1/entities/:id
    // @param {id} int
    // @return detail of entities
    retriveEntities: (req, res) => {
        const { Entity, DataElement } = req.app.locals.models;
        if (req.params.id) {
            // Entity.findByPk(req.params.id)
            return Entity.findOne({
                where: {
                    entityID: req.params.id
                },
                include: [{
                    model: DataElement,
                    as: 'dataElement',
                    attributes: ['dataElementID', 'dataElementName', 'formatMask', 'decimal_number'],
                    required: false
                }]
            }).then((entity) => {
                if (!entity) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createEntity: (req, res) => {
        const { sequelize, Entity, DynamicReportAccess } = req.app.locals.models;
        if (req.body) {
            return Entity.findAll({
                where: { entityName: req.body.entityName }
            }).then((entitylist) => {
                if (entitylist.length > 0) {
                    // const fieldName = stringFormat(Object.assign({}, DATA_CONSTANT.ENTITY_UNIQUE_FIELD.NAME));
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.ENTITY_NAME_EXISTS);
                    if (entitylist.systemGenerated === true) {
                        messageContent.message = stringFormat(messageContent.message, req.body.entityName, 'data tracking entity');
                    } else {
                        messageContent.message = stringFormat(messageContent.message, req.body.entityName, 'custom form');
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                }
                COMMON.setModelCreatedByFieldValue(req);
                req.body.isDataEntity = true;
                return sequelize.transaction(t => Entity.create(req.body, {
                    fields: inputFields,
                    transaction: t
                }).then((entity) => {
                    if (req.body.systemGenerated === true) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, MESSAGE_CONSTANT.CREATED(entityModuleName));
                    } else {
                        /* add employee to access custom forms */
                        const customFormAccesslist = [];
                        _.each(req.body.employeeListForAccessCustomForm, (item) => {
                            const obj = {};
                            obj.EmployeeID = item;
                            obj.refTransID = entity.dataValues.entityID;
                            obj.refTableName = COMMON.DBTableName.Entity;
                            customFormAccesslist.push(obj);
                        });
                        // / Add Entity detail into Elastic Search Engine for Enterprise Search
                        if (entity) {
                            req.params['entityID'] = entity.entityID;
                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageEntityDetailInElastic);
                        }
                        COMMON.setModelCreatedArrayFieldValue(req.user, customFormAccesslist);
                        return DynamicReportAccess.bulkCreate(customFormAccesslist, {
                            transaction: t
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, MESSAGE_CONSTANT.CREATED(req.body.entityName ? req.body.entityName : entityModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(req.body.entityName ? req.body.entityName : entityModuleName), err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                }));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    updateEntity: (req, res) => {
        const { Entity } = req.app.locals.models;
        if (req.params.id) {
            Entity.findOne({
                where: {
                    entityID: req.params.id
                }
            }).then((entitydata) => {
                if (!entitydata) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(req.body.entityName ? req.body.entityName : entityModuleName), err: null, data: null });
                }
                COMMON.setModelUpdatedByFieldValue(req);
                return Entity.update(req.body, {
                    where: {
                        entityID: req.params.id
                    },
                    fields: inputFields
                }).then((rowsUpdated) => {
                    // / Update Entity detail into Elastic Search Engine for Enterprise Search
                    if (rowsUpdated) {
                        req.params['entityId'] = req.params.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageEntityDetailInElastic);
                        // send notification if status changed
                        if (req.body.entityStatus !== undefined && req.body.entityStatus !== entitydata.entityStatus) {
                            return module.exports.sendNotificationOfCustomFormStatus(req, res, entitydata).then((resNotification) => {
                                if (resNotification && resNotification.state === STATE.SUCCESS) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entityID: req.params.id }, MESSAGE_CONSTANT.UPDATED(req.body.entityName ? req.body.entityName : entityModuleName));
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entityID: req.params.id }, MESSAGE_CONSTANT.UPDATED(req.body.entityName ? req.body.entityName : entityModuleName));
                        }
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(req.body.entityName ? req.body.entityName : entityModuleName), err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    deleteEntity: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Entity.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: req.body.objIDs.CountList,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((entityDetail) => {
                    if (entityDetail.length === 0) {
                        // Remove Department Detail from Elastic Engine Database
                        EnterpriseSearchController.deleteEntityDetailInElastic(req.body.objIDs.id.toString());
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entityDetail, MESSAGE_CONSTANT.DELETED(req.body.objIDs.entityType ? req.body.objIDs.entityType : entityModuleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: entityDetail, IDs: req.body.objIDs.id }, null);
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

    getEntity: (req, res) => {
        const Entity = req.app.locals.models.Entity;
        Entity.findAll({
            where: {
                entityName: req.params.entityID
            }
        }, { attributes: ['entityName', 'entityID'] }).then(entity => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    getEntityByName: (req, res) => {
        const Entity = req.app.locals.models.Entity;
        if (req.body && req.body.name) {
            Entity.findOne({
                where: {
                    entityName: req.body.name
                }
            }).then(entity => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, entity, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getAllEntityWithUniqueDataElement: (req, res) => {
        const { Entity, DataElement } = req.app.locals.models;
        Entity.findAll({
            include: [{
                model: DataElement,
                as: 'dataElement',
                attributes: ['dataElementID', 'dataElementName', 'isUnique'],
                where: {
                    isUnique: true
                },
                required: false
            }]
        }).then((entitylist) => {
            if (!entitylist) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(entityModuleName), err: null, data: null });
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    /* Get Data Element List for all entities*/
    getAllEntityWithDataElements: (req, res) => {
        const { Entity, DataElement } = req.app.locals.models;
        Entity.findAll({
            include: [{
                model: DataElement,
                as: 'dataElement',
                attributes: ['dataElementID', 'dataElementName', 'formatMask', 'decimal_number'],
                required: false
            }]
        }).then((entitylist) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    /* Get Data Element List for all entity ids*/
    getWithDataElementsByEntityIds: (req, res) => {
        const { Entity, DataElement } = req.app.locals.models;
        Entity.findAll({
            where: {
                entityID: { [Op.in]: [req.params.EntityIds] }
            },
            include: [{
                model: DataElement,
                as: 'dataElement',
                attributes: ['dataElementID', 'dataElementName', 'formatMask', 'decimal_number'],
                required: false
            }]
        }).then(entitylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    /* Get custom form entities with data Elements by user access permission */
    getAllCustomFormEntityByAccessPermissionOfEmployee: (req, res) => {
        const { Entity, DataElement, DynamicReportAccess } = req.app.locals.models;
        const whereClause = { systemGenerated: false };

        if (req.query && req.query.searchquery) {
            whereClause.entityName = {
                [Op.like]: `%${req.query.searchquery}%`
            };
        }
        if (req.query.loginEmployeeID) {
            return Entity.findAll({
                where: whereClause,
                include: [{
                    model: DataElement,
                    as: 'dataElement',
                    attributes: ['dataElementID', 'dataElementName', 'formatMask', 'decimal_number'],
                    required: true
                },
                {
                    where: {
                        refTableName: COMMON.DBTableName.Entity,
                        EmployeeID: req.query.loginEmployeeID
                    },
                    model: DynamicReportAccess,
                    as: 'dynamicReportAccess',
                    attributes: ['EmployeeID'],
                    required: true
                }
                ]
            }).then(entitylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // retrieve all employees for entity access
    // GET : /api/v1/entities/retrieveEntityAllEmployeeDetails
    // @return List of employees including entity details
    retrieveEntityAllEmployeeDetails: (req, res) => {
        const { DynamicReportAccess, Employee, Department, EmployeeDepartment, GenericCategory,
            User, Role } = req.app.locals.models;

        if (req.body.entityID) {
            Employee.findAll({
                attributes: ['id', 'firstName', 'lastName', 'profileImg', 'isActive', 'initialName'],
                where: {
                    isDeleted: false
                },
                include: [{
                    model: DynamicReportAccess,
                    as: 'dynamicReportAccess',
                    attributes: ['EmployeeID', 'entityPermission'],
                    where: {
                        refTableName: COMMON.DBTableName.Entity,
                        refTransID: req.body.entityID
                    },
                    required: false
                },
                {
                    model: EmployeeDepartment,
                    as: 'employeeDepartment',
                    attributes: ['departmentID', 'titleID'],
                    required: false,
                    where: {
                        isDefault: true
                    },
                    include: [{
                        model: Department,
                        as: 'department',
                        attributes: ['deptName']
                    },
                    {
                        model: GenericCategory,
                        as: 'genericCategory',
                        attributes: ['gencCategoryName']
                    }]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['employeeID','id'],
                    include: [
                        {
                            model: Role,
                            as: 'roles',
                            attributes: ['id'],
                            through: {
                                where: {
                                    deletedAt: null
                                }
                            }
                        }
                    ]
                }
                ]
            }).then((getEmployeeData) => {
                if (!getEmployeeData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(entityEmployeeModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEmployeeData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // add all selected employees for access entity
    // GET : /api/v1/entities/createEntityEmployeeList
    // @return List of employees added for entity (here success only)
    createEntityEmployeeList: (req, res) => {
        const { sequelize, DynamicReportAccess } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.employeeList) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.employeeList);
            return sequelize.transaction().then(t => DynamicReportAccess.bulkCreate(req.body.listObj.employeeList, {
                individualHooks: true,
                transaction: t
            }).then(() => t.commit().then(() => {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.EMPLOYEE_ADDED_TO_ACCESS);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'entity');
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            })).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // delete all selected employees for not accessing entity
    // GET : /api/v1/entities/deleteEntityEmployeeList
    // @return List of employees removed for entity (here success only)
    deleteEntityEmployeeList: (req, res) => {
        const { sequelize, DynamicReportAccess } = req.app.locals.models;
        if (req.body && req.body.EmployeeIDs && req.body.refTransID) {
            COMMON.setModelDeletedByFieldValue(req);
            return sequelize.transaction().then(t => DynamicReportAccess.update(req.body, {
                where: {
                    refTransID: req.body.refTransID,
                    EmployeeID: req.body.EmployeeIDs,
                    deletedAt: null
                },
                fields: inputFields,
                transaction: t
            }).then(() => t.commit().then(() => {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.EMPLOYEE_DELETED_FROM_ACCESS);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'entity');
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            })).catch((err) => {
                if (!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // update employee permission
    // GET : /api/v1/entities/updateEntityEmployeePermission
    // @return Success.
    updateEntityEmployeePermission: (req, res) => {
        const { DynamicReportAccess } = req.app.locals.models;
        if (req.body && req.body.updateList) {
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.updateList);
            const promises = [];
            _.each(req.body.updateList, (item) => {
                promises.push(DynamicReportAccess.update(item, {
                    where: {
                        refTransID: item.refTransID,
                        EmployeeID: item.EmployeeID,
                        refTableName: item.refTableName,
                        deletedAt: null
                    },
                    fields: ['entityPermission', 'updatedBy', 'updatedAt']
                })
                );
            });
            return Promise.all(promises).then(() => {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.ENTITY_PERMISSION_UPDATED);
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, messageContent);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Check entity name exist or not
    // post:/api/v1/entities/checkDuplicateEntityName
    // @retrun uniqueness of entity code
    checkDuplicateEntityName: (req, res) => {
        const { Entity } = req.app.locals.models;
        if (req.body) {
            const whereClauseEntity = {
                entityName: req.body.entityName
            };
            if (req.body.entityID) {
                whereClauseEntity.entityID = { [Op.notIn]: [req.body.entityID] };
            }

            return Entity.findOne({
                where: whereClauseEntity
            }).then((entityExists) => {
                if (entityExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateEntityName: true, systemGenerated: entityExists.systemGenerated } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateEntityName: false });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    //* Get custom/fixed form entities
    // post:/api/v1/entities/getAllEntity
    // @retrun list of custom entity
    getAllEntity: (req, res) => {
        const { Entity, User } = req.app.locals.models;
        const whereClause = {};

        if (req.query && req.query.searchquery) {
            whereClause.entityName = {
                [Op.like]: `%${req.query.searchquery}%`
            };
            whereClause.systemGenerated = req.query.systemGenerated ? (req.query.systemGenerated === 'true' ? true : false) : null;
        }
        if (!req.query.isUserSuperAdmin) {
            User.findOne({
                where: {
                    employeeID: req.query.loginEmployeeID
                },
                attributes: ['id']
            }).then((userid) => {
                if (userid) {
                    whereClause.createdBy = userid.id;

                    return Entity.findAll({
                        where: whereClause,
                        attributes: ['entityID', 'entityName']
                    }).then(entitylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null)).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
                }
            });
        } else {
            Entity.findAll({
                where: whereClause,
                attributes: ['entityID', 'entityName']
            }).then((entitylist) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // Send Notification & Socket IO of  custom form status change
    // GET : /api/v1/entities/sendNotificationOfCustomFormStatus
    // @return API response
    // eslint-disable-next-line consistent-return
    sendNotificationOfCustomFormStatus: (req, res, entityData) => {
        if (req.params && req.params.id) {
            const receiverID = [];
            let recvID;
            let oldStatus;
            let newStatus;
            const { DynamicReportAccess, User } = req.app.locals.models;

            return DynamicReportAccess.findAll({
                where: {
                    refTransID: req.params.id,
                    refTableName: DATA_CONSTANT.ENTITY.NAME.toLowerCase(),
                    deletedAt: null
                },
                attributes: ['EmployeeID']
            }).then((empList) => {
                if (empList && empList.length > 0) {
                    _.each(empList, (item) => {
                        // if (item.EmployeeID != req.user.employeeID) {
                        recvID = isNaN(parseInt(item.EmployeeID)) ? null : parseInt(item.EmployeeID);
                        receiverID.push(recvID);
                        oldStatus = (entityData.entityStatus === DATA_CONSTANT.ENTITY.STATUS.PUBLISHED) ? DATA_CONSTANT.ENTITY_STATUS[1].Name : DATA_CONSTANT.ENTITY_STATUS[0].Name;
                        newStatus = (req.body.entityStatus === DATA_CONSTANT.ENTITY.STATUS.PUBLISHED) ? DATA_CONSTANT.ENTITY_STATUS[1].Name : DATA_CONSTANT.ENTITY_STATUS[0].Name;
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.CUSTOM_FORM_STATUS_CHANGE_NOTIFICATION);
                        messageContent.message = COMMON.stringFormat(messageContent.message, entityData.entityName, oldStatus, newStatus, req.user.employee.initialName);
                        const socketData = {
                            recvID: recvID,
                            messageContent: messageContent,
                            entityID: entityData.entityID
                            // entityName: entityData.entityName,
                            // entityStatus: (req.body.entityStatus == DATA_CONSTANT.ENTITY.STATUS.PUBLISHED) ? DATA_CONSTANT.ENTITY_STATUS[1].Name : DATA_CONSTANT.ENTITY_STATUS[0].Name
                        };
                        RFQSocketController.sendNotificationOfCustomFormStatus(req, socketData);// recvID);// socketData);
                        // }
                    });
                    const whereClause = {
                        [Op.and]:
                            { employeeID: { [Op.notIn]: receiverID }, defaultLoginRoleID: 1 }
                    };

                    return User.findAll({
                        where: whereClause,
                        attributes: ['employeeID']
                    }).then((resUser) => {
                        _.each(resUser, (item) => {
                            // if (item.employeeID != req.user.employeeID) {
                            recvID = isNaN(parseInt(item.employeeID)) ? null : parseInt(item.employeeID);
                            receiverID.push(recvID);
                            oldStatus = (entityData.entityStatus === DATA_CONSTANT.ENTITY.STATUS.PUBLISHED) ? DATA_CONSTANT.ENTITY_STATUS[1].Name : DATA_CONSTANT.ENTITY_STATUS[0].Name;
                            newStatus = (req.body.entityStatus === DATA_CONSTANT.ENTITY.STATUS.PUBLISHED) ? DATA_CONSTANT.ENTITY_STATUS[1].Name : DATA_CONSTANT.ENTITY_STATUS[0].Name;
                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.CUSTOM_FORM_STATUS_CHANGE_NOTIFICATION);
                            messageContent.message = COMMON.stringFormat(messageContent.message, entityData.entityName, oldStatus, newStatus, req.user.employee.initialName);

                            const socketData = {
                                recvID: recvID,
                                messageContent: messageContent,
                                entityID: entityData.entityID
                            };
                            RFQSocketController.sendNotificationOfCustomFormStatus(req, socketData);
                            // }
                        });

                        const data = {
                            senderID: parseInt(req.user.employeeID) || null,
                            receiver: receiverID,
                            employeeID: recvID
                        };

                        const notificationMst = {
                            subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CUSTOM_FORM_STATUS_CHANGE.SUBJECT, entityData.entityName),
                            messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CUSTOM_FORM_STATUS_CHANGE.TYPE,
                            messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CUSTOM_FORM_STATUS_CHANGE.SUBTYPE,
                            jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CUSTOM_FORM_STATUS_CHANGE.JSONDATA(data),
                            redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CUSTOM_FORM_STATUS_CHANGE.REDIRECTURL, req.params.id),
                            isActive: true
                        };
                        data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.CUSTOM_FORM_STATUS_CHANGE.MESSAGE);
                        NotificationMstController.updateCommonDetails(notificationMst, data);
                        return NotificationMstController.saveCommNotificationFn(req, notificationMst).then((resp) => {
                            if (resp && resp.notificationMst) {
                                req.body.notificationMst = {
                                    id: resp.notificationMst.id,
                                    senderID: data.senderID
                                };
                            }
                            req.body.subject = notificationMst.subject;
                            return { state: STATE.SUCCESS };
                            // return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
                        }).catch(() => {
                            console.trace();
                            console.error();
                            return { state: STATE.FAILED };
                        });
                    });
                } else {
                    return { state: STATE.SUCCESS };
                }
            }).catch(() => {
                console.trace();
                console.error();
                return { state: STATE.FAILED };
            });
        }
    },

    // Get Generic Report Category List
    // Post : /api/v1/entities/retrieveGenericReportCategories
    // @return Generic Report Category List
    retrieveGenericReportCategories: (req, res) => {
        const { GenericCategory } = req.app.locals.models;

        var whereClause = { categoryType: 'Report Category' };
        if (req.body.listObj.query) {
            whereClause.gencCategoryName = {
                [Op.like]: `%${req.body.listObj.query}%`
            };
        }
        if (req.body.listObj.id) {
            whereClause.gencCategoryID = {
                [Op.eq]: `${req.body.listObj.id}`
            };
        }

        return GenericCategory.findAll({
            where: whereClause
        }).then((categorylist) => {
            categorylist = categorylist && Array.isArray(categorylist) && categorylist.length > 0 ? categorylist : [];
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, categorylist, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get System Generated Entity list
    // GET : /api/v1/entities/retrieveSystemGeneratedEntities
    // @return System Generated Entity list
    retrieveSystemGeneratedEntities: (req, res) => {
        const { Entity } = req.app.locals.models;
        return Entity.findAll({
            where: { systemGenerated: true },
            attributes: ['entityID', 'entityName']
        }).then(entitylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { entity: entitylist }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }

};
