(function () {
  'use strict';

  angular
    .module('app.login', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider, CORE) {
    // State
    $stateProvider.state(CORE.LOGIN_STATE, {
      url: CORE.LOGIN_ROUTE,
      views: {
        'main@': {
          templateUrl: CORE.CONTENT_ONLY_VIEW,
          controller: CORE.MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        },
        'content@app.login': {
          templateUrl: CORE.LOGIN_VIEW,
          controller: CORE.LOGIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      bodyClass: 'login theme-body',
      onEnter: function ($state, BaseService) {
        //BaseService.logoutIDS();
        if (!BaseService.loginUser) {
          BaseService.loginIDS();
        }
      }
    })
      .state(CORE.ACESSTOKEN_RENEW_STATE, {
        url: CORE.ACESSTOKEN_RENEW_ROUTE,
        views: {
          'main@': {
            templateUrl: CORE.CONTENT_ONLY_VIEW,
            controller: CORE.MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'content@app.silentrefresh': {
            templateUrl: CORE.ACESSTOKEN_RENEW_VIEW,
            controller: CORE.ACESSTOKEN_RENEW_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        bodyClass: 'login theme-body',
        onEnter: function ($state, BaseService) {
          BaseService.completeSilentRenewal();
        }
      })
      .state(CORE.LOGIN_RESPONSE_STATE, {
        url: CORE.LOGIN_RESPONSE_ROUTE,
        views: {
          'main@': {
            templateUrl: CORE.CONTENT_ONLY_VIEW,
            controller: CORE.MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'content@app.loginresponse': {
            templateUrl: CORE.LOGIN_RESPONSE_VIEW,
            controller: CORE.LOGIN_RESPONSE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        bodyClass: 'login theme-body'//,
        //onEnter: function ($state, BaseService) {
        //  BaseService.completeLoginResponse();
        //  BaseService.completeSilentRenewal();
        //}
      })
      .state(CORE.LOGOUT_RESPONSE_STATE, {
        url: CORE.LOGOUT_RESPONSE_ROUTE,
        views: {
          'main@': {
            templateUrl: CORE.CONTENT_ONLY_VIEW,
            controller: CORE.MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'content@app.logoutresponse': {
            templateUrl: CORE.LOGOUT_RESPONSE_VIEW,
            controller: CORE.LOGOUT_RESPONSE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(CORE.INTERNAL_SERVER_ERROR_STATE, {
        url: CORE.INTERNAL_SERVER_ERROR_ROUTE,
        views: {
          'main@': {
            templateUrl: CORE.CONTENT_ONLY_VIEW,
            controller: CORE.MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'content@app.500': {
            templateUrl: CORE.INTERNAL_SERVER_ERROR_VIEW,
            controller: CORE.INTERNAL_SERVER_ERROR_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }

})();
