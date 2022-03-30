(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('componentChangeHistory', ComponentChangeHistory);

  /** @ngInject */
  function ComponentChangeHistory(BaseService, CORE, ComponentFactory, USER, $timeout, $mdDialog, WORKORDER, DialogFactory) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        partId: '='
      },
      templateUrl: 'app/directives/custom/component-history/component-history.html',
      controller: ComponentChangeHistoryController,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Component History
    * @param
    */
    function ComponentChangeHistoryController($scope) {
      const vm = this;
      vm.isHideDelete = true;
      vm.ViewDiffOfChange = true
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.entityName = CORE.AllEntityIDS.Assembly.Name;
      vm.gridConfig = CORE.gridConfig;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMMENTS;
      vm.ComponentHistoryModel = {};
      vm.coid = $scope.partId ? $scope.partId : null;
      vm.DateTimeFormat = _dateTimeDisplayFormat;
      vm.setScrollClass = 'gridScrollHeight_Component';
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),

          SortColumns: [['updatedAt', 'DESC']],
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
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: 'Part History.csv',
        exporterMenuCsv: true,
        enableGrouping: false,
        enableColumnMenus: true
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '85',
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
          enableSorting: false
        }, {
          field: 'Colname',
          displayName: 'Field Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '350'
        },
        {
          field: 'Oldval',
          displayName: 'Old Value',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '250'
        },
        {
          field: 'Newval',
          displayName: 'New Value',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '250'
        },
        {
          field: 'createdAtValue',
          displayName: 'Modified Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: false,
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE
        },
        {
          field: 'ModifiedUser',
          displayName: 'Modified By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
        },
        {
          field: 'updatedbyRoleValue',
          displayName: 'Modified By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];
      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (componentHistory, isGetDataDown) => {
        if (componentHistory && componentHistory.data && componentHistory.data.componentHistory) {
          if (!isGetDataDown) {            
            vm.sourceData = BaseService.getFormatedHistoryDataList(componentHistory.data.componentHistory);
            vm.currentdata = vm.sourceData.length;
          }
          else if (componentHistory.data.componentHistory.length > 0) {
            componentHistory.data.componentHistory = BaseService.getFormatedHistoryDataList(componentHistory.data.componentHistory);
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(componentHistory.data.componentHistory);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          vm.componentCreatedInfo = _.first(componentHistory.data.componentCreatedInfo);
          if (vm.componentCreatedInfo && vm.componentCreatedInfo.mfgType) {
            vm.gridOptions.exporterCsvFilename = ((vm.componentCreatedInfo.mfgType === CORE.MFG_TYPE.MFG) ? 'Manufacturer' : 'Supplier') + ' Part History.csv';
          }
          // must set after new data comes
          vm.totalSourceDataCount = componentHistory.data.Count;
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
              vm.emptyState = 0;
            }
            else {
              vm.emptyState = 0;
            }
          }
          else {
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
      /* retrieve data list*/
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.pagingInfo.id = vm.coid ? vm.coid : null;
        vm.cgBusyLoading = ComponentFactory.getComponentHistory().query(vm.pagingInfo).$promise.then((componentHistory) => {
          if (componentHistory && componentHistory.data) {
            setDataAfterGetAPICall(componentHistory, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.pagingInfo.id = vm.coid ? vm.coid : null;
        vm.cgBusyLoading = ComponentFactory.getComponentHistory().query(vm.pagingInfo).$promise.then((componentHistory) => {
          if (componentHistory && componentHistory.data) {
            setDataAfterGetAPICall(componentHistory, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.openDifferenceOfChange = (row, ev) => {
        var data = {
          Colname: row.entity.Colname,
          Oldval: row.entity.Oldval,
          Newval: row.entity.Newval,
          Tablename: row.entity.Tablename,
          RefTransID: row.entity.RefTransID
        };

        DialogFactory.dialogService(
          WORKORDER.DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER,
          WORKORDER.DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW,
          ev,
          data).then(() => 1, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      vm.fab = {
        Status: false
      };

      $scope.$on('$destroy', () =>
        $mdDialog.hide(false, {
          closeAll: true
        }));
    }
  }
})();
