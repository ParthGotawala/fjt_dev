(function () {
  'use strict';
  angular
    .module('app.transaction.customerinvoice')
    .controller('CustomerInvoiceMainController', CustomerInvoiceMainController);

  /** @ngInject */
  function CustomerInvoiceMainController($rootScope, $scope, $state, CORE, TRANSACTION, DialogFactory) {
    const vm = this;
    vm.TRANSACTION = TRANSACTION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.currentState = $state.current.name;
    //vm.currentState = TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE;
    vm.showTab = false;
    vm.transType = $state.params.transType;
    vm.isNoDataFound = false;
    vm.isShowAgedReceivablesBtn = false;
    // console.log(vm.showTab);    
    vm.tabList = [
      { src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_STATE, title: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_LABEL },
      { src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE, title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LABEL },
      { src: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE, title: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LABEL },
      //{ src: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE, title: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_LABEL },
      { src: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE, title: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LABEL },
      { src: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE, title: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LABEL },
      { src: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE, title: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LABEL },
      { src: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LIST_STATE, title: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LABEL }
    ];

    switch (vm.currentState) {
      case TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_LABEL;
        vm.transType = CORE.TRANSACTION_TYPE.INVOICE;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LABEL;
        vm.transType = CORE.TRANSACTION_TYPE.INVOICE;
        vm.showTab = true;
        vm.isShowAgedReceivablesBtn = true;
        break;
      case TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LABEL;
        vm.transType = CORE.TRANSACTION_TYPE.CREDITNOTE;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LABEL;
        vm.showTab = true;
        vm.isShowAgedReceivablesBtn = true;
        break;
      case TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE:
      case TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_STATE:
      case TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LABEL;
        vm.showTab = true;
        vm.isShowAgedReceivablesBtn = true;
        break;
      case TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE:
      case TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_STATE:
      case TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LABEL;
        vm.showTab = true;
        vm.isShowAgedReceivablesBtn = true;
        break;
      case TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LIST_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_STATE:
      case TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LABEL;
        vm.showTab = true;
        vm.isShowAgedReceivablesBtn = true;
        break;
    }

    // for customer packing slip dynamic add button
    vm.AddCustomerPackingSlipButtonObj = {
      buttonText: 'Add Customer Packing Slip',
      buttonRoute: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE,
      buttonParams: { sdetid: 0, id: '0' }
    };

    ////Add Customer Packing Slip
    //vm.addCustomerPackingSlip = () => {
    //  $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, { sdetid: 0, id: 0 });
    //};

    // for customer invoice dynamic add button
    vm.AddCustomerInvoiceButtonObj = {
      buttonText: 'Add Customer Invoice',
      buttonRoute: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE,
      buttonParams: { transType: vm.transType, id: 0 }
    };

    ////Add Customer Invoice
    //vm.addCustomerInvoice = () => {
    //  $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { transType: vm.transType, id: 0 });
    //};

    // for customer invoice dynamic add button
    vm.AddCustomerCreditMemoButtonObj = {
      buttonText: 'Add Credit Memo',
      buttonRoute: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE,
      buttonParams: { transType: vm.transType, id: 0 }
    };

    ////Add Customer Credit Memo
    //vm.addCustomerCreditNote = () => {
    //  $state.go(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, { transType: vm.transType, id: 0 });
    //};

    // for customer invoice dynamic add button
    vm.ReceivePaymentButtonObj = {
      buttonText: 'Receive Payment',
      buttonRoute: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE,
      buttonParams: { id: 0 }
    };

    //// move at customer payment detail page to add new
    //vm.addCustomerPayment = () => {
    //  $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, { id: 0 });
    //};

    // for customer invoice dynamic add button
    vm.ApplyCustomerCreditMemoButtonObj = {
      buttonText: 'Apply Credit Memo to Invoice',
      buttonRoute: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE,
      buttonParams: { ccmid: 0, pid: null }
    };

    // for customer write off dynamic add button
    vm.applyCustomerWriteOffButtonObj = {
      buttonText: 'Apply Write Off to Invoice',
      buttonRoute: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE,
      buttonParams: { id: 0 }
    };

    vm.CutomerRefundButtonObj = {
      buttonText: 'Refund to Customer',
      buttonRoute: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE,
      buttonParams: { id: 0 }
    };

    //// move at apply customer credit memo detail page
    //vm.applyCustomerCreditMemo = () => {
    //  $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: 0, pid: null });
    //};

    // display customer current balance and past due amount - Aged Receivables
    vm.showCustCurrentBalanceAndPastDue = (event) => {
      const popupData = {};
      DialogFactory.dialogService(
        TRANSACTION.CUST_INV_CURR_BAL_AND_PAST_DUE_POPUP_CONTROLLER,
        TRANSACTION.CUST_INV_CURR_BAL_AND_PAST_DUE_POPUP_VIEW,
        event,
        popupData
      ).then(() => {
      }, () => {
      }, (err) => BaseService.getErrorLog(err));
    };
  }
})();
