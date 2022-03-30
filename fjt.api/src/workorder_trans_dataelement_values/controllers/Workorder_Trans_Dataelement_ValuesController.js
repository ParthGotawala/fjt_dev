const fs = require('fs');
const fsextra = require('fs-extra');
const _ = require('lodash');
const { Op } = require('sequelize');
const uuidv1 = require('uuid/v1');

const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');

const woTransDlValuesConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS_DATAELEMENT_VALUES;
const timelineObjForwoTransDlValues = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_TRANS_DATAELEMENT_VALUES;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const woDataElemModuleName = DATA_CONSTANT.WORKORDER_TRANS_DATAELEMENT_VALUES.NAME;

const inputFields = [
    'dataElementID',
    'woTransID',
    'woID',
    'woOPID',
    'entityID',
    'value',
    'refWoTransSubFormDataID',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt'
];

const subFormInputFields = [
    'parentDataElementID',
    'rowNumber',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'createdAt',
    'deletedBy',
    'updatedAt'
];

module.exports = {
    // Retrive list of workorder transaction data element values by woTransID, woOPOID and entityID
    // GET : /api/v1/workorder_trans_dataelement_values
    // @param {woTransID} int
    // @param {woOPID} int
    // @param {entityID} int
    // @return list of workorder transaction data element values
    retrive_WoTrans_DataElement_Values: (req, res) => {
        const { WorkorderTransDataElementValues, DataElement } = req.app.locals.models;
        WorkorderTransDataElementValues.findAll({
            where: {
                woTransID: req.params.woTransID,
                woOPID: req.params.woOPID,
                entityID: req.params.entityID
            },
            include: [{
                model: DataElement,
                as: 'dataelement',
                required: false,
                attributes: ['controlTypeID']
            }]
        }).then((dataelementValues) => {
            _.each(dataelementValues, (item) => {
                if (item && item.dataValues && item.dataValues.dataelement
                    && item.dataValues.dataelement.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                    item.value = COMMON.getTextAngularValueFromDB(item.value);
                }
            });
            return resHandler.successRes(res, 200, STATE.SUCCESS, dataelementValues);
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woDataElemModuleName)));
        });
    },
    // Create workorder transaction data element values
    // POST : /api/v1/workorder_trans_dataelement_values
    // @return API response
    createWoTransDataElementValues: (req, res) => {
        // const { WorkorderTransDataElementValues, WorkorderTransSubFormData, sequelize } = req.app.locals.models;
        // const storage = multer.diskStorage({
        //     destination: (destReq, file, cb) => {
        //         const dir = `./uploads/${req.body.entityID}/`;
        //         mkdirp(dir, (err) => cb(err, dir));
        //     },
        //     filename: (fileReq, file, cb) => {
        //         const ext = (/[.]/.exec(file.originalname)) ? /[^.]+$/.exec(file.originalname)[0] : null;
        //         cb(null, `${uuidv1()}.${ext}`);
        //     },
        // });
        // const upload = multer({
        //     storage,
        // }).any();
        // upload(req, res, (err) => {
        //     module.exports.uploadDataElementDetail(req, res);
        // });
        // const dir = `./uploads/${req.body.entityID}/`;
        const dir = `${DATA_CONSTANT.ENTITY.SYSTEM_ENTITY_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        if (typeof (req.files) === 'object' && typeof (req.files.file) === 'object') {
            const filePromises = [];
            Object.keys(req.files.file).forEach((modelField) => {
                const file = req.files.file[modelField];// req.files.profile;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                const fileName = `${uuidv1()}.${ext}`;
                const path = dir + fileName;
                req.files.file[modelField].fileName = fileName;
                filePromises.push(fsextra.move(file.path, path)
                    .then(() => {
                    }).catch(() => STATE.FAILED));
            });

            return Promise.all(filePromises).then(() => {
                module.exports.uploadDataElementDetail(req, res);
            });
        } else {
            return module.exports.uploadDataElementDetail(req, res);
        }
    },
    uploadDataElementDetail: (req, res) => {
        // const dir = `./uploads/${req.body.entityID}/`;
        const dir = `${DATA_CONSTANT.ENTITY.SYSTEM_ENTITY_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        const { WorkorderTransDataElementValues, WorkorderTransSubFormData, sequelize } = req.app.locals.models;
        if (req.body) {
            const woTransDataElementIDsForTimeLineLog = [];
            // let userName = req.user.firstName + ' ' + req.user.lastName;
            let dataElementList = JSON.parse(req.body.dataElementList);
            if (dataElementList && dataElementList.length > 0) {
                dataElementList.forEach((element) => {
                    if (element.controlTypeID === COMMON.INPUTFIELD_KEYS.Editor) {
                        element.value = COMMON.setTextAngularValueForDB(element.value);
                    }
                    dataElementList = _.reject(dataElementList, item => item.value === '' || item.value === null);
                });
            }

            COMMON.setModelCreatedArrayFieldValue(req.user, dataElementList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, dataElementList);

            _.each(dataElementList, (obj) => {
                // if(req.files.length > 0  && obj.controlTypeID == COMMON.INPUTFIELD_KEYS.FileUpload){
                if (typeof (req.files) === 'object' && typeof (req.files.file) === 'object' && obj.controlTypeID === COMMON.INPUTFIELD_KEYS.FileUpload) {
                    let objFile = null;
                    if (obj.parentDataElementID) {  /* subform_record */
                        objFile = _.find(req.files.file, item => item.fieldName === `file[${obj.dataElementID}_RowNumber_${obj.rowNumber}]`);

                        // / Multer Module Code
                        // objFile = _.find(req.files, (o) => {
                        //     return o.fieldname == `file[${obj.dataElementID}_RowNumber_` + obj.rowNumber + `]`;
                        //     //&& o.originalname == obj.value ;
                        // });
                    } else { /* form_record */
                        objFile = _.find(req.files.file, item => item.fieldName === `file[${obj.dataElementID}]`);

                        // / Multer Module Code
                        // objFile = _.find(req.files, (o) => {
                        //     return o.fieldname == `file[${obj.dataElementID}]`;
                        // });
                    }

                    if (objFile) {
                        // obj.value = `${objFile.destination}${objFile.filename}|${objFile.mimetype}|${objFile.originalname}|${objFile.filename}`;
                        obj.value = `${dir}${objFile.fileName}|${objFile.type}|${objFile.originalFilename}|${objFile.fileName}`;
                    }
                }
                // eslint-disable-next-line no-useless-escape
                obj.woTransID = parseInt(req.body.woTransID.replace(/\"/g, ''));
                // eslint-disable-next-line no-useless-escape
                obj.woOPID = parseInt(req.body.woOPID.replace(/\"/g, ''));
                obj.woID = parseInt(req.body.woID);
                obj.entityID = parseInt(req.body.entityID);
            });
            const subFormTransList = JSON.parse(req.body.subFormTransList);

            COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, subFormTransList);

            // get update list for subform transaction
            const subFormTransUpdatelist = _.remove(subFormTransList, obj => (obj.woTransDataElementID));

            return sequelize.transaction((t) => {
                if (subFormTransList && subFormTransList.length > 0) {
                    COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
                }

                // create sub-form transaction
                return WorkorderTransSubFormData.bulkCreate(subFormTransList, {
                    updateOnDuplicate: subFormInputFields,
                    individualHooks: true,
                    transaction: t
                }).then((subFormElementList) => {
                    /* if added sub-form new data including multiple rows of sub-form that time need to set
                         newly added "refWoTransSubFormDataID" to data-element for save in transaction table   */
                    if (subFormElementList && subFormElementList.length > 0) {
                        _.each(dataElementList, (subData) => {
                            var objDatItem = _.find(subFormElementList, dataItem => dataItem.rowNumber === subData.rowNumber
                                && dataItem.parentDataElementID === subData.parentDataElementID);
                            // if(_.isNumber(objDatItem.rowNumber))
                            if (objDatItem && objDatItem.dataValues && objDatItem.dataValues.rowNumber) {
                                subData.refWoTransSubFormDataID = objDatItem.woTransSubFormDataID;
                            }
                        });
                    }

                    // if (dataElementList && dataElementList.length>0) {
                    //    dataElementList.forEach(element => {
                    //        dataElementList=_.reject(dataElementList,function(item){
                    //            if (item.value=="" || item.value==null) {
                    //                return item;
                    //            }
                    //        });
                    //    });
                    // }

                    _.each(dataElementList, (item) => {
                        if (item.woTransDataElementID) {
                            item['updatedBy'] = req.user.id;
                        } else {
                            item['createdBy'] = req.user.id;
                        }
                    });

                    const promises = [];
                    const updateExistingDataElements = _.filter(dataElementList, item => item.woTransDataElementID);
                    if (updateExistingDataElements && updateExistingDataElements.length > 0) {
                        woTransDataElementIDsForTimeLineLog.push(_.map(updateExistingDataElements, 'woTransDataElementID'));
                        // Update Transaction values
                        promises.push(WorkorderTransDataElementValues.bulkCreate(updateExistingDataElements, {
                            updateOnDuplicate: inputFields,
                            transaction: t
                        })
                        );
                    }

                    const createNewDataElements = _.filter(dataElementList, item => !item.woTransDataElementID);
                    if (createNewDataElements && createNewDataElements.length > 0) {
                        // Create Transaction values
                        promises.push(WorkorderTransDataElementValues.bulkCreate(createNewDataElements, {
                            transaction: t,
                            individualHooks: true
                        }).then((createdDataelements) => {
                            woTransDataElementIDsForTimeLineLog.push(_.map(createdDataelements, 'woTransDataElementID'));
                        })
                        );
                    }
                    return Promise.resolve(subFormElementList);
                }).then(() =>
                    /* Delete Transaction values which not contain any value -
                        include sub-form element record also which not contain any value */
                    WorkorderTransDataElementValues.destroy({
                        where: {
                            woTransDataElementID: { [Op.in]: JSON.parse(req.body.removeElementList) }
                        },
                        force: true,
                        transaction: t
                    })).then((deleteDataelement) => {
                        /* take ref_sub-form_id of sub-form elements to check any record exists for sub-form.
                                if not then remove sub-form self entry from subform_data */
                        const removeSubFormTransList = JSON.parse(req.body.removeSubFormTransListConditional);
                        if (removeSubFormTransList && removeSubFormTransList.length > 0) {
                            const promises = [];
                            _.each(removeSubFormTransList, (refWoTransSubFormDataIDItem) => {
                                promises.push(WorkorderTransDataElementValues.count({
                                    where: {
                                        refWoTransSubFormDataID: refWoTransSubFormDataIDItem,
                                        deletedAt: null
                                    },
                                    transaction: t
                                }).then((data) => {
                                    if (data === 0) {
                                        WorkorderTransSubFormData.update({
                                            isDeleted: true, deletedAt: COMMON.getCurrentUTC(), deletedBy: req.user.id
                                        }, {
                                            where: {
                                                woTransSubFormDataID: refWoTransSubFormDataIDItem
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

                        // Update existing SubForm vWO_DATAENTRY_CHANGE_AUDITLOG_LIST_ROUTEalues
                        return WorkorderTransSubFormData.bulkCreate(subFormTransUpdatelist, {
                            updateOnDuplicate: subFormInputFields,
                            transaction: t
                        });
                    })
                    .then(() =>
                        /* Delete SubForm by ids from single/multiple rows of sub-form - delete button
                            (deletedsubFormTransIDs - means deleted complete row primary id) */
                        WorkorderTransSubFormData.update({
                            isDeleted: true,
                            deletedAt: COMMON.getCurrentUTC(),
                            deletedBy: req.user.id
                        },
                            {
                                where: {
                                    woTransSubFormDataID: { [Op.in]: JSON.parse(req.body.deletedsubFormTransIDs) }
                                },
                                fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                                transaction: t
                            }))
                    .then(() =>
                        // Delete sub-form element TransactionValues by ids
                        WorkorderTransDataElementValues.update({
                            isDeleted: true,
                            deletedAt: COMMON.getCurrentUTC(),
                            deletedBy: req.user.id
                        },
                            {
                                where: {
                                    refWoTransSubFormDataID: { [Op.in]: JSON.parse(req.body.deletedsubFormTransIDs) },
                                    deletedAt: null
                                },
                                fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                                transaction: t
                            }))
                    .then(updatedTransData => Promise.resolve(updatedTransData))
                    .then(() => {
                        if (woTransDataElementIDsForTimeLineLog && woTransDataElementIDsForTimeLineLog.length > 0) {
                            // [S] add log of updating workorder_trans_dataelement_values log for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: woTransDlValuesConstObj.SAVED.title,
                                eventDescription: COMMON.stringFormat(woTransDlValuesConstObj.SAVED.description, req.body.opName, req.body.woNumber, req.user.username),
                                refTransTable: woTransDlValuesConstObj.refTransTableName,
                                refTransID: woTransDataElementIDsForTimeLineLog.toString(),
                                eventType: timelineObjForwoTransDlValues.id,
                                url: COMMON.stringFormat(woTransDlValuesConstObj.url, JSON.parse(req.body.woOPID), JSON.parse(req.body.employeeID)),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of updating workorder_trans_dataelement_values log for timeline users
                        }

                        return resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_TRANS_DATAELEMENT_VALUES.UPDATED);
                    })
                    .catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woDataElemModuleName)));
                    });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Download workorder transaction document by woTransDataElementID
    // GET : /api/v1/downloadWoTransElementTransactionDocument
    // @param {woTransDataElementID} int
    // @return workorder transaction document
    downloadWoTransElementTransactionDocument: (req, res) => {
        const WorkorderTransDataElementValues = req.app.locals.models.WorkorderTransDataElementValues;
        WorkorderTransDataElementValues.findOne({
            where: {
                woTransDataElementID: req.params.woTransDataElementID
            }
        }).then((document) => {
            if (!document) {
                resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
            } else {
                const fileDetail = document.value.split('|');
                const objFileDetail = {
                    path: fileDetail.length > 0 ? fileDetail[0] : '',
                    mimetype: fileDetail.length > 1 ? fileDetail[1] : '',
                    originalname: fileDetail.length > 2 ? fileDetail[2] : '',
                    filename: fileDetail.length > 3 ? fileDetail[3] : ''
                };

                fs.readFile(objFileDetail.path, (err) => {
                    if (err) {
                        if (err.code === COMMON.FileErrorMessage.NotFound) {
                            resHandler.errorRes(res, 404, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            resHandler.errorRes(res, 403, STATE.EMPTY, null);
                        }
                    } else {
                        const file = objFileDetail.path;
                        res.setHeader('Content-disposition', `attachment; filename=${objFileDetail.originalname}`);
                        res.setHeader('Content-type', objFileDetail.mimetype);
                        const filestream = fs.createReadStream(file);
                        filestream.pipe(res);
                    }
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
        });
    },
    // Retrieve list of workroder operation equipment data element
    // POST : /api/v1/workorder_trans_dataelement_values/retrieveWorkorderOperationEquipmentDataElementList
    // @return list of workroder operation equipment data element
    retrieveWorkorderOperationEquipmentDataElementList: (req, res) => {
        const { DataElement, WorkorderOperationEquipmentDataelement } = req.app.locals.models;
        return DataElement.findAll({
            include: [{
                model: WorkorderOperationEquipmentDataelement,
                as: 'workorderOperationEquipmentDataelement',
                where: {
                    woOPID: req.body.woOPID,
                    eqpID: req.body.eqpID
                },
                required: true
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
                promiseCustomEntity.push(module.exports.updateElementInfoForManualDataWoOpEqp(req, res, getWorkorderOperationData));
            }
            if (isContainCustomEntity) {
                /* retrieve and set custom entity master data to choice selection data element */
                promiseCustomEntity.push(module.exports.updateElementInfoForCustomEntityWoOpEqp(req, res, getWorkorderOperationData));
            }
            return Promise.all(promiseCustomEntity).then(() => {
                if (isContainFixedEntity) {
                    /* retrieve and set fixed entity master data to choice selection data element */
                    return module.exports.updateElementInfoForFixedEntityWoOpEqp(req, res, getWorkorderOperationData);
                } else {
                    return resHandler.successRes(res, 200, STATE.SUCCESS, getWorkorderOperationData);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                resHandler.errorRes(res, 200, STATE.EMPTY, err);
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, err);
        });
    },

    /* local function for update data_element information with Fixed Master data value */
    updateElementInfoForFixedEntityWoOpEqp: (req, res, getWorkorderOperationData) => {
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
                                    pwhereclause += (fixedEntity.filter ? ` and ${fixedEntity.filter.replace('@pWoID', req.body.woID)}` : '');
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
                                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woDataElemModuleName)));
                            })
                        );
                    }
                }
            });
            return Promise.all(promises);
        }).then(() => resHandler.successRes(res, 200, STATE.SUCCESS, getWorkorderOperationData)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woDataElemModuleName)));
        });
    },
    // local function for update data_element information with CustomEntity Master data value
    updateElementInfoForCustomEntityWoOpEqp: (req, res, getWorkorderOperationData) => {
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
    updateElementInfoForManualDataWoOpEqp: (req, res, getWorkorderOperationData) => {
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
    },
    // get list of work order operation data element transaction values
    // POST : /api/v1/workorder_trans_dataelement_values/getWoTransactionDataElementValuesList
    // @return list of  workorder_trans_dataelement_values
    getWoTransactionDataElementValuesList: (req, res) => {
        if (req.body && req.body.entityID && req.body.woID && req.body.woOPID) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_getWOTransDataElementValues (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pEntityID,:pSubFormDataElementID,:pWoTransID,:pWoID,:pWoOPID)',
                {
                    replacements: {
                        ppageIndex: req.body.page,
                        precordPerPage: filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pEntityID: req.body.entityID,
                        pSubFormDataElementID: req.body.subFormDataElementID ? req.body.subFormDataElementID : null,
                        pWoTransID: req.body.woTransID ? req.body.woTransID : null,
                        pWoID: req.body.woID,
                        pWoOPID: req.body.woOPID
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(woTransDEValues => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woTransDEValuesList: _.values(woTransDEValues[1]), Count: woTransDEValues[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get list of work order operation data element values for all transaction
    // GET : /api/v1/workorder_trans_dataelement_values/getWoOpAllTransDataElementValuesList
    // @param filter parameters
    // @return list of  workorder_trans_dataelement_values
    getWoOpAllTransDataElementValuesList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (JSON.parse(req.query.entityID) && JSON.parse(req.query.woOPID)) {
            return sequelize
                .query('CALL Sproc_getWoOpAllTransDataElementValues (:pEntityID,:pWoOPID)',
                    {
                        replacements: {
                            pEntityID: JSON.parse(req.query.entityID),
                            pWoOPID: JSON.parse(req.query.woOPID)
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(woTransDEValues => resHandler.successRes(res, 200, STATE.SUCCESS, { woTransDEValuesList: _.values(woTransDEValues[0]) }))
                .catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(woDataElemModuleName), err: err, data: null })
                );
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },

    // Download workorder operation transaction document by refIDs
    // GET : /api/v1/workorder_trans_dataelement_values/downloadWoTransDataElementFileByRefID
    // @param {entityID} int
    // @param {dataElementID} int
    // @param {woTransID} int
    // @param {woOPID} int
    // @return workorder transaction document
    downloadWoTransDataElementFileByRefID: (req, res) => {
        const WorkorderTransDataElementValues = req.app.locals.models.WorkorderTransDataElementValues;
        WorkorderTransDataElementValues.findOne({
            where: {
                entityID: req.body.documentObj.entityID,
                dataElementID: req.body.documentObj.dataElementID,
                woTransID: req.body.documentObj.woTransID,
                woOPID: req.body.documentObj.woOPID,
                woTransDataElementID: [req.body.documentObj.woTransDataElementIDs.split(',')]
            }
        }).then((document) => {
            if (!document) {
                return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
            } else {
                const fileDetail = document.value.split('|');
                const objFileDetail = {
                    path: fileDetail.length > 0 ? fileDetail[0] : '',
                    mimetype: fileDetail.length > 1 ? fileDetail[1] : '',
                    originalname: fileDetail.length > 2 ? fileDetail[2] : '',
                    filename: fileDetail.length > 3 ? fileDetail[3] : ''
                };

                return fs.readFile(objFileDetail.path, (err) => {
                    if (err) {
                        if (err.code === COMMON.FileErrorMessage.NotFound) {
                            return resHandler.errorRes(res, 404, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            return resHandler.errorRes(res, 403, STATE.EMPTY, null);
                        }
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
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
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
        });
    }

};
