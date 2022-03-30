(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierQuotePartPricingHistoryPopupController', SupplierQuotePartPricingHistoryPopupController);

  /** @ngInject */
  function SupplierQuotePartPricingHistoryPopupController($scope, TRANSACTION, $mdDialog, data, BaseService, USER, CORE, $timeout, SupplierQuoteFactory) {
    const vm = this;
    vm.isHideDelete = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_QUOTE_PART_PRICING_HISTORY;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.headerdata = [];

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.headerDetails.supplier_quote_mst.mfgCodemst.id);
    };
    vm.goToSupplierQuoteList = () => {
      BaseService.goToSupplierQuoteList();
    };
    vm.goToSupplierQuoteDetail = () => {
      BaseService.goToSupplierQuoteWithPartDetail(vm.headerDetails.supplier_quote_mst.id);
    };
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToSupplierPartList = () => {
      BaseService.goToSupplierPartList();
    };
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.headerDetails.component.mfgCodemst.id);
    };
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.headerDetails.component.id, USER.PartMasterTabs.Detail.Name);
    };
    vm.goToSupplierComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.DIST, vm.headerDetails.supplierComponent.id, USER.PartMasterTabs.Detail.Name);
    };

    vm.getSupplierQuotePartPriceHeaderDetails = () => {
      vm.cgBusyLoading = SupplierQuoteFactory.getSupplierQuotePartPriceHeaderDetails().query({ id: data.supplierQuotePartDetID }).$promise.then((response) => {
        if (response && response.data) {
          vm.headerDetails = response.data;
          vm.headerdata = [
            {
              label: vm.LabelConstant.SupplierQuote.Supplier,
              value: vm.headerDetails.supplier_quote_mst.mfgCodemst.mfgName,
              displayOrder: 1,
              labelLinkFn: vm.goToSupplierList,
              valueLinkFn: vm.goToSupplierDetail
            },
            {
              label: vm.LabelConstant.SupplierQuote.Quote,
              value: vm.headerDetails.supplier_quote_mst.quoteNumber,
              displayOrder: 2,
              labelLinkFn: vm.goToSupplierQuoteList,
              valueLinkFn: vm.goToSupplierQuoteDetail
            },
            {
              label: vm.LabelConstant.MFG.MFG,
              value: `(${vm.headerDetails.component.mfgCodemst.mfgCode}) ${vm.headerDetails.component.mfgCodemst.mfgName}`,
              displayOrder: 3,
              labelLinkFn: vm.goToManufacturerList,
              valueLinkFn: vm.goToManufacturer
            },
            {
              label: vm.LabelConstant.MFG.MFGPN,
              value: vm.headerDetails.component.mfgPN,//`(${headerDetails.component.mfgCodemst.mfgCode}) ${headerDetails.component.mfgPN}`,
              displayOrder: 4,
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToComponentDetailTab,
              isCopy: true,
              isCopyAheadLabel: true,
              // isAssy: true,
              imgParms: {
                imgPath: vm.rohsImagePath + vm.headerDetails.component.rfq_rohsmst.rohsIcon,
                imgDetail: vm.headerDetails.component.rfq_rohsmst.name
              }
              //copyParams: {
              //  ismfgPN: true,
              //  labelMfgPN: vm.LabelConstant.Assembly.MFGPN,
              //  valueMfgPN: vm.kitDetail.salesOrderDetail.assyName
              //}
            }];

          if (vm.headerDetails.supplierComponent) {
            vm.headerdata.push(
              {
                label: vm.LabelConstant.MFG.SupplierPN,
                value: vm.headerDetails.supplierComponent.PIDCode,//`(${headerDetails.component.mfgCodemst.mfgCode}) ${headerDetails.component.SupplierPN}`,
                displayOrder: 5,
                labelLinkFn: vm.goToSupplierPartList,
                valueLinkFn: vm.goToSupplierComponentDetailTab,
                isCopy: true,
                isCopyAheadLabel: true,
                isAssy: true,
                imgParms: {
                  imgPath: vm.rohsImagePath + vm.headerDetails.component.rfq_rohsmst.rohsIcon,
                  imgDetail: vm.headerDetails.component.rfq_rohsmst.name
                }
              }
            );
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getSupplierQuotePartPriceHeaderDetails();

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        pinnedLeft: true,
        enableSorting: false
      },
      {
        field: 'itemNumber',
        displayName: 'Item#',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        pinnedLeft: true,
        width: '80'
      },
      {
        field: 'colName',
        displayName: 'Field Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '250'
      },
      {
        field: 'oldVal',
        displayName: 'Old Value',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200'
      },
      {
        field: 'newVal',
        displayName: 'New Value',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200'
      },
      {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime'
      },
      {
        field: 'updatedBy',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[33].PageName,
        supplierQuotePartDetID: data.supplierQuotePartDetID
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'SupplierQuotePartPricingHistory.csv'
    };

    function setDataAfterGetAPICall(pricingHistory, isGetDataDown) {
      if (pricingHistory && pricingHistory.data.history) {
        if (!isGetDataDown) {
          vm.sourceData = pricingHistory.data.history;
          vm.currentdata = vm.sourceData.length;
        }
        else if (pricingHistory.data.history.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(pricingHistory.data.history);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = pricingHistory.data.Count;
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

    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePartPricingHistory().query(vm.pagingInfo).$promise.then((pricingHistory) => {
        vm.sourceData = [];
        if (pricingHistory.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(pricingHistory, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePartPricingHistory().query(vm.pagingInfo).$promise.then((pricingHistory) => {
        setDataAfterGetAPICall(pricingHistory, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
