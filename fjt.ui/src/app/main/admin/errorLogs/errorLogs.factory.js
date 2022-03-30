(function () {
  'use strict';

  angular
    .module('app.admin.errorLogs')
    .factory('ErrorLogsFactory', ErrorLogsFactory);

  /** @ngInject */
  function ErrorLogsFactory($resource, CORE) {
    return {
      Logs: (param) => $resource(CORE.API_URL + 'errorLogs/', {
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: param && param.pageSize ? param.pageSize : CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            isGetAPILogs: param ? param.isGetAPILogs : true
          }
        }
      })
    };
  }
})();
