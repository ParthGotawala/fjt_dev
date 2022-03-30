(function () {
  'use strict';

  angular
    .module('app.admin.cotactPerson', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    // State
    $stateProvider
      .state(USER.ADMIN_CONTACT_PERSON_STATE, {
        url: USER.ADMIN_CONTACT_PERSON_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_CONTACT_PERSON_VIEW,
            controller: USER.ADMIN_CONTACT_PERSON_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();
