(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('ComponentExternalValuesPopupController', ComponentExternalValuesPopupController);

  /** @ngInject */
  function ComponentExternalValuesPopupController($mdDialog, $filter, $timeout, BaseService, CORE, USER, ComponentFactory) {
    const vm = this;
    vm.isUpdatable = false;
    vm.isHideDelete = true;
    vm.partExternalValues = CORE.PartExternalValuesDropdown;
    vm.operatingTemperatureField = _.find(vm.partExternalValues, (item) => item.Key === 'operatingtemperature');
    vm.isNoDataFound = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.EXTERNAL_ATTRIBUTE_VALUE;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    vm.changeAttribute = () => {
      vm.pagingInfo.Page = CORE.UIGrid.Page();
      vm.show();
    };

    const minOperatingTemperatureColumn = {
      field: 'minOperatingTemp',
      displayName: 'Min Operating Temperature (°C)',
      width: 210,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    };
    const maxOperatingTemperatureColumn = {
      field: 'maxOperatingTemp',
      displayName: 'Max Operating Temperature (°C)',
      width: 210,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    };
    const internalNameColumn = {
      field: 'internalName',
      displayName: 'Internal Attribute Name',
      width: 250,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    };

    vm.sourceHeader = [{
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false,
      allowCellFocus: false
    },
    {
      field: 'externalValue',
      displayName: 'External Attribute Name',
      width: 270,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
    },
    {
      field: 'totalCount',
      displayName: 'Record Count',
      width: 100,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
      ColumnDataType: 'Number'
    }];
    // init pagination details
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['internalName', 'ASC']],
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
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'ExternalAttributeValues.csv'
    };

    vm.close = () => {
      $mdDialog.cancel();
    };

    function setDataAfterGetAPICall(externalValues, isGetDataDown) {
      if (externalValues && externalValues.data.externalValues) {
        if (!isGetDataDown) {
          vm.sourceData = externalValues.data.externalValues;
          vm.currentdata = vm.sourceData.length;
        }
        else if (externalValues.data.externalValues.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(externalValues.data.externalValues);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = externalValues.data.Count;
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

    vm.show = () => {
      if (vm.autoCompleteExternalValue && vm.autoCompleteExternalValue.keyColumnId && vm.autoCompleteExternalValue.keyColumnId !== 'null') {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['internalName', 'ASC']];
        }
        vm.pagingInfo.pFieldName = vm.autoCompleteExternalValue.keyColumnId;
        const findIndexInternalName = _.findIndex(vm.sourceHeader, (data) => data.field === 'internalName');
        const findIndexMinOperatingTemp = _.findIndex(vm.sourceHeader, (data) => data.field === 'minOperatingTemp');
        const findIndexMaxOperatingTemp = _.findIndex(vm.sourceHeader, (data) => data.field === 'maxOperatingTemp');
        if (vm.operatingTemperatureField.Key === vm.autoCompleteExternalValue.keyColumnId) {
          if (findIndexInternalName !== -1) {
            vm.sourceHeader.splice(findIndexInternalName, 1);
          };
          if (findIndexMinOperatingTemp === -1) {
            vm.sourceHeader.splice(1, 0, minOperatingTemperatureColumn);
          }
          if (findIndexMaxOperatingTemp === -1) {
            vm.sourceHeader.splice(2, 0, maxOperatingTemperatureColumn);
          }
        }
        else {
          if (findIndexMaxOperatingTemp !== -1) {
            vm.sourceHeader.splice(findIndexMaxOperatingTemp, 1);
          }
          if (findIndexMinOperatingTemp !== -1) {
            vm.sourceHeader.splice(findIndexMinOperatingTemp, 1);
          }
          if (findIndexInternalName === -1) {
            vm.sourceHeader.splice(1, 0, internalNameColumn);
          };
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ComponentFactory.getComponentExternalValues().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.isNoDataFound = true;
        vm.emptyState = null;
      }
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ComponentFactory.getComponentExternalValues().query(vm.pagingInfo).$promise.then((response) => {
        setDataAfterGetAPICall(response, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
