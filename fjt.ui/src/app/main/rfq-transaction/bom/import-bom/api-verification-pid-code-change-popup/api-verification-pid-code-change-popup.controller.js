(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('APIVerificationPIDCodeChangePopupController', APIVerificationPIDCodeChangePopupController);

  /** @ngInject */
  function APIVerificationPIDCodeChangePopupController($mdDialog, $stateParams, $timeout, CORE, USER, data, BaseService, ComponentFactory) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.PIDCodeMultipleHyphenMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMP_MULTIPLE_HYPHEN_IN_PID_CODE_NOT_ALLOWED);
    vm.PIDCodeLength = null;
    vm.pidCodeData = data;
    vm.distType = CORE.MFGTypeDropdown.find((x) => x.Key === 'DIST').Value;

    vm.component = {};
    if (vm.pidCodeData) {
      vm.selectedMfgType = vm.pidCodeData.selectedMfgType;
      vm.component.MFGName = stringFormat('({0}) {1}', vm.pidCodeData.MFGCode, vm.pidCodeData.MFGName);
      vm.component.PIDCodePrefix = vm.pidCodeData.MFGCode + '+';
      vm.component.PIDCodeSufix = vm.pidCodeData.partNumber;
    }

    function getPIDCode() {
      vm.PIDCodeLength = null;
      vm.cgBusyLoading = ComponentFactory.getComponentPIDCode().query({
      }).$promise.then((res) => {
        // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
        $timeout(() => {
          vm.PIDCodeLength = res.data ? res.data.values : 0;
        });
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };
    getPIDCode();

    vm.getPIDCodeValidation = () => {
      if (vm.component.PIDCodeSufix && vm.component.PIDCodeSufix.includes(USER.PIDCodeInvalidCharacter)) {
        return true;
      }
      else {
        return false;
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.savePIDChange = () => {
      if (vm.CorrectPIDCodeForm.$invalid) {
        BaseService.focusRequiredField(vm.CorrectPIDCodeForm);
        return;
      }
      if (vm.getPIDCodeValidation()) {
        setFocus('AddPArtPopupPIDCodeSufix');
        return;
      }

      data.validPIDCode = stringFormat('{0}{1}', vm.component.PIDCodePrefix, vm.component.PIDCodeSufix);

      vm.CorrectPIDCodeForm.$setPristine();
      $mdDialog.hide(data);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.CorrectPIDCodeForm);
      if (isdirty) {
        const data = {
          form: vm.CorrectPIDCodeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
  };
})();
