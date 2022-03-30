(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('MultipleButtonsDialogPopupController', MultipleButtonsDialogPopupController);

  function MultipleButtonsDialogPopupController($mdDialog, data) {
    const vm = this;
    vm.messageData = data;
    vm.messageContent = data && data.messageContent ? data.messageContent : {};
    vm.buttonsList = data && data.buttonsList ? data.buttonsList : [];
    vm.buttonIndexForFocus = data && (data.buttonIndexForFocus || data.buttonIndexForFocus == 0) && data.buttonsList.length > 0 ? data.buttonIndexForFocus : vm.buttonsList.length > 0 ? vm.buttonsList.length -1 : -1

    vm.cancel = (data) => {
      $mdDialog.cancel(data);
    };

  }
})();
