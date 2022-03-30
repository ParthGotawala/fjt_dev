(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('InHouseAssemblyStockPopupFactory', InHouseAssemblyStockPopupFactory);

  /** @ngInject */
  function InHouseAssemblyStockPopupFactory($resource, CORE) {
    return {
      getWOAssyExcessStockLocationList: () => $resource(CORE.API_URL + 'workorder_assembly_excessstock_location/getWOAssyExcessStockLocationList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveWOAssyExcessStockLocation: () => $resource(CORE.API_URL + 'workorder_assembly_excessstock_location/saveWOAssyExcessStockLocation', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteWOAssyExcessStockLocation: () => $resource(CORE.API_URL + 'workorder_assembly_excessstock_location/deleteWOAssyExcessStockLocation', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
    }
  }
})();
