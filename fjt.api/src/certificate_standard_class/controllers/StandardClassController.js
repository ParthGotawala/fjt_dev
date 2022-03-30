const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'classID',
    'certificateStandardID',
    'className',
    'description',
    'colorCode',
    'displayOrder',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'isActive',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const moduleName = DATA_CONSTANT.STANDARD_CLASS.DISPLAYNAME;

module.exports = {
    // Retrive list of Standard Class
    // POST : /api/v1/standardClass/retriveStandardClassList
    // @return list of Standard Class
    retriveStandardClassList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetriveStandardClassList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { classData: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get Detail of Standard Class
    // GET : /api/v1/standardClass/:id
    // @param {id} int
    // @return detail of Standard Class
    retriveStandardClass: (req, res) => {
        if (req.params.id) {
            const StandardClass = req.app.locals.models.StandardClass;
            return StandardClass.findByPk(req.params.id)
                .then((classData) => {
                    if (!classData) {
                        return resHandler.errorRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY,
                            MESSAGE_CONSTANT.NOT_FOUND(moduleName));
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, classData, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create Standard Class
    // POST : /api/v1/standardClass
    // @return New created standard Class detail
    createStandardClass: (req, res) => {
        const StandardClass = req.app.locals.models.StandardClass;

        if (req.body) {
            if (req.body.className) { req.body.className = COMMON.TEXT_WORD_CAPITAL(req.body.className, false); }

            return StandardClass.findAll({
                where: {
                    certificateStandardID: { [Op.eq]: req.body.certificateStandardID },
                    className: { [Op.eq]: req.body.className },
                    isDeleted: false
                }
            }).then((findClass) => {
                if (findClass.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.STANDARD_CLASSNAME_UNIQUE, err: null, data: null });
                } else {
                    return StandardClass.findAll({
                        where: {
                            colorCode: { [Op.eq]: req.body.colorCode },
                            isDeleted: false
                        }
                    }).then((findClasss) => {
                        if (findClasss.length > 0 && req.body.colorCode != null) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CertificateStandards.UNIQUE_FIELD_STANDARDCOLORCODE), err: null, data: null });
                        } else {
                            COMMON.setModelCreatedByFieldValue(req);
                            return StandardClass.create(req.body, {
                                fields: inputFields
                            }).then((classData) => {
                                // Add Standards Categories Detail into Elastic Search Engine for Enterprise Search
                                req.params['pId'] = classData.classID;
                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageStandardsCategoriesInElastic);

                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, classData, MESSAGE_CONSTANT.CREATED(moduleName));
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Standard Category'), err: null, data: null });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                }
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Update Standard Class
    // PUT : /api/v1/standardClass
    // @return API Response
    updateStandardClass: (req, res) => {
        const { StandardClass } = req.app.locals.models;
        if (req.params.id && req.body) {
            req.body.className = COMMON.TEXT_WORD_CAPITAL(req.body.className, false);

            return StandardClass.findAll({
                where: {
                    classID: { [Op.ne]: req.params.id },
                    certificateStandardID: { [Op.eq]: req.body.certificateStandardID },
                    className: { [Op.eq]: req.body.className },
                    isDeleted: false
                }
            }).then((findClass) => {
                if (findClass.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CertificateStandards.UNIQUE_FIELD_STANDARDCOLORCODE), err: null, data: null });
                } else {
                    const promises = [];
                    if (req.body.colorCode || req.body.displayOrder) {
                        const where = {
                            classID: { [Op.ne]: req.params.id },
                            [Op.or]: []
                        };

                        if (req.body.displayOrder) {
                            where[Op.or] = [
                                { displayOrder: { [Op.eq]: req.body.displayOrder } }
                            ];
                        }
                        if (req.body.colorCode) {
                            where[Op.or].push({ colorCode: { [Op.eq]: req.body.colorCode } });
                        }
                        promises.push(StandardClass.findOne({
                            where: where,
                            isDeleted: false
                        }));
                    }

                    return Promise.all(promises).then((resp) => {
                        if (resp && resp.length > 0 && resp[0]) {
                            const fieldName = parseFloat(resp[0].dataValues.displayOrder) === parseFloat(req.body.displayOrder) ? DATA_CONSTANT.DISPLAY_ORDER : DATA_CONSTANT.CertificateStandards.UNIQUE_FIELD_STANDARDCOLORCODE;
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                        } else {
                            COMMON.setModelUpdatedByFieldValue(req);
                            return StandardClass.update(req.body, {
                                where: {
                                    classID: req.params.id
                                },
                                fields: inputFields
                            })
                                .then((rowsUpdated) => {
                                    if (rowsUpdated[0] === 1) {
                                        // Add Standards Categories Detail into Elastic Search Engine for Enterprise Search
                                        req.params['pId'] = req.params.id;
                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageStandardsCategoriesInElastic);

                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(moduleName));
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(moduleName), err: null, data: null });
                                    }
                                })
                                .catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY('Standard Category'), err: null, data: null });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    }
                                });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Delete Standard Class
    // DELETE : /api/v1/standardClass
    // @return API response
    deleteStandardClass: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.StandardClass.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: req.body.objIDs.CountList,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((standardClassDetail) => {
                    if (standardClassDetail.length === 0) {
                        // Delete Standards Categories Types Detail into Elastic Search Engine for Enterprise Search
                        EnterpriseSearchController.deleteStandardsCategoriesDetailInElastic(req.body.objIDs.id.toString());
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: standardClassDetail, IDs: req.body.objIDs.id }, null);
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
    // GET Standard Class tree view data by certificateStandardID
    // GET : /api/v1/standardtreeviewData
    // @param {id} int
    // @return Standard Class tree view data
    standardtreeviewData: (req, res) => {
        const { CertificateStandards, StandardClass, GenericCategory } = req.app.locals.models;
        CertificateStandards.findOne({
            where: {
                isActive: true,
                certificateStandardID: req.params.id
            },
            attributes: ['certificateStandardID', 'standardTypeID'],
            include: [{
                model: GenericCategory,
                as: 'standardType',
                attributes: ['gencCategoryID', 'gencCategoryName'],
                include: [{
                    model: CertificateStandards,
                    as: 'standardType',
                    attributes: ['certificateStandardID', 'fullName'],
                    include: [{
                        model: StandardClass,
                        as: 'CertificateStandard_Class',
                        attributes: ['classID', 'className', 'displayOrder'],
                        required: false
                    }],
                    required: false
                }],
                required: false
            }]
        }).then(standards => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, standards, null)).catch(() => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, null));
    },
    checkDuplicateCategory: (req, res) => {
        const { StandardClass } = req.app.locals.models;
        if (req.body) {
            const whereClauseStandardClass = {
                className: req.body.className,
                certificateStandardID: req.body.certificateStandardID
            };
            if (req.body.classID) {
                whereClauseStandardClass.classID = { [Op.notIn]: [req.body.classID] };
            }
            return StandardClass.findOne({
                where: whereClauseStandardClass,
                attributes: ['classID']
            }).then((standard) => {
                if (standard) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateClassName: true } });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateClassName: false }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // GET Standard Class list by certificateStandardID
    // GET : /api/v1/getStandardClassListByStandardId
    // @param {id} int
    // @return Standard Class list
    getStandardClassListByStandardId: (req, res) => {
        const {
            StandardClass
        } = req.app.locals.models;

        if (req.params.id) {
            return StandardClass.findAll({
                where: {
                    certificateStandardID: req.params.id,
                    isDeleted: false,
                    isActive: true
                },
                attributes: ['classID', 'certificateStandardID', 'className']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};