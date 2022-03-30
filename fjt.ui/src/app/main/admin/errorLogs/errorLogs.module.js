(function () {
  'use strict';

  angular
      .module('app.admin.errorLogs', [])
      .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {

    // State
    $stateProvider.state(USER.ADMIN_ERRORLOG_STATE, {
      url: USER.ADMIN_ERRORLOG_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_ERRORLOG_VIEW,
          controller: USER.ADMIN_ERRORLOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });

  }
})();
