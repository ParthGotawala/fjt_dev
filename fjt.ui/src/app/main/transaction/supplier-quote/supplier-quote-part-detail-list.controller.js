(function () {
  'use strict';

  angular
    .module('app.transaction.supplierquote')
    .controller('SupplierQuotePartDetailController', SupplierQuotePartDetailController);

  function SupplierQuotePartDetailController($scope) {
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.activeTab = $scope.$parent.vm.SupplierQuoteListTabIDs.DetailList;
      }
    });
  }
})();
