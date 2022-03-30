(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ShowGenericConfirmationPopupController', ShowGenericConfirmationPopupController);

  /** @ngInject */
  function ShowGenericConfirmationPopupController($mdDialog, data, BaseService, CORE, $timeout, MasterFactory) {
    const vm = this;
    vm.isHideDelete = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = data.EmptyMesssage;
    vm.title = data.title;
    vm.headerData = data.headerData && data.headerData.length > 0 ? data.headerData : [];
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.sourceHeader = [
      {
        field: '#',
        width: '50',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'approvalReason',
        displayName: 'Approval Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '520'
      },
      {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime'
      },
      {
        field: 'updatedby',
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

    if (data.showTransactionType) {
      const transactionType = {
        field: 'transactionType',
        displayName: 'Transaction Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      };
      const approvalReasonIndex = vm.sourceHeader.map((obj) => obj.field).indexOf('approvalReason');
      vm.sourceHeader.splice(approvalReasonIndex, 0, transactionType);
    }


    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[33].PageName,
        confirmationType: data.confirmationType,
        refTableName: data.refTableName,
        refID: data.refID
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
      exporterCsvFilename: `${data.title}.csv`
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (genericConfirmation, isGetDataDown) => {
      if (genericConfirmation && genericConfirmation.data && genericConfirmation.data.genericConfirmation) {
        if (!isGetDataDown) {
          vm.sourceData = genericConfirmation.data.genericConfirmation;
          vm.currentdata = vm.sourceData.length;
        }
        else if (genericConfirmation.data.genericConfirmation.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(genericConfirmation.data.genericConfirmation);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = genericConfirmation.data.Count;
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
      vm.cgBusyLoading = MasterFactory.retrieveGenericConfirmation().query(vm.pagingInfo).$promise.then((genericConfirmation) => {
        if (genericConfirmation && genericConfirmation.data) {
          setDataAfterGetAPICall(genericConfirmation, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = MasterFactory.retrieveGenericConfirmation().query(vm.pagingInfo).$promise.then((genericConfirmation) => {
        if (genericConfirmation && genericConfirmation.data) {
          setDataAfterGetAPICall(genericConfirmation, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
