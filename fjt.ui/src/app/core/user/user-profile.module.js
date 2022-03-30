(function () {
  'use strict';

  angular
    .module('app.userprofile', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, CORE) {
    $stateProvider.state(CORE.USER_PROFILE_STATE, {
      url: CORE.USER_PROFILE_ROUTE,
      views: {
        'content@app': {
          templateUrl: CORE.USER_PROFILE_VIEW,
          controller: CORE.USER_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
      //,resolve: {
      //}
    })
      .state(CORE.USER_PROFILE_DETAIL_STATE, {
        url: CORE.USER_PROFILE_DETAIL_ROUTE,
        params: {
          selectedTab: CORE.UserProfileTabs.Detail.Name
        },
        views: {
          'content@app': {
            templateUrl: CORE.USER_PROFILE_VIEW,
            controller: CORE.USER_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(CORE.USER_PROFILE_SECURITY_STATE, {
        url: CORE.USER_PROFILE_SECURITY_ROUTE,
        params: {
          selectedTab: CORE.UserProfileTabs.Security.Name
        },
        views: {
          'content@app': {
            templateUrl: CORE.USER_PROFILE_VIEW,
            controller: CORE.USER_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(CORE.USER_PROFILE_SETTINGS_STATE, {
        url: CORE.USER_PROFILE_SETTINGS_ROUTE,
        params: {
          selectedTab: CORE.UserProfileTabs.Settings.Name
        },
        views: {
          'content@app': {
            templateUrl: CORE.USER_PROFILE_VIEW,
            controller: CORE.USER_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(CORE.USER_PROFILE_PREFERENCE_STATE, {
        url: CORE.USER_PROFILE_PREFERENCE_ROUTE,
        params: {
          selectedTab: CORE.UserProfileTabs.Preferences.Name
        },
        views: {
          'content@app': {
            templateUrl: CORE.USER_PROFILE_VIEW,
            controller: CORE.USER_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(CORE.USER_PROFILE_SIGNUP_AGREEMENT_STATE, {
        url: CORE.USER_PROFILE_SIGNUP_AGREEMENT_ROUTE,
        params: {
          selectedTab: CORE.UserProfileTabs.UserSignUpAgreement.Name
        },
        views: {
          'content@app': {
            templateUrl: CORE.USER_PROFILE_VIEW,
            controller: CORE.USER_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();
