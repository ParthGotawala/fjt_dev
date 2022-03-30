const fs = require('fs');
const _ = require('lodash');
const { Op } = require('sequelize');
const fsextra = require('fs-extra');
const uuidv1 = require('uuid/v1');

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const GenericFilesController = require('../../genericfiles/controllers/GenericFilesController');

const operationModuleName = DATA_CONSTANT.OPERATION.NAME;

const inputFields = [
    'opName',
    'opNumber',
    'opDescription',
    'opDoes',
    'opDonts',
    'opOrder',
    'isDeleted',
    'opStatus',
    'operationTypeID',
    'parentOPID',
    'processTime',
    'setupTime',
    'perPieceTime',
    'qtyControl',
    'opWorkingCondition',
    'opManagementInstruction',
    'opDeferredInstruction',
    'deletedAt',
    'deletedBy',
    'updatedBy',
    'isTeamOperation',
    'tabLimitAtTraveler',
    'isIssueQty',
    'isMoveToStock',
    'isPlacementTracking',
    'isRework',
    'createdBy',
    'colorCode',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId',
    'mountingTypeID',
    'documentPath',
    'isLoopOperation',
    'isAllowMissingPartQty',
    'isAllowBypassQty',
    'isEnablePreProgrammingPart',
    'isWaterSoluble',
    'isNoClean',
    'isFluxNotApplicable',
    'shortDescription'
];

module.exports = {
    // Retrive list of Operations
    // POST : /api/v1/operation/retriveOperationList
    // @return list of operations
    retriveOperationList: (req, res) => {
        if (req.body) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_RetrieveOperation (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: req.body.isExport ? null : filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { operation: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Retrive Operation by ID
    // GET : /api/v1/operation/:id
    // @param {id} int
    retrieveOperation: (req, res) => {
        if (req.params.id) {
            const Operation = req.app.locals.models.Operation;
            return Operation.findByPk(req.params.id)
                .then((operation) => {
                    if (!operation) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.MASTER.OPERATION_NOT_FOUND, err: null, data: null });
                    }
                    operation.opDescription = COMMON.getTextAngularValueFromDB(operation.opDescription);
                    operation.opWorkingCondition = COMMON.getTextAngularValueFromDB(operation.opWorkingCondition);
                    operation.opManagementInstruction = COMMON.getTextAngularValueFromDB(operation.opManagementInstruction);
                    operation.opDeferredInstruction = COMMON.getTextAngularValueFromDB(operation.opDeferredInstruction);
                    operation.opDoes = COMMON.getTextAngularValueFromDB(operation.opDoes);
                    operation.opDonts = COMMON.getTextAngularValueFromDB(operation.opDonts);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operation, null);
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Add Operation or Create copy of Operation
    // POST : /api/v1/operation/
    // @return new create Operation detail
    createOperation: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.opName && req.body.opNumber) {
            // As Below record is also used in EnterPrise search can not convert 'text angular' at place of it used.
            if (req.body.opName) { req.body.opName = COMMON.TEXT_WORD_CAPITAL(req.body.opName, false); }
            req.body.opDescription = COMMON.setTextAngularValueForDB(req.body.opDescription);
            req.body.opWorkingCondition = COMMON.setTextAngularValueForDB(req.body.opWorkingCondition);
            req.body.opManagementInstruction = COMMON.setTextAngularValueForDB(req.body.opManagementInstruction);
            req.body.opDeferredInstruction = COMMON.setTextAngularValueForDB(req.body.opDeferredInstruction);
            req.body.opDoes = COMMON.setTextAngularValueForDB(req.body.opDoes);
            req.body.opDonts = COMMON.setTextAngularValueForDB(req.body.opDonts);
            COMMON.setModelCreatedByFieldValue(req.body); // for get login user details.

            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_AddDuplicateOperation (:pfromOpID,:pisCheckUnique, :pIsCopyDoDont, :pIsCopyDocuments, \
                :pIsCopyDataFields, :pIsCopyParts, :pIsCopyEquipments, :pIsCopyEmployees,:pIsCopyTemplates, :popName, :popNumber, :pcolorCode, :puserID, :puserRoleId, :popDescription, \
                :popWorkingCondition, :popManagementInstruction, :popDeferredInstruction, :popDoes, :popDonts, :popOrder, :popStatus, :poperationTypeID, :pparentOPID, :pprocessTime, :psetupTime, \
                :pperPieceTime, :pqtyControl, :ptabLimitAtTraveler, :pisTeamOperation, :pisIssueQty, :pisRework, :pisMoveToStock, :pmountingTypeID, :pisPlacementTracking, :pisLoopOperation, \
                :pisAllowMissingPartQty, :pisAllowBypassQty, :pisEnablePreProgrammingPart, :pisWaterSoluble, :pisNoClean, :pisFluxNotApplicable, :pshortDescription)', {
                replacements: {
                    pfromOpID: req.body.fromOpID || null,
                    pisCheckUnique: req.body.isCheckUnique || false,
                    pIsCopyDoDont: req.body.pIsCopyDoDont || false,
                    pIsCopyDocuments: req.body.pIsCopyDocuments || false,
                    pIsCopyDataFields: req.body.pIsCopyDataFields || false,
                    pIsCopyParts: req.body.pIsCopyParts || false,
                    pIsCopyEquipments: req.body.pIsCopyEquipments || false,
                    pIsCopyEmployees: req.body.pIsCopyEmployees || false,
                    pIsCopyTemplates: req.body.pIsCopyTemplates || false,
                    popName: req.body.opName,
                    popNumber: req.body.opNumber,
                    pcolorCode: req.body.colorCode || null,
                    puserID: req.body.createdBy,
                    puserRoleId: req.body.createByRoleId,
                    popDescription: req.body.opDescription || null,
                    popWorkingCondition: req.body.opWorkingCondition || null,
                    popManagementInstruction: req.body.opManagementInstruction || null,
                    popDeferredInstruction: req.body.opDeferredInstruction || null,
                    popDoes: req.body.opDoes || null,
                    popDonts: req.body.opDonts || null,
                    popOrder: req.body.opOrder || null,
                    popStatus: req.body.opStatus || false,
                    poperationTypeID: req.body.operationTypeID || null,
                    pparentOPID: req.body.parentOPID || null,
                    pprocessTime: req.body.processTime || null,
                    psetupTime: req.body.setupTime || null,
                    pperPieceTime: req.body.perPieceTime || null,
                    pqtyControl: req.body.qtyControl || false,
                    ptabLimitAtTraveler: req.body.tabLimitAtTraveler || 0,
                    pisTeamOperation: req.body.isTeamOperation || false,
                    pisIssueQty: req.body.isIssueQty || false,
                    pisRework: req.body.isRework || false,
                    pisMoveToStock: req.body.isMoveToStock || false,
                    pmountingTypeID: req.body.mountingTypeID || null,
                    pisPlacementTracking: req.body.isPlacementTracking || false,
                    pisLoopOperation: req.body.isLoopOperation || false,
                    pisAllowMissingPartQty: req.body.isAllowMissingPartQty || false,
                    pisAllowBypassQty: req.body.isAllowBypassQty || false,
                    pisEnablePreProgrammingPart: req.body.isEnablePreProgrammingPart || false,
                    pisWaterSoluble: req.body.isWaterSoluble || false,
                    pisNoClean: req.body.isNoClean || false,
                    pisFluxNotApplicable: req.body.isFluxNotApplicable || false,
                    pshortDescription: req.body.shortDescription || null
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then((response) => {
                if (response && response.length > 0) {
                    const operation = _.values(response[0]);
                    // check woNumber is not duplicate or not exists
                    if (operation && operation[0].errorCode) {
                        if (!t.finished) { t.rollback(); }
                        if (operation[0].errorCode === DATA_CONSTANT.OPERATION_UNIQUE_FIELD_NAME.OP_NUMBER || operation[0].errorCode === DATA_CONSTANT.OPERATION_UNIQUE_FIELD_NAME.COLOR_CODE) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(operation[0].errorCode), err: null, data: null });
                        } else if (operation[0].errorCode === 'EC03') {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { fieldName: DATA_CONSTANT.OPERATION.UNIQUE_FIELD });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.FAILED, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    }
                    if (!operation || !operation[0] || !operation[0].opID || !operation[0].opNumber) {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                    const opID = operation[0].opID; // new inserted record operation id.
                    const uploadPromises = [];
                    const copyOperatonDetails = response[1] ? _.values(response[1]) : null;
                    if (req.body.pIsCopyDocuments && copyOperatonDetails && copyOperatonDetails[0]) {
                        const genericFilePathDetails = copyOperatonDetails[0];
                        const oldPartGenericFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${genericFilePathDetails.oldDocumentPath}`;
                        const newPartGenericFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${genericFilePathDetails.newDocumentPath}`;
                        fs.mkdirSync(newPartGenericFilePath, { recursive: true });
                        uploadPromises.push(module.exports.copyOperationDocument(req, t, opID, oldPartGenericFilePath, newPartGenericFilePath));
                    }
                    return Promise.all(uploadPromises).then((responses) => {
                        const anyFailedOperation = responses.find(x => x.State === STATE.FAILED);
                        if (anyFailedOperation) {
                            if (!t.finished) { t.rollback(); }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: anyFailedOperation.err, data: null });
                        } else {
                            req.params = {
                                opID: opID
                            };
                            if (req.body.opStatus && req.body.opStatus === DATA_CONSTANT.WORKORDER_OPERATION.OPSTATUS.PUBLISHED) {
                                return module.exports.setDefaultOperationMasterTemplate(req, opID, t).then((OperationMasterTemplateResponse) => {
                                    if (OperationMasterTemplateResponse && OperationMasterTemplateResponse === STATE.SUCCESS) {
                                        return t.commit().then(() => {
                                            // Add Operation detail into Elastic Search Engine for Enterprise Search
                                            EnterpriseSearchController.manageOperationDetailInElastic(req);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { opID: opID }, MESSAGE_CONSTANT.MASTER.OPERATION_CREATED);
                                        });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                }).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                return t.commit().then(() => {
                                    // Add Operation detail into Elastic Search Engine for Enterprise Search
                                    EnterpriseSearchController.manageOperationDetailInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { opID: opID }, MESSAGE_CONSTANT.MASTER.OPERATION_CREATED);
                                });
                            }
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                    });
                } else {
                    if (!t.finished) { t.rollback(); }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }
            }).catch((err) => {
                if (!t.finished) { t.rollback(); }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Copy all operation document
    // {newOpID} - New created operation id
    // {oldOpPath} - Old opeartion path
    // {newOpPath} - New create opeartion Document Path
    copyOperationDocument: (req, t, newOpID, oldOpPath, newOpPath) => {
        const { GenericFiles } = req.app.locals.models;
        return GenericFiles.findAll({
            where: {
                refTransID: newOpID,
                gencFileOwnerType: COMMON.AllEntityIDS.Operation.Name,
                entityID: COMMON.AllEntityIDS.Operation.ID
            },
            transaction: t
        }).then((genericFilesOfOpearions) => {
            const updateGenericFilePromise = [];
            _.each(genericFilesOfOpearions, (itemData) => {
                const docOldPath = `${oldOpPath}/${itemData.gencFileName}`;
                const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                const docNewPath = `${newOpPath}/${newFileName}`;
                if (fs.existsSync(docOldPath)) {
                    fsextra.copySync(docOldPath, docNewPath);
                }
                const actualGenFilePath = docNewPath.startsWith('.') ? docNewPath.replace('.', '') : null;
                const fileObj = {
                    gencFileName: newFileName,
                    genFilePath: actualGenFilePath
                };
                updateGenericFilePromise.push(GenericFiles.update(fileObj, {
                    where: {
                        gencFileID: itemData.dataValues.gencFileID
                    },
                    transaction: t,
                    attributes: ['gencFileName', 'genFilePath']
                }));
            });

            return Promise.all(updateGenericFilePromise).then(() => ({ State: STATE.SUCCESS })).catch((err) => {
                console.trace();
                console.error(err);
                return { State: STATE.FAILED, err: err };
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            return { State: STATE.FAILED, err: err };
        });
    },


    updateOperation: (req, res) => {
        if (req.params.id) {
            const { sequelize, Operation } = req.app.locals.models;

            // check existing op exists or not
            return Operation.findOne({
                where: {
                    opID: req.params.id
                },
                attributes: ['opID', 'opNumber']
            }).then((opOldDbData) => {
                if (!opOldDbData) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                }

                if (req.body.opName) { req.body.opName = COMMON.TEXT_WORD_CAPITAL(req.body.opName, false); }
                let whereStatement = [];
                if (req.body.colorCode) {
                    whereStatement = {
                        [Op.or]: { opNumber: req.body.opNumber, colorCode: req.body.colorCode },
                        opID: { [Op.ne]: req.params.id }
                    };
                } else {
                    whereStatement = {
                        opNumber: req.body.opNumber || null,
                        opID: { [Op.ne]: req.params.id }
                    };
                }
                return Operation.findAll({
                    where: whereStatement
                }).then((findOperation) => {
                    if (findOperation.length > 0) {
                        if (findOperation[0].opNumber && (findOperation[0].opNumber.toString() === req.body.opNumber)) { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.OPERATION_UNIQUE_FIELD_NAME.OP_NUMBER), err: null, data: null }); } else { return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.UNIQUE(DATA_CONSTANT.OPERATION_UNIQUE_FIELD_NAME.OP_NUMBER), err: null, data: null }); }
                    } else {
                        COMMON.setModelUpdatedByFieldValue(req);
                        req.body.opDescription = COMMON.setTextAngularValueForDB(req.body.opDescription);
                        req.body.opWorkingCondition = COMMON.setTextAngularValueForDB(req.body.opWorkingCondition);
                        req.body.opManagementInstruction = COMMON.setTextAngularValueForDB(req.body.opManagementInstruction);
                        req.body.opDeferredInstruction = COMMON.setTextAngularValueForDB(req.body.opDeferredInstruction);
                        req.body.opDoes = COMMON.setTextAngularValueForDB(req.body.opDoes);
                        req.body.opDonts = COMMON.setTextAngularValueForDB(req.body.opDonts);

                        return sequelize.transaction().then(t => Operation.update(req.body, {
                            where: {
                                opID: req.params.id
                            },
                            fields: inputFields,
                            transaction: t
                        }).then((rowsUpdated) => {
                            // Add Operation detail into Elastic Search Engine for Enterprise Search
                            req.params['opID'] = req.params.id;

                            if (rowsUpdated[0] === 1) {
                                const opDataAfterUpdatePromises = [];

                                if (req.body && req.body.opStatus === DATA_CONSTANT.WORKORDER_OPERATION.OPSTATUS.PUBLISHED) {
                                    opDataAfterUpdatePromises.push(module.exports.setDefaultOperationMasterTemplate(req, req.params.id, t));
                                }

                                if (COMMON.convertToThreeDecimal(req.body.opNumber) !== COMMON.convertToThreeDecimal(opOldDbData.dataValues.opNumber)) {
                                    const docData = {
                                        gencFileOwnerType: COMMON.AllEntityIDS.Operation.Name,
                                        refTransID: req.params.id
                                    };
                                    opDataAfterUpdatePromises.push(GenericFilesController.manageDocumentPath(req, res, docData, t));
                                }

                                return Promise.all(opDataAfterUpdatePromises).then(() => t.commit().then(() => {
                                    // Add Operation detail into Elastic Search Engine for Enterprise Search
                                    EnterpriseSearchController.manageOperationDetailInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { opID: req.params.opID }, MESSAGE_CONSTANT.MASTER.OPERATION_UPDATED);
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    t.rollback();
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                        STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            if (err.message && err.message.toLowerCase() === DATA_CONSTANT.DB_DUPLICATE_MESSAGE.DUPLICATE.toLowerCase()) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.DB_DUPLICATE_MESSAGE, err: null, data: null });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            }
                        }));
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    deleteOperation: (req, res) => {
        const { GenericFiles, sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Operation.Name;
            const entityID = COMMON.AllEntityIDS.Operation.ID;
            const Entity = COMMON.AllEntityIDS.Operation;
            let genericList = [];
            // ids = req.params.id.split(',');
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: tableName,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: req.user.id,
                        entityID: entityID,
                        refrenceIDs: null,
                        countList: req.body.objIDs.CountList,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((operationDetail) => {
                    if (operationDetail.length === 0) {
                        return GenericFiles.findAll({
                            where: {
                                refTransID: { [Op.in]: req.body.objIDs.id },
                                gencFileOwnerType: Entity.Name
                            }
                        }).then((genericfilesdata) => {
                            genericList = genericfilesdata;
                            COMMON.setModelDeletedByFieldValue(req);
                            GenericFiles.update(req.body, {
                                where: {
                                    refTransID: { [Op.in]: req.body.objIDs.id },
                                    gencFileOwnerType: Entity.Name,
                                    deletedAt: null
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy']
                            }).then(() => {
                                if (req.body.objIDs.isPermanentDelete === 'true' || req.body.objIDs.isPermanentDelete === true) {
                                    _.each(genericList, (itemData) => {
                                        const docpath = `.${itemData.genFilePath}`;
                                        fs.unlink(docpath, () => { });
                                        return Promise.resolve(itemData);
                                    });
                                }
                                // Delete UMID Detail into Elastic Search Engine for Enterprise Search
                                // Need to change timeout code due to trasaction not get updated record
                                setTimeout(() => {
                                    EnterpriseSearchController.deleteOperationDetailInElastic(req.body.objIDs.id.toString());
                                }, 2000);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.MASTER.OPERATION_DELETED);
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: operationDetail, IDs: req.body.objIDs.id }, null);
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getOperationList: (req, res) => {
        const { Operation, GenericCategory } = req.app.locals.models;
        const whereClause = {
            opStatus: COMMON.DisplayStatus.Published.ID
        };
        if (req.query.excludeOpID) {
            whereClause.opID = { [Op.ne]: req.query.excludeOpID };
        }
        Operation.findAll(
            {
                where: whereClause,
                attributes: ['opID', 'opName', 'opNumber', 'opStatus', 'operationTypeID', 'qtyControl', 'isIssueQty', 'isRework', 'isMoveToStock', 'isPlacementTracking', 'isWaterSoluble', 'isNoClean', 'isFluxNotApplicable'],
                include: [{
                    model: GenericCategory,
                    as: 'operationType',
                    required: false,
                    attributes: ['gencCategoryID', 'gencCategoryCode', 'gencCategoryName']
                }]
            }
        ).then(operation => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operation, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    /* retrive operation profile*/
    retrieveOperationProfile: (req, res) => {
        const { Operation, OperationDataelement, OperationPart, Employee, OperationEmployee, OperationEquipment, Equipment,
            Department, WorkorderOperation, Workorder, StandardClass, CertificateStandards,
            WorkorderCertification, DataElement, GenericCategory, EmployeeDepartment,
            Component, WorkorderSalesOrderDetails, RFQRoHS, sequelize } = req.app.locals.models;
        if (req.params.id) {
            return Operation.findOne({
                where: { opID: req.params.id },
                attributes: ['opNumber', 'opName', 'opStatus', 'opDescription', 'colorCode', 'opDoes', 'opDonts', 'isWaterSoluble', 'isNoClean', 'isFluxNotApplicable'],
                include: [{
                    model: OperationEquipment,
                    as: 'operationEquipment',
                    attributes: ['opEqpID', 'opID', 'eqpID'],
                    include: [{
                        model: Equipment,
                        as: 'equipment',
                        attributes: ['eqpID', 'assetName', 'assetNumber', 'eqpMake', 'eqpModel', 'eqpYear', 'eqpTypeID', 'locationTypeID', 'departmentID'],
                        include: [{
                            model: GenericCategory,
                            as: 'equipmentType',
                            attributes: ['gencCategoryName', 'gencCategoryID']
                        },
                        {
                            model: GenericCategory,
                            as: 'locationType',
                            attributes: ['gencCategoryID', 'gencCategoryName']
                        },
                        {
                            model: Department,
                            as: 'equipmentDepartment',
                            attributes: ['deptID', 'deptName']
                        }]
                    }],
                    required: false
                }, {
                    model: OperationPart,
                    as: 'operationsParts',
                    attributes: ['opPartID', 'opID', 'partID'],
                    where: {
                        opID: req.params.id
                    },
                    include: [{
                        model: Component,
                        as: 'componentSupplyMaterial',
                        attributes: ['PIDCode', 'mfgPN', 'imageURL', 'documentPath', 'dataSheetLink', 'RoHSStatusID', 'id', 'mfgPNDescription', 'nickName'],
                        include: [{
                            model: RFQRoHS,
                            as: 'rfq_rohsmst',
                            attributes: ['name', 'rohsIcon']
                        }],
                        required: false
                    }],
                    required: false
                },
                {
                    model: OperationEmployee,
                    as: 'operationEmployee',
                    attributes: ['opEmployeeID', 'opID', 'employeeID'],
                    include: [{
                        model: Employee,
                        as: 'Employee',
                        attributes: ['firstName', 'lastName', [sequelize.literal('CONCAT(`operationEmployee->Employee`.firstName , \' \' ,`operationEmployee->Employee`.lastName)'), 'fullName'], 'id'],
                        where:
                        {
                            isDeleted: false
                        },
                        include: [
                            {
                                model: EmployeeDepartment,
                                as: 'employeeDepartment',
                                attributes: ['departmentID', 'titleID'],
                                required: false,
                                where: {
                                    isDefault: true
                                },
                                include: [
                                    {
                                        model: Department,
                                        as: 'department',
                                        attributes: ['deptName']
                                    },
                                    {
                                        model: GenericCategory,
                                        as: 'genericCategory',
                                        attributes: ['gencCategoryName']
                                    }
                                ]
                            },
                            {
                                model: Employee,
                                as: 'managerEmployee',
                                attributes: ['firstName', 'lastName', [sequelize.literal('CONCAT(`operationEmployee->Employee->managerEmployee`.firstName , \' \' ,`operationEmployee->Employee->managerEmployee`.lastName)'), 'fullName']],
                                required: false
                            }
                        ],
                        required: false
                    }
                    ]
                },
                {
                    model: WorkorderOperation,
                    as: 'workorderOperation',
                    attributes: ['woOPID', 'opID', 'woID'],
                    include: [{
                        model: Workorder,
                        as: 'workorder',
                        attributes: ['woID', 'woNumber', 'buildQty', 'woStatus', 'woSubStatus', 'RoHSStatusID', 'woVersion', 'partID'],
                        include: [{
                            model: WorkorderCertification,
                            as: 'workorderCertification',
                            attributes: ['woCertificationID', 'woID', 'certificateStandardID', 'classIDs'],
                            include: [{
                                model: CertificateStandards,
                                as: 'certificateStandards',
                                attributes: ['certificateStandardID', 'fullName', 'shortName', 'standardTypeID', 'priority', 'standardInfo']
                            },
                            {
                                model: StandardClass,
                                as: 'standardsClass',
                                attributes: ['certificateStandardID', 'classID', 'className', 'colorCode']

                            }]
                        },
                        {
                            model: Component,
                            as: 'componentAssembly',
                            attributes: ['mfgPN', 'PIDCode', 'nickName', 'rev', 'id', 'mfgPNDescription']
                        }, {
                            model: WorkorderSalesOrderDetails,
                            as: 'WoSalesOrderDetails',
                            attributes: ['woID', 'poQty', [sequelize.literal('fun_getPONumber(salesOrderDetailID)'), 'refPONumber']]

                        }, {
                            model: RFQRoHS,
                            as: 'rohs',
                            attributes: ['id', 'name', 'rohsIcon']

                        }]

                    }],
                    required: false
                }, {
                    model: OperationDataelement,
                    as: 'operationDataelement',
                    attributes: ['opDataElementID', 'opID', 'dataElementID', 'displayOrder'],
                    include: [{
                        model: DataElement,
                        as: 'DataElement',
                        attributes: ['dataElementID', 'dataElementName', 'controlTypeID', 'parentDataElementID']
                    }],
                    required: false
                }, {
                    model: GenericCategory,
                    as: 'operationType',
                    attributes: ['gencCategoryName'],
                    required: false
                },
                {
                    model: Operation,
                    as: 'parentOperation',
                    attributes: ['opName'],
                    required: false
                }
                ]
            }).then((data) => {
                const obj = {};
                if (data) {
                    data.opDescription = COMMON.getTextAngularValueFromDB(data.opDescription);
                    data.opWorkingCondition = COMMON.getTextAngularValueFromDB(data.opWorkingCondition);
                    data.opManagementInstruction = COMMON.getTextAngularValueFromDB(data.opManagementInstruction);
                    data.opDeferredInstruction = COMMON.getTextAngularValueFromDB(data.opDeferredInstruction);
                    data.opDoes = COMMON.getTextAngularValueFromDB(data.opDoes);
                    data.opDonts = COMMON.getTextAngularValueFromDB(data.opDonts);
                }
                obj.operationProfile = data;
                if (obj) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, obj, null);
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(operationModuleName), err: null, data: null });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    getAllOperationDetail: (req, res) => {
        const { Operation } = req.app.locals.models;
        let whereclause = {};
        if (req.query.searchquery) {
            whereclause = {
                [Op.or]: { opNumber: { [Op.like]: `%${req.query.searchquery}%` }, opName: { [Op.like]: `%${req.query.searchquery}%` } }
            };
        }
        Operation.findAll({
            where: whereclause,
            attributes: ['opID', 'opName', 'opNumber'],
            order: [
                ['opNumber', 'ASC']
            ]
        }).then(operationList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operationList)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // get all master template
    // @return master template list
    retrievetemplateOperationDetails: (req, res) => {
        const { MasterTemplate, OperationMasterTemplates } = req.app.locals.models;
        MasterTemplate.findAll({
            attributes: ['id', 'masterTemplate', 'description'],
            where: { isMasterTemplate: { [Op.ne]: true } },
            include: [{
                model: OperationMasterTemplates,
                as: 'operationMasterTemplates',
                attributes: ['masterTemplateId', 'operationId']
            }]
        }).then(templates => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, templates)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // update operation in master template
    // @return master template with new operation
    setDefaultOperationMasterTemplate: (req, operationID, t) => {
        const { MasterTemplate, OperationMasterTemplates } = req.app.locals.models;
        if (operationID) {
            return MasterTemplate.findAll({
                where: { isMasterTemplate: true, isDeleted: false },
                attributes: ['id', 'masterTemplate'],
                transaction: t
            }).then((templateList) => {
                var promises = [];
                _.each(templateList, (template) => {
                    promises.push(OperationMasterTemplates.findOne({
                        where: { masterTemplateId: template.id, operationId: operationID, isDeleted: false },
                        attributes: ['masterTemplateId', 'operationId'],
                        transaction: t
                    }).then((data) => {
                        if (!data) {
                            const objTemplate = {
                                masterTemplateId: template.id,
                                operationId: operationID,
                                isDeleted: false,
                                isActive: true,
                                createdBy: req.user.id
                            };
                            return OperationMasterTemplates.create(objTemplate, {
                                fields: ['masterTemplateId', 'operationId', 'isDeleted', 'isActive', 'createdBy', 'createByRoleId', 'updateByRoleId'],
                                transaction: t
                            }).then(() => STATE.SUCCESS).catch((err) => {
                                console.trace();
                                console.error(err);
                                return STATE.FAILED;
                            });
                        } else {
                            return STATE.SUCCESS;
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return STATE.FAILED;
                    }));
                });
                return Promise.all(promises).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return STATE.FAILED;
            });
        } else {
            return STATE.SUCCESS;
        }
    },

    checkDuplicateOpNumber: (req, res) => {
        const { Operation } = req.app.locals.models;
        if (req.body) {
            const whereClauseStandard = {
                opNumber: req.body.opNumber
            };
            if (req.body.opID) {
                whereClauseStandard.opID = { [Op.notIn]: [req.body.opID] };
            }
            return Operation.findOne({
                where: whereClauseStandard,
                attributes: ['opID']
            }).then((operation) => {
                if (operation) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: null, err: null, data: { isDuplicateOpNumber: true } });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { isDuplicateOpNumber: false }, null);
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

    // get all operation list which all are in published mode
    getAllPublishedOpMasterList: (req, res) => {
        const { Operation, sequelize } = req.app.locals.models;
        Operation.findAll(
            {
                where: { opStatus: COMMON.DisplayStatus.Published.ID },
                attributes: ['opID', 'opName', 'opNumber', 'opStatus', 'shortDescription', 'isMoveToStock', [sequelize.fn('fun_getMountingTypeNameByID', sequelize.col('Operation.mountingTypeId')), 'mountingType'],
                    [sequelize.fn('fun_getGenericCategoryNameByID', sequelize.col('Operation.operationTypeID')), 'operationType'], [sequelize.fn('fun_getOpStatusNameByID', sequelize.col('Operation.opStatus')), 'opStatusConvertedValue']]
            }
        ).then(operationList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, operationList)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        });
    },

    // Retrive list of Draft Operations by master template
    // POST : /api/v1/operation/retriveDraftOperationsByMasterTemplate
    // @return list of Draft Operations by master template
    retriveDraftOperationsByMasterTemplate: (req, res) => {
        if (req.body && req.body.masterTemplateId) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_RetrieveDraftOperationsbyMasterTemplate (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pmasterTemplateId)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: filter.limit,
                            pOrderBy: filter.strOrderBy || null,
                            pWhereClause: strWhere,
                            pmasterTemplateId: req.body.masterTemplateId
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { operation: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }
};
