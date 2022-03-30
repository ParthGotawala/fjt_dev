(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ScanUmidViewHistoryController', ScanUmidViewHistoryController);

  /** @ngInject */
  function ScanUmidViewHistoryController($timeout, $mdDialog, $state, BaseService, $scope, CORE, USER, TRANSACTION, ReceivingMaterialFactory, data) {
    const vm = this;
    vm.filterTypes = data;
    vm.LabelConstant = CORE.LabelConstant;

    /*Used to goto equipment list*/
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
    }

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    }

    vm.goToWorkorderList = (data) => {
      BaseService.goToWorkorderList();
      return false;
    }

    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.filterTypes.woID);
      return false;
    }

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'Equipment Name', value: vm.filterTypes.headerData.equipmentName, displayOrder: 1, labelLinkFn: vm.goToEquipmentList,
      valueLinkFn: vm.goToManageEquipmentWorkstation,
      valueLinkFnParams: { eqpID: vm.filterTypes.headerData.eqpID },
      isCopy: false
    });
    // vm.headerdata.push({ label: 'Equipment Name', value: vm.filterTypes.headerData.equipmentName, displayOrder: 1 });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: vm.filterTypes.headerData.wo, displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: null },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.Version, value: vm.filterTypes.headerData.version, displayOrder: 3
    });
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();


