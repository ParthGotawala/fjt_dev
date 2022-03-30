(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('ManageCustomerRefundMainController', ManageCustomerRefundMainController);

  /** @ngInject */
  function ManageCustomerRefundMainController($filter, $state, TRANSACTION, BaseService, CORE, DialogFactory, CustomerRefundFactory,
    PackingSlipFactory, CustomerPaymentFactory, $scope, ReportMasterFactory, $timeout) {
    const vm = this;
    vm.custRefundMstID = parseInt($state.params.id);
    vm.customerRefundTabIDs = angular.copy(TRANSACTION.CustomerRefundTabIDs);
    let checkCustPaymentCheckNumberList = [];
    vm.saveBtnDisableFlag = false;
    vm.custRefundMstDetParent = {};
    vm.loginUser = BaseService.loginUser;
    vm.documentCountOfCustRefund = 0;
    vm.isPrintRemittDisabled = false;
    vm.isPrintLoader = false;
    vm.custRefundSubStatusListOrg = _.values(TRANSACTION.CustomerRefundSubStatusIDDet);
    vm.custRefundSubStatusList = angular.copy(vm.custRefundSubStatusListOrg);
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;

    vm.tabList = [
      {
        id: vm.customerRefundTabIDs.CustomerRefund,
        title: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE,
        viewsrc: 'details', isDisabled: false
      },
      {
        id: vm.customerRefundTabIDs.Document,
        title: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DOCUMENT_LABEL,
        state: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DOCUMENT_STATE,
        src: TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DOCUMENT_STATE,
        viewsrc: 'documents', isDisabled: vm.custRefundMstID ? false : true
      }
    ];

    const setActiveTab = () => {
      const item = $filter('filter')(vm.tabList, { state: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
      }
      else {
        vm.activeTab = 0;
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, { id: vm.custRefundMstID || 0});
      }
    };
    setActiveTab();

    vm.onTabChanges = (item) => {
      const Params = { id: vm.custRefundMstID };
      $state.go(item.src, Params);
    };

    //get customer Payment/Check Number list
    const getCustRefundCheckNumberDetails = (searchObj) => CustomerPaymentFactory.getAllCustPaymentCheckNumberList().query({
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Refund.code,
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

    const retrieveCustRefundMstData = () => CustomerRefundFactory.getCustRefundMstData().query({
      custRefundMstID: vm.custRefundMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Refund.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.custRefundMstDetParent = resp.data.custRefundMstData;
        vm.selectedCustomerDet = {
          id: vm.custRefundMstDetParent.mfgcodeID,
          mfgFullName: vm.custRefundMstDetParent.mfgFullName
        };
        if (vm.custRefundMstDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked && vm.custRefundMstDetParent.lockedByUserName) {
          const userNameWithSplit = vm.custRefundMstDetParent.lockedByUserName.split(' ');
          vm.custRefundMstDetParent.lockedByUserFullName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, vm.custRefundMstDetParent.lockedByUserInitialName, userNameWithSplit[0], userNameWithSplit[1]);
        }
        vm.custRefundMstDetParent.isCustRefundLocked = vm.custRefundMstDetParent.lockStatus === vm.CustPaymentLockStatusConst.Locked ? true : false;
        vm.custRefundMstDetParent.isDisablePrintCheck = ((vm.custRefundMstDetParent.paymentMethodName !== TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryName) || (vm.custRefundMstDetParent.isPaymentVoided)) ? true : false;
      }
      //return $q.resolve(resp);
    }).catch((error) => BaseService.getErrorLog(error));


    if (vm.custRefundMstID) {
      retrieveCustRefundMstData();
    } else {
      vm.custRefundMstDetParent.subStatus = TRANSACTION.CustomerRefundSubStatusIDDet.Draft.code;
    }

    // when user select customer | payment/check number | amount from auto complete then move to that record
    const onSelectCustPaymentCheckNumber = (selectedRefundItem) => {
      if (selectedRefundItem) {
        if (selectedRefundItem.id !== vm.custRefundMstID) {
          if (BaseService.checkFormDirty(vm.customerRefundForm)) {
            const requiredDet = {
              actionType: 'move_on_detail',
              custPayMstIDToMove: selectedRefundItem.id
            };
            showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, { id: selectedRefundItem.id }, { reload: true });
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
        return getCustRefundCheckNumberDetails(searchObj);
      },
      onSearchFn: function (query) {
        const searchObj = {
          searchQuery: query
        };
        return getCustRefundCheckNumberDetails(searchObj);
      },
      onSelectCallbackFn: onSelectCustPaymentCheckNumber
    };

    //go back to list page
    vm.goBack = () => {
      BaseService.setLatestLoginUserLocalStorageDet();

      switch (vm.activeTab) {
        case vm.customerRefundTabIDs.CustomerRefund:
          if (BaseService.checkFormDirty(vm.customerRefundForm)) {
            showWithoutSavingAlertforGobackOrPayDetPage(null);
          } else {
            BaseService.currentPageForms = [];
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LIST_STATE);
          }
          break;
        default:
          BaseService.currentPageForms = [];
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LIST_STATE);
          break;
      }
    };

    //add new customer Refund
    vm.addCustomerRefund = (openInNewTab) => {
      if (openInNewTab) {
        BaseService.goToCustomerRefundDetail(0);
      }
      else {
        const isFormDirty = vm.customerRefundForm ? vm.customerRefundForm.$dirty : false;
        if (isFormDirty) {
          const requiredDet = {
            actionType: 'move_on_detail',
            custPayMstIDToMove: 0
          };
          showWithoutSavingAlertforGobackOrPayDetPage(requiredDet);
        } else {
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, { id: 0 }, { reload: true });
        }
      }
    };

    // to Show save alert pop-up on go back or go at refund details page
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
            case vm.customerRefundTabIDs.CustomerRefund:
              vm.customerRefundForm.$setPristine();
              break;
            default:
              break;
          }
          if (requiredDet && requiredDet.actionType === 'move_on_detail') {
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, { id: requiredDet.custPayMstIDToMove }, { reload: true });
          } else {
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LIST_STATE);
          }
        }
      }, () => {
        // cancel block
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* function to check form dirty on tab change */
    vm.isStepValid = () => {
      let isDirty = false;

      switch (vm.activeTab) {
        case vm.customerRefundTabIDs.CustomerRefund: {
          isDirty = BaseService.checkFormDirty(vm.customerRefundForm);
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
            case vm.customerRefundTabIDs.CustomerRefund: {
              vm.customerRefundForm.$setPristine();
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
      getCustomerRefundDocumentCount();
    });

    const getCustomerRefundDocumentCount = () => {
      if (vm.custRefundMstID) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.custRefundMstID,
          type: CORE.AllEntityIDS.CustomerRefund.Name
        }).$promise.then((response) => {
          if(response && response.data){
            vm.documentCountOfCustRefund = response.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCountOfCustRefund = 0;
      }
    };
    getCustomerRefundDocumentCount();

    // display refund payment history
    vm.viewRefundHistory = (row, ev) => {
      const data = {
        id: vm.custRefundMstID,
        mfgcodeID: vm.custRefundMstDetParent.mfgcodeID,
        customerCodeName: vm.custRefundMstDetParent.mfgFullName,
        bankAccountNo: vm.custRefundMstDetParent.bankAccountNo,
        paymentDate: vm.custRefundMstDetParent.paymentDate,
        paymentNumber: vm.custRefundMstDetParent.paymentNumber,
        refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Refund.code
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

    /* print Check Report */
    vm.printRemittance = (ev) => {
      vm.printCheck(ev, true);
    };

    /* common function to print refund Remittance/Check Report */
    vm.printCheck = (ev, isRemittanceReport) => {
      if (!vm.custRefundMstID) {
        return;
      }

      if (!vm.custRefundMstDetParent.paymentNumber) {
        const msgContentForRqrPaymentNum = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PAYMENT_NUM_REQUIRED_TO_PRINT_REFUND_REPORT);
        const model = {
          messageContent: msgContentForRqrPaymentNum
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('paymentNumber');
        }).catch((error) => BaseService.getErrorLog(error));
        return;
      }

      const isDownload = false;
      if (isRemittanceReport) {
        vm.isPrintRemittDisabled = true;
      } else {
        vm.isPrintLoader = true;
      }
      const paramObj = {
        paymentId: vm.custRefundMstID,
        isRemittanceReport: isRemittanceReport ? isRemittanceReport : false,
        reportAPI: 'InvoicePayment/checkPrintAndRemittanceReport'
      };
      ReportMasterFactory.generateReport(paramObj).then((response) => {
        const model = {
          multiple: true
        };
        if (isRemittanceReport) {
          vm.isPrintRemittDisabled = false;
        } else {
          vm.isPrintLoader = false;
        }
        if (response.status === 404) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 204) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NOCONTENT);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 403) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === 401) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          DialogFactory.messageAlertDialog(model);
        } else if (response.status === -1) {
          model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
          DialogFactory.messageAlertDialog(model);
        } else {
          const blob = new Blob([response.data], {
            type: 'application/pdf'
          });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, 'CheckPrintReport.pdf');
          } else {
            const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
            const link = document.createElement('a');
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              if (isDownload) {
                link.setAttribute('download', 'CheckPrintReport' + TimeStamp + '.pdf');
              } else {
                link.setAttribute('target', '_blank');
              }
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //redirect to customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    //go to customer detail page
    vm.goToCustomerDetail = () => {
      BaseService.goToCustomer(vm.selectedCustomerDet.id);
    };

    /* to go at invoice list page */
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerCreditMemoList();
    };

    /* to go at customer payment list page */
    vm.goToCustomerPaymentList = () => {
      BaseService.goToCustomerPaymentList();
    };

    /* to go at customer refund list page */
    vm.goToCustomerRefundList = () => {
      BaseService.goToCustomerRefundList();
    };

    /* to get/apply class for customer status status */
    vm.getCustRefundStatusClassName = (refundStatus) => BaseService.getCustRefundStatusClassName(refundStatus);

    /* get customer refund sub status */
    vm.getCustomerRefundSubStatus = (statusID) => BaseService.getCustomerRefundSubStatus(statusID);

    /* to get/apply class for customer status status */
    vm.getCustRefundSubStatusClassName = (statusID) => BaseService.getCustRefundSubStatusClassName(statusID);

    $scope.$on('$destroy', () => {
      bindDocuments();
    });
  }
})();
