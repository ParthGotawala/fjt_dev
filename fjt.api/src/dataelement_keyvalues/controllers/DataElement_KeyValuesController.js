const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');

const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const inputFields = [
    'dataElementID',
    'name',
    'value',
    'defaultValue',
    'displayOrder',
    'isActive',
    'isDeleted',
    'createdBy'
];


const dataElementModuleName = DATA_CONSTANT.DATAELEMENT_KEYVALUES.NAME;

module.exports = {
    // Get list of data element key value
    // GET : /api/v1/dataelement_keyvalues
    // @param {id} int
    // @return list of data element key value
    retriveDataElement_KeyValues: (req, res) => {
        const DataElementKeyValues = req.app.locals.models.DataElementKeyValues;
        if (req.params.id) {
            DataElementKeyValues.findByPk(req.params.id)
                .then((keyvalues) => {
                    if (!keyvalues) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.DATAELEMENT_KEYVALUES_NOT_FOUND, err: null, data: null });
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, keyvalues, null);
                })
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_GLOBAL, err: err, data: null });
                });
        } else {
            /* Call common ui grid filter function */
            const filter = COMMON.UiGridFilterSearch(req);

            DataElementKeyValues.findAndCountAll(filter).then(keyvalues => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { keyvalues: keyvalues.rows, Count: keyvalues.count }), null).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_GLOBAL, err: err, data: null });
            });
        }
    },

    // Create data element key value
    // POST : /api/v1/dataelement_keyvalues
    // @return new created data element key value
    createDataElement_KeyValues: (req, res) => {
        const DataElementKeyValues = req.app.locals.models.DataElementKeyValues;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return DataElementKeyValues.create(req.body, {
                fields: inputFields
            }).then((keyvalues) => {
                // skip disaply message while add default option with data element.
                if (req.body && !req.body.isAddNewDataElement) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, keyvalues
                    , MESSAGE_CONSTANT.CREATED(COMMON.stringFormat(dataElementModuleName, req.body.name, req.body.dataElementName)));
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, keyvalues, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_GLOBAL, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Update data element key value
    // PUT : /api/v1/dataelement_keyvalues
    // @param {id} int
    // @param {elementName} string
    // @return data element name
    updateDataElement_KeyValues: (req, res) => {
        const DataElementKeyValues = req.app.locals.models.DataElementKeyValues;
        if (req.body.keyValueID) {
            DataElementKeyValues.update(req.body, {
                where: {
                    keyValueID: req.body.keyValueID
                },
                fields: inputFields
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] === 1) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(COMMON.stringFormat(dataElementModuleName, req.body.name, req.params.elementName)));
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_UPDATED(COMMON.stringFormat(dataElementModuleName, req.body.name, req.params.elementName)), err: null, data: null });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_GLOBAL, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Delete data element key value
    // DELETE : /api/v1/dataelement_keyvalues
    // @param {id} int
    // @param {elementName} string
    // @return data element name
    deleteDataElement_KeyValues: (req, res) => {
        const { DataElementTransactionValues, DataElementTransactionValuesManual } = req.app.locals.models;
        // find keyValueid in dataelement_transactionvalues with data element id, if found then not allow to delete, show message already in use.
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
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.DELETE_NOT_ALLOW_FOR_MANUAL_DATA_SOURCE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataElementName);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                } else {
                    return module.exports.deleteKeyValue(req, res);
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
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.DELETE_NOT_ALLOW_FOR_MANUAL_DATA_SOURCE);
                    messageContent.message = COMMON.stringFormat(messageContent.message, req.body.dataElementName);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                } else {
                    return module.exports.deleteKeyValue(req, res);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return module.exports.deleteKeyValue(req, res);
        }
    },
    deleteKeyValue: (req, res) => {
        const DataElementKeyValues = req.app.locals.models.DataElementKeyValues;
        if (req.body.id) {
            // DataElement.upsert
            return DataElementKeyValues.update({ isDeleted: true, deletedAt: new Date() }, {
                where: {
                    keyValueID: req.body.id
                },
                fields: ['isDeleted', 'deletedAt']
            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(COMMON.stringFormat(dataElementModuleName, req.params.elementName)))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_GLOBAL, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
