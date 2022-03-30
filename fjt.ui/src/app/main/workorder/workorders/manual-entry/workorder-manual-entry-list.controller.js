(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkordersManualEntryListController', WorkordersManualEntryListController);

  /** @ngInject */
  function WorkordersManualEntryListController($stateParams, $timeout, $state, CORE, WORKORDER, $q,
    WorkorderTransFactory, DialogFactory, BaseService, $rootScope, WorkorderFactory, USER) {
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_MANUAL_ENTRY_LIST;
    vm.woID = $stateParams.woID;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.id);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
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

    vm.headerdata = [];
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    /* get work order status - text */
    const getWoStatus = (statusID) => {
      vm.woStatusText = BaseService.getWoStatus(statusID);
    };
    /* get work order status related css class */
    const getWoStatusClassName = (statusID) => {
      vm.woStatusClassName = BaseService.getWoStatusClassName(statusID);
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '75',
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
        field: 'opFullNameOfWoOp',
        displayName: 'Work Order Operation',
        width: '270'
      },
      {
        field: 'checkInEmployeeFullName',
        displayName: 'Personnel',
        width: '200'
      },
      {
        field: 'checkinTime',
        displayName: 'Start Date Time',
        enableCellEdit: false,
        enableFiltering: false,
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.checkinTime | date:grid.appScope.$parent.vm.DateTimeFormat}}</div>',
        width: '180',
        type: 'datetime'
      },
      {
        field: 'checkoutSetupTime',
        displayName: 'In-Process Setup Time',
        enableCellEdit: false,
        enableFiltering: false,
        width: '150'
      },
      {
        field: 'checkoutTime',
        displayName: 'Stop Date Time',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.checkoutTime | date:grid.appScope.$parent.vm.DateTimeFormat}}</div>',
        enableCellEdit: false,
        enableFiltering: false,
        width: '180',
        type: 'datetime'
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['woTransID', 'DESC']],
        SearchColumns: [],
        woID: vm.woID
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Work Order Process.csv'
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (workordertrans, isGetDataDown) => {
      if (workordertrans && workordertrans.data && workordertrans.data.workordertrans) {
        if (!isGetDataDown) {
          vm.sourceData = workordertrans.data.workordertrans;
          vm.currentdata = vm.sourceData.length;
        }
        else if (workordertrans.data.workordertrans.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workordertrans.data.workordertrans);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = workordertrans.data.Count;
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

    /* retrieve work order manual entry list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = WorkorderTransFactory.retrieveWorkorderTransList().query(vm.pagingInfo).$promise.then((res) => {
        if (res && res.data && res.data.workordertrans) {
          formatGridData(res.data.workordertrans);
          setDataAfterGetAPICall(res, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      //vm.pagingInfo.SearchColumns.push(searchColumn);
      vm.cgBusyLoading = WorkorderTransFactory.retrieveWorkorderTransList().query(vm.pagingInfo).$promise.then((res) => {
        if (res && res.data && res.data.workordertrans) {
          formatGridData(res.data.workordertrans);
          setDataAfterGetAPICall(res, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const formatGridData = (dataList) => {
      _.each(dataList, (item) => {
        item.checkoutSetupTime = secondsToTime(item.checkoutSetupTime);
        item.isDisabledUpdate = item.isDisabledDelete = (vm.isDisabledAddManualEntry || item.woentrytype !== CORE.WorkorderEntryType.Manual);
        item.isRowSelectable = !item.isDisabledUpdate;
      });
    };
    /* get work order details */
    const getWorkorderDetails = () => WorkorderFactory.workorder().query({ id: vm.woID }).$promise.then((response) => {
      vm.headerdata = [];
      vm.workOrder = (response && response.data) ? _.first(response.data) : null;
      getWoStatus(vm.workOrder.woSubStatus);
      getWoStatusClassName(vm.workOrder.woSubStatus);
      if (vm.workOrder.woStatus === CORE.WOSTATUS.COMPLETED || vm.workOrder.woStatus === CORE.WOSTATUS.VOID || vm.workOrder.woStatus === CORE.WOSTATUS.TERMINATED) {
        vm.isDisabledAddManualEntry = true;
      }

      vm.headerdata.push({
        value: (vm.workOrder.componentAssembly && vm.workOrder.componentAssembly.PIDCode) ? vm.workOrder.componentAssembly.PIDCode : null,
        label: CORE.LabelConstant.Assembly.ID,
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetails,
        valueLinkFnParams: { id: vm.workOrder.partID },
        isCopy: true,
        imgParms: {
          imgPath: (vm.workOrder.rohs && vm.workOrder.rohs.rohsIcon) ? (rohsImagePath + vm.workOrder.rohs.rohsIcon) : null,
          imgDetail: (vm.workOrder.rohs && vm.workOrder.rohs.name) ? vm.workOrder.rohs.name : null
        }
      }, {
        label: vm.WOAllLabelConstant.WO,
        value: angular.copy(vm.workOrder.woNumber),
        displayOrder: (vm.headerdata.length + 1),
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      }, {
        label: vm.WOAllLabelConstant.Version,
        value: angular.copy(vm.workOrder.woVersion),
        displayOrder: (vm.headerdata.length + 1)
      });
    }).catch((error) => BaseService.getErrorLog(error));

    const pageInitPromise = [getWorkorderDetails()];
    vm.cgBusyLoading = $q.all(pageInitPromise).then(() => {
      vm.isWODataExists = true;
    }).catch((error) => BaseService.getErrorLog(error));

    vm.fab = {
      Status: false
    };

    // add new manual entry of work order tran
    vm.addRecord = () => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isDisabledAddManualEntry) {
        return;
      }
      $state.go(WORKORDER.WO_MANAGE_MANUAL_ENTRY_STATE, { woID: vm.woID });
    };

    // update manual entry of work order tran
    vm.updateRecord = (row) => {
      $state.go(WORKORDER.WO_MANAGE_MANUAL_ENTRY_STATE, { woID: row.entity.woID, woTransID: row.entity.woTransID });
    };


    // delete manual entry of work order tran
    vm.deleteRecord = (workOrdertrans) => {
      let selectedIDs = [];
      if (workOrdertrans) {
        selectedIDs.push(workOrdertrans.woTransID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((workOrdertransItem) => workOrdertransItem.woTransID);
        }
      }

      if (selectedIDs) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Work Order Manual Entry'),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, 'work order manual entry'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = WorkorderTransFactory.workorder_trans().delete({
              woTransID: selectedIDs
            }).$promise.then(() => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              vm.loadData();
              vm.gridOptions.clearSelectedRows();
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'work order'),
          multiple: true
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.goBack = () => {
      $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
    };
  }
})();
