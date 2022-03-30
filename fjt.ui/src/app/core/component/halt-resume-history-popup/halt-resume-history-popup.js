(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('HaltResumeHistoryPopupController', HaltResumeHistoryPopupController);

  /** @ngInject */
  function HaltResumeHistoryPopupController($timeout, $mdDialog, CORE, data, USER, TRANSACTION, BaseService, WorkorderTransHoldUnholdFactory) {
    const vm = this;
    vm.holdResumehistoryData = data;
    vm.isHideDelete = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.HaltResumeTypeGridHeaderDropDown = CORE.HaltResumeTypeGridHeaderDropDown;
    vm.DateFormat = _dateTimeFullTimeDisplayFormat;
    vm.HaltResumePopUp = CORE.HaltResumePopUp;
    vm.isCheckAll = false;
    vm.isCheckWO = true;
    vm.isWorkorder = true;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = CORE.EMPTYSTATE.HALT_RESUME_HISTORY;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.holdResumehistoryData.soId);
      return false;
    };

    vm.goToPurchaseOrderList = () => {
      BaseService.goToPurchaseOrderList();
      return false;
    };
    vm.goToPurchaseOrderDetail = () => {
      BaseService.goToPurchaseOrderDetail(vm.holdResumehistoryData.poId);
      return false;
    };

    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.holdResumehistoryData.assyID);
      return false;
    };

    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.goToSupplierInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
      return false;
    };
    vm.goToSupplierInvoiceDetail = () => {
      BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.holdResumehistoryData.invoiceId);
      return false;
    };

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };

    vm.goToPackingSlipDetail = () => {
      BaseService.goToManagePackingSlipDetail(vm.holdResumehistoryData.packingSlipId);
      return false;
    },

      vm.goToSupplierRefInvoiceDetail = () => {
      BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.holdResumehistoryData.refInvoiceId);
        return false;
      };

    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };
    vm.goToCreditMemoDetail = () => {
      BaseService.goToCreditMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.holdResumehistoryData.invoiceId);
      return false;
    };

    vm.goToDebitMemoDetail = () => {
      BaseService.goToDebitMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.holdResumehistoryData.invoiceId);
      return false;
    };
    vm.goToDebitMemoList = () => {
      BaseService.goToDebitMemoList();
    };

    vm.headerdata = [{
      label: vm.LabelConstant.SalesOrder.PO,
      value: vm.holdResumehistoryData.poNumber,
      displayOrder: 1,
      labelLinkFn: vm.holdResumehistoryData.poId ? vm.goToPurchaseOrderList : (vm.holdResumehistoryData.soId ? vm.goToSalesOrderList : null),
      valueLinkFn: vm.holdResumehistoryData.poId ? vm.goToPurchaseOrderDetail : (vm.holdResumehistoryData.soId ? vm.goToManageSalesOrder : null)
    },
    {
      label: vm.LabelConstant.SalesOrder.SO,
      value: vm.holdResumehistoryData.soNumber,
      displayOrder: 2,
      labelLinkFn: vm.goToSalesOrderList,
      valueLinkFn: vm.goToManageSalesOrder
    },
    {
      label: CORE.LabelConstant.SalesOrder.AssyIDPID,
      value: vm.holdResumehistoryData.assyName,
      displayOrder: 3,
      labelLinkFn: vm.goToAssy,
      valueLinkFn: vm.goToAssyMaster,
      isCopy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.holdResumehistoryData.rohsIcon,
        imgDetail: vm.holdResumehistoryData.rohs
      }
    },
    {
      label: vm.LabelConstant.SupplierInvoice.PackingSlipNumber,
      value: vm.holdResumehistoryData.invoiceNumber ? vm.holdResumehistoryData.packingSlipNumber : null,// added null to hide incase of other then invoice
      displayOrder: 4,
      labelLinkFn: vm.goToPackingSlipList,
      valueLinkFn: vm.goToPackingSlipDetail
    },
    {
      label: vm.LabelConstant.SupplierInvoice.InvoiceNumber,
      value: vm.holdResumehistoryData.invoiceNumber,
      displayOrder: 5,
      labelLinkFn: vm.goToSupplierInvoiceList,
      valueLinkFn: vm.goToSupplierInvoiceDetail
    },
    {
      label: vm.LabelConstant.SupplierInvoice.CreditMemoNumber,
      value: vm.holdResumehistoryData.creditMemoNumber,
      displayOrder: 6,
      labelLinkFn: vm.goToCreditMemoList,
      valueLinkFn: vm.goToCreditMemoDetail
    },
    {
      label: vm.LabelConstant.SupplierInvoice.DebitMemoNumber,
      value: vm.holdResumehistoryData.debitMemoNumber,
      displayOrder: 7,
      labelLinkFn: vm.goToDebitMemoList,
      valueLinkFn: vm.goToDebitMemoDetail
    },
    {
      label: vm.LabelConstant.PACKING_SLIP.RefInvoiceNumber,
      value: vm.holdResumehistoryData.refInvoiceNumber,
      displayOrder: 8,
      labelLinkFn: vm.goToSupplierInvoiceList,
      valueLinkFn: vm.goToSupplierRefInvoiceDetail
    }];
    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'haltTypeVal',
        displayName: 'Halt Type',
        width: 175,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;"> {{row.entity.haltTypeText}}\
                                    <md-tooltip md-direction="top" ng-if="row.entity.haltTypeText" class="tooltip-multiline">\
                                    {{row.entity.haltTypeText}}\
                                    </md-tooltip>\
                                    </div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" \
                            ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.HaltResumeTypeGridHeaderDropDown
        },
        isConditionallyVisibleColumn: true
      },
      {
        field: 'reason',
        displayName: 'Halted Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">{{COL_FIELD}}\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
        width: 200
      },
      {
        field: 'convertedHaltDate',
        displayName: 'Halted Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        enableFiltering: false,
        type: 'datetime'
      },
      {
        field: 'holdEmployeeName',
        displayName: 'Halted By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
      },
      {
        field: 'resumeReason',
        displayName: 'Resumed Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden;">{{COL_FIELD}}\
                                    <md-tooltip md-direction="top" ng-if="COL_FIELD" class="tooltip-multiline">\
                                    {{COL_FIELD}}\
                                    </md-tooltip>\
                                    </div>',
        width: 200
      },
      {
        field: 'convertedResumeDate',
        displayName: 'Resumed Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        enableFiltering: false,
        type: 'datetime'
      },
      {
        field: 'unHoldEmployeeName',
        displayName: 'Resumed By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
      }
    ];

    if (vm.holdResumehistoryData.isHideHaltType) {
      const index = _.findIndex(vm.sourceHeader, (data) => data.field === 'haltTypeVal');
      if (index !== -1) {
        vm.sourceHeader.splice(index, 1);
      }
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
        isWorkorder: false,
        salesOrderDetID: vm.holdResumehistoryData.refTransId ? vm.holdResumehistoryData.refTransId : null
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
      exporterCsvFilename: 'Halt Resume Details.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (responseData, isGetDataDown) => {
      if (responseData && responseData.data && responseData.data.workorderHaltResumeList) {
        if (!isGetDataDown) {
          vm.sourceData = responseData.data.workorderHaltResumeList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (responseData.data.workorderHaltResumeList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(responseData.data.workorderHaltResumeList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = responseData.data.Count;
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
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.woID = vm.holdResumehistoryData.refTransId ? vm.holdResumehistoryData.refTransId : null;
      vm.cgBusyLoading = WorkorderTransHoldUnholdFactory.workorder_trans_hold_unhold().query(vm.pagingInfo).$promise.then((responseData) => {
        if (responseData && responseData.data) {
          setDataAfterGetAPICall(responseData, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = WorkorderTransHoldUnholdFactory.workorder_trans_hold_unhold().query(vm.pagingInfo).$promise.then((responseData) => {
        if (responseData && responseData.data) {
          setDataAfterGetAPICall(responseData, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.cancel = () => {
      $mdDialog.cancel(null);
    };
  }
})();
