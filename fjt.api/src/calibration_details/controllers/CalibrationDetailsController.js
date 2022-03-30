const resHandler = require('../../resHandler');
const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'id',
    'refEqpID',
    'calibrationType',
    'calibrationDate',
    'calibrationExpirationDate',
    'calibrationComments',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const currentModuleName = DATA_CONSTANT.CALIBRATION_DETAILS.Name;

module.exports = {
    // Get Calibration Details by ID
    // GET : /api/v1/calibrationdetails/retrieveCalibrationDetailsById
    // @param {id} int
    // @return Calibration Details
    retrieveCalibrationDetailsById: (req, res) => {
        const { CalibrationDetails, Equipment } = req.app.locals.models;
        if (req.params.id) {
            return CalibrationDetails.findOne({
                where: {
                    id: req.params.id,
                    isDeleted: false
                },
                model: CalibrationDetails,
                attributes: ['id', 'refEqpID', 'calibrationType', 'calibrationDate', 'calibrationExpirationDate', 'calibrationComments'],
                include: [{
                    model: Equipment,
                    as: 'equipment',
                    where: {
                        isDeleted: false
                    },
                    attributes: ['eqpID', 'assetName', 'equipmentAs', 'eqpMake', 'eqpModel', 'isActive'],
                    required: false
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName), err: null, data: null });
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

    // Get List of Calibration Details
    // POST : /api/v1/calibrationdetails/retrieveCalibrationDetailsList
    // @return List of Calibration Details
    retrieveCalibrationDetailsList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize
                .query('CALL Sproc_GetCalibrationDetailsList(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pCurrentCalibrationDetail,:pEqpId)', {
                    replacements: {
                        ppageIndex: req.body.Page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pCurrentCalibrationDetail: req.body.currentCalibrationDetail || false,
                        pEqpId: req.body.eqpId || null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        _.each(_.values(response[1]), (item) => {
                            item.eqpDescription = COMMON.getTextAngularValueFromDB(item.eqpDescription);
                        });
                        const dataObject = {
                            calibrationDetails: _.values(response[1]),
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

    // Create Calibration Details
    // POST : /api/v1/calibrationdetails
    // @return New create Calibration Details
    createCalibrationDetails: (req, res) => {
        const { CalibrationDetails, Equipment, sequelize } = req.app.locals.models;
        if (req.body) {
            return CalibrationDetails.findOne({
                where: {
                    refEqpID: req.body.refEqpID,
                    calibrationType: req.body.calibrationType,
                    calibrationDate: req.body.calibrationDate
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(currentModuleName), err: null, data: null });
                } else {
                    if (req.body.calibrationDate >= req.body.calibrationExpirationDate) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.CALIBRATION_DATE_AND_CALIBRATION_EXPIRATION_DATE_VALIDATION, err: null, data: null });
                    }
                    return Equipment.findOne({
                        where: {
                            eqpID: req.body.refEqpID
                        }
                    }).then((eqpDetail) => {
                        if (eqpDetail) {
                            const currentDate = new Date(req.body.calibrationDate);
                            if (eqpDetail.outOfServiceDate && eqpDetail.outOfServiceDate <= currentDate) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.CALBRATION_NOT_ALLOWED_FOR_OUT_OF_SERVICE_EQUIPMENT, err: null, data: null });
                            }
                            COMMON.setModelCreatedByFieldValue(req);
                            req.body.isDeleted = 0;
                            return sequelize.transaction().then(t => CalibrationDetails.create(req.body, {
                                fields: inputFields,
                                transaction: t
                            }).then((calibration) => {
                                // Add calibtaion detail into Elastic Search Engine for Enterprise Search
                                if (calibration) {
                                    req.params['id'] = calibration.id;
                                    EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageCalibrationDetailInElastic);
                                }
                                return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, calibration, MESSAGE_CONSTANT.CREATED(currentModuleName)));
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            })
                            );
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }).catch((err) => {
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

    // Update Calibration Details
    // PUT : /api/v1/calibrationdetails/updateCalibrationDetails
    // @param {id} int
    // @return Calibration Details
    updateCalibrationDetails: (req, res) => {
        const {
            CalibrationDetails, sequelize
        } = req.app.locals.models;
        if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);

            return CalibrationDetails.findOne({
                where: {
                    id: { [Op.ne]: req.body.id },
                    refEqpID: req.body.refEqpID,
                    calibrationType: req.body.calibrationType,
                    calibrationDate: req.body.calibrationDate
                }
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(currentModuleName), err: null, data: null });
                } else {
                    if (req.body.calibrationDate >= req.body.calibrationExpirationDate) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.CALIBRATION_DATE_AND_CALIBRATION_EXPIRATION_DATE_VALIDATION, err: null, data: null });
                    }
                    COMMON.setModelCreatedByFieldValue(req);
                    return sequelize.transaction().then(t => CalibrationDetails.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields,
                        transaction: t
                    }).then((calibration) => {
                        // update calibtaion detail into Elastic Search Engine for Enterprise Search
                        if (calibration) {
                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageCalibrationDetailInElastic);
                        }
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, calibration, MESSAGE_CONSTANT.UPDATED(currentModuleName)));
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
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

    // delete Calibration Details
    // POST : /api/v1/calibrationdetails/deleteCalibrationDetails
    // @param {id} int
    // @return delete Calibration Details
    deleteCalibrationDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.CALIBRATION_DETAILS.Name;
            const entityID = COMMON.AllEntityIDS.CALIBRATION_DETAILS.ID;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((calibration) => {
                if (calibration.length === 0) {
                    // Remove Department Detail from Elastic Engine Database
                    EnterpriseSearchController.deleteCalibrationDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: calibration, IDs: req.body.objIDs.id }, null);
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