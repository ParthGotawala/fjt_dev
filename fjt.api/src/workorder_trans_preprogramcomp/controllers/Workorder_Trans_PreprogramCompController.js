const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const GenericAuthenticationController = require('../../generic_authentication/controllers/GenericAuthenticationController');
const moment = require('moment');

const woPreProgComModuleName = DATA_CONSTANT.WORKORDER_PREPROGCOMP.NAME;


const SAVE_PRE_PROG_COMP_ERROR_CODE = {
    E1001: { CODE: 'E1001' } /* component designator limit exists */
};

module.exports = {
    // Add workorder transacation component desigantor
    // POST : /api/v1/workorder_preprogcomp_designator
    // @return workorder transaction component designator detail
    addWorkOrderTransCompDesignator: (req, res) => {
        if (req.body.woID && req.body.woTransID && req.body.opID && req.body.woOPID && req.body.employeeID
            && req.body.programName && req.body.refsidid && req.body.woPreProgCompID && req.body.woMultiplier) {
            const { sequelize } = req.app.locals.models;

            // eslint-disable-next-line no-multi-str
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_SaveWOPreProgramComponent (:pwoPreProgCompID,:pwoTransPreprogramID,:pwoID,:pmfgPNID,:pwoTransID,:popID,:pwoOPID,:pemployeeID, \
                    :pprogramName,:pdesignatorName, \
            :prefStkWOOPID,:prefsidid,:pcompCnt,:pwoMultiplier,:pdisplayOrder,:puserID,:puserRoldID,:pisupdatePartCountOnly)',
                {
                    replacements: {
                        pwoPreProgCompID: req.body.woTransPreprogramID ? req.body.woPreProgCompID : null,
                        pwoTransPreprogramID: req.body.woTransPreprogramID || null,
                        pwoID: req.body.woID,
                        pmfgPNID: req.body.mfgPNID || null,
                        pwoTransID: req.body.woTransID,
                        popID: req.body.opID,
                        pwoOPID: req.body.woOPID,
                        pemployeeID: req.body.employeeID,
                        pprogramName: req.body.programName,
                        pdesignatorName: null,
                        prefStkWOOPID: null,
                        prefsidid: req.body.refsidid,
                        pcompCnt: req.body.compCnt || 0,
                        pwoMultiplier: req.body.woMultiplier,
                        pdisplayOrder: null,
                        puserID: req.user.id,
                        puserRoldID: COMMON.getRequestUserLoginRoleID(req),
                        pisupdatePartCountOnly: true
                    },
                    transaction: t
                }).then((resp) => {
                    let errorDet = null;
                    let errMsg = null;
                    if (resp && resp.length) {
                        errorDet = resp[0];
                        if (errorDet && errorDet.errorCode) {
                            switch (errorDet.errorCode) {
                                case SAVE_PRE_PROG_COMP_ERROR_CODE.E1001.CODE:
                                    errMsg = MESSAGE_CONSTANT.MFG.COMPONENT_DESIGANTOR_LIMIT_EXITS;
                                    break;
                                default:
                                    errMsg = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                                    break;
                            }
                        }
                    }
                    if (errorDet && errMsg) {
                        t.rollback();
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: errMsg, err: null, data: null });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, 200, STATE.SUCCESS, null, MESSAGE_CONSTANT.SAVED(woPreProgComModuleName)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    t.rollback();
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
    // Get list of workorder transaction assembly designators
    // POST : /api/v1/workorder_preprogcomp_designator/getWOTransPreprogComponents
    // @return list of workorder transaction assembly designators
    getWOTransPreprogComponents: (req, res) => {
        if (req.body && req.body.employeeID && req.body.woTransID && req.body.woID && req.body.opID
            && req.body.woOPID) {
            return module.exports.getWorkOrderTransCompDesignatorDetail(req, null).then((woDefect) => {
                resHandler.successRes(res, 200, STATE.SUCCESS, woDefect);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },

    // Get workorder transaction assembly designator detail by woTransDefectId
    // @param {woTransPreprogramID} int
    // @return workorder transaction assembly designator detail
    getWorkOrderTransCompDesignatorDetail: (req, woTransPreprogramID) => {
        const { sequelize } = req.app.locals.models;

        var employeeID = req.body.employeeID;
        var woTransID = req.body.woTransID;
        var woID = req.body.woID;
        var opID = req.body.opID;
        var woOPID = req.body.woOPID;

        return sequelize
            .query('CALL Sproc_GetTransComponent (:pEmployeeID, :pwoTransID, :pwoID, :popID, :pwoOpID, :pwoTransPreprogramID)',
                { replacements: { pEmployeeID: employeeID, pwoTransID: woTransID, pwoID: woID, popID: opID, pwoOpID: woOPID, pwoTransPreprogramID: woTransPreprogramID || null } })
            .then(response => response).catch((err) => {
                console.trace();
                console.error(err);
                return null;
            });
    },
    // Get list workorder operation employee by woID and opID or employeeID
    // @param {woID} int
    // @param {opID} int
    // @param {employeeID} int
    // @return list workorder operation employee
    getWOOperationEmployees: (req, woID, opID, employeeID) => {
        const { sequelize } = req.app.locals.models;

        return sequelize
            .query('CALL Sproc_GetWorkorderEmployees (:woOPID, :woID, :opID)',
                {
                    replacements: {
                        woOPID: null,
                        woID: woID,
                        opID: opID
                    }
                })
            .then((response) => {
                if (response) { return _.remove(response.map(x => x.employeeID), x => x !== employeeID); } else { return []; }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return [];
            });
    },
    // Scan UMID Only and Validate for pre-program component
    // POST : /api/v1/workorder_trasn_preprogram_comp/validateUMIDAndGetPartDetForPreProgram
    // @return list of line items data by ID scanned umid
    validateUMIDAndGetPartDetForPreProgram: (req, res) => {
        const { sequelize } = req.app.locals.models;
        if (req.body && req.body.umidObj && req.body.umidObj.UMID && req.body.umidObj.partID && req.body.umidObj.woOPID && req.body.umidObj.woTransID && req.body.umidObj.employeeId && req.body.umidObj.VerificationRequestFrom) {
            return sequelize.query('CALL Sproc_ValidateUMIDAndGetPartDetForPreProgram (:pUMID, :ppartID,:pwoOpID,:pwoTransID,:pemployeeId,:pcheckKitAllocation, :pverificationType, :pisVerify, :ptransactionType, :prfqLineItemsID, :pisConfirmed, :pwoID,:pCreatedBy,:pVerificationReqFrom)',
                {
                    replacements: {
                        pUMID: req.body.umidObj.UMID,
                        ppartID: req.body.umidObj.partID,
                        pwoOpID: req.body.umidObj.woOPID,
                        pwoTransID: req.body.umidObj.woTransID,
                        pemployeeId: req.body.umidObj.employeeId,
                        pcheckKitAllocation: req.body.umidObj.checkKitAllocation || true,
                        pverificationType: req.body.umidObj.verificationType || null,
                        pisVerify: req.body.umidObj.isVerify || false,
                        ptransactionType: req.body.umidObj.transactionType || false,
                        prfqLineItemsID: req.body.umidObj.rfqLineItemsID || null,
                        pisConfirmed: req.body.umidObj.isConfirmed || false,
                        pwoID: req.body.umidObj.woID || null,
                        pCreatedBy: req.user.id,
                        pVerificationReqFrom: req.body.umidObj.VerificationRequestFrom
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((resultData) => {
                    // 0 - lineitem details
                    // 1 - verification history
                    // 2 - error
                    // 3 - umid details for ui
                    // 4 - wo pre-prog component det
                    if (resultData) {
                        const bomLineItemDetails = resultData[0] ? _.values(resultData[0]) : null;
                        const umidVerificationDetails = resultData[1] ? _.values(resultData[1]) : null;
                        const resData = resultData[2] ? _.values(resultData[2]) : null;
                        const details = resultData[3] ? _.values(resultData[3]) : null;

                        module.exports.findErrorCodeMessageAndUpdate(req, res, resData);
                        const promises = [];
                        if (req.body.umidObj.authenticationApprovedDet) {
                            req.body.authenticationApprovedList = [];
                            // // all umid details authentication records
                            // _.each(umidTransDet, (transDet) => {
                            //     if (transDet && transDet.id) {
                            //         const obj = req.body.umidObj.authenticationApprovedDet;
                            //         obj.refID = transDet.id;
                            //         req.body.authenticationApprovedList.push(obj);
                            //     }
                            // });
                            promises.push(GenericAuthenticationController.addAuthenticatedApprovalReasonListWithWorkingProcess(req, null));
                        }
                        return Promise.all(promises).then(() => {
                            if (resData && resData.length > 0) {
                                const errorFound = _.find(resData, item => item.errorText);
                                if (errorFound) {
                                    return resHandler.successRes(res, 200, STATE.EMPTY, {
                                        bomLineItemDetails: bomLineItemDetails, umidDetails: details, errorObjList: resData, uidVerificationDet: umidVerificationDetails
                                    }, null);
                                }
                            }
                            return resHandler.successRes(res, 200, STATE.SUCCESS, {
                                bomLineItemDetails: bomLineItemDetails, umidDetails: details, uidVerificationDet: umidVerificationDetails
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
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
                } else if (errorItem.errorText === 'UMID041') {
                    const umidObj = errorItem.stringText1 ? errorItem.stringText1 : null;
                    errorItem.errorText = COMMON.stringFormat(errDet.NAME, umidObj);
                } else if (errorItem.errorText === 'UMID052') {
                    errorItem.errorText = COMMON.stringFormat(errDet.NAME, errorItem.stringText1 ? errorItem.stringText1 : '', errorItem.stringText2 ? errorItem.stringText2 : '');
                } else {
                    errorItem.errorText = errDet.NAME;
                }
            }
        });
    }
};
