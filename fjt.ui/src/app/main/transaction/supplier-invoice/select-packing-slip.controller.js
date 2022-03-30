(function () {
  'use strict';

  angular
    .module('app.transaction.supplierInvoice')
    .controller('SelectPackingSlipPopUpController', SelectPackingSlipPopUpController);

  function SelectPackingSlipPopUpController($mdDialog, $timeout, $state, CORE, USER, DialogFactory, BaseService, $scope, data, SupplierInvoiceFactory) {

    const vm = this;
    vm.CORE = CORE;
    vm.objPackingSlip = data;
    vm.packingSlipList = [];
    vm.query = {
      order: ''
    };
    vm.isDisable = true;

    let getPckingSlipList = () => {
      let obj = null;
      if (vm.objPackingSlip.isShowRMADetail) {
        obj = {
          poNumber: vm.objPackingSlip ? vm.objPackingSlip.poNumber : null,
          isShowRMADetail: vm.objPackingSlip ? vm.objPackingSlip.isShowRMADetail : null
        };
      } else {
        obj = {
          packingSlipNumber: vm.objPackingSlip ? vm.objPackingSlip.packingSlipNumber : null,
          isShowRMADetail: vm.objPackingSlip ? vm.objPackingSlip.isShowRMADetail : null
        };
      }
      vm.cgBusyLoading = SupplierInvoiceFactory.getListOfSamePackingSlip().query(obj).$promise.then((packingSlipData) => {
        vm.packingSlipList = packingSlipData.data;

        if (vm.packingSlipList && vm.packingSlipList.length > 0) {

          _.map(vm.packingSlipList, (data) => {
            if (data.mfgCodemst) {
              data.supllierName = stringFormat('({0}) {1}', data.mfgCodemst.mfgCode, data.mfgCodemst.mfgName);
            }
            data.isSelect = false;
          });
        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    getPckingSlipList();

    vm.selectPart = (item) => {
      if (item) {
        vm.isDisable = !item.isSelect;
        vm.selectedRow = item;
        _.map(vm.packingSlipList, (data) => {
          if (data.id != item.id) {
            data.isSelect = false;
          }
        });
      }
    }

    vm.confirmSelect = () => {
      $mdDialog.cancel(vm.selectedRow);
    }

    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
  }
})();
