(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('selectContactPersonPopupController', selectContactPersonPopupController);

  /** @ngInject */
  function selectContactPersonPopupController($mdDialog, data, BaseService) {
    const vm = this;
    vm.popupParamData = angular.copy(data);
    vm.companyName = data ? (data.companyName ? data.companyName : null) : null;
    vm.title = 'Contact Person';
    vm.selectedContactPerson = data && data.selectedContactPerson;

    /* apply selected Contact Person  */
    vm.applyDefalutContactPerson = () => {
      if (!vm.isdirty) {
        if (BaseService.focusRequiredField(vm.customerBillingContactForm)) {
          return;
        }
      } else {
        $mdDialog.cancel(vm.selectedContactPerson ? vm.selectedContactPerson : null);
      }
    };

    vm.selectCallback = (selectedPerson) => {
      vm.isdirty = true;
      vm.selectedContactPerson = selectedPerson;
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
