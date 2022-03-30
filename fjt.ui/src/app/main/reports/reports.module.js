(function () {
  'use strict';
  angular
    .module('app.reports',
      [
        'app.reports.misreport',
        'app.reports.workorderdataelement',
        'app.reports.tranwisewodataelement',
        'app.reports.workordernarrativehistory',
        'app.reports.report',
        'app.reports.postatusreport',
        'app.reports.dynamicreports'
      ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, REPORTS) {
    $stateProvider.state(REPORTS.REPORTS_STATE, {
      url: REPORTS.REPORTS_ROUTE,
      views: {
        'content@app': {
          template: '<div ui-view></div>'
        }
      }
    });
  }
})();
