(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('clearRackGrid', clearRackGrid);

  /** @ngInject */
  function clearRackGrid(TravelersFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woOpId: '=',
        operationName: '='
      },
      templateUrl: 'app/directives/custom/clear-rack-grid/clear-rack-grid.html',
      controller: clearRackGridCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function clearRackGridCtrl($scope, $timeout, CORE, BaseService) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.isNoDataFound = false;
      vm.EmptyMesssage = angular.copy(CORE.EMPTYSTATE.CLEARRACK);
      vm.isHideDelete = true;
      vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, $scope.operationName);
      vm.setScrollClass = 'gridScrollHeight_Incoming_Outgoing_Page';
      vm.gridConfig = CORE.gridConfig;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      // page info detail
      vm.pagingInfo = {
        // Page: 1,
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        woOPID: $scope.woOpId
      };
      //grid option settings
      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: 'Clear Rack.csv',
        exporterMenuCsv: true,
        enableColumnMenus: false
      };

      //grid header detail
      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'rackName',
          displayName: 'Rack',
          cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'createdby',
          displayName: 'Cleared By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: false
        },
        {
          field: 'createdAt',
          displayName: 'Cleared On',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          allowCellFocus: false,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'updatedbyRole',
          displayName: 'Cleared By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (response, isGetDataDown) => {
        if (response && response.data && response.data.clearRack) {
          if (!isGetDataDown) {
            vm.sourceData = response.data.clearRack;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.clearRack.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.clearRack);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = response.data.Count;
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
            } else {
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

      // get list of scanned clear rack
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = TravelersFactory.retriveClearRackList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get list of scanned clear rack, called method after scroll
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = TravelersFactory.retriveClearRackList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      $scope.$on(CORE.EventName.refreshinoutGrid, () => {
        vm.pagingInfo.Page = 1;
        vm.loadData();
      });
    }
  }
})();
