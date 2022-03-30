(function () {
  'use strict';

  angular
    .module('app.transaction')
    .factory('StockAdjustmentFactory', StockAdjustmentFactory);

  /** @ngInject */
  function StockAdjustmentFactory($resource, CORE) {
    return {
      StockAdjustment: () => $resource(CORE.API_URL + 'stockAdjustment/:id', {}, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        },
        save: {
          method: 'POST'
        }
      }),
      retrieveStockAdjustmentList: () => $resource(CORE.API_URL + 'stockAdjustment/retrieveStockAdjustmentList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllAssemblyBySearch: () => $resource(CORE.API_URL + 'stockAdjustment/getAssemblyIDList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllWOorkOrderBySearch: () => $resource(CORE.API_URL + 'stockAdjustment/getWorkorderList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAvailableQty: () => $resource(CORE.API_URL + 'stockAdjustment/getAvailableQty', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteStockAdjustment: () => $resource(CORE.API_URL + 'stockAdjustment/deleteStockAdjustment', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
