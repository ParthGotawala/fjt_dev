(function () {
  'use strict';

  angular.module('app.transaction.rack', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_RACK_STATE, {
      url: TRANSACTION.TRANSACTION_RACK_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_RACK_VIEW,
          controller: TRANSACTION.TRANSACTION_RACK_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }

})();
