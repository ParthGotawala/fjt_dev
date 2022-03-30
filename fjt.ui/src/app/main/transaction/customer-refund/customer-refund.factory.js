(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .factory('CustomerRefundFactory', CustomerRefundFactory);

  /** @ngInject */
  function CustomerRefundFactory($resource, CORE) {
    return {
      getAllCustPaymentCheckNumberList: () => $resource(CORE.API_URL + 'invoicepayment/getAllCustPaymentCheckNumberList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllRefundPaymentOfCustomer: () => $resource(CORE.API_URL + 'invoicepayment/getAllRefundPaymentOfCustomer', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustRefundMstData: () => $resource(CORE.API_URL + 'invoicepayment/getCustRefundMstData', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createCustomerRefund: () => $resource(CORE.API_URL + 'invoicepayment/createCustomerRefund', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateCustomerRefund: () => $resource(CORE.API_URL + 'invoicepayment/updateCustomerRefund', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllCreditMemoOfCustomerRefund: () => $resource(CORE.API_URL + 'invoicepayment/getAllCreditMemoOfCustomerRefund', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveCustomerRefunds: () => $resource(CORE.API_URL + 'invoicepayment/retrieveCustomerRefunds', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveCustomerRefundsDetailList: () => $resource(CORE.API_URL + 'invoicepayment/retrieveCustomerRefundsDetailList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveCustRefundedListByRefTrans: () => $resource(CORE.API_URL + 'invoicepayment/retrieveCustRefundedListByRefTrans', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateRefundPaymentCheckNum: () => $resource(CORE.API_URL + 'invoicepayment/checkDuplicateRefundPaymentCheckNum', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustSuppRefundListByPaymentNum: () => $resource(CORE.API_URL + 'invoicepayment/getCustSuppRefundListByPaymentNum', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
