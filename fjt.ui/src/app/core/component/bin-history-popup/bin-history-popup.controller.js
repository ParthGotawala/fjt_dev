(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('BinHistoryController', BinHistoryController);

  /** @ngInject */
  function BinHistoryController($scope, $mdDialog, data, BaseService, CORE, $timeout, BinFactory, USER) {
    const vm = this;
    vm.isHideDelete = true;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BIN_HISTORY;
    vm.BinDet = data;
    vm.BinStatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.BinTypeStatusGridHeaderDropdown = CORE.BinTypeStatusGridHeaderDropdown;
    vm.totalSourceDataCount = 0;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.gridConfig = CORE.gridConfig;
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
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
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
        field: 'NAME',
        displayName: 'Location/Bin',
        enableSorting: true,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 150
      },
      {
        field: 'wareHoueseName',
        displayName: 'Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 150
      },
      {
        field: 'parentWarehouse',
        displayName: 'Parent Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 180
      },
      {
        field: 'nickname',
        width: '150',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'Description',
        displayName: 'Description',
        width: '390',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'isActiveConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.BinStatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false,
        width: 110
      },
      {
        field: 'prefix',
        displayName: 'Prefix',
        width: '110',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'suffix',
        displayName: 'Suffix',
        width: '110',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'isPermanentBinConvertedValue',
        width: '110',
        displayName: 'Bin Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isPermanentBin == true,\
                                        \'label-warning\':row.entity.isPermanentBin == false }"> \
                                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.BinTypeStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      },
      {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[7].PageName,
        isPrint: true,
        binId: vm.BinDet.id,
        clusterWHID: vm.BinDet.isCluster ? vm.BinDet.warehouseID : null
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
      exporterCsvFilename: 'BinHistory.csv'
    };

    function setDataAfterGetAPICall(receivingmaterial, isGetDataDown) {
      if (receivingmaterial && receivingmaterial.data.bin) {
        if (!isGetDataDown) {
          vm.sourceData = receivingmaterial.data.bin;
          vm.currentdata = vm.sourceData.length;

          if (vm.BinDet.isCluster) {
            vm.currentBinDet = angular.copy(vm.BinDet);
            vm.currentBinDet.parentWarehouseName = vm.currentBinDet.deptName;
          } else {
            vm.currentBinDet = receivingmaterial.data.currentBinDet;
          }
        }
        else if (receivingmaterial.data.bin.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(receivingmaterial.data.bin);
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
      vm.cgBusyLoading = BinFactory.getBinHistory().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
        if (receivingmaterial.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(receivingmaterial, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BinFactory.getBinHistory().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
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

    vm.goToBinList = () => {
      BaseService.goToBinList();
    };
  }
})();
