(function () {
  'use strict';

  angular
    .module('app.transaction.packingSlip')
    .controller('PackingSlipChangeHistoryController', PackingSlipChangeHistoryController);

  /** @ngInject */
  function PackingSlipChangeHistoryController($mdDialog, $timeout, CORE, USER, TRANSACTION, data, PackingSlipFactory, BaseService, DialogFactory, WORKORDER) {
    const vm = this;
    vm.isHideDelete = true;
    vm.refrenceId = data && data.id ? data.id : null;
    vm.receiptType = data && data.receiptType ? data.receiptType : null;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.ViewDiffOfChange = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    vm.headerdata = [];

    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    const goToSupplier = () => BaseService.goToSupplierList();
    const goToSupplierDetail = () => BaseService.goToSupplierDetail(data.mfgCodeID);

    const goToPackingSlipList = () => BaseService.goToPackingSlipList();
    const goToManagePackingSlipDetail = () => BaseService.goToManagePackingSlipDetail(data.id);

    const goToRMAPackingSlipList = () => BaseService.goToSupplierRMAList();
    const goToRMAManagePackingSlipDetail = () => BaseService.goToManageSupplierRMA(TRANSACTION.SupplierRMATab.SupplierRMA, data.id);

    const goToSupplierInvoiceList = () => BaseService.goToSupplierInvoiceList();
    const goToSupplierInvoiceDetail = () => BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.refrenceId);

    const goToCreditMemoList = () => BaseService.goToCreditMemoList();
    const goToCreditMemoDetail = () => BaseService.goToCreditMemoDetail(null, vm.refrenceId);

    const goToDebitMemoList = () => BaseService.goToDebitMemoList();
    const goToDebitMemoDetail = () => BaseService.goToDebitMemoDetail(null, vm.refrenceId);

    if (vm.receiptType === TRANSACTION.PackingSlipReceiptType.PackingSlip) {
      vm.title = 'Packing Slip Change History';
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.MATERIAL_RECEIVE;
      vm.gridName = CORE.gridConfig.gridPackingSlipHistory;
      vm.lineId = 'Packing Slip Line#';
      const bindHeaderData = () => {
        vm.headerdata.push(
          {
            label: vm.LabelConstant.MFG.Supplier,
            value: data.supplierCodeName,
            displayOrder: 1,
            labelLinkFn: goToSupplier,
            valueLinkFn: goToSupplierDetail,
            isCopy: true
          },
          {
            label: vm.LabelConstant.SupplierInvoice.PackingSlipNumber,
            value: data.packingSlipNumber,
            displayOrder: 2,
            labelLinkFn: goToPackingSlipList,
            valueLinkFn: goToManagePackingSlipDetail,
            isCopy: true
          }
        );
      };
      bindHeaderData();
    }
    else if (vm.receiptType === TRANSACTION.PackingSlipReceiptType.SupplierRMA) {
      vm.title = 'Supplier RMA Change History';
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.SUPPLIER_RMA;
      vm.gridName = CORE.gridConfig.gridSupplierRMAHistory;
      vm.lineId = 'RMA Line#';
      const bindHeaderData = () => {
        vm.headerdata.push(
          {
            label: vm.LabelConstant.MFG.Supplier,
            value: data.supplierCodeName,
            displayOrder: 1,
            labelLinkFn: goToSupplier,
            valueLinkFn: goToSupplierDetail
          },
          {
            label: vm.LabelConstant.SupplierRMA.RMANumber,
            value: data.rmaNumber,
            displayOrder: 2,
            labelLinkFn: goToRMAPackingSlipList
          },
          {
            label: vm.LabelConstant.SupplierRMA.PackingSlipNumber,
            value: data.packingSlipNumber,
            displayOrder: 3,
            labelLinkFn: goToRMAPackingSlipList,
            valueLinkFn: goToRMAManagePackingSlipDetail
          }
        );
      };
      bindHeaderData();
    }
    else if (vm.receiptType === TRANSACTION.PackingSlipReceiptType.SupplierInvoice) {
      vm.title = 'Supplier Invoice Change History';
      vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER_INVOICE);
      vm.EmptyMesssage.HISTORYMESSAGE = stringFormat(vm.EmptyMesssage.HISTORYMESSAGE, 'supplier invoice');
      vm.gridName = CORE.gridConfig.gridSupplierInvoiceHistory;
      vm.lineId = 'Invoice Line#';
      const bindHeaderData = () => {
        vm.headerdata.push(
          {
            label: vm.LabelConstant.MFG.Supplier,
            value: data.supplierCode,
            displayOrder: 1,
            labelLinkFn: goToSupplier,
            valueLinkFn: goToSupplierDetail
          },
          {
            label: vm.LabelConstant.SupplierInvoice.InvoiceNumber,
            value: data.invoiceNumber,
            displayOrder: 2,
            labelLinkFn: goToSupplierInvoiceList,
            valueLinkFn: goToSupplierInvoiceDetail
          }
        );
      };
      bindHeaderData();
    }
    else if (vm.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo) {
      vm.title = 'Credit Memo Change History';
      vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER_INVOICE);
      vm.EmptyMesssage.HISTORYMESSAGE = stringFormat(vm.EmptyMesssage.HISTORYMESSAGE, 'credit memo');
      vm.gridName = CORE.gridConfig.gridCreditMemoHistory;
      vm.lineId = 'Credit Memo Line#';
      const bindHeaderData = () => {
        vm.headerdata.push(
          {
            label: vm.LabelConstant.MFG.Supplier,
            value: data.supplierCode,
            displayOrder: 1,
            labelLinkFn: goToSupplier,
            valueLinkFn: goToSupplierDetail
          },
          {
            label: vm.LabelConstant.SupplierInvoice.CreditMemoNumber,
            value: data.creditMemoNumber,
            displayOrder: 2,
            labelLinkFn: goToCreditMemoList,
            valueLinkFn: goToCreditMemoDetail
          }
        );
      };
      bindHeaderData();
    }
    else if (vm.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo) {
      vm.title = 'Debit Memo Change History';
      vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER_INVOICE);
      vm.EmptyMesssage.HISTORYMESSAGE = stringFormat(vm.EmptyMesssage.HISTORYMESSAGE, 'debit memo');
      vm.gridName = CORE.gridConfig.gridDebitMemoHistory;
      vm.lineId = 'Debit Memo Line#';
      const bindHeaderData = () => {
        vm.headerdata.push(
          {
            label: vm.LabelConstant.MFG.Supplier,
            value: data.supplierCode,
            displayOrder: 1,
            labelLinkFn: goToSupplier,
            valueLinkFn: goToSupplierDetail
          },
          {
            label: vm.LabelConstant.SupplierInvoice.DebitMemoNumber,
            value: data.debitMemoNumber,
            displayOrder: 2,
            labelLinkFn: goToDebitMemoList,
            valueLinkFn: goToDebitMemoDetail
          }
        );
      };
      bindHeaderData();
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: [],
        packingSlipId: vm.refrenceId
      };
    };

    const setDataAfterGetAPICall = (data, isGetDataDown) => {
      if (!isGetDataDown) {
        vm.sourceData = BaseService.getFormatedHistoryDataList(data.packingSlipHistoryList);
        vm.currentdata = vm.sourceData.length;
      }
      else if (data.packingSlipHistoryList.length > 0) {
        data.packingSlipHistoryList = BaseService.getFormatedHistoryDataList(data.packingSlipHistoryList);
        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(data.packingSlipHistoryList);
        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
      }

      vm.totalSourceDataCount = data.Count;
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
        if (vm.pagingInfo.SearchColumns.length > 0) {
          vm.isNoDataFound = false;
          vm.emptyState = 0;
        }
        else {
          if (vm.isAdvanceSearch) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
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
    };

    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      allowToExportAllData: true,
      exporterCsvFilename: 'Packing Slip Change History.csv',
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return PackingSlipFactory.getHistoryOfPackingSlip().query(pagingInfoOld).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response && response.data && response.data.packingSlipHistoryList) {
              setDataAfterGetAPICall(response.data, false);
              return response.data.packingSlipHistoryList;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '85',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'packingSlipSerialNumber',
        displayName: vm.lineId,
        enableCellEdit: false,
        width: '100'
      },
      {
        field: 'Colname',
        displayName: 'Field',
        enableCellEdit: false,
        width: '250'
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
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = PackingSlipFactory.getHistoryOfPackingSlip().query(vm.pagingInfo).$promise.then((packingSlipHistory) => {
        if (packingSlipHistory && packingSlipHistory.data && packingSlipHistory.data.packingSlipHistoryList) {
          setDataAfterGetAPICall(packingSlipHistory.data, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PackingSlipFactory.getHistoryOfPackingSlip().query(vm.pagingInfo).$promise.then((packingSlipHistory) => {
        if (packingSlipHistory && packingSlipHistory.data && packingSlipHistory.data.packingSlipHistoryList) {
          setDataAfterGetAPICall(packingSlipHistory.data, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.openDifferenceOfChange = (row, ev) => {
      var data = {
        Colname: row.entity.Colname,
        Oldval: row.entity.Oldval,
        Newval: row.entity.Newval,
        Tablename: row.entity.Tablename,
        RefTransID: row.entity.RefTransID
      };

      DialogFactory.dialogService(
        WORKORDER.DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER,
        WORKORDER.DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW,
        ev,
        data).then(() => 1, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.close = () => {
      $mdDialog.cancel();
    };
  }
})();
