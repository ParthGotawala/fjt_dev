/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const currentModuleName = DATA_CONSTANT.SERIAL_NUMBER_CONFIGURATION.NAME;

const inputFields = [
    'id',
    'nickname',
    'partId',
    'configurationLevel',
    'isConsecutiveNumber',
    'prefix',
    'prefixLock',
    'noofDigits',
    'assyDateCode',
    'assyDateCodeFormat',
    'startNumber',
    'suffix',
    'suffixLock',
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
    'deleteByRoleId',
    'barcodeSeparatorID',
    'barcodeSeparatorLock'
];

module.exports = {

    // Retrive list of Serial Number Configuration
    // GET : /api/v1/serialnumberconfiguration
    // @return list of Serial Number Configuration
    retriveConfiguration: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetSerialConfiguration (:pNickname,:pPartId)', {
            replacements: {
                pNickname: req.query.nickname,
                pPartId: req.query.partId
            },
            type: sequelize.QueryTypes.SELECT
        }).then((configurationDetail) => {
            var configurationList = configurationDetail[0] && _.values(configurationDetail[0]).length > 0 ? _.values(configurationDetail[0]) : [];
            var historyList = configurationDetail[1] && _.values(configurationDetail[1]).length > 0 ? _.values(configurationDetail[1]) : [];
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { configurationList: configurationList, historyList: historyList }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Delete SR# Configuration
    // DELETE : /api/v1/serialnumberconfiguration
    // @return  Delete SR# Configuration
    deleteConfiguration: (req, res) => {
        const { SerialNumberConfiguration, WorkorderSerialMst } = req.app.locals.models;
        var obj = {};
        if (req.body.id) {
            return WorkorderSerialMst.findOne({
                where: {
                    configurationId: req.body.id
                }
            }).then((woSerialMstResp) => {
                if (woSerialMstResp) {
                    const messageContent = MESSAGE_CONSTANT.PARTS.SERIAL_NUMBER_ALREADY_IN_USE;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: messageContent,
                        err: null
                    });
                } else {
                    COMMON.setModelDeletedByFieldValue(req);
                    obj = {
                        isDeleted: req.body.isDeleted,
                        deletedAt: req.body.deletedAt,
                        deletedBy: req.body.deletedBy,
                        deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    return SerialNumberConfiguration.update(obj, {
                        where: {
                            id: req.body.id
                        }
                    }).then(resp => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, MESSAGE_CONSTANT.REMOVED(currentModuleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // save  Serial Number Configuration
    // GET : /api/v1/serialnumberconfiguration/saveConfiguration
    // @return saved Serial Number Configuration
    saveConfiguration: (req, res) => {
        const { SerialNumberConfiguration } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return SerialNumberConfiguration.update(req.body, {
                where: {
                    id: req.body.id
                },
                fields: inputFields
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(currentModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            COMMON.setModelCreatedByFieldValue(req);
            return SerialNumberConfiguration.create(req.body, {
                fields: inputFields
            }).then(jobType => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, jobType, MESSAGE_CONSTANT.CREATED(currentModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    }
};