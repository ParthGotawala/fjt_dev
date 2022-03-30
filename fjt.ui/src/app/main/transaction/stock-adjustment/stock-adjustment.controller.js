(function () {
  'use strict';

  angular
    .module('app.transaction.stockadjustment')
    .controller('StockAdjustmentController', StockAdjustmentController);

  /** @ngInject */
  function StockAdjustmentController($scope, $mdDialog, $timeout, TRANSACTION, CORE, USER, StockAdjustmentFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.isHideDelete = true;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.STOCK_ADJUSTMENT;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isViewStockAdjustment = true;
    vm.isViewAssembly = true;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    vm.sourceHeader = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '85',
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
      field: 'assyID',
      displayName: vm.LabelConstant.Assembly.ID,
      cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.assyID" \
                            component-id="row.entity.partID" \
                            is-assembly="true" \
                            label="grid.appScope.$parent.vm.LabelConstant.Assembly.PIDCode" \
                            value="row.entity.assyID" \
                            is-copy="true" \
                            is-mfg="true" \
                            mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                            mfg-value="row.entity.mfgPN" \
                            is-copy-ahead-label="true"\
                            is-custom-part="row.entity.isCustomAssy"\
                            rohs-icon="row.entity.rohsIcon" \
                            rohs-status="row.entity.rohsName"></common-pid-code-label-link></div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.PID
    }, {
      field: 'woNumber',
      displayName: vm.LabelConstant.Workorder.WO,
      cellTemplate: '<div ng-if="!row.entity.woID" class= "ui-grid-cell-contents"> {{row.entity.woNumber}} </div> \
          <a ng-if="row.entity.woID" class="ui-grid-cell-contents cm-text-decoration" ng-click="grid.appScope.$parent.vm.goToWorkorderDetails(row.entity.woID);" >\
                                                {{row.entity.woNumber}} \
                                            </a><md-tooltip md-direction="top">{{row.entity.woNumber}}</md-tooltip>',

      width: '150'
    }, {
      field: 'availableQty',
      displayName: 'Available Stock',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
      width: '140'
    }, {
      field: 'openingStock',
      displayName: 'Adjustment Qty',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      // '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '140'
    }, {
      field: 'serialNo',
      displayName: 'Notes',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '200'
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
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      enableSorting: true,
      enableFiltering: true
    }, {
      field: 'createdbyRole',
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
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      enableCellEditOnFocus: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Stock Adjustment.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (stockAdjustment, isGetDataDown) => {
      if (stockAdjustment && stockAdjustment.data && stockAdjustment.data.stockAdjustment) {
        _.each(stockAdjustment.data.stockAdjustment, (item) => {
          item.rohsIcon = stringFormat('{0}{1}', rohsImagePath, item.rohsIcon);
        });
        if (!isGetDataDown) {
          vm.sourceData = stockAdjustment.data.stockAdjustment;
          vm.currentdata = vm.sourceData.length;
        }
        else if (stockAdjustment.data.stockAdjustment.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(stockAdjustment.data.stockAdjustment);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = stockAdjustment.data.Count;
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

    /* initial loading of data */
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = StockAdjustmentFactory.retrieveStockAdjustmentList().query(vm.pagingInfo).$promise.then((stockAdjustment) => {
        if (stockAdjustment && stockAdjustment.data) {
          setDataAfterGetAPICall(stockAdjustment, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Add stock adjustment */
    vm.addRecord = (data, ev) => {
      const popUpData = { popupAccessRoutingState: [TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_STATE], pageNameAccessLabel: CORE.LabelConstant.StockAdjustment.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_CONTROLLER,
          TRANSACTION.TRANSACTION_STOCK_ADJUSTMENT_POPUP_VIEW,
          ev,
          data).then((resposne) => {
            if (resposne) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    /* Update stock adjustment*/
    vm.ViewStockAdjustment = (row) => {
      const data = {
        id: row.entity.ID,
        isViewOnly: true
      };
      vm.addRecord(data);
    };

    /* delete stock adjustment */
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.ID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.ID);
        }
      }

      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Stock Adjustment', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = StockAdjustmentFactory.deleteStockAdjustment().query({ objIDs: objIDs }).$promise
              .then((res) => {
                if (res && res.data) {
                  if (res.data.length > 0 || res.data.transactionDetails) {
                    const data = {
                      TotalCount: res.data.transactionDetails[0].TotalCount,
                      pageName: CORE.PageName.StockAdjustmentQtyWithWO
                    };
                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                      const objIDs = {
                        id: selectedIDs,
                        CountList: true
                      };
                      return StockAdjustmentFactory.deleteStockAdjustment().query({ objIDs: objIDs }).$promise.then((res) => {
                        let data = {};
                        data = res.data;
                        data.pageTitle = row ? row.firstName : null;
                        data.PageName = CORE.PageName.StockAdjustment;
                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                        if (res.data) {
                          DialogFactory.dialogService(
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                            ev,
                            data).then(() => { // empty
                            }, () => { // empty
                            });
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    });
                  }
                  else {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    vm.gridOptions.clearSelectedRows();
                  }
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
          }
        })
          .catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* to go at work order details page  */
    vm.goToWorkorderDetails = (woID) => {
      if (woID) {
        BaseService.goToWorkorderDetails(woID);
        return false;
      } else { return; }
    };

    /* load more data on scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = StockAdjustmentFactory.retrieveStockAdjustmentList().query(vm.pagingInfo).$promise.then((stockAdjustment) => {
        if (stockAdjustment && stockAdjustment.data) {
          if (stockAdjustment && stockAdjustment.data) {
            setDataAfterGetAPICall(stockAdjustment, true);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* view assembly stock details */
    vm.ViewAssemblyStockStatus = (row, event) => {
      const data = {
        partID: row.entity.partID,
        rohsIcon: row.entity.rohsIcon,
        rohsName: row.entity.rohsName,
        mfgPN: row.entity.mfgPN,
        PIDCode: row.entity.assyID
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => { // empty
        }, () => { // empty
        }, (err) => BaseService.getErrorLog(err));
    };

    /* close popup on page destroy  */
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
