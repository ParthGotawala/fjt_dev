(function () {
  'use strict';

  angular.module('app.transaction.kitAllocation').factory('KitAllocationFactory', KitAllocationFactory);
  /** @ngInject */
  function KitAllocationFactory($resource, CORE, $http) {
    return {

      getKitAllocationList: () => $resource(CORE.API_URL + 'kit_allocation/getKitAllocationList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getStockAllocateList: () => $resource(CORE.API_URL + 'kit_allocation/getStockAllocateList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      saveStockAllocateList: () => $resource(CORE.API_URL + 'kit_allocation/saveStockAllocateList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      checkBOMAndGetKitAllocationList: () => $resource(CORE.API_URL + 'kit_allocation/checkBOMAndGetKitAllocationList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      kitAllocationAssyList: () => $resource(CORE.API_URL + 'kit_allocation/kitAllocationAssyList/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getKitAllocationConsolidatedList: () => $resource(CORE.API_URL + 'kit_allocation/getKitAllocationConsolidatedList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      reCalculateKitAllocation: () => $resource(CORE.API_URL + 'kit_allocation/reCalculateKitAllocation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getAllocatedKitList: () => $resource(CORE.API_URL + 'kit_allocation/getAllocatedKitList', null, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getAllocatedKitForUMID: (param) => $resource(CORE.API_URL + 'kit_allocation/getAllocatedKitForUMID', null, {
        query: {
          method: 'GET',
          isArray: false,
          params: param ? {
            umidId: param && param.umidId ? param.umidId : null
          } : null
        }
      }),
      deallocateUMIDFromKit: () => $resource(CORE.API_URL + 'kit_allocation/deallocateUMIDFromKit', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getKitFeasibility: () => $resource(CORE.API_URL + 'kit_allocation/getKitFeasibility', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      kitRelease: () => $resource(CORE.API_URL + 'kit_allocation/kitRelease', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWOForKitRelease: (param) => $resource(CORE.API_URL + 'kit_allocation/getWOForKitRelease', null, {
        query: {
          method: 'GET',
          isArray: false,
          params: param ? {
            assyID: param && param.assyID ? param.assyID : null,
            refSalesOrderDetID: param && param.refSalesOrderDetID ? param.refSalesOrderDetID : null
          } : null
        }
      }),
      getKitReleaseSummaryAndStatus: (param) => $resource(CORE.API_URL + 'kit_allocation/getKitReleaseSummaryAndStatus', null, {
        query: {
          method: 'GET',
          isArray: false,
          params: param ? {
            assyID: param && param.assyID ? param.assyID : null,
            refSalesOrderDetID: param && param.refSalesOrderDetID ? param.refSalesOrderDetID : null,
            mainAssyId: param && param.mainAssyId ? param.mainAssyId : null,
            isConsolidated: param && param.isConsolidated ? param.isConsolidated : false
          } : null
        }
      }),
      getKitAllocationFilterList: () => $resource(CORE.API_URL + 'kit_allocation/getKitAllocationFilterList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getKitReleasePlanDetail: () => $resource(CORE.API_URL + 'kit_allocation/getKitReleasePlanDetail', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllocatedUMIDCount: () => $resource(CORE.API_URL + 'kit_allocation/getAllocatedUMIDCount', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      returnKit: () => $resource(CORE.API_URL + 'kit_allocation/returnKit', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getHoldResumeStatus: (param) => $resource(CORE.API_URL + 'kit_allocation/getHoldResumeStatus', null, {
        query: {
          method: 'GET',
          isArray: false,
          params: param ? {
            salesOrderDetId: param && param.salesOrderDetId ? param.salesOrderDetId : null,
            refType: param && param.refType ? param.refType : null
          } : null
        }
      }),
      initiateKitReturn: () => $resource(CORE.API_URL + 'kit_allocation/initiateKitReturn', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getKitAllocationExportFile: (requestObj) => $http.post(CORE.API_URL + 'kit_allocation/getKitAllocationExportFile', requestObj, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),

      getKitallocationLineDetails: () => $resource(CORE.API_URL + 'kit_allocation/getKitallocationLineDetails ', null, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveCustconsignStatusForKitLineItem: () => $resource(CORE.API_URL + 'kit_allocation/saveCustconsignStatusForKitLineItem ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCustConsignMismatchKitAllocationDetails: () => $resource(CORE.API_URL + 'kit_allocation/getCustConsignMismatchKitAllocationDetails ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getReleaseReturnHistoryList: () => $resource(CORE.API_URL + 'kit_allocation/getReleaseReturnHistoryList ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveKitList: () => $resource(CORE.API_URL + 'kit_allocation/retrieveKitList ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCountOfSubAssemblyKits: () => $resource(CORE.API_URL + 'kit_allocation/getCountOfSubAssemblyKits ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssemblyTreeViewList: () => $resource(CORE.API_URL + 'kit_allocation/getAssemblyTreeViewList ', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
