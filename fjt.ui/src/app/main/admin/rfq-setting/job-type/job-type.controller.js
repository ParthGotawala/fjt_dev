(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('JobTypeController', JobTypeController);

  /** @ngInject */
  function JobTypeController(USER, $scope, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
    const vm = this;
    //vm.view = true;
    vm.isUpdatable = vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.JOB_TYPE;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
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
      field: 'name',
      displayName: 'Job Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '370'
    }, {
      field: 'shortname',
      displayName: 'Short Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '170'
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
      width: '500'
    }, {
      field: 'termsandcondition',
      displayName: 'Notes',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.termsandcondition" ng-click="grid.appScope.$parent.vm.viewRecord(row.entity, $event)"> \
                                   View \
                                </md-button>',
      width: 120,
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false,
      type: 'html'
    }, {
      field: 'laborCostingValue',
      displayName: 'Labor Costing',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                    ng-class="{\'label-success\':row.entity.isLaborCosting == true, \
                    \'label-warning\':row.entity.isLaborCosting == false}"> \
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
      field: 'materialCostingValue',
      displayName: 'Material Costing',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                ng-class="{\'label-success\':row.entity.isMaterialCosting == true, \
                \'label-warning\':row.entity.isMaterialCosting == false}"> \
                    {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }, {
      field: 'activeConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.StatusOptionsGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
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
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: false
    }, {
      field: 'SystemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"> <span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }} </span> </div>',
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
        // Page: CORE.UIGrid.Page(),
        //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [['name', 'ASC']],
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
      exporterCsvFilename: 'Job Type.csv',
      currentpage: CORE.PAGENAME_CONSTANT[26].PageName
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (jobtype, isGetDataDown) => {
      if (jobtype && jobtype.data && jobtype.data.JobType) {
        if (!isGetDataDown) {
          vm.sourceData = jobtype.data.JobType;
          vm.currentdata = vm.sourceData.length;
          vm.sourceData.forEach((item) => {
            item.isDisabledDelete = item.systemGenerated;
            item.isRowSelectable = !item.systemGenerated;
          });
        }
        else if (jobtype.data.JobType.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(jobtype.data.JobType);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = jobtype.data.Count;
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

    /* retrieve Users list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.retriveJobTypeList().query(vm.pagingInfo).$promise.then((jobtype) => {
        if (jobtype && jobtype.data) {
          setDataAfterGetAPICall(jobtype, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retriveJobTypeList().query(vm.pagingInfo).$promise.then((jobtype) => {
        if (jobtype && jobtype.data) {
          setDataAfterGetAPICall(jobtype, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // delete job type
    vm.deleteRecord = (jobTypes) => {
      let selectedIDs = [];
      if (jobTypes) {
        selectedIDs.push(jobTypes.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((jobTypesItem) => jobTypesItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Job Type', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = RFQSettingFactory.deleteJobType().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const details = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.job_type
                };
                BaseService.deleteAlertMessageWithHistory(details, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return RFQSettingFactory.deleteJobType().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = jobTypes ? jobTypes.name : null;
                    data.PageName = CORE.PageName.job_type;
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
              }
              else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Job Types');
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    vm.viewRecord = (item, $event) => {
      const obj = {
        title: 'Notes',
        description: item.termsandcondition
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        $event,
        data).then((response) => {
          item.termsandcondition = response;
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_JOB_TYPES_MODAL_CONTROLLER,
        CORE.MANAGE_JOB_TYPES_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        },
          () => {
          });
    };

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

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      row.title = `${CORE.PAGENAME_CONSTANT[26].PageName} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.JOBTYPE;
      row.EmptyMesssage = CORE.COMMON_HISTORY.JOBTYPE.HISTORY_EMPTY_MESSAGE;
      row.headerData = [{
        label: CORE.PAGENAME_CONSTANT[26].PageName,
        value: row.name,
        displayOrder: 1,
        labelLinkFn: vm.gotoJobTypeList
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Jobtype list page. */
    vm.gotoJobTypeList = () => BaseService.goToJobTypeList();

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update Job type */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
