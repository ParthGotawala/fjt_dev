(function () {
  'use strict';

  angular
    .module('app.transaction.inhouseassemblystock')
    .controller('InHouseAssemblyStockListController', InHouseAssemblyStockListController);

  /** @ngInject */
  function InHouseAssemblyStockListController($mdDialog, $timeout, $state, TRANSACTION, CORE, USER, InHouseAssemblyStockFactory, DialogFactory, BaseService, $scope) {
    const vm = this;

    vm.isHideDelete = true;
    vm.isViewAssyStockLocationDetails = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.IN_HOUSE_ASSEMBLY_STOCK;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.isViewAssembly = true;

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
        pinnedLeft: true
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'woNumber',
        displayName: vm.LabelConstant.Workorder.WO,
        width: 150,
        cellTemplate: '<a class="ui-grid-cell-contents cm-text-decoration" \
                        ng-if="row.entity.woID" \
                        ng-click="grid.appScope.$parent.vm.goToWorkorderDetails(row.entity.woID);" >\
                                                {{row.entity.woNumber}} \
                                            </a><md-tooltip md-direction="top">{{row.entity.woNumber}}</md-tooltip> \
                     <div class="ui-grid-cell-contents" ng-if="!row.entity.woID"> {{row.entity.woNumber}} \
                             </div><md-tooltip md-direction="top">{{row.entity.woNumber}}</md-tooltip>'
      }, {
        field: 'woVersion',
        displayName: vm.LabelConstant.Workorder.Version,
        width: 80,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
      },
      {
        field: 'mfgCode',
        displayName: vm.LabelConstant.Customer.Customer,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: '120'
      },
      {
        field: 'PIDCode',
        displayName: vm.LabelConstant.Assembly.ID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                    component-id="row.entity.partID" \
                    label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                    value="row.entity.PIDCode" \
                    is-copy="true" \
                    is-mfg="true" \
                    mfg-label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                    mfg-value="row.entity.mfgPN" \
                    is-custom-part="row.entity.isCustom" \
                    rohs-icon="row.entity.rohsIcon" \
                    rohs-status="row.entity.rohsName" \
                    is-copy-ahead-label="true" \
                    is-assembly="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      }, {
        field: 'nickName',
        displayName: vm.LabelConstant.Assembly.NickName,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
      }, {
        field: 'mfgPNDescription',
        displayName: vm.LabelConstant.Assembly.Description,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '400'
      }, {
        field: 'poNumber',
        displayName: vm.LabelConstant.SalesOrder.PO,
        cellTemplate: '<span class="ui-grid-cell-contents text-left" ng-if="row.entity.woID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.showSalesOrderDetails($event, row.entity);$event.preventDefault();">{{row.entity.poNumber}}</a>\
                                        <md-tooltip>{{row.entity.poNumber}}</md-tooltip>\
                                    </span>\
                    <span class="ui-grid-cell-contents text-left" ng-if="!row.entity.woID">{{row.entity.poNumber}}</span>',
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        width: '210',
        allowCellFocus: true
      },
      {
        field: 'poQty',
        displayName: vm.LabelConstant.Workorder.POQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '85'
      },
      {
        field: 'buildQty',
        displayName: vm.LabelConstant.Workorder.BuildQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 100
      },
      {
        field: 'buildOverageQty',
        displayName: vm.LabelConstant.Workorder.ExcessBuildQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 85
      },
      {
        field: 'returnPending',
        displayName: vm.LabelConstant.Qty.BalanceQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '85'
      },
      {
        field: 'scrappedQty',
        displayName: vm.LabelConstant.Traveler.ScrappedQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 85
      },
      {
        field: 'stockAdjustmentQty',
        displayName: vm.LabelConstant.Qty.StockAdjustmentQty,
        enableCellEdit: false,
        enableCellEditOnFocus: true,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 120
      },
      {
        //field: 'readytoShipQty',
        field: 'readytoShipQtyWithFinalStockAdjustment',
        displayName: vm.LabelConstant.Qty.AvailableStockQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 100
      }, {
        field: 'shippedQty',
        displayName: vm.LabelConstant.Shipped.ShippedQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 90
      },
      {
        field: 'wipQty',
        displayName: vm.LabelConstant.Qty.WIPQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 90
      },
      {
        field: 'location',
        displayName: 'Geolocation',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 230
      }, {
        field: 'serialNoDescription',
        displayName: 'Serial# Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 200
      }, {
        field: 'notes',
        displayName: 'Note',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 260
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['woNumber', 'ASC']],
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
      exporterCsvFilename: 'Assembly Stock List.csv',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return InHouseAssemblyStockFactory.getVUWorkorderReadyassyStk().query(pagingInfoOld).$promise.then((resStk) => {
          if (resStk.status === CORE.ApiResponseTypeStatus.SUCCESS && resStk.data) {
            _.each(resStk.data.assyStockList, (obj) => {
              obj.openingdate = BaseService.getUIFormatedDate(obj.openingdate, vm.DefaultDateFormat);
            });
            // formatDataForExport(resStk.data.stock);
            return resStk.data.assyStockList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (response, isGetDataDown) => {
      if (response && response.data && response.data.assyStockList) {
        if (!isGetDataDown) {
          _.each(response.data.assyStockList, (item) => {
            item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
            item.isDisabledViewAssyStockLocationDetails = !item.woID;
          });
          vm.sourceData = response.data.assyStockList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (response.data.assyStockList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.assyStockList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = response.data.Count;
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

    /* retrieve Users list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = InHouseAssemblyStockFactory.getVUWorkorderReadyassyStk().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = InHouseAssemblyStockFactory.getVUWorkorderReadyassyStk().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.viewAssyStockLocationDetails = (row, ev) => {
      var data = {
        woID: row.entity.woID
      };
      DialogFactory.dialogService(
        CORE.IN_HOUSE_ASSEMBLY_STOCK_MODAL_CONTROLLER,
        CORE.IN_HOUSE_ASSEMBLY_STOCK_MODAL_VIEW,
        ev,
        data).then(() => {
          /* Empty */
        }, (response) => {
          if (response) {
            reloadUIGrid();
          }
        }, () => {
          /* Empty */
        });
    };

    function reloadUIGrid() {
      BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      vm.gridOptions.clearSelectedRows();
    }

    /* display work order sales order header all details while click on that link*/
    vm.showSalesOrderDetails = (ev, soData) => {
      if (soData.poNumber && soData.salesOrderNumber) {
        const data = angular.copy(soData);
        DialogFactory.dialogService(
          CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
          CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (() => {
          }), (error) => BaseService.getErrorLog(error));
      }
    };

    /* to go at work order details page  */
    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    };

    //view assembly stock details
    vm.ViewAssemblyStockStatus = (row, event) => {
      const data = angular.copy(row.entity);
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => $mdDialog.hide('', { closeAll: true }));
  }
})();
