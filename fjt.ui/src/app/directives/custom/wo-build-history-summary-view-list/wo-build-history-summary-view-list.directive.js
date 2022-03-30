(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('woBuildHistorySummaryViewList', woBuildHistorySummaryViewList);

  /** @ngInject */
  function woBuildHistorySummaryViewList(BaseService, $timeout, $state, CORE, ComponentNicknameWOBuildDetailFactory) {
    var directive = {
      restrict: 'E',
      replace: false,
      scope: {
        popupParamData: '=?'
      },
      templateUrl: 'app/directives/custom/wo-build-history-summary-view-list/wo-build-history-summary-view-list.html',
      controller: woBuildHistorySummaryViewListCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function woBuildHistorySummaryViewListCtrl($scope) {
      var vm = this;
      vm.isHideDelete = true;
      vm.gridConfig = CORE.gridConfig;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.popupParamData = $scope.popupParamData || {};
      vm.popupParamDataCopy = angular.copy(vm.popupParamData);

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
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
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'WOBuildHistorySummaryView.csv',
        hideMultiDeleteButton: true
      };

      if (vm.popupParamDataCopy.assyNickName) {
        vm.pagingInfo.SearchColumns.push({ ColumnName: 'nickName', SearchString: vm.popupParamDataCopy.assyNickName });
      }

      vm.sourceHeader = [{
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'nickName',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250',
        filter: {
          term: vm.popupParamDataCopy.assyNickName || null
        }
      },
      {
        field: 'custAssyPN',
        displayName: 'Part#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'rev',
        displayName: 'Rev',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '70'
      },
      {
        field: 'lastWOSeriesNumber',
        displayName: 'Last WO Series#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '130'
      },
      {
        field: 'lastWOBuildNumber',
        displayName: 'Last WO Build#',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '110'
      },
      {
        field: 'woCount',
        displayName: 'Total WO (Incl. Initial Stock)',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '130'
      }
      ];
      vm.popupParamDataCopy.assyNickName = null;

      /* to bind data in grid on load */
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ComponentNicknameWOBuildDetailFactory.getCompNicknameWObuildSummaryInfo().query(vm.pagingInfo).$promise.then((respList) => {
          if (respList && respList.data) {
            setDataAfterGetAPICall(respList, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to set data in grid after data is retrieved from API in loadData() and getDataDown() function */
      const setDataAfterGetAPICall = (respList, isGetDataDown) => {
        if (respList && respList.data && respList.data.woBuildList) {
          if (!isGetDataDown) {
            vm.sourceData = respList.data.woBuildList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (respList.data.woBuildList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(respList.data.woBuildList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = respList.data.Count;
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

      /* to get data on scroll down in grid */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ComponentNicknameWOBuildDetailFactory.getCompNicknameWObuildSummaryInfo().query(vm.pagingInfo).$promise.then((respList) => {
          if (respList && respList.data) {
            setDataAfterGetAPICall(respList, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
