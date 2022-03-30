const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT } = require('../../../constant');

/* errors file*/
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');
const { Op } = require('sequelize');

const inputFields = [
    'compDataElementID',
    'componentID',
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
    retrieveComponentEntityDataElements: (req, res) => {
        const DataElement = req.app.locals.models.DataElement;
        const ComponentDataelement = req.app.locals.models.ComponentDataelement;
        if (req.body.componentObj) {
            return DataElement.findAll({
                where: {
                    entityID: req.body.componentObj.id
                },
                attributes: ['dataElementID', 'dataElementName', 'entityID', 'controlTypeID', 'parentDataElementID', 'dataelement_use_at', 'displayOrder'],
                include: [{
                    model: ComponentDataelement,
                    as: 'componentDataelement',
                    attributes: ['componentID', 'compDataElementID', 'dataElementID', 'displayOrder'],
                    where: {
                        componentID: req.body.componentObj.componentID
                    },
                    required: false
                }]
            }).then((getEntityData) => {
                if (!getEntityData) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.COMPONENT_DATAELEMENT.NOT_FOUND));
                }
                return resHandler.successRes(res, 200, STATE.SUCCESS, getEntityData);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.EMPTY,
                new NotFound(MESSAGE_CONSTANT.COMPONENT_DATAELEMENT.NOT_FOUND));
        }
    },

    /* Save-Update ComponentDataelement */
    createComponent_DataElementList: (req, res) => {
        const { ComponentDataelement, sequelize } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction((t) => {
                const promises = [];
                _.each(req.body.listObj.dataElementList, (item) => {
                    /* update display_order of already exists */
                    if (item.compDataElementID) {
                        promises.push(ComponentDataelement.update({ displayOrder: item.displayOrder }, {
                            where: {
                                compDataElementID: item.compDataElementID
                            },
                            fields: ['displayOrder']
                        }, { transaction: t }).then(response => Promise.resolve(response)));
                    } else {
                        /* add new data elements in equipment */
                        promises.push(ComponentDataelement.create({
                            componentID: item.componentID,
                            dataElementID: item.dataElementID,
                            displayOrder: item.displayOrder,
                            createdBy: req.user.id
                        }, { transaction: t }).then(response => Promise.resolve(response)));
                    }
                });
                return Promise.all(promises);
            }).then(() => {
                resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.COMPONENT_DATAELEMENT.CREATED });
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    /* delete-Update ComponentDataelement */
    deleteComponent_DataElementList: (req, res) => {
        const { sequelize, ComponentDataelement, DataElementTransactionValues } = req.app.locals.models;
        var whereStatement = {};
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction((t) => {
                // chain all your queries here. make sure you return them.
                const notDeleteCompDataElementIDs = req.body.listObj.dataElementList.map(item => item.compDataElementID);
                COMMON.setModelDeletedByFieldValue(req);
                whereStatement = {};
                /* notDeleteCompDataElementIDs - delete other than this all ids and update displayOder of all this ids */
                if (notDeleteCompDataElementIDs.length > 0) {
                    whereStatement.componentID = req.body.listObj.componentID;
                    whereStatement.compDataElementID = { [Op.notIn]: notDeleteCompDataElementIDs };
                } else {
                    /* no any notDeleteCompDataElementIDs means delete all element which is in equipment */
                    whereStatement.componentID = req.body.listObj.componentID;
                    whereStatement.deletedAt = null;
                }

                return ComponentDataelement.update(req.body, {
                    where: whereStatement,
                    fields: inputFields
                }, { transaction: t }).then(() =>
                    /* find all element which contain value */
                    DataElementTransactionValues.findAll({
                        attributes: ['dataElementID'],
                        where: {
                            entityID: req.body.listObj.entityID,
                            refTransID: req.body.listObj.componentID
                        }
                    }).then((existIds) => {
                        /* remove all element which not included in ComponentDataelement */
                        const existsDataElementIDs = existIds.map(itemDataElementID => itemDataElementID.dataElementID);
                        const existsDataElementIdsDelete = _.difference(existsDataElementIDs, req.body.listObj.dataElementIDs);
                        return DataElementTransactionValues.update(req.body, {
                            where: {
                                entityID: req.body.listObj.entityID,
                                refTransID: req.body.listObj.componentID,
                                dataElementID: { [Op.in]: existsDataElementIdsDelete }
                            },
                            fields: dataElementTransactionValuesInputFields
                        }, { transaction: t }).then(() => {
                            const promises = [];
                            _.each(req.body.listObj.dataElementList, (item) => {
                                if (item.compDataElementID) {
                                    promises.push(ComponentDataelement.update({ displayOrder: item.displayOrder }, {
                                        where: {
                                            compDataElementID: item.compDataElementID
                                        },
                                        fields: ['displayOrder']
                                    }, { transaction: t }).then(response => Promise.resolve(response)));
                                }
                            });
                            return Promise.all(promises);
                        });
                    }));
            }).then(() => {
                resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.COMPONENT_DATAELEMENT.DELETED });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.COMPONENT_DATAELEMENT.NOT_DELETED));
            });
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }


};
