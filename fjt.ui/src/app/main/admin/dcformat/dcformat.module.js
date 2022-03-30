(function () {
  'use strict';
  angular
    .module('app.admin.datecodeformat', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_DC_FORMAT_STATE, {
      url: USER.ADMIN_DC_FORMAT_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_DC_FORMAT_VIEW,
          controller: USER.ADMIN_DC_FORMAT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
