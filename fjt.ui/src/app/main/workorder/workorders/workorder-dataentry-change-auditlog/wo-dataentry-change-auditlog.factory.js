(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .factory('WoDataentryChangeAuditlogFactory', WoDataentryChangeAuditlogFactory);

  /** @ngInject */
  function WoDataentryChangeAuditlogFactory($resource, CORE) {
    return {
      getWoDataentryChangeAuditlog: () => $resource(CORE.API_URL + 'dataentrychange_auditlog/getWoDataentryChangeAuditlog', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getHistoryDataByTableName: () => $resource(CORE.API_URL + 'dataentrychange_auditlog/getHistoryDataByTableName', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
