(function () {
  'use strict';
  angular
    .module('app.admin.calibrationdetails', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider
      .state(USER.ADMIN_CALIBRATION_DETAILS_STATE, {
        url: USER.ADMIN_CALIBRATION_DETAILS_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_CALIBRATION_DETAILS_VIEW,
            controller: USER.ADMIN_CALIBRATION_DETAILS_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();
