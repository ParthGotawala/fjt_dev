(function () {
  'use strict';
  angular.module('app.transaction.rack')
    .factory('RackFactory', RackFactory);

  function RackFactory($resource, CORE) {
    return {
      getRack: () => $resource(CORE.API_URL + 'rack/:id', {
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
      getRackList: () => $resource(CORE.API_URL + 'rack/getRackList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteRack: () => $resource(CORE.API_URL + 'rack/deleteRack', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      createRack: () => $resource(CORE.API_URL + 'rack/createRack', {}, {
        update: {
          method: 'PUT'
        }
      }),

      checkNameAlreadyExist: () => $resource(CORE.API_URL + 'rack/checkNameAlreadyExist',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      generateMultipleRack: () => $resource(CORE.API_URL + 'rack/generateMultipleRack', {
      }, {
        update: {
          method: 'POST'
        }
      }),

      generateRack: () => $resource(CORE.API_URL + 'rack/generateRack', {}, {
        update: {
          method: 'POST'
        }
      })
    };
  }
})();
