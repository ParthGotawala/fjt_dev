const router = require('express').Router(); // eslint-disable-line
const PackingSlipController = require('../controllers/PackingSlipController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getPackingSlipList')
        .post(PackingSlipController.getPackingSlipList);

    router.route('/getPackingSlipDet/:id/:receiptType')
        .get(PackingSlipController.getPackingSlipDet);

    router.route('/savePackingSlip')
        .post(PackingSlipController.savePackingSlip);

    router.route('/deletePackingSlip')
        .post(PackingSlipController.deletePackingSlip);

    router.route('/getPackingSlipMaterialList')
        .post(PackingSlipController.getPackingSlipMaterialList);

    router.route('/savePackingSlipMaterial')
        .post(PackingSlipController.savePackingSlipMaterial);

    router.route('/saveInvoiceMaterial')
        .post(PackingSlipController.saveInvoiceMaterial);

    router.route('/deletePackingSlipMaterial')
        .post(PackingSlipController.deletePackingSlipMaterial);

    router.route('/deleteSupplierInvoiceMaterial')
        .post(PackingSlipController.deleteSupplierInvoiceMaterial);

    router.route('/scanPackingBarcode')
        .post(PackingSlipController.scanPackingBarcode);

    router.route('/getPackingSlipPartQtyByPO')
        .post(PackingSlipController.getPackingSlipPartQtyByPO);

    router.route('/getAllPackingSlipList')
        .get(PackingSlipController.getAllPackingSlipList);

    router.route('/approvePackingSlipMaterialMemo')
        .post(PackingSlipController.approvePackingSlipMaterialMemo);

    router.route('/paidPackingSlip')
        .post(PackingSlipController.paidPackingSlip);

    router.route('/updateSupplierPayment')
        .post(PackingSlipController.updateSupplierPayment);

    router.route('/voidSupplierInvoicePayment')
        .post(PackingSlipController.voidSupplierInvoicePayment);

    router.route('/voidAndReIssueSupplierInvoicePayment')
        .post(PackingSlipController.voidAndReIssueSupplierInvoicePayment);

    router.route('/scanDocument')
        .post(PackingSlipController.scanDocument);

    router.route('/saveInvoiceData')
        .post(PackingSlipController.saveInvoiceData);

    router.route('/getPackingSlipDetByPO')
        .post(PackingSlipController.getPackingSlipDetByPO);

    router.route('/checkUniquePackingSlipNumber')
        .post(PackingSlipController.checkUniquePackingSlipNumber);

    router.route('/getPackingSlipDocumentCount')
        .post(PackingSlipController.getPackingSlipDocumentCount);

    router.route('/getPackingSlipMaterialDetailStatus')
        .post(PackingSlipController.getPackingSlipMaterialDetailStatus);

    router.route('/getAllPackingInvoiceByReceiptTypeList/:id/:type')
        .get(PackingSlipController.getAllPackingInvoiceByReceiptTypeList);

    router.route('/getPackingSlipInvoice')
        .post(PackingSlipController.getPackingSlipInvoice);

    router.route('/companyConfigurationCheck')
        .get(PackingSlipController.companyConfigurationCheck);

    router.route('/saveCurrentPackingSlipMaterialMemo')
        .post(PackingSlipController.saveCurrentPackingSlipMaterialMemo);

    router.route('/discardScanDocument/:fileName')
        .delete(PackingSlipController.discardScanDocument);

    router.route('/getScanDocument')
        .post(PackingSlipController.getScanDocument);

    router.route('/checkBinContainSinglePackingSlip')
        .post(PackingSlipController.checkBinContainSinglePackingSlip);

    router.route('/getSupplierInvoiceList')
        .post(PackingSlipController.getSupplierInvoiceList);

    router.route('/getCreditDebitMemoDetails')
        .post(PackingSlipController.getCreditDebitMemoDetails);

    router.route('/getPackingSlipDetailByPackingSlipNumber')
        .post(PackingSlipController.getPackingSlipDetailByPackingSlipNumber);

    router.route('/getListOfSamePackingSlip')
        .post(PackingSlipController.getListOfSamePackingSlip);

    router.route('/saveInvoiceAndInvoiceLineDetail')
        .post(PackingSlipController.saveInvoiceAndInvoiceLineDetail);

    router.route('/reGetInvoiceDetail')
        .post(PackingSlipController.reGetInvoiceDetail);

    /* router.route('/generateDabitMemoNumber')
        .post(PackingSlipController.generateDabitMemoNumber);*/

    router.route('/getOldDebitMemoData')
        .post(PackingSlipController.getOldDebitMemoData);

    router.route('/getMemoApproveNoteDetails')
        .post(PackingSlipController.getMemoApproveNoteDetails);

    router.route('/getOldMemoDetailsById')
        .post(PackingSlipController.getOldMemoDetailsById);

    router.route('/getPackingSlipMaterialReceivePartInspectionDetail')
        .post(PackingSlipController.getPackingSlipMaterialReceivePartInspectionDetail);

    router.route('/updateMaterialReceivePartInstructionStatus')
        .post(PackingSlipController.updateMaterialReceivePartInstructionStatus);

    router.route('/getPurchaseCommentList')
        .post(PackingSlipController.getPurchaseCommentList);

    router.route('/getPackaingslipPaymentToInformation')
        .post(PackingSlipController.getPackaingslipPaymentToInformation);

    router.route('/retrieveSupplierInvoicePayments')
        .post(PackingSlipController.retrieveSupplierInvoicePayments);

    router.route('/retrieveSupplierInvoicePaymentHistory')
        .post(PackingSlipController.retrieveSupplierInvoicePaymentHistory);

    router.route('/retrieveSupplierInvoicePaymentLines')
        .post(PackingSlipController.retrieveSupplierInvoicePaymentLines);

    router.route('/deleteSupplierInvoicePayment')
        .post(PackingSlipController.deleteSupplierInvoicePayment);

    router.route('/getAllPaidPaymentOrCheckNumberBySearch')
        .post(PackingSlipController.getAllPaidPaymentOrCheckNumberBySearch);

    router.route('/getSupplierRMAList')
        .post(PackingSlipController.getSupplierRMAList);

    router.route('/checkUniqueRMANumber')
        .post(PackingSlipController.checkUniqueRMANumber);

    router.route('/saveRMADetail')
        .post(PackingSlipController.saveRMADetail);

    router.route('/getPackingSlipBySearch')
        .post(PackingSlipController.getPackingSlipBySearch);

    router.route('/saveRMALineDetail')
        .post(PackingSlipController.saveRMALineDetail);

    router.route('/deleteSupplierRMAMaterial')
        .post(PackingSlipController.deleteSupplierRMAMaterial);

    router.route('/getSupplierPnByIdPackagingMfg')
        .post(PackingSlipController.getSupplierPnByIdPackagingMfg);

    router.route('/deleteInvoiceMemo')
        .post(PackingSlipController.deleteInvoiceMemo);

    router.route('/getSupplierInvoicePaymentDetailsList')
        .post(PackingSlipController.getSupplierInvoicePaymentDetailsList);

    router.route('/approveSupplierInvoice')
        .post(PackingSlipController.approveSupplierInvoice);

    router.route('/getHistoryOfPackingSlip')
        .post(PackingSlipController.getHistoryOfPackingSlip);

    router.route('/retrieveSupplierPaymentBalanceAndPastDue')
        .post(PackingSlipController.retrieveSupplierPaymentBalanceAndPastDue);

    router.route('/checkPOLinesforPart')
        .post(PackingSlipController.checkPOLinesforPart);

    router.route('/getPSLineOfSameMFPNList')
        .post(PackingSlipController.getPSLineOfSameMFPNList);

    router.route('/getSupplierRMAStockList')
        .post(PackingSlipController.getSupplierRMAStockList);

    router.route('/checkBinContainSamePSAndPart')
        .post(PackingSlipController.checkBinContainSamePSAndPart);

    router.route('/checkRelationOfStockAndRMA')
        .post(PackingSlipController.checkRelationOfStockAndRMA);

    router.route('/gelReleaseLinesForPO')
        .post(PackingSlipController.gelReleaseLinesForPO);

    router.route('/getSOListFromPO')
        .post(PackingSlipController.getSOListFromPO);

    router.route('/lockTransaction')
        .post(PackingSlipController.lockTransaction);

    router.route('/getSupplierMemoListForRefund')
        .post(PackingSlipController.getSupplierMemoListForRefund);

    router.route('/saveSupplierRefund')
        .post(PackingSlipController.saveSupplierRefund);

    router.route('/voidAndReissueSupplierRefund')
        .post(PackingSlipController.voidAndReissueSupplierRefund);

    router.route('/validateDuplicateSupplierRefundCheckNumber')
        .post(PackingSlipController.validateDuplicateSupplierRefundCheckNumber);

    router.route('/getAllPOLineIdForExternalPO')
        .post(PackingSlipController.getAllPOLineIdForExternalPO);

    router.route('/checkLineExistsForExternalPO')
        .post(PackingSlipController.checkLineExistsForExternalPO);

    router.route('/deleteSupplierInvoiceAndMemo')
        .post(PackingSlipController.deleteSupplierInvoiceAndMemo);

    router.route('/getPackingSlipStatus')
        .post(PackingSlipController.getPackingSlipStatus);

    router.route('/checkPSContainingPendingLine')
        .post(PackingSlipController.checkPSContainingPendingLine);

    router.route('/checkSameBinAndDifferentStatus')
        .post(PackingSlipController.checkSameBinAndDifferentStatus);

    router.route('/checkDuplicateParentWarehouseExists')
        .post(PackingSlipController.checkDuplicateParentWarehouseExists);

    router.route('/savePackingSlipBinDetails')
        .post(PackingSlipController.savePackingSlipBinDetails);

    router.route('/checkPackingSlipCustConsignedStatus')
        .post(PackingSlipController.checkPackingSlipCustConsignedStatus);

    router.route('/createAndUploadInspectionRequirmentReportInDocuments')
        .post(PackingSlipController.createAndUploadInspectionRequirmentReportInDocuments);

    router.route('/checkPackingSlipNonUMIDStockStatus')
        .post(PackingSlipController.checkPackingSlipNonUMIDStockStatus);

    router.route('/checkSameBinWithSamePartAndSamePackaging')
        .post(PackingSlipController.checkSameBinWithSamePartAndSamePackaging);

    app.use(
        '/api/v1/packing_slip',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};