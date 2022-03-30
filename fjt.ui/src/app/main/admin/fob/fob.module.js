(function () {
  'use strict';
  angular
    .module('app.admin.fob', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_FOB_STATE, {
      url: USER.ADMIN_FOB_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_FOB_VIEW,
          controller: USER.ADMIN_FOB_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
