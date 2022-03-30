(function () {
  'use strict';

  angular
    .module('app.admin.unit')
    .controller('ManageUnitDetailFormulaPopUpController', ManageUnitDetailFormulaPopUpController);

  function ManageUnitDetailFormulaPopUpController($mdDialog, $timeout, data, CORE, USER, UnitFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.isUpdatable = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMessageUDF = USER.ADMIN_EMPTYSTATE.UNIT_DETAIL_FORMULA;
    vm.baseUnitList = [];
    vm.setScrollClass = 'gridScrollHeight_UnitFormula';
    vm.LabelConstant = CORE.LabelConstant;

    vm.UnitDetailFormulaModel = {
      unitID: data ? data.id : null,
      measurementTypeID: data ? data.measurementTypeID : null
    };

    vm.unitName = data ? data.unitName : null;

    const searchColumn = {
      ColumnDataType: 'Number',
      ColumnName: 'unitID',
      SearchString: vm.UnitDetailFormulaModel.unitID
    };

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'layout-align-center-center',
      displayName: 'Action',
      width: '120',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    },
    {
      field: '#',
      width: '70',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'unitName',
      displayName: 'From Unit',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'toUnitName',
      displayName: 'To Unit',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: '1UOM',
      displayName: '1 UOM',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'formula',
      displayName: 'Formula',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'currentValue',
      displayName: 'Formula Equivalent',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}{{\' \'+row.entity.BaseUOM}}</div>'
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
    }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['unitName', 'ASC']],
        SearchColumns: [],
        UnitID: data ? data.id : 0
      };
    };

    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns
    };

    /* Get Unit of Measurement data for grid bind */
    vm.loadData = () => {
      vm.cgBusyLoading = UnitFactory.retriveUnitDetailFormula(vm.pagingInfo).query().$promise.then((unitDetailFormula) => {
        _.each(unitDetailFormula.data.UnitDetailFormula, (data) => {
          data.currentValue = eval(data.currentValue);
        });
        vm.sourceData = unitDetailFormula.data.UnitDetailFormula;
        vm.totalSourceDataCount = unitDetailFormula.data.Count;
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
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
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get data down
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.SearchColumns.push(searchColumn);
      vm.cgBusyLoading = UnitFactory.retriveUnitDetailFormula(vm.pagingInfo).query().$promise.then((unitDetailFormula) => {
        vm.sourceData = unitDetailFormula.data.UnitDetailFormula;
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initAutoComplete = () => {
      vm.autoCompleteToUnit = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: vm.UnitDetailFormulaModel.toUnitID ? vm.UnitDetailFormulaModel.toUnitID : null,
        inputName: 'To Unit',
        placeholderName: 'To Unit',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUnitOfMeasurements
      };
    };

    // [S] Method for Unit (Unit of measurement) list
    const getUnitOfMeasurements = () => UnitFactory.getUnitOfMeasurementList().query({
      id: vm.UnitDetailFormulaModel.unitID,
      measurementTypeID: vm.UnitDetailFormulaModel.measurementTypeID
    }).$promise.then((response) => {
      if (response && response.data) {
        vm.baseUnitList = response.data;
      }
      else {
        vm.baseUnitList = [];
      }
      return vm.baseUnitList;
    }).catch((error) => BaseService.getErrorLog(error));

    // [E] Method for BaseUnit (Unit of measurement) list
    getUnitOfMeasurements().then(() => {
      if (vm.baseUnitList) {
        initAutoComplete();
      }
    });

    /* Update Unit of Measurement */
    vm.updateRecord = (row) => UnitFactory.retriveUnitDetailFormulaDetail().query({
      id: row.entity.id
    }).$promise.then((response) => {
      if (response && response.data) {
        vm.UnitDetailFormulaModel = response.data;
        vm.autoCompleteToUnit.keyColumnId = vm.UnitDetailFormulaModel.toUnitID;
      }
      else {
        vm.baseUnitList = [];
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.saveUnitDetailFormula = () => {
      const unitDetailFormula = vm.UnitDetailFormulaModel;
      unitDetailFormula.toUnitID = vm.autoCompleteToUnit.keyColumnId;

      const formula = vm.UnitDetailFormulaModel.formula.replace(/X/g, 1);

      try {
        eval(formula);
      } catch (e) {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_FORMULA);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }

      vm.cgBusyLoading = UnitFactory.saveUnitDetailFormula().save(unitDetailFormula).$promise.then((response) => {
        if (response && response.data) {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          vm.UnitDetailFormulaModel.formula = '';
          vm.autoCompleteToUnit.keyColumnId = null;
          vm.UnitDetailFormulaModel.id = null;
          vm.ManageUDFForm.$setPristine();
          vm.ManageUDFForm.$setUntouched();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* delete Unit of Measurement */
    vm.deleteRecord = (unitDetailFormula) => {
      let selectedIDs = [];
      if (unitDetailFormula) {
        selectedIDs.push(unitDetailFormula.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((measurementTypesItem) => measurementTypesItem.id);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Unit Formula', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = UnitFactory.deleteUnitDetailMeasurement().save({
              ids: selectedIDs
            }).$promise.then((data) => {
              if (data.data && data.data.TotalCount > 0) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE);
                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
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
        messageContent.message = stringFormat(messageContent.message, 'Unit Formula');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.goToUnitList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };
  }
})();
