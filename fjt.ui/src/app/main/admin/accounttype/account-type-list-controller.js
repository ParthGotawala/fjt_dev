(function () {
  'use strict';

  angular
    .module('app.admin.accounttype')
    .controller('AccountTypeController', AccountTypeController);

  /** @ngInject */
  function AccountTypeController(CORE, USER, $timeout, DialogFactory, BaseService, AccountTypeFactory, $scope, $mdDialog) {
    const vm = this;
    vm.gridConfig = CORE.gridConfig;
    vm.Account_Type = CORE.Account_Type;
    vm.pageLabel = vm.Account_Type.SINGLELABEL;
    vm.IsSubTypeGridHeaderDropdown = CORE.IsSubTypeGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.loginUser = BaseService.loginUser;
    vm.isUpdatable = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isEditIntigrate = false;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ACCOUNT_TYPE;
    _.find(vm.loginUser.roles, (role) => {
      if (role.id === vm.loginUser.defaultLoginRoleID) {
        vm.defaultRole = role.name.toLowerCase();
      }
    });
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    const isEnableGridOption = vm.defaultRole === CORE.Role.SuperAdmin.toLowerCase() || vm.defaultRole === CORE.Role.Executive.toLowerCase() ? false : true;

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '90',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'systemid',
        displayName: vm.LabelConstant.COMMON.SystemID,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140',
        allowCellFocus: false,
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'class_name',
        displayName: vm.Account_Type.SINGLELABEL,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="text-align:center">{{ COL_FIELD }}</div>',
        width: 250
      },
      {
        field: 'class_code',
        displayName: vm.Account_Type.AccountCode,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="text-align:center">{{ COL_FIELD }}</div>',
        width: 180
      },
      {
        field: 'isSubTypeConvertedValue',
        displayName: vm.Account_Type.SubAccount,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  class="label-box" \
                                            ng-class="{\'label-success\':row.entity.isSubType == true, \
                                            \'label-warning\':row.entity.isSubType == false}"> \
                                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.IsSubTypeGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120,
        enableCellEdit: false
      },
      {
        field: 'parent_account_type',
        displayName: vm.Account_Type.ParentAccountType,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.parent_class_id"><a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateRecord({class_id: row.entity.parent_class_id});">{{COL_FIELD}}</a></div>',
        width: 250
      },
      {
        field: 'description',
        displayName: vm.Account_Type.Description,
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.description" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
        width: 120,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'system_generated',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SYSTEM_GENERATED,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="{\'label-success\':row.entity.system_defined == true, \'label-warning\':row.entity.system_defined == false}"> {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      },
      {
        field: 'disp_order',
        displayName: vm.LabelConstant.COMMON.DisplayOrder + (!isEnableGridOption ? CORE.Modify_Grid_column_Allow_Change_Message : ''),
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
        width: CORE.DISPLAYORDER.Width,
        maxWidth: CORE.DISPLAYORDER.MaxWidth,
        enableCellEdit: !isEnableGridOption,
        type: 'number'
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updateByRoleId',
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
        field: 'createdBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createByRoleId',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
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
      exporterCsvFilename: vm.pageLabel +'.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[51].PageName
    };

    function setDataAfterGetAPICall(accountTypeList, isGetDataDown) {
      if (accountTypeList && accountTypeList.data && accountTypeList.data.AccountTypeList) {
        if (!isGetDataDown) {
          vm.sourceData = accountTypeList.data.AccountTypeList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (accountTypeList.data.AccountTypeList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(accountTypeList.data.AccountTypeList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          vm.sourceData.forEach((item) => {
            item.isDisabledDelete = item.system_defined ? true : false;
            item.isDisabledUpdate = item.isDisabledDelete;
            item.isRowSelectable = !item.isDisabledDelete;
          });
        };
        // must set after new data comes
        vm.totalSourceDataCount = accountTypeList.data.Count;
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
        if (!isGetDataDown && !vm.isEditIntigrate) {
          cellEdit();
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

    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = AccountTypeFactory.getAccountTypeList().query(vm.pagingInfo).$promise.then((accountTypeList) => {
        if (accountTypeList.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(accountTypeList, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = AccountTypeFactory.getAccountTypeList().query(vm.pagingInfo).$promise.then((accountTypeList) => {
        if (accountTypeList) {
          setDataAfterGetAPICall(accountTypeList, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //show Description
    vm.showDescriptionPopUp = (object, ev) => {
      const description = object && object.description ? angular.copy(object.description).replace(/\n/g, '<br/>') : null;
      const data = {
        title: vm.Account_Type.Description,
        description: description
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // Delete Account type
    vm.deleteRecord = (accounttype) => {
      let selectedIDs = [];
      if (accounttype) {
        selectedIDs.push(accounttype.class_id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((accounttypeitem) => accounttypeitem.class_id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.pageLabel, selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          class_id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((response) => {
          if (response) {
            vm.cgBusyLoading = AccountTypeFactory.deleteAccountType().query({ objIDs: objIDs }).$promise.then((response) => {
              if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                const data = {
                  TotalCount: response.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PAGENAME_CONSTANT[51].PageName
                };
                objIDs.CountList = true;
                BaseService.deleteAlertMessageWithHistory(data, (ev) => AccountTypeFactory.deleteAccountType().query({
                  objIDs: objIDs
                }).$promise.then((res) => {
                  let data = {};
                  data = res.data;
                  data.pageTitle = accounttype ? accounttype.class_name : null;
                  data.PageName = CORE.PAGENAME_CONSTANT[51].PageName;
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
                }).catch((error) => BaseService.getErrorLog(error)));
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
        messageContent.message = stringFormat(messageContent.message, vm.pageLabel);
        const alertModel = {
          messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        const obj = _.find(vm.sourceData, (item) => item.class_id === rowEntity.class_id);
        const index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'disp_order' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const accountTypeData = {
            disp_order: newvalue,
            class_id: rowEntity.class_id,
            class_name: rowEntity.class_name,
            class_code: rowEntity.class_code
          };
          vm.cgBusyLoading = AccountTypeFactory.saveAccountType().query(accountTypeData).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                rowEntity.disp_order = oldvalue;
              } else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    }

    /* Add/Update record */
    vm.updateRecord = (row, ev) => {
      DialogFactory.dialogService(
        USER.MANAGE_ACCOUNT_TYPE_MODAL_CONTROLLER,
        USER.MANAGE_ACCOUNT_TYPE_MODAL_VIEW,
        ev,
        row && row.entity ? row.entity : row).then(() => {
        }, (data) => {
          if (data) {
            vm.loadData();
          }
        }, (error) => BaseService.getErrorLog(error));
    };
    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => vm.deleteRecord();
    $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));
  }
})();
