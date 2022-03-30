(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('IPWebCamConfigurationPopupController', IPWebCamConfigurationPopupController);

  /** @ngInject */
  function IPWebCamConfigurationPopupController($mdDialog,
    TRANSACTION, CORE, data, BaseService) {
    const vm = this;
    vm.TRANSACTION = TRANSACTION;
    vm.ipWebcamObj = TRANSACTION.IPWebCamConfiguration;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.GoToPlaystore = (ev) => {
      BaseService.openURLInNew(vm.ipWebcamObj.DownloadLink);
    }
  }
})();
