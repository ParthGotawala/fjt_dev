(function () {
  'use strict';

  angular
    .module('app.admin.assyType')
    .factory('AssyTypeFactory', AssyTypeFactory);

  /** @ngInject */
  function AssyTypeFactory($resource, CORE) {
    return {
      retriveAssyType: () => $resource(CORE.API_URL + 'assyType/retriveAssyType', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      retriveAssyTypeList: () => $resource(CORE.API_URL + 'assyType/retriveAssyTypeList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      saveAssyType: () => $resource(CORE.API_URL + 'assyType/saveAssyType/', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      findSameAssyType: () => $resource(CORE.API_URL + 'assyType/findSameAssyType/', {},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),

      deleteAssyType: () => $resource(CORE.API_URL + 'assyType/deleteAssyType', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getAssyTypeList: () => $resource(CORE.API_URL + 'assyType/getAssyTypeList', {
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      updateAssyTypeDisplayOrder: () => $resource(CORE.API_URL + 'assyType/updateAssyTypeDisplayOrder', {
        assyTypeModel: '@_assyTypeModel'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
