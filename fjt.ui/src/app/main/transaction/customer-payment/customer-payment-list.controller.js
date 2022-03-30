(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('CustomerPaymentListController', CustomerPaymentListController);

  /** @ngInject */
  function CustomerPaymentListController(TRANSACTION, $filter, $state, BaseService, MyProfileFactory, CORE) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.CustomerPaymentListTabIDs = angular.copy(TRANSACTION.CustomerPaymentListTabIDs);

    vm.tabList = [
      {
        id: vm.CustomerPaymentListTabIDs.SummaryList,
        title: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_STATE,
        viewsrc: 'summary', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPaymentListTabID) === vm.CustomerPaymentListTabIDs.SummaryList
      },
      {
        id: vm.CustomerPaymentListTabIDs.DetailList,
        title: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE,
        viewsrc: 'detail', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPaymentListTabID) === vm.CustomerPaymentListTabIDs.DetailList
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPaymentListTabID) === TRANSACTION.CustomerPaymentListTabIDs.DetailList) {
        vm.activeTab = TRANSACTION.CustomerPaymentListTabIDs.DetailList;
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE);
      } else {
        vm.activeTab = TRANSACTION.CustomerPaymentListTabIDs.SummaryList;
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_STATE);
      }
    };
    setActiveTab();

    //set default tab for employee of payment list
    vm.setCurrentTabAsDefaultForEmp = (selectedTabID) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultCustPaymentListTabID.id,
        configurationValue: selectedTabID
      };

      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.loginUser.userConfiguration.defaultCustPaymentListTabID = objTab.configurationValue;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: payment list.' };
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
