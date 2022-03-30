(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder')
    .controller('PurchaseOrderPartDetailController', PurchaseOrderPartDetailController);

  /** @ngInject */
  function PurchaseOrderPartDetailController($scope) {
    const vm = this;
    vm.isNoDataFound = false;

    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.isNoDataFound = vm.isNoDataFound;
      }
    });
  }
})();
