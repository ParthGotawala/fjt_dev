const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const defectCatModuleName = DATA_CONSTANT.DEFECT_CATEGORY.NAME;

const inputFields = [
    'defectCatId',
    'defectcatName',
    'description',
    'colorCode',
    'order',
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
    // Retrive list of defect category
    // GET : /api/v1/defectcategory/retriveDefectCategoryList
    // @return list of defect category
    retriveDefectCategoryList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveDefectCategory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { defectCategory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive detail of defect category
    // GET : /api/v1/defectcategory/:defectCatId
    // @param {defectCatId} int
    retriveDefectCategory: (req, res) => {
        if (req.params.defectCatId) {
            const DefectCategory = req.app.locals.models.DefectCategory;
            return DefectCategory.findByPk(req.params.defectCatId).then((defectcategory) => {
                if (!defectcategory) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                _.map(defectcategory, (item) => {
                    item.description = COMMON.getTextAngularValueFromDB(item.description);
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, defectcategory, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create defect category
    // POST : /api/v1/defectcategory
    // @return new created defect category
    createDefectCategory: (req, res) => {
        const DefectCategory = req.app.locals.models.DefectCategory;
        var whereClause;
        if (req.body) {
            req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
            if (req.body.defectcatName) { req.body.defectcatName = COMMON.TEXT_WORD_CAPITAL(req.body.defectcatName, false); }
            whereClause = {
                [Op.or]: [
                    { defectcatName: { [Op.eq]: req.body.defectcatName } },
                    { order: { [Op.eq]: req.body.order } }
                ]
            };
            if (req.body.colorCode) {
                whereClause = {
                    [Op.or]: [
                        { defectcatName: { [Op.eq]: req.body.defectcatName } },
                        { order: { [Op.eq]: req.body.order } },
                        { colorCode: { [Op.eq]: req.body.colorCode } }
                    ]
                };
            }
            return DefectCategory.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    // var fieldName = (isExists.dataValues.defectcatName == req.body.defectcatName) ?
                    //     DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_NAME : DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_ORDER;
                    const fieldName = (isExists.dataValues.defectcatName === req.body.defectcatName) ?
                        DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_NAME : (parseFloat(isExists.dataValues.order) === parseFloat(req.body.order)) ?
                            DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_ORDER : DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_COLORCODE;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                }
                COMMON.setModelCreatedByFieldValue(req);
                return DefectCategory.max('order').then((type) => {
                    var displayOrder = type;
                    req.body.order = displayOrder ? displayOrder + 1 : 1;
                    return DefectCategory.create(req.body, {
                        fields: inputFields
                    }).then((defectCategory) => {
                        // / Add Defect Category detail into Elastic Search Engine for Enterprise Search
                        if (defectCategory) {
                            req.params['defectCatId'] = defectCategory.defectCatId;
                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageDefectCategoryDetailInElastic);
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, defectCategory, MESSAGE_CONSTANT.CREATED(defectCatModuleName));
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
    // Update defect category
    // PUT : /api/v1/defectcategory
    // @param {defectCatId} int
    // @return API Response
    updateDefectCategory: (req, res) => {
        const DefectCategory = req.app.locals.models.DefectCategory;
        if (req.params.defectCatId) {
            req.body.description = COMMON.setTextAngularValueForDB(req.body.description);
            if (req.body.defectcatName) { req.body.defectcatName = COMMON.TEXT_WORD_CAPITAL(req.body.defectcatName, false); }

            let whereClause = {
                defectCatId: { [Op.notIn]: [req.params.defectCatId] },
                [Op.or]: [
                    { defectcatName: { [Op.eq]: req.body.defectcatName } },
                    { order: { [Op.eq]: req.body.order } }
                ]
            };
            if (req.body.colorCode) {
                whereClause = {
                    defectCatId: { [Op.notIn]: [req.params.defectCatId] },
                    [Op.or]: [
                        { defectcatName: { [Op.eq]: req.body.defectcatName } },
                        { order: { [Op.eq]: req.body.order } },
                        { colorCode: { [Op.eq]: req.body.colorCode } }
                    ]
                };
            }

            DefectCategory.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    const fieldName = (isExists.dataValues.defectcatName === req.body.defectcatName) ?
                        DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_NAME : (parseFloat(isExists.dataValues.order) === parseFloat(req.body.order)) ?
                            DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_ORDER : DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_COLORCODE;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return DefectCategory.update(req.body, {
                        where: {
                            defectCatId: req.params.defectCatId
                        },
                        fields: inputFields
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            // Update Defect category detail into Elastic Search Engine for Enterprise Search
                            if (req.params.defectCatId) {
                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageDefectCategoryDetailInElastic);
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(defectCatModuleName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(defectCatModuleName), err: null, data: null });
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
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        }
    },
    // Delete defect category
    // DELETE : /api/v1/defectcategory
    // @param {defectCatId} int
    // @return API Response
    deleteDefectCategory: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.defectCatId) {
            const defectCatIds = req.params.defectCatId.split(',') || [];
            COMMON.setModelDeletedByFieldValue(req);
            const promises = [];
            _.each(defectCatIds, (defectId) => {
                promises.push(sequelize.query('CALL Sproc_RemoveDefectCategory (:pDefectCatid, :pDeletedBy,:pRoleID)',
                    { replacements: { pDefectCatid: defectId, pDeletedBy: req.body['deletedBy'], pRoleID: req.body['deleteByRoleId'] } })
                );
            });

            return Promise.all(promises).then((resp) => {
                var isAllRecordDeleted = !(_.some(resp, item => item[0].pExistDefectID > 0));

                if (isAllRecordDeleted === false) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { AllRecordDeleted: isAllRecordDeleted }, null);
                } else {
                    // Remove Defect Category Detail from Elastic Engine Database
                    EnterpriseSearchController.deleteDefectCategoryDetailInElastic(defectCatIds.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(defectCatModuleName));
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
    // Get list of defect category
    // GET : /api/v1/getAllDefectCategory
    // @return list of defect category
    getAllDefectCategory: (req, res) => {
        const DefectCategory = req.app.locals.models.DefectCategory;
        DefectCategory.findAndCountAll({
            order: [['order', 'ASC']],
            attributes: ['defectCatId', 'defectcatName', 'description', 'colorCode']
        }).then((DefectCategorylist) => {
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { defectCategory: DefectCategorylist.rows, Count: DefectCategorylist.count }, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // check duplicate defect category name to create
    // POST : /api/v1/checkDuplicateDefectCategoryName
    // @return details if Department name already exists or not
    checkDuplicateDefectCategoryName: (req, res) => {
        const DefectCategory = req.app.locals.models.DefectCategory;
        if (req.body && req.body.defectcatName) {
            const whereClause = {
                [Op.or]: [{ defectcatName: { [Op.eq]: req.body.defectcatName } }]
            };
            if (req.body.defectCatId) {
                whereClause.defectCatId = { [Op.notIn]: [req.body.defectCatId] };
            }

            return DefectCategory.count({
                where: whereClause
            }).then((count) => {
                if (count > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.DEFECT_CATEGORY.UNIQUE_FIELD_NAME), err: null, data: { isDuplicateDefectCategorytName: true } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateDefectCategorytName: false }, null);
            }).catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
