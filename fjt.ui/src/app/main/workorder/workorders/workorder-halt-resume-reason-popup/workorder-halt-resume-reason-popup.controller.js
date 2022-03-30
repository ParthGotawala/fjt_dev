(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderHaltResumeReasonPopupController', WorkorderHaltResumeReasonPopupController);

  /** @ngInject */
  function WorkorderHaltResumeReasonPopupController($timeout, $state, $mdDialog, WORKORDER, CORE, data, BaseService,
    WorkorderTransHoldUnholdFactory, DialogFactory) {
    const vm = this;
    vm.holdResumehistoryData = data;
    vm.woNumber = data.woNumber;
    vm.woVersion = data.woVersion;
    vm.woID = data.woID;
    vm.isHideDelete = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.state = $state.current.name;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_TRANS_HOLD_UNHOLD;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.HaltTypeGridHeaderDropdown = CORE.HaltTypeGridHeaderDropdown;
    vm.HaltResumeTypeValueGridHeaderDropdown = CORE.HaltResumeTypeValueGridHeaderDropdown;
    vm.DateFormat = _dateTimeFullTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.isCheckAll = false;
    vm.isCheckWO = true;
    vm.isWorkorder = true;
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
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    };
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.holdResumehistoryData.partID);
      return false;
    };

    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    /* display work order sales order all details while click on that link*/
    vm.showSalesOrderDetails = () => {
      const data = {
        poNumber: vm.holdResumehistoryData.poNumber,
        salesOrderNumber: vm.holdResumehistoryData.salesOrderNumber,
        soPOQty: vm.holdResumehistoryData.soPOQty,
        soMRPQty: vm.holdResumehistoryData.soMRPQty,
        lineID: vm.holdResumehistoryData.lineID,
        salesOrderMstIDs: vm.holdResumehistoryData.salesOrderMstIDs,
        SOPOQtyValues: vm.holdResumehistoryData.SOPOQtyValues
      };
      const _dummyEvent = null;
      DialogFactory.dialogService(
        CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
        CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
        _dummyEvent,
        data).then(() => {
        }, (() => {
        }), (error) => BaseService.getErrorLog(error));
    };

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.woNumber,
        displayOrder: 1, labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      },
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.holdResumehistoryData.poNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.showSalesOrderDetails
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.holdResumehistoryData.salesOrderNumber,
        displayOrder: 3,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.showSalesOrderDetails
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.holdResumehistoryData.PIDCode,
        displayOrder: 4,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.holdResumehistoryData.rohsIcon,
          imgDetail: vm.holdResumehistoryData.rohsName
        }
      }];
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '80',
        cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
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
        field: 'haltTypeText',
        displayName: 'Halt Type',
        width: 175,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;"> {{row.entity.haltTypeText}}\
                                    <md-tooltip md-direction="top" ng-if="row.entity.haltTypeText" class="tooltip-multiline">\
                                    {{row.entity.haltTypeText}}\
                                    </md-tooltip>\
                                    </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" \
                            ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.HaltResumeTypeValueGridHeaderDropdown
        }
      },
      {
        field: 'OperationName',
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
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        //cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.haltDate | date:grid.appScope.$parent.vm.DateFormat}}</div>',
        width: 180,
        enableFiltering: false,
        type: 'datetime'
      },
      {
        field: 'holdEmployeeName',
        displayName: 'Halted By',
        width: 180
      },
      {
        field: 'resumeReason',
        displayName: 'Resumed Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">{{COL_FIELD}}\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
        width: 200
      },
      {
        field: 'convertedResumeDate',
        displayName: 'Resumed Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 180,
        enableFiltering: false,
        type: 'datetime'
      },
      {
        field: 'unHoldEmployeeName',
        displayName: 'Resumed By',
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
      exporterCsvFilename: 'Halt_Resume History.csv'
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setGridOptionsAfterGetData = (workorderHaltResumeList, isGetDataDown) => {
      if (workorderHaltResumeList && workorderHaltResumeList.data && workorderHaltResumeList.data.workorderHaltResumeList) {
        if (!isGetDataDown) {
          vm.sourceData = workorderHaltResumeList.data.workorderHaltResumeList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (workorderHaltResumeList.data.workorderHaltResumeList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workorderHaltResumeList.data.workorderHaltResumeList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = workorderHaltResumeList.data.Count;
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

    /* retrieve work order serials list */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.woID = vm.woID ? vm.woID : null;
      vm.cgBusyLoading = WorkorderTransHoldUnholdFactory.workorder_trans_hold_unhold().query(vm.pagingInfo).$promise.then((responseData) => {
        if (responseData && responseData.data) {
          setGridOptionsAfterGetData(responseData, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderTransHoldUnholdFactory.workorder_trans_hold_unhold().query(vm.pagingInfo).$promise.then((responseData) => {
        if (responseData && responseData.data) {
          setGridOptionsAfterGetData(responseData, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // open popup to display notification with receivers
    vm.ShowNotificationAckPopup = (row, ev) => {
      if (row && row.haltTypeVal) {
        const data = {
          entityForHaltResume: row.haltTypeVal,
          haltTypeText: row.haltTypeText,
          woOPID: row.woOPID,
          OperationName: row.OperationName,
          reason: row.reason,
          convertedHaltDate: row.convertedHaltDate,
          holdEmployeeName: row.holdEmployeeName,
          resumeReason: row.resumeReason,
          convertedResumeDate: row.convertedResumeDate,
          unHoldEmployeeName: row.unHoldEmployeeName,
          woID: vm.woID,
          woNumber: vm.woNumber,
          woVersion: vm.woVersion,
          PIDCode: vm.holdResumehistoryData.PIDCode,
          rohsIcon: vm.holdResumehistoryData.rohsIcon,
          rohsName: vm.holdResumehistoryData.rohsName,
          partID: vm.holdResumehistoryData.partID,
          poNumber: vm.holdResumehistoryData.poNumber,
          salesOrderNumber: vm.holdResumehistoryData.salesOrderNumber,
          soPOQty: vm.holdResumehistoryData.soPOQty,
          soMRPQty: vm.holdResumehistoryData.soMRPQty,
          lineID: vm.holdResumehistoryData.lineID,
          salesOrderMstIDs: vm.holdResumehistoryData.salesOrderMstIDs,
          SOPOQtyValues: vm.holdResumehistoryData.SOPOQtyValues,
          refTransID: row.tablePKID // woTransHoldUnholdId || woTransOpHoldUnholdId || id
        };
        const HaltResumeFilterTypes = _.keyBy(vm.HaltTypeGridHeaderDropdown, 'id');
        switch (row.haltTypeVal) {
          case HaltResumeFilterTypes[0].id:  // work order
            data.refTableName = CORE.DBTableName.WorkorderTransHoldUnhold;
            data.notificationCategoryForHalt = CORE.NOTIFICATION_MESSAGETYPE.WO_STOP.TYPE;
            data.notificationCategoryForResume = CORE.NOTIFICATION_MESSAGETYPE.WO_START.TYPE;
            break;
          case HaltResumeFilterTypes[1].id:  // work order operation
            data.refTableName = CORE.DBTableName.WorkorderTransOperationHoldUnhold;
            data.notificationCategoryForHalt = CORE.NOTIFICATION_MESSAGETYPE.WO_OP_HOLD.TYPE;
            data.notificationCategoryForResume = CORE.NOTIFICATION_MESSAGETYPE.WO_OP_UNHOLD.TYPE;
            break;
          case HaltResumeFilterTypes.PO.id:  // PO/SO
            data.refTableName = CORE.DBTableName.HoldUnholdTrans;
            data.notificationCategoryForHalt = CORE.NOTIFICATION_MESSAGETYPE.PO_STOP.TYPE;
            data.notificationCategoryForResume = CORE.NOTIFICATION_MESSAGETYPE.PO_START.TYPE;
            break;
          case HaltResumeFilterTypes.KA.id:  // Kit Allocation
            data.refTableName = CORE.DBTableName.HoldUnholdTrans;
            data.notificationCategoryForHalt = CORE.NOTIFICATION_MESSAGETYPE.KIT_ALLOCATION_STOP.TYPE;
            data.notificationCategoryForResume = CORE.NOTIFICATION_MESSAGETYPE.KIT_ALLOCATION_START.TYPE;
            break;
          case HaltResumeFilterTypes.KR.id:  // Kit Release
            data.refTableName = CORE.DBTableName.HoldUnholdTrans;
            data.notificationCategoryForHalt = CORE.NOTIFICATION_MESSAGETYPE.KIT_RELEASE_STOP.TYPE;
            data.notificationCategoryForResume = CORE.NOTIFICATION_MESSAGETYPE.KIT_RELEASE_START.TYPE;
            break;
        }

        if (data.refTableName && data.refTransID) {
          DialogFactory.dialogService(
            WORKORDER.VIEW_WO_HALT_RESUME_NOTIFICATION_CONTROLLER,
            WORKORDER.VIEW_WO_HALT_RESUME_NOTIFICATION_VIEW,
            ev,
            data).then(() => {
            }, (err) => BaseService.getErrorLog(err));
        }
      }
    };
    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
  }
})();
