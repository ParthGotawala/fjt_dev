(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .factory('CustomerPaymentFactory', CustomerPaymentFactory);

  /** @ngInject */
  function CustomerPaymentFactory($resource, CORE) {
    return {
      retrieveCustomerPayments: () => $resource(CORE.API_URL + 'invoicepayment/retrieveCustomerPayments', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllInvoiceOfCustomerPayment: () => $resource(CORE.API_URL + 'invoicepayment/getAllInvoiceOfCustomerPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createCustomerPayment: () => $resource(CORE.API_URL + 'invoicepayment/createCustomerPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustInvPaymentMstData: () => $resource(CORE.API_URL + 'invoicepayment/getCustInvPaymentMstData', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateCustomerPayment: () => $resource(CORE.API_URL + 'invoicepayment/updateCustomerPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllCustPaymentCheckNumberList: () => $resource(CORE.API_URL + 'invoicepayment/getAllCustPaymentCheckNumberList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllCreditMemoOfCustomerPayment: () => $resource(CORE.API_URL + 'invoicepayment/getAllCreditMemoOfCustomerPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteCustomerPayment: () => $resource(CORE.API_URL + 'invoicepayment/deleteCustomerPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      lockUnlockCustomerPayment: () => $resource(CORE.API_URL + 'invoicepayment/lockUnlockCustomerPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveCustInvPaymentDetailList: () => $resource(CORE.API_URL + 'invoicepayment/retrieveCustInvPaymentDetailList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      lockUnlockAppliedCustCreditMemo: () => $resource(CORE.API_URL + 'invoicepayment/lockUnlockAppliedCustCreditMemo', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
