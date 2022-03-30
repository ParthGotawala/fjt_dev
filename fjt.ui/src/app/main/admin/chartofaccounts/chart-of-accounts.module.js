(function () {
  'use strict';

  angular
    .module('app.admin.chartofaccounts', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    $stateProvider.state(USER.ADMIN_CHART_OF_ACCOUNTS_STATE, {
      url: USER.ADMIN_CHART_OF_ACCOUNTS_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_CHART_OF_ACCOUNTS_VIEW,
          controller: USER.ADMIN_CHART_OF_ACCOUNTS_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
