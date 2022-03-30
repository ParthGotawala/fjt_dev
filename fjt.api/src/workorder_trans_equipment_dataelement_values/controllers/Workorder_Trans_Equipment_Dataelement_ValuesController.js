const fs = require('fs');
const fsextra = require('fs-extra');
const _ = require('lodash');
const { Op } = require('sequelize');
const uuidv1 = require('uuid/v1');

const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const woTransEqpDlValuesConstObj = DATA_CONSTANT.TIMLINE.WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES;
const timelineObjForwoTransEqpDlValues = DATA_CONSTANT.TIMLINE.EVENTS.TRAVELER.WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES;
const timelineEventActionConstObj = DATA_CONSTANT.TIMLINE.eventAction;
var TimelineController = require('../../timeline/controllers/TimelineController');

const woEqpDataElemModuleName = DATA_CONSTANT.WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES.NAME;

const inputFields = [
    'dataElementID',
    'woTransID',
    'woID',
    'woOPID',
    'entityID',
    'value',
    'refWoTransEqpSubFormDataID',
    'isDeleted',
    'deletedAt',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'eqpID'
];

const subFormInputFields = [
    'parentDataElementID',
    'rowNumber',
    'isDeleted',
    'deletedAt',
    'updatedAt',
    'createdAt',
    'createdBy',
    'updatedBy',
    'deletedBy'
];

