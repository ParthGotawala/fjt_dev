(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkorderDataentryChangeAuditLogController', WorkorderDataentryChangeAuditLogController);

  /** @ngInject */
  function WorkorderDataentryChangeAuditLogController(CORE, BaseService, $stateParams, WoDataentryChangeAuditlogFactory,
    $timeout, WORKORDER, DialogFactory, WorkorderFactory, $state, USER) {
    const vm = this;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_DATAENTRY_CHANGE_AUDITLOG;
    vm.ViewDiffOfChange = true;
    vm.isHideDelete = true;
    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    if (!$stateParams.woID) {
      DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.SOMTHING_WRONG, multiple: true });
      $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
      return;
    }
    vm.woID = $stateParams.woID;
    vm.DateFormat = _dateTimeFullTimeDisplayFormat;
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
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    };

    vm.headerdata = [];

    if (vm.woID) {
      /* retreive Work Order Details*/
      vm.cgBusyLoading = WorkorderFactory.workorder().query({ id: vm.woID }).$promise.then((workorder) => {
        if (workorder.data.length > 0) {
          workorder.data = _.first(workorder.data);
          vm.headerdata = [];
          vm.headerdata.push({
            value: (workorder.data.componentAssembly && workorder.data.componentAssembly.PIDCode) ? workorder.data.componentAssembly.PIDCode : null,
            label: CORE.LabelConstant.Assembly.ID,
            displayOrder: (vm.headerdata.length + 1),
            labelLinkFn: vm.goToPartList,
            valueLinkFn: vm.goToPartDetails,
            valueLinkFnParams: { id: workorder.data.partID },
            isCopy: true,
            imgParms: {
              imgPath: (workorder.data.rohs && workorder.data.rohs.name) ? (rohsImagePath + workorder.data.rohs.rohsIcon) : null,
              imgDetail: (workorder.data.rohs.name && workorder.data.rohs.name) ? workorder.data.rohs.name : null
            }
          }, {
            label: vm.WOAllLabelConstant.WO,
            value: angular.copy(workorder.data.woNumber),
            displayOrder: (vm.headerdata.length + 1),
            labelLinkFn: vm.goToWorkorderList,
            valueLinkFn: vm.goToWorkorderDetails
          }, {
            label: vm.WOAllLabelConstant.Version,
            value: angular.copy(workorder.data.woVersion),
            displayOrder: (vm.headerdata.length + 1)
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

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
        field: 'woVersion',
        displayName: 'Changed WO Version',
        enableCellEdit: false,
        width: '120'
      },
      {
        field: 'opVersion',
        displayName: 'Changed OP Version',
        enableCellEdit: false,
        width: '120'
      },
      {
        field: 'opName',
        displayName: 'OP Name',
        enableCellEdit: false,
        width: '250'
      },
      {
        field: 'Colname',
        displayName: 'Attribute',
        enableCellEdit: false,
        width: '220'
      },
      {
        field: 'Oldval',
        displayName: 'Last Value',
        cellTemplate: '<div class="ui-grid-cell-contents"> <span class= "label-box label-colorCode height-90p" style="background-color:{{row.entity.Oldval}}" ng-if="row.entity.valueDataType ==\'Color\'">\
                                                    </span> <span ng-if="row.entity.valueDataType != \'Color\'" >\
                                                    {{row.entity.Oldval.length > 20 ? (row.entity.Oldval | htmlToPlaintext | limitTo: 20) + " ..." : row.entity.Oldval | htmlToPlaintext}}</span></div>',
        enableCellEdit: false,
        width: '190'
      }, {
        field: 'Newval',
        displayName: 'New Value',
        cellTemplate: '<div class="ui-grid-cell-contents"> <span class= "label-box label-colorCode height-90p" style="background-color:{{row.entity.Newval}}" ng-if="row.entity.valueDataType ==\'Color\'">\
                                                    </span> <span ng-if="row.entity.valueDataType != \'Color\'" >\
                                                    {{row.entity.Newval.length > 20 ? (row.entity.Newval | htmlToPlaintext | limitTo: 20) + " ..." : row.entity.Newval | htmlToPlaintext}}</span></div>',
        enableCellEdit: false,
        width: '190'
      }, {
        field: 'ColDescription',
        displayName: 'Description',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableFiltering: true,
        width: '250'
      }, {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DateFormat}}</div>',
        enableCellEdit: false,
        enableFiltering: false,
        type: 'datetime',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE
      }, {
        field: 'UpdatedByUser',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
      }, {
        field: 'updatedbyRole',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        enableCellEdit: false,
        enableFiltering: true
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
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
      exporterCsvFilename: 'Work Order Changes History.csv'
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.workorderAuditLogList) {
        if (!isGetDataDown) {
          vm.sourceData = response.data.workorderAuditLogList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.workorderAuditLogList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.workorderAuditLogList);
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
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    };

    /* retrieve work-order changes history list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      createFilterExp();
      vm.pagingInfo.woID = vm.woID ? vm.woID : null;
      vm.cgBusyLoading = WoDataentryChangeAuditlogFactory.getWoDataentryChangeAuditlog().query(vm.pagingInfo).$promise.then((workorderChangeHistory) => {
        if (workorderChangeHistory && workorderChangeHistory.data) {
          setDataAfterGetAPICall(workorderChangeHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WoDataentryChangeAuditlogFactory.getWoDataentryChangeAuditlog().query(vm.pagingInfo).$promise.then((workorderChangeHistory) => {
        if (workorderChangeHistory && workorderChangeHistory.data) {
          setDataAfterGetAPICall(workorderChangeHistory, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Open popup for display difference of entry change */
    vm.openDifferenceOfChange = (row, $event) => {
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
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    /* Adanced Search */
    let advanceSearch = null;
    vm.isAdvanceSearch = false;
    vm.openAdvancedSearch = (ev) => {
      var data = {
        woID: $stateParams.woID,
        advanceSearch: advanceSearch
      };
      DialogFactory.dialogService(
        WORKORDER.AUDITLOG_ADVANCED_SEARCH_POPUP_CONTROLLER,
        WORKORDER.AUDITLOG_ADVANCED_SEARCH_POPUP_VIEW,
        ev,
        data).then((response) => {
          advanceSearch = response;
          vm.isAdvanceSearch = true;
          vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
          vm.loadData();
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.clearFilter = () => {
      vm.isAdvanceSearch = false;
      advanceSearch = null;
      if (!vm.gridOptions.enablePaging) {
        initPageInfo();
      }
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    function createFilterExp() {
      if (advanceSearch) {
        vm.pagingInfo.woOPID = null;
        vm.pagingInfo.fromVersion = null;
        vm.pagingInfo.toVersion = null;

        if (advanceSearch.woOPID) {
          vm.pagingInfo.woOPID = advanceSearch.woOPID;
          vm.pagingInfo.fromVersion = advanceSearch.fromOPVersion;
          vm.pagingInfo.toVersion = advanceSearch.toOPVersion;
        }
        else {
          vm.pagingInfo.fromVersion = advanceSearch.fromWOVersion;
          vm.pagingInfo.toVersion = advanceSearch.toWOVersion;
        }
      }
      // if (advanceSearch) {
      //   if (advanceSearch.woOPID) {
      //     vm.pagingInfo.woOPID = advanceSearch.woOPID;
      //     vm.pagingInfo.fromVersion = advanceSearch.fromOPVersion;
      //     vm.pagingInfo.toVersion = advanceSearch.toOPVersion;
      //   }
      //   else {
      //     vm.pagingInfo.woOPID = null;
      //     vm.pagingInfo.fromVersion = advanceSearch.fromWOVersion;
      //     vm.pagingInfo.toVersion = advanceSearch.toWOVersion;
      //   }
      // } else {
      //   vm.pagingInfo.woOPID = null;
      //   vm.pagingInfo.fromVersion = null;
      //   vm.pagingInfo.toVersion = null;
      // }
    }
    vm.goBack = () => {
      $state.go(WORKORDER.WORKORDER_WORKORDERS_STATE);
    };
    /* Ends */
  }
})();
