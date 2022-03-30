const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const _ = require('lodash');
const { Op } = require('sequelize');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { updateScoprOfUser, setSuperAdmin } = require('../../Identity/IdentityApiHandler');
const { identity_server } = require('../../../config/config');

const roleModuleName = DATA_CONSTANT.ROLE.NAME;
const rightsModuleName = DATA_CONSTANT.RIGHTS.NAME;
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const UserPagePermissionController = require('../../user/controllers/UserPagePermisionController');

module.exports = {

    rolePagePermision: (req, res) => {
        const { RolePageDetail } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedArrayFieldValue(req.user, req.body);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body);
            return RolePageDetail.bulkCreate(req.body).then(data => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, MESSAGE_CONSTANT.CREATED(roleModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getrolePagePermision: (req, res) => {
        const { RolePageDetail } = req.app.locals.models;
        const roleIDs = req.params.id.split(',') || [];
        if (roleIDs.length > 0) {
            return RolePageDetail.findAll({
                where: {
                    roleID: { [Op.in]: roleIDs }
                },
                attributes: ['rolePageID', 'roleID', 'PageID', 'RO', 'RW', 'isActive', 'isShortcut']
            }).then(data => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    updaterolePagePermision: (req, res) => {
        const { sequelize, RolePageDetail } = req.app.locals.models;
        if (req.body) {
            return sequelize.transaction().then(t => RolePageDetail.findAll({
                where: {
                    roleID: req.params.id
                },
                attributes: ['PageID'],
                transaction: t
            }).then((pageList) => {
                const promises = [];
                if (pageList.length > 0) {
                    const existpagePermision = pageList.map(item => item.PageID);

                    COMMON.setModelCreatedArrayFieldValue(req.user, req.body.pagepermision);
                    _.each(req.body.pagepermision, (pagePermison) => {
                        if (_.includes(existpagePermision, pagePermison.PageID)) {
                            promises.push(RolePageDetail.update(pagePermison, {
                                where: {
                                    roleID: pagePermison.roleID,
                                    PageID: pagePermison.PageID
                                },
                                transaction: t
                            }));
                        } else {
                            promises.push(RolePageDetail.create(pagePermison, {
                                transaction: t
                            }));
                        }
                    });
                } else {
                    COMMON.setModelCreatedArrayFieldValue(req.user, req.body.pagepermision);
                    COMMON.setModelUpdatedByArrayFieldValue(req.user, req.body.pagepermision);
                    promises.push(RolePageDetail.bulkCreate(req.body.pagepermision, {
                        transaction: t
                    }));
                }
                Promise.all(promises).then(() => {
                    t.commit();
                    if (req.body.isNewRoleCreateOperation) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.NEW_ROLE_PERMISSION_CREATED);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.CREATE_ROLE_PERMISION);
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
                if (!t.finished) { t.rollback(); }
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

    // Get page list and feature list from role
    // GET : /api/v1//api/v1/rolePagePermision/getPageListByRole
    // @return API response
    getPageListByRole: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        const userId = req.query.userId;
        const roleId = req.query.roleId;

        if (req.query.tabName === 'Permissions') {
            return sequelize.query('CALL Sproc_GetPermissionsPageListByRole (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUserId,:pRoleId,:isShowDefault)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pUserId: userId,
                        pRoleId: roleId,
                        isShowDefault: req.query.isShowDefault
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(response =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pages: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            sequelize.query('CALL Sproc_GetFeaturesPageListByRole (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUserId,:pRoleId,:isShowDefault)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pUserId: userId,
                        pRoleId: roleId,
                        isShowDefault: req.query.isShowDefault
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(response =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { features: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        }
    },

    // Save user role and user role pages and feature
    // POST : /api/v1//api/v1/rolePagePermision/saveRoleRightPage
    // @return API response
    // eslint-disable-next-line consistent-return
    saveRoleRightPage: (req, res) => {
        const { sequelize, UserPageDetail, FeatureUserMapping, HomeMenuCateogory } = req.app.locals.models;
        if (req.body && req.body.userId) {
            // changes on page rights
            if (req.body.PageList && req.body.PageList.length > 0) {
                return sequelize.transaction().then((t) => {
                    const promises = [];
                    _.forEach(req.body.PageList, (data) => {
                        promises.push(UserPageDetail.findOne({
                            where: {
                                userID: req.body.userId,
                                pageID: data.pageID,
                                roleID: data.roleID,
                                isDeleted: false
                            },
                            transaction: t
                        }).then((userPage) => {
                            req.body['userID'] = req.body.userId;
                            req.body['PageID'] = data.pageID;
                            req.body['roleID'] = data.roleID;
                            req.body['RO'] = data.RO;
                            req.body['RW'] = data.RW;
                            req.body['isActive'] = data.isActive;
                            req.body['isHelpBlog'] = data.isHelpBlog;
                            // req.body['isShortcut'] = data.IsShortcut; // commented as shortcut is not required to save
                            if (userPage) {
                                const pageDetailPromise = [];
                                COMMON.setModelUpdatedByFieldValue(req);
                                if (!data.isActive) {
                                    req.body['isShortcut'] = false;
                                    req.body['displayOrder'] = null;

                                    const updatedData = {
                                        deletedAt: COMMON.getCurrentUTC(),
                                        isDeleted: true,
                                        deletedBy: req.body.userID
                                    };
                                    pageDetailPromise.push(HomeMenuCateogory.update(updatedData, {
                                        where: {
                                            userPageID: userPage.userPageID
                                        },
                                        fields: ['deletedBy', 'deletedAt', 'isDeleted'],
                                        transaction: t
                                    }));
                                }

                                pageDetailPromise.push(UserPageDetail.update(req.body, {
                                    where: {
                                        userID: req.body.userId,
                                        pageID: data.pageID,
                                        roleID: data.roleID,
                                        isDeleted: false
                                    },
                                    fields: ['userID', 'PageID', 'RO', 'RW', 'isActive', 'createdBy', 'roleID', 'isShortcut', 'displayOrder', 'isHelpBlog'],
                                    transaction: t
                                }));

                                return Promise.all(pageDetailPromise).then(() => UserPagePermissionController.setDisplayOrder(req, req.body.roleID, req.body.userID, t).then(response => ({ status: response.status, Error: response.err })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, Error: err };
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, Error: err };
                                });
                            } else if (data.isActive || data.RO || data.RW || data.isShortcut || data.isHelpBlog) {
                                COMMON.setModelCreatedByFieldValue(req);
                                return UserPageDetail.create(req.body, {
                                    fields: ['userID', 'PageID', 'RO', 'RW', 'isActive', 'createdBy', 'roleID', 'isHelpBlog'],
                                    transaction: t
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, Error: err };
                        }));
                    });

                    return Promise.all(promises).then((result) => {
                        if (result && Array.isArray(result)) {
                            const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                            if (failedDetail) {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: failedDetail.messageContent ? failedDetail.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.Error, data: null });
                            }
                            // If Any changes in Reports related rights then update on IdentityDB.
                            const updateViewerRightOnIdentity = _.some(req.body.PageList, item => (item.menuName === DATA_CONSTANT.PAGE_NAMES.REPORT || item.menuName === DATA_CONSTANT.PAGE_NAMES.DYNAMIC_REPORTS));
                            if (updateViewerRightOnIdentity) {
                                return module.exports.updateReportsRights(req, res, t, 'page').then((response) => {
                                    if (response) {
                                        if (response.status === STATE.FAILED) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: response.messageContent ? response.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err, data: null });
                                        }
                                        return t.commit().then(() =>
                                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE)
                                        ).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                return t.commit().then(() =>
                                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE)
                                ).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
            } else if (req.body.FeatureList && req.body.FeatureList.length > 0) {
                // changes on feature rights
                return sequelize.transaction().then((t) => {
                    const promises = [];
                    _.forEach(req.body.FeatureList, (data) => {
                        promises.push(FeatureUserMapping.findOne({
                            where: {
                                userID: req.body.userId,
                                featureID: data.featureID,
                                roleID: data.roleID,
                                deletedAt: null
                            },
                            transaction: t
                        }).then((userFeature) => {
                            req.body['userID'] = req.body.userId;
                            req.body['featureID'] = data.featureID;
                            req.body['roleID'] = data.roleID;
                            req.body['isActive'] = data.isActive;

                            if (userFeature) {
                                COMMON.setModelUpdatedByFieldValue(req);
                                return FeatureUserMapping.update(req.body, {
                                    where: {
                                        userID: req.body.userId,
                                        featureID: data.featureID,
                                        roleID: data.roleID
                                    },
                                    fields: ['featureID', 'userID', 'isActive', 'createdBy', 'roleID'],
                                    transaction: t
                                });
                            } else if (data.isActive) {
                                COMMON.setModelCreatedByFieldValue(req);
                                return FeatureUserMapping.create(req.body, {
                                    fields: ['featureID', 'userID', 'isActive', 'createdBy', 'roleID'],
                                    transaction: t
                                });
                            } else {
                                return Promise.resolve(true);
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, Error: err };
                        }));
                    });

                    return Promise.all(promises).then((result) => {
                        if (result && Array.isArray(result)) {
                            const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                            if (failedDetail) {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: failedDetail.messageContent ? failedDetail.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.Error, data: null });
                            }
                            // If Any changes in Reports related rights then update on IdentityDB.
                            const updateDesignerRightOnIdentity = _.some(req.body.FeatureList, item => (item.featureName === DATA_CONSTANT.FEATURE_NAMES.ALLOW_DESIGN_REPORT || item.featureName === DATA_CONSTANT.FEATURE_NAMES.ALLOW_TO_ADD_REPORT));
                            if (updateDesignerRightOnIdentity) {
                                return module.exports.updateReportsRights(req, res, t, 'feature').then((response) => {
                                    if (response) {
                                        if (response.status === STATE.FAILED) {
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: response.messageContent ? response.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err, data: null });
                                        }
                                        return t.commit().then(() =>
                                            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE)
                                        ).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) { t.rollback(); }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                return t.commit().then(() =>
                                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE)
                                ).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) { t.rollback(); }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
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
                // If Didn't got Page/Feature list from ui.
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE);
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // update(add and remove) user role and user role pages and feature
    // POST : /api/v1/rolePagePermision/updateRoleRight
    // @return API response
    updateRoleRight: (req, res) => {
        const { sequelize, UsersRoles, UserPageDetail, FeatureUserMapping, Role, RolePageDetail, FeatureRoleMapping, PageDetail, FeatureMst } = req.app.locals.models;
        if (req.body && req.body.userId && req.body.identityUserId) {
            return sequelize.transaction().then((t) => {
                const promises = [];
                // Update SuperAdmin Role on IdenityDB. - 'A' = Add , 'D' = Delete.
                let updateSuperAdminRoleOnIdentity = '';
                let updateViewerRightOnIdentity = false;
                let updateDesignerRightOnIdentity = false;

                // Add User Roles With Default Permission
                if (req.body.addRoleList && req.body.addRoleList.length > 0) {
                    promises.push(Role.findOne({
                        where: {
                            name: DATA_CONSTANT.ROLES_NAME.SUPER_ADMIN
                        },
                        attributes: ['id'],
                        transaction: t
                    }).then((superAdminRole) => {
                        if (superAdminRole) {
                            const saveRolePromises = [];
                            _.forEach(req.body.addRoleList, (role) => {
                                COMMON.setModelCreatedByFieldValue(req);
                                req.body['roleId'] = role.id;
                                // Bhavik[28/10/2021]: As Discussed with VS: Do not Update Deleted Role, instead Create New Entry.
                                saveRolePromises.push(
                                    // UsersRoles.findOne({
                                    //     where: {
                                    //         userId: req.body.userId,
                                    //         roleId: role.id
                                    //     },
                                    //     transaction: t,
                                    //     paranoid: false
                                    // }).then((userRoles) => {
                                    //     if (userRoles) {
                                    //         const updateUserRole = {};
                                    //         COMMON.setModelUpdatedByFieldValue(updateUserRole);
                                    //         if (req.body && req.user) {
                                    //             updateUserRole.deletedBy = null;
                                    //             updateUserRole.deletedAt = null;
                                    //             updateUserRole.isDeleted = false;
                                    //         }

                                    //         return UsersRoles.update(updateUserRole, {
                                    //             where: {
                                    //                 userId: req.body.userId,
                                    //                 roleId: role.id
                                    //             },
                                    //             fields: ['updatedBy', 'updateByRoleId', 'updatedAt', 'deletedBy', 'isDeleted', 'deletedAt'],
                                    //             paranoid: false,
                                    //             transaction: t
                                    //         });
                                    //     } else {
                                    //     COMMON.setModelCreatedByFieldValue(req);
                                    // req.body['roleId'] = role.id;
                                    UsersRoles.create(req.body, {
                                        fields: ['userId', 'roleId', 'createdBy', 'createdAt', 'createByRoleId'],
                                        transaction: t
                                    })
                                    //     }
                                    // }).catch((err) => {
                                    //     console.trace();
                                    //     console.error(err);
                                    //     return { status: STATE.FAILED, err: err };
                                    // })
                                );

                                saveRolePromises.push(RolePageDetail.findAll({
                                    where: {
                                        roleID: role.id,
                                        isActive: true,
                                        isDeleted: false
                                    },
                                    include: [
                                        {
                                            model: PageDetail,
                                            as: 'pageDetail',
                                            where: {
                                                isDeleted: false
                                            },
                                            attributes: ['pageID', 'menuName'],
                                            required: false
                                        }
                                    ],
                                    attributes: ['PageID', 'RO', 'RW', 'isActive'],
                                    transaction: t
                                }).then((rolePageDetailResponse) => {
                                    const userPageDetailAddArray = [];
                                    rolePageDetailResponse.forEach((element) => {
                                        const userPageDetailObj = {};
                                        COMMON.setModelCreatedByFieldValue(userPageDetailObj);
                                        userPageDetailObj.RO = element.dataValues.RO;
                                        userPageDetailObj.RW = element.dataValues.RW;
                                        userPageDetailObj.isActive = element.dataValues.isActive;
                                        userPageDetailObj.PageID = element.dataValues.PageID;
                                        userPageDetailObj.userID = req.body.userId;
                                        userPageDetailObj.roleID = role.id;
                                        userPageDetailAddArray.push(userPageDetailObj);
                                    });
                                    // If Any changes in Reports related rights then update on IdentityDB.
                                    updateViewerRightOnIdentity = _.some(rolePageDetailResponse, item => item.dataValues.pageDetail && (item.dataValues.pageDetail.menuName === DATA_CONSTANT.PAGE_NAMES.REPORT || item.dataValues.pageDetail.menuName === DATA_CONSTANT.PAGE_NAMES.DYNAMIC_REPORTS));

                                    return UserPageDetail.bulkCreate(userPageDetailAddArray, {
                                        fields: ['userID', 'PageID', 'RO', 'RW', 'isActive', 'createdBy', 'roleID', 'updatedBy', 'updateByRoleId', 'createByRoleId', 'createdAt'],
                                        transaction: t
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, err: err };
                                }));

                                saveRolePromises.push(FeatureRoleMapping.findAll({
                                    where: {
                                        roleID: role.id,
                                        isActive: true,
                                        isDeleted: false
                                    },
                                    include: [
                                        {
                                            model: FeatureMst,
                                            as: 'featureMst',
                                            where: {
                                                isDeleted: false
                                            },
                                            attributes: ['featureID', 'featureName'],
                                            required: false
                                        }],
                                    attributes: ['featureID', 'isActive'],
                                    transaction: t
                                }).then((featureRoleMappingResponse) => {
                                    const featureUserMappingAddArray = [];
                                    featureRoleMappingResponse.forEach((element) => {
                                        const featureUserMappingObj = {};
                                        COMMON.setModelCreatedByFieldValue(featureUserMappingObj);
                                        featureUserMappingObj.featureID = element.dataValues.featureID;
                                        featureUserMappingObj.isActive = element.dataValues.isActive;
                                        featureUserMappingObj.roleID = role.id;
                                        featureUserMappingObj.userID = req.body.userId;
                                        featureUserMappingAddArray.push(featureUserMappingObj);
                                    });
                                    // If Any changes in Reports related rights then update on IdentityDB.
                                    updateDesignerRightOnIdentity = _.some(featureRoleMappingResponse, item => item.dataValues.featureMst && (item.dataValues.featureMst.featureName === DATA_CONSTANT.FEATURE_NAMES.ALLOW_DESIGN_REPORT || item.dataValues.featureMst.featureName === DATA_CONSTANT.FEATURE_NAMES.ALLOW_TO_ADD_REPORT));

                                    return FeatureUserMapping.bulkCreate(featureUserMappingAddArray, {
                                        fields: ['featureID', 'userID', 'isActive', 'createdBy', 'roleID', 'updatedBy', 'updateByRoleId', 'createByRoleId', 'createdAt'],
                                        transaction: t
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, err: err };
                                }));
                            });

                            // If any cahnges in SuperAdmin Role Then need to update in aspnnetusers table in identityDB.
                            if (_.some(req.body.addRoleList, role => role.id === superAdminRole.id)) {
                                updateSuperAdminRoleOnIdentity = DATA_CONSTANT.UPDATE_SUPERADMIN_ROLE_ON_IDENTITY.ADD;
                            }

                            return Promise.all(saveRolePromises).then((result) => {
                                if (result && Array.isArray(result)) {
                                    const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                                    if (failedDetail) {
                                        return { status: STATE.FAILED, messageContent: failedDetail.messageContent, err: failedDetail.err };
                                    }
                                    return Promise.resolve(true);
                                } else {
                                    return { status: STATE.FAILED };
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { status: STATE.FAILED, err: err };
                            });
                        } else {
                            return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.NOT_FOUND('SuperAdmin Role') };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, err: err };
                    }));
                }

                // Delete User Roles.
                if (req.body.deleteRoleIdList && req.body.deleteRoleIdList.length > 0) {
                    promises.push(UsersRoles.findAll({
                        where: {
                            userId: req.body.userId,
                            roleId: { [Op.in]: req.body.deleteRoleIdList },
                            isDeleted: false
                        },
                        include: [
                            {
                                model: Role,
                                as: 'role',
                                attributes: ['id', 'name'],
                                required: true
                            }
                        ],
                        transaction: t
                    }).then((userRoles) => {
                        if (userRoles && userRoles.length > 0) {
                            const objDeleted = {};
                            COMMON.setModelDeletedByFieldValue(objDeleted);
                            const deletePromise = [];

                            deletePromise.push(UsersRoles.update(objDeleted, {
                                where: {
                                    userId: req.body.userId,
                                    roleId: { [Op.in]: req.body.deleteRoleIdList },
                                    isDeleted: false
                                },
                                fields: ['updatedBy', 'deletedBy', 'isDeleted', 'deletedAt', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                                transaction: t
                            }));

                            deletePromise.push(UserPageDetail.update(objDeleted, {
                                where: {
                                    userID: req.body.userId,
                                    roleID: { [Op.in]: req.body.deleteRoleIdList },
                                    isDeleted: false
                                },
                                fields: ['updatedBy', 'deletedBy', 'isDeleted', 'deletedAt', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                                transaction: t
                            }));

                            deletePromise.push(FeatureUserMapping.update(objDeleted, {
                                where: {
                                    userID: req.body.userId,
                                    roleID: { [Op.in]: req.body.deleteRoleIdList },
                                    isDeleted: false
                                },
                                fields: ['updatedBy', 'deletedBy', 'isDeleted', 'deletedAt', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                                transaction: t
                            }));

                            // If any cahnges in SuperAdmin Role Then need to update in aspnnetusers table in identityDB.
                            if (_.some(userRoles, userRole => userRole.role && userRole.role.name === DATA_CONSTANT.ROLES_NAME.SUPER_ADMIN)) {
                                updateSuperAdminRoleOnIdentity = DATA_CONSTANT.UPDATE_SUPERADMIN_ROLE_ON_IDENTITY.DELETE;
                            }

                            return Promise.all(deletePromise).then((result) => {
                                if (result && Array.isArray(result)) {
                                    const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                                    if (failedDetail) {
                                        return { status: STATE.FAILED, messageContent: failedDetail.messageContent, err: failedDetail.err };
                                    }
                                    return { status: STATE.SUCCESS };
                                } else {
                                    return { status: STATE.FAILED };
                                }
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
                    }));
                }

                return Promise.all(promises).then((result) => {
                    if (result && Array.isArray(result)) {
                        const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                        if (failedDetail) {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: failedDetail.messageContent ? failedDetail.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetail.err, data: null });
                        }

                        const IdentityDBPromise = [];
                        // Add or Delete SuperAdmin Role on IdentityDB.
                        if (updateSuperAdminRoleOnIdentity === DATA_CONSTANT.UPDATE_SUPERADMIN_ROLE_ON_IDENTITY.ADD || updateSuperAdminRoleOnIdentity === DATA_CONSTANT.UPDATE_SUPERADMIN_ROLE_ON_IDENTITY.DELETE) {
                            IdentityDBPromise.push(setSuperAdmin(req.body.identityUserId, updateSuperAdminRoleOnIdentity === DATA_CONSTANT.UPDATE_SUPERADMIN_ROLE_ON_IDENTITY.ADD ? true : false, req.headers.authorization).then((setSuperAdminResponses) => {
                                try {
                                    const response = JSON.parse(setSuperAdminResponses);
                                    return { status: response.status, messageContent: response.userMessage && response.userMessage.messageContent ? response.userMessage.messageContent : null };
                                } catch (err) {
                                    console.trace();
                                    console.error(err);
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.CHECK_CONFIGURED_APPLICATION);
                                    return { status: STATE.FAILED, messageContent: messageContent };
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return { status: STATE.FAILED, err: err };
                            }));
                        }

                        // Update Reports Rights on identityDB.
                        if (updateViewerRightOnIdentity || updateDesignerRightOnIdentity || (req.body.deleteRoleIdList && req.body.deleteRoleIdList.length > 0)) {
                            req.body.isOnlyCheckForDelete = (!updateViewerRightOnIdentity && !updateDesignerRightOnIdentity) ? true : false;
                            if ((req.body.deleteRoleIdList && req.body.deleteRoleIdList.length > 0) || (updateViewerRightOnIdentity && updateDesignerRightOnIdentity)) {
                                IdentityDBPromise.push(module.exports.updateReportsRights(req, res, t));
                            } else if (updateViewerRightOnIdentity) {
                                IdentityDBPromise.push(module.exports.updateReportsRights(req, res, t, 'page'));
                            } else {
                                IdentityDBPromise.push(module.exports.updateReportsRights(req, res, t, 'feature'));
                            }
                        }

                        return Promise.all(IdentityDBPromise).then((response) => {
                            const failedDetails = response.find(a => a && a.status === STATE.FAILED);
                            if (failedDetails) {
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: failedDetails.messageContent ? failedDetails.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: failedDetails.err, data: null });
                            }
                            return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE)
                            ).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) { t.rollback(); }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
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

    // Send Notification of other user right and permission changes
    // GET : /api/v1//api/v1/rolePagePermision/sendNotificationOfRightChanges
    // @return API response
    sendNotificationOfRightChanges: (req, res) => {
        if (req.params && req.params.id) {
            const receiverID = [];
            let recvID = null;
            // eslint-disable-next-line global-require
            const NotificationMstController = require('../../notificationmst/controllers/NotificationMstController');
            if(req.params.isSelectMultipleUser){
                recvID = req.params.id;
                let users = req.params.id.split(',');
                for (var a in users)
                {
                    receiverID.push(users[a])
                }             
            }else{
                recvID = isNaN(parseInt(req.params.id)) ? null : parseInt(req.params.id);
                receiverID.push(recvID);
            }
            
            const data = {
                senderID: parseInt(req.user.employeeID) || null,
                receiver: receiverID,
                employeeID: recvID
            };
            const notificationMst = {
                subject: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DETAIL_CHANGE.SUBJECT),
                messageType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DETAIL_CHANGE.TYPE,
                messageSubType: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DETAIL_CHANGE.SUBTYPE,
                jsonData: DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DETAIL_CHANGE.JSONDATA(data),
                redirectUrl: COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DETAIL_CHANGE.REDIRECTURL, data.employeeID),
                isActive: true
            };
            data.message = COMMON.stringFormat(DATA_CONSTANT.NOTIFICATIONMST.MESSAGETYPE.EMPLOYEE_DETAIL_CHANGE.MESSAGE);
            NotificationMstController.updateCommonDetails(notificationMst, data);
            NotificationMstController.saveCommNotificationFn(req, notificationMst).then((resp) => {
                if (resp && resp.notificationMst) {
                    req.body.notificationMst = {
                        id: resp.notificationMst.id,
                        senderID: data.senderID
                    };
                }
                req.body.subject = notificationMst.subject;
                
                if(req.params.isSelectMultipleUser) {
                    _.each(receiverID, function(user){
                        RFQSocketController.sendNotificationOfRightChanges(req, user);
                    });  
                }else{
                    RFQSocketController.sendNotificationOfRightChanges(req, req.params.id);
                }
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get page list and feature list from role
    // POST : /api/v1/api/v1/rolePagePermision/getRightsSummary
    // @return rights summary response
    getRightsSummary: (req, res) => {
        if (req.body && req.body.userId) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (req.body.isPermissionTab) {
                return sequelize.query('CALL Sproc_GetRightsSummary (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUserId,:isPermissionTab)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pUserId: req.body.userId,
                            isPermissionTab: req.body.isPermissionTab
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(response =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pageList: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            } else {
                return sequelize.query('CALL Sproc_GetRightsSummary (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pUserId,:isPermissionTab)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pUserId: req.body.userId,
                            isPermissionTab: req.body.isPermissionTab ? req.body.isPermissionTab : false
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(response =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { featuresList: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Delete user role and user role pages and feature
    // POST : /api/v1/api/v1/rolePagePermision/deleteRolesRights
    // @return API response
    deleteRolesRights: (req, res) => {
        const { sequelize, UsersRoles, UserPageDetail, FeatureUserMapping } = req.app.locals.models;
        if (req.body && req.body.userId && (req.body.pageIDList || req.body.featureIDList)) {
            return sequelize.transaction().then((t) => {
                UsersRoles.findAll({
                    where: {
                        userId: req.body.userId
                    },
                    transaction: t
                }).then((userRoles) => {
                    if (userRoles && userRoles.length > 0) {
                        const promises = [];
                        COMMON.setModelUpdatedByFieldValue(req);
                        if (req.body.pageIDList) {
                            promises.push(UserPageDetail.update(req.body, {
                                where: {
                                    userID: req.body.userId,
                                    pageID: { [Op.in]: req.body.pageIDList }
                                },
                                fields: ['updatedBy', 'updateByRoleId', 'updatedAt', 'isActive'],
                                transaction: t
                            }));
                        } else {
                            promises.push(FeatureUserMapping.update(req.body, {
                                where: {
                                    userID: req.body.userId,
                                    featureID: { [Op.in]: req.body.featureIDList }
                                },
                                fields: ['updatedBy', 'updateByRoleId', 'updatedAt', 'isActive'],
                                transaction: t
                            }));
                        }

                        return Promise.all(promises).then(() => {
                            // Only Check for Delete Reports Rights.
                            req.body.isOnlyCheckForDelete = true;
                            return module.exports.updateReportsRights(req, res, t, req.body.pageIDList ? 'page' : 'feature').then((result) => {
                                if (result) {
                                    if (result.status === STATE.FAILED) {
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: result.messageContent ? result.messageContent : MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: result.err, data: null });
                                    }
                                    return t.commit().then(() =>
                                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(rightsModuleName))
                                    ).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) { t.rollback(); }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    if (!t.finished) { t.rollback(); }
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
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(rightsModuleName), err: null, data: null });
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

    // Manage Reports Project Permission on IdentityDB based on Reports Right
    updateReportsRights: (req, res, t, rightsToUpdate) => {
        const { UserPageDetail, FeatureUserMapping, PageDetail, FeatureMst } = req.app.locals.models;
        const promises = [];

        // Delete Page Rights(Report Viewer)
        if (rightsToUpdate !== 'feature') {
            promises.push(PageDetail.findAll({
                where: {
                    pageName: [DATA_CONSTANT.PAGE_NAMES.REPORT, DATA_CONSTANT.PAGE_NAMES.DYNAMIC_REPORTS]
                },
                attributes: ['pageID']
            }).then((pageDetailsResponse) => {
                if (pageDetailsResponse && pageDetailsResponse.length > 0) {
                    const pageIds = [];
                    _.forEach(pageDetailsResponse, (page) => {
                        pageIds.push(page.pageID);
                    });
                    return UserPageDetail.findAll({
                        where: {
                            userID: req.body.userId,
                            pageID: pageIds,
                            isActive: true
                        },
                        attributes: ['userPageID'],
                        transaction: t
                    }).then((UserPageDetailResponse) => {
                        if (UserPageDetailResponse) {
                            // In Delete Role case Save Api call in case of we Already have Reports right then don't go for re-give Right.
                            if (req.body.isOnlyCheckForDelete && UserPageDetailResponse.length > 0) {
                                return { status: STATE.SUCCESS };
                            } else {
                                const objScope = {
                                    UserId: req.body.identityUserId,
                                    ClientName: identity_server.Q2CClients.Q2CReportViewer,
                                    toAdd: UserPageDetailResponse.length > 0 ? true : false
                                };
                                return updateScoprOfUser(objScope, req.headers.authorization).then((updateScoprOfUserResponse) => {
                                    try {
                                        const response = JSON.parse(updateScoprOfUserResponse);
                                        return { status: response.status, messageContent: response.userMessage && response.userMessage.messageContent ? response.userMessage.messageContent : null };
                                    } catch (err) {
                                        console.trace();
                                        console.error(err);
                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.CHECK_CONFIGURED_APPLICATION);
                                        return { status: STATE.FAILED, messageContent: messageContent };
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, err: err };
                                });
                            }
                        } else {
                            return { status: STATE.FAILED };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, err: err };
                    });
                } else {
                    return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.NOT_FOUND('Report Page Details') };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            }));
        }

        // Delete Feature Rights(Report Designer)
        if (rightsToUpdate !== 'page') {
            promises.push(FeatureMst.findAll({
                where: {
                    featureName: [DATA_CONSTANT.FEATURE_NAMES.ALLOW_DESIGN_REPORT, DATA_CONSTANT.FEATURE_NAMES.ALLOW_TO_ADD_REPORT]
                },
                attributes: ['featureID']
            }).then((featureDetailsResponse) => {
                if (featureDetailsResponse && featureDetailsResponse.length > 0) {
                    const featureIds = [];
                    _.forEach(featureDetailsResponse, (feature) => {
                        featureIds.push(feature.featureID);
                    });
                    return FeatureUserMapping.findAll({
                        where: {
                            userID: req.body.userId,
                            featureID: featureIds,
                            isActive: true
                        },
                        attributes: ['featureUserMappingID'],
                        transaction: t
                    }).then((featureUserResponse) => {
                        if (featureUserResponse) {
                            // In Delete Role case Save Api call in case of we Already have Reports right then don't go for re-give Right.
                            if (req.body.isOnlyCheckForDelete && featureUserResponse.length > 0) {
                                return { status: STATE.SUCCESS };
                            } else {
                                const objScope = {
                                    UserId: req.body.identityUserId,
                                    ClientName: identity_server.Q2CClients.Q2CReportDesigner,
                                    toAdd: featureUserResponse.length > 0 ? true : false
                                };
                                return updateScoprOfUser(objScope, req.headers.authorization).then((updateScoprOfUserResponse) => {
                                    try {
                                        const response = JSON.parse(updateScoprOfUserResponse);
                                        return { status: response.status, messageContent: response.userMessage && response.userMessage.messageContent ? response.userMessage.messageContent : null };
                                    } catch (err) {
                                        console.trace();
                                        console.error(err);
                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.CHECK_CONFIGURED_APPLICATION);
                                        return { status: STATE.FAILED, messageContent: messageContent };
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return { status: STATE.FAILED, err: err };
                                });
                            }
                        } else {
                            return { status: STATE.FAILED };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return { status: STATE.FAILED, err: err };
                    });
                } else {
                    return { status: STATE.FAILED, messageContent: MESSAGE_CONSTANT.NOT_FOUND('Report Feature Details') };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return { status: STATE.FAILED, err: err };
            }));
        }

        return Promise.all(promises).then((result) => {
            if (result && Array.isArray(result)) {
                const failedDetail = result.find(a => a && a.status === STATE.FAILED);
                if (failedDetail) {
                    return { status: STATE.FAILED, messageContent: failedDetail.messageContent, err: failedDetail.err };
                }
                return { status: STATE.SUCCESS };
            } else {
                return { status: STATE.FAILED };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, err: err };
        });
    }
};
