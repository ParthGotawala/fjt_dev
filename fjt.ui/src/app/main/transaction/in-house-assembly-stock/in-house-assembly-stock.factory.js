(function () {
  'use strict';

  angular
    .module('app.transaction.inhouseassemblystock')
    .factory('InHouseAssemblyStockFactory', InHouseAssemblyStockFactory);

  /** @ngInject */
  function InHouseAssemblyStockFactory($resource, CORE) {
    return {
      getVUWorkorderReadyassyStk: () => $resource(CORE.API_URL + 'workorder_assembly_excessstock_location/getVUWorkorderReadyassyStk', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
