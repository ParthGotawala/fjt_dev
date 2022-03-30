(function () {
  'use strict';

  angular.module('app.transaction.customerinvoice')
    .controller('CustomerInvoiceListController', CustomerInvoiceController);

  /** @ngInject */
  function CustomerInvoiceController($state, BaseService, CORE, TRANSACTION, MyProfileFactory, $filter) {
    const vm = this;
    vm.loginUser = BaseService.loginUser;
    vm.CustomerInvoiceListTabIDs = angular.copy(TRANSACTION.CustomerInvoiceListTabIDs);
    vm.CustomerCreditNoteListTabIDs = angular.copy(TRANSACTION.CustomerCreditNoteListTabIDs);
    vm.transType = $state.params.transType;
    vm.tabList = [];
    vm.isCurrentTabAsDefaultView = false;

    if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
      vm.tabList = [
        {
          id: vm.CustomerInvoiceListTabIDs.SummaryList,
          title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_LABEL,
          state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE,
          src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE,
          viewsrc: 'summarylist', isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustInvoiceListTabID) === TRANSACTION.CustomerInvoiceListTabIDs.SummaryList
        },
        {
          id: vm.CustomerInvoiceListTabIDs.DetailList,
          title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_LABEL,
          state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE,
          src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE,
          viewsrc: 'detaillist', isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustInvoiceListTabID) === TRANSACTION.CustomerInvoiceListTabIDs.DetailList
        }
      ];
    } else {
      vm.tabList = [
        {
          id: vm.CustomerCreditNoteListTabIDs.SummaryList,
          title: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_LABEL,
          state: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE,
          src: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE,
          viewsrc: 'summarylist', isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustCreditNoteListTabID) === TRANSACTION.CustomerCreditNoteListTabIDs.SummaryList
        },
        {
          id: vm.CustomerCreditNoteListTabIDs.DetailList,
          title: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_LABEL,
          state: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE,
          src: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE,
          viewsrc: 'detaillist', isDisabled: false,
          isDefaultTab: vm.loginUser && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustCreditNoteListTabID) === TRANSACTION.CustomerCreditNoteListTabIDs.DetailList
        }
      ];
    }

    const setActiveTab = () => {
      if (vm.loginUser) {
        if ($state.params.transNumber) {
          // condition for opening detail tab of selected invoice from  summary
          vm.activeTab = TRANSACTION.CustomerInvoiceListTabIDs.DetailList;
        } else if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
          if (item[0]) {
            vm.activeTab = item[0].id;
          } else if (vm.loginUser && vm.loginUser.userConfiguration && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustInvoiceListTabID) === TRANSACTION.CustomerInvoiceListTabIDs.DetailList) {
            vm.activeTab = TRANSACTION.CustomerInvoiceListTabIDs.DetailList;
            if ($state.current.name !== TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE) {
              $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE);
            }
          } else {
            vm.activeTab = TRANSACTION.CustomerInvoiceListTabIDs.SummaryList;
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE);
          }
        } else {
          const item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
          if (item[0]) {
            vm.activeTab = item[0].id;
          } else if (vm.loginUser && vm.loginUser.userConfiguration && vm.loginUser.userConfiguration && parseInt(vm.loginUser.userConfiguration.defaultCustCreditNoteListTabID) === TRANSACTION.CustomerCreditNoteListTabIDs.DetailList) {
            vm.activeTab = TRANSACTION.CustomerCreditNoteListTabIDs.DetailList;
            if ($state.current.name !== TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE) {
              $state.go(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE);
            }
          } else {
            vm.activeTab = TRANSACTION.CustomerCreditNoteListTabIDs.SummaryList;
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE);
          }
        }
      }
    };
    setActiveTab();

    //set default tab for employee of payment list / applied credit memo list page
    vm.setCurrentTabAsDefaultForEmp = (selectedIndex) => {
      //if (vm.isCurrentTabAsDefaultView) {
      const objTab = {
        userId: vm.loginUser.userid,
        configurationValue: selectedIndex
      };
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        objTab.configurationID = CORE.ConfigurationMasterKeyList.DefaultCustInvoiceListTabID.id;
      } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
        objTab.configurationID = CORE.ConfigurationMasterKeyList.DefaultCustCreditNoteListTabID.id;
      }
      vm.cgBusyLoading = MyProfileFactory.saveUserConfiguration().query(objTab).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
            BaseService.loginUser.userConfiguration.defaultCustInvoiceListTabID = objTab.configurationValue;
          } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
            BaseService.loginUser.userConfiguration.defaultCustCreditNoteListTabID = objTab.configurationValue;
          }
                  /* only for debug purpose - [S]*/
const tractActivityLog = getLocalStorageValue('tractActivityLog');
if (tractActivityLog && Array.isArray(tractActivityLog)) {
  const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: invoice list.' };
  tractActivityLog.push(obj);
  setLocalStorageValue('tractActivityLog', tractActivityLog);
}
/* [E]*/
          BaseService.setLoginUser(BaseService.loginUser);
          _.each(vm.tabList, (detItem) => {
            if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE && detItem.id === objTab.configurationValue) {
              detItem.isDefaultTab = true;
            } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE && detItem.id === objTab.configurationValue) {
              detItem.isDefaultTab = true;
            } else {
              detItem.isDefaultTab = false;
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
      //}
    };
  }
})();
