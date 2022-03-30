const _ = require('lodash');
const { Op } = require('sequelize');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const resHandler = require('../../resHandler');

const moduleName = DATA_CONSTANT.RACK_MST.NAME;

const inputFields = [
    'id',
    'name',
    'isActive',
    'woTransID',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Retrieve list of rack
    // POST : /api/v1/rack/getRack
    // @return list of Rack
    getRack: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        return sequelize.query('CALL Sproc_RetrieveRack(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:popstatus)', {
            replacements: {
                ppageIndex: req.body.Page,
                precordPerPage: filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                popstatus: req.body.opStatus || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { rack: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    } else {
        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
    }
    },
    // generate new Rack
    // POST : /api/v1/rack/createRack
    // @return new created Rack
    createRack: (req, res) => {
        const { RackMst } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return RackMst.create(req.body, {
                fields: inputFields
            }).then(rack => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rack, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
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
    // Delete rack
    // POST : /api/v1/rack/deleteRack
    // @return API response
    deleteRack: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: COMMON.AllEntityIDS.Rack.Name,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: COMMON.getRequestUserID(req),
                    entityID: null,
                    refrenceIDs: null,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((rowsDeleted) => {
                if (rowsDeleted.length === 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: rowsDeleted, IDs: req.body.objIDs.id }, null);
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
    // update rack
    // PUT : /api/v1/rack/updateRack
    updateRack: (req, res) => {
        const { RackMst } = req.app.locals.models;
        if (req.params.id) {
            return RackMst.findOne({
                where: {
                    id: req.params.id
                }
            }).then((rackDetail) => {
                if (rackDetail) {
                    COMMON.setModelUpdatedByFieldValue(req);
                    req.body.woTransID = null;
                    return RackMst.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: inputFields
                    }).then(rack => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rack, MESSAGE_CONSTANT.UPDATED(moduleName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(moduleName), err: null, data: null });
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

    // check if rack name is already exist
    // POST: /api/v1/rack/checkNameAlreadyExist
    // @return API response
    checkNameAlreadyExist: (req, res) => {
        const { RackMst } = req.app.locals.models;
        if (req.body) {
            const whereClause = {
                name: req.body.objs.name
            };
            if (req.body.objs.id) {
                whereClause.id = {
                    [Op.notIn]: [req.body.objs.id]
                };
            }

            return RackMst.findAll({
                where: whereClause
            }).then((rackList) => {
                if (rackList.length > 0) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rackList, null);
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Generate multiple rack
    // POST : /api/v1/rack/generateMultipleRack
    // @return new created rack
    generateMultipleRack: (req, res) => {
        const {
            RackMst,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            let RackList = [];
            let RackName = [];

            if (!req.body.isDuplicate) {
                _.each(req.body.multipleRackList, (data) => {
                    if (data && data.name) {
                        const objData = {};

                        objData.name = data.name.toUpperCase();

                        objData.isActive = req.body.isActive;
                        objData.createdBy = req.user.id;
                        COMMON.setModelCreatedByFieldValue(objData);
                        RackName.push(objData.name);
                        RackList.push(objData);
                    }
                });
            } else {
                RackList = req.body.unique_Rack_List;
                RackName = _.map(RackList, item => item.name);
            }

            const promises = [];
            return sequelize.transaction().then((t) => {
                promises.push(
                    RackMst.findAll({
                        where: {
                            name: {
                                [Op.in]: RackName
                            }
                        },
                        model: RackMst,
                        attributes: ['id', 'name'],
                        paranoid: true,
                        transaction: t
                    })
                );

                Promise.all(promises).then((resp) => {
                    t.commit();
                    if (resp && resp.length > 0 && resp[0].length > 0) {
                        const DuplicateList = resp[0];
                        const UniqueList = [];
                        _.filter(RackList, (data) => {
                            const findRack = _.find(DuplicateList, item => item.name === data.name);
                            if (!findRack) {
                                UniqueList.push(data);
                            }
                        });
                        resp = [];
                        resp.push(DuplicateList);
                        resp.push(UniqueList);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
                    } else {
                        return RackMst.bulkCreate(RackList, {
                            fields: inputFields
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
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
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
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

    // Generate rack
    // POST : /api/v1/rack/generateRack
    // @return new created rack
    generateRack: (req, res) => {
        const {
            RackMst,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            let RackList = [];
            let RackName = [];
            if (!req.body.isDuplicate) {
                let i;
                const rackFrom = req.body.rackFrom ? parseInt(req.body.rackFrom) : 0;
                const rackTo = req.body.rackTo ? parseInt(req.body.rackTo) : 0;
                for (i = rackFrom; i <= rackTo; i++) {
                    const objData = {};

                    if (req.body.prefix) {
                        objData.name = COMMON.stringFormat('{0}{1}', req.body.prefix, i);
                    } else {
                        objData.name = COMMON.stringFormat('{0}{1}', i, req.body.suffix);
                    }

                    objData.isActive = req.body.isActive;
                    objData.createdBy = req.user.id;
                    COMMON.setModelCreatedByFieldValue(objData);
                    RackName.push(objData.name);
                    RackList.push(objData);
                }
            } else {
                RackList = req.body.unique_Rack_List;
                RackName = _.map(RackList, item => item.name);
            }

            const promises = [];
            return sequelize.transaction().then((t) => {
                promises.push(
                    RackMst.findAll({
                        where: {
                            name: {
                                [Op.in]: RackName
                            }
                        },
                        model: RackMst,
                        attributes: ['id', 'name'],
                        paranoid: true,
                        transaction: t
                    })
                );

                Promise.all(promises).then((resp) => {
                    t.commit();
                    if (resp && resp.length > 0 && resp[0].length > 0) {
                        const DuplicateList = resp[0];
                        const UniqueList = [];
                        _.filter(RackList, (data) => {
                            const findRack = _.find(DuplicateList, item => item.name === data.name);
                            if (!findRack) {
                                UniqueList.push(data);
                            }
                        });
                        resp = [];
                        resp.push(DuplicateList);
                        resp.push(UniqueList);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
                    } else {
                        return RackMst.bulkCreate(RackList, {
                            fields: inputFields
                        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(moduleName))).catch((err) => {
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
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
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
    }
};