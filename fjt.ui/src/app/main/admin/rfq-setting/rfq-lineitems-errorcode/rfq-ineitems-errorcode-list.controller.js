(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('RFQLineitemsErrorcodeController', RFQLineitemsErrorcodeController);

  /** @ngInject */
  function RFQLineitemsErrorcodeController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
    const vm = this;
    vm.isUpdatable = true;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.isHideDelete = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.RRQ_LINEITEMS_ERRORCODE;
    vm.logicCategoryList = CORE.LogicCategoryDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.KeywordAssemblyLevelStatusGridHeaderDropdown = CORE.KeywordAssemblyLevelStatusGridHeaderDropdown;
    vm.KeywordAllowEngrStatusGridHeaderDropdown = CORE.KeywordAllowEngrStatusGridHeaderDropdown;
    vm.isEditIntigrate = false;
    vm.isRestrictErrorCode = false;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'logicName',
      displayName: 'Logic Category',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'errorCode',
      displayName: 'Error Code',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150'
    }, {
      field: 'errorColor',
      displayName: 'Error Color',
      cellTemplate: '<span class="label-box label-colorCode" style="background-color:{{COL_FIELD}}" ng-show="row.entity.errorColor">\
                        </span><span class="label-box black-500-fg" ng-show="!row.entity.errorColor" style="border-color:gray">\
                        </span>',
      width: '105',
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
        '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
        '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)">' +
        '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
        '<md-tooltip>View</md-tooltip>' +
        '</button>' +
        '</div>',
      width: '650'
    }, {
      field: 'systemVariable',
      displayName: 'System Variable',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'displayName',
      displayName: 'Display Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
    }, {
      field: 'isExternalIssueValue',
      displayName: 'External Issue',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isExternalIssue == true,\
                                        \'label-warning\':row.entity.isExternalIssue == false }"> \
                                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false
    }, {
      field: 'RestrictCount',
      displayName: 'Restrict Transaction Count',
      width: '205',
      type: 'number'
    }, {
      field: 'displayOrder',
      displayName: 'Priority' + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | number: 2}}</div>',
      width: 80,
      type: 'number',
      enableCellEdit: true,
      validators: { required: true }
    }, {
      field: 'narrative',
      displayName: 'Narrative',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.narrative" ng-click="grid.appScope.$parent.vm.showNarrativeInfo(row.entity, $event)"> \
                                   View \
                                </md-button>',
      enableCellEdit: false,
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      visible: vm.narrative,
      width: '120'
    }, {
      field: 'isResearchStatusValue',
      displayName: 'Include In R&D Activity',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isResearchStatus == true,\
                                        \'label-warning\':row.entity.isResearchStatus == false }"> \
                                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false,
      width: 150
    }, {
      field: 'isAssemblyLevelErrorValue',
      displayName: 'Level Issue',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isAssemblyLevelError,\
                                        \'label-warning\':!row.entity.isAssemblyLevelError }"> \
                                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordAssemblyLevelStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false,
      width: 180
    }, {
      field: 'isAllowToEngrApprovedValue',
      displayName: 'Allow Part to Engr. Approved',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isAllowToEngrApproved == 1,\
                                        \'label-warning\':row.entity.isAllowToEngrApproved == 0, \
                                        \'label-info\':row.entity.isAllowToEngrApproved == 2 }"> \
                                            {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordAllowEngrStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false,
      width: 215
    }, {
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
      enableFiltering: false,
      visible: false
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        pCategoryIDs: null
      };
    };

    initPageInfo();

    vm.getErrorCodeCategory = () => {
      vm.cgBusyLoading = RFQSettingFactory.getErrorCodeCategory().query().$promise.then((response) => {
        if (response.data) {
          vm.categoryList = response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getErrorCodeCategory();

    vm.clearCategoryFilter = () => {
      vm.categoryListModel = [];
      vm.loadData();
    };

    vm.clearFilter = () => {
      vm.categoryListModel = [];
      if (vm.pagingInfo.pCategoryIDs) {
        vm.loadData();
      }
    };

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
      exporterCsvFilename: 'Error Code.csv',
      hideMultiDeleteButton: true
    };

    function setDataAfterGetAPICall(errorcode, isGetDataDown) {
      if (errorcode && errorcode.data.rfq_lineitems_errorcode) {
        if (!isGetDataDown) {
          vm.sourceData = errorcode.data.rfq_lineitems_errorcode;
          vm.currentdata = vm.sourceData.length;
        }
        else if (errorcode.data.rfq_lineitems_errorcode.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(errorcode.data.rfq_lineitems_errorcode);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = errorcode.data.Count;
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
          if (!vm.isEditIntigrate) {
            cellEdit();
          }
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.pCategoryIDs) {
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
    }

    vm.loadData = () => {
      vm.pagingInfo.pCategoryIDs = null;
      if (vm.categoryListModel && vm.categoryListModel.length) {
        vm.pagingInfo.pCategoryIDs = vm.categoryListModel.join();
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.retriveErrorCode().query(vm.pagingInfo).$promise.then((errorcode) => {
        if (errorcode.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (errorcode) {
            setDataAfterGetAPICall(errorcode, false);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.pCategoryIDs = null;
      if (vm.categoryListModel && vm.categoryListModel.length) {
        vm.pagingInfo.pCategoryIDs = vm.categoryListModel.join();
      }
      vm.cgBusyLoading = RFQSettingFactory.retriveErrorCode().query(vm.pagingInfo).$promise.then((errorcode) => {
        setDataAfterGetAPICall(errorcode, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_RFQ_LINEITEMS_ERRORCODE_CONTROLLER,
        CORE.MANAGE_RFQ_LINEITEMS_ERRORCODE_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, () => {
        });
    };

    /* Update RFQ Lineitems Error Code */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    vm.goToRestrictErrorCode = (data, ev) => {
      DialogFactory.dialogService(
        CORE.RFQ_LINEITEMS_ERRORCODE_CATEGORY_MAPPING_CONTROLLER,
        CORE.RFQ_LINEITEMS_ERRORCODE_CATEGORY_MAPPING_VIEW,
        ev,
        data.entity).then(() => {
        }, () => {
        });
    };

    vm.selectedErrorCodeList = () => {
      vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;
    };

    //Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          const errorCodeModel = {
            id: rowEntity.id,
            displayOrder: newvalue
          };
          if (newvalue !== null) {
            vm.cgBusyLoading = RFQSettingFactory.saverfqlineErrorCodePriority().save(errorCodeModel).$promise.then((res) => {
              if (res) {
                if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                  rowEntity.displayOrder = oldvalue;
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
            const index = vm.sourceData.indexOf(obj);
            vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[index], vm.gridOptions.columnDefs[4]);
          }
        }
      });
    }

    /* Open Description Popup. */
    vm.showDescription = (row, ev) => {
      const popupData = {
        title: 'Description',
        description: row.description
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show Narrative*/
    vm.showNarrativeInfo = (object, ev) => {
      const obj = {
        title: 'Narrative',
        description: object.narrative,
        name: object.columnName
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      row.title = `${CORE.PageName.RFQLineItemErrorCode} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.RFQ_LINEITEMS_ERRORCODE;
      row.EmptyMesssage = CORE.COMMON_HISTORY.RFQ_LINEITEMS_ERRORCODE.HISTORY_EMPTY_MESSAGE;
      row.headerData = [{
        label: 'Logic Category',
        value: row.logicName,
        displayOrder: 1,
        labelLinkFn: vm.goToRFQLineitemsErrorcodeList
      }, {
        label: 'Error Code',
        value: row.errorCode,
        displayOrder: 2,
        labelLinkFn: vm.goToRFQLineitemsErrorcodeList
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto BOM Error Code list page. */
    vm.goToRFQLineitemsErrorcodeList = () => BaseService.goToRFQLineitemsErrorcodeList();

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
