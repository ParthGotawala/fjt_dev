(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('WarehouseHistoryController', WarehouseHistoryController);

  /** @ngInject */
  function WarehouseHistoryController($scope, $mdDialog, data, BaseService, USER, CORE, TRANSACTION, $timeout, WarehouseBinFactory) {
    const vm = this;
    vm.cartType = TRANSACTION.warehouseType;
    vm.isHideDelete = true;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.WAREHOUSE_HISTORY;
    vm.warehouseDet = data;
    vm.UserAccessMode = CORE.UserAccessMode;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.KeywordUserAccessModeGridHeaderDropdown = CORE.KeywordUserAccessModeGridHeaderDropdown;
    vm.UserAccessModeGridHeaderDropdown = CORE.UserAccessModeGridHeaderDropdown;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'updatedAt',
        displayName: 'Transfer Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        allowCellFocus: false,
        type: 'datetime'
      },
      {
        field: 'updatedby',
        displayName: 'Modified By',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        allowCellFocus: false
      },
      {
        field: 'warehouseTypeValue',
        displayName: 'Warehouse Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                        ng-class="{\'label-warning\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.SmartCart.key,\
                        \'label-info\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.ShelvingCart.key,\
                        \'label-primary\':row.entity.warehouseType == grid.appScope.$parent.vm.cartType.Equipment.key}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '140',
        allowCellFocus: false
      },
      {
        field: 'Name',
        width: 250,
        displayName: 'Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'nickname',
        width: 150,
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'parentWarehouseName',
        width: 200,
        displayName: 'Parent Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'Description',
        width: '300',
        displayName: 'Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'uniqueCartID',
        width: '120',
        displayName: 'Unique Cart ID',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'domain',
        width: '130',
        displayName: 'Domain',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'cartMfr',
        width: '130',
        displayName: 'Cart Manufacturer',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.isActive == true ,\
                        \'label-warning\':row.entity.isActive == false }"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        },
        width: '90',
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      },
      {
        field: 'parentConvertedValue',
        displayName: 'Permanent Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="{\'label-success\':row.entity.isPermanentWH == true,\
                                        \'label-warning\':row.entity.isPermanentWH == false }"> \
                                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: 115
      },
      {
        field: 'allMovableBinConvertValue',
        displayName: 'Movable Bin/Slot',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span ng-if="row.entity.allMovableBin != null" class="label-box" ng-class="{\'label-success\':row.entity.allMovableBin == true,\
                                        \'label-warning\':row.entity.allMovableBin == false }"> \
                                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: 95
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        isPrint: true,
        warehouseID: vm.warehouseDet.id
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
      exporterCsvFilename: 'WarehouseHistory.csv'
    };

    function setDataAfterGetAPICall(receivingmaterial, isGetDataDown) {
      if (receivingmaterial && receivingmaterial.data.warehouse) {
        if (!isGetDataDown) {
          vm.sourceData = receivingmaterial.data.warehouse;
          vm.currentWHDet = receivingmaterial.data.currentWHDet;
          vm.currentdata = vm.sourceData.length;
        }
        else if (receivingmaterial.data.warehouse.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(receivingmaterial.data.warehouse);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = receivingmaterial.data.Count;
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

    /* retrieve Receiving Material list*/
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WarehouseBinFactory.getHistory().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
        if (receivingmaterial.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(receivingmaterial, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WarehouseBinFactory.getHistory().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
        if (receivingmaterial) {
          setDataAfterGetAPICall(receivingmaterial, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };
  }
})();
