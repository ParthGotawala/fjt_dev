const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const ComponentFieldGenericAlias = require('../../component_field_generic_Alias/controllers/Component_Field_Generic_Alias_Controller.js');

const inputFields = [
    'id',
    'name',
    'description',
    'isActive',
    'isXrayRequired',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const PackageCaseTypeModuleName = DATA_CONSTANT.PACKAGE_CASE_TYPE.NAME;
module.exports = {
    // Create Package Case Type
    // POST : /api/v1/rfqsetting/createPackageCaseType
    // @return created Package Case Type
    createPackageCaseType: (req, res) => {
        const { RFQPackageCaseType, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            const where = {
                [Op.or]: [
                    { name: req.body.name }
                ]
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return RFQPackageCaseType.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    if (response.name.toLowerCase() === req.body.name.toLowerCase()) { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PACKAGE_CASE_TYPE_UNIQUE_FIELD.TYPE), err: null, data: null }); }
                    if (response.colorCode === req.body.colorCode) { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PACKAGE_CASE_TYPE_UNIQUE_FIELD.COLOR_CODE), err: null, data: null }); }
                }
                if (req.body && req.body.id) {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);

                        return RFQPackageCaseType.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then(() => {
                            var detail = {
                                refTableName: req.body.refTableName,
                                refId: req.body.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        t.commit().then(() => {
                                            req.params['pId'] = req.body.id;
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(PackageCaseTypeModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PACKAGE_CASE_TYPE_UNIQUE_FIELD.TYPE), err: response.err || null, data: null });
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
                } else {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelCreatedByFieldValue(req);
                        return RFQPackageCaseType.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((packageCaseType) => {
                            const detail = {
                                refTableName: req.body.refTableName,
                                refId: packageCaseType.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        t.commit().then(() => {
                                            req.params['pId'] = detail.refId;

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packageCaseType, MESSAGE_CONSTANT.CREATED(PackageCaseTypeModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PACKAGE_CASE_TYPE_UNIQUE_FIELD.TYPE), err: response.err || null, data: null });
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
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrive list of Package Case Type
    // POST : /api/v1/rfqsetting/retrivePackageCaseTypeList
    // @return list of Package Case Type
    retrivePackageCaseTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrievePackageCaseTypeList(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psourceDetails)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                psourceDetails: req.body.SourceDetail || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { PartCategory: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Package Case Type
    // GET : /api/v1/rfqsetting/retrivePackageCaseType
    // @return list of Package Case Type
    retrivePackageCaseType: (req, res) => {
        const { RFQPackageCaseType } = req.app.locals.models;
        if (req.params && req.params.id) {
            RFQPackageCaseType.findOne({
                where: { id: req.params.id }

            }).then((packageCaseType) => {
                if (!packageCaseType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packageCaseType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove Package Case Type
    // POST : /api/v1/rfqsetting/deletePackageCaseType
    // @return list of Package Case Type by ID
    deletePackageCaseType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.PackageCaseType.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(PackageCaseTypeModuleName));
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
    // Retrive list of Package Case Type
    // GET : /api/v1/rfqsetting/getPackageCaseTypeList
    // @return list of Package Case
    getPackageCaseTypeList: (req, res) => {
        const { RFQPackageCaseType } = req.app.locals.models;

        return RFQPackageCaseType.findAll({
            where: {
                isDeleted: false
            },
            paranoid: false,
            attributes: ['id', 'name', 'isActive', 'isXrayRequired'],
            order: [['name', 'ASC']]
        }).then(packageTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packageTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Check is alias is not in Package Case Type alias
    // DELETE : /api/v1/rfqsetting/checkUniquePackageCaseTypeAlias
    // @return list of Package Case Type alias
    checkUniquePackageCaseTypeAlias: (req, res) => {
        /* set type of module request */
        const { RFQPackageCaseType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var wheregeneric = {
            alias: req.body.alias,
            refTableName: req.body.refTableName
        };
        if (req.body && req.body.id) {
            wheregeneric.refId = { [Op.ne]: req.body.id };
        }
        ComponentFieldsGenericaliasMst.findOne({
            attributes: ['id', 'alias', 'refId'],
            where: wheregeneric
        }).then((PackageCaseAliasExistsInfo) => {
            if (PackageCaseAliasExistsInfo) {
                RFQPackageCaseType.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        id: PackageCaseAliasExistsInfo.refId
                    }
                }).then((packageCaseType) => {
                    var obj = {
                        alias: PackageCaseAliasExistsInfo.alias,
                        packageCaseTypeName: packageCaseType.name,
                        name: packageCaseType.name
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { packageCaseAliasExistsInfo: obj }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                const whereClauseMfg = {
                    name: req.body.alias
                };
                if (req.body && req.body.id) {
                    whereClauseMfg.id = { [Op.ne]: req.body.id };
                }
                RFQPackageCaseType.findOne({
                    where: whereClauseMfg,
                    attributes: ['id', 'name']
                }).then(packageCaseTypeExistsInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { packageCaseTypeExistsInfo: packageCaseTypeExistsInfo }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        });
    },
    // Check package case type exist or not
    // post:/api/v1/rfqsetting/checkDuplicatePackageCaseType
    // @retrun validity of package case type
    checkDuplicatePackageCaseType: (req, res) => {
        const { RFQPackageCaseType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseMfg = {
                name: req.body.name
            };
            if (req.body.id) {
                whereClauseMfg.id = { [Op.ne]: req.body.id };
            }
            return RFQPackageCaseType.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((packageCaseType) => {
                if (packageCaseType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return ComponentFieldsGenericaliasMst.findOne({
                        where: {
                            alias: req.body.name,
                            refTableName: req.body.refTableName,
                            refId: { [Op.ne]: req.body.id }
                        },
                        attributes: ['id']
                    }).then((packageCaseAlias) => {
                        if (packageCaseAlias) {
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

    // Retrive list of Package Case Type
    // GET : /api/v1/rfqsetting/getPackageCaseList
    // @return list of Package Case
    getPackageCaseList: (req, res) => {
        const { RFQPackageCaseType } = req.app.locals.models;
        var where = {};
        // for dynamic column based search using Sequelize
        if (req.query && req.query.searchQuery) {
            where.name = {
                [Op.like]: `%${req.query.searchQuery}%`
            };
        }
        // when edit recored
        if (req.query && req.query.id) {
            where.id = req.query.id;
        }
        RFQPackageCaseType.findAll({
            attributes: ['id', 'name'],
            where: where,
            order: [['name', 'ASC']]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
