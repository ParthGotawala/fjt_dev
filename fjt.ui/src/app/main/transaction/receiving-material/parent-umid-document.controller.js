(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ParentUMIDDocumentController', ParentUMIDDocumentController);

  /** @ngInject */
  function ParentUMIDDocumentController($stateParams, $scope, CORE, ReceivingMaterialFactory) {
    const vm = this;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.ParentUMIDDocument.Name;
    vm.umidId = $stateParams.id;
    vm.componentSidStockEntityName = CORE.AllEntityIDS.Component_sid_stock.Name;
    vm.showFlag = false;
    const getUMIDDetailsById = () => {
      if (vm.umidId) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailsById().query({ id: vm.umidId, uid: null }).$promise.then((response) => {
          if (response && response.data && response.data.umidDetail) {
            vm.uidDetail = response.data.umidDetail;
            vm.parentUMIDId = vm.uidDetail.parentUIDId;
            vm.showFlag = true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    getUMIDDetailsById();
  }
})();
