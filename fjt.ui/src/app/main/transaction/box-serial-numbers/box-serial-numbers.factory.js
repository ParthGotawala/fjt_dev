(function () {
  'use strict';

  angular
    .module('app.transaction')
    .factory('BoxSerialNumbersFactory', BoxSerialNumbersFactory);

  /** @ngInject */
  function BoxSerialNumbersFactory($resource, CORE) {
    // Todo code to call api
    return {
      BoxSerialNo: (param) => $resource(CORE.API_URL + 'workorderBoxSerialno/:id', {}, {
        save: {
          method: 'POST'
        }
      }),
      retriveBoxSerialNoList: (param) => $resource(CORE.API_URL + 'workorderBoxSerialno/retriveBoxSerialNoList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      RetriveBoxSerialNoById: () => $resource(CORE.API_URL + 'workorderBoxSerialno/retriveBoxSerialNoById', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAllAssemblyBySearch: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getAssemblyIDList', {}, {
        save: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllWorkOrderBySearch: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getWorkorderList', {}, {
        save: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllPackagingMaterialPartBySearch: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getPackageingMaterialPartList', {}, {
        save: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllPONumberByWoID: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getSalesOrderWoIDwise', {}, {
        save: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteBoxSerialNo: () => $resource(CORE.API_URL + 'workorderBoxSerialno/deleteBoxSerialNo', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      ScanBoxSerialNo: (param) => $resource(CORE.API_URL + 'workorderBoxSerialno/retriveBoxScanSerialNoList', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            page: param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            boxSerialId: param && param.boxSerialId ? param.boxSerialId : null
          } : null
        }
      }),
      getValidateBoxSerialNumberDetails: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getValidateBoxSerialNumberDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getValidateBoxSerialNumberDetailsList: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getValidateBoxSerialNumberDetailsList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      generateBoxSerialno: () => $resource(CORE.API_URL + 'workorderBoxSerialno/generateBoxSerialno', {}, {
        save: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteTransBoxSerialNo: () => $resource(CORE.API_URL + 'workorderBoxSerialno/deleteTransBoxSerialNo', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getBoxDetailByBoxID: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getBoxDetailByBoxID', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getScanBoxSerialNumberDetails: () => $resource(CORE.API_URL + 'workorderBoxSerialno/getScanBoxSerialNumberDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      moveBoxSerialno: () => $resource(CORE.API_URL + 'workorderBoxSerialno/moveBoxSerialno', {}, {
        save: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveBoxSerialNoHistory: (param) => $resource(CORE.API_URL + 'workorderBoxSerialno/retriveBoxSerialNoHistory', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            page: param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            serialID: param && param.serialID ? param.serialID : null,
            woBoxSerialID: param && param.woBoxSerialID ? param.woBoxSerialID : null
          } : null
        }
      }),
      getAvailableQtyByStockIdOrWoID: (param) => $resource(CORE.API_URL + 'workorderBoxSerialno/getAvailableQtyByStockIdOrWoID', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            assyStockID: param && param.assyStockID ? param.assyStockID : null,
            woID: param && param.woID ? param.woID : null,
            boxSerialId: param && param.boxSerialId ? param.boxSerialId : null
          } : null
        }
      })
    };
  }
})();
