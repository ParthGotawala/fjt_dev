const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const _ = require('lodash');
const { Op } = require('sequelize');

const componentLogicalGroupModuleName = DATA_CONSTANT.COMPONENT_LOGICAL_GROUP.DISPLAYNAME;
const inputFields = [
    'id',
    'name',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'systemGenerated',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const inputFieldsdetails = [
    'id',
    'logicalgroupID',
    'rfqMountingTypeID'
];
module.exports = {
    // Get List of retriveComponentLogicalGroup
    // GET : /api/v1/componentLogicalGroupController/retriveComponentLogicalGroup
    // @param {id} int
    // @return List of retriveComponentLogicalGroup
    retriveComponentLogicalGroup: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        var strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }
        sequelize.query('CALL Sproc_RetrievecomponentLogicalGroup (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)', {
            replacements: {
                ppageIndex: req.body.page,
                precordPerPage: filter.limit,
                pOrderBy: strOrderBy,
                pWhereClause: strWhere || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { component_logical_group: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    deleteComponentLogicalGroup: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.component_logical_group.Name;
            return sequelize.query('CALL Sproc_checkDelete(:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    // Delete Mounting Group Detail into Elastic Search Engine for Enterprise Search
                    EnterpriseSearchController.deleteMountingGroupDetailInElastic(req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(componentLogicalGroupModuleName));
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
    createComponentLogicalGroup: (req, res) => {
        const { ComponentLogicalgroup } = req.app.locals.models;
        if (req.body) {
            let where = {};
            if (req.body.name) {
                where = {
                    [Op.or]: [
                        { Name: req.body.name }
                    ]
                };
            }
            if (req.body.id) {
                where.id = { [Op.ne]: req.body.id };
            }
            // Update
            ComponentLogicalgroup.findOne({
                where: where
            }).then((response) => {
                if (response) {
                    // var msg = (response.name.toLowerCase() == req.body.name.toLowerCase()) ? MESSAGE_CONSTANT.LOGICAL_GROUP.LOGICAL_GROUP_UNIQUE : true;
                    let messageContent = null;
                    let data = null;
                    if (response.name.toLowerCase() === req.body.name.toLowerCase()) {
                        messageContent = MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.LOGICAL_GROUP_UNIQUE_FIELD.NAME);
                    } else {
                        data = true;
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: data });
                } else if (req.body.id) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return ComponentLogicalgroup.update(req.body, {
                        where: {
                            ID: req.body.id
                        },
                        fields: inputFields
                    }).then(() => {
                        // Add Mounting Group Detail into Elastic Search Engine for Enterprise Search
                        req.params['pId'] = req.body.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMountingGroupInElastic);

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(componentLogicalGroupModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                } else {
                    COMMON.setModelCreatedByFieldValue(req);
                    return ComponentLogicalgroup.create(req.body, {
                        fields: inputFields
                    }).then((bin) => {
                        // Add Mounting Group Type Detail into Elastic Search Engine for Enterprise Search
                        req.params['pId'] = bin.id;
                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMountingGroupInElastic);

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, bin, MESSAGE_CONSTANT.CREATED(componentLogicalGroupModuleName));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (err.message === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        }
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    updateComponentLogicalGroup: (req, res) => {
        const ComponentLogicalgroup = req.app.locals.models.ComponentLogicalgroup;
        if (req.params.id) {
            if (req.body.name) {
                return ComponentLogicalgroup.findOne({
                    where: {
                        Name: req.body.name,
                        id: { [Op.notIn]: [req.params.id] }
                    }
                }).then((isExists) => {
                    if (isExists) {
                        let messageContent = null;
                        let data = null;
                        // var msg = (isExists.name.toLowerCase() == req.body.name.toLowerCase()) ? MESSAGE_CONSTANT.LOGICAL_GROUP.LOGICAL_GROUP_UNIQUE : true;
                        if (isExists.name.toLowerCase() === req.body.name.toLowerCase()) {
                            messageContent = MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.LOGICAL_GROUP_UNIQUE_FIELD.NAME);
                        } else {
                            data = true;
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: data });
                    }
                    ComponentLogicalgroup.loginUser = req.user;
                    return ComponentLogicalgroup.update(req.body, {
                        where: {
                            id: req.params.id
                        },
                        fields: inputFields
                    }).then((rowsUpdated) => {
                        if (rowsUpdated[0] === 1) {
                            // Add Mounting Group Type Detail into Elastic Search Engine for Enterprise Search
                            req.params['pId'] = req.params.id;
                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageMountingGroupInElastic);

                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(componentLogicalGroupModuleName));
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(componentLogicalGroupModuleName), err: null, data: null });
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    getMountingTypeList: (req, res) => {
        const { RFQMountingType } = req.app.locals.models;

        return RFQMountingType.findAll({
            where: {
                isActive: true
            },
            attributes: ['id', 'name', 'isActive', 'colorCode']
        }).then(mountingTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mountingTypeList, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // get all mounting type that not added in any mounting group
    retrieveMountingTypesNotAddedInGroup: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_RetrieveMountingTypesNotAddedInGroup ()',
                {
                    replacements: {
                    }
                }).then(mountingTypeList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, mountingTypeList, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create Components Field Generic Alias
    // POST : /api/v1/saveLogicalGroupAlias
    // @return New create component Field Generic Alias
    saveLogicalGroupAlias: (req, res) => {
        const { ComponentLogicalgroupDetail, RFQMountingType } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        ComponentLogicalgroupDetail.findAll({
            where: {
                logicalgroupID: req.body.logicalgroupID
            },
            attributes: ['id', 'rfqMountingTypeID']
        }).then((response) => {
            var newAddedList = [];
            var deletedList = [];
            response.forEach((item) => {
                var typeObj = req.body.alias.find(x => parseInt(x.id) === parseInt(item.rfqMountingTypeID));
                if (!typeObj) { deletedList.push(item.id); }
            });
            // var aliasList = req.body.alias;
            const aliasList = req.body.alias.filter(item => !item.id);
            aliasList.forEach((aliasdata) => {
                var data = {
                    rfqMountingTypeID: aliasdata.rfqMountingTypeID,
                    logicalgroupID: aliasdata.logicalgroupID,
                    createdBy: userID
                };
                newAddedList.push(data);
            });

            /* check if component logical group already exists then not allowed to add */
            if (newAddedList.length > 0) {
                ComponentLogicalgroupDetail.findAll({
                    where: {
                        rfqMountingTypeID: { [Op.in]: _.map(newAddedList, 'rfqMountingTypeID') }
                    },
                    attributes: ['logicalgroupID'],
                    include: [
                        {
                            model: RFQMountingType,
                            as: 'rfqMountingType',
                            attributes: ['name'],
                            required: true
                        }
                    ]
                }).then((existsLogicalGrpList) => {
                    if (!existsLogicalGrpList || existsLogicalGrpList.length === 0) {
                        return module.exports.manageGenericAlias(newAddedList, deletedList, req, res);
                    } else {
                        const errMsg = Object.assign({}, MESSAGE_CONSTANT.MASTER.TYPE_ALREADY_ADDED);
                        errMsg.message = COMMON.stringFormat(errMsg, _.map(existsLogicalGrpList, item => item.rfqMountingType.name));
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: errMsg, err: null, data: null });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                module.exports.manageGenericAlias(newAddedList, deletedList, req, res);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // Create Components Field Generic Alias
    // POST : /api/v1/manageGenericAlias
    // @return New create component Field Generic Alias
    manageGenericAlias: (newAddedList, deletedList, req, res) => {
        const { sequelize, ComponentLogicalgroupDetail } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        return sequelize.transaction().then((t) => {
            var promises = [];
            if (newAddedList.length) {
                COMMON.setModelCreatedByFieldValue(req);

                promises.push(ComponentLogicalgroupDetail.bulkCreate(newAddedList, {
                    fields: inputFieldsdetails,
                    transaction: t
                }));
            }
            if (deletedList.length) {
                COMMON.setModelDeletedByFieldValue(req);
                const updatedData = {
                    deletedAt: COMMON.getCurrentUTC(req),
                    isDeleted: true,
                    deletedBy: userID
                };
                promises.push(ComponentLogicalgroupDetail.update(updatedData, {
                    where: {
                        id: { [Op.in]: deletedList }
                    },
                    transaction: t,
                    fields: ['deletedBy', 'deletedAt', 'isDeleted']
                }));
            }
            Promise.all(promises).then((response) => {
                t.commit().then(() => {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(componentLogicalGroupModuleName));
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
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    getLogicalGroupAlias: (req, res) => {
        const { ComponentLogicalgroupDetail, RFQMountingType } = req.app.locals.models;
        ComponentLogicalgroupDetail.findAll({
            where: { logicalgroupID: req.body.logicalgroupID },
            include: [
                {
                    model: RFQMountingType,
                    as: 'rfqMountingType',
                    required: false,
                    attributes: ['id', 'name'],
                    where: {
                        isDeleted: { [Op.eq]: 0 }
                    }
                }]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },
    // check component Logical Group Already Exists
    // POST : /api/v1/componentLogicalGroup/checkMountingGroupAlreadyExists
    // @return API response
    checkMountingGroupAlreadyExists: (req, res) => {
        const ComponentLogicalgroup = req.app.locals.models.ComponentLogicalgroup;
        if (req.body) {
            const whereClause = {
                name: { [Op.eq]: req.body.objs.name }
            };
            if (req.body.objs.id) {
                whereClause.id = { [Op.notIn]: [req.body.objs.id] };
            }
            ComponentLogicalgroup.findOne({
                where: whereClause
            }).then((isExists) => {
                if (isExists) {
                    let messageContent = null;
                    let data = null;
                    if (isExists.name.toLowerCase() === req.body.objs.name.toLowerCase()) {
                        messageContent = MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.LOGICAL_GROUP_UNIQUE_FIELD.NAME);
                    } else {
                        data = true;
                    }
                    // var msg = (isExists.name.toLowerCase() == req.body.objs.name.toLowerCase()) ? MESSAGE_CONSTANT.LOGICAL_GROUP.LOGICAL_GROUP_UNIQUE : true;
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: messageContent, err: null, data: data });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            });
        }
    }
};
