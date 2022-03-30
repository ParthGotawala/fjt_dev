(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('ReportMasterFactory', ReportMasterFactory);

  /** @ngInject */
  function ReportMasterFactory($resource, $http, CORE) {
    return {
      getCustomerReportList: () => $resource(CORE.API_URL + 'reportmaster/retriveCustomerReport', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retriveCustomerReportList: () => $resource(CORE.API_URL + 'reportmaster/retriveCustomerReportList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveReport: () => $resource(CORE.API_URL + 'reportmaster/retriveReport', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveReportById: (param) => $resource(CORE.API_URL + 'reportmaster/retriveReportById/:id', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            id: param && param.id ? param.id : null
          }
        }
      }),
      getReportNameList: () => $resource(CORE.API_URL + 'reportmaster/getReportList', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveCustomerReport: () => $resource(CORE.API_URL + 'reportmaster/saveCustomerReport', {
        emailScheduleObj: '@_emailScheduleObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateCustomerReport: () => $resource(CORE.API_URL + 'reportmaster/updateCustomerReport', {
        emailScheduleObj: '@_emailScheduleObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteCustomerReport: () => $resource(CORE.API_URL + 'reportmaster/deleteCustomerReport', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      //updateReportCategory: () => $resource(CORE.API_URL + 'reportmaster/updateReportCategory', {
      //  reportModel: '@_reportModel'
      //}, {
      //  query: {
      //    method: 'POST',
      //    isArray: false
      //  }
      //}),
      updateReportAdditionalNotes: () => $resource(CORE.API_URL + 'reportmaster/updateReportAdditionalNotes', {
        reportModel: '@_reportModel'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      generateReport: (requestObj) => $http.post(CORE.REPORT_URL + requestObj.reportAPI, requestObj, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),

      generateCSVReport: (requestObj) => $http.post(CORE.REPORT_URL + requestObj.csvReportAPI, requestObj, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),

      ExportExcel: (requestObj) => $http.post(CORE.API_URL + requestObj.reportAPI, requestObj, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),

      getEmployeePerformanceDetail: () => $resource(CORE.API_URL + 'reportmaster/getEmployeePerformanceDetail', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      saveReport: (param) => $http.post(CORE.REPORT_DESIGNE_URL + 'api/Designer/CreateReport', param).then((response) => response.data, (error) => error),
      saveReportViewerParameter: (param) => $http.post(CORE.REPORT_VIEWERLINK_URL + 'api/Viewer/SaveReportViewerParameter', param).then((response) => response.data, (error) => error),
      downloadReport: (param) => $http.post(CORE.REPORT_VIEWERLINK_URL + 'api/Viewer/DownloadReport', param, {
        responseType: 'arraybuffer'
      }).then((response) => response, (error) => error),

      checkNameUnique: () => $resource(CORE.API_URL + 'reportmaster/checkNameUnique',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveClientId: () => $resource(CORE.API_URL + 'reportmaster/retrieveClientId', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      deleteReports: () => $resource(CORE.API_URL + 'reportmaster/deleteReports', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveParameterSettings: (param) => $resource(CORE.API_URL + 'reportmaster/retriveParameterSettings/:id', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            id: param && param.id ? param.id : null
          }
        }
      }),
      saveReportParameterSettings: () => $resource(CORE.API_URL + 'reportmaster/saveReportParameterSettings', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      retrieveReportTempleteList: () => $resource(CORE.API_URL + 'reportmaster/retrieveReportTempleteList', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getReportNameSearch: () => $resource(CORE.API_URL + 'reportmaster/getReportNameSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      startActivity: () => $resource(CORE.API_URL + 'reportchangelog/startActivity', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      stopActivity: () => $resource(CORE.API_URL + 'reportchangelog/stopActivity', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getReportListByEntity: () => $resource(CORE.API_URL + 'reportmaster/getReportListByEntity', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDefaultReportByEntity: () => $resource(CORE.API_URL + 'reportmaster/getDefaultReportByEntity', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveReportFilterParameterDetail: (param) => $resource(CORE.API_URL + 'reportmaster/retriveReportFilterParameterDetail/:id', {}, {
        query: {
          isArray: false,
          method: 'GET',
          params: {
            id: param && param.id ? param.id : null
          }
        }
      }),
      getAutoCompleteFileterParameterData: () => $resource(CORE.API_URL + 'reportmaster/getAutoCompleteFileterParameterData', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkActivityStarted: () => $resource(CORE.API_URL + 'reportchangelog/checkActivityStarted', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      checkApplicationStatus: () => $resource(CORE.REPORT_DESIGNE_URL + 'api/CheckApplicationStatus', {}, {
        query: {
          isArray: true,
          method: 'GET'
        }
      })
    };
  }
})();
