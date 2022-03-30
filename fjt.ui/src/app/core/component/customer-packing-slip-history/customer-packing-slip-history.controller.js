(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CutomerPackingSlipHistoryController', CutomerPackingSlipHistoryController);

  /** @ngInject */
  function CutomerPackingSlipHistoryController($mdDialog, $timeout, CORE, WORKORDER, TRANSACTION,
    data, CustomerPackingSlipFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isHideDelete = true;
    vm.customerPackingId = data.customerPackingId ? data.customerPackingId : null;
    vm.customerPackingDetID = data.customerPackingDetID ? data.customerPackingDetID : null;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.ViewDiffOfChange = true;
    let historyGridCSVName = null;
    if (data.transType === CORE.TRANSACTION_TYPE.PACKINGSLIP) {
      vm.popupTitle = 'Customer Packing Slip Change History';
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMERPACKINGHISTORY;
      historyGridCSVName = 'Customer Packing Slip Change History.csv';
    } else if (data.transType === CORE.TRANSACTION_TYPE.INVOICE) {
      vm.popupTitle = 'Customer Invoice Change History';
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMERINVOICEHISTORY;
      historyGridCSVName = 'Customer Invoice Change History.csv';
    } else if (data.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
      vm.popupTitle = 'Customer Credit Memo Change History';
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMERCREDITMEMOHISTORY;
      historyGridCSVName = 'Customer Credit Memo Change History.csv';
    }
    //vm.isinvoice = data.isinvoice;
    //vm.EmptyMesssage = !data.isinvoice ? TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMERPACKINGHISTORY : TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMERINVOICEHISTORY;
    vm.customerPackingFilelds = CORE.customerPackingFilelds;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
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
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'lineNoSequence',
        displayName: 'Line#',
        enableCellEdit: false,
        width: '85'
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
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.Oldval}}</div>',
        enableCellEdit: false,
        width: '320'
      }, {
        field: 'Newval',
        displayName: 'New Value',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.Newval}}</div>',
        enableCellEdit: false,
        width: '320'
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

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: [],
        customerPackingId: vm.customerPackingId,
        customerPackingDetID: vm.customerPackingDetID
      };
    };
    initPageInfo();
    //go to customer packing slip list page
    const goToCustomerPackingSlipList = () => {
      BaseService.goToCustomerPackingSlipList();
      return;
    };
    //go to manage customer packing slip
    const goToManageCustomerPackingSlip = () => {
      BaseService.goToManageCustomerPackingSlip(vm.customerPackingId, (data.refSalesOrderID || 0));
      return;
    };
    //go to customer packing slip list page
    const goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
      return;
    };
    //go to manage customer packing slip
    const goToManageCustomerInvoice = () => {
      BaseService.goToManageCustomerInvoice(vm.customerPackingId);
      return;
    };
    //go to customer credit memo list page
    const goToCustomerCreditMemoList = () => {
      BaseService.goToCustomerCreditMemoList();
      return;
    };
    //go to manage customer credit memo
    const goToManageCustomerCreditMemo = () => {
      BaseService.goToCustomerCreditMemoDetail(vm.customerPackingId);
      return;
    };

    //bind header details
    const bindHeaderData = () => {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.CustomerPackingSlip.CustomerPackingSlipNumber,
        value: data.packingSlipNumber,
        displayOrder: 1,
        labelLinkFn: goToCustomerPackingSlipList,
        valueLinkFn: goToManageCustomerPackingSlip
      }, {
          label: vm.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber,
        value: data.invoiceNumber,
        displayOrder: 1,
        labelLinkFn: goToCustomerInvoiceList,
        valueLinkFn: goToManageCustomerInvoice
      },
        {
          label: vm.LabelConstant.CustomerCreditMemo.CustomerCreditMemoNumer,
          value: data.creditMemoNumber,
          displayOrder: 1,
          labelLinkFn: goToCustomerCreditMemoList,
          valueLinkFn: goToManageCustomerCreditMemo
        }
      );
    };
    bindHeaderData();
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
      exporterCsvFilename: historyGridCSVName
      //data.isinvoice ? 'Customer Invoice Change History.csv' : 'Customer Packing Slip Change History.csv'
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (customerHistory, isGetDataDown) => {
      if (customerHistory && customerHistory.data && customerHistory.data.customerPackingLog) {
        if (!isGetDataDown) {
          vm.sourceData = BaseService.getFormatedHistoryDataList(customerHistory.data.customerPackingLog);
          vm.sourceData = customerHistory.data.customerPackingLog;
          vm.currentdata = vm.sourceData.length;
        }
        else if (customerHistory.data.customerPackingLog.length > 0) {
          customerHistory.data.customerPackingLog = BaseService.getFormatedHistoryDataList(customerHistory.data.customerPackingLog);
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(customerHistory.data.customerPackingLog);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = customerHistory.data.Count;
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
      }
    };

    /* retrieve customer packing slip changes history list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = CustomerPackingSlipFactory.customerPackingchangehistory().query(vm.pagingInfo).$promise.then((customerHistory) => {
        if (customerHistory && customerHistory.data) {
          setDataAfterGetAPICall(customerHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CustomerPackingSlipFactory.customerPackingchangehistory().query(vm.pagingInfo).$promise.then((customerHistory) => {
        if (customerHistory && customerHistory.data) {
          setDataAfterGetAPICall(customerHistory, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Open popup for display difference of entry change */
    vm.openDifferenceOfChange = (row, $event) => {
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
        $event,
        data).then(() => 1, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.close = () => {
      $mdDialog.cancel();
    };
  }
})();
