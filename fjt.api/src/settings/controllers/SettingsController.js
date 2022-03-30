/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const _ = require('lodash');
const momentTz = require('moment-timezone');

const currentModuleName = DATA_CONSTANT.SETTINGS.DISPLAYNAME;

const inputFields = [
    'id',
    'key',
    'values',
    'clusterName',
    'isEncrypted',
    'isActive',
    'isDeleted',
    'isEditable',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'displayName',
    'description',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {

    // Retrive list of settings
    // POST : /api/v1/settings
    // @return list of settings
    retriveDataKeyList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        // console.log('filter ', COMMON.UiGridFilterSearch(req));
        // console.log('strWhere ', COMMON.UIGridWhereToQueryWhere(filter.where));
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveSettings(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { settings: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Update settings
    // PUT : /api/v1/settings
    // @return API response
    updateSettings: (req, res) => {
        const { Settings } = req.app.locals.models;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            console.log('inputFields ', inputFields);
            return Settings.update(req.body, {
                where: {
                    id: req.params.id
                },
                fields: inputFields
            }).then(response => {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(currentModuleName));
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of selected settings
    // GET : /api/v1/settings/getSelectedGlobalSettingKeyValues
    // @return list of selected settings
    getSelectedGlobalSettingKeyValues: (req, res) => {
        if (req.body.allKeys) {
            const { Settings } = req.app.locals.models;

            return Settings.findAll({
                where: {
                    key: [req.body.allKeys]
                },
                attributes: ['key', 'values']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of selected settings
    // GET : /api/v1/settings/getDefinedGlobalSettingKeyValues
    // @return list of selected settings
    getDefinedGlobalSettingKeyValues: (req, res) => {
        if (req.query.allKeys) {
            const { Settings } = req.app.locals.models;

            return Settings.findAll({
                where: {
                    key: req.query.allKeys
                },
                attributes: ['key', 'values', 'description']
            }).then((response) => {
                // At UI side pass actual timezone offset value
                var findTimeZoneKey = _.find(response, resp => resp.key === 'TimeZone');
                if (findTimeZoneKey) {
                    const timezoneOffset = momentTz.tz(findTimeZoneKey.values).format('Z');
                    findTimeZoneKey.dataValues.values = timezoneOffset;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { globalSettingKeyValues: response }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of external key settings
    // POST : /api/v1/retriveExternalKeySettings
    // @return external key settings
    retriveExternalKeySettings: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveExternalKeySettings (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { settings: _.values(response[1]), Count: response[0][0]['COUNT(1)'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // save external key settings
    // GET : /api/v1/saveExternalKeySettings
    // @return saved external key settings
    saveExternalKeySettings: (req, res) => {
        const { ExternalAPIConfigurationSettings } = req.app.locals.models;
        if (req.body) {
            const setting = req.body.externalKeys;

            return ExternalAPIConfigurationSettings.bulkCreate(setting, {
                updateOnDuplicate: ['clientID', 'secretID', 'id', 'perCallRecordCount', 'specialPriceCustomerID', 'dkCallLimit']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(DATA_CONSTANT.SETTINGS.DISPLAYKEYNAME))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of All Timezones
    // GET : /api/v1/getTimezoneList
    // @return list of Timezone
    getTimezoneList: (req, res) => {
        try {
            const timeZones = momentTz.tz.names();
            let offsetTmz = [];
            for (let i = 0; i < timeZones.length; i += 1) {
                const timezoneOffset = momentTz.tz(timeZones[i]).format('Z');
                offsetTmz.push({ id: timezoneOffset, value: `(UTC${timezoneOffset})${timeZones[i]}`, offsetDBValue: `${timeZones[i]}` });
            }
            offsetTmz = _.sortBy(offsetTmz, item => item.id).reverse();
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, offsetTmz, null);
        } catch (err) {
            console.trace();
            console.error(err); // used Invalid parameter as in old response
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    // Retrive company logo external key settings
    // GET : /api/v1/retriveExternalKeySettingsForCompanyLogo
    // @return external key settings
    retriveExternalKeySettingsForCompanyLogo: (req, res) => {
        const { Settings } = req.app.locals.models;
        return Settings.findAll({
                where: {
                    key: 'CompanyLogo'
                },
                attributes: ['values']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { globalSettingCompanyLogo: response[0] }, null))
            .catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }
};