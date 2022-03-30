/* eslint-disable global-requries */
const resHandler = require('../../resHandler');
const moment = require('moment');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const _ = require('lodash');
const GenericAuthenticationController = require('../../generic_authentication/controllers/GenericAuthenticationController');

const currentModuleName = DATA_CONSTANT.WORKORDER_TRANS_UMID_DETAILS.DISPLAYNAME;

const inputFields = [
    'id',
    'woTransID',
    'eqpFeederID',
    'refsidid',
    'mfgPNID',
    'woOpEqpID',
    'retrunQty',
    'UOM',
    'isDeleted',
    'reelStatus',
    'changedBy',
    'changedOn',
    'isVerified',
    'verifiedBy',
    'verifiedOn',
    'toRefUIDId',
    'rfqLineItemID',
    'woOPID',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'deletedBy',
    'isDeleted',
    'deletedAt',
    'refDesig',
    'assyQty',
    'approvedBy',
    'approvedOn',
    'approvedReason'
];



module.exports = {
    // Retrive list of workorder transaction umid transaction
    // GET : /api/v1/umid_transaction
    // @return list of umid transaction
    retriveFeederTransaction: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }

        sequelize
            .query('CALL Sproc_RetrieveWorkorderTransEquipmentFeederDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pWoOpEqpID, :pWoOpID, :pWoTransID, :pisVerify, :ptransactionType)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pWoOpEqpID: req.query.woOpEqpID ? req.query.woOpEqpID : null,
                        pWoOpID: req.query.woOPID ? req.query.woOPID : null,
                        pWoTransID: req.query.woTransID ? req.query.woTransID : null,
                        pisVerify: req.query.isVerify ? (req.query.isVerify.toString() === 'true' ? true : false) : false,
                        ptransactionType: req.query.transactionType ? req.query.transactionType : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { feeder: _.values(response[1]), Count: response[0][0]['TotalRecord'], lineItems: _.values(response[2]) })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },


    // Retrive list of workorder transaction umid transaction
    // GET : /api/v1/feeder_change_transaction
    // @return list of feeder change transaction
    retriveFeederChangeTransaction: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }

        sequelize
            .query('CALL Sproc_RetrieveWOTransEquipmentFeederChangeDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pWoOpEqpID, :peqpFeederID)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pWoOpEqpID: req.query.woOpEqpID ? req.query.woOpEqpID : null,
                        peqpFeederID: req.query.eqpFeederID ? req.query.eqpFeederID : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { feeder: _.values(response[1]), Count: response[0][0]['TotalRecord'] }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Retrive list of workorder verify umid transaction
    // GET : /api/v1/feeder_verification_transaction
    // @return list of feeder verification transaction
    retriveFeederVerificationTransaction: (req, res) => {
        const { sequelize } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        let strOrderBy = null;
        if (filter.order[0]) {
            strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
        }

        sequelize
            .query('CALL Sproc_RetrieveWOTransEquipmentFeederVerificationDetails (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pWoTransUMIDDetID, :ptransactionType)',
                {
                    replacements: {
                        ppageIndex: req.query.page,
                        precordPerPage: filter.limit,
                        pOrderBy: strOrderBy,
                        pWhereClause: strWhere,
                        pWoTransUMIDDetID: req.query.woTransUMIDDetID ? req.query.woTransUMIDDetID : null,
                        ptransactionType: req.query.transactionType ? req.query.transactionType : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { feeder: _.values(response[1]), Count: response[0][0]['TotalRecord'] })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
    },

    // Update umid transaction
    // PUT : /api/v1/umid_transaction
    // @return API response
    updateFeederTransaction: (req, res) => {
        const { WorkorderTransactionUMIDDetails } = req.app.locals.models;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return WorkorderTransactionUMIDDetails.update(req.body, {
                where: {
                    id: req.params.id
                },
                fields: inputFields
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.UPDATED(currentModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Create umid transaction
    // POST : /api/v1/umid_transaction
    // @return new created umid
    createFeederTransaction: (req, res) => {
        const { WorkorderTransactionUMIDDetails } = req.app.locals.models;
        if (req.body) {
            COMMON.setModelCreatedByFieldValue(req);
            return WorkorderTransactionUMIDDetails.create(req.body, {
                fields: inputFields
            }).then(feeder => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, feeder, MESSAGE_CONSTANT.CREATED(currentModuleName))).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err.errors.map(e => e.message).join(','), data: null });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                }
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Remove umid transaction
    // POST : /api/v1/umid_transaction/deleteUMIDTransaction
    // @return list of feeder by ID
    deleteFeederTransaction: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)',
                {
                    replacements: {
                        tableName: COMMON.AllEntityIDS.WORKORDER_OPERATION_EQUIPMENT_FEEDER_DETAILS.Name,
                        IDs: req.body.objIDs.id.toString(),
                        deletedBy: COMMON.getRequestUserID(req),
                        entityID: null,
                        refrenceIDs: null,
                        countList: null,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    }
                }).then((response) => {
                    if (response.length === 0) {
                        const objMessage = req.body.objIDs.isImportAndDelete ? null : { userMessage: MESSAGE_CONSTANT.DELETED(currentModuleName) };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, objMessage);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: response, IDs: req.body.objIDs.id }, null);
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

    // Scan Feeder First Details and Validate
    // POST : /api/v1/umid_transaction/validateScanFeederFirst
    // @return list of feeder by ID
    validateScanFeederFirst: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.feederObj.feederLocation) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_ValidateScanFeederFirst (:pfeederLocation,:pUMID,:ppartID,:pwoOpEqpID, :pwoOpID,:pwoTransID,:pemployeeId,:pcheckKitAllocation, :pverificationType, :pisVerify, :ptransactionType, :pisChangeReel, :preelChangeType, :ptoBinID, :pOldUMID, :pisConfirmed, :pwoID, :pCreatedBy, :pApprovedBy, :pApprovedReason )',
                {
                    replacements: {
                        pfeederLocation: req.body.feederObj.feederLocation || null,
                        pUMID: req.body.feederObj.UMID || null,
                        ppartID: req.body.feederObj.partID || null,
                        pwoOpEqpID: req.body.feederObj.woOpEqpID || null,
                        pwoOpID: req.body.feederObj.woOPID || null,
                        pwoTransID: req.body.feederObj.woTransID || null,
                        pemployeeId: req.body.feederObj.employeeId || null,
                        pcheckKitAllocation: req.body.feederObj.checkKitAllocation || false,
                        pverificationType: req.body.feederObj.verificationType || null,
                        pisVerify: req.body.feederObj.isVerify || false,
                        ptransactionType: req.body.feederObj.transactionType || null,
                        pisChangeReel: false,
                        preelChangeType: null,
                        ptoBinID: null,
                        pOldUMID: null,
                        pisConfirmed: req.body.feederObj.isConfirmed || false,
                        pwoID: req.body.feederObj.woID || null,
                        pCreatedBy: req.user.id,
                        pApprovedBy: req.body.feederObj.authenticationApprovedDet ? req.body.feederObj.authenticationApprovedDet.approvedBy : null,
                        pApprovedReason: req.body.feederObj.authenticationApprovedDet ? req.body.feederObj.authenticationApprovedDet.approvalReason : null
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    // 0 - uid verification history
                    // 1 - error
                    // 2 - feeder/umid details for ui
                    if (resultData && resultData.length > 0) {
                        const umidTransferDetails = resultData[0] ? _.values(resultData[0]) : null;
                        const umidVerificationDetails = resultData[1] ? _.values(resultData[1]) : null;
                        const resData = resultData[2] ? _.values(resultData[2]) : null;
                        const umidDet = resultData[3] ? _.values(resultData[3]) : null;
                        const feederDet = resultData[4] ? _.values(resultData[4]) : null;
                        const allocatedUMIDList = resultData[5] ? _.values(resultData[5]) : null;
                        const umidTransDet = resultData[6] ? _.first(_.values(resultData[6])) : null;

                        module.exports.findErrorCodeMessageAndUpdate(req, res, resData);
                        const promises = [];
                        if (req.body.feederObj.authenticationApprovedDet && umidTransDet && umidTransDet.temp_last_inserted_umid_id) {
                            req.body.authenticationApprovedDet = req.body.feederObj.authenticationApprovedDet;
                            req.body.authenticationApprovedDet.refID = umidTransDet.temp_last_inserted_umid_id;
                            promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                        }
                        return Promise.all(promises).then(() => t.commit().then(() => {
                            // in this case error sent from SP is logical so  we are doing commit in all case.
                            if (resData && resData.length > 0) {
                                const errorFound = _.find(resData, item => item.errorText);
                                if (errorFound) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { umidDetails: umidDet, feederDetails: feederDet, errorObjList: resData, uidVerificationDet: umidVerificationDetails, allocatedUMIDList: allocatedUMIDList, umidTransferDet: umidTransferDetails }, null);
                                }
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { umidDetails: umidDet, feederDetails: feederDet, uidVerificationDet: umidVerificationDetails, allocatedUMIDList: allocatedUMIDList, umidTransferDet: umidTransferDetails });
                        })).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    t.rollback();
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Scan UMID First Details and Validate
    // POST : /api/v1/umid_transaction/validateScanUMIDFirst
    // @return list of feeder by ID
    validateScanUMIDFirst: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.umidObj.UMID) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_ValidateScanUMIDFirst (:pUMID, :pfeederLocation,:ppartID,:pwoOpEqpID, :pwoOpID,:pwoTransID,:pemployeeId,:pcheckKitAllocation, :pverificationType, :pisVerify, :ptransactionType, :pisChangeReel, :preelChangeType, :ptoBinID, :pOldUMID, :pisConfirmed, :pwoID,:pCreatedBy, :pApprovedBy, :pApprovedReason)',
                {
                    replacements: {
                        pUMID: req.body.umidObj.UMID || null,
                        pfeederLocation: req.body.umidObj.feederLocation || null,
                        ppartID: req.body.umidObj.partID || null,
                        pwoOpEqpID: req.body.umidObj.woOpEqpID || null,
                        pwoOpID: req.body.umidObj.woOPID || null,
                        pwoTransID: req.body.umidObj.woTransID || null,
                        pemployeeId: req.body.umidObj.employeeId || null,
                        pcheckKitAllocation: req.body.umidObj.checkKitAllocation || false,
                        pverificationType: req.body.umidObj.verificationType || null,
                        pisVerify: req.body.umidObj.isVerify || false,
                        ptransactionType: req.body.umidObj.transactionType || null,
                        pisChangeReel: false,
                        preelChangeType: null,
                        ptoBinID: null,
                        pOldUMID: null,
                        pisConfirmed: req.body.umidObj.isConfirmed || false,
                        pwoID: req.body.umidObj.woID || null,
                        pCreatedBy: req.user.id,
                        pApprovedBy: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvedBy : null,
                        pApprovedReason: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvalReason : null
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    // 0 - uid verification history
                    // 1 - error
                    // 2 - feeder/umid details for ui
                    if (resultData && resultData.length > 0) {
                        const umidTransferDetails = resultData[0] ? _.values(resultData[0]) : null;
                        const umidVerificationDetails = resultData[1] ? _.values(resultData[1]) : null;
                        const resData = resultData[2] ? _.values(resultData[2]) : null;
                        const umidDet = resultData[3] ? _.values(resultData[3]) : null;
                        const feederDet = resultData[4] ? _.values(resultData[4]) : null;
                        const allocatedUMIDList = resultData[5] ? _.values(resultData[5]) : null;
                        const umidTransDet = resultData[6] ? _.first(_.values(resultData[6])) : null;

                        module.exports.findErrorCodeMessageAndUpdate(req, res, resData);
                        const promises = [];
                        if (req.body.umidObj.authenticationApprovedDet && umidTransDet && umidTransDet.temp_last_inserted_umid_id) {
                            req.body.authenticationApprovedDet = req.body.umidObj.authenticationApprovedDet;
                            req.body.authenticationApprovedDet.refID = umidTransDet.temp_last_inserted_umid_id;
                            promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                        }
                        return Promise.all(promises).then(() => t.commit().then(() => {
                            // in this case error sent from SP is logical so  we are doing commit in all case.
                            if (resData && resData.length > 0) {
                                const errorFound = _.find(resData, item => item.errorText);
                                if (errorFound) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { umidDetails: umidDet, feederDetails: feederDet, errorObjList: resData, uidVerificationDet: umidVerificationDetails, umidTransferDet: umidTransferDetails, allocatedUMIDList: allocatedUMIDList }, null);
                                }
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { umidDetails: umidDet, feederDetails: feederDet, uidVerificationDet: umidVerificationDetails });
                        })).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    t.rollback();
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Scan UMID First Details and Validate
    // POST : /api/v1/umid_transaction/validateScanChangeReel
    // @return list of feeder by ID
    validateScanChangeReel: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.umidObj.OldUMID) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_ValidateScanChangeReel (:pOldUMID, :pfeederLocation, :pNewUMID, :ppartID,:pwoOpEqpID, :pwoOpID,:pwoTransID,:pemployeeId,:pcheckKitAllocation, :pverificationType, :pisVerify, :ptransactionType, :preelChangeType, :ptoBinID, :pisConfirmed, :pwoID, :pCreatedBy, :pApprovedBy, :pApprovedReason)',
                {
                    replacements: {
                        pOldUMID: req.body.umidObj.OldUMID || null,
                        pfeederLocation: req.body.umidObj.feederLocation || null,
                        pNewUMID: req.body.umidObj.NewUMID || null,
                        ppartID: req.body.umidObj.partID || null,
                        pwoOpEqpID: req.body.umidObj.woOpEqpID || null,
                        pwoOpID: req.body.umidObj.woOPID || null,
                        pwoTransID: req.body.umidObj.woTransID || null,
                        pemployeeId: req.body.umidObj.employeeId || null,
                        pcheckKitAllocation: req.body.umidObj.checkKitAllocation || false,
                        pverificationType: req.body.umidObj.verificationType || null,
                        pisVerify: req.body.umidObj.isVerify || false,
                        ptransactionType: req.body.umidObj.transactionType || null,
                        preelChangeType: req.body.umidObj.reelChangeType || null,
                        ptoBinID: req.body.umidObj.toBinID || null,
                        pisConfirmed: req.body.umidObj.isConfirmed || false,
                        pwoID: req.body.umidObj.woID || null,
                        pCreatedBy: req.user.id,
                        pApprovedBy: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvedBy : null,
                        pApprovedReason: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvalReason : null
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    // 0 - uid verification history
                    // 1 - error
                    // 2 - feeder/umid details for ui
                    if (resultData && resultData.length > 0) {
                        const umidTransferDetails = resultData[0] ? _.values(resultData[0]) : null;
                        const umidVerificationDetails = resultData[1] ? _.values(resultData[1]) : null;
                        const resData = resultData[2] ? _.values(resultData[2]) : null;
                        const newUmidDet = resultData[3] ? _.values(resultData[3]) : null;
                        const feederDet = resultData[4] ? _.values(resultData[4]) : null;
                        const allocatedUMIDList = resultData[5] ? _.values(resultData[5]) : null;
                        const umidTransDet = resultData[6] ? _.first(_.values(resultData[6])) : null;
                        const oldUmidDet = resultData[7] ? _.values(resultData[7]) : null;

                        module.exports.findErrorCodeMessageAndUpdate(req, res, resData);
                        const promises = [];
                        if (req.body.umidObj.authenticationApprovedDet && umidTransDet && umidTransDet.temp_last_inserted_umid_id) {
                            req.body.authenticationApprovedDet = req.body.umidObj.authenticationApprovedDet;
                            req.body.authenticationApprovedDet.refID = umidTransDet.temp_last_inserted_umid_id;
                            promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                        }
                        return Promise.all(promises).then(() => t.commit().then(() => {
                            // in this case error sent from SP is logical so  we are doing commit in all case.
                            if (resData && resData.length > 0) {
                                const errorFound = _.find(resData, item => item.errorText);
                                if (errorFound) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { oldUMIDDetails: oldUmidDet, feederDetails: feederDet, newUMIDDetails: newUmidDet, errorObjList: resData, uidVerificationDet: umidVerificationDetails, allocatedUMIDList: allocatedUMIDList, umidTransferDet: umidTransferDetails }, null);
                                }
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { oldUMIDDetails: oldUmidDet, feederDetails: feederDet, newUMIDDetails: newUmidDet, uidVerificationDet: umidVerificationDetails, allocatedUMIDList: allocatedUMIDList, umidTransferDet: umidTransferDetails });
                        })).catch((err) => {
                            t.rollback();
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    t.rollback();
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Scan UMID Only and Validate
    // POST : /api/v1/umid_transaction/validateScanUMIDOnly
    // @return list of feeder by ID
    validateScanUMIDOnly: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.umidObj.UMID) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_validateScanUMIDOnly (:pUMID, :ppartID,:pwoOpID,:pwoTransID,:pemployeeId,:pcheckKitAllocation, :pverificationType, :pisVerify, :ptransactionType, :prfqLineItemsID, :pisConfirmed, :pwoID,:pCreatedBy,:pisPlacementTracking,:psaveUMIDDetails, :prefDesig, :passyQty, :pApprovedBy, :pApprovedReason)',
                {
                    replacements: {
                        pUMID: req.body.umidObj.UMID || null,
                        ppartID: req.body.umidObj.partID || null,
                        pwoOpID: req.body.umidObj.woOPID || null,
                        pwoTransID: req.body.umidObj.woTransID || null,
                        pemployeeId: req.body.umidObj.employeeId || null,
                        pcheckKitAllocation: req.body.umidObj.checkKitAllocation || false,
                        pverificationType: req.body.umidObj.verificationType || null,
                        pisVerify: req.body.umidObj.isVerify || false,
                        ptransactionType: req.body.umidObj.transactionType || false,
                        prfqLineItemsID: req.body.umidObj.rfqLineItemsID || null,
                        pisConfirmed: req.body.umidObj.isConfirmed || false,
                        pwoID: req.body.umidObj.woID || null,
                        pCreatedBy: req.user.id,
                        pisPlacementTracking: req.body.umidObj.isPlacementTracking || false,
                        psaveUMIDDetails: req.body.umidObj.saveUMIDDetails || false,
                        prefDesig: req.body.umidObj.refDesig || null,
                        passyQty: req.body.umidObj.assyQty || null,
                        pApprovedBy: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvedBy : null,
                        pApprovedReason: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvalReason : null
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    // 0 - lineitem details
                    // 1 - uid verification history
                    // 2 - error
                    // 3 - umid details for ui
                    if (resultData) {
                        const bomLineItemDetails = resultData[0] ? _.values(resultData[0]) : null;
                        const umidVerificationDetails = resultData[1] ? _.values(resultData[1]) : null;
                        const resData = resultData[2] ? _.values(resultData[2]) : null;
                        const details = resultData[3] ? _.values(resultData[3]) : null;
                        const umidTransDet = resultData[4] ? _.values(resultData[4]) : null;

                        module.exports.findErrorCodeMessageAndUpdate(req, res, resData);
                        const promises = [];
                        if (req.body.umidObj.authenticationApprovedDet) {
                            req.body.authenticationApprovedList = [];
                            // all umid details authentication records
                            _.each(umidTransDet, (transDet) => {
                                if (transDet && transDet.id) {
                                    const obj = req.body.umidObj.authenticationApprovedDet;
                                    obj.refID = transDet.id;
                                    req.body.authenticationApprovedList.push(obj);
                                }
                            });
                            promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonListWithWorkingProcess(req, t));
                        }
                        return Promise.all(promises).then(() => t.commit().then(() => {
                            // in this case error sent from SP is logical so  we are doing commit in all case.
                            if (resData && resData.length > 0) {
                                const errorFound = _.find(resData, item => item.errorText);
                                if (errorFound) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { bomLineItemDetails: bomLineItemDetails, umidDetails: details, errorObjList: resData, uidVerificationDet: umidVerificationDetails }, null);
                                }
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { bomLineItemDetails: bomLineItemDetails, umidDetails: details, uidVerificationDet: umidVerificationDetails });
                        })).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Find error code message and update
    findErrorCodeMessageAndUpdate: (req, res, resData) => {
        _.each(resData, (errorItem) => {
            let errorDetails = '';
            const errDet = _.find(DATA_CONSTANT.SCAN_ERROR_CODE, item => item.CODE === errorItem.errorText);
            if (errDet) {
                if (errorItem.errorText === 'UMID011') {
                    const dateObj = errorItem.stringText2 ? JSON.parse(errorItem.stringText2) : null;
                    const date = errorItem.stringText1 ? moment(errorItem.stringText1).format(dateObj.placeholder) : null;
                    errorDetails = COMMON.stringFormat(errDet.NAME, date);
                    errorItem.errorText = errorDetails;
                } else if ((errorItem.errorText === 'UMID041') ||
                    (errorItem.errorText === 'UMID044')) {
                    const umidObj = errorItem.stringText1 ? errorItem.stringText1 : null;
                    errorItem.errorText = COMMON.stringFormat(errDet.NAME, umidObj);
                } else if (errorItem.errorText === 'UMID052') {
                    errorItem.errorText = COMMON.stringFormat(errDet.NAME, errorItem.stringText1 ? errorItem.stringText1 : '', errorItem.stringText2 ? errorItem.stringText2 : '');
                } else {
                    errorItem.errorText = errDet.NAME;
                }
                // errorItem.status = errDet.STATUS;
            }
        });
    },


    // Delete work-order umid details
    // DELETE : /api/v1/umid_transaction/deleteWorkorderTransUMIDDetails
    // @param {id} int
    // @param {isPermanentDelete} boolean
    // @return API response
    deleteWorkorderTransUMIDDetails: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Workorder_Trans_UMID_Details.Name;
            const entityID = COMMON.AllEntityIDS.Workorder_Trans_UMID_Details.ID;
            // let workOrderIds = req.params.id.split(',') || [];

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
                }).then((workorderDetail) => {
                    if (workorderDetail.length === 0) {
                        COMMON.setModelDeletedByFieldValue(req);
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.DELETED(currentModuleName) });
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { transactionDetails: workorderDetail, IDs: req.body.objIDs.id }, null);
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

    // Scan Feeder First Details and Validate
    // POST : /api/v1/umid_transaction/validateScanFeederForSearch
    // @return list of feeder by ID
    validateScanFeederForSearch: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.feederObj && req.body.feederObj.feederLocation) {
            return sequelize.query('CALL Sproc_GetAllocatedUMIDListByFeederLocation (:pfeederLocation,:ppartID,:pwoOpEqpID, :pwoOpID,:pwoTransID, :pwoID)',
                {
                    replacements: {
                        pfeederLocation: req.body.feederObj.feederLocation || null,
                        ppartID: req.body.feederObj.partID || null,
                        pwoOpEqpID: req.body.feederObj.woOpEqpID || null,
                        pwoOpID: req.body.feederObj.woOPID || null,
                        pwoTransID: req.body.feederObj.woTransID || null,
                        pwoID: req.body.feederObj.woID || null
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(resultData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { allocatedUMIDList: _.values(resultData[0]), invalidMessage: _.values(resultData[1]) })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get Feeder detail from umid
    // POST : /api/v1/umid_transaction/getFeederDeatilFromUMID
    // @return list of feeder by UMID
    getFeederDeatilFromUMID: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.params.pUMID) {
            return sequelize.query('CALL Sproc_GetFeederUMID (:pUMID)',
                {
                    replacements: {
                        pUMID: req.params.pUMID || null
                    }
                }).then(resultData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resultData)).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Scan UMID Only and Validate for Missing Material
    // GET : /api/v1/umid_transaction/validateScanMissingUMIDOnly
    // @return list of feeder by ID
    validateScanMissingUMIDOnly: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.umidObj.UMID) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_validateScanMissingUMIDOnly (:pUMID, :ppartID,:pwoOpID,:pwoTransID,:pemployeeId,:pcheckKitAllocation, :pverificationType, :pisVerify, :ptransactionType, :prfqLineItemsID, :pisConfirmed, :pwoID,:pisPlacementTracking,:psaveUMIDDetails, :prefDesig, :passyQty, :pConsumeQty, :pUMIDAllocateStatus, :pCreatedBy, :pCreatedByRoleId, :pApprovedBy, :pApprovedReason)',
                {
                    replacements: {
                        pUMID: req.body.umidObj.UMID || null,
                        ppartID: req.body.umidObj.partID || null,
                        pwoOpID: req.body.umidObj.woOPID || null,
                        pwoTransID: req.body.umidObj.woTransID || null,
                        pemployeeId: req.body.umidObj.employeeId || null,
                        pcheckKitAllocation: req.body.umidObj.checkKitAllocation || false,
                        pverificationType: req.body.umidObj.verificationType || null,
                        pisVerify: req.body.umidObj.isVerify || false,
                        ptransactionType: req.body.umidObj.transactionType || false,
                        prfqLineItemsID: req.body.umidObj.rfqLineItemsID || null,
                        pisConfirmed: req.body.umidObj.isConfirmed || false,
                        pwoID: req.body.umidObj.woID || null,
                        pisPlacementTracking: req.body.umidObj.isPlacementTracking || false,
                        psaveUMIDDetails: req.body.umidObj.saveUMIDDetails || false,
                        prefDesig: req.body.umidObj.refDesig || null,
                        passyQty: req.body.umidObj.assyQty || null,
                        pConsumeQty: req.body.umidObj.consumeQty || 0,
                        pUMIDAllocateStatus: req.body.umidObj.umidAllocateStatus || 0,
                        pCreatedBy: req.user.id,
                        pCreatedByRoleId: req.body.umidObj.createdByRoleId,
                        pApprovedBy: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvedBy : null,
                        pApprovedReason: req.body.umidObj.authenticationApprovedDet ? req.body.umidObj.authenticationApprovedDet.approvalReason : null
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    // 0 - lineitem details
                    // 1 - uid verification history
                    // 2 - error
                    // 3 - umid details for ui
                    if (resultData) {
                        const bomLineItemDetails = resultData[0] ? _.values(resultData[0]) : null;
                        const umidVerificationDetails = resultData[1] ? _.values(resultData[1]) : null;
                        const resData = resultData[2] ? _.values(resultData[2]) : null;
                        const details = resultData[3] ? _.values(resultData[3]) : null;
                        const umidTransDet = resultData[4] ? _.values(resultData[4]) : null;
                        const umidAllocateStatus = resultData[5] ? _.values(resultData[5]) : null;

                        module.exports.findErrorCodeMessageAndUpdate(req, res, resData);
                        const promises = [];
                        if (req.body.umidObj.authenticationApprovedDet) {
                            req.body.authenticationApprovedList = [];
                            // all umid details authentication records
                            _.each(umidTransDet, (transDet) => {
                                if (transDet && transDet.id) {
                                    const obj = req.body.umidObj.authenticationApprovedDet;
                                    obj.refID = transDet.id;
                                    req.body.authenticationApprovedList.push(obj);
                                }
                            });
                            promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonListWithWorkingProcess(req, t));
                        }
                        return Promise.all(promises).then(() => t.commit().then(() => {
                            // in this case error sent from SP is logical so  we are doing commit in all case.
                            if (resData && resData.length > 0) {
                                const errorFound = _.find(resData, item => item.errorText);
                                if (errorFound) {
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, { bomLineItemDetails: bomLineItemDetails, umidDetails: details, errorObjList: resData, uidVerificationDet: umidVerificationDetails, umidAllocateStatus: umidAllocateStatus }, null);
                                }
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { bomLineItemDetails: bomLineItemDetails, umidDetails: details, uidVerificationDet: umidVerificationDetails, umidAllocateStatus: umidAllocateStatus });
                        })).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        if (!t.finished) { t.rollback(); }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get  work order Kit Return Details
    // GET : /api/v1/umid_transaction/checkWOKitReutrn
    checkWOKitReutrn: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            return sequelize.query('CALL Sproc_CheckWOKitReturn (:pWoID)', {
                replacements: {
                    pWoID: req.body.obj.woID || 0
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0][0], null))
                .catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get Feeder detail from umid
    // POST : /api/v1/umid_transaction/getUMIDFeederStatus
    // @return list of feeder by UMID
    getUMIDFeederStatus: (req, res) => {
        const { WorkorderTransactionUMIDDetails } = req.app.locals.models;
        if (req.body.refSidId) {
            return WorkorderTransactionUMIDDetails.count({
                where: {
                    refsidid: req.body.refSidId,
                    reelStatus: 'P'
                }
            }).then(resultData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resultData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // get Un-Verified UMID count
    // POST : /api/v1/umid_transaction/getPendingVerificationUMIDCount
    // @return count of UMID pending to verify
    getPendingVerificationUMIDCount: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body.woTransID) {
            return sequelize
                .query('CALL Sproc_getPendingVerificationUMIDCount (:pWoID, :pOpID, :pWoTransID,:pTransType,:pWoOpEquipID)',
                    {
                        replacements: {
                            pWoID: req.body.woID || null,
                            pOpID: req.body.opID || null,
                            pWoTransID: req.body.woTransID,
                            pTransType: req.body.transactionType,
                            pWoOpEquipID: req.body.woOpEqpID ? req.body.woOpEqpID : null
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { pendingList: _.values(response[0]), totalScanned: _.values(response[1]) })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { count: 0 }, null);
        }
    },
    // get UMID active in Feeder
    // POST : /api/v1/umid_transaction/GetUMIDActiveFeederList
    // @return count of UMID pending to verify
    getUMIDActiveFeederList: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            let strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            let strOrderBy = null;
            if (filter.order && filter.order[0]) {
                strOrderBy = `${filter.order[0][0]} ${filter.order[0][1]}`;
            }
            if (!strWhere) strWhere = null;
            return sequelize
                .query('CALL sproc_getUMIDActiveFeederList (:ppageIndex, :precordPerPage, :pOrderBy, :pWhereClause, :pUMIDId)',
                    {
                        replacements: {
                            ppageIndex: req.body.Page,
                            precordPerPage: req.body.pageSize,
                            pOrderBy: strOrderBy,
                            pWhereClause: strWhere,
                            pUMIDId: req.body.refsidid ? req.body.refsidid : 0
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                .then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { feederList: _.values(response[0]) })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
        } else {
            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { count: 0 }, null);
        }
    }
};