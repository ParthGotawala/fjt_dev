(function () {
  'use strict';

  angular
    .module('app.admin.operatingtemperatureconversion')
    .factory('OperatingTemperatureConversionFactory', OperatingTemperatureConversionFactory);

  /** @ngInject */
  function OperatingTemperatureConversionFactory($resource, $http, CORE) {
    return {
      retrieveOperatingTemperatureConversionById: () => $resource(CORE.API_URL + 'operatingtemperatureconversion/retrieveOperatingTemperatureConversionById/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      operatingtemperatureconversion: () => $resource(CORE.API_URL + 'operatingtemperatureconversion/:id', {
        id: '@_id',
      }, {
        query: {
          isArray: false,
          method: 'GET',
        },
        update: {
          method: 'PUT',
        },
      }),

      retrieveOperatingTemperatureConversionList: () => $resource(CORE.API_URL + 'operatingtemperatureconversion/retrieveOperatingTemperatureConversionList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteOperatingTemperatureConversion: () => $resource(CORE.API_URL + 'operatingtemperatureconversion/deleteOperatingTemperatureConversion', {
        listObj: '@_listObj',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
    }
  }

})();
