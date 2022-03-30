(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('assemblyStockDetailList', AssemblyStockDetailList);

  /** @ngInject */
  function AssemblyStockDetailList($state, $mdDialog, USER, CORE, AssemblyStockFactory, DialogFactory, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        assyId: '=?',
        isReadOnly: '=?',
        mfgType: '=?'
      },
      templateUrl: 'app/directives/custom/assembly-stock-detail-list/assembly-stock-detail-list.html',
      controller: AssemblyStockDetailListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function AssemblyStockDetailListCtrl($scope) {
      var vm = this;
      vm.loginUser = BaseService.loginUser;
      vm.LabelConstant = CORE.LabelConstant;
      vm.currentState = $state.current.name;
      //vm.currentState = TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE;
      vm.showTab = false;
      vm.isNoDataFound = false;
      vm.assyId = $scope.assyId;
      vm.assyStockType = CORE.ASSY_STOCK_TYPE;
      vm.AssemblyStockTabs = USER.AssemblyStockTabs;
      vm.mfgType = $scope.mfgType;
      vm.Assembly_Stock_Type_Name = CORE.Assembly_Stock_Type_Name;
      vm.subTabName = $state.params.subTab;


      if (vm.subTabName) {
        const tab = _.find(vm.AssemblyStockTabs, (item) => item.Name === vm.subTabName);
        if (tab) {
          vm.selectedTabIndex = tab.ID;
        }
      }

      vm.stateTransfer = (tabIndex) => {
        var itemTabName = _.find(vm.AssemblyStockTabs, (valItem) => valItem.ID === tabIndex);
        if (itemTabName && itemTabName.Name !== vm.tabName) {
          const routeState = vm.mfgType && vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_OPENING_STOCK_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_STATE;
          $state.go(routeState, { coid: vm.assyId, selectedTab: USER.PartMasterTabs.OpeningStock.Name, subTab: itemTabName.Name });
        }
      };

      vm.onTabChanges = (TabName, msWizard) => {
        if (TabName === vm.Assembly_Stock_Type_Name.InitialAssemblyStock) {
          vm.isOpeningStockTab = true;
        } else {
          vm.isOpeningStockTab = false;
        }
        if (TabName === vm.Assembly_Stock_Type_Name.WOStock) {
          vm.isProductionStockTab = true;
        } else {
          vm.isProductionStockTab = false;
        }
        msWizard.selectedIndex = vm.selectedTabIndex;
        vm.stateTransfer(vm.selectedTabIndex);
        $('#content').animate({ scrollTop: 0 }, 200);
      };
    }
  }
})();
