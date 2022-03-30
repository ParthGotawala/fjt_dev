(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('ApplyCustWriteOffToInvManageMainController', ApplyCustWriteOffToInvManageMainController);

  /** @ngInject */
  function ApplyCustWriteOffToInvManageMainController($filter, $state, TRANSACTION, BaseService, CORE, DialogFactory, CustomerPaymentFactory,
    PackingSlipFactory, $scope) {
    const vm = this;
    vm.custPaymentMstID = parseInt($state.params.id);
    vm.applyCustWriteOffManageTabIDsConst = angular.copy(TRANSACTION.ApplyCustWriteOffManageTabIDs);
    let checkCustWriteOffCheckNumberList = [];
    vm.saveBtnDisableFlag = false;
    vm.custPaymentMstDetParent = {};
    vm.loginUser = BaseService.loginUser;
    vm.documentCountOfAppliedWriteOff = 0;
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;

    vm.tabList = [
      {
        id: vm.applyCustWriteOffManageTabIDsConst.Detail,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE,
        viewsrc: 'details', isDisabled: false
      },
      {
        id: vm.applyCustWriteOffManageTabIDsConst.Document,
        title: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_LABEL,
        state: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_STATE,
        src: TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_STATE,
        viewsrc: 'documents',
        isDisabled: vm.custPaymentMstID ? false : true
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { state: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      }
      else {
        vm.activeTab = 0;
        $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE, { id: vm.custPaymentMstID });
      }
    };
    setActiveTab();

    vm.onTabChanges = (item) => {
      const Params = { id: vm.custPaymentMstID };
      $state.go(item.src, Params);
    };

    //get customer Payment/Check Number list
    const getCustPaymentCheckNumberDetails = (searchObj) => CustomerPaymentFactory.getAllCustPaymentCheckNumberList().query({
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code,
      searchQuery: searchObj.searchQuery
    }).$promise.then((res) => {
      checkCustWriteOffCheckNumberList = [];
      if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        checkCustWriteOffCheckNumberList = res.data.custInvPaymentList;
        _.each(checkCustWriteOffCheckNumberList, (custPayItem) => {
          custPayItem.CustPaymentNumberAmoutJoinField = stringFormat('{0} | {1} | ${2} {3}', custPayItem.mfgCodemst.mfgCode, custPayItem.paymentNumber, (custPayItem.paymentAmount || 0).toFixed(2), custPayItem.isPaymentVoided ? '| (Voided)' : '');
        });
        return checkCustWriteOffCheckNumberList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // to get customer invoice payment master data
    const retrieveCustInvPaymentMstData = () => CustomerPaymentFactory.getCustInvPaymentMstData().query({
      customerPaymentMstID: vm.custPaymentMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        /* assign required details , if record not found then 404 error need to display */
        vm.custPaymentMstDetParent = resp.data.custPaymentMstData;
        vm.selectedCustomerDet = {
          id: vm.custPaymentMstDetParent.mfgcodeID,
          mfgFullName: vm.custPaymentMstDetParent.mfgFullName
        };
        if (vm.custPaymentMstDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked && vm.custPaymentMstDetParent.lockedByUserName) {
          const userNameWithSplit = vm.custPaymentMstDetParent.lockedByUserName.split(' ');
          vm.custPaymentMstDetParent.lockedByUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.custPaymentMstDetParent.lockedByUserInitialName, userNameWithSplit[0], userNameWithSplit[1]);
        }
        vm.custPaymentMstDetParent.isCustPaymentLocked = vm.custPaymentMstDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;
      }
    }).catch((error) => BaseService.getErrorLog(error));
    if (vm.custPaymentMstID) {
      retrieveCustInvPaymentMstData();
    }


    // when user select customer | payment/check number | amount from auto complete then move to that record
    const onSelectCustPaymentCheckNumber = (selectedInvPayItem) => {
      if (selectedInvPayItem) {
        if (selectedInvPayItem.id !== vm.custPaymentMstID) {
          if (BaseService.checkFormDirty(vm.custPaymentWriteOffForm)) {
            const requiredDet = {
              actionType: 'move_on_detail',
              custPayMstIDToMove: selectedInvPayItem.id
            };
            showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE, { id: selectedInvPayItem.id }, { reload: true });
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
        case vm.applyCustWriteOffManageTabIDsConst.Detail:
          if (BaseService.checkFormDirty(vm.custPaymentWriteOffForm)) {
            showWithoutSavingAlertforGobackOrPayDetPage(null);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE);
          }
          break;
        default:
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE);
          break;
      }
    };

    //add new customer payment
    vm.applyCustWriteOff = (openInNewTab) => {
      if (openInNewTab) {
        BaseService.goToApplyCustWriteOffToPayment(0);
      }
      else {
        const isFormDirty = vm.custPaymentWriteOffForm ? vm.custPaymentWriteOffForm.$dirty : false;
        if (isFormDirty) {
          const requiredDet = {
            actionType: 'move_on_detail',
            custPayMstIDToMove: 0
          };
          showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
        } else {
          $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE, { id: 0 }, { reload: true });
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
            case vm.applyCustWriteOffManageTabIDsConst.Detail:
              vm.custPaymentWriteOffForm.$setPristine();
              break;
            default:
              break;
          }
          if (requiredDet && requiredDet.actionType === 'move_on_detail') {
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE, { id: requiredDet.custPayMstIDToMove }, { reload: true });
          } else {
            $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE);
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
        case vm.applyCustWriteOffManageTabIDsConst.Detail: {
          isDirty = BaseService.checkFormDirty(vm.custPaymentWriteOffForm);
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
            case vm.applyCustWriteOffManageTabIDsConst.Detail: {
              vm.custPaymentWriteOffForm.$setPristine();
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
      getCustomerPaymentDocumentCount();
    });

    const getCustomerPaymentDocumentCount = () => {
      if (vm.custPaymentMstID) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.custPaymentMstID,
          type: CORE.AllEntityIDS.ApplyCustomerWriteOff.Name
        }).$promise.then((response) => {
          vm.documentCountOfAppliedWriteOff = response && response.data ? response.data : 0;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCountOfAppliedWriteOff = 0;
      }
    };
    getCustomerPaymentDocumentCount();

    // display write off detail history
    vm.viewWriteOffHistory = (row, ev) => {
      const data = {
        id: vm.custPaymentMstID,
        mfgcodeID: vm.custPaymentMstDetParent.mfgcodeID,
        customerCodeName: vm.custPaymentMstDetParent.mfgFullName,
        bankAccountNo: vm.custPaymentMstDetParent.bankAccountNo,
        paymentDate: vm.custPaymentMstDetParent.paymentDate,
        paymentNumber: vm.custPaymentMstDetParent.paymentNumber,
        refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code
      };
      DialogFactory.dialogService(
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
        CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
        ev,
        data).then(() => {
          // response block
        }, () => {
          // cancel block
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

    /* to get/apply class for customer write off payment status */
    vm.getCustPaymentStatusClassName = (paymentStatus) => BaseService.getCustPaymentStatusClassName(paymentStatus);

    /* to go at customer payment list page */
    vm.goToCustomerPaymentList = () => {
      BaseService.goToCustomerPaymentList();
    };

    /* to go at customer payment detail page */
    vm.goToCustomerPaymentDetail = () => {
      BaseService.goToCustomerPaymentDetail(vm.custPaymentMstDetParent.refPaymentID);
    };

    /* to move at customer applied write off list page */
    vm.goToAppliedCustWriteOffToInvList = () => {
      BaseService.goToAppliedCustWriteOffToInvList();
    };

    $scope.$on('$destroy', () => {
      bindDocuments();
    });

    /* to go at invoice list page */
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };
  }
})();
