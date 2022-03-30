(function () {
  'use strict';
  /** @ngInject */
  var DYNAMIC_REPORTS = {
    DYNAMIC_REPORTS_LABEL: 'Dynamic Reports',
    DYNAMIC_REPORTS_ROUTE: '/dynamicreport?keywords',
    DYNAMIC_REPORTS_STATE: 'app.dynamicreports',
    DYNAMIC_REPORTS_CONTROLLER: 'DynamicReportsController',
    DYNAMIC_REPORTS_VIEW: 'app/main/dynamic-reports/dynamic-reports.html',

    DYNAMIC_REPORTS_ADD_UPDATE_MODAL_CONTROLLER: 'DynamicReportAddUpdatePopupController',
    DYNAMIC_REPORTS_ADD_UPDATE_MODAL_VIEW: 'app/view/manage-dynamic-report-popup/manage-dynamic-report-popup.html',

    VIEW_ENTITY_REPORT_MODAL_CONTROLLER: 'ViewEntityReportPopupController',
    VIEW_ENTITY_REPORT_MODAL_VIEW: 'app/view/entity-report-popup/entity-report-popup.html',

    REPORT_PARAMETER_SETTINGS_MAPPING_MODAL_CONTROLLER: 'ReportParameterSettingMappingPopupController',
    REPORT_PARAMETER_SETTINGS_MAPPING_MODAL_VIEW: 'app/view/report-parameter-setting-mapping-popup/report-parameter-setting-mapping-popup.html',

    NewarkMessage: 'No Result Found',

    SEARCH_RESULT: {
      IMAGEURL: 'assets/images/emptystate/workorder.png',
      MESSAGE: 'No record found!'
    }
  };
  angular
    .module('app.reports.dynamicreports')
    .constant('DYNAMIC_REPORTS', DYNAMIC_REPORTS);
})();
