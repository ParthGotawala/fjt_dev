(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SalesOrderSkipKitConfirmationErrorPopupController', SalesOrderSkipKitConfirmationErrorPopupController);

  /** @ngInject */
  function SalesOrderSkipKitConfirmationErrorPopupController($mdDialog, data, BaseService, CORE) {
    const vm = this;
    vm.confirmation = data;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.CORE = CORE;

    vm.goToKitDetail = (data) => {
      BaseService.goToKitList(data.id, data.partID, null);
    };

    vm.confirm = ()=> {
      $mdDialog.cancel(true);
    };

    vm.cancel = () => {
      $mdDialog.cancel(false);
    };
  }
})();
