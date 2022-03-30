(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrdersDataEntryController', SalesOrdersDataEntryController);

  /** @ngInject */
  function SalesOrdersDataEntryController($mdDialog, $timeout, $state, CORE, USER, WORKORDER, TRANSACTION, $scope,
    data, SalesOrderFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isHideDelete = true;
    vm.soID = data.RefTransID ? data.RefTransID : null;
    vm.tableName = data.Tablename ? data.Tablename : null;    
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.ViewDiffOfChange = true;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SALESORDERHISTORY;
    vm.salesOrderFilelds = CORE.salesOrderFilelds;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    //go to sales order
    vm.goToSalesorder = () => BaseService.goToSalesOrderList();

    // go to manage sales order page
    vm.goToManageSalesOrder = () => BaseService.goToManageSalesOrder(vm.soID);

    vm.headerData=[{
      label: vm.LabelConstant.SalesOrder.SO,
      value: data.salesOrderNumber,
      displayOrder: 1,
      labelLinkFn: vm.goToSalesorder,
      valueLinkFn: vm.goToManageSalesOrder,
      valueLinkFnParams: null,
      isCopy: true
    }];
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
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: [],
        tableName: vm.tableName
      };
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
      exporterCsvFilename: vm.tableName === 'SALESSHIPINGMST' ?'Release Line Changes History.csv':'Sales Order Changes History.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (salesorderChangeHistory, isGetDataDown) => {
      if (salesorderChangeHistory && salesorderChangeHistory.data && salesorderChangeHistory.data.salesorderAuditLogList) {
        if (!isGetDataDown) {
          vm.sourceData = salesorderChangeHistory.data.salesorderAuditLogList;
          vm.currentdata = vm.sourceData.length;
          _.map(vm.sourceData, (obj) => obj.Colname = _.find(vm.salesOrderFilelds, (item) => item.fieldName === obj.Colname).displayValueName);
        }
        else if (salesorderChangeHistory.data.salesorderAuditLogList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(salesorderChangeHistory.data.salesorderAuditLogList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = salesorderChangeHistory.data.Count;
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

    /* retrieve sales-order changes history list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.soID = vm.soID ? vm.soID : null;
      vm.cgBusyLoading = SalesOrderFactory.salesorderchangehistory().query(vm.pagingInfo).$promise.then((salesorderChangeHistory) => {
        if (salesorderChangeHistory && salesorderChangeHistory.data) {
          setDataAfterGetAPICall(salesorderChangeHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SalesOrderFactory.salesorderchangehistory().query(vm.pagingInfo).$promise.then((salesorderChangeHistory) => {
        if (salesorderChangeHistory && salesorderChangeHistory.data) {
          setDataAfterGetAPICall(salesorderChangeHistory, true);
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
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    
    vm.close = () => {
      $mdDialog.cancel();
    };
  }
})();
