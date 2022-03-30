const fs = require('fs');
const fsextra = require('fs-extra');
const _ = require('lodash');
const { Op } = require('sequelize');
const uuidv1 = require('uuid/v1');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const dlTranValuesConstObj = DATA_CONSTANT.TIMLINE.DATAELEMENT_TRANSACTIONVALUES;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const dataEleTransValModuleName = DATA_CONSTANT.DATAELEMENT_TRANSACTIONVALUES.NAME;
const dataEleTransValUpdatedModuleName = DATA_CONSTANT.DATAELEMENT_TRANSACTIONVALUES.DYNAMIC_NAME;

const inputFields = [
    'dataElementTransID',
    'dataElementID',
    'value',
    'refTransID',
    'entityID',
    'isDeleted',
    'refSubFormTransID',
    'deletedAt',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'deletedBy'
];

const subFormInputFields = [
    'parentDataElementID',
    'rowNumber',
    'isDeleted',
    'deletedAt',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'deletedBy'
];

module.exports = {
    // Retrive list of data element transaction values by reftransId and entityId
    // GET : /api/v1/dataelement_transactionvalues
    // @param {refTransID} int
    // @param {entityID} string
    // @return list of data element trasaction values list
    retriveDataElement_TransactionValues: (req, res) => {
        const { DataElementTransactionValues, DataElement } = req.app.locals.models;
        DataElementTransactionValues.findAll({
            where: {
                refTransID: req.params.refTransID,
                entityID: req.params.entityID
            },
            include: [{
                model: DataElement,
                as: 'dataElement',
                required: false,
                attributes: ['controlTypeID']
            }]
        }).then((dataelementValues) => {
            _.each(dataelementValues, (item) => {
                if (item.dataElement.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                    item.value = COMMON.getTextAngularValueFromDB(item.value);
                }
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataelementValues, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    retriveDataElement_TransactionValuesEntityIDWise: (req, res) => {
        const { DataElementTransactionValues, DataElement } = req.app.locals.models;
        DataElementTransactionValues.findAll({
            where: {
                entityID: req.params.entityID
            },
            include: [{
                model: DataElement,
                as: 'dataElement',
                required: false,
                attributes: ['controlTypeID']
            }]
        }).then((dataelementValues) => {
            _.each(dataelementValues.dataElement, (item) => {
                if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                    item.value = COMMON.getTextAngularValueFromDB(item.value);
                }
            });

            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataelementValues, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },


    // Create data element transaction values
    // POST : /api/v1/dataelement_transactionvalues
    // @return API response
    createDataElement_TransactionValues: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const dir = `${DATA_CONSTANT.ENTITY.SYSTEM_ENTITY_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        if (typeof (req.files) === 'object' && typeof (req.files.file) === 'object') {
            const filePromises = [];
            Object.keys(req.files.file).forEach((modelField) => {
                var file = req.files.file[modelField];// req.files.profile;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                var fileName = `${uuidv1()}.${ext}`;
                var path = dir + fileName;
                req.files.file[modelField].fileName = fileName;
                filePromises.push(fsextra.move(file.path, path)
                    .then(() => {
                    }).catch(() => STATE.FAILED));
            });
            return Promise.all(filePromises).then(() => {
                module.exports.uploadFileDataElementDetail(req, res);
            });
        } else {
            return module.exports.uploadFileDataElementDetail(req, res);
        }
    },

    uploadFileDataElementDetail: (req, res) => {
        const { sequelize, DataElementTransactionValues, SubFormTransaction } = req.app.locals.models;
        const dir = `${DATA_CONSTANT.ENTITY.SYSTEM_ENTITY_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        if (req.body) {
            const dataElementTransIDsForTimeLineLog = [];
            // let userName = req.user.firstName + ' ' + req.user.lastName;

            let dataElementList = JSON.parse(req.body.dataElementList);
            if (dataElementList && dataElementList.length > 0) {
                dataElementList.forEach(() => {
                    dataElementList = _.reject(dataElementList, item => item.value === '' || item.value === null);
                });
            }

            COMMON.setModelCreatedArrayFieldValue(req.user, dataElementList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, dataElementList);

            _.each(dataElementList, (obj) => {
                // if(req.files.length > 0 && obj.controlTypeID == COMMON.INPUTFIELD_KEYS.FileUpload){  // Multer Module Code
                if (typeof (req.files) === 'object' && typeof (req.files.file) === 'object' && obj.controlTypeID === COMMON.INPUTFIELD_KEYS.FileUpload) {
                    let objFile = null;
                    if (obj.parentDataElementID) {  /* subform_record */
                        objFile = _.find(req.files.file, item => item.fieldName === `file[${obj.dataElementID}_RowNumber_${obj.rowNumber}]`);
                    } else { /* form_record */
                        objFile = _.find(req.files.file, item => item.fieldName === `file[${obj.dataElementID}]`);
                    }

                    if (objFile) {
                        // obj.value = `${objFile.destination}${objFile.filename}|${objFile.mimetype}|${objFile.originalname}|${objFile.filename}`;
                        obj.value = `${dir}${objFile.fileName}|${objFile.type}|${objFile.originalFilename}|${objFile.fileName}`;
                    }
                }
                // eslint-disable-next-line no-useless-escape
                obj.refTransID = parseInt(req.body.referenceTransID.replace(/\"/g, ''));
                obj.entityID = parseInt(req.body.entityID);
            });
            const subFormTransList = JSON.parse(req.body.subFormTransList);

            COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, subFormTransList);

            // get update list for subform transaction
            const subFormTransUpdatelist = _.remove(subFormTransList, obj => (obj.dataElementTransID));

            return sequelize.transaction((t) => {
                if (subFormTransList && subFormTransList.length > 0) {
                    COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
                }

                // create sub-form transaction
                return SubFormTransaction.bulkCreate(subFormTransList, {
                    updateOnDuplicate: subFormInputFields,
                    individualHooks: true,
                    transaction: t
                }).then((subFormElementList) => {
                    /* if added sub-form new data including multiple rows of sub-form that time need to set
                             newly added "refSubFormTransID" to data-element for save in transaction table   */
                    if (subFormElementList && subFormElementList.length > 0) {
                        _.each(dataElementList, (subData) => {
                            var objDatItem = _.find(subFormElementList, dataItem => dataItem.rowNumber === subData.rowNumber
                                && dataItem.parentDataElementID === subData.parentDataElementID);
                            // if(_.isNumber(objDatItem.rowNumber))
                            if (objDatItem && objDatItem.dataValues && objDatItem.dataValues.rowNumber) {
                                subData.refSubFormTransID = objDatItem.subFormTransID;
                            }
                        });
                    }

                    _.each(dataElementList, (item) => {
                        if (item.dataElementTransID) {
                            item['updatedBy'] = req.user.id;
                        } else {
                            item['createdBy'] = req.user.id;
                        }
                        if (item.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                            item.value = COMMON.setTextAngularValueForDB(item.value);
                        }
                    });

                    const promises = [];
                    const updateExistingDataElements = _.filter(dataElementList, item => item.dataElementTransID);
                    if (updateExistingDataElements && updateExistingDataElements.length > 0) {
                        dataElementTransIDsForTimeLineLog.push(_.map(updateExistingDataElements, 'dataElementTransID'));
                        // Update Transaction values
                        promises.push(DataElementTransactionValues.bulkCreate(updateExistingDataElements, {
                            updateOnDuplicate: inputFields,
                            transaction: t
                        })
                        );
                    }

                    const createNewDataElements = _.filter(dataElementList, item => !item.dataElementTransID);
                    if (createNewDataElements && createNewDataElements.length > 0) {
                        // Create Transaction values
                        promises.push(DataElementTransactionValues.bulkCreate(createNewDataElements, {
                            transaction: t,
                            individualHooks: true
                        }).then((createdDataelements) => {
                            dataElementTransIDsForTimeLineLog.push(_.map(createdDataelements, 'dataElementTransID'));
                        })
                        );
                    }
                    return Promise.resolve(subFormElementList);
                }).then((dataelement) => {
                    /* Delete Transaction values which not contain any value -
                            include sub-form element record also which not contain any value */
                    if (JSON.parse(req.body.removeElementList).length > 0) {
                        return DataElementTransactionValues.update({
                            isDeleted: true, deletedAt: COMMON.getCurrentUTC(), deletedBy: req.user.id
                        }, {
                            where: {
                                dataElementTransID: { [Op.in]: JSON.parse(req.body.removeElementList) }
                            },
                            fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                            transaction: t
                        });
                    }

                    return Promise.resolve(dataelement);
                }).then((deleteDataelement) => {
                    if (JSON.parse(req.body.removeElementList).length > 0) {
                        dataElementTransIDsForTimeLineLog.push(JSON.parse(req.body.removeElementList));
                    }

                    /* take ref_sub-form_id of sub-form elements to check any record exists for sub-form.
                                if not then remove sub-form self entry from subform_data */
                    const removeSubFormTransList = JSON.parse(req.body.removeSubFormTransListConditional);
                    if (removeSubFormTransList && removeSubFormTransList.length > 0) {
                        const promises = [];
                        _.each(removeSubFormTransList, (refSubFormTransIDItem) => {
                            promises.push(DataElementTransactionValues.count({
                                where: {
                                    refSubFormTransID: refSubFormTransIDItem,
                                    deletedAt: null
                                },
                                transaction: t
                            }).then((data) => {
                                if (data === 0) {
                                    SubFormTransaction.update({
                                        isDeleted: true, deletedAt: COMMON.getCurrentUTC(), deletedBy: req.user.id
                                    }, {
                                        where: {
                                            subFormTransID: refSubFormTransIDItem
                                        },
                                        transaction: t
                                    });
                                }
                            }));
                        });
                    }
                    return Promise.resolve(deleteDataelement);
                })
                    .then(() => {
                        if (subFormTransUpdatelist && subFormTransUpdatelist.length > 0) {
                            COMMON.setModelUpdatedByArrayFieldValue(req.user, subFormTransUpdatelist);
                        }
                        // Update existing SubForm values
                        return SubFormTransaction.bulkCreate(subFormTransUpdatelist, {
                            updateOnDuplicate: subFormInputFields,
                            transaction: t
                        });
                    })
                    .then(() =>
                        /* Delete SubForm by ids from single/multiple rows of sub-form - delete button
                               (deletedsubFormTransIDs - means deleted complete row primary id) */
                        SubFormTransaction.update({
                            isDeleted: true,
                            deletedAt: COMMON.getCurrentUTC(),
                            deletedBy: req.user.id
                        },
                            {
                                where: {
                                    subFormTransID: { [Op.in]: JSON.parse(req.body.deletedsubFormTransIDs) }
                                },
                                fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                                transaction: t
                            }))
                    .then(() =>
                        // Delete sub-form element TransactionValues by ids
                        DataElementTransactionValues.update({
                            isDeleted: true,
                            deletedAt: COMMON.getCurrentUTC(),
                            deletedBy: req.user.id
                        },
                            {
                                where: {
                                    refSubFormTransID: { [Op.in]: JSON.parse(req.body.deletedsubFormTransIDs) },
                                    deletedAt: null
                                },
                                fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                                transaction: t
                            }))
                    .then(updatedTransData => Promise.resolve(updatedTransData))
                    .then(() => {
                        const allEntity = COMMON.AllEntityIDS;
                        req.body.entityID = Number(req.body.entityID);
                        if (req.body.entityID && (req.body.entityID === allEntity.Workorder.ID
                            || req.body.entityID === allEntity.Operation.ID /* actually workorderoperation */
                            || req.body.entityID === allEntity.SalesOrder.ID)) {
                            if (dataElementTransIDsForTimeLineLog && dataElementTransIDsForTimeLineLog.length > 0) {
                                // [S] add log of updating other details log for timeline users
                                const objEvent = {
                                    userID: req.user.id,
                                    eventTitle: null,
                                    eventDescription: null,
                                    refTransTable: dlTranValuesConstObj.refTransTableName,
                                    refTransID: dataElementTransIDsForTimeLineLog.toString(),
                                    eventType: null,
                                    url: null,
                                    eventAction: timelineEventActionConstObj.UPDATE
                                };
                                req.objEvent = objEvent;
                                TimelineController.createTimeline(req);
                                // [E] add log of updating other details log for timeline users
                            }
                        }

                        const allEntityList = _.values(COMMON.AllEntityIDS);
                        const updatedEntityObj = _.find(allEntityList, item => item.ID === req.body.entityID);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(updatedEntityObj ? COMMON.stringFormat(dataEleTransValUpdatedModuleName, updatedEntityObj.displayText) : dataEleTransValModuleName));
                    })
                    .catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Getting document by data element ID
    // GET : /api/v1/downloadElementTransactionDocument
    // @param {dataElementTransID} int
    // @return Document
    downloadDataElementDocument: (req, res) => {
        const DataElementTransactionValues = req.app.locals.models.DataElementTransactionValues;
        DataElementTransactionValues.findOne({
            where: {
                dataElementTransID: req.params.dataElementTransID
            }
        }).then((document) => {
            if (!document) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.DOCUMENT_NOT_FOUND, err: null, data: null });
            } else {
                const fileDetail = document.value.split('|');
                const objFileDetail = {
                    path: fileDetail.length > 0 ? fileDetail[0] : '',
                    mimetype: fileDetail.length > 1 ? fileDetail[1] : '',
                    originalname: fileDetail.length > 2 ? fileDetail[2] : '',
                    filename: fileDetail.length > 3 ? fileDetail[3] : ''
                };

                // eslint-disable-next-line consistent-return
                return fs.readFile(objFileDetail.path, (err) => {
                    if (err) {
                        if (err.code === COMMON.FileErrorMessage.NotFound) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
                        }
                    } else {
                        const file = objFileDetail.path;
                        res.setHeader('Content-disposition', `attachment; filename=${objFileDetail.originalname}`);
                        res.setHeader('Content-type', objFileDetail.mimetype);
                        const filestream = fs.createReadStream(file);
                        return filestream.pipe(res);
                    }
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive list of RFQ Submitted Qupte wise data element transaction values 
    // GET : /api/v1/dataelement_transactionvalues/getRFQAssyDataElementTransactionValuesHistory
    // @param {refTransID} int
    // @param {entityID} string
    // @param {refTransHistoryID} int
    // @return list of data element trasaction values list
    getRFQAssyDataElementTransactionValuesHistory: (req, res) => {
        const { RFQAssyDataElementTransactionValuesHistory, DataElement } = req.app.locals.models;
        RFQAssyDataElementTransactionValuesHistory.findAll({
            where: {
                refTransID: req.params.refTransID,
                entityID: req.params.entityID,
                refTransHistoryId: req.params.refTransHistoryId
            },
            include: [{
                model: DataElement,
                as: 'dataElement',
                required: false,
                attributes: ['controlTypeID']
            }]
        }).then((dataelementValues) => {
            _.each(dataelementValues, (item) => {
                if (item.dataElement.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                    item.value = COMMON.getTextAngularValueFromDB(item.value);
                }
            });
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataelementValues, null);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    }
};
