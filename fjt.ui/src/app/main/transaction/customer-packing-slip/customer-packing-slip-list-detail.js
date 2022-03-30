(function () {
  'use strict';

  angular.module('app.transaction.customerpacking')
    .controller('CustomerPackingSlipListDetailController', CustomerPackingSlipListDetailController);

  /** @ngInject */
  function CustomerPackingSlipListDetailController( $scope) {
    // const vm = this;
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerPackingSlipListTabIDs.DetailList;
      }
    });
  }
})();
