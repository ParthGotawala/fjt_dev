(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('PartDynamicAttributeController', PartDynamicAttributeController);

  /** @ngInject */
  function PartDynamicAttributeController(USER, $scope, $filter, CORE, RFQSettingFactory, BaseService, $timeout, DialogFactory, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.isViewAlias = false;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PART_DYNAMIC_ATTRIBUTE;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.dateDisplayFormat = _dateDisplayFormat;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.attributeTypeList = CORE.AttributeTypeDropdown;
    vm.isEditIntigrate = false;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
      cellTemplate: '<grid-action-view grid="grid" row="row" style="overflow: hidden;padding:5px;overflow: hidden; white-space: nowrap;" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true,
      maxWidth: '100'
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      maxWidth: '80'
    }, {
      field: 'icon',
      displayName: 'Icon',
      width: '90',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">' +
        '<span>' +
        '<img class="cm-country-image h-45" ng-src="{{COL_FIELD}}">' +
        '</span>' +
        '</div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      enableCellEdit: false
    }, {
      field: 'attributeName',
      displayName: 'Attribute Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300',
      maxWidth: '500'
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
      field: 'fieldType',
      displayName: 'Data Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '150',
      maxWidth: '250'
    }, {
      field: 'defaultValue',
      displayName: 'Default Value',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200',
      maxWidth: '350',
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '300',
      maxWidth: '1000'
    }, {
      field: 'isActiveConvertedValue',
      width: '120',
      displayName: 'Status',
      cellTemplate: '<div class="ui-grid-cell-contents">' +
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
      enableCellEdit: false,
      ColumnDataType: 'StringEquals'
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
    vm.sourceHeader.unshift({
      field: 'Apply',
      headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
      width: '75',
      cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setPartAttributeRemove(row.entity)"></md-checkbox></div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true,
      maxWidth: '80',
      enableColumnMoving: false,
      manualAddedCheckbox: true
    });
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
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Part Operational Attribute.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[62].PageName
    };

    function setDataAfterGetAPICall(partStatus, isGetDataDown) {
      if (partStatus && partStatus.data.PartStatus) {
        if (!isGetDataDown) {
          vm.sourceData = partStatus.data.PartStatus;
          vm.currentdata = vm.sourceData.length;
        } else if (partStatus.data.PartStatus.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(partStatus.data.PartStatus);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          vm.sourceData.map((item) => {
            if (!item.icon || item.icon === '') {
              item.icon = CORE.WEB_URL + CORE.NO_IMAGE_OPERATIONAL_ATTRIBUTES;
            } else {
              item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + item.icon;
            }
            if (item.fieldType === vm.attributeTypeList[3].fieldType && item.defaultValue) {
              item.defaultValue = $filter('date')(new Date(item.defaultValue), _dateDisplayFormat);
            }
          });
        }
        // must set after new data comes
        vm.totalSourceDataCount = partStatus.data.Count;
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          } else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
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
        if (!isGetDataDown && !vm.isEditIntigrate) {
          cellEdit();
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

    /* retrieve Part Status list*/
    vm.loadData = () => {
      vm.Apply = false;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = RFQSettingFactory.retrivePartDynamicAttributeList().query(vm.pagingInfo).$promise.then((partStatus) => {
        if (partStatus.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(partStatus, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = RFQSettingFactory.retrivePartDynamicAttributeList().query(vm.pagingInfo).$promise.then((partStatus) => {
        if (partStatus) {
          setDataAfterGetAPICall(partStatus, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // delete part Operational Attribute
    vm.deleteRecord = (partdynamicattribute) => {
      let selectedIDs = [];
      if (partdynamicattribute) {
        selectedIDs.push(partdynamicattribute.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((partdynamicattributeItem) => partdynamicattributeItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Part Operational Attribute', selectedIDs.length);
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
            vm.cgBusyLoading = RFQSettingFactory.deletePartDynamicAttribute().query({
              objIDs: objIDs
            }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const data = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.part_dynamic_attribute
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return RFQSettingFactory.deletePartDynamicAttribute().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = partdynamicattribute ? partdynamicattribute.attributeName : null;
                    data.PageName = CORE.PageName.part_dynamic_attribute;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => { }, () => { });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Part Operational Attribute');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
    //open popup for add edit new part status
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_PART_DYNAMIC_ATTRIBUTE_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then((result) => {
          if (result) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }
        }, (error) => BaseService.getErrorLog(error));
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
          const dynamicAttributeModel = {
            displayOrder: newvalue,
            id: rowEntity.id
          };
          vm.cgBusyLoading = RFQSettingFactory.updateDynamicAttributeDisplayOrder().save(dynamicAttributeModel).$promise.then((res) => {
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

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* Update part status */
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    //refresh part status
    vm.refreshPartStatus = () => {
      vm.loadData();
    };

    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectStatus);
      } else {
        _.map(vm.sourceData, unselectStatus);
      }
    };
    const selectStatus = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };
    const unselectStatus = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };
    vm.setPartAttributeRemove = (row) => {
      const totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      const selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };
    //close popup on part status
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }
})();
