(function () {
  'use strict';

  angular
    .module('app.admin.scanner')
    .controller('ScannerAddUpdatePopupController', ScannerAddUpdatePopupController);

  /** @ngInject */
  function ScannerAddUpdatePopupController($scope, $mdDialog, $sce, $timeout, data, $q, CORE, ScannerFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.IPAddressPattern = CORE.IPAddressPattern;
    vm.MACAddressPattern = CORE.MACAddressPattern;
    vm.isSubmit = false;
    vm.scanner = {
      isActive: true
    };
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    if (data && data.id) {
      vm.scanner = angular.copy(data);
    }
    vm.saveScanner = () => {
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.scannerForm)) {
        vm.isSubmit = true;
        return;
      }
      const scannerInfo = {
        id: vm.scanner.id ? vm.scanner.id : undefined,
        ipAddress: vm.scanner.ipAddress,
        nodename: vm.scanner.nodename,
        usbModelName: vm.scanner.usbModelName,
        make: vm.scanner.make,
        model: vm.scanner.model,
        version: vm.scanner.version,
        location: vm.scanner.location,
        macAddress: vm.scanner.macAddress,
        isActive: vm.scanner.isActive ? vm.scanner.isActive : false
      };
      if (vm.scanner && vm.scanner.id) {
        vm.cgBusyLoading = ScannerFactory.retrieveScanner().update({
          id: vm.scanner.id
        }, scannerInfo).$promise.then((res) => {
          if (res && res.data) {
            BaseService.currentPagePopupForm = [];
            $mdDialog.hide(res.data);
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.scannerForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.cgBusyLoading = ScannerFactory.saveScanner().save(scannerInfo).$promise.then((res) => {
          if (res && res.data) {
            BaseService.currentPagePopupForm = [];
            $mdDialog.hide(res.data);
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.scannerForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.scannerForm, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //check ipAddress and node name unique validation
    vm.checkipAddressAlreadyExists = (columnValue, columnName) => {
      vm.isduplicate = false;
      if (vm.scanner && (vm.scanner.ipAddress || vm.scanner.nodename || vm.scanner.usbModelName || vm.scanner.macAddress)) {
        const objs = {
          id: vm.scanner.id,
          ipAddress: vm.scanner.ipAddress,
          nodename: vm.scanner.nodename,
          usbModelName: vm.scanner.usbModelName
        };
        const uniquecolumnName = columnValue === 'usbModelName' ? stringFormat('{0} (For USB configuration)', columnName) : columnName;
        vm.cgBusyLoading = ScannerFactory.checkipAddressAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, uniquecolumnName);

            const uniqueObj = {
              messageContent: messageContent,
              controlName: columnValue
            };

            const obj = {
              messageContent: uniqueObj.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.scanner[columnValue] = null;

            DialogFactory.messageAlertDialog(obj).then(() => {
              if (uniqueObj.controlName) {
                setFocusByName(uniqueObj.controlName);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.scannerForm];
    });
  }
})();
