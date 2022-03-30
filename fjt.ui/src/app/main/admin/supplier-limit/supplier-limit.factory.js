(function () {
  'use strict';

  angular
    .module('app.admin.supplierlimit')
    .factory('SupplierLimitFactory', SupplierLimitFactory);

  /** @ngInject */
  function SupplierLimitFactory($resource, CORE) {
    return {
      SupplierLimits: (param) => $resource(CORE.API_URL + 'supplierLimits/', {
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      })
    };
  }
})();
