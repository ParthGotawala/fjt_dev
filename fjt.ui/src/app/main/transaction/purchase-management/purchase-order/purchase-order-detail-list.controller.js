(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder')
    .controller('PurchaseOrderDetailController', PurchaseOrderDetailController);

  /** @ngInject */
  function PurchaseOrderDetailController($scope) {
    const vm = this;
    vm.isNoDataFound = false;

    const resetIsNoDataFoundWatch = $scope.$watch('vm.isNoDataFound', () => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.isNoDataFound = vm.isNoDataFound;
      }
    });

    $scope.$on('$destroy', () => resetIsNoDataFoundWatch());
  }
})();
