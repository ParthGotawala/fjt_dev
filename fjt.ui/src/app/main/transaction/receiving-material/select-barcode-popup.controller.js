(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('SelectBarcodePopUpController', SelectBarcodePopUpController);

  function SelectBarcodePopUpController($mdDialog, $timeout, $state, CORE, USER, DialogFactory, BaseService, $scope, data, ReceivingMaterialFactory) {

    const vm = this;
    vm.CORE = CORE;
    let barcodeId = data;
    vm.barcodeList = [];
    let barcodetype = USER.BARCODE;
    vm.isDisable = true;
    vm.query = {
      order: ''
    };

    let getBarcodeList = () => {
      vm.cgBusyLoading = ReceivingMaterialFactory.get_Multiple_Barcode_List().query({ ids: barcodeId }).$promise.then((response) => {
        if (response && response.data) {
          vm.barcodeList = response.data;
          _.map(vm.barcodeList, (data) => {
            data.mfgCode = stringFormat('({0}) {1}', data.mfgCodeDetail.mfgCode, data.mfgCodeDetail.mfgName);
            let objBarcode = _.find(barcodetype, { Id: data.barcodeType });
            data.barcodeName = objBarcode ? objBarcode.Value : null;
            data.isSelect = false;
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getBarcodeList();

    vm.selectBarcode = (item) => {
      if (item) {
        vm.isDisable = !item.isSelect;
        vm.selectedRow = item;
        _.map(vm.barcodeList, (data) => {
          if (data.id !== item.id) {
            data.isSelect = false;
          }
        });
      }
    };

    vm.confirmSelect = () => {
      $mdDialog.cancel(vm.selectedRow);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

  }
})();
