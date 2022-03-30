(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('splitUidList', splitUidList);

  /** @ngInject */
  function splitUidList() {
    var directive = {
      restrict: 'E',
      scope: {
        uidId: '=?'
      },
      templateUrl: 'app/directives/custom/split-uid-list/split-uid-list.html',
      controller: splitUMIDListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of Split UMID
    *
    * @param
    */
    function splitUMIDListCtrl($timeout, DialogFactory, BaseService, $scope, CORE, TRANSACTION, ReceivingMaterialFactory, $stateParams) {
      const vm = this;
      vm.uidId = $scope.uidId;
      vm.gridConfig = CORE.gridConfig;
      vm.isHideDelete = true;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SPLITUIDLIST;
      vm.isNoDataFound = true;
      vm.showUMIDHistory = true;
      vm.umidHistoryIcon = CORE.UMID_HISTORY_ICON;
      vm.actionButtonName = vm.LabelConstant.UMIDManagement.History;
      vm.loginUser = BaseService.loginUser;
      vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
      vm.searchType = vm.CustomSearchTypeForList.Exact;
      vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['createdAt', 'DESC']],
          SearchColumns: []
        };
      };

      initPageInfo();

      // UMID History popup
      vm.UMIDHistory = (row) => {
        const objData = {
          id: row.id,
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
      vm.goToUIDManage = (id) => BaseService.goToUMIDDetail (id);

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
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.id)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'fromUID',
          displayName: 'Split From UMID',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.fromUIDId)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.FromUMID" text="row.entity.fromUID"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'orgQty',
          displayName: 'Split Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'orgPkgUnit',
          displayName: 'Split Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'fromBinName',
          displayName: 'From Location/Bin',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false

        },
        {
          field: 'fromWHName',
          displayName: 'From Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'fromDeptName',
          displayName: 'From Department',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'pkgQty',
          displayName: 'Current Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'pkgUnit',
          displayName: 'Current Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'currentBinName',
          displayName: 'Current Location/Bin',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false

        },
        {
          field: 'currentWHName',
          displayName: 'Current Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'currentDeptName',
          displayName: 'Current Department',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'uomName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        }, {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          allowCellFocus: false,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'updatedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          type: 'StringEquals',
          enableSorting: true
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'createdBy',
          displayName: 'Created By',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
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
        exporterCsvFilename: 'Split UMID.csv'
      };

      // To manage Exact and Contain search value
      const genSearch = () => {
        if (vm.searchName) {
          let columnDataType = null;
          if (vm.searchType === vm.CustomSearchTypeForList.Exact) {
            columnDataType = 'StringEquals';
          }

          const itemIndexUID = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'uid', ColumnName: 'fromUID' });
          if (itemIndexUID !== -1) {
            vm.pagingInfo.SearchColumns.splice(itemIndexUID, 1);
          }

          vm.pagingInfo.SearchColumns.push({ ColumnName: 'uid', SearchString: vm.searchName, ColumnDataType: columnDataType, isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'fromUID', SearchString: vm.searchName, ColumnDataType: columnDataType, isExternalSearch: true });
        }
      };

      function setDataAfterGetAPICall(stock, isGetDataDown) {
        if (stock && stock.data.splitUIDList) {
          if (!isGetDataDown) {
            vm.sourceData = stock.data.splitUIDList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (stock.data.splitUIDList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(stock.data.splitUIDList);
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

      /* Retrieve split umid list */
      vm.loadData = () => {
        genSearch();
        vm.pagingInfo.id = vm.uidId
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ReceivingMaterialFactory.getSplitUIDList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ReceivingMaterialFactory.getSplitUIDList().query(vm.pagingInfo).$promise.then((response) => {
          if (response) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // calling on search
      vm.searchData = () => {
        if (BaseService.focusRequiredField(vm.splitListForm, true)) {
          return;
        }
        initPageInfo();
        vm.loadData();
      };

      // calling on reset and refresh functionality
      vm.resetData = () => {
        vm.searchName = null;
        vm.pagingInfo.SearchColumns = [];
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
  }
})();
