const resHandler = require('../../resHandler');
const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'id',
    'externalTemperatureValue',
    'minTemperature',
    'maxTemperature',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const currentModuleName = DATA_CONSTANT.OPERATING_TEMPERATURE_CONVERSION.Name;

module.exports = {
    // Get Operating Temperature Conversion by ID
    // GET : /api/v1/operatingtemperatureconversion/retrieveOperatingTemperatureConversionById
    // @param {id} int
    // @return Operating Temperature Conversion
    retrieveOperatingTemperatureConversionById: (req, res) => {
        const { OperatingTemperatureConversionMst } = req.app.locals.models;
        if (req.params.id) {
            return OperatingTemperatureConversionMst.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: OperatingTemperatureConversionMst,
                attributes: ['id', 'externalTemperatureValue', 'minTemperature', 'maxTemperature']
            }).then((temperature) => {
                if (!temperature) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, temperature, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get List of Operating Temperature Conversion list
    // POST : /api/v1/operatingtemperatureconversion/retrieveOperatingTemperatureConversionList
    // @return List of Operating Temperature Conversion
    retrieveOperatingTemperatureConversionList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') { strWhere = null; }

            return sequelize
                .query('CALL Sproc_GetOperatingTemperatureConversionList(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        const dataObject = {
                            operatingTemperature: _.values(response[1]),
                            Count: response[0][0]['TotalRecord']
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataObject, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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

    // Create Operating Temperature Conversion
    // POST : /api/v1/operatingtemperatureconversion
    // @return New create Operating Temperature Conversion
    createOperatingTemperatureConversion: (req, res) => {
        const { OperatingTemperatureConversionMst } = req.app.locals.models;
        if (req.body) {
            return OperatingTemperatureConversionMst.findOne({
                where: {
                    externalTemperatureValue: req.body.externalTemperatureValue
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(currentModuleName), err: null, data: null });
                } else {
                    if (req.body.minTemperature > req.body.maxTemperature) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.MIN_AND_MAX_OPERATING_TEMPERATURE_VALIDATION, err: null, data: null });
                    }
                    COMMON.setModelCreatedByFieldValue(req);
                    req.body.isDeleted = 0;
                    return OperatingTemperatureConversionMst.create(req.body, {
                        fields: inputFields
                    }).then(temperature => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, temperature, MESSAGE_CONSTANT.CREATED(currentModuleName)));
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

    // Update Operating Temperature Conversion
    // PUT : /api/v1/operatingtemperatureconversion/updateOperatingTemperatureConversion
    // @param {id} int
    // @return Operating Temperature Conversion
    updateOperatingTemperatureConversion: (req, res) => {
        const {
            OperatingTemperatureConversionMst
        } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);

            return OperatingTemperatureConversionMst.findOne({
                where: {
                    id: { [Op.ne]: req.body.id },
                    externalTemperatureValue: req.body.externalTemperatureValue
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(currentModuleName), err: null, data: null });
                } else {
                    if (req.body.minTemperature > req.body.maxTemperature) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.MIN_AND_MAX_OPERATING_TEMPERATURE_VALIDATION, err: null, data: null });
                    }
                    // COMMON.setModelCreatedByFieldValue(req);
                    return OperatingTemperatureConversionMst.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(temperature => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, temperature, MESSAGE_CONSTANT.UPDATED(currentModuleName)));
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

    // delete Operating Temperature Conversion
    // POST : /api/v1/operatingtemperatureconversion/deleteOperatingTemperatureConversion
    // @param {id} int
    // @return delete Operating Temperature Conversion
    deleteOperatingTemperatureConversion: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.OPERATING_TEMPERATURE_CONVERSION_MASTER.Name;
            const entityID = COMMON.AllEntityIDS.OPERATING_TEMPERATURE_CONVERSION_MASTER.ID;
            const refrenceIDs = null;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((temperature) => {
                if (temperature.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: temperature, IDs: req.body.objIDs.id }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};