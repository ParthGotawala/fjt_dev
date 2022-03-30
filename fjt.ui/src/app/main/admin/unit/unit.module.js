(function () {
  'use strict';

  angular
    .module('app.admin.unit', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_UNIT_STATE, {
      url: USER.ADMIN_UNIT_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_UNIT_VIEW,
          controller: USER.ADMIN_UNIT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
