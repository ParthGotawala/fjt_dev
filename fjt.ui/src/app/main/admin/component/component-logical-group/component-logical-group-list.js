(function () {
  'use strict';
  angular
    .module('app.admin.componentLogicalGroup')
    .controller('ComponentLogicalGroupController', ComponentLogicalGroupController);

  /** @ngInject */
  function ComponentLogicalGroupController(USER, $scope, CORE, ComponentLogicalGroupFactory, BaseService, $timeout, DialogFactory) {  // eslint-disable-line func-names
    const vm = this;
    vm.isAssignMountingType = true;
    vm.isUpdatable = true;
    vm.IsLogicalGroup = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.MOUNTING_GROUP;
    vm.PartStatusCommonDropdown = CORE.PartStatusCommonDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

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
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '400'
    }, {
      field: 'aliaslist',
      displayName: 'Mounting Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '400'
    }, {
      field: 'isActiveConvertedValue',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isActive == true, \
                            \'label-warning\':row.entity.isActive == false}"> \
                                {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.PartStatusCommonDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD |date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
      type: 'datetime'
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
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'SyatemGeneratedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" ng-class="{\'label-success\':row.entity.systemGenerated == true, \'label-warning\':row.entity.systemGenerated == false}"> {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
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
      exporterCsvFilename: 'Mounting Group.csv'
    };

    function setDataAfterGetAPICall(mountinggroup, isGetDataDown) {
      if (mountinggroup && mountinggroup.data.component_logical_group) {
        if (!isGetDataDown) {
          vm.sourceData = mountinggroup.data.component_logical_group;
          vm.currentdata = vm.sourceData.length;
        }
        else if (mountinggroup.data.component_logical_group.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(mountinggroup.data.component_logical_group);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = mountinggroup.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        let selectedRevID;
        if (vm.sourceData && vm.sourceData.length > 0) {
          if (!selectedRevID) {
            vm.id = _.first(vm.sourceData).id;
          }
          else {
            vm.id = selectedRevID;
          }
          _.each(vm.sourceData, (item) => {
            item.isCustomerAlias = true;
            if (!item.isAllowDelete && item.systemGenerated === 1) {
              item.isDisabledUpdate = true;
              item.isDisabledDelete = true;
              item.isRowSelectable = false;
              item.isViewAlias = false;
            }
          });
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

    /* retrieve component logical group list*/
    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['name', 'ASC']];
      }
      vm.pagingInfo.IsLogicalGroup = vm.IsLogicalGroup;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = ComponentLogicalGroupFactory.retriveComponentLogicalGroup().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* Add part logical group Alias */
    vm.assignMountingType = (row, ev) => {
      var model = {
        id: row.id,
        name: row.name
      };
      DialogFactory.dialogService(
        CORE.COMPONENT_LOGICAL_GROUP_ALIAS_CONTROLLER,
        CORE.COMPONENT_LOGICAL_GROUP_ALIAS_VIEW,
        ev,
        model).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (error) => BaseService.getErrorLog(error));
    };
    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ComponentLogicalGroupFactory.retriveComponentLogicalGroup().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_COMPONENT_LOGICAL_GROUP_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_COMPONENT_LOGICAL_GROUP_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then((data) => {
          if (data) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (error) => BaseService.getErrorLog(error));
    };
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };
    // delete Component Logical Group
    vm.deleteRecord = (componentStandardclass) => {
      let selectedIDs = [];
      if (componentStandardclass) {
        selectedIDs.push(componentStandardclass.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((componentStandardclassItem) => componentStandardclassItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Mounting Group(s)', selectedIDs.length);
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
            vm.cgBusyLoading = ComponentLogicalGroupFactory.deleteComponentLogicalGroup().query({ objIDs: objIDs }).$promise.then((response) => {
              if (response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                const data = {
                  TotalCount: response.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.mounting_group
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const objIDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return vm.cgBusyLoading = ComponentLogicalGroupFactory.deleteComponentLogicalGroup().save({
                    objIDs: objIDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = componentStandardclass ? componentStandardclass.name : null;
                    data.PageName = CORE.PageName.mounting_group;
                    data.id = selectedIDs;
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
        messageContent.message = stringFormat(messageContent.message, 'Mounting Group');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
  }
})();
