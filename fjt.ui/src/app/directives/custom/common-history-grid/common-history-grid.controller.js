(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('commonHistoryGrid', CommonHistoryGrid);

  /** @ngInject */
  function CommonHistoryGrid(BaseService, CORE, WoDataentryChangeAuditlogFactory, USER, $timeout, $mdDialog, DialogFactory, WORKORDER) {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        id: '=',
        tableName: '=',
        titleName: '=',
        emptyMesssage: '='
      },
      templateUrl: 'app/directives/custom/common-history-grid/common-history-grid.html',
      controller: CommonHistoryController,
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
    function CommonHistoryController($scope) {
      const vm = this;
      vm.id = $scope.id;
      vm.TableName = $scope.tableName;
      vm.title = $scope.titleName;
      vm.isHideDelete = vm.ViewDiffOfChange = true;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.gridConfig = CORE.gridConfig;
      vm.DateTimeFormat = _dateTimeDisplayFormat;
      vm.LabelConstant = CORE.LabelConstant;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.EmptyMesssageObj = {
        imageURL: CORE.COMMON_HISTORY.IMAGEURL,
        message: $scope.emptyMesssage || stringFormat(angular.copy(CORE.COMMON_HISTORY.MESSAGE), vm.title)  // In case we didn't pass Empty state Message then Create from popup header title.
      };

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['id', 'DESC']],
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
        exporterCsvFilename: `${vm.title}.csv`,
        exporterMenuCsv: true,
        enableGrouping: false,
        enableColumnMenus: true,
        allowToExportAllData: true,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return WoDataentryChangeAuditlogFactory.getHistoryDataByTableName().query(pagingInfoOld).$promise.then((History) => {
            if (History && History.status === CORE.ApiResponseTypeStatus.SUCCESS && History.data && History.data.History) {
              return History.data.History;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
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
          exporterSuppressExport: false,
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
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{row.entity.Oldval.length > 45 ? (row.entity.Oldval | htmlToPlaintext | limitTo: 45) + " ..." : row.entity.Oldval | htmlToPlaintext}}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="(row.entity.valueDataType === \'longtext\' || row.entity.valueDataType === \'text\') && row.entity.Oldval && row.entity.Oldval !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescriptionPopup(row.entity,true, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableCellEdit: false,
          width: '320'
        },
        {
          field: 'Newval',
          displayName: 'New Value',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{row.entity.Newval.length > 45 ? (row.entity.Newval | htmlToPlaintext | limitTo: 45) + " ..." : row.entity.Newval | htmlToPlaintext}}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="(row.entity.valueDataType === \'longtext\' || row.entity.valueDataType === \'text\') && row.entity.Newval && row.entity.Newval !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescriptionPopup(row.entity,false, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableCellEdit: false,
          width: '320'
        },
        {
          field: 'updatedAt',
          displayName: 'Modified Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DateTimeFormat}}</div>',
          enableFiltering: false,
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE
        },
        {
          field: 'updatedby',
          displayName: 'Modified By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
        },
        {
          field: 'updatedbyRole',
          displayName: 'Modified By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (data, isGetDataDown) => {
        if (data && data.History) {
          if (!isGetDataDown) {
            vm.sourceData = BaseService.getFormatedHistoryDataList(data.History);
            vm.currentdata = vm.sourceData.length;
          }
          else if (data.History.length > 0) {
            data.History = BaseService.getFormatedHistoryDataList(data.History);
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(data.History);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          vm.totalSourceDataCount = data.Count;
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
              if (vm.isAdvanceSearch) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
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
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata);
            }
          });
        }
      };
      /* retrieve data list*/
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
        vm.pagingInfo.id = vm.id;
        vm.pagingInfo.TableName = vm.TableName;
        vm.cgBusyLoading = WoDataentryChangeAuditlogFactory.getHistoryDataByTableName().query(vm.pagingInfo).$promise.then((History) => {
          if (History && History.data) {
            setDataAfterGetAPICall(History.data, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.pagingInfo.id = vm.id;
        vm.pagingInfo.TableName = vm.TableName;
        vm.cgBusyLoading = WoDataentryChangeAuditlogFactory.getHistoryDataByTableName().query(vm.pagingInfo).$promise.then((History) => {
          if (History && History.data) {
            setDataAfterGetAPICall(History.data, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.resetSourceGrid = () => vm.loadData();

      vm.fab = {
        Status: false
      };

      /* Open popup for display difference. */
      vm.openDifferenceOfChange = (row, ev) => {
        var data = {
          Colname: row.entity.Colname,
          Oldval: row.entity.Oldval,
          Newval: row.entity.Newval
        };

        DialogFactory.dialogService(
          WORKORDER.DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER,
          WORKORDER.DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW,
          ev,
          data).then(() => { }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      /* for display description in popup. */
      vm.showDescriptionPopup = (row, isForOldValue, ev) => {
        const popupData = {};
        if (isForOldValue) {
          popupData.title = 'Old Value';
          popupData.description = row.Oldval;
        } else {
          popupData.title = 'New Value';
          popupData.description = row.Newval;
        }
        showDescription(popupData, ev);
      };

      /* Open description popup */
      const showDescription = (popupData, ev) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* Comment as facing issues(also close background popup) when Common histry popup open from any popup insted of page. */
      //$scope.$on('$destroy', () =>
      //  $mdDialog.hide(false, {
      //    closeAll: true
      //  }));
    }
  }
})();
