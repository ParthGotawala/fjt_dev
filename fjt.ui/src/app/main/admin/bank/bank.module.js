(function () {
  'use strict';
  angular
    .module('app.admin.bank', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_BANK_STATE, {
      url: USER.ADMIN_BANK_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_BANK_VIEW,
          controller: USER.ADMIN_BANK_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
