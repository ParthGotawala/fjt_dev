(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('InovaxeNotificationLogController', InovaxeNotificationLogController);

  /** @ngInject */
  function InovaxeNotificationLogController(BaseService, CORE, WarehouseBinFactory, $timeout, DialogFactory, TRANSACTION) {
    const vm = this;

    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.isHideDelete = true;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.INOVAXEALLLOG;
    vm.showRequestResponse = true;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.allCommonModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.setScrollClass = 'gridScrollHeight_Inovaxe_Page';
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="1"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        allowCellFocus: false
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'isfromSystemValue',
        displayName: 'Message Source',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':!row.entity.isfromSystem,\
                        \'label-box label-success\':row.entity.isfromSystem }"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '110',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.InovaxeNotification
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'messageType',
        displayName: 'Message Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '100',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.InovaxeMessageType
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true,
        visible: false
      },
      {
        field: 'messageTypeName',
        displayName: 'Message Type Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '180',
        allowCellFocus: false
      },
      {
        field: 'transactionID',
        displayName: 'Transaction ID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '280',
        allowCellFocus: false
      },
      {
        field: 'startDate',
        displayName: 'Request Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        allowCellFocus: false,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'reelBarCode',
        displayName: 'UMID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150',
        allowCellFocus: false
      },
      {
        field: 'departmentName',
        displayName: 'Parent Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200',
        allowCellFocus: false
      },
      {
        field: 'requestMessage',
        displayName: 'Request Message',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '300',
        allowCellFocus: false
      },
      {
        field: 'isInTransitValue',
        displayName: 'In Transit (Bin to Bin)',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span ng-class="{\'label-box label-warning\':(row.entity.isInTransit),\
                        \'label-box label-success\':(!row.entity.isInTransit )}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '100',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.MasterTemplateDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'illegalPickValue',
        displayName: 'Illeagal Pick',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':row.entity.illegalPick,\
                        \'label-box label-success\':!row.entity.illegalPick}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '90',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.MasterTemplateDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'endDate',
        displayName: 'Response Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        allowCellFocus: false,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'responseMessage',
        displayName: 'Response Message',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '300',
        allowCellFocus: false
      },
      {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'createdby',
        displayName: 'Created By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['startDate', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName
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
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Inovaxe Notification Log.csv',
      allowCellFocus: false
    };


    function setDataAfterGetAPICall(notification, isGetDataDown) {
      if (notification && notification.data.InovaxeTransaction) {
        if (!isGetDataDown) {
          vm.sourceData = notification.data.InovaxeTransaction;
          vm.currentdata = vm.sourceData.length;
        }
        else if (notification.data.InovaxeTransaction.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(notification.data.InovaxeTransaction);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = notification.data.Count;
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
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    /* retrieve Notification log list*/
    vm.loadData = () => {
      if (vm.allCommonModel.searchText) {
        setExternalSearchFilter();
      }
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['startDate', 'DESC']];
      }
      vm.pagingInfo.SearchText = vm.allCommonModel.searchText;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WarehouseBinFactory.retriveInovaxeTransactionLogList().query(vm.pagingInfo).$promise.then((notification) => {
        vm.sourceData = [];
        if (notification.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(notification, false);
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WarehouseBinFactory.retriveInovaxeTransactionLogList().query(vm.pagingInfo).$promise.then((notification) => {
        setDataAfterGetAPICall(notification, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //open request response popup
    vm.openRequestResponseView = (item, event) => {
      var data = item.entity;
      DialogFactory.dialogService(
        CORE.REQUEST_RESPONSE_MODAL_CONTROLLER,
        CORE.REQUEST_RESPONSE_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    //change search type
    vm.changeSearchType = () => {
      vm.loadData();
    };

    //refresh notification
    vm.refreshNotification = () => {
      vm.loadData();
    };

    //search data
    vm.searchCommonData = (isReset) => {
      if (isReset) {
        vm.allCommonModel.searchText = null;
        initPageInfo();
        vm.gridOptions.gridApi.grid.clearAllFilters();
      }
      else {
        vm.pagingInfo.Page = CORE.UIGrid.Page();
        setExternalSearchFilter();
      }
      vm.loadData();
    };

    //sent external search filter
    const setExternalSearchFilter = () => {
      /* to avoid duplicate filter data adding in list */
      if (vm.pagingInfo.SearchColumns.length > 0) {
        _.remove(vm.pagingInfo.SearchColumns, (item) => item.isExternalSearch);
      }
      if (vm.allCommonModel.searchType === CORE.CustomSearchTypeForList.Exact) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'transactionID', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'departmentName', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'reelBarCode', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'messageTypeName', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'messageType', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
      }
      else if (vm.allCommonModel.searchType === CORE.CustomSearchTypeForList.Contains) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'transactionID', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'departmentName', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'reelBarCode', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'messageTypeName', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'messageType', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
      }
    };
  }
})();
