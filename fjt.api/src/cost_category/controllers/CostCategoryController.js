const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'id',
    'categoryName',
    'from',
    'to',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'description',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const costCategoryModuleName = DATA_CONSTANT.COST_CATEGORY.NAME;

module.exports = {
    // Create Cost Category
    // POST : /api/v1/costcategory/createCostCategory
    // @return created CostCategory
    createCostCategory: (req, res) => {
        const { CostCategory } = req.app.locals.models;
        if (req.body) {
            if (req.body.categoryName) { req.body.categoryName = COMMON.TEXT_WORD_CAPITAL(req.body.categoryName, false); }

            const where = {
                [Op.or]: [{ categoryName: req.body.categoryName },
                {
                    [Op.or]: [{
                        // from
                        [Op.and]: [{
                            from: { [Op.lte]: req.body.from }
                        }, {
                            to: { [Op.gt]: req.body.from }
                        }]
                    }, {
                        // to
                        [Op.and]: [{
                            from: { [Op.lte]: req.body.to }
                        }, {
                            to: { [Op.gt]: req.body.to }
                        }]
                    }]
                }]
            };


            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return CostCategory.findOne({
                where
            }).then((response) => {
                if (response) {
                    const fieldName = (response.categoryName === req.body.categoryName) ? DATA_CONSTANT.COST_CATEGORY_UNIUE_FIELD.NAME : DATA_CONSTANT.COST_CATEGORY_UNIUE_FIELD.CATEGORY_FROM_TO;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else if (req.body && req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);

                    return CostCategory.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(() => {
                        // Add Cost Categories Types Detail into Elastic Search Engine for Enterprise Search
                        req.params['pId'] = req.body.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageCostCategoriesInElastic);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(costCategoryModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return CostCategory.create(req.body, {
                        fields: inputFields
                    }).then((costCategory) => {
                        // Add Cost Categories Types Detail into Elastic Search Engine for Enterprise Search
                        req.params['pId'] = costCategory.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageCostCategoriesInElastic);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, costCategory, MESSAGE_CONSTANT.CREATED(costCategoryModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Cost Category
    // POST : /api/v1/costcategory/retriveCostCategoryList
    // @return list of costCategory
    retriveCostCategoryList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveCostCategory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { CostCategory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Cost Category
    // GET : /api/v1/costcategory/retriveCostCategory
    // @return list of costCategory
    retriveCostCategory: (req, res) => {
        const { CostCategory } = req.app.locals.models;
        if (req.params.id) {
            CostCategory.findOne({
                where: { id: req.params.id }

            }).then((costCategory) => {
                if (!costCategory) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                    // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(costCategoryModuleName)));
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, costCategory, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },

    // Retrive list of Cost Category
    // GET : /api/v1/costcategory/getCostCategoryList
    // @return list Of getCostCategoryList
    getCostCateogryList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetCostCategoryList ()', {
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,  _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Remove CostCategory
    // POST : /api/v1/costcategory/deleteCostCategory
    // @return list of CostCategory by ID
    deleteCostCategory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.CostCategory.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    // Delete Cost Categories Detail into Elastic Search Engine for Enterprise Search
                    EnterpriseSearchController.deleteCostCategoriesDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(costCategoryModuleName));
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

    // CheckUnique Cost category name
    // POST : /api/v1/costcategory/checkUniqueCostCategory
    // @return Check Unique Cost category name
    checkUniqueCostCategory: (req, res) => {
        const { CostCategory } = req.app.locals.models;
        if (req.body) {
            const categoryObj = req.body.categoryObj;
            if (categoryObj.categoryName) { categoryObj.categoryName = COMMON.TEXT_WORD_CAPITAL(categoryObj.categoryName, false); }
            const where = {
                categoryName: categoryObj.categoryName
            };
            if (categoryObj.id) {
                where.id = { [Op.ne]: categoryObj.id };
            }
            return CostCategory.findOne({
                where
            }).then((response) => {
                if (response) {
                    // var msg = MESSAGE_CONSTANT.COST_CATEGORY.CATEGORY_UNIQUE;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.COST_CATEGORY_UNIUE_FIELD.NAME), err: null, data: null });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.message, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
