(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('LegendViewPopupController', LegendViewPopupController);

  /** @ngInject */
  function LegendViewPopupController($mdDialog, data, CORE) {
    const vm = this;
    vm.data = data ? data : {};
    vm.data.FiltersList = CORE.LegendList.FiltersList;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
