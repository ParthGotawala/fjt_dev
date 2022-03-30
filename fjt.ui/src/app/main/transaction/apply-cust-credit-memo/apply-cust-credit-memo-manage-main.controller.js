(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomercreditmemo')
    .controller('ApplyCustCreditMemoToInvManageMainController', ApplyCustCreditMemoToInvManageMainController);

  /** @ngInject */
  function ApplyCustCreditMemoToInvManageMainController($filter, $state, TRANSACTION, BaseService, CORE, DialogFactory, CustomerPaymentFactory, CustomerPackingSlipFactory, $scope, PackingSlipFactory) {
    const vm = this;
    vm.custCreditMemoMstID = isNaN(parseInt($state.params.ccmid)) ? null : parseInt($state.params.ccmid);
    vm.custPaymentMstID = isNaN(parseInt($state.params.pid)) ? null : parseInt($state.params.pid);
    vm.applyCustCreditMemoManageTabIDsConst = angular.copy(TRANSACTION.ApplyCustCreditMemoManageTabIDs);
    let checkCustPaymentCheckNumberList = [];
    vm.saveBtnDisableFlag = false;
    vm.custCreditMemoPayDetParent = {};
    vm.loginUser = BaseService.loginUser;
    vm.documentCountOfAppliedCM = 0;
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;

    vm.tabList = [
      {
        id: vm.applyCustCreditMemoManageTabIDsConst.Detail,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE,
        viewsrc: 'details', isDisabled: false
      },
      {
        id: vm.applyCustCreditMemoManageTabIDsConst.Document,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_STATE,
        viewsrc: 'documents'
        //isDisabled: vm.custCreditMemoPayDetParent.custPaymentMstID ? false : true
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { state: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      }
      else {
        vm.activeTab = 0;
        $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: vm.custCreditMemoMstID, pid: null });
      }
    };
    setActiveTab();

    vm.onTabChanges = (item) => {
      const Params = {
        ccmid: vm.custCreditMemoMstID || vm.custCreditMemoPayDetParent.refCustCreditMemoID,
        pid: vm.custPaymentMstID || vm.custCreditMemoPayDetParent.custPaymentMstID
      };
      $state.go(item.src, Params);
    };

    //get customer Payment/Check Number list
    const getCustPaymentCheckNumberDetails = (searchObj) => CustomerPaymentFactory.getAllCustPaymentCheckNumberList().query({
      refPaymentMode: CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied,
      searchQuery: searchObj.searchQuery
    }).$promise.then((res) => {
      checkCustPaymentCheckNumberList = [];
      if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        checkCustPaymentCheckNumberList = res.data.custInvPaymentList || [];
        _.each(checkCustPaymentCheckNumberList, (custPayItem) => {
          custPayItem.CustPaymentNumberAmoutJoinField = stringFormat('{0} | {1} | ${2} {3}', custPayItem.mfgCodemst.mfgCode, custPayItem.paymentNumber, (custPayItem.paymentAmount || 0).toFixed(2), custPayItem.isPaymentVoided ? '| (Voided)' : '');
        });
        return checkCustPaymentCheckNumberList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const retrieveCustCreditMemoPaymentDet = () => CustomerPackingSlipFactory.getCreditMemoDetailForApplyInInvPayment().query({
      creditMemoTransType: CORE.TRANSACTION_TYPE.CREDITNOTE,
      custCreditMemoMstID: vm.custCreditMemoMstID,
      customerPaymentMstID: vm.custPaymentMstID || null
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS && resp.data.custCreditMemoMstData) {
        const custCreditMemoPayDet = resp.data.custCreditMemoMstData;
        vm.custCreditMemoPayDetParent.custPaymentMstID = custCreditMemoPayDet ? custCreditMemoPayDet.id : null;
        vm.custCreditMemoPayDetParent.paymentNumber = custCreditMemoPayDet.creditMemoNumber;
        vm.custCreditMemoPayDetParent.isPaymentVoidedConvertedValue = custCreditMemoPayDet.isPaymentVoidedConvertedValue;
        vm.custCreditMemoPayDetParent.isPaymentVoided = custCreditMemoPayDet.isPaymentVoided;
        vm.custCreditMemoPayDetParent.creditAppliedStatus = custCreditMemoPayDet.creditAppliedStatus;
        vm.custCreditMemoPayDetParent.CMPaymentStatus = custCreditMemoPayDet.CMPaymentStatus;
        vm.custCreditMemoPayDetParent.mfgFullName = custCreditMemoPayDet.mfgFullName;
        vm.custCreditMemoPayDetParent.mfgcodeID = custCreditMemoPayDet.mfgcodeID;
        vm.custCreditMemoPayDetParent.lockStatus = custCreditMemoPayDet.lockStatus;

        if (vm.custCreditMemoPayDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked && vm.custCreditMemoPayDetParent.lockedByUserName) {
          const userNameWithSplit = vm.custCreditMemoPayDetParent.lockedByUserName.split(' ');
          vm.custCreditMemoPayDetParent.lockedByUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.custCreditMemoPayDetParent.lockedByUserInitialName, userNameWithSplit[0], userNameWithSplit[1]);
        }
        vm.custCreditMemoPayDetParent.isCustPaymentLocked = vm.custCreditMemoPayDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;

        if (vm.custCreditMemoPayDetParent.custPaymentMstID) {
          getAppliedCreditMemoDocumentCount();
          const docTabDet = _.find(vm.tabList, (tabItem) => tabItem.id === vm.applyCustCreditMemoManageTabIDsConst.Document);
          if (docTabDet) {
            docTabDet.isDisabled = false;
          }
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));

    if (vm.custCreditMemoMstID) {
      retrieveCustCreditMemoPaymentDet();
    }

    // when user select customer | payment/check number | amount from auto complete then move to that record
    const onSelectCustPaymentCheckNumber = (selectedInvPayItem) => {
      if (selectedInvPayItem) {
        if (selectedInvPayItem.refCustCreditMemoID !== vm.custCreditMemoMstID) {
          if (BaseService.checkFormDirty(vm.custInvPayFromCreditMemoForm)) {
            const requiredDet = {
              actionType: 'move_on_detail',
              refCustCreditMemoIDToMove: selectedInvPayItem.refCustCreditMemoID,
              custPayMstIDToMove: selectedInvPayItem.id
            };
            showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: selectedInvPayItem.refCustCreditMemoID, pid: selectedInvPayItem.id }, { reload: true });
          }
        }
        vm.autoCompleteCustPaymentCheckNumber.keyColumnId = null;
      }
    };

    vm.autoCompleteCustPaymentCheckNumber = {
      columnName: 'CustPaymentNumberAmoutJoinField',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'CustpaymentNumber',
      placeholderName: 'Customer | Payment# or Check# | Amount',
      isRequired: false,
      isAddnew: false,
      callbackFn: function (query) {
        const searchObj = {
          searchQuery: query
        };
        return getCustPaymentCheckNumberDetails(searchObj);
      },
      onSearchFn: function (query) {
        const searchObj = {
          searchQuery: query
        };
        return getCustPaymentCheckNumberDetails(searchObj);
      },
      onSelectCallbackFn: onSelectCustPaymentCheckNumber
    };

    //go back to list page
    vm.goBack = () => {
      BaseService.setLatestLoginUserLocalStorageDet();

      switch (vm.activeTab) {
        case vm.applyCustCreditMemoManageTabIDsConst.Detail:
          if (BaseService.checkFormDirty(vm.custInvPayFromCreditMemoForm)) {
            showWithoutSavingAlertforGobackOrPayDetPage(null);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE);
          }
          break;
        default:
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE);
          break;
      }
    };

    //apply new customer credit memo
    vm.applyCustCreditMemo = (openInNewTab) => {
      if (openInNewTab) {
        BaseService.goToApplyCustCreditMemoToPayment(0, null);
      }
      else {
        const isFormDirty = vm.custInvPayFromCreditMemoForm ? vm.custInvPayFromCreditMemoForm.$dirty : false;
        if (isFormDirty) {
          const requiredDet = {
            actionType: 'move_on_detail',
            custPayMstIDToMove: 0
          };
          showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
        } else {
          $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: 0, pid: null }, { reload: true });
        }
      }
    };

    // to Show save alert pop-up on go back or go at payment details page
    function showWithoutSavingAlertforGobackOrPayDetPage(requiredDet) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          switch (vm.activeTab) {
            case vm.applyCustCreditMemoManageTabIDsConst.Detail:
              vm.custInvPayFromCreditMemoForm.$setPristine();
              break;
            default:
              break;
          }
          if (requiredDet && requiredDet.actionType === 'move_on_detail') {
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: requiredDet.refCustCreditMemoIDToMove, pid: requiredDet.custPayMstIDToMove }, { reload: true });
          } else {
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE);
          }
        }
      }, () => {
        // cancel block
        vm.autoCompleteCustPaymentCheckNumber.keyColumnId = null;
        $scope.$broadcast(vm.autoCompleteCustPaymentCheckNumber.inputName + 'searchText', null);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* function to check form dirty on tab change */
    vm.isStepValid = () => {
      let isDirty = false;

      switch (vm.activeTab) {
        case vm.applyCustCreditMemoManageTabIDsConst.Detail: {
          isDirty = BaseService.checkFormDirty(vm.custInvPayFromCreditMemoForm);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange();
          }
          break;
        }
      }
    };

    /* Show save alert pop up when performing tab change */
    function showWithoutSavingAlertforTabChange() {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          switch (vm.activeTab) {
            case vm.applyCustCreditMemoManageTabIDsConst.Detail: {
              vm.custInvPayFromCreditMemoForm.$setPristine();
              break;
            }
          }
          return true;
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //on for document
    const bindDocuments = $scope.$on('documentCount', () => {
      getAppliedCreditMemoDocumentCount();
    });

    const getAppliedCreditMemoDocumentCount = () => {
      if (vm.custCreditMemoPayDetParent.custPaymentMstID) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.custCreditMemoPayDetParent.custPaymentMstID,
          type: CORE.AllEntityIDS.ApplyCustomerCreditMemo.Name
        }).$promise.then((response) => {
          vm.documentCountOfAppliedCM = response && response.data ? response.data : 0;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCountOfAppliedCM = 0;
      }
    };
    //getAppliedCreditMemoDocumentCount();

    // display Apply Customer CM detail history
    vm.viewAppliedCustCMHistory = (row, ev) => {
      const data = {
        id: vm.custPaymentMstID,
        mfgcodeID: vm.custCreditMemoPayDetParent.mfgcodeID,
        customerCodeName: vm.custCreditMemoPayDetParent.mfgFullName,
        paymentNumber: vm.custCreditMemoPayDetParent.paymentNumber,
        refCustCreditMemoID: vm.custCreditMemoMstID,
        refPaymentMode: CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied
      };
      DialogFactory.dialogService(
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //redirect to customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    //go to customer detail page
    vm.goToCustomerDetail = () => {
      BaseService.goToCustomer(vm.selectedCustomerDet.id);
    };

    /* to get/apply class for customer payment status */
    vm.getCustPaymentStatusClassName = (paymentStatus) => BaseService.getCustPaymentStatusClassName(paymentStatus);

    /* to go at invoice list page */
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };

    // get class for applying credit memo
    vm.getClassNameForApplyCreditMemo = (status) => BaseService.getCustCreditAppliedStatusClassName(status);

    /* to go at applied customer credit memo list page */
    vm.goToAppliedCustCreditMemoList = () => {
      BaseService.goToAppliedCustCreditMemoToInvList();
    };

    $scope.$on('$destroy', () => {
      bindDocuments();
    });
  }
})();
