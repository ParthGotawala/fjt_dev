const _ = require('lodash');
const { Op } = require('sequelize');

const resHandler = require('../../resHandler');
const ComponentFieldGenericAlias = require('../../component_field_generic_Alias/controllers/Component_Field_Generic_Alias_Controller.js');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const uomModuleName = DATA_CONSTANT.UOM.NAME;

const inputFields = ['id', 'unitName', 'measurementTypeID', 'abbreviation', 'perUnit', 'baseUnitID', 'baseUnitConvertValue', 'isFormula', 'description', 'isDefault', 'isSystemDefault', 'ord', 'isDeleted', 'createdBy', 'updatedBy', 'deletedBy', 'defaultUOM', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId', 'operator', 'orgBaseUnitValue'];

module.exports = {
    // Create Measurement Type
    // POST : /api/v1/uoms/createUnitOfMeasurement
    // @return created Unit of Measurement
    createUnitOfMeasurement: (req, res) => {
        const { UOMs, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.unitName) {
                req.body.unitName = COMMON.TEXT_WORD_CAPITAL(req.body.unitName, false);
            }

            const where = {
                [Op.or]: [
                    { measurementTypeID: { [Op.eq]: req.body.measurementTypeID } },
                    { unitName: req.body.unitName },
                    { abbreviation: req.body.abbreviation }
                ]
            };

            if (req.body.id || req.body.id === 0) {
                where.id = { [Op.ne]: req.body.id };
            }

            if (req.body.ord) {
                where[Op.or].push({ ord: req.body.ord });
            }

            return UOMs.findAll({
                where: where
            }).then((uomsDetail) => {
                // if (uomsDetail.length > 0 && (req.body.ord || uomsDetail[0].unitName == req.body.unitName || uomsDetail[0].abbreviation == req.body.abbreviation)) {
                let fieldName;
                if (uomsDetail.length > 0 && (req.body.ord || (req.body.unitName &&
                    _.some(uomsDetail, data => data.unitName.toUpperCase() === req.body.unitName.toUpperCase())) || (req.body.abbreviation &&
                        _.some(uomsDetail, data => data.abbreviation.toUpperCase() === req.body.abbreviation.toUpperCase())))) {
                    if (req.body.isUpdateDisplayOrder && req.body.ord && _.some(uomsDetail, data => data.ord === req.body.ord)) {
                        fieldName = DATA_CONSTANT.UOM_UNIQUE_FIELD.DISPLAY_ORDER; // MESSAGE_CONSTANT.UOM.UOM_ORDER_UNIQUE;
                    } else if (req.body.unitName && _.some(uomsDetail, data => req.body.id !== data.id && data.unitName.toUpperCase() === req.body.unitName.toUpperCase())) {
                        fieldName = DATA_CONSTANT.UOM_UNIQUE_FIELD.NAME; // MESSAGE_CONSTANT.UOM.UOM_NAME_UNIQUE;
                    } else if (req.body.abbreviation && _.some(uomsDetail, data => req.body.id !== data.id && data.abbreviation.toUpperCase() === req.body.abbreviation.toUpperCase())) {
                        fieldName = DATA_CONSTANT.UOM_UNIQUE_FIELD.ABBREVIATION; //  MESSAGE_CONSTANT.UOM.UOM_ABBREVIATION_UNIQUE;
                    }
                }
                if (fieldName) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else {
                    if (req.body.isFormula === true) {
                        req.body.baseUnitID = null;
                        req.body.baseUnitConvertValue = null;
                    }
                    // Update
                    if (req.body.id || req.body.id === 0) {
                        if (req.body.defaultUOM) {
                            return UOMs.findAll({
                                where: {
                                    measurementTypeID: req.body.measurementTypeID
                                }
                            }).then((uomsList) => {
                                const obj = _.find(uomsList, data => data.defaultUOM === true);
                                if (obj) {
                                    return sequelize.transaction().then((t) => {
                                        const objNew = {
                                            updatedBy: req.user.id,
                                            defaultUOM: false,
                                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                        };
                                        return UOMs.update(objNew, {
                                            where: {
                                                id: obj.id
                                            },
                                            fields: ['defaultUOM', 'updatedBy', 'updateByRoleId'],
                                            transaction: t
                                        }).then((response) => {
                                            if (response) {
                                                COMMON.setModelUpdatedByFieldValue(req);
                                                return UOMs.update(req.body, {
                                                    where: {
                                                        id: req.body.id
                                                    },
                                                    fields: inputFields,
                                                    transaction: t
                                                }).then(() => {
                                                    const unitOfMeasurement = req.body;
                                                    const detail = {
                                                        refTableName: req.body.refTableName,
                                                        refId: req.body.id,
                                                        alias: req.body.alias
                                                    };
                                                    return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                                        if (response) {
                                                            if (response.status === STATE.SUCCESS) {
                                                                if (req.body.isBaseUnit && req.body.baseUnitID) {
                                                                    return module.exports.saveDefaultBaseUOMDetail(req, req.body.measurementTypeID, req.body.id, t).then((uomResponse) => {
                                                                        if (uomResponse === STATE.SUCCESS) {
                                                                           return t.commit().then(() => {
                                                                                // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                                                req.params = { pId: req.body.id };
                                                                                // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                                                // Need to change timeout code due to trasaction not get updated record
                                                                                EnterpriseSearchController.manageUOMDetailInElastic(req);

                                                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.UPDATED(uomModuleName));
                                                                            });
                                                                        } else {
                                                                            t.rollback();
                                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                                                        }
                                                                    });
                                                                } else {
                                                                  return t.commit().then(() => {
                                                                        // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                                        req.params = { pId: req.body.id };
                                                                        // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                                        // Need to change timeout code due to trasaction not get updated record
                                                                        EnterpriseSearchController.manageUOMDetailInElastic(req);

                                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.UPDATED(uomModuleName));
                                                                    });
                                                                }
                                                            } else if (response.isDuplicate) {
                                                                if (!t.finished) {
                                                                    t.rollback();
                                                                }
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DATA_CONSTANT.UOM_UNIQUE_FIELD.NAME), err: response.err || null, data: null });
                                                            }
                                                        } else {
                                                            if (!t.finished) {
                                                                t.rollback();
                                                            }
                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                                        }
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                });
                                            } else {
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(uomModuleName), err: null, data: null });
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(uomModuleName), err: null, data: null });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            return sequelize.transaction().then((t) => {
                                COMMON.setModelUpdatedByFieldValue(req);
                                return UOMs.update(req.body, {
                                    where: {
                                        id: req.body.id
                                    },
                                    fields: inputFields,
                                    transaction: t
                                }).then(() => {
                                    const unitOfMeasurement = req.body;
                                    // in case only updating display order from UOM grid
                                    if (!req.body.isUpdateDisplayOrder) {
                                        const detail = {
                                            refTableName: req.body.refTableName,
                                            refId: req.body.id,
                                            alias: req.body.alias
                                        };
                                        return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                            if (response) {
                                                if (response.status === STATE.SUCCESS) {
                                                    if (req.body.isBaseUnit && req.body.baseUnitID) {
                                                        return module.exports.saveDefaultBaseUOMDetail(req, req.body.measurementTypeID, req.body.id, t).then((uomResponse) => {
                                                            if (uomResponse === STATE.SUCCESS) {
                                                                return t.commit().then(() => {
                                                                    // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                                    req.params = { pId: req.body.id };
                                                                    // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                                    // Need to change timeout code due to trasaction not get updated record
                                                                    EnterpriseSearchController.manageUOMDetailInElastic(req);

                                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.UPDATED(uomModuleName));
                                                                });
                                                            } else {
                                                                t.rollback();
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                                            }
                                                        });
                                                    } else {
                                                       return t.commit().then(() => {
                                                            // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                            req.params = { pId: req.body.id };
                                                            // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                            // Need to change timeout code due to trasaction not get updated record
                                                            EnterpriseSearchController.manageUOMDetailInElastic(req);

                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.UPDATED(uomModuleName));
                                                        });
                                                    }
                                                } else if (response.isDuplicate) {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DATA_CONSTANT.UOM_UNIQUE_FIELD.NAME), err: response.err || null, data: null });
                                                } else {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                                }
                                            } else {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                            }
                                        });
                                    } else {
                                        return t.commit().then(() => {
                                            // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                            req.params = { pId: req.body.id };
                                            // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                            // Need to change timeout code due to transaction not get updated record
                                            EnterpriseSearchController.manageUOMDetailInElastic(req);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.UPDATED(uomModuleName));
                                        });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }
                    } else if (req.body.defaultUOM && uomsDetail.length > 0) {
                        const obj = _.find(uomsDetail, data => data.defaultUOM === true);
                        if (obj) {
                            const objNew = {
                                updatedBy: req.user.id,
                                defaultUOM: false,
                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                            };
                            return sequelize.transaction().then((t) => {
                                return UOMs.update(objNew, {
                                    where: {
                                        id: obj.id
                                    },
                                    fields: ['defaultUOM', 'updatedBy', 'updateByRoleId'],
                                    transaction: t
                                }).then((response) => {
                                    if (response) {
                                        COMMON.setModelCreatedByFieldValue(req);
                                        return UOMs.create(req.body, {
                                            fields: inputFields,
                                            transaction: t
                                        }).then((unitOfMeasurement) => {
                                            const detail = {
                                                refTableName: req.body.refTableName,
                                                refId: obj.id,
                                                alias: req.body.alias
                                            };
                                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                                // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                                if (response) {
                                                    if (response.status === STATE.SUCCESS) {
                                                        t.commit().then(() => {
                                                            req.params = { pId: unitOfMeasurement.id };
                                                            EnterpriseSearchController.manageUOMDetailInElastic(req);

                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.CREATED(uomModuleName));
                                                        });
                                                    } else if (response.isDuplicate) {
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DATA_CONSTANT.UOM_UNIQUE_FIELD.NAME), err: response.err || null, data: null });
                                                    }
                                                } else {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                                }
                                            });
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(uomModuleName), err: null, data: null });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_CREATED(uomModuleName), err: null, data: null });
                        }
                    } else {
                        return sequelize.transaction().then((t) => {
                            COMMON.setModelCreatedByFieldValue(req);
                            return UOMs.create(req.body, {
                                fields: inputFields,
                                transaction: t
                            }).then((unitOfMeasurement) => {
                                const detail = {
                                    refTableName: req.body.refTableName,
                                    refId: unitOfMeasurement.id,
                                    alias: req.body.alias
                                };
                                return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                    // Add Unit of measurement Detail into Elastic Search Engine for Enterprise Search
                                    if (response) {
                                        if (response.status === STATE.SUCCESS) {
                                            t.commit().then(() => {
                                                req.params = { pId: unitOfMeasurement.id };
                                                EnterpriseSearchController.manageUOMDetailInElastic(req);

                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurement, MESSAGE_CONSTANT.CREATED(uomModuleName));
                                            });
                                        } else if (response.isDuplicate) {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DATA_CONSTANT.UOM_UNIQUE_FIELD.NAME), err: response.err || null, data: null });
                                        }
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: response.err || null, data: null });
                                    }
                                });
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
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
    // POST : /api/v1/uoms/retriveUnitOfMeasurementList
    // @return list of Unit of Measurement
    retriveUnitOfMeasurementList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetUnitOfMeasurement (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pMeasurementTypeId)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pMeasurementTypeId: req.body.MeasurementTypeId ? req.body.MeasurementTypeId : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    UOMs: _.values(response[1]),
                    Count: response[0][0]['TotalRecord']
                }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive detail of Unit of Measurement
    // GET : /api/v1/uoms/retriveUnitOfMeasurement
    // @return detail of Unit of Measurement
    retriveUnitOfMeasurement: (req, res) => {
        const UOMs = req.app.locals.models.UOMs;
        if (req.params.id) {
            return UOMs.findOne({
                where: {
                    id: req.params.id
                }
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
    // POST : /api/v1/uoms/removeUnitOfMeasurement
    // @return API response
    removeUnitOfMeasurement: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.UOMs.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    // Delete Unit of Measurement Detail from Elastic Search
                    EnterpriseSearchController.deleteUOMDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(uomModuleName));
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
    // Retrive list of Unit of Measurement
    // GET : /api/v1/uoms/getUnitOfMeasurementList
    // @param {id} int
    // @param {measurementID} int
    // @return list of Unit of Measurement
    getUnitOfMeasurementList: (req, res) => {
        const { UOMs } = req.app.locals.models;
        var where = {};
        if (req.params.id) {
            where.id = {
                [Op.ne]: req.params.id
            };
        }
        if (req.params.measurementTypeID) {
            where.measurementTypeID = req.params.measurementTypeID;
        }
        return UOMs.findAll({
            where: where
        }).then(unitOfMeasurementList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurementList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Unit of Measurement
    // GET : /api/v1/uoms/getUOMListByMeasurementID
    // @return list of Unit of Measurement
    getUOMListByMeasurementID: (req, res) => {
        const { UOMs } = req.app.locals.models;

        return UOMs.findAll({
            where: {
                [Op.or]: [
                    { measurementTypeID: req.params.measurementTypeID },
                    { id: 0 }
                ]
            },
            order: [['ord', 'ASC']]
        }).then(unitOfMeasurementList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurementList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Unit of Measurement
    // GET : /api/v1/uoms/getUOMsList
    // @param {id} int
    // @param {measurementID} int
    // @return list of Unit of Measurement
    getUOMsList: (req, res) => {
        const { UOMs, MeasurementType, ComponentFieldsGenericaliasMst, UnitDetailFormula, sequelize } = req.app.locals.models;
        var where = {
            isDeleted: false
        };
        if (req.params.id) {
            where.id = {
                [Op.ne]: req.params.id
            };
        }
        if (req.params.measurementTypeID) {
            where.measurementTypeID = req.params.measurementTypeID;
        }
        return UOMs.findAll({
            where: where,
            paranoid: false,
            attributes: ['id', 'unitName', 'isFormula', 'baseUnitConvertValue', 'measurementTypeID', 'abbreviation'],
            include: [{
                model: MeasurementType,
                where: {
                    isDeleted: false
                },
                paranoid: false,
                as: 'measurementType',
                attributes: ['id', 'name']
            }, {
                model: ComponentFieldsGenericaliasMst,
                paranoid: false,
                as: 'alias',
                attributes: ['id', 'alias', 'refId'],
                where: {
                    isDeleted: false,
                    refId: {
                        [Op.col]: 'UOMs.id'
                    },
                    refTableName: DATA_CONSTANT.UOM.TableName
                },
                required: false
            }, {
                model: UnitDetailFormula,
                paranoid: false,
                where: {
                    isDeleted: false
                },
                required: false,
                as: 'unit_detail_formula',
                attributes: ['id', 'unitID', 'toUnitID', 'formula']
            }],
            order: [
                sequelize.fn('isnull', sequelize.col('ord')),
                ['ord', 'ASC'],
                ['unitName', 'ASC']
            ]
        }).then(unitOfMeasurementList =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, unitOfMeasurementList, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check uom exist or not
    // post:/api/v1/uoms/checkDuplicateUOM
    // @retrun validity of uom
    checkDuplicateUOM: (req, res) => {
        const { UOMs, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseMfg = {
                [Op.or]: [{
                    unitName: req.body.name
                },
                {
                    abbreviation: req.body.name
                }
                ],
                isDeleted: false
            };
            if (req.body.id) {
                whereClauseMfg.id = { [Op.ne]: req.body.id };
            }
            return UOMs.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((uoms) => {
                if (uoms) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return ComponentFieldsGenericaliasMst.findOne({
                        where: {
                            alias: req.body.name,
                            refTableName: req.body.refTableName,
                            refId: { [Op.ne]: req.body.id }
                        },
                        attributes: ['id']
                    }).then((uomAlias) => {
                        if (uomAlias) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicate: false }, null);
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

    // Check is alias is not in uom alias
    // DELETE : /api/v1/uoms/checkUniqueUOMAlias
    // @return list of UOM alias
    checkUniqueUOMAlias: (req, res) => {
        /* set type of module request */
        const { UOMs, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var wheregeneric = {
            alias: req.body.alias,
            refTableName: req.body.refTableName
        };
        if (req.body.id) {
            wheregeneric.refId = { [Op.ne]: req.body.id };
        }
        ComponentFieldsGenericaliasMst.findOne({
            attributes: ['id', 'alias', 'refId'],
            where: wheregeneric
        }).then((uomAliasExistsInfo) => {
            if (uomAliasExistsInfo) {
                UOMs.findOne({
                    attributes: ['id', 'unitName', 'abbreviation'],
                    where: {
                        id: uomAliasExistsInfo.refId
                    }
                }).then((uomType) => {
                    var obj = {
                        alias: uomAliasExistsInfo.alias,
                        unitName: uomType.unitName,
                        name: uomType.abbreviation
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { uomAliasExistsInfo: obj });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                const whereClauseMfg = {
                    [Op.or]: [{
                        unitName: req.body.alias
                    },
                    {
                        abbreviation: req.body.alias
                    }
                    ],
                    isDeleted: false
                };
                if (req.body.id) {
                    whereClauseMfg.id = { [Op.ne]: req.body.id };
                }
                UOMs.findOne({
                    where: whereClauseMfg,
                    attributes: ['id', 'unitName']
                }).then(uomExistInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { uomExistInfo: uomExistInfo })).catch((err) => {
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
    },
    // POST update default UOM
    // @return upadted details
    saveDefaultBaseUOMDetail: (req, measermentID, uomID, t) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize
            .query('CALL Sproc_generateDefaultBaseUOM (:pID, :pMeasurementTypeID, :pUserID, :pUserRoleId)', {
                replacements: {
                    pID: uomID,
                    pMeasurementTypeID: measermentID,
                    pUserID: req.user.id,
                    pUserRoleId: req.user.defaultLoginRoleID
                },
                transaction: t
            }).then(() => STATE.SUCCESS
            ).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
    }
};