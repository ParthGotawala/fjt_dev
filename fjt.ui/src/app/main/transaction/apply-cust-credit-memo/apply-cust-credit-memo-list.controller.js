(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomercreditmemo')
    .controller('ApplyCustCreditMemoListController', ApplyCustCreditMemoListController);

  /** @ngInject */
  function ApplyCustCreditMemoListController(BaseService, TRANSACTION, $state, CORE, MyProfileFactory, $filter) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.custAppliedCMListTabIDsConst = angular.copy(TRANSACTION.CustAppliedCreditMemoListTabIDs);

    vm.tabList = [
      {
        id: vm.custAppliedCMListTabIDsConst.SummaryList,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_STATE,
        viewsrc: 'summary', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustAppliedCMListTabID) === TRANSACTION.CustAppliedCreditMemoListTabIDs.SummaryList
      },
      {
        id: vm.custAppliedCMListTabIDsConst.DetailList,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE,
        viewsrc: 'detail', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustAppliedCMListTabID) === TRANSACTION.CustAppliedCreditMemoListTabIDs.DetailList
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustAppliedCMListTabID) === TRANSACTION.CustAppliedCreditMemoListTabIDs.DetailList) {
        vm.activeTab = TRANSACTION.CustAppliedCreditMemoListTabIDs.DetailList;
        $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE);
      } else {
        vm.activeTab = TRANSACTION.CustAppliedCreditMemoListTabIDs.SummaryList;
        $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_STATE);
      }
    };
    setActiveTab();

    //set default tab for employee of applied credit memo list page
    vm.setCurrentTabAsDefaultForEmp = (selectedTabID) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultCustAppliedCMListTabID.id,
        configurationValue: selectedTabID
      };

      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.loginUser.userConfiguration.defaultCustAppliedCMListTabID = objTab.configurationValue;
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: Creditmemo.' };
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
