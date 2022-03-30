const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'ecoTypeValID',
    'ecoTypeCatID',
    'name',
    'noteRequired',
    'displayOrder',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrive list of ECO type values
    // GET : /api/v1/ecotypevalue/retriveECOTypeValuesList
    // @return list of ECO type values
    retriveECOTypeValuesList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetriveECOTypeValues (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pcategory)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pcategory: req.body.CategoryType
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ecoTypevalues: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive detail of ECO type values
    // GET : /api/v1/ecotypevalue/:id
    // @param {ecoTypeValID} int
    retriveECOTypeValues: (req, res) => {
        const { ECOTypeValues, ECOTypeCategory } = req.app.locals.models;
        if (req.params.id) {
            return ECOTypeValues.findByPk(req.params.id, {
                include: [{
                    model: ECOTypeCategory,
                    as: 'ecoTypeCategory'
                }],
                where: { ecoTypeValID: req.params.id }
            }).then((ecotypevalues) => {
                if (!ecotypevalues) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ecotypevalues }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create ECO type value
    // POST : /api/v1/ecotypevalue
    // @return new created ECO type value detail
    createECOTypeValue: (req, res) => {
        const ECOTypeValues = req.app.locals.models.ECOTypeValues;
        if (req.body) {
            const currentModuleName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_VALUES.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_ATTRIBUTE.NAME;
            const fieldName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_VALUES_UNIQUE_FIELD.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_ATTRIBUTE_UNIQUE_FIELD.NAME;
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            return ECOTypeValues.findAll({
                where: {
                    ecoTypeCatID: { [Op.eq]: req.body.ecoTypeCatID },
                    [Op.or]: [
                        { name: { [Op.eq]: req.body.name } }
                    ]
                },
                paranoid: true
            }).then((findEcoTypelist) => {
                if (findEcoTypelist.length > 0) {
                    const EcoUniqueName = _.find(findEcoTypelist, cat => cat.name.toLowerCase() === req.body.name.toLowerCase());
                    if (EcoUniqueName) { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null }); }
                }
                COMMON.setModelCreatedByFieldValue(req);
                return ECOTypeValues.create(req.body, {
                    field: inputFields
                }).then((findEcoTypelists) => {
                    // Add ECO/DFM Category Attribute detail into Elastic Search Engine for Enterprise Search
                    if (findEcoTypelists && findEcoTypelists.ecoTypeValID) {
                        req.params['pId'] = findEcoTypelists.ecoTypeValID;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageECODFMCategoryAttributesInElastic);
                    }

                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, findEcoTypelists, MESSAGE_CONSTANT.CREATED(currentModuleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update ECO type value
    // PUT : /api/v1/ecotypevalue
    // @param {ecoTypeValID} int
    // @return updated ECO type value detail
    updateECOTypeValue: (req, res) => {
        if (req.body) {
            const ECOTypeValues = req.app.locals.models.ECOTypeValues;
            const currentModuleName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_VALUES.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_ATTRIBUTE.NAME;
            const fieldName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_VALUES_UNIQUE_FIELD.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_ATTRIBUTE_UNIQUE_FIELD.NAME;
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            return ECOTypeValues.findAll({
                where: {
                    ecoTypeCatID: { [Op.eq]: req.body.ecoTypeCatID },
                    [Op.or]: [
                        { name: { [Op.eq]: req.body.name } },
                        { displayOrder: { [Op.eq]: req.body.displayOrder } }
                    ],
                    ecoTypeValID: { [Op.ne]: req.params.ecoTypeValID }
                },
                paranoid: true
            }).then((findEcoTypelist) => {
                if (findEcoTypelist.length > 0) {
                    const EcoUniqueName = _.find(findEcoTypelist, cat => cat.name.toLowerCase() === req.body.name.toLowerCase());
                    if (EcoUniqueName) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                    } else if (!EcoUniqueName && req.body.displayOrder !== null) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.ECO_TYPE_VALUES_UNIQUE_FIELD.DISPLAY_ORDER), err: null, data: null });
                    }
                }
                COMMON.setModelUpdatedByFieldValue(req);
                return ECOTypeValues.update(req.body, {
                    where: {
                        ecoTypeValID: req.params.ecoTypeValID
                    },
                    field: inputFields
                }).then((rowUpdated) => {
                    if (rowUpdated[0] === 1) {
                        // Add ECO/DFM Category Attribute detail into Elastic Search Engine for Enterprise Search
                        if (req.params && req.params.ecoTypeValID) {
                            req.params['pId'] = req.params.ecoTypeValID;
                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageECODFMCategoryAttributesInElastic);
                        }

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, findEcoTypelist, MESSAGE_CONSTANT.UPDATED(currentModuleName));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(currentModuleName), err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                    } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Delete ECO type values
    // DELETE : /api/v1/ecotypevalue
    // @param {ecoTypeValID} int
    // @return API response
    deleteECOTypeValue: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objIDs.id) {
            const currentModuleName = parseInt(req.body.objIDs.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_VALUES.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_ATTRIBUTE.NAME;
            const tableName = COMMON.AllEntityIDS.EcoTypeValues.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: req.body.objIDs.category,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((ecoDetail) => {
                if (ecoDetail && ecoDetail.length === 0) {
                    // Delete ECO/DFM Attribute record from Elastic Engine
                    if (req.body.objIDs && req.body.objIDs.id) {
                        EnterpriseSearchController.deleteECODFMCategoryAttributesInElastic(req.body.objIDs.id.toString());
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ecoDetail, MESSAGE_CONSTANT.DELETED(currentModuleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: ecoDetail, IDs: req.body.objIDs.id }, null);
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
    getECOCategoryList: (req, res) => {
        const ECOTypeCategory = req.app.locals.models.ECOTypeCategory;
        ECOTypeCategory.findAll({
            where: { category: req.body.categoryType },
            attributes: ['ecoTypeCatID', 'name']
        }).then(ecocategorylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ecocategorylist, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // check ECO Type Values Already Exists
    // POST : /api/v1/ecotypevalue/checkEcoTypeValuesAlreadyExists
    // @return API response
    checkEcoTypeValuesAlreadyExists: (req, res) => {
        const ECOTypeValues = req.app.locals.models.ECOTypeValues;
        if (req.body) {
            const fieldName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_VALUES_UNIQUE_FIELD.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_ATTRIBUTE_UNIQUE_FIELD.NAME;
            let whereClause;
            if (req.body.objs) {
                whereClause = {
                    ecoTypeCatID: { [Op.eq]: req.body.objs.ecoTypeCatID },
                    [Op.or]: [
                        { name: { [Op.eq]: req.body.objs.name } }
                    ]
                };
            }
            if (req.body.objs && req.body.objs.ecoTypeValID) {
                whereClause.ecoTypeValID = { [Op.notIn]: [req.body.objs.ecoTypeValID] };
            }
            ECOTypeValues.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    }
};