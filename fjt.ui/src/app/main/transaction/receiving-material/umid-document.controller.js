(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('UMIDDocumentController', UMIDDocumentController);

  /** @ngInject */
  function UMIDDocumentController($stateParams, $scope, CORE, ReceivingMaterialFactory) {
    const vm = this;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.UMIDDocument.Name;
    vm.umidId = $stateParams.id;
    vm.componentSidStockEntityName = CORE.AllEntityIDS.Component_sid_stock.Name;
  }
})();
