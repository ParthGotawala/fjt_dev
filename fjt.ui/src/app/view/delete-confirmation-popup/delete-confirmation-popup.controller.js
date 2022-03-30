(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('DeleteConfirmationPopupController', DeleteConfirmationPopupController);

  /** @ngInject */
  function DeleteConfirmationPopupController($mdDialog, CORE, USER, BaseService, data) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.TransctionList = data.transctionList;
    CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT
    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_WITH_DISPLAY_DETAIL_LIST_MESSAGE);
    messageContent.message = stringFormat(messageContent.message, data.moduleName, data.deleteCount);
    vm.confirmationMessage = messageContent.message;

    vm.Proceed = () => {
      $mdDialog.hide(true);
    }
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.DeleteConfirmationForm];
    });
  }
})();
