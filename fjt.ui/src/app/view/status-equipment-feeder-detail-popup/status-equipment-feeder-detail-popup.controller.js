(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('StatusEquipmentFeederDetailPopupController', StatusEquipmentFeederDetailPopupController);
  /** @ngInject */
  function StatusEquipmentFeederDetailPopupController($scope, $mdDialog, data, BaseService, CORE, $timeout, USER,
    WORKORDER, WorkorderOperationEquipmentFeederFactory, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.statusFeederLocationModel = {
      isActive: true
    };
    if (data && data.objdata.id) {
      vm.statusFeederLocationModel.id = data.objdata.id;
      vm.statusFeederLocationModel.feederLocation = data.objdata.feederLocation;
    }
    // Add Header details
    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.Traveler.Feeder,
      value: vm.statusFeederLocationModel.feederLocation,
      displayOrder: 1,
      isCopy: false
    });


    //save feeder location details
    vm.saveFeederLocation = () => {
      if (vm.UpdateFeederStatusForm.$invalid) {
        BaseService.focusRequiredField(vm.UpdateFeederStatusForm);
        return;
      }
      if (vm.statusFeederLocationModel.isActive) {
        updateFeederLocation();
      }
      else {
        vm.checkduplicateRecord(true);
      }
    };
    //update feeder related details
    function updateFeederLocation() {
      var feederInfo = {
        isActive: false,
        placementType: WORKORDER.FEEDER_PLACEMENT_TYPE[1].Key
      };
      vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.feeder().update({
        id: vm.statusFeederLocationModel.id
      }, feederInfo).$promise.then((res) => {
        if (res.data) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.statusFeederLocationModel);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddQuoteDynamicFieldsForm);
      if (isdirty) {
        const data = {
          form: vm.AddQuoteDynamicFieldsForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.UpdateFeederStatusForm);
    });

    vm.checkduplicateRecord = (isSave) => {
      const objFeeder = {
        feederLocation: vm.statusFeederLocationModel.feederLocation,
        woOpEqpID: data.objdata.woOpEqpID,
        id: vm.statusFeederLocationModel.id
      };
      vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.checkDuplicateFeeder().query({ objFeeder: objFeeder }).$promise.then((res) => {
        if (res.data) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
          messageContent.message = stringFormat(messageContent.message, vm.statusFeederLocationModel.feederLocation);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            vm.statusFeederLocationModel.feederLocation = null;
          }, () => { // Cancel  Section
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          if (isSave) {
            updateFeederLocation();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
