const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const moduleName = DATA_CONSTANT.USERCONFIGURATION.NAME;
const inputFields = [
    'ID',
    'userId',
    'configurationID',
    'configurationValue',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive user configuration preference
    // GET : /api/v1/userConfig/getUserPreference
    // @return specific userConfigurations
    getUserPreference: (req, res) => {
        if (req.body.userId && req.body.configurationID) {
            const UserConfig = req.app.locals.models.UserConfiguration;
            return UserConfig.findOne({
                where: {
                    userId: req.body.userId,
                    configurationID: req.body.configurationID,
                    isDeleted: false
                },
                attributes: ['ID', 'configurationID', 'configurationValue', 'userId']
            }).then(userConfigDet => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, userConfigDet, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    // save user Configuration
    // PUT : /api/v1/userConfig/saveUserConfiguration
    // @return API response
    saveUserConfiguration: (req, res) => {
        if (req.body && req.body.userId && req.body.configurationID) {
            const UserConfiguration = req.app.locals.models.UserConfiguration;
            const saveConfigPromises = [];

            saveConfigPromises.push(
                UserConfiguration.findOne({
                    attributes: ['ID'],
                    where: {
                        userId: req.body.userId,
                        configurationID: req.body.configurationID,
                        isDeleted: false
                    }
                }).then((dbUserConfig) => {
                    if (dbUserConfig && dbUserConfig.dataValues.ID) {
                        // update existing configuration entry
                        COMMON.setModelUpdatedByFieldValue(req);
                        return UserConfiguration.update(req.body, {
                            where: {
                                ID: dbUserConfig.dataValues.ID
                            },
                            fields: ['configurationValue', 'updatedBy', 'updateByRoleId', 'updatedAt']
                        });
                    } else {
                        // create new configuration entry
                        COMMON.setModelCreatedByFieldValue(req);
                        return UserConfiguration.create(req.body, {
                            fields: inputFields
                        });
                    }
                })
            );

            return Promise.all(saveConfigPromises).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
