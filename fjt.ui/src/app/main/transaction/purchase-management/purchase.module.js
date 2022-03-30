(function () {
  'use strict';

  angular
    .module('app.transaction.purchase', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    $stateProvider.state(TRANSACTION.TRANSACTION_PURCHASE_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_PURCHASE_LIST_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_LIST_ROUTE,
      params: {
        selectedTab: CORE.KitListTab.MRPList.Name
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_LIST_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      },
    })
  }
})();
