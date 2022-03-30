(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('RemoveMPNConfirmationController', RemoveMPNConfirmationController);

  /** @ngInject */
  function RemoveMPNConfirmationController($mdDialog, CORE, data) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.pidCode = data.pidCode;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.UMID_STOCK_CONFIRMATION_ON_CPN_MAPPING_REMOVE);
    vm.errorMessage = messageContent;

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.ok = () => {
      $mdDialog.hide(true);
    };
  }
})();
