const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotMatchingPassword } = require('../../errors');
const { Op } = require('sequelize');
const _ = require('lodash');

module.exports = {

    // Get list of feature based on usres
    // GET : /api/v1/featureUserMapping
    // @param {userID} string
    // @return list of feature for selected user
    getUserFeatureRight: (req, res) => {
        const { FeatureUserMapping } = req.app.locals.models;
        if (req.params.id) {
            return FeatureUserMapping.findAll({
                where: {
                    userID: req.params.id
                },
                attributes: ['featureUserMappingID', 'userID', 'featureID', 'isActive']
            }).then(data =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update features of selected users
    // POST : /api/v1/featureUserMapping
    // @return message
    updateUserFeatureRight: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            const featureIDstr = req.body.featureIDs.toString();
            return sequelize
                .query('CALL Sproc_AssignFeaturesToUser (:pSelectedUserID, :pfeatureID, :puserID)',
                    {
                        replacements: {
                            pSelectedUserID: req.body.selectedUserID,
                            pfeatureID: featureIDstr ? featureIDstr : null,
                            puserID: req.body.createdBy,
                        }
                    })
                .then(() =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.FEATURE_ASSIGNED_TO_USER)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrieve all employees list based on feature rights, based on role or get all
    // POST : /api/v1/featureUserMapping/retrieveEmployeeListForFeatureRights
    // @return data
    retrieveEmployeeListForFeatureRights: (req, res) => {
        const { sequelize } = req.app.locals.models;
            return sequelize
                .query('CALL Sproc_retrieveEmployeeListForFeatureRights (:pFeatureID, :pRoleID)',
                    {
                        replacements: {
                            pFeatureID: req.body.featureId ? req.body.featureId : null,
                            pRoleID: req.body.selectedRole ? req.body.selectedRole : null                          
                        }
                    })
                .then((getEmployeeData) => {
                    if (!getEmployeeData) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(entityEmployeeModuleName), err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEmployeeData, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
    },

    // Update multiple feature rights of selected users
    // POST : /api/v1/featureUserMapping/updateMulitpleUserFeatureRight
    // @return message
    updateMulitpleUserFeatureRight: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                return sequelize
                .query('CALL Sproc_updateMulitpleUserFeaturePermision (:pSelectedRole, :pSelectedFeatures, :pSelectedUsers, :pCreatedBy, :pRightsPermission, :pCreatedByRoleId)',
                    {
                        replacements: {
                            pSelectedRole: req.body.selectedRole,
                            pSelectedFeatures : req.body.selectedfeatures.toString(),
                            pSelectedUsers: req.body.userIds.toString(),
                            pCreatedBy: req.body.createdBy,
                            pRightsPermission: req.body.permissionRights,
                            pCreatedByRoleId: req.body.createdByRoleId
                        },
                        transaction: t
                    })
                .then(() => {
                    t.commit().then(() => {    
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.SAVE_ROLE);
                    });
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
   
    // Validate userName and password and feature access
    // GET : /api/v1/FeatureUserMapping/verifyUserForRestrictWithPermissionFeature
    // @param {username,password,featureName}
    // @return API response for valid user
    verifyUserForRestrictWithPermissionFeature: (req, res) => {
        if (req.body && req.body.username && req.body.password && req.body.featureName) {
            const { User, FeatureUserMapping, sequelize } = req.app.locals.models;
            req.body.password = COMMON.DECRYPT_AES(req.body.password);

            return User.findOne({
                where: {
                    username: req.body.username
                },
                attributes: ['id', 'passwordDigest']
            }).then((verifiedUserRes) => {
                if (verifiedUserRes) {
                    const userID = verifiedUserRes.id;
                    return verifiedUserRes.authenticate(req.body.password).then(() => {
                        FeatureUserMapping.findOne({
                            where: {
                                featureID: { [Op.eq]: sequelize.literal(` ( select featureID from feature_mst WHERE deletedAt IS NULL and featureName = "${req.body.featureName}")`) },
                                userID: userID,
                                isActive: true
                            },
                            attributes: ['featureUserMappingID', 'featureID']
                        }).then((featureDetRes) => {
                            if (featureDetRes) {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { userID: userID }, null);
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.UNAUTHORIZE_USER, err: null, data: null });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    });
                    // .catch((err) => {
                    //     console.trace();
                    //     console.error(err);
                    //     return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    // });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
                }
            }).catch((err) => {
                if (err instanceof NotMatchingPassword || err instanceof NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.USER_USERNAME_PASSWORD_INCORRECT, err: null, data: null });
                } else {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
