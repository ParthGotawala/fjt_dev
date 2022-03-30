(function () {
  'use strict';

  angular
    .module('app.transaction.supplierRMA', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider
      .state(TRANSACTION.TRANSACTION_SUPPLIER_RMA_STATE, {
        url: TRANSACTION.TRANSACTION_SUPPLIER_RMA_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_RMA_VIEW,
            controller: TRANSACTION.TRANSACTION_SUPPLIER_RMA_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, {
        url: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_VIEW,
            controller: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();
