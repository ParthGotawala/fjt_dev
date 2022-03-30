(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('HomePageDuplicateEntryDialogPopupController', HomePageDuplicateEntryDialogPopupController);

  function HomePageDuplicateEntryDialogPopupController($mdDialog, data) {
    const vm = this;
    vm.messageContent = data && data.messageContent ? data.messageContent : {};
    vm.messageData = data && data.duplicateData ? data.duplicateData : [];
    vm.ok = () => {
      $mdDialog.cancel();
    };
  }
})();
