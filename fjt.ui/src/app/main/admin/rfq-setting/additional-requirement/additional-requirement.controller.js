(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('AdditionalRequirementController', AdditionalRequirementController);

  /** @ngInject */
  function AdditionalRequirementController(USER, $scope, $state, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
    const vm = this;
    vm.view = false;
    vm.isUpdatable = true;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'History';
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.categoryArray = angular.copy(CORE.RequitementCategoryDropdown);
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.RequirementCategoryArr = CORE.RequitementCategory;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.category = null;
    vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.ADDITIONAL_REQUIREMENT);
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    if ($state.params && $state.params.category) {
      vm.category = $state.params.category;
      const label = CORE.RequitementCategory[2].value;
      vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, label + ' Template');
      vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, label + ' Template');
    } else {
      vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, 'RFQ Requirement Template');
      vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, 'RFQ Requirement Template');
    }
    if (!vm.category) {
      vm.categoryArray = _.filter(vm.categoryArray, (item) => item.value !== vm.RequirementCategoryArr[2].value);
    }
    const objCatgory = {
      field: 'reqCategory',
      displayName: 'Category',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                                ng-class="{\'label-success\':row.entity.category == 1, \
                                         \'label-warning\':row.entity.category == 2, \
                                         \'label-primary\':row.entity.category == 3}"> \
                                {{row.entity.reqCategory}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.categoryArray
      },
      ColumnDataType: 'StringEquals',
      width: '250'
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '75',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE, enableFiltering: false,
      enableSorting: false
    }, {
      field: 'name',
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300'
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
    },
    {
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
    }];

    if (!vm.category) {
      vm.sourceHeader.splice(4, 0, objCatgory);
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
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
      exporterCsvFilename: vm.category ? 'Narrative Master Template.csv' : 'RFQ Requirement Template.csv',
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return RFQSettingFactory.retriveAdditionalRequirementList().query(pagingInfoOld).$promise.then((additionalrequirement) => {
          if (additionalrequirement && additionalrequirement.data && additionalrequirement.data.AdditionalRequirement) {
            return additionalrequirement.data.AdditionalRequirement;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (additionalrequirement, isGetDataDown) => {
      if (additionalrequirement && additionalrequirement.data && additionalrequirement.data.AdditionalRequirement) {
        if (!isGetDataDown) {
          vm.sourceData = additionalrequirement.data.AdditionalRequirement;
          vm.currentdata = vm.sourceData.length;
        }
        else if (additionalrequirement.data.AdditionalRequirement.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(additionalrequirement.data.AdditionalRequirement);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = additionalrequirement.data.Count;
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

    /* retrieve Additional Requirement list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.category) {
        vm.pagingInfo.whereStatus = [vm.category];
        vm.pagingInfo.SearchColumnName = 'category';
      }
      else {
        vm.pagingInfo.whereStatus = [vm.RequirementCategoryArr[0].id, vm.RequirementCategoryArr[1].id];
        vm.pagingInfo.SearchColumnName = 'category';
      }
      vm.cgBusyLoading = RFQSettingFactory.retriveAdditionalRequirementList().query(vm.pagingInfo).$promise.then((additionalrequirement) => {
        if (additionalrequirement && additionalrequirement.data) {
          setDataAfterGetAPICall(additionalrequirement, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retriveAdditionalRequirementList().query(vm.pagingInfo).$promise.then((additionalrequirement) => {
        if (additionalrequirement && additionalrequirement.data) {
          setDataAfterGetAPICall(additionalrequirement, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // delete Additional Requirement
    vm.deleteRecord = (additionalRequirement) => {
      let selectedIDs = [];
      if (additionalRequirement) {
        selectedIDs.push(additionalRequirement.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((additionalRequirementsItem) => additionalRequirementsItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, (vm.category ? 'Narrative Master Template' : 'RFQ Requirement Template'), selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          category: vm.category,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = RFQSettingFactory.deleteAdditionalRequirement().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const data = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.requirement
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const objIDs = {
                    id: selectedIDs,
                    category: vm.category,
                    CountList: true
                  };
                  return RFQSettingFactory.deleteAdditionalRequirement().query({ objIDs: objIDs }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = additionalRequirement ? additionalRequirement.name : null;
                    data.PageName = CORE.PageName.requirement;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => { // Empty Block
                        }, () => {  // Empty Block
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
        }, () => { // Empty Block
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, (vm.category ? 'Narrative Master Template' : 'RFQ Requirement Template'));
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };


    vm.addEditRecord = (data, ev) => {
      if (vm.category) {
        data = data ? data : {};
        data.isNarrative = true;
      }
      DialogFactory.dialogService(
        CORE.MANAGE_ADDITIONAL_REQUIREMENT_MODAL_CONTROLLER,
        CORE.MANAGE_ADDITIONAL_REQUIREMENT_MODAL_VIEW,
        ev,
        data).then(() => { // Empty Block
        }, (data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        },
          () => { // Empty Block
          });
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update Additional Requirement */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
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
        popupData).then(() => { // Empty Block
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Show History Popup */
    vm.UMIDHistory = (row, ev) => {
      row.title = `${CORE.PageName.requirement} History`;
      row.TableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.REQUIREMENT;
      row.EmptyMesssage = CORE.COMMON_HISTORY.REQUIREMENT.HISTORY_EMPTY_MESSAGE;
      row.headerData = [{
        label: CORE.COMMON_HISTORY.REQUIREMENT.LABLE_NAME,
        value: row.name,
        displayOrder: 1,
        labelLinkFn: vm.goToRequirementTemplateList
      }];
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        row).then(() => { // Empty Block
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto RFQ Requirement Template list page. */
    vm.goToRequirementTemplateList = () => BaseService.goToRequirementTemplateList();

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
