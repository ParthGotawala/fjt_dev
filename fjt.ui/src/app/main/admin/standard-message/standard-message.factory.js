(function () {
  'use strict';

  angular
    .module('app.admin.standardmessage')
    .factory('StandardMessageFactory', StandardMessageFactory);

  /** @ngInject */
  function StandardMessageFactory($resource, CORE) {
    return {
      retriveStandardMessageList: () => $resource(CORE.API_URL + 'standardmessage/retriveStandardMessageList', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      standardmessage: () => $resource(CORE.API_URL + 'standardmessage/:id', {
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
      deleteStandardMessage: () => $resource(CORE.API_URL + 'standardmessage/deleteStandardMessage', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkUniqueForMessage: () => $resource(CORE.API_URL + 'standardmessage/checkUniqueMessage', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
