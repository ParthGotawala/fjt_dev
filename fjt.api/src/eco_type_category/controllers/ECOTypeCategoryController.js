const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'ecoTypeCatID',
    'name',
    'category',
    'displayOrder',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'multiSelect',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
module.exports = {
    // Retrive list of ECO category
    // POST : /api/v1/ecocategory
    // @return list of ECO category
    retrieveECOCategory: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveECOCategory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pcategory)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pcategory: req.body.CategoryType
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ecoTypeCatList: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list of ECO category with values
    // GET : /api/v1/ecocategory/retrieveECOCategoryWithValues
    // @return list of ECO category with values
    retrieveECOCategoryWithValues: (req, res) => {
        if (req.body) {
            const { ECOTypeCategory, ECOTypeValues } = req.app.locals.models;
            return ECOTypeCategory.findAll({
                where: {
                    category: {
                        [Op.eq]: req.body.category
                    }
                },
                attributes: ['ecoTypeCatID', 'name', 'category', 'displayOrder', 'multiSelect'],
                order: [
                    ['displayOrder', 'ASC'],
                    [{ model: ECOTypeValues, as: 'ecoTypeValues' }, 'displayOrder', 'ASC']
                ],
                include: [{
                    model: ECOTypeValues,
                    as: 'ecoTypeValues',
                    attributes: ['ecoTypeValID', 'ecoTypeCatID', 'name', 'noteRequired', 'displayOrder'],
                    required: false
                }]
            }).then((ecoTypeCatList) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ecoTypeCatList, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of ECO type category
    // GET : /api/v1/getAllECOTypeCategory
    // @return list of ECO type category
    getAllECOTypeCategory: (req, res) => {
        const ECOTypeCategory = req.app.locals.models.ECOTypeCategory;
        const where = {};
        if (req.query.category) { where.category = req.query.category; }

        ECOTypeCategory.findAll({
            where: where,
            order: [['displayOrder', 'ASC']],
            attributes: ['ecoTypeCatID', ['name', 'ecoTypeCatName']]
        }).then(ECOTypeCategorylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { ecoTypeCategory: ECOTypeCategorylist }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Create ECO type category
    // POST : /api/v1/ecocategory
    // @return list of ECO type category
    createECOTypeCategory: (req, res) => {
        const ECOTypeCategory = req.app.locals.models.ECOTypeCategory;
        const currentModuleName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_CATEGORY.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_CATEGORY.NAME;
        const fieldName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_CATEGORY_UNIQUE_FIELD.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_CATEGORY_UNIQUE_FIELD.NAME;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            return ECOTypeCategory.findAll({
                where: {
                    category: { [Op.eq]: req.body.category },
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
                return ECOTypeCategory.create(req.body, {
                    field: inputFields
                }).then((findEcoTypelists) => {
                    // Add ECO/DFM Category detail into Elastic Search Engine for Enterprise Search
                    if (findEcoTypelists && findEcoTypelists.ecoTypeCatID) {
                        req.params['pId'] = findEcoTypelists.ecoTypeCatID;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageECODFMCategoryInElastic);
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
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
    // Update ECO type category
    // PUT : /api/v1/ecocategory
    // @param {ecoTypeCatID} int
    // @return list of ECO type category
    updateECOTypeCategory: (req, res) => {
        const ECOTypeCategory = req.app.locals.models.ECOTypeCategory;
        const currentModuleName = parseInt(req.body.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_CATEGORY.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_CATEGORY.NAME;
        const fieldName = parseInt(req.query.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_CATEGORY_UNIQUE_FIELD.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_CATEGORY_UNIQUE_FIELD.NAME;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            return ECOTypeCategory.findAll({
                where: {
                    category: { [Op.eq]: req.body.category },
                    [Op.or]: [
                        { name: { [Op.eq]: req.body.name } },
                        { displayOrder: { [Op.eq]: req.body.displayOrder } }
                    ],
                    ecoTypeCatID: { [Op.ne]: req.params.ecoTypeCatID }
                },
                paranoid: true
            }).then((findEcoTypelist) => {
                if (findEcoTypelist.length > 0) {
                    const EcoUniqueName = _.find(findEcoTypelist, cat => cat.name.toLowerCase() === req.body.name.toLowerCase());
                    if (EcoUniqueName) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                    } else if (!EcoUniqueName && req.body.displayOrder !== null) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.ECO_TYPE_CATEGORY_UNIQUE_FIELD.DISPLAY_ORDER), err: null, data: null });
                    }
                }
                COMMON.setModelUpdatedByFieldValue(req);
                return ECOTypeCategory.update(req.body, {
                    where: {
                        ecoTypeCatID: req.params.ecoTypeCatID
                    },
                    field: inputFields
                }).then((rowUpdated) => {
                    if (rowUpdated[0] === 1) {
                        // Update ECO/DFM Category detail into Elastic Search Engine for Enterprise Search
                        if (req.params && req.params.ecoTypeCatID) {
                            req.params['pId'] = req.params.ecoTypeCatID;
                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageECODFMCategoryInElastic);
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
    // Delete ECO category
    // DELETE : /api/v1/ecocategory
    // @param {ecoTypeCatID} int
    // @return API response
    deleteECOTypeCategory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const currentModuleName = parseInt(req.body.objIDs.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_CATEGORY.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_CATEGORY.NAME;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.EcoTypeCategory.Name;
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
                if (ecoDetail.length === 0) {
                    // Delete ECO/DFM record from Elastic Engine
                    if (req.body.objIDs && req.body.objIDs.id) {
                        EnterpriseSearchController.deleteECODFMCategoryInElastic(req.body.objIDs.id.toString());
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, ecoDetail, MESSAGE_CONSTANT.DELETED(currentModuleName), null);
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
    // check Eco Category Already Exists
    // POST : /api/v1/ecocategory/checkEcoCategoryAlreadyExists
    // @return API response
    checkEcoCategoryAlreadyExists: (req, res) => {
        const ECOTypeCategory = req.app.locals.models.ECOTypeCategory;
        const fieldName = parseInt(req.body.objs.category) === DATA_CONSTANT.CATEGORY_TYPE.ECO ? DATA_CONSTANT.ECO_TYPE_CATEGORY_UNIQUE_FIELD.NAME : DATA_CONSTANT.QUOTE_TERMS_CONDITIONS_CATEGORY_UNIQUE_FIELD.NAME;
        if (req.body) {
            const whereClause = {
                name: req.body.objs.name,
                category: { [Op.eq]: req.body.objs.category }
            };
            if (req.body.objs.ecoTypeCatID) {
                whereClause.ecoTypeCatID = { [Op.notIn]: [req.body.objs.ecoTypeCatID] };
            }
            ECOTypeCategory.findAll({
                where: whereClause
            }).then((isExists) => {
                if (isExists.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    }
};