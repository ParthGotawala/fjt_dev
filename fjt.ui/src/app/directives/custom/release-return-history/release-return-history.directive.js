(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('releaseReturnHistory', releaseReturnHistory);

  /** @ngInject */
  function releaseReturnHistory(BaseService, CORE, DialogFactory, TRANSACTION, KitAllocationFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        salesOrderDetId: '=?',
        refAssyId: '=?'
      },
      templateUrl: 'app/directives/custom/release-return-history/release-return-history.html',
      controller: releaseReturnHistoryCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of User Agreement
    *
    * @param
    */
    function releaseReturnHistoryCtrl($scope, $timeout) {
      var vm = this;
      vm.salesOrderDetId = $scope.salesOrderDetId;
      vm.refAssyId = $scope.refAssyId;
      vm.isHideDelete = true;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KITRELEASERETURNHISTORY;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.loginUser = BaseService.loginUser;
      vm.userID = vm.loginUser.identityUserId;
      vm.Kit_Release_Status = TRANSACTION.KIT_RELEASE_STATUS;
      vm.KIT_RETURN_STATUS = TRANSACTION.KIT_RETURN_STATUS;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      /* to display comments */
      vm.showPartDescription = (row, ev) => {
        const popupData = {
          title: vm.LabelConstant.SalesOrder.ReleasedComment,
          description: row.entity.releasedNote
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'releaseStatusValue',
          displayName: vm.LabelConstant.SalesOrder.KitReleasedStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.releaseStatusValue == grid.appScope.$parent.vm.Kit_Release_Status.P.name, \'label-success\' :row.entity.releaseStatusValue == grid.appScope.$parent.vm.Kit_Release_Status.R.name }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 150,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'returnStatusValue',
          displayName: vm.LabelConstant.SalesOrder.KitReturnedStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-primary-gray\':row.entity.returnStatusValue == grid.appScope.$parent.vm.KIT_RETURN_STATUS.NA.name, \'label-warning\': row.entity.returnStatusValue == grid.appScope.$parent.vm.KIT_RETURN_STATUS.NR.name ,\'label-info\' :row.entity.returnStatusValue == grid.appScope.$parent.vm.KIT_RETURN_STATUS.PR.name, \'label-success\' :row.entity.returnStatusValue == grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name,\'light-green-bg\' :row.entity.returnStatusValue == grid.appScope.$parent.vm.KIT_RETURN_STATUS.RR.name, \'label-primary\' :row.entity.returnStatusValue == grid.appScope.$parent.vm.KIT_RETURN_STATUS.RS.name }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 180,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'plannKitNumber',
          displayName: vm.LabelConstant.SalesOrder.PlannKit,
          cellTemplate: '<div class="ui-grid-cell-contents text-right"> {{COL_FIELD}} </div>',
          width: 120
        }, {
          field: 'releaseKitNumber',
          displayName: vm.LabelConstant.SalesOrder.ReleaseKitNumber,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}} </div>',
          width: '180'
        }, {
          field: 'releaseDate',
          displayName: vm.LabelConstant.SalesOrder.ActualKitReleaseDate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'releasedBy',
          displayName: vm.LabelConstant.SalesOrder.ReleaseBy,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}} </div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
        }, {
          field: 'woNumber',
          displayName: vm.LabelConstant.Workorder.WO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> {{COL_FIELD}} </div>',
          width: 150
        }, {
          field: 'releasedNote',
          width: 200,
          displayName: vm.LabelConstant.SalesOrder.ReleasedComment,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releasedNote && row.entity.releasedNote !== \'-\'" ng-click="grid.appScope.$parent.vm.showPartDescription(row, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          enableFiltering: true,
          enableSorting: true
        }, {
          field: 'returnDate',
          displayName: vm.LabelConstant.SalesOrder.KitReturnedDate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }, {
          field: 'returnBy',
          displayName: vm.LabelConstant.SalesOrder.ReturnBy,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
        }];

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
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: stringFormat('{0}.csv', CORE.PAGENAME_CONSTANT[65].PageName),
        CurrentPage: CORE.PAGENAME_CONSTANT[65].PageName,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          pagingInfoOld.salesOrderDetID = vm.salesOrderDetId;
          pagingInfoOld.refAssyId = vm.refAssyId;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return KitAllocationFactory.getReleaseReturnHistoryList().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.responseList) {
              setDataAfterGate(response.data.responseList, true);
              return response.data.responseList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      function setDataAfterGetAPICall(response, isGetDataDown) {
        if (response && response.data.responseList) {
          if (!isGetDataDown) {
            vm.sourceData = response.data.responseList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.responseList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.responseList);
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

      /* retrieve Template list */
      vm.loadData = () => {
        vm.pagingInfo.salesOrderDetID = vm.salesOrderDetId;
        vm.pagingInfo.refAssyId = vm.refAssyId;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = KitAllocationFactory.getReleaseReturnHistoryList().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = KitAllocationFactory.getReleaseReturnHistoryList().query(vm.pagingInfo).$promise.then((response) => {
          if (response) { setDataAfterGetAPICall(response, true); }
        }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
