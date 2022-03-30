(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('SummarySecondOptionController', SummarySecondOptionController);

  /** @ngInject */
  function SummarySecondOptionController($stateParams, $scope) {
    const vm = this;
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 4;
    }
    const rfqAssyID = $stateParams.id;
    vm.rfqAssyID = rfqAssyID;
  }
})();
