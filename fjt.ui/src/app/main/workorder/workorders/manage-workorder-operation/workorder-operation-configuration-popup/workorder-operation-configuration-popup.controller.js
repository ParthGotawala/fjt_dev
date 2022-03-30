(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('WorkOrderOperationConfigurationController', WorkOrderOperationConfigurationController);

  /** @ngInject */
  function WorkOrderOperationConfigurationController($mdDialog, $timeout, data, CORE, USER, WORKORDER, BaseService, WorkorderOperationFactory, DialogFactory) {
    const vm = this;

    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.OPERATION;
    vm.setScrollClass = 'gridScrollHeight_Unit';
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    // vm.OperationCleaningTypeFilter = CORE.OperationCleaningTypeFilter;
    vm.OperationStatusGridHeaderDropdown = CORE.OperationStatusGridHeaderDropdown;
    vm.isHideDelete = true;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.getOpStatusClassName = (statusID) => BaseService.getOpStatusClassName(statusID);
    vm.fluxTypeDropDown = CORE.FluxTypeDropDown;
    vm.KeywordWithNAGridHeaderDropDown = CORE.KeywordWithNAGridHeaderDropDown;

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        pinnedLeft: true
      }, {
        field: 'opFullName',
        displayName: vm.LabelConstant.Operation.OP,
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<a tabindex="-1" class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.goToWorkorderOperationDetails(row.entity.woOPID);">'
          + '{{COL_FIELD}}'
          + '</a>'
          + '</div>',
        width: 250,
        pinnedLeft: true
      }, {
        field: 'shortDescription',
        displayName: 'Short Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shortDescription && row.entity.shortDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        enableFiltering: false,
        width: '300'
      }, {
        field: 'opStatusConvertedValue',
        displayName: vm.LabelConstant.Operation.Status,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getOpStatusClassName(row.entity.opStatus)">'
          + '{{COL_FIELD}}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.OperationStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      }, {
        field: 'operationType',
        displayName: vm.LabelConstant.Operation.OperationType,
        width: 250
      }, {
        field: 'qtyControlConvertedValue',
        displayName: 'Qty Tracking Required',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"> \
                       <span class="label-box" ng-class="{\'label-success\':row.entity.qtyControl == true, \'label-warning\':row.entity.qtyControl == false}">{{ COL_FIELD }} \
                        </span> \
                          </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      }, {
        field: 'isReworkConvertedValue',
        displayName: 'Rework Operation',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"> <span class="label-box" ng-class="{\'label-success\':row.entity.isRework == true, \'label-warning\':row.entity.isRework == false}"> {{ COL_FIELD }} </span> </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 100
      }, {
        field: 'isIssueQtyConvertedValue',
        displayName: 'Issue Qty Required',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="{\'label-success\':row.entity.isIssueQty == true, \'label-warning\':row.entity.isIssueQty == false}"> {{ COL_FIELD }} </span> </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 100
      },
      {
        field: 'isTrackBySerialNoConvertedValue',
        displayName: 'Track Serial# In Operation',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box"  ng-class="{\'label-success\':row.entity.isTrackBySerialNo == true, \'label-warning\':row.entity.isTrackBySerialNo == false}"> {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 150
      }, {
        field: 'isAllowFinalSerialMappingConvertedValue',
        displayName: 'Serial# Mapping',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="{\'label-success\':row.entity.isAllowFinalSerialMapping == true, \'label-warning\':row.entity.isAllowFinalSerialMapping == false}"> {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 130
      },
      {
        field: 'isPlacementTrackingConvertedValue',
        displayName: vm.LabelConstant.Operation.BasicPlacementTracking,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
          ng-class="{\'label-success\':row.entity.isPlacementTracking == true, \
          \'label-warning\':row.entity.isPlacementTracking == false}"> \
          {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 200
      }, {
        field: 'isLoopOperationConvertedValue',
        displayName: 'Loop Operation',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                ng-class="{\'label-success\':row.entity.isLoopOperation == true, \
                \'label-warning\':row.entity.isLoopOperation == false}"> \
                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 100
      }, {
        field: 'loopToOperationName',
        displayName: 'Loop to Operation Name',
        width: 250
      }, {
        field: 'isPreProgrammingComponentConvertedValue',
        displayName: 'Part Pre-Programming Required',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                  ng-class="{\'label-success\':row.entity.isPreProgrammingComponent == true, \
                  \'label-warning\':row.entity.isPreProgrammingComponent == false}"> \
                  {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 200
      }, {
        field: 'isMoveToStockConvertedValue',
        displayName: 'Last Operation',
        headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
        '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
        '<div class="ui-grid-cell-contents" col-index="renderIndex">Last Operation<span class="icon-question-mark-circle help-icon">\
                          <md-tooltip md-direction="top">{{grid.appScope.$parent.vm.LabelConstant.Operation.LastOperationAndMoveToStock}}</md-tooltip></span>' +
        '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
        '&nbsp;' +
        '</span>' +
        '</div>' +
        '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
        '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
        '</div>' +
        '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>' +
        '</div>',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                  ng-class="{\'label-success\':row.entity.isMoveToStock == true, \
                  \'label-warning\':row.entity.isMoveToStock == false}"> \
                    {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 100
      }, {
        field: 'isTeamOperationConvertedValue',
        displayName: 'Team Operation',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
            ng-class="{\'label-success\':row.entity.isTeamOperation == true, \
            \'label-warning\':row.entity.isTeamOperation == false}"> \
            {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 100
      },
      {
        field: 'isAllowMissingPartQtyConvertedValue',
        displayName: vm.LabelConstant.Operation.AllowMissingPartQty,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isAllowMissingPartQty == true, \
                            \'label-warning\':row.entity.isAllowMissingPartQty == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        width: 275
      },
      {
        field: 'isAllowBypassQtyConvertedValue',
        displayName: vm.LabelConstant.Operation.AllowByPassQty,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box"  \
                            ng-class="{\'label-success\':row.entity.isAllowBypassQty == true, \
                            \'label-warning\':row.entity.isAllowBypassQty == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        width: 250
      },
      {
        field: 'isEnablePreProgrammingPartConvertedValue',
        displayName: vm.LabelConstant.Operation.EnablePreProgrammingPart,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isEnablePreProgrammingPart == true, \
                            \'label-warning\':row.entity.isEnablePreProgrammingPart == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        width: 170
      },
      {
        field: 'fluxType',
        displayName: 'Flux Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          ' {{ row.entity.fluxTypeConvertedValue }} </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.fluxTypeDropDown
        },
        ColumnDataType: 'StringEquals',
        width: 150
      },
      {
        field: 'isRequireMachineVerification',
        displayName: vm.LabelConstant.Operation.IsRequireMachineVerification,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" ng-class="{\'label-success\':row.entity.isRequireMachineVerification == \'YES\', ' +
          '\'label-warning\':row.entity.isRequireMachineVerification == \'NO\', ' +
          '\'label-info\':row.entity.isRequireMachineVerification == \'NA\'}">' +
          ' {{ row.entity.isRequireMachineVerificationConvertedValue }} </span> </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordWithNAGridHeaderDropDown
        },
        ColumnDataType: 'StringEquals',
        width: 150
      },
      {
        field: 'doNotReqApprovalForScan',
        displayName: vm.LabelConstant.Operation.DoNotReqApprovalForScan,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" ng-class="{\'label-success\':row.entity.doNotReqApprovalForScan == \'YES\', ' +
          '\'label-warning\':row.entity.doNotReqApprovalForScan == \'NO\', ' +
          '\'label-info\':row.entity.doNotReqApprovalForScan == \'NA\'}">' +
          ' {{ row.entity.doNotReqApprovalForScanConvertedValue }}  </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordWithNAGridHeaderDropDown
        },
        ColumnDataType: 'StringEquals',
        width: 220
      },
      {
        field: 'addRefDesigConvertedValue',
        displayName: vm.LabelConstant.Operation.AddRefDesignator,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.addRefDesig == 1, \
                            \'label-warning\':row.entity.addRefDesig == 0}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        width: 220
      },
      {
        field: 'refDesignator',
        width: '400',
        displayName: vm.LabelConstant.BOM.REF_DES,
        cellTemplate: '<div class="cm-tracking-chip-mian width-100p" layout="row"> '
          + '<div style="overflow: hidden" class="ui-grid-cell-contents margin-left-2 tracking-number-chip tracking-number-copy-chip"  ng-repeat="objItem in row.entity.refDesignatorList track by $index"> '
          + ' {{objItem}} '
          + '<md-tooltip md-direction="bottom" ng-if="objItem" class="cm-white-space-normal break-word tooltip-multiline max-width-420">{{objItem}}</md-tooltip>'
          + ' </div> </div>',
        enableFiltering: false,
        enableSorting: false
      },
      //{
      //  field: 'isRequireRefDesWithUMIDConvertedValue',
      //  displayName: vm.LabelConstant.Operation.IsRequireRefDesWithUMID,
      //  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
      //    + '<span class="label-box" \
      //                      ng-class="{\'label-success\':row.entity.isRequireRefDesWithUMID == 1, \
      //                      \'label-warning\':row.entity.isRequireRefDesWithUMID == 0}"> \
      //                          {{ COL_FIELD }}'
      //    + '</span>'
      //    + '</div>',
      //  filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      //  filter: {
      //    term: null,
      //    options: vm.KeywordStatusGridHeaderDropdown
      //  },
      //  width: 180
      //},
      {
        field: 'isStrictlyLimitRefDesConvertedValue',
        displayName: vm.LabelConstant.Operation.IsStrictlyLimitRefDes,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isStrictlyLimitRefDes == 1, \
                            \'label-warning\':row.entity.isStrictlyLimitRefDes == 0}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        width: 250
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['opNumber', 'ASC']],
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
      exporterCsvFilename: 'Workorder Operation Configuration.csv',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return WorkorderOperationFactory.workorderOperationConfigurationList().query(pagingInfoOld).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.workOrderConfigurationList) {
            return res.data.workOrderConfigurationList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (workOrderConfigurationList, isGetDataDown) => {
      let objRefDesig;
      if (workOrderConfigurationList && workOrderConfigurationList.data && workOrderConfigurationList.data.workOrderConfigurationList) {
        if (workOrderConfigurationList.data.refDesignatorList) {
          _.each(workOrderConfigurationList.data.workOrderConfigurationList, (woOPDet) => {
            if (!woOPDet.refDesignatorList) { woOPDet.refDesignatorList = []; }
            objRefDesig = _.filter(workOrderConfigurationList.data.refDesignatorList, (item) => woOPDet.woOPID === item.woOPID);
            if (objRefDesig && objRefDesig.length > 0) {
              woOPDet.refDesignatorList = _.flatten(_.map(objRefDesig, (det) => det.refDesig));
            }
          });
        }
        if (!isGetDataDown) {
          vm.sourceData = workOrderConfigurationList.data.workOrderConfigurationList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (workOrderConfigurationList.data.workOrderConfigurationList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workOrderConfigurationList.data.workOrderConfigurationList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        _.map(vm.sourceData, (item) => {
          item.isDisabledDelete = item.systemGenerated;
        });
        // must set after new data comes
        vm.totalSourceDataCount = workOrderConfigurationList.data.Count;
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
            vm.emptyState = 0;
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
    /* retrieve workorder operation configuration list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.woID = data.woID ? data.woID : null;
      vm.cgBusyLoading = WorkorderOperationFactory.workorderOperationConfigurationList().query(vm.pagingInfo).$promise.then((res) => {
        if (res.data && res.data.workOrderConfigurationList) {
          setDataAfterGetAPICall(res, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.woID = data.woID ? data.woID : null;
      vm.cgBusyLoading = WorkorderOperationFactory.workorderOperationConfigurationList().query(vm.pagingInfo).$promise.then((res) => {
        if (res.data && res.data.workOrderConfigurationList) {
          setDataAfterGetAPICall(res, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Show Short Description*/
    vm.showDescription = (opDetObj, ev) => {
      const popupDetObj = {
        title: 'Operation',
        description: opDetObj.shortDescription,
        name: opDetObj.opFullName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupDetObj).then(() => {
          // Empty block.
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    };
    /*Go to Work Order operation detail page*/
    vm.goToWorkorderOperationDetails = (woOPID) => BaseService.goToWorkorderOperationDetails(woOPID);

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: data.woNumber, displayOrder: 1,
      labelLinkFn: vm.goToWorkorderList, valueLinkFn: vm.goToWorkorderDetails
    }, {
      label: vm.LabelConstant.Workorder.Version, value: data.woVersion, displayOrder: 2
    });
  }
})();
