(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('InovaxeNotificationUnAuthorizeHistoryController', InovaxeNotificationUnAuthorizeHistoryController);

  /** @ngInject */
  function InovaxeNotificationUnAuthorizeHistoryController(BaseService, CORE, WarehouseBinFactory, $timeout, DialogFactory, TRANSACTION, socketConnectionService, $scope, $mdDialog) {
    const vm = this;

    vm.gridConfig = CORE.gridConfig;
    const loginUserDetails = BaseService.loginUser;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.INOVAXEUNAUTHORIZELOG;
    vm.showRequestResponse = true;
    vm.isClearRequest = true;
    vm.InovaxeUnauthorizeVerifyStatus = CORE.InovaxeUnauthorizeVerifyStatus;
    vm.setScrollClass = 'gridScrollHeight_Inovaxe_Unauthorize_Page';
    vm.status = CORE.InovaxeUnauthorizeVerifyStatus[2].id;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.allCommonModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.isShowUserStatus = _.find(loginUserDetails.featurePageDetail, (item) => item.featureName === CORE.ROLE_ACCESS.UNAUTHORIZE_NOTIFICATION_REMOVE);
    vm.isHideDelete = vm.isShowUserStatus ? false : true;
    vm.unauthorizeMessage = angular.copy(CORE.InovaxeUnauthorizeMessage);
    vm.unauthorizeMessage.length = (vm.unauthorizeMessage.length - 1);
    vm.messageTypeNameFilter = vm.unauthorizeMessage[0].id;
    const isEnablePagination = loginUserDetails.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '100',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="2"></grid-action-view>',
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
        field: 'requestStatus',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':!row.entity.isClearRequest,\
                        \'label-box label-success\':row.entity.isClearRequest }"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '110',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.InovaxeUnauthorizeVerifyStatus
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: false,
        enableSorting: true

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
          options: CORE.InovaxeUnAuthorizeMessageType
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
        width: '240',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.unauthorizeMessage
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: false
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
        field: 'slotName',
        displayName: 'Location/Bin',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '180',
        allowCellFocus: false
      },
      {
        field: 'warehouseName',
        displayName: 'Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '120',
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
        field: 'clearUnauthorizeRequstReason',
        displayName: 'Clear Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '300',
        allowCellFocus: false
      },
      {
        field: 'clearedAt',
        displayName: 'Cleared On',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'clearBy',
        displayName: 'Cleared By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'clearResponseStatus',
        displayName: 'Clear Request Status',
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
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
        CurrentPage: CORE.PAGENAME_CONSTANT[63].PageName
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: vm.isShowUserStatus ? true : false,
      enableFullRowSelection: vm.isShowUserStatus ? true : false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Unauthorized Notification History.csv',
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
          const objInovaxeMessage = _.find(vm.sourceHeader, (header) => header.field === 'messageTypeName');
          if (objInovaxeMessage) {
            const objIndex = vm.sourceHeader.indexOf(objInovaxeMessage);
            if (vm.status === CORE.InovaxeUnauthorizeVerifyStatus[2].id) {
              vm.gridOptions.columnDefs[objIndex].filter.options = vm.unauthorizeMessage;
            } else {
              vm.gridOptions.columnDefs[objIndex].filter.options = CORE.InovaxeUnauthorizeMessage;
            }
          }
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
      filterFunction();
      if (vm.allCommonModel.searchText) {
        setExternalSearchFilter();
      }
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['startDate', 'DESC']];
      }
      vm.pagingInfo.SearchText = vm.allCommonModel.searchText;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WarehouseBinFactory.retriveInovaxeUnAuthorizeTransactionLogList().query(vm.pagingInfo).$promise.then((notification) => {
        vm.sourceData = [];
        if (notification.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(notification, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WarehouseBinFactory.retriveInovaxeUnAuthorizeTransactionLogList().query(vm.pagingInfo).$promise.then((notification) => {
        setDataAfterGetAPICall(notification, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //open popup for request response
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

    //change status for filter inovaxe
    vm.changeInovaxeStatus = () => {
      vm.pagingInfo.Page = 1;
      vm.loadData();
    };

    // let filter for status
    const filterFunction = () => {
      clearFilter();
      if (vm.status) {
        const objSearchClm = { ColumnName: 'requestStatus', SearchString: vm.status, ColumnDataType: 'StringEquals', isExternalSearch: true };
        vm.pagingInfo.SearchColumns.push(objSearchClm);
      }

      if (vm.messageTypeNameFilter) {
        const objSearchClm = { ColumnName: 'messageTypeName', SearchString: vm.messageTypeNameFilter, ColumnDataType: 'StringEquals', isExternalSearch: true };
        vm.pagingInfo.SearchColumns.push(objSearchClm);
      }
    };

    //clear filter for status
    const clearFilter = () => {
      const externalFilters = _.filter(vm.pagingInfo.SearchColumns, (item) => item.ColumnName === 'requestStatus' || item.ColumnName === 'messageTypeName');
      if (externalFilters && externalFilters.length > 0) {
        _.each(externalFilters, (item) => {
          const objIndex = vm.pagingInfo.SearchColumns.indexOf(item);
          vm.pagingInfo.SearchColumns.splice(objIndex, 1);
        });
      }
    };

    //clear request for unauthorize
    vm.clearInovaxeRequest = (row, ev) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_UNAUTHORIZE_CLEAER_CONTROLLER,
        TRANSACTION.TRANSACTION_UNAUTHORIZE_CLEAER_MODAL_VIEW,
        ev,
        row.entity).then(() => {
        }, (respo) => {
          if (respo && !respo.iscancel) {
            sendClearAuthorizeRequest(row.entity, respo.cancleReason);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    //send request to clear
    const sendClearAuthorizeRequest = (item, reason) => {
      item.clearUnauthorizeRequstReason = reason;
      WarehouseBinFactory.sendRequestToClearUnauthorizeRequest().query(item).$promise.then(() => {
        vm.loadData();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //search data
    vm.searchCommonData = (isReset) => {
      if (isReset) {
        vm.allCommonModel.searchText = null;
        initPageInfo();
        vm.gridOptions.gridApi.grid.clearAllFilters();
        filterFunction();
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
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'warehouseName', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'slotName', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
      }
      else if (vm.allCommonModel.searchType === CORE.CustomSearchTypeForList.Contains) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'transactionID', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'warehouseName', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'slotName', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
      }
    };

    //refresh notification
    vm.refreshNotification = () => {
      vm.loadData();
    };

    vm.changeSearchType = () => {
      vm.loadData();
    };

    //get response from clear unauthorize
    const updateUnAuthorizeClearResponse = () => {
      vm.loadData();
    };

    /* delete warehouse*/
    vm.deleteRecord = (unauthorize) => {
      let selectedIDs = [];
      if (unauthorize) {
        selectedIDs.push(unauthorize.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((unauthorizeItem) => unauthorizeItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Unauthorized Notification', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = WarehouseBinFactory.removeUnauthorizeRequest().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                vm.gridOptions.clearSelectedRows();
                vm.loadData();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //web socket call
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUnAuthorizeClearResponse, updateUnAuthorizeClearResponse);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUnAuthorizeClearResponse, updateUnAuthorizeClearResponse);
    }

    $scope.$on('$destroy', () => {
      removeSocketListener();
      $mdDialog.hide(false, { closeAll: true });
    });

    //open audit popup
    vm.openAuditPage = (ev) => {
      var data = {
        rightSideWHLabel: null
      };
      DialogFactory.dialogService(
        CORE.AUDIT_MODAL_CONTROLLER,
        CORE.AUDIT_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //go to transaction log page
    vm.goTotransactionpage = () => {
      BaseService.gotoTransactionRequestPage();
    };

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });
  }
})();
