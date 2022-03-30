const fs = require('fs');
const fsextra = require('fs-extra');
const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const { Op } = require('sequelize');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

// const dataEleTransValManualModuleName = DATA_CONSTANT.DATAELEMENT_TRANSACTIONVALUES_MANUAL.NAME;

const inputFields = [
    'dataElementID',
    'value',
    'refTransID',
    'entityID',
    'isDeleted',
    'refSubFormTransID',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'createByRoleId',
    'updateByRoleId'
];

const subFormInputFields = [
    'parentDataElementID',
    'rowNumber',
    'isDeleted',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createdAt',
    'updatedAt',
    'createByRoleId',
    'updateByRoleId'
];

module.exports = {

    // get list of data element transaction values manual by entityid
    // GET : /api/v1/dataelement_transactionvalues_manual/getDataElement_TransactionValuesManualListByEntity
    // @param filter parameters
    // @return list of  manual data element transaction values
    getDataElement_TransactionValuesManualListByEntity: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.Page && req.body.pageSize && req.body.manualEntityID) {
            let orderBy = null;
            if (req.body.SortColumns) {
                const orderByInfo = req.body.SortColumns[0];
                if (orderByInfo && orderByInfo.length > 0) {
                    orderBy = `\`${orderByInfo[0]}\` ${orderByInfo[1]}`;
                }
            }
            let WhereClause = ' 1=1 ';
            if (req.body.SearchColumns) {
                const searcharray = req.body.SearchColumns;
                if (searcharray.length > 0) {
                    _.each(searcharray, (obj) => {
                        obj.SearchString = obj.SearchString.replace(/"/g, '\\"');
                        if (obj.ColumnDataType && obj.ColumnDataType === COMMON.GridFilterColumnDataType.Number) {
                            WhereClause += COMMON.stringFormat('and {0} = \'{1}\' ', `\`${obj.ColumnName}\``, obj.SearchString);
                        } else {
                            WhereClause += COMMON.stringFormat('and {0} like "%{1}%" ', `\`${obj.ColumnName}\``, obj.SearchString);
                        }
                    });
                }
            }

            return sequelize
                .query('CALL Sproc_getDataElementTransactionValuesManual (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pEntityID,:pSubFormDataElementID,:pRefTransID , :pIsSuperAdmin , :pEmployeeID )',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: req.body.pageSize,
                            pOrderBy: orderBy,
                            pWhereClause: WhereClause,
                            pEntityID: req.body.manualEntityID,
                            pSubFormDataElementID: req.body.subFormDataElementID || null,
                            pRefTransID: req.body.refTransIDManual || req.body.refTransID || null,
                            pIsSuperAdmin: req.body.isSuperAdmin || null,
                            pEmployeeID: req.body.employeeID || null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(dETransactionValuesManual => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { dETransactionValuesManualList: _.values(dETransactionValuesManual[1]), Count: dETransactionValuesManual[0][0]['TotalRecord'] }, null)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive list of data element transaction values manual by reftransId and entityId
    // GET : /api/v1/dataelement_transactionvalues_manual/retriveDataElement_TransactionValuesManual
    // @param {refTransID} int
    // @param {entityID} int
    // @return list of data element transaction values manual list
    retriveDataElement_TransactionValuesManual: (req, res) => {
        const DataElementTransactionValuesManual = req.app.locals.models.DataElementTransactionValuesManual;
        DataElementTransactionValuesManual.findAll({
            where: {
                refTransID: req.params.refTransID,
                entityID: req.params.entityID
            }
        }).then(dataelementValues => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataelementValues, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Create data element transaction values manual
    // POST : /api/v1/dataelement_transactionvalues_manual/createDataElement_TransactionValuesManual
    // @return API response
    createDataElement_TransactionValuesManual: (req, res) => {
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
        //     module.exports.uploadFileDataElement_ValueManualDetail(req, res);
        // });
        const dir = `${DATA_CONSTANT.ENTITY.CUSTOM_FORM_DOC_UPLOAD_PATH}${req.body.entityID}/`;
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
            return Promise.all(filePromises).then(() => module.exports.uploadFileDataElement_ValueManualDetail(req, res));
        } else {
            return module.exports.uploadFileDataElement_ValueManualDetail(req, res);
        }
    },

    uploadFileDataElement_ValueManualDetail: (req, res) => {
        const { sequelize, DataElementTransactionValuesManual, SubFormTransaction, Identity } = req.app.locals.models;
        const dir = `${DATA_CONSTANT.ENTITY.CUSTOM_FORM_DOC_UPLOAD_PATH}${req.body.entityID}/`;
        if (req.body) {
            // return sequelize.transaction().then((t) => {
            let NewIdentityValueForRefTransID = null;
            let dataElementTransManualIDExists = null;

            // let userName = req.user.firstName + ' ' + req.user.lastName;
            let dataElementList = JSON.parse(req.body.dataElementList);
            if (dataElementList && dataElementList.length > 0) { /* remove data element which not contain value */
                dataElementList.forEach(() => {
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
                obj.refTransID = parseInt(req.body.referenceTransID.replace(/\"/g, ''));
                obj.entityID = parseInt(req.body.entityID);
            });

            /* check add or edit case */
            dataElementTransManualIDExists = _.some(dataElementList, item => item.dataElementTransManualID);

            const subFormTransList = JSON.parse(req.body.subFormTransList);

            COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
            COMMON.setModelUpdatedByArrayFieldValue(req.user, subFormTransList);

            // get update list for subform transaction
            const subFormTransUpdatelist = _.remove(subFormTransList, obj => (obj.dataElementTransManualID));

            /* if is unique record then check value is exists */
            return sequelize.transaction(() => {
                const promises = [];
                _.each(dataElementList, (obj) => {
                    if (obj.isUnique) {
                        const dataElementTransManualID = obj.dataElementTransManualID ? obj.dataElementTransManualID : 0;
                        promises.push(DataElementTransactionValuesManual.findOne({
                            where: {
                                entityID: obj.entityID,
                                dataElementID: obj.dataElementID,
                                value: obj.value,
                                dataElementTransManualID: { [Op.notIn]: [dataElementTransManualID] }
                                // transaction: t
                            }
                        }).then(manualdata => Promise.resolve(manualdata)));
                    }
                });
                return Promise.all(promises);
            }).then(manualdatalist => sequelize.transaction((t) => {
                _.remove(manualdatalist, item => !item);
                if (manualdatalist && manualdatalist.length > 0) {
                    const existsDataElementIDs = _.map(manualdatalist, 'dataElementID');
                    const matchingExistsDataElementList = [];
                    _.each(existsDataElementIDs, (itemelementid) => {
                        const matchElement = _.find(dataElementList, eleitem => itemelementid === eleitem.dataElementID);

                        if (matchElement) {
                            matchingExistsDataElementList.push(matchElement);
                        }
                    });
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.DATAELEMENT_TRANSACTIONVALUES_UNIQUE);
                    if (matchingExistsDataElementList.length > 0) {
                        const existsdataElementNames = _.map(matchingExistsDataElementList, 'dataElementName');
                        messageContent.message = COMMON.stringFormat(messageContent.message, existsdataElementNames);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                    } else {
                        messageContent.message = COMMON.stringFormat(messageContent.message, '');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: messageContent, err: null, data: null });
                    }
                }

                if (subFormTransList && subFormTransList.length > 0) {
                    COMMON.setModelCreatedArrayFieldValue(req.user, subFormTransList);
                }

                // create sub-form transaction
                return SubFormTransaction.bulkCreate(subFormTransList, {
                    updateOnDuplicate: subFormInputFields,
                    individualHooks: true,
                    transaction: t
                })
                    .then((subFormElementList) => {
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

                        // if (dataElementList && dataElementList.length>0) {
                        //    dataElementList.forEach(element => {
                        //        dataElementList=_.reject(dataElementList,function(item){
                        //            if (item.value=="" || item.value==null) {
                        //                return item;
                        //            }
                        //        });
                        //    });
                        // }

                        return Identity.findOne({
                            where: {
                                type: DATA_CONSTANT.IDENTITY.EntityRefTransID
                            },
                            attributes: ['type', 'maxValue'],
                            transaction: t
                        }).then((identitydata) => {
                            /* if add case then only assign identity value as reftransid   */

                            if (!dataElementTransManualIDExists) {
                                NewIdentityValueForRefTransID = parseInt(identitydata.maxValue) + 1;
                                _.each(dataElementList, (item) => {
                                    item.refTransID = NewIdentityValueForRefTransID;
                                });
                            }

                            _.each(dataElementList, (item) => {
                                if (item.dataElementTransManualID) {
                                    item['updatedBy'] = req.user.id;
                                } else {
                                    item['createdBy'] = req.user.id;
                                }
                            });

                            // Create/Update Transaction values manual
                            return DataElementTransactionValuesManual.bulkCreate(dataElementList, {
                                updateOnDuplicate: inputFields,
                                transaction: t
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            t.rollback();
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    })
                    .then(() =>
                        /* Delete Transaction values which not contain any value -
                        include sub-form element record also which not contain any value */
                        DataElementTransactionValuesManual.destroy({
                            where: {
                                dataElementTransManualID: { [Op.in]: JSON.parse(req.body.removeElementList) }
                            },
                            force: true,
                            transaction: t
                        }))
                    .then((deleteDataelement) => {
                        /* take ref_sub-form_id of sub-form elements to check any record exists for sub-form.
                            if not then remove sub-form self entry from subform_data */
                        const removeSubFormTransList = JSON.parse(req.body.removeSubFormTransListConditional);
                        if (removeSubFormTransList && removeSubFormTransList.length > 0) {
                            const promises = [];
                            _.each(removeSubFormTransList, (refSubFormTransIDItem) => {
                                promises.push(DataElementTransactionValuesManual.count({
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
                        DataElementTransactionValuesManual.update({
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
                    .then((updatedTransData) => {
                        /* if add case then only update identity value for Entity RefTransID */

                        if (!dataElementTransManualIDExists) {
                            return Identity.update({
                                maxValue: NewIdentityValueForRefTransID
                            }, {
                                where: {
                                    type: DATA_CONSTANT.IDENTITY.EntityRefTransID
                                },
                                attributes: ['type', 'maxValue'],
                                transaction: t
                            });
                        }
                        return Promise.resolve(updatedTransData);
                    })
                    .then((updatedidentityResForRefTransID) => {
                        /* if add case then only - update identity value for auto increment data elements */

                        if (!dataElementTransManualIDExists) {
                            const promises = [];
                            _.each(dataElementList, (obj) => {
                                if (obj.isAutoIncrement) {
                                    const updateObj = {};
                                    updateObj.maxValue = obj.value;
                                    updateObj.updatedBy = req.user.id;
                                    promises.push(Identity.update(updateObj, {
                                        where: {
                                            type: obj.dataElementID.toString()
                                        },
                                        transaction: t
                                    }).then(identityUpdated => Promise.resolve(identityUpdated)));
                                }
                            });
                        }
                        return Promise.resolve(updatedidentityResForRefTransID);
                    })
                    .then(updatedidentityResForAutoIncrement => Promise.resolve(updatedidentityResForAutoIncrement))
                    .then(() => {
                        if (dataElementTransManualIDExists) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(JSON.parse(req.body.entityName)));
                        } else if (dataElementList && dataElementList.length > 0) {
                            /* if new element record created then */
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.CREATED(JSON.parse(req.body.entityName)));
                        } else {
                            /* if element record already created and remove all value of element then */
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(JSON.parse(req.body.entityName)));
                        }
                    })
                    .catch((err) => {
                        console.trace();
                        console.error(err);
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
            }));
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // delete data element transaction values manual
    // Delete : /api/v1/deleteDataElementTransactionValuesManualInfo
    // @param {dataElementTransManualIDs} string array
    // @param {entityName} string value
    // @return API response
    deleteDataElement_TransactionValuesManual: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.DataelementTransactionvaluesManual.Name;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then(() =>
                    // manualEntityElementDetail = manualEntityElement[0];
                    // if (manualEntityElementDetail && manualEntityElementDetail.TotalCount == 0) {
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(req.body.objIDs.entityName))
                    // }else {
                    //    return resHandler.successRes(res, 200, STATE.EMPTY, manualEntityElementDetail, null);
                    // }
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Getting document by data element ID
    // GET : /api/v1/dataelement_transactionvalues_manual/downloadCustomFormDataElementDocument
    // @param {dataElementTransManualID} int
    // @return Document
    downloadCustomFormDataElementDocument: (req, res) => {
        const DataElementTransactionValuesManual = req.app.locals.models.DataElementTransactionValuesManual;
        DataElementTransactionValuesManual.findOne({
            where: {
                dataElementTransManualID: req.params.dataElementTransID
            }
        }).then((document) => {
            if (!document) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.DOCUMENT_NOT_FOUND, err: null, data: null });
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
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY,
                                { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Getting document by data element ID
    // GET : /api/v1/dataelement_transactionvalues_manual/downloadCustomFormDataElementFileByRefID
    // @param {entityID} int
    // @param {dataElementID} int
    // @param {refTransID} int
    // @return Document
    downloadCustomFormDataElementFileByRefID: (req, res) => {
        const DataElementTransactionValuesManual = req.app.locals.models.DataElementTransactionValuesManual;
        DataElementTransactionValuesManual.findOne({
            where: {
                entityID: req.body.documentObj.entityID,
                dataElementID: req.body.documentObj.dataElementID,
                refTransID: req.body.documentObj.refTransID,
                dataElementTransManualID: [req.body.documentObj.dataElementTransManualIDs.split(',')]
            }
        }).then((document) => {
            if (!document) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.DOCUMENT_NOT_FOUND, err: null, data: null });
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
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY,
                                { messageContent: MESSAGE_CONSTANT.DOCUMENT.DOCUMENT_NOT_FOUND, err: null, data: null });
                        } else if (err.code === COMMON.FileErrorMessage.AccessDenied) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ACCESS_DENIED, STATE.EMPTY, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Getting History By entityId
    // GET : /api/v1/dataelement_transactionvalues_manual/retrieveDataElement_TransValues_Manual_History
    // @param {entityID} int
    // @return List
    retrieveDataElement_TransValues_Manual_History: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }
        if (!strWhere) strWhere = null;
        return sequelize.query('CALL Sproc_getDataElementTransactionValuesManual_History (:ppageIndex, :precordPerPage, :pOrderBy,:pWhereClause ,:pEntityID , :pRefTransID, :pIsSubForm)',
            {
                replacements: {
                    ppageIndex: req.query.page,
                    precordPerPage: req.query.pageSize,
                    pOrderBy: strOrderBy,
                    pWhereClause: strWhere,
                    pEntityID: JSON.parse(req.query.entityID),
                    pRefTransID: req.query.refTransID ? JSON.parse(req.query.refTransID) : null,
                    pIsSubForm: req.query.isSubForm === 'true' ? true : false
                },
                type: sequelize.QueryTypes.SELECT
            })
            .then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { history: _.values(result[0]) }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    }


    // // get list of data element transaction values manual by dataelementid and entityId
    // // GET : /api/v1/dataelement_transactionvalues_manual/getDETransValuesManualByDataelementFields
    // // @param {dataElementID} int
    // // @return list of data element transaction values manual list
    // getDETransValuesManualByDataelementFields: (req, res) => {
    //    const DataElementTransactionValuesManual = req.app.locals.models.DataElementTransactionValuesManual;
    //    DataElementTransactionValuesManual.findAll({
    //        where:{
    //            dataElementID:req.params.dataElementID,
    //           // entityID:req.params.entityID
    //        },
    //        attributes:['dataElementTransManualID','dataElementID','value','entityID']
    //    }).then((dataelementValues) => {
    //        resHandler.successRes(res, 200, STATE.SUCCESS, dataelementValues);
    //    }).catch((err) => {
    //        resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(dataEleTransValManualModuleName)));
    //    });
    // },

};
