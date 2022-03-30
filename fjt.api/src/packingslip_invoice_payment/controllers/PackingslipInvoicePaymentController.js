const { Op } = require('sequelize');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const UTILITY_CONTROLLER = require('../../utility/controllers/UtilityController');
const GenericAuthenticationController = require('../../generic_authentication/controllers/GenericAuthenticationController');

const customerPaymentModuleName = DATA_CONSTANT.CUSTOMER_PAYMENT.Name;
const customerRefundModuleName = DATA_CONSTANT.CUSTOMER_REFUND.Name;

module.exports = {
    // Retrieve list of Customer Payments
    // POST : /api/v1/invoicepayment/retrieveCustomerPayments
    // @return list of Customer Payments
    retrieveCustomerPayments: (req, res) => {
        if (req.body && req.body.refPaymentModeForInvoicePayment) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustomerInvoicePayment (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pCustomerIDs,:pPaymentMethodIDs,:pBankAccountCodeIDs,:pExactPaymentNumberSearch,:pPaymentNumber,:pInvoiceNumber,:pAmount,:pExactPaymentAmountSearch,:pFromDate,:pToDate,:pFromAppliedDate,:pToAppliedDate,:pIsDisplayZeroPaymentDataOnly,:pRefPaymentMode,:pIsIncludeVoidedTransaction,:pPaymentRefundStatusFilter)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pCustomerIDs: req.body.customerIDs || null,
                    pPaymentMethodIDs: req.body.paymentMethodIDs || null,
                    pBankAccountCodeIDs: req.body.bankAccountCodeIDs || null,
                    pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                    pPaymentNumber: req.body.paymentNumber || null,
                    pInvoiceNumber: req.body.invoiceNumber || null,
                    pAmount: req.body.amount || null,
                    pExactPaymentAmountSearch: req.body.exactPaymentAmountSearch || false,
                    pFromDate: req.body.fromDate || null,
                    pToDate: req.body.toDate || null,
                    pFromAppliedDate: req.body.fromAppliedDate || null,
                    pToAppliedDate: req.body.toAppliedDate || null,
                    pIsDisplayZeroPaymentDataOnly: req.body.isDisplayZeroPaymentDataOnly || false,
                    pRefPaymentMode: req.body.refPaymentModeForInvoicePayment,
                    pIsIncludeVoidedTransaction: req.body.isIncludeVoidedTransaction || false,
                    pPaymentRefundStatusFilter: req.body.paymentRefundStatusFilter || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                invoicePayment: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Retrieve list of Customer invoices for Payments
    // POST : /api/v1/invoicepayment/getAllInvoiceOfCustomerPayment
    // @return list of Customer invoices for Payments
    getAllInvoiceOfCustomerPayment: (req, res) => {
        if (req.body && req.body.custPayInfo && req.body.custPayInfo.customerID && req.body.custPayInfo.transTypeForInvoice) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetAllInvoiceOfCustomerPayment (:pCustomerID,:pPayementID,:pInvoiceTransType,:pisGetOnlyPaidInvoiceFromPayment,:pIsExcludeZeroValueInv)', {
                replacements: {
                    pCustomerID: req.body.custPayInfo.customerID,
                    pPayementID: req.body.custPayInfo.payementMstID || null,
                    pInvoiceTransType: req.body.custPayInfo.transTypeForInvoice,
                    pisGetOnlyPaidInvoiceFromPayment: req.body.custPayInfo.isGetOnlyPaidInvoiceFromPayment || false,
                    pIsExcludeZeroValueInv: req.body.custPayInfo.isExcludeZeroValueInv || false
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                let custInvList = [];
                let customerPastDueBalance = null;
                let custCurrTermsDays = null;
                if (response && response.length) {
                    custInvList = _.values(response[0]);
                    customerPastDueBalance = _.values(response[1]) ? (_.first(_.values(response[1])) ? _.first(_.values(response[1])).pastDueAmount : null) : null;
                    custCurrTermsDays = _.values(response[2]) ? (_.first(_.values(response[2])) ? _.first(_.values(response[2])).custCurrentTermsDays : null) : null;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                    {
                        customerInvoiceList: custInvList,
                        customerPastDueBalance: customerPastDueBalance,
                        customerCurrentTermsDays: custCurrTermsDays
                    },
                    null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // create customer payment
    // POST : /api/v1/invoicepayment/createCustomerPayment
    // @return created customer payment
    /* this api used for create >> customer payment, applied credit memo and write off transaction
     * write off transaction 2 ways - 1. From customer payment page 2. Individual write off transaction  */
    createCustomerPayment: (req, res) => {
        if (req.body && req.body.custPayObj && req.body.custPayObj.mfgcodeID && req.body.custPayObj.paymentAmount >= 0
            && req.body.custPayObj.accountReference && req.body.custPayObj.refPaymentMode) {
            if (req.body.custPayObj.isZeroPayment || req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                // if zero payment invoice or payment by credit memo then bank details not required
                if (req.body.custPayObj.bankAccountMasID || req.body.custPayObj.bankAccountNo || req.body.custPayObj.bankName) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                        err: null,
                        data: null
                    });
                }
            } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && (!req.body.custPayObj.paymentDate || !req.body.custPayObj.paymentType || !req.body.custPayObj.bankAccountMasID || !req.body.custPayObj.bankAccountNo || !req.body.custPayObj.bankName)) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            } else if ((req.body.custPayObj.isWriteOffExtraAmount && !req.body.custPayObj.paymentTypeForWriteOffCustPayment)
                || (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code && (!req.body.custPayObj.writeOffCustInvoicePaymentDetList || req.body.custPayObj.writeOffCustInvoicePaymentDetList.length === 0))) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            }

            const {
                sequelize
            } = req.app.locals.models;

            return sequelize.transaction().then((t) => {
                let identityTypeFor = null;
                if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                    identityTypeFor = DATA_CONSTANT.IDENTITY.CustomerPaymentSystemID;
                } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                    identityTypeFor = DATA_CONSTANT.IDENTITY.ApplyCustomerCreditMemoSystemID;
                } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                    identityTypeFor = DATA_CONSTANT.IDENTITY.CustomerPaymentWriteOffSystemID;
                }

                return UTILITY_CONTROLLER.getSystemIdPromise(req, res, identityTypeFor, t).then((respOfSystemIdPromise) => {
                    if (!respOfSystemIdPromise || !respOfSystemIdPromise.systemId) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    }
                    const systemIDForCustPayment = respOfSystemIdPromise.systemId;

                    const promisesZPPN = [];
                    if (req.body.custPayObj.isZeroPayment) {
                        promisesZPPN.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerPaymentNumberForZeroValuePayment, t));
                    } else if (req.body.custPayObj.isWriteOffExtraAmount) {
                        promisesZPPN.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerWriteOffPaymentNumber, t));
                        /* if separate write refPaymentMode then not required to get systemID as already get on above
                         from customer payment write off required to get systemID */
                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                            promisesZPPN.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerPaymentWriteOffSystemID, t));
                        }
                    }


                    return Promise.all(promisesZPPN).then((respOfPNForZP) => {
                        if ((req.body.custPayObj.isZeroPayment || req.body.custPayObj.isWriteOffExtraAmount) && (!respOfPNForZP || respOfPNForZP.length === 0 || !respOfPNForZP[0].systemId)) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        }

                        let paymentNumberForWriteOffCustPayment = null;
                        let systemIDForWriteOffCustPayment = null;
                        if (req.body.custPayObj.isZeroPayment) {
                            req.body.custPayObj.paymentNumber = respOfPNForZP[0].systemId;
                        } else if (req.body.custPayObj.isWriteOffExtraAmount) {
                            paymentNumberForWriteOffCustPayment = respOfPNForZP[0].systemId;
                            if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                                systemIDForWriteOffCustPayment = systemIDForCustPayment;
                            } else {
                                systemIDForWriteOffCustPayment = respOfPNForZP[1].systemId;
                            }
                        }

                        return sequelize
                            .query('CALL Sproc_CreateCustomerPayment (:pCustInvoicePaymentDetList,:pMfgcodeID,:pPaymentNumber,:pPaymentDate,:pPaymentAmount,:pPaymentType,:pAccountReference,:pBankAccountMasID,:pBankAccountNo,:pBankName,:pRemark,:pRefPaymentMode,:pTotSelectedInvOfCust,:pisConfmTakenForDuplicateCheckNo,:pSystemID,:pisZeroPayment,:pDepositBatchNumber,:pRefCustCreditMemoID,:pisMarkForRefund,:pAgreedRefundAmt,:pRefundStatus,:pIsWriteOffExtraAmount,:pPaymentAmountForWriteOffCustPayment,:pPaymentNumberForWriteOffCustPayment,:pSystemIDForWriteOffCustPayment,:pPaymentTypeForWriteOffCustPayment,:pWriteOffCustInvoicePaymentDetList,:pRefGencTransModeID,:pWriteOffReason,:pUserID,:pUserRoleID)', {
                                replacements: {
                                    pCustInvoicePaymentDetList: req.body.custPayObj.custInvoicePaymentDetList.length > 0 ? JSON.stringify(req.body.custPayObj.custInvoicePaymentDetList) : null,
                                    pMfgcodeID: req.body.custPayObj.mfgcodeID,
                                    pPaymentNumber: req.body.custPayObj.paymentNumber,
                                    pPaymentDate: req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code ? null : req.body.custPayObj.paymentDate,
                                    pPaymentAmount: req.body.custPayObj.paymentAmount,
                                    pPaymentType: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.paymentType,
                                    pAccountReference: req.body.custPayObj.accountReference,
                                    pBankAccountMasID: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.bankAccountMasID,
                                    pBankAccountNo: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.bankAccountNo,
                                    pBankName: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.bankName,
                                    pRemark: req.body.custPayObj.remark || null,
                                    pRefPaymentMode: req.body.custPayObj.refPaymentMode,
                                    pTotSelectedInvOfCust: req.body.custPayObj.custInvoicePaymentDetList.length,
                                    pisConfmTakenForDuplicateCheckNo: req.body.custPayObj.isConfmTakenForDuplicateCheckNo,
                                    pSystemID: systemIDForCustPayment,
                                    pisZeroPayment: req.body.custPayObj.isZeroPayment || false,
                                    pDepositBatchNumber: req.body.custPayObj.depositBatchNumber || null,
                                    pRefCustCreditMemoID: req.body.custPayObj.refCustCreditMemoID || null,
                                    pisMarkForRefund: req.body.custPayObj.isMarkForRefund ? req.body.custPayObj.isMarkForRefund : false,
                                    pAgreedRefundAmt: req.body.custPayObj.agreedRefundAmt || null,
                                    pRefundStatus: req.body.custPayObj.refundStatus || null,
                                    pIsWriteOffExtraAmount: req.body.custPayObj.isWriteOffExtraAmount || false,
                                    pPaymentAmountForWriteOffCustPayment: req.body.custPayObj.paymentAmountForWriteOffCustPayment || null,
                                    pPaymentNumberForWriteOffCustPayment: paymentNumberForWriteOffCustPayment || null,
                                    pSystemIDForWriteOffCustPayment: systemIDForWriteOffCustPayment || null,
                                    pPaymentTypeForWriteOffCustPayment: req.body.custPayObj.paymentTypeForWriteOffCustPayment || null,
                                    pWriteOffCustInvoicePaymentDetList: req.body.custPayObj.writeOffCustInvoicePaymentDetList && req.body.custPayObj.writeOffCustInvoicePaymentDetList.length > 0 ? JSON.stringify(req.body.custPayObj.writeOffCustInvoicePaymentDetList) : null,
                                    pRefGencTransModeID: req.body.custPayObj.refGencTransModeID || null,
                                    pWriteOffReason: req.body.custPayObj.writeOffReason || null,
                                    pUserID: req.user.id,
                                    pUserRoleID: req.user.defaultLoginRoleID
                                },
                                type: sequelize.QueryTypes.SELECT,
                                transaction: t
                            }).then((respOfCreatedPayment) => {
                                const respOfCreatedPaymentAndDetList = respOfCreatedPayment;

                                if (!respOfCreatedPaymentAndDetList || respOfCreatedPaymentAndDetList.length === 0 || !_.values(respOfCreatedPaymentAndDetList[0]) || (_.first(_.values(respOfCreatedPaymentAndDetList[0]))).spStatus !== 1) {
                                    t.rollback();
                                    const respOfMismatchInvPaymentDetRecords = _.values(respOfCreatedPaymentAndDetList[1]);
                                    const respOfDuplicateChkPaymentNo = _.values(respOfCreatedPaymentAndDetList[3]);
                                    const respOfDuplicateCreditMemoToApply = _.values(respOfCreatedPaymentAndDetList[4]);

                                    if (respOfMismatchInvPaymentDetRecords && respOfMismatchInvPaymentDetRecords.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                mismatchInvPaymentDetList: respOfMismatchInvPaymentDetRecords
                                            }
                                        });
                                    } else if (respOfDuplicateChkPaymentNo && (_.first(_.values(respOfDuplicateChkPaymentNo))).isDuplicateChkPaymentNo > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                isDuplicateCheckPaymentNo: true
                                            }
                                        });
                                    } else if (respOfDuplicateCreditMemoToApply && (_.first(_.values(respOfDuplicateCreditMemoToApply))).isDuplicateCreditMemoToApply > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                isCreditMemoAlreadyApplied: true
                                            }
                                        });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                } else {
                                    return t.commit().then(() => {
                                        req.body.epSearchData = {};
                                        req.body.epSearchData = {
                                            InvPaymentMstID: _.first(_.values(respOfCreatedPaymentAndDetList[2])).insertedInvPaymentMstID
                                        };
                                        req.params['refPaymentMode'] = req.body.custPayObj.refPaymentMode;
                                        EnterpriseSearchController.manageCustomerPaymentInElastic(req);

                                        // for customer write off elastic search which made from customer payment
                                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && req.body.custPayObj.isWriteOffExtraAmount) {
                                            req.body.epSearchData = {};
                                            req.body.epSearchData = {
                                                InvPaymentMstID: _.first(_.values(respOfCreatedPaymentAndDetList[5])).insertedWriteOffPaymentMstID
                                            };
                                            EnterpriseSearchController.manageCustomerPaymentInElastic(req);
                                        }

                                        let paymentSuccessMsg = null;
                                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                                            paymentSuccessMsg = MESSAGE_CONSTANT.MFG.CUST_PAYMENT_APPLIED_SUCCESS;
                                        } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                                            paymentSuccessMsg = MESSAGE_CONSTANT.MFG.CUST_CREDIT_MEMO_INV_PAY_APPLIED_SUCCESS;
                                        } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                                            paymentSuccessMsg = MESSAGE_CONSTANT.MFG.CUST_INV_PAY_WRITE_OFF_APPLIED_SUCCESS;
                                        }

                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                            {
                                                insertedInvPaymentMstID: _.first(_.values(respOfCreatedPaymentAndDetList[2])).insertedInvPaymentMstID
                                            },
                                            paymentSuccessMsg);
                                    });
                                }
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get customer invoice payment master data
    // POST : /api/v1/invoicepayment/getCustInvPaymentMstData
    // @return customer invoice payment master data
    getCustInvPaymentMstData: (req, res) => {
        if (req.body && req.body.customerPaymentMstID && req.body.refPaymentMode) {
            const { sequelize } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetCustomerPaymentByMstID (:pPaymentMstID,:pRefPaymentMode)', {
                replacements: {
                    pPaymentMstID: req.body.customerPaymentMstID,
                    pRefPaymentMode: req.body.refPaymentMode
                },
                type: sequelize.QueryTypes.SELECT
            }).then((respOfCustPayment) => {
                if (!respOfCustPayment || !respOfCustPayment[0] || _.isEmpty(respOfCustPayment[0]) || !_.values(respOfCustPayment[0])) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(customerPaymentModuleName), err: null, data: null });
                }
                const custPayDet = _.first(_.values(respOfCustPayment[0]));
                if (custPayDet) {
                    custPayDet.isPaymentVoided = custPayDet.isPaymentVoided ? true : false;
                    custPayDet.isZeroPayment = custPayDet.isZeroPayment ? true : false;
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                    { custPaymentMstData: custPayDet }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // update customer payment
    // POST : /api/v1/invoicepayment/updateCustomerPayment
    // @return update status
    /* this api used for update >> customer payment, applied credit memo and write off transaction
    * write off transaction 2 ways - 1. From customer payment page 2. Individual write off transaction  */
    updateCustomerPayment: (req, res) => {
        if (req.body && req.body.custPayObj && req.body.custPayObj.customerPaymentMstID && req.body.custPayObj.mfgcodeID
            && req.body.custPayObj.paymentAmount >= 0 && req.body.custPayObj.accountReference && req.body.custPayObj.refPaymentMode) {
            if (req.body.custPayObj.isZeroPayment || req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                // if zero payment invoice then bank details not required
                if (req.body.custPayObj.bankAccountMasID || req.body.custPayObj.bankAccountNo || req.body.custPayObj.bankName) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                        err: null,
                        data: null
                    });
                }
            } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && (!req.body.custPayObj.paymentDate || !req.body.custPayObj.paymentType || !req.body.custPayObj.bankAccountMasID || !req.body.custPayObj.bankAccountNo || !req.body.custPayObj.bankName)) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            } else if ((req.body.custPayObj.isWriteOffExtraAmount && !req.body.custPayObj.paymentTypeForWriteOffCustPayment)
                || (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code && (!req.body.custPayObj.writeOffCustInvoicePaymentDetList || req.body.custPayObj.writeOffCustInvoicePaymentDetList.length === 0))) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: null,
                    data: null
                });
            }

            const {
                sequelize, PackingslipInvoicePayment
            } = req.app.locals.models;


            return PackingslipInvoicePayment.findOne({
                where: {
                    id: req.body.custPayObj.customerPaymentMstID,
                    isDeleted: false
                },
                attributes: ['paymentAmount', 'paymentNumber', 'isPaymentVoided', 'lockStatus']
            }).then((respOfCustPayment) => {
                if (!respOfCustPayment || (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && respOfCustPayment.paymentAmount !== req.body.custPayObj.paymentAmount)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(customerPaymentModuleName), err: null, data: null });
                }

                // if payment is in void state then not allowed to change
                if (respOfCustPayment.isPaymentVoided) {
                    let voidForEntity = null;
                    let paymentNumFieldText = null;
                    if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                        voidForEntity = 'customer payment';
                        paymentNumFieldText = 'payment# or check#';
                    } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                        voidForEntity = 'applied credit memo';
                        paymentNumFieldText = 'transaction#';
                    } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                        voidForEntity = 'applied write off';
                        paymentNumFieldText = 'write off#';
                    }

                    const msgContentForVoid = Object.assign({}, MESSAGE_CONSTANT.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                    msgContentForVoid.message = COMMON.stringFormat(msgContentForVoid.message, respOfCustPayment.paymentNumber, voidForEntity, paymentNumFieldText);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: msgContentForVoid,
                        err: null,
                        data: null
                    });
                }

                // if transaction is in locked then not allowed to change
                if (respOfCustPayment.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.Locked) {
                    const msgContentForLocked = Object.assign({}, MESSAGE_CONSTANT.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
                    msgContentForLocked.message = COMMON.stringFormat(msgContentForLocked.message, respOfCustPayment.paymentNumber);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: msgContentForLocked,
                        err: null,
                        data: null
                    });
                }

                return sequelize.transaction().then((t) => {
                    const promisesIdentityNum = [];
                    if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && req.body.custPayObj.isWriteOffExtraAmount) {
                        promisesIdentityNum.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerWriteOffPaymentNumber, t));
                        promisesIdentityNum.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerPaymentWriteOffSystemID, t));
                    }

                    return Promise.all(promisesIdentityNum).then((respOfIdentityNum) => {
                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && req.body.custPayObj.isWriteOffExtraAmount && (!respOfIdentityNum || respOfIdentityNum.length === 0 || !respOfIdentityNum[0].systemId)) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: null,
                                data: null
                            });
                        }

                        let paymentNumberForWriteOffCustPayment = null;
                        let systemIDForWriteOffCustPayment = null;
                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && req.body.custPayObj.isWriteOffExtraAmount) {
                            paymentNumberForWriteOffCustPayment = respOfIdentityNum[0].systemId;
                            systemIDForWriteOffCustPayment = respOfIdentityNum[1].systemId;
                        }

                        return sequelize
                            .query('CALL Sproc_UpdateCustomerPayment (:pCustInvoicePaymentDetList,:pCustomerPaymentMstID,:pMfgcodeID,:pPaymentNumber,:pPaymentDate,:pPaymentAmount,:pPaymentType,:pAccountReference,:pBankAccountMasID,:pBankAccountNo,:pBankName,:pRemark,:pRefPaymentMode,:pTotSelectedInvOfCust,:pDeleteCustInvPaymentDetList,:pisConfmTakenForDuplicateCheckNo,:pDepositBatchNumber,:pRefCustCreditMemoID,:pisMarkForRefund,:pAgreedRefundAmt,:pIsWriteOffExtraAmount,:pPaymentAmountForWriteOffCustPayment,:pPaymentNumberForWriteOffCustPayment,:pSystemIDForWriteOffCustPayment,:pPaymentTypeForWriteOffCustPayment,:pWriteOffCustInvoicePaymentDetList,:pRefGencTransModeID,:pWriteOffReason,:pUserID,:pUserRoleID)', {
                                replacements: {
                                    pCustInvoicePaymentDetList: req.body.custPayObj.custInvoicePaymentDetList.length > 0 ? JSON.stringify(req.body.custPayObj.custInvoicePaymentDetList) : null,
                                    pCustomerPaymentMstID: req.body.custPayObj.customerPaymentMstID,
                                    pMfgcodeID: req.body.custPayObj.mfgcodeID,
                                    pPaymentNumber: req.body.custPayObj.paymentNumber,
                                    pPaymentDate: req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code ? null : req.body.custPayObj.paymentDate,
                                    pPaymentAmount: req.body.custPayObj.paymentAmount,
                                    pPaymentType: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.paymentType,
                                    pAccountReference: req.body.custPayObj.accountReference,
                                    pBankAccountMasID: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.bankAccountMasID,
                                    pBankAccountNo: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.bankAccountNo,
                                    pBankName: req.body.custPayObj.isZeroPayment ? null : req.body.custPayObj.bankName,
                                    pRemark: req.body.custPayObj.remark || null,
                                    pRefPaymentMode: req.body.custPayObj.refPaymentMode,
                                    pTotSelectedInvOfCust: req.body.custPayObj.custInvoicePaymentDetList.length,
                                    pDeleteCustInvPaymentDetList: req.body.custPayObj.deleteCustInvPaymentDetList.length > 0 ? JSON.stringify(req.body.custPayObj.deleteCustInvPaymentDetList) : null,
                                    pisConfmTakenForDuplicateCheckNo: req.body.custPayObj.isConfmTakenForDuplicateCheckNo,
                                    pDepositBatchNumber: req.body.custPayObj.depositBatchNumber || null,
                                    pRefCustCreditMemoID: req.body.custPayObj.refCustCreditMemoID || null,
                                    pisMarkForRefund: req.body.custPayObj.isMarkForRefund ? req.body.custPayObj.isMarkForRefund : false,
                                    pAgreedRefundAmt: req.body.custPayObj.agreedRefundAmt || null,
                                    pIsWriteOffExtraAmount: req.body.custPayObj.isWriteOffExtraAmount || false,
                                    pPaymentAmountForWriteOffCustPayment: req.body.custPayObj.paymentAmountForWriteOffCustPayment || null,
                                    pPaymentNumberForWriteOffCustPayment: paymentNumberForWriteOffCustPayment || null,
                                    pSystemIDForWriteOffCustPayment: systemIDForWriteOffCustPayment || null,
                                    pPaymentTypeForWriteOffCustPayment: req.body.custPayObj.paymentTypeForWriteOffCustPayment || null,
                                    pWriteOffCustInvoicePaymentDetList: req.body.custPayObj.writeOffCustInvoicePaymentDetList && req.body.custPayObj.writeOffCustInvoicePaymentDetList.length > 0 ? JSON.stringify(req.body.custPayObj.writeOffCustInvoicePaymentDetList) : null,
                                    pRefGencTransModeID: req.body.custPayObj.refGencTransModeID || null,
                                    pWriteOffReason: req.body.custPayObj.writeOffReason || null,
                                    pUserID: req.user.id,
                                    pUserRoleID: req.user.defaultLoginRoleID
                                },
                                type: sequelize.QueryTypes.SELECT,
                                transaction: t
                            }).then((respOfCreatedPayment) => {
                                const respOfCreatedPaymentAndDetList = respOfCreatedPayment;

                                if (!respOfCreatedPaymentAndDetList || respOfCreatedPaymentAndDetList.length === 0 || !_.values(respOfCreatedPaymentAndDetList[0]) || (_.first(_.values(respOfCreatedPaymentAndDetList[0]))).spStatus !== 1) {
                                    t.rollback();
                                    const respOfDeletedInvPaymentDetRecords = _.values(respOfCreatedPaymentAndDetList[1]);
                                    const respOfMismatchInvPaymentDetRecords = _.values(respOfCreatedPaymentAndDetList[2]);
                                    const respOfDuplicateChkPaymentNo = _.values(respOfCreatedPaymentAndDetList[3]);
                                    const respOfAgreedRefundAmtLessThanTotIssued = _.values(respOfCreatedPaymentAndDetList[4]);

                                    if (respOfDeletedInvPaymentDetRecords && respOfDeletedInvPaymentDetRecords.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                deletedInvPaymentDetList: respOfDeletedInvPaymentDetRecords
                                            }
                                        });
                                    } else if (respOfMismatchInvPaymentDetRecords && respOfMismatchInvPaymentDetRecords.length > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                mismatchInvPaymentDetList: respOfMismatchInvPaymentDetRecords
                                            }
                                        });
                                    } else if (respOfDuplicateChkPaymentNo && (_.first(_.values(respOfDuplicateChkPaymentNo))).isDuplicateChkPaymentNo > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                isDuplicateCheckPaymentNo: true
                                            }
                                        });
                                    } else if (respOfAgreedRefundAmtLessThanTotIssued && (_.first(_.values(respOfAgreedRefundAmtLessThanTotIssued))).isAgreedRefundAmtLessThanTotIssued > 0) {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: null,
                                            err: null,
                                            data: {
                                                isAgreedRefundAmtLessThanTotIssued: true,
                                                totRefundIssuedOfPayment: (_.first(_.values(respOfAgreedRefundAmtLessThanTotIssued))).totRefundIssuedOfPayment
                                            }
                                        });
                                    } else {
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                    }
                                } else {
                                    return t.commit().then(() => {
                                        req.body.epSearchData = {};
                                        req.body.epSearchData = {
                                            InvPaymentMstID: req.body.custPayObj.customerPaymentMstID
                                        };
                                        req.params['refPaymentMode'] = req.body.custPayObj.refPaymentMode;
                                        EnterpriseSearchController.manageCustomerPaymentInElastic(req);

                                        // for customer write off elastic search which made from customer payment
                                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code && req.body.custPayObj.isWriteOffExtraAmount) {
                                            req.body.epSearchData = {};
                                            req.body.epSearchData = {
                                                InvPaymentMstID: _.first(_.values(respOfCreatedPaymentAndDetList[5])).insertedWriteOffPaymentMstID
                                            };
                                            req.params['refPaymentMode'] = req.body.custPayObj.refPaymentMode;
                                            EnterpriseSearchController.manageCustomerPaymentInElastic(req);
                                        }

                                        let paymentSuccessMsg = null;
                                        if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                                            paymentSuccessMsg = MESSAGE_CONSTANT.MFG.CUST_PAYMENT_APPLIED_SUCCESS;
                                        } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                                            paymentSuccessMsg = MESSAGE_CONSTANT.MFG.CUST_CREDIT_MEMO_INV_PAY_APPLIED_SUCCESS;
                                        } else if (req.body.custPayObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                                            paymentSuccessMsg = MESSAGE_CONSTANT.MFG.CUST_INV_PAY_WRITE_OFF_APPLIED_SUCCESS;
                                        }

                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, paymentSuccessMsg);
                                    });
                                }
                            }).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get customer with payment/check number and amount
    // POST : /api/v1/invoicepayment/getAllCustPaymentCheckNumberList
    // @return customer payment details
    getAllCustPaymentCheckNumberList: (req, res) => {
        if (req.body && req.body.refPaymentMode) {
            const { PackingslipInvoicePayment, MfgCodeMst } = req.app.locals.models;

            return PackingslipInvoicePayment.findAll({
                where: {
                    refPaymentMode: req.body.refPaymentMode,
                    isDeleted: false,
                    [Op.or]: [
                        { paymentNumber: { [Op.like]: `%${req.body.searchQuery}%` } },
                        { paymentAmount: { [Op.like]: `%${req.body.searchQuery}%` } },
                        { '$mfgCodemst.mfgCode$': { [Op.like]: `%${req.body.searchQuery}%` } }
                    ]
                },
                attributes: ['id', 'mfgcodeID', 'paymentNumber', 'paymentAmount', 'isPaymentVoided', 'refCustCreditMemoID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['mfgCode', 'mfgName'],
                    required: true
                }]
            }).then(respOfPayList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                custInvPaymentList: respOfPayList
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Retrieve list of Customer credit memo for Payments
    // POST : /api/v1/invoicepayment/getAllCreditMemoOfCustomerPayment
    // @return list of Customer credit memo for Payments
    getAllCreditMemoOfCustomerPayment: (req, res) => {
        if (req.body && req.body.custPayInfo && req.body.custPayInfo.customerID && req.body.custPayInfo.transTypeForCreditMemo) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetAllCreditMemoOfCustomerPayment (:pCustomerID,:pCreditMemoTransType)', {
                replacements: {
                    pCustomerID: req.body.custPayInfo.customerID,
                    pCreditMemoTransType: req.body.custPayInfo.transTypeForCreditMemo
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                customerCreditMemoList: response && response.length ? _.values(response[0]) : []
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Delete customer payment
    // DELETE : /api/v1/deleteCustomerPayment
    // @param {id} string
    // @return API response
    deleteCustomerPayment: (req, res) => {
        if (req.body && req.body.objIDs && req.body.objIDs.id && req.body.objIDs.id.length > 0) {
            const {
                sequelize
            } = req.app.locals.models;
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_DeleteCustomerPayment (:pDeleteCustPaymentMstIDs,:countList,:pUserID,:pUserRoleID)', {
                replacements: {
                    pDeleteCustPaymentMstIDs: req.body.objIDs.id.toString(),
                    countList: req.body.objIDs.CountList,
                    pUserID: req.user.id,
                    pUserRoleID: req.user.defaultLoginRoleID
                }
            }).then((respOfDeleteCustPayment) => {
                if (respOfDeleteCustPayment.length === 0) {
                    return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, respOfDeleteCustPayment, MESSAGE_CONSTANT.DELETED(customerPaymentModuleName)));
                } else {
                    t.rollback();
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        transactionDetails: respOfDeleteCustPayment,
                        IDs: req.body.objIDs.id
                    }, null);
                }
            }).catch((err) => {
                t.rollback();
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            })).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Update Lock/unlock status  of customer payment
    // POST : /api/v1/invoicepayment/lockUnlockCustomerPayment
    // @param {id} int - custPaymentMstIDs
    // @return SUCCESS with locking customer payment
    lockUnlockCustomerPayment: (req, res) => {
        if (req && req.body && req.body.objCustPayDet && req.body.objCustPayDet.custPaymentListForLock && req.body.objCustPayDet.custPaymentListForLock.length > 0) {
            const { sequelize } = req.app.locals.models;

            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_LockUnlockCustPaymentTransaction (:pIsLockTransaction,:pCustInvoicePaymentList,:pRefPaymentMode,:pIsViewToBeLockUnlockRecords,:pUserID,:pUserRoleID)', {
                    replacements: {
                        pIsLockTransaction: req.body.objCustPayDet.isLockTransaction,
                        pCustInvoicePaymentList: JSON.stringify(req.body.objCustPayDet.custPaymentListForLock),
                        pRefPaymentMode: req.body.objCustPayDet.refPaymentMode,
                        pIsViewToBeLockUnlockRecords: req.body.objCustPayDet.isViewToBeLockUnlockRecords,
                        pUserID: req.user.id,
                        pUserRoleID: req.user.defaultLoginRoleID
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((respOfLockUnlockTrans) => {
                    const respOfLockUnlockPMTTrans = respOfLockUnlockTrans;

                    if (!respOfLockUnlockPMTTrans || respOfLockUnlockPMTTrans.length === 0 || !_.values(respOfLockUnlockPMTTrans[0]) || (_.first(_.values(respOfLockUnlockPMTTrans[0]))).spStatus !== 1) {
                        t.rollback();
                        const respOfSomePMTAlreadyVoided = _.values(respOfLockUnlockPMTTrans[1]);
                        const respOfSomePMTAlreadyLockedUnlocked = _.values(respOfLockUnlockPMTTrans[2]);
                        const respOfAnyNotAllowedToLockRecord = _.values(respOfLockUnlockPMTTrans[3]);
                        const respOfCustRefundValidatedList = _.values(respOfLockUnlockPMTTrans[4]);
                        const respOfToBeLockUnlockInvCMPMTList = _.values(respOfLockUnlockPMTTrans[5]);

                        if (respOfSomePMTAlreadyVoided && (_.first(_.values(respOfSomePMTAlreadyVoided))).isSomePMTAlreadyVoided > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isSomePMTAlreadyVoided: true
                                }
                            });
                        } else if (respOfSomePMTAlreadyLockedUnlocked && (_.first(_.values(respOfSomePMTAlreadyLockedUnlocked))).isSomePMTAlreadyLockedUnlocked > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isSomePMTAlreadyLockedUnlocked: true
                                }
                            });
                        } else if (respOfAnyNotAllowedToLockRecord && (_.first(_.values(respOfAnyNotAllowedToLockRecord))).isAnyNotAllowedToLockRecord > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isAnyNotAllowedToLockRecord: true,
                                    custRefundValidatedList: respOfCustRefundValidatedList
                                }
                            });
                        } else if (req.body.objCustPayDet.isViewToBeLockUnlockRecords && respOfToBeLockUnlockInvCMPMTList && respOfToBeLockUnlockInvCMPMTList.length > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                toBeLockUnlockInvCMPMTList: respOfToBeLockUnlockInvCMPMTList
                            }, null);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    } else {
                        return t.commit().then(() => {
                            _.each(req.body.objCustPayDet.custPaymentListForLock, (custPayItem) => {
                                req.body.epSearchData = {};
                                req.body.epSearchData = {
                                    InvPaymentMstID: custPayItem.invPaymentMstID
                                };
                                req.params['refPaymentMode'] = req.body.objCustPayDet.refPaymentMode;
                                EnterpriseSearchController.manageCustomerPaymentInElastic(req);
                            });

                            let msgContForLockUnlock = null;
                            if (req.body.objCustPayDet.isLockTransaction) {
                                msgContForLockUnlock = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
                            } else {
                                msgContForLockUnlock = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.UNLOCKED_SUCCESSFULLY);
                            }

                            if (req.body.objCustPayDet.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.ReceivablePayment.code) {
                                msgContForLockUnlock.message = COMMON.stringFormat(msgContForLockUnlock.message, 'Customer payment(s)');
                            } else if (req.body.objCustPayDet.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                                msgContForLockUnlock.message = COMMON.stringFormat(msgContForLockUnlock.message, 'Customer write off(s)');
                            } else if (req.body.objCustPayDet.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                msgContForLockUnlock.message = COMMON.stringFormat(msgContForLockUnlock.message, 'Customer refund');
                            }
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msgContForLockUnlock);
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Retrieve list of Customer Payment against ivoice
    // POST : /api/v1/invoicepayment/retrieveCustInvPaymentDetailList
    // @return list of Customer invoice Payments in detail data
    retrieveCustInvPaymentDetailList: (req, res) => {
        if (req.body && req.body.refPaymentModeForInvoicePayment) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustInvPaymentDetailList (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pCustomerIDs,:pPaymentMethodIDs,:pBankAccountCodeIDs,:pExactPaymentNumberSearch,:pPaymentNumber,:pInvoiceNumber,:pAmount,:pExactPaymentAmountSearch,:pFromDate,:pToDate,:pFromInvoiceDate,:pToInvoiceDate,:pFromAppliedDate,:pToAppliedDate,:pIsDisplayZeroPaymentDataOnly,:pRefPaymentMode,:pRefPaymentMstID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pCustomerIDs: req.body.customerIDs || null,
                    pPaymentMethodIDs: req.body.paymentMethodIDs || null,
                    pBankAccountCodeIDs: req.body.bankAccountCodeIDs || null,
                    pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                    pPaymentNumber: req.body.paymentNumber || null,
                    pInvoiceNumber: req.body.invoiceNumber || null,
                    pAmount: req.body.amount || null,
                    pExactPaymentAmountSearch: req.body.exactPaymentAmountSearch || false,
                    pFromDate: req.body.fromDate || null,
                    pToDate: req.body.toDate || null,
                    pFromInvoiceDate: req.body.fromInvoiceDate || null,
                    pToInvoiceDate: req.body.toInvoiceDate || null,
                    pFromAppliedDate: req.body.fromAppliedDate || null,
                    pToAppliedDate: req.body.toAppliedDate || null,
                    pIsDisplayZeroPaymentDataOnly: req.body.isDisplayZeroPaymentDataOnly || false,
                    pRefPaymentMode: req.body.refPaymentModeForInvoicePayment,
                    pRefPaymentMstID: req.body.refPaymentMstID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                invoicePayment: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrieve list of Customer Refund againts payments
    // POST : /api/v1/invoicepayment/getAllRefundPaymentOfCustomer
    // @return list of Customer Refund againts payment in detail data
    getAllRefundPaymentOfCustomer: (req, res) => {
        if (req.body && req.body.custPayInfo && req.body.custPayInfo.customerID && req.body.custPayInfo.refPaymentMode) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetAllPaymentOfCustomerRefund (:pCustomerID,:pCustRefundMstID,:pRefPaymentMode)', {
                replacements: {
                    pCustomerID: req.body.custPayInfo.customerID,
                    pCustRefundMstID: req.body.custPayInfo.custRefundMstID || null,
                    pRefPaymentMode: req.body.custPayInfo.refPaymentMode
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                let custPaymentList = [];
                if (response && response.length) {
                    custPaymentList = _.values(response[0]);
                }
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                    {
                        customerPaymentList: custPaymentList
                    },
                    null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrieve list of Customer Refund againts Credit Memo
    // POST : /api/v1/invoicepayment/getAllCreditMemoOfCustomerRefund
    // @return list of Customer Refund againts Credit Memo in detail data
    getAllCreditMemoOfCustomerRefund: (req, res) => {
        if (req.body && req.body.custPayInfo && req.body.custPayInfo.customerID && req.body.custPayInfo.transTypeForCreditMemo) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetAllCreditMemoOfCustomerRefund (:pCustomerID,:pCustRefundMstID,:pCreditMemoTransType,:pRefPaymentMode)', {
                replacements: {
                    pCustomerID: req.body.custPayInfo.customerID,
                    pCustRefundMstID: req.body.custPayInfo.custRefundMstID || null,
                    pCreditMemoTransType: req.body.custPayInfo.transTypeForCreditMemo,
                    pRefPaymentMode: req.body.custPayInfo.RefPaymentMode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                customerCreditMemoList: response && response.length ? _.values(response[0]) : []
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // update customer refund
    // POST : /api/v1/invoicepayment/updateCustomerRefund
    // @return update details of refund
    updateCustomerRefund: (req, res) => {
        if (req.body && req.body.custRefObj && req.body.custRefObj.custRefundMstID && req.body.custRefObj.mfgcodeID
            && req.body.custRefObj.paymentAmount > 0 && req.body.custRefObj.accountReference && req.body.custRefObj.refPaymentMode
            && (req.body.custRefObj.paymentDate || req.body.custRefObj.paymentType || req.body.custRefObj.bankAccountMasID || req.body.custRefObj.bankAccountNo || req.body.custRefObj.bankName)) {
            const {
                sequelize, PackingslipInvoicePayment
            } = req.app.locals.models;


            return PackingslipInvoicePayment.findOne({
                where: {
                    id: req.body.custRefObj.custRefundMstID,
                    isDeleted: false
                },
                attributes: ['paymentAmount', 'paymentNumber', 'offsetAmount', 'isPaymentVoided', 'lockStatus']
            }).then((respOfCustRefund) => {
                if (!respOfCustRefund || (req.body.custRefObj.refPaymentMode !== DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code)) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(customerRefundModuleName), err: null, data: null });
                }

                return sequelize.transaction().then(t => sequelize
                    .query('CALL Sproc_UpdateCustomerRefund (:pCustPaymentDetList,:pCustCMDetList,:pCustRefundMstID,:pMfgcodeID,:pPaymentNumber,:pPaymentDate,:pPaymentAmount,:pPaymentType,:pAccountReference,:pBankAccountMasID,:pBankAccountNo,:pBankName,:pRemark,:pRefPaymentMode,:pTotSelectedPayOfCust,:pTotSelectedCMOfCust,:pDeleteCustPaymentDetList,:pDeleteCustCMDetList,:pDepositBatchNumber,:pUserID,:pUserRoleID,:pOffsetAmount,:pBillToName,:pBillToAddress,:pIsMarkAsPaid,:pSubStatus,:pStatus,:pBillToAddressID,:pBillToContactPersonID,:pBillToContactPerson)', {
                        replacements: {
                            pCustPaymentDetList: req.body.custRefObj.custPaymentDetList.length > 0 ? JSON.stringify(req.body.custRefObj.custPaymentDetList) : null,
                            pCustCMDetList: req.body.custRefObj.custCMDetList.length > 0 ? JSON.stringify(req.body.custRefObj.custCMDetList) : null,
                            pCustRefundMstID: req.body.custRefObj.custRefundMstID,
                            pMfgcodeID: req.body.custRefObj.mfgcodeID,
                            pPaymentNumber: req.body.custRefObj.paymentNumber || null,
                            pPaymentDate: req.body.custRefObj.paymentDate,
                            pPaymentAmount: req.body.custRefObj.paymentAmount,
                            pPaymentType: req.body.custRefObj.paymentType,
                            pAccountReference: req.body.custRefObj.accountReference,
                            pBankAccountMasID: req.body.custRefObj.bankAccountMasID,
                            pBankAccountNo: req.body.custRefObj.bankAccountNo,
                            pBankName: req.body.custRefObj.bankName,
                            pRemark: req.body.custRefObj.remark || null,
                            pRefPaymentMode: req.body.custRefObj.refPaymentMode,
                            pTotSelectedPayOfCust: req.body.custRefObj.custPaymentDetList.length,
                            pTotSelectedCMOfCust: req.body.custRefObj.custCMDetList.length,
                            pDeleteCustPaymentDetList: req.body.custRefObj.deleteCustPaymentDetList.length > 0 ? JSON.stringify(req.body.custRefObj.deleteCustPaymentDetList) : null,
                            pDeleteCustCMDetList: req.body.custRefObj.deleteCustCMDetList.length > 0 ? JSON.stringify(req.body.custRefObj.deleteCustCMDetList) : null,
                            pDepositBatchNumber: req.body.custRefObj.depositBatchNumber || null,
                            pUserID: req.user.id,
                            pUserRoleID: req.user.defaultLoginRoleID,
                            pOffsetAmount: req.body.custRefObj.offsetAmount,
                            pBillToName: req.body.custRefObj.billToName || null,
                            pBillToAddress: req.body.custRefObj.billToAddress || null,
                            pIsMarkAsPaid: req.body.custRefObj.isMarkAsPaid,
                            pSubStatus: req.body.custRefObj.subStatus,
                            pStatus: req.body.custRefObj.status,
                            pBillToAddressID: req.body.custRefObj.billToAddressID || null,
                            pBillToContactPersonID: req.body.custRefObj.billToContactPersonID || null,
                            pBillToContactPerson: req.body.custRefObj.billToContactPerson || null
                        },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    }).then((respOfRefund) => {
                        const respOfRefundAndDetList = respOfRefund;

                        if (!respOfRefundAndDetList || respOfRefundAndDetList.length === 0 || !_.values(respOfRefundAndDetList[0]) || (_.first(_.values(respOfRefundAndDetList[0]))).spStatus !== 1) {
                            t.rollback();
                            const respOfDeletedPaymentDetRecords = _.values(respOfRefundAndDetList[1]);
                            const respOfDeletedCMDetRecords = _.values(respOfRefundAndDetList[2]);
                            const respOfMismatchPaymentDetRecords = _.values(respOfRefundAndDetList[3]);
                            const respOfMismatchCMDetRecords = _.values(respOfRefundAndDetList[4]);

                            if (respOfDeletedPaymentDetRecords && respOfDeletedPaymentDetRecords.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: null,
                                    err: null,
                                    data: {
                                        deleteCustPaymentDetList: respOfDeletedPaymentDetRecords
                                    }
                                });
                            } else if (respOfDeletedCMDetRecords && respOfDeletedCMDetRecords.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: null,
                                    err: null,
                                    data: {
                                        deleteCustCMDetList: respOfDeletedCMDetRecords
                                    }
                                });
                            } else if (respOfMismatchPaymentDetRecords && respOfMismatchPaymentDetRecords.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: null,
                                    err: null,
                                    data: {
                                        mismatchPaymentDetList: respOfMismatchPaymentDetRecords
                                    }
                                });
                            } else if (respOfMismatchCMDetRecords && respOfMismatchCMDetRecords.length > 0) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: null,
                                    err: null,
                                    data: {
                                        mismatchCMDetList: respOfMismatchCMDetRecords
                                    }
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                            }
                        } else {
                            // save generic authentication and other details
                            const promisesSaveOtherDet = [];
                            if (req.body.custRefObj.authenticationApprovedDet) {
                                req.body.authenticationApprovedDet = req.body.custRefObj.authenticationApprovedDet;
                                promisesSaveOtherDet.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                            }

                            return Promise.all(promisesSaveOtherDet).then(() => t.commit().then(() => {
                                req.body.epSearchData = {};
                                req.body.epSearchData = {
                                    InvPaymentMstID: req.body.custRefObj.custRefundMstID
                                };
                                req.params['refPaymentMode'] = req.body.custRefObj.refPaymentMode;
                                EnterpriseSearchController.manageCustomerPaymentInElastic(req);

                                let paymentSuccessMsg = null;
                                if (req.body.custRefObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                    paymentSuccessMsg = MESSAGE_CONSTANT.UPDATED(customerRefundModuleName);
                                }

                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, paymentSuccessMsg);
                            })).catch((err) => {
                                if (!t.finished) { t.rollback(); }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        if (!t.finished) { t.rollback(); }
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // create customer Refund
    // POST : /api/v1/invoicepayment/createCustomerRefund
    // @return created customer Refund
    createCustomerRefund: (req, res) => {
        if (req.body && req.body.custRefObj && req.body.custRefObj.mfgcodeID && req.body.custRefObj.paymentAmount > 0
            && req.body.custRefObj.accountReference && req.body.custRefObj.refPaymentMode
            && (req.body.custRefObj.paymentDate || req.body.custRefObj.paymentType || req.body.custRefObj.bankAccountMasID || req.body.custRefObj.bankAccountNo || req.body.custRefObj.bankName)) {
            const {
                sequelize
            } = req.app.locals.models;

            return sequelize.transaction().then((t) => {
                let identityTypeFor = null;
                if (req.body.custRefObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                    identityTypeFor = DATA_CONSTANT.IDENTITY.CustomerRefundSystemID;
                }

                UTILITY_CONTROLLER.getSystemIdPromise(req, res, identityTypeFor, t).then((respOfSystemIdPromise) => {
                    if (!respOfSystemIdPromise || !respOfSystemIdPromise.systemId) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    }
                    const systemIDForCustRefund = respOfSystemIdPromise.systemId;
                    return sequelize
                        .query('CALL Sproc_CreateCustomerRefund (:pCustPaymentDetList,:pCustCMDetList,:pMfgcodeID,:pPaymentNumber,:pPaymentDate,:pPaymentAmount,:pPaymentType,:pAccountReference,:pBankAccountMasID,:pBankAccountNo,:pBankName,:pRemark,:pRefPaymentMode,:pTotSelectedPayOfCust,:pTotSelectedCMOfCust,:pSystemID,:pDepositBatchNumber,:pUserID,:pUserRoleID,:pRefGencTransModeID,:pOffsetAmount,:pBillToName,:pBillToAddress,:pIsMarkAsPaid,:pBillToAddressID,:pBillToContactPersonID,:pBillToContactPerson)', {
                            replacements: {
                                pCustPaymentDetList: req.body.custRefObj.custPaymentDetList.length > 0 ? JSON.stringify(req.body.custRefObj.custPaymentDetList) : null,
                                pCustCMDetList: req.body.custRefObj.custCMDetList.length > 0 ? JSON.stringify(req.body.custRefObj.custCMDetList) : null,
                                pMfgcodeID: req.body.custRefObj.mfgcodeID,
                                pPaymentNumber: req.body.custRefObj.paymentNumber || null,
                                pPaymentDate: req.body.custRefObj.paymentDate,
                                pPaymentAmount: req.body.custRefObj.paymentAmount,
                                pPaymentType: req.body.custRefObj.paymentType,
                                pAccountReference: req.body.custRefObj.accountReference,
                                pBankAccountMasID: req.body.custRefObj.bankAccountMasID,
                                pBankAccountNo: req.body.custRefObj.bankAccountNo,
                                pBankName: req.body.custRefObj.bankName,
                                pRemark: req.body.custRefObj.remark || null,
                                pRefPaymentMode: req.body.custRefObj.refPaymentMode,
                                pTotSelectedPayOfCust: req.body.custRefObj.custPaymentDetList.length,
                                pTotSelectedCMOfCust: req.body.custRefObj.custCMDetList.length,
                                pSystemID: systemIDForCustRefund,
                                pDepositBatchNumber: req.body.custRefObj.depositBatchNumber || null,
                                pUserID: req.user.id,
                                pUserRoleID: req.user.defaultLoginRoleID,
                                pRefGencTransModeID: req.body.custRefObj.refGencTransModeID,
                                pOffsetAmount: req.body.custRefObj.offsetAmount || null,
                                pBillToName: req.body.custRefObj.billToName || null,
                                pBillToAddress: req.body.custRefObj.billToAddress || null,
                                pIsMarkAsPaid: req.body.custRefObj.isMarkAsPaid,
                                pBillToAddressID: req.body.custRefObj.billToAddressID || null,
                                pBillToContactPersonID: req.body.custRefObj.billToContactPersonID || null,
                                pBillToContactPerson: req.body.custRefObj.billToContactPerson || null
                            },
                            type: sequelize.QueryTypes.SELECT,
                            transaction: t
                        }).then((respOfRefund) => {
                            const respOfRefundAndDetList = respOfRefund;

                            if (!respOfRefundAndDetList || respOfRefundAndDetList.length === 0 || !_.values(respOfRefundAndDetList[0]) || (_.first(_.values(respOfRefundAndDetList[0]))).spStatus !== 1) {
                                t.rollback();
                                const respOfMismatchPaymentDetRecords = _.values(respOfRefundAndDetList[1]);
                                const respOfMismatchCMDetRecords = _.values(respOfRefundAndDetList[2]);

                                if (respOfMismatchPaymentDetRecords && respOfMismatchPaymentDetRecords.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: null,
                                        err: null,
                                        data: {
                                            mismatchPaymentDetList: respOfMismatchPaymentDetRecords
                                        }
                                    });
                                } else if (respOfMismatchCMDetRecords && respOfMismatchCMDetRecords.length > 0) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: null,
                                        err: null,
                                        data: {
                                            mismatchCMDetList: respOfMismatchCMDetRecords
                                        }
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                }
                            } else {
                                // save generic authentication and other details
                                const promisesSaveOtherDet = [];
                                if (req.body.custRefObj.authenticationApprovedDet) {
                                    req.body.authenticationApprovedDet = req.body.custRefObj.authenticationApprovedDet;
                                    req.body.authenticationApprovedDet.refID = _.first(_.values(respOfRefundAndDetList[3])).insertedRefundMstID;

                                    promisesSaveOtherDet.push(GenericAuthenticationController.addAuthenticatedApprovalReasonWithWorkingProcess(req, t));
                                }

                                return Promise.all(promisesSaveOtherDet).then(() => t.commit().then(() => {
                                    req.body.epSearchData = {};
                                    req.body.epSearchData = {
                                        InvPaymentMstID: _.first(_.values(respOfRefundAndDetList[3])).insertedRefundMstID
                                    };
                                    req.params['refPaymentMode'] = req.body.custRefObj.refPaymentMode;
                                    EnterpriseSearchController.manageCustomerPaymentInElastic(req);

                                    let paymentSuccessMsg = null;
                                    if (req.body.custRefObj.refPaymentMode === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                        paymentSuccessMsg = MESSAGE_CONSTANT.CREATED(customerRefundModuleName);
                                    }

                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                                        {
                                            insertedRefundMstID: _.first(_.values(respOfRefundAndDetList[3])).insertedRefundMstID
                                        },
                                        paymentSuccessMsg);
                                })).catch((err) => {
                                    if (!t.finished) { t.rollback(); }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get customer refund master data
    // POST : /api/v1/invoicepayment/getCustRefundMstData
    // @return customer refund master data
    getCustRefundMstData: (req, res) => {
        if (req.body && req.body.custRefundMstID && req.body.refPaymentMode) {
            const { sequelize } = req.app.locals.models;

            return sequelize.query('CALL Sproc_GetCustomerRefundByMstID (:pCustRefundMstID,:pRefPaymentMode)', {
                replacements: {
                    pCustRefundMstID: req.body.custRefundMstID,
                    pRefPaymentMode: req.body.refPaymentMode
                },
                type: sequelize.QueryTypes.SELECT
            }).then((respOfCustRefund) => {
                if (!respOfCustRefund || !respOfCustRefund[0] || !_.values(respOfCustRefund[0])) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.NOT_FOUND(customerRefundModuleName), err: null, data: null });
                }
                const custRefDet = _.first(_.values(respOfCustRefund[0]));
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS,
                    { custRefundMstData: custRefDet }, null);
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get customer refund data againts payment and credit memo for list summary page
    // POST : /api/v1/invoicepayment/retrieveCustomerRefunds
    // @return customer refund data for list summary page
    retrieveCustomerRefunds: (req, res) => {
        if (req.body && req.body.refPaymentModeForRefund) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustAllRefundSummaryList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pCustomerIDs,:pPaymentMethodIDs,:pBankAccountCodeIDs,:pTransactionModeIDs,:pRefundSubStatusIDs,:pExactPaymentNumberSearch,:pPaymentNumber,:pPaymentCMNumber,:pAmount,:pExactRefundAmountSearch,:pFromDate,:pToDate,:pFromCMPaymentDate,:pToCMPaymentDate,:pRefPaymentMode,:pTransModeType,:pIsIncludeVoidedTransaction)', {
                replacements: {
                    pPageIndex: req.body.Page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pCustomerIDs: req.body.customerIDs || null,
                    pPaymentMethodIDs: req.body.paymentMethodIDs || null,
                    pBankAccountCodeIDs: req.body.bankAccountCodeIDs || null,
                    pTransactionModeIDs: req.body.transactionModeIDs || null,
                    pRefundSubStatusIDs: req.body.refundSubStatusIDs || null,
                    pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                    pPaymentNumber: req.body.paymentNumber || null,
                    pPaymentCMNumber: req.body.paymentCMNumber || null,
                    pAmount: req.body.amount || null,
                    pExactRefundAmountSearch: req.body.exactRefundAmountSearch || false,
                    pFromDate: req.body.fromDate || null,
                    pToDate: req.body.toDate || null,
                    pFromCMPaymentDate: req.body.fromCMPaymentDate || null,
                    pToCMPaymentDate: req.body.toCMPaymentDate || null,
                    pRefPaymentMode: req.body.refPaymentModeForRefund,
                    pTransModeType: req.body.transModeType || null,
                    pIsIncludeVoidedTransaction: req.body.isIncludeVoidedTransaction || false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                refundDetails: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get customer refund data againts payment and credit memo for list Detail page
    // POST : /api/v1/invoicepayment/retrieveCustomerRefundsDetailList
    // @return customer refund data for list Detail page
    retrieveCustomerRefundsDetailList: (req, res) => {
        if (req.body && req.body.refPaymentModeForRefund) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustomerAllRefundDetailLst(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pCustomerIDs,:pPaymentMethodIDs,:pBankAccountCodeIDs,:pTransactionModeIDs,:pExactPaymentNumberSearch,:pPaymentNumber,:pPaymentCMNumber,:pAmount,:pExactRefundAmountSearch,:pFromDate,:pToDate,:pFromCMPaymentDate,:pToCMPaymentDate,:pRefPaymentMode,:pTransModeType,:pRefPaymentMstID)', {
                replacements: {
                    pPageIndex: req.body.Page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pCustomerIDs: req.body.customerIDs || null,
                    pPaymentMethodIDs: req.body.paymentMethodIDs || null,
                    pBankAccountCodeIDs: req.body.bankAccountCodeIDs || null,
                    pTransactionModeIDs: req.body.transactionModeIDs || null,
                    pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                    pPaymentNumber: req.body.paymentNumber || null,
                    pPaymentCMNumber: req.body.paymentCMNumber || null,
                    pAmount: req.body.amount || null,
                    pExactRefundAmountSearch: req.body.exactRefundAmountSearch || false,
                    pFromDate: req.body.fromDate || null,
                    pToDate: req.body.toDate || null,
                    pFromCMPaymentDate: req.body.fromCMPaymentDate || null,
                    pToCMPaymentDate: req.body.toCMPaymentDate || null,
                    pRefPaymentMode: req.body.refPaymentModeForRefund,
                    pTransModeType: req.body.transModeType || null,
                    pRefPaymentMstID: req.body.refPaymentMstID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                refundDetails: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // get customer refund data againts payment and credit memo for Pop up Detail
    // POST : /api/v1/invoicepayment/retrieveCustRefundedListByRefTrans
    // @return customer refund data for pop up list
    retrieveCustRefundedListByRefTrans: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.refPaymentModeForRefund && req.body.paymentCMMstID) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrieveCustRefundedListByRefTrans(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPayCMID,:pRefPaymentMode,:pTransModeType,:pIsDisplayAllTransWhereCreditUsed)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPayCMID: req.body.paymentCMMstID,
                    pRefPaymentMode: req.body.refPaymentModeForRefund,
                    pTransModeType: req.body.transModeType || null,
                    pIsDisplayAllTransWhereCreditUsed: req.body.isDisplayAllTransWhereCreditUsed || false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                refundDetails: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Check duplicate refund payment / supplier payment number exist or not
    // post:/api/v1/invoicepayment/checkDuplicateRefundPaymentCheckNum
    // @retrun validity of payment# check#
    checkDuplicateRefundPaymentCheckNum: (req, res) => {
        if (req.body && req.body.paymentNumber) {
            const {
                PackingslipInvoicePayment
            } = req.app.locals.models;

            const whereClausePayment = {
                paymentNumber: req.body.paymentNumber,
                bankAccountNo: req.body.bankAccountNo,
                refPaymentMode: {
                    [Op.in]: [DATA_CONSTANT.RefPaymentModeForInvoicePayment.CustomerRefund, DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable]
                },
                isPaymentVoided: false,
                isDeleted: false
            };

            if (req.body.custRefundMstID) {
                whereClausePayment.id = {
                    [Op.ne]: req.body.custRefundMstID
                };
            }

            return PackingslipInvoicePayment.findOne({
                where: whereClausePayment,
                attributes: ['id']
            }).then((paymentInfo) => {
                if (paymentInfo) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: null,
                        err: null,
                        data: {
                            isDuplicatePaymentNumber: true
                        }
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        isDuplicatePaymentNumber: false
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Retrieve list of Customer refund and supplier payment by payment number
    // POST : /api/v1/invoicepayment/getCustSuppRefundListByPaymentNum
    // @return list of Customer/supplier duplicate payments
    getCustSuppRefundListByPaymentNum: (req, res) => {
        if (req.body && req.body.paymentNumber) {
            const {
                sequelize
            } = req.app.locals.models;

            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_GetCustSuppRefundListByPaymentNum (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pPaymentNumber,:pBankAccountNo,:pCustRefundMstID)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPaymentNumber: req.body.paymentNumber,
                    pBankAccountNo: req.body.bankAccountNo,
                    pCustRefundMstID: req.body.custRefundMstID || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                refundDetails: _.values(response[1]),
                Count: response[0][0]['TotalRecord']
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // Update Lock / unlock status  of applied customer credit memo
    // POST : /api/v1/invoicepayment/lockUnlockAppliedCustCreditMemo
    // @return SUCCESS with locking applied customer credit memo (common SP for customer packing slip and applied cust credit memo)
    lockUnlockAppliedCustCreditMemo: (req, res) => {
        if (req && req.body && req.body.objCustPayDet && req.body.objCustPayDet.refPaymentMode && req.body.objCustPayDet.custPaymentListForLock && req.body.objCustPayDet.custPaymentListForLock.length > 0) {
            const { sequelize } = req.app.locals.models;
            return sequelize.transaction().then(t => sequelize
                .query('CALL Sproc_LockUnlockCustInvCMTransaction (:pIsLockTransaction,:pCustInvCMList,:pTransType,:pRefPaymentMode,:pIsViewToBeLockUnlockRecords,:pUserID,:pUserRoleID)', {
                    replacements: {
                        pIsLockTransaction: req.body.objCustPayDet.isLockTransaction,
                        pCustInvCMList: JSON.stringify(req.body.objCustPayDet.custPaymentListForLock),
                        pTransType: null,
                        pRefPaymentMode: req.body.objCustPayDet.refPaymentMode,
                        pIsViewToBeLockUnlockRecords: req.body.objCustPayDet.isViewToBeLockUnlockRecords,
                        pUserID: req.user.id,
                        pUserRoleID: req.user.defaultLoginRoleID
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((respOfLockUnlockTrans) => {
                    const respOfLockUnlockAppliedCM = respOfLockUnlockTrans;

                    if (!respOfLockUnlockAppliedCM || respOfLockUnlockAppliedCM.length === 0 || !_.values(respOfLockUnlockAppliedCM[0]) || (_.first(_.values(respOfLockUnlockAppliedCM[0]))).spStatus !== 1) {
                        t.rollback();

                        const respOfSomeInvCMWhichNotFullyApplied = _.values(respOfLockUnlockAppliedCM[1]);
                        const respOfSomePMTAlreadyVoided = _.values(respOfLockUnlockAppliedCM[3]);
                        const respOfSomePMTAlreadyLockedUnlocked = _.values(respOfLockUnlockAppliedCM[4]);
                        const respOfToBeLockUnlockInvCMPMTList = _.values(respOfLockUnlockAppliedCM[5]);

                        if (respOfSomePMTAlreadyVoided && (_.first(_.values(respOfSomePMTAlreadyVoided))).isSomePMTAlreadyVoided > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isSomePMTAlreadyVoided: true
                                }
                            });
                        } else if (respOfSomePMTAlreadyLockedUnlocked && (_.first(_.values(respOfSomePMTAlreadyLockedUnlocked))).isSomePMTAlreadyLockedUnlocked > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isSomePMTAlreadyLockedUnlocked: true
                                }
                            });
                        } else if (respOfSomeInvCMWhichNotFullyApplied && (_.first(_.values(respOfSomeInvCMWhichNotFullyApplied))).isAnyInvCMWhichNotFullyApplied > 0) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: null,
                                err: null,
                                data: {
                                    isAnyInvCMWhichNotFullyApplied: true
                                }
                            });
                        } else if (req.body.objCustPayDet.isViewToBeLockUnlockRecords && respOfToBeLockUnlockInvCMPMTList && respOfToBeLockUnlockInvCMPMTList.length > 0) {
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                toBeLockUnlockInvCMPMTList: respOfToBeLockUnlockInvCMPMTList
                            }, null);
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                        }
                    } else {
                        return t.commit().then(() => {
                            let msgContForLockUnlock = null;
                            if (req.body.objCustPayDet.isLockTransaction) {
                                msgContForLockUnlock = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
                            } else {
                                msgContForLockUnlock = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.UNLOCKED_SUCCESSFULLY);
                            }
                            msgContForLockUnlock.message = COMMON.stringFormat(msgContForLockUnlock.message, 'Applied customer credit memo');
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, msgContForLockUnlock);
                        }).catch((err) => {
                            if (!t.finished) { t.rollback(); }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) { t.rollback(); }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
        }
    }
};
