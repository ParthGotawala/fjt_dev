(function () {
  'use strict';

  angular
    .module('app.transaction.supplierquote')
    .controller('SupplierQuoteDetailController', SupplierQuoteDetailController);

  function SupplierQuoteDetailController($scope) {
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.activeTab = $scope.$parent.vm.SupplierQuoteListTabIDs.SummaryList;
      }
    });
  }
})();
