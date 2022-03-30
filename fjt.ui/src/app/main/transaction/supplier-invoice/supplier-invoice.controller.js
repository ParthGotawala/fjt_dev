(function () {
  'use strict';

  angular
    .module('app.transaction.supplierInvoice')
    .controller('SupplierInvoiceController', SupplierInvoiceController);

  /** @ngInject */
  function SupplierInvoiceController($scope, $state, $stateParams, $timeout, BaseService, DialogFactory, ReportMasterFactory, PackingSlipFactory, TRANSACTION, CORE, USER, socketConnectionService, SupplierInvoiceFactory) {
    const vm = this;
    vm.core = CORE;
    vm.TRANSACTION = TRANSACTION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.currentState = $state.current.name;
    vm.showTab = false;
    vm.receiptID = $stateParams.id;
    vm.showInvoiceStatusText = null;
    vm.showInvoiceStatus = null;
    vm.showInvoiceApprovalStatusText = null;
    vm.showInvoiceApprovalStatus = null;
    vm.PackingSlipStatus = CORE.PackingSlipStatus;
    //vm.supplierInvoiceApprovalStatus = CORE.SupplierInvoiceApprovalStatus;
    vm.invoiceApprovalStatusOptionsGridHeaderDropdown = CORE.InvoiceApprovalStatusOptionsGridHeaderDropdown;
    vm.HaltResumePopUp = CORE.HaltResumePopUp;
    vm.slipType = $stateParams.slipType;
    vm.ReceiprType = $stateParams.type;
    //vm.PackingSlipTabType = TRANSACTION.PackingSlipTabType;
    vm.showSaveBtn = false;
    vm.supplierInvoiceForm = null;
    vm.saveBtnDisableFlag = false;
    vm.invoiceDebitCreditNo = null;
    vm.supplierInvoiceEditObj = null;
    vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    vm.miscForm = null;
    vm.loginUser = BaseService.loginUser;
    vm.tabList = [
      { src: TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_STATE, title: TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_LABEL },
      { src: TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE, title: TRANSACTION.TRANSACTION_INVOICE_TARIFF_LABEL },
      { src: TRANSACTION.TRANSACTION_INVOICE_RMA_STATE, title: TRANSACTION.TRANSACTION_INVOICE_RMA_LABEL },
      { src: TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE, title: TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_LABEL },
      { src: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE, title: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_LABEL },
      { src: TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE, title: TRANSACTION.TRANSACTION_INVOICE_PAYMENT_LABEL },
      { src: TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE, title: TRANSACTION.TRANSACTION_INVOICE_REFUND_LABEL }
    ];

    switch (vm.currentState) {
      case TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_LABEL;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_TARIFF_LABEL;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_INVOICE_RMA_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_RMA_LABEL;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_LABEL;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_LABEL;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_PAYMENT_LABEL;
        vm.showTab = true;
        break;
      case TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE:
        vm.selectedNavItem = TRANSACTION.TRANSACTION_INVOICE_REFUND_LABEL;
        vm.showTab = true;
        break;
    }

    vm.addPackingSlip = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, { type: TRANSACTION.MaterialReceiveTabType.PackingSlip, id: null, slipType: CORE.PackingSlipTabName });
    };

    vm.addInvoice = (isOpenInNew) => {
      if (isOpenInNew) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: null, slipType: CORE.PackingSlipInvoiceTabName });
      } else {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: null, slipType: CORE.PackingSlipInvoiceTabName });
      }
    };

    vm.addSupplierRMA = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: TRANSACTION.SupplierRMATab.SupplierRMA, id: null });
    };

    vm.addCreditMemo = (isOpenInNew) => {
      if (isOpenInNew) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: null, slipType: CORE.PackingSlipInvoiceTabName });
      } else {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: null, slipType: CORE.PackingSlipInvoiceTabName });
      }
    };

    vm.addDebitMemo = (isOpenInNew) => {
      if (isOpenInNew) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: null, slipType: CORE.PackingSlipInvoiceTabName });
      } else {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: null, slipType: CORE.PackingSlipInvoiceTabName });
      }
    };

    vm.addRefund = (autoSelectData) => {
      if (autoSelectData) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: null, mfgcodeid: vm.supplierInvoiceEditObj.mfgCodeID, memoid: vm.receiptID });
      }
      else {
        BaseService.openInNew(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: null });
      }
    };

    let reTryCount = 0;
    const getAllRights = () => {
      vm.allowSupplierInvoiceApproval = BaseService.checkFeatureRights(CORE.FEATURE_NAME.SupplierInvoiceApproval);
      vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssuePayment);
      if ((vm.allowSupplierInvoiceApproval === null || vm.allowSupplierInvoiceApproval === undefined ||
        vm.allowToVoidAndReIssuePaymentFeature === null || vm.allowToVoidAndReIssuePaymentFeature === undefined)
        && reTryCount < _configGetFeaturesRetryCount) {
        reTryCount++;
        getAllRights(); //put for hard reload option as it will not get data from feature rights
      }
    };

    $timeout(() => {
      getAllRights();
    });

    vm.goBack = () => {
      $scope.$broadcast('goBackToInvoiceList', null);
      //if (vm.slipType == TRANSACTION.PackingSlipTabType.InvoiceVerification) {
      //    $state.go(TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE);
      //} else if (vm.slipType == TRANSACTION.PackingSlipTabType.CreditMemo) {
      //    $state.go(TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE);
      //} else if (vm.slipType == TRANSACTION.PackingSlipTabType.DebitMemo) {
      //    $state.go(TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE);
      //}
    };

    const selectInvoice = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: item.id, slipType: CORE.PackingSlipInvoiceTabName });
      }
      $timeout(() => {
        vm.autoCompleteInvoiceNumber.keyColumnId = null;
      }, true);
    };

    vm.autoCompleteInvoiceNumber = {
      columnName: 'formattedTransNumber',
      keyColumnName: 'id',
      keyColumnId: vm.selectInvoiceNumber ? vm.selectInvoiceNumber : null,
      inputName: 'invoiceNumber',
      placeholderName: 'Invoice#',
      isRequired: false,
      isAddnew: false,
      isUppercaseSearchText: true,
      onSelectCallbackFn: selectInvoice,
      onSearchFn: function (query) {
        const searchobj = {
          receiptType: 'I',
          searchquery: query
        };
        return getInvoiceSearch(searchobj);
      }
    };

    const selectCreditMemo = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: item.id, slipType: CORE.PackingSlipInvoiceTabName });
      }
      $timeout(() => {
        vm.autoCompleteCreditMemoNumber.keyColumnId = null;
      }, true);
    };

    vm.autoCompleteCreditMemoNumber = {
      columnName: 'formattedTransNumber',
      keyColumnName: 'id',
      keyColumnId: vm.selectInvoiceNumber ? vm.selectInvoiceNumber : null,
      inputName: 'creditMemoNumber',
      placeholderName: 'Credit Memo#',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectCreditMemo,
      onSearchFn: function (query) {
        const searchobj = {
          receiptType: 'C',
          searchquery: query
        };
        return getInvoiceSearch(searchobj);
      }
    };

    const selectDebitMemo = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: item.id, slipType: CORE.PackingSlipInvoiceTabName });
      }
      $timeout(() => {
        vm.autoCompleteDebitMemoNumber.keyColumnId = null;
      }, true);
    };

    vm.autoCompleteDebitMemoNumber = {
      columnName: 'formattedTransNumber',
      keyColumnName: 'id',
      keyColumnId: vm.selectInvoiceNumber ? vm.selectInvoiceNumber : null,
      inputName: 'debitMemoNumber',
      placeholderName: 'Debit Memo#',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectDebitMemo,
      onSearchFn: function (query) {
        const searchobj = {
          receiptType: 'D',
          searchquery: query
        };
        return getInvoiceSearch(searchobj);
      }
    };

    const getInvoiceSearch = (searchObj) => PackingSlipFactory.getPackingSlipInvoice().query({ search: searchObj }).$promise.then((invoice) => {
      if (invoice && invoice.data) {
        return invoice.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.printDebitMemoReport = (isDownload) => {
      if (vm.supplierInvoiceForm.$dirty) {
        return;
      }
      if (isDownload) {
        if (vm.isDownloadDisabled) {
          return;
        }
        vm.isDownloadDisabled = true;
      } else {
        if (vm.isPrintDisable) {
          return;
        }
        vm.isPrintDisable = true;
      }
      const debitMemoReportDetails = {
        receiptID: vm.receiptID,
        employeeID: BaseService.loginUser.employee.id,
        reportAPI: 'PackingSlip/debitMemoReport',
        DebitMemoData: {
          debitMemoNumber: vm.supplierInvoiceEditObj.debitMemoNumber,
          mfgCode: vm.supplierInvoiceEditObj.mfgCode
        }
      };
      ReportMasterFactory.generateReport(debitMemoReportDetails).then((response) => {
        const DebitMemoData = response.config.data.DebitMemoData;
        if (isDownload) {
          vm.isDownloadDisabled = false;
        } else {
          vm.isPrintDisable = false;
        }
        BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}', CORE.REPORT_SUFFIX.SUPPLIER_DEBIT_MEMO, DebitMemoData.debitMemoNumber, DebitMemoData.mfgCode), isDownload, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.approveInvoice = (event) => {
      var invoiceIds = [];
      if ((!vm.supplierInvoiceEditObj || !vm.supplierInvoiceEditObj.isShowRMADetail) && vm.supplierInvoiceEditObj && vm.supplierInvoiceEditObj.isInvoiceState) {
        if (!vm.allowSupplierInvoiceApproval || !vm.receiptID) {
          return;
        }

        invoiceIds.push(vm.receiptID);
        const invoiceApprovalData = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Approve Supplier Invoice',
          isOnlyPassword: true,
          createdBy: vm.loginUser.userid,
            updatedBy: vm.loginUser.userid,
            isInvoiceApprovedMsgBtn: true
        };

        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          event,
          invoiceApprovalData).then((pswConfirmation) => {
            if (pswConfirmation) {
              const objData = {
                ids: invoiceIds,
                invoiceApprovalComment: pswConfirmation.approvalReason
              };
              vm.cgBusyLoading = PackingSlipFactory.approveSupplierInvoice().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  $state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: TRANSACTION.PackingSlipTabType.InvoiceVerification, id: vm.receiptID, slipType: CORE.PackingSlipInvoiceTabName });
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
      else {
        $scope.$broadcast(USER.ApproveSupplierInvoiceBroadcast, null);
      }
    };

    vm.showCurrentBalanceAndPastDue = (event) => {
      const popupData = {
      };
      DialogFactory.dialogService(
        TRANSACTION.SUPPLIER_BALANCE_AND_PAST_DUE_POPUP_CONTROLLER,
        TRANSACTION.SUPPLIER_BALANCE_AND_PAST_DUE_POPUP_VIEW,
        event,
        popupData
      ).then(() => {
      }, () => {
        $scope.$broadcast(USER.SupplierInvoicePaymentHistoryRefreshBroadcast, null);
      }, (err) => BaseService.getErrorLog(err));
    };

    vm.voidAndReIssuePayment = (event) => {
      const popupDate = {
        packingSlipData: {
          isVoidAndReIssuePayment: true,
          isHidePaymentPopupDetails: true
        }
      };
      DialogFactory.dialogService(
        TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
        TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
        event,
        popupDate
      ).then(() => {
      }, () => {
          $scope.$broadcast(USER.SupplierInvoicePaymentHistoryRefreshBroadcast, null);
      }, (err) => BaseService.getErrorLog(err));
    };

    vm.haltResumeSalesOrder = (rowData, ev) => {
      if (rowData) {
        if (rowData.lockStatus === vm.TRANSACTION.CustomerPaymentLockStatus.Locked &&
          rowData.haltStatus !== vm.HaltResumePopUp.HaltStatus) {
          let transTypeText = '';
          if (vm.supplierInvoiceEditObj.isInvoiceState) {
            transTypeText = 'Supplier Invoice#';
          } else if (vm.supplierInvoiceEditObj.isCreditMemoState) {
            transTypeText = 'Supplier Credit Memo#';
          } else if (vm.supplierInvoiceEditObj.isDebitMemoState) {
            transTypeText = 'Supplier Debit Memo#';
          }
          const invoiceNumber = rowData.invoiceNumber || rowData.creditMemoNumber || rowData.debitMemoNumber;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.LOCK_AND_HALT_VALIDATION_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, transTypeText, invoiceNumber, 'locked', 'halt');
          DialogFactory.messageAlertDialog({ messageContent: messageContent });
          return;
        }
        let vRefType = vm.HaltResumePopUp.refTypeSINV;
        if (rowData.receiptType === CORE.packingSlipReceiptType.C.Key) {
          vRefType = vm.HaltResumePopUp.refTypeSCM;
        } else if (rowData.receiptType === CORE.packingSlipReceiptType.D.Key) {
          vRefType = vm.HaltResumePopUp.refTypeSDM;
        }
        const haltResumeObj = {
          refTransId: rowData.id,
          isHalt: rowData.haltStatus ? (rowData.haltStatus === vm.HaltResumePopUp.HaltStatus ? false : true) : true,
          module: vRefType,
          refType: vRefType,
          poNumber: rowData.poNumber,
          poId: rowData.poId,
          invoiceNumber: rowData.invoiceNumber,
          invoiceId: rowData.id,
          creditMemoNumber: rowData.creditMemoNumber,
          debitMemoNumber: rowData.debitMemoNumber,
          refInvoiceNumber: rowData.refInvoiceNumber,
          refInvoiceId: rowData.refParentCreditDebitInvoiceno,
          packingSlipNumber: rowData.packingSlipNumber,
          packingSlipId: rowData.packingSlipId
        };
        DialogFactory.dialogService(
          CORE.HALT_RESUME_CONTROLLER,
          CORE.HALT_RESUME_VIEW,
          ev,
          haltResumeObj).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    vm.getSupplierInvoiceHoldStatus = () => {
      if (vm.supplierInvoiceEditObj && vm.supplierInvoiceEditObj.id) {
        socketListenerHaltResume({ refTransId: vm.supplierInvoiceEditObj.id });
      }
    };

    vm.showPaymentTransactions = (row, event) => {
      const rowData = angular.copy(row);
      if (rowData) {
        rowData.refPaymentMode = CORE.RefPaymentModeForInvoicePayment.Payable;
        rowData.supplierCode = rowData.mfgFullName;
      }
      DialogFactory.dialogService(
        TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER,
        TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW,
        event,
        rowData
      ).then(() => {
      }, () => {
      }, (err) => BaseService.getErrorLog(err));
    };

    vm.opencustomerpackingSlipChangesHistoryAuditLog = (ev) => {
      const data = angular.copy(vm.supplierInvoiceEditObj);
      data.supplierCode = data.mfgFullName;
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW,
        ev,
        data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
    };

    function socketListenerHaltResume(responseData) {
      if (responseData && vm.supplierInvoiceEditObj && responseData.refTransId && responseData.refTransId === vm.supplierInvoiceEditObj.id) {
        const criteria = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[7].PageName,
          invoiceIds: responseData.refTransId
        };

        vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoiceList().query(criteria).$promise.then((response) => {
          if (response && response.data && response.data.supplierInvoice) {
            if (response.data.supplierInvoice && response.data.supplierInvoice.length > 0) {
              const row = response.data.supplierInvoice[0];
              vm.supplierInvoiceEditObj.haltRefType = row.haltRefType;
              vm.supplierInvoiceEditObj.haltStatus = row.haltStatus;
              vm.supplierInvoiceEditObj.haltReason = row.haltReason;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_START, socketListenerHaltResume);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_STOP, socketListenerHaltResume);
    }
    if (!vm.showTab) {
      connectSocket();
    }

    socketConnectionService.on('reconnect', () => {
      if (!vm.showTab) {
        connectSocket();
      }
    });

    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_STOP);
    }
    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    vm.payNowForInvoice = () => {
      $scope.$broadcast(USER.SupplierInvoicePayNowBroadcast, null);
    };

    vm.goToInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
    };
    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };
    vm.saveInvoice = () => {
      $scope.$broadcast('CallSaveInvoice', null);
    };
    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };
    vm.goToPackingSlipDetail = () => {
      if (vm.supplierInvoiceEditObj) {
        BaseService.goToManagePackingSlipDetail(vm.supplierInvoiceEditObj.refPackingSlipId);
      }
    };
    vm.goToSupplierRMAList = () => {
      BaseService.goToSupplierRMAList();
    };
    vm.goToSupplierRMADetail = () => {
      BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, vm.supplierInvoiceEditObj.refPackingSlipId);
    };
    vm.goToSupplierInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
    };
    vm.goToSupplierInvoiceDetail = (id) => {
      BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, id);
    };
    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };
    vm.goToCreditMemoDetail = () => {
      BaseService.goToCreditMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.supplierInvoiceEditObj.id);
    };
    vm.goToDebitMemoList = () => {
      BaseService.goToDebitMemoList();
    };
    vm.goToDebitMemoDetail = () => {
      BaseService.goToDebitMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.supplierInvoiceEditObj.id);
    };
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.supplierInvoiceEditObj.mfgCodeID);
    };

    vm.goToPurchaseOrderList = () => {
      BaseService.goToPurchaseOrderList();
    };

    vm.goToPurchaseOrderDetail = () => {
      BaseService.goToPurchaseOrderDetail(vm.supplierInvoiceEditObj.refPurchaseOrderID);
    };

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    $scope.$on('$destroy', () => {
      removeSocketListener();
    });
  }
})();
