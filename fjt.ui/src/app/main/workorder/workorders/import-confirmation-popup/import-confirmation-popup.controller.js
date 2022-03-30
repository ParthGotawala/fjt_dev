(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('ImportConfirmationPopupController', ImportConfirmationPopupController);

  /** @ngInject */
  function ImportConfirmationPopupController($scope, $mdDialog, data) {
    const vm = this;
    vm.data = data;

    // on click of cancel button
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    // yes, append all and import
    vm.no = () => {
      $mdDialog.hide(true);
    };

    // yes, append all and import
    vm.yes = () => {
      $mdDialog.hide(false);
    };
  }
})();
