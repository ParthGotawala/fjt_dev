(function () {
  'use strict';

  angular.module('app.transaction.searchMaterial').factory('SearchMaterialFactory', SearchMaterialFactory);
  /** @ngInject */
  function SearchMaterialFactory($resource, CORE) {
    return {

      getSearchMaterialDetailOfBOM: () => $resource(CORE.API_URL + 'kit_allocation/getSearchMaterialDetailOfBOM', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getSearchMaterialDetailOfUMID: () => $resource(CORE.API_URL + 'kit_allocation/getSearchMaterialDetailOfUMID', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
