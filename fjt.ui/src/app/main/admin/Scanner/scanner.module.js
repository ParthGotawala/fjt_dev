(function () {
  'use strict';
  angular
    .module('app.admin.scanner', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_SCANNER_STATE, {
      url: USER.ADMIN_SCANNER_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_SCANNER_VIEW,
          controller: USER.ADMIN_SCANNER_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
