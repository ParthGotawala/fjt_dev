(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierRMADuplicateConfirmationPopupController', SupplierRMADuplicateConfirmationPopupController);

  function SupplierRMADuplicateConfirmationPopupController($mdDialog, data, CORE, TRANSACTION, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.messageData = data;
    vm.messageContent = data && data.messageContent ? data.messageContent : {};
    vm.buttonsList = data && data.buttonsList ? data.buttonsList : [];
    vm.buttonIndexForFocus = data && (data.buttonIndexForFocus || data.buttonIndexForFocus === 0) && data.buttonsList.length > 0 ? data.buttonIndexForFocus : vm.buttonsList.length > 0 ? vm.buttonsList.length - 1 : -1;

    vm.selectRecord = (row) => {
      if (vm.messageData && vm.messageData.rmaList) {
        if (row.isSelect) {
          vm.selectedRow = angular.copy(row);
        } else {
          vm.selectedRow = {};
        }
        _.each(vm.messageData.rmaList, (item) => {
          if (row.id !== item.id) {
            item.isSelect = false;
          }
        });
      }
    };

    vm.goToSupplierRMADetail = (id) => {
      if (id) {
        BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, id);
      }
    };

    vm.cancel = (name) => {
      $mdDialog.cancel({ name: name, row: vm.selectedRow });
    };
  }
})();
