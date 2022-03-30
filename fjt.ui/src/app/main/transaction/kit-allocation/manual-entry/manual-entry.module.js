(function () {
  'use strict';

  angular
    .module('app.transaction.manualentry', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.MANUAL_ENTRY_LIST_STATE, {
      url: TRANSACTION.MANUAL_ENTRY_LIST_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.MANUAL_ENTRY_LIST_VIEW,
          controller: TRANSACTION.MANUAL_ENTRY_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.MANAGE_MANUAL_ENTRY_STATE, {
      url: TRANSACTION.MANAGE_MANUAL_ENTRY_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.MANAGE_MANUAL_ENTRY_VIEW,
          controller: TRANSACTION.MANAGE_MANUAL_ENTRY_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
