(function () {
    'use strict';
    angular
      .module('app.admin.picturestation', [])
      .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
      // State
      $stateProvider.state(USER.ADMIN_PICTURE_STATION_STATE, {
        url: USER.ADMIN_PICTURE_STATION_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_PICTURE_STATION_VIEW,
            controller: USER.ADMIN_PICTURE_STATION_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
    }
  })();
