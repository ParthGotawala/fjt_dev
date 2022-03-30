(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomerwriteoff')
    .controller('ApplyCustWriteOffListController', ApplyCustWriteOffListController);

  /** @ngInject */
  function ApplyCustWriteOffListController(BaseService, TRANSACTION, $state, MyProfileFactory, CORE, $filter) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.custAppliedWriteOffListTabIDsConst = angular.copy(TRANSACTION.CustAppliedWriteOffListTabIDs);

    vm.tabList = [
      {
        id: vm.custAppliedWriteOffListTabIDsConst.SummaryList,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_STATE,
        viewsrc: 'summary', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustAppliedWOFFListTabID) === TRANSACTION.CustAppliedWriteOffListTabIDs.SummaryList
      },
      {
        id: vm.custAppliedWriteOffListTabIDsConst.DetailList,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_STATE,
        viewsrc: 'detail', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustAppliedWOFFListTabID) === TRANSACTION.CustAppliedWriteOffListTabIDs.DetailList
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustAppliedWOFFListTabID) === TRANSACTION.CustAppliedWriteOffListTabIDs.DetailList) {
        vm.activeTab = TRANSACTION.CustAppliedWriteOffListTabIDs.DetailList;
        $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_STATE);
      } else {
        vm.activeTab = TRANSACTION.CustAppliedWriteOffListTabIDs.SummaryList;
        $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_SUMMARY_LIST_STATE);
      }
    };
    setActiveTab();

    //set default tab for employee of applied customer write off
    vm.setCurrentTabAsDefaultForEmp = (selectedTabID) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultCustAppliedWOFFListTabID.id,
        configurationValue: selectedTabID
      };

      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.loginUser.userConfiguration.defaultCustAppliedWOFFListTabID = objTab.configurationValue;
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: cust write off list.' };
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
