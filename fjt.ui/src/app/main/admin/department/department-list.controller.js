(function () {
  'use strict';

  angular
    .module('app.admin.department')
    .controller('DepartmentController', DepartmentController);

  /** @ngInject */
  function DepartmentController(CORE, USER, $mdDialog, $state,
    $timeout, DepartmentFactory, DialogFactory, BaseService, $scope) {
    //test check in
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.DEPARTMENT;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    //vm.isDataFields = true;
    vm.entityID = CORE.AllEntityIDS.Department.ID;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '70',
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
      field: 'deptName',
      displayName: 'Name',
      width: '200'
    }, {
      field: 'deptNameOfParentDept',
      displayName: 'Parent Department Name',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      width: '250'
    }, {
      field: 'ManagerName',
      displayName: 'Manager Name',
      cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      width: '250'
    }, {
      field: 'isActiveConvertedValue',
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
      width: 130
    }, {
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
    }
      , {
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
    },
    {
      field: 'systemGeneratedConvertedValue',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.systemGenerated == true,\
                              \'label-warning\':row.entity.systemGenerated == false }"> \
                                  {{COL_FIELD}}'
        + '</span>'
        + '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      }
    }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [['deptName', 'ASC']],
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
      exporterCsvFilename: 'Department.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (department, isGetDataDown) => {
      if (department && department.data && department.data.department) {
        if (!isGetDataDown) {
          vm.sourceData = department.data.department;
          vm.currentdata = vm.sourceData.length;
        }
        else if (department.data.department.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(department.data.department);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        //vm.sourceData.map((item) => {
        //  item.isActiveStatus = (item.isActive) ? 'Active' : 'Inactive';
        //});

        // must set after new data comes
        vm.totalSourceDataCount = department.data.Count;
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

    /* retrieve Department list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = DepartmentFactory.retriveDepartmentList().query(vm.pagingInfo).$promise.then((department) => {
        if (department && department.data) {
          _.each(department.data.department, (item) => {
            if (item.systemGenerated) {
              item.isDisabledDelete = true;
              item.isRowSelectable = false;
            }
          });
          setDataAfterGetAPICall(department, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = DepartmentFactory.retriveDepartmentList().query(vm.pagingInfo).$promise.then((department) => {
        if (department && department.data) {
          setDataAfterGetAPICall(department, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedDepartment = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    vm.updateRecord = (row) => {
      $state.go(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: row ? row.entity.deptID : null });
    };

    /* delete single/multiple department */
    vm.deleteRecord = (department) => {
      let selectedIDs = [];
      if (department) {
        selectedIDs.push(department.deptID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((departmentItem) => departmentItem.deptID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Department', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          anbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((response) => {
          if (response) {
            vm.cgBusyLoading = DepartmentFactory.deleteDepartment().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.department
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return DepartmentFactory.deleteDepartment().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = department ? department.deptName : null;
                      data.PageName = CORE.PageName.department;
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
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        ////show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'department');
        const obj = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
