(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('DeleteBOMConfirmationPopupController', DeleteBOMConfirmationPopupController);

  /** @ngInject */
  function DeleteBOMConfirmationPopupController($scope, $mdDialog, CORE, RFQTRANSACTION, data, BaseService, DialogFactory, ImportBOMFactory) {
    var vm = this;
    vm.partID = data.partID;
    vm.deleteBOMOption = RFQTRANSACTION.DELETE_BOM_OPTIONS;
    vm.selectedBOMOption = vm.deleteBOMOption.DELETE_WITHOUT_HISTORY.value;

    vm.deleteBOM = () => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.DELETE_BOM_CONFIRMATION);
      switch (vm.selectedBOMOption) {
        case vm.deleteBOMOption.DELETE_WITHOUT_HISTORY.value: {
          messageContent.message = stringFormat(messageContent.message, vm.deleteBOMOption.DELETE_WITHOUT_HISTORY.dynamicMessage);
          break;
        }
        case vm.deleteBOMOption.DELETE_WITH_HISTORY.value: {
          messageContent.message = stringFormat(messageContent.message, vm.deleteBOMOption.DELETE_WITH_HISTORY.dynamicMessage);
          break;
        }
      }
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = ImportBOMFactory.deleteRFQAssyDetails().query({
            assyID: data.rfqAssyID,
            partID: data.partID,
            deleteOption: vm.selectedBOMOption
          }).$promise.then((response) => {
            if (response && response.data) {
              $mdDialog.hide();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.deleteBOMConfirmationForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();
