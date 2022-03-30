(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('LaborCostTemplateController', LaborCostTemplateController);

  /** @ngInject */
  function LaborCostTemplateController(USER, $scope, CORE, RFQSettingFactory, BaseService, $state, $timeout, DialogFactory) {
    const vm = this;
    vm.isUpdatable = true;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.LABOR_COST_EMPTY;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
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
      field: 'priceType',
      displayName: 'Price Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '270'
    }, {
      field: 'templateName',
      displayName: 'Template Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '190'
    }, {
      field: 'isActiveConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span  class="label-box" ng-class="{\'label-success\':row.entity.isActive == 1, \'label-warning\':row.entity.isActive == 0}"> \
                                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 130,
      enableCellEdit: false
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_CREATED_AT
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      visible: CORE.UIGrid.VISIBLE_CREATED_BY
    },
    {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['templateName', 'ASC']],
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
      exporterCsvFilename: 'Labor_cost_template.csv'
    };

    function setDataAfterGetAPICall(laborcosttemplate, isGetDataDown) {
      if (laborcosttemplate && laborcosttemplate.data.LaborCost) {
        if (!isGetDataDown) {
          vm.sourceData = laborcosttemplate.data.LaborCost;
          vm.currentdata = vm.sourceData.length;
        }
        else if (laborcosttemplate.data.LaborCost.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(laborcosttemplate.data.LaborCost);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        vm.setMatrixType();

        // must set after new data comes
        vm.totalSourceDataCount = laborcosttemplate.data.Count;
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

    /* retrieve labor cost template list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.getLabourCostTemplateList().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.getLabourCostTemplateList().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Used to set matrix name into grid */
    vm.setMatrixType = () => {
      _.each(vm.sourceData, (item) => {
        item.priceType = item.pricetype === CORE.PRICE_MATRIX_TYPES.QPA_PRICE_MATRIX_TEMPLATE.Value ? CORE.PRICE_MATRIX_TYPES.QPA_PRICE_MATRIX_TEMPLATE.Key : CORE.PRICE_MATRIX_TYPES.LINE_OVERHEAD_PRICE_TEMPLATE.Key;
      });
    };

    /* Update Labor Cost Details*/
    vm.updateRecord = (row, ev) => {
      vm.addEditReocrd(row.entity, ev);
    };

    /* add Labor Cost Details*/
    vm.addEditReocrd = (row) => {
      BaseService.goToManageLaborCostTemplate(row ? row.id : null);
    };

    /* used to delete single or multiple records */
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.deleteRecord = (laborCost) => {
      let selectedIDs = [];
      if (laborCost) {
        selectedIDs.push(laborCost.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, CORE.LABOR_COST.LABOR_COST_TEMPLATE, selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = RFQSettingFactory.deleteLaborCostTemplates().query({ objIDs: objIDs }).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, CORE.LABOR_COST.LABOR_COST_TEMPLATE);
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      row.title = `${CORE.LABOR_COST.LABOR_COST_TEMPLATE} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.LABOR_COST_TEMPLATE;
      row.EmptyMesssage = CORE.COMMON_HISTORY.LABOR_COST_TEMPLATE.HISTORY_EMPTY_MESSAGE;
      row.headerData = [{
        label: CORE.COMMON_HISTORY.LABOR_COST_TEMPLATE.LABLE_NAME,
        value: row.templateName,
        displayOrder: 1,
        labelLinkFn: vm.goToLaborCostTemplateList,
        valueLinkFn: vm.goToManageLaborCostTemplate,
        valueLinkFnParams: row.id
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Labor Cost Template list page. */
    vm.goToLaborCostTemplateList = () => BaseService.goToLaborCostTemplateList();
    /* Goto manage Labor Cost Template page. */
    vm.goToManageLaborCostTemplate = (id) => BaseService.goToManageLaborCostTemplate(id);
  }
})();
