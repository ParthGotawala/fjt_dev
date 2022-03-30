const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const udfModuleName = DATA_CONSTANT.UNIT_DETAIL_FORMULA.NAME;

const inputFields = ['id', 'unitID', 'toUnitID', 'formula', 'isDeleted', 'createdBy', 'updatedBy', 'deletedBy', 'deletedAt', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'];

module.exports = {
    // Create Unit detail formula
    // POST : /api/v1/uoms/createUnitDetailFormula
    // @return created Unit detail formula
    createUnitDetailFormula: (req, res) => {
        const { UnitDetailFormula } = req.app.locals.models;
        if (req.body) {
            const id = req.body.id ? req.body.id : null;
            return UnitDetailFormula.count({
                where: {
                    unitID: req.body.unitID,
                    toUnitID: req.body.toUnitID,
                    id: { [Op.ne]: id }
                }
            }).then((count) => {
                if (count > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.UNIT_DETAIL_FORMULA_UNIQUE, err: null, data: null });
                }
                // Update
                if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return UnitDetailFormula.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(response =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(udfModuleName))
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return UnitDetailFormula.create(req.body, {
                        fields: inputFields
                    }).then(unitDetailFormula =>
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitDetailFormula, MESSAGE_CONSTANT.CREATED(udfModuleName))
                    ).catch((err) => {
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Unit detail formula
    // GET : /api/v1/unit_detail_formula/retriveUnitDetailFormula
    // @return list of Unit detail formula
    retriveUnitDetailFormula: (req, res) => {
        const { UnitDetailFormula, sequelize } = req.app.locals.models;
        if (req.params.id) {
            UnitDetailFormula.findOne({
                where: { id: req.params.id }
            }).then((unitDetailFormula) => {
                if (!unitDetailFormula) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitDetailFormula, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            const filter = COMMON.UiGridFilterSearch(req);

            // create where clause
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            sequelize.query('CALL Sproc_GetUnitDetailFormula (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pUnitID)', {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pUnitID: req.query.unitID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    UnitDetailFormula: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // Remove Unit detail formula
    // POST : /api/v1/unit_detail_formula/removeUnitDetailFormula
    // @return API response
    removeUnitDetailFormula: (req, res) => {
        const { UnitDetailFormula } = req.app.locals.models;
        if (req.body.ids) {
            COMMON.setModelDeletedByFieldValue(req);
            return UnitDetailFormula.update(req.body, {
                where: {
                    id: req.body.ids
                },
                fields: inputFields
            }).then((rowsDeleted) => {
                if (rowsDeleted > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(udfModuleName));
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_DELETED(udfModuleName), err: null, data: null });
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
    // Retrive list of Unit of Measurement
    // GET : /api/v1/uoms/getUnitOfMeasurementList
    // @return list of Unit of Measurement
    getUnitOfMeasurementList: (req, res) => {
        const { UOMs } = req.app.locals.models;
        var where = {};
        if (req.params.id) {
            where = {
                id: { [Op.ne]: req.params.id }
            };
        }
        return UOMs.findAll({
            where: where,
            attributes: ['id', 'unitName']
        }).then(unitOfMeasurementList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurementList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
