(function () {
  'use strict';

  angular
    .module('app.reports.dynamicreports', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, DYNAMIC_REPORTS, CORE) {
    // State
    $stateProvider.state(DYNAMIC_REPORTS.DYNAMIC_REPORTS_STATE, {
      url: DYNAMIC_REPORTS.DYNAMIC_REPORTS_ROUTE,
      views: {
        'content@app': {
          templateUrl: DYNAMIC_REPORTS.DYNAMIC_REPORTS_VIEW,
          controller: DYNAMIC_REPORTS.DYNAMIC_REPORTS_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    });
  }

})();
