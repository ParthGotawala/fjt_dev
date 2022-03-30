(function () {
  'use strict';

  angular
    .module('app.reports.report')
    .controller('ReportListController', ReportListController);

  /** @ngInject */
  function ReportListController($timeout, $q, $scope, $mdDialog, $filter, CORE, USER, REPORTS, DialogFactory, BaseService, EmployeeFactory, MasterFactory, ReportMasterFactory, ManageMFGCodePopupFactory, RFQSettingFactory, ComponentFactory, NotificationFactory) {
    const vm = this;
    vm.reportData = null;
  
    vm.generatereport = (isDownload, ev, isCSVDownload) => {
      var reportDetail = {
        isDownload: isDownload,
        ev: ev,
        isCSVDownload: isCSVDownload
      };
      $scope.$broadcast("generateReportCall", reportDetail);
    }
    vm.clearFilter = () => {
      $scope.$broadcast("clearFilterCall");
    };
  }

})();
