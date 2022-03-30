(function () {
  'use strict';

  angular
    .module('app.configuration.configuresearch')
    .factory('ConfigureSearchFactory', ConfigureSearchFactory);

  /** @ngInject */
  function ConfigureSearchFactory($resource, CORE) {
    return {
      generateJSONofEntity: (param) => $resource(CORE.API_URL + 'utility/generateJSONofEntity', {},
        {
          query: {
            isArray: false
          }
        }),
      retriveEntityList: (param) => $resource(CORE.API_URL + 'enterprise_search/retriveEntityList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updateEntityDisplayOrder: (param) => $resource(CORE.API_URL + 'enterprise_search/updateEntityDisplayOrder/', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      configureSearch: (param) => $resource(CORE.API_URL + 'enterprise_search/addTransaction/', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      removeTypeWise: (param) => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/RemoveTypeWise', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveCountTypeWise: () => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/RetriveCountTypeWise', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getModuleCount: (param) => $resource(CORE.API_URL + 'enterprise_search/getModuleCount', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      removeAllNullableRecords: () => $resource(CORE.ENTERPRISE_SEARCH_URL + 'EnterpriseSearch/removeAllNullableRecords', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
