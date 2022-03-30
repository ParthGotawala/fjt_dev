(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('ViewWOHaltOperationPopupController', ViewWOHaltOperationPopupController);

  /** @ngInject */
  function ViewWOHaltOperationPopupController($timeout, $mdDialog, WORKORDER, CORE, data, BaseService, WorkorderTransOperationHoldUnholdFactory, DialogFactory) {
    const vm = this;
    vm.woData = data;
    vm.isHideDelete = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_TRANS_HOLD_UNHOLD;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.gridConfig = CORE.gridConfig;
    vm.isShowNotificationAck = true;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woData.woID);
      return false;
    };
    // go to assembly details page
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.woData.partID);
      return false;
    };
    // go to assy list page
    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.woData.woNumber,
        displayOrder: 1, labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.woData.PIDCode,
        displayOrder: 2,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.woData.rohsIcon,
          imgDetail: vm.woData.rohsName
        }
      }];
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
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
        enableSorting: false
      },
      {
        field: 'opFullName',
        displayName: 'Operation Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">{{COL_FIELD}}\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
        width: 250
      },
      {
        field: 'reason',
        displayName: 'Halted Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">{{COL_FIELD}}\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
        width: 200
      },
      {
        field: 'convertedHaltDate',
        displayName: 'Halted Date',
        width: 180,
        enableFiltering: false
      },
      {
        field: 'holdEmployeeName',
        displayName: 'Halted By',
        width: 180
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        isWorkorder: true
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
      exporterCsvFilename: 'Halt_Operations_Details.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.haltOPList) {
        if (!isGetDataDown) {
          vm.sourceData = response.data.haltOPList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.haltOPList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.haltOPList);
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

    /* retrieve work order halt operation list */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.woID = vm.woData.woID ? vm.woData.woID : null;
      vm.cgBusyLoading = WorkorderTransOperationHoldUnholdFactory.getWOHaltOperationsDet().query(vm.pagingInfo).$promise.then((resp) => {
        if (resp && resp.data) {
          setDataAfterGetAPICall(resp, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderTransOperationHoldUnholdFactory.getWOHaltOperationsDet().query(vm.pagingInfo).$promise.then((resp) => {
        if (resp && resp.data) {
          setDataAfterGetAPICall(resp, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // open pop-up to display notification with receivers
    vm.ShowNotificationAckPopup = (row, ev) => {
      const data = {
        haltTypeText: row.haltTypeText,
        OperationName: row.opFullName,
        reason: row.reason,
        convertedHaltDate: row.convertedHaltDate,
        holdEmployeeName: row.holdEmployeeName,
        woID: vm.woData.woID,
        woNumber: vm.woData.woNumber,
        woVersion: vm.woData.woVersion,
        PIDCode: vm.woData.PIDCode,
        rohsIcon: vm.woData.rohsIcon,
        rohsName: vm.woData.rohsName,
        partID: vm.woData.partID,
        refTableName: CORE.DBTableName.WorkorderTransOperationHoldUnhold,
        refTransID: row.woTransOpHoldUnholdId,
        notificationCategoryForHalt: CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE,
        woOPID: row.woOPID
      };

      if (data.refTableName && data.refTransID) {
        DialogFactory.dialogService(
          WORKORDER.VIEW_WO_HALT_RESUME_NOTIFICATION_CONTROLLER,
          WORKORDER.VIEW_WO_HALT_RESUME_NOTIFICATION_VIEW,
          ev,
          data).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
  }
})();
