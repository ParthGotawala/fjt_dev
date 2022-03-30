(function () {
  'use strict';

  angular
    .module('app.transaction')
    .factory('WarehouseBinFactory', WarehouseBinFactory);

  /** @ngInject */
  function WarehouseBinFactory($resource, CORE, $http) {
    return {
      warehouse: () => $resource(CORE.API_URL + 'warehouse/:id', {
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
      retriveWarehouseList: () => $resource(CORE.API_URL + 'warehouse/retriveWarehouseList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      downloadWarehouseTemplate: (module) => $http.get(CORE.API_URL + 'warehouse/downloadWarehouseTemplate/' + module, { responseType: 'arraybuffer' })
        .then((response) => response, (error) => error),

      downloadBinTemplate: () => $http.post(CORE.API_URL + 'binmst/downloadBinTemplate', { responseType: 'arraybuffer' })
        .then((response) => response, (error) => error),

      deleteWarehouse: () => $resource(CORE.API_URL + 'warehouse/deleteWarehouse', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getHistory: () => $resource(CORE.API_URL + 'warehouse/getHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      checkNameUnique: () => $resource(CORE.API_URL + 'warehouse/checkNameUnique/:id/:name/:type/:leftside/:rightside', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      generateWarehouse: () => $resource(CORE.API_URL + 'warehouse/generateWarehouse', {}, {
        update: {
          method: 'PUT'
        }
      }),

      retriveWarehouse: () => $resource(CORE.API_URL + 'warehouse/retriveWarehouse/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      checkCartIdUnique: () => $resource(CORE.API_URL + 'warehouse/checkCartIdUnique/:id/:cartId', {
        id: '@_id',
        name: '@_cartId'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      checkActiveBin: () => $resource(CORE.API_URL + 'warehouse/checkActiveBin/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      checkCartWiseUniqueDomain: () => $resource(CORE.API_URL + 'warehouse/checkCartWiseUniqueDomain', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWarehouseDetailByName: () => $resource(CORE.API_URL + 'warehouse/getWarehouseDetailByName', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      sendRequestToCheckCartStatus: () => $resource(CORE.API_URL + 'warehouse/sendRequestToCheckCartStatus', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      sendRequestToCheckInCart: () => $resource(CORE.API_URL + 'warehouse/sendRequestToCheckInCart', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      sendRequestToCancelCartRequest: () => $resource(CORE.API_URL + 'warehouse/sendRequestToCancelCartRequest', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      sendRequestToCheckStatusOfAllCarts: () => $resource(CORE.API_URL + 'warehouse/sendRequestToCheckStatusOfAllCarts', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      sendRequestToCheckOutCart: () => $resource(CORE.API_URL + 'warehouse/sendRequestToCheckOutCart', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      sendRequestToSearchPartByUMID: () => $resource(CORE.API_URL + 'warehouse/sendRequestToSearchPartByUMID', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      sendRequestToSearchPartByCartID: () => $resource(CORE.API_URL + 'warehouse/sendRequestToSearchPartByCartID', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      sendRequestToClearUnauthorizeRequest: () => $resource(CORE.API_URL + 'warehouse/sendRequestToClearUnauthorizeRequest', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getUMIDListFromCartID: () => $resource(CORE.API_URL + 'warehouse/getUMIDListFromCartID/:pwareHouseID', {
        pwareHouseID: '@_pwareHouseID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      retriveInovaxeTransactionLogList: () => $resource(CORE.API_URL + 'warehouse/retriveInovaxeTransactionLogList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveInovaxeTransactionServerLog: (param) => $resource(CORE.API_URL + 'warehouse/retriveInovaxeTransactionServerLog', {
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            page: param && (param.Page || param.Page === 0) ? param.Page : 1,
            pageSize: param && (param.pageSize || param.pageSize === 0) ? param.pageSize : CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        }
      }),
      retriveInovaxeUnAuthorizeTransactionLogList: () => $resource(CORE.API_URL + 'warehouse/retriveInovaxeUnAuthorizeTransactionLogList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getSidewiseBinSlotDetails: () => $resource(CORE.API_URL + 'warehouse/getSidewiseBinSlotDetails/:pwarehouseID/:pside', {
        pwarehouseID: '@_pwarehouseID', pside: '@_pside'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      removeUnauthorizeRequest: () => $resource(CORE.API_URL + 'warehouse/removeUnauthorizeRequest', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      setPickUserDeatil: () => $resource(CORE.API_URL + 'warehouse/setPickUserDeatil', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      removePickUserDeatil: () => $resource(CORE.API_URL + 'inovaxeAPI/removePickUserDeatil', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      setDropUserDeatil: () => $resource(CORE.API_URL + 'warehouse/setDropUserDeatil', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
