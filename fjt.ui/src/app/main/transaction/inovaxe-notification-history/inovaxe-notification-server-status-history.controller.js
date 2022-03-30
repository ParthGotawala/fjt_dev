(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('InovaxeNotificationServerStatusHistoryController', InovaxeNotificationServerStatusHistoryController);

  /** @ngInject */
  function InovaxeNotificationServerStatusHistoryController(BaseService, CORE, WarehouseBinFactory, $timeout, TRANSACTION) {
    const vm = this;

    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.isHideDelete = true;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.INOVAXESERVERSTATUS;
    vm.inovaxeStatus = CORE.InovaxeStatus;
    vm.showRequestResponse = true;
    vm.status = CORE.InovaxeStatus[1].id;
    vm.setScrollClass = "gridScrollHeight_Inovaxe_Page";
    vm.InoAutoServerName = null;
    vm.InoAutoServerHeartbeatStatus = null;
    vm.sourceHeader = [
      {
        field: '#',
        width: '80',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'status',
        displayName: 'Server Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':(row.entity.status==\'Offline\'),\
                        \'label-box label-success\':(row.entity.status==\'Online\')}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '120',
        allowCellFocus: false,
        //filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        //filter: {
        //  term: null,
        //  options: CORE.InovaxeStatus
        //},
        //ColumnDataType: 'StringEquals',
        enableFiltering: false,
        enableSorting: true,
      },
      {
        field: 'TimeStamp',
        displayName: "TimeStamp",
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        allowCellFocus: false,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true,
      },
      {
        field: 'MessageType',
        displayName: 'Message Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '100',
        allowCellFocus: false,
        visible: false
      },
      {
        field: 'messageTypeName',
        displayName: 'Message Type Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '130',
        allowCellFocus: false,
      },
      {
        field: 'TransactionID',
        displayName: 'Transaction ID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '280',
        allowCellFocus: false,
      },
      {
        field: 'ServerName',
        displayName: 'Server Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200',
        allowCellFocus: false,
      },
     ];
    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['TimeStamp', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
      };
    }
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Inovaxe Notification Server Status.csv',
      allowCellFocus: false,
    };

    /* retrieve Notification log list*/
    vm.loadData = () => {
      filterFunction();
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['TimeStamp', 'DESC']];
      }
      vm.cgBusyLoading = WarehouseBinFactory.retriveInovaxeTransactionServerLog(vm.pagingInfo).query().$promise.then((notification) => {
        vm.sourceData = [];
        if (notification.data) {
          vm.sourceData = notification.data.InovaxeTransaction;
          vm.totalSourceDataCount = notification.data.Count;
          vm.InoAutoServerName = notification.data.InoAutoServerName.values;
          vm.InoAutoServerHeartbeatStatus = notification.data.InoAutoServerHeartbeatStatus.values;
        }
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
        clearFilter();
        if (vm.totalSourceDataCount == 0) {
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
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WarehouseBinFactory.retriveInovaxeTransactionServerLog(vm.pagingInfo).query().$promise.then((notification) => {
        vm.sourceData = vm.sourceData.concat(notification.data.InovaxeTransaction);
        vm.currentdata = vm.sourceData.length;

        vm.InoAutoServerName = notification.data.InoAutoServerName.values;
        vm.InoAutoServerHeartbeatStatus = notification.data.InoAutoServerHeartbeatStatus.values;

        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    //change status for filter inovaxe
    vm.changeInovaxeStatus = () => {
      vm.pagingInfo.Page = 1;
      vm.loadData();
    }
    //refresh status
    vm.refreshNotification = () => {
      vm.loadData();
    }
    // let filter for status
    let filterFunction = () => {
      let objMessageType = _.find(vm.pagingInfo.SearchColumns, (item) => { return item.ColumnName == 'MessageType' });
      if (objMessageType) {
        let objIndex = vm.pagingInfo.SearchColumns.indexOf(objMessageType);
        vm.pagingInfo.SearchColumns.splice(objIndex, 1);
      }
      let objSearchClm = { ColumnName: "MessageType", SearchString: "115", ColumnDataType: "StringEquals" };
      vm.pagingInfo.SearchColumns.push(objSearchClm);
      // filter for status
      clearFilter();
      if (vm.status) {
        let objSearchClm = { ColumnName: "status", SearchString: vm.status, ColumnDataType: "StringEquals" };
        vm.pagingInfo.SearchColumns.push(objSearchClm);
      }
    }
    // clear filter
    let clearFilter = () => {
      let objStatus = _.find(vm.pagingInfo.SearchColumns, (item) => { return item.ColumnName == 'status' });
      if (objStatus) {
        let objIndex = vm.pagingInfo.SearchColumns.indexOf(objStatus);
        vm.pagingInfo.SearchColumns.splice(objIndex, 1);
      }
    }
  }
})();
