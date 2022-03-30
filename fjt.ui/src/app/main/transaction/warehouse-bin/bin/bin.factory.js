(function () {
  'use strict';
  angular
    .module('app.transaction.warehousebin')
    .factory('BinFactory', BinFactory);
  /** @ngInject */
  function BinFactory($resource, CORE) {
    return {
      createBin: () => $resource(CORE.API_URL + 'binmst/createBin', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      updateBin: () => $resource(CORE.API_URL + 'binmst/updateBin', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveBinList: () => $resource(CORE.API_URL + 'binmst/retriveBinList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getAllWarehouse: (param) => $resource(CORE.API_URL + 'binmst/getAllWarehouse', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            isDepartment: param ? param.isDepartment : null,
            parentWHType: param ? param.parentWHType : null
          }
        }
      }),

      deleteBin: () => $resource(CORE.API_URL + 'binmst/deleteBin', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getBinCountList: () => $resource(CORE.API_URL + 'binmst/getBinCountList', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getAllNickNameOfAssembly: () => $resource(CORE.API_URL + 'binmst/getAllNickNameOfAssembly', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      getBinHistory: () => $resource(CORE.API_URL + 'binmst/getHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      checkBinStatusWithUMID: () => $resource(CORE.API_URL + 'binmst/checkBinStatusWithUMID', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getBinDetailByName: () => $resource(CORE.API_URL + 'binmst/getBinDetailByName', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      retriveBin: () => $resource(CORE.API_URL + 'binmst/retriveBin/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      getWarehouseAndTransferBin: () => $resource(CORE.API_URL + 'binmst/getWarehouseAndTransferBin', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
