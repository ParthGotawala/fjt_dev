(function () {
  'use strict';

  angular
    .module('app.admin.supplierlimit', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_SUPPLIER_LIMIT_STATE, {
      url: USER.ADMIN_SUPPLIER_LIMIT_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_SUPPLIER_LIMIT_VIEW,
          controller: USER.ADMIN_SUPPLIER_LIMIT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
