(function () {
  'use strict';

  angular
    .module('app.transaction.warehousebin')
    .controller('DuplicateWarehouseBinPopupController', DuplicateWarehouseBinPopupController);

  function DuplicateWarehouseBinPopupController($mdDialog, CORE, TRANSACTION, BaseService, data, WarehouseBinFactory, BinFactory, RackFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.query = {
      order: ''
    };
    vm.Transaction = TRANSACTION;
    vm.wareHouse_bin_List = data;
    vm.duplicate_Bin_Warehouse = vm.wareHouse_bin_List[0];
    vm.unique_Warehouse_Bin = vm.wareHouse_bin_List[1];
    vm.data = vm.wareHouse_bin_List[2];

    vm.generateWarehouse = () => {
      vm.data.isDuplicate = true;
      vm.data.unique_Warehouse_List = vm.unique_Warehouse_Bin;
      vm.cgBusyLoading = WarehouseBinFactory.generateWarehouse().save(vm.data).$promise.then((res) => {
        if (res) {
          $mdDialog.cancel(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.generateBin = () => {
      vm.data.isDuplicate = true;
      vm.data.unique_Warehouse_List = vm.unique_Warehouse_Bin;
      vm.cgBusyLoading = BinFactory.createBin().save(vm.data).$promise.then((res) => {
        if (res) {
          $mdDialog.cancel(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.generateRack = () => {
      vm.data.isDuplicate = true;
      vm.data.unique_Rack_List = vm.unique_Warehouse_Bin;
      vm.cgBusyLoading = RackFactory.generateRack().save(vm.data).$promise.then((res) => {
        if (res) {
          $mdDialog.cancel(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
