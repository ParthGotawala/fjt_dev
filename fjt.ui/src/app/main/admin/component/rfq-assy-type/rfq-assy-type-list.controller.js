(function () {
  'use strict';

  angular
    .module('app.admin.assyType')
    .controller('RFQAssyTypeListController', RFQAssyTypeListController);

  /** @ngInject */
  function RFQAssyTypeListController(USER, $scope, CORE, AssyTypeFactory, BaseService, $timeout, DialogFactory, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSEMBLYTYPE;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isEditIntigrate = false;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

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
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'name',
        displayName: 'Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '400'
      },
      {
        field: 'displayOrder',
        displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
        width: CORE.DISPLAYORDER.Width,
        maxWidth: CORE.DISPLAYORDER.MaxWidth,
        enableCellEdit: true,
        type: 'number'
      },
      {
        field: 'noOfSide',
        displayName: ' Number of SMT Sides',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '110'
      }, {
        field: 'activeConvertedValue',
        displayName: 'Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isActive == true, \
                                                            \'label-warning\':row.entity.isActive == false}"> \
                                                                {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120
      }, {
        field: 'pcbValue',
        displayName: 'Requires PCB',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" \
                                                            ng-class="{\'label-success\':row.entity.isPCBRequire == true, \
                                                            \'label-warning\':row.entity.isPCBRequire == false}"> \
                                                                {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.KeywordStatusGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 150
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
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        //ItemsPerPage: CORE.UIGrid.ItemsPerPage(),
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
      exporterCsvFilename: 'Assembly Type.csv'
    };

    function setDataAfterGetAPICall(assyType, isGetDataDown) {
      if (assyType && assyType.data.AssyType) {
        if (!isGetDataDown) {
          vm.sourceData = assyType.data.AssyType;
          vm.currentdata = vm.sourceData.length;
        } else if (assyType.data.AssyType.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(assyType.data.AssyType);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = assyType.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
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
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        } else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          } else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    /* retrieve assembly type list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = AssyTypeFactory.retriveAssyTypeList().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = AssyTypeFactory.retriveAssyTypeList().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*add/edit assy type details*/
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_ASSY_TYPE_MODAL_CONTROLLER,
        CORE.MANAGE_ASSY_TYPE_MODAL_MODAL_VIEW,
        ev,
        data).then((data) => {
        if (data) {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }
      }, (error) => BaseService.getErrorLog(error));
    };

    /* Update Component Standards class */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    //Update cell for display order flied
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const assyTypeModel = {
            displayOrder: newvalue,
            id: rowEntity.id
          };
          vm.cgBusyLoading = AssyTypeFactory.updateAssyTypeDisplayOrder().save(assyTypeModel).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED || res.status === CORE.ApiResponseTypeStatus.EMPTY) {
                rowEntity.displayOrder = oldvalue;
              } else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    }

    // delete assembly type
    vm.deleteRecord = (assyType) => {
      let selectedIDs = [];
      if (assyType) {
        selectedIDs.push(assyType.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((assyTypeItem) => assyTypeItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Assembly Type', selectedIDs.length);
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
            vm.cgBusyLoading = AssyTypeFactory.deleteAssyType().query({
              objIDs: objIDs
            }).$promise.then((assyTypeData) => {
              if (assyTypeData && assyTypeData.data && (assyTypeData.data.length > 0 || assyTypeData.data.transactionDetails)) {
                const data = {
                  TotalCount: assyTypeData.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.assembly_types
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return AssyTypeFactory.deleteAssyType().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = assyType ? assyType.name : null;
                    data.PageName = CORE.PageName.assembly_types;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {}, () => {});
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {}).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContnet = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContnet.message = stringFormat(messageContnet.message, 'Assembly Type(s)');
        const alertModel = {
          messageContent: messageContnet
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
