(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SignaturePopupController', SignaturePopupController);

  /** @ngInject */
  function SignaturePopupController($mdDialog, data) {
    const vm = this;
    vm.data = data;

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
