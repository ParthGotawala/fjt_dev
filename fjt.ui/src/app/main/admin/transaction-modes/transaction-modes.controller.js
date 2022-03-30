(function () {
  'use strict';

  angular
    .module('app.admin.transactionmodes')
    .controller('TransactionModesController', TransactionModesController);

  /** @ngInject */
  function TransactionModesController($scope, $state, $stateParams, USER, BaseService) {
    var vm = this;
    // vm.loginUser = BaseService.loginUser;
    vm.tabName = $stateParams.tabName ? $stateParams.tabName.toLowerCase() : USER.TransactionModesTabs.Payable.Name;
    vm.transactionModesTabs = USER.TransactionModesTabs;
    vm.selectedTab = _.find(USER.TransactionModesTabs, (tabs) => tabs.Name === vm.tabName);
    vm.selectedIndex = vm.selectedTab.Index;

    // On tab change filter data for parts
    vm.onTabChanges = (IsPayableMethods, IsClick) => {
      if (IsClick) {
        if (IsPayableMethods) {
          $state.go(USER.ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_STATE);
        } else {
          $state.go(USER.ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_STATE);
        }
      }
    };

    //update record
    vm.updateRecord = (row) => {
      BaseService.goToManageTransactionModes(vm.tabName, row && row.entity ? row.entity.id : null, false);
    };
  }
})();
