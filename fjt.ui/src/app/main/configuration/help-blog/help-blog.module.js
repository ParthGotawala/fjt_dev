(function () {
  'use strict';
  angular
    .module('app.configuration.helpblog', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, CONFIGURATION, CORE) {
    // State
    $stateProvider.state(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE, {
      url: CONFIGURATION.CONFIGURATION_HELPBLOG_ROUTE,
      params: {
        id: null
      },
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_HELPBLOG_VIEW,
          controller: CONFIGURATION.CONFIGURATION_HELPBLOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(CONFIGURATION.CONFIGURATION_MANAGE_HELP_BLOG_STATE, {
      url: CONFIGURATION.CONFIGURATION_MANAGE_HELP_BLOG_ROUTE,
      views: {
        'content@app': {
          templateUrl: CONFIGURATION.CONFIGURATION_MANAGE_HELP_BLOG_VIEW,
          controller: CONFIGURATION.CONFIGURATION_MANAGE_HELP_BLOG_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
