(function () {
  'use strict';

  angular
    .module('app.reports.dynamicreports')
    .factory('DynamicReportsFactory', DynamicReportsFactory);

  /** @ngInject */
  function DynamicReportsFactory($resource, CORE) {
    return {
      //getViewerReport: (param) => $resource(CORE.API_URL + 'reportmaster/getViewerReport', {},
      //  {
      //    query: {
      //      isArray: false,
      //      method: 'POST',
      //      params: {
      //        reportId: param
      //      }
      //    }
      //  })
    };
  }
})();
