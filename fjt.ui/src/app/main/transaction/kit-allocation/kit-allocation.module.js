(function () {
    'use strict';

    angular
      .module('app.transaction.kitAllocation', [])
      .config(config);

    /** @ngInject */
    function config($stateProvider, TRANSACTION, CORE) {
      $stateProvider
        .state(TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE, {
          url: TRANSACTION.TRANSACTION_KIT_ALLOCATION_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_KIT_ALLOCATION_VIEW,
              controller: TRANSACTION.TRANSACTION_KIT_ALLOCATION_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE, {
          url: TRANSACTION.TRANSACTION_KIT_PREPARATION_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_KIT_ALLOCATION_VIEW,
              controller: TRANSACTION.TRANSACTION_KIT_ALLOCATION_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });
    }
})();
