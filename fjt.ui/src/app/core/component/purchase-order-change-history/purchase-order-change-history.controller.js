(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PurchaseOrderHistoryController', PurchaseOrderHistoryController);

  /** @ngInject */
  function PurchaseOrderHistoryController($mdDialog, $timeout, CORE, TRANSACTION,
    data, PurchaseOrderFactory, BaseService, DialogFactory, WORKORDER) {
    const vm = this;
    vm.isHideDelete = true;
    vm.purchaseOrderID = data.purchaseOrderID ? data.purchaseOrderID : null;
    vm.purchaseOrderDetId = data.purchaseOrderDetId ? data.purchaseOrderDetId : null;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.ViewDiffOfChange = true;
    vm.isinvoice = data.isinvoice;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASEORDERHISTORY;
    vm.customerPackingFilelds = CORE.customerPackingFilelds;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.popupTitle = CORE.PURCHASE_ORDER_CHANGE_HISTORY_POPUP_TITLE;

    vm.goToPurchaseOrderList = () => BaseService.goToPurchaseOrderList();
    vm.goToManagePurchaseOrder = () => BaseService.goToPurchaseOrderDetail(vm.purchaseOrderID);
    vm.goToPartList = () => BaseService.goToPartList();
    vm.goToPartMaster = () => BaseService.goToComponentDetailTab(null, data.partID);
    vm.goToSupplierList = () => BaseService.goToSupplierList();
    vm.goToSupplier = () => BaseService.goToSupplierDetail(data.supplierID);

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '85',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'revision',
        displayName: vm.LabelConstant.PURCHASE_ORDER.PORevision,
        width: '75',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'poLineNumber',
        displayName: vm.LabelConstant.PURCHASE_ORDER.POLineID,
        width: '65',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'lineReleaseNumber',
        width: '95',
        displayName: 'Release#',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'Colname',
        displayName: 'Field',
        enableCellEdit: false,
        width: '250'
      },
      {
        field: 'Oldval',
        displayName: 'Old Value',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.Oldval}}</div>',
        enableCellEdit: false,
        width: '320'
      }, {
        field: 'Newval',
        displayName: 'New Value',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.Newval}}</div>',
        enableCellEdit: false,
        width: '320'
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
      }, {
        field: 'updatedby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
      }, {
        field: 'updatedbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false,
        visible: CORE.UIGrid.VISIBLE_CREATED_AT
      }, {
        field: 'createdby',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_CREATED_BY
      }, {
        field: 'createdbyRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true,
        visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: [],
        purchaseOrderID: vm.purchaseOrderID,
        purchaseOrderDetId: vm.purchaseOrderDetId
      };
    };
    initPageInfo();

    vm.headerdata = [{
      label: vm.LabelConstant.PURCHASE_ORDER.PO,
      value: data.poNumber,
      displayOrder: 1,
      labelLinkFn: vm.goToPurchaseOrderList,
      valueLinkFn: vm.goToManagePurchaseOrder,
      isCopy: true
    }, {
      label: vm.LabelConstant.PURCHASE_ORDER.PORevision,
      value: data.poRevision,
      displayOrder: 2
    }, {
      label: vm.LabelConstant.PURCHASE_ORDER.Supplier,
        value: data.supplier,
      displayOrder: 3,
      labelLinkFn: vm.goToSupplierList,
      valueLinkFn: vm.goToSupplier,
      isCopy: true
    }, {
      label: vm.LabelConstant.MFG.PID,
      value: data.pidCode,
      displayOrder: 4,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartMaster,
      isCopy: true,
      isCopyAheadLabel: true,
      isAssy: data.iscustom,
      imgParms: {
        imgPath: data.rohsIcon,
        imgDetail: data.rohsName
      },
      isCopyAheadOtherThanValue: true,
      copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
      copyAheadValue: data.mfgPN
    }];

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
      allowToExportAllData: true,
      exporterCsvFilename: `${vm.popupTitle}.csv`,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return PurchaseOrderFactory.purchaseorderchangehistory().query(pagingInfoOld).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response && response.data && response.data.purchaseOrderLog) {
              setDataAfterGetAPICall(response.data, false);
              return response.data.purchaseOrderLog;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (data, isGetDataDown) => {
      if (!isGetDataDown) {
        vm.sourceData = BaseService.getFormatedHistoryDataList(data.purchaseOrderLog);
        vm.currentdata = vm.sourceData.length;
      }
      else if (data.purchaseOrderLog.length > 0) {
        vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(BaseService.getFormatedHistoryDataList(data.purchaseOrderLog));
        vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
      }

      // must set after new data comes
      vm.totalSourceDataCount = data.Count;
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
          if (vm.isAdvanceSearch) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          } else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
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
    };

    /* retrieve purchase order changes history list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = PurchaseOrderFactory.purchaseorderchangehistory().query(vm.pagingInfo).$promise.then((purchaseOrderHistory) => {
        if (purchaseOrderHistory && purchaseOrderHistory.data && purchaseOrderHistory.data.purchaseOrderLog) {
          setDataAfterGetAPICall(purchaseOrderHistory.data, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PurchaseOrderFactory.purchaseorderchangehistory().query(vm.pagingInfo).$promise.then((purchaseOrderHistory) => {
        if (purchaseOrderHistory && purchaseOrderHistory.data && purchaseOrderHistory.data.purchaseOrderLog) {
          setDataAfterGetAPICall(purchaseOrderHistory.data, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Open popup for display difference of entry change */
    vm.openDifferenceOfChange = (row, ev) => {
      var data = {
        Colname: row.entity.Colname,
        Oldval: row.entity.Oldval,
        Newval: row.entity.Newval,
        Tablename: row.entity.Tablename,
        RefTransID: row.entity.RefTransID
      };

      DialogFactory.dialogService(
        WORKORDER.DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER,
        WORKORDER.DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW,
        ev,
        data).then(() => 1, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    vm.close = () => $mdDialog.cancel();
  }
})();
