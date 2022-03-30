(function () {
  'use strict';

  angular
    .module('app.transaction')
    .factory('SupplierInvoiceFactory', SupplierInvoiceFactory);

  /** @ngInject */
  function SupplierInvoiceFactory($resource, CORE, $http) {
    return {
      getSupplierInvoiceList: () => $resource(CORE.API_URL + 'packing_slip/getSupplierInvoiceList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getPackingSlipDetailByPackingSlipNumber: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipDetailByPackingSlipNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getListOfSamePackingSlip: () => $resource(CORE.API_URL + 'packing_slip/getListOfSamePackingSlip', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      saveInvoiceAndInvoiceLineDetail: () => $resource(CORE.API_URL + 'packing_slip/saveInvoiceAndInvoiceLineDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      reGetInvoiceDetail: () => $resource(CORE.API_URL + 'packing_slip/reGetInvoiceDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

     /* generateDabitMemoNumber: () => $resource(CORE.API_URL + 'packing_slip/generateDabitMemoNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),*/

      getOldDebitMemoData: () => $resource(CORE.API_URL + 'packing_slip/getOldDebitMemoData', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getMemoApproveNoteDetails: () => $resource(CORE.API_URL + 'packing_slip/getMemoApproveNoteDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      companyConfigurationCheck: () => $resource(CORE.API_URL + 'packing_slip/companyConfigurationCheck', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getCreditDebitMemoDetails: () => $resource(CORE.API_URL + 'packing_slip/getCreditDebitMemoDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getOldMemoDetailsById: () => $resource(CORE.API_URL + 'packing_slip/getOldMemoDetailsById', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSupplierInvoicePayments: () => $resource(CORE.API_URL + 'packing_slip/retrieveSupplierInvoicePayments', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSupplierInvoicePaymentHistory: () => $resource(CORE.API_URL + 'packing_slip/retrieveSupplierInvoicePaymentHistory', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveSupplierInvoicePaymentLines: () => $resource(CORE.API_URL + 'packing_slip/retrieveSupplierInvoicePaymentLines', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteSupplierInvoicePayment: () => $resource(CORE.API_URL + 'packing_slip/deleteSupplierInvoicePayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteInvoiceMemo: () => $resource(CORE.API_URL + 'packing_slip/deleteInvoiceMemo', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSupplierInvoicePaymentDetailsList: () => $resource(CORE.API_URL + 'packing_slip/getSupplierInvoicePaymentDetailsList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
