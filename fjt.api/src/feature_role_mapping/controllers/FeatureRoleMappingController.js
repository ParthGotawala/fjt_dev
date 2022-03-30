const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { Op } = require('sequelize');

module.exports = {

    // Get list of feature based on roles
    // GET : /api/v1/featureRoleMapping
    // @param {roledIDs} string
    // @return list of feature for selected roles
    getRoleFeatureRight: (req, res) => {
        const { FeatureRoleMapping } = req.app.locals.models;
        const roleIDs = req.params.id.split(',') || [];
        if (roleIDs.length > 0) {
            return FeatureRoleMapping.findAll({
                where: {
                    roleID: { [Op.in]: roleIDs }
                },
                attributes: ['featureRoleMappingID', 'roleID', 'featureID', 'isActive']
            }).then(data =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, data, null)
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update features of selected roles
    // POST : /api/v1/featureRoleMapping
    // @return message
    updateRoleFeatureRight: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            const featureIDstr = req.body.featureIDs.toString();
            return sequelize.query('CALL Sproc_AssignFeaturesToRole (:proleID, :pfeatureID, :puserID)',
                {
                    replacements: {
                        proleID: req.body.roleID,
                        pfeatureID: featureIDstr ? featureIDstr : null,
                        puserID: req.body.createdBy
                    }
                })
                .then(() =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.STATICMSG(MESSAGE_CONSTANT.FEATURES.FEATURE_ASSIGNED_TO_ROLE) })
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
