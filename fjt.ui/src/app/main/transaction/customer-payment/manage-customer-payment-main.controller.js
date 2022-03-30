(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('ManageCustomerPaymentMainController', ManageCustomerPaymentMainController);

  /** @ngInject */
  function ManageCustomerPaymentMainController($filter, $state, TRANSACTION, BaseService, CORE, DialogFactory, CustomerPaymentFactory,
    PackingSlipFactory, $scope) {
    const vm = this;
    vm.custPaymentMstID = parseInt($state.params.id);
    vm.CustomerPaymentTabIDs = angular.copy(TRANSACTION.CustomerPaymentTabIDs);
    let checkCustPaymentCheckNumberList = [];
    vm.saveBtnDisableFlag = false;
    vm.custPaymentMstDetParent = {};
    vm.loginUser = BaseService.loginUser;
    vm.documentCountOfCustPayment = 0;
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;

    vm.tabList = [
      {
        id: vm.CustomerPaymentTabIDs.CustomerPayment,
        title: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE,
        viewsrc: 'details', isDisabled: false
      },
      {
        id: vm.CustomerPaymentTabIDs.Document,
        title: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_STATE,
        viewsrc: 'documents', isDisabled: vm.custPaymentMstID ? false : true
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { state: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      }
      else {
        vm.activeTab = 0;
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, { id: vm.custPaymentMstID });
      }
    };
    setActiveTab();

    vm.onTabChanges = (item) => {
      const Params = { id: vm.custPaymentMstID };
      $state.go(item.src, Params);
    };

    //get customer Payment/Check Number list
    const getCustPaymentCheckNumberDetails = (searchObj) => CustomerPaymentFactory.getAllCustPaymentCheckNumberList().query({
      refPaymentMode: CORE.RefPaymentModeForInvoicePayment.Receivable,
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

    // to get customer invoice payment master data
    const retrieveCustInvPaymentMstData = () => CustomerPaymentFactory.getCustInvPaymentMstData().query({
      customerPaymentMstID: vm.custPaymentMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code
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
      //return $q.resolve(vm.custPaymentMstDetParent);
    }).catch((error) => BaseService.getErrorLog(error));
    if (vm.custPaymentMstID) {
      retrieveCustInvPaymentMstData();
    }

    // when user select customer | payment/check number | amount from auto complete then move to that record
    const onSelectCustPaymentCheckNumber = (selectedInvPayItem) => {
      if (selectedInvPayItem) {
        if (selectedInvPayItem.id !== vm.custPaymentMstID) {
          if (BaseService.checkFormDirty(vm.customerPaymentForm)) {
            const requiredDet = {
              actionType: 'move_on_detail',
              custPayMstIDToMove: selectedInvPayItem.id
            };
            showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, { id: selectedInvPayItem.id }, { reload: true });
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
        case vm.CustomerPaymentTabIDs.CustomerPayment:
          if (BaseService.checkFormDirty(vm.customerPaymentForm)) {
            showWithoutSavingAlertforGobackOrPayDetPage(null);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE);
          }
          break;
        default:
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE);
          break;
      }
    };

    //add new customer payment
    vm.addCustomerPayment = (openInNewTab) => {
      if (openInNewTab) {
        BaseService.goToCustomerPaymentDetail(0);
      }
      else {
        const isFormDirty = vm.customerPaymentForm ? vm.customerPaymentForm.$dirty : false;
        if (isFormDirty) {
          const requiredDet = {
            actionType: 'move_on_detail',
            custPayMstIDToMove: 0
          };
          showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
        } else {
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, { id: 0 }, { reload: true });
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
            case vm.CustomerPaymentTabIDs.CustomerPayment:
              vm.customerPaymentForm.$setPristine();
              break;
            default:
              break;
          }
          if (requiredDet && requiredDet.actionType === 'move_on_detail') {
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, { id: requiredDet.custPayMstIDToMove }, { reload: true });
          } else {
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE);
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
        case vm.CustomerPaymentTabIDs.CustomerPayment: {
          isDirty = BaseService.checkFormDirty(vm.customerPaymentForm);
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
            case vm.CustomerPaymentTabIDs.CustomerPayment: {
              vm.customerPaymentForm.$setPristine();
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
          type: CORE.AllEntityIDS.CustomerPayment.Name
        }).$promise.then((response) => {
          vm.documentCountOfCustPayment = response && response.data ? response.data : 0;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCountOfCustPayment = 0;
      }
    };
    getCustomerPaymentDocumentCount();

    // display payment detail history
    vm.viewPaymentHistory = (ev) => {
      const data = {
        id: vm.custPaymentMstID,
        mfgcodeID: vm.custPaymentMstDetParent.mfgcodeID,
        customerCodeName: vm.custPaymentMstDetParent.mfgFullName,
        bankAccountNo: vm.custPaymentMstDetParent.bankAccountNo,
        paymentDate: vm.custPaymentMstDetParent.paymentDate,
        paymentNumber: vm.custPaymentMstDetParent.paymentNumber,
        refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code
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

    /* to get/apply class for customer payment status */
    vm.getCustPaymentStatusClassName = (paymentStatus) => BaseService.getCustPaymentStatusClassName(paymentStatus);

    /* to get/apply class for customer refund payment status */
    vm.getCustRefundPaymentStatusClassName = (refundStatus) => BaseService.getCustRefundPaymentStatusClassName(refundStatus);

    $scope.$on('$destroy', () => {
      bindDocuments();
    });

    /* to go at invoice list page */
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };

    /* to go at customer payment list page */
    vm.goToCustomerPaymentList = () => {
      BaseService.goToCustomerPaymentList();
    };
  }
})();
