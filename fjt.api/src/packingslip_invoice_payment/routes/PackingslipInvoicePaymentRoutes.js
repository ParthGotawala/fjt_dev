const router = require('express').Router(); // eslint-disable-line
const PackingslipInvoicePaymentController = require('../controllers/PackingslipInvoicePaymentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/retrieveCustomerPayments')
        .post(PackingslipInvoicePaymentController.retrieveCustomerPayments);

    router.route('/getAllInvoiceOfCustomerPayment')
        .post(PackingslipInvoicePaymentController.getAllInvoiceOfCustomerPayment);

    router.route('/createCustomerPayment')
        .post(PackingslipInvoicePaymentController.createCustomerPayment);

    router.route('/createCustomerRefund')
        .post(PackingslipInvoicePaymentController.createCustomerRefund);

    router.route('/getCustInvPaymentMstData')
        .post(PackingslipInvoicePaymentController.getCustInvPaymentMstData);

    router.route('/getCustRefundMstData')
        .post(PackingslipInvoicePaymentController.getCustRefundMstData);

    router.route('/updateCustomerPayment')
        .post(PackingslipInvoicePaymentController.updateCustomerPayment);

    router.route('/updateCustomerRefund')
        .post(PackingslipInvoicePaymentController.updateCustomerRefund);

    router.route('/getAllCustPaymentCheckNumberList')
        .post(PackingslipInvoicePaymentController.getAllCustPaymentCheckNumberList);

    router.route('/getAllCreditMemoOfCustomerPayment')
        .post(PackingslipInvoicePaymentController.getAllCreditMemoOfCustomerPayment);

    router.route('/deleteCustomerPayment')
        .post(PackingslipInvoicePaymentController.deleteCustomerPayment);

    router.route('/lockUnlockCustomerPayment')
        .post(PackingslipInvoicePaymentController.lockUnlockCustomerPayment);

    router.route('/retrieveCustInvPaymentDetailList')
        .post(PackingslipInvoicePaymentController.retrieveCustInvPaymentDetailList);

    router.route('/getAllRefundPaymentOfCustomer')
        .post(PackingslipInvoicePaymentController.getAllRefundPaymentOfCustomer);

    router.route('/getAllCreditMemoOfCustomerRefund')
        .post(PackingslipInvoicePaymentController.getAllCreditMemoOfCustomerRefund);

    router.route('/retrieveCustomerRefunds')
        .post(PackingslipInvoicePaymentController.retrieveCustomerRefunds);

    router.route('/retrieveCustomerRefundsDetailList')
        .post(PackingslipInvoicePaymentController.retrieveCustomerRefundsDetailList);

    router.route('/retrieveCustRefundedListByRefTrans')
        .post(PackingslipInvoicePaymentController.retrieveCustRefundedListByRefTrans);

    router.route('/checkDuplicateRefundPaymentCheckNum')
        .post(PackingslipInvoicePaymentController.checkDuplicateRefundPaymentCheckNum);

    router.route('/getCustSuppRefundListByPaymentNum')
        .post(PackingslipInvoicePaymentController.getCustSuppRefundListByPaymentNum);

    router.route('/lockUnlockAppliedCustCreditMemo')
        .post(PackingslipInvoicePaymentController.lockUnlockAppliedCustCreditMemo);
    app.use(
        '/api/v1/invoicepayment',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
