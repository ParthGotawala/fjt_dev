const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const {
    STATE,
    GENERICCATEGORY,
    COMMON
} = require('../../constant');
const fs = require('fs');
const fsextra = require('fs-extra');
var mime = require('mime');
const uuidv1 = require('uuid/v1');
var csv = require('fast-csv');
const {
    MESSAGE_CONSTANT,
    DATA_CONSTANT
} = require('../../../constant');

const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'gencCategoryID',
    'gencCategoryName',
    'gencCategoryCode',
    'categoryType',
    'displayOrder',
    'parentGencCategoryID',
    'isActive',
    'createdBy',
    'updatedBy',
    'deletedBy',
    /*'systemGenerated', removed this field because we are not updating this field*/
    'termsDays',
    'carrierID',
    'colorCode',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'description',
    'isEOM',
    'paymentTypeCategoryId',
    'bankid'
];

module.exports = {
    retriveGenericCategoryList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        let filter;
        let strWhere = '';
        if (req.body.searchText) {
            const searchFilterList = JSON.parse(req.body.search);
            const filterTypeListWithData = _.partition(searchFilterList, o => o.isExternalSearch);

            _.each(filterTypeListWithData, (listitem, index) => {
                let filterTypeWhereClause = '';
                if (listitem.length > 0) {
                    filter = null;
                    req.body.search = JSON.stringify(listitem);
                    filter = COMMON.UiGridFilterSearch(req);
                    if (listitem[0].isExternalSearch) { // filterTypeListWithData[0] means external filter , filterTypeListWithData[1] means grid filter
                        filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);
                    } else {
                        filterTypeWhereClause = COMMON.UIGridWhereToQueryWhere(filter.where);
                    }
                    if (index > 0 && strWhere && filterTypeWhereClause) {
                        filterTypeWhereClause = `${' AND  ( '}${filterTypeWhereClause} ) `;
                    } else {
                        filterTypeWhereClause = ` ( ${filterTypeWhereClause} ) `;
                    }
                    strWhere += filterTypeWhereClause;
                }
            });
        } else {
            filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        }
        sequelize.query('CALL Sproc_RetrieveGenericCategory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pCategoryType)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pCategoryType: req.body.genericCategoryType
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            genericcategory: _.values(response[1]),
            Count: response[0][0]['TotalRecord']
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    retriveGenericCategory: (req, res) => {
        const {
            GenericCategory
        } = req.app.locals.models;
        if (req.body.id) {
            return GenericCategory.findByPk(req.body.id).then((genericcategory) => {
                if (!genericcategory) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND('Category'),
                        err: null,
                        data: null
                    });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, genericcategory, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: null,
                data: null
            });
        }
    },

    createGenericCategory: (req, res) => {
        const GenericCategory = req.app.locals.models.GenericCategory;
        var fieldName = '';
        if (req.body) {
            if (req.body.gencCategoryName) {
                req.body.gencCategoryName = COMMON.TEXT_WORD_CAPITAL(req.body.gencCategoryName, false);
            }

            const where = {
                categoryType: req.body.categoryType
            };
            if (req.body.gencCategoryCode) {
                req.body.gencCategoryCode = req.body.gencCategoryCode.toUpperCase();
                where[Op.or] = [{
                    gencCategoryName: req.body.gencCategoryName
                },
                {
                    gencCategoryCode: req.body.gencCategoryCode
                }
                ];
            } else {
                where.gencCategoryName = req.body.gencCategoryName;
            }
            return GenericCategory.findAll({
                where: where
            }).then((findcategory) => {
                if (findcategory.length > 0) {
                    const activeCategoryName = _.find(findcategory, cate => cate.gencCategoryName.toLowerCase() === req.body.gencCategoryName.toLowerCase());
                    if (activeCategoryName) {
                        fieldName = COMMON.stringFormat(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.NAME, req.body.singleLabel);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName),
                            err: null,
                            data: null
                        });
                    }
                    const activeCategoryCode = _.find(findcategory, cate => cate.gencCategoryCode.toLowerCase() === req.body.gencCategoryCode.toLowerCase());
                    if (activeCategoryCode) {
                        fieldName = COMMON.stringFormat(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.CODE, req.body.singleLabel);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName),
                            err: null,
                            data: null
                        });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        fieldName: req.body.singleLabel
                    }, null);
                }
                COMMON.setModelCreatedByFieldValue(req);
                return GenericCategory.create(req.body, {
                    fields: inputFields
                }).then((genericcategory) => {
                    // Add Generic Categories By passed it's Type Detail into Elastic Search Engine for Enterprise Search
                    if (genericcategory) {
                        req.params['pId'] = genericcategory.gencCategoryID;
                        module.exports.addGenericCategoryDetailInElastic(req);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, genericcategory, MESSAGE_CONSTANT.CREATED(req.body.singleLabel));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err.errors.map(e => e.message).join(','),
                            data: null
                        });
                    } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(req.body.singleLabel),
                            err: null,
                            data: null
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    }
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    updateGenericCategory: (req, res) => {
        const {
            GenericCategory,
            Component
        } = req.app.locals.models;
        var fieldName = '';
        const whereStatement = [];
        if (req.params.id) {
            if (req.body.gencCategoryName) {
                req.body.gencCategoryName = COMMON.TEXT_WORD_CAPITAL(req.body.gencCategoryName, false);
                whereStatement.push({
                    gencCategoryName: req.body.gencCategoryName
                });
            }

            if (req.body.gencCategoryCode) {
                req.body.gencCategoryCode = req.body.gencCategoryCode.toUpperCase();
                whereStatement.push({
                    gencCategoryCode: req.body.gencCategoryCode
                });
            }
            GenericCategory.findOne({
                where: {
                    [Op.or]: whereStatement,
                    [Op.and]: {
                        categoryType: req.body.categoryType,
                        deletedAt: null,
                        gencCategoryID: {
                            [Op.ne]: req.params.id
                        }
                    }
                }
            }).then((findcategory) => {
                if (findcategory) {
                    const activeCategoryName = _.find(findcategory, cate => cate.deletedAt == null && cate.gencCategoryName === req.body.gencCategoryName);
                    if (activeCategoryName) {
                        fieldName = COMMON.stringFormat(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.NAME, req.body.singleLabel);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName)
                        });
                    } else {
                        fieldName = COMMON.stringFormat(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.CODE, req.body.singleLabel);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName)
                        });
                    }
                } else {
                    return GenericCategory.findOne({
                        where: {
                            displayOrder: {
                                [Op.eq]: req.body.displayOrder
                            },
                            categoryType: req.body.categoryType,
                            gencCategoryID: {
                                [Op.ne]: req.params.id
                            }
                        }
                    }).then((response) => {
                        if (response != null && (req.body.displayOrder || req.body.displayOrder === 0)) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.DISPLAY_ORDER),
                                err: null,
                                data: null
                            });
                        } else if (req.body.isActive === false && req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PART_STATUS) {
                            return Component.findOne({
                                where: {
                                    partStatus: req.params.id,
                                    isDeleted: false
                                }
                            }).then((compo) => {
                                if (!compo || !compo.id) {
                                    COMMON.setModelUpdatedByFieldValue(req);
                                    return GenericCategory.update(req.body, {
                                        where: {
                                            gencCategoryID: req.params.id
                                        },
                                        fields: inputFields
                                    }).then((rowsUpdated) => {
                                        if (rowsUpdated[0] === 1) {
                                            // Add Generic Categories By passed it's Type Detail into Elastic Search Engine for Enterprise Search
                                            if (req.params && req.params.id) {
                                                req.params['pId'] = req.params.id;
                                                module.exports.addGenericCategoryDetailInElastic(req);
                                            }
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.singleLabel));
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(req.body.singleLabel),
                                                err: null,
                                                data: null
                                            });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err.errors.map(e => e.message).join(','),
                                                data: null
                                            });
                                        } else if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.DUPLICATE_ENTRY(req.body.singleLabel),
                                                err: null,
                                                data: null
                                            });
                                        } else {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        }
                                    });
                                } else {
                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ALREADY_IN_USE);
                                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.singleLabel);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: messageContent,
                                        err: null,
                                        data: null
                                    });
                                }
                            });
                        } else {
                            COMMON.setModelUpdatedByFieldValue(req);
                            return GenericCategory.update(req.body, {
                                where: {
                                    gencCategoryID: req.params.id
                                },
                                fields: inputFields
                            }).then((rowsUpdated) => {
                                if (rowsUpdated[0] === 1) {
                                    // Add Generic Categories By passed it's Type Detail into Elastic Search Engine for Enterprise Search
                                    if (req.params && req.params.id) {
                                        req.params['pId'] = req.params.id;
                                        module.exports.addGenericCategoryDetailInElastic(req);
                                    }
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.singleLabel));
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(req.body.singleLabel)
                                    });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err.errors.map(e => e.message).join(','),
                                        data: null
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                }
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err.errors.map(e => e.message).join(','),
                        data: null
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                }
            });
        }
    },

    addGenericCategoryDetailInElastic: (req) => {
        if (req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_TYPES ||
            req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_GROUPS ||
            req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS ||
            req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.GEOLOCATIONS ||
            req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory ||
            req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ECO_DFM_TYPE) {
            const functionName = (req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_TYPES) ?
                EnterpriseSearchController.manageEquipmentWorkstationTypesInElastic :
                ((req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_GROUPS) ?
                    EnterpriseSearchController.manageEquipmentWorkstationGroupsInElastic :
                    ((req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS) ?
                        EnterpriseSearchController.manageEquipmentWorkstationOwnershipsInElastic :
                        ((req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.GEOLOCATIONS) ?
                            EnterpriseSearchController.manageLocationsInElastic :
                            ((req.body.categoryType === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ECO_DFM_TYPE) ?
                                EnterpriseSearchController.manageECODFMTypeInElastic :
                                EnterpriseSearchController.managePaymentTypeCategoryInElastic))));
            EnterpriseSearchController.proceedTransction(req, functionName);
        }
    },

    getAllGenericCategoryList: (req, res) => {
        const GenericCategory = req.app.locals.models.GenericCategory;
        GenericCategory.findAll({
            attributes: ['gencCategoryID', 'gencCategoryName', 'categoryType', 'parentGencCategoryID'],
            order: [
                ['gencCategoryName', 'ASC']
            ]
        }).then(genericcategorylist => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, genericcategorylist, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    deleteGenericCategory: (req, res) => {
        const {
            sequelize,
            HomeMenuCateogory
        } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.GenericCategory.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((gencatDetail) => {
                if (gencatDetail.length === 0) {
                    if (req.body.objIDs.categoryType === 'Home Menu Category') {
                        return sequelize.transaction((t) => {
                            const promises = [];
                            var updatedData = {
                                deletedAt: COMMON.getCurrentUTC(req),
                                isDeleted: true,
                                deletedBy: req.user.id
                            };
                            COMMON.setModelDeletedByFieldValue(req);
                            promises.push(HomeMenuCateogory.update(updatedData, {
                                where: {
                                    genericCategoryID: req.body.objIDs.id[0]
                                },
                                transaction: t,
                                fields: ['deletedBy', 'deletedAt', 'isDeleted']
                            }));
                            return Promise.all(promises);
                        }).then(() => {
                            module.exports.deleteGenericCategoryFromElastic(req);
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(req.body.objIDs.singleLabel ? req.body.objIDs.singleLabel : req.body.objIDs.displayName));
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    } else {
                        module.exports.deleteGenericCategoryFromElastic(req);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(req.body.objIDs.singleLabel ? req.body.objIDs.singleLabel : req.body.objIDs.displayName));
                    }
                } else {
                    module.exports.deleteGenericCategoryFromElastic(req);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: gencatDetail,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    deleteGenericCategoryFromElastic: (req) => {
        // Delete Generic Categories By passed it's Type Detail into Elastic Search Engine for Enterprise Search
        if ((req.body.objIDs.displayName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_TYPES)) {
            EnterpriseSearchController.deleteEquipmentWorkstationTypesDetailInElastic(req.body.objIDs.id.toString());
        } else if ((req.body.objIDs.displayName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_GROUPS)) {
            EnterpriseSearchController.deleteEquipmentWorkstationGroupsDetailInElastic(req.body.objIDs.id.toString());
        } else if ((req.body.objIDs.displayName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.EQUIPMENT_WORKSTATION_OWNERSHIPS)) {
            EnterpriseSearchController.deleteEquipmentWorkstationTypesOwnershipsInElastic(req.body.objIDs.id.toString());
        } else if ((req.body.objIDs.displayName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.GEOLOCATIONS)) {
            EnterpriseSearchController.deleteLocationsInElastic(req.body.objIDs.id.toString());
        } else if ((req.body.objIDs.displayName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ECO_DFM_TYPE)) {
            EnterpriseSearchController.deleteECODFMTypeInElastic(req.body.objIDs.id.toString());
        } else if ((req.body.objIDs.displayName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory)) {
            EnterpriseSearchController.deletePaymentTypeCategoryDetailInElastic(req.body.objIDs.id.toString());
        }
    },

    getAllGenericCategoryByCategoryType: (req, res) => {
        const {
            GenericCategory,
            sequelize
        } = req.app.locals.models;
        const whereClause = {
            categoryType: req.body.categoryType,
            isDeleted: false
        };
        if (req.body && req.body.searchObj) {
            whereClause.gencCategoryName = {
                [Op.like]: `%${req.body.searchObj}%`
            };
        }
        GenericCategory.findAll({
            where: whereClause,
            attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode', 'isActive', 'termsDays'],
            order: [sequelize.fn('ISNULL', sequelize.col('displayOrder')), ['displayOrder', 'ASC'],
            ['gencCategoryName', 'ASC']
            ]
        }).then(genericCategoryList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, genericCategoryList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    getSelectedGenericCategoryList: (req, res) => {
        const {
            GenericCategory,
            BankMst
        } = req.app.locals.models;
        var where = {
            categoryType: {
                [Op.in]: req.body.listObj.GencCategoryType
            }
        };
        if (!req.body.listObj.isActive) {
            where.isActive = true;
        }
        GenericCategory.findAll({
            where: where,
            include: [{
                model: GenericCategory,
                as: 'paymentTypeCategory',
                where: {
                    categoryType: DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory,
                    isDeleted: false
                },
                attributes: ['gencCategoryID', 'gencCategoryName', 'gencCategoryCode', 'categoryType'],
                required: false
            },
            {
                model: BankMst,
                as: 'bankMst',
                where: {
                    isDeleted: false
                },
                attributes: ['id', 'accountCode', 'bankName'],
                required: false
            }],
            order: [
                ['displayOrder', 'ASC'],
                ['gencCategoryName']
            ]
        }).then(genericCategoryList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, genericCategoryList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    downloadGenericCategoryTemplate: (req, res) => {
        const categoryTypeName = `${req.params.categoryType}.csv`;
        var path = GENERICCATEGORY.DOWNLOAD_PATH + categoryTypeName;

        // eslint-disable-next-line consistent-return
        fs.readFile(path, (err) => {
            if (err) {
                if (err.code === COMMON.FileErrorMessage.NotFound) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                }
            } else {
                const file = path;
                res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
                res.setHeader('Content-type', 'application/vnd.ms-excel');
                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }
        });
    },

    uploadGenericDocuments: (req, res) => {
        const dir = './uploads/genericfiles/generic_category/';
        if (typeof (req.files) === 'object' && Array.isArray(req.files.documents)) {
            const file = req.files.documents[0];
            const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
            const fileName = `${uuidv1()}.${ext}`;
            const path = dir + fileName;
            req.body.profileImg = fileName;
            // eslint-disable-next-line consistent-return
            fsextra.move(file.path, path, (err) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                } else {
                    module.exports.uploadGenericDocumentsDetails(req, res, path); // ".\\" + req.files[0].path);
                }
            });
        }
    },
    uploadGenericDocumentsDetails: (req, res, filePath) => {
        const categoryTypeName = req.body.categoryType;
        const GenericDataList = [];
        const AllDataWithError = [];
        let index = 0;
        let onErrorIndex = 0;
        let isAnyInvalidData = false;
        const path = filePath;
        const stream = fs.createReadStream(path);
        const statusArray = [];
        statusArray.push('active');
        statusArray.push('inactive');
        const EOMArray = [];
        EOMArray.push('yes');
        EOMArray.push('no');

        csv.fromStream(stream, {
            headers: true,
            ignoreEmpty: true
        })
            .validate((data) => {
                if (data) {
                    data.index = index++;
                    data.ErrorLog = '';
                    data.OperationStatus = '';
                    if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.BARCODE_SEPARATORS) {
                        data.Code = data.Name;
                        data.Name = data['Barcode Field Separator(s)'];
                    }
                    if (!data.Name || data.Name.length > 100 ||
                        (data.Code && data.Code.length > 50) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.SHIPPING_METHODS && !data.Code) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory && !data.Code) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.SHIPPING_METHODS && !data.Carrier) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.TERMS_TYPE && !data['Terms Days']) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.TERMS_TYPE && data['Terms Days'] && !_.isInteger(_.toNumber(data['Terms Days']))) ||

                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.TERMS_TYPE && (!data.EOM || !_.find(EOMArray, itemEOM => data.EOM.toLowerCase() === itemEOM))) ||
                        ((categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PayablePaymentMethod || categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ReceivablePaymentMethod) && !data['Payment Type Category']) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PayablePaymentMethod && !data['Bank Account Code']) ||

                        (data['Display Order'] && (isNaN(parseFloat(data['Display Order'])) ||
                            !isFinite(data['Display Order']) ||
                            parseInt(data['Display Order']) > 9999.99 || parseInt(data['Display Order']) < 0)) ||
                        (!data.Status) || (data.Status && !_.find(statusArray, itemStatus => data.Status.toLowerCase() === itemStatus)) ||
                        (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.REPORT_CATEGORY && data.Description && data.Description.length > 1000) ||
                        (data['Color code'] && data['Color code'].length !== 7)) {
                        return false;
                    }
                    if (data.Name || data.Code) {
                        // if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.BARCODE_SEPARATORS) {
                        //     return true;
                        // }
                        if (data.Code && !COMMON.CommonGenericCategoryCodeValidation.test(data.Code)) {
                            return false;
                        }

                        if (data.Code && COMMON.CommonGenericCategoryCodeValidation.test(data.Code) && data.Name) {
                            return true;
                        }

                        return true;
                    } else {
                        return true;
                    }
                }
                return false;
            })
            .on('data-invalid', (data) => {
                if (data) {
                    let ErrorMsg = '';
                    isAnyInvalidData = true;
                    if (!data.Name) {
                        ErrorMsg = GENERICCATEGORY.NAME_NOT_FOUND;
                    }
                    if (data.Name && data.Name.length > 100) {
                        ErrorMsg = GENERICCATEGORY.NAME_LENGTH_INVALID;
                    }
                    if (data.Code && (data.Code.length > 50)) {
                        const codeMsg = GENERICCATEGORY.CODE_LENGTH_INVALID;
                        ErrorMsg += (ErrorMsg) ? `,${codeMsg}` : codeMsg;
                    }
                    if (data.Description && data.Description.length > 1000) {
                        ErrorMsg = GENERICCATEGORY.DESCRIPTION_LENGTH_INVALID;
                    }
                    if (data['Display Order'] && (isNaN(parseFloat(data['Display Order'])) || !isFinite(data['Display Order']) ||
                        parseInt(data['Display Order']) > 9999.99 || parseInt(data['Display Order']) < 0)) {
                        const DisplayorderMsg = GENERICCATEGORY.DISPLAY_ORDER_VALUE_INVALID;
                        ErrorMsg += (ErrorMsg) ? `, ${DisplayorderMsg}` : DisplayorderMsg;
                    }
                    if (!data.Code && (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.SHIPPING_METHODS || categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory)) {
                        const codeMsg = MESSAGE_CONSTANT.GENERICCATEGORY.CODE_NOT_FOUND;
                        ErrorMsg += (ErrorMsg) ? `, ${codeMsg}` : codeMsg;
                    }
                    if (!data.Carrier && categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.SHIPPING_METHODS) {
                        const codeMsg = COMMON.stringFormat(_.cloneDeep(GENERICCATEGORY.Required), 'Carrier Name');
                        ErrorMsg += (ErrorMsg) ? `, ${codeMsg}` : codeMsg;
                    }
                    let statusMsg = '';
                    if (data.Status) {
                        if (!_.find(statusArray, itemStatus => data.Status.toLowerCase() === itemStatus)) {
                            statusMsg = GENERICCATEGORY.STATUS_VALUE_INVALID;
                            ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                        }
                    } else {
                        statusMsg = GENERICCATEGORY.STATUS_REQUIRED;
                        ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                    }
                    if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.TERMS_TYPE) {
                        if (data.EOM) {
                            if (!_.find(EOMArray, itemEOM => data.EOM.toLowerCase() === itemEOM)) {
                                statusMsg = GENERICCATEGORY.EOM_VALUE_INVALID;
                                ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                            }
                        } else {
                            statusMsg = GENERICCATEGORY.EOM_REQUIRED;
                            ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                        }
                        if (data['Terms Days'] && !_.isInteger(data['Terms Days'])) {
                            statusMsg = GENERICCATEGORY.INVALID_TERMS_DAYS;
                            ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                        }
                    }
                    if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PayablePaymentMethod || categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ReceivablePaymentMethod) {
                        if (!data['Payment Type Category']) {
                            statusMsg = GENERICCATEGORY.PAYMENT_TYPE_CATEGORY_REQUIRED;
                            ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                        }
                        if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PayablePaymentMethod) {
                            if (!data['Bank Account Code']) {
                                statusMsg = GENERICCATEGORY.BANK_ACCOUNT_CODE_REQUIRED;
                                ErrorMsg += (ErrorMsg) ? `, ${statusMsg}` : statusMsg;
                            }
                        }
                    }
                    if (data['Color code'] && data['Color code'].length !== 7) {
                        const colorCodeMsg = GENERICCATEGORY.COLOR_CODE_INVALID;
                        ErrorMsg += (ErrorMsg) ? `, ${colorCodeMsg}` : colorCodeMsg;
                    }
                    if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.TERMS_TYPE && !data['Terms Days']) {
                        ErrorMsg += (ErrorMsg) ? `, ${GENERICCATEGORY.TERMS_DAYS}` : GENERICCATEGORY.TERMS_DAYS;
                    }
                    if (data.Code && !COMMON.CommonGenericCategoryCodeValidation.test(data.Code)) {
                        ErrorMsg += (ErrorMsg) ? `, ${GENERICCATEGORY.CODE_INVALID}` : GENERICCATEGORY.CODE_INVALID;
                    }

                    data.ErrorLog = ErrorMsg;
                    data.OperationStatus = GENERICCATEGORY.FAILED;
                    AllDataWithError.push(data);
                }
            })
            .on('data', (data) => {
                if (data) {
                    data.Status = data.Status && data.Status.toLowerCase() === 'active' ? 'true' : 'false';
                    if (data.EOM) {
                        data.EOM = data.EOM.toLowerCase() === 'yes' ? 'true' : 'false';
                    }
                    GenericDataList.push(data);
                }
            })
            .on('end', () => {
                /* GenericDataList - data list that need to be added in table */
                if (GenericDataList.length > 0) {
                    const listDataIndex = 0;
                    // eslint-disable-next-line no-use-before-define
                    return CheckGenericCategoryExists(SaveGenericCategoryCallback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                } else if (isAnyInvalidData && AllDataWithError.length > 0) {
                    // eslint-disable-next-line no-use-before-define
                    return DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.MASTER.INVALID_FILE_DATA,
                        err: null,
                        data: null
                    });
                }
            })
            // eslint-disable-next-line consistent-return
            .on('error', () => {
                onErrorIndex++;
                /* data in loop called error part everytime if error so to display error only once put condition */
                if (onErrorIndex === 1) {
                    stream.destroy();
                    return resHandler.errorRes(res, 200, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.MASTER.INVALID_FILE_DATA,
                        err: null,
                        data: null
                    });
                }
            });
    },
    // check Generic Category Already Exists
    // POST : /api/v1/genericcategory/checkEcoTypeValuesAlreadyExists
    // @return API response
    checkGenericCategoryAlreadyExists: (req, res) => {
        const {
            GenericCategory
        } = req.app.locals.models;
        const whereStatement = [];
        var fieldName = '';
        if (req.body.objs.gencCategoryName) {
            req.body.objs.gencCategoryName = COMMON.TEXT_WORD_CAPITAL(req.body.objs.gencCategoryName, false);
            whereStatement.push({
                gencCategoryName: req.body.objs.gencCategoryName
            });
        }
        if (req.body.objs.gencCategoryCode) {
            req.body.objs.gencCategoryCode = req.body.objs.gencCategoryCode.toUpperCase();
            whereStatement.push({
                gencCategoryCode: req.body.objs.gencCategoryCode
            });
        }
        const whereClause = {
            categoryType: req.body.objs.categoryType,
            [Op.or]: whereStatement
        };
        if (req.body.objs.gencCategoryID) {
            whereClause.gencCategoryID = {
                [Op.notIn]: [req.body.objs.gencCategoryID]
            };
        }
        GenericCategory.findOne({
            where: whereClause
        }).then((findcategory) => {
            if (findcategory) {
                if (req.body.objs.gencCategoryName) {
                    if (findcategory.dataValues.gencCategoryName.toLowerCase() === req.body.objs.gencCategoryName.toLowerCase()) {
                        fieldName = COMMON.stringFormat(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.NAME, req.body.objs.singleLabel);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName),
                            err: null,
                            data: {
                                isDuplicateGencCategoryName: true
                            }
                        });
                    }
                }

                if (req.body.objs.gencCategoryCode) {
                    if (findcategory.dataValues.gencCategoryCode.toLowerCase() === req.body.objs.gencCategoryCode.toLowerCase()) {
                        fieldName = COMMON.stringFormat(DATA_CONSTANT.GENERIC_CATEGORY_UNIQUE_FIELD_NAME.CODE, req.body.objs.singleLabel);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName),
                            err: null,
                            data: {
                                isDuplicateGencCategoryCode: true
                            }
                        });
                    }
                }
            }
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    }
};

/* save data from csv document of category type imported */
// eslint-disable-next-line func-names
const SaveGenericCategoryCallback = function (data, isExists, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res) {
    if (isExists && !data.iscarrier && !data.isPaymentTypeCategory && !data.isBank) {
        delete data.iscarrier;
        delete data.isPaymentTypeCategory;
        delete data.isBank;
        if (data.Name && isExists.gencCategoryName && data.Name.toLowerCase() === isExists.gencCategoryName.toLowerCase()) {
            data.ErrorLog = GENERICCATEGORY.CATEGORY_NAME_EXISTS;
        } else if (data.Code && isExists.gencCategoryCode && data.Code.toLowerCase() === isExists.gencCategoryCode.toLowerCase()) {
            data.ErrorLog = GENERICCATEGORY.CATEGORY_CODE_EXISTS;
        } else {
            data.ErrorLog = GENERICCATEGORY.CATEGORY_DISPLAY_ORDER;
        }

        data.OperationStatus = GENERICCATEGORY.FAILED;
        AllDataWithError.push(data);
        listDataIndex++;
        if (listDataIndex <= GenericDataList.length - 1) {
            // eslint-disable-next-line no-use-before-define
            CheckGenericCategoryExists(SaveGenericCategoryCallback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
        } else if (AllDataWithError.length > 0) {
            // eslint-disable-next-line no-use-before-define
            DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
        }
    } else if (!isExists && data.iscarrier && data.Carrier) {
        delete data.iscarrier;
        data.ErrorLog = GENERICCATEGORY.CARRIER_CODE_NOT_EXIST;
        data.OperationStatus = GENERICCATEGORY.FAILED;
        AllDataWithError.push(data);
        listDataIndex++;
        if (listDataIndex <= GenericDataList.length - 1) {
            // eslint-disable-next-line no-use-before-define
            CheckGenericCategoryExists(SaveGenericCategoryCallback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
        } else if (AllDataWithError.length > 0) {
            // eslint-disable-next-line no-use-before-define
            DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
        }
    } else if (!isExists && (data.isPaymentTypeCategory || data.isBank)) {
        data.ErrorLog = data.isPaymentTypeCategory ? GENERICCATEGORY.PAYMENT_TYPE_CATEGORY_NOT_EXIST : GENERICCATEGORY.BANK_ACCOUNT_CODE_NOT_EXIST;
        delete data.isPaymentTypeCategory;
        delete data.paymentTypeCategoryId;
        delete data.isBank;
        delete data.bankid;
        data.OperationStatus = GENERICCATEGORY.FAILED;
        AllDataWithError.push(data);
        listDataIndex++;
        if (listDataIndex <= GenericDataList.length - 1) {
            // eslint-disable-next-line no-use-before-define
            CheckGenericCategoryExists(SaveGenericCategoryCallback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
        } else if (AllDataWithError.length > 0) {
            // eslint-disable-next-line no-use-before-define
            DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
        }
    } else {
        COMMON.setModelCreatedByFieldValue(req);
        const ObjGenericData = {
            gencCategoryName: data.Name,
            gencCategoryCode: data.Code ? data.Code.toUpperCase() : null,
            categoryType: categoryTypeName,
            displayOrder: data['Display Order'] ? data['Display Order'] : null,
            isDeleted: false,
            parentGencCategoryID: data.parentGencCategoryID ? data.parentGencCategoryID : null,
            isActive: data.Status ? JSON.parse(data.Status.toLowerCase()) : true,
            colorCode: data.ColorCode ? data.ColorCode : null,
            createdBy: req.user.id,
            updatedBy: req.user.id,
            createdAt: req.body.createdAt,
            updatedAt: req.body.updatedAt,
            createByRoleId: req.body.createByRoleId,
            updateByRoleId: req.body.updateByRoleId,
            termsDays: data['Terms Days'],
            carrierID: (data.iscarrier && data.Carrier) ? isExists.gencCategoryID : null,
            description: (data.Description) ? data.Description : null,
            isEOM: data.EOM ? JSON.parse(data.EOM.toLowerCase()) : false,
            paymentTypeCategoryId: (!data.isPaymentTypeCategory && data['Payment Type Category']) ? data.paymentTypeCategoryId : null,
            bankid: (!data.isBank && data['Bank Account Code']) ? data.bankid : null
        };

        delete data.iscarrier;
        delete data.isPaymentTypeCategory;
        delete data.isBank;
        const GenericCategory = req.app.locals.models.GenericCategory;
        const { sequelize } = req.app.locals.models;
        // eslint-disable-next-line consistent-return
        sequelize.transaction().then((t) => {
            GenericCategory.create(ObjGenericData, { transaction: t }).then((GenericCat) => {
                if (GenericCat) {
                    // eslint-disable-next-line consistent-return
                    t.commit().then(() => {
                        listDataIndex++;
                        // Add data in Elastic Search
                        req.body.categoryType = categoryTypeName;
                        if (GenericCat.gencCategoryID) {
                            req.params['pId'] = GenericCat.gencCategoryID;
                            module.exports.addGenericCategoryDetailInElastic(req);
                        }
                        if (listDataIndex <= GenericDataList.length - 1) {
                            // eslint-disable-next-line no-use-before-define
                            CheckGenericCategoryExists(SaveGenericCategoryCallback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                        } else if (AllDataWithError.length > 0) {
                            // eslint-disable-next-line no-use-before-define
                            DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(categoryTypeName === 'Part Requirement Category' ? DATA_CONSTANT.PURCHASE_INSPECTION_REQUIREMENT_TYPE.NAME : categoryTypeName));
                        }
                    });
                }
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                data.ErrorLog = GENERICCATEGORY.ERROR_IN_DATA_PROCESSING;
                data.OperationStatus = GENERICCATEGORY.FAILED;
                AllDataWithError.push(data);
                listDataIndex++;
                if (listDataIndex <= GenericDataList.length - 1) {
                    // eslint-disable-next-line no-use-before-define
                    CheckGenericCategoryExists(SaveGenericCategoryCallback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                } else {
                    // eslint-disable-next-line no-use-before-define
                    DownloadCSVFile(path, categoryTypeName, res, AllDataWithError);
                }
            });
        });
    }
};

/* check data if exist or not in database from csv document of category type imported */
// eslint-disable-next-line func-names
let CheckGenericCategoryExists = function (callback, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res) {
    const {
        GenericCategory,
        BankMst
    } = req.app.locals.models;
    const data = GenericDataList[listDataIndex];
    let whereStatus = {
        [Op.or]: [{
            gencCategoryName: data.Name
        }
        ],
        categoryType: categoryTypeName
    };
    if (data['Display Order'] && data.Code) {
        whereStatus = {
            [Op.or]: [{
                gencCategoryName: data.Name
            },
            { displayOrder: data['Display Order'] },
            { gencCategoryCode: data.Code }
            ],
            categoryType: categoryTypeName
        };
    } else if (data['Display Order']) {
        whereStatus = {
            [Op.or]: [{
                gencCategoryName: data.Name
            },
            { displayOrder: data['Display Order'] }
            ],
            categoryType: categoryTypeName
        };
    } else if (data.Code) {
        whereStatus = {
            [Op.or]: [{
                gencCategoryName: data.Name
            },
            { gencCategoryCode: data.Code }
            ],
            categoryType: categoryTypeName
        };
    }
    GenericCategory.findOne({
        where: whereStatus
    }).then((isExists) => {
        if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.SHIPPING_METHODS) {
            if (!isExists && data.Carrier) {
                GenericCategory.findOne({
                    where: {
                        [Op.or]: [{
                            gencCategoryName: data.Carrier
                        },
                        {
                            gencCategoryCode: data.Carrier
                        }
                        ],
                        categoryType: DATA_CONSTANT.GENERIC_CATEGORY_TYPE.CARRIER
                    }
                }).then((iscarrierExist) => {
                    data.iscarrier = true;
                    callback(data, iscarrierExist, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                }).catch(() => {
                    callback(data, isExists, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                });
            } else {
                data.iscarrier = false;
                callback(data, isExists, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
            }
        } else if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PayablePaymentMethod) {
            if (!isExists && (data['Payment Type Category'] || data['Bank Account Code'])) {
                GenericCategory.findOne({
                    where: {
                        [Op.or]: [{
                            gencCategoryName: data['Payment Type Category']
                        },
                        {
                            gencCategoryCode: data['Payment Type Category']
                        }
                        ],
                        categoryType: DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory
                    }
                }).then((paymentTypeCategory) => {
                    if (paymentTypeCategory) {
                        data.isPaymentTypeCategory = false;
                        data.paymentTypeCategoryId = paymentTypeCategory.gencCategoryID;
                        BankMst.findOne({
                            where: {
                                accountCode: data['Bank Account Code']
                            }
                        }).then((isBankExist) => {
                            if (isBankExist) {
                                data.isBank = false;
                                data.bankid = isBankExist.id;
                                callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                            } else {
                                data.isBank = true;
                                callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                            }
                        }).catch(() => {
                            data.isBank = true;
                            callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                        });
                    } else {
                        data.isPaymentTypeCategory = true;
                        callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                    }
                }).catch(() => {
                    data.isPaymentTypeCategory = true;
                    callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                });
            } else {
                callback(data, isExists, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
            }
        } else if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.ReceivablePaymentMethod) {
            if (!isExists && data['Payment Type Category']) {
                GenericCategory.findOne({
                    where: {
                        [Op.or]: [{
                            gencCategoryName: data['Payment Type Category']
                        },
                        {
                            gencCategoryCode: data['Payment Type Category']
                        }
                        ],
                        categoryType: DATA_CONSTANT.GENERIC_CATEGORY_TYPE.PaymentTypeCategory
                    }
                }).then((paymentTypeCategory) => {
                    if (paymentTypeCategory) {
                        data.isPaymentTypeCategory = false;
                        data.paymentTypeCategoryId = paymentTypeCategory.gencCategoryID;
                        callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                    } else {
                        data.isPaymentTypeCategory = true;
                        callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                    }
                }).catch(() => {
                    data.isPaymentTypeCategory = true;
                    callback(data, null, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
                });
            } else {
                callback(data, isExists, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
            }
        } else {
            data.iscarrier = false;
            callback(data, isExists, GenericDataList, req, categoryTypeName, AllDataWithError, listDataIndex, path, res);
        }
    }).catch(() => {
    });
};

// eslint-disable-next-line func-names
let DownloadCSVFile = function (path, categoryTypeName, res, AllDataWithError) {
    const PrintAllData = [];
    _.each(AllDataWithError, (item) => {
        item = _.omit(item, ['index']);
        if (categoryTypeName === DATA_CONSTANT.GENERIC_CATEGORY_TYPE.BARCODE_SEPARATORS) {
            item['Barcode Field Separator(s)'] = item.Name;
            item.Name = item.Code;
            delete item.Code;
        }
        PrintAllData.push(item);
    });

    const ws = fs.createWriteStream(path);
    csv.write(PrintAllData, {
        headers: true
    }).pipe(ws);
    setTimeout(() => {
        var file = path;
        var mimetype = mime.lookup(`${file}. text/csv`);
        res.setHeader('Content-disposition', `attachment; filename=${categoryTypeName}`);
        res.setHeader('Content-type', mimetype);
        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }, 2000);
};