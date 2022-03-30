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
    'description',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const ConnecterTypeModuleName = DATA_CONSTANT.CONNECTER_TYPE.NAME;
module.exports = {
    // Create Connecter Type
    // POST : /api/v1/rfqconnector/createConnecterType
    // @return created Connecter Type
    createConnecterType: (req, res) => {
        const { RFQConnecterType, sequelize } = req.app.locals.models;
        if (req.body) {
            if (req.body.name) { req.body.name = COMMON.TEXT_WORD_CAPITAL(req.body.name, false); }

            const where = {
                [Op.or]: [
                    { name: req.body.name }
                ]
            };
            if (req.body.id || req.body.id === 0) {
                where.id = { [Op.ne]: req.body.id };
            }
            return RFQConnecterType.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CONNECTOR_UNIQUE_FIELD_NAME.NAME), err: null, data: null });
                } else if (req.body.id || req.body.id === 0) {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);

                        return RFQConnecterType.update(req.body, {
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
                                            // Add Connector Type Detail into Elastic Search Engine for Enterprise Search
                                            req.params['pId'] = req.body.id;
                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageConnectorTypesInElastic);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(ConnecterTypeModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CONNECTOR_UNIQUE_FIELD_NAME.NAME), err: response.err || null, data: null });
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
                        return RFQConnecterType.create(req.body, {
                            fields: inputFields,
                            transaction: t
                        }).then((connectertype) => {
                            const detail = {
                                refTableName: req.body.refTableName,
                                refId: connectertype.id,
                                alias: req.body.alias
                            };
                            return ComponentFieldGenericAlias.saveCommonAlias(req, res, detail, t).then((response) => {
                                if (response) {
                                    if (response.status === STATE.SUCCESS) {
                                        t.commit().then(() => {
                                            // Add Connector Type Detail into Elastic Search Engine for Enterprise Search
                                            req.params['pId'] = detail.refId;
                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageConnectorTypesInElastic);

                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, connectertype, MESSAGE_CONSTANT.CREATED(ConnecterTypeModuleName));
                                        });
                                    } else if (response.isDuplicate) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.CONNECTOR_UNIQUE_FIELD_NAME.NAME), err: response.err || null, data: null });
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
    // Retrive list of Connecter Type
    // POST : /api/v1/rfqconnector/retriveConnecterTypeList
    // @return list of Connecter Type
    retriveConnecterTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        sequelize.query('CALL Sproc_RetrieveConnecterTypeList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:psourceDetails)', {
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
    // Retrive list of Connecter Type
    // GET : /api/v1/rfqconnector/retriveConnecterType
    // @return list of Connecter Type
    retriveConnecterType: (req, res) => {
        const { RFQConnecterType } = req.app.locals.models;
        if (req.params.id) {
            return RFQConnecterType.findOne({
                where: { id: req.params.id }

            }).then((connecterType) => {
                if (!connecterType) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(ConnecterTypeModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, connecterType, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    },
    // Remove Connecter Type
    // POST : /api/v1/rfqconnector/deleteConnecterType
    // @return list of Connecter Type by ID
    deleteConnecterType: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.ConnecterType.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    // Delete Connector Type Detail into Elastic Search Engine for Enterprise Search
                    EnterpriseSearchController.deleteConnectorTypesDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(ConnecterTypeModuleName));
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
    // Retrive list of Connecter list
    // GET : /api/v1/rfqconnector/getConnecterList
    // @return list of Connecter Type
    getConnecterTypeList: (req, res) => {
        const { RFQConnecterType } = req.app.locals.models;

        RFQConnecterType.findAll({
            where: {
                isDeleted: false
            },
            paranoid: false,
            attributes: ['id', 'name', 'isActive'],
            order: [['name', 'ASC']]
        }).then(connecterTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, connecterTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Get all getCommonTypeList (Connector+Mounting+Rohs+Functional+UOM )
    // POST : /api/v1/rfqconnector/getCommonTypeList
    // @return list of all mentioned types
    getCommonTypeList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        let filter;
        let strWhere = '';
        if (req.body.SearchText) {
            const searchFilterList = req.body.SearchColumns;
            const filterTypeListWithData = _.partition(searchFilterList, o => o.isExternalSearch);

            _.each(filterTypeListWithData, (listitem, index) => {
                let filterTypeWhereClause = '';
                if (listitem.length > 0) {
                    filter = null;
                    req.query.search = JSON.stringify(listitem);
                    filter = COMMON.UiGridFilterSearch(req);
                    if (filter.where && filter.where['aliaslist']) {
                        filter.where['aliaslist']['isCommaSeparatedValues'] = true;
                    }
                    listitem[0].isExternalSearch = true;
                    filterTypeWhereClause = COMMON.whereClauseOfMultipleFieldSearchText(filter.where);

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
        sequelize.query('CALL Sproc_GetCommonTypes (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:ptablename)', {
            replacements: {
                ppageIndex: req.body.page || req.body.Page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                ptablename: req.body.ptablename
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { types: _.values(response[1]), Count: response[0][0]['COUNT(*)'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Check is alias is not in Connector Type alias
    // DELETE : /api/v1/rfqconnector/checkUniqueConnectorTypeAlias
    // @return list of Connector type alias
    checkUniqueConnectorTypeAlias: (req, res) => {
        /* set type of module request */
        const { RFQConnecterType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        const whereGeneric = {
            alias: req.body.alias,
            refTableName: req.body.refTableName
        };
        if (req.body.id || (req.body.id === 0)) {
            whereGeneric.refId = { [Op.ne]: req.body.id };
        }
        ComponentFieldsGenericaliasMst.findOne({
            attributes: ['id', 'alias', 'refId'],
            where: whereGeneric
        }).then((connectorAliasExistsInfo) => {
            if (connectorAliasExistsInfo) {
                RFQConnecterType.findOne({
                    attributes: ['id', 'name'],
                    where: {
                        id: connectorAliasExistsInfo.refId
                    }
                }).then((connectorType) => {
                    var obj = {
                        alias: connectorAliasExistsInfo.alias,
                        connectorTypeName: connectorType.name,
                        name: connectorType.name
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { connectorAliasExistsInfo: obj }, null);
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

                RFQConnecterType.findOne({
                    where: whereClauseMfg,
                    attributes: ['id', 'name']
                }).then(connectorTypeExistsInfo => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { connectorTypeExistsInfo: connectorTypeExistsInfo }, null)).catch((err) => {
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
    // Check connector type exist or not
    // post:/api/v1/rfqconnector/checkDuplicateConnectorType
    // @retrun validity of connector type
    checkDuplicateConnectorType: (req, res) => {
        const { RFQConnecterType, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        if (req.body) {
            const whereClauseMfg = {
                name: req.body.name
            };
            if (req.body.id || req.body.id === 0) {
                whereClauseMfg.id = { [Op.ne]: req.body.id };
            }
            return RFQConnecterType.findOne({
                where: whereClauseMfg,
                attributes: ['id']
            }).then((connectorType) => {
                if (connectorType) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { isDuplicate: true }, null);
                } else {
                    return ComponentFieldsGenericaliasMst.findOne({
                        where: {
                            alias: req.body.name,
                            refTableName: req.body.refTableName,
                            refId: { [Op.ne]: req.body.id }
                        },
                        attributes: ['id']
                    }).then((connectorAlias) => {
                        if (connectorAlias) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { isDuplicate: true }, null);
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

    // Retrive list of Connector Type
    // GET : /api/v1/rfqconnector/getConnectorTypeList
    // @return list of Connector Type
    getConnectorTypeList: (req, res) => {
        const { RFQConnecterType } = req.app.locals.models;
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
        RFQConnecterType.findAll({
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
