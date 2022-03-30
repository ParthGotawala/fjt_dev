(function () {
  'use strict';

  angular
    .module('app.transaction.reserveStockRequest', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_RESERVE_STOCK_REQUEST_STATE, {
      url: TRANSACTION.TRANSACTION_RESERVE_STOCK_REQUEST_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_RESERVE_STOCK_REQUEST_VIEW,
          controller: TRANSACTION.TRANSACTION_RESERVE_STOCK_REQUEST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
