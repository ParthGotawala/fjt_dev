(function () {
  'use strict';
  angular
      .module('app.transaction.warehousebin', [])
      .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {
      url: TRANSACTION.TRANSACTION_WAREHOUSE_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_WAREHOUSEBIN_VIEW,
          controller: TRANSACTION.TRANSACTION_WAREHOUSEBIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        },
        'tabContent@app.transaction.warehousebin': {
          templateUrl: TRANSACTION.TRANSACTION_WAREHOUSE_VIEW,
          controller: TRANSACTION.TRANSACTION_WAREHOUSE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_BIN_STATE, {
      url: TRANSACTION.TRANSACTION_BIN_ROUTE,
      params: {
        warehouseId: '0'
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_WAREHOUSEBIN_VIEW,
          controller: TRANSACTION.TRANSACTION_WAREHOUSEBIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        },
        'tabContent@app.transaction.bin': {
          templateUrl: TRANSACTION.TRANSACTION_BIN_VIEW,
          controller: TRANSACTION.TRANSACTION_BIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_STATE, {
      url: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_ROUTE,
      views: {
        'tabContent': {
          templateUrl: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
          controller: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_INOVAXEHISTORY_STATE, {
      url: TRANSACTION.TRANSACTION_INOVAXEHISTORY_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_INOVAXEHISTORY_VIEW,
          controller: TRANSACTION.TRANSACTION_INOVAXEHISTORY_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_STATE, {
      url: TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_VIEW,
          controller: TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_INOVAXESERVERLOG_STATE, {
      url: TRANSACTION.TRANSACTION_INOVAXESERVERLOG_ROUTE,
      views: {
        'serverlog': {
          templateUrl: TRANSACTION.TRANSACTION_INOVAXESERVERLOG_VIEW,
          controller: TRANSACTION.TRANSACTION_INOVAXESERVERLOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_INOVAXELOG_STATE, {
      url: TRANSACTION.TRANSACTION_INOVAXELOG_ROUTE,
      views: {
        'alltransaction': {
          templateUrl: TRANSACTION.TRANSACTION_INOVAXELOG_VIEW,
          controller: TRANSACTION.TRANSACTION_INOVAXELOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_INOVAXECARTSTATUSLOG_STATE, {
      url: TRANSACTION.TRANSACTION_INOVAXECARTSTATUSLOG_ROUTE,
      views: {
        'cartstatus': {
          templateUrl: TRANSACTION.TRANSACTION_INOVAXECARTSTATUSLOG_VIEW,
          controller: TRANSACTION.TRANSACTION_INOVAXECARTSTATUSLOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
