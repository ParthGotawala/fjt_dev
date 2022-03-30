const resHandler = require('../../resHandler');
const { Op } = require('sequelize');
const fs = require('fs');
const fsExtra = require('fs-extra');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
/* errors file*/
const { ECONNREFUSED, ETIMEDOUT, ENOTFOUND } = require('../../errors');
const _ = require('lodash');
var http = require('https');
require('https').globalAgent.options.rejectUnauthorized = false;

const config = require('./../../../config/config.js');
const RFQSocketController = require('../../rfq_consolidated_mfgpn_lineitem/controllers/RFQSocketController');
const EnterpriseSearchController = require('../../enterprise_search/controllers/Enterprise_SearchController');
const GenericFilesController = require('../../genericfiles/controllers/GenericFilesController');
const UTILITY_CONTROLLER = require('../../utility/controllers/UtilityController');

const packingSlipModuleName = DATA_CONSTANT.PACKING_SLIP.Name;
const invoice = DATA_CONSTANT.PACKING_SLIP.Invoice;
const creditMemo = DATA_CONSTANT.PACKING_SLIP.CreditMemo;
const debitMemo = DATA_CONSTANT.PACKING_SLIP.DebitMemo;
const invoicePaymentModuleName = DATA_CONSTANT.PACKING_SLIP.InvoicePayment;
const packingSlipMaterialModuleName = DATA_CONSTANT.PACKING_SLIP_MATERIAL.Name;
const supplierInvoiceMaterialModuleName = DATA_CONSTANT.SUPPLIER_INVOICE_MATERIAL.Name;
const creditMemoModuleName = DATA_CONSTANT.SUPPLIER_INVOICE_MATERIAL.CreditMemo;
const debitMemoModuleName = DATA_CONSTANT.SUPPLIER_INVOICE_MATERIAL.DebitMemo;
const supplierRMAModuleName = DATA_CONSTANT.SUPPLIER_RMA.Name;
const supplierRMAMaterialModuleName = DATA_CONSTANT.SUPPLIER_RMA.MaterialName;
const materialReceivePartInstructon = DATA_CONSTANT.MATERIAL_RECEIVE_PART_INSTRUCTION.Name;
const packingInputFields = ['id', 'systemId', 'poNumber', 'poDate', 'mfgCodeID', 'supplierSONumber', 'soDate', 'packingSlipNumber', 'packingSlipDate',
    'invoiceNumber', 'invoiceDate', 'creditMemoNumber', 'creditMemoDate', 'debitMemoNumber', 'debitMemoDate', 'receiptDate',
    'description', 'billToAddress', 'billToAddressID', 'billToConactPerson', 'billToContactPersonID',
    'shipToAddress', 'poVersion', 'documentPath', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt',
    'deletedBy', 'deletedAt', 'isDeleted', 'receiptType', 'status', 'packingSlipModeStatus', 'chequeNumber', 'bankName', 'chequeDate', 'chequeAmount', 'applyDate',
    'refParentCreditDebitInvoiceno', 'refPackingSlipNumberForInvoice', 'invoiceTotalDue', 'isTariffInvoice', 'creditMemoType', 'createByRoleId',
    'updateByRoleId', 'deleteByRoleId', 'scanLabel', 'refPayementid', 'paymentTermsID', 'termsDays', 'remark', 'internalRemark', 'shippingMethodId', 'carrierId', 'carrierAccountNumber', 'shippingInsurance',
    'rmaShippingAddress', 'rmaShippingAddressId', 'rmaShippingContactPerson', 'rmaShippingContactPersonID',
    'rmaMarkForAddress', 'rmaMarkForAddressId', 'rmaMarkForContactPerson', 'rmaMarkForContactPersonID',
    'invoiceRequireManagementApproval', 'refPurchaseOrderID', 'lockStatus', 'refSupplierCreditMemoNumber', 'invoiceApprovalStatus',
    'markedForRefund', 'markedForRefundAmt', 'holdUnholdId', 'refParentCreditDebitInvoiceHoldUnholdId', 'isCustConsigned', 'customerID', 'isNonUMIDStock',
    'isZeroValue'
];

const materialInputFields = ['id', 'refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'internalRef', 'nickname', 'partID', 'refSupplierPartId',
    'scanLabel', 'orderedQty', 'receivedQty', 'packingSlipQty', 'binID', 'warehouseID', 'parentWarehouseID', 'invoicePrice', 'purchasePrice',
    'disputedPrice', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt', 'isDeleted', 'approveNote',
    'otherCharges', 'status', 'extendedPrice', 'extendedReceivedPrice', 'refCreditDebitInvoiceNo', 'refPackingSlipDetId', 'difference', 'differenceQty', 'isMemoForPrice', 'isMemoForQty',
    'umidCreated', 'poReleaseNumber', 'packagingID',
    'receivedStatus', 'remark', 'internalRemark', 'comment', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId', 'allReceivedQty', 'purchaseInspectionComment',
    'refPackingSlipIdForRma', 'refPackingSlipDetIdForRMA', 'refInvoiceIdForRma', 'refPackingSlipForRma', 'refInvoiceForRma', 'refPurchaseOrderDetID', 'refPOReleaseLineID', 'refPOLineID', 'discount',
    'rohsstatus', 'isReceivedWrongPart', 'disputeQty', 'pendingLines', 'acceptedWithDeviationLines', 'totalLines', 'rejectedLines', 'acceptedLines', 'isLineCustConsigned', 'isNonUMIDStock', 'lineCustomerID', 'umidCreated',
    'isZeroValue'
];

const trackNumberInputFields = ['id', 'refPackingSlipMaterialRecID', 'trackNumber', 'createdBy', 'createdAt', 'updatedBy',
    'updatedAt', 'deletedBy', 'deletedAt', 'isDeleted', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'
];

const approvalInputFields = ['id', 'transactionType', 'approveFromPage', 'confirmationType', 'refTableName', 'refID', 'approvedBy', 'approvalReason',
    'isDeleted', 'createdBy', 'updatedBy', 'deletedBy'
];

const packingSlipPurchaseDetailInputFields = ['id', 'lineId', 'partId', 'instruction', 'inspectionStatus', 'remark', 'createdBy', 'createdAt', 'createByRoleId',
    'updatedBy', 'updatedAt', 'updateByRoleId', 'isDeleted', 'deletedAt', 'deletedBy', 'deleteByRoleId', 'category', 'requiementType'
];

const packingslipInvoicePaymentInputFields = ['systemId', 'mfgcodeID', 'paymentNumber', 'paymentDate', 'paymentAmount', 'paymentType', 'accountReference', 'bankAccountMasID',
    'bankAccountNo', 'bankName', 'payToName', 'payToAddress', 'payToAddressID', 'payToContactPersonID', 'payToContactPerson',
    'billToName', 'billToAddress', 'billToAddressID', 'billToContactPersonID', 'billToContactPerson',
    'remark', 'isDeleted', 'isPaymentVoided', 'voidPaymentReason',
    'createdBy', 'createByRoleId', 'updatedBy', 'updateByRoleId', 'deletedBy', 'deleteByRoleId', 'refPaymentMode', 'lockStatus', 'lockedBy', 'lockedByRoleId', 'lockedAt',
    'depositBatchNumber', 'offsetAmount', 'refGencTransModeID', 'acctId'
];

const PackingslipInvoicePaymentDetInputFields = ['id', 'refPayementid', 'refPackingslipInvoiceID', 'createdBy', 'createdAt', 'updatedBy',
    'updatedAt', 'deletedBy', 'deletedAt', 'isDeleted', 'createByRoleId', 'updateByRoleId', 'deleteByRoleId'
];

