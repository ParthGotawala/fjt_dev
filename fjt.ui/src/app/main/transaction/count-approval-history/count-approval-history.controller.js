(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('CountapprovalController', CountapprovalController);

  /** @ngInject */
  function CountapprovalController($timeout, DialogFactory, BaseService, $scope, $filter, CORE, TRANSACTION, ReceivingMaterialFactory) {
    const vm = this;
    vm.gridConfig = CORE.gridConfig;
    vm.isHideDelete = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.CountApprovalHistoryList.Name;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.COUNTAPPROVALHISTORY;
    vm.isNoDataFound = true;
    vm.showUMIDHistory = true;
    vm.umidHistoryIcon = CORE.UMID_HISTORY_ICON;
    vm.actionButtonName = vm.LabelConstant.UMIDManagement.History;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.searchType = vm.CustomSearchTypeForList.Exact;
    vm.loginUser = BaseService.loginUser;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.currentDate = new Date();
    vm.IsFromPickerOpen = {};
    vm.IsFromPickerOpen[vm.DATE_PICKER.fromDate] = false;
    vm.IsToPickerOpen = {};
    vm.IsToPickerOpen[vm.DATE_PICKER.toDate] = false;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['approvedDate', 'DESC']],
        SearchColumns: []
      };
    };

    initPageInfo();

    // UMID History popup
    vm.UMIDHistory = (row) => {
      const objData = {
        id: row.uidID,
        uid: row.uid
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_VIEW,
        event,
        objData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // Got to UMID Management
    vm.goToUIDManage = (data) => BaseService.goToUMIDDetail(data.uidID);

    // Got to UMID List
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    // show Approval Reason Popup
    vm.showApprovalReason = (object, ev) => {
      const headerData = [{
        label: vm.LabelConstant.TransferStock.UMID,
        value: object.uid,
        displayOrder: 1,
        labelLinkFn: () => {
          BaseService.goToUMIDList();
        },
        valueLinkFn: () => {
          BaseService.goToUMIDDetail(object.uidID);
        },
        isCopy: true
      }];
      const obj = {
        title: 'Approved Reason',
        description: object.approvalReason,
        headerData: headerData
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '80',
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
        enableSorting: false,
        enableCellEdit: false,
        pinnedLeft: true
      },
      {
        field: 'uid',
        displayName: 'UMID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
        width: '170',
        allowCellFocus: false
      },
      {
        field: 'approvalReason',
        displayName: 'Approved Reason',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.approvalReason" ng-click="grid.appScope.$parent.vm.showApprovalReason(row.entity, $event)">View</md-button>',
        width: '200'
      },
      {
        field: 'deallocatedKitDesc',
        displayName: 'Deallocated Kit',
        cellTemplate: ' <div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '500',
        allowCellFocus: false
      },
      {
        field: 'approvedDate',
        displayName: 'Approved Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        allowCellFocus: false,
        type: 'datetime',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'approvedBy',
        displayName: 'Approved By',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        type: 'StringEquals',
        enableSorting: true
      },
      {
        field: 'approvedByRole',
        displayName: 'Approved By Role',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

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
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Deallocation Approval History.csv'
    };

    /* Date Range Selection */
    const date = new Date();
    date.setDate(date.getDate() - 30);
    vm.countHistory = {
      toDate: new Date(),
      fromDate: date
    };
    vm.fromDateOptions = {
      fromDateOpenFlag: false
    };
    vm.toDateOptions = {
      toDateOpenFlag: false
    };

    // On From Date change
    vm.fromDateChanged = () => {
      vm.selectedLtbDate = vm.countHistory.fromDate ? $filter('date')(new Date(vm.countHistory.fromDate), vm.DefaultDateFormat) : null;
      if (vm.countHistory.fromDate > vm.countHistory.toDate) {
        vm.countHistory.toDate = null;
      }
      vm.fromDateOptions = {
        fromDateOpenFlag: false
      };
    };

    // On To Date change
    vm.toDateChanged = () => {
      vm.SelectedEolDate = vm.countHistory.toDate ? $filter('date')(new Date(vm.countHistory.toDate), vm.DefaultDateFormat) : null;
      if (vm.countHistory.toDate < vm.countHistory.fromDate) {
        vm.countHistory.fromDate = null;
      }
      vm.toDateOptions = {
        toDateOpenFlag: false
      };
    };

    // To manage Exact and Contain search value
    const genSearch = () => {
      if (vm.searchName) {
        let columnDataType = null;
        if (vm.searchType === vm.CustomSearchTypeForList.Exact) {
          columnDataType = 'StringEquals';
        }

        const itemIndexUID = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'uid' });
        if (itemIndexUID !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexUID, 1);
        }

        vm.pagingInfo.SearchColumns.push({ ColumnName: 'uid', SearchString: vm.searchName, ColumnDataType: columnDataType, isExternalSearch: true });
      }
    };

    function setDataAfterGetAPICall(stock, isGetDataDown) {
      if (stock && stock.data.countApprovalList) {
        if (!isGetDataDown) {
          vm.sourceData = stock.data.countApprovalList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (stock.data.countApprovalList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(stock.data.countApprovalList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = stock.data.Count;
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

    /* Retrieve deallocation approval history*/
    vm.loadData = () => {
      genSearch();
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.countHistory.fromDate) || null;
      vm.pagingInfo.toDate = BaseService.getAPIFormatedDate(vm.countHistory.toDate) || null;
      vm.cgBusyLoading = ReceivingMaterialFactory.getCountApprovalHistoryList().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ReceivingMaterialFactory.getCountApprovalHistoryList().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // calling on search
    vm.searchData = () => {
      if (BaseService.focusRequiredField(vm.countHistoryForm, true)) {
        return;
      }
      initPageInfo();
      vm.loadData();
    };

    // calling on reset and refresh functionality
    vm.resetData = () => {
      vm.searchName = null;
      vm.pagingInfo.SearchColumns = [];
      const date = new Date();
      date.setDate(date.getDate() - 30);
      vm.countHistory.toDate = new Date();
      vm.countHistory.fromDate = date;
      vm.searchType = vm.CustomSearchTypeForList.Exact;
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
    };

    vm.scanSearchKey = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.loadData();
        }
      });
    };
  }
})();
