(function () {
  'use strict';

  angular.module('app.transaction.supplierRMA').factory('SupplierRMAFactory', SupplierRMAFactory);
  /** @ngInject */
  function SupplierRMAFactory($resource, CORE, $http) {
    return {
      getSupplierRMAList: () => $resource(CORE.API_URL + 'packing_slip/getSupplierRMAList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniqueRMANumber: () => $resource(CORE.API_URL + 'packing_slip/checkUniqueRMANumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveRMADetail: () => $resource(CORE.API_URL + 'packing_slip/saveRMADetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPackingSlipBySearch: () => $resource(CORE.API_URL + 'packing_slip/getPackingSlipBySearch', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveRMALineDetail: () => $resource(CORE.API_URL + 'packing_slip/saveRMALineDetail', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteSupplierRMAMaterial: () => $resource(CORE.API_URL + 'packing_slip/deleteSupplierRMAMaterial', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSupplierPnByIdPackagingMfg: () => $resource(CORE.API_URL + 'packing_slip/getSupplierPnByIdPackagingMfg', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSupplierRMAReport: (supplierRMAReportDetails) => $http.post(CORE.REPORT_URL + 'SupplierRMAReport/getSupplierRMAReport', supplierRMAReportDetails, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error)
    };
  }
})();
