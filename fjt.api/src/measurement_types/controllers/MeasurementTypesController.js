const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');


const inputFields = [
    'id',
    'name',
    'isActive',
    'displayOrder',
    'refTypeID',
    'isDefault',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const measurementTypeModuleName = DATA_CONSTANT.MESUREMENT_TYPES.NAME;
module.exports = {
    // Create Measurement Type
    // POST : /api/v1/measurement_type/createMeasurementType
    // @return created measurement_type
    createMeasurementType: (req, res) => {
        const { MeasurementType } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }
            const where = {
                [Op.or]: [
                    { name: req.body.name }
                ]
            };

            if (req.body.displayOrder) {
                where[Op.or].push({ displayOrder: { [Op.eq]: req.body.displayOrder } });
            }

            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }

            return MeasurementType.findOne({
                where: where
            }).then((response) => {
                if (response && (req.body.displayOrder || response.name === req.body.name)) {
                    const fieldName = (response.name === req.body.name) ? DATA_CONSTANT.MEASUREMENT_TYPES_UNIQUE_FIELD.TYPE : DATA_CONSTANT.MEASUREMENT_TYPES_UNIQUE_FIELD.DISPLAY_ORDER;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else if (req.body.id) { // Update
                    COMMON.setModelUpdatedByFieldValue(req);

                    return MeasurementType.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => {
                        req.params['pMeasurementTypeID'] = req.body.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageUOMDetailInElastic);


                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(measurementTypeModuleName))
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else { // Create
                    COMMON.setModelCreatedByFieldValue(req);
                    return MeasurementType.create(req.body, {
                        fields: inputFields
                    }).then(measurementType =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, measurementType, MESSAGE_CONSTANT.CREATED(measurementTypeModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Measurement Type
    // POST : /api/v1/measurement_type/retriveMeasurementTypeList
    // @return list of measurement_type
    retriveMeasurementTypeList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetMeasurementTypes (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response && response.length > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { MeasurementType: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null);
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
    // Retrive detail of Measurement Type
    // GET : /api/v1/measurement_type/retriveMeasurementType
    // @return detail of measurement_type
    retriveMeasurementType: (req, res) => {
        const MeasurementType = req.app.locals.models.MeasurementType;
        if (req.params.id) {
            return MeasurementType.findOne({
                where: { id: req.params.id }

            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Remove Measurement Type
    // POST : /api/v1/measurement_type/removeMeasurementType
    // @return API response
    deleteMeasurementType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.MeasurementTypes.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(measurementTypeModuleName));
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
    // Retrive list of Measurement Type
    // GET : /api/v1/measurement_type/getMeasurementTypeList
    // @return list of Measurement Type
    getMeasurementTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetMeasurmentTypeList()', {
            type: sequelize.QueryTypes.SELECT
        }).then(measurementTypeList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(measurementTypeList[0]), null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive list of Measurement Type include Unit of measurement and their formula
    // GET : /api/v1/measurement_type/getConversionDetail
    // @param {id} measurement type id
    // @return list of Measurement Type include Unit of measurement and their formula
    getConversionDetail: (req, res) => {
        const { MeasurementType, UOMs, UnitDetailFormula } = req.app.locals.models;

        var whereCondition = {
            isActive: true
        };

        if (req.params.id) { whereCondition.id = req.params.id; }

        return MeasurementType.findAll({
            where: whereCondition,
            include: [{
                model: UOMs,
                as: 'unitMeasurement',
                include: [{
                    model: UnitDetailFormula,
                    as: 'unit_detail_formula'
                }]
            }],
            order: [[{ model: UOMs, as: 'unitMeasurement' }, 'ord', 'ASC']]
        }).then(conversionList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, conversionList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
