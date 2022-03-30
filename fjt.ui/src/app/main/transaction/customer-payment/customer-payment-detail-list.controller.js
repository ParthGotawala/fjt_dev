(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('CustomerPaymentDetailListController', CustomerPaymentDetailListController);

  /** @ngInject */
  function CustomerPaymentDetailListController($scope, TRANSACTION) {
    const vm = this;
    vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;

    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerPaymentListTabIDs.DetailList;
      }
    });
  }
})();
