(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierInvoicePaymentTransactionListPopupController', SupplierInvoicePaymentTransactionListPopupController);

  /** @ngInject */
  function SupplierInvoicePaymentTransactionListPopupController(TRANSACTION, $mdDialog, DialogFactory, data, BaseService, CORE, USER, $timeout, $filter, SupplierInvoiceFactory, uiGridGroupingConstants) {
    const vm = this;
    vm.isHideDelete = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST;
    vm.refPaymentModeForInvoicePayment = CORE.RefPaymentModeForInvoicePayment;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.id = data ? data.id : null;
    vm.popupParamData = angular.copy(data) || {};
    vm.isSupplier = data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable;
    const isEnablePagination = false; //(vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.recvRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
    let paymentNumCheckNumGHLbl = 'Payment# or Check#';
    let paymentDateGHLbl = 'Payment Date';
    let paymentDateGHWidth = 100;

    if (vm.popupParamData.isCustPaymentEntity) {
      if (vm.popupParamData.refPaymentMode) {
        if (vm.popupParamData.refPaymentMode === vm.recvRefPaymentModeConst.CreditMemoApplied.code) {
          paymentNumCheckNumGHLbl = 'Transaction#';
          paymentDateGHLbl = 'Transaction Date';
          paymentDateGHWidth = 110;
        } else if (vm.popupParamData.refPaymentMode === vm.recvRefPaymentModeConst.Writeoff.code) {
          paymentNumCheckNumGHLbl = 'Write Off#';
          paymentDateGHLbl = 'Write Off Date';
          paymentDateGHWidth = 110;
        }
      } else {
        paymentNumCheckNumGHLbl = 'Payment# or Check# or Transaction#';
        paymentDateGHLbl = 'Payment Date or Transaction Date';
        paymentDateGHWidth = 150;
      }
    }

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(data.mfgCodeID);
    };

    //go to customer list page
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToCustomerDetail = () => {
      BaseService.goToCustomer(data.mfgCodeID);
    };

    vm.goToInvoiceList = () => {
      if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable ||
        data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) {
        BaseService.goToSupplierInvoiceList();
      } else if (vm.popupParamData.isCustPaymentEntity) {
        BaseService.goToCustomerInvoiceList();
      }
    };
    vm.goToInvoiceDetail = () => {
      if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable ||
        data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) {
          BaseService.goToSupplierInvoiceDetail(null, (data.invoiceNumber ? data.id : data.refParentCreditDebitInvoiceno));
      } else if (vm.popupParamData.isCustPaymentEntity) {
        BaseService.goToManageCustomerInvoice(data.id);
      }
    };

    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };
    vm.goToCreditMemoDetail = () => {
      BaseService.goToCreditMemoDetail(null, data.id);
    };

    vm.goToDebitMemoList = () => {
      BaseService.goToDebitMemoList();
    };
    vm.goToDebitMemoDetail = () => {
      BaseService.goToDebitMemoDetail(null, data.id);
    };

    if (data.openFrom === 'RMA') {
      vm.headerData = [];
    } else {
      vm.headerData = [
        {
          label: vm.LabelConstant.SupplierInvoice.InvoiceNumber,
          value: data.invoiceNumber || data.refInvoiceNumber,
          displayOrder: 2,
          labelLinkFn: vm.goToInvoiceList,
          valueLinkFn: vm.goToInvoiceDetail
        },
        {
          label: vm.LabelConstant.SupplierInvoice.CreditMemoNumber,
          value: data.creditMemoNumber,
          displayOrder: 3,
          labelLinkFn: vm.goToCreditMemoList,
          valueLinkFn: vm.goToCreditMemoDetail
        },
        {
          label: vm.LabelConstant.SupplierInvoice.DebitMemoNumber,
          value: data.debitMemoNumber,
          displayOrder: 4,
          labelLinkFn: vm.goToDebitMemoList,
          valueLinkFn: vm.goToDebitMemoDetail
        },
        {
          label: (data.debitMemoNumber ? 'Debit Memo ' : (data.creditMemoNumber ? 'Credit Memo ' : 'Invoice ')) + 'Amount',
          value: data.totalExtendedAmount ? $filter('amount')(data.totalExtendedAmount) : 0,
          displayOrder: 5
        }
      ];
    }

    if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable) {
      vm.headerData.push(
        {
          label: vm.LabelConstant.MFG.Supplier,
          value: data.supplierCode,
          displayOrder: 1,
          labelLinkFn: vm.goToSupplierList,
          valueLinkFn: vm.goToSupplierDetail
        },
        {
          label: vm.LabelConstant.SupplierInvoice.PaidAmount,
          value: data.paidAmount ? $filter('amount')(data.paidAmount) : 0,
          displayOrder: 6
        },
        {
          label: 'Balance To Pay',
          value: data.balanceToPayAmount ? $filter('amount')(data.balanceToPayAmount) : 0,
          displayOrder: 7
        });
    } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) {
      vm.headerData.push(
        {
          label: vm.LabelConstant.MFG.Supplier,
          value: data.supplierCode,
          displayOrder: 1,
          labelLinkFn: vm.goToSupplierList,
          valueLinkFn: vm.goToSupplierDetail
        },
        {
          label: 'Agreed Refund Amount',
          value: data.markedForRefundAmt ? $filter('amount')(data.markedForRefundAmt) : 0,
          displayOrder: 2
        },
        {
          label: 'Refunded AMT',
          value: data.refundAmount ? $filter('amount')(data.refundAmount) : 0,
          displayOrder: 3
        });
      if (data.waitingForRefundAmount) {
        vm.headerData.push({
          label: 'Waiting for Refund AMT',
          value: data.waitingForRefundAmount ? $filter('amount')(data.waitingForRefundAmount) : 0,
          displayOrder: 4
        });
      }
    } else if (vm.popupParamData.isCustPaymentEntity) {
      vm.headerData.push(
        {
          label: vm.LabelConstant.MFG.Customer,
          value: data.customerName,
          displayOrder: 1,
          labelLinkFn: vm.goToCustomerList,
          valueLinkFn: vm.goToCustomerDetail
        },
        {
          label: 'Received Amount',
          value: data.receivedAmount ? $filter('amount')(data.receivedAmount) : 0,
          displayOrder: 6
        },
        {
          label: 'Open Balance',
          value: data.balanceAmount ? $filter('amount')(data.balanceAmount) : 0,
          displayOrder: 7
        });
    }

    vm.updateBank = (row) => {
      const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
      if (!_.find(loginUserAllAccessPageRoute, (item) => item === USER.ADMIN_BANK_STATE)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
        messageContent.message = stringFormat(messageContent.message, USER.ADMIN_BANK_LABEL.toLowerCase());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else {
        const PopupData = {
          id: row.bankAccountMasID
        };
        DialogFactory.dialogService(
          USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
          event,
          PopupData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };
    vm.goToPaymentMethodDetail = (row) => {
      BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: row.paymentType });
    };

    vm.goToPaymentDetails = (row, ev) => {
      if (vm.popupParamData.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable) {
        const PopupData = {
          packingSlipData: {
            paymentId: row.paymentId,
            viewOnly: true
          },
          supplierDet: {
            supplierCode: row.supplierCode,
            mfgCodeID: row.mfgcodeID
          }
        };

        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
          ev,
          PopupData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      } else if (vm.popupParamData.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) {
        BaseService.openInNew(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: row.paymentId });
      }
      else {
        if (row.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(row.paymentId);
        } else if (row.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code) {
          BaseService.goToApplyCustCreditMemoToPayment(row.creditMemoMstID, row.paymentId);
        } else if (row.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(row.paymentId);
        }
      }
    };

    vm.sourceHeader = [
      {
        field: '#',
        width: '50',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: TRANSACTION.PackingSlipColumn.AccountReference,
        width: 200,
        displayName: 'Account Reference',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >Total</div>'
      },
      {
        field: TRANSACTION.PackingSlipColumn.PaymentMethod,
        width: 175,
        displayName: 'Payment Method',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.systemGeneratedPaymentMethod === 0 "\
                                                ng-click="grid.appScope.$parent.vm.goToPaymentMethodDetail(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <span ng-if="row.entity.systemGeneratedPaymentMethod === 1">{{COL_FIELD}}</span>\
                                        </div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: TRANSACTION.PackingSlipColumn.ChequeNumber,
        width: 220,
        displayName: paymentNumCheckNumGHLbl,
        // cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToPaymentDetails(row.entity,$event);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text text="row.entity.chequeNumber"></copy-text>\
                                        </div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: TRANSACTION.PackingSlipColumn.ChequeDate,
        displayName: paymentDateGHLbl,
        width: paymentDateGHWidth,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: TRANSACTION.PackingSlipColumn.ChequeAmount,
        displayName: 'Payment Amount ($)',
        width: 145,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.chequeAmount != null && row.entity.chequeAmount != undefined">{{COL_FIELD | amount}}</div>',
        enableFiltering: true,
        enableSorting: true,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getPaymentAmountSum()}}</div>'
      },
      {
        field: TRANSACTION.PackingSlipColumn.BankAccountNo,
        width: 250,
        displayName: vm.LabelConstant.Bank.BankAccountCode,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.updateBank(row.entity);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
              </div>',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: TRANSACTION.PackingSlipColumn.BankName,
        width: 250,
        displayName: 'Bank Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedAtValue',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'updatedbyValue',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedbyRoleValue',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'createdAtValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'createdbyRoleValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'createdbyValue',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      }
    ];

    if (vm.popupParamData.isCustPaymentEntity) {
      const refPaymentModeTextColSH = {
        field: 'refPaymentModeText',
        displayName: 'Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getReceivableRefPayTypeClassName(row.entity.refPaymentMode)">'
          + '{{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '170'
      };
      vm.sourceHeader.splice(1, 0, refPaymentModeTextColSH);

      // if applied credit memo or all customer payment display then
      if (!vm.popupParamData.refPaymentMode || (vm.popupParamData.refPaymentMode === vm.recvRefPaymentModeConst.CreditMemoApplied.code)) {
        const creditMemoNumberColSH = {
          field: 'creditMemoNumber',
          displayName: 'Credit Memo#',
          cellTemplate: '<span>'
            + '<a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerCreditMemoDetail(row.entity.creditMemoMstID);$event.preventDefault();">{{row.entity.creditMemoNumber}}</a>'
            + '<copy-text ng-if="row.entity.creditMemoNumber" label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerCreditMemo.CustomerCreditMemoNumer" text="row.entity.creditMemoNumber"> </copy-text></span>',
          width: '170'
        };
        const creditMemoDateColSH = {
          field: 'creditMemoDate',
          displayName: 'Credit Memo Date',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '120',
          type: 'date',
          enableFiltering: false
        };
        vm.sourceHeader.splice(9, 0, creditMemoNumberColSH);
        vm.sourceHeader.splice(10, 0, creditMemoDateColSH);
      }
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: 0, //CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        paymentID: data.id || null,
        refPaymentMode: data.refPaymentMode || null
      };
      /* when customer payment related any entity and refPaymentMode not passed or null passed then display
        all type of received payment details */
      if (vm.popupParamData.isCustPaymentEntity && !vm.popupParamData.refPaymentMode) {
        vm.pagingInfo.refPaymentMode = [vm.recvRefPaymentModeConst.ReceivablePayment.code, vm.recvRefPaymentModeConst.CreditMemoApplied.code, vm.recvRefPaymentModeConst.Writeoff.code];
      }
    };

    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: vm.popupParamData.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund ? 'Refund Details.csv' : 'Payment Details.csv',
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return SupplierInvoiceFactory.getSupplierInvoicePaymentDetailsList().query(pagingInfoOld).$promise.then((respOfPMTData) => {
          if (respOfPMTData && respOfPMTData.data && respOfPMTData.data.supplierPaymentDetailsList) {
            return respOfPMTData.data.supplierPaymentDetailsList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getPaymentAmountSum = () => {
      const sum = CalcSumofArrayElement(_.map(vm.sourceData, 'chequeAmount'), _amountFilterDecimal);
      return $filter('amount')(sum);
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (paymentDetails, isGetDataDown) => {
      if (paymentDetails && paymentDetails.data && paymentDetails.data.supplierPaymentDetailsList) {
        _.map(paymentDetails.data.supplierPaymentDetailsList, (data) => {
          data.chequeDate = BaseService.getUIFormatedDate(data.chequeDate, vm.DefaultDateFormat);
          data.creditMemoDate = data.creditMemoDate ? BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat) : null;
        });

        if (!isGetDataDown) {
          vm.sourceData = paymentDetails.data.supplierPaymentDetailsList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (paymentDetails.data.supplierPaymentDetailsList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(paymentDetails.data.supplierPaymentDetailsList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = paymentDetails.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    };

    vm.loadData = () => {
      //BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.id = vm.id;
      vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoicePaymentDetailsList().query(vm.pagingInfo).$promise.then((paymentDetails) => {
        if (paymentDetails && paymentDetails.data) {
          setDataAfterGetAPICall(paymentDetails, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoicePaymentDetailsList().query(vm.pagingInfo).$promise.then((paymentDetails) => {
        if (paymentDetails && paymentDetails.data) {
          setDataAfterGetAPICall(paymentDetails, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get/apply class for customer payment status of applied credit memo */
    vm.getReceivableRefPayTypeClassName = (refPaymentMode) => BaseService.getReceivableRefPayTypeClassName(refPaymentMode);

    // go to customer credit memo
    vm.goToCustomerCreditMemoDetail = (creditMemoMstID) => {
      BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
