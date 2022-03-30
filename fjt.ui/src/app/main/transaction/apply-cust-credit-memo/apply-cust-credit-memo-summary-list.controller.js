(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomercreditmemo')
    .controller('AppliedCustCreditMemoSummaryListController', AppliedCustCreditMemoSummaryListController);

  /** @ngInject */
  function AppliedCustCreditMemoSummaryListController($scope) {
    //const vm = this;
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.custAppliedCMListTabIDsConst.SummaryList;
      }
    });
  }
})();
