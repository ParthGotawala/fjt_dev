(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('PartProgramMappingPopupController', PartProgramMappingPopupController);

  /** @ngInject */
  function PartProgramMappingPopupController($scope, $mdDialog, CORE, data, BaseService) {
    var vm = this;
    vm.partID = data.partID;

    vm.save = () => {
      if (!vm.partProgramMappingForm.$dirty) {
        vm.cancel();
        return;
      }
      $scope.$broadcast('savePartProgramMapping');
    };

    const saveDetail = $scope.$on('setMappingFrom', (evt, data) => {
      if (data === CORE.ApiResponseTypeStatus.SUCCESS) {
        $mdDialog.hide();
      }
    });

    $scope.$on('$destroy', () => {
      saveDetail();
    });

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.partProgramMappingForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();
