(function () {
  'use strict';

  angular
    .module('app.admin.cotactPerson')
    .controller('EmployeeContactPersonHistoryPopupController', EmployeeContactPersonHistoryPopupController);

  /** @ngInject */
  function EmployeeContactPersonHistoryPopupController($mdDialog, data, DialogFactory) {
    var vm = this;
    vm.title = data.title;
    vm.employeeId = data.employeeId || null;
    vm.contactPersonId = data.contactPersonId || null;
    vm.headerData = data.headerData || [];

    vm.cancel = () => {
      DialogFactory.closeAllDialogPopup();
    };
  }
})();
