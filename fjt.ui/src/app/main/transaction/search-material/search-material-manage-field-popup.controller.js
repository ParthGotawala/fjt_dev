(function () {
  'use strict';

  angular
    .module('app.transaction.searchMaterial')
    .controller('SearchMaterialManageFieldPopUpController', SearchMaterialManageFieldPopUpController);

  function SearchMaterialManageFieldPopUpController($mdDialog, CORE, BaseService, data, MasterFactory) {
    const vm = this;
    vm.columnsList = angular.copy(data);
    vm.gridConfig = CORE.gridConfig;

    vm.columnsList = _.filter(vm.columnsList, (data) => !data.isDefault);

    _.map(vm.columnsList, (data) => {
      data.hidden = !data.hidden;
    });

    vm.columnsListCopy = angular.copy(vm.columnsList);

    vm.changeVisibility = () => {
      if (BaseService.focusRequiredField(vm.formSearchMaterialManageField)) {
        vm.saveBtnDisableFlag = false;
        return;
      }

      _.map(vm.columnsList, (data) => {
        data.hidden = !data.hidden;
      });

      vm.cgBusyLoading = MasterFactory.saveUIGridColumnDetail().query({ gridId: vm.gridConfig.gridSearchMaterialHotTable, columnDefList: vm.columnsList }).$promise.then(() => {
        vm.formSearchMaterialManageField.$setPristine();
        vm.formSearchMaterialManageField.$setUntouched();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(vm.columnsList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      if (vm.formSearchMaterialManageField.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formSearchMaterialManageField.$setPristine();
        vm.formSearchMaterialManageField.$setUntouched();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formSearchMaterialManageField];
    });
  }
})();