module.exports = {
    // Retrive list of workorder transaction data element values by woTransID, woOPOID and entityID
    // GET : /api/v1/WorkorderTransEquipmentDataelementValues
    // @param {woTransID} int
    // @param {woOPID} int
    // @param {entityID} int
    // @return list of workorder transaction data element values
    retrive_WoTrans_Equipment_DataElement_Values: (req, res) => {
        const { WorkorderTransEquipmentDataelementValues, DataElement } = req.app.locals.models;
        WorkorderTransEquipmentDataelementValues.findAll({
            where: {
                woTransID: req.params.woTransID,
                woOPID: req.params.woOPID,
                entityID: req.params.entityID,
                eqpID: req.params.eqpID
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
            return resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(woEqpDataElemModuleName)));
        });
    },
    // Create workorder transaction data element values
    // POST : /api/v1/WorkorderTransEquipmentDataelementValues
    // @return API response
    createWoTransEquipmentDataElementValues: (req, res) => {
        // const { WorkorderTransEquipmentDataelementValues, WorkorderTransEquipmentSubFormData
        //     , sequelize } = req.app.locals.models;
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
        //     module.exports.uploadDataElement_ManualDetail(req, res);
        // });

        const { sequelize } = req.app.locals.models;
        // const dir = `./uploads/${req.body.entityID}/`;
        const dir = `${DATA_CONSTANT.ENTITY.SYSTEM_ENTITY_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        if (typeof (req.files) === 'object' && typeof (req.files.file) === 'object') {
            const filePromises = [];
            Object.keys(req.files.file).forEach((modelField) => {
                var file = req.files.file[modelField];// req.files.profile;
                const ext = (/[.]/.exec(file.originalFilename)) ? /[^.]+$/.exec(file.originalFilename)[0] : null;
                var fileName = `${uuidv1()}.${ext}`;
                var path = dir + fileName;
                req.files.file[modelField].fileName = fileName;
                return filePromises.push(fsextra.move(file.path, path)
                    .then(() => {
                    }).catch(() => STATE.FAILED));
            });
            return Promise.all(filePromises).then(() => {
                module.exports.uploadDataElement_ManualDetail(req, res);
            });
        } else {
            return module.exports.uploadDataElement_ManualDetail(req, res);
        }
    },

    uploadDataElement_ManualDetail: (req, res) => {
        const { WorkorderTransEquipmentDataelementValues, WorkorderTransEquipmentSubFormData
            , sequelize } = req.app.locals.models;
        // const dir = `./uploads/${req.body.entityID}/`;
        const dir = `${DATA_CONSTANT.ENTITY.SYSTEM_ENTITY_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        if (req.body) {
            const woTransEqpDataElementIDsForTimeLineLog = [];
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
                // if(req.files.length > 0 && obj.controlTypeID == COMMON.INPUTFIELD_KEYS.FileUpload){
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
                obj.eqpID = parseInt(req.body.eqpID);
            });
            const subFormTransList = JSON.parse(req.body.subFormTransList);

            COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, subFormTransList);

            // get update list for subform transaction
            const subFormTransUpdatelist = _.remove(subFormTransList, obj => (obj.woTransEqpDataElementID));

            return sequelize.transaction((t) => {
                if (subFormTransList && subFormTransList.length > 0) {
                    COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
                }

                // create sub-form transaction
                return WorkorderTransEquipmentSubFormData.bulkCreate(subFormTransList, {
                    updateOnDuplicate: subFormInputFields,
                    individualHooks: true,
                    transaction: t
                }).then((subFormElementList) => {
                    /* if added sub-form new data including multiple rows of sub-form that time need to set
                         newly added "refWoTransEqpSubFormDataID" to data-element for save in transaction table   */
                    if (subFormElementList && subFormElementList.length > 0) {
                        _.each(dataElementList, (subData) => {
                            var objDatItem = _.find(subFormElementList, dataItem => dataItem.rowNumber === subData.rowNumber
                                && dataItem.parentDataElementID === subData.parentDataElementID);

                            if (objDatItem && objDatItem.dataValues && objDatItem.dataValues.rowNumber) {
                                subData.refWoTransEqpSubFormDataID = objDatItem.woTransEqpSubFormDataID;
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
                        if (item.woTransEqpDataElementID) {
                            item['updatedBy'] = req.user.id;
                        } else {
                            item['createdBy'] = req.user.id;
                        }
                    });

                    const promises = [];
                    const updateExistingDataElements = _.filter(dataElementList, item => item.woTransEqpDataElementID);
                    if (updateExistingDataElements && updateExistingDataElements.length > 0) {
                        woTransEqpDataElementIDsForTimeLineLog.push(_.map(updateExistingDataElements, 'woTransEqpDataElementID'));
                        // Update Transaction values
                        promises.push(WorkorderTransEquipmentDataelementValues.bulkCreate(updateExistingDataElements, {
                            updateOnDuplicate: inputFields,
                            transaction: t
                        })
                        );
                    }

                    const createNewDataElements = _.filter(dataElementList, item => !item.woTransEqpDataElementID);
                    if (createNewDataElements && createNewDataElements.length > 0) {
                        // Create Transaction values
                        promises.push(WorkorderTransEquipmentDataelementValues.bulkCreate(createNewDataElements, {
                            transaction: t,
                            individualHooks: true
                        }).then((createdDataelements) => {
                            woTransEqpDataElementIDsForTimeLineLog.push(_.map(createdDataelements, 'woTransEqpDataElementID'));
                        })
                        );
                    }
                    return Promise.resolve(subFormElementList);
                }).then(() =>
                    /* Delete Transaction values which not contain any value -
                       include sub-form element record also which not contain any value */
                    WorkorderTransEquipmentDataelementValues.destroy({
                        where: {
                            woTransEqpDataElementID: { [Op.in]: JSON.parse(req.body.removeElementList) }
                        },
                        force: true,
                        transaction: t
                    })).then((deleteDataelement) => {
                        /* take ref_sub-form_id of sub-form elements to check any record exists for sub-form.
                               if not then remove sub-form self entry from subform_data */
                        const removeSubFormTransList = JSON.parse(req.body.removeSubFormTransListConditional);
                        if (removeSubFormTransList && removeSubFormTransList.length > 0) {
                            const promises = [];
                            _.each(removeSubFormTransList, (refWoTransEqpSubFormDataIDItem) => {
                                promises.push(WorkorderTransEquipmentDataelementValues.count({
                                    where: {
                                        refWoTransEqpSubFormDataID: refWoTransEqpSubFormDataIDItem,
                                        deletedAt: null
                                    },
                                    transaction: t
                                }).then((data) => {
                                    if (data === 0) {
                                        WorkorderTransEquipmentSubFormData.update({
                                            isDeleted: true, deletedAt: COMMON.getCurrentUTC(), deletedBy: req.user.id
                                        }, {
                                            where: {
                                                woTransEqpSubFormDataID: refWoTransEqpSubFormDataIDItem
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
                        return WorkorderTransEquipmentSubFormData.bulkCreate(subFormTransUpdatelist, {
                            updateOnDuplicate: subFormInputFields,
                            transaction: t
                        });
                    })
                    .then(() =>
                        /* Delete SubForm by ids from single/multiple rows of sub-form - delete button
                           (deletedsubFormTransIDs - means deleted complete row primary id) */
                        WorkorderTransEquipmentSubFormData.update({
                            isDeleted: true,
                            deletedAt: COMMON.getCurrentUTC(),
                            deletedBy: req.user.id
                        },
                            {
                                where: {
                                    woTransEqpSubFormDataID: { [Op.in]: JSON.parse(req.body.deletedsubFormTransIDs) }
                                },
                                fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                                transaction: t
                            }))
                    .then(() =>
                        // Delete sub-form element TransactionValues by ids
                        WorkorderTransEquipmentDataelementValues.update({
                            isDeleted: true,
                            deletedAt: COMMON.getCurrentUTC(),
                            deletedBy: req.user.id
                        },
                            {
                                where: {
                                    refWoTransEqpSubFormDataID: { [Op.in]: JSON.parse(req.body.deletedsubFormTransIDs) },
                                    deletedAt: null
                                },
                                fields: ['isDeleted', 'deletedAt', 'deletedBy'],
                                transaction: t
                            }))
                    .then(updatedTransData => Promise.resolve(updatedTransData))
                    .then(() => {
                        if (woTransEqpDataElementIDsForTimeLineLog && woTransEqpDataElementIDsForTimeLineLog.length > 0) {
                            // [S] add log of updating workorder_trans_equipment_dataelement_values log for timeline users
                            const objEvent = {
                                userID: req.user.id,
                                eventTitle: woTransEqpDlValuesConstObj.SAVED.title,
                                eventDescription: COMMON.stringFormat(woTransEqpDlValuesConstObj.SAVED.description, JSON.parse(req.body.eqpName),
                                    req.body.opName, req.body.woNumber, req.user.username),
                                refTransTable: woTransEqpDlValuesConstObj.refTransTableName,
                                refTransID: woTransEqpDataElementIDsForTimeLineLog.toString(),
                                eventType: timelineObjForwoTransEqpDlValues.id,
                                url: COMMON.stringFormat(woTransEqpDlValuesConstObj.url, JSON.parse(req.body.woOPID), JSON.parse(req.body.employeeID)),
                                eventAction: timelineEventActionConstObj.UPDATE
                            };
                            req.objEvent = objEvent;
                            TimelineController.createTimeline(req);
                            // [E] add log of updating workorder_trans_equipment_dataelement_values log for timeline users
                        }

                        return resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.WORKORDER_TRANS_DATAELEMENT_VALUES.UPDATED);
                    })
                    .catch((err) => {
                        t.rollback();
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, 200, STATE.EMPTY, new NotCreate(MESSAGE_CONSTANT.NOT_UPDATED(woEqpDataElemModuleName)));
                    });
            });
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Retrieve list of workroder operation equipment data element
    // POST : /api/v1/workorder_trans_dataelement_values/retrieveWorkorderOperationEquipmentDataElementList
    // @return list of workroder operation equipment data element
    retrieveWorkorderOperationEquipmentDataElementList: (req, res) => {
        const { DataElement, WorkorderOperationEquipmentDataelement, DataElementKeyValues } = req.app.locals.models;
        DataElement.findAll({
            include: [{
                model: WorkorderOperationEquipmentDataelement,
                as: 'workorderOperationEquipmentDataelement',
                where: {
                    woOPID: req.body.woOPID,
                    eqpID: req.body.eqpID
                },
                required: true
            },
            {
                model: DataElementKeyValues,
                as: 'dataElementKeyValues'
            }]
        }).then(getWorkorderOperationData => resHandler.successRes(res, 200, STATE.SUCCESS, getWorkorderOperationData)).catch((err) => {
            console.trace();
            console.error(err);
            resHandler.errorRes(res, 200, STATE.EMPTY, err);
        });
    },
    // Download workorder transaction document by woTransDataElementID
    // GET : /api/v1/workorder_trans_equipment_dataelement_values/downloadWoTransEqpElementTransactionDocument
    // @param {woTransDataElementID} int
    // @return workorder transaction document
    downloadWoTransEqpElementTransactionDocument: (req, res) => {
        const WorkorderTransEquipmentDataelementValues = req.app.locals.models.WorkorderTransEquipmentDataelementValues;
        WorkorderTransEquipmentDataelementValues.findOne({
            where: {
                woTransEqpDataElementID: req.params.woTransEqpDataElementID
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

    // get list of work order operation data element transaction values
    // POST : /api/v1/workorder_trans_equipment_dataelement_values/getWoTransactionEquipmentDataElementValuesList
    // @return list of  workorder_trans_equipment_dataelement_values
    getWoTransactionEquipmentDataElementValuesList: (req, res) => {
        if (req.body && req.body.entityID && req.body.woID && req.body.woOPID && req.body.eqpID) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize
                .query('CALL Sproc_getWOTransEqpDataElementValues (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pEntityID,:pSubFormDataElementID,:pWoTransID,:pWoID,:pWoOPID,:pEqpID)',
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
                            pWoOPID: req.body.woOPID,
                            pEqpID: req.body.eqpID
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(woTransEqpDEValues => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { woTransEqpDEValuesList: _.values(woTransEqpDEValues[1]), Count: woTransEqpDEValues[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get list of work order operation equipment data element values for all transaction
    // GET : /api/v1/workorder_trans_equipment_dataelement_values/getWoOpEqpAllTransDataElementValuesList
    // @param filter parameters
    // @return list of  workorder_trans_equipment_dataelement_values
    getWoOpEqpAllTransDataElementValuesList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (JSON.parse(req.query.entityID) && JSON.parse(req.query.woOPID) && JSON.parse(req.query.eqpID)) {
            return sequelize
                .query('CALL Sproc_getWoOpEqpAllTransDataElementValues (:pEntityID,:pWoOPID,:pEqpID)',
                    {
                        replacements: {
                            pEntityID: JSON.parse(req.query.entityID),
                            pWoOPID: JSON.parse(req.query.woOPID),
                            pEqpID: JSON.parse(req.query.eqpID)
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(woTransEqpDEValues => resHandler.successRes(res, 200, STATE.SUCCESS, { woTransEqpDEValuesList: _.values(woTransEqpDEValues[0]) }))
                .catch(err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null }));
        } else {
            return resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    },
    // Download workorder operation equipment transaction document by refIDs
    // GET : /api/v1/workorder_trans_equipment_dataelement_values/downloadWoTransEqpDataElementFileByRefID
    // @param {entityID} int
    // @param {dataElementID} int
    // @param {woTransID} int
    // @param {woOPID} int
    // @param {eqpID} int
    // @return workorder transaction document
    downloadWoTransEqpDataElementFileByRefID: (req, res) => {
        const WorkorderTransEquipmentDataelementValues = req.app.locals.models.WorkorderTransEquipmentDataelementValues;
        WorkorderTransEquipmentDataelementValues.findOne({
            where: {
                entityID: req.body.documentObj.entityID,
                dataElementID: req.body.documentObj.dataElementID,
                woTransID: req.body.documentObj.woTransID,
                woOPID: req.body.documentObj.woOPID,
                eqpID: req.body.documentObj.eqpID,
                woTransEqpDataElementID: [req.body.documentObj.woTransEqpDataElementIDs.split(',')]
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
                            resHandler.errorRes(res, 404, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND));
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            resHandler.errorRes(res, 403, STATE.EMPTY, null);
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

