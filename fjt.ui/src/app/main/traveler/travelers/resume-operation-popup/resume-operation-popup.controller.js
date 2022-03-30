(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ResumePopupController', ResumePopupController);

  /** @ngInject */
  function ResumePopupController($mdDialog, data, WorkorderTransFactory, CORE, BaseService) {
    const vm = this;
    var detailOfOperation = angular.copy(data);
    vm.selectedItems = [];
    vm.data = detailOfOperation;
    vm.data.isSetup = vm.data.isSetup ? vm.data.isSetup : false;
    vm.data.opData.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.headerdata = [];

    vm.cancel = (data) => {
      $mdDialog.cancel(data);
    };

    vm.ResumeActivity = () => {
      vm.isSaveButtonDisable = true;
      vm.cgBusyLoading = WorkorderTransFactory.resumeEmployeeForOperation().save(vm.data.opHistory).$promise.then((res) => {
        vm.isSaveButtonDisable = false;
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          closeResumePopupWithSuccess();
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
          closeResumePopupWithSuccess(); // to close popup and refresh traveler details in case of any error
        }
      }).catch((error) => {
        vm.isSaveButtonDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    const closeResumePopupWithSuccess = () => {
      const objSuccess = {};
      objSuccess.message = CORE.ApiResponseTypeStatus.SUCCESS;
      vm.cancel(objSuccess);
    };
  }
})();