module.exports = {
    // Retrive list of packing slip
    // POST : /api/v1/packing_slip/getPackingSlipList
    // @return list of packing slip
    getPackingSlipList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        const filter = COMMON.UiGridFilterSearch(req);
        if (req.body.chequeNumber) {
            filter.where.chequeNumber = req.body.chequeNumber;
        }
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

        // let receivedStatusFilter = [];
        // _.each(req.body.receivedStatusFilter, (value, key) => {
        //     if (value) {
        //         receivedStatusFilter.push(COMMON.stringFormat('{0} > 0', key));
        //     }
        // });
        // receivedStatusFilter = receivedStatusFilter.join(' OR ');

        sequelize.query('CALL Sproc_RetrivePackingSlipMaterialReceiveList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pReceiptType,:pMfgCodeIds,:pAdvanceSearchPoSoPsInv,:pMfrPnId,:pReceiveStatus,:pPackingSlipFromDate,:pPackingSlipToDate,:pExactPaymentNumberSearch,:pPaymentNumber,:pLockStatusFilter,:pPostingStatusFilter,:pPSComments,:pSelectedDateType)', {
            replacements: {
                pPageIndex: req.body.page,
                pRecordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pReceiptType: req.body.receiptType ? req.body.receiptType : null,
                pMfgCodeIds: req.body.mfgCodeIds || null,
                pAdvanceSearchPoSoPsInv: req.body.advanceSearchPoSoPsInv || null,
                pMfrPnId: req.body.mfrPnId || null,
                pReceiveStatus: req.body.receivedStatusFilter,
                pPackingSlipFromDate: req.body.packingSlipFromDate || null,
                pPackingSlipToDate: req.body.packingSlipToDate || null,
                pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                pPaymentNumber: req.body.paymentNumber || null,
                pLockStatusFilter: req.body.lockStatusFilter || null,
                pPostingStatusFilter: req.body.PostingStatusFilter || null,
                pPSComments: req.body.PSComments || null,
                pSelectedDateType: req.body.selectedDateType || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res,
            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
            STATE.SUCCESS, {
            packingSlip: _.values(response[1]),
            Count: response[0][0].TotalRecord
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get detail of packing slip master
    // GET : /api/v1/packing_slip/getPackingSlipDet/:id
    // @return list of packing slip
    getPackingSlipDet: async (req, res) => {
        const {
            sequelize,
            MfgCodeMst,
            PackingSlipMaterialReceive,
            PackingSlipTrackNumber,
            PackingslipInvoicePaymentDet,
            PackingslipInvoicePayment,
            User,
            Employee
        } = req.app.locals.models;

        let currentModuleName = null;
        if (req.params.receiptType === 'P') {
            currentModuleName = packingSlipModuleName;
        } else if (req.params.receiptType === 'I') {
            currentModuleName = invoice;
        } else if (req.params.receiptType === 'C') {
            currentModuleName = creditMemo;
        } else if (req.params.receiptType === 'D') {
            currentModuleName = debitMemo;
        } else if (req.params.receiptType === 'R') {
            currentModuleName = supplierRMAModuleName;
        }

        if (req.params.id) {
            try {
                var mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }

            return await PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.params.id,
                    receiptType: req.params.receiptType
                },
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName', 'invoicesRequireManagementApproval',
                        [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'),
                            mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                    required: false
                }, {
                    model: PackingSlipTrackNumber,
                    as: 'packingSlipTrackNumber',
                    attributes: trackNumberInputFields,
                    required: false
                }, {
                    model: PackingSlipMaterialReceive,
                    as: 'refInvoice',
                    attributes: ['id', 'invoiceNumber', 'invoiceDate', 'creditMemoNumber', 'creditMemoDate', 'debitMemoNumber', 'debitMemoDate', 'status'],
                    required: false
                }, {
                    model: PackingSlipMaterialReceive,
                    as: 'refInvoiceOfMemo',
                    attributes: ['id', 'invoiceNumber', 'invoiceDate', 'status'],
                    required: false
                }, {
                    model: PackingslipInvoicePaymentDet,
                    as: 'packingslip_invoice_payment_det',
                    attributes: ['id', 'refPayementid', 'refPackingslipInvoiceID', 'paymentAmount'],
                    required: false,
                    include: [{
                        model: PackingslipInvoicePayment,
                        as: 'packingslip_invoice_payment',
                        attributes: ['id', 'paymentNumber', 'isPaymentVoided', 'refPaymentMode'],
                        required: true,
                        where: {
                            isPaymentVoided: false
                        }
                    }]
                }, {
                    model: User,
                    as: 'packingSlipLockedBy',
                    attributes: ['id', 'firstName', 'lastName', 'username'],
                    required: false
                }, {
                    model: User,
                    as: 'createdEmployee',
                    attributes: ['userName', 'employeeID'],
                    required: false,
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['initialName', 'firstName', 'lastName'],
                        required: false
                    }]
                }, {
                    model: User,
                    as: 'updatedEmployee',
                    attributes: ['userName', 'employeeID'],
                    required: false,
                    include: [{
                        model: Employee,
                        as: 'employee',
                        attributes: ['initialName', 'firstName', 'lastName'],
                        required: false
                    }]
                }]
            }).then((response) => {
                if (!response) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(currentModuleName), err: null, data: null
                    });
                } else {
                    return sequelize.query('Select fun_getUserNameByID(:pUserID)', {
                        replacements: {
                            pUserID: response.invoiceApprovedBy
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then((userResponceData) => {
                        response.dataValues.invoiceApprovedByName = _.values(userResponceData[0])[0];
                        return PackingSlipMaterialReceive.findOne({
                            attributes: ['id', 'packingSlipNumber', 'poNumber'],
                            where: {
                                refPackingSlipNumberForInvoice: req.params.id
                            }
                        }).then((responseData) => {
                            if (responseData) {
                                response.dataValues.refPackingSlipId = responseData.id;
                                response.dataValues.refPackingSlipNumber = responseData.packingSlipNumber;
                                response.dataValues.poNumber = responseData.poNumber;
                                response.dataValues.refInvoiceNumber = responseData.invoiceNumber;
                                return sequelize.query('CALL Sproc_CheckAndReGetPackingSlipLineDetail(:pInvoiceId, :pPackingSlipId, :pAction, :pUserId, :pUserRoleId)', {
                                    replacements: {
                                        pInvoiceId: req.params.id,
                                        pPackingSlipId: responseData.id,
                                        pAction: 'GetNotification',
                                        pUserId: req.user.id,
                                        pUserRoleId: req.user.defaultLoginRoleID
                                    },
                                    type: sequelize.QueryTypes.SELECT
                                }).then((result) => {
                                    if (result[0] && result[0][0] && result[0][0].IsSuccess === 1) {
                                        return resHandler.successRes(res,
                                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                            STATE.SUCCESS, {
                                            PackingSlip: response,
                                            IsSuccess: true
                                        }, null);
                                    } else {
                                        return resHandler.successRes(res,
                                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                            STATE.SUCCESS, {
                                            PackingSlip: response,
                                            IsSuccess: false,
                                            InsertCount: result[0][0].NoOfLineInsert,
                                            DeleteCount: result[0][0].NoOfLineDelete,
                                            UpdateCount: result[0][0].NoOfLineUpdate
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
                                return resHandler.successRes(res,
                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                    STATE.SUCCESS, {
                                    PackingSlip: response,
                                    IsSuccess: true
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
                    }).catch((err) => {
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

    // Add/Update packing slip detail
    // POST : /api/v1/packing_slip/savePackingSlip
    savePackingSlip: (req, res) => {
        const whereClauseToCheckDuplicate = {
            packingSlipNumber: req.body.packingSlipNumber,
            mfgCodeID: req.body.mfgCodeID,
            receiptType: req.body.receiptType,
            deletedAt: null
        };

        if (req.body.id) {
            whereClauseToCheckDuplicate.id = {
                [Op.ne]: req.body.id
            };
        }

        return module.exports.savePackingSlipLogic(req, res, whereClauseToCheckDuplicate);
    },

    /* Functionality for savePackingSlip */
    savePackingSlipLogic: (req, res, whereClauseToCheckDuplicate) => {
        const {
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;
        var packingInputFieldsForUpdate = Object.assign([], packingInputFields);
        const disabledElements = [];

        PackingSlipMaterialReceive.findOne({
            where: whereClauseToCheckDuplicate,
            paranoid: false
        }).then((resp) => {
            if (resp) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: null,
                    err: null,
                    data: {
                        errorCode: 1
                    }
                });
            } else if (req.body.id) {
                COMMON.setModelUpdatedByFieldValue(req);
                // Get data of packing slip going to be update to check value is modified or not
                return PackingSlipMaterialReceive.findOne({
                    where: {
                        id: req.body.id
                    },
                    attributes: ['id', 'mfgCodeID', 'packingSlipNumber', 'refParentCreditDebitInvoiceno', 'refPackingSlipNumberForInvoice', 'packingSlipModeStatus', 'packingSlipDate', 'receiptDate', 'status', 'lockStatus', 'packingSlipModeStatus', 'refPurchaseOrderID']
                }).then((oldPackingSlipDet) => {
                    if (!oldPackingSlipDet) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                    } else if (oldPackingSlipDet.refPackingSlipNumberForInvoice != null && oldPackingSlipDet.packingSlipModeStatus === req.body.packingSlipModeStatus) {
                        if (req.body.packingSlipNumber !== oldPackingSlipDet.packingSlipNumber ||
                            COMMON.formatDate(req.body.packingSlipDate) !== COMMON.formatDate(oldPackingSlipDet.packingSlipDate) ||
                            COMMON.formatDate(req.body.receiptDate) !== COMMON.formatDate(oldPackingSlipDet.receiptDate)) {
                            const messageContent = MESSAGE_CONSTANT.RECEIVING.INVOICE_CREATED_AGAINST_PACKING_SLIP;
                            messageContent.message = COMMON.stringFormat(messageContent.message, oldPackingSlipDet.packingSlipNumber);

                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: messageContent,
                                err: null,
                                data: null
                            });
                        } else {
                            packingInputFieldsForUpdate = ['updatedBy', 'updatedAt', 'updateByRoleId', 'internalRemark'];
                        }
                    } else {

                        disabledElements.push('id', 'systemId', 'scanLabel', 'supplierSONumber', 'poNumber');
                        if (oldPackingSlipDet.status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.ApprovedToPay || oldPackingSlipDet.status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Paid || oldPackingSlipDet.packingSlipModeStatus === 'P' || oldPackingSlipDet.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.Locked) {
                            disabledElements.push('poDate', 'soDate', 'packingSlipNumber', 'packingSlipDate', 'receiptDate', 'isCustConsigned', 'customerID', 'isNonUMIDStock');
                            if (oldPackingSlipDet.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.Locked) {
                                disabledElements.push('internalRemark');
                            }
                        }
                        if (oldPackingSlipDet.refPurchaseOrderID) {
                            disabledElements.push('poDate', 'isCustConsigned', 'customerID');
                        }
                        if (oldPackingSlipDet.packingSlipNumber) {
                            disabledElements.push('packingSlipNumber');
                        }
                        if (!req.body.isCustConsigned) {
                            req.body.customerID = null;
                        }
                    }

                    packingInputFieldsForUpdate = _.difference(packingInputFieldsForUpdate, disabledElements);
                    req.body.refParentCreditDebitInvoiceno = oldPackingSlipDet.refParentCreditDebitInvoiceno;
                    req.body.refPackingSlipNumberForInvoice = oldPackingSlipDet.refPackingSlipNumberForInvoice;
                    return sequelize.transaction().then(t =>
                        PackingSlipMaterialReceive.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: packingInputFieldsForUpdate,
                            transaction: t
                        }).then((respUpdatePackingSlip) => {
                            if (respUpdatePackingSlip) {
                                // return module.exports.addUpdatePackingSlipMaterialInbulk(req, res, req.body.id, t);
                                if (req.body.mfgCodeID === oldPackingSlipDet.mfgCodeID && req.body.packingSlipNumber === oldPackingSlipDet.packingSlipNumber) {
                                    return module.exports.addUpdateTrackingNumber(req, res, req.body.id, 'PackingSlip', t).then(() => {
                                        t.commit();
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                            materialList: respUpdatePackingSlip
                                        }, MESSAGE_CONSTANT.UPDATED(packingSlipModuleName));
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                } else {
                                    // Else if supplier or packing slip # modified then create new path according and move all document to new path
                                    return GenericFilesController.manageDocumentPath(req, res, {
                                        gencFileOwnerType: req.body.gencFileOwnerType,
                                        refTransID: req.body.id
                                    }, t).then(() => module.exports.addUpdateTrackingNumber(req, res, req.body.id, 'PackingSlip', t).then(() => {
                                        t.commit();
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                            materialList: respUpdatePackingSlip
                                        }, MESSAGE_CONSTANT.UPDATED(packingSlipModuleName));
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    })).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                }
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(packingSlipModuleName),
                                    err: null,
                                    data: null
                                });
                            }
                        })
                    ).catch((err) => {
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
                // let packingSlipDet = null;
                COMMON.setModelCreatedByFieldValue(req);
                return sequelize.transaction().then(t =>
                    UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.PACKING_SLIP.Packing_Slip_System_Id, t)
                        .then((systemIdPromise) => {
                            if (systemIdPromise.status === STATE.SUCCESS) {
                                req.body.systemId = systemIdPromise.systemId;
                                return PackingSlipMaterialReceive.create(req.body, {
                                    fields: packingInputFields,
                                    transaction: t
                                }).then((response) => {
                                    if (response) {
                                        return module.exports.addUpdateTrackingNumber(req, res, response.id, 'PackingSlip', t).then(() => {
                                            t.commit();
                                            return resHandler.successRes(res,
                                                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                                STATE.SUCCESS, {
                                                packingSlipDet: response,
                                                materialList: response
                                            }, MESSAGE_CONSTANT.CREATED(packingSlipModuleName));
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: (systemIdPromise && systemIdPromise.message) || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: (systemIdPromise && systemIdPromise.err) || null,
                                    data: null
                                });
                            }
                        })
                ).catch((err) => {
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
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    /* Need to handle promise eception */
    addUpdateTrackingNumber: (req, res, packingSlipID, type, t) => {
        const {
            PackingSlipTrackNumber
        } = req.app.locals.models;

        const promises = [];

        const addTrackNumbers = _.filter(req.body.packingSlipTrackNumber, item => !item.id);

        const updateTrackNumbers = _.filter(req.body.packingSlipTrackNumber, item => item.id > 0 && !item.isDeleted);

        _.each(addTrackNumbers, (material) => {
            COMMON.setModelCreatedByFieldValue(material);
            material.refPackingSlipMaterialRecID = packingSlipID;
            promises.push(
                PackingSlipTrackNumber.create(material, {
                    fields: trackNumberInputFields,
                    transaction: t
                }).then(addTrackingResponse => Promise.resolve(addTrackingResponse))
            );
        });

        _.each(updateTrackNumbers, (material) => {
            COMMON.setModelUpdatedByFieldValue(material);
            promises.push(
                PackingSlipTrackNumber.update(material, {
                    where: {
                        id: material.id
                    },
                    fields: trackNumberInputFields,
                    transaction: t
                }).then(updateTrackingResponse => Promise.resolve(updateTrackingResponse))
            );
        });

        if (req.body.removePackingSlipTrackNumberIds && req.body.removePackingSlipTrackNumberIds.length > 0) {
            const objDeleteTrackNumber = {};
            COMMON.setModelDeletedByFieldValue(objDeleteTrackNumber);
            promises.push(
                PackingSlipTrackNumber.update(objDeleteTrackNumber, {
                    where: {
                        id: {
                            [Op.in]: req.body.removePackingSlipTrackNumberIds
                        }
                    },
                    fields: ['deletedBy', 'deletedAt', 'isDeleted', 'updatedBy', 'updatedAt', 'updateByRoleId', 'deleteByRoleId'],
                    transaction: t
                }).then(removeTrackingResponse => Promise.resolve(removeTrackingResponse))
            );
        }

        return Promise.all(promises).then((returnPromise) => {
            req.params['id'] = packingSlipID;
            req.params['receiptType'] = req.body.receiptType;

            EnterpriseSearchController.managePackingSlipInElastic(req);
            if (req.body && req.body.removeMaterialIds && req.body.removeMaterialIds.length > 0) {
                EnterpriseSearchController.deletePackingSlipMaterialInElastic(req.body.removeMaterialIds.toString());
            }
            // return response;
            if (type === 'PackingSlip' && req.body.id) {
                /* Refectore type must be add in constant */
                return module.exports.updatePackingSlipInvoiceStatus(req, res, packingSlipID, req.body.refPackingSlipNumberForInvoice, 'PackingSlip', t).then(response => response).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else if (type === 'RMA' && req.body.id) {
                return module.exports.updatePackingSlipInvoiceStatus(req, res, packingSlipID, req.body.refPackingSlipNumberForInvoice, 'RMA', t).then(response => response).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            } else {
                return returnPromise;
            }
        }).then(response => response).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    savePackingSlipInvoiceStatus: (req, res, id, status, pInvoiceHeaderIsZeroValue, t) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        var lockStatusValue = '';
        var invoiceApprovalStatusValue = '';
        if (id) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: id
                },
                transaction: t
            }).then((respToUpdate) => {
                if (respToUpdate) {
                    if (respToUpdate.lockStatus !== DATA_CONSTANT.CustomerPaymentLockStatus.Locked) {
                        switch (respToUpdate.receiptType) {
                            case 'I':
                            case 'D':
                            case 'C':
                                if (status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Pending ||
                                    status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Investigate) {
                                    lockStatusValue = DATA_CONSTANT.CustomerPaymentLockStatus.NA;
                                } else if (
                                    (status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.ApprovedToPay ||
                                        status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.PartiallyPaid ||
                                        status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Paid) &&
                                    respToUpdate.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.NA) {
                                    lockStatusValue = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                                }
                                if (respToUpdate.receiptType = 'I' && (status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Pending || status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Investigate) &&
                                    respToUpdate.invoiceApprovalStatus === DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.APPROVED) {
                                    invoiceApprovalStatusValue = DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.PENDING;
                                }
                                break;
                            case 'P':
                                if (status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Investigate ||
                                    status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.WaitingForInvoice ||
                                    status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.InvoiceReceived) {
                                    lockStatusValue = DATA_CONSTANT.CustomerPaymentLockStatus.NA;
                                } else if (
                                    (status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.ApprovedToPay ||
                                        status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.PartiallyPaid ||
                                        status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Paid) &&
                                    respToUpdate.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.NA) {
                                    lockStatusValue = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                                }
                                break;
                            case 'R':
                                if (req.body.packingSlipModeStatus === DATA_CONSTANT.SupplierRMAPackingSlipMode.Draft ||
                                    req.body.packingSlipModeStatus === DATA_CONSTANT.SupplierRMAPackingSlipMode.Published) {
                                    lockStatusValue = DATA_CONSTANT.CustomerPaymentLockStatus.NA;
                                } else if (req.body.packingSlipModeStatus === DATA_CONSTANT.SupplierRMAPackingSlipMode.Shipped &&
                                    respToUpdate.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.NA) {
                                    lockStatusValue = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    const requestData = {
                        status: status,
                        updatedBy: req.user.id,
                        updatedAt: COMMON.getCurrentUTC(),
                        updateByRoleId: req.user.defaultLoginRoleID
                    };

                    if (lockStatusValue && lockStatusValue !== '') {
                        requestData.lockStatus = lockStatusValue;
                    }
                    if (invoiceApprovalStatusValue && invoiceApprovalStatusValue !== '') {
                        requestData.invoiceApprovalStatus = invoiceApprovalStatusValue;
                        requestData.invoiceApprovalComment = null;
                        requestData.invoiceApprovalDate = null;
                        requestData.invoiceApprovedBy = null;
                    }

                    if (pInvoiceHeaderIsZeroValue && pInvoiceHeaderIsZeroValue !== '') {
                        requestData.isZeroValue = (pInvoiceHeaderIsZeroValue === 'Y');
                    }

                    return PackingSlipMaterialReceive.update(requestData, {
                        where: {
                            id: id
                        },
                        transaction: t
                    }).then(updateStatus =>
                        updateStatus
                    ).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: null,
                        data: null
                    });
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    updatePackingSlipStatus: (req, res, packingSlipID, invoiceID, invoiceStatus, t) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;

        const whereClause = {};
        if (packingSlipID) {
            whereClause.id = packingSlipID;
        } else {
            whereClause.refPackingSlipNumberForInvoice = invoiceID;
        }

        return PackingSlipMaterialReceive.findOne({
            where: whereClause,
            attributes: ['id', 'receiptType', 'status', 'packingSlipModeStatus'],
            include: [{
                model: PackingSlipMaterialReceive,
                as: 'refInvoice',
                attributes: ['id', 'receiptType', 'status', 'packingSlipModeStatus']
            }]
        }).then((packingSlipResponse) => {
            if (!packingSlipResponse) {
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
            }
            let packingSlipStatus = 'I';

            const packingSlipModeStatus = req.body.packingSlipModeStatus || packingSlipResponse.packingSlipModeStatus;
            if (packingSlipModeStatus === 'D') {
                packingSlipStatus = 'I';
            } else if (invoiceID) {
                let invoiceLineStatus = 'I';
                if (invoiceStatus) {
                    invoiceLineStatus = invoiceStatus;
                } else if (packingSlipResponse && packingSlipResponse.refInvoice) {
                    invoiceLineStatus = packingSlipResponse.refInvoice.status;
                }

                if (invoiceLineStatus === 'PE' || invoiceLineStatus === 'I' || invoiceLineStatus === 'PM') {
                    packingSlipStatus = 'IR';
                } else if (invoiceLineStatus === 'A') {
                    packingSlipStatus = 'A';
                } else if (invoiceLineStatus === 'P') {
                    packingSlipStatus = 'P';
                } else if (invoiceLineStatus === 'PP') {
                    packingSlipStatus = 'PP';
                }
            } else {
                packingSlipStatus = 'W';
            }

            return module.exports.savePackingSlipInvoiceStatus(req, res, packingSlipResponse.id, packingSlipStatus, null, t).then(responseData => responseData).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    updateRMAStatus: (req, res, packingSlipID, invoiceID, invoiceStatus, t) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;

        const whereClause = {};
        if (packingSlipID) {
            whereClause.id = packingSlipID;
        } else {
            whereClause.refPackingSlipNumberForInvoice = invoiceID;
        }

        return PackingSlipMaterialReceive.findOne({
            where: whereClause,
            attributes: ['id', 'receiptType', 'status', 'packingSlipModeStatus'],
            include: [{
                model: PackingSlipMaterialReceive,
                as: 'refInvoice',
                attributes: ['id', 'receiptType', 'status', 'packingSlipModeStatus']
            }]
        }).then((packingSlipResponse) => {
            if (!packingSlipResponse) {
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
            }
            if (packingSlipResponse.status === 'CR') {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipResponse, MESSAGE_CONSTANT.UPDATED(packingSlipModuleName));
            }

            let packingSlipStatus = 'D';

            const packingSlipModeStatus = req.body.packingSlipModeStatus || packingSlipResponse.packingSlipModeStatus;
            if (packingSlipModeStatus === 'D') {
                packingSlipStatus = 'D';
            } else if (packingSlipModeStatus === 'P') {
                packingSlipStatus = 'WS';
            } else if (packingSlipModeStatus === 'S') {
                if (invoiceID) {
                    let invoiceLineStatus = 'D';
                    if (invoiceStatus) {
                        invoiceLineStatus = invoiceStatus;
                    } else if (packingSlipResponse && packingSlipResponse.refInvoice) {
                        invoiceLineStatus = packingSlipResponse.refInvoice.status;
                    }

                    if (invoiceLineStatus === 'I' || invoiceLineStatus === 'PE') {
                        packingSlipStatus = 'CR';
                    } else if (invoiceLineStatus === 'A') {
                        packingSlipStatus = 'A';
                    } else if (invoiceLineStatus === 'P') {
                        packingSlipStatus = 'P';
                    }
                } else {
                    packingSlipStatus = 'WC';
                }
            }
            return module.exports.savePackingSlipInvoiceStatus(req, res, packingSlipResponse.id, packingSlipStatus, null, t).then(responseData => responseData).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }).catch((err) => {
            console.trace();
            console.error(err);
            if (!t.finished) {
                t.rollback();
            }
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Update packing slip status based on detail record
    updatePackingSlipInvoiceStatus: (req, res, packingSlipID, invoiceID, receiptType, t, isOnlyValidate) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet,
            sequelize
        } = req.app.locals.models;

        const promises = [];
        if (receiptType === 'PackingSlip') { /* Refectore add in constant */
            return module.exports.updatePackingSlipStatus(req, res, packingSlipID, invoiceID, null, t).then(responseData => responseData).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else if (receiptType === 'RMA') {
            return module.exports.updateRMAStatus(req, res, packingSlipID, invoiceID, null, t).then(responseData => responseData).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        } else {
            return PackingSlipMaterialReceiveDet.findAll({
                where: {
                    refPackingSlipMaterialRecID: invoiceID
                },
                attributes: ['id', 'refPackingSlipMaterialRecID', 'status', 'extendedPrice', 'extendedReceivedPrice', 'discount', 'isZeroValue'],
                include: [{
                    model: PackingSlipMaterialReceive,
                    as: 'packing_slip_material_receive',
                    attributes: ['id', 'receiptType', 'status', 'isTariffInvoice', 'creditMemoType', 'invoiceTotalDue', 'invoiceApprovalStatus', 'invoiceNumber', 'markedForRefund']
                }],
                transaction: t
            }).then(invoiceDetailresponse =>
                sequelize.query('CALL Sproc_getCreditDebitMemoDetails(:pInvoiceID)', {
                    replacements: {
                        pInvoiceID: invoiceID
                    },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }).then((result) => {
                    let totalOfCreditMemoAmount = 0;
                    let totalOfDebitMemoAmount = 0;
                    let invoiceStatus = 'PE';
                    let invoiceHeaderIsZeroValue;
                    if (result && result[0] && result[0][0]) {
                        totalOfCreditMemoAmount = result[0][0].creditMemoAmount;
                        totalOfDebitMemoAmount = result[0][0].debitMemoAmount;
                    }
                    if (invoiceDetailresponse && invoiceDetailresponse.length > 0) {
                        let totalVariance = 0;
                        if (invoiceDetailresponse[0].packing_slip_material_receive && invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'C' && invoiceDetailresponse[0].packing_slip_material_receive.creditMemoType === 'RC') {
                            totalVariance = 0;
                        } else {
                            const invoiceTotalDue = invoiceDetailresponse[0].packing_slip_material_receive && invoiceDetailresponse[0].packing_slip_material_receive.invoiceTotalDue ? invoiceDetailresponse[0].packing_slip_material_receive.invoiceTotalDue : 0;
                            const totalExtendedPrice = COMMON.CalcSumofArrayElement(_.map(invoiceDetailresponse, 'extendedReceivedPrice'), 2);
                            const totalDiscount = COMMON.CalcSumofArrayElement(_.map(invoiceDetailresponse, 'discount'), 2);
                            totalVariance = parseFloat(invoiceTotalDue || 0) - COMMON.roundUpNum((Math.abs(parseFloat(totalExtendedPrice || 0)) + (totalDiscount || 0) + ((parseFloat(totalOfCreditMemoAmount || 0) + parseFloat(totalOfDebitMemoAmount || 0)) * -1)), 2);
                        }

                        if (isOnlyValidate) {
                            if ((_.filter(invoiceDetailresponse, data => data.status === 'A').length === invoiceDetailresponse.length) && totalVariance === 0) {
                                invoiceStatus = 'A';
                            }
                        } else if (_.filter(invoiceDetailresponse, data => data.status === 'P').length === invoiceDetailresponse.length) {
                            if (invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'C' &&
                                invoiceDetailresponse[0].packing_slip_material_receive.creditMemoType === 'RC') {
                                invoiceStatus = 'I';
                            } else {
                                invoiceStatus = 'PE';
                            }
                        } else if (invoiceDetailresponse[0].packing_slip_material_receive.status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.PartiallyPaid) {
                            invoiceStatus = DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.PartiallyPaid;
                        } else if ((_.filter(invoiceDetailresponse, data => data.status === 'A').length === invoiceDetailresponse.length) && totalVariance === 0 && invoiceDetailresponse[0].packing_slip_material_receive.invoiceApprovalStatus !== DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.PENDING) {
                            invoiceStatus = 'A';
                        } else if ((_.filter(invoiceDetailresponse, data => data.status === 'A').length === invoiceDetailresponse.length) && totalVariance === 0 && invoiceDetailresponse[0].packing_slip_material_receive.invoiceApprovalStatus === DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.PENDING) {
                            invoiceStatus = 'PM';
                        } else if ((_.some(invoiceDetailresponse, data => data.status === 'A' || data.status === 'D')) || totalVariance !== 0) {
                            invoiceStatus = 'I';
                        } else {
                            invoiceStatus = 'I';
                        }
                        /* Mark for Refund validation*/
                        if (invoiceDetailresponse[0].packing_slip_material_receive &&
                            (invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'C' ||
                                invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'D')) {
                            if (invoiceStatus !== 'A' &&
                                (req.body.markedForRefund === true ||
                                    invoiceDetailresponse[0].packing_slip_material_receive.markedForRefund === true)) {
                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MARK_FOR_REFUND_VALIDATION_FOR_NOT_APPROVED_TO_PAY_STATUS);
                                messageContent.message = COMMON.stringFormat(messageContent.message, (invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'D' ? 'Debit Memo' : 'Credit Memo'));
                                return {
                                    status: STATE.FAILED,
                                    message: messageContent
                                };
                            }
                        }

                        /*Set Zero Invoice Header checkbox value based on line details*/
                        const nonConfirmedZeroLines = _.filter(invoiceDetailresponse, (d) => !d.isZeroValue);
                        invoiceHeaderIsZeroValue = (nonConfirmedZeroLines && nonConfirmedZeroLines.length) ? 'N' : 'Y';
                    }

                    if (isOnlyValidate) {
                        return {
                            status: STATE.SUCCESS,
                            invoiceStatus: invoiceStatus,
                            invoiceNumber: (invoiceDetailresponse && invoiceDetailresponse.length && invoiceDetailresponse[0].packing_slip_material_receive) ? invoiceDetailresponse[0].packing_slip_material_receive.invoiceNumber : null
                        };
                    } else {
                        promises.push(
                            module.exports.savePackingSlipInvoiceStatus(req, res, invoiceID, invoiceStatus, invoiceHeaderIsZeroValue, t).then(updateStatus => Promise.resolve(updateStatus))
                        );

                        if (invoiceDetailresponse && invoiceDetailresponse.length > 0) {
                            if (invoiceDetailresponse[0].packing_slip_material_receive && invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'I' && !invoiceDetailresponse[0].packing_slip_material_receive.isTariffInvoice) {
                                promises.push(
                                    module.exports.updatePackingSlipStatus(req, res, null, invoiceID, invoiceStatus, t).then(updateStatus => Promise.resolve(updateStatus))
                                );
                            } else if (invoiceDetailresponse[0].packing_slip_material_receive &&
                                invoiceDetailresponse[0].packing_slip_material_receive.receiptType === 'C' &&
                                invoiceDetailresponse[0].packing_slip_material_receive.creditMemoType === 'RC' &&
                                !invoiceDetailresponse[0].packing_slip_material_receive.isTariffInvoice) {
                                promises.push(
                                    module.exports.updateRMAStatus(req, res, null, invoiceID, invoiceStatus, t).then(updateStatus => Promise.resolve(updateStatus))
                                );
                            }
                        }

                        return Promise.all(promises).then(() => ({
                            status: STATE.SUCCESS,
                            isZeroValueHeader: (invoiceHeaderIsZeroValue === 'Y')
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err
                            };
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err
                    };
                })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        }
    },

    // Delete packing slip (soft delete)
    // POST : /api/v1/packing_slip/deletePackingSlip
    deletePackingSlip: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.objIDs.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = COMMON.AllEntityIDS.Packing_Slip.Name;
            const entityID = COMMON.AllEntityIDS.Packing_Slip.ID;
            const refrenceIDs = null;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response.length === 0) {
                    let messageLabel = null;
                    if (req.body.objIDs.isSupplier) {
                        messageLabel = supplierInvoiceMaterialModuleName;
                    } else if (req.body.objIDs.isCreditMemo) {
                        messageLabel = creditMemo;
                    } else if (req.body.objIDs.isDebitMemo) {
                        messageLabel = debitMemo;
                    } else if (req.body.objIDs.isSupplierRMA) {
                        messageLabel = supplierRMAModuleName;
                    } else {
                        messageLabel = packingSlipMaterialModuleName;
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(messageLabel));
                } else {
                    if (req.body.objIDs.isSupplier) {
                        response[0].msg = 'Supplier Invoice';
                    } else if (req.body.objIDs.isCreditMemo) {
                        response[0].msg = 'Credit Memo';
                    } else if (req.body.objIDs.isDebitMemo) {
                        response[0].msg = 'Debit Memo';
                    } else if (req.body.objIDs.isSupplierRMA) {
                        response[0].msg = 'Supplier RMA';
                    }
                    return resHandler.successRes(res,
                        DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                        STATE.SUCCESS, {
                        transactionDetails: response,
                        IDs: req.body.objIDs.id
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Delete Supplier Invoice, Credit and Debit Memo
    // POST : /api/v1/packing_slip/deleteSupplierInvoiceAndMemo
    deleteSupplierInvoiceAndMemo: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.objIDs.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = null; // COMMON.AllEntityIDS.Packing_Slip.Name;
            const entityID = COMMON.AllEntityIDS.Packing_Slip.ID;
            const refrenceIDs = null;
            return sequelize.query('CALL Sproc_checkDelete_supplier_invoice_and_memo (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                if (response && response[0].TotalCount === 0) {
                    let messageLabel = null;
                    if (req.body.objIDs.isSupplier) {
                        messageLabel = supplierInvoiceMaterialModuleName;
                    } else if (req.body.objIDs.isCreditMemo) {
                        messageLabel = creditMemo;
                    } else if (req.body.objIDs.isDebitMemo) {
                        messageLabel = debitMemo;
                    }
                    EnterpriseSearchController.deleteSupplierPackingSlipDetailFromMasterIdInElastic(req, req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(messageLabel));
                } else {
                    const isTransactionLocked = _.find(response, a => (a.Message === 'TRANSACTION_LOCKED' && a.TotalCount > 0));
                    const isTransactionHalted = _.find(response, a => (a.Message === 'TRANSACTION_HALTED' && a.TotalCount > 0));
                    const isMemoCreated = _.find(response, a => (a.Message === 'CM_DM_CREATED' && a.TotalCount > 0));
                    let messageContent = null;
                    if (isTransactionLocked) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'Locked');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    } else if (isTransactionHalted) {
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
                        messageContent.message = COMMON.stringFormat(messageContent.message, 'Halted');
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    } else if (isMemoCreated) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_IF_MEMO_CREATED,
                            err: null,
                            data: null
                        });
                    } else {
                        if (req.body.objIDs.isSupplier) {
                            response[0].msg = 'Supplier Invoice';
                        } else if (req.body.objIDs.isCreditMemo) {
                            response[0].msg = 'Credit Memo';
                        } else if (req.body.objIDs.isDebitMemo) {
                            response[0].msg = 'Debit Memo';
                        }
                        return resHandler.successRes(res,
                            DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                            STATE.SUCCESS, {
                            transactionDetails: response,
                            IDs: req.body.objIDs.id
                        }, null);
                    }
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrive list of packing slip
    // POST : /api/v1/packing_slip/getPackingSlipMaterialList
    // @return list of packing slip
    getPackingSlipMaterialList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrivePackingSlipMaterialDetList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPackingSlipID,:pInvoiceLineId)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPackingSlipID: req.body.packingSlipID || null,
                    pInvoiceLineId: req.body.invoiceLineId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                packingSlipMaterialList: _.values(response[1]),
                Count: response[0][0].TotalRecord,
                statusOfMainSlip: response[2] && response[2][0] ? response[2][0].statusOfMainSlip : null,
                invoiceApprovalStatusOfMainSlip: response[2] && response[2][0] ? response[2][0].invoiceApprovalStatusOfMainSlip : null,
                invoiceTotalDue: response[2] && response[2][0] ? response[2][0].invoiceTotalDue : null,
                paymentAmountTotal: response[2] && response[2][0] ? response[2][0].paymentAmountTotal : null
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

    // Add/Update packing slip material detail
    // POST : /api/v1/packing_slip/savePackingSlipMaterial
    savePackingSlipMaterial: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            GenericAuthenticationMst,
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceivePartInspectionDet,
            PurchaseOrderLineReleaseDet,
            sequelize
        } = req.app.locals.models;

        // Get detail of pending UMID part if it is existing in same bin of other packing slip in which new material is going to add then not allow to add material detail
        sequelize.query('CALL Sproc_CheckPackingSlipMaterialValidation(:pPackingSlipID, :pPackingSlipMaterialID, :pBinID, :pPartID, :pUpdatedReceivedQty, :pPackagingId, :pSpq, :pIsNonUMIDStock)', {
            replacements: {
                pPackingSlipID: req.body.refPackingSlipMaterialRecID || null,
                pPackingSlipMaterialID: req.body.id || null,
                pBinID: req.body.binID || null,
                pPartID: req.body.partID || null,
                pUpdatedReceivedQty: req.body.receivedQty || 0,
                pPackagingId: req.body.packagingID || 0,
                pSpq: req.body.spq || 0,
                pIsNonUMIDStock: req.body.isNonUMIDStock || false
            },
            type: sequelize.QueryTypes.SELECT
        }).then((validationResponse) => {
            var responseList = _.map(validationResponse, item => _.find(item, obj => obj.errorCode >= 0));
            var errorDet = _.filter(responseList, item => item && item.errorCode > 0);
            if (errorDet && errorDet.length > 0) {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: null,
                    err: null,
                    data: errorDet
                });
            } else {
                return sequelize.transaction().then((t) => {
                    // Update packing slip material detail
                    if (req.body.id) {
                        var materialInputFieldsForUpdate = Object.assign([], materialInputFields);
                        const disabledElements = [];
                        if (req.body.TotalUMIDCount > 0 || req.body.isRMACreated) {
                            disabledElements.push('binID', 'remark', 'receivedStatus', 'lineCustomerID', 'isLineCustConsigned', 'packagingID', 'rohsstatus', 'nickname', 'internalRef', 'poReleaseNumber', 'refPOLineID', 'packingSlipSerialNumber', 'isReceivedWrongPart', 'partID', 'scanLabel', 'isNonUMIDStock');
                        }
                        if (req.body.partType === 4 || req.body.refPOReleaseLineID) {
                            disabledElements.push('internalRef');
                            if (req.body.refPOReleaseLineID) {
                                disabledElements.push('poReleaseNumber');
                            }
                        }
                        if (req.body.partType === 4 || req.body.isNonUMIDStock || req.body.packingSlipNonUMIDStock) {
                            req.body.binID = null;
                        }
                        if (req.body.partType === 4 || req.body.refPurchaseOrderID || req.body.packingSlipCustConsigned) {
                            disabledElements.push('lineCustomerID');
                            if (req.body.partType === 4) {
                                disabledElements.push('isNonUMIDStock', 'isLineCustConsigned');
                            }
                            if (req.body.refPurchaseOrderID) {
                                disabledElements.push('rohsstatus');
                            }
                        }
                        if ((!req.body.isReceivedWrongPart) && (req.body.refPOReleaseLineID || req.body.isDisabledOrderQty)) {
                            disabledElements.push('orderedQty');
                        }
                        if (!req.body.isReceiveBulkItem) {
                            disabledElements.push('totalLines');
                        }
                        if (!req.body.totalLines) {
                            disabledElements.push('pendingLines', 'acceptedWithDeviationLines', 'rejectedLines', 'acceptedLines');
                        }

                        materialInputFieldsForUpdate = _.difference(materialInputFieldsForUpdate, disabledElements);
                        COMMON.setModelUpdatedByFieldValue(req);
                        const updatePackingSlipDet = _.find(responseList, item => item && item.errorCode === 0);
                        if (updatePackingSlipDet) {
                            req.body.umidCreated = updatePackingSlipDet.updateUMIDCreated;
                        }
                        if (req.body.isLineCustConsigned === false) {
                            req.body.lineCustomerID = null;
                        }
                        return PackingSlipMaterialReceiveDet.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: materialInputFieldsForUpdate,
                            transaction: t
                        }).then((response) => {
                            if (response && response.length > 0) {
                                // Update packing slip status based on material line status
                                return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, req.body.refPackingSlipNumberForInvoice, 'PackingSlip', t).then(() => {
                                    t.commit().then(() => {
                                        req.params.id = req.body.refPackingSlipMaterialRecID;
                                        if (req.body.refPackingSlipNumberForInvoice) {
                                            RFQSocketController.reGetOnChnagesOfPackingSlipLine(req, {
                                                data: {
                                                    InsertCount: 0,
                                                    UpdateCount: 1,
                                                    DeleteCount: 0,
                                                    InvoiceId: req.body.refPackingSlipNumberForInvoice,
                                                    NotifyFrom: 'UPDATE'
                                                }
                                            });
                                        }
                                        req.params['receiptType'] = DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.PACKING_SLIP;
                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.managePackingSlipInElastic);
                                        if (req.body.isApproveFlow) {
                                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_APPROVED);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, messageContent);
                                        } else {
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(packingSlipMaterialModuleName));
                                        }
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.NOT_UPDATED(packingSlipMaterialModuleName),
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    } else {
                        // Update packing slip material detail
                        let packingSlipData;
                        COMMON.setModelCreatedByFieldValue(req);
                        const POLineIdPromise = [];
                        if (!req.body.refPurchaseOrderID && req.body.poNumber && !req.body.refPOLineID) {
                            POLineIdPromise.push(
                                PackingSlipMaterialReceiveDet.findOne({
                                    attributes: [[sequelize.fn('max', sequelize.col('PackingSlipMaterialReceiveDet.refPOLineID')), 'refPOLineID']],
                                    include: [{
                                        model: PackingSlipMaterialReceive,
                                        as: 'packing_slip_material_receive',
                                        where: {
                                            poNumber: req.body.poNumber
                                        },
                                        attributes: []
                                    }],
                                    raw: true,
                                    transaction: t
                                }).then((response) => {
                                    req.body.refPOLineID = response && response.refPOLineID ? response.refPOLineID + 1 : 1;
                                    return { status: STATE.SUCCESS };
                                }).catch(err => ({
                                    status: STATE.FAILED,
                                    err: err
                                }))
                            );
                        }

                        if (req.body.refPurchaseOrderID && req.body.refPOReleaseLineID) {
                            POLineIdPromise.push(
                                PurchaseOrderLineReleaseDet.findOne({
                                    attributes: ['id'],
                                    where: {
                                        id: req.body.refPOReleaseLineID
                                    },
                                    transaction: t
                                }).then((response) => {
                                    if (response && response.id) {
                                        return { status: STATE.SUCCESS };
                                    } else {
                                        return { status: STATE.FAILED, err: [{ errorCode: 7 }] };
                                    }
                                }).catch(err => ({
                                    status: STATE.FAILED,
                                    err: err
                                }))
                            );
                        }

                        return Promise.all(POLineIdPromise).then((poLineIdresponse) => {
                            var resObj = _.find(poLineIdresponse, resp => resp.status === STATE.FAILED);
                            if (resObj) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: resObj.err || null,
                                    data: null
                                });
                            } else {
                                // in case of bin is null then create time detault umidCreated falg is true
                                if (!req.body.binID) {
                                    req.body.umidCreated = true;
                                }
                                return PackingSlipMaterialReceiveDet.create(req.body, {
                                    fields: materialInputFields,
                                    transaction: t
                                }).then((response) => {
                                    packingSlipData = response;
                                    // Update packing slip status based on material line status
                                    const promises = [];
                                    if (req.body.objApproval) {
                                        req.body.objApproval.refID = response.id;
                                        promises.push(
                                            GenericAuthenticationMst.create(req.body.objApproval, {
                                                fields: approvalInputFields,
                                                transaction: t
                                            }).then(addApprovalResponse => Promise.resolve(addApprovalResponse)).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            })
                                        );
                                    }
                                    promises.push(
                                        module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, req.body.refPackingSlipNumberForInvoice, 'PackingSlip', t)
                                    );

                                    if (req.body.purchaseInspectionList && req.body.purchaseInspectionList.length > 0) {
                                        const purchaseInspectionList = _.map(req.body.purchaseInspectionList, data => ({
                                            lineId: response.id,
                                            partId: data.partId,
                                            instruction: data.inspectionmst && data.inspectionmst.requirement ? data.inspectionmst.requirement : null,
                                            inspectionStatus: DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.InspectionStatus.Pending,
                                            category: data.category,
                                            requiementType: data.inspectionmst.requiementType
                                        }));
                                        COMMON.setModelCreatedArrayFieldValue(req.user, purchaseInspectionList);
                                        promises.push(
                                            PackingSlipMaterialReceivePartInspectionDet.bulkCreate(purchaseInspectionList, {
                                                fields: packingSlipPurchaseDetailInputFields,
                                                transaction: t
                                            }).then(insertRecordResponse => Promise.resolve(insertRecordResponse)).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            })
                                        );
                                    }

                                    return Promise.all(promises);
                                }).then(() => {
                                    t.commit().then(() => {
                                        req.params.id = req.body.refPackingSlipMaterialRecID;
                                        if (req.body.refPackingSlipNumberForInvoice) {
                                            RFQSocketController.reGetOnChnagesOfPackingSlipLine(req, {
                                                data: {
                                                    InsertCount: 1,
                                                    UpdateCount: 0,
                                                    DeleteCount: 0,
                                                    InvoiceId: req.body.refPackingSlipNumberForInvoice,
                                                    NotifyFrom: 'INSERT'
                                                }
                                            });
                                        }
                                        req.params['receiptType'] = DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.PACKING_SLIP;
                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.managePackingSlipInElastic);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, packingSlipData, MESSAGE_CONSTANT.CREATED(packingSlipMaterialModuleName));
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
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
    },

    // Add/Update invoice material detail
    // POST : /api/v1/packing_slip/saveInvoiceMaterial
    saveInvoiceMaterial: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: parseInt(req.body.refPackingSlipMaterialRecID),
                    status: 'P'
                },
                attributes: ['id', 'status']
            }).then((responsePackingSlip) => {
                if (responsePackingSlip) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        ErrorCode: 1
                    }, null);
                }
                if (req.body.id) {
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelUpdatedByFieldValue(req);
                        PackingSlipMaterialReceiveDet.update(req.body, {
                            where: {
                                id: req.body.id
                            },
                            fields: materialInputFields,
                            transaction: t
                        }).then((response) => {
                            if (response && response[0] && response[0] > 0) {
                                return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, req.body.refPackingSlipMaterialRecID, 'Invoice', t).then((respStatus) => {
                                    if (respStatus && respStatus.status === STATE.SUCCESS) {
                                        t.commit().then(() => {
                                            req.params['id'] = req.body.refPackingSlipMaterialRecID;
                                            req.params['receiptType'] = req.body.memoType;
                                            EnterpriseSearchController.managePackingSlipInElastic(req);
                                        });
                                        if (req.body.isApproveFlow) {
                                            const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_APPROVED);
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, messageContent);
                                        } else {
                                            let moduleName = null;
                                            if (req.body.memoType === 'C') {
                                                moduleName = creditMemoModuleName;
                                            } else if (req.body.memoType === 'D') {
                                                moduleName = debitMemoModuleName;
                                            } else {
                                                moduleName = supplierInvoiceMaterialModuleName;
                                            }
                                            req.body['isZeroValueHeader'] = respStatus.isZeroValueHeader;
                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(moduleName));
                                        }
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                            err: (respStatus && respStatus.err) || null,
                                            data: null
                                        });
                                    }
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.RECEIVING.LINE_ITEM_NOT_FOUND,
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
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
                    return sequelize.transaction().then((t) => {
                        COMMON.setModelCreatedByFieldValue(req);
                        req.body.umidCreated = true;
                        PackingSlipMaterialReceiveDet.create(req.body, {
                            fields: materialInputFields,
                            transaction: t
                        }).then(response => module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, req.body.refPackingSlipMaterialRecID, 'Invoice', t).then((respStatus) => {
                            if (respStatus && respStatus.status === STATE.SUCCESS) {
                                t.commit().then(() => {
                                    req.params['id'] = req.body.refPackingSlipMaterialRecID;
                                    req.params['receiptType'] = req.body.memoType;
                                    EnterpriseSearchController.managePackingSlipInElastic(req);
                                });
                                let moduleName = null;
                                if (req.body.memoType === 'C') {
                                    moduleName = creditMemoModuleName;
                                } else if (req.body.memoType === 'D') {
                                    moduleName = debitMemoModuleName;
                                } else {
                                    moduleName = supplierInvoiceMaterialModuleName;
                                }
                                var respText = Object.assign({}, response.dataValues);
                                respText.isZeroValueHeader = respStatus.isZeroValueHeader;

                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, respText, MESSAGE_CONSTANT.CREATED(moduleName));
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                    err: (respStatus && respStatus.err) || null,
                                    data: null
                                });
                            }
                        })).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Delete packing slip material(soft delete)
    // POST : /api/v1/packing_slip/deletePackingSlipMaterial
    deletePackingSlipMaterial: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Packing_Slip_Detail.Name;
            const entityID = COMMON.AllEntityIDS.Packing_Slip_Detail.ID;
            const refrenceIDs = null;
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                const packingSlipMaterialDetail = response[0];
                if (packingSlipMaterialDetail && packingSlipMaterialDetail.TotalCount === 0) {
                    // Update packing slip material detail
                    return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, req.body.refPackingSlipNumberForInvoice, 'PackingSlip', t).then(() => {
                        t.commit().then(() => {
                            if (req.body.refPackingSlipNumberForInvoice) {
                                RFQSocketController.reGetOnChnagesOfPackingSlipLine(req, {
                                    data: {
                                        InsertCount: 0,
                                        UpdateCount: 0,
                                        DeleteCount: 1,
                                        InvoiceId: req.body.refPackingSlipNumberForInvoice,
                                        NotifyFrom: 'DELETE'
                                    }
                                });
                            }
                            EnterpriseSearchController.deletePackingSlipMaterialInElastic(req.body.objIDs.id.toString());
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(packingSlipMaterialModuleName));
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
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, packingSlipMaterialDetail, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
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

    // Delete supplier invoice material(soft delete)
    // POST : /api/v1/packing_slip/deleteSupplierInvoiceMaterial
    deleteSupplierInvoiceMaterial: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Packing_Slip_Detail.Name;
            const entityID = COMMON.AllEntityIDS.Packing_Slip_Detail.ID;
            const refrenceIDs = null;
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                },
                transaction: t
            }).then((response) => {
                const supplierInvoiceMaterialDetail = response[0];
                if (supplierInvoiceMaterialDetail && supplierInvoiceMaterialDetail.TotalCount === 0) {
                    // Update packing slip material detail
                    return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refInvoice, req.body.refInvoice, 'Invoice', t).then((respStatus) => {
                        if (respStatus && respStatus.status === STATE.SUCCESS) {
                            return t.commit().then(() => {
                                let moduleName = null;
                                if (req.body.memoType === 'C') {
                                    moduleName = creditMemoModuleName;
                                } else if (req.body.memoType === 'D') {
                                    moduleName = debitMemoModuleName;
                                } else {
                                    moduleName = supplierInvoiceMaterialModuleName;
                                }
                                EnterpriseSearchController.deletePackingSlipMaterialInElastic(req.body.objIDs.id.toString());
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(moduleName));
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
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                err: (respStatus && respStatus.err) || null,
                                data: null
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, supplierInvoiceMaterialDetail, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
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

    /**
     * Scan Packing Barcode
     * Post : /api/v1/packing_slip/scanPackingBarcode
     * @return message for label found or not and get list of part
     */
    scanPackingBarcode: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.regxpString) {
            return sequelize.query('CALL Sproc_MatchBarCode (:pWhereClause,:puserID,:pnickName,:pprefix,:puid,:pComponentID,:pCustomerID,:pCPN,:pMFGAvailabel,:pRefCpnMfgID,:pAssyID,:pSalesOrderDetailID,:pReceiveMaterialType,:pkitAssemblyID,:pBarcodeID,:pBOMLineID,:pSupplierID,:pCategory,:pInventoryType,:pCallFrom,:pExcludeStatus)', {
                replacements: {
                    pWhereClause: req.body.regxpString,
                    puserID: req.user.id,
                    pnickName: null,
                    pprefix: null,
                    puid: null,
                    pComponentID: req.body.mfgId ? req.body.mfgId : 0,
                    pCustomerID: null,
                    pCPN: null,
                    pMFGAvailabel: null,
                    pRefCpnMfgID: null,
                    pAssyID: null,
                    pSalesOrderDetailID: null,
                    pReceiveMaterialType: null,
                    pkitAssemblyID: null,
                    pBarcodeID: req.body.barcodeId ? req.body.barcodeId : null,
                    pBOMLineID: null,
                    pSupplierID: req.body.supplierID ? req.body.supplierID : null,
                    pCategory: req.body.category ? req.body.category : DATA_CONSTANT.BARCODDE_CATEGORY.MFRPN,
                    pInventoryType: null,
                    pCallFrom: req.body.callFrom || null,
                    pExcludeStatus: req.body.exculdePartStatus || null
                },
                type: sequelize.QueryTypes.SELECT
            })
                .then((response) => {
                    if (response[0] && (response[0][0].errorText && response[0][0].errorText !== 'Validation Clear') &&
                        (['0', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '16', '20', '21'].indexOf(response[0][0].IsSuccess) !== -1)) {
                        let result;
                        if (req.body.category === DATA_CONSTANT.BARCODDE_CATEGORY.PACKINGSLIP) {
                            result = {
                                Datamessage: MESSAGE_CONSTANT.STATICMSG(response[0][0].errorText),
                                messagecode: response[0][0].IsSuccess,
                                scanLabelPS: response[0][0].MFGPart
                            };
                        } else {
                            result = {
                                Datamessage: MESSAGE_CONSTANT.STATICMSG(response[0][0].errorText),
                                messagecode: response[0][0].IsSuccess,
                                MFGPart: response[0][0].MFGPart
                            };
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result);
                    } else if (response[0] && (response[0][0].errorText && response[0][0].errorText === 'Validation Clear') && response[0][0].IsSuccess === '1') {
                        let responseList;
                        if (req.body.category === DATA_CONSTANT.BARCODDE_CATEGORY.PACKINGSLIP) {
                            responseList = {
                                PackingSlip: response[1][0]
                            };
                        } else {
                            responseList = {
                                Component: response[1][0],
                                PackingSlipDetail: response[2][0]
                            };
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseList, null);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.NOT_FOUND(packingSlipModuleName),
                            err: null,
                            data: null
                        });
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    /**
     *  Post : /api/v1/packing_slip/getPackingSlipPartQtyByPO
     *  @return total received and pending quantity detail of part
     */
    getPackingSlipPartQtyByPO: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.refPOLineID) {
            return sequelize.query('CALL Sproc_GetPackingSlipPartQtyByPO(:pPONumber, :pRefPOLineID)', {
                replacements: {
                    pPONumber: req.body.poNumber || null,
                    pRefPOLineID: req.body.refPOLineID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                qtyDetail: _.first(_.values(response[0]))
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

    // Retrive all packing slip
    // GET : /api/v1/packing_slip/getAllPackingSlipList
    // @return list of packing slip
    getAllPackingSlipList: (req, res) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        PackingSlipMaterialReceive.findAll({
            attributes: ['id', 'poNumber', 'invoiceNumber', 'packingSlipNumber']
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // to be called in promise from API only
    // call seperatly for Price issue and Qty issue
    checkDuplicateCreditDebitMemoValidationPromise: (req, isMemoForPrice, isMemoForQty, t) => {
        const {
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;
        if (req.body.refParentCreditDebitInvoiceno && (isMemoForPrice || isMemoForQty)) {
            const whereCriteria = {
                ID: req.body.currentDetail.id
            };
            if (isMemoForPrice) {
                whereCriteria.isMemoForPrice = true;
            }
            if (isMemoForQty) {
                whereCriteria.isMemoForQty = true;
            }
            return PackingSlipMaterialReceiveDet.findOne({
                where: whereCriteria,
                transaction: t
            }).then((isexist) => {
                if (isexist) {
                    const messageObj = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.NOT_ALLOWED_TO_CREATE_MEMO_FOR_INVOICE_LINE);
                    messageObj.message = COMMON.stringFormat(messageObj.message, (isMemoForPrice ? 'Price Issue' : 'Qty Issue'));
                    return {
                        status: STATE.FAILED,
                        message: messageObj
                    };
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.NOT_CREATED(invoice)
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },
    // find invoice hold resume id for CM/DM
    // to be call from API promise only
    getInvoiceHoldUnholdID: (req, t) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        if (req.body.refParentCreditDebitInvoiceno) {
            const whereCriteria = {
                ID: req.body.refParentCreditDebitInvoiceno
            };
            return PackingSlipMaterialReceive.findOne({
                where: whereCriteria,
                attributes: ['id', 'refParentCreditDebitInvoiceno', 'holdUnholdId'],
                transaction: t
            }).then(isexist => ({
                status: STATE.SUCCESS,
                type: 'HoldResumeId',
                holdUnholdId: isexist ? isexist.holdUnholdId : null
            })).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.NOT_CREATED(invoice)
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // Apporve/Update packing slip material detail Memo
    // POST : /api/v1/packing_slip/approvePackingSlipMaterialMemo
    approvePackingSlipMaterialMemo: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet,
            sequelize
        } = req.app.locals.models;
        let messageContent;
        var validationPromise = [];
        var debitMemoNumberPromise = [];
        if (req.body.refParentCreditDebitInvoiceno) {
            const isMemoForPrice = (req.body.newDetail.discount ? true : req.body.newDetail.isMemoForPrice);
            const isMemoForQty = (req.body.newDetail.discount ? true : req.body.newDetail.isMemoForQty);
            return sequelize.transaction().then((t) => {
                if (isMemoForPrice) {
                    validationPromise.push(module.exports.checkDuplicateCreditDebitMemoValidationPromise(req, isMemoForPrice, false, t));
                }
                if (isMemoForQty) {
                    validationPromise.push(module.exports.checkDuplicateCreditDebitMemoValidationPromise(req, false, isMemoForQty, t));
                }

                if (req.body.receiptType === DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.DEBIT_MEMO && req.body.refSupplierCreditMemoNumber) {
                    validationPromise.push(module.exports.checkUniquePackingSlipNumberPromise(req, res, true, t));
                }
                if (req.body.receiptType === DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.CREDIT_MEMO) {
                    validationPromise.push(module.exports.checkUniquePackingSlipNumberPromise(req, res, false, t));
                }

                return Promise.all(validationPromise).then((validationResponse) => {
                    var resObj = _.find(validationResponse, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        if (resObj.message) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: resObj.message,
                                err: null,
                                data: null
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.NOT_CREATED(invoice),
                                err: null,
                                data: null
                            });
                        }
                    } else {
                        const promises = [];
                        COMMON.setModelCreatedByFieldValue(req);
                        req.body.receiptDate = COMMON.getCurrentUTC();
                        let systemId = null;
                        if (req.body.receiptType === DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.DEBIT_MEMO) {
                            systemId = DATA_CONSTANT.PACKING_SLIP.Debit_Memo_System_Id;
                        } else if (req.body.receiptType === DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.CREDIT_MEMO) {
                            systemId = DATA_CONSTANT.PACKING_SLIP.Credit_Memo_System_Id;
                        }

                        return UTILITY_CONTROLLER.getSystemIdPromise(req, res, systemId, t).then((systemIdPromise) => {
                            if (systemIdPromise.status === STATE.SUCCESS) {
                                req.body.systemId = systemIdPromise.systemId;
                                if (req.body.newDetail.discount) {
                                    req.body.invoiceTotalDue = COMMON.roundUpNum(req.body.invoiceTotalDue + req.body.newDetail.discount, 2);
                                }

                                /* add generate DM# promise*/
                                if (req.body.receiptType === DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.DEBIT_MEMO) {
                                    debitMemoNumberPromise.push(module.exports.generateDebitMemoNumber(req, t));
                                }
                                debitMemoNumberPromise.push(module.exports.getInvoiceHoldUnholdID(req, t));

                                return Promise.all(debitMemoNumberPromise).then((debitMemoNumberResponse) => {
                                    var resDMObj = _.find(debitMemoNumberResponse, resp => resp.status === STATE.FAILED);
                                    if (resDMObj) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        if (resDMObj.message) {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                messageContent: resDMObj.message,
                                                err: resDMObj.err || null,
                                                data: null
                                            });
                                        } else {
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                messageContent: MESSAGE_CONSTANT.NOT_CREATED(invoice),
                                                err: null,
                                                data: null
                                            });
                                        }
                                    } else {
                                        if (req.body.receiptType === DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.DEBIT_MEMO) {
                                            const resDMNumber = _.find(debitMemoNumberResponse, resp => resp.type === 'DMNumber');
                                            req.body.debitMemoNumber = resDMNumber.debitMemoNumber;
                                        }
                                        if (req.body.status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.ApprovedToPay) {
                                            req.body.lockStatus = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                                        }
                                        const resHoldResumeId = _.find(debitMemoNumberResponse, resp => resp.type === 'HoldResumeId');
                                        if (resHoldResumeId) {
                                            req.body.refParentCreditDebitInvoiceHoldUnholdId = resHoldResumeId.holdUnholdId;
                                        }

                                        return PackingSlipMaterialReceive.create(req.body, {
                                            fields: packingInputFields,
                                            transaction: t
                                        }).then((response) => {
                                            if (response) {
                                                const packingSlipDet = response;

                                                return PackingSlipMaterialReceiveDet.findOne({
                                                    where: {
                                                        id: parseInt(req.body.currentDetail.id),
                                                        deletedAt: null
                                                    },
                                                    attributes: ['id', 'approveNote', 'refCreditDebitInvoiceNo'],
                                                    transaction: t
                                                }).then((responseData) => {
                                                    const currentDetailObj = {
                                                        // status: req.body.currentDetail.status,
                                                        refCreditDebitInvoiceNo: responseData && responseData.refCreditDebitInvoiceNo ? COMMON.stringFormat('{0},{1}', responseData.refCreditDebitInvoiceNo, packingSlipDet.id) : packingSlipDet.id,
                                                        purchasePrice: req.body.currentDetail.purchasePrice,
                                                        invoicePrice: req.body.currentDetail.invoicePrice,
                                                        difference: req.body.currentDetail.difference,
                                                        differenceQty: req.body.currentDetail.differenceQty,
                                                        updatedBy: req.user.id,
                                                        updateByRoleId: req.user.defaultLoginRoleID,
                                                        updatedAt: COMMON.getCurrentUTC()
                                                    };
                                                    /* separated to manage for two issues memo created from different pages/tabs or by different users */
                                                    if (req.body.newDetail.discount ? true : req.body.currentDetail.isMemoForPrice) {
                                                        currentDetailObj.isMemoForPrice = true;
                                                    }
                                                    if (req.body.newDetail.discount ? true : req.body.currentDetail.isMemoForQty) {
                                                        currentDetailObj.isMemoForQty = true;
                                                    }

                                                    promises.push(
                                                        PackingSlipMaterialReceiveDet.update(currentDetailObj, {
                                                            where: {
                                                                ID: req.body.currentDetail.id
                                                            },
                                                            fields: ['status', 'purchasePrice', 'invoicePrice', 'refCreditDebitInvoiceNo', 'difference', 'differenceQty', 'isMemoForPrice', 'isMemoForQty', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                                            transaction: t
                                                        }).then(() => PackingSlipMaterialReceiveDet.findOne({
                                                            where: {
                                                                ID: req.body.currentDetail.id
                                                            },
                                                            transaction: t
                                                        }).then((updatedRecord) => {
                                                            if (((updatedRecord.invoicePrice !== updatedRecord.purchasePrice && updatedRecord.isMemoForPrice) ||
                                                                (updatedRecord.invoicePrice === updatedRecord.purchasePrice)) &&

                                                                ((updatedRecord.receivedQty !== updatedRecord.packingSlipQty && updatedRecord.isMemoForQty) ||
                                                                    (updatedRecord.receivedQty === updatedRecord.packingSlipQty))) {
                                                                const statusObj = {
                                                                    status: 'A'
                                                                };
                                                                return PackingSlipMaterialReceiveDet.update(statusObj, {
                                                                    where: {
                                                                        ID: req.body.currentDetail.id
                                                                    },
                                                                    transaction: t
                                                                });
                                                            } else {
                                                                return {
                                                                    status: STATE.SUCCESS
                                                                };
                                                            }
                                                        }))
                                                    );

                                                    if (req.body.newDetail.discount !== 0) {
                                                        const newDetailObjForPrice = req.body.newDetail;
                                                        newDetailObjForPrice.id = null;
                                                        newDetailObjForPrice.refPackingSlipMaterialRecID = packingSlipDet.id;
                                                        newDetailObjForPrice.packingSlipSerialNumber = 1;
                                                        newDetailObjForPrice.receivedQty = req.body.newDetailForPrice.receivedQty;
                                                        newDetailObjForPrice.packingSlipQty = req.body.newDetailForPrice.packingSlipQty;
                                                        newDetailObjForPrice.invoicePrice = req.body.newDetailForPrice.invoicePrice;
                                                        newDetailObjForPrice.purchasePrice = req.body.newDetailForPrice.purchasePrice;
                                                        // newDetailObjForPrice.extendedPrice = roundUpNum(req.body.newDetailForPrice.extendedPrice - req.body.newDetail.discount, 2);
                                                        // newDetailObjForPrice.extendedReceivedPrice = roundUpNum(req.body.newDetailForPrice.extendedReceivedPrice - req.body.newDetail.discount, 2);
                                                        // PS qty Less and price Different and Applied Discount
                                                        newDetailObjForPrice.extendedPrice = COMMON.roundUpNum(req.body.newDetailForPrice.extendedPrice, 2);
                                                        newDetailObjForPrice.extendedReceivedPrice = COMMON.roundUpNum(req.body.newDetailForPrice.extendedReceivedPrice, 2);
                                                        newDetailObjForPrice.isMemoForPrice = true;
                                                        newDetailObjForPrice.isMemoForQty = true;
                                                        newDetailObjForPrice.umidCreated = true;
                                                        newDetailObjForPrice.createdBy = req.user.id;
                                                        newDetailObjForPrice.createByRoleId = req.user.defaultLoginRoleID;
                                                        newDetailObjForPrice.createdAt = COMMON.getCurrentUTC();
                                                        newDetailObjForPrice.updatedBy = req.user.id;
                                                        newDetailObjForPrice.updateByRoleId = req.user.defaultLoginRoleID;
                                                        newDetailObjForPrice.updatedAt = COMMON.getCurrentUTC();
                                                        promises.push(
                                                            PackingSlipMaterialReceiveDet.create(newDetailObjForPrice, {
                                                                fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForPrice', 'isMemoForQty',
                                                                    'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                                                transaction: t
                                                            })
                                                        );
                                                    } else {
                                                        if (req.body.newDetail.isMemoForPrice) {
                                                            const newDetailObjForPrice = req.body.newDetail;
                                                            newDetailObjForPrice.id = null;
                                                            newDetailObjForPrice.refPackingSlipMaterialRecID = packingSlipDet.id;
                                                            newDetailObjForPrice.packingSlipSerialNumber = 1;
                                                            newDetailObjForPrice.receivedQty = req.body.newDetailForPrice.receivedQty;
                                                            newDetailObjForPrice.packingSlipQty = req.body.newDetailForPrice.packingSlipQty;
                                                            newDetailObjForPrice.invoicePrice = req.body.newDetailForPrice.invoicePrice;
                                                            newDetailObjForPrice.purchasePrice = req.body.newDetailForPrice.purchasePrice;
                                                            newDetailObjForPrice.extendedPrice = req.body.newDetailForPrice.extendedPrice;
                                                            newDetailObjForPrice.extendedReceivedPrice = req.body.newDetailForPrice.extendedReceivedPrice;
                                                            newDetailObjForPrice.isMemoForPrice = req.body.newDetailForPrice.isMemoForPrice;
                                                            newDetailObjForPrice.umidCreated = true;
                                                            newDetailObjForPrice.createdBy = req.user.id;
                                                            newDetailObjForPrice.createByRoleId = req.user.defaultLoginRoleID;
                                                            newDetailObjForPrice.createdAt = COMMON.getCurrentUTC();
                                                            newDetailObjForPrice.updatedBy = req.user.id;
                                                            newDetailObjForPrice.updateByRoleId = req.user.defaultLoginRoleID;
                                                            newDetailObjForPrice.updatedAt = COMMON.getCurrentUTC();
                                                            promises.push(
                                                                PackingSlipMaterialReceiveDet.create(newDetailObjForPrice, {
                                                                    fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForPrice',
                                                                        'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                                                    transaction: t
                                                                })
                                                            );
                                                        }

                                                        if (req.body.newDetail.isMemoForQty) {
                                                            const newDetailObjForQty = req.body.newDetail;
                                                            newDetailObjForQty.id = null;
                                                            newDetailObjForQty.refPackingSlipMaterialRecID = packingSlipDet.id;
                                                            newDetailObjForQty.packingSlipSerialNumber = req.body.newDetail.isMemoForPrice ? 1.1 : 1;
                                                            newDetailObjForQty.receivedQty = req.body.newDetailForQty.receivedQty;
                                                            newDetailObjForQty.packingSlipQty = req.body.newDetailForQty.packingSlipQty;
                                                            newDetailObjForQty.invoicePrice = req.body.newDetailForQty.invoicePrice;
                                                            newDetailObjForQty.purchasePrice = req.body.newDetailForQty.purchasePrice;
                                                            newDetailObjForQty.extendedPrice = req.body.newDetailForQty.extendedPrice;
                                                            newDetailObjForQty.extendedReceivedPrice = req.body.newDetailForQty.extendedReceivedPrice;
                                                            newDetailObjForQty.isMemoForQty = req.body.newDetailForQty.isMemoForQty;
                                                            newDetailObjForQty.umidCreated = true;
                                                            newDetailObjForQty.createdBy = req.user.id;
                                                            newDetailObjForQty.createByRoleId = req.user.defaultLoginRoleID;
                                                            newDetailObjForQty.createdAt = COMMON.getCurrentUTC();
                                                            newDetailObjForQty.updatedBy = req.user.id;
                                                            newDetailObjForQty.updateByRoleId = req.user.defaultLoginRoleID;
                                                            newDetailObjForQty.updatedAt = COMMON.getCurrentUTC();
                                                            promises.push(
                                                                PackingSlipMaterialReceiveDet.create(newDetailObjForQty, {
                                                                    fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForQty',
                                                                        'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                                                    transaction: t
                                                                })
                                                            );
                                                        }
                                                    }
                                                    return Promise.all(promises).then(() =>
                                                        module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.currentDetail.refPackingSlipMaterialRecID, req.body.currentDetail.refPackingSlipMaterialRecID, 'Invoice', t).then((respStatus) => {
                                                            if (respStatus && respStatus.status === STATE.SUCCESS) {
                                                                messageContent = '';
                                                                return t.commit().then(() => {
                                                                    req.params = {
                                                                        id: packingSlipDet.id
                                                                    };
                                                                    req.params['id'] = packingSlipDet.id;
                                                                    req.params['receiptType'] = req.body.receiptType;
                                                                    EnterpriseSearchController.managePackingSlipInElastic(req);

                                                                    if (req.body.receiptType === 'C') {
                                                                        messageContent = MESSAGE_CONSTANT.CREATED('Credit Memo');
                                                                    }
                                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, messageContent);
                                                                });
                                                            } else {
                                                                if (!t.finished) {
                                                                    t.rollback();
                                                                }
                                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                                    messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                                                    err: (respStatus && respStatus.err) || null,
                                                                    data: null
                                                                });
                                                            }
                                                        }).catch((err) => {
                                                            console.trace();
                                                            console.error(err);
                                                            if (!t.finished) {
                                                                t.rollback();
                                                            }
                                                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_NOT_APPROVED);
                                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                                messageContent: messageContent,
                                                                err: null,
                                                                data: null
                                                            });
                                                        })
                                                    ).catch((err) => {
                                                        console.trace();
                                                        console.error(err);
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_NOT_APPROVED);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                            messageContent: messageContent,
                                                            err: null,
                                                            data: null
                                                        });
                                                    });
                                                }).catch((err) => {
                                                    console.trace();
                                                    console.error(err);
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                        err: err,
                                                        data: null
                                                    });
                                                });
                                            } else {
                                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_NOT_APPROVED);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: messageContent,
                                                    err: null,
                                                    data: null
                                                });
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    }
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: (systemIdPromise && systemIdPromise.message) || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: (systemIdPromise && systemIdPromise.err) || null,
                                    data: null
                                });
                            }
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
                messageContent: MESSAGE_CONSTANT.COMMON.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Apporve/Save Current Packing Slip Material Memo
    // POST : /api/v1/packing_slip/saveCurrentPackingSlipMaterialMemo
    saveCurrentPackingSlipMaterialMemo: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet,
            sequelize
        } = req.app.locals.models;
        let messageContent;
        if (req.body.refParentCreditDebitInvoiceno) {
            const promises = [];
            return sequelize.transaction().then((t) => {
                PackingSlipMaterialReceiveDet.findOne({
                    where: {
                        id: parseInt(req.body.currentDetail.id)
                    },
                    attributes: ['id', 'approveNote', 'refCreditDebitInvoiceNo']
                }).then((responseData) => {
                    PackingSlipMaterialReceiveDet.findOne({
                        where: {
                            refPackingSlipMaterialRecID: parseInt(req.body.newDetail.refPackingSlipMaterialRecID),
                            refPackingSlipDetId: req.body.newDetail.refPackingSlipDetId
                        },
                        attributes: ['id', 'packingSlipSerialNumber', 'approveNote', 'refCreditDebitInvoiceNo', 'extendedPrice']
                    }).then((responseResult) => {
                        if (responseResult) {
                            if (req.body.currentDetail.isGetMergeLineConfirmation) {
                                const currentDetailObj = {
                                    status: req.body.currentDetail.status,
                                    refCreditDebitInvoiceNo: responseData && responseData.refCreditDebitInvoiceNo ? COMMON.stringFormat('{0},{1}', responseData.refCreditDebitInvoiceNo, req.body.newDetail.refPackingSlipMaterialRecID) : req.body.newDetail.refPackingSlipMaterialRecID,
                                    // purchasePrice: req.body.currentDetail.purchasePrice,
                                    // invoicePrice: req.body.currentDetail.invoicePrice,
                                    difference: req.body.currentDetail.difference,
                                    differenceQty: req.body.currentDetail.differenceQty,
                                    isMemoForPrice: req.body.currentDetail.isMemoForPrice,
                                    isMemoForQty: req.body.currentDetail.isMemoForQty,
                                    updatedBy: req.user.id,
                                    updateByRoleId: req.user.defaultLoginRoleID,
                                    updatedAt: COMMON.getCurrentUTC()
                                };

                                promises.push(
                                    PackingSlipMaterialReceiveDet.update(currentDetailObj, {
                                        where: {
                                            ID: req.body.currentDetail.id
                                        },
                                        fields: ['status', 'refCreditDebitInvoiceNo', 'difference', 'differenceQty', 'isMemoForPrice', 'isMemoForQty', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                        transaction: t
                                    })
                                );

                                if (req.body.newDetail.isMemoForPrice) {
                                    const newDetailObjForPrice = req.body.newDetail;
                                    newDetailObjForPrice.id = null;
                                    newDetailObjForPrice.refPackingSlipMaterialRecID = req.body.newDetail.refPackingSlipMaterialRecID;
                                    newDetailObjForPrice.packingSlipSerialNumber = COMMON.CalcSumofArrayElement([parseFloat(responseResult.packingSlipSerialNumber), 0.1], 1);
                                    newDetailObjForPrice.receivedQty = req.body.newDetailForPrice.receivedQty;
                                    newDetailObjForPrice.packingSlipQty = req.body.newDetailForPrice.packingSlipQty;
                                    newDetailObjForPrice.invoicePrice = req.body.newDetailForPrice.invoicePrice;
                                    newDetailObjForPrice.purchasePrice = req.body.newDetailForPrice.purchasePrice;
                                    newDetailObjForPrice.extendedPrice = req.body.newDetailForPrice.extendedPrice;
                                    newDetailObjForPrice.extendedReceivedPrice = req.body.newDetailForPrice.extendedReceivedPrice;
                                    newDetailObjForPrice.isMemoForPrice = req.body.newDetailForPrice.isMemoForPrice;
                                    newDetailObjForPrice.umidCreated = true;
                                    newDetailObjForPrice.createdBy = req.user.id;
                                    newDetailObjForPrice.createByRoleId = req.user.defaultLoginRoleID;
                                    newDetailObjForPrice.createdAt = COMMON.getCurrentUTC();
                                    newDetailObjForPrice.updatedBy = req.user.id;
                                    newDetailObjForPrice.updateByRoleId = req.user.defaultLoginRoleID;
                                    newDetailObjForPrice.updatedAt = COMMON.getCurrentUTC();
                                    promises.push(
                                        PackingSlipMaterialReceiveDet.create(newDetailObjForPrice, {
                                            fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForPrice',
                                                'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            transaction: t
                                        })
                                    );
                                }

                                if (req.body.newDetail.isMemoForQty) {
                                    const newDetailObjForQty = req.body.newDetail;
                                    newDetailObjForQty.id = null;
                                    newDetailObjForQty.refPackingSlipMaterialRecID = req.body.newDetail.refPackingSlipMaterialRecID;
                                    newDetailObjForQty.packingSlipSerialNumber = COMMON.CalcSumofArrayElement([parseFloat(responseResult.packingSlipSerialNumber), 0.1], 1);
                                    newDetailObjForQty.receivedQty = req.body.newDetailForQty.receivedQty;
                                    newDetailObjForQty.packingSlipQty = req.body.newDetailForQty.packingSlipQty;
                                    newDetailObjForQty.invoicePrice = req.body.newDetailForQty.invoicePrice;
                                    newDetailObjForQty.purchasePrice = req.body.newDetailForQty.purchasePrice;
                                    newDetailObjForQty.extendedPrice = req.body.newDetailForQty.extendedPrice;
                                    newDetailObjForQty.extendedReceivedPrice = req.body.newDetailForQty.extendedReceivedPrice;
                                    newDetailObjForQty.isMemoForQty = req.body.newDetailForQty.isMemoForQty;
                                    newDetailObjForQty.umidCreated = true;
                                    newDetailObjForQty.createdBy = req.user.id;
                                    newDetailObjForQty.createByRoleId = req.user.defaultLoginRoleID;
                                    newDetailObjForQty.createdAt = COMMON.getCurrentUTC();
                                    newDetailObjForQty.updatedBy = req.user.id;
                                    newDetailObjForQty.updateByRoleId = req.user.defaultLoginRoleID;
                                    newDetailObjForQty.updatedAt = COMMON.getCurrentUTC();
                                    promises.push(
                                        PackingSlipMaterialReceiveDet.create(newDetailObjForQty, {
                                            fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForQty',
                                                'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            transaction: t
                                        })
                                    );
                                }

                                promises.push(
                                    PackingSlipMaterialReceive.findAll({
                                        where: {
                                            id: parseInt(req.body.newDetail.refPackingSlipMaterialRecID)
                                        },
                                        attributes: ['id', 'invoiceTotalDue']
                                    }).then((memoDetail) => {
                                        const extendedPrice = req.body.newDetail.isMemoForPrice ? req.body.newDetailForPrice.extendedPrice : req.body.newDetailForQty.extendedPrice;
                                        const invoiceDue = COMMON.CalcSumofArrayElement([_.map(memoDetail, 'invoiceTotalDue'), Math.abs(extendedPrice || 0)], 2);
                                        const updateMemoOfCurrentLine = {
                                            status: 'A',
                                            invoiceTotalDue: invoiceDue,
                                            updatedBy: req.user.id,
                                            updateByRoleId: req.user.defaultLoginRoleID,
                                            updatedAt: COMMON.getCurrentUTC()
                                        };
                                        PackingSlipMaterialReceive.update(updateMemoOfCurrentLine, {
                                            where: {
                                                id: req.body.currentDetail.refPackingSlipMaterialRecID
                                            },
                                            fields: ['status', 'invoiceTotalDue', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                            transaction: t
                                        });
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    })
                                );
                            } else {
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                    IsSuccess: false,
                                    ErrorCode: 1
                                }, null);
                            }
                        } else {
                            const currentDetailObj = {
                                status: req.body.currentDetail.status,
                                refCreditDebitInvoiceNo: responseData && responseData.refCreditDebitInvoiceNo ? COMMON.stringFormat('{0},{1}', responseData.refCreditDebitInvoiceNo, req.body.newDetail.refPackingSlipMaterialRecID) : req.body.newDetail.refPackingSlipMaterialRecID,
                                // purchasePrice: req.body.currentDetail.purchasePrice,
                                // invoicePrice: req.body.currentDetail.invoicePrice,
                                difference: req.body.currentDetail.difference,
                                differenceQty: req.body.currentDetail.differenceQty,
                                isMemoForPrice: req.body.currentDetail.isMemoForPrice,
                                isMemoForQty: req.body.currentDetail.isMemoForQty,
                                updatedBy: req.user.id,
                                updateByRoleId: req.user.defaultLoginRoleID,
                                updatedAt: COMMON.getCurrentUTC()
                            };

                            promises.push(
                                PackingSlipMaterialReceiveDet.update(currentDetailObj, {
                                    where: {
                                        ID: req.body.currentDetail.id
                                    },
                                    fields: ['status', 'refCreditDebitInvoiceNo', 'difference', 'differenceQty', 'isMemoForPrice', 'isMemoForQty', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                    transaction: t
                                })
                            );

                            if (req.body.newDetail.isMemoForPrice) {
                                const newDetailObjForPrice = req.body.newDetail;
                                newDetailObjForPrice.id = null;
                                newDetailObjForPrice.refPackingSlipMaterialRecID = req.body.newDetail.refPackingSlipMaterialRecID;
                                newDetailObjForPrice.packingSlipSerialNumber = req.body.newDetail.detailLineNo;
                                newDetailObjForPrice.receivedQty = req.body.newDetailForPrice.receivedQty;
                                newDetailObjForPrice.packingSlipQty = req.body.newDetailForPrice.packingSlipQty;
                                newDetailObjForPrice.invoicePrice = req.body.newDetailForPrice.invoicePrice;
                                newDetailObjForPrice.purchasePrice = req.body.newDetailForPrice.purchasePrice;
                                newDetailObjForPrice.extendedPrice = req.body.newDetailForPrice.extendedPrice;
                                newDetailObjForPrice.extendedReceivedPrice = req.body.newDetailForPrice.extendedReceivedPrice;
                                newDetailObjForPrice.isMemoForPrice = req.body.newDetailForPrice.isMemoForPrice;
                                newDetailObjForPrice.umidCreated = true;
                                newDetailObjForPrice.createdBy = req.user.id;
                                newDetailObjForPrice.createByRoleId = req.user.defaultLoginRoleID;
                                newDetailObjForPrice.createdAt = COMMON.getCurrentUTC();
                                newDetailObjForPrice.updatedBy = req.user.id;
                                newDetailObjForPrice.updateByRoleId = req.user.defaultLoginRoleID;
                                newDetailObjForPrice.updatedAt = COMMON.getCurrentUTC();
                                promises.push(
                                    PackingSlipMaterialReceiveDet.create(newDetailObjForPrice, {
                                        fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForPrice',
                                            'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                        transaction: t
                                    })
                                );
                            }

                            if (req.body.newDetail.isMemoForQty) {
                                const newDetailObjForQty = req.body.newDetail;
                                newDetailObjForQty.id = null;
                                newDetailObjForQty.refPackingSlipMaterialRecID = req.body.newDetail.refPackingSlipMaterialRecID;
                                newDetailObjForQty.packingSlipSerialNumber = req.body.newDetail.isMemoForPrice ? COMMON.CalcSumofArrayElement([parseFloat(req.body.newDetail.detailLineNo), 0.1], 1) : req.body.newDetail.detailLineNo;
                                newDetailObjForQty.receivedQty = req.body.newDetailForQty.receivedQty;
                                newDetailObjForQty.packingSlipQty = req.body.newDetailForQty.packingSlipQty;
                                newDetailObjForQty.invoicePrice = req.body.newDetailForQty.invoicePrice;
                                newDetailObjForQty.purchasePrice = req.body.newDetailForQty.purchasePrice;
                                newDetailObjForQty.extendedPrice = req.body.newDetailForQty.extendedPrice;
                                newDetailObjForQty.extendedReceivedPrice = req.body.newDetailForQty.extendedReceivedPrice;
                                newDetailObjForQty.isMemoForQty = req.body.newDetailForQty.isMemoForQty;
                                newDetailObjForQty.umidCreated = true;
                                newDetailObjForQty.createdBy = req.user.id;
                                newDetailObjForQty.createByRoleId = req.user.defaultLoginRoleID;
                                newDetailObjForQty.createdAt = COMMON.getCurrentUTC();
                                newDetailObjForQty.updatedBy = req.user.id;
                                newDetailObjForQty.updateByRoleId = req.user.defaultLoginRoleID;
                                newDetailObjForQty.updatedAt = COMMON.getCurrentUTC();
                                promises.push(
                                    PackingSlipMaterialReceiveDet.create(newDetailObjForQty, {
                                        fields: ['refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'nickname', 'partID', 'refSupplierPartID', 'receivedQty', 'packingSlipQty', 'invoicePrice', 'purchasePrice', 'isMemoForQty',
                                            'extendedPrice', 'extendedReceivedPrice', 'approveNote', 'status', 'refPackingSlipDetId', 'packagingID', 'createdBy', 'createByRoleId', 'createdAt', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                        transaction: t
                                    })
                                );
                            }

                            promises.push(
                                PackingSlipMaterialReceive.findOne({
                                    where: {
                                        id: req.body.newDetail.refPackingSlipMaterialRecID
                                    },
                                    attributes: ['id', 'status', 'invoiceTotalDue']
                                }).then((currentMemo) => {
                                    const newDetailOfCurrentMemo = {
                                        status: 'A',
                                        invoiceTotalDue: currentMemo && currentMemo.invoiceTotalDue ? COMMON.CalcSumofArrayElement([currentMemo.invoiceTotalDue, Math.abs(req.body.newDetailForPrice.extendedPrice || 0), Math.abs(req.body.newDetailForQty.extendedPrice || 0)], 2) : COMMON.CalcSumofArrayElement([Math.abs(req.body.newDetailForPrice.extendedPrice || 0), Math.abs(req.body.newDetailForQty.extendedPrice || 0)], 2),
                                        updatedBy: req.user.id,
                                        updateByRoleId: req.user.defaultLoginRoleID,
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                    PackingSlipMaterialReceive.update(newDetailOfCurrentMemo, {
                                        where: {
                                            id: req.body.currentDetail.refPackingSlipMaterialRecID
                                        },
                                        fields: ['status', 'invoiceTotalDue', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                        transaction: t
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                })
                            );
                        }


                        return Promise.all(promises).then(() =>
                            module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refParentCreditDebitInvoiceno, req.body.refParentCreditDebitInvoiceno, 'Invoice', t).then((respStatus) => {
                                if (respStatus && respStatus.status === STATE.SUCCESS) {
                                    t.commit();
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_APPROVED);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, messageContent);
                                } else {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                        err: (respStatus && respStatus.err) || null,
                                        data: null
                                    });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) {
                                    t.rollback();
                                }
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.MATERIAL_NOT_APPROVED);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
                                });
                            }));
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
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

    updatePackingSlip: (req, res, id) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;

        if (id) {
            return PackingSlipMaterialReceiveDet.findAll({
                where: {
                    refPackingSlipMaterialRecID: id
                },
                attributes: ['id', 'refPackingSlipMaterialRecID', 'status']
            }).then((response) => {
                if (response && response.length > 0) {
                    let status = 'W';
                    if (_.some(response, data => data.status === 'D')) {
                        status = 'I';
                    } else if (_.filter(response, data => data.status === 'A').length === response.length) {
                        status = 'A';
                    } else if (_.filter(response, data => data.status === 'P').length === response.length) {
                        status = 'W';
                    } else {
                        status = 'W';
                    }

                    const requestData = {
                        status: status,
                        updatedBy: req.user.id
                    };

                    PackingSlipMaterialReceive.update(requestData, {
                        where: {
                            id: id
                        },
                        fields: ['status', 'updatedBy']
                    }).then(respMaterialReceive => respMaterialReceive).catch((err) => {
                        console.trace();
                        console.error(err);
                    });

                    // return true;
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.COMMON.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // to be called in promise from API only
    invoiceHaltValidationForPaymentPromise: (req, pPaidPackingList, t) => {
        const {
            HoldUnholdTrans
        } = req.app.locals.models;
        if (req.body) {
            return HoldUnholdTrans.findOne({
                where: {
                    refTransId: {
                        [Op.in]: _.map(pPaidPackingList, 'id')
                    },
                    status: DATA_CONSTANT.HOLD_UNHOLD_TRANS.Halt,
                    refType: {
                        [Op.in]: [DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierInvoiceModule,
                        DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierDebitMemoModule,
                        DATA_CONSTANT.HOLD_UNHOLD_TRANS.SupplierCreditMemoModule]
                    },
                    isDeleted: false
                },
                transaction: t
            }).then((isexist) => {
                if (isexist) {
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.RECEIVING.NOT_ALLOWED_TO_PAY_HALTED_INVOICE
                    };
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // Paid packing slip amount
    // POST : /api/v1/packing_slip/paidPackingSlip
    paidPackingSlip: (req, res) => {
        const {
            // PackingSlipMaterialReceive,
            PackingslipInvoicePayment,
            PackingslipInvoicePaymentDet,
            sequelize
        } = req.app.locals.models;
        let messageContent;
        if (req.body) {
            const promises = [];
            const promoseSerialNumber = [];
            return sequelize.transaction().then((t) => {
                COMMON.setModelCreatedByFieldValue(req);
                PackingslipInvoicePayment.findOne({
                    where: {
                        paymentNumber: req.body.paymentNumber,
                        bankAccountMasID: req.body.bankAccountMasID,
                        isDeleted: false
                    },
                    transaction: t
                }).then((isexist) => {
                    if (isexist) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: MESSAGE_CONSTANT.RECEIVING.DUPLICATE_CHECK_NO,
                            err: null,
                            data: null
                        });
                    } else {
                        req.body.isDeleted = 0;
                        if (!req.body.paymentAmount || req.body.paymentAmount === 0) {
                            promoseSerialNumber.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.AutoGeneratedPaymentNumber, t));
                        }
                        promoseSerialNumber.push(module.exports.invoiceHaltValidationForPaymentPromise(req, req.body.paidPackingList, t));
                        return Promise.all(promoseSerialNumber).then((responsSerialNumber) => {
                            var resObjSerialNumber = _.find(responsSerialNumber, resp => resp.status === STATE.FAILED);
                            if (resObjSerialNumber) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: resObjSerialNumber.message || messageContent,
                                    err: resObjSerialNumber.err || null,
                                    data: null
                                });
                            } else {
                                // => promise start
                                if (!req.body.paymentAmount || req.body.paymentAmount === 0) {
                                    const serialNumberGenerated = _.find(responsSerialNumber, resp => resp.systemId);
                                    req.body.paymentNumber = serialNumberGenerated.systemId;
                                }
                                return UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.PACKING_SLIP.Supplier_Payment_System_Id, t)
                                    .then((systemIdPromise) => {
                                        if (systemIdPromise.status === STATE.SUCCESS) {
                                            req.body.systemId = systemIdPromise.systemId;
                                            req.body.lockStatus = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                                            return PackingslipInvoicePayment.create(req.body, {
                                                fields: packingslipInvoicePaymentInputFields,
                                                transaction: t
                                            }).then((invoicePayment) => {
                                                _.forEach(req.body.paidPackingList, (data) => {
                                                    const createPaymentDetObj = {
                                                        refPayementid: invoicePayment.id,
                                                        refPackingslipInvoiceID: data.id,
                                                        paymentAmount: data.paymentAmount,
                                                        isPaymentVoided: 0,
                                                        isDeleted: 0,
                                                        createdBy: req.user.id,
                                                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                        updatedBy: req.user.id,
                                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                    };
                                                    promises.push(
                                                        PackingslipInvoicePaymentDet.create(createPaymentDetObj, {
                                                            transaction: t
                                                        }
                                                        ).then((response) => {
                                                            if (response[0] === 0) {
                                                                return {
                                                                    status: STATE.FAILED
                                                                };
                                                            } else {
                                                                return {
                                                                    status: STATE.SUCCESS
                                                                };
                                                            }
                                                        })
                                                    );
                                                });

                                                return Promise.all(promises).then((response) => {
                                                    var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                                    if (resObj) {
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
                                                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                            messageContent: messageContent,
                                                            err: null,
                                                            data: null
                                                        });
                                                    } else {
                                                        return t.commit().then(() => {
                                                            req.epSearchData = {
                                                                InvPaymentMstID: invoicePayment.id
                                                            };
                                                            req.params.refPaymentMode = req.body.refPaymentMode;
                                                            EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);

                                                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_PAID);
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoicePayment, messageContent);
                                                        });
                                                    }

                                                    /** as confirmed with Dixitbhai on skype currently no need to manage payment data in elastic search
                                                     * DPs comment
                                                        we cannot share amount detail to all
                                                        so lets first finish transaction
                                                        about elastic search i required to discuss with jaybhai first
                                                        possible way to we just update transaction id and invoice detail without amount
                                                        but let me first confirm with jaybhai on same
                                                    */
                                                    // _.forEach(req.body, (data) => {
                                                    //     // Add Packing Slip Detail into Elastic Search Engine for Enterprise Search
                                                    //     req.params = {
                                                    //         id: data.id
                                                    //     };
                                                    //     // Add Packing Slip into Elastic Search Engine for Enterprise Search
                                                    //     // Need to change timeout code due to trasaction not get updated record
                                                    //     setTimeout(() => {
                                                    //         EnterpriseSearchController.managePackingSlipInElastic(req);
                                                    //     }, 2000);
                                                    // });
                                                }).catch((err) => {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    console.trace();
                                                    console.error(err);

                                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                        messageContent: messageContent,
                                                        err: err,
                                                        data: null
                                                    });
                                                });
                                            }).catch((err) => {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                console.trace();
                                                console.error(err);
                                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: messageContent,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: (systemIdPromise && systemIdPromise.message) || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: (systemIdPromise && systemIdPromise.err) || null,
                                                data: null
                                            });
                                        }
                                    });
                                // <= promise end
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);

                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: messageContent,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SLIP_NOT_PAID);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: messageContent,
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

    updateSupplierPayment: (req, res) => {
        const {
            PackingslipInvoicePayment
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return PackingslipInvoicePayment.findOne({
                where: {
                    id: req.body.id,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (!isexist) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(invoicePaymentModuleName),
                        err: null,
                        data: null
                    });
                }
                const objData = {
                    remark: req.body.remark,
                    updatedAt: COMMON.getCurrentUTC(),
                    updatedBy: COMMON.getRequestUserID(req),
                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                };
                return PackingslipInvoicePayment.update(objData, {
                    where: {
                        id: req.body.id
                    }
                }).then((updatedRecord) => {
                    req.epSearchData = {
                        InvPaymentMstID: req.body.id
                    };
                    req.params.refPaymentMode = isexist.refPaymentMode;
                    EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, updatedRecord, MESSAGE_CONSTANT.UPDATED(invoicePaymentModuleName));
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Save Supplier Refund transaction
    // POST : /api/v1/packing_slip/saveSupplierRefund
    saveSupplierRefund: (req, res) => {
        const {
            PackingslipInvoicePayment,
            PackingslipInvoicePaymentDet,
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;
        var messageContent;
        if (req.body) {
            const promises = [];
            if (!req.body.paymentId) { /* create case */
                return sequelize.transaction().then((t) => {
                    COMMON.setModelCreatedByFieldValue(req);
                    return PackingslipInvoicePayment.findOne({
                        where: {
                            paymentNumber: req.body.paymentNumber,
                            mfgcodeID: req.body.mfgcodeID,
                            refPaymentMode: DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund,
                            isDeleted: false
                        },
                        transaction: t
                    }).then((isexist) => {
                        if (isexist) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.RECEIVING.DUPLICATE_SUPPLIER_REFUND_NUMBER,
                                err: null,
                                data: null
                            });
                        } else {
                            req.body.isDeleted = 0;
                            return UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.SupplierRefundSystemId, t)
                                .then((systemIdPromise) => {
                                    if (systemIdPromise.status === STATE.SUCCESS) {
                                        req.body.systemId = systemIdPromise.systemId;
                                        req.body.lockStatus = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                                        req.body.isPaymentVoided = false;
                                        return PackingslipInvoicePayment.create(req.body, {
                                            fields: packingslipInvoicePaymentInputFields,
                                            transaction: t
                                        }).then((invoicePayment) => {
                                            var newAddedLines = _.filter(req.body.paidPackingList, a => !a.id);
                                            if (newAddedLines && newAddedLines.length > 0) {
                                                promises.push(
                                                    PackingSlipMaterialReceive.findAll({
                                                        where: {
                                                            id: {
                                                                [Op.in]: _.map(newAddedLines, 'refPackingslipInvoiceID')
                                                            }
                                                        },
                                                        transaction: t,
                                                        attributes: ['id']
                                                    }).then((response) => {
                                                        if (response && response.length === newAddedLines.length) {
                                                            return {
                                                                status: STATE.SUCCESS
                                                            };
                                                        } else {
                                                            return {
                                                                status: STATE.FAILED,
                                                                message: MESSAGE_CONSTANT.RECEIVING.SUPPLIER_CM_DM_NOT_MAKRED_FOR_REFUND
                                                            };
                                                        }
                                                    })
                                                );
                                            }
                                            _.forEach(req.body.paidPackingList, (data) => {
                                                const createPaymentDetObj = {
                                                    refPayementid: invoicePayment.id,
                                                    refPackingslipInvoiceID: data.refPackingslipInvoiceID,
                                                    paymentAmount: data.paymentAmount,
                                                    isPaymentVoided: 0,
                                                    isDeleted: 0,
                                                    createdBy: req.user.id,
                                                    createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                    updatedBy: req.user.id,
                                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                };
                                                promises.push(
                                                    PackingslipInvoicePaymentDet.create(createPaymentDetObj, {
                                                        transaction: t
                                                    }
                                                    ).then((response) => {
                                                        if (response[0] === 0) {
                                                            return {
                                                                status: STATE.FAILED
                                                            };
                                                        } else {
                                                            return {
                                                                status: STATE.SUCCESS
                                                            };
                                                        }
                                                    })
                                                );
                                            });

                                            return Promise.all(promises).then((response) => {
                                                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                                if (resObj) {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                        messageContent: (resObj && resObj.message) || messageContent,
                                                        err: null,
                                                        data: null
                                                    });
                                                } else {
                                                    return t.commit().then(() => {
                                                        req.epSearchData = {
                                                            InvPaymentMstID: invoicePayment.id
                                                        };
                                                        req.params.refPaymentMode = DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund;
                                                        EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);

                                                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_SAVED_SUCCESSFULLY);
                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoicePayment, messageContent);
                                                    });
                                                }
                                            }).catch((err) => {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                console.trace();
                                                console.error(err);

                                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: messageContent,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: messageContent,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: (systemIdPromise && systemIdPromise.message) || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: (systemIdPromise && systemIdPromise.err) || null,
                                            data: null
                                        });
                                    }
                                });
                        }
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: messageContent,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: err,
                        data: null
                    });
                });
            } else { /* update case*/
                return sequelize.transaction().then((t) => {
                    COMMON.setModelUpdatedByFieldValue(req);
                    return PackingslipInvoicePayment.findOne({
                        where: {
                            id: {
                                [Op.ne]: req.body.paymentId
                            },
                            paymentNumber: req.body.paymentNumber,
                            mfgcodeID: req.body.mfgcodeID,
                            refPaymentMode: DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund,
                            isDeleted: false
                        },
                        transaction: t
                    }).then((isexist) => {
                        if (isexist) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.RECEIVING.DUPLICATE_SUPPLIER_REFUND_NUMBER,
                                err: null,
                                data: null
                            });
                        }
                        const objData = {
                            paymentDate: req.body.paymentDate,
                            paymentNumber: req.body.paymentNumber,
                            paymentType: req.body.paymentType,
                            bankAccountMasID: req.body.bankAccountMasID,
                            bankAccountNo: req.body.bankAccountNo,
                            bankName: req.body.bankName,
                            depositBatchNumber: req.body.depositBatchNumber,
                            offsetAmount: req.body.offsetAmount,
                            remark: req.body.remark,
                            acctId: req.body.acctId,
                            updatedBy: req.body.updatedBy,
                            updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                            updatedAt: COMMON.getCurrentUTC()
                        };
                        return PackingslipInvoicePayment.update(objData, {
                            where: {
                                id: req.body.paymentId,
                                mfgcodeID: req.body.mfgcodeID,
                                isDeleted: false
                            },
                            transaction: t
                        }).then((invoicePayment) => {
                            _.forEach(req.body.paidPackingList, (data) => {
                                if (!data.id) { /* Create */
                                    const createPaymentDetObj = {
                                        refPayementid: req.body.paymentId,
                                        refPackingslipInvoiceID: data.refPackingslipInvoiceID,
                                        paymentAmount: data.paymentAmount,
                                        isPaymentVoided: 0,
                                        isDeleted: 0,
                                        createdBy: req.user.id,
                                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedBy: req.user.id,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                    };
                                    promises.push(
                                        PackingslipInvoicePaymentDet.create(createPaymentDetObj, {
                                            transaction: t
                                        }
                                        ).then((response) => {
                                            if (response[0] === 0) {
                                                return {
                                                    status: STATE.FAILED
                                                };
                                            } else {
                                                return {
                                                    status: STATE.SUCCESS
                                                };
                                            }
                                        })
                                    );
                                } else if (data.id) { /* Update */
                                    const updatePaymentDetObj = {
                                        paymentAmount: data.paymentAmount,
                                        updatedBy: req.user.id,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                        updatedAt: COMMON.getCurrentUTC()
                                    };
                                    promises.push(
                                        PackingslipInvoicePaymentDet.update(updatePaymentDetObj, {
                                            where: {
                                                id: data.id,
                                                refPayementid: req.body.paymentId,
                                                isDeleted: false
                                            },
                                            transaction: t
                                        }).then((response) => {
                                            if (response[0] === 0) {
                                                return {
                                                    status: STATE.FAILED
                                                };
                                            } else {
                                                return {
                                                    status: STATE.SUCCESS
                                                };
                                            }
                                        })
                                    );
                                }
                            });

                            /** delete un-selected rows */
                            if (req.body.deletedPackingList && req.body.deletedPackingList.length) {
                                const updatePaymentDetObj = {
                                    isDeleted: true,
                                    deletedBy: req.user.id,
                                    deleteByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                    deletedAt: COMMON.getCurrentUTC()
                                };
                                promises.push(
                                    PackingslipInvoicePaymentDet.update(updatePaymentDetObj, {
                                        where: {
                                            id: {
                                                [Op.in]: _.map(req.body.deletedPackingList, 'id')
                                            },
                                            refPayementid: req.body.paymentId,
                                            isDeleted: false
                                        },
                                        transaction: t
                                    }).then((response) => {
                                        if (response[0] === 0) {
                                            return {
                                                status: STATE.FAILED
                                            };
                                        } else {
                                            return {
                                                status: STATE.SUCCESS
                                            };
                                        }
                                    })
                                );
                            }
                            return Promise.all(promises).then((response) => {
                                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                                if (resObj) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: messageContent,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    return t.commit().then(() => {
                                        req.epSearchData = {
                                            InvPaymentMstID: req.body.paymentId
                                        };
                                        req.params.refPaymentMode = DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund;
                                        EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);

                                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_SAVED_SUCCESSFULLY);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoicePayment, messageContent);
                                    });
                                }
                            }).catch((err) => {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error(err);

                                messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: messageContent,
                                    err: err,
                                    data: null
                                });
                            });
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: messageContent,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
                        console.trace();
                        console.error(err);
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: messageContent,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: err,
                        data: null
                    });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // void supplier invoice payment
    // POST : /api/v1/packing_slip/voidSupplierInvoicePayment
    voidSupplierInvoicePayment: (req, res) => {
        const {
            PackingslipInvoicePayment,
            PackingslipInvoicePaymentDet,
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.id && req.body.refPaymentModeOfInvPayment) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                PackingslipInvoicePayment.findOne({
                    where: {
                        id: req.body.id,
                        refPaymentMode: req.body.refPaymentModeOfInvPayment,
                        isDeleted: false
                    },
                    transaction: t
                }).then((isExists) => {
                    if (isExists && isExists.isPaymentVoided === false) {
                        // check transaction is locked then not allowed to void
                        if ((req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) && isExists.lockStatus === DATA_CONSTANT.CustomerPaymentLockStatus.Locked) {
                            const msgContentForLocked = Object.assign({}, MESSAGE_CONSTANT.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
                            msgContentForLocked.message = COMMON.stringFormat(msgContentForLocked.message, isExists.paymentNumber);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: msgContentForLocked,
                                err: null,
                                data: null
                            });
                        }

                        if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable && (isExists.refundStatus === DATA_CONSTANT.CustomerPaymentRefundStatusText.PartialPaymentRefunded.Code || isExists.refundStatus === DATA_CONSTANT.CustomerPaymentRefundStatusText.FullPaymentRefunded.Code)) {
                            const msgContentForLocked = Object.assign({}, MESSAGE_CONSTANT.MFG.VOID_TRANS_NOT_ALLOWED_AS_AMOUNT_REFUNDED);
                            msgContentForLocked.message = COMMON.stringFormat(msgContentForLocked.message, isExists.paymentNumber, 'void', 'customer payment');
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: msgContentForLocked,
                                err: null,
                                data: null
                            });
                        }

                        const whereCriteriaPaymentDet = {
                            refPayementid: req.body.id,
                            isPaymentVoided: false,
                            isDeleted: false
                        };

                        if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable ||
                            req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund) {
                            whereCriteriaPaymentDet.refPackingslipInvoiceID = { [Op.ne]: null };
                        } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable) {
                            whereCriteriaPaymentDet.refCustPackingslipInvoiceID = { [Op.ne]: null };
                        }

                        return PackingslipInvoicePaymentDet.findAll({
                            where: whereCriteriaPaymentDet,
                            attributes: ['id', 'refPayementid', 'refPackingslipInvoiceID'],
                            transaction: t
                        }).then((paymentDetList) => {
                            // Receivable >> invoice may or may not be added >> advance payment only
                            if (paymentDetList || (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable)) {
                                return PackingslipInvoicePaymentDet.update({
                                    isPaymentVoided: true,
                                    updatedAt: COMMON.getCurrentUTC(),
                                    updatedBy: req.body.updatedBy,
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                }, {
                                    where: whereCriteriaPaymentDet,
                                    transaction: t
                                }).then(() => {
                                    // void parent master entry
                                    const voidObj = {
                                        isPaymentVoided: true,
                                        voidPaymentReason: req.body.voidPaymentReason,
                                        updatedBy: req.body.updatedBy,
                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                    };
                                    return PackingslipInvoicePayment.update(voidObj, {
                                        where: {
                                            id: req.body.id,
                                            refPaymentMode: req.body.refPaymentModeOfInvPayment,
                                            isPaymentVoided: false,
                                            isDeleted: false
                                        },
                                        transaction: t
                                    }).then(() => {
                                        // update other details like status and other fields
                                        const updateSuppCustInvDetPromises = [];
                                        if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable ||
                                            req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund) {
                                            updateSuppCustInvDetPromises.push(module.exports.updateSuppPackingSlipMatRevStatusAfterVoidPayment(req, t));
                                        } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable
                                            || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code
                                            || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code
                                            || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                            updateSuppCustInvDetPromises.push(module.exports.updateCustInvPayStatusAfterVoidPayment(req, t));
                                        }

                                        return Promise.all(updateSuppCustInvDetPromises).then((suppCustInvDetPromisesResps) => {
                                            const resObjValidation = _.find(suppCustInvDetPromisesResps, r => r.status === STATE.FAILED);
                                            if (resObjValidation) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: resObjValidation.err || null,
                                                    data: null
                                                });
                                            }

                                            const suppCustInvDetPromisesAllResp = suppCustInvDetPromisesResps;
                                            let rowsUpdatedPackingSlip = null;

                                            return t.commit().then(() => {
                                                let msgContentForVoid = null;
                                                if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                                    msgContentForVoid = MESSAGE_CONSTANT.RECEIVING.SUPPLIER_PAYMENT_VOIDED;
                                                    msgContentForVoid.message = COMMON.stringFormat(msgContentForVoid.message, 'Payment');
                                                    rowsUpdatedPackingSlip = _.values(suppCustInvDetPromisesAllResp[0]);
                                                    req.epSearchData = {
                                                        InvPaymentMstID: req.body.id
                                                    };
                                                    req.params.refPaymentMode = req.body.refPaymentModeOfInvPayment;
                                                    EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);
                                                } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund) {
                                                    msgContentForVoid = MESSAGE_CONSTANT.RECEIVING.SUPPLIER_PAYMENT_VOIDED;
                                                    msgContentForVoid.message = COMMON.stringFormat(msgContentForVoid.message, 'Refund');
                                                    rowsUpdatedPackingSlip = _.values(suppCustInvDetPromisesAllResp[0]);
                                                    req.epSearchData = {
                                                        InvPaymentMstID: req.body.id
                                                    };
                                                    req.params.refPaymentMode = req.body.refPaymentModeOfInvPayment;
                                                    EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);
                                                } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable
                                                    || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code
                                                    || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                                    req.body.epSearchData = {};
                                                    req.body.epSearchData = {
                                                        InvPaymentMstID: req.body.id
                                                    };
                                                    req.params['refPaymentMode'] = req.body.refPaymentModeOfInvPayment;
                                                    EnterpriseSearchController.manageCustomerPaymentInElastic(req);

                                                    // set void success message
                                                    if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code) {
                                                        msgContentForVoid = Object.assign({}, MESSAGE_CONSTANT.MFG.CUST_APPLIED_CREDIT_MEMO_VOIDED_SUCCESS);
                                                        msgContentForVoid.message = COMMON.stringFormat(msgContentForVoid.message, 'voided');
                                                    } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                                        let voidForModule = null;
                                                        if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code) {
                                                            voidForModule = 'Applied write off';
                                                        } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) {
                                                            voidForModule = 'Customer refund';
                                                        }
                                                        msgContentForVoid = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.ANY_TYPE_VOID_SUCCESS);
                                                        msgContentForVoid.message = COMMON.stringFormat(msgContentForVoid.message, voidForModule);
                                                    } else {
                                                        msgContentForVoid = Object.assign({}, MESSAGE_CONSTANT.MFG.CUST_PAYMENT_VOID_REISSUE_SUCCESS);
                                                        msgContentForVoid.message = COMMON.stringFormat(msgContentForVoid.message, 'voided');
                                                    }
                                                }

                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rowsUpdatedPackingSlip, msgContentForVoid);
                                            });
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    }).catch((err) => {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: null,
                                    data: null
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    } else {
                        if (!t.finished) {
                            t.rollback();
                        }
                        let msgContent = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                        let respData = null;

                        if ((req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.CreditMemoApplied.code || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Writeoff.code || req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.ReceivableRefPaymentMode.Refund.code) && isExists && isExists.isPaymentVoided) {
                            msgContent = null;
                            respData = {
                                isPaymentAlreadyVoided: true
                            };
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: msgContent,
                            err: null,
                            data: respData
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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

    // void and reissue supplier invoice refund
    // POST : /api/v1/packing_slip/voidAndReissueSupplierRefund
    voidAndReissueSupplierRefund: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var messageContent;
        if (req.body && req.body.refPaymentModeOfInvPayment && req.body.refVoidPaymentId) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then(t =>
                sequelize.query('CALL Sproc_InvoiceRefundVoidAndReIssue(:pRefVoidPaymentId,:pAccountReference,:pPaymentType,:pPaymentNumber,:pBankAccountMasID,:pBankAccountNo,:pBankName,:pPaymentDate,:pRemark,:pVoidPaymentReason,:pRefPaymentModeOfInvPayment,:pMfgcodeID,:pDepositBatchNumber,:pUserID,:pRoleID)', {
                    replacements: {
                        pRefVoidPaymentId: req.body.refVoidPaymentId,
                        pAccountReference: req.body.accountReference,
                        pPaymentType: req.body.paymentType,
                        pPaymentNumber: req.body.paymentNumber,
                        pBankAccountMasID: req.body.bankAccountMasID,
                        pBankAccountNo: req.body.bankAccountNo,
                        pBankName: req.body.bankName,
                        pPaymentDate: req.body.paymentDate,
                        pRemark: req.body.remark || null,
                        pVoidPaymentReason: req.body.voidPaymentReason,
                        pRefPaymentModeOfInvPayment: req.body.refPaymentModeOfInvPayment,
                        pMfgcodeID: req.body.mfgcodeID,
                        pDepositBatchNumber: req.body.depositBatchNumber || null,
                        pUserID: req.user.id,
                        pRoleID: COMMON.getRequestUserLoginRoleID(req)
                    },
                    transaction: t
                }).then((response) => {
                    if (response[0] && response[0].message) {
                        // error in void and reissue new
                        if (!t.finished) {
                            t.rollback();
                        }
                        messageContent = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                        if (response[0].message === 'DUPLICATE_CHECKNO') {
                            messageContent = MESSAGE_CONSTANT.RECEIVING.DUPLICATE_SUPPLIER_REFUND_NUMBER;
                        } else if (response[0].message === 'NOT_FOUND_OR_ALREADY_VOIDED') {
                            messageContent = MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_ALREADY_VOIDED;
                        } else if (response[0].message === DATA_CONSTANT.CHART_OF_ACCOUNTS_ERROR_TYPES.TYPE_NOT_EXISTS) {
                            messageContent = Object.assign({}, MESSAGE_CONSTANT.MASTER.SYSTEMTYPE_NOT_EXISTS);
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Supplier Refund');
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: messageContent,
                            err: null
                        });
                    } else {
                        const copyOtherDetPromises = [];
                        if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund) {
                            //req.body['id'] = req.body.refVoidPaymentId;
                            copyOtherDetPromises.push(module.exports.updateSuppPackingSlipMatRevStatusAfterVoidPayment(req, t));
                        }

                        return Promise.all(copyOtherDetPromises).then((respOfCopyOtherDetPromises) => {
                            var resObjCopyDet = _.find(respOfCopyOtherDetPromises, resp => resp.status === STATE.FAILED);
                            if (resObjCopyDet) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: resObjCopyDet.message || messageContent,
                                    err: resObjCopyDet.err || null,
                                    data: null
                                });
                            }

                            return t.commit().then(() => {
                                // for voided transaction
                                req.params.refPaymentMode = req.body.refPaymentModeOfInvPayment;
                                req.epSearchData = {
                                    InvPaymentMstID: req.body.refVoidPaymentId
                                };
                                EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);

                                // for new refund transaction
                                req.epSearchData = {
                                    InvPaymentMstID: response[0].refPayementid
                                };
                                EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);

                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], MESSAGE_CONSTANT.RECEIVING.SUPPLIER_PAYMENT_RE_ISSUED);
                            });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                })).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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

    // validate duplicate refund check number
    // POST : /api/v1/packing_slip/validateDuplicateSupplierRefundCheckNumber
    validateDuplicateSupplierRefundCheckNumber: (req, res) => {
        const {
            PackingslipInvoicePayment
        } = req.app.locals.models;
        if (req.body) {
            return PackingslipInvoicePayment.findOne({
                where: {
                    paymentNumber: req.body.paymentNumber,
                    mfgcodeID: req.body.mfgcodeID,
                    refPaymentMode: DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund,
                    isDeleted: false
                }
            }).then((isexist) => {
                if (isexist) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: MESSAGE_CONSTANT.RECEIVING.DUPLICATE_SUPPLIER_REFUND_NUMBER,
                        err: null,
                        data: null
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.RECEIVING.SUPPLIER_REFUND_NOT_SAVED,
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

    // VoidPayment case: update supplier invoice status details
    updateSuppPackingSlipMatRevStatusAfterVoidPayment: (req, t) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_UpdateSupplierPackingSlipStatusAfterVoidPayment(:pVoidPaymentId,:pRefPaymentModeOfInvPayment,:pUserID,:pUserRoleID)', {
            replacements: {
                pVoidPaymentId: req.body.id || req.body.refVoidPaymentId,
                pRefPaymentModeOfInvPayment: req.body.refPaymentModeOfInvPayment,
                pUserID: req.user.id,
                pUserRoleID: COMMON.getRequestUserLoginRoleID(req)
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },

    // VoidPayment case: update customer invoice status details
    updateCustInvPayStatusAfterVoidPayment: (req, t) => {
        const { sequelize } = req.app.locals.models;
        return sequelize.query('CALL Sproc_UpdateCustInvoiceDetForVoidPayment(:pVoidCustPaymentMstID,:pRefPaymentModeOfInvPayment,:pUserID,:pUserRoleID)', {
            replacements: {
                pVoidCustPaymentMstID: req.body.id,
                pRefPaymentModeOfInvPayment: req.body.refPaymentModeOfInvPayment,
                pUserID: req.user.id,
                pUserRoleID: COMMON.getRequestUserLoginRoleID(req)
            },
            transaction: t
        }).then(() => ({
            status: STATE.SUCCESS
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
            };
        });
    },

    voidAndReIssueSupplierInvoicePayment: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var messageContent = {};
        var promoseSerialNumber = [];
        var systemIDTypeForPayment = null;

        if (req.body && req.body.refPaymentModeOfInvPayment && req.body.refVoidPaymentId) {
            COMMON.setModelUpdatedByFieldValue(req);
            return sequelize.transaction().then((t) => {
                if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable && (!req.body.paymentAmount || req.body.paymentAmount === 0)) {
                    promoseSerialNumber.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.AutoGeneratedPaymentNumber, t));
                }
                return Promise.all(promoseSerialNumber).then((responsSerialNumber) => {
                    var resObjSerialNumber = _.find(responsSerialNumber, resp => resp.status === STATE.FAILED);
                    if (resObjSerialNumber) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: resObjSerialNumber.message || messageContent,
                            err: resObjSerialNumber.err || null,
                            data: null
                        });
                    } else {
                        const promisesCZPMTPN = [];
                        if (req.body.isCustomerZeroPayment) {
                            // if customer zero payment then its auto generate payment number
                            promisesCZPMTPN.push(UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.IDENTITY.CustomerPaymentNumberForZeroValuePayment, t));
                        }
                        return Promise.all(promisesCZPMTPN).then((respOfPNForZPMT) => {
                            if (req.body.isCustomerZeroPayment) {
                                if (!respOfPNForZPMT || respOfPNForZPMT.length === 0 || !respOfPNForZPMT[0].systemId) {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: null,
                                        data: null
                                    });
                                }
                                req.body.paymentNumber = respOfPNForZPMT[0].systemId;
                            }

                            if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                systemIDTypeForPayment = DATA_CONSTANT.PACKING_SLIP.Supplier_Payment_System_Id;
                                if (!req.body.paymentAmount || req.body.paymentAmount === 0) {
                                    const serialNumberGenerated = _.find(responsSerialNumber, resp => resp.systemId);
                                    req.body.paymentNumber = serialNumberGenerated.systemId;
                                }
                            } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable) {
                                systemIDTypeForPayment = DATA_CONSTANT.IDENTITY.CustomerPaymentSystemID;
                            }
                            return UTILITY_CONTROLLER.getSystemIdPromise(req, res, systemIDTypeForPayment, t)
                                .then((systemIdPromise) => {
                                    if (!systemIdPromise || systemIdPromise.status !== STATE.SUCCESS) {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        });
                                    }

                                    req.body.systemId = systemIdPromise.systemId;
                                    return sequelize.query('CALL Sproc_InvoicePaymentVoidAndReIssue(:pSystemId,:pRefVoidPaymentId,:pAccountReference,:pPaymentType,:pPaymentNumber,:pBankAccountMasID,:pBankAccountNo,:pBankName,:pPaymentDate,:pRemark,:pPayToName,:pPayToAddressID, :pPayToAddress, :pPayToContactPersonID, :pPayToContactPerson, :pBillToAddressID, :pBillToAddress, :pBillToContactPersonID, :pBillToContactPerson,:pVoidPaymentReason,:pRefPaymentModeOfInvPayment,:pMfgcodeID,:pisConfmTakenForDuplicateCheckNo,:pDepositBatchNumber,:pUserID,:pRoleID)', {
                                        replacements: {
                                            pSystemId: req.body.systemId,
                                            pRefVoidPaymentId: req.body.refVoidPaymentId,
                                            pAccountReference: req.body.accountReference,
                                            pPaymentType: req.body.paymentType,
                                            pPaymentNumber: req.body.paymentNumber || null,
                                            pBankAccountMasID: req.body.bankAccountMasID,
                                            pBankAccountNo: req.body.bankAccountNo,
                                            pBankName: req.body.bankName,
                                            pPaymentDate: req.body.paymentDate,
                                            pRemark: req.body.remark || null,
                                            pPayToName: req.body.payToName || null,
                                            pPayToAddressID: req.body.payToAddressID || null,
                                            pPayToAddress: req.body.payToAddress || null,
                                            pPayToContactPersonID: req.body.payToContactPersonID || null,
                                            pPayToContactPerson: req.body.payToContactPerson || null,
                                            pBillToAddressID: req.body.billToAddressID || null,
                                            pBillToAddress: req.body.billToAddress || null,
                                            pBillToContactPersonID: req.body.billToContactPersonID || null,
                                            pBillToContactPerson: req.body.billToContactPerson || null,
                                            pVoidPaymentReason: req.body.voidPaymentReason,
                                            pRefPaymentModeOfInvPayment: req.body.refPaymentModeOfInvPayment,
                                            pMfgcodeID: req.body.mfgcodeID || null,
                                            pisConfmTakenForDuplicateCheckNo: req.body.isConfmTakenForDuplicateCheckNo || false,
                                            pDepositBatchNumber: req.body.depositBatchNumber || null,
                                            pUserID: req.user.id,
                                            pRoleID: COMMON.getRequestUserLoginRoleID(req)
                                        },
                                        transaction: t
                                    }).then((response) => {
                                        if (response[0] && response[0].message) {
                                            // error in void and reissue new
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            messageContent = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                                            let respData = null;
                                            if (response[0].message === 'DUPLICATE_CHECKNO') {
                                                if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                                    messageContent = MESSAGE_CONSTANT.RECEIVING.DUPLICATE_CHECK_NO;
                                                } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable) {
                                                    messageContent = null;
                                                    respData = {
                                                        isDuplicateCheckPaymentNo: true
                                                    };
                                                }
                                            } else if (response[0].message === 'ALREADY_VOIDED') {
                                                messageContent = null;
                                                respData = {
                                                    isPaymentAlreadyVoided: true
                                                };
                                            } else if (response[0].message === 'ALREADY_LOCKED') {
                                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
                                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.toBeVoidPaymentNumber);
                                            } else if (response[0].message === 'ALREADY_PMT_REFUNDED') {
                                                messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.VOID_TRANS_NOT_ALLOWED_AS_AMOUNT_REFUNDED);
                                                messageContent.message = COMMON.stringFormat(messageContent.message, req.body.toBeVoidPaymentNumber, 'void', 'customer payment');
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: messageContent,
                                                err: null,
                                                data: respData
                                            });
                                        } else {
                                            // success of void and reissue new sp call
                                            const copyOtherDetPromises = [];
                                            if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable && req.body.isCopyDocumentForReissuePayment === true) {
                                                const requiredDet = {
                                                    reissuedPaymentMstID: response[0].refPayementid
                                                };
                                                copyOtherDetPromises.push(module.exports.copyVoidedCustPaymentDoc(req, t, requiredDet));
                                            }
                                            if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                                //req.body['id'] = req.body.refVoidPaymentId;
                                                copyOtherDetPromises.push(module.exports.updateSuppPackingSlipMatRevStatusAfterVoidPayment(req, t));
                                            }

                                            return Promise.all(copyOtherDetPromises).then((respOfCopyOtherDetPromises) => {
                                                var resObjCopyDet = _.find(respOfCopyOtherDetPromises, resp => resp.status === STATE.FAILED);
                                                if (resObjCopyDet) {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                        messageContent: resObjCopyDet.message || messageContent,
                                                        err: resObjCopyDet.err || null,
                                                        data: null
                                                    });
                                                }

                                                let msgContentForVoidReissue = null;
                                                if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                                    msgContentForVoidReissue = MESSAGE_CONSTANT.RECEIVING.SUPPLIER_PAYMENT_RE_ISSUED;
                                                } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable) {
                                                    msgContentForVoidReissue = MESSAGE_CONSTANT.MFG.CUST_PAYMENT_VOID_REISSUE_SUCCESS;
                                                    msgContentForVoidReissue.message = COMMON.stringFormat(msgContentForVoidReissue.message, 're-received');
                                                }

                                                return t.commit().then(() => {
                                                    if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable) {
                                                        req.params.refPaymentMode = req.body.refPaymentModeOfInvPayment;
                                                        // void record - enterprise entry
                                                        req.epSearchData = {
                                                            InvPaymentMstID: req.body.refVoidPaymentId
                                                        };
                                                        EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);
                                                        // reissue record - enterprise entry
                                                        req.epSearchData = {
                                                            InvPaymentMstID: response[0].refPayementid
                                                        };
                                                        req.params['refPaymentMode'] = req.body.refPaymentModeOfInvPayment;
                                                        EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);
                                                    } else if (req.body.refPaymentModeOfInvPayment === DATA_CONSTANT.RefPaymentModeForInvoicePayment.Receivable) {
                                                        // void record - enterprise entry
                                                        req.body.epSearchData = {};
                                                        req.body.epSearchData = {
                                                            InvPaymentMstID: req.body.refVoidPaymentId
                                                        };
                                                        req.params['refPaymentMode'] = req.body.refPaymentModeOfInvPayment;
                                                        EnterpriseSearchController.manageCustomerPaymentInElastic(req);
                                                        // reissue record - enterprise entry
                                                        req.body.epSearchData = {
                                                            InvPaymentMstID: response[0].refPayementid
                                                        };
                                                        EnterpriseSearchController.manageCustomerPaymentInElastic(req);
                                                    }
                                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response[0], msgContentForVoidReissue);
                                                });
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                        }).catch((err) => {
                            console.trace();
                            console.error(err);
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }
                }).catch((err) => {
                    if (!t.finished) {
                        t.rollback();
                    }
                    console.trace();
                    console.error(err);

                    messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: messageContent,
                        err: err,
                        data: null
                    });
                });
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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

    copyVoidedCustPaymentDoc: (req, t, requiredDet) => {
        const { GenericFiles, sequelize } = req.app.locals.models;

        return GenericFiles.findAll({
            where: {
                gencFileOwnerType: req.body.gencFileOwnerTypeForCustPayment,
                refTransID: req.body.refVoidPaymentId,
                entityID: null,
                isRecycle: false
            },
            transaction: t
        }).then((gencFilesOfCustPay) => {
            if (gencFilesOfCustPay && gencFilesOfCustPay.length > 0) {
                const gencFileDBListOfVoidCustPay = gencFilesOfCustPay;
                return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
                    replacements: {
                        pGencFileOwnerType: req.body.gencFileOwnerTypeForCustPayment,
                        pRefTransID: req.body.refVoidPaymentId,
                        pIsReturnDetail: true
                    },
                    transaction: t,
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    let folders = [''];
                    let genFilePath = null;
                    const gencFileUploadPathConst = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}`;
                    const documentCreatedDateInfo = _.first(_.values(response[0]));
                    if (documentCreatedDateInfo && documentCreatedDateInfo.isBasedOnCreatedDate === 1) {
                        genFilePath = `${gencFileUploadPathConst}/`;
                        folders = documentCreatedDateInfo.newDocumentPath.split('/');
                    }

                    _.each(folders, (folder) => {
                        genFilePath = `${genFilePath}${folder}/`;
                        if (!fs.existsSync(genFilePath)) {
                            fs.mkdirSync(genFilePath);
                        }
                    });

                    const gencFileCopyListOfReissueCustPay = [];
                    _.each(gencFileDBListOfVoidCustPay, (itemData) => {
                        const objReissue = itemData.dataValues;
                        const docpath = `.${itemData.genFilePath}`;
                        const newFileName = `${uuidv1()}.${itemData.gencFileExtension}`;
                        const newDocPath = `${gencFileUploadPathConst}/${documentCreatedDateInfo.newDocumentPath}/${newFileName}`;
                        const actualGenFilePath = newDocPath.startsWith('.') ? newDocPath.replace('.', '') : null;
                        if (fs.existsSync(docpath)) {
                            fsExtra.copySync(docpath, newDocPath);
                        }

                        objReissue.refCopyTransID = itemData.refTransID; // customer payment master id - voidpaymentid
                        objReissue.refCopyGencFileOwnerType = itemData.gencFileOwnerType;
                        objReissue.gencFileName = newFileName;
                        objReissue.refTransID = requiredDet.reissuedPaymentMstID;
                        objReissue.genFilePath = actualGenFilePath;
                        objReissue.copyFromGencFileID = itemData.gencFileID; // master gencFileID from which we copy new
                        gencFileCopyListOfReissueCustPay.push(objReissue);
                    });
                    COMMON.setModelCreatedArrayFieldValue(req.user, gencFileCopyListOfReissueCustPay);
                    return GenericFiles.bulkCreate(gencFileCopyListOfReissueCustPay, {
                        fields: ['gencFileName', 'gencOriginalName', 'gencFileDescription', 'gencFileExtension', 'gencFileType', 'refTransID', 'entityID', 'gencFileOwnerType', 'isActive', 'genFilePath', 'createdBy', 'updatedBy', 'createByRoleId', 'updateByRoleId', 'fileSize', 'refCopyTransID', 'refCopyGencFileOwnerType'],
                        transaction: t
                    }).then(() => ({
                        status: STATE.SUCCESS
                    })).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                        };
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return {
                        status: STATE.FAILED,
                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
                    };
                });
            } else {
                return {
                    status: STATE.SUCCESS
                };
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG
            };
        });
    },

    // Get detail of packing slip master
    // GET : /api/v1/packing_slip/scanDocument/:id
    // @return list of packing slip
    // eslint-disable-next-line consistent-return
    scanDocument: (req, res) => {
        if (req.body.refTransID) {
            const options = {
                method: 'POST',
                hostname: config.SCAN.HOST,
                port: config.SCAN.PORT,
                path: '/api/scan/StartScan',
                headers: {
                    'content-type': config.SCAN.CONTENT_TYPE,
                    'cache-control': config.SCAN.CACHE_CONTROL
                }
            };
            const request = http.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    let responseData;
                    if (data) {
                        responseData = JSON.parse(data);
                    }
                    if (response.statusCode !== 200) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, {
                            Error: responseData
                        }, null);
                    }
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseData, null);
                });
            });
            request.on('error', (err) => {
                if (err.code === ECONNREFUSED || err.code === ETIMEDOUT || err.code === ENOTFOUND) {
                    // let messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.CONNECTION_FAILED); //message not generated but listed in excel list
                    // return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    //     messageContent: messageContent,
                    //     err: null,
                    //     data: null
                    // });
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, {
                        Error: DATA_CONSTANT.SCAN_DOCUMENT_API.CONNECTION_FAILED,
                        isRetry: true
                    });
                }
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, err.message);
            });
            request.write(JSON.stringify(req.body));
            request.end();
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    checkRefundedAmountWithMarkedForRefund: (req, res, t) => {
        const {
            PackingslipInvoicePayment,
            PackingslipInvoicePaymentDet
        } = req.app.locals.models;
        if (req.body) {
            return PackingslipInvoicePaymentDet.findAll({
                where: {
                    refPackingslipInvoiceID: req.body.id
                },
                include: [{
                    model: PackingslipInvoicePayment,
                    as: 'packingslip_invoice_payment',
                    attributes: ['id', 'refPaymentMode'],
                    required: true,
                    where: {
                        refPaymentMode: DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund,
                        isPaymentVoided: false
                    }
                }],
                transaction: t
            }).then((isexist) => {
                if (isexist) {
                    const totalRefundedAmount = _.sumBy(isexist, 'paymentAmount');
                    if (totalRefundedAmount > req.body.markedForRefundAmt) {
                        const messageContent = Object.assign({}, MESSAGE_CONSTANT.MFG.AGREED_REFUND_NOT_LESS_THAN_TOT_REFUNDED_AMT);
                        messageContent.message = COMMON.stringFormat(messageContent.message, totalRefundedAmount, req.body.markedForRefundAmt || 0);
                        return {
                            status: STATE.FAILED,
                            message: messageContent
                        };
                    } else {
                        return {
                            status: STATE.SUCCESS
                        };
                    }
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // Save Invoice Data
    // POST : /api/v1/packing_slip/saveInvoiceData
    saveInvoiceData: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.id
                },
                attributes: ['id', 'invoiceNumber', 'creditMemoNumber', 'debitMemoNumber', 'receiptType', 'paymentTermsID', 'invoiceRequireManagementApproval', 'invoiceApprovalStatus', 'status', 'billToAddressID', 'billToContactPersonID']
            }).then((oldTransactionDet) => {
                if (!oldTransactionDet) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(invoice),
                        err: null,
                        data: null
                    });
                }
                const validationPromise = [];
                return sequelize.transaction().then((t) => {
                    validationPromise.push(module.exports.checkUniquePackingSlipNumberPromise(req, res, false, t));
                    if (req.body.memoType === 'D' && req.body.refSupplierCreditMemoNumber) {
                        validationPromise.push(module.exports.checkUniquePackingSlipNumberPromise(req, res, true, t));
                    }
                    if (req.body.memoType === 'C') {
                        validationPromise.push(module.exports.checkRefundedAmountWithMarkedForRefund(req, res, t));
                    }

                    return Promise.all(validationPromise).then((response) => {
                        var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                        if (resObj) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            if (resObj.message) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: resObj.message,
                                    err: null,
                                    data: null
                                });
                            } else {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: null,
                                    data: null
                                });
                            }
                        } else {
                            var packingInputFieldsForUpdate = Object.assign([], packingInputFields);
                            req.body.invoiceRequireManagementApproval = req.body.invoiceRequireManagementApproval !== true ? false : true;
                            req.body.invoiceApprovalStatus = oldTransactionDet.invoiceApprovalStatus === DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.APPROVED ? oldTransactionDet.invoiceApprovalStatus : req.body.invoiceRequireManagementApproval ? DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.PENDING : DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.NA;
                            req.body.updatedBy = req.user.id;
                            req.body.updatedAt = COMMON.getCurrentUTC();
                            req.body.updateByRoleId = req.user.defaultLoginRoleID;

                            if (oldTransactionDet.status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Paid) {
                                packingInputFieldsForUpdate = ['internalRemark', 'remark', 'updatedBy', 'updatedAt', 'updateByRoleId'];
                            }
                            if (oldTransactionDet.billToAddressID === req.body.billToAddressID) {
                                COMMON.removeElementFromArray(packingInputFieldsForUpdate, 'billToAddress');
                            }
                            if (oldTransactionDet.billToContactPersonID === req.body.billToContactPersonID) {
                                COMMON.removeElementFromArray(packingInputFieldsForUpdate, 'billToConactPerson');
                            }

                            return PackingSlipMaterialReceive.update(req.body, {
                                where: {
                                    id: req.body.id
                                },
                                fields: packingInputFieldsForUpdate,
                                paranoid: false,
                                transaction: t
                            }).then((invoiceRrsponse) => {
                                if (req.body.invoiceNumber === oldTransactionDet.invoiceNumber && req.body.creditMemoNumber === oldTransactionDet.creditMemoNumber && req.body.debitMemoNumber === oldTransactionDet.debitMemoNumber) {
                                    let responseModule = null;
                                    if (req.body.memoType === 'D') {
                                        responseModule = debitMemo;
                                    } else if (req.body.memoType === 'C') {
                                        responseModule = creditMemo;
                                    } else {
                                        responseModule = invoice;
                                    }
                                    if (oldTransactionDet.status === DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Paid) {
                                        t.commit().then(() => {
                                            req.params['id'] = req.body.id;
                                            req.params['receiptType'] = req.body.memoType;
                                            EnterpriseSearchController.managePackingSlipInElastic(req);
                                        });

                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoiceRrsponse, MESSAGE_CONSTANT.UPDATED(responseModule));
                                    } else {
                                        return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.id, req.body.id, 'Invoice', t).then((respStatus) => {
                                            if (respStatus && respStatus.status === STATE.SUCCESS) {
                                                t.commit().then(() => {
                                                    req.params['id'] = req.body.id;
                                                    req.params['receiptType'] = req.body.memoType;
                                                    EnterpriseSearchController.managePackingSlipInElastic(req);
                                                });
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoiceRrsponse, MESSAGE_CONSTANT.UPDATED(responseModule));
                                            } else {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                                    err: (respStatus && respStatus.err) || null,
                                                    data: null
                                                });
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    }
                                } else {
                                    return GenericFilesController.manageDocumentPath(req, res, {
                                        gencFileOwnerType: req.body.gencFileOwnerType,
                                        refTransID: req.body.id
                                    }, t).then(() =>
                                        module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.id, req.body.id, 'Invoice', t).then((respStatus) => {
                                            if (respStatus && respStatus.status === STATE.SUCCESS) {
                                                t.commit().then(() => {
                                                    req.params['id'] = req.body.id;
                                                    req.params['receiptType'] = req.body.memoType;
                                                    EnterpriseSearchController.managePackingSlipInElastic(req);
                                                });
                                                let responseModule = null;
                                                if (req.body.memoType === 'D') {
                                                    responseModule = debitMemo;
                                                } else if (req.body.memoType === 'C') {
                                                    responseModule = creditMemo;
                                                } else {
                                                    responseModule = invoice;
                                                }
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, invoiceRrsponse, MESSAGE_CONSTANT.UPDATED(responseModule));
                                            } else {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                    messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                                    err: (respStatus && respStatus.err) || null,
                                                    data: null
                                                });
                                            }
                                        }).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        })).catch((err) => {
                                            console.trace();
                                            console.error(err);
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
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

    // Get detail of packing slip by purchase order number
    // POST : /api/v1/packing_slip/getPackingSlipDetByPO
    // @return detail of packing slip by purchase order number
    getPackingSlipDetByPO: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PurchaseOrderMst,
            Sequelize
        } = req.app.locals.models;
        if (req.body.poNumber) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    poNumber: req.body.poNumber,
                    receiptType: DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.PACKING_SLIP
                },
                attributes: ['supplierSONumber'],
                group: ['poNumber', 'mfgCodeID', 'supplierSONumber']
            }).then((result) => {
                var psPODetail = null;
                if (result) {
                    psPODetail = {
                        supplierSONumber: result.supplierSONumber
                    };
                }

                return PackingSlipMaterialReceive.findOne({
                    where: {
                        poNumber: req.body.poNumber,
                        receiptType: DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.PACKING_SLIP
                    },
                    attributes: ['poNumber', 'mfgCodeID', 'poDate', 'soDate', [Sequelize.fn('COUNT', Sequelize.col('poNumber')), 'packingSlipCount'],
                        ['GROUP_CONCAT(id)', 'packingSlipIDs']
                    ],
                    group: ['poNumber', 'mfgCodeID', 'supplierSONumber', 'poDate', 'soDate']
                }).then((response) => {
                    if (response) {
                        psPODetail = {
                            ...psPODetail,
                            poNumber: response.poNumber,
                            mfgCodeID: response.mfgCodeID,
                            poDate: response.poDate,
                            soDate: response.soDate,
                            packingSlipCount: response.packingSlipCount,
                            packingSlipIDs: response.packingSlipIDs
                        };
                    }

                    return PurchaseOrderMst.findOne({
                        where: {
                            poNumber: req.body.poNumber
                        },
                        attributes: ['id', 'poNumber', 'poDate', 'soNumber', 'soDate', 'supplierID', 'status', 'poComment', 'shippingComment', 'poWorkingStatus', 'isCustConsigned', 'customerID', 'isNonUMIDStock']
                    }).then((resPO) => {
                        if (resPO) {
                            psPODetail = {
                                ...psPODetail,
                                posupplierSONumber: resPO.soNumber,
                                po_poDate: resPO.poDate,
                                po_soDate: resPO.soDate,
                                pomfgCodeID: resPO.supplierID,
                                poID: resPO.id,
                                postatus: resPO.status,
                                poComment: resPO.poComment,
                                shippingComment: resPO.shippingComment,
                                poWorkingStatus: resPO.poWorkingStatus,
                                isCustConsigned: resPO.isCustConsigned,
                                customerID: resPO.customerID,
                                isNonUMIDStock: resPO.isNonUMIDStock
                            };
                        }
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, psPODetail, null);
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

    // Check Unique invocie# CM# DM#
    // POST : /api/v1/packing_slip/checkUniquePackingSlipNumber
    checkUniquePackingSlipNumber: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        return sequelize.transaction().then((t) => {
            const promises = [];
            promises.push(module.exports.checkUniquePackingSlipNumberPromise(req, res, false, t));
            return Promise.all(promises).then((response) => {
                var resObj = _.find(response, resp => resp.status === STATE.FAILED);
                // rollback done due to only checking validation and calling method from UI
                if (!t.finished) {
                    t.rollback();
                }
                if (resObj) {
                    if (resObj.data) {
                        // return success because checking message on UI side
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resObj.data, null);
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: resObj.message || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    }
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
                }
            }).catch((err) => {
                if (!t.finished) {
                    t.rollback();
                }
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
    },

    // to be call from API promise only
    checkUniquePackingSlipNumberPromise: (req, res, isRefCMCheck, t) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        let memoNumber = '';
        if (req.body) {
            const whereClause = {
                id: {
                    [Op.ne]: req.body.id
                },
                mfgCodeID: req.body.mfgCodeId || req.body.mfgCodeID
            };

            if ((req.body.receiptType || req.body.memoType) === 'I') {
                memoNumber = req.body.name || req.body.invoiceNumber;
                whereClause.invoiceNumber = memoNumber;
                whereClause.receiptType = 'I';
            } else if ((req.body.receiptType || req.body.memoType) === 'C' || isRefCMCheck === true) {
                if (isRefCMCheck === true) {
                    memoNumber = req.body.refSupplierCreditMemoNumber;
                } else {
                    memoNumber = req.body.name || req.body.creditMemoNumber;
                }
                whereClause[Op.or] = [{
                    creditMemoNumber: memoNumber,
                    receiptType: 'C'
                },
                {
                    refSupplierCreditMemoNumber: memoNumber,
                    receiptType: 'D'
                }];
            } else if ((req.body.receiptType || req.body.memoType) === 'D') {
                memoNumber = req.body.name || req.body.debitMemoNumber;
                whereClause.debitMemoNumber = memoNumber;
                whereClause.receiptType = 'D';
            } else {
                memoNumber = req.body.name;
                whereClause.packingSlipNumber = memoNumber;
                whereClause.receiptType = (req.body.receiptType || req.body.memoType);
            }

            return PackingSlipMaterialReceive.findOne({
                where: whereClause,
                transaction: t
            }).then((resp) => {
                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PACKING_SLIP_UNIQUE);
                messageContent.message = COMMON.stringFormat(messageContent.message, 'Credit Memo#', memoNumber, req.body.mfgFullName, 'Credit Memo#');
                return {
                    status: resp ? STATE.FAILED : STATE.SUCCESS,
                    message: messageContent,
                    data: resp
                };
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER
            };
        }
    },

    // Retrive all packing slip
    // GET : /api/v1/packing_slip/getAllPackingInvoiceByReceiptTypeList
    // @return list of packing slip
    getAllPackingInvoiceByReceiptTypeList: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;
        PackingSlipMaterialReceive.findAll({
            where: {
                refParentCreditDebitInvoiceno: req.params.id,
                receiptType: req.params.type,
                status: {
                    [Op.ne]: 'P'
                }
            },
            attributes: ['id', 'poNumber', 'invoiceNumber', 'invoiceDate', 'creditMemoNumber', 'creditMemoDate', 'debitMemoNumber', 'debitMemoDate'],
            include: [{
                model: PackingSlipMaterialReceiveDet,
                as: 'packingSlipMaterialReceiveDet',
                attributes: ['id', 'refPackingSlipMaterialRecID', 'packingSlipSerialNumber'],
                required: false
            }],
            order: [
                ['id', 'DESC']
            ]
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get count of document uploaded for packing slip
    // GET : /api/v1/packing_slip/getPackingSlipDocumentCount/:id
    // @return count of document uploaded for packing slip
    getPackingSlipDocumentCount: (req, res) => {
        const {
            GenericFiles
        } = req.app.locals.models;

        if (req.body.id) {
            return GenericFiles.count({
                where: {
                    gencFileOwnerType: req.body.type,
                    refTransID: req.body.id,
                    isRecycle: false
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // Get status and created UMID count for packingslip material
    // POST : /api/v1/packing_slip/getPackingSlipMaterialDetailStatus/:id
    // @return status and created UMID count for packingslip material
    getPackingSlipMaterialDetailStatus: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.objIDs) {
            return sequelize.query('CALL Sproc_getPackingSlipMaterialDetailStatus (:pPackingSlipMaterialIDs, :pPackingSlipID)', {
                replacements: {
                    pPackingSlipMaterialIDs: req.body.objIDs.toString(),
                    pPackingSlipID: req.body.packingSlipID
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // Discard scan document of packing slip
    // DELETE : /api/v1/packing_slip/discardScanDocument/:fileName
    // eslint-disable-next-line consistent-return
    discardScanDocument: (req, res) => {
        if (req.params.fileName) {
            const options = {
                method: 'DELETE',
                hostname: config.SCAN.HOST,
                port: config.SCAN.PORT,
                path: `/api/scan/DiscardScanDocument?FileName=${req.params.fileName}`,
                headers: {
                    'content-type': config.SCAN.CONTENT_TYPE,
                    'cache-control': config.SCAN.CACHE_CONTROL
                }
            };
            const request = http.request(options, (response) => {
                var chunks = [];
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                response.on('end', () => {
                    var body = Buffer.concat(chunks);
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, body.toString(), null);
                });
            });
            request.on('error', err =>
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, err.message)
            );
            request.end();
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // eslint-disable-next-line consistent-return
    getScanDocument: (req, res) => {
        if (req.body.FileName) {
            const options = {
                method: 'GET',
                hostname: config.SCAN.HOST,
                port: config.SCAN.PORT,
                path: `/api/scan/GetScanDocument?FileName=${req.body.FileName}`,
                headers: {
                    'content-type': config.SCAN.CONTENT_TYPE,
                    'cache-control': config.SCAN.CACHE_CONTROL
                }
            };
            const request = http.request(options, (response) => {
                var chunks = [];
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                response.on('end', () => {
                    var body = Buffer.concat(chunks);
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=${req.body.FileName}`,
                        'Content-Length': body.length
                    });
                    res.end(body);
                });
            });
            request.on('error', err =>
                resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, err.message)
            );
            request.end();
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // check Bin Contain Single PackingSlip
    // POST : /api/v1/packing_slip/checkBinContainSinglePackingSlip
    // @return list of contain packing slip
    checkBinContainSinglePackingSlip: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            PackingSlipMaterialReceive,
            MfgCodeMst,
            Component,
            BinMst
        } = req.app.locals.models;
        if (req.body) {
            return PackingSlipMaterialReceiveDet.findAll({
                where: {
                    binID: req.body.binID,
                    partID: req.body.partID,
                    umidCreated: 0,
                    refPackingSlipMaterialRecID: {
                        [Op.ne]: req.body.packingSlipId
                    }
                },
                attributes: ['id', 'refPackingSlipMaterialRecID', 'binID', 'partID'],
                include: [{
                    model: PackingSlipMaterialReceive,
                    as: 'packing_slip_material_receive',
                    attributes: ['id', 'mfgCodeID', 'packingSlipNumber'],
                    required: false,
                    include: [{
                        model: MfgCodeMst,
                        as: 'mfgCodemst',
                        attributes: ['id', 'mfgCode', 'mfgName'],
                        required: false
                    }]
                },
                {
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'mfgPN', 'PIDCode'],
                    required: false
                },
                {
                    model: BinMst,
                    as: 'binmst',
                    attributes: ['id', 'Name'],
                    required: false
                }
                ]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // Retrive list of supplier invoice
    // GET : /api/v1/packing_slip/getSupplierInvoiceList
    // @return list of supplier invoice
    getSupplierInvoiceList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        // if (req && req.body && req.body.whereStatus && req.body.whereStatus.length === 1) {
        //     req.body.whereStatus = req.body.whereStatus[0];
        // }

        const filter = COMMON.UiGridFilterSearch(req);
        if (req.body.chequeNumber) {
            filter.where.chequeNumber = req.body.chequeNumber;
        }
        const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
        sequelize.query('CALL Sproc_RetriveSupplierInvoiceList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pReceiptType,:pMfgCodeIds,:pPaymentMethodTypeIds,:pDueDate,:pAdditionalDays,:pTermsAndAboveDays,:pInvoiceNumber,:pIsExactSearch,:pMfrPnId,:pInvoiceIds,:pExactPaymentNumberSearch,:pPaymentNumber,:pPaymentTermsIds,:pInvPaymentTermsIds,:pInvoiceFromDate,:pInvoiceToDate,:pMarkedForRefundStatus,:pInvoiceComments,:pLockStatusFilter,:pSelectedDateType,:pIsConfirmedZeroValueInvoicesOnly,:pPaidAmount,:pExactPaidAmountSearch,:pExtendedAmount,:pExactExtendedAmountSearch)', {
            replacements: {
                pPageIndex: req.body.Page || null,
                pRecordPerPage: req.body.isExport ? null : filter.limit,
                pOrderBy: filter.strOrderBy || null,
                pWhereClause: strWhere,
                pReceiptType: req.body.receiptType ? req.body.receiptType : null,
                pMfgCodeIds: req.body.mfgCodeIds || null,
                pPaymentMethodTypeIds: req.body.paymentMethodTypeIds || null,
                pDueDate: req.body.dueDate || null,
                pAdditionalDays: (req.body.additionalDays || req.body.additionalDays === 0) ? req.body.additionalDays : null,
                pTermsAndAboveDays: (req.body.termsAndAboveDays || req.body.termsAndAboveDays === 0) ? req.body.termsAndAboveDays : null,
                pInvoiceNumber: req.body.invoiceNumber || null,
                pIsExactSearch: req.body.isExactSearch || false,
                pMfrPnId: req.body.mfrPnId || null,
                pInvoiceIds: req.body.invoiceIds || null,
                pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                pPaymentNumber: req.body.paymentNumber || null,
                pPaymentTermsIds: req.body.paymentTermsIds || null,
                pInvPaymentTermsIds: req.body.invPaymentTermsIds || null,
                pInvoiceFromDate: req.body.invoiceFromDate || null,
                pInvoiceToDate: req.body.invoiceToDate || null,
                pMarkedForRefundStatus: req.body.markedForRefundStatus || null,
                pInvoiceComments: req.body.invoiceComments || null,
                pLockStatusFilter: req.body.lockStatusFilter || null,
                pSelectedDateType: req.body.selectedDateType || null,
                pIsConfirmedZeroValueInvoicesOnly: req.body.isConfirmedZeroValueInvoicesOnly || false,
                pPaidAmount: req.body.paidAmount || req.body.paidAmount === 0 ? req.body.paidAmount : null,
                pExactPaidAmountSearch: req.body.exactPaidAmountSearch || false,
                pExtendedAmount: req.body.extendedAmount || req.body.extendedAmount === 0 ? req.body.extendedAmount : null,
                pExactExtendedAmountSearch: req.body.exactExtendedAmountSearch || false
            },
            type: sequelize.QueryTypes.SELECT
        }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
            supplierInvoice: _.values(response[1]),
            Count: response[0][0].TotalRecord
        }, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Get PackingSlip Detail By PackingSlipNumber
    // POST : /api/v1/packing_slip/getPackingSlipDetailByPackingSlipNumber
    // @return detail of packing slip and packing slip line
    getPackingSlipDetailByPackingSlipNumber: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_GetPackingSlipDetailByPackingSlipNumber(:pPackingSlipNumber, :pMFGCodeId, :pCreditMemoType)', {
                replacements: {
                    pPackingSlipNumber: req.body.packingSlipNumber,
                    pMFGCodeId: req.body.mfgCodeId || null,
                    pCreditMemoType: req.body.creditMemoType || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response[0] && response[0][0] && response[0][0].IsSuccess === false) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        IsSuccess: response[0][0].IsSuccess,
                        ErrorCode: response[0][0].ErrorCode,
                        FullMFGCode: response[0][0].FullMFGCode
                    }, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        IsSuccess: response[0][0].IsSuccess,
                        ErrorCode: response[0][0].ErrorCode,
                        FullMFGCode: response[0][0].FullMFGCode,
                        PackingSlipDetail: _.values(response[1]),
                        PackingSlipLineDetail: _.values(response[2])
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get List Of Same Packing Slip Number
    // POST : /api/v1/packing_slip/getListOfSamePackingSlip
    // @return list of same packing slip number
    getListOfSamePackingSlip: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            MfgCodeMst
        } = req.app.locals.models;

        if (req.body) {
            let whereClause = {};
            if (req.body.isShowRMADetail) {
                whereClause = {
                    receiptType: 'R',
                    poNumber: req.body.poNumber
                };
            } else {
                whereClause = {
                    receiptType: 'P',
                    packingSlipNumber: req.body.packingSlipNumber
                };
            }
            return PackingSlipMaterialReceive.findAll({
                where: whereClause,
                attributes: ['id', 'poNumber', 'supplierSONumber', 'mfgCodeID', 'packingSlipNumber'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName'],
                    required: false
                }]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // Save Invoice And Invoice Detail
    // POST : /api/v1/packing_slip/saveInvoiceAndInvoiceLineDetail
    // @return Message of save record
    saveInvoiceAndInvoiceLineDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.objInvoice) {
            let systemId = null;

            if (req.body.objInvoice.memoType === 'D') {
                systemId = DATA_CONSTANT.PACKING_SLIP.Debit_Memo_System_Id;
            } else if (req.body.objInvoice.memoType === 'C') {
                systemId = DATA_CONSTANT.PACKING_SLIP.Credit_Memo_System_Id;
            } else {
                systemId = DATA_CONSTANT.PACKING_SLIP.Invoice_System_Id;
            }

            return sequelize.transaction().then(t =>
                UTILITY_CONTROLLER.getSystemIdPromise(
                    req, res, systemId, t).then((systemIdPromise) => {
                        if (systemIdPromise.status === STATE.SUCCESS) {
                            req.body.systemId = systemIdPromise.systemId;
                            return sequelize.query('CALL Sproc_SaveInvoiceAndInvoiceLineDetail (:pInvoiceDetail,:pPackingSlipId,:pSystemId,:pUserId,:pUserRoleId)', {
                                replacements: {
                                    pInvoiceDetail: req.body.objInvoice.jsonInvoiceDetail,
                                    pPackingSlipId: req.body.objInvoice.packingSlipId || null,
                                    pSystemId: req.body.systemId || null,
                                    pUserId: req.user.id,
                                    pUserRoleId: req.user.defaultLoginRoleID
                                },
                                transaction: t,
                                type: sequelize.QueryTypes.SELECT
                            }).then((response) => {
                                let responseModule = null;
                                if (req.body.objInvoice.memoType === 'D') {
                                    responseModule = debitMemo;
                                } else if (req.body.objInvoice.memoType === 'C') {
                                    responseModule = creditMemo;
                                } else {
                                    responseModule = invoice;
                                }
                                req.params['id'] = response[0][0].PackingSlipId;
                                req.params['receiptType'] = req.body.objInvoice.memoType;

                                t.commit().then(() => {
                                    EnterpriseSearchController.managePackingSlipInElastic(req);
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                        packingSlipId: response[0][0].PackingSlipId
                                    }, MESSAGE_CONSTANT.CREATED(responseModule));
                                });
                            }).catch((err) => {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: (systemIdPromise && systemIdPromise.message) || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: (systemIdPromise && systemIdPromise.err) || null,
                                data: null
                            });
                        }
                    })
            ).catch((err) => {
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

    // Re Get Invoice Detail
    // POST : /api/v1/packing_slip/reGetInvoiceDetail
    // @return Message of reGetInvoiceDetail
    reGetInvoiceDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_CheckAndReGetPackingSlipLineDetail(:pInvoiceId, :pPackingSlipId, :pAction, :pUserId, :pUserRoleId)', {
                replacements: {
                    pInvoiceId: req.body.invoiceId,
                    pPackingSlipId: req.body.packingSlipId,
                    pAction: 'ReGet',
                    pUserId: req.user.id,
                    pUserRoleId: req.user.defaultLoginRoleID
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }).then((result) => {
                if (result[0] && result[0][0] && result[0][0].IsSuccess === 1) {
                    return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.packingSlipId, req.body.invoiceId, 'Invoice', t).then((respStatus) => {
                        if (respStatus && respStatus.status === STATE.SUCCESS) {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                IsSuccess: true
                            }, null);
                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: (respStatus && respStatus.message) || MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                err: (respStatus && respStatus.err) || null,
                                data: null
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        IsSuccess: false,
                        InsertCount: result[0][0].NoOfLineInsert,
                        DeleteCount: result[0][0].NoOfLineDelete,
                        UpdateCount: result[0][0].NoOfLineUpdate
                    }, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
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

    // to be call from API promise only
    // Generate Dabit Memo Number
    // @return Message of generateDebitMemoNumber
    generateDebitMemoNumber: (req, t) => {
        const {
            sequelize
        } = req.app.locals.models;

        return sequelize.query('CALL Sproc_generateDebitMemoNumber()', {
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
            transaction: t
        }).then(debitMemoNumber => ({
            status: STATE.SUCCESS,
            type: 'DMNumber',
            debitMemoNumber: (_.values(debitMemoNumber[0])[0]).debitMemoNumber
        })).catch((err) => {
            console.trace();
            console.error(err);
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err
            };
        });
    },

    // Get Old Memo Data
    // POST : /api/v1/packing_slip/getOldDebitMemoData
    // @return List of memo
    getOldDebitMemoData: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_GetOldCreditDebitMemoData(:pPackingSlipMasId,:pPackingSlipDetId,:pReceiptType)', {
                replacements: {
                    pPackingSlipMasId: req.body.packingSlipMasId || null,
                    pPackingSlipDetId: req.body.packingSlipDetId || null,
                    pReceiptType: req.body.receiptType || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                memoList: _.values(result[0])
            }, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
            /* return PackingSlipMaterialReceiveDet.findAll({
                where: {
                    refPackingSlipDetId: parseInt(req.body.packingSlipDetId),
                    deletedAt: null
                },
                attributes: ['id', 'extendedPrice', 'refPackingSlipMaterialRecID', 'approveNote'],
                include: [{
                    model: PackingSlipMaterialReceive,
                    as: 'packing_slip_material_receive',
                    attributes: ['id', 'packingSlipNumber', 'packingSlipDate', 'creditMemoNumber', 'debitMemoNumber', 'receiptType', 'status'],
                    required: false,
                    include: [{
                        model: PackingSlipMaterialReceiveDet,
                        as: 'packingSlipMaterialReceiveDet',
                        attributes: ['id', 'refPackingSlipDetId'],
                        required: false
                    }]
                }]
            }).then(responseData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseData, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });*/
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get Memo Approve Note Details
    // POST : /api/v1/packing_slip/getMemoApproveNoteDetails
    // @return List of getMemoApproveNoteDetails
    getMemoApproveNoteDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.query('CALL Sproc_GetMemoApproveNoteDetails(:pLineId)', {
                replacements: {
                    pLineId: req.body.lineId
                },
                type: sequelize.QueryTypes.SELECT
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                approveList: _.values(result[0])
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

    // companyConfigurationCheck
    // GET : /api/v1/packing_slip/companyConfigurationCheck
    // To check for any mfr isCompany is true or not
    companyConfigurationCheck: (req, res) => {
        const {
            MfgCodeMst
        } = req.app.locals.models;
        MfgCodeMst.findOne({
            where: {
                isCompany: 1
            },
            attributes: ['mfgCode', 'id']
        }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result, null)).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // getCreditDebitMemoDetails
    // POST : /api/v1/packing_slip/getCreditDebitMemoDetails
    // @return the total credit and debit memo amount for particular invoice
    getCreditDebitMemoDetails: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.invoiceId) {
            return sequelize.query('CALL Sproc_getCreditDebitMemoDetails(:pInvoiceID)', {
                replacements: {
                    pInvoiceID: req.body.invoiceId
                }
                // ,type: sequelize.QueryTypes.SELECT
            }).then(result => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, result[0], null)).catch((err) => {
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

    // Get Old Memo Details By Id
    // POST : /api/v1/packing_slip/getOldMemoDetailsById
    // @return List of memo
    getOldMemoDetailsById: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;

        if (req.body) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: parseInt(req.body.id),
                    receiptType: req.body.type,
                    deletedAt: null
                },
                attributes: ['id', 'poNumber', 'supplierSONumber', 'packingSlipNumber', 'packingSlipDate',
                    'creditMemoNumber', 'creditMemoDate', 'debitMemoNumber', 'debitMemoDate', 'receiptType'
                ],
                include: [{
                    model: PackingSlipMaterialReceiveDet,
                    as: 'packingSlipMaterialReceiveDet',
                    attributes: ['id', 'refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'approveNote', 'extendedPrice'],
                    required: false
                }]
            }).then(responseData => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responseData, null)).catch((err) => {
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
    // getPackingSlipInvoice
    // POST : /api/v1/packing_slip/getPackingSlipInvoice
    // @return the packing slip and invoice number to auto-completes
    getPackingSlipInvoice: (req, res) => {
        const { sequelize } = req.app.locals.models;

        if (req.body.search) {
            return sequelize.query('CALL Sproc_GetPackingSlipInvoiceHeaderSearch (:pReceiptType, :pSearchQery)', {
                replacements: {
                    pReceiptType: req.body.search.receiptType || null,
                    pSearchQery: req.body.search.searchquery || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null) // _.values(response[1]),
            ).catch((err) => {
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

    // Get List of Packing Slip Material Receive Part Inspection Detail
    // POST : /api/v1/packing_slip/getPackingSlipMaterialReceivePartInspectionDetail
    // @return retrive list of Receive Part Inspection Detail
    getPackingSlipMaterialReceivePartInspectionDetail: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetrivePackingSlipMaterialReceivePartInspectionList (:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pLineId)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pLineId: req.body.lineId || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                PackingSlipMaterialReceivePartInspectionList: _.values(response[1]),
                Count: response[0][0].TotalRecord
            },
                null
            )).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(
                    res,
                    DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                    STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                }
                );
            });
        } else {
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Update List of Packing Slip Material Receive Part Inspection Detail
    // POST : /api/v1/packing_slip/updateMaterialReceivePartInstructionStatus
    // @return status of update
    updateMaterialReceivePartInstructionStatus: (req, res) => {
        const {
            PackingSlipMaterialReceivePartInspectionDet,
            PackingSlipMaterialReceiveDet,
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize.transaction().then((t) => {
                const promises = [];
                _.forEach(req.body.instructionList, (data) => {
                    COMMON.setModelUpdatedByObjectFieldValue(req.user, data);
                    promises.push(
                        PackingSlipMaterialReceivePartInspectionDet.update(data, {
                            where: {
                                id: data.id,
                                lineId: req.body.lineId
                            },
                            fields: ['inspectionStatus', 'remark', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                            transaction: t
                        })
                    );
                });

                return Promise.all(promises).then(() => {
                    const obj = {
                        // remark: req.body.lineComments ? parser.parseFromString(sequelize.fn('CONCAT', sequelize.col('remark'), ' \n ', req.body.lineComments), 'text/html') : req.body.lineComments
                        remark: req.body.lineComments ? req.body.lineComments : sequelize.col('remark'),
                        receivedStatus: req.body.receivedStatus
                    };
                    // const findReject = _.find(req.body.instructionList, data => data.inspectionStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.InspectionStatus.Reject);
                    // if (findReject) {
                    //     obj.receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Reject;
                    // } else {
                    //     const findPending = _.find(req.body.instructionList, data => data.inspectionStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.InspectionStatus.Pending);
                    //     if (findPending) {
                    //         obj.receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending;
                    //     } else {
                    //         const findAcceptWithDeviation = _.find(req.body.instructionList, data => data.inspectionStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.InspectionStatus.AcceptwithDeviation);
                    //         if (findAcceptWithDeviation) {
                    //             obj.receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.AcceptwithDeviation;
                    //         } else {
                    //             obj.receivedStatus = DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Accept;
                    //         }
                    //     }
                    // }

                    PackingSlipMaterialReceiveDet.findOne({
                        where: {
                            id: req.body.lineId
                        },
                        attributes: ['id', 'isReceivedWrongPart'],
                        include: [{
                            model: PackingSlipMaterialReceive,
                            as: 'packing_slip_material_receive',
                            attributes: ['id', 'refPurchaseOrderID'],
                            required: true
                        }],
                        transaction: t
                    }).then((packingSlipLineDet) => {
                        if (!packingSlipLineDet) {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: MESSAGE_CONSTANT.NOT_FOUND(packingSlipMaterialModuleName),
                                err: null,
                                data: null
                            });
                        } else if ((packingSlipLineDet && packingSlipLineDet.isReceivedWrongPart === true && packingSlipLineDet.packing_slip_material_receive.refPurchaseOrderID) || (req.body.isPOCanceled && (obj.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending || obj.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Accept))) {
                            t.commit();
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(materialReceivePartInstructon));
                        } else {
                            COMMON.setModelUpdatedByObjectFieldValue(req.user, obj);
                            return PackingSlipMaterialReceiveDet.update(obj, {
                                where: {
                                    id: req.body.lineId
                                },
                                fields: ['remark', 'receivedStatus', 'updatedBy', 'updateByRoleId', 'updatedAt'],
                                transaction: t
                            }).then(() => {
                                t.commit();
                                if (req.body.refPackingSlipNumberForInvoice) {
                                    RFQSocketController.reGetOnChnagesOfPackingSlipLine(req, {
                                        data: {
                                            InsertCount: 0,
                                            UpdateCount: 1,
                                            DeleteCount: 0,
                                            InvoiceId: req.body.refPackingSlipNumberForInvoice,
                                            NotifyFrom: 'UPDATE'
                                        }
                                    });
                                }
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.UPDATED(materialReceivePartInstructon));
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                if (!t.finished) {
                                    t.rollback();
                                }
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                    err: err,
                                    data: null
                                });
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
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
            return resHandler.errorRes(
                res,
                DATA_CONSTANT.API_RESPONSE_CODE.ERROR,
                STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            }
            );
        }
    },

    // Get List of Purchase Comment list
    // POST : /api/v1/packing_slip/getPurchaseCommentList
    // @return Purchase Comment list
    getPurchaseCommentList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }
            return sequelize.query('CALL Sproc_PurchaseCommentList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pPartId,:pLineId)', {
                replacements: {
                    pPageIndex: req.body.Page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPartId: req.body.partID ? req.body.partID : null,
                    pLineId: req.body.lineId ? req.body.lineId : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((response) => {
                if (response) {
                    const dataObject = {
                        comments: _.values(response[1]),
                        Count: response[0][0]['COUNT(1)']
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataObject, null);
                } else {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.NOT_FOUND(packingSlipMaterialModuleName),
                        err: null,
                        data: null
                    });
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
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
    // Get Packingslip Payment To Information
    // POST : /api/v1/packing_slip/getPackaingslipPaymentToInformation
    // @return List of Packingslip Payment To Information
    getPackaingslipPaymentToInformation: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        return sequelize.query('CALL Sproc_GetPackingSlipInvoicePaymentToInformation(:pPaymentId,:pMfgCodeId)', {
            replacements: {
                pPaymentId: req.body.paymentId || null,
                pMfgCodeId: req.body.mfgcodeID || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(invoice),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },
    // Retrive list of Supplier Invoice Payments
    // POST : /api/v1/packing_slip/retrieveSupplierInvoicePayments
    // @return list of Supplier Invoice Payments
    retrieveSupplierInvoicePayments: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveSupplierInvoicePayment (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pSupplierIDs,:pPaymentMethodIDs,:pBankAccountCodeIDs,:pTransactionModeIDs,:pExactPaymentNumberSearch,:pPaymentNumber,:pInvoiceNumber,:pExactPaymentAmountSearch,:pAmount,:pFromDate,:pToDate,:pRefPaymentMode,:pLockStatusFilter,:pSelectedDateType,:pPaymentComments,:pInvoiceAmount,:pExactInvoiceAmountSearch)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pSupplierIDs: req.body.supplierIDs || null,
                    pPaymentMethodIDs: req.body.paymentMethodIDs || null,
                    pBankAccountCodeIDs: req.body.bankAccountCodeIDs || null,
                    pTransactionModeIDs: req.body.transactionModeIDs || null,
                    pExactPaymentNumberSearch: req.body.exactPaymentNumberSearch || false,
                    pPaymentNumber: req.body.paymentNumber || null,
                    pInvoiceNumber: req.body.invoiceNumber || null,
                    pExactPaymentAmountSearch: req.body.exactPaymentAmountSearch || false,
                    pAmount: (req.body.amount || req.body.amount === 0) ? req.body.amount : null,
                    pFromDate: req.body.fromDate || null,
                    pToDate: req.body.toDate || null,
                    pRefPaymentMode: req.body.refPaymentMode || null,
                    pLockStatusFilter: req.body.lockStatusFilter || null,
                    pSelectedDateType: req.body.selectedDateType || null,
                    pPaymentComments: req.body.paymentComments || null,
                    pInvoiceAmount: (req.body.invoiceAmount || req.body.invoiceAmount === 0) ? req.body.invoiceAmount : null,
                    pExactInvoiceAmountSearch: req.body.exactInvoiceAmountSearch || false
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
    // To retrieve Supplier Invoice Payment History
    // POST : /api/v1/packing_slip/retrieveSupplierInvoicePaymentHistory
    // @return Supplier Invoice Payment History
    retrieveSupplierInvoicePaymentHistory: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            return sequelize.query('CALL Sproc_RetrieveSupplierInvoicePaymentHistory (:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause,:pPaymentID,:pRefPaymentMode)', {
                replacements: {
                    ppageIndex: req.body.Page,
                    precordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pPaymentID: req.body.paymentID,
                    pRefPaymentMode: req.body.refPaymentMode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                paymentHistory: _.values(response[1]),
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
    // To retrieve Supplier Invoice Payment Lines
    // POST : /api/v1/packing_slip/retrieveSupplierInvoicePaymentLines
    // @return Supplier Invoice Payment Lines
    retrieveSupplierInvoicePaymentLines: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.paymentID) {
            return sequelize.query('CALL Sproc_RetrieveSupplierInvoicePaymentLines (:pPaymentID)', {
                replacements: {
                    pPaymentID: req.body.paymentID
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                paymentLines: _.values(response[0])
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
    deleteSupplierInvoicePayment: (req, res) => {
        const {
            PackingslipInvoicePayment,
            PackingslipInvoicePaymentDet,
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;
        if (req.body.objIDs) {
            return PackingslipInvoicePaymentDet.findAll({
                where: {
                    refPayementid: {
                        [Op.in]: req.body.objIDs
                    }
                }
            }).then(invoicePayDet => sequelize.transaction().then((t) => {
                const invoicePaymentDetIds = _.map(invoicePayDet, 'refPackingslipInvoiceID');
                const deletePromise = [];
                let deleteObj = {
                    isDeleted: 1
                };
                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                deletePromise.push(PackingslipInvoicePayment.update(deleteObj, {
                    where: {
                        id: {
                            [Op.in]: req.body.objIDs
                        }
                    },
                    fields: packingslipInvoicePaymentInputFields,
                    transaction: t
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));

                COMMON.setModelDeletedByObjectFieldValue(req.user, deleteObj);
                deletePromise.push(PackingslipInvoicePaymentDet.update(deleteObj, {
                    where: {
                        refPayementid: {
                            [Op.in]: req.body.objIDs
                        }
                    },
                    fields: PackingslipInvoicePaymentDetInputFields,
                    transaction: t
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));

                deleteObj = {
                    refPayementid: null,
                    status: 'A'
                };
                COMMON.setModelUpdatedByObjectFieldValue(req.user, deleteObj);
                deletePromise.push(PackingSlipMaterialReceive.update(deleteObj, {
                    where: {
                        id: {
                            [Op.in]: invoicePaymentDetIds
                        }
                    },
                    fields: packingInputFields,
                    transaction: t
                }).then(() => STATE.SUCCESS).catch((err) => {
                    console.trace();
                    console.error(err);
                    return STATE.FAILED;
                }));

                return Promise.all(deletePromise).then((response) => {
                    const resultSet = _.filter(response, result => result === STATE.FAILED);
                    if (resultSet && resultSet.length > 0) {
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: null,
                            data: null
                        });
                    } else {
                        return t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, MESSAGE_CONSTANT.DELETED(invoice)));
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    if (!t.finished) {
                        t.rollback();
                    }
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

    // Get List of paid payment or check number for Autocomplete list
    // POST : /api/v1/packing_slip/getAllPaidPaymentOrCheckNumberBySearch
    // @return List of paid payment or check number
    getAllPaidPaymentOrCheckNumberBySearch: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        sequelize.query('CALL Sproc_GetPaymentOrCheckNumberBySearch(:pSearch,:pId)', {
            replacements: {
                pSearch: req.body.listObj.query || null,
                pId: req.body.listObj.id || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    data: _.values(response[0])
                }, null);
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                    messageContent: MESSAGE_CONSTANT.NOT_FOUND(invoicePaymentModuleName),
                    err: null,
                    data: null
                });
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                err: err,
                data: null
            });
        });
    },

    // Retrive list of supplier RMA
    // POST : /api/v1/packing_slip/getSupplierRMAList
    // @return list of supplier RMA
    getSupplierRMAList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req && req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_RetriveSupplierRMAList(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pMfgCodeIds,:pAdvanceSearchNumbers,:pSearchType,:pMfrPnId,:pRMAFromDate,:pRMAToDate,:pPostingStatus,:pLockStatusFilter,:pRMAComments)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: req.body.isExport ? null : filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pMfgCodeIds: req.body.mfgCodeIds || null,
                    pAdvanceSearchNumbers: req.body.advanceSearchNumbers || null,
                    pSearchType: req.body.searchType || null,
                    pMfrPnId: req.body.mfrPnId || null,
                    pRMAFromDate: req.body.rmaFromDate || null,
                    pRMAToDate: req.body.rmaToDate || null,
                    pPostingStatus: req.body.postingStatus || null,
                    pLockStatusFilter: req.body.lockStatusFilter || null,
                    pRMAComments: req.body.rmaComments || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res,
                DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                STATE.SUCCESS, {
                supplierRMA: _.values(response[1]),
                Count: response[0][0].TotalRecord
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

    // Check Unique RMA Number Supplier Wise
    // GET : /api/v1/packing_slip/checkUniqueRMANumber
    checkUniqueRMANumber: (req, res) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        if (req.body) {
            return PackingSlipMaterialReceive.findAll({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    mfgCodeID: req.body.mfgCodeId,
                    poNumber: req.body.poNumber,
                    receiptType: {
                        [Op.in]: req.body.packingSlipReceiptType
                    }
                },
                order: [['id', 'DESC']] /** added to get last created RMA#, used on Create RMA popup*/
            }).then((resp) => {
                if (resp) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body.requiredAllRows ? resp : resp[0], null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Add/Update supplier RMA detail
    // POST : /api/v1/packing_slip/saveRMADetail
    saveRMADetail: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;

        var packingInputFieldsForUpdate = Object.assign([], packingInputFields);

        if (!req.body.rmaShippingAddressId || !req.body.rmaShippingContactPersonID) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: null,
                err: null,
                data: {
                    errorMessage: 'ADDRESS_DATA_MISSING'
                }
            });
        } else if (req.body.rmaMarkForAddressId && !req.body.rmaMarkForContactPersonID) {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: null,
                err: null,
                data: {
                    errorMessage: 'ADDRESS_DATA_MISSING_FOR_MARK'
                }
            });
        } else if (req.body.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.id
                },
                attributes: ['id', 'mfgCodeID', 'poNumber', 'packingSlipNumber', 'refParentCreditDebitInvoiceno', 'refPackingSlipNumberForInvoice', 'packingSlipModeStatus', 'packingSlipDate',
                    'rmaShippingAddressId', 'rmaShippingContactPersonID', 'rmaMarkForAddressId', 'rmaMarkForContactPersonID']
            }).then((oldPackingSlipDet) => {
                if (!oldPackingSlipDet) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                } else if (oldPackingSlipDet.refPackingSlipNumberForInvoice != null && oldPackingSlipDet.packingSlipModeStatus === req.body.packingSlipModeStatus) {
                    if (req.body.packingSlipNumber !== oldPackingSlipDet.packingSlipNumber ||
                        COMMON.formatDate(req.body.packingSlipDate) !== COMMON.formatDate(oldPackingSlipDet.packingSlipDate)) {
                        const messageContent = MESSAGE_CONSTANT.RECEIVING.RMA_NOT_CHANGE_AS_CREDIT_MEMO_CREATE;
                        messageContent.message = COMMON.stringFormat(messageContent.message, oldPackingSlipDet.poNumber);

                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: messageContent,
                            err: null,
                            data: null
                        });
                    } else {
                        packingInputFieldsForUpdate = ['updatedBy', 'updatedAt', 'updateByRoleId', 'internalRemark'];
                    }
                } else {
                    if (oldPackingSlipDet.rmaShippingAddressId === req.body.rmaShippingAddressId) {
                        COMMON.removeElementFromArray(packingInputFieldsForUpdate, 'rmaShippingAddress');
                    }
                    if (oldPackingSlipDet.rmaShippingContactPersonID === req.body.rmaShippingContactPersonID) {
                        COMMON.removeElementFromArray(packingInputFieldsForUpdate, 'rmaShippingContactPerson');
                    }
                    if (oldPackingSlipDet.rmaMarkForAddressId === req.body.rmaMarkForAddressId) {
                        COMMON.removeElementFromArray(packingInputFieldsForUpdate, 'rmaMarkForAddress');
                    }
                    if (oldPackingSlipDet.rmaMarkForContactPersonID === req.body.rmaMarkForContactPersonID) {
                        COMMON.removeElementFromArray(packingInputFieldsForUpdate, 'rmaMarkForContactPerson');
                    }
                }
                req.body.refParentCreditDebitInvoiceno = oldPackingSlipDet.refParentCreditDebitInvoiceno;
                req.body.refPackingSlipNumberForInvoice = oldPackingSlipDet.refPackingSlipNumberForInvoice;
                return sequelize.transaction().then(t =>
                    PackingSlipMaterialReceive.update(req.body, {
                        where: {
                            id: req.body.id
                        },
                        fields: packingInputFieldsForUpdate,
                        transaction: t
                    }).then((respUpdateRMA) => {
                        if (respUpdateRMA) {
                            if (req.body.mfgCodeID === oldPackingSlipDet.mfgCodeID && req.body.packingSlipNumber === oldPackingSlipDet.packingSlipNumber) {
                                return module.exports.addUpdateTrackingNumber(req, res, req.body.id, 'RMA', t).then(() => {
                                    t.commit().then(() => {
                                        req.params.id = req.body.id;
                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageSupplierRMAInElastic);
                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                            materialList: respUpdateRMA
                                        }, MESSAGE_CONSTANT.UPDATED(supplierRMAModuleName));
                                    });
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            } else {
                                return GenericFilesController.manageDocumentPath(req, res, {
                                    gencFileOwnerType: req.body.gencFileOwnerType,
                                    refTransID: req.body.id
                                }, t).then(() => module.exports.addUpdateTrackingNumber(req, res, req.body.id, 'RMA', t).then(() => {
                                    t.commit();
                                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                                        materialList: respUpdateRMA
                                    }, MESSAGE_CONSTANT.UPDATED(supplierRMAModuleName));
                                }).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                })).catch((err) => {
                                    console.trace();
                                    console.error(err);
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        err: err,
                                        data: null
                                    });
                                });
                            }
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(supplierRMAModuleName),
                                err: null,
                                data: null
                            });
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    })
                ).catch((err) => {
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
            COMMON.setModelCreatedByFieldValue(req);
            return sequelize.transaction().then(t =>
                UTILITY_CONTROLLER.getSystemIdPromise(req, res, DATA_CONSTANT.SUPPLIER_RMA.Supplier_RMA_System_Id, t)
                    .then((systemIdPromise) => {
                        if (systemIdPromise.status === STATE.SUCCESS) {
                            req.body.systemId = systemIdPromise.systemId;
                            return sequelize.query('Select fun_generatPackingSlipNumberForRMA(:pPackingSlipDate) rmaNumber', {
                                replacements: {
                                    pPackingSlipDate: req.body.packingSlipDate
                                },
                                transaction: t,
                                type: sequelize.QueryTypes.SELECT
                            }).then((respRMANumber) => {
                                if (!respRMANumber) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                                } else {
                                    // set rma number from resp
                                    req.body.packingSlipNumber = respRMANumber[0].rmaNumber;
                                    return PackingSlipMaterialReceive.create(req.body, {
                                        fields: packingInputFields,
                                        transaction: t
                                    }).then((response) => {
                                        if (response) {
                                            return module.exports.addUpdateTrackingNumber(req, res, response.id, 'RMA', t).then(() => {
                                                t.commit();
                                                return resHandler.successRes(res,
                                                    DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS,
                                                    STATE.SUCCESS, {
                                                    supplierRMADetail: response
                                                }, MESSAGE_CONSTANT.CREATED(supplierRMAModuleName));
                                            }).catch((err) => {
                                                console.trace();
                                                console.error(err);
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: null,
                                                data: null
                                            });
                                        }
                                    }).catch((err) => {
                                        console.trace();
                                        console.error(err);
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                }
                            }).catch((err) => {
                                console.trace();
                                console.error(err);
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                            });
                        } else {
                            if (!t.finished) {
                                t.rollback();
                            }
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                messageContent: (systemIdPromise && systemIdPromise.message) || MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: (systemIdPromise && systemIdPromise.err) || null,
                                data: null
                            });
                        }
                    })
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err,
                    data: null
                });
            });
        }
    },

    // Get Receipt Type Wise List
    // POST : /api/v1/packing_slip/getPackingSlipBySearch
    // @return List of Receipt Type
    getPackingSlipBySearch: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;
        if (req.body) {
            let where = {};
            const whereClause = {};

            if (req.body.invoiceId) {
                where = {
                    id: req.body.invoiceId
                };
            } else if (req.body.packingSlipId) {
                where = {
                    id: req.body.packingSlipId
                };
            } else {
                where = {
                    receiptType: req.body.receiptTypes,
                    mfgCodeID: req.body.supplierId,
                    packingSlipNumber: {
                        [Op.like]: `%${req.body.searchQuery}%`
                    }
                };
            }

            if (req.body.mfrPnId) {
                whereClause.partID = req.body.mfrPnId;
            }
            if (req.body.packagingId) {
                whereClause.packagingID = req.body.packagingId;
            }
            return PackingSlipMaterialReceive.findAll({
                where: where,
                attributes: ['id', 'mfgCodeID', 'packingSlipNumber', 'invoiceNumber', 'receiptType', 'refPackingSlipNumberForInvoice', 'packingSlipModeStatus'],
                include: [{
                    model: PackingSlipMaterialReceiveDet,
                    as: 'packingSlipMaterialReceiveDet',
                    where: whereClause,
                    attributes: ['id', 'refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'partID', 'packingSlipQty', 'receivedQty', 'invoicePrice', 'purchasePrice', 'packagingID'],
                    required: false
                }]
            }).then((resp) => {
                if (resp) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, null);
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // to be call from API promise only
    // Validation to Restrict Add/Update RMA in case Packing Slip is not in Publish Mode
    validatePackingSlipPublishStatus: (req) => {
        const {
            PackingSlipMaterialReceive,
            PackingSlipMaterialReceiveDet,
            BinMst
        } = req.app.locals.models;
        if (req.body) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.refPackingSlipIdForRma
                },
                attributes: ['id', 'packingSlipModeStatus', 'packingSlipNumber'],
                include: [{
                    model: PackingSlipMaterialReceiveDet,
                    as: 'packingSlipMaterialReceiveDet',
                    attributes: ['id', 'refPackingSlipMaterialRecID', 'packingSlipSerialNumber', 'binID', 'warehouseID'],
                    required: true,
                    include: [{
                        model: BinMst,
                        as: 'binmst',
                        attributes: ['id', 'Name'],
                        required: false
                    }]
                }]
            }).then((psResponse) => {
                if (psResponse && psResponse.packingSlipModeStatus === 'D') {
                    const binName = (psResponse.packingSlipMaterialReceiveDet && psResponse.packingSlipMaterialReceiveDet[0] && psResponse.packingSlipMaterialReceiveDet[0].binmst) ? psResponse.packingSlipMaterialReceiveDet[0].binmst.Name : '';
                    const transactionTypeName = req.body.id ? 'update' : 'create';
                    const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW);
                    messageContent.message = COMMON.stringFormat(messageContent.message, transactionTypeName, 'RMA Packing Slip', req.body.refPackingSlipNumber, req.body.mfgPN, req.body.packaging, binName);

                    return {
                        status: STATE.FAILED,
                        message: messageContent
                    };
                } else {
                    return {
                        status: STATE.SUCCESS
                    };
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return {
                    status: STATE.FAILED,
                    message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                    err: err
                };
            });
        } else {
            return {
                status: STATE.FAILED,
                message: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            };
        }
    },

    // Save RMA Line Detail
    // POST : /api/v1/packing_slip/saveRMALineDetail
    saveRMALineDetail: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;
        if (req.body) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.refPackingSlipMaterialRecID
                },
                attributes: ['id', 'refPackingSlipNumberForInvoice'],
                paranoid: false
            }).then((psResponse) => {
                if (!psResponse) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.PAGE_NOT_FOUND, STATE.EMPTY, null);
                } else if (psResponse && psResponse.refPackingSlipNumberForInvoice) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                        messageContent: null,
                        err: null,
                        data: {
                            errorCode: 1
                        }
                    });
                } else {
                    return sequelize.transaction().then((t) => {
                        var promises = [];
                        if (req.body.refPackingSlipIdForRma) {
                            promises.push(module.exports.validatePackingSlipPublishStatus(req));
                        }
                        return Promise.all(promises).then((promisResp) => {
                            var resObj = _.find(promisResp, resp => resp.status === STATE.FAILED);
                            if (resObj) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                if (resObj.message) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: resObj.message,
                                        err: resObj.err || null,
                                        data: null
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.NOT_CREATED(supplierRMAModuleName),
                                        err: resObj.err || null,
                                        data: null
                                    });
                                }
                            } else {
                                let messageContent = '';
                                if (req.body.id) {
                                    COMMON.setModelUpdatedByFieldValue(req);
                                    return PackingSlipMaterialReceiveDet.update(req.body, {
                                        where: {
                                            id: req.body.id
                                        },
                                        fields: materialInputFields,
                                        transaction: t
                                    }).then((rmaUpdateResponse) => {
                                        if (rmaUpdateResponse && rmaUpdateResponse.length > 0) {
                                            _.map(req.body.saveRMALineStockList, (data) => {
                                                data.refRMADetailId = req.body.id;
                                            });

                                            const rmaStockList = JSON.stringify(req.body.saveRMALineStockList);
                                            return sequelize.query('CALL Sproc_SavePackingSlipMaterialReceiveDetStock(:pRMAStockList,:pUserID,:pUserRoleID)', {
                                                replacements: {
                                                    pRMAStockList: rmaStockList,
                                                    pUserID: req.user.id,
                                                    pUserRoleID: req.user.defaultLoginRoleID
                                                },
                                                type: sequelize.QueryTypes.SELECT,
                                                transaction: t
                                            }).then((spStatus) => {
                                                if (spStatus && spStatus[0] && spStatus[0][0] && spStatus[0][0].spStatus !== '1') {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
                                                    messageContent = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                                                    if (spStatus[0][0].spStatus === 'AVAILABLE_STOCK_ISSUE') {
                                                        messageContent = MESSAGE_CONSTANT.RECEIVING.SUPPLIER_RMA_STOCK_QTY_CHANGED;
                                                    }
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                        messageContent: messageContent,
                                                        err: null,
                                                        data: null
                                                    });
                                                } else {
                                                    return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, psResponse.refPackingSlipNumberForInvoice, 'RMA', t).then(() => {
                                                        t.commit().then(() => {
                                                            req.params.id = req.body.refPackingSlipMaterialRecID;
                                                            EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageSupplierRMAInElastic);
                                                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, req.body, MESSAGE_CONSTANT.UPDATED(supplierRMAMaterialModuleName));
                                                        });
                                                    }).catch((err) => {
                                                        if (!t.finished) {
                                                            t.rollback();
                                                        }
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
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                console.trace();
                                                console.error(err);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                    err: err,
                                                    data: null
                                                });
                                            });
                                        } else {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(supplierRMAMaterialModuleName),
                                                err: null,
                                                data: null
                                            });
                                        }
                                    }).catch((err) => {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                } else {
                                    COMMON.setModelCreatedByFieldValue(req);
                                    req.body.umidCreated = true;
                                    return PackingSlipMaterialReceiveDet.create(req.body, {
                                        fields: materialInputFields,
                                        transaction: t
                                    }).then((rmaCreateResponse) => {
                                        _.map(req.body.saveRMALineStockList, (data) => {
                                            data.refRMADetailId = rmaCreateResponse.id;
                                        });

                                        const rmaStockList = JSON.stringify(req.body.saveRMALineStockList);
                                        return sequelize.query('CALL Sproc_SavePackingSlipMaterialReceiveDetStock(:pRMAStockList,:pUserID,:pUserRoleID)', {
                                            replacements: {
                                                pRMAStockList: rmaStockList,
                                                pUserID: req.user.id,
                                                pUserRoleID: req.user.defaultLoginRoleID
                                            },
                                            type: sequelize.QueryTypes.SELECT,
                                            transaction: t
                                        }).then((spStatus) => {
                                            if (spStatus && spStatus[0] && spStatus[0][0] && spStatus[0][0].spStatus !== '1') {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                messageContent = MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG;
                                                if (spStatus[0][0].spStatus === 'AVAILABLE_STOCK_ISSUE') {
                                                    messageContent = MESSAGE_CONSTANT.RECEIVING.SUPPLIER_RMA_STOCK_QTY_CHANGED;
                                                }
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                    messageContent: messageContent,
                                                    err: null,
                                                    data: null
                                                });
                                            } else {
                                                return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, psResponse.refPackingSlipNumberForInvoice, 'RMA', t).then(() => {
                                                    t.commit().then(() => {
                                                        req.params.id = req.body.refPackingSlipMaterialRecID;
                                                        EnterpriseSearchController.proceedTransction(req, EnterpriseSearchController.manageSupplierRMAInElastic);
                                                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rmaCreateResponse, MESSAGE_CONSTANT.CREATED(supplierRMAMaterialModuleName));
                                                    });
                                                }).catch((err) => {
                                                    if (!t.finished) {
                                                        t.rollback();
                                                    }
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
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    }).catch((err) => {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        console.trace();
                                        console.error(err);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: err,
                                            data: null
                                        });
                                    });
                                }
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Delete supplier RMA material(soft delete)
    // POST : /api/v1/packing_slip/deleteSupplierRMAMaterial
    deleteSupplierRMAMaterial: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body && req.body.objIDs && req.body.objIDs.id) {
            const tableName = COMMON.AllEntityIDS.Packing_Slip_Detail.Name;
            const entityID = COMMON.AllEntityIDS.Packing_Slip_Detail.ID;
            const refrenceIDs = null;
            return sequelize.transaction().then(t => sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs, :countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: null,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                },
                transaction: t
            }).then((response) => {
                const supplierRMAMaterialDetail = response[0];
                if (supplierRMAMaterialDetail && supplierRMAMaterialDetail.TotalCount === 0) {
                    return module.exports.updatePackingSlipInvoiceStatus(req, res, req.body.refPackingSlipMaterialRecID, req.body.refPackingSlipNumberForInvoice, 'RMA', t).then(() => {
                        t.commit().then(() => {
                            EnterpriseSearchController.deleteSupplierRMAInElastic(req.body.objIDs.id.toString());
                            return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(supplierRMAMaterialModuleName));
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
                        if (!t.finished) {
                            t.rollback();
                        }
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                            messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err,
                            data: null
                        });
                    });
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, supplierRMAMaterialDetail, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (!t.finished) {
                    t.rollback();
                }
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

    // Get detail of supplier componet
    // GET : /api/v1/packing_slip/getSupplierPnByIdPackagingMfg
    // @return detail of supplier pn
    getSupplierPnByIdPackagingMfg: async (req, res) => {
        const {
            Component,
            MfgCodeMst,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            try {
                var mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }
            return await Component.findOne({
                where: {
                    mfgCodeID: req.body.mfrCodeId,
                    refSupplierMfgpnComponentID: req.body.mfrPNId,
                    packagingID: req.body.packagingId
                },
                attributes: ['id', 'mfgCodeID', 'mfgPN', 'packagingID', 'refSupplierMfgpnComponentID'],
                include: [{
                    model: MfgCodeMst,
                    as: 'mfgCodemst',
                    attributes: ['id', 'mfgCode', 'mfgName',
                        [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('MfgCodeMst.mfgCode'), sequelize.col('MfgCodeMst.mfgName'),
                            mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                    required: false
                }]
            }).then(componentDetail =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, componentDetail, null)
            ).catch((err) => {
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

    // Delete Invoice Memo (soft delete)
    // POST : /api/v1/packing_slip/deleteInvoiceMemo
    deleteInvoiceMemo: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body.objIDs.id) {
            COMMON.setModelDeletedByFieldValue(req);
            const tableName = 'packing_slip_material_receive_memo';
            const entityID = null;
            const refrenceIDs = req.body.objIDs.invoiceLineId ? req.body.objIDs.invoiceLineId.toString() : null;
            return sequelize.query('CALL Sproc_checkDelete (:tableName,:IDs,:deletedBy,:entityID,:refrenceIDs,:countList,:pRoleID)', {
                replacements: {
                    tableName: tableName,
                    IDs: req.body.objIDs.id.toString(),
                    deletedBy: req.user.id,
                    entityID: entityID,
                    refrenceIDs: refrenceIDs,
                    countList: req.body.objIDs.CountList,
                    pRoleID: COMMON.getRequestUserLoginRoleID(req)
                }
            }).then((response) => {
                let messageLabel = null;
                if (req.body.objIDs.isSupplier) {
                    messageLabel = supplierInvoiceMaterialModuleName;
                } else if (req.body.objIDs.isCreditMemo) {
                    messageLabel = creditMemo;
                } else if (req.body.objIDs.isDebitMemo) {
                    messageLabel = debitMemo;
                } else if (req.body.objIDs.isSupplierRMA) {
                    messageLabel = supplierRMAModuleName;
                } else {
                    messageLabel = packingSlipMaterialModuleName;
                }
                const packingSlipMaterialDetail = response[0];
                if (packingSlipMaterialDetail && packingSlipMaterialDetail.TotalCount === 0) {
                    EnterpriseSearchController.deleteSupplierPackingSlipDetailFromMasterIdInElastic(req, req.body.objIDs.id.toString());
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.DELETED(messageLabel));
                } else {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.EMPTY, packingSlipMaterialDetail, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Retrieve Supplier Invoice Payment Details List
    // POST : /api/v1/packing_slip/getSupplierInvoicePaymentDetailsList
    // @return Supplier Invoice Payment Details List
    getSupplierInvoicePaymentDetailsList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize.query('CALL Sproc_getSupplierInvoicePaymentDetails(:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause,:pId,:pRefPaymentMode)', {
                replacements: {
                    pPageIndex: req.body.page,
                    pRecordPerPage: filter.limit,
                    pOrderBy: filter.strOrderBy || null,
                    pWhereClause: strWhere,
                    pId: req.body.id || null,
                    pRefPaymentMode: req.body.refPaymentMode ? req.body.refPaymentMode.toString() : null
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                supplierPaymentDetailsList: _.values(response[1]),
                Count: response[0][0].TotalRecord
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
    // Approve Supplier Invoice
    // POST : /api/v1/packing_slip/approveSupplierInvoice
    approveSupplierInvoice: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            sequelize
        } = req.app.locals.models;
        var promises = [];
        var validationPromises = [];
        if (req.body) {
            return PackingSlipMaterialReceive.findAll({
                where: {
                    id: {
                        [Op.in]: req.body.ids
                    },
                    receiptType: DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.INVOICE,
                    invoiceApprovalStatus: DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.PENDING,
                    invoiceRequireManagementApproval: true
                }
            }).then((resp) => {
                if (!resp || resp.length !== req.body.ids.length) {
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                        messageContent: MESSAGE_CONSTANT.RECEIVING.SELECTED_INVOICE_AND_DB_INVOICE_STATUS_NOT_MATCHED,
                        err: null,
                        data: null
                    });
                } else {
                    return sequelize.transaction().then((t) => {
                        req.body.ids.forEach((item) => {
                            validationPromises.push(module.exports.updatePackingSlipInvoiceStatus(req, res, item, item, 'Invoice', t, true));
                        });

                        return Promise.all(validationPromises).then((response) => {
                            var resObjValidation = _.find(response, r => r.status === STATE.FAILED);
                            if (resObjValidation) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                if (resObjValidation.message) {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: resObjValidation.message,
                                        err: null,
                                        data: null
                                    });
                                } else {
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(invoice),
                                        err: null,
                                        data: null
                                    });
                                }
                            }
                            resObjValidation = _.filter(response, r => r.invoiceStatus !== 'A');
                            if (resObjValidation && resObjValidation.length > 0) {
                                if (!t.finished) {
                                    t.rollback();
                                }
                                const invNos = _.map(resObjValidation, item => item.invoiceNumber);

                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_INVOICE_APPROVAL_VALIDATION_MESSAGE);
                                messageContent.message = COMMON.stringFormat(messageContent.message, invNos);

                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                    messageContent: messageContent,
                                    err: null,
                                    data: null
                                });
                            } else {
                                const updateObj = {
                                    invoiceApprovalStatus: DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.APPROVED,
                                    invoiceApprovalComment: req.body.invoiceApprovalComment,
                                    invoiceApprovalDate: COMMON.getCurrentUTC(),
                                    invoiceApprovedBy: req.user.id,
                                    lockStatus: DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock,
                                    updatedBy: req.user.id,
                                    updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                };
                                return PackingSlipMaterialReceive.update(updateObj, {
                                    where: {
                                        id: {
                                            [Op.in]: req.body.ids
                                        },
                                        receiptType: DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.INVOICE,
                                        invoiceApprovalStatus: DATA_CONSTANT.SUPPLIER_INVOICE_APPROVAL_STATUS.PENDING,
                                        invoiceRequireManagementApproval: true
                                    },
                                    transaction: t
                                }).then((rowsUpdated) => {
                                    if (rowsUpdated) {
                                        promises = [];
                                        req.body.ids.forEach((item) => {
                                            promises.push(module.exports.updatePackingSlipInvoiceStatus(req, res, item, item, 'Invoice', t));
                                        });

                                        return Promise.all(promises).then((responseUpdate) => {
                                            var resObj = _.find(responseUpdate, r => r.status === STATE.FAILED);
                                            if (resObj) {
                                                if (!t.finished) {
                                                    t.rollback();
                                                }
                                                if (resObj.message) {
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                        messageContent: resObj.message,
                                                        err: null,
                                                        data: null
                                                    });
                                                } else {
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                                        messageContent: MESSAGE_CONSTANT.NOT_UPDATED(invoice),
                                                        err: null,
                                                        data: null
                                                    });
                                                }
                                            } else {
                                                t.commit();
                                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, MESSAGE_CONSTANT.RECEIVING.SUPPLIER_INVOICE_APPROVED_SUCCESSFULLY);
                                            }
                                        }).catch((err) => {
                                            if (!t.finished) {
                                                t.rollback();
                                            }
                                            console.trace();
                                            console.error(err);
                                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                                err: err,
                                                data: null
                                            });
                                        });
                                    } else {
                                        if (!t.finished) {
                                            t.rollback();
                                        }
                                        return {
                                            status: STATE.FAILED,
                                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                            err: null,
                                            data: null
                                        };
                                    }
                                }).catch((err) => {
                                    if (!t.finished) {
                                        t.rollback();
                                    }
                                    console.trace();
                                    console.error(err);
                                    return {
                                        status: STATE.FAILED,
                                        message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                        error: err
                                    };
                                });
                            }
                        }).catch((err) => {
                            if (!t.finished) {
                                t.rollback();
                            }
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                                err: err,
                                data: null
                            });
                        });
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                            messageContent: MESSAGE_CONSTANT.NOT_UPDATED(invoice),
                            err: err,
                            data: null
                        });
                    });
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // get history of packing slip
    // POST :/api/v1/packing_slip/getHistoryOfPackingSlip
    // @return get History Of Packing Slip
    getHistoryOfPackingSlip: (req, res) => {
        if (req.body && req.body.packingSlipId) {
            const { sequelize } = req.app.locals.models;
            const filter = COMMON.UiGridFilterSearch(req);
            const strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);

            return sequelize
                .query('CALL Sproc_GetPackingSlipChangeHistory (:pPackingSlipId,:pPageIndex,:pRecordPerPage,:pOrderBy,:pWhereClause)', {
                    replacements: {
                        pPackingSlipId: req.body.packingSlipId,
                        pPageIndex: req.body.Page,
                        pRecordPerPage: req.body.isExport ? null : filter.limit,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then(packingSlipHistoryList => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                    packingSlipHistoryList: _.values(packingSlipHistoryList[1]),
                    Count: packingSlipHistoryList[0][0]['TotalRecord']
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Get supplier payment balance and past due amount
    // POST : /api/v1/packing_slip/retrieveSupplierPaymentBalanceAndPastDue
    // @return List of supplier payment balance and past due
    retrieveSupplierPaymentBalanceAndPastDue: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        var strWhere = '';
        var dataObject = '';
        if (req.body) {
            const filter = COMMON.UiGridFilterSearch(req);
            strWhere = COMMON.UIGridWhereToQueryWhere(filter.where);
            if (strWhere === '') {
                strWhere = null;
            }

            return sequelize
                .query('CALL Sproc_GetSupplierPaymentBalanceAndPastDue(:ppageIndex,:precordPerPage,:pOrderBy,:pWhereClause, :pIsCodeFirst,:pDueDate,:pAdditionalDays,:pTermsAndAboveDays)', {
                    replacements: {
                        ppageIndex: req.body.Page || 0,
                        precordPerPage: filter.limit || 0,
                        pOrderBy: filter.strOrderBy || null,
                        pWhereClause: strWhere,
                        pIsCodeFirst: req.body.isCodeFirst ? true : false,
                        pDueDate: req.body.dueDate ? req.body.dueDate : null,
                        pAdditionalDays: req.body.additionalDays ? req.body.additionalDays : null,
                        pTermsAndAboveDays: req.body.termsAndAboveDays ? req.body.termsAndAboveDays : null
                    },
                    type: sequelize.QueryTypes.SELECT
                })
                .then((response) => {
                    if (response) {
                        dataObject = {
                            balanceDueList: _.values(response[1]),
                            Count: response[0][0]['TotalRecord']
                        };
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, dataObject, null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Check for PO release line count and if only one release line then get release line detail
    // POST : /api/v1/packing_slip/checkPOLinesforPart
    // @return PO release line count and if only one release line then get release line detail
    checkPOLinesforPart: (req, res) => {
        const {
            PurchaseOrderDet,
            Component
        } = req.app.locals.models;
        if (req.body.refPurchaseOrderID) {
            const whereCluase = {
                refPurchaseOrderID: req.body.refPurchaseOrderID,
                isDeleted: false
            };
            let includeComponent = [];

            if (req.body.partID) {
                whereCluase.mfgPartID = req.body.partID;
            }

            if (req.body.mfgPN) {
                includeComponent = [
                    {
                        model: Component,
                        as: 'mfgParts',
                        where: {
                            mfgPN: req.body.mfgPN
                        },
                        attributes: ['id', 'mfgPN'],
                        required: true
                    }];
            }

            return PurchaseOrderDet.findAll({
                where: whereCluase,
                attributes: ['totalRelease'],
                include: includeComponent
            }).then((poReleaseLines) => {
                let totalReleaseCount = 0;
                if (poReleaseLines && poReleaseLines.length > 0) {
                    totalReleaseCount = _.sumBy(poReleaseLines, 'totalRelease');
                }

                if (totalReleaseCount === 1) {
                    return module.exports.gelReleaseLinesForPO(req, res);
                } else {
                    const releseDet = {
                        poReleaseLineList: null,
                        totalReleaseCount: totalReleaseCount
                    };
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, releseDet, null);
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get PS Line Of Same MFPN List
    // POST : /api/v1/packing_slip/getPSLineOfSameMFPNList
    // @return List of Packing slip and supplier Invoice Line
    getPSLineOfSameMFPNList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            const psDetailLineIds = req.body.lines && req.body.lines.length > 0 ? _.map(req.body.lines).join(',') : null;

            return sequelize
                .query('CALL Sproc_GetPSLineOfSameMFPNList(:pPSDetailLineIds)', {
                    replacements: {
                        pPSDetailLineIds: psDetailLineIds
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (response) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get Supplier RMA Stock List
    // POST : /api/v1/packing_slip/getSupplierRMAStockList
    // @return List of Supplier RMA Stock Line
    getSupplierRMAStockList: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            return sequelize
                .query('CALL Sproc_RetrivePackingSlipMaterialReceiveDetStock(:pRMADetailLineId, :pPackingSlipId, :pPackingSlipDetailId, :pPartId, :pPackagingId)', {
                    replacements: {
                        pRMADetailLineId: req.body.rmaDetailId || null,
                        pPackingSlipId: req.body.packingSlipId,
                        pPackingSlipDetailId: req.body.packingSlipDetailId,
                        pPartId: req.body.partId,
                        pPackagingId: req.body.packagingId
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then((response) => {
                    if (response) {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, _.values(response[0]), null);
                    } else {
                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, null);
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
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // Get detail of packing slip base on packing slip, part and bin wise
    // GET : /api/v1/packing_slip/checkBinContainSamePSAndPart
    // @return detail of packing slip
    checkBinContainSamePSAndPart: async (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            PackingSlipMaterialReceive,
            MfgCodeMst,
            Component,
            sequelize
        } = req.app.locals.models;

        if (req.body) {
            try {
                var mfgCodeFormat = await sequelize.query('Select fun_getMFGCodeNameFormat() as mfgCodeNameFormat', {
                    type: sequelize.QueryTypes.SELECT
                });
            } catch (err) {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            }

            return await PackingSlipMaterialReceiveDet.findOne({
                where: {
                    partID: req.body.partId,
                    binID: req.body.binId,
                    refPackingSlipMaterialRecID: {
                        [Op.ne]: req.body.packingSlipId
                    }
                },
                attributes: ['id', 'refPackingSlipMaterialRecID', 'partID', 'binID'],
                include: [{
                    model: PackingSlipMaterialReceive,
                    as: 'packing_slip_material_receive',
                    attributes: ['id', 'packingSlipNumber', 'mfgCodeID'],
                    required: false,
                    include: [
                        {
                            model: MfgCodeMst,
                            as: 'mfgCodemst',
                            attributes: ['id', 'mfgCode', 'mfgName',
                                [sequelize.fn('fun_GetFormattedMfgCode', sequelize.col('mfgCode'), sequelize.col('mfgName'),
                                    mfgCodeFormat[0].mfgCodeNameFormat), 'mfgCodeName']],
                            required: false
                        }
                    ]
                },
                {
                    model: Component,
                    as: 'component',
                    attributes: ['id', 'mfgpn', 'PIDCode'],
                    required: false
                }]
            }).then(psDetail =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, psDetail, null)
            ).catch((err) => {
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

    // Check RMA have relation with UMID or Non UMID
    // GET : /api/v1/packing_slip/checkRelationOfStockAndRMA
    // @return detail of packing slip detail stock
    checkRelationOfStockAndRMA: (req, res) => {
        const {
            PackingSlipMaterialReceiveDetStock

        } = req.app.locals.models;

        if (req.body) {
            let whereClause = null;
            if (req.body.rmaId) {
                whereClause = {
                    refRMAId: {
                        [Op.in]: req.body.rmaId
                    }
                };
            } else if (req.body.rmaDetailId) {
                whereClause = {
                    refRMADetailId: {
                        [Op.in]: req.body.rmaDetailId
                    }
                };
            }
            return PackingSlipMaterialReceiveDetStock.findAll({
                where: whereClause,
                attributes: ['id', 'refRMAId', 'refRMADetailId', 'refPackingSlipId', 'refPackingSlipDetId']
            }).then(psDetailStock =>
                resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, psDetailStock, null)
            ).catch((err) => {
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

    // Get release line from PO based on MFR PN, Part ID or All lines
    // POST : /api/v1/packing_slip/gelReleaseLinesForPO
    // @return list of release line from PO based on MFR PN, Part ID or All lines
    gelReleaseLinesForPO: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.refPurchaseOrderID) {
            return sequelize.query('CALL Sproc_RetriveReleaseLineFromPO(:pRefPOId,:pPartID,:pMFGPN)', {
                replacements: {
                    pRefPOId: req.body.refPurchaseOrderID,
                    pPartID: req.body.partID || null,
                    pMFGPN: req.body.mfgPN || null
                },
                type: sequelize.QueryTypes.SELECT
            }).then((resPoReleaseLine) => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                poReleaseLineList: _.values(resPoReleaseLine[0])
            }, null)
            ).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },

    // GET all SO from Internal PO
    // POST : /api/v1/packing_slip/getSOListFromPO
    // @return list of so in PO
    getSOListFromPO: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PurchaseOrderMst
        } = req.app.locals.models;
        //  if (req.body) {

        const packingSlipWhereClause = {
            isDeleted: false
        };
        const popWhereClause = {
            isDeleted: false
        };
        // for dynamic column based search using Sequelize
        if (req.body) {
            if (!req.body.poNumber) {
                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { soNumber: null, supplierSONumber: null }, null);
            }
            if (req.body.searchQuery) {
                packingSlipWhereClause.supplierSONumber = {
                    [Op.like]: `%${req.body.searchQuery}%`
                };
                popWhereClause.soNumber = {
                    [Op.like]: `%${req.body.searchQuery}%`
                };
            }

            packingSlipWhereClause.poNumber = req.body.poNumber;
            popWhereClause.poNumber = req.body.poNumber;

            return PackingSlipMaterialReceive.findAll({
                where: packingSlipWhereClause,
                attributes: ['supplierSONumber'],
                group: ['supplierSONumber'],
                order: [
                    ['supplierSONumber', 'ASC']
                ]

            }).then(response =>
                PurchaseOrderMst.findAll({
                    where: popWhereClause,
                    attributes: ['soNumber'],
                    group: ['soNumber'],
                    order: [
                        ['soNumber', 'ASC']
                    ]
                }).then(resp =>
                    resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, { soNumber: resp, supplierSONumber: response }, null)
                ).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, {
                        messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                        err: err,
                        data: null
                    });
                })
            ).catch((err) => {
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

    lockTransaction: (req, res) => {
        const {
            PackingSlipMaterialReceive,
            PackingslipInvoicePayment,
            HoldUnholdTrans
        } = req.app.locals.models;
        if (req.body) {
            if (req.body.receiptType === 'P' ||
                req.body.receiptType === 'I' ||
                req.body.receiptType === 'C' ||
                req.body.receiptType === 'D' ||
                req.body.receiptType === 'R') {
                const promises = [];
                promises.push(
                    HoldUnholdTrans.findOne({
                        where: {
                            refTransId: {
                                [Op.in]: req.body.ids
                            },
                            refType: {
                                [Op.in]: ['SINV', 'SCM', 'SDM']
                            },
                            status: DATA_CONSTANT.HOLD_UNHOLD_TRANS.Halt
                        },
                        attributes: ['id']
                    }).then((response) => {
                        if (response) {
                            return {
                                status: STATE.FAILED,
                                message: MESSAGE_CONSTANT.RECEIVING.NOT_ALLOWED_TO_PAY_HALTED_INVOICE
                            };
                        } else {
                            return {
                                status: STATE.SUCCESS
                            };
                        }
                    }).catch((err) => {
                        console.trace();
                        console.error(err);
                        return {
                            status: STATE.FAILED,
                            message: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG,
                            err: err
                        };
                    })
                );
                return Promise.all(promises).then((respValidation) => {
                    var resObj = _.find(respValidation, resp => resp.status === STATE.FAILED);
                    if (resObj) {
                        if (resObj.message) {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: resObj.message,
                                err: resObj.err || null,
                                data: null
                            });
                        } else {
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, {
                                messageContent: MESSAGE_CONSTANT.NOT_UPDATED(supplierInvoiceMaterialModuleName),
                                err: resObj.err || null,
                                data: null
                            });
                        }
                    } else {
                        const whereCriteria = {
                            // receiptType: req.body.receiptType,
                            id: {
                                [Op.in]: req.body.ids
                            },
                            lockStatus: DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock
                        };
                        if (req.body.receiptType !== 'R') {
                            whereCriteria.status = {
                                [Op.in]: [DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.ApprovedToPay,
                                DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.PartiallyPaid,
                                DATA_CONSTANT.SupplierPackingSlipANdInvoiceStatus.Paid]
                            };
                        }
                        return PackingSlipMaterialReceive.findAll({
                            where: whereCriteria,
                            attributes: ['id']
                        }).then((response) => {
                            if (response.length !== req.body.ids.length) {
                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                    messageContent: MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED,
                                    err: null,
                                    data: null
                                });
                            }
                            const objLockRecord = {
                                lockStatus: DATA_CONSTANT.CustomerPaymentLockStatus.Locked,
                                lockedBy: COMMON.getRequestUserID(req),
                                lockedByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                lockedAt: COMMON.getCurrentUTC(),
                                updatedAt: COMMON.getCurrentUTC(),
                                updatedBy: COMMON.getRequestUserID(req),
                                updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                            };
                            return PackingSlipMaterialReceive.update(objLockRecord, {
                                where: {
                                    // receiptType: req.body.receiptType,
                                    id: {
                                        [Op.in]: req.body.ids
                                    }
                                }
                            }).then((resp) => {
                                var receiptTypeValue = '';
                                if (req.body.receiptType === 'P') {
                                    receiptTypeValue = 'Supplier Packing Slip';
                                } else if (req.body.receiptType === 'I') {
                                    receiptTypeValue = 'Supplier Invoice';
                                } else if (req.body.receiptType === 'R') {
                                    receiptTypeValue = 'Supplier RMA';
                                } else if (req.body.receiptType === 'C') {
                                    receiptTypeValue = 'Supplier Credit Memo';
                                } else if (req.body.receiptType === 'D') {
                                    receiptTypeValue = 'Supplier Debit Memo';
                                }


                                _.each(req.body.ids, (id) => {
                                    req.params['id'] = id;
                                    req.params['receiptType'] = req.body.receiptType;
                                    EnterpriseSearchController.managePackingSlipInElastic(req);
                                });

                                const messageContent = Object.assign({}, MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
                                messageContent.message = COMMON.stringFormat(messageContent.message, receiptTypeValue);
                                return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, messageContent);
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
            } else if (req.body.receiptType === 'SUPPLIER_PAYMENT_LOCK' ||
                req.body.receiptType === 'SUPPLIER_REFUND_LOCK') {
                return PackingslipInvoicePayment.findAll({
                    where: {
                        id: {
                            [Op.in]: req.body.ids
                        },
                        lockStatus: req.body.isLockRecord ? DATA_CONSTANT.CustomerPaymentLockStatus.Locked : DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock
                    },
                    attributes: ['id']
                }).then((response) => {
                    if (response.length !== req.body.ids.length) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                            messageContent: req.body.isLockRecord ? MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_UNLOCKED : MESSAGE_CONSTANT.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED,
                            err: null,
                            data: null
                        });
                    }
                    const objLockRecord = {
                        updatedAt: COMMON.getCurrentUTC(),
                        updatedBy: COMMON.getRequestUserID(req),
                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                    };
                    if (req.body.isLockRecord) {
                        objLockRecord.lockStatus = DATA_CONSTANT.CustomerPaymentLockStatus.ReadyToLock;
                        objLockRecord.lockedBy = null;
                        objLockRecord.lockedByRoleId = null;
                        objLockRecord.lockedAt = null;
                    } else {
                        objLockRecord.lockStatus = DATA_CONSTANT.CustomerPaymentLockStatus.Locked;
                        objLockRecord.lockedBy = COMMON.getRequestUserID(req);
                        objLockRecord.lockedByRoleId = COMMON.getRequestUserLoginRoleID(req);
                        objLockRecord.lockedAt = COMMON.getCurrentUTC();
                    }

                    return PackingslipInvoicePayment.update(objLockRecord, {
                        where: {
                            id: {
                                [Op.in]: req.body.ids
                            }
                        }
                    }).then((resp) => {
                        const messageContent = Object.assign({}, req.body.isLockRecord ? MESSAGE_CONSTANT.GLOBAL.UNLOCKED_SUCCESSFULLY : MESSAGE_CONSTANT.GLOBAL.LOCKED_SUCCESSFULLY);
                        let vRefPaymentMode;
                        if (req.body.receiptType === 'SUPPLIER_REFUND_LOCK') {
                            vRefPaymentMode = DATA_CONSTANT.RefPaymentModeForInvoicePayment.SupplierRefund;
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Supplier Refund');
                        } else {
                            vRefPaymentMode = DATA_CONSTANT.RefPaymentModeForInvoicePayment.Payable;
                            messageContent.message = COMMON.stringFormat(messageContent.message, 'Supplier Payment');
                        }
                        _.each(req.body.ids, (id) => {
                            req.params['id'] = id;
                            req.params['refPaymentMode'] = vRefPaymentMode;
                            EnterpriseSearchController.manageSupplierPaymentAndRefundInElastic(req);
                        });

                        return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, resp, messageContent);
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
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // To retrieve Supplier Invoice Refund Lines
    // POST : /api/v1/packing_slip/getSupplierMemoListForRefund
    // @return Supplier Memo List for Refund
    getSupplierMemoListForRefund: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.mfgcodeID || req.body.paymentId) {
            return sequelize.query('CALL Sproc_GetAllSupplierMemoListForRefund(:pMfgcodeID,:pPaymentID,:pIsVoidAndReissuePayment)', {
                replacements: {
                    pMfgcodeID: req.body.mfgcodeID || null,
                    pPaymentID: req.body.paymentId || null,
                    pIsVoidAndReissuePayment: req.body.isVoidAndReissuePayment || false
                },
                type: sequelize.QueryTypes.SELECT
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                refundLines: _.values(response[0]),
                refundMaster: req.body.paymentId ? _.values(response[1]) : null
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

    // To retrieve External PO Line IDs
    // POST : /api/v1/packing_slip/getAllPOLineIdForExternalPO
    // @return PO line ids for external po case
    getAllPOLineIdForExternalPO: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body.poNumber && req.body.partID) {
            return sequelize.query('CALL Sproc_GetAllPOLineIdForExternalPO(:pPoNumber, :pPartId, :pRefPOLineID)', {
                replacements: {
                    pPoNumber: req.body.poNumber,
                    pPartId: req.body.partID,
                    pRefPOLineID: req.body.refPOLineID || null
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // Checking External PO line is Exists or Not based on poNumber, orderedQty and partID
    // POST : /api/v1/packing_slip/checkLineExistsForExternalPO
    // @return External Po line if line exists
    checkLineExistsForExternalPO: (req, res) => {
        const {
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.poNumber && req.body.orderedQty && req.body.partID) {
            return sequelize.query('CALL Sproc_CheckLineExistsForExternalPO(:pPoNumber, :pOrderedQty, :pPartId)', {
                replacements: {
                    pPoNumber: req.body.poNumber,
                    pOrderedQty: req.body.orderedQty,
                    pPartId: req.body.partID
                }
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // To retrieve packing slip status by packing slip id
    // POST : /api/v1/packing_slip/getPackingSlipStatus
    // @return packing slip status
    getPackingSlipStatus: (req, res) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.id,
                    receiptType: DATA_CONSTANT.PACKING_SLIP_RECEIPT_TYPE.PACKING_SLIP
                },
                attributes: ['id', 'packingSlipModeStatus']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)).catch((err) => {
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

    // To Checking Packing Slip Contains Any Pending Lines
    // POST : /api/v1/packing_slip/checkPSContainingPendingLine
    // @return pending lines of packing slip
    checkPSContainingPendingLine: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return PackingSlipMaterialReceiveDet.findOne({
                where: {
                    refPackingSlipMaterialRecID: req.body.id,
                    receivedStatus: DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending,
                    isDeleted: false
                },
                attributes: ['receivedStatus']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
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

    // To Checking Bin contains Different received status and same part with same packaging
    // POST : /api/v1/packing_slip/checkSameBinAndDifferentStatus
    // @return packing slip line received status list if bin contains different received status and same part with same packaging
    checkSameBinAndDifferentStatus: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;
        if (req.body && req.body.partID && req.body.refPackingSlipMaterialRecID && req.body.binID && req.body.packagingID && req.body.receivedStatus) {
            const receivedStatusObject = [DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Pending];
            if (req.body.receivedStatus === DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Reject) {
                receivedStatusObject.push(req.body.receivedStatus);
            } else {
                receivedStatusObject.push(DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.AcceptwithDeviation, DATA_CONSTANT.COMPONENT_INSPECTION_REQUIREMENT_DET.PackingSlipReceivedStatus.Accept);
            }
            const whereClause = {
                partID: req.body.partID,
                refPackingSlipMaterialRecID: req.body.refPackingSlipMaterialRecID,
                binID: req.body.binID,
                packagingID: req.body.packagingID,
                receivedStatus: {
                    [Op.notIn]: receivedStatusObject
                },
                isDeleted: false
            };
            if (req.body.id) {
                whereClause.id = {
                    [Op.ne]: req.body.id
                };
            }
            return PackingSlipMaterialReceiveDet.findAll({
                where: whereClause,
                attributes: ['id', 'receivedStatus']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
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

    // To Checking Entered bin parent ware house is mismatched by packing slip
    // POST : /api/v1/packing_slip/checkDuplicateParentWarehouseExists
    // @return  ware house name if duplicate name found
    checkDuplicateParentWarehouseExists: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            WarehouseMst
        } = req.app.locals.models;
        if (req.body && req.body.refPackingSlipMaterialRecID && req.body.parentWarehouseID) {
            const whereClause = {
                refPackingSlipMaterialRecID: req.body.refPackingSlipMaterialRecID,
                parentWarehouseID: {
                    [Op.ne]: req.body.parentWarehouseID
                },
                isDeleted: false
            };
            if (req.body.id) {
                whereClause.id = {
                    [Op.ne]: req.body.id
                };
            }
            return PackingSlipMaterialReceiveDet.findOne({
                where: whereClause,
                attributes: ['id', 'parentWarehouseID'],
                include: [{
                    model: WarehouseMst,
                    as: 'parentWarehouse',
                    attributes: ['ID', 'Name']
                }]
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
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

    // To save packing slip details if all validations are validated from ui
    // POST : /api/v1/packing_slip/savePackingSlipBinDetails
    // @return save only packing slip details
    savePackingSlipBinDetails: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet,
            sequelize
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return sequelize.transaction().then((t) => {
                COMMON.setModelUpdatedByFieldValue(req);
                return PackingSlipMaterialReceiveDet.update(req.body, {
                    where: {
                        id: req.body.id
                    },
                    attributes: materialInputFields,
                    transaction: t
                }).then(response => t.commit().then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null)))
                    .catch((err) => {
                        if (!t.finished) {
                            t.rollback();
                        }
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

    // To check packing slip customer consigned value
    // POST : /api/v1/packing_slip/checkPackingSlipCustConsignedStatus
    // @return packing slip customer consigned status
    checkPackingSlipCustConsignedStatus: (req, res) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.id,
                    isCustConsigned: !req.body.isLineCustConsigned
                },
                attributes: ['id']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
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
    createAndUploadInspectionRequirmentReportInDocuments: (req, res) => {
        const { GenericFiles, GenericCategory, sequelize } = req.app.locals.models;

        http.globalAgent.options.rejectUnauthorized = false;
        const HEADER = { ...config.identity_server.HEADER, Authorization: req.headers.authorization };
        let genFilePath;
        if (req.body) {
            return sequelize.query('CALL Sproc_getRefTransDetailForDocument (:pGencFileOwnerType, :pRefTransID,:pIsReturnDetail)', {
                replacements: {
                    pGencFileOwnerType: req.body.gencFileOwnerType || null,
                    pRefTransID: req.body.refTransID || null,
                    pIsReturnDetail: true
                },
                type: sequelize.QueryTypes.SELECT
            }).then((responseDocDetails) => {
                genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/${req.body.gencFileOwnerType}`;
                let folders = [''];
                const documentCreatedDateInfo = _.first(_.values(responseDocDetails[0]));
                if (documentCreatedDateInfo && documentCreatedDateInfo.isBasedOnCreatedDate === 1) {
                    genFilePath = `${DATA_CONSTANT.GENERIC_FILE.UPLOAD_PATH}/`;
                    folders = documentCreatedDateInfo.newDocumentPath.split('/');
                }
                _.each(folders, (folder) => {
                    genFilePath = `${genFilePath}${folder}/`;
                    if (!fs.existsSync(genFilePath)) {
                        fs.mkdirSync(genFilePath);
                    }
                });
                const reportName = `${req.body.reportName}.pdf`;
                const fileNameWithPath = `${genFilePath}${reportName}`;

                const options = {
                    method: DATA_CONSTANT.REPORT_VIEWER.DOWNLOAD_REPORT.METHOD,
                    host: config.identity_server.HOST,
                    port: config.report_viewer.PORT,
                    path: config.report_viewer.ReportViewerPrefix + DATA_CONSTANT.REPORT_VIEWER.DOWNLOAD_REPORT.PATH,
                    headers: HEADER,
                    strictSSL: false
                };
                const callback = (response) => {
                    var chunks = [];
                    response.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    // eslint-disable-next-line consistent-return
                    response.on('end', () => {
                        var body = Buffer.concat(chunks);
                        try {
                            const buff = new Buffer.from(body.toString('base64'), 'base64');

                            fs.writeFile(fileNameWithPath, buff, (err) => {
                                if (err) {
                                    console.trace();
                                    console.error(err);
                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                        messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                                        err: err,
                                        data: null
                                    });
                                } else {
                                    return GenericFiles.findOne({
                                        where: {
                                            gencOriginalName: reportName,
                                            gencFileOwnerType: req.body.gencFileOwnerType,
                                            refTransID: req.body.refTransID || null,
                                            entityID: req.body.entityID || null,
                                            isRecycle: false,
                                            isDeleted: false
                                        },
                                        attributes: ['gencFileID', 'gencOriginalName']
                                    }).then((existsFile) => {
                                        const objFileSize = fs.statSync(fileNameWithPath);
                                        if (existsFile) {
                                            const objFileUpdate = {
                                                gencOriginalName: reportName,
                                                gencFileName: reportName,
                                                genFilePath: `${fileNameWithPath.replace('.', '')}`,
                                                fileSize: objFileSize.size,
                                                isRecycle: false,
                                                isDisable: false,
                                                isActive: true
                                            };
                                            return GenericFiles.update(objFileUpdate, {
                                                where: {
                                                    gencFileID: existsFile.gencFileID
                                                }
                                            }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, 'Report generated successfully')
                                            ).catch((docError) => {
                                                console.trace();
                                                console.error(docError);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: docError, data: null });
                                            });
                                        } else {
                                            COMMON.setModelCreatedByFieldValue(req);
                                            return GenericCategory.findOne({
                                                where: {
                                                    gencCategoryName: DATA_CONSTANT.GENERICCATEGORY.EQUIPMENT_OWNERSHIP.SYSTEM_GENERATED_DATA.Inspection_Requirment_report,
                                                    isDeleted: false
                                                },
                                                attributes: ['gencCategoryID', 'gencCategoryName']
                                            }).then((existsDocCategory) => {
                                                if (existsDocCategory) {
                                                    return GenericFiles.create({
                                                        gencFileName: reportName,
                                                        gencOriginalName: reportName,
                                                        genFilePath: `${fileNameWithPath.replace('.', '')}`,
                                                        gencFileDescription: null,
                                                        gencFileExtension: 'pdf',
                                                        gencFileType: 'application/pdf',
                                                        isDefault: false,
                                                        refTransID: req.body.refTransID,
                                                        entityID: req.body.entityID,
                                                        gencFileOwnerType: req.body.gencFileOwnerType,
                                                        isActive: true,
                                                        isShared: false,
                                                        fileGroupBy: existsDocCategory.gencCategoryID,
                                                        refParentId: null,
                                                        createdBy: req.body.createdBy,
                                                        updatedBy: req.body.createdBy,
                                                        fileSize: objFileSize.size,
                                                        tags: null,
                                                        createByRoleId: COMMON.getRequestUserLoginRoleID(req),
                                                        updateByRoleId: COMMON.getRequestUserLoginRoleID(req)
                                                    }, {
                                                    }).then(() => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, null, 'Report generated successfully')
                                                    ).catch((docError) => {
                                                        console.trace();
                                                        console.error(docError);
                                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                                                            messageContent: MESSAGE_CONSTANT.GLOBAL.DOCUMENT_NOT_UPLOAD,
                                                            err: null,
                                                            data: null
                                                        });
                                                    });
                                                } else {
                                                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: null, data: null });
                                                }
                                            }).catch((errGenFile) => {
                                                console.trace();
                                                console.error(errGenFile);
                                                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: errGenFile, data: null });
                                            });
                                        }
                                    }).catch((errGenFile) => {
                                        console.trace();
                                        console.error(errGenFile);
                                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: errGenFile, data: null });
                                    });
                                }
                            });
                        } catch (error) {
                            console.trace();
                            console.error(error);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: error, data: null });
                        }
                    });
                };

                const reqReportObj = http.request(options, callback);
                reqReportObj.write(JSON.stringify(req.body));
                reqReportObj.on('error', err => resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                    messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                    err: err,
                    data: null
                }));
                reqReportObj.end();
            }).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, {
                messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER,
                err: null,
                data: null
            });
        }
    },
    // To check packing slip Non UMID Stock value
    // POST : /api/v1/packing_slip/checkPackingSlipNonUMIDStockStatus
    // @return packing slip non umid stock status
    checkPackingSlipNonUMIDStockStatus: (req, res) => {
        const {
            PackingSlipMaterialReceive
        } = req.app.locals.models;
        if (req.body && req.body.id) {
            return PackingSlipMaterialReceive.findOne({
                where: {
                    id: req.body.id,
                    isNonUMIDStock: !req.body.isNonUMIDStock
                },
                attributes: ['id']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
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

    // To Checking Bin contains with same part and same packaging
    // POST : /api/v1/packing_slip/checkSameBinWithSamePartAndSamePackaging
    // @return packing slip line if bin contains with same part and same packaging
    checkSameBinWithSamePartAndSamePackaging: (req, res) => {
        const {
            PackingSlipMaterialReceiveDet
        } = req.app.locals.models;
        if (req.body && req.body.partID && req.body.refPackingSlipMaterialRecID && req.body.binID && req.body.packagingID) {
            const whereClause = {
                partID: req.body.partID,
                refPackingSlipMaterialRecID: req.body.refPackingSlipMaterialRecID,
                binID: req.body.binID,
                packagingID: req.body.packagingID,
                isDeleted: false
            };
            if (req.body.id) {
                whereClause.id = {
                    [Op.ne]: req.body.id
                };
            }
            return PackingSlipMaterialReceiveDet.findAll({
                where: whereClause,
                attributes: ['id']
            }).then(response => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, response, null))
                .catch((err) => {
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
    }
};