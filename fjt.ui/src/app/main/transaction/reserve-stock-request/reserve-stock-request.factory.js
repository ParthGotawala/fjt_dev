(function () {
  'use strict';

  angular.module('app.transaction.reserveStockRequest').factory('ReserveStockRequestFactory', ReserveStockRequestFactory);
  /** @ngInject */
  function ReserveStockRequestFactory($resource, CORE) {
    return {
      getRequestList: (param) => $resource(CORE.API_URL + 'reserve_stock_request/getRequestList', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      getRequestDet: () => $resource(CORE.API_URL + 'reserve_stock_request/getRequestDet/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveRequest: () => $resource(CORE.API_URL + 'reserve_stock_request/saveRequest', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteRequest: () => $resource(CORE.API_URL + 'reserve_stock_request/deleteRequest', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
