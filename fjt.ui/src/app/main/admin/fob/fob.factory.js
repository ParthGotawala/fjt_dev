(function () {
  'use strict';

  angular
    .module('app.admin.fob')
    .factory('FOBFactory', FOBFactory);
  /** @ngInject */
  function FOBFactory($resource, CORE) {
    return {
      getFOBList: () => $resource(CORE.API_URL + 'fob/getFOBList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getFobById: () => $resource(CORE.API_URL + 'fob/getFobById/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveFOB: () => $resource(CORE.API_URL + 'fob/saveFOB/', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      checkDuplicateFOB: () => $resource(CORE.API_URL + 'fob/checkDuplicateFOB', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteFOB: () => $resource(CORE.API_URL + 'fob/deleteFOB', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveFOBList: () => $resource(CORE.API_URL + 'fob/retrieveFOBList', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      })
    };
  }
})();
