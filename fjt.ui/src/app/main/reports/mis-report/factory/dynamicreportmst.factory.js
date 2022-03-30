(function () {
  'use strict';

  angular
    .module('app.reports.misreport')
    .factory('DynamicReportMstFactory', DynamicReportMstFactory);

  /** @ngInject */
  function DynamicReportMstFactory($resource, $http, CORE) {
    return {

      saveDynamicReportData: () => $resource(CORE.API_URL + 'dynamicreportmst/saveDynamicReportData', {
        listObj: '@_listObj',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDynamicReportNames: () => $resource(CORE.API_URL + 'dynamicreportmst/getDynamicReportNames/:EmployeeID/:isUserSuperAdmin', {},
        {
          query: {
            isArray: false,
            method: 'GET',
          }
        }),
      //getDynamicReportDetailsByReportID: () => $resource(CORE.API_URL + 'dynamicreportmst/getDynamicReportDetailsByReportID/id', {
      //    id: '@_id',
      //},
      //{
      //    query: {
      //        isArray: false,
      //        method: 'GET',
      //    }
      //}),
      getDynamicReportDetailsByReportID: (param) => $resource(CORE.API_URL + 'dynamicreportmst/getDynamicReportDetailsByReportID', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updateDynamicReportData: () => $resource(CORE.API_URL + 'dynamicreportmst/updateDynamicReportData/:id', {
        id: '@_id',
      }, {
        update: {
          method: 'PUT',
        },
      }),
      deleteDynamicReportDetailsByReportID: (param) => $resource(CORE.API_URL + 'dynamicreportmst/deleteDynamicReportDetailsByReportID/id/reportName', {
        id: '@_id',
        reportName: '@_reportName'
      },
        {
          query: {
            isArray: false,
            method: 'DELETE',
          }
        }),
      updateDynamicReportPivotJsonData: () => $resource(CORE.API_URL + 'dynamicreportmst/updateDynamicReportPivotJsonData', {
        listObj: '@_listObj',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDynamicReportMstDetByReportID: () => $resource(CORE.API_URL + 'dynamicreportmst/getDynamicReportMstDetByReportID', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPinnedToDashboardMISReports: () => $resource(CORE.API_URL + 'dynamicreportmst/getPinnedToDashboardMISReports', {},
        {
          query: {
            isArray: false,
            method: 'POST',
          }
        }),
      pinMisReportToDashBoard: () => $resource(CORE.API_URL + 'dynamicreportmst/pinMisReportToDashBoard', {},
        {
          query: {
            isArray: false,
            method: 'POST',
          }
        }),
      checkDuplicateReportName: () => $resource(CORE.API_URL + 'dynamicreportmst/checkDuplicateReportName', {},
        {
          query: {
            isArray: false,
            method: 'POST',
          }
        }),
      copyMISReportFromExistingReport: () => $resource(CORE.API_URL + 'dynamicreportmst/copyMISReportFromExistingReport', {},
        {
          query: {
            isArray: false,
            method: 'POST',
          }
        }),
    }
  }
})();
