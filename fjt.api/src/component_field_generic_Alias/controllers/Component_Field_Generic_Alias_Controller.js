const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const { NotFound, NotCreate } = require('../../errors');

const inputFields = [
    'id',
    'refTableName',
    'refId',
    'alias',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isDeleted',
    'systemGenerated',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];
const moduleName = DATA_CONSTANT.COMPONENT_GENERIC_ALIAS.NAME;
module.exports = {
    // Get List of Components Field Generic Alias
    // GET : /api/v1/component/getComponentGenericAlias
    // @param {id} int
    // @return List of Components Field Generic Alias
    getComponentGenericAlias: (req, res) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetComponentGenericAlias (:prefTableName,:prefId)', {
            replacements: {
                prefTableName: req.query.refTableName,
                prefId: req.query.refId
            }
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
        });
    },
    // Create Components Field Generic Alias
    // POST : /api/v1/saveGenericAlias
    // @return New create component Field Generic Alias
    saveGenericAlias: (req, res) => {
        const { ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        req.obj = {
            prefID: req.body.refId,
            pName: req.body.name,
            refTableName: req.body.refTableName
        };
        ComponentFieldsGenericaliasMst.findAll({
            where: {
                refTableName: req.body.refTableName,
                refId: req.body.refId
            },
            attributes: ['id']
        }).then((response) => {
            var newAddedList = [];
            var deletedList = [];
            response.forEach((item) => {
                var typeObj = req.body.alias.find(x => parseInt(x.id) === parseInt(item.id));
                if (!typeObj) { deletedList.push(item.id); }
            });
            const aliasList = req.body.alias.filter(item => item.id == null);
            aliasList.forEach((aliasdata) => {
                var data = {
                    refTableName: req.body.refTableName,
                    refId: req.body.refId,
                    alias: aliasdata.alias,
                    createdBy: userID
                };
                newAddedList.push(data);
            });
            if (newAddedList.length) {
                return ComponentFieldsGenericaliasMst.findAll({
                    where: {
                        refTableName: req.body.refTableName,
                        alias: { [Op.in]: aliasList.map(x => x.alias) },
                        refId: { [Op.ne]: req.body.refId }
                    }
                }).then((resp) => {
                    if (resp.length) {
                        const model = {
                            status: 'alias',
                            data: resp
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, model);
                    } else {
                        return module.exports.manageGenericAlias(newAddedList, deletedList, req, res);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
                });
            } else {
                return module.exports.manageGenericAlias(newAddedList, deletedList, req, res);
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
        });
    },

    // Create Components Field Generic Alias
    // POST : /api/v1/manageGenericAlias
    // @return New create component Field Generic Alias
    manageGenericAlias: (newAddedList, deletedList, req, res) => {
        const { sequelize, ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        return sequelize.transaction().then((t) => {
            var promises = [];
            if (newAddedList.length) {
                COMMON.setModelCreatedByFieldValue(req);
                promises.push(ComponentFieldsGenericaliasMst.bulkCreate(newAddedList, {
                    fields: inputFields,
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
                promises.push(ComponentFieldsGenericaliasMst.update(updatedData, {
                    where: {
                        id: { [Op.in]: deletedList }
                    },
                    transaction: t,
                    fields: ['deletedBy', 'deletedAt', 'isDeleted']
                }));
            }
            return Promise.all(promises).then((response) => {
                if (req.obj && req.obj.pName) {
                    return sequelize.query('CALL Sproc_updateCommonTypeAlias (:prefID,:pName,:ptablename)', {
                        replacements: {
                            prefID: req.obj.prefID,
                            pName: req.obj.pName,
                            ptablename: req.obj.refTableName
                        },
                        transaction: t
                    }).then(() => {
                        t.commit().then(() => {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName));
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
                    });
                } else {
                    t.commit().then(() => {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(moduleName));
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(moduleName)));
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
        });
    },
    // Create Components Field Generic Alias
    // POST : /api/v1/saveCommonAlias
    // @return New create component Field Generic Alias
    saveCommonAlias: (req, res, objCommonType, t) => {
        const { ComponentFieldsGenericaliasMst } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        return ComponentFieldsGenericaliasMst.findAll({
            where: {
                refTableName: objCommonType.refTableName,
                refId: objCommonType.refId
            },
            attributes: ['id']
        }).then((response) => {
            var newAddedList = [];
            var deletedList = [];
            response.forEach((item) => {
                var typeObj = objCommonType.alias.find(x => parseInt(x.id) === parseInt(item.id));
                if (!typeObj) { deletedList.push(item.id); }
            });
            const aliasList = objCommonType.alias.filter(item => item.id == null);
            aliasList.forEach((aliasdata) => {
                var data = {
                    refTableName: objCommonType.refTableName,
                    refId: objCommonType.refId,
                    alias: aliasdata.alias,
                    createdBy: userID,
                    updatedBy: userID,
                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                newAddedList.push(data);
            });
            if (newAddedList.length) {
                return ComponentFieldsGenericaliasMst.findAll({
                    where: {
                        refTableName: objCommonType.refTableName,
                        alias: { [Op.in]: aliasList.map(x => x.alias) },
                        refId: { [Op.ne]: objCommonType.refId }
                    }
                }).then((resp) => {
                    if (resp.length) {
                        return { status: STATE.FAILED, isDuplicate: true };
                    } else {
                        return module.exports.manageCommonAlias(newAddedList, deletedList, req, t).then((response) => ({
                            status: response.status, err: response.err
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            return { status: STATE.FAILED, err: err };
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { status: STATE.FAILED, err: err };
                });
            } else {
                return module.exports.manageCommonAlias(newAddedList, deletedList, req, t).then((response) => ({
                    status: response.status, err: response.err
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return { status: STATE.FAILED, err: err };
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, err: err };
        });
    },

    // Create Components Field Generic Alias
    // POST : /api/v1/manageCommonAlias
    // @return New create component Field Generic Alias
    manageCommonAlias: (newAddedList, deletedList, req, t) => {
        const { ComponentFieldsGenericaliasMst, ComponentAttributesSourceMapping } = req.app.locals.models;
        var userID = COMMON.getRequestUserID(req);
        var promises = [];
        if (newAddedList.length) {
            COMMON.setModelCreatedByFieldValue(req);

            promises.push(ComponentFieldsGenericaliasMst.bulkCreate(newAddedList, {
                fields: inputFields,
                transaction: t
            }));
        }
        if (deletedList.length) {
            const updatedData = {
                deletedAt: COMMON.getCurrentUTC(req),
                isDeleted: true,
                deletedBy: userID,
                deleteByRoleId: COMMON.getRequestUserLoginRoleID(req)
            };
            promises.push(ComponentFieldsGenericaliasMst.update(updatedData, {
                where: {
                    id: { [Op.in]: deletedList }
                },
                transaction: t,
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
            }));
            promises.push(ComponentAttributesSourceMapping.update(updatedData, {
                where: {
                    refAliasID: { [Op.in]: deletedList }
                },
                transaction: t,
                fields: ['deletedBy', 'deletedAt', 'isDeleted']
            }));
        }
        return Promise.all(promises).then(() => ({
            status: STATE.SUCCESS, err: null
        })).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, err: err };
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { status: STATE.FAILED, err: err };
        });
    }

};