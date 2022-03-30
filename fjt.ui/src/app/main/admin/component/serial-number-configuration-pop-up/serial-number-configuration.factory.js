(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('SerialNumberConfigurationFactory', SerialNumberConfigurationFactory);


  /** @ngInject */
  function SerialNumberConfigurationFactory($resource, CORE) {
    return {

      retriveConfiguration: (param) => $resource(CORE.API_URL + 'serialnumberconfiguration/retriveConfiguration', {},
        {
          query: {
            isArray: false,
            method: 'GET',
            params: {
              partId: param.partId,
              nickname: param.nickname
            }
          }
        }),
      saveConfiguration: () => $resource(CORE.API_URL + 'serialnumberconfiguration/saveConfiguration', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteConfiguration: () => $resource(CORE.API_URL + 'serialnumberconfiguration/deleteConfiguration', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
