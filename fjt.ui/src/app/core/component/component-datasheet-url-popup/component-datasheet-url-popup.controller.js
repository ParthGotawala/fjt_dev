(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentDataSheetURLPopupController', ComponentDataSheetURLPopupController);

  function ComponentDataSheetURLPopupController($mdDialog, CORE, BaseService) {
    const vm = this;
    vm.isDisable = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.WebSitePattern = CORE.WebSitePattern;

    vm.confirmSelect = () => {
      $mdDialog.cancel(vm.DataSheetURL.URL);
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();
