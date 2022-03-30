(function () {
  'use strict';
  angular
    .module('app.admin.operatingtemperatureconversion', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider
      .state(USER.ADMIN_OPERATING_TEMPERATURE_CONVERSION_STATE, {
        url: USER.ADMIN_OPERATING_TEMPERATURE_CONVERSION_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_OPERATING_TEMPERATURE_CONVERSION_VIEW,
            controller: USER.ADMIN_OPERATING_TEMPERATURE_CONVERSION_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }

})();
