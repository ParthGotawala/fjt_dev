(function () {
  'use strict';

  angular
    .module('app.admin.accounttype', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    $stateProvider.state(USER.ADMIN_ACCOUNT_TYPE_STATE, {
      url: USER.ADMIN_ACCOUNT_TYPE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_ACCOUNT_TYPE_VIEW,
          controller: USER.ADMIN_ACCOUNT_TYPE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
