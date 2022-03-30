const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

module.exports = {

    // Get list of all active feature
    // GET : /api/v1/feature/getFeaturesList
    // @param
    // @return list of all active features
    getFeaturesList: (req, res) => {
        const { FeatureMst } = req.app.locals.models;
        FeatureMst.findAll({
            where: { isActive: true },
            attributes: ['featureID', 'featureName', 'isActive']
        }).then((featureDetail) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, featureDetail, null);
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

    // Assign features to pages
    // POST : /api/v1/feature/AssignFeaturePageRights
    // @return message
    AssignFeaturePageRights: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            const featureIDstr = req.body.listObj.featureIDs.toString();
            return sequelize
                .query('CALL Sproc_AssignFeaturesToPage (:ppageID, :pfeatureID, :puserID)',
                    {
                        replacements: {
                            ppageID: req.body.listObj.pageID,
                            pfeatureID: featureIDstr ? featureIDstr : null,
                            puserID: req.body.createdBy
                        }
                    })
                .then(() =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.STATICMSG(MESSAGE_CONSTANT.FEATURES.FEATURE_ASSIGNED_TO_PAGE))
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
