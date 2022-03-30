(function () {
  'use strict';

  angular
    .module('app.transaction.supplierquote')
    .controller('SupplierQuoteController', SupplierQuoteController);

  function SupplierQuoteController($state, TRANSACTION, $stateParams, $filter, BaseService, MyProfileFactory, CORE) {
    const vm = this;
    vm.listType = parseInt($stateParams.listType);
    vm.loginUser = BaseService.loginUser;
    vm.SupplierQuoteListTabIDs = TRANSACTION.SupplierQuoteListTabIDs;
    active();
    function active() {
      vm.tabList = [
        {
          id: vm.SupplierQuoteListTabIDs.SummaryList,
          title: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_LABEL,
          state: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_STATE,
          src: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_STATE,
          viewsrc: 'summarylist',
          isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultSupplierQuoteListTabID) === TRANSACTION.PO_DETAIL_TAB.DETAIL,
          tabID: TRANSACTION.PO_DETAIL_TAB.DETAIL
        },
        {
          id: vm.SupplierQuoteListTabIDs.DetailList,
          title: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_LABEL,
          state: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_STATE,
          src: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_STATE,
          viewsrc: 'detaillist',
          isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultSupplierQuoteListTabID) === TRANSACTION.PO_DETAIL_TAB.PART_DETAIL,
          tabID: TRANSACTION.PO_DETAIL_TAB.PART_DETAIL
        }
      ];

      const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
        vm.title = item[0].title;
      }
      else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultSupplierQuoteListTabID) === TRANSACTION.PO_DETAIL_TAB.PART_DETAIL) {
        vm.activeTab = vm.SupplierQuoteListTabIDs.DetailList;
        vm.title = vm.tabList[1].title;
        $state.go(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_STATE);
      }
      else {
        vm.activeTab = vm.SupplierQuoteListTabIDs.SummaryList;
        vm.title = vm.tabList[0].title;
        $state.go(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_STATE);
      }
    }

    vm.onTabChanges = (item) => vm.title = item.title;

    vm.AddSupplierQuoteButtonObj = {
      buttonText: 'Add Supplier Quote',
      buttonRoute: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE,
      buttonParams: { sID: 0 }
    };

    //set default tab for employee of payment list / applied credit memo list page
    vm.setCurrentTabAsDefaultForEmp = (tabID) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultSupplierQuoteListTabID.id,
        configurationValue: tabID
      };
      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.loginUser.userConfiguration.defaultSupplierQuoteListTabID = objTab.configurationValue;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: supplier quote.' };
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


