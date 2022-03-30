(function () {
  'use strict';

  angular
    .module('app.transaction.boxserialnumbers', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_STATE, {
      url: TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_VIEW,
          controller: TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
