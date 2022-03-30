(function () {
  'use strict';

  angular
    .module('app.admin.operatingtemperatureconversion')
    .controller('AddUpdateOperatingTemperatureConversionPopupController', AddUpdateOperatingTemperatureConversionPopupController);

  /** @ngInject */
  function AddUpdateOperatingTemperatureConversionPopupController($scope, $mdDialog, data, $q, CORE, USER, BaseService, DialogFactory, OperatingTemperatureConversionFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.id = (data && data.id) ? data.id : undefined;

    vm.getOperatingTemperatureConversion = () => {
      if (vm.id) {
        return OperatingTemperatureConversionFactory.operatingtemperatureconversion().query({
          id: vm.id
        }).$promise.then((response) => {
          if (response && response.data) {
            vm.operatingTemperatureConversion = response.data;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.save = () => {
      if (vm.operatingTemperatureForm.$invalid) {
        BaseService.focusRequiredField(vm.operatingTemperatureForm);
        return;
      }

      if (vm.operatingTemperatureConversion && vm.operatingTemperatureConversion.id) {
        vm.cgBusyLoading = OperatingTemperatureConversionFactory.operatingtemperatureconversion().update({
          id: vm.id,
        },vm.operatingTemperatureConversion).$promise.then((response) => {
          if (response && response.data) {
            BaseService.currentPagePopupForm.pop();
            DialogFactory.hideDialogPopup();
          }
          else if (response && response.errors) {
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.operatingTemperatureForm);
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = OperatingTemperatureConversionFactory.operatingtemperatureconversion().save(vm.operatingTemperatureConversion).$promise.then((response) => {
          if (response && response.data) {
            BaseService.currentPagePopupForm.pop();
            DialogFactory.hideDialogPopup();
          }
          else if (response && response.errors) {
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.operatingTemperatureForm);
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.operatingTemperatureForm);
      if (isdirty) {
        let data = {
          form: vm.operatingTemperatureForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    //check load
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.operatingTemperatureForm);
      vm.getOperatingTemperatureConversion();
    });
  }
})();
