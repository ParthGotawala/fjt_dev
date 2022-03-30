(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('ComponentNoneTypePopupController', ComponentNoneTypePopupController);

  /** @ngInject */
  function ComponentNoneTypePopupController($mdDialog, CORE, data, BaseService, DialogFactory, ComponentFactory, USER, $timeout) {

    const vm = this;
    vm.apiVerificationErrorList = [];
    vm.pricingErrorTypes = CORE.PRICING_ERROR_TYPES;
    vm.tableName = CORE.TABLE_NAME;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isHideDelete = true;
    vm.gridConfig = CORE.gridConfig;
    vm.isUpdatePartAttribute = true;
    vm.setScrollClass = "gridScrollHeight_Component_Property_Page";
    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '80',
        cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="1"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        allowCellFocus: false,
      },
      {
        field: '#',
        width: '90',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'partNumber',
        displayName: 'Part',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.id"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-search-findchip="true"\
                                             is-search-digi-key="true"\
                                             is-custom-part="false"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                             rohs-status="row.entity.rohsName" \
                                             >\
                      </common-pid-code-label-link></div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false,
      },
      {
        field: 'PidCode',
        displayName: 'PID Code',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.id"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                             value="COL_FIELD"\
                                             is-copy="true"\
                                             is-search-findchip="true"\
                                             is-search-digi-key="true"\
                                             is-custom-part="false"\
                                             rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                             rohs-status="row.entity.rohsName" \
                                             >\
                      </common-pid-code-label-link></div>',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false,
      },
      {
        field: 'error',
        displayName: 'Error',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '730',
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false,
        cellTooltip: true
      },
    ];
    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['partNumber', 'ASC']],
        SearchColumns: [],
      };
    }
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Part Property Mapping.csv',
      allowCellFocus: false,
    };

    /* retrieve component property log list*/
    vm.loadData = () => {
      vm.cgBusyLoading = ComponentFactory.getComponentStatusList(vm.pagingInfo).query().$promise.then((component) => {
        vm.sourceData = [];
        if (component.data) {
          vm.sourceData = component.data.ComponentStatus;
          vm.totalSourceDataCount = component.data.Count;
        }
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
        if (vm.totalSourceDataCount == 0) {
          if (vm.pagingInfo.SearchColumns.length > 0) {
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
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ComponentFactory.getComponentStatusList(vm.pagingInfo).query().$promise.then((component) => {
        vm.sourceData = vm.sourceData.concat(component.data.ComponentStatus);
        vm.currentdata = vm.sourceData.length;
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
    //update part attribute status
    vm.updatePartsAttributes = (event, item) => {
      if (!item.isverified) {
        let partList = [item];
        let objAttributes = {
          isfromMap: true,
          rowData: partList
        };
        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_CONTROLLER,
          USER.ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_VIEW,
          event,
          objAttributes).then(() => {
          }, (data) => {
            if (data) {
              vm.sourceData = _.filter(vm.sourceData, (comp) => { return comp._id != item._id });
              vm.gridOptions.data = vm.sourceData;
              if (vm.gridOptions.currentItem == vm.gridOptions.totalItems)
                vm.gridOptions.currentItem = vm.gridOptions.currentItem - 1;
              vm.gridOptions.totalItems = vm.gridOptions.totalItems - 1;
            }
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
    }
  }

})();
