(function () {
  'use strict';

  angular
    .module('app.admin.unit')
    .controller('UnitController', UnitController);

  function UnitController($scope, $mdDialog, $q, $timeout, CORE, USER, DialogFactory, BaseService, UnitFactory) {
    const vm = this;
    vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.KeywordStatusGridHeaderDropdown = CORE.KeywordStatusGridHeaderDropdown;
    vm.isUpdatable = true;
    let lastRowSelected = {};
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.selectedMeasurementTypeId = null;

    // Measurement Type
    vm.EmptyMesssageMeasurementType = USER.ADMIN_EMPTYSTATE.MEASUREMENT_TYPES;
    vm.isEditIntigrateMeasurementType = false;
    vm.sourceHeaderMeasurementType = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      enableCellEdit: false,
      pinnedLeft: true
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
      <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
      </div>\
      <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
        <span> <b>{{(grid.appScope.$parent.vm.pagingInfoMeasurementType.pageSize * (grid.appScope.$parent.vm.pagingInfoMeasurementType.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
      </div>',
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false
    }, {
      field: 'name',
      width: '650',
      displayName: 'Measurement Type',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableCellEdit: false
    }, {
      field: 'displayOrder',
      type: 'number',
      displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: CORE.DISPLAYORDER.CellTemplate,
      editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
      width: CORE.DISPLAYORDER.Width,
      maxWidth: CORE.DISPLAYORDER.MaxWidth,
      enableCellEdit: true
    }, {
      field: 'isActiveConvertedValue',
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
      width: 168,
      enableCellEdit: false
    },
    {
      field: 'SystemGeneratedValue',
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
    },
    {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
    },
    {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
    },
    {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
    },
    {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_CREATED_AT
    },
    {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BY
    },
    {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
    }];

    //Unit Of Measurement
    vm.setScrollClass = 'gridScrollHeight_Unit';
    vm.EmptyMessageUOM = USER.ADMIN_EMPTYSTATE.UNIT_OF_MEASUREMENT;
    vm.isEditIntigrateUOM = false;
    vm.sourceHeaderUOM = [{
      field: 'Apply',
      headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
      width: '75',
      cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setUOMMeaserRemove(row.entity)"></md-checkbox></div>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      allowCellFocus: false,
      maxWidth: '80',
      enableColumnMoving: false,
      manualAddedCheckbox: true
    }, {
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '100',
      cellTemplate: '<grid-action-view grid="grid"  row="row" style="overflow: hidden;padding:5px !important;white-space:nowrap;" class="height-grid ui-grid-cell-contents" ></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: false,
      maxWidth: '100'
    },
    {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
      <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
      </div>\
      <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
      <span><b>{{(grid.appScope.$parent.vm.pagingInfoUOM.pageSize * (grid.appScope.$parent.vm.pagingInfoUOM.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
      </div>',
      enableFiltering: false,
      enableSorting: false,
      enableCellEdit: false
    },
    {
      field: 'abbreviation',
      displayName: 'UOM Code',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      width: '110',
      enableCellEdit: false
    },
    {
      field: 'unitName',
      displayName: 'Name',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      width: '230',
      enableCellEdit: false
    },
    {
      field: '1UOM',
      displayName: '1 UOM',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      width: '90',
      enableCellEdit: false
    },
    {
      field: 'operator',
      displayName: 'Operator',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      width: '90',
      enableCellEdit: false
    },
    {
      field: 'unitConvertValue',
      displayName: 'Conversion Factor',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      width: '150',
      enableCellEdit: false
    },
    {
      field: 'baseEquivalentValue',
      displayName: 'Base Equivalent',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableFiltering: true,
      enableSorting: true,
      width: '150',
      enableCellEdit: false
      },
      {
        field: 'baseUOM',
        displayName: 'Base UOM',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':(row.entity.baseUnitID),\
                        \'label-box label-success\':(!row.entity.baseUnitID)}"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: '120',
        allowCellFocus: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.BaseUOMDropDown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
    {
      field: 'aliaslist',
      width: '400',
      displayName: 'Alias',
      cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.uomAlias">\
                      <div layout="row" class="cm-custom-chips" >\
                       <span class="mr-5 pt-2">{{item.aliasName}} </span>\
                       <md-chips ng-repeat="source in item.sourceDetails" >\
                           <md-chip>{{source}}</md-chip>\
                        </md-chips>\
                      </div>\
                    </div> ',
      enableFiltering: true,
      enableSorting: true,
      maxWidth: '400'
    },
    {
      field: 'displayOrder',
      displayName: vm.LabelConstant.COMMON.DisplayOrder + CORE.Modify_Grid_column_Allow_Change_Message,
      cellTemplate: CORE.DISPLAYORDER.CellTemplate,
      editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
      width: CORE.DISPLAYORDER.Width,
      maxWidth: CORE.DISPLAYORDER.MaxWidth,
      enableFiltering: true,
      enableSorting: true,
      type: 'number',
      enableCellEdit: true
    },
    {
      field: 'defaultUOMConvertedValue',
      displayName: 'Default UOM',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                                    ng-class="{\'label-success\':row.entity.defaultUOM == true, \
                                    \'label-warning\':row.entity.defaultUOM == false}"> \
                                    {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 120,
      enableFiltering: true,
      enableSorting: true,
      enableCellEdit: false
    },
    {
      field: 'isFormulaConvertedValue',
      displayName: 'Formula',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                                    ng-class="{\'label-success\':row.entity.isFormula == true, \
                                    \'label-warning\':row.entity.isFormula == false}"> \
                                    {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 100,
      enableFiltering: true,
      enableSorting: true,
      enableCellEdit: false
    },
    {
      field: 'description',
      displayName: 'Description',
      cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.description" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)"> \
                                    View \
                               </md-button>',
      enableFiltering: false,
      enableSorting: false,
      width: '100',
      enableCellEdit: false
    },
    {
      field: 'isSystemDefaultConvertedValue',
      displayName: 'System Default',
      cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
        '<span class="label-box" \
                                        ng-class="{\'label-success\':row.entity.isSystemDefault == true, \
                                        \'label-warning\':row.entity.isSystemDefault == false}"> \
                                        {{ COL_FIELD }}' +
        '</span>' +
        '</div>',
      filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
      filter: {
        term: null,
        options: vm.KeywordStatusGridHeaderDropdown
      },
      ColumnDataType: 'StringEquals',
      width: 100,
      enableFiltering: true,
      enableSorting: true,
      enableCellEdit: false
    },
    {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
    },
    {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
    },
    {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
    },
    {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false,
      visible: CORE.UIGrid.VISIBLE_CREATED_AT
    },
    {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BY
    },
    {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true,
      visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
    }];


    vm.selectedType;
    let addNewMeasurementType = false;

    const initPageInfoMeasurementType = () => {
      vm.pagingInfoMeasurementType = {
        SortColumns: [],
        SearchColumns: [],
        isMesurmentTypeView: true
      };
    };

    const initPageInfoUOM = () => {
      vm.pagingInfoUOM = {
        SortColumns: [],
        SearchColumns: [],
        isUOMAlias: true,
        isUOMFormula: true
      };
    };

    initPageInfoMeasurementType();
    initPageInfoUOM();

    // initPageInfo();

    vm.gridOptionsMeasurementType = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfoMeasurementType.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Measurement Type.csv'
    };

    vm.gridOptionsUOM = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfoUOM.SearchColumns,
      exporterMenuCsv: true,
      CurrentPage: CORE.PAGENAME_CONSTANT[12].PageName,
      exporterCsvFilename: 'Unit Of Measurement.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICallMeasurementType = (measurementTypes, isGetDataDown) => {
      if (measurementTypes && measurementTypes.data && measurementTypes.data.MeasurementType) {
        _.each(measurementTypes.data.MeasurementType, (item) => {
          if (item.isDefault) {
            item.isDisabledDelete = true;
            item.isDisabledUpdate = true;
          }
          if (item.systemGenerated) {
            item.isDisabledUpdate = true;
            item.isDisabledDelete = true;
          }
        });
        if (!isGetDataDown) {
          vm.sourceDataMeasurementType = measurementTypes.data.MeasurementType;
          vm.currentdataMeasurementType = vm.sourceDataMeasurementType.length;
        }
        else if (measurementTypes.data.MeasurementType.length > 0) {
          vm.sourceDataMeasurementType = vm.gridOptionsMeasurementType.data = vm.gridOptionsMeasurementType.data.concat(measurementTypes.data.MeasurementType);
          vm.currentdataMeasurementType = vm.gridOptionsMeasurementType.currentItem = vm.gridOptionsMeasurementType.data.length;
        }


        const firstMeasurementType = addNewMeasurementType ? _.find(vm.sourceDataMeasurementType, { id: vm.lastMeasurementTypeId }) : _.first(vm.sourceDataMeasurementType);
        vm.selectedMeasurementTypeId = firstMeasurementType ? firstMeasurementType.id : null;
        lastRowSelected = firstMeasurementType;
        vm.getMeasurementTypeSelectedRow(firstMeasurementType);
        vm.pagingInfoUOM.Page = vm.gridOptionsUOM.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadDataUOM();

        // must set after new data comes
        vm.totalMeasurementTypeCount = measurementTypes.data.Count;
        if (!vm.gridOptionsMeasurementType.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptionsMeasurementType.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptionsMeasurementType.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptionsMeasurementType.clearSelectedRows();

          // const index = _.indexOf(vm.sourceDataMeasurementType, lastRowSelected);
          // vm.gridOptionsMeasurementType.clearSelectedRows();
          // vm.gridOptionsMeasurementType.gridApi.selection.selectRow(vm.gridOptionsMeasurementType.length > 0 ? vm.gridOptionsMeasurementType.data[index] : vm.sourceDataMeasurementType[0]);
          // vm.selectedType = vm.gridOptionsMeasurementType.data.length > 0 ? vm.gridOptionsMeasurementType.data[index].name : vm.sourceDataMeasurementType[0].name;

          if (!vm.isEditIntigrateMeasurementType) {
            cellEditMeasurementType();
          }
        }
        if (vm.totalMeasurementTypeCount === 0) {
          if (vm.pagingInfoMeasurementType.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundMeasurementType = false;
            vm.emptyStateMeasurementType = 0;
          }
          else {
            vm.isNoDataFoundMeasurementType = true;
            vm.emptyStateMeasurementType = null;
          }
        }
        else {
          vm.isNoDataFoundMeasurementType = false;
          vm.emptyStateMeasurementType = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGridMeasurementType();
            if (!vm.gridOptionsMeasurementType.enablePaging && vm.totalMeasurementTypeCount === vm.currentdataMeasurementType) {
              return vm.gridOptionsMeasurementType.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptionsMeasurementType.gridApi.infiniteScroll.dataLoaded(false, vm.totalMeasurementTypeCount !== vm.currentdataMeasurementType ? true : false);
          }
        });
      }
    };

    //get measurement types data for grid bind
    vm.loadDataMeasurementType = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfoMeasurementType, vm.gridOptionsMeasurementType);
      //BaseService.setPageSizeOfGrid(vm.pagingInfoUOM, vm.loadDataUOM);
      if (vm.pagingInfoMeasurementType.SortColumns && vm.pagingInfoMeasurementType.SortColumns.length === 0) {
        vm.pagingInfoMeasurementType.SortColumns = [];
      }
      vm.cgBusyLoading = UnitFactory.retriveMeasurementTypeList().query(vm.pagingInfoMeasurementType).$promise.then((measurementTypes) => {
        if (measurementTypes && measurementTypes.data) {
          setDataAfterGetAPICallMeasurementType(measurementTypes, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get data down
    vm.getDataDownMeasurementType = () => {
      vm.pagingInfoMeasurementType.Page = vm.pagingInfoMeasurementType.Page + 1;
      vm.cgBusyLoading = UnitFactory.retriveMeasurementTypeList().query(vm.pagingInfoMeasurementType).$promise.then((measurementTypes) => {
        if (measurementTypes && measurementTypes.data) {
          setDataAfterGetAPICallMeasurementType(measurementTypes, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Update cell for display order flied
    const cellEditMeasurementType = () => {
      vm.isEditIntigrateMeasurementType = true;
      vm.gridOptionsMeasurementType.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceDataMeasurementType, (item) => item.id === rowEntity.id);
        var indexMType = vm.sourceDataMeasurementType.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, indexMType, (colDef.colInitIndex - 1), vm.gridOptionsMeasurementType, vm.sourceDataMeasurementType, vm.sourceHeaderMeasurementType, rowEntity, 0)) {
            return;
          }
          const measurementInfo = {
            displayOrder: newvalue,
            id: rowEntity.id,
            name: rowEntity.name
          };
          vm.cgBusyLoading = UnitFactory.measurementType().save(measurementInfo).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                rowEntity.displayOrder = oldvalue;
              }
              else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.loadDataMeasurementType();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    };

    /* delete measurement types*/
    vm.deleteMeasurementTypes = (measurementTypes) => {
      let selectedIDs = [];
      if (measurementTypes) {
        selectedIDs.push(measurementTypes.id);
      } else {
        vm.selectedRowMeasurementType = vm.selectedRowsListMeasurementType;
        if (vm.selectedRowMeasurementType.length > 0) {
          selectedIDs = vm.selectedRowMeasurementType.map((measurementTypesItem) => measurementTypesItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Measurement Type', selectedIDs.length);
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
            vm.cgBusyLoading = UnitFactory.deleteMeasurementType().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const objDeleteMeasurementTpe = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.measurement_type
                };
                BaseService.deleteAlertMessageWithHistory(objDeleteMeasurementTpe, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return UnitFactory.deleteMeasurementType().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = measurementTypes ? measurementTypes.name : null;
                    data.PageName = CORE.PageName.measurement_type;
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
                BaseService.reloadUIGrid(vm.gridOptionsMeasurementType, vm.pagingInfoMeasurementType, initPageInfoMeasurementType, vm.loadDataMeasurementType);
                vm.gridOptionsMeasurementType.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Measurement Types');
        ; const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleDataMeasurementType = () => {
      vm.deleteMeasurementTypes();
    };

    /* add.edit measurement types*/
    vm.addEditMeasurementType = (data, ev) => {
      DialogFactory.dialogService(
        CORE.MANAGE_MEASUREMENT_TYPES_MODAL_CONTROLLER,
        CORE.MANAGE_MEASUREMENT_TYPES_MODAL_VIEW,
        ev,
        data
      ).then(() => {
      }, (data) => {
        if (data) {
          vm.lastMeasurementTypeId = data.id;
          addNewMeasurementType = vm.lastMeasurementTypeId ? true : false;
          vm.loadDataMeasurementType();
        }
      },
        () => {
        });
    };

    /* update measurement types*/
    vm.updateRecord = (row, ev) => {
      if (row && row.entity && (row.entity.measurementTypeID || row.entity.measurementTypeID === 0)) {
        vm.addEditUOM(row.entity, ev);
      }
      else {
        vm.addEditMeasurementType(row.entity, ev);
      }
    };

    vm.getMeasurementTypeSelectedRow = (row) => {
      vm.selectedType = row && row.name ? row.name : vm.selectedType;
      if (lastRowSelected && row && lastRowSelected.id !== row.id) {
        if (row.id || row.id === 0) {
          lastRowSelected = row;
          vm.selectedMeasurementTypeId = row.id;
          vm.pagingInfoUOM.Page = vm.gridOptionsUOM.paginationCurrentPage = CORE.UIGrid.Page();
          vm.loadDataUOM();
        } else {
          vm.isNoDataFoundUOM = true;
          vm.selectedMeasurementTypeId = null;
          vm.sourceDataUOM = [];
          vm.totalUOMCount = 0;
        }
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setUOMDataAfterGetAPICall = (unitOfMeasurement, isGetDataDown) => {
      if (unitOfMeasurement && unitOfMeasurement.data && unitOfMeasurement.data.UOMs) {
        if (!isGetDataDown) {
          bindData(unitOfMeasurement.data.UOMs);
          vm.sourceDataUOM = unitOfMeasurement.data.UOMs;
          vm.currentdataUOM = vm.sourceDataUOM.length;
          _.map(vm.sourceDataUOM, (item) => {
            if (item.isSystemDefault) {
              item.isDisabledDelete = true;
              item.isRowSelectable = false;
            }
            item.isDisabledFormula = item.isFormula ? false : true;
            if (item.unitConvertValue) {
              item.baseEquivalentValue = stringFormat('= {0} {1}', CORE.UOM_OPERATOR[1].id === item.operator ? (1 * 10 / (item.unitConvertValue * 10)) : item.unitConvertValue, item.baseUnitValue);
            }
          });
        }
        else if (unitOfMeasurement.data.UOMs.length > 0) {
          _.each(unitOfMeasurement.data.UOMs, (item) => {
            if (item.isSystemDefault) {
              item.isDisabledUpdate = true;
              item.isDisabledDelete = true;
              item.isRowSelectable = false;
            }
            item.isDisabledFormula = item.isFormula ? false : true;
          });
          vm.sourceDataUOM = vm.gridOptionsUOM.data = vm.gridOptionsUOM.data.concat(unitOfMeasurement.data.UOMs);
          vm.currentdataUOM = vm.gridOptionsUOM.currentItem = vm.gridOptionsUOM.data.length;
        }

        // must set after new data comes
        vm.totalUOMCount = unitOfMeasurement.data.Count;
        if (!vm.gridOptionsUOM.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptionsUOM.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptionsUOM.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptionsUOM.clearSelectedRows();
          if (!vm.isEditIntigrateUOM) {
            cellEditUOM();
          }
        }
        if (vm.totalUOMCount === 0) {
          if (vm.pagingInfoUOM.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            if (vm.pagingInfoUOM.SearchColumns.length >= 1) {
              vm.isNoDataFoundUOM = false;
              vm.emptyStateUOM = 0;
            }
            else {
              vm.isNoDataFoundUOM = true;
              vm.emptyStateUOM = null;
            }
          }
          else {
            vm.isNoDataFoundUOM = true;
            vm.emptyStateUOM = null;
          }
        }
        else {
          vm.isNoDataFoundUOM = false;
          vm.emptyStateUOM = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGridUOM();
            if (!vm.gridOptionsUOM.enablePaging && vm.totalUOMCount === vm.currentdataUOM) {
              return vm.gridOptionsUOM.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptionsUOM.gridApi.infiniteScroll.dataLoaded(false, vm.totalUOMCount !== vm.currentdataUOM ? true : false);
          }
        });
      }
    };

    /* Get Unit of Measurement data for grid bind */
    vm.loadDataUOM = () => {
      //BaseService.setPageSizeOfGrid(vm.pagingInfoMeasurementType, vm.gridOptionsMeasurementType);
      BaseService.setPageSizeOfGrid(vm.pagingInfoUOM, vm.loadDataUOM);
      if (vm.selectedMeasurementTypeId || vm.selectedMeasurementTypeId === 0) {
        vm.pagingInfoUOM.MeasurementTypeId = vm.selectedMeasurementTypeId;
        vm.cgBusyLoading = UnitFactory.retriveUnitOfMeasurementList().query(vm.pagingInfoUOM).$promise.then((unitOfMeasurement) => {
          if (unitOfMeasurement && unitOfMeasurement.data) {
            setUOMDataAfterGetAPICall(unitOfMeasurement, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //Get data down
    vm.getDataDownUOM = () => {
      vm.pagingInfoUOM.Page = vm.pagingInfoUOM.Page + 1;
      vm.pagingInfoUOM.MeasurementTypeId = vm.selectedMeasurementTypeId;
      vm.cgBusyLoading = UnitFactory.retriveUnitOfMeasurementList().query(vm.pagingInfoUOM).$promise.then((unitOfMeasurement) => {
        if (unitOfMeasurement && unitOfMeasurement.data) {
          setUOMDataAfterGetAPICall(unitOfMeasurement, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //bind data
    const bindData = (uomDetail) => {
      _.each(uomDetail, (item) => {
        const aliasDetails = [];
        const aliasList = [];
        const split = item.aliaslist ? item.aliaslist.split('##') : null;
        _.each(split, (aliasitem) => {
          vm.uomAliasDetail = aliasitem ? aliasitem.split('@@@') : null;
          const aliasName = vm.uomAliasDetail[0] ? vm.uomAliasDetail[0] : null;
          const sourceDetails = vm.uomAliasDetail[1] ? vm.uomAliasDetail[1].split('#$#') : null;
          aliasDetails.push({
            aliasName: aliasName,
            sourceDetails: sourceDetails
          });
          aliasList.push(aliasName);
          item.uomAlias = aliasDetails ? aliasDetails : null;
          item.aliaslist = aliasList ? aliasList.join(',') : null;
        });
      });
    };

    //Update cell for display order flied
    const cellEditUOM = () => {
      vm.isEditIntigrateUOM = true;
      vm.gridOptionsUOM.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceDataUOM, (item) => item.id === rowEntity.id);
        var index = vm.sourceDataUOM.indexOf(obj);
        if (colDef.field === 'displayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptionsUOM, vm.sourceDataUOM, vm.sourceHeaderUOM, rowEntity, 0)) {
            return;
          }
          const UOMInfo = {
            ord: newvalue,
            id: rowEntity.id,
            measurementTypeID: rowEntity.measurementTypeID,
            unitName: rowEntity.unitName,
            abbreviation: rowEntity.abbreviation,
            isUpdateDisplayOrder: colDef.field === 'displayOrder' ? true : false
          }; vm.cgBusyLoading = UnitFactory.saveUnitOfMeasurementDetail().save(UOMInfo).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                rowEntity.displayOrder = oldvalue;
              } else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.loadDataUOM();
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      });
    };

    /* Show Description*/
    vm.showDescription = (object, ev) => {
      const obj = {
        title: 'Unit of measurement',
        description: object.description,
        name: object.unitName
      };
      obj.label = 'Name';
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        obj
      ).then(() => {
        if (!vm.gridOptionsUOM.enablePaging) {
          initPageInfoUOM();
        }
        vm.loadDataUOM();
      }, (err) => BaseService.getErrorLog(err));
    };

    /* Add component Field Alias */
    vm.showAlias = (row, ev) => {
      var model = {
        refTableName: CORE.TABLE_NAME.UOM,
        refId: row.id,
        isEdit: true,
        isAliasSmallLetter: true
      };
      DialogFactory.dialogService(
        CORE.COMPONENT_FIELD_GENERIC_ALIAS_CONTROLLER,
        CORE.COMPONENT_FIELD_GENERIC_ALIAS_VIEW,
        ev,
        model
      ).then(() => {
        BaseService.reloadUIGrid(vm.gridOptionsUOM, vm.pagingInfoUOM, initPageInfoUOM, vm.loadDataUOM);
      }, () => { });
    };

    /* Add unit of measurement formula */
    vm.viewFormula = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_ADD_EDIT_UNIT_DETAIL_FORMULA_MODAL_CONTROLLER,
        USER.ADMIN_ADD_EDIT_UNIT_DETAIL_FORMULA_MODAL_VIEW,
        ev,
        data.entity
      ).then(() => {
      }, () => {
        BaseService.reloadUIGrid(vm.gridOptionsUOM, vm.pagingInfoUOM, initPageInfoUOM, vm.loadDataUOM);
      }, (err) => BaseService.getErrorLog(err));
    };

    /* Show uom*/
    vm.viewRecord = (data) => {
      vm.getMeasurementTypeSelectedRow(data.entity);
    };

    /* Delete UOM grid recoed */
    vm.deleteUOM = (uintOfMeasurement) => {
      let selectedIDs = [];
      if (uintOfMeasurement) {
        selectedIDs.push(uintOfMeasurement.id);
      } else {
        vm.selectedRows = vm.selectedRowsListUOM;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((UOMItem) => UOMItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Unit of Measurement', selectedIDs.length);

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
            vm.cgBusyLoading = UnitFactory.removeUnitOfMeasurement().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const objDeleteUOM = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.unit_measure
                };
                BaseService.deleteAlertMessageWithHistory(objDeleteUOM, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return UnitFactory.removeUnitOfMeasurement().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = uintOfMeasurement ? uintOfMeasurement.unitName : null;
                    data.PageName = CORE.PageName.unit_measure;
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
                BaseService.reloadUIGrid(vm.gridOptionsUOM, vm.pagingInfoUOM, initPageInfoUOM, vm.loadDataUOM);
                vm.gridOptionsUOM.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Unit of Measurement');
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    /* Delete multiple UOM grid recoed */
    vm.deleteMultipleUOM = () => {
      vm.deleteUOM();
    };

    /* Common method for call all grid method */
    vm.deleteRecord = (row) => {
      if (row && (row.measurementTypeID || row.measurementTypeID === 0)) {
        vm.deleteUOM(row);
      } else {
        vm.deleteMeasurementTypes(row);
      }
    };

    /* add.edit UOM */
    vm.addEditUOM = (data, ev) => {
      let obj = {};
      if (data && (data.id || data.id === 0)) {
        obj = data;
        obj.typeId = data.measurementTypeID;
        obj.selectedType = vm.selectedType;
        obj.listUOM = vm.sourceDataUOM;
      } else {
        obj = {
          typeId: data,
          selectedType: vm.selectedType,
          listUOM: vm.sourceDataUOM
        };
      }
      DialogFactory.dialogService(
        USER.ADMIN_ADD_EDIT_UNIT_OF_MEASUREMENT_MODAL_CONTROLLER,
        USER.ADMIN_ADD_EDIT_UNIT_OF_MEASUREMENT_MODAL_VIEW,
        ev,
        obj
      ).then(() => {
      }, () => {
        vm.pagingInfoUOM.Page = vm.gridOptionsUOM.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadDataUOM();
      }, (err) => BaseService.getErrorLog(err));
    };
    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceDataUOM, selectUomMeaser);
      } else {
        _.map(vm.sourceDataUOM, unselectUomMeaser);
      }
    };
    const selectUomMeaser = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptionsUOM.gridApi.selection.selectRow(row);
      }
    };
    const unselectUomMeaser = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptionsUOM.clearSelectedRows();
    };
    // remove unit measer checkbox
    vm.setUOMMeaserRemove = (row) => {
      const totalItem = _.filter(vm.sourceDataUOM, (data) => !data.isDisabledDelete);
      const selectItem = _.filter(vm.sourceDataUOM, (data) => data.isRecordSelectedForRemove === true);
      if (selectItem.length === 0) {
        vm.gridOptionsUOM.clearSelectedRows();
      }
     else if (row.isRecordSelectedForRemove) {
        vm.gridOptionsUOM.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptionsUOM.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => $mdDialog.hide(false, { closeAll: true }));
  }
})();
