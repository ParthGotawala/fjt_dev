const _ = require('lodash');
const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');

const timelineObjForWoOpDataElement = DATA_CONSTANT.TIMLINE.EVENTS.WORKORDER.WORKORDER_OPERATION_DATAELEMENT;
const WoOpDataElementConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_OPERATION_DATAELEMENT;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const inputFields = [
    'woOpDataElementID',
    'woID',
    'opID',
    'dataElementID',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt',
    'isDeleted',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

const woOpDataElementModuleName = DATA_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.NAME;

module.exports = {
    // Delete workorder operation dataElements
    // POST : /api/v1/workorder_operation_dataelement/deleteWorkorderOperationDataElements
    // @return API response
    deleteWorkorderOperationDataElements: (req, res) => {
        const { sequelize, WorkorderOperationDataelement, DataElementTransactionValues } = req.app.locals.models;
        if (req.body && req.body.listObj && req.body.listObj.dataElementList) {
            return sequelize.transaction().then(t => WorkorderOperationDataelement.findAll({
                where: {
                    woOPID: req.body.listObj.woOPID
                },
                attributes: ['dataElementID'],
                transaction: t
            }).then((respOfWOOPDataElementList) => {
                let removeWOOPDataElementIDs = [];
                if (respOfWOOPDataElementList && respOfWOOPDataElementList.length > 0) {
                    removeWOOPDataElementIDs = _.difference(_.map(respOfWOOPDataElementList, 'dataElementID'), _.map(req.body.listObj.dataElementList, 'dataElementID'));
                }

                const notDeleteWoOpDataElementIDs = req.body.listObj.dataElementList.map(item => item.woOpDataElementID);

                const whereStatement = {};
                /* notDeleteWoOpDataElementIDs - delete other than this all ids and update displayOder of all these ids */
                if (notDeleteWoOpDataElementIDs.length > 0) {
                    whereStatement.woID = req.body.listObj.woID;
                    whereStatement.opID = req.body.listObj.opID;
                    whereStatement.woOpDataElementID = { [Op.notIn]: notDeleteWoOpDataElementIDs };
                    whereStatement.deletedAt = null;
                } else {
                    /* no any notDeleteWoOpDataElementIDs means delete all element which is in workorderoperation */
                    whereStatement.woID = req.body.listObj.woID;
                    whereStatement.opID = req.body.listObj.opID;
                    whereStatement.deletedAt = null;
                }

                COMMON.setModelDeletedByFieldValue(req);

                // return WorkorderOperationDataelement.destroy({
                //    where: whereStatement,
                //    force:true
                // }, {transaction: t}).then((deleteData) => {
                return WorkorderOperationDataelement.update(req.body, {
                    where: whereStatement,
                    fields: inputFields,
                    transaction: t
                }).then(() => {
                    const promises = [];
                    _.each(req.body.listObj.dataElementList, (item) => {
                        if (item.woOpDataElementID) {
                            promises.push(WorkorderOperationDataelement.update({ displayOrder: item.displayOrder }, {
                                where: {
                                    woOpDataElementID: item.woOpDataElementID
                                },
                                fields: ['displayOrder'],
                                transaction: t
                            })
                            );
                        }
                    });

                    if (removeWOOPDataElementIDs && removeWOOPDataElementIDs.length > 0 && req.body.listObj.entityID && req.body.listObj.woOPID) {
                        const removeDataElementValues = {};
                        COMMON.setModelDeletedByObjectFieldValue(req.user, removeDataElementValues);
                        promises.push(
                            DataElementTransactionValues.update(removeDataElementValues, {
                                where: {
                                    dataElementID: { [Op.in]: removeWOOPDataElementIDs },
                                    refTransID: req.body.listObj.woOPID,
                                    entityID: req.body.listObj.entityID
                                },
                                transaction: t
                            }));
                    }

                    // return Promise.all(promises);
                    return Promise.all(promises).then(() => t.commit().then(() => {
                        // [S] add log of delete data element from wo op for timeline users
                        const objEvent = {
                            userID: req.user.id,
                            eventTitle: WoOpDataElementConstObj.DELETE.title,
                            eventDescription: COMMON.stringFormat(WoOpDataElementConstObj.DELETE.description, req.body.listObj.opName, req.body.listObj.woNumber, req.user.username),
                            refTransTable: WoOpDataElementConstObj.refTransTableName,
                            refTransID: null,
                            eventType: timelineObjForWoOpDataElement.id,
                            url: COMMON.stringFormat(WoOpDataElementConstObj.DELETE.url, req.body.listObj.woOPID),
                            eventAction: timelineEventActionConstObj.DELETE
                        };
                        req.objEvent = objEvent;
                        TimelineController.createTimeline(req);
                        // [E] add log of delete data element from wo op for timeline users
                        return resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.DATAELEMENT_DELETED_FROM_WORKORDER_OPERATION });
                    })).catch((err) => {
                        if (!t.finished) t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.DATAELEMENT_NOT_DELETED_FROM_WORKORDER_OPERATION));
                    });
                }).catch((err) => {
                    if (!t.finished) t.rollback();
                    console.trace();
                    console.error(err);
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.WORKORDER_OPERATION_DATAELEMENT.DATAELEMENT_NOT_DELETED_FROM_WORKORDER_OPERATION));
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }));
        } else {
            return resHandler.errorRes(res,
                200,
                STATE.FAILED,
                new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrieve list of workorder operation data element
    // GET : /api/v1/workorder_operation_dataelement/retrieveWorkorderOperationDataElementList
    // @return list of workorder operation data element
    retrieveWorkorderOperationDataElementList: (req, res) => {
        const { DataElement, WorkorderOperationDataelement, WorkorderOperationDataelementRole } = req.app.locals.models;
        return DataElement.findAll({
            include: [{
                model: WorkorderOperationDataelement,
                as: 'workorderOperationDataelement',
                where: {
                    woOPID: req.params.woOPID
                },
                include: [{
                    model: WorkorderOperationDataelementRole,
                    as: 'workorder_Operation_DataElement_Id'
                }]
            }
            ]
        }).then((getWorkorderOperationData) => {
            var promiseCustomEntity = [];
            if (!getWorkorderOperationData) {
                return resHandler.successRes(res, 200, STATE.SUCCESS, getWorkorderOperationData);
            }

            const isContainFixedEntity = _.some(getWorkorderOperationData, item => item.isFixedEntity && item.datasourceID);
            const isContainCustomEntity = _.some(getWorkorderOperationData, item => item.datasourceDisplayColumnID && item.datasourceID);
            const isContainManualEntity = _.some(getWorkorderOperationData, item => item.isManualData);
            if (isContainManualEntity) {
                /* retrieve Manual data of selected data element  */
                promiseCustomEntity.push(module.exports.updateElementInfoForManualDataWoOp(req, res, getWorkorderOperationData));
            }
            if (isContainCustomEntity) {
                /* retrieve and set custom entity master data to choice selection data element */
                promiseCustomEntity.push(module.exports.updateElementInfoForCustomEntityWoOp(req, res, getWorkorderOperationData));
            }
            return Promise.all(promiseCustomEntity).then(() => {
                if (isContainFixedEntity) {
                    /* retrieve and set fixed entity master data to choice selection data element */
                    return module.exports.updateElementInfoForFixedEntityWoOp(req, res, getWorkorderOperationData);
                } else {
                    return resHandler.successRes(res, 200, STATE.SUCCESS, getWorkorderOperationData);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, err);
        });
    },

    /* local function for update data_element information with Fixed Master data value */
    updateElementInfoForFixedEntityWoOp: (req, res, getWorkorderOperationData) => {
        const { sequelize, FixedEntityDataelement } = req.app.locals.models;

        const fixedEntityElements = _.filter(getWorkorderOperationData, item => item.isFixedEntity && item.datasourceID);

        /* get all fixed entity details */
        FixedEntityDataelement.findAll({
            where: {
                id: { [Op.in]: _.map(fixedEntityElements, 'datasourceID') }
            },
            attributes: ['id', 'tableName', 'displayColumnPKField', 'displayColumnField', 'filter']
        }).then((fixedentitylist) => {
            const promises = [];
            _.each(fixedEntityElements, (dataelementitem) => {
                const fixedEntity = _.find(fixedentitylist, fixedentityitem => fixedentityitem.id === dataelementitem.datasourceID);

                if (fixedEntity) {
                    if (dataelementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch) {
                        // return column and columnID for autocomplete
                        dataelementitem.dataValues.dataElementKeyColumn = {
                            keyColumnId: fixedEntity.displayColumnPKField,
                            keyColumn: fixedEntity.displayColumnField
                        };
                        Promise.resolve();
                    } else {
                        const pfields = `${fixedEntity.displayColumnPKField},${fixedEntity.displayColumnField}`;

                        /* FixedEntityTableNamesForParameterizedFilter --> means @-pWoID like parameters used in filter column of "fixed_entity_dataelement" table */
                        const isParameterizedFilterEntity = _.some(COMMON.FixedEntityTableNamesForParameterizedFilter, item => item === fixedEntity.tableName);

                        let pwhereclause = ' deletedAt IS NULL ';
                        if (isParameterizedFilterEntity) {
                            if (fixedEntity.tableName === COMMON.FixedEntityTableNames.workorder_serialmst) {
                                if (fixedEntity.filter.includes('@pWoID')) {
                                    pwhereclause += (fixedEntity.filter ? ` and ${fixedEntity.filter.replace('@pWoID', req.params.woID)}` : '');
                                }
                            }
                        } else {
                            pwhereclause += (fixedEntity.filter ? ` and ${fixedEntity.filter}` : '');/* where condition - filter data from table */
                        }

                        /* get all fixed entity master data */
                        promises.push(sequelize.query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)',
                            {
                                replacements:
                                {
                                    pfields: pfields, ptablename: fixedEntity.tableName, pwherecluse: pwhereclause, pgroupby: '', porderby: null
                                }
                            })
                            .then((resp) => {
                                /* set master data to dataElementKeyValList array (custom array) */
                                dataelementitem.dataValues.dataElementKeyValList = (resp && resp.length > 0) ? resp : [];
                                return Promise.resolve(resp);
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                                } else {
                                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOpDataElementModuleName)));
                                }
                            })
                        );
                    }
                }
            });
            return Promise.all(promises);
        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, getWorkorderOperationData))
            .catch((err) => {
                console.trace();
                console.error(err);
                if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                } else {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woOpDataElementModuleName)));
                }
            });
    },
    // local function for update data_element information with CustomEntity Master data value
    updateElementInfoForCustomEntityWoOp: (req, res, getWorkorderOperationData) => {
        const { DataElementTransactionValuesManual } = req.app.locals.models;
        /* get all custom entity list */
        if (getWorkorderOperationData) {
            const promises = [];
            _.each(getWorkorderOperationData, (dataElementitem) => {
                if ((dataElementitem.controlTypeID !== COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch)
                    && dataElementitem.datasourceID && dataElementitem.datasourceDisplayColumnID) {
                    const whereClause = {
                        entityID: dataElementitem.datasourceID ? dataElementitem.datasourceID : null,
                        dataElementID: dataElementitem.datasourceDisplayColumnID ? dataElementitem.datasourceDisplayColumnID : null
                    };
                    /* get all CustomEntity Data to be loaded for selection */
                    return promises.push(DataElementTransactionValuesManual.findAll({
                        model: DataElementTransactionValuesManual,
                        attributes: ['dataElementTransManualID', 'value'],
                        where: whereClause,
                        required: false
                    }).then((resp) => {
                        /* set master data to dataElementTransactionValuesManual array (custom array) */
                        dataElementitem.dataValues.dataElementTransactionValuesManual = (resp && resp.length > 0) ? resp : [];
                        return Promise.resolve(dataElementitem);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                } else if (dataElementitem.isDatasource && dataElementitem.datasourceID) {
                    dataElementitem.dataValues.dataElementKeyColumn = {
                        keyColumn: 'dataElementTransManualID',
                        keyColumnId: 'value'
                    };
                    return Promise.resolve(dataElementitem);
                } else {
                    return Promise.resolve(dataElementitem);
                }
            });
            return Promise.all(promises);
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // local function for update data_element information with Manual Data
    updateElementInfoForManualDataWoOp: (req, res, getWorkorderOperationData) => {
        const { DataElementKeyValues } = req.app.locals.models;
        /* get all manual data list */
        if (getWorkorderOperationData) {
            const promises = [];
            _.each(getWorkorderOperationData, (dataElementitem) => {
                if (dataElementitem.isManualData && dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch) {
                    dataElementitem.dataValues.dataElementKeyColumn = {
                        keyColumn: 'name',
                        keyColumnId: 'keyValueID'
                    };
                    return Promise.resolve(dataElementitem);
                } else if (dataElementitem.isManualData && (dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoice
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.Option
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.Combobox
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoiceDropdown)) {
                    const whereClause = {
                        dataElementID: dataElementitem.dataElementID ? dataElementitem.dataElementID : null,
                        isDeleted: false
                    };

                    /* get all manual Data to be loaded for selection */
                    return promises.push(DataElementKeyValues.findAll({
                        attributes: ['keyValueID', 'dataElementID', 'displayOrder', 'name', 'value', 'defaultValue'],
                        where: whereClause
                    }).then((resp) => {
                        /* set manual data to array (custom array) */
                        dataElementitem.dataValues.dataElementKeyValues = (resp && resp.length > 0) ? resp : [];
                        return Promise.resolve(dataElementitem);
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    }));
                } else {
                    return Promise.resolve(dataElementitem);
                }
            });
            return Promise.all(promises);
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
