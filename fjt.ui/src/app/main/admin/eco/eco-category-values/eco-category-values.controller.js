(function () {
  'use strict';

  angular
    .module('app.admin.eco')
    .controller('ECOCategoryValuesController', ECOCategoryValuesController);

  /** @ngInject */
  function ECOCategoryValuesController(USER, $stateParams, $q, $scope, CORE, ECOFactory, BaseService, $timeout, DialogFactory, $mdDialog) {  // eslint-disable-line func-names
    const vm = this;
    vm.isUpdatable = true;
    vm.EmptyMesssage = ($stateParams.categoryType === 1) ? USER.ADMIN_EMPTYSTATE.ECO_CATEGORY_VALUES : vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.QUOTE_TERMS_CONDITIONS_CATEGORY_VALUES;
    vm.noteRequiredStatusGridHeaderDropdown = CORE.noteRequiredStatusGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.categoryArray = CORE.CategoryTypeLabel;
    const categoryLabelID = _.find(vm.categoryArray, (item) => item.id.toString() === $stateParams.categoryType);
    vm.categoryLabel = categoryLabelID.value ? categoryLabelID.value : '';
    vm.categoryType = $stateParams.categoryType ? $stateParams.categoryType : null;
    vm.isEditIntigrate = false;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.categoryArray = CORE.ECOTypeCategoryDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    let allCategoryFilter = [];
    const defaultObj = {
      id: null,
      value: 'All'
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '80',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true,
      enableCellEdit: false
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
      width: '350',
      enableCellEdit: false
    }, {
      field: 'ecoTypeCatName',
      displayName: vm.categoryLabel + ' Category',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.ecoTypeCatName}}</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        options: allCategoryFilter
      },
      ColumnDataType: 'StringEquals',
      width: '230',
      enableCellEdit: false
    }, {
      field: 'displayOrder',
      displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: CORE.DISPLAYORDER.CellTemplate,
      editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
      width: CORE.DISPLAYORDER.Width,
      maxWidth: CORE.DISPLAYORDER.MaxWidth,
      type: 'number',
      enableCellEdit: true
    }, {
      field: 'noteRequiredConvertedValue',
      displayName: 'Note Required',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
        + '<span class="label-box" ng-if=\'row.entity.noteRequired == true\' \
                            ng-class="{\'label-success\':row.entity.noteRequired == true, \
                          \'label-warning\':row.entity.noteRequired == false}"> \
                                {{ COL_FIELD }}'
        + '</span>'
        + '</div>',
      ColumnDataType: 'StringEquals',
      width: 125,
      enableCellEdit: false
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
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }
      , {
      field: 'SyatemGeneratedValue',
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
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        CategoryType: vm.categoryType
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
      exporterCsvFilename: stringFormat('{0}{1}{2}', vm.categoryLabel, ' Attributes', '.csv'),
      CurrentPage: CORE.PAGENAME_CONSTANT[0].PageName
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (ecotypevalue, isGetDataDown) => {
      if (ecotypevalue && ecotypevalue.data && ecotypevalue.data.ecoTypevalues) {
        if (!isGetDataDown) {
          vm.sourceData = ecotypevalue.data.ecoTypevalues;
          vm.currentdata = vm.sourceData.length;
        }
        else if (ecotypevalue.data.ecoTypevalues.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(ecotypevalue.data.ecoTypevalues);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        _.map(vm.sourceData, (item) => {
          item.isDisabledDelete = item.systemGenerated;
        });

        // must set after new data comes
        vm.totalSourceDataCount = ecotypevalue.data.Count;
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
          if (!vm.isEditIntigrate) {
            cellEdit();
          }
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
      const gridAndDropDownPromise = [initGirdBinding(), getECOCategoryList()];
      vm.cgBusyLoading = $q.all(gridAndDropDownPromise).then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const initGirdBinding = () => {
      vm.cgBusyLoading = ECOFactory.retriveECOTypeValuesList().query(vm.pagingInfo).$promise.then((ecotypevalue) => {
        if (ecotypevalue && ecotypevalue.data) {
          setDataAfterGetAPICall(ecotypevalue, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const getECOCategoryList = () => ECOFactory.getECOCategoryList().save({ categoryType: vm.categoryType }).$promise.then((res) => {
      if (res && res.data) {
        const categoryAllData = res.data;
        allCategoryFilter = [];
        allCategoryFilter[0] = defaultObj;
        _.map(categoryAllData, (data) => {
          const _obj = {};
          _obj.id = data.name;
          _obj.value = data.name;
          allCategoryFilter.push(_obj);
        });
      }
      vm.sourceHeader[3].filter.options = allCategoryFilter;
      return allCategoryFilter;
    }).catch((error) => BaseService.getErrorLog(error));

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ECOFactory.retriveECOTypeValuesList().query(vm.pagingInfo).$promise.then((ecotypevalue) => {
        if (ecotypevalue && ecotypevalue.data) {
          setDataAfterGetAPICall(ecotypevalue, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedUser = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    //Update cell for display order field
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.ecoTypeValID === rowEntity.ecoTypeValID);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const ecoCategoryInfo = {
            displayOrder: newvalue,
            ecoTypeValID: rowEntity.ecoTypeValID,
            name: rowEntity.name,
            ecoTypeCatID: rowEntity.ecoTypeCatID,
            category: vm.categoryType
          };
          vm.cgBusyLoading = ECOFactory.ECOTypeValue().update({ ecoTypeValID: rowEntity.ecoTypeValID }, ecoCategoryInfo).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                rowEntity.displayOrder = oldvalue;
              }
              else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.loadData();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));

        }
      });
    }

    /* delete ECO category Type list*/
    vm.deleteRecord = (ecoCategoryTypeList) => {
      let selectedIDs = [];
      if (ecoCategoryTypeList) {
        selectedIDs.push(ecoCategoryTypeList.ecoTypeValID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((ecoCategoryListItem) => ecoCategoryListItem.ecoTypeValID);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.categoryLabel + ' category type attribute', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          category: vm.categoryType,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ECOFactory.deleteECOTypeValue().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: $stateParams.categoryType === 1 ? CORE.PageName.eco_type_values : CORE.PageName.quote_terms_and_conditions_attributes
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true,
                      category: vm.categoryType
                    };
                    return ECOFactory.deleteECOTypeValue().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = ecoCategoryTypeList ? ecoCategoryTypeList.name : null;
                      data.PageName = $stateParams.categoryType === 1 ? CORE.PageName.eco_type_values : CORE.PageName.quote_terms_and_conditions_attributes;
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
        messageContent.message = stringFormat(messageContent.message, vm.categoryLabel + ' category type attribute');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* ECO Category TYPE VALUE*/
    vm.updateRecord = (row, ev) => {
      vm.addEditRecord(row.entity, ev);
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* add ECOCategory TYPE VALUE*/
    vm.addEditRecord = (data, ev) => {
      if (data) {
        data.categoryType = (data.category ? data.category : $stateParams.categoryType) || null;
      }
      else {
        data = { categoryType: $stateParams.categoryType };
      }
      DialogFactory.dialogService(
        USER.ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.sourceHeader[3].filter.options = defaultObj;
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
