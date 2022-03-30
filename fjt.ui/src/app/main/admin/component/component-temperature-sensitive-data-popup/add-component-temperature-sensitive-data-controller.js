(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('AddComponentTemperatureSensitiveDataController', AddComponentTemperatureSensitiveDataController);

  /** @ngInject */
  function AddComponentTemperatureSensitiveDataController(data, $scope, $mdDialog, $filter, $timeout, BaseService, CORE, DialogFactory, USER, ComponentFactory) {
    const vm = this;
    vm.isUpdatable = true;
    vm.refComponentID = (data && data.refComponentID) ? data.refComponentID : null;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.id = (data && data.id) ? data.id : null;

    vm.TemperatureData = {
      refComponentID: vm.refComponentID
    };

    let getData = () => {
      if (vm.id) {
        vm.cgBusyLoading = ComponentFactory.getComponentTemperatureSensitiveDataByID().query({
          id: vm.id
        }).$promise.then((response) => {
          if (response.data) {
            vm.TemperatureData = response.data;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };
    getData();

    vm.cancel = () => {
      let isdirty = vm.AddTemperatureSensitiveDataForm.$dirty;
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    }

    vm.save = () => {
      if (vm.AddTemperatureSensitiveDataForm.$invalid) {
        BaseService.focusRequiredField(vm.AddTemperatureSensitiveDataForm);
        return;
      }
      var _dummyEvent = null;
      return DialogFactory.dialogService(
        CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
        CORE.MANAGE_PASSWORD_POPUP_VIEW,
        _dummyEvent, {
          isValidate: true
        }).then((data) => {
          if (data) {
            if (vm.id) {
              vm.cgBusyLoading = ComponentFactory.updateComponentTemperatureSensitiveData().query({
                tempDataObj: vm.TemperatureData
              }).$promise.then((res) => {
                if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                  $mdDialog.hide(res);
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
            else {
              vm.cgBusyLoading = ComponentFactory.createComponentTemperatureSensitiveData().query({
                tempDataObj: vm.TemperatureData
              }).$promise.then((res) => {
                if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                  $mdDialog.hide(res);
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }
        }, (err) => {
          // Empty
        });
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();
