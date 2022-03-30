(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE, {
      url: TRANSACTION.TRANSACTION_TRANSFER_STOCK_ROUTE,
      params: {
        whId: '0',
        sodId: '0',
        assyId: '0'
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_TRANSFER_STOCK_VIEW,
          controller: TRANSACTION.TRANSACTION_TRANSFER_STOCK_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.UNALLOCATE_UMID_TRANSFER_HISTORY_STATE, {
      url: TRANSACTION.UNALLOCATE_UMID_TRANSFER_HISTORY_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.UNALLOCATE_UMID_TRANSFER_HISTORY_VIEW,
          controller: TRANSACTION.UNALLOCATE_UMID_TRANSFER_HISTORY_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
