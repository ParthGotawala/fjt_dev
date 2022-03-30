(function () {
  'use restrict';

  angular.module('app.transaction.transferstock')
    .controller('UnallocateUMIDXferHistoryController', UnallocateUMIDXferHistoryController);

  /* @ngInject */
  function UnallocateUMIDXferHistoryController(CORE, BaseService, TransferStockFactory, $timeout, $filter, USER, DialogFactory) {
    const vm = this;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.UNALLOCATED_UMID_XFER_HISTORY;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.currentDate = new Date();
    vm.IsFromPickerOpen = {};
    vm.IsFromPickerOpen[vm.DATE_PICKER.fromDate] = false;
    vm.IsToPickerOpen = {};
    vm.IsToPickerOpen[vm.DATE_PICKER.toDate] = false;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    /* Date Range Selection */
    const date = new Date();
    date.setDate(date.getDate() - 30);
    vm.unallocatedUmidXferHistoryModal = {
      toDate: new Date(),
      fromDate: date
    };
    vm.fromDateOptions = {
      fromDateOpenFlag: false
    };
    vm.toDateOptions = {
      toDateOpenFlag: false
    };

    vm.fromDateChanged = () => {
      vm.selectedLtbDate = vm.unallocatedUmidXferHistoryModal.fromDate ? $filter('date')(new Date(vm.unallocatedUmidXferHistoryModal.fromDate), vm.DefaultDateFormat) : null;
      if (vm.unallocatedUmidXferHistoryModal.fromDate > vm.unallocatedUmidXferHistoryModal.toDate) {
        vm.unallocatedUmidXferHistoryModal.toDate = null;
      }
      vm.fromDateOptions = {
        fromDateOpenFlag: false
      };
    };

    vm.toDateChanged = () => {
      vm.SelectedEolDate = vm.unallocatedUmidXferHistoryModal.toDate ? $filter('date')(new Date(vm.unallocatedUmidXferHistoryModal.toDate), vm.DefaultDateFormat) : null;
      if (vm.unallocatedUmidXferHistoryModal.toDate < vm.unallocatedUmidXferHistoryModal.fromDate) {
        vm.unallocatedUmidXferHistoryModal.fromDate = null;
      }
      vm.toDateOptions = {
        toDateOpenFlag: false
      };
    };

    vm.selectorDateSearch = () => {
      if (BaseService.focusRequiredField(vm.unallocatedUmidXferHistoryForm, true)) {
        return;
      }
      initPageInfo();
      vm.loadData();
    };

    vm.selectorDateReset = () => {
      var date = new Date();
      date.setDate(date.getDate() - 30);
      vm.unallocatedUmidXferHistoryModal.toDate = new Date();
      vm.unallocatedUmidXferHistoryModal.fromDate = date;
      initPageInfo();
      vm.loadData();
    };

    vm.showReasonForTransaction = (object, ev) => {
      const obj = {
        title: 'Reason',
        description: object.reason
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data
      ).then(() => {

      }, (err) => BaseService.getErrorLog(err));
    };

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        maxWidth: '50'
      }, {
        field: 'createdAt',
        displayName: 'Transaction Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.createdAt | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        enableFiltering: false
      }, {
        field: 'createdby',
        displayName: 'Transaction By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150',
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyRole',
        displayName: 'Transaction By Role',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '150',
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'transactionType',
        displayName: 'Transaction Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '270',
        maxWidth: '300'
      }, {
        field: 'category',
        displayName: 'Category',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '300',
        maxWidth: '500'
      }, {
        field: 'transferFrom',
        displayName: 'From',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '350',
        maxWidth: '500'
      }, {
        field: 'transferTo',
        displayName: 'To',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '350',
        maxWidth: '500'
      }, {
        field: 'reason',
        displayName: 'Reason',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.reason" ng-click="grid.appScope.$parent.vm.showReasonForTransaction(row.entity, $event)">View</md-button>',
        width: '200'
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['createdAt', 'DESC']],
        SearchColumns: []
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Unallocated UMID Transfer History.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[29].PageName
    };

    function setDataAfterGetAPICall(historyType, isGetDataDown) {
      if (historyType && historyType.data.HistoryCategory) {
        if (!isGetDataDown) {
          vm.sourceData = historyType.data.HistoryCategory;
          vm.currentdata = vm.sourceData.length;
        }
        else if (historyType.data.HistoryCategory.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(historyType.data.HistoryCategory);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = historyType.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.fromDate || vm.pagingInfo.toDate) {
            vm.isHistoryNotFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isHistoryNotFound = true;
            vm.emptyState = null;
          }
        }
        else {
          vm.isHistoryNotFound = false;
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

    /* retrieve unallocated umid xfer history list*/
    vm.loadData = () => {
      vm.Apply = false;
      vm.isHideDelete = true;
      vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.unallocatedUmidXferHistoryModal.fromDate) || null;
      vm.pagingInfo.toDate = BaseService.getAPIFormatedDate(vm.unallocatedUmidXferHistoryModal.toDate) || null;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = TransferStockFactory.getUnallocatedUmidTransferHistoryList().query(vm.pagingInfo).$promise.then((historyType) => {
        if (historyType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(historyType, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = TransferStockFactory.getUnallocatedUmidTransferHistoryList().query(vm.pagingInfo).$promise.then((historyType) => {
        setDataAfterGetAPICall(historyType, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //refresh unallocated umid xfer history list
    vm.refreshUnallocatedXferHistory = () => {
      vm.loadData();
    };
  }
})();
