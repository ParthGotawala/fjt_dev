(function () {
  'use strict';

  angular.module('app.admin.releasenotes' , [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_RELEASE_NOTES_STATE, {
      url: USER.ADMIN_RELEASE_NOTES_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_RELEASE_NOTES_VIEW,
          controller: USER.ADMIN_RELEASE_NOTES_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();


