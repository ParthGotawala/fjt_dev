(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('FullKitAllocationPopUpController', FullKitAllocationPopUpController);

  function FullKitAllocationPopUpController($mdDialog, $timeout, $q, $state, $window, CORE, TRANSACTION, DialogFactory, BaseService, $scope, data, USER) {

    const vm = this;
    vm.CORE = CORE;
    vm.TRANSACTION = TRANSACTION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    vm.LabelConstant = CORE.LabelConstant;

    $timeout(() => {
      vm.allocationDetail = angular.copy(data);
      vm.allocationDetail.allocatedQty = angular.copy(vm.allocationDetail.shortageQty);

      vm.headerdata = [];
      vm.headerdata.push(
        {
          label: 'Count',
          value: vm.allocationDetail.count,
          displayOrder: 1,
          isUnitFormat: vm.allocationDetail.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID ? false : true
        },
        {
          label: 'Units',
          value: vm.allocationDetail.units,
          displayOrder: 2,
          isUnitFormat: vm.allocationDetail.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID ? false : true
        },
        {
          label: 'UOM',
          value: vm.allocationDetail.uom,
          displayOrder: 3
        },
        {
          label: 'Unit',
          value: vm.allocationDetail.unit,
          displayOrder: 4
        }
      );
    });

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.allocatedQty = (type) => {
      if (vm.allocationDetail.units < vm.allocationDetail.allocatedQty) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: TRANSACTION.ALLOCATED_QTY_GREATER,
          multiple: true
        };
        return DialogFactory.alertDialog(model).then((yes) => {
          if (yes) {
            vm.allocationDetail.allocatedQty = null;
            let element = $window.document.getElementById('allocatedQty');
            if (element)
              element.focus();
          }
        }, (cancel) => {

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
        return;
      }

      let obj = {
        withKitAllocation: type,
        allocatedUnitValue: vm.allocationDetail.allocatedQty,
        checkValidation: true
      }
      $mdDialog.cancel(obj);
    }

    vm.checkUnitValue = () => {
      if (vm.allocationDetail.units < vm.allocationDetail.allocatedQty) {
        vm.formKitAllocation.allocatedQty.$setDirty(true);
        vm.formKitAllocation.allocatedQty.$touched = true;
        vm.formKitAllocation.allocatedQty.$setValidity("checkVal", false);
      } else {
        vm.formKitAllocation.allocatedQty.$setDirty(false);
        vm.formKitAllocation.allocatedQty.$touched = false;
        vm.formKitAllocation.allocatedQty.$setValidity("checkVal", true);
      }
    };

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.formKitAllocation, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
  }
})();
