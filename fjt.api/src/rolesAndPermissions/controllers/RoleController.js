const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');
const { Op } = require('sequelize');

const roleModuleName = DATA_CONSTANT.ROLE.NAME;
const inputFields = [
    'name',
    'description',
    'slug',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'systemGenerated',
    'accessLevel',
    'isActive',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const inputGenericFolderFields = [
    'gencFolderID',
    'gencFolderName',
    'refTransID',
    'roleId',
    'isDeleted',
    'createdBy'
];

module.exports = {
    updateRole: (req, res) => {
        const { Role } = req.app.locals.models;
        if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, true); }

        return Role.findOne({
            where: {
                name: { [Op.eq]: req.body.name },
                id: { [Op.ne]: req.body.id },
                deletedAt: null
            }
        }).then((roles) => {
            let fieldName;
            if (roles != null) {
                fieldName = (roles.name.toLowerCase() === req.body.name.toLowerCase()) ? DATA_CONSTANT.ROLE_UNIQUE_FIELD_NAME.ROLE_NAME : DATA_CONSTANT.ROLE_UNIQUE_FIELD_NAME.ROLE_ORDER;
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
            } else {
                COMMON.setModelUpdatedByFieldValue(req);
                req.body.slug = _.kebabCase(req.body.name);
                return Role.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    fields: inputFields
                }).then((rowsUpdated) => {
                    if (rowsUpdated[0] === 1) {
                        return Role.findByPk(req.body.id).then((roleres) => {
                            var role = {
                                data: roleres
                            };
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, role, MESSAGE_CONSTANT.UPDATED(roleModuleName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(roleModuleName), err: null, data: null });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    /* if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Role'), err: err, data: null });
                    } else {*/
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    /* }*/
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    deleteRole: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Roles.Name;
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
                }).then((response) => {
                    if (response.length === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, null,
                            MESSAGE_CONSTANT.DELETED(roleModuleName));
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

    // Retrive list of Roles
    // POST : /api/v1/role/retriveRolesList
    // @return list of Roles
    retriveRolesList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveRole (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        roles: _.values(response[1]), Count: response[0][0]['TotalRecord']
                    }, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive Role by ID
    // GET : /api/v1/role/:id
    // @param {id} int
    retrieveRole: (req, res) => {
        if (req.params.id) {
            const Role = req.app.locals.models.Role;
            return Role.findByPk(req.params.id, {
                attributes: ['id', 'name', 'description', 'accessLevel', 'slug', 'systemGenerated', 'isActive']
            }).then((role) => {
                if (!role) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: null, err: null, data: null });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { role: role }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    get: (req, res) => {
        const Role = req.app.locals.models.Role;
        Role.findAll({
        }).then((roles) => {
            if (!roles) {
                return resHandler.errorRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY,
                    MESSAGE_CONSTANT.NOT_FOUND(roleModuleName));
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, roles, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            // TODO: handle specific errors here
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: err, data: null });
        });
    },

    getRoles: (req, res) => {
        const Role = req.app.locals.models.Role;
        const whereClause = {};
        if (req.query.searchquery) {
            whereClause.name = { [Op.like]: `%${req.query.searchquery}%` };
        }
        Role.findAll({
            where: whereClause,
            order: [['accessLevel', 'ASC']]
        }).then((roles) => {
            if (!roles) {
                return resHandler.errorRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(roleModuleName), err: null, data: null });
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, roles, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            // TODO: handle specific errors here
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: err, data: null });
        });
    },

    createRole: (req, res) => {
        const { sequelize, Role, GenericFolder } = req.app.locals.models;
        if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, true); }
        if (req.body) {
            Role.findOne(
                {
                    where: {
                        [Op.or]: [
                            { name: { [Op.eq]: req.body.name } }
                        ]
                    }
                }).then((roles) => {
                    if (roles != null) {
                        const fieldName = (roles.name.toLowerCase() === req.body.name.toLowerCase()) ?
                            DATA_CONSTANT.ROLE_UNIQUE_FIELD_NAME.ROLE_NAME : DATA_CONSTANT.ROLE_UNIQUE_FIELD_NAME.ROLE_ORDER;
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                    } else {
                        // Role.max('accessLevel').then((type) => {
                        // var maxAccessLevel = type;
                        // req.body.accessLevel = maxAccessLevel ? maxAccessLevel + 1 : 1;
                        COMMON.setModelCreatedByFieldValue(req);
                        req.body.slug = _.kebabCase(req.body.name);
                        return sequelize.transaction().then(t => Role.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((roleResponse) => {
                            var role = {
                                data: roleResponse
                            };
                            var genericFolderModel = {
                                gencFolderName: req.body.name,
                                refTransID: 0,
                                roleId: roleResponse.id,
                                isDeleted: 0,
                                createdBy: req.user.id
                            };
                            return GenericFolder.create(genericFolderModel, {
                                fields: inputGenericFolderFields,
                                transaction: t
                            }).then(() => {
                                t.commit();
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, role, MESSAGE_CONSTANT.CREATED(roleModuleName));
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors, data: null });
                            });
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            /* if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Role'), err: null, data: null });
                            } else {*/
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            /* }*/
                        })).catch((err) => {
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
        }
    },

    // Get role list and feature list from role
    // GET : /api/v1//api/v1/roles/getRolesByUser
    // @return API response
    getRolesByUser: (req, res) => {
        const { sequelize, UsersRoles, Role } = req.app.locals.models;
        let roleData;
        if (req.params.id) {
            return sequelize.transaction(() => UsersRoles.findAll({
                attributes: ['userId', 'roleId'],
                where: { userId: req.params.id },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name', 'slug', 'accessLevel'],
                    required: false
                }]
            }).then((userRoles) => {
                roleData = userRoles;
            })).then(() => {
                if (!roleData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(roleModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, roleData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Save role and feature
    // POST : /api/v1//api/v1/roles/SaveRoleFeature
    // @return API response
    SaveRoleFeature: (req, res) => {
        const { sequelize, RolePageDetail, StandardRole, FeatureRoleMapping } = req.app.locals.models;
        if (req.body) {
            if (req.body.roleId !== 0) {
                if (req.body.PageList && req.body.PageList.length > 0) {
                    const promises = [];
                    return sequelize.transaction().then((t) => {
                        _.forEach(req.body.PageList, (data) => {
                            promises.push(
                                RolePageDetail.findOne({
                                    where: {
                                        roleID: req.body.roleId,
                                        PageID: data.pageID
                                    },
                                    transaction: t
                                }).then((rolePage) => {
                                    req.body['roleID'] = req.body.roleId;
                                    req.body['PageID'] = data.pageID;
                                    req.body['RO'] = data.RO;
                                    req.body['RW'] = data.RW;
                                    req.body['isActive'] = data.isActive;
                                    req.body['isShortcut'] = data.IsShortcut;
                                    req.body['isHelpBlog'] = data.isHelpBlog;

                                    if (rolePage) {
                                        COMMON.setModelUpdatedByFieldValue(req);
                                        // COMMON.setModelDeletedByFieldValue(req);
                                        return RolePageDetail.update(req.body, {
                                            where: {
                                                roleID: req.body.roleId,
                                                PageID: data.pageID
                                            },
                                            // fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                            fields: ['roleID', 'PageID', 'RO', 'RW', 'isActive', 'updatedBy', 'isShortcut', 'isHelpBlog'],
                                            transaction: t
                                        });
                                    } else if (data.isActive || data.RO || data.RW || data.isShortcut) {
                                        COMMON.setModelCreatedByFieldValue(req);
                                        return RolePageDetail.create(req.body, {
                                            fields: ['roleID', 'PageID', 'RO', 'RW', 'isActive', 'createdBy', 'isShortcut', 'isHelpBlog'],
                                            transaction: t
                                        });
                                    } else {
                                        return true;
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })
                            );
                        });

                        return Promise.all(promises).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isPageList: true }, null);
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
                } else if (req.body.FeatureList && req.body.FeatureList.length > 0) {
                    const promises = [];
                    return sequelize.transaction().then((t) => {
                        _.forEach(req.body.FeatureList, (data) => {
                            promises.push(
                                FeatureRoleMapping.findOne({
                                    where: {
                                        roleID: req.body.roleId,
                                        featureID: data.featureID
                                    },
                                    transaction: t
                                }).then((roleFeature) => {
                                    req.body['roleID'] = req.body.roleId;
                                    req.body['featureID'] = data.featureID;
                                    req.body['isActive'] = data.isActive;
                                    if (roleFeature && !data.isActive) {
                                        COMMON.setModelUpdatedByFieldValue(req);
                                        COMMON.setModelDeletedByFieldValue(req);
                                        // var updatedData = {
                                        //     deletedAt: COMMON.getCurrentUTC(req),
                                        //     isDeleted: true,
                                        //     deletedBy: userID
                                        // }
                                        return FeatureRoleMapping.update(req.body, {
                                            where: {
                                                roleID: req.body.roleId,
                                                featureID: data.featureID
                                            },
                                            fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                            transaction: t
                                        });
                                    } else if (data.isActive) {
                                        COMMON.setModelCreatedByFieldValue(req);
                                        return FeatureRoleMapping.create(req.body, {
                                            fields: ['featureID', 'roleID', 'isActive', 'createdBy'],
                                            transaction: t
                                        });
                                    } else {
                                        return true;
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })
                            );
                        });
                        return Promise.all(promises).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isFeatureList: true }, null);
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
                } else if (req.body.standardList && req.body.standardList.length > 0) {
                    const promises = [];
                    return sequelize.transaction().then((t) => {
                        _.forEach(req.body.standardList, (data) => {
                            promises.push(
                                StandardRole.findOne({
                                    where: {
                                        roleID: req.body.roleId,
                                        standardID: data.certificateStandardID
                                    },
                                    transaction: t
                                }).then((roleStandard) => {
                                    var userID = COMMON.getRequestUserID(req);
                                    req.body['roleID'] = req.body.roleId;
                                    req.body['standardID'] = data.certificateStandardID;
                                    if (roleStandard && !data.standardCheck) {
                                        COMMON.setModelDeletedByFieldValue(req);
                                        const updatedData = {
                                            deletedAt: COMMON.getCurrentUTC(req),
                                            isDeleted: true,
                                            deletedBy: userID
                                        };
                                        return StandardRole.update(updatedData, {
                                            where: {
                                                roleID: req.body.roleId,
                                                standardID: data.certificateStandardID
                                            },
                                            fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                            transaction: t
                                        });
                                    } else if (data.standardCheck) {
                                        COMMON.setModelCreatedByFieldValue(req);
                                        return StandardRole.create(req.body, {
                                            fields: ['standardID', 'roleID', 'createdBy', 'createByRoleId'],
                                            transaction: t
                                        });
                                    } else {
                                        return true;
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })
                            );
                        });
                        return Promise.all(promises).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isstandardList: true }, null);
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
                } else if (req.body.DbViewDataSourceList && req.body.DbViewDataSourceList.length > 0) {
                    const promises = [];
                    const { ChartRawdataCategoryAccessRole } = req.app.locals.models;
                    return sequelize.transaction().then((t) => {
                        const actionByUser = req.user.id;
                        _.forEach(req.body.DbViewDataSourceList, (data) => {
                            promises.push(
                                ChartRawdataCategoryAccessRole.findOne({
                                    where: {
                                        roleID: req.body.roleId,
                                        chartRawDataCatID: data.chartRawDataCatID
                                    },
                                    transaction: t
                                }).then((roleDbView) => {
                                    if (roleDbView && !data.isDBViewAccessChecked) {
                                        const deleteData = {
                                            deletedAt: COMMON.getCurrentUTC(req),
                                            deletedBy: actionByUser,
                                            isDeleted: true
                                        };
                                        return ChartRawdataCategoryAccessRole.update(deleteData, {
                                            where: {
                                                roleID: req.body.roleId,
                                                chartRawDataCatID: data.chartRawDataCatID
                                            },
                                            fields: ['deletedAt', 'deletedBy', 'isDeleted'],
                                            transaction: t
                                        });
                                    } else if (data.isDBViewAccessChecked) {
                                        const createData = {
                                            roleID: req.body.roleId,
                                            chartRawDataCatID: data.chartRawDataCatID,
                                            createdAt: COMMON.getCurrentUTC(req),
                                            createdBy: actionByUser
                                        };

                                        return ChartRawdataCategoryAccessRole.create(createData, {
                                            fields: ['chartRawDataCatID', 'roleID', 'createdAt', 'createdBy'],
                                            transaction: t
                                        });
                                    } else {
                                        return true;
                                    }
                                }).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                })
                            );
                        });
                        return Promise.all(promises).then(() => {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDbViewDataSourceList: true }, null);
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
                    return resHandler.errorRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
                }
            } else {
                return resHandler.errorRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Check Role Name exist or not
    // post:/api/v1/checkDuplicateRoleName
    // @retrun validity of Role Name
    checkDuplicateRoleName: (req, res) => {
        const { Role } = req.app.locals.models;
        if (req.body) {
            const whereClause = {
                name: req.body.name
            };
            if (req.body.id) {
                whereClause.id = { [Op.notIn]: [req.body.id] };
            }
            return Role.findOne({
                where: whereClause,
                attributes: ['id']
            }).then((standard) => {
                if (standard) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateRoleName: true } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateRoleName: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get role name by Id
    // GET : /api/v1//api/v1/roles/getRolesById
    // @return API response
    getRolesById: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.id) {
            return sequelize.query('Select fun_getRoleByID(:pRoleID)', {
                replacements: {
                    pRoleID: req.body.id
                },
                type: sequelize.QueryTypes.SELECT
            }).then((roleData) => {
                if (!roleData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(roleModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { data: _.values(roleData[0])[0] }, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

};