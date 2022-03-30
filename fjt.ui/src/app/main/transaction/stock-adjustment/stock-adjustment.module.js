(function () {
  'use strict';

  angular
    .module('app.transaction.stockadjustment', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE, {
      url: TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_VIEW,
          controller: TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
