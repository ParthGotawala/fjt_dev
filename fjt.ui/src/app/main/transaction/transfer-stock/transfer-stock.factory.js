(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .factory('TransferStockFactory', ['$resource', 'CORE', TransferStockFactory]);

  function TransferStockFactory($resource, CORE) {
    return {
      getActiveWarehouse: () => $resource(CORE.API_URL + 'transfer_stock/getActiveWarehouse', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getActiveBin: () => $resource(CORE.API_URL + 'transfer_stock/getActiveBin', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUIDDetail: () => $resource(CORE.API_URL + 'transfer_stock/getUIDDetail', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      managestock: () => $resource(CORE.API_URL + 'transfer_stock/managestock', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      transferStockHistory: () => $resource(CORE.API_URL + 'transfer_stock/history', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getKitToTransferStock: () => $resource(CORE.API_URL + 'transfer_stock/getKitToTransferStock', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getKitWarehouseDetail: (param) => $resource(CORE.API_URL + 'transfer_stock/getKitWarehouseDetail', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            refSalesOrderDetID: param.refSalesOrderDetID || null,
            assyID: param.assyID || null,
            fromParentWHType: param.fromParentWHType || null,
            warehouseId: param.warehouseId || null,
            binId: param.binId || null
          }
        }
      }),
      tranferEmptyBinToWH: () => $resource(CORE.API_URL + 'transfer_stock/tranferEmptyBinToWH', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      RequestToAssignDepartment: () => $resource(CORE.API_URL + 'transfer_stock/RequestToAssignDepartment', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUMIDWorkOrderHistory: () => $resource(CORE.API_URL + 'transfer_stock/getUMIDWorkOrderHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUMIDKitAllocationHistory: () => $resource(CORE.API_URL + 'transfer_stock/getUMIDKitAllocationHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getMismatchItemForKit: () => $resource(CORE.API_URL + 'transfer_stock/getMismatchItemForKit', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUnallocatedUmidTransferHistoryList: () => $resource(CORE.API_URL + 'unallocated_umid_transfer/unallocatedXferHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();

