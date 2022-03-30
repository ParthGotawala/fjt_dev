(function () {
  'use strict';
  angular
    .module('app.admin.camera', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_CAMERA_STATE, {
      url: USER.ADMIN_CAMERA_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_CAMERA_VIEW,
          controller: USER.ADMIN_CAMERA_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
