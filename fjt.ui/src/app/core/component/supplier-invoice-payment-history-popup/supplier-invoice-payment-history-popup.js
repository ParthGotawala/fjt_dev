(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierInvoicePaymentHistoryPopupController', SupplierInvoicePaymentHistoryPopupController);

  /** @ngInject */
  function SupplierInvoicePaymentHistoryPopupController(TRANSACTION, $mdDialog, DialogFactory, data, BaseService, CORE, USER, $timeout, $filter, SupplierInvoiceFactory, WORKORDER) {
    const vm = this;
    vm.popParamData = angular.copy(data);
    vm.RefPaymentModeForInvoicePayment = CORE.RefPaymentModeForInvoicePayment;
    vm.isHideDelete = true;
    vm.ViewDiffOfChange = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_INVOICE_PAYMENT_HISTORY;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };

    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(data.mfgcodeID);
    };

    vm.goToBankList = () => {
      BaseService.goToBankList();
    };

    vm.goToCustomerDetail = (mfgcodeID) => {
      BaseService.goToCustomer(mfgcodeID);
    };

    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToSupplierRefundList = () => {
      if (data.refPaymentMode === 'P') {
        BaseService.goToSupplierPaymentList();
      } else if (data.refPaymentMode === 'RR') {
        BaseService.goToSupplierRefundList();
      }
    };
    vm.goToSupplierRefundDetail = () => {
      if (data.refPaymentMode === 'P') {
        const PopupData = {
          packingSlipData: {
            paymentId: data.id,
            fromPaymentHistory: true
          },
          supplierDet: {
            supplierCode: data.supplierCodeName,
            mfgCodeID: data.mfgcodeID
          }
        };
        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
          null,
          PopupData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      } else if (data.refPaymentMode === 'RR') {
        BaseService.goToSupplierRefundDetail(data.id);
      }
    };

    vm.updateBank = () => {
      const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
      if (!_.find(loginUserAllAccessPageRoute, (item) => item === USER.ADMIN_BANK_STATE)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
        messageContent.message = stringFormat(messageContent.message, USER.ADMIN_BANK_LABEL.toLowerCase());
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then(() => {

        });
      } else {
        const PopupData = {
          id: data.bankAccountMasID
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

    vm.headerData = [];
    if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable ||
      data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) {
      vm.headerData.push(
        {
          label: vm.LabelConstant.MFG.Supplier,
          value: data.supplier || data.fullMfgName,
          displayOrder: 1,
          labelLinkFn: vm.goToSupplierList,
          valueLinkFn: vm.goToSupplierDetail
        },
        {
          label: vm.LabelConstant.Bank.BankAccountCode,
          value: data.bankAccountNo,
          displayOrder: 2,
          labelLinkFn: vm.goToBankList,
          valueLinkFn: vm.updateBank
        },
        {
          label: 'Payment# or Check#',
          value: data.paymentNumber,
          displayOrder: 3,
          labelLinkFn: () => {
            vm.goToSupplierRefundList();
          },
          valueLinkFn: () => {
            vm.goToSupplierRefundDetail();
          }
        },
        {
          label: data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund ? 'Refund Date' : vm.LabelConstant.Bank.PaymentDate,
          value: $filter('date')(data.paymentDate, vm.DefaultDateFormat),
          displayOrder: 4
        });
    } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Receivable || data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied || data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerWriteOff || data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
      let paymentNumberHLbl = null;
      if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Receivable) {
        paymentNumberHLbl = 'Payment# or Check#';
      } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied) {
        paymentNumberHLbl = 'Transaction#';
      } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerWriteOff) {
        paymentNumberHLbl = 'Write Off#';
      } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
        paymentNumberHLbl = 'Payment# or Check#';
      }

      vm.headerData.push({
        label: vm.LabelConstant.MFG.Customer,
        value: data.customerCodeName,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToCustomerList();
        },
        valueLinkFn: () => {
          BaseService.goToCustomer(data.mfgcodeID);
        }
      },
        {
          label: paymentNumberHLbl,
          value: data.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Receivable) {
              BaseService.goToCustomerPaymentList();
            } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied) {
              BaseService.goToAppliedCustCreditMemoToInvList();
            } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerWriteOff) {
              BaseService.goToAppliedCustWriteOffToInvList();
            } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
              BaseService.goToCustomerRefundList();
            }
          },
          valueLinkFn: () => {
            if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Receivable) {
              BaseService.goToCustomerPaymentDetail(data.id);
            } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied) {
              BaseService.goToApplyCustCreditMemoToPayment(data.refCustCreditMemoID, data.id);
            } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerWriteOff) {
              BaseService.goToApplyCustWriteOffToPayment(data.id);
            } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
              BaseService.goToCustomerRefundDetail(data.id);
            }
          }
        }
      );
    }

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '75',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: '50',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'colName',
        displayName: 'Field',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200'
      },
      {
        field: 'Oldval',
        displayName: 'Old Value',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'Newval',
        displayName: 'New Value',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime'
      },
      {
        field: 'updatedBy',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedbyRole',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Receivable || data.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code || data.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.Writeoff.code || data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) {
      const objInvNo = {
        field: 'invoiceNumber',
        displayName: (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.SupplierRefund) ? 'SCM# / SDM#' : 'Invoice#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150'
      };
      vm.sourceHeader.splice(2, 0, objInvNo);
    } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
      const objPaymentNo = {
        field: 'custPaymentNumber',
        displayName: 'Payment# or check#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140'
      };
      vm.sourceHeader.splice(2, 0, objPaymentNo);

      const objCreditMemoNo = {
        field: 'custCreditMemoNumber',
        displayName: 'Credit Memo#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140'
      };
      vm.sourceHeader.splice(3, 0, objCreditMemoNo);
    }


    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        paymentID: data.id,
        refPaymentMode: data.refPaymentMode
      };
    };

    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Payment History.csv',
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return SupplierInvoiceFactory.retrieveSupplierInvoicePaymentHistory().query(pagingInfoOld).$promise.then((respOfPMTHist) => {
          if (respOfPMTHist && respOfPMTHist.data && respOfPMTHist.data.paymentHistory) {
            return respOfPMTHist.data.paymentHistory;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // set export file name based on reference payment type
    if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Receivable) {
      vm.gridOptions.exporterCsvFilename = 'Customer Payment History.csv';
    } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied) {
      vm.gridOptions.exporterCsvFilename = 'Applied Customer Credit Memo History.csv';
    } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerWriteOff) {
      vm.gridOptions.exporterCsvFilename = 'Customer Write Off History.csv';
    } else if (data.refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
      vm.gridOptions.exporterCsvFilename = 'Customer Refund History.csv';
    }

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (paymentHistory, isGetDataDown) => {
      if (paymentHistory && paymentHistory.data && paymentHistory.data.paymentHistory) {
        if (!isGetDataDown) {
          vm.sourceData = BaseService.getFormatedHistoryDataList(paymentHistory.data.paymentHistory);
          vm.currentdata = vm.sourceData.length;
        }
        else if (paymentHistory.data.paymentHistory.length > 0) {
          paymentHistory.data.paymentHistory = BaseService.getFormatedHistoryDataList(paymentHistory.data.paymentHistory);
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(paymentHistory.data.paymentHistory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = paymentHistory.data.Count;
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
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = SupplierInvoiceFactory.retrieveSupplierInvoicePaymentHistory().query(vm.pagingInfo).$promise.then((paymentHistory) => {
        if (paymentHistory && paymentHistory.data) {
          setDataAfterGetAPICall(paymentHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SupplierInvoiceFactory.retrieveSupplierInvoicePaymentHistory().query(vm.pagingInfo).$promise.then((paymentHistory) => {
        if (paymentHistory && paymentHistory.data) {
          setDataAfterGetAPICall(paymentHistory, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Open pop-up for display difference of entry change */
    vm.openDifferenceOfChange = (row, $event) => {
      var data = {
        Colname: row.entity.colName,
        Oldval: row.entity.oldVal,
        Newval: row.entity.newVal,
        Tablename: row.entity.tableName,
        RefTransID: row.entity.refPaymentID
      };

      DialogFactory.dialogService(
        WORKORDER.DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER,
        WORKORDER.DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
