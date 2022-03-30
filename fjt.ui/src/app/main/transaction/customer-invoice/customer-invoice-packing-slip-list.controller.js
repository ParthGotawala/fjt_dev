(function () {
  'use strict';

  angular.module('app.transaction.customerpacking')
    .controller('CustomerInvoicePackingSlipListListController', CustomerInvoicePackingSlipListListController);

  /** @ngInject */
  function CustomerInvoicePackingSlipListListController($state, CORE, BaseService, TRANSACTION, MyProfileFactory, $filter) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.CustomerPackingSlipListTabIDs = angular.copy(TRANSACTION.CustomerPackingSlipListTabIDs);
    vm.tabList = [];
    vm.tabList = [
      {
        id: vm.CustomerPackingSlipListTabIDs.SummaryList,
        title: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE,
        viewsrc: 'summarylist', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPackingSlipListTabID) === TRANSACTION.CustomerPackingSlipListTabIDs.SummaryList
      },
      {
        id: vm.CustomerPackingSlipListTabIDs.DetailList,
        title: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_LABEL,
        // state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE,
        state: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE,
        viewsrc: 'detaillist', isDisabled: false,
        isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPackingSlipListTabID) === TRANSACTION.CustomerPackingSlipListTabIDs.DetailList
      }
    ];

    const setActiveTab = () => {
      if (vm.loginUser) {
        const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
        if ($state.params.psNumber) {
          // condition for opening detail of selected packing slip from  summary
          vm.activeTab = TRANSACTION.CustomerPackingSlipListTabIDs.DetailList;
        } else if (item[0]) {
          vm.activeTab = item[0].id;
        } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPackingSlipListTabID) === TRANSACTION.CustomerPackingSlipListTabIDs.SummaryList) {
          vm.activeTab = TRANSACTION.CustomerPackingSlipListTabIDs.SummaryList;
          //if ($state.current.name !== TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE) {
          // above condition added to resolve transition suspended console issue
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE);
          //}
        } else if (vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustPackingSlipListTabID) === TRANSACTION.CustomerPackingSlipListTabIDs.DetailList) {
          vm.activeTab = TRANSACTION.CustomerPackingSlipListTabIDs.DetailList;
          //if ($state.current.name !== TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE) {
          // above condition added to resolve transition suspended console issue
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE);
          //}
        } else {
          vm.activeTab = TRANSACTION.CustomerPackingSlipListTabIDs.SummaryList;
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE);
        }
      }
    };
    setActiveTab();

    //set default tab for employee of payment list / applied credit memo list page
    vm.setCurrentTabAsDefaultForEmp = (selectedIndex) => {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationID: CORE.ConfigurationMasterKeyList.DefaultCustPackingSlipListTabID.id,
        configurationValue: selectedIndex
      };
      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.loginUser.userConfiguration.defaultCustPackingSlipListTabID = objTab.configurationValue;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: cust invoice packing list.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.setLoginUser(BaseService.loginUser);
          _.each(vm.tabList, (detItem) => {
            if (detItem.id === objTab.configurationValue) {
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
