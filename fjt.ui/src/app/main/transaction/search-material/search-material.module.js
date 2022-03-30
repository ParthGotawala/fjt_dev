(function () {
  'use strict';

  angular
    .module('app.transaction.searchMaterial', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    $stateProvider
      .state(TRANSACTION.TRANSACTION_SEARCH_MATERIAL_STATE, {
        url: TRANSACTION.TRANSACTION_SEARCH_MATERIAL_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_SEARCH_MATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_SEARCH_MATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();
