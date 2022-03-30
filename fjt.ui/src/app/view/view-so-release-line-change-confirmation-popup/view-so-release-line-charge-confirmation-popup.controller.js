(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ViewSOReleaseLineChargeConfirmationPopupController', ViewSOReleaseLineChargeConfirmationPopupController);

  function ViewSOReleaseLineChargeConfirmationPopupController($mdDialog, CORE,data) {
    const vm = this;
    vm.data = data;
    vm.DefaultDateFormat = _dateDisplayFormat;

    vm.querySOReleaseLineList = {
      order: '',
      assembly_search: '',
      limit: 5,
      page: 1,
      isPagination: CORE.isPagination
    };

    vm.headerdata = [];
    vm.soReleaseLinelist = angular.copy(vm.data) || [];
    vm.cancel = (isyes) => {
      $mdDialog.cancel(isyes);
    };
  }
})();
