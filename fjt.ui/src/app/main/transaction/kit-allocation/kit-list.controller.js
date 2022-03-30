(function () {
  'use strict';
  angular.module('app.transaction.kitlist').controller('KitListController', KitListController);
  function KitListController($stateParams, $state, CORE, KitAllocationFactory, TRANSACTION, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.TRANSACTION = TRANSACTION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.KitListTab = CORE.KitListTab;
    vm.selectedRowsItem = [];
    vm.tabName = $stateParams.selectedTab;
    vm.isMainAssembly = false;
    vm.isSubAssembly = false;
    vm.isMRPList = false;


    //show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: CORE.LabelConstant.KitList.PageName,
        legendList: CORE.LegendList.KitList
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
          //sucess section
        },
          (error) => BaseService.getErrorLog(error));
    };

    if (vm.tabName) {
      const tab = _.find(vm.KitListTab, (item) => item.Name === vm.tabName);
      if (tab) {
        vm.selectedTabIndex = tab.id;
      }
    }

    const getCountOfSubAssemblyKits = () => {
      vm.cgBusyLoading = KitAllocationFactory.getCountOfSubAssemblyKits().query().$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.subAssyCount) {
          vm.SubAssemblyCount = response.data.subAssyCount || 0;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCountOfSubAssemblyKits();

    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(vm.KitListTab, (valItem) => valItem.id === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        //vm.tabName = itemTabName.Name;
        const routeState = vm.isMRPList ? TRANSACTION.TRANSACTION_PURCHASE_LIST_STATE : (vm.isSubAssembly ? TRANSACTION.SUB_KIT_LIST_STATE : TRANSACTION.KIT_LIST_STATE);
        $state.go(routeState);
      }
    };

    vm.onTabChanges = (TabName, msWizard) => {
      if (TabName === vm.KitListTab.KitList.Name) {
        vm.isMainAssembly = true;
      } else {
        vm.isMainAssembly = false;
      }
      if (TabName === vm.KitListTab.SubKitList.Name) {
        vm.isSubAssembly = true;
      } else {
        vm.isSubAssembly = false;
      }
      if (TabName === vm.KitListTab.MRPList.Name) {
        vm.isMRPList = true;
      } else {
        vm.isMRPList = false;
      }
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);
    };
  }
})();

