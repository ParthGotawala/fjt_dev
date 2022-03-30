(function () {
  'use strict';

  angular
    .module('app.transaction.manualentry')
    .controller('ManualEntryListController', ManualEntryListController);

  /** @ngInject */
  function ManualEntryListController($timeout, CORE, WORKORDER, TRANSACTION, ComponentFactory, EmployeeFactory, BOMFactory, DialogFactory, BaseService, USER) {
    const vm = this;
    vm.isUpdatable = true;
    vm.editFeatureBased = true;
    vm.isDeleteFeatureBased = true;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_MANUAL_ENTRY_LIST;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.loginUser = BaseService.loginUser;
    vm.loginUserID = BaseService.loginUser.userid;
    vm.userID = BaseService.loginUser.employee.id;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.ActivityTrackingAdvanceFilter = angular.copy(TRANSACTION.ActivityTrackingAdvanceFilters);
    vm.isBOMType = vm.isCosting = vm.isKit = vm.isProduction = vm.isSetup = false;
    vm.transactionType = TRANSACTION.ActivityTransactionTypeDropdown;
    vm.activityType = TRANSACTION.ActivityTypeDropdown;
    vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.headerdata = [];
    vm.assyMfgPn = [];
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isEnableModification = false;

    const getAllRights = () => {
      vm.isEnableModification = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToUpdateDeleteActivityEntryManually);
    };
    getAllRights();

    /* hyperlink go for personnel list page */
    vm.goToPersonnelList = () => BaseService.goToPersonnelList();

    /* hyperlink go for manage personnel page */
    vm.goToManagePersonnel = (id) => BaseService.goToManagePersonnel(id);

    /* hyperlink go for part list page */
    vm.goToPartList = () => BaseService.goToPartList();

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
        enableSorting: false,
        pinnedLeft: true
      },
      {
        field: 'transactionTypeConvertedValue',
        displayName: 'Transaction Type',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '170'
      },
      {
        field: 'activityTypeConvertedValue',
        displayName: 'Activity Type',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '150'
      },
      {
        field: 'userName',
        displayName: 'Personnel',
        cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManagePersonnel(row.entity.employeeID);" tabindex="-1">{{COL_FIELD}}</a>\
                        </div>',
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
        field: 'checkoutTime',
        displayName: 'Stop Date Time',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.checkoutTime | date:grid.appScope.$parent.vm.DateTimeFormat}}</div>',
        enableCellEdit: false,
        enableFiltering: false,
        width: '180',
        type: 'datetime'
      },
      {
        field: 'totalTime',
        displayName: 'Total Time(Sec)',
        enableCellEdit: false,
        enableFiltering: false,
        width: '150'
      },
      {
        field: 'PIDCode',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        displayName: vm.LabelConstant.Assembly.PIDCode,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-custom-part="row.entity.isCustom" \
                                cust-part-number="row.entity.custAssyPN"\
                                is-copy="true" \
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-assembly="true"\></div>',
        allowCellFocus: false,
        minWidth: CORE.UI_GRID_COLUMN_WIDTH.PID
      },
      {
        field: 'mfgPN',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: vm.LabelConstant.Assembly.MFGPN,
        minWidth: CORE.UI_GRID_COLUMN_WIDTH.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                value="row.entity.mfgPN" \
                                is-copy="true" \
                                is-custom-part="row.entity.isCustom" \
                                cust-part-number="row.entity.custAssyPN"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-assembly="true"\></div>',
        allowCellFocus: false
      },
      {
        field: 'burdenRate',
        displayName: 'Burden Rate($)',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: 120,
        enableFiltering: false
      },
      {
        field: 'paymentMode',
        displayName: 'Payment Mode',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: 120,
        enableFiltering: false
      },
      {
        field: 'remark',
        displayName: 'Comment',
        cellTemplate: '<md-button class="md-warn md-hue-1 mt-0 ml-40" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)">View</md-button>',
        width: 120,
        enableFiltering: false,
        exporterSuppressExport: true
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
        SortColumns: [['refTransID', 'DESC']],
        SearchColumns: [],
        woID: vm.woID
      };
    };
    initPageInfo();

    // search list page for supplier
    vm.searchEmployeeList = () => {
      const employeeListToFilter = angular.copy(vm.employeeList);
      vm.employeeListToDisplay = vm.employeeSearchText ? _.filter(employeeListToFilter, (item) => item.empCodeName.toLowerCase().contains(vm.employeeSearchText.toLowerCase())) : employeeListToFilter;
    };

    vm.clearEmployeeSearchText = () => {
      vm.employeeSearchText = undefined;
      vm.searchEmployeeList();
    };

    vm.clearEmployeeFilter = () => {
      vm.employeeDetailModel = [];
      if (vm.pagingInfo.employeeIds) {
        vm.advanceFilterSearch();
      }
    };

    /* get Personnel List */
    vm.getEmployeeList = () => {
      vm.employeeSearchText = undefined;
      return EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
        vm.employeeList = employees.data;
        vm.employeeListToDisplay = angular.copy(vm.employeeList);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getEmployeeList();

    // to restrict search criteria
    const returnCommonSeach = (criteria) => {
      var replacedString = criteria.replace('\\', '\\\\');
      criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace('[', '\\\\[').replace(']', '\\\\]');
      return criteria.length > 100 ? criteria.substring(0, 100) : criteria;
    };

    // search assy mfgpn query
    vm.queryAssySearchMfgPn = (criteria) => {
      const searchObj = {
        searchString: returnCommonSeach(criteria),
        mfgPN: true
      };
      return ComponentFactory.getAllAssyFilterList().query(searchObj).$promise.then((response) => {
        if (response && response.data) {
          response.data = _.differenceWith(response.data, vm.assyMfgPn, (arrValue, othValue) => arrValue.id === othValue.id);
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.showDescription = (rowData, ev) => {
      const popupData = {
        title: 'Comment',
        description: rowData.remark
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        popupData).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

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
      exporterCsvFilename: 'Activity Tracking.csv'
    };

    vm.advanceFilterSearch = () => {
      vm.callLoadData = true;
      if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
        return;
      }
      initPageInfo();
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
          if (!_.isEmpty(col.filters[0].term)) {
            vm.callLoadData = false;
            col.filters[0].term = undefined;
          }
        });
      }
      vm.loadData();
    };

    // remove selected filter chip
    vm.removeAppliedFilter = (item) => {
      if (item) {
        item.isDeleted = true;
        switch (item.value) {
          case vm.ActivityTrackingAdvanceFilter.Personnel.value:
            vm.employeeDetailModel = null;
            break;
          case vm.ActivityTrackingAdvanceFilter.TransactionType.value:
            vm.isBOMType = vm.isCosting = vm.isKit = false;
            break;
          case vm.ActivityTrackingAdvanceFilter.ActivityType.value:
            vm.isProduction = vm.isSetup = false;
            break;
          case vm.ActivityTrackingAdvanceFilter.PartId.value:
            vm.assyMfgPn = [];
            break;
          case vm.ActivityTrackingAdvanceFilter.ClearAll.value:
            break;
          default:
            break;
        }
        vm.advanceFilterSearch();
      }
    };

    // reset filter
    vm.resetFilter = () => {
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
          if (!_.isEmpty(col.filters[0].term)) {
            vm.callLoadData = false;
            col.filters[0].term = undefined;
          }
        });
      }
      vm.employeeSearchText = undefined;
      vm.clearEmployeeSearchText();
      vm.employeeDetailModel = [];
      vm.isBOMType = vm.isCosting = vm.isKit = vm.isProduction = vm.isSetup = false;
      initPageInfo();
      vm.loadData();
    };

    // Clear grid Column Filter
    vm.clearGridColumnFilter = (item) => {
      if (item) {
        item.filters[0].term = undefined;
        if (!item.isFilterDeregistered) {
          //refresh data grid
          vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
        }
      }
    };

    // Get Tool tip for selected filters
    function getFilterTooltip(displayList, selectedModdel, idFieldName, valueFieldName, optionalLabel) {
      var maxTooltipLimit = 10;
      var isTooltipGreatrtthenLimit = false;
      var moreTooltipText = '<br />more...';
      if (displayList && displayList.length && selectedModdel && ((Array.isArray(selectedModdel) ? selectedModdel.length : true))) {
        let toolTipText;
        if (Array.isArray(selectedModdel)) {
          toolTipText = displayList.filter((item) => item[idFieldName] && selectedModdel.includes(item[idFieldName].toString()));
        }
        else {
          toolTipText = displayList.filter((item) => item[idFieldName] === selectedModdel);
        }
        if (toolTipText && toolTipText.length > maxTooltipLimit) {
          toolTipText = toolTipText.splice(0, maxTooltipLimit);
          isTooltipGreatrtthenLimit = true;
        }
        toolTipText = toolTipText.map((a) => a[valueFieldName]);
        return (optionalLabel ? (optionalLabel + ': ') : '') + toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '') + (optionalLabel ? '<br />' : '');
      }
      else {
        return '';
      }
    }

    const generateSearchCriteria = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.generateFilterChip = false;
      let assyIds = [];

      assyIds = _.uniq(_.compact([..._.map(vm.assyMfgPn, 'id')]));
      if (assyIds && assyIds.length > 0) {
        vm.pagingInfo.assyIds = assyIds.join(',');
        vm.generateFilterChip = true;
        vm.ActivityTrackingAdvanceFilter.PartId.isDeleted = false;
      } else {
        vm.pagingInfo.assyIds = null;
        vm.ActivityTrackingAdvanceFilter.PartId.isDeleted = true;
      }

      if (vm.employeeDetailModel && vm.employeeDetailModel.length > 0) {
        vm.pagingInfo.employeeIds = vm.employeeDetailModel.join(',');
        vm.generateFilterChip = true;
        vm.ActivityTrackingAdvanceFilter.Personnel.isDeleted = false;
        vm.ActivityTrackingAdvanceFilter.Personnel.tooltip = getFilterTooltip(vm.employeeListToDisplay, vm.employeeDetailModel, 'id', 'empCodeName');
      } else {
        vm.pagingInfo.employeeIds = null;
        vm.ActivityTrackingAdvanceFilter.Personnel.isDeleted = true;
      }

      let strTransTypeFilter = '';
      if (!(vm.isBOMType && vm.isCosting && vm.isKit)) {
        if (vm.isBOMType) {
          strTransTypeFilter = stringFormat('{0},{1}', strTransTypeFilter, vm.transactionType[1].id);
          vm.ActivityTrackingAdvanceFilter.TransactionType.tooltip = vm.transactionType[1].value;
        }
        if (vm.isCosting) {
          strTransTypeFilter = stringFormat('{0},{1}', strTransTypeFilter, vm.transactionType[2].id);
          vm.ActivityTrackingAdvanceFilter.TransactionType.tooltip = vm.transactionType[2].value;
        }
        if (vm.isKit) {
          strTransTypeFilter = stringFormat('{0},{1}', strTransTypeFilter, vm.transactionType[3].id);
          vm.ActivityTrackingAdvanceFilter.TransactionType.tooltip = vm.transactionType[3].value;
        }
      }
      vm.ActivityTrackingAdvanceFilter.TransactionType.tooltip = vm.isBOMType && vm.isCosting && vm.isKit ? vm.transactionType[0].value : vm.ActivityTrackingAdvanceFilter.TransactionType.tooltip;
      vm.pagingInfo.transactionType = strTransTypeFilter && strTransTypeFilter.length > 0 ? strTransTypeFilter.substring(1) : '';
      vm.ActivityTrackingAdvanceFilter.TransactionType.isDeleted = !(vm.isBOMType || vm.isCosting || vm.isKit);

      let strActivityTypeFilter = '';
      if (!(vm.isProduction && vm.isSetup)) {
        if (vm.isProduction) {
          strActivityTypeFilter = stringFormat('{0},{1}', strActivityTypeFilter, vm.activityType[1].id);
          vm.ActivityTrackingAdvanceFilter.ActivityType.tooltip = vm.activityType[1].value;
        }
        if (vm.isSetup) {
          strActivityTypeFilter = stringFormat('{0},{1}', strActivityTypeFilter, vm.activityType[2].id);
          vm.ActivityTrackingAdvanceFilter.ActivityType.tooltip = vm.activityType[2].value;
        }
      }

      vm.ActivityTrackingAdvanceFilter.ActivityType.tooltip = vm.isProduction && vm.isSetup ? vm.activityType[0].value : vm.ActivityTrackingAdvanceFilter.ActivityType.tooltip;
      vm.pagingInfo.activityType = strActivityTypeFilter && strActivityTypeFilter.length > 0 ? strActivityTypeFilter.substring(1) : '';
      vm.ActivityTrackingAdvanceFilter.ActivityType.isDeleted = !(vm.isProduction || vm.isSetup);

      vm.generateFilterChip = vm.generateFilterChip ? vm.generateFilterChip : (!vm.ActivityTrackingAdvanceFilter.ActivityType.isDeleted || !vm.ActivityTrackingAdvanceFilter.TransactionType.isDeleted);
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (trans, isGetDataDown) => {
      if (trans && trans.data && trans.data.activityList) {
        if (!isGetDataDown) {
          vm.sourceData = trans.data.activityList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (trans.data.activityList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(trans.data.activityList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        if (vm.sourceData && vm.sourceData.length > 0) {
          _.map(vm.sourceData, (item) => {
            item.isDisabledUpdate = !vm.isEnableModification && (vm.userID !== item.employeeID);
            item.isDisabledDelete = !vm.isEnableModification;
          });
        }

        // must set after new data comes
        vm.totalSourceDataCount = trans.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.generateFilterChip) {
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

    /* retrieve activity tracking manual entry list*/
    vm.loadData = () => {
      generateSearchCriteria();
      vm.pagingInfo.transType = vm.transType;
      vm.cgBusyLoading = BOMFactory.retrieveManualEntryList().query(vm.pagingInfo).$promise.then((res) => {
        if (res && res.data && res.data.activityList) {
          setDataAfterGetAPICall(res, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = BOMFactory.retrieveManualEntryList().query(vm.pagingInfo).$promise.then((res) => {
        if (res && res.data && res.data.activityList) {
          setDataAfterGetAPICall(res, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // update employee burden rate/ payment mode
    vm.updateEmployeeDetails = () => {
      if (vm.selectedRowsList.length > 0) {
        const objDetail = {
          ids: vm.selectedRowsList.map((assyTransItem) => assyTransItem.id)
        };
        DialogFactory.dialogService(
          CORE.BURDEN_PAYMENT_MODAL_CONTROLLER,
          CORE.BURDEN_PAYMENT_MODAL_VIEW,
          null,
          objDetail).then(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
          }, () => {
            BaseService.currentPagePopupForm = [];
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    // update manual entry of activity tracking tran
    vm.updateRecord = (row) => {
      if (row.entity.isDisabledUpdate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
        messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToUpdateDeleteActivityEntryManually);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        BaseService.openInNew(TRANSACTION.MANAGE_MANUAL_ENTRY_STATE, { transType: row.entity.transactionType, refTransId: row.entity.refTransID, id: row.entity.id });
      }
    };

    // delete manual entry of activity tracking tran
    vm.deleteRecord = (assyTrans) => {
      if (!vm.isEnableModification) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
        messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.AllowToUpdateDeleteActivityEntryManually);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        let selectedIDs = [];
        if (assyTrans) {
          selectedIDs.push(assyTrans.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((assyTransItem) => assyTransItem.id);
          }
        }

        if (selectedIDs) {
          const obj = {
            title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Activity History'),
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, 'activity history'),
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.confirmDiolog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = BOMFactory.deleteAssyTransHistory().query({
                objIDs: objIDs
              }).$promise.then(() => {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const alertModel = {
            title: USER.USER_ERROR_LABEL,
            textContent: stringFormat(USER.SELECT_ONE_LABEL, 'activity history'),
            multiple: true
          };
          DialogFactory.alertDialog(alertModel);
        }
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
  }
})();
