(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('CustomerRefundListController', CustomerRefundListController);

  /** @ngInject */
  function CustomerRefundListController(TRANSACTION, $filter, $state, BaseService, MyProfileFactory, CORE) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.CustomerRefundListTabIDs = angular.copy(TRANSACTION.CustomerRefundListTabIDs);

    vm.tabList = [
      {
        id: vm.CustomerRefundListTabIDs.SummaryList,
        title: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_STATE,
        viewsrc: 'summary', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustRefundListTabID) === TRANSACTION.CustomerRefundListTabIDs.SummaryList
      },
      {
        id: vm.CustomerRefundListTabIDs.DetailList,
        title: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_STATE,
        viewsrc: 'detail', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustRefundListTabID) === TRANSACTION.CustomerRefundListTabIDs.DetailList
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustRefundListTabID) === TRANSACTION.CustomerRefundListTabIDs.DetailList) {
        vm.activeTab = TRANSACTION.CustomerRefundListTabIDs.DetailList;
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_STATE);
      } else {
        vm.activeTab = TRANSACTION.CustomerRefundListTabIDs.SummaryList;
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_SUMMARY_LIST_STATE);
      }
    };
    setActiveTab();

    //set default tab for employee of customer refund list
    vm.setCurrentTabAsDefaultForEmp = (selectedTabID) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultCustRefundListTabID.id,
        configurationValue: selectedTabID
      };

      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.loginUser.userConfiguration.defaultCustRefundListTabID = objTab.configurationValue;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: customer refund.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.setLoginUser(BaseService.loginUser);
          _.each(vm.tabList, (tabItem) => {
            tabItem.isDefaultTab = tabItem.id === objTab.configurationValue ? true : false;
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
