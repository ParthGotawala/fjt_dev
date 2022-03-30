const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const ComponentFieldGenericAlias = require('../../component_field_generic_Alias/controllers/Component_Field_Generic_Alias_Controller.js');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'id',
    'partTypeName',
    'isTemperatureSensitive',
    'displayOrder',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'

];

const partTypeModuleName = DATA_CONSTANT.PART_TYPE.NAME;
module.exports = {
    // Create Part Type
    // POST : /api/v1/rfqparttype/savePartType
    // @return created Part Type
    createPartType: (req, res) => {
        const { RFQPartType, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.partTypeName) { req.body.partTypeName = COMMON.TEXT_WORD_CAPITAL(req.body.partTypeName, false); }
            let where = {
            };
            if (req.body.id || parseInt(req.body.id) === 0) {
                if (!req.body.displayOrder) {
                    where = {
                        partTypeName: { [Op.eq]: req.body.partTypeName },
                        id: { [Op.ne]: req.body.id }
                    };
                }
                if (req.body.displayOrder && req.body.partTypeName) {
                    where = {
                        [Op.or]: [
                            { partTypeName: { [Op.eq]: req.body.partTypeName } },
                            { displayOrder: { [Op.eq]: req.body.displayOrder } }
                        ],
                        id: { [Op.ne]: req.body.id }
                    };
                }
            } else {
                where = {
                    [Op.or]: [{ partTypeName: req.body.partTypeName }]
                };
            }
            return RFQPartType.findOne({
                where: where
            }).then((response) => {
                if (response && (req.body.displayOrder || response.partTypeName.toLowerCase() === req.body.partTypeName.toLowerCase())) {
                    // var msg = (response.partTypeName.toLowerCase() == req.body.partTypeName.toLowerCase()) ? MESSAGE_CONSTANT.PART_TYPE.PART_TYPE_UNIQUE : MESSAGE_CONSTANT.PART_TYPE.PART_TYPE_ORDER_UNIQUE;
                    const fieldName = (response.partTypeName.toLowerCase() === req.body.partTypeName.toLowerCase()) ? DATA_CONSTANT.PART_TYPE_UNIUE_FIELD.NAME : DATA_CONSTANT.PART_TYPE_UNIUE_FIELD.DISPLAY_ORDER;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(fieldName), err: null, data: null });
                } else if (req.body.id || parseInt(req.body.id) === 0) {
                    // Update
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);
                        return RFQPartType.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then(() => {
                            const detail = {
                                refTableName: req.body.refTableName,
                                refId: req.body.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        t.commit().then(() => {
                                            // Add Functiona Type Detail into Elastic Search Engine for Enterprise Search
                                            req.params.pId = req.body.id;
                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageFunctionalTypeInElastic);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(partTypeModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PART_TYPE_UNIUE_FIELD.NAME), err: response.err || null, data: null });
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
                        return RFQPartType.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((parttype) => {
                            var detail = {
                                refTableName: req.body.refTableName,
                                refId: parttype.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        // Add default alias part validations for new functional type
                                        return sequelize.query('CALL Sproc_CreateDefaultAliasPartValidationsForFunctionalType (:pFunctionalTypeID, :pUserID)', {
                                            replacements: {
                                                pFunctionalTypeID: parttype.id,
                                                pUserID: COMMON.getRequestUserID(req)
                                            },
                                            transaction: t
                                        }).then(() => {
                                            t.commit().then(() => {
                                                // Add Functional Type Detail into Elastic Search Engine for Enterprise Search
                                                req.params.pId = detail.refId;
                                                EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageFunctionalTypeInElastic);

                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, parttype, MESSAGE_CONSTANT.CREATED(partTypeModuleName));
                                            });
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PART_TYPE_UNIUE_FIELD.NAME), err: response.err || null, data: null });
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
    // Retrive list of PartType
    // POST : /api/v1/rfqparttype/retrivePartTypeList
    // @return list of PartType
    retrivePartTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrievePartTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psourceDetails)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                psourceDetails: req.body.SourceDetail || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { PartType: _.values(response[1]), Count: response[0][0].TotalRecord }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of PartType
    // GET : /api/v1/rfqparttype/retrivePartType
    // @return list of PartType
    retrivePartType: (req, res) => {
        const { RFQPartType } = req.app.locals.models;
        if (req.params.id) {
            return RFQPartType.findOne({
                where: { id: req.params.id }

            }).then((parttype) => {
                if (!parttype) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null); // new NotFound(MESSAGE_CONSTANT.NOT_FOUND(partTypeModuleName))
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, parttype, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove PartType
    // POST : /api/v1/rfqparttype/deletePartType
    // @return list of PartType by ID
    deletePartType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.PartType.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    // Delete Functional Type Detail into Elastic Search Engine for Enterprise Search
                    EnterpriseSearchController.deleteFunctionalTypeDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(partTypeModuleName));
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
    // Retrive list of Part Type
    // GET : /api/v1/rfqparttype/getAllPartType
    // @return list of Part Type
    getPartTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;

        sequelize.query('CALL Sproc_GetPartTypeList()', {
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check part type exist or not
    // post:/api/v1/rfqparttype/checkDuplicatePartType
    // @retrun validity of code
    checkDuplicatePartType: (req, res) => {
        const { RFQPartType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseMfg = {
                partTypeName: req.body.partTypeName
            };
            if (req.body.id) {
                whereClauseMfg.id = { [Op.ne]: req.body.id };
            }
            return RFQPartType.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((partType) => {
                if (partType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return ComponentFieldsGenericaliasMst.findOne({
                        where: {
                            alias: req.body.partTypeName,
                            refTableName: req.body.refTableName,
                            refId: { [Op.ne]: req.body.id }
                        },
                        attributes: ['id']
                    }).then((partAlias) => {
                        if (partAlias) {
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

    // Check is alias is not in Functional Type alias
    // DELETE : /api/v1/rfqparttype/checkUniquePartTypeAlias
    // @return list of Functional type alias
    checkUniquePartTypeAlias: (req, res) => {
        /* set type of module request */
        const { RFQPartType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var where = {
            alias: req.body.alias,
            refTableName: req.body.refTableName
        };
        if (req.body.id) { where.refId = { [Op.ne]: req.body.id }; }
        ComponentFieldsGenericaliasMst.findOne({
            attributes: ['id', 'alias', 'refId'],
            where: where
        }).then((mfgAliasExistsInfo) => {
            if (mfgAliasExistsInfo) {
                RFQPartType.findOne({
                    attributes: ['id', 'partTypeName'],
                    where: {
                        id: mfgAliasExistsInfo.refId
                    }
                }).then((partType) => {
                    var obj = {
                        alias: mfgAliasExistsInfo.alias,
                        partTypeName: partType.partTypeName,
                        name: partType.partTypeName
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partAliasExistsInfo: obj }, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                const whereClauseMfg = {
                    partTypeName: req.body.alias
                };
                if (req.body.id) {
                    whereClauseMfg.id = { [Op.ne]: req.body.id };
                }

                RFQPartType.findOne({
                    where: whereClauseMfg,
                    attributes: ['id', 'partTypeName']
                }).then(partTypeExistsInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partTypeExistsInfo: partTypeExistsInfo }, null)).catch((err) => {
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

    // Retrive list of Functional Type
    // GET : /api/v1/rfqparttype/getFunctionalTypeList
    // @return list of Functional Type
    getFunctionalTypeList: (req, res) => {
        const { RFQPartType } = req.app.locals.models;
        var where = {};
        // for dynamic column based search using Sequelize
        if (req.query.searchQuery) {
            where.partTypeName = {
                [Op.like]: `%${req.query.searchQuery}%`
            };
        }
        // when edit recored
        if (req.query.id) {
            where.id = req.query.id;
        }
        RFQPartType.findAll({
            attributes: ['id', 'partTypeName'],
            where: where,
            order: [['displayOrder', 'ASC'], ['partTypeName', 'ASC']]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
