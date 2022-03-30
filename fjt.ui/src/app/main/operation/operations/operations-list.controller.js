(function () {
  'use strict';

  angular
    .module('app.operation.operations')
    .controller('OperationsController', OperationsController);

  /** @ngInject */
  function OperationsController($timeout, $mdDialog, $state, CORE, OPERATION,
    OperationFactory, DialogFactory, BaseService, USER, $scope) {
    const vm = this;
    vm.isUpdatable = true;
    vm.isCopy = true;
    vm.view = true;
    vm.EmptyMesssage = OPERATION.OPERATION_EMPTYSTATE.OPERATION;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.OperationStatusGridHeaderDropdown = CORE.OperationStatusGridHeaderDropdown;
    vm.SampleStatusGridHeaderDropdown = CORE.SampleStatusGridHeaderDropdown;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    vm.fluxTypeDropDown = CORE.FluxTypeDropDown;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    //vm.isDataFields = true;
    vm.entityID = CORE.AllEntityIDS.Operation.ID;
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '100',
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
        field: 'opNumber',
        displayName: vm.LabelConstant.Operation.OP,
        cellClass: 'alignRight text-right',
        cellTemplate: '<a class="ui-grid-cell-contents cm-text-decoration" ng-click="grid.appScope.$parent.vm.goTooperationDetails(row.entity.opID);">\
                                                {{row.entity.opNumber | threeDecimal}} \
                                            </a><md-tooltip md-direction="top">{{row.entity.opNumber | threeDecimal}}</md-tooltip>',
        width: 105
      }, {
        field: 'opName',
        displayName: 'Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 520

      }, {
        field: 'shortDescription',
        displayName: 'Short Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shortDescription && row.entity.shortDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, true, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        enableFiltering: false,
        width: '300'
      }, {
        field: 'opDescription',
        displayName: 'Description',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="grid.appScope.$parent.vm.isDisableDescription(row.entity,false)" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, false, $event)"> \
                                   View \
                                </md-button>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        width: '110'
      },
      {
        field: 'mountingType',
        displayName: 'Mounting Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 300

      },
      {
        field: 'opStatusConvertedValue',
        displayName: 'Status',
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
        width: 120
      }, {
        field: 'tabLimitAtTraveler',
        displayName: 'Neighboring Operations',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 100

      }, {
        field: 'qtyControlConvertedValue',
        displayName: 'Qty Tracking Required',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.qtyControl == true" \
                            ng-class="{\'label-success\':row.entity.qtyControl == true, \
                            \'label-warning\':row.entity.qtyControl == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: '100'
      }, {
        field: 'isIssueQtyConvertedValue',
        displayName: 'Issue Qty Required',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isIssueQty == true" \
                            ng-class="{\'label-success\':row.entity.isIssueQty == true, \
                            \'label-warning\':row.entity.isIssueQty == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: '100'
      }, {
        field: 'isTeamOperationConvertedValue',
        displayName: 'Team Operation',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isTeamOperation == true" \
                            ng-class="{\'label-success\':row.entity.isTeamOperation == true, \
                            \'label-warning\':row.entity.isTeamOperation == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: '100'
      }, {
        field: 'isReworkConvertedValue',
        displayName: 'Rework Operation',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isRework == true" \
                            ng-class="{\'label-success\':row.entity.isRework == true, \
                            \'label-warning\':row.entity.isRework == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: '100'
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
          + '<span class="label-box" ng-if="row.entity.isMoveToStock == true" \
                            ng-class="{\'label-success\':row.entity.isMoveToStock == true, \
                            \'label-warning\':row.entity.isMoveToStock == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: '100'
      },
      {
        field: 'isLoopOperationConvertedValue',
        displayName: vm.LabelConstant.Operation.LoopOperation,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isLoopOperation == true" \
                            ng-class="{\'label-success\':row.entity.isLoopOperation == true, \
                            \'label-warning\':row.entity.isLoopOperation == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: '100'
      },
      {
        field: 'isPlacementTrackingConvertedValue',
        displayName: vm.LabelConstant.Operation.BasicPlacementTracking,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isPlacementTracking == true" \
                            ng-class="{\'label-success\':row.entity.isPlacementTracking == true, \
                            \'label-warning\':row.entity.isPlacementTracking == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: 130
      },
      {
        field: 'isAllowMissingPartQtyConvertedValue',
        displayName: vm.LabelConstant.Operation.AllowMissingPartQty,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isAllowMissingPartQty == true" \
                            ng-class="{\'label-success\':row.entity.isAllowMissingPartQty == true, \
                            \'label-warning\':row.entity.isAllowMissingPartQty == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: 275
      },
      {
        field: 'isAllowBypassQtyConvertedValue',
        displayName: vm.LabelConstant.Operation.AllowByPassQty,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isAllowBypassQty == true" \
                            ng-class="{\'label-success\':row.entity.isAllowBypassQty == true, \
                            \'label-warning\':row.entity.isAllowBypassQty == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: 250
      },
      {
        field: 'isEnablePreProgrammingPartConvertedValue',
        displayName: vm.LabelConstant.Operation.EnablePreProgrammingPart,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-if="row.entity.isEnablePreProgrammingPart == true" \
                            ng-class="{\'label-success\':row.entity.isEnablePreProgrammingPart == true, \
                            \'label-warning\':row.entity.isEnablePreProgrammingPart == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
        width: 170
      },
      {
        field: 'processTime',
        displayName: 'Targeted Total Process Time (HH:mm)',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 150

      }, {
        field: 'setupTime',
        displayName: 'Setup Time (HH:mm)',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 100

      }, {
        field: 'perPieceTime',
        displayName: 'Per pcs Target Time (HH:mm)',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 100

      },
      {
        field: 'fluxType',
        displayName: 'Flux Type',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '{{row.entity.fluxTypeConvertedValue}}'
          + '</div>',
        width: 200,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.fluxTypeDropDown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: false
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: false
      }, {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }
      , {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableSorting: true,
        enableFiltering: true
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: false
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
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Operations.csv',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return OperationFactory.retriveOperationList().query(pagingInfoOld).$promise.then((operation) => {
          if (operation && operation.status === CORE.ApiResponseTypeStatus.SUCCESS && operation.data && operation.data.operation) {
            return operation.data.operation;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (operation, isGetDataDown) => {
      if (operation && operation.data && operation.data.operation) {
        operation.data.operation.forEach((item) => {
          item.processTime = convertDisplayTime(item.processTime);
          item.setupTime = convertDisplayTime(item.setupTime);
          item.perPieceTime = convertDisplayTime(item.perPieceTime);
          if (item.opStatus === CORE.OPSTATUS.PUBLISHED) {
            item.isDisabledDelete = true;
            item.isRowSelectable = false;
          }
        });

        if (!isGetDataDown) {
          vm.sourceData = operation.data.operation;
          vm.currentdata = vm.sourceData.length;
        }
        else if (operation.data.operation.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(operation.data.operation);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = operation.data.Count;
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

    /* to bind data in grid on load */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = OperationFactory.retriveOperationList().query(vm.pagingInfo).$promise.then((operation) => {
        if (operation && operation.data) {
          setDataAfterGetAPICall(operation, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = OperationFactory.retriveOperationList().query(vm.pagingInfo).$promise.then((operation) => {
        if (operation && operation.data) {
          setDataAfterGetAPICall(operation, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedOperation = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.addRecord = () => {
      BaseService.goToManageOperation();
    };

    vm.updateRecord = (row) => {
      BaseService.goToManageOperation(row.entity.opID);
    };

    vm.viewRecord = (row) => {
      BaseService.goToOperationProfile(row.entity.opID);
    };

    // delete
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.opID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.opID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Operation(s)', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          isPermanentDelete: IsPermanentDelete,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            //const index = vm.gridData.data.indexOf(row.entity);
            vm.cgBusyLoading = OperationFactory.deleteOperation().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.operations
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return vm.cgBusyLoading = OperationFactory.deleteOperation().save({
                      objIDs: objIDs
                    }).$promise.then((res) => {
                      if (res && res.data) {
                        let data = {};
                        data = res.data;
                        data.pageTitle = row ? row.opName : null;
                        data.PageName = CORE.PageName.operations;
                        data.id = selectedIDs;
                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          }).catch((error) => BaseService.getErrorLog(error));
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'category type');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    // Check disable Description or ShortDescription.
    vm.isDisableDescription = (data, isShortDescription) => isShortDescription ? (data.shortDescription ? false : true) : (data.opDescription ? false : true);

    // Open popup for duplicate Operation.
    vm.copyRecord = (row) => {
      const data = {
        opID: row.entity.opID
      };
      DialogFactory.dialogService(
        OPERATION.DUPLICATE_OPERATION_POPUP_CONTROLLER,
        OPERATION.DUPLICATE_OPERATION_POPUP_VIEW,
        null,
        data).then((res) => {
          if (res && res.opID) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show Description*/
    vm.showDescription = (object, isShortDescription, ev) => {
      const obj = {
        title: isShortDescription ? 'Short Description' :'Description',
        description: isShortDescription ? object.shortDescription : object.opDescription,
        name: object.opName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj).then(() => {
          initPageInfo();
          vm.loadData();
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getOpStatusClassName = (statusID) => BaseService.getOpStatusClassName(statusID);

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //go to operation master page
    vm.goTooperationDetails = (id) => {
      BaseService.goToManageOperation(id);
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
