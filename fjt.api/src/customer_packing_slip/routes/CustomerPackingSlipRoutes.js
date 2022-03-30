const router = require('express').Router(); // eslint-disable-line
const CustomerPackingSlip = require('../controllers/CustomerPackingSlipController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
// const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/getPendingSalsorderDetails')
        .post(CustomerPackingSlip.getPendingSalsorderDetails);

    router.route('/saveCustomerPackingSlip')
        .post(CustomerPackingSlip.saveCustomerPackingSlip);

    router.route('/getPackingSlipDetailByID/:id/:transType')
        .get(CustomerPackingSlip.getPackingSlipDetailByID);

    router.route('/getCustomerInvoiceDetailByID/:id/:transType')
        .get(CustomerPackingSlip.getCustomerInvoiceDetailByID);

    router.route('/updateCustomerPackingSlip')
        .post(CustomerPackingSlip.updateCustomerPackingSlip);

    router.route('/getPendingSalesShippingDetails')
        .post(CustomerPackingSlip.getPendingSalesShippingDetails);

    router.route('/saveCustomerPackingSlipShippingDeatils')
        .post(CustomerPackingSlip.saveCustomerPackingSlipShippingDeatils);

    router.route('/getCustomerPackingShippingDetail')
        .post(CustomerPackingSlip.getCustomerPackingShippingDetail);

    router.route('/getCustomerPackingSlipDetail')
        .post(CustomerPackingSlip.getCustomerPackingSlipDetail);

    router.route('/deleteCustomerPackingSlip')
        .post(CustomerPackingSlip.deleteCustomerPackingSlip);

    router.route('/getCustomerPackingSlipTransferQty/:partID')
        .get(CustomerPackingSlip.getCustomerPackingSlipTransferQty);

    router.route('/getPackingSlipDetails/')
        .post(CustomerPackingSlip.getPackingSlipDetails);

    router.route('/getShippedPackingslipDetails')
        .post(CustomerPackingSlip.getShippedPackingslipDetails);
    router.route('/deleteCustomerPackingSlipDetail')
        .post(CustomerPackingSlip.deleteCustomerPackingSlipDetail);

    router.route('/deleteCustomerInvoice')
        .post(CustomerPackingSlip.deleteCustomerInvoice);

    router.route('/customerPackingchangehistory')
        .post(CustomerPackingSlip.customerPackingchangehistory);

    router.route('/retriveInvoicelist')
        .post(CustomerPackingSlip.retriveInvoicelist);

    router.route('/getCustomerPackingSlipDetailByPackingSlipNumber')
        .post(CustomerPackingSlip.getCustomerPackingSlipDetailByPackingSlipNumber);

    router.route('/saveCustomerInvoiceMasterDetail')
        .post(CustomerPackingSlip.saveCustomerInvoiceMasterDetail);

    router.route('/saveCustomerInvoiceSubDetail')
        .post(CustomerPackingSlip.saveCustomerInvoiceSubDetail);

    router.route('/paidCustomerPackingSlip')
        .post(CustomerPackingSlip.paidCustomerPackingSlip);

    router.route('/checkGeneratedInvoiceNumber/:id')
        .get(CustomerPackingSlip.checkGeneratedInvoiceNumber);

    router.route('/getCustomerPackingSlipNumberForUI')
        .post(CustomerPackingSlip.getCustomerPackingSlipNumberForUI);

    router.route('/getPendingCustomerSalesDetails/:salesorderID/:packingSlipID')
        .get(CustomerPackingSlip.getPendingCustomerSalesDetails);

    router.route('/getShippedAssemblyList')
        .post(CustomerPackingSlip.getShippedAssemblyList);

    router.route('/getAssyCompListForCustomerPackingSlipMISC')
        .post(CustomerPackingSlip.getAssyCompListForCustomerPackingSlipMISC);

    router.route('/getSOPendingShippingListForOtherCharges')
        .post(CustomerPackingSlip.getSOPendingShippingListForOtherCharges);

    router.route('/getInvoiceDocumentCount')
        .post(CustomerPackingSlip.getInvoiceDocumentCount);

    router.route('/updateInvoiceLockStatus')
        .post(CustomerPackingSlip.updateInvoiceLockStatus);

    router.route('/deleteCustomerInvoiceDetail')
        .post(CustomerPackingSlip.deleteCustomerInvoiceDetail);

    router.route('/checkUniqueCreditMemoNumber')
        .post(CustomerPackingSlip.checkUniqueCreditMemoNumber);

    router.route('/saveOtherChargesDetailInInvoiceDetail')
        .post(CustomerPackingSlip.saveOtherChargesDetailInInvoiceDetail);

    router.route('/getUMIDListForCustomerPackingSlip')
        .post(CustomerPackingSlip.getUMIDListForCustomerPackingSlip);

    router.route('/getCustomerPackingSlipDocumentCount')
        .post(CustomerPackingSlip.getCustomerPackingSlipDocumentCount);

    router.route('/checkUniqueRefDebitMemoNumber')
        .post(CustomerPackingSlip.checkUniqueRefDebitMemoNumber);

    router.route('/retrieveCustInvCurrBalanceAndPastDue')
        .post(CustomerPackingSlip.retrieveCustInvCurrBalanceAndPastDue);

    router.route('/saveSalesCommissionDetailsManual')
        .post(CustomerPackingSlip.saveSalesCommissionDetailsManual);

    router.route('/getCustomerOtherExpenseByDetailId')
        .post(CustomerPackingSlip.getCustomerOtherExpenseByDetailId);

    router.route('/checkMiscPackingSlipForSOPONumber')
        .post(CustomerPackingSlip.checkMiscPackingSlipForSOPONumber);


    router.route('/getAllCreditMemoListByCustomer')
        .post(CustomerPackingSlip.getAllCreditMemoListByCustomer);

    router.route('/getCreditMemoDetailForApplyInInvPayment')
        .post(CustomerPackingSlip.getCreditMemoDetailForApplyInInvPayment);

    router.route('/getCustPackingSlipAndInvoiceTrackingNumber')
        .post(CustomerPackingSlip.getCustPackingSlipAndInvoiceTrackingNumber);

    router.route('/saveCustPackingSlipAndInvoiceTrackingNumber')
        .post(CustomerPackingSlip.saveCustPackingSlipAndInvoiceTrackingNumber);

    router.route('/getSalesOtherByPackingSlipDetId')
        .post(CustomerPackingSlip.getSalesOtherByPackingSlipDetId);

    router.route('/getCustAgedRecvRangeDetails')
        .post(CustomerPackingSlip.getCustAgedRecvRangeDetails);

    router.route('/saveCustomerPackingSlipFromSO')
        .post(CustomerPackingSlip.saveCustomerPackingSlipFromSO);

    router.route('/checkUniqueSOLineNumber')
        .post(CustomerPackingSlip.checkUniqueSOLineNumber);

    app.use(
        '/api/v1/customerPackingSlip',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
