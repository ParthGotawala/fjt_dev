(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('EmployeePerformancePopupController', EmployeePerformancePopupController);
  /** @ngInject */
  function EmployeePerformancePopupController($mdDialog, data, $scope) {
    const vm = this;
    $scope.empData = data;
    vm.isshowpdf = true;
    vm.cancel = () => {
        $mdDialog.cancel();
    };
    //disable pdf export button if no any data available
    $scope.$on("ispdfdisable", function (event, data) {
      vm.isshowpdf = false;
    });
    //export pdf file for employee burndown chart
    vm.exportReportPdf = () => {
      $scope.$broadcast('exportpdfchart')
    } 
  };
})();
