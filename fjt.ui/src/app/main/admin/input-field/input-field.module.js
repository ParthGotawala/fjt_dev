(function () {
  'use strict';

  angular.module('app.admin.inputfield', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_INPUTFIELD_STATE, {
      url: USER.ADMIN_INPUTFIELD_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_INPUTFIELD_VIEW,
          controller: USER.ADMIN_INPUTFIELD_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(USER.MANAGE_INPUTFIELD_STATE, {
      url: USER.MANAGE_INPUTFIELD_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.MANAGE_INPUTFIELD_VIEW,
          controller: USER.MANAGE_INPUTFIELD_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });;
  }
})();


