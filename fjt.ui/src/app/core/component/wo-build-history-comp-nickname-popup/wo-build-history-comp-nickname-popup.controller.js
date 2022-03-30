(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('WOBuildHistoryCompNicknamePopupController', WOBuildHistoryCompNicknamePopupController);

  /** @ngInject */
  function WOBuildHistoryCompNicknamePopupController($mdDialog, data) {
    const vm = this;
    vm.popupParamData = data || null;

    vm.onTabChanges = (msWizard) => {
      vm.isDisplaySummaryView = false;
      vm.isDisplayDetailView = false;
      vm.isDisplayInitialStockView = false;
      if (msWizard.selectedIndex === 0) {
        // Summary View
        vm.isDisplaySummaryView = true;
      } else if (msWizard.selectedIndex === 1) {
        // Detail View
        vm.isDisplayDetailView = true;
      } else if (msWizard.selectedIndex === 2) {
        // Initial Stock View
        vm.isDisplayInitialStockView = true;
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
