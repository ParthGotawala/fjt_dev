(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .factory('CustomerPackingSlipFactory', CustomerPackingSlipFactory);

  /** @ngInject */
  function CustomerPackingSlipFactory($resource, CORE, $http) {
    return {

      getPendingSalsorderDetails: () => $resource(CORE.API_URL + 'customerPackingSlip/getPendingSalsorderDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      saveCustomerPackingSlip: () => $resource(CORE.API_URL + 'customerPackingSlip/saveCustomerPackingSlip', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getPackingSlipDetailByID: () => $resource(CORE.API_URL + 'customerPackingSlip/getPackingSlipDetailByID/:id/:transType', { id: '@_id', transType: '@_transType'}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      updateCustomerPackingSlip: () => $resource(CORE.API_URL + 'customerPackingSlip/updateCustomerPackingSlip', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getPendingSalesShippingDetails: () => $resource(CORE.API_URL + 'customerPackingSlip/getPendingSalesShippingDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveCustomerPackingSlipShippingDeatils: () => $resource(CORE.API_URL + 'customerPackingSlip/saveCustomerPackingSlipShippingDeatils', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerPackingShippingDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerPackingShippingDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getCustomerPackingSlipDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerPackingSlipDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteCustomerPackingSlip: () => $resource(CORE.API_URL + 'customerPackingSlip/deleteCustomerPackingSlip', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      deleteCustomerInvoice: () => $resource(CORE.API_URL + 'customerPackingSlip/deleteCustomerInvoice', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getCustomerPackingSlipTransferQty: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerPackingSlipTransferQty/:partID', { partID: '@_partID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getPackingSlipDetails: () => $resource(CORE.API_URL + 'customerPackingSlip/getPackingSlipDetails/', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getShippedPackingslipDetails: () => $resource(CORE.API_URL + 'customerPackingSlip/getShippedPackingslipDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteCustomerPackingSlipDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/deleteCustomerPackingSlipDetail', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      customerPackingchangehistory: () => $resource(CORE.API_URL + 'customerPackingSlip/customerPackingchangehistory', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveInvoicelist: () => $resource(CORE.API_URL + 'customerPackingSlip/retriveInvoicelist', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getCustomerPackingSlipDetailByPackingSlipNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerPackingSlipDetailByPackingSlipNumber', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      saveCustomerInvoiceMasterDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/saveCustomerInvoiceMasterDetail', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getCustomerInvoiceDetailByID: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerInvoiceDetailByID/:id/:transType', { id: '@_id', transType: '@_transType' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveCustomerInvoiceSubDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/saveCustomerInvoiceSubDetail', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      paidCustomerPackingSlip: () => $resource(CORE.API_URL + 'customerPackingSlip/paidCustomerPackingSlip', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkGeneratedInvoiceNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/checkGeneratedInvoiceNumber/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getCustomerPackingSlipNumberForUI: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerPackingSlipNumberForUI', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPendingCustomerSalesDetails: () => $resource(CORE.API_URL + 'customerPackingSlip/getPendingCustomerSalesDetails/:salesorderID/:packingSlipID', { salesorderID: '@_salesorderID', packingSlipID: '@_packingSlipID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getShippedAssemblyList: () => $resource(CORE.API_URL + 'customerPackingSlip/getShippedAssemblyList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      customerPackingSlipReport: (packingslipDetails) => $http.post(CORE.REPORT_URL + 'CustomerPackingSlip/customerPackingSlipReport', packingslipDetails, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),
      getAssyCompListForCustomerPackingSlipMISC: () => $resource(CORE.API_URL + 'customerPackingSlip/getAssyCompListForCustomerPackingSlipMISC', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSOPendingShippingListForOtherCharges: () => $resource(CORE.API_URL + 'customerPackingSlip/getSOPendingShippingListForOtherCharges', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getInvoiceDocumentCount: () => $resource(CORE.API_URL + 'customerPackingSlip/getInvoiceDocumentCount', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerInvoiceReportDetails: (customerInvoiceReportDetails) => $http.post(CORE.REPORT_URL + 'CustomerInvoice/GetCustomerInvoiceReportDetails', customerInvoiceReportDetails, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),
      deleteCustomerInvoiceDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/deleteCustomerInvoiceDetail', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateInvoiceLockStatus: () => $resource(CORE.API_URL + 'customerPackingSlip/updateInvoiceLockStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniqueCreditMemoNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/checkUniqueCreditMemoNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveOtherChargesDetailInInvoiceDetail: () => $resource(CORE.API_URL + 'customerPackingSlip/saveOtherChargesDetailInInvoiceDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getUMIDListForCustomerPackingSlip: () => $resource(CORE.API_URL + 'customerPackingSlip/getUMIDListForCustomerPackingSlip', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerPackingSlipDocumentCount: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerPackingSlipDocumentCount', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniqueRefDebitMemoNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/checkUniqueRefDebitMemoNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveSalesCommissionDetailsManual: () => $resource(CORE.API_URL + 'customerPackingSlip/saveSalesCommissionDetailsManual', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerOtherExpenseByDetailId: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustomerOtherExpenseByDetailId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkMiscPackingSlipForSOPONumber: () => $resource(CORE.API_URL + 'customerPackingSlip/checkMiscPackingSlipForSOPONumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustomerCreditMemoReportDetails: (customerCreditMemoReportDetails) => $http.post(CORE.REPORT_URL + 'CreditMemoReport/getCustomerCreditMemoReportDetails', customerCreditMemoReportDetails, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),
      retrieveCustInvCurrBalanceAndPastDue: () => $resource(CORE.API_URL + 'customerPackingSlip/retrieveCustInvCurrBalanceAndPastDue', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllCreditMemoListByCustomer: () => $resource(CORE.API_URL + 'customerPackingSlip/getAllCreditMemoListByCustomer', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCreditMemoDetailForApplyInInvPayment: () => $resource(CORE.API_URL + 'customerPackingSlip/getCreditMemoDetailForApplyInInvPayment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustPackingSlipAndInvoiceTrackingNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustPackingSlipAndInvoiceTrackingNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveCustPackingSlipAndInvoiceTrackingNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/saveCustPackingSlipAndInvoiceTrackingNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesOtherByPackingSlipDetId: () => $resource(CORE.API_URL + 'customerPackingSlip/getSalesOtherByPackingSlipDetId', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustAgedRecvRangeDetails: () => $resource(CORE.API_URL + 'customerPackingSlip/getCustAgedRecvRangeDetails', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveCustomerPackingSlipFromSO: () => $resource(CORE.API_URL + 'customerPackingSlip/saveCustomerPackingSlipFromSO ', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkUniqueSOLineNumber: () => $resource(CORE.API_URL + 'customerPackingSlip/checkUniqueSOLineNumber ', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
