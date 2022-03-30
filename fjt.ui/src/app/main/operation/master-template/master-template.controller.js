(function () {
  'use strict';

  angular
    .module('app.operation.masterTemplate')
    .controller('OperationMasterTemplateController', OperationMasterTemplateController);

  /** @ngInject */
  function OperationMasterTemplateController($mdDialog, $scope, $state, $timeout, CORE, OPERATION, OperationFactory, DialogFactory, BaseService, USER, WorkorderFactory) {
    const vm = this;
    vm.isUpdatable = true;
    vm.isCopyTemplate = true;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'Operation Management History';
    vm.EmptyMesssage = OPERATION.OPERATION_EMPTYSTATE.MASTERTEMPLATE;
    vm.MasterTemplateDropdown = CORE.MasterTemplateDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.genericStatusGridHeaderDropdown = CORE.GenericDraftPublishStatusGridHeaderDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.OperationAdvanceFilter = angular.copy(CORE.OperationAdvanceFilter);
    vm.filter = {
      operations: [],
      description: null
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
      cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
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
      field: 'masterTemplate',
      displayName: 'Template',
      cellTemplate: '<a class="ui-grid-cell-contents cm-text-decoration" ng-click="grid.appScope.$parent.vm.goToManageOperationManagement(row.entity, $event);">\
                                                {{row.entity.masterTemplate}} \
                                            </a><md-tooltip md-direction="top">{{row.entity.masterTemplate}}</md-tooltip>',
      width: 350
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
        '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
        '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.description && row.entity.description !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescriptionColumn(row, $event, \'Description\')">' +
        '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
        '<md-tooltip>View</md-tooltip>' +
        '</button> </div>',
      width: 400
    }, {
      field: 'isMasterTemplateValue',
      displayName: 'Master Template',
      width: '100',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isMasterTemplateValue == \'Yes\',\
                            \'label-warning\':row.entity.isMasterTemplateValue  == \'No\' }"> \
                                {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.MasterTemplateDropdown
      },
      ColumnDataType: 'StringEquals',
      enableFiltering: true,
      enableSorting: false
    }, {
      field: 'operationCount',
      displayName: 'No. of Operations',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-click="grid.appScope.$parent.vm.goToManageOperationManagement(row.entity, $event)"> \
                                   View ({{COL_FIELD ? COL_FIELD : 0}}) \
                                </md-button>',
      enableFiltering: false,
      enableSorting: false,
      width: '100'
    }, {
      field: 'masterTemplateStatusText',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getMasterTemplateStatusClassName(row.entity.masterTemplateStatus)">'
        + '{{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.genericStatusGridHeaderDropdown
      },
      width: 120
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
      enableFiltering: false
    },
    {
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
    },
    {
      field: 'SyatemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"><span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}</span></div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['masterTemplate', 'ASC']],
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
      exporterCsvFilename: 'Operation Management.csv',
      CurrentPage: 'Operation Template',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return OperationFactory.retriveMastertemplateList().query(pagingInfoOld).$promise.then((mastertemplate) => {
          if (mastertemplate && mastertemplate.status === CORE.ApiResponseTypeStatus.SUCCESS && mastertemplate.data && mastertemplate.data.mastertemplate) {
            return mastertemplate.data.mastertemplate;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (mastertemplate, isGetDataDown) => {
      if (mastertemplate && mastertemplate.data && mastertemplate.data.mastertemplate) {
        _.each(mastertemplate.data.mastertemplate, (item) => {
          item.isDisabledDelete = item.systemGenerated;
          item.isDisabledUpdate = item.systemGenerated;
          item.isDisabledCopy = item.systemGenerated;
          if (item.isDisabledDelete) {
            item.isRowSelectable = false;
          }
        });
        if (!isGetDataDown) {
          vm.sourceData = mastertemplate.data.mastertemplate;
          vm.currentdata = vm.sourceData.length;
        }
        else if (mastertemplate.data.mastertemplate.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(mastertemplate.data.mastertemplate);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = mastertemplate.data.Count;
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
            if (vm.generateFilter) {
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

    // Generate tooltip for Operation chip filter.
    const getOperationFilterTooltip = () => {
      const maxTooltipLimit = 10;
      let isTooltipGreatrtthenLimit = false;
      const moreTooltipText = '<br />more...';
      let toolTipText = '';
      toolTipText = vm.filter.operations.map((a) => a['opName']);
      if (toolTipText && toolTipText.length > maxTooltipLimit) {
        toolTipText = toolTipText.splice(0, maxTooltipLimit);
        isTooltipGreatrtthenLimit = true;
      }
      return toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '');
    };

    // generate filter for Operation list page
    const generateSearchFilter = () => {
      vm.generateFilter = false;
      vm.OperationAdvanceFilter.ClearAll.isDeleted = true;

      // Operation filter.
      if (vm.filter.operations && vm.filter.operations.length > 0) {
        vm.pagingInfo.operationIds = _.map(vm.filter.operations, 'opid').join(',');
        vm.generateFilter = true;
        vm.OperationAdvanceFilter.Operation.isDeleted = false;
        vm.OperationAdvanceFilter.ClearAll.isDeleted = false;
        vm.OperationAdvanceFilter.Operation.tooltip = getOperationFilterTooltip();
      } else {
        vm.pagingInfo.operationIds = null;
        vm.OperationAdvanceFilter.Operation.isDeleted = true;
      }

      // Description Filter.
      if (vm.filter.description) {
        vm.pagingInfo.description = vm.filter.description;
        vm.generateFilter = true;
        vm.OperationAdvanceFilter.Description.isDeleted = false;
        vm.OperationAdvanceFilter.ClearAll.isDeleted = false;
        vm.OperationAdvanceFilter.Description.tooltip = vm.filter.description;
      } else {
        vm.pagingInfo.description = null;
        vm.OperationAdvanceFilter.Description.isDeleted = true;
      }

      // Status Filter.
      let strStatusFilter = '';
      if (vm.isCheckAllStatus) {
        vm.OperationAdvanceFilter.filterStatus.tooltip = 'All';
      } else {
        if (vm.draft) {
          strStatusFilter = stringFormat('{0},{1}', strStatusFilter, vm.genericStatusGridHeaderDropdown[1].value);
          vm.OperationAdvanceFilter.filterStatus.tooltip = vm.genericStatusGridHeaderDropdown[1].value;
        }
        if (vm.publish) {
          strStatusFilter = stringFormat('{0},{1}', strStatusFilter, vm.genericStatusGridHeaderDropdown[2].value);
          vm.OperationAdvanceFilter.filterStatus.tooltip = vm.genericStatusGridHeaderDropdown[2].value;
        }
      }
      if (vm.draft || vm.publish) {
        vm.pagingInfo.filterStatus = strStatusFilter.substring(1);
        vm.generateFilter = true;
        vm.OperationAdvanceFilter.filterStatus.isDeleted = false;
        vm.OperationAdvanceFilter.ClearAll.isDeleted = false;
      } else {
        vm.OperationAdvanceFilter.filterStatus.isDeleted = true;
        vm.pagingInfo.filterStatus = '';
      }

      if (vm.gridOptions && vm.gridOptions.gridApi) {
        vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
      }
    };

    /* to bind data in grid on load */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      // Add Custom filter
      generateSearchFilter();
      vm.cgBusyLoading = OperationFactory.retriveMastertemplateList().query(vm.pagingInfo).$promise.then((mastertemplate) => {
        if (mastertemplate && mastertemplate.data) {
          setDataAfterGetAPICall(mastertemplate, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* to get data on scroll down in grid */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = OperationFactory.retriveMastertemplateList().query(vm.pagingInfo).$promise.then((mastertemplate) => {
        if (mastertemplate && mastertemplate.data) {
          setDataAfterGetAPICall(mastertemplate, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedMasterTemplate = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    /* give common search */
    const returnCommonSearch = (criteria) => {
      const replacedString = criteria.replace('\\', '\\\\');
      criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
      return criteria.length > 100 ? criteria.substring(0, 100) : criteria;
    };

    /* search operation name query */
    vm.queryOperationSearch = (criteria) => {
      const searchObj = {
        searchString: returnCommonSearch(criteria)
      };
      return WorkorderFactory.getOperationFilterList().query(searchObj).$promise.then((operationresponse) => {
        if (operationresponse && operationresponse.data) {
          operationresponse.data = _.differenceWith(operationresponse.data, vm.filter.operations, (arrValue, othValue) => arrValue.opid === othValue.opid);
          return operationresponse.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* advance search */
    vm.applyFilters = () => {
      vm.loadData();
    };

    /* On Enter KeyPress Apply Filter. */
    vm.applyFiltersOnEnter = (event) => {
      if (event.keyCode === 13) {
        vm.applyFilters();
      }
    };

    /* change Status filter  */
    vm.changeStatusFilter = () => {
      if (vm.draft && vm.publish) {
        vm.isCheckAllStatus = true;
      } else if (!vm.draft && !vm.publish) {
        vm.isCheckAllStatus = true;
      } else {
        vm.isCheckAllStatus = false;
      }
    };

    /* clear Selected Filter */
    vm.clearSelection = () => {
      vm.filter = {
        operations: [],
        description: null
      };
      vm.isCheckAllStatus = vm.draft = vm.publish = false;
    };

    /* check clear selection btn is disabled */
    vm.isClearSelectionDisabled = () => {
      const isButtonDisabled = ((vm.filter.operations && vm.filter.operations.length > 0) || vm.filter.description || vm.draft || vm.publish);
      return !isButtonDisabled;
    };

    /* reset filter */
    vm.resetAllFilter = (isfromClear) => {
      vm.clearSelection();
      if (vm.gridOptions.gridApi) {
        vm.gridOptions.gridApi.core.clearAllFilters();
      }
      if (!isfromClear) {
        vm.loadData();
      }
    };

    /* remove advance search filter */
    vm.removeAppliedFilter = (item) => {
      if (item) {
        item.isDeleted = true;
        switch (item.value) {
          case vm.OperationAdvanceFilter.Operation.value:
            vm.filter.operations = [];
            break;
          case vm.OperationAdvanceFilter.filterStatus.value:
            vm.isCheckAllStatus = vm.publish = vm.draft = false;
            break;
          case vm.OperationAdvanceFilter.Description.value:
            vm.filter.description = null;
            break;
          case vm.OperationAdvanceFilter.ClearAll.value:
            vm.resetAllFilter(true);
            break;
        }
        vm.loadData();
      }
    };

    /* Clear grid Column Filter */
    vm.clearGridColumnFilter = (item) => {
      if (item) {
        item.filters[0].term = undefined;
        if (!item.isFilterDeregistered) {
          //refresh data grid
          vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
        }
      }
    };

    /* update operationmastertemplate*/
    vm.updateRecord = (row, ev) => {
      vm.goToManageOperationManagement(row.entity, ev);
    };

    /* delete operationmastertemplate*/
    vm.deleteRecord = (masterTemplate) => {
      let selectedIDs = [];
      if (masterTemplate) {
        selectedIDs.push(masterTemplate.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((masterTemplateItem) => masterTemplateItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Operation Management', selectedIDs.length);
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
            vm.cgBusyLoading = OperationFactory.deleteMasterTemplate().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res) {
                if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.operation_management
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return OperationFactory.deleteMasterTemplate().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = masterTemplate ? masterTemplate.masterTemplate : null;
                      data.PageName = CORE.PageName.operation_management;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
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
        messageContent.message = stringFormat(messageContent.message, 'Operation Management');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    // Go To manage operation page.
    vm.goToManageOperationManagement = (data) => {
      BaseService.goToManageOperationManagement(data ? data.id : null);
    };

    // go to operation list
    vm.goToOperationList = () => {
      BaseService.goToOperationList();
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });

    /* open popup to copy master template */
    vm.copyMasterTemplate = (row, ev) => {
      var data = _.clone(row);
      data.isCopy = true;
      DialogFactory.dialogService(
        OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_CONTROLLER,
        OPERATION.OPERATION_MASTER_TEMPLATE_MODAL_VIEW,
        ev,
        data).then((res) => {
          if (res && res.id) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* get css class name for master template status (draft | publish) */
    vm.getMasterTemplateStatusClassName = (statusID) => BaseService.getGenericDraftPublishStatusClassName(statusID);

    const showDescription = (popupData, ev) => {
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /* to display internal notes */
    vm.showDescriptionColumn = (row, ev) => {
      const popupData = {
        title: 'Description',
        description: row.entity.description
      };
      showDescription(popupData, ev);
    };

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      row.title = `${CORE.PageName.operation_management} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.MASTER_TEMPLATES;
      row.EmptyMesssage = stringFormat(CORE.COMMON_HISTORY.MESSAGE, `${CORE.PageName.operation_management} history`);
      row.headerData = [{
        label: CORE.PageName.operation_management,
        value: row.masterTemplate,
        displayOrder: 1,
        labelLinkFn: vm.goToOperationMasterTemplateList,
        valueLinkFn: vm.goToManageOperationManagement,
        valueLinkFnParams: row
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    //get max length validations
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* Goto Operation Template list page. */
    vm.goToOperationMasterTemplateList = () => BaseService.goToOperationMasterTemplateList();
  }
})();
