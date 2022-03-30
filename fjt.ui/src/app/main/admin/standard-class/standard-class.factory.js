(function () {
  'use strict';

  angular
    .module('app.admin.standardClass')
    .factory('StandardClassFactory', ['$resource', 'CORE', StandardClassFactory]);

  function StandardClassFactory($resource, CORE) {
    return {
      standardClass: () => $resource(CORE.API_URL + 'standardClass/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveStandardClassList: () => $resource(CORE.API_URL + 'standardClass/retriveStandardClassList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCertificateStandard: () => $resource(CORE.API_URL + 'getCertificateStandard', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      standardtreeviewData: () => $resource(CORE.API_URL + 'standardClass/standardtreeviewData/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {}
        }
      }),
      deleteStandardClass: () => $resource(CORE.API_URL + 'standardClass/deleteStandardClass', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      checkDuplicateCategory: () => $resource(CORE.API_URL + 'standardClass/checkDuplicateCategory', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getStandardClassListByStandardId: () => $resource(CORE.API_URL + 'standardClass/getStandardClassListByStandardId/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      })
    };
  }
})();
