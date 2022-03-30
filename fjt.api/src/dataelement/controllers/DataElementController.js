const _ = require('lodash');
const { Op } = require('sequelize');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { NotCreate } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'entityID',
    'dataElementName',
    'controlTypeID',
    'defaultValue',
    'displayOrder',
    'isRequired',
    'maxLength',
    'formatMask',
    'decimal_number',
    'rangeFrom',
    'rangeTo',
    'description',
    'isActive',
    'isDeleted',
    'fromDate',
    'toDate',
    'fileType',
    'fileSize',
    'parentDataElementID',
    'tooltip',
    'recurring_limit',
    'dateTimeType',
    'dataelement_use_at',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'isUnique',
    'isAutoIncrement',
    'isDatasource',
    'datasourceID',
    'datasourceDisplayColumnID',
    'isFixedEntity',
    'validationExpr',
    'validationExprSuccessMsg',
    'validationExprErrorMsg',
    'isManualData',
    'fieldWidth',
    'isHideLabel'
];

const inputFieldsForIdentity = [
    'remark',
    'maxValue',
    'type',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'deletedAt'
];

const dataElementModuleName = DATA_CONSTANT.DATAELEMENT.NAME;

module.exports = {
    // Get list of data element
    // GET : /api/v1/dataelements
    // @param {personId} int
    // @param {dataelement} int
    // @return list of data element
    retriveDataElements: (req, res) => {
        const DataElement = req.app.locals.models.DataElement;
        if (req.params.id) {
            DataElement.findByPk(req.params.id)
                .then((dataelement) => {
                    if (!dataelement) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                    }
                    _.each(dataelement, (item) => {
                        if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                            item.defaultValue = COMMON.getTextAngularValueFromDB(item.defaultValue);
                        }
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataelement, null);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            const filter = { limit: COMMON.PAGE_SIZE };
            if (req.query.page && req.query.pageSize) {
                filter.limit = parseInt(req.query.pageSize);
                const page = parseInt(req.query.page);
                if (page > 0) {
                    filter.offset = ((page - 1) * filter.limit);
                }
            }

            filter.order = [['displayOrder', 'ASC']];
            if (req.query.order && req.query.order.length > 0) {
                const orderList = JSON.parse(req.query.order);
                _.each(orderList, (order) => {
                    filter.order.push(order);
                });
            }
            if (req.query.search && req.query.search.length > 0) {
                const searcharray = JSON.parse(req.query.search);
                const whereclause = {};
                _.each(searcharray, (obj) => {
                    if (obj.ColumnDataType && obj.ColumnDataType === COMMON.GridFilterColumnDataType.Number) {
                        whereclause[obj.ColumnName] = obj.SearchString;
                    } else {
                        whereclause[obj.ColumnName] = { [Op.like]: `%${obj.SearchString}%` };
                    }
                });
                filter.where = whereclause;
            }
            DataElement.findAndCountAll(filter).then((dataelement) => {
                _.each(dataelement.rows, (item) => {
                    if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                        item.defaultValue = COMMON.getTextAngularValueFromDB(item.defaultValue);
                    }
                });
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dataelement: dataelement.rows, Count: dataelement.count }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }
    },

    // Update data element
    // PUT : /api/v1/dataelements
    // @param {personId} int
    // @param {dataelement} int
    // @return API response
    updateDataElement: (req, res) => {
        const DataElement = req.app.locals.models.DataElement;
        if (req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
            req.body.defaultValue = COMMON.setTextAngularValueForDB(req.body.defaultValue);
        }
        if (req.params.id) {
            if (req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                req.body.defaultValue = COMMON.setTextAngularValueForDB(req.body.defaultValue);
            }
            DataElement.update(req.body, {
                where: {
                    dataElementID: req.params.id
                },
                fields: inputFields
            })
                .then((rowsUpdated) => {
                    if (rowsUpdated[0] === 1) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(dataElementModuleName));
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(dataElementModuleName), err: null, data: null });
                    }
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        }
    },

    // Delete data element
    // DELETE : /api/v1/dataelements
    // @param {personId} int
    // @param {dataelement} int
    // @return API response
    deleteDataElement: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.DataElement.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: req.body.objIDs.entityID,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((dataElement) => {
                    const dataElementDetail = dataElement[0];
                    if (dataElementDetail && dataElementDetail.TotalCount === 0) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(req.body.objIDs.dataelement));
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataElementDetail, null);
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

    // Retrive data element by id
    // DELETE : /api/v1/retrieveEntityDataElements
    // @param {id} int
    // @return Data element detail
    retrieveEntityDataElements: (req, res) => {
        const { DataElement, EquipmentDataelement,
            WorkorderOperationDataelement, ComponentDataelement,
            WorkorderOperationDataelementRole, Identity } = req.app.locals.models;
        DataElement.findAll({
            attributes: ['dataElementID', 'entityID', 'dataElementName', 'controlTypeID', 'defaultValue', 'displayOrder', 'maxLength', 'isRequired',
                'formatMask', 'decimal_number', 'rangeFrom', 'rangeTo', 'description', 'fromDate', 'toDate',
                'fileType', 'fileSize', 'parentDataElementID', 'tooltip', 'recurring_limit', 'dateTimeType', 'dataelement_use_at',
                'createdBy', 'isUnique', 'isAutoIncrement', 'isDatasource', 'datasourceID', 'datasourceDisplayColumnID', 'isFixedEntity',
                'validationExpr', 'validationExprSuccessMsg', 'validationExprErrorMsg', 'isManualData', 'fieldWidth', 'isHideLabel'],
            where: {
                entityID: req.params.id
            },
            include: [
                {
                    model: EquipmentDataelement,
                    as: 'equipmentDataelement',
                    attributes: ['eqpID', 'dataElementID', 'displayOrder']
                },
                {
                    model: ComponentDataelement,
                    as: 'componentDataelement',
                    attributes: ['componentID', 'dataElementID', 'displayOrder']
                },
                {
                    model: WorkorderOperationDataelement,
                    as: 'workorderOperationDataelement',
                    attributes: ['woOPID', 'dataElementID', 'displayOrder'],
                    include: [{
                        model: WorkorderOperationDataelementRole,
                        as: 'workorder_Operation_DataElement_Id',
                        attributes: ['roleID']
                    }]
                }
            ]
        }).then((getEntityData) => {
            var promiseCustomEntity = [];
            if (!getEntityData || (Array.isArray(getEntityData) && getEntityData.length === 0)) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
            }
            if (getEntityData.length > 0) {
                // eslint-disable-next-line array-callback-return
                getEntityData.map((item) => {
                    if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                        item.defaultValue = COMMON.getTextAngularValueFromDB(item.defaultValue);
                    }
                });
            }

            const isContainFixedEntity = _.some(getEntityData, item => item.isFixedEntity && item.datasourceID);
            const isContainCustomEntity = _.some(getEntityData, item => item.datasourceDisplayColumnID && item.datasourceID);
            const isContainManualEntity = _.some(getEntityData, item => item.isManualData);
            if (isContainManualEntity) {
                /* retrieve Manual data of selected data element  */
                promiseCustomEntity.push(module.exports.updateDataElementInformationForManualData(req, res, getEntityData));
            }
            if (isContainCustomEntity) {
                /* retrieve and set custom entity master data to choice selection data element */
                promiseCustomEntity.push(module.exports.updateDataElementInformationForCustomEntity(req, res, getEntityData));
            }
            return Promise.all(promiseCustomEntity).then(() => {
                const autoIncrementDataElementIDs = _.map(_.filter(getEntityData, item => item.isAutoIncrement && item.controlTypeID === COMMON.INPUTFIELD_KEYS.Numberbox), 'dataElementID');
                /* [S] code to set identity value for auto increment number box data element if any available
                         to show in view-data-element directive (For Custom Forms) */
                if (autoIncrementDataElementIDs.length > 0) {
                    return Identity.findAll({
                        where: {
                            type: autoIncrementDataElementIDs
                        }
                    }).then((dataElementIdentityValueList) => {
                        if (dataElementIdentityValueList.length > 0) {
                            _.each(dataElementIdentityValueList, (item) => {
                                const dataElement = _.find(getEntityData, mainlistitem => mainlistitem.dataElementID.toString() === item.type);
                                if (dataElement) {
                                    dataElement.defaultValue = parseInt(item.maxValue) + 1;
                                }
                            });
                            if (isContainFixedEntity) {
                                /* retrieve and set fixed entity master data to choice selection data element */
                                return module.exports.updateDataElementInformationForFixedEntity(req, res, getEntityData);
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
                            }
                        } else if (isContainFixedEntity) {
                            /* retrieve and set fixed entity master data to choice selection data element */
                            return module.exports.updateDataElementInformationForFixedEntity(req, res, getEntityData);
                        } else {
                            _.each(getEntityData, (item) => {
                                if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                                    item.defaultValue = COMMON.getTextAngularValueFromDB(item.defaultValue);
                                }
                            });
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else if (isContainFixedEntity) {
                    /* retrieve and set fixed entity master data to choice selection data element */
                    return module.exports.updateDataElementInformationForFixedEntity(req, res, getEntityData);
                } else {
                    _.each(getEntityData, (item) => {
                        if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                            item.defaultValue = COMMON.getTextAngularValueFromDB(item.defaultValue);
                        }
                    });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
                }
                /* [E] code to set identity value for auto increment number box data element if any available */
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Update display order
    // PUT : /api/v1/updateDisplayOrder
    // @return API response
    updateDisplayOrder: (req, res) => {
        const { DataElement, sequelize } = req.app.locals.models;
        return sequelize.transaction((t) => {
            const promises = [];
            _.each(req.body, (order) => {
                promises.push(
                    DataElement.update({ displayOrder: order.displayOrder }, {
                        where: { dataElementID: order.dataElementID },
                        fields: ['displayOrder']
                    }, { transaction: t }).then(response => Promise.resolve(response)));
            });
            return Promise.all(promises);
        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Create New data element
    // POST : /api/v1/createNewDataElement
    // @return New added data element detail
    createNewDataElement: (req, res) => {
        const { DataElement, DataElementTransactionValuesManual, DataElementTransactionValues } = req.app.locals.models;
        if (req.body) {
            if (req.body.dataElementID > 0) {
                return DataElement.findOne({
                    where: {
                        dataElementID: req.body.dataElementID
                    },
                    attributes: ['dataelement_use_at']
                }).then((dataElementDBOldValues) => {
                    if (!dataElementDBOldValues) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(req.body.dataElementName), err: null, data: null });
                    }

                    req.body['dataElementOldValuesFromDB'] = dataElementDBOldValues;

                    // check for duplicate data element name or order
                    return DataElement.findOne({
                        where: {
                            entityID: req.body.entityID,
                            dataElementID: { [Op.ne]: req.body.dataElementID },
                            parentDataElementID: req.body.parentDataElementID || null,
                            [Op.or]: [
                                { displayOrder: req.body.displayOrder },
                                { dataElementName: req.body.dataElementName }
                            ]
                        },
                        attributes: ['dataElementName', 'displayOrder']
                    }).then((respOfDlWithSameNameOrder) => {
                        if (!respOfDlWithSameNameOrder) {
                            const validatePromise = [];
                            validatePromise.push(
                                DataElement.findOne({
                                    where: {
                                        dataElementID: req.body.dataElementID
                                    },
                                    attributes: ['dataelement_use_at']
                                }).then((DataElementdata) => {
                                    if (req.body.isSystemGeneratedEntity &&
                                        (DataElementdata.dataelement_use_at !== null && DataElementdata.dataelement_use_at !== req.body.dataelement_use_at)) {
                                        /* when dataelement_use_at value changes in case of record exists
                                            Case1: IF Entity/Operation->Both THEN Allow to change
                                            Case2: IF Entity->Operation or Operation->Entity THEN show error
                                            Case3: IF Both->Entity/Operation THEN don't allow */
                                        /* check for transaction data exists or not to update value or not*/
                                        return DataElementTransactionValues.count({
                                            where: {
                                                dataElementID: req.body.dataElementID,
                                                entityID: req.body.entityID,
                                                deletedAt: null
                                            }
                                        }).then((countTransactionData) => {
                                            /* if DataElementTransactionValues contain transcation data then not allowed to update */
                                            if (countTransactionData > 0 && req.body.dataelement_use_at !== 'Both') {
                                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.NOT_MOVE_BETWEEN_DATA_SOURCE_SELECTION);
                                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataElementName);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                                            } else {
                                                return Promise.resolve();
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                        });
                                    } else {
                                        return Promise.resolve();
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                }));

                            return Promise.all(validatePromise).then(() => {
                                /* condition of manual data option for multiple selection type  data element then only update manual data option */
                                if ((req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoice || req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Option
                                    || req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Combobox || req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoiceDropdown
                                    || req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch)
                                    && (!_.isUndefined(req.body.isDatasource) && !_.isNull(req.body.isDatasource))) {
                                    return DataElement.findOne({
                                        where: {
                                            dataElementID: req.body.dataElementID
                                        },
                                        attributes: ['isDatasource', 'isFixedEntity', 'datasourceID', 'dataelement_use_at', 'datasourceDisplayColumnID']
                                    }).then((DataElementdata) => {
                                        /* when db has flag isDatasource - true and from ui isDatasource made false then check transaction value to update or not */
                                        if ((DataElementdata.isDatasource !== req.body.isDatasource) || (DataElementdata.isFixedEntity !== req.body.isFixedEntity)
                                            || (DataElementdata.datasourceID !== null && DataElementdata.datasourceID !== req.body.datasourceID)
                                            || (DataElementdata.datasourceDisplayColumnID !== null && DataElementdata.datasourceDisplayColumnID !== req.body.datasourceDisplayColumnID)) {
                                            if (!req.body.isSystemGeneratedEntity) {
                                                return DataElementTransactionValuesManual.count({
                                                    where: {
                                                        dataElementID: req.body.dataElementID,
                                                        entityID: req.body.entityID,
                                                        deletedAt: null
                                                    }
                                                }).then((countTransactionData) => {
                                                    /* if DataElementTransactionValuesManual contain data for manual/data_source then not allowed to update */
                                                    if (countTransactionData > 0) {
                                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.NOT_MOVE_BETWEEN_DATA_SOURCE_SELECTION);
                                                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataElementName);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                                                    } else {
                                                        return module.exports.updateDataElementInformation(req, res);
                                                    }
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                });
                                            } else if (req.body.isSystemGeneratedEntity) {
                                                /* when db has flag isDatasource - false and from ui isDatasource made true then check transaction value to update or not*/
                                                return DataElementTransactionValues.count({
                                                    where: {
                                                        dataElementID: req.body.dataElementID,
                                                        entityID: req.body.entityID,
                                                        deletedAt: null
                                                    }
                                                }).then((countTransactionData) => {
                                                    /* if DataElementTransactionValues contain data for manual data then not allowed to update */
                                                    if (countTransactionData > 0) {
                                                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.NOT_MOVE_BETWEEN_DATA_SOURCE_SELECTION);
                                                        messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataElementName);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                                                    } else {
                                                        return module.exports.updateDataElementInformation(req, res);
                                                    }
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                                });
                                            } else {
                                                return module.exports.updateDataElementInformation(req, res);
                                            }
                                        } else {
                                            return module.exports.updateDataElementInformation(req, res);
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else if (!req.body.isSystemGeneratedEntity && req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Numberbox
                                    && (!_.isUndefined(req.body.isAutoIncrement) && !_.isNull(req.body.isAutoIncrement))) {
                                    return DataElement.findOne({
                                        where: {
                                            dataElementID: req.body.dataElementID
                                        },
                                        attributes: ['isAutoIncrement', 'decimal_number']
                                    }).then((DataElementdata) => {
                                        if ((DataElementdata.isAutoIncrement !== req.body.isAutoIncrement)
                                            || (!DataElementdata.decimal_number && !_.isUndefined(req.body.decimal_number) && !_.isNull(req.body.decimal_number) && req.body.decimal_number >= 0)) {
                                            return DataElementTransactionValuesManual.count({
                                                where: {
                                                    dataElementID: req.body.dataElementID,
                                                    entityID: req.body.entityID,
                                                    deletedAt: null
                                                }
                                            }).then((countTransactionData) => {
                                                /* if DataElementTransactionValuesManual contain data for manual/data_source then not allowed to update */
                                                if (countTransactionData > 0) {
                                                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.NOT_MOVE_BETWEEN_DATA_SOURCE_SELECTION);
                                                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataElementName);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                                                } else {
                                                    return module.exports.updateDataElementInformation(req, res);
                                                }
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                            });
                                        } else {
                                            return module.exports.updateDataElementInformation(req, res);
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                    });
                                } else {
                                    return module.exports.updateDataElementInformation(req, res);
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else if (req.body.dataElementName.toLowerCase() === respOfDlWithSameNameOrder.dataElementName.toLowerCase()) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                {
                                    messageContent: null, err: null, data: { isDuplicateFieldName: true }
                                });
                        } else if (req.body.displayOrder === respOfDlWithSameNameOrder.displayOrder) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                                {
                                    messageContent: null, err: null, data: { isDuplicateDisplayOrder: true }
                                });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                COMMON.setModelCreatedByFieldValue(req);
                if (req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                    req.body.defaultValue = COMMON.setTextAngularValueForDB(req.body.defaultValue);
                }

                return DataElement.count({
                    where: {
                        entityID: req.body.entityID,
                        parentDataElementID: req.body.parentDataElementID || null,
                        controlTypeID: req.body.controlTypeID
                    }
                }).then((totalElementCountOfSameType) => {
                    const requiredDet = {
                        currentAssignedNumber: totalElementCountOfSameType + 1,
                        dataElementOriginalName: req.body.dataElementName
                    };
                    req.body.dataElementName = COMMON.stringFormat(DATA_CONSTANT.DATAELEMENT.Name_Format, requiredDet.dataElementOriginalName, requiredDet.currentAssignedNumber);
                    const createDLPromise = [];
                    createDLPromise.push(module.exports.checkAndGetMaxNumberForElementName(req, res, requiredDet));
                    return Promise.all(createDLPromise).then((respOfCreateDLPromise) => {
                        if (respOfCreateDLPromise && respOfCreateDLPromise[0] && respOfCreateDLPromise[0].status === STATE.SUCCESS) {
                            return DataElement.create(req.body, {
                                fields: inputFields
                            }).then(dataelement => resHandler.successRes(res, 200, STATE.SUCCESS, dataelement, MESSAGE_CONSTANT.CREATED(req.body.dataElementName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(req.body.dataElementName)));
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // local method to check applied name exists or not. if exists get max number and set
    checkAndGetMaxNumberForElementName: (req, res, requiredDet) => {
        const { DataElement } = req.app.locals.models;

        return DataElement.findOne({
            where: {
                dataElementName: req.body.dataElementName,
                entityID: req.body.entityID,
                parentDataElementID: req.body.parentDataElementID || null
            }
        }).then((existsDataElement) => {
            if (existsDataElement) {
                requiredDet.currentAssignedNumber += 1;
                req.body.dataElementName = COMMON.stringFormat(DATA_CONSTANT.DATAELEMENT.Name_Format, requiredDet.dataElementOriginalName, requiredDet.currentAssignedNumber);
                return module.exports.checkAndGetMaxNumberForElementName(req, res, requiredDet);
            } else {
                return {
                    status: STATE.SUCCESS
                };
            }
        });
    },

    // Retrive data element by entityID
    // DELETE : /api/v1/getEntityDataElementsByEntityID
    // @param {entityID} int
    // @return Data element detail
    getEntityDataElementsByEntityID: (req, res) => {
        if (req.params.entityID) {
            const { DataElement } = req.app.locals.models;

            return DataElement.findAll({
                where: {
                    entityID: req.params.entityID
                }
            }).then((getEntityData) => {
                if (!getEntityData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(dataElementModuleName), err: null, data: null });
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    /* local function for update data_element information */
    updateDataElementInformation: (req, res) => {
        const { DataElement, Identity, sequelize } = req.app.locals.models;

        return sequelize.transaction((t) => {
            COMMON.setModelUpdatedByFieldValue(req);
            return DataElement.update(req.body, {
                where: { dataElementID: req.body.dataElementID },
                fields: inputFields,
                transaction: t
            }).then(() => {
                if (!req.body.isSystemGeneratedEntity && req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.Numberbox) {
                    return Identity.findOne({
                        where: {
                            type: req.body.dataElementID
                        },
                        transaction: t
                    }).then((dataelementIdentity) => {
                        /* if isAutoIncrement comes "false" from ui side , delete value from identity table (if exists) */
                        if (dataelementIdentity && !req.body.isAutoIncrement) {
                            const deleteIdentityObj = {};
                            deleteIdentityObj.deletedBy = req.user.id;
                            deleteIdentityObj.deletedAt = COMMON.getCurrentUTC();
                            deleteIdentityObj.isDeleted = true;

                            return Identity.update(deleteIdentityObj, {
                                where: { type: req.body.dataElementID.toString() },
                                fields: inputFieldsForIdentity,
                                transaction: t
                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.dataElementName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else if (!dataelementIdentity && req.body.isAutoIncrement) {
                            /* if isAutoIncrement comes "true" from ui side , create value to identity table (if not exists) */
                            const identityObj = {};
                            identityObj.type = req.body.dataElementID;
                            identityObj.maxValue = parseInt(req.body.rangeFrom || 0);
                            identityObj.createdBy = req.user.id;

                            return Identity.create(identityObj, {
                                fields: inputFieldsForIdentity,
                                transaction: t
                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.dataElementName))).catch((err) => {
                                console.trace();
                                console.error(err);
                                t.rollback();
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.dataElementName));
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else if (req.body.controlTypeID === COMMON.INPUTFIELD_KEYS.SubForm
                    && req.body.dataElementOldValuesFromDB.dataelement_use_at !== req.body.dataelement_use_at) {
                    /* if sub-form "show field at(dataelement_use_at)" changed then all child data element need to update for "dataelement_use_at"  */

                    const updateDataelementUseAt = {
                        dataelement_use_at: req.body.dataelement_use_at,
                        updatedAt: COMMON.getCurrentUTC(),
                        updatedBy: COMMON.getRequestUserID(req)
                    };

                    return DataElement.update(updateDataelementUseAt, {
                        where: {
                            parentDataElementID: req.body.dataElementID
                        },
                        fields: ['dataelement_use_at', 'updatedAt', 'updatedBy'],
                        transaction: t
                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.dataElementName))).catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(req.body.dataElementName));
                }
            }).catch((err) => {
                // t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        });
    },

    /* if req.body passed will work as API call from UI
        else function for update data_element information with Fixed Master data value
    */
    // POST : /api/v1/dataelements/getFixedEntityDataforCustomAutoCompleteForEntity
    // @return list of Fixed Master data value
    updateDataElementInformationForFixedEntity: (req, res, getEntityData) => {
        const { sequelize, FixedEntityDataelement } = req.app.locals.models;
        if (req.body && req.body.isFromUI) {
            getEntityData = [{
                controlTypeID: req.body.controlTypeID,
                isFixedEntity: true,
                datasourceID: req.body.datasourceID
            }];
        }
        const fixedEntityElements = _.filter(getEntityData, item => item.isFixedEntity && item.datasourceID);

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
                    if (_.isEmpty(req.body) && dataelementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch) {
                        // return column and columnID for autocomplete
                        dataelementitem.dataValues.dataElementKeyColumn = {
                            keyColumnId: fixedEntity.displayColumnPKField,
                            keyColumn: fixedEntity.displayColumnField
                        };
                        return Promise.resolve();
                    } else {
                        /* get all fixed entity master data */
                        let pwhereclause = ' deletedAt IS NULL ';
                        const pfields = `${fixedEntity.displayColumnPKField},${fixedEntity.displayColumnField}`;
                        if (req.body && req.body.woID) {
                            const isParameterizedFilterEntity = _.some(COMMON.FixedEntityTableNamesForParameterizedFilter, item => item === fixedEntity.tableName);
                            if (isParameterizedFilterEntity && fixedEntity.tableName === COMMON.FixedEntityTableNames.workorder_serialmst &&
                                fixedEntity.filter.includes('@pWoID')) {
                                pwhereclause += ` ${(fixedEntity.filter ? ` and ${fixedEntity.filter.replace('@pWoID', req.body.woID.toString())}` : '')}`;
                            } else {
                                pwhereclause += ` ${fixedEntity.filter ? ` and ${fixedEntity.filter}` : ''}`;/* where condition - filter data from table */
                            }
                        } else {
                            pwhereclause += ` ${fixedEntity.filter ? ` and ${fixedEntity.filter}` : ''}`;/* where condition - filter data from table */
                        }
                        /* set whereclause: 1. autocomplete with searchText 2. retrive all data*/
                        if (req.body && req.body.searchText) {
                            pwhereclause += ` and ${fixedEntity.displayColumnField}  LIKE "%${req.body.searchText}%" `;
                        } else if (req.body && req.body.searchID) {
                            pwhereclause += ` and ${fixedEntity.displayColumnPKField} = ${req.body.searchID} `;
                        }
                        return promises.push(sequelize.query('CALL Sproc_DynamicSQL (:pfields, :ptablename, :pwherecluse, :pgroupby, :porderby)',
                            {
                                replacements:
                                {
                                    pfields: pfields, ptablename: fixedEntity.tableName, pwherecluse: pwhereclause, pgroupby: '', porderby: null
                                }
                            })
                            .then((resp) => {
                                /* set master data to dataElementKeyValList array (custom array) */
                                if (req.body && req.body.isFromUI) {
                                    dataelementitem.dataElementKeyValList = (resp && resp.length > 0) ? resp : [];
                                } else {
                                    dataelementitem.dataValues.dataElementKeyValList = (resp && resp.length > 0) ? resp : [];
                                }
                                return Promise.resolve(resp);
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            })
                        );
                    }
                } else {
                    return Promise.resolve();
                }
            });
            return Promise.all(promises);
        }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, getEntityData, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    /* if req.body passed will work as API call from UI
        function for update data_element information with CustomEntity Master data value
    */
    // POST : /api/v1/dataelements/getCustomEntityDataforCustomAutoCompleteForEntity
    // @return list of CustomEntity data value
    updateDataElementInformationForCustomEntity: (req, res, getEntityData) => {
        const { DataElementTransactionValuesManual } = req.app.locals.models;
        if (req.body && req.body.isFromUI) {
            getEntityData = [{
                datasourceDisplayColumnID: req.body.datasourceDisplayColumnID,
                datasourceID: req.body.datasourceID
            }];
        }
        /* get all custom entity list */
        if (getEntityData || req.body) {
            const promises = [];
            _.each(getEntityData, (dataElementitem) => {
                if ((!_.isEmpty(req.body) || dataElementitem.controlTypeID !== COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch)
                    && dataElementitem.datasourceID && dataElementitem.datasourceDisplayColumnID) {
                    const whereClause = {
                        entityID: dataElementitem.datasourceID ? dataElementitem.datasourceID : null,
                        dataElementID: dataElementitem.datasourceDisplayColumnID ? dataElementitem.datasourceDisplayColumnID : null
                    };
                    // set user input string based condition
                    if (req.body && req.body.searchText) {
                        whereClause.value = { [Op.like]: `%${req.body.searchText}%` };
                    } else if (req.body && req.body.searchID) {
                        whereClause.dataElementTransManualID = req.body.searchID;
                    }
                    /* get all CustomEntity Data to be loaded for selection */
                    return promises.push(DataElementTransactionValuesManual.findAll({
                        model: DataElementTransactionValuesManual,
                        attributes: ['dataElementTransManualID', 'value'],
                        where: whereClause,
                        required: false
                    }).then((resp) => {
                        /* set master data to dataElementTransactionValuesManual array (custom array) */
                        if (req.body && req.body.isFromUI) {
                            dataElementitem.dataElementTransactionValuesManual = (resp && resp.length > 0) ? resp : [];
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataElementitem, null);
                        } else {
                            dataElementitem.dataValues.dataElementTransactionValuesManual = (resp && resp.length > 0) ? resp : [];
                        }
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
    /* if req.body passed will work as API call from UI
    function for update data_element information with Manual data value
    // POST : /api/v1/dataelements/updateDataElementInformationForManualData
    // @return list of Manual data */
    updateDataElementInformationForManualData: (req, res, getEntityData) => {
        const { DataElementKeyValues } = req.app.locals.models;
        if (req.body && req.body.isFromUI) {
            getEntityData = [{
                isManualData: req.body.isManualData,
                controlTypeID: req.body.controlTypeID,
                dataElementID: req.body.dataElementID
            }];
        }
        /* get all manual data list */
        if (getEntityData || req.body) {
            const promises = [];
            _.each(getEntityData, (dataElementitem) => {
                if ((req.query && req.query.isFromUI) && dataElementitem.isManualData && dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch) {
                    dataElementitem.dataValues.dataElementKeyColumn = {
                        keyColumn: 'name',
                        keyColumnId: 'keyValueID'
                    };
                    return Promise.resolve(dataElementitem);
                } else if (dataElementitem.isManualData && (dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoice
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.Option
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.Combobox
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.MultipleChoiceDropdown
                    || dataElementitem.controlTypeID === COMMON.INPUTFIELD_KEYS.CustomAutoCompleteSearch)) {
                    const whereClause = {
                        dataElementID: dataElementitem.dataElementID ? dataElementitem.dataElementID : null,
                        isDeleted: false
                    };

                    // set user input string based condition
                    if (req.body && req.body.searchText) {
                        whereClause.name = { [Op.like]: `%${req.body.searchText}%` };
                    } else if (req.body && req.body.searchID) {
                        whereClause.keyValueID = req.body.searchID;
                    }

                    /* get all manual Data to be loaded for selection */
                    return promises.push(DataElementKeyValues.findAll({
                        attributes: ['keyValueID', 'dataElementID', 'displayOrder', 'name', 'value', 'defaultValue'],
                        where: whereClause
                    }).then((resp) => {
                        /* set manual data to array (custom array) */
                        if (req.body && req.body.isFromUI) {
                            dataElementitem.dataElementKeyValues = (resp && resp.length > 0) ? resp : [];
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataElementitem, null);
                        } else {
                            dataElementitem.dataValues.dataElementKeyValues = (resp && resp.length > 0) ? resp : [];
                        }
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
    },
    // check for duplicate data element name or order
    // post:/api/v1/dataelements/checkDuplicateForDENameDisplayOrder
    // @retrun give duplicate if any element name or display order
    checkDuplicateForDENameDisplayOrder: (req, res) => {
        if (req.body.entityID && req.body.dataElementID && (req.body.displayOrder != null || req.body.dataElementName)) {
            const { DataElement } = req.app.locals.models;
            const whereClause = {
                entityID: req.body.entityID,
                dataElementID: { [Op.ne]: req.body.dataElementID },
                parentDataElementID: req.body.parentDataElementID || null
            };
            if (!_.isNaN(req.body.displayOrder) && !_.isUndefined(req.body.displayOrder) && req.body.displayOrder >= 0) {
                whereClause.displayOrder = req.body.displayOrder;
            } else if (req.body.dataElementName) {
                whereClause.dataElementName = req.body.dataElementName;
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
            }

            return DataElement.findOne({
                where: whereClause,
                attributes: ['dataElementName', 'displayOrder']
            }).then((respOfDlWithSameNameOrder) => {
                if (respOfDlWithSameNameOrder) {
                    if (req.body.dataElementName && req.body.dataElementName.toLowerCase() === respOfDlWithSameNameOrder.dataElementName.toLowerCase()) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                            {
                                messageContent: null, err: null, data: { isDuplicateFieldName: true }
                            });
                    } else if (req.body.displayOrder != null && req.body.displayOrder === respOfDlWithSameNameOrder.displayOrder) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED,
                            {
                                messageContent: null, err: null, data: { isDuplicateDisplayOrder: true }
                            });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                            STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Reset  FieldWidth
    // Post : /api/v1/dataelements/resetFieldWidth
    // @return API response
    resetFieldWidth: (req, res) => {
        const { DataElement } = req.app.locals.models;
        if (req.body && req.body.entityID) {
            COMMON.setModelUpdatedByFieldValue(req);
            return DataElement.update({ fieldWidth: null }, {
                where: { entityID: req.body.entityID },
                fields: ['fieldWidth', 'updatedBy', 'updateByRoleId', 'updatedAt']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED('Field width'))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};

