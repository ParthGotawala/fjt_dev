(function () {
  'use strict';
  angular
    .module('app.admin.componentpricebreakdetails')
    .controller('ComponentPriceBreakDetailsController', ComponentPriceBreakDetailsController);
  /** @ngInject */
  function ComponentPriceBreakDetailsController($mdDialog, $q, DialogFactory, ComponentPriceBreakDetailsFactory, CORE, USER, BaseService, $timeout) {
    const vm = this;
    vm.CORE = CORE;
    vm.isUpdatable = true;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PRICE_BREAK;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;

    /*get data for ui-grid */
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
      field: 'mfg',
      displayName: CORE.LabelConstant.MFG.MFG,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '250',
      allowCellFocus: false
    }, {
      field: 'mfgPN',
      displayName: CORE.LabelConstant.MFG.MFGPN,
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                          component-id="row.entity.mfgPNID" \
                                          label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                          value="row.entity.mfgPN" \
                                          is-copy="true" \
                                          rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                          rohs-status="row.entity.rohsName" \
                                          is-search-digi-key="true"></common-pid-code-label-link></div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
      allowCellFocus: false
    }, {
      field: 'PIDCode',
      displayName: CORE.LabelConstant.MFG.PID,
      cellTemplate: '<common-pid-code-label-link \
                                              component-id="row.entity.mfgPNID" \
                                              label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.PID" \
                                              value="row.entity.PIDCode" \
                                              is-copy="true" \
                                              is-mfg="true" \
                                              mfg-label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                              mfg-value="row.entity.mfgPN" \
                                              rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                              rohs-status="row.entity.rohsName" \
                                              is-copy-ahead-label="true"></common-pid-code-label-link>',
      width: CORE.UI_GRID_COLUMN_WIDTH.PID,
      allowCellFocus: false
    }, {
      field: 'priceBreak',
      displayName: 'Price Break',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle">{{COL_FIELD | numberWithoutDecimal }}</div>',
      width: '80'
    }, {
      field: 'unitPrice',
      displayName: 'Unit Price',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle">{{COL_FIELD | unitPrice}}</div>',
      width: '100'
    }, {
      field: 'ExtendedPrice',
      displayName: 'Extended Price',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents" ng-if="!COL_FIELD">${{COL_FIELD | numberWithoutDecimal}}</div>',
      width: '100'
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
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['createdAt', 'DESC']],
        SearchColumns: []
      };
    };

    initPageInfo();

    vm.gridOptions = {
      enablePaging: vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false,
      enablePaginationControls: vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Part Price Break Details.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (componentPriceBreakdetails, isGetDataDown) => {
      if (componentPriceBreakdetails && componentPriceBreakdetails.data && componentPriceBreakdetails.data.componentpricebreakdetails) {
        if (!isGetDataDown) {
          vm.sourceData = componentPriceBreakdetails.data.componentpricebreakdetails;
          vm.currentdata = vm.sourceData.length;
        }
        else if (componentPriceBreakdetails.data.componentpricebreakdetails.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(componentPriceBreakdetails.data.componentpricebreakdetails);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = componentPriceBreakdetails.data.Count;
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


    // load data for ui-grid
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.retrieveComponentPriceBreakDetailsList().query(vm.pagingInfo).$promise.then((componentPriceBreakdetails) => {
        if (componentPriceBreakdetails && componentPriceBreakdetails.data) {
          setDataAfterGetAPICall(componentPriceBreakdetails, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.retrieveComponentPriceBreakDetailsList().query(vm.pagingInfo).$promise.then((componentPriceBreakdetails) => {
        if (componentPriceBreakdetails && componentPriceBreakdetails.data) {
          setDataAfterGetAPICall(componentPriceBreakdetails, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* used to open popup modal for add/edit */
    vm.addEditPriceBreakDetails = (data, ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_PRICE_BREAK_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_PRICE_BREAK_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Used to update record */
    vm.updateRecord = (row, ev) => {
      vm.addEditPriceBreakDetails(row.entity, ev);
    };

    /* used to delete single or multiple records */
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    vm.deleteRecord = (pricebreak) => {
      let selectedIDs = [];
      if (pricebreak) {
        selectedIDs.push(pricebreak.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((pricebreakItem) => pricebreakItem.id);
        }
      }
      if (selectedIDs) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Part Price Break Details'),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, 'Part Price Break Details'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.deletePriceBreakDetails().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Part Price Break Details'),
          multiple: true
        };
        DialogFactory.alertDialog(alertModel);
      }
    };
  }
})();
