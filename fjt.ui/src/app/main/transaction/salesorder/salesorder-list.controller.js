(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrdersListController', SalesOrdersListController);

  /** @ngInject */
    function SalesOrdersListController($state, TRANSACTION, $stateParams, $filter, BaseService, MyProfileFactory, CORE, DialogFactory) {
    const vm = this;
    vm.listType = parseInt($stateParams.listType);
    vm.loginUser = BaseService.loginUser;
    active();
    function active() {
      vm.tabList = [
        {
          id: 0,
          title: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_LABEL,
          src: (vm.listType ? TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_DETAIL_STATE : TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_STATE),
          viewsrc: 'detail',
          isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultSalesOrderListTabID) === TRANSACTION.PO_DETAIL_TAB.DETAIL,
          tabID: TRANSACTION.PO_DETAIL_TAB.DETAIL
        },
        {
          id: 1,
          title: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_LABEL,
          src: (vm.listType ? TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_PART_STATE : TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_STATE),
          viewsrc: 'partdetail',
          isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultSalesOrderListTabID) === TRANSACTION.PO_DETAIL_TAB.PART_DETAIL,
          tabID: TRANSACTION.PO_DETAIL_TAB.PART_DETAIL
        }
      ];

      const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
        vm.title = item[0].title;
      }
      else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultSalesOrderListTabID) === TRANSACTION.PO_DETAIL_TAB.PART_DETAIL) {
        vm.activeTab = 1;
        vm.title = vm.tabList[1].title;
        $state.go((vm.listType ? TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_PART_STATE : TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_STATE), { listType: vm.listType });
      }
      else {
        vm.activeTab = 0;
        vm.title = vm.tabList[0].title;
        $state.go((vm.listType ? TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_DETAIL_STATE : TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_STATE), { listType: vm.listType });
      }
    }

    vm.onTabChanges = (item) => vm.title = item.title;

    vm.AddSalesOrderButtonObj = {
      buttonText: 'Add Sales Order',
      buttonRoute: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE,
      buttonParams: { sID: 0 }
    };

    //show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: CORE.PageName.sales_order,
        legendList: CORE.LegendList.SalesOrderList
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

    //set default tab for employee of payment list / applied credit memo list page
    vm.setCurrentTabAsDefaultForEmp = (item) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultSalesOrderListTabID.id,
        configurationValue: item.tabID
      };
      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((data) => {
        if (data) {
          BaseService.loginUser.userConfiguration.defaultSalesOrderListTabID = objTab.configurationValue;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: sales order.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.setLoginUser(BaseService.loginUser);
          _.each(vm.tabList, (detItem) => {
            if (detItem.tabID === objTab.configurationValue) {
              detItem.isDefaultTab = true;
            } else {
              detItem.isDefaultTab = false;
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
