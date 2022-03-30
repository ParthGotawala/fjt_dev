const _ = require('lodash');
const { Op } = require('sequelize');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
/* errors file*/

const inputFields = [
    'opDataElementID',
    'opID',
    'dataElementID',
    'displayOrder',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];


module.exports = {

    retrieveOperationDataElements: (req, res) => {
        const OperationDataelement = req.app.locals.models.OperationDataelement;
        if (req.params.id) {
            return OperationDataelement.findByPk(req.params.id)
                .then((operation) => {
                    if (!operation) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                        // new NotFound(OPERATION_DATAELEMENT.NOT_FOUND));
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operation, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    // /new NotFound(OPERATION_DATAELEMENT.NOT_FOUND));
                });
        } else {
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            return OperationDataelement.findAndCountAll(filter).then((operationDocRepo) => {
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { operation: operationDocRepo.rows, Count: operationDocRepo.count }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    createOperationDataElement: (req, res) => {
        const OperationDataelement = req.app.locals.models.OperationDataelement;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return OperationDataelement.create(req.body, {
                fields: inputFields
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_DATAELEMENT_CREATED)).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    updateOperationDataElement: (req, res) => {
        const OperationDataelement = req.app.locals.models.OperationDataelement;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            OperationDataelement.update(req.body, {
                where: {
                    opDataElementID: req.params.id
                },
                fields: inputFields
            })
                .then((rowsUpdated) => {
                    if (rowsUpdated[0] === 1) {
                        resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_DATAELEMENT_UPDATED);
                    } else {
                        resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.OPERATION_DATAELEMENT_NOT_UPDATED, err: null, data: null });
                    }
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
        }
    },

    deleteOperationDataElement: (req, res) => {
        const OperationDataelement = req.app.locals.models.OperationDataelement;
        if (req.params.id) {
            COMMON.setModelDeletedByFieldValue(req);
            return OperationDataelement.update(req.body, {
                where: {
                    opDataElementID: req.params.id,
                    deletedAt: null
                },
                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
            }).then((rowsDeleted) => {
                if (rowsDeleted === 1) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_DATAELEMENT_DELETED);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.OPERATION_DATAELEMENT_NOT_DELETED, err: null, data: null });
                }
            })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    createOperation_DataElementList: (req, res) => {
        const { sequelize, OperationDataelement } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then((t) => {
                const promises = [];
                _.each(req.body.listObj.dataElementList, (item) => {
                    /* update display_order of already exists */
                    if (item.opDataElementID) {
                        COMMON.setModelUpdatedByObjectFieldValue(req.user, item);
                        promises.push(OperationDataelement.update({ displayOrder: item.displayOrder }, {
                            where: {
                                opDataElementID: item.opDataElementID
                            },
                            fields: ['displayOrder'],
                            transaction: t
                        }).then(response => Promise.resolve(response)));
                    } else {
                        /* add new data elements in operation */
                        COMMON.setModelCreatedObjectFieldValue(req.user, item);
                        promises.push(OperationDataelement.create(item, {
                            fields: inputFields,
                            transaction: t
                        }).then(response => Promise.resolve(response)));
                    }
                });
                return Promise.all(promises).then(() => t.commit().then(() => {
                    if (req.body.listObj.isInnerSortingOfElement) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.DATAELEMENT_ORDER_UPDATED);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.DATAELEMENT_ADDED_TO_OPERATION);
                    }
                })).catch((err) => {
                    if (!t.fininshed) t.rollback();
                    console.trace();
                    console.error(err);
                    if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },


    deleteOperation_DataElementList: (req, res) => {
        var whereStatement = {};
        const { sequelize, OperationDataelement } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then((t) => {
                const notDeleteOpDataElementIDs = req.body.listObj.dataElementList.map(item => item.opDataElementID);
                COMMON.setModelDeletedByFieldValue(req);
                /* notDeleteOpDataElementIDs - delete other than this all ids and update displayOder of all these ids */
                if (notDeleteOpDataElementIDs.length > 0) {
                    whereStatement.opID = req.body.listObj.opID;
                    whereStatement.opDataElementID = { [Op.notIn]: notDeleteOpDataElementIDs };
                    whereStatement.deletedAt = null;
                } else {
                    /* no any notDeleteOpDataElementIDs means delete all element which is in operation */
                    whereStatement.opID = req.body.listObj.opID;
                    whereStatement.deletedAt = null;
                }

                // /* below soft delete is commented as we have put unique key in table. so hard-delete here */
                return OperationDataelement.update(req.body, {
                    where: whereStatement,
                    fields: inputFields
                }, { transaction: t }).then(() => {
                    const promises = [];
                    _.each(req.body.listObj.dataElementList, (item) => {
                        if (item.opDataElementID) {
                            promises.push(OperationDataelement.update({ displayOrder: item.displayOrder }, {
                                where: {
                                    opDataElementID: item.opDataElementID
                                },
                                fields: ['displayOrder']
                            }, { transaction: t }).then(response => Promise.resolve(response)));
                        }
                    });
                    // return Promise.all(promises);
                    return Promise.all(promises).then(() => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.DATAELEMENT_DELETED_FROM_OPERATION))).catch((err) => {
                        if (!t.fininshed) t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    retrieveOperationEntityDataElements: (req, res) => {
        const DataElement = req.app.locals.models.DataElement;
        const OperationDataelement = req.app.locals.models.OperationDataelement;
        if (req.body.operationObj) {
            return DataElement.findAll({
                where: {
                    entityID: req.body.operationObj.id
                },
                attributes: ['dataElementID', 'dataElementName', 'entityID', 'controlTypeID', 'parentDataElementID', 'dataelement_use_at'],
                include: [{
                    model: OperationDataelement,
                    as: 'operationDataelement',
                    attributes: ['opID', 'opDataElementID', 'dataElementID', 'displayOrder'],
                    where: {
                        opID: req.body.operationObj.opID
                    },
                    required: false
                }]
            }).then((getEntityData) => {
                if (!getEntityData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            // new NotFound(OPERATION_DATAELEMENT.NOT_FOUND));
        }
    },

    retrieveOperationDataElementList: (req, res) => {
        const { DataElement, OperationDataelement, DataElementKeyValues } = req.app.locals.models;
        DataElement.findAll({
            include: [{
                model: OperationDataelement,
                as: 'operationDataelement',
                where: {
                    opID: req.params.opID
                },
                required: true
            },
            {
                model: DataElementKeyValues,
                as: 'dataElementKeyValues'
            }]
        }).then(getOperationData =>
            resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getOperationData, null)
        ).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }

};
