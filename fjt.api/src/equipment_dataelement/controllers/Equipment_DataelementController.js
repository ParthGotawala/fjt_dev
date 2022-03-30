const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'eqpDataElementID',
    'eqpID',
    'dataElementID',
    'displayOrder',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt'
];
const dataElementTransactionValuesInputFields = [
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt'
];

module.exports = {
    /* get EquipmentEntity DataElements */
    retrieveEquipmentEntityDataElements: (req, res) => {
        const DataElement = req.app.locals.models.DataElement;
        const EquipmentDataelement = req.app.locals.models.EquipmentDataelement;
        if (req.body && req.body.equipmentObj) {
            return DataElement.findAll({
                where: {
                    entityID: req.body.equipmentObj.id
                },
                attributes: ['dataElementID', 'dataElementName', 'entityID', 'controlTypeID', 'parentDataElementID', 'dataelement_use_at'],
                include: [{
                    model: EquipmentDataelement,
                    as: 'equipmentDataelement',
                    attributes: ['eqpID', 'eqpDataElementID', 'dataElementID', 'displayOrder'],
                    where: {
                        eqpID: req.body.equipmentObj.eqpID
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
        }
    },

    /* Save-Update equipment_dataelement */
    createEquipment_DataElementList: (req, res) => {
        const { EquipmentDataelement, sequelize } = req.app.locals.models;
        const promises = [];
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then((t) => {
                _.each(req.body.listObj.dataElementList, (item) => {
                    /* update display_order of already exists */
                    if (item.eqpDataElementID) {
                        promises.push(EquipmentDataelement.update({ displayOrder: item.displayOrder }, {
                            where: {
                                eqpDataElementID: item.eqpDataElementID
                            },
                            fields: ['displayOrder'],
                            transaction: t
                        }).then(response => Promise.resolve(response)));
                    } else {
                        /* add new data elements in equipment */
                        promises.push(EquipmentDataelement.create({
                            eqpID: item.eqpID,
                            dataElementID: item.dataElementID,
                            displayOrder: item.displayOrder,
                            createdBy: req.user.id
                        }, { transaction: t }).then(response => Promise.resolve(response)));
                    }
                });

                return Promise.all(promises).then(() => t.commit().then(() => {
                    if (req.body.listObj.isInnerSortingOfElement) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.DATAELEMENT_ORDER_UPDATED);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_DATAELEMENT_CREATED);
                    }
                })).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                // if(!t.finished) t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* delete-Update equipment_dataelement */
    deleteEquipment_DataElementList: (req, res) => {
        const { sequelize, EquipmentDataelement, DataElementTransactionValues } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then((t) => {
                // chain all your queries here. make sure you return them.
                const notDeleteEqpDataElementIDs = req.body.listObj.dataElementList.map(item => item.eqpDataElementID);
                COMMON.setModelDeletedByFieldValue(req);
                const whereStatement = {};
                /* notDeleteEqpDataElementIDs - delete other than this all ids and update displayOder of all this ids */
                if (notDeleteEqpDataElementIDs.length > 0) {
                    whereStatement.eqpID = req.body.listObj.eqpID;
                    whereStatement.eqpDataElementID = { [Op.notIn]: notDeleteEqpDataElementIDs };
                    whereStatement.deletedAt = null;
                } else {
                    /* no any notDeleteEqpDataElementIDs means delete all element which is in equipment */
                    whereStatement.eqpID = req.body.listObj.eqpID;
                    whereStatement.deletedAt = null;
                }

                return EquipmentDataelement.update(req.body, {
                    where: whereStatement,
                    fields: inputFields,
                    transaction: t
                }).then(() =>
                    /* find all element which contain value */
                     DataElementTransactionValues.findAll({
                        attributes: ['dataElementID'],
                        where: {
                            entityID: req.body.listObj.entityID,
                            refTransID: req.body.listObj.eqpID
                        }
                    }).then((existIds) => {
                        /* remove all element which not included in EquipmentDataelement */
                        const existsDataElementIDs = existIds.map(itemDataElementID => itemDataElementID.dataElementID);
                        const existsDataElementIdsDelete = _.difference(existsDataElementIDs, req.body.listObj.dataElementIDs);
                        return DataElementTransactionValues.update(req.body, {
                            where: {
                                entityID: req.body.listObj.entityID,
                                refTransID: req.body.listObj.eqpID,
                                dataElementID: { [Op.in]: existsDataElementIdsDelete }
                            },
                            fields: dataElementTransactionValuesInputFields,
                            transaction: t
                        }).then(() => {
                            const promises = [];
                            _.each(req.body.listObj.dataElementList, (item) => {
                                if (item.eqpDataElementID) {
                                    promises.push(EquipmentDataelement.update({ displayOrder: item.displayOrder }, {
                                        where: {
                                            eqpDataElementID: item.eqpDataElementID
                                        },
                                        fields: ['displayOrder'],
                                        transaction: t
                                    }).then(response => Promise.resolve(response)));
                                }
                            });
                            // return Promise.all(promises);
                            return Promise.all(promises).then(() => t.commit()
                                .then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.EQUIPMENT_DATAELEMENT_DELETED))
                            ).catch((err) => {
                                if (!t.finished) t.rollback();
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        });
                    }));
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
