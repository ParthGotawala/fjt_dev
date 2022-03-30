(function () {
  'use strict';

  angular
    .module('app.admin.assemblyStock')
    .factory('AssemblyStockFactory', ['$resource', 'CORE', AssemblyStockFactory]);

  function AssemblyStockFactory($resource, CORE) {
    return {
      assemblyStockList: () => $resource(CORE.API_URL + 'assemblyStocks/assemblyStockList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      assemblyStock: () => $resource(CORE.API_URL + 'assemblyStocks/:id', {
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
      deleteAssemblyStock: () => $resource(CORE.API_URL + 'assemblyStocks/deleteAssemblyStock', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSameAssyStockWOEntryData: () => $resource(CORE.API_URL + 'assemblyStocks/getSameAssyStockWOEntryData', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();

