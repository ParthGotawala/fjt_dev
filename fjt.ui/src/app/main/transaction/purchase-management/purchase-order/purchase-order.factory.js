(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder')
    .factory('PurchaseOrderFactory', PurchaseOrderFactory);

  /** @ngInject */
  function PurchaseOrderFactory($resource, CORE, $http) {
    return {

      getPurchaseOrderDetailByID: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderDetailByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getPurchaseOrderDetails: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderDetails', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      createPurchaseOrder: () => $resource(CORE.API_URL + 'purchaseOrder/createPurchaseOrder', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrievePurchaseOrder: () => $resource(CORE.API_URL + 'purchaseOrder/retrievePurchaseOrder/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      updatePurchaseOrder: () => $resource(CORE.API_URL + 'purchaseOrder/updatePurchaseOrder', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderMaterialPurchasePartRequirementDetail: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderMaterialPurchasePartRequirementDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderSummaryDetail: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderSummaryDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removePurchaseOrder: () => $resource(CORE.API_URL + 'purchaseOrder/removePurchaseOrder', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderPerLineDetail: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderPerLineDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponentFilterList: () => $resource(CORE.API_URL + 'purchaseOrder/getComponentFilterList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      purchaseorderchangehistory: () => $resource(CORE.API_URL + 'purchaseOrder/purchaseorderchangehistory', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderReport: (purchaseOrderReportDetails) => $http.post(CORE.REPORT_URL + 'PurchaseOrder/getPurchaseOrderReport', purchaseOrderReportDetails, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),

      updatePurchaseOrderStatus: () => $resource(CORE.API_URL + 'purchaseOrder/updatePurchaseOrderStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      savePurchaseOrderLineDetail: () => $resource(CORE.API_URL + 'purchaseOrder/savePurchaseOrderLineDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      copyPurchaseOrderDetail: () => $resource(CORE.API_URL + 'purchaseOrder/copyPurchaseOrderDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDuplicatePurchaseOrderPartRequirementList: () => $resource(CORE.API_URL + 'purchaseOrder/getDuplicatePurchaseOrderPartRequirementList/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      updatePurchaseOrderLineLevelStatus: () => $resource(CORE.API_URL + 'purchaseOrder/updatePurchaseOrderLineLevelStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderLineDetailByID: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderLineDetailByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      updatePurchaseOrderReleaseLineLevelMergeDetail: () => $resource(CORE.API_URL + 'purchaseOrder/updatePurchaseOrderReleaseLineLevelMergeDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderRequirement: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderRequirement/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      checkUniqueSOWithSupplier: () => $resource(CORE.API_URL + 'purchaseOrder/checkUniqueSOWithSupplier', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWorkOrderFilterList: () => $resource(CORE.API_URL + 'purchaseOrder/getWorkOrderFilterList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseOrderMstDetailByID: () => $resource(CORE.API_URL + 'purchaseOrder/getPurchaseOrderMstDetailByID/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      checkPartStatusOfPurchaseOrder: () => $resource(CORE.API_URL + 'purchaseOrder/checkPartStatusOfPurchaseOrder', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      checkPOLineIsClosed: () => $resource(CORE.API_URL + 'purchaseOrder/checkPOLineIsClosed/', { listObj: '@_listObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllPackingSlipByPODetID: () => $resource(CORE.API_URL + 'purchaseOrder/getAllPackingSlipByPODetID', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      lockUnlockTransaction: () => $resource(CORE.API_URL + 'purchaseOrder/lockUnlockTransaction', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkPOWorkingStatus: () => $resource(CORE.API_URL + 'purchaseOrder/checkPOWorkingStatus', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkPOConsistLine: () => $resource(CORE.API_URL + 'purchaseOrder/checkPOConsistLine', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
