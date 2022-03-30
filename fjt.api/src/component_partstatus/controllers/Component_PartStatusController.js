const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const ComponentFieldGenericAlias = require('../../component_field_generic_Alias/controllers/Component_Field_Generic_Alias_Controller.js');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');

const inputFields = [
    'id',
    'name',
    'colorCode',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'

];

const ComponentStatusModuleName = DATA_CONSTANT.COMPONENT_PARTSTATUS.NAME;
module.exports = {
    // Create Part Status
    // POST : /api/v1/componentpartstatus/createPartStatus
    // @return created Part Status
    createPartStatus: (req, res) => {
        const { ComponentPartStatus, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            const where = {
                [Op.or]: [
                    { name: req.body.name },
                    { colorCode: req.body.colorCode }
                ]
            };
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            return ComponentPartStatus.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    if (response.name.toLowerCase() === req.body.name.toLowerCase()) { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PART_STATUS_UNIQUE_FIELD.PART_STATUS), err: null, data: null }); } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PART_STATUS_UNIQUE_FIELD.COLOR_CODE), err: null, data: null });
                    }
                } else if (req.body.id) {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);

                        return ComponentPartStatus.update(req.body, {
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
                                            // Add Part Status Detail into Elastic Search Engine for Enterprise Search
                                            req.params['pId'] = req.body.id;
                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.managePartStatusInElastic);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(ComponentStatusModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PART_STATUS_UNIQUE_FIELD.PART_STATUS), err: response.err || null, data: null });
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
                        return ComponentPartStatus.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((partstatus) => {
                            const detail = {
                                refTableName: req.body.refTableName,
                                refId: partstatus.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        t.commit().then(() => {
                                            // Add Part Status Detail into Elastic Search Engine for Enterprise Search
                                            req.params['pId'] = detail.refId;
                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.managePartStatusInElastic);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, partstatus, MESSAGE_CONSTANT.CREATED(ComponentStatusModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.PART_STATUS_UNIQUE_FIELD.PART_STATUS), err: response.err || null, data: null });
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Retrive list of Part Status
    // POST : /api/v1/componentpartstatus/retrivePartStatusList
    // @return list of Part status
    retrivePartStatusList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrievePartStatusList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psourceDetails)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                psourceDetails: req.body.SourceDetail || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { PartStatus: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Retrive list of Part Status
    // GET : /api/v1/componentpartstatus/retrivePartStatus
    // @return list of Part status
    retrivePartStatus: (req, res) => {
        const { ComponentPartStatus } = req.app.locals.models;
        if (req.params.id) {
            return ComponentPartStatus.findOne({
                where: { id: req.params.id }

            }).then((partstatus) => {
                if (!partstatus) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, partstatus, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove Part Status
    // POST : /api/v1/componentpartstatus/deletePartStatus
    // @return list of Part Status by ID
    deletePartStatus: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: DATA_CONSTANT.COMPONENT_PARTSTATUS.TableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    // Delete Part Status Type Detail into Elastic Search Engine for Enterprise Search
                    EnterpriseSearchController.deletePartStatusDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(ComponentStatusModuleName));
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
    // Retrive list of Part Status
    // GET : /api/v1/componentpartstatus/getPartStatusList
    // @return list of Part Status
    getPartStatusList: (req, res) => {
        const { ComponentPartStatus, sequelize } = req.app.locals.models;

        return ComponentPartStatus.findAll({
            attributes: ['id', 'name', 'isActive', 'colorCode'],
            order: [sequelize.fn('ISNULL', sequelize.col('ComponentPartStatus.displayOrder')), ['displayOrder', 'ASC'], ['name', 'ASC']]
        }).then(partstatusList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, partstatusList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check is alias is not in part status alias
    // DELETE : /api/v1/componentpartstatus/checkUniquePartStatusAlias
    // @return list of Part Status alias
    checkUniquePartStatusAlias: (req, res) => {
        /* set type of module request */
        const { ComponentPartStatus, ComponentFieldsGenericaliasMst } = req.app.locals.models;
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
        }).then((partstatusAliasExistsInfo) => {
            if (partstatusAliasExistsInfo) {
                ComponentPartStatus.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        id: partstatusAliasExistsInfo.refId
                    }
                }).then((partstatus) => {
                    var obj = {
                        alias: partstatusAliasExistsInfo.alias,
                        partStatusName: partstatus.name,
                        name: partstatus.name
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partstatusAliasExistsInfo: obj });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                const whereClauseMfg = {
                    name: req.body.alias
                };
                if (req.body.id) {
                    whereClauseMfg.id = { [Op.ne]: req.body.id };
                }
                ComponentPartStatus.findOne({
                    where: whereClauseMfg,
                    attributes: ['id', 'name']
                }).then(partStatusExistsInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { partStatusExistsInfo: partStatusExistsInfo }, null)).catch((err) => {
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
    // Check part status exist or not
    // post:/api/v1/componentpartstatus/checkDuplicatePartStatus
    // @retrun validity of part status
    checkDuplicatePartStatus: (req, res) => {
        const { ComponentPartStatus, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseStatus = {
                name: req.body.name
            };
            if (req.body.id) {
                whereClauseStatus.id = { [Op.ne]: req.body.id };
            }
            return ComponentPartStatus.findOne({
                where: whereClauseStatus,
                attributes: ['id']
            }).then((partstatus) => {
                if (partstatus) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicate: true } });
                } else {
                    return ComponentFieldsGenericaliasMst.findOne({
                        where: {
                            alias: req.body.name,
                            refTableName: req.body.refTableName,
                            refId: { [Op.ne]: req.body.id }
                        },
                        attributes: ['id']
                    }).then((statusAlias) => {
                        if (statusAlias) {
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

    // Retrive list of Part Status
    // GET : /api/v1/componentpartstatus/getStatusList
    // @return list of Part status
    getStatusList: (req, res) => {
        const { ComponentPartStatus } = req.app.locals.models;
        var where = {};
        // for dynamic column based search using Sequelize
        if (req.query.searchQuery) {
            where.name = {
                [Op.like]: `%${req.query.searchQuery}%`
            };
        }
        // when edit recored
        if (req.query.id) {
            where.id = req.query.id;
        }
        ComponentPartStatus.findAll({
            attributes: ['id', 'name'],
            where: where,
            order: [['name', 'ASC']]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        });
    },
    // update part status Display Order
    // POST:/api/v1/componentpartstatus/updatePartStatusDisplayOrder
    updatePartStatusDisplayOrder: (req, res) => {
        const { ComponentPartStatus } = req.app.locals.models;
        if (req.body) {
            return ComponentPartStatus.findOne({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    displayOrder: req.body.displayOrder,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (isexist && req.body.displayOrder) {
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.MUST_UNIQUE_GLOBAL);
                    messageContent.message = COMMON.stringFormat(messageContent.message, 'Display Order');
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: null });
                } else {
                    COMMON.setModelUpdatedByFieldValue(req);
                    const updateobj = {
                        displayOrder: req.body.displayOrder,
                        updatedBy: req.body.updatedBy,
                        updateByRoleId: req.body.updateByRoleId
                    };
                    return ComponentPartStatus.update(updateobj, {
                        where: {
                            id: req.body.id,
                            isDeleted: false
                        }
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(ComponentStatusModuleName))).catch((err) => {
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
    }
};
