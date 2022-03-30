(function () {
  'use strict';

  angular
    .module('app.enterprisesearch')
    .factory('EnterpriseSearchFactory', EnterpriseSearchFactory);

  /** @ngInject */
  function EnterpriseSearchFactory($resource, CORE) {
    return {
      retriveTypeWise: () => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/RetriveTypeWise', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveAll: () => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/RetriveAll', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveAdvanceSearch: () => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/RetriveAdvanceSearch', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveTypeWiseAdvanceSearch: () => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/RetriveTypeWiseAdvanceSearch', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
