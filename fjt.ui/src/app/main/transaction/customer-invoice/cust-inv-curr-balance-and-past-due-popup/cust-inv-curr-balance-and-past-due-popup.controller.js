(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('CustomerInvCurrBalanceAndPastDuePopupController', CustomerInvCurrBalanceAndPastDuePopupController);

  /** @ngInject */
  function CustomerInvCurrBalanceAndPastDuePopupController(TRANSACTION, $mdDialog) {
    const vm = this;
    vm.custInvPayAgedReceivableTabsConst = TRANSACTION.CustInvPayAgedReceivableTabs;
    vm.custInvPayAgedReceivableTabListConst = _.values(vm.custInvPayAgedReceivableTabsConst);
    vm.selectedNavItem = vm.custInvPayAgedReceivableTabsConst.PastDue.tabName;

    vm.onSelectTabChange = (tabDetail) => {
      switch (tabDetail.tabName) {
        //case vm.custInvPayAgedReceivableTabsConst.AgedReceivable.tabName:
        //  vm.selectedNavItem = vm.custInvPayAgedReceivableTabsConst.AgedReceivable.tabName;
        //  break;
        //case vm.custInvPayAgedReceivableTabsConst.PastDue.tabName:
        //  vm.selectedNavItem = vm.custInvPayAgedReceivableTabsConst.PastDue.tabName;
        //  break;
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
