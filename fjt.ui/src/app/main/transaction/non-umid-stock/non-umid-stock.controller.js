(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('NonUMIDStockController', NonUMIDStockController);

  /** @ngInject */
  function NonUMIDStockController($timeout, $state, ManufacturerFactory, $stateParams, BaseService, $scope, CORE, USER, TRANSACTION, ReceivingMaterialFactory, BinFactory, WarehouseBinFactory, DialogFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.isHideDelete = true;
    vm.isCreateSupplierRMA = true;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.NonUMIDStockList.Name;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.NONUMIDSTOCK;
    vm.packingSlipModeStatusOptionsGridHeaderDropdown = CORE.PackingSlipModeStatusOptionsGridHeaderDropdown;
    vm.PackingSlipModeStatus = CORE.PackingSlipModeStatus;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isNoDataFound = true;
    vm.configTimeout = _configTimeout;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isGoToUMIDManagement = true;
    vm.searchflag = false;
    vm.NonUMIDListTextFilter = {};
    vm.generateFilterChip = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.NonUMIDListAdvancedFilter = angular.copy(TRANSACTION.NonUMIDListAdvancedFilters);
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    let stateParamsDet = {
      whId: parseInt($stateParams.whId || 0),
      binId: parseInt($stateParams.binId || 0),
      keywords: $stateParams.keywords
    };

    vm.filter = {
      searchWareHouseType: CORE.CustomSearchTypeForList.Contains,
      searchPackingslipType: CORE.CustomSearchTypeForList.Contains,
      searchPidMfgPNType: CORE.CustomSearchTypeForList.Contains,
      supplierCodeDetailModel: []
    };

    if (stateParamsDet.keywords) {
      const filterList = stateParamsDet.keywords.split(_groupConcatSeparatorValue);
      vm.filter.searchPidMfgPN = filterList[0] ? filterList[0] : null;
      vm.filter.searchPackingSlip = filterList[1] ? filterList[1] : null;
      vm.supplierSearchText = filterList[2] ? filterList[2] : null;
      if (filterList[3]) {
        vm.filter.supplierCodeDetailModel.push(filterList[3]);
      }
    }

    vm.filter.searchPackingslipType = vm.filter.searchPackingSlip ? CORE.CustomSearchTypeForList.Exact : CORE.CustomSearchTypeForList.Contains;
    vm.filter.searchPidMfgPNType = vm.filter.searchPidMfgPN ? CORE.CustomSearchTypeForList.Exact : CORE.CustomSearchTypeForList.Contains;

    // Clear grid Column Filter
    vm.clearGridColumnFilter = (item) => {
      if (item) {
        item.filters[0].term = undefined;
        if (!item.isFilterDeregistered) {
          //refresh data grid
          vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
        }
      }
    };

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['packingSlipDate', 'DESC']],
        SearchColumns: [],
        whId: stateParamsDet.whId,
        binId: stateParamsDet.binId
      };
    };

    initPageInfo();

    const getWHDetail = () => {
      if (stateParamsDet.whId > 0) {
        vm.cgBusyLoading = WarehouseBinFactory.retriveWarehouse().query({ id: stateParamsDet.whId }).$promise.then((response) => {
          if (response.data && response.data) {
            vm.filter.searchWarehouseBin = response.data.Name;
            vm.filter.searchWareHouseType = vm.filter.searchWarehouseBin ? CORE.CustomSearchTypeForList.Exact : CORE.CustomSearchTypeForList.Contains;
            stateParamsDet.whId = 0;
            vm.pagingInfo.whId = stateParamsDet.whId;
            stateParamsDet.binId = 0;
            vm.pagingInfo.binId = stateParamsDet.binId;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const getBinDetail = () => {
      if (stateParamsDet.binId > 0) {
        vm.cgBusyLoading = BinFactory.retriveBin().query({ id: stateParamsDet.binId }).$promise.then((response) => {
          if (response.data && response.data) {
            vm.filter.searchWarehouseBin = response.data.Name;
            vm.filter.searchWareHouseType = vm.filter.searchWarehouseBin ? CORE.CustomSearchTypeForList.Exact : CORE.CustomSearchTypeForList.Contains;
            vm.generateFilterChip = true;
            vm.NonUMIDListAdvancedFilter.SearchWarehouseBin.isDeleted = false;
            stateParamsDet.binId = 0;
            vm.pagingInfo.binId = stateParamsDet.binId;
            stateParamsDet.whId = 0;
            vm.pagingInfo.whId = stateParamsDet.whId;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* manufacturer / supplier drop - down fill up */
    vm.getMfgSearch = () => {
      vm.supplierSearchText = vm.supplierSearchText ? vm.supplierSearchText : undefined;
      const searchObj = {
        mfgType: CORE.MFG_TYPE.DIST,
        isCodeFirst: true
      };

      return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
        vm.supplierCodeDetail = vm.supplierCodeListToDisplay = [];
        vm.supplierCodeDetail = vm.supplierCodeListToDisplay = mfgcodes.data;
        if (vm.supplierSearchText) {
          vm.searchSupplierList();
          vm.generateFilterChip = true;
          vm.NonUMIDListAdvancedFilter.Supplier.isDeleted = false;
          vm.supplierSearchText = undefined;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function init() {
      if (stateParamsDet.binId) {
        getBinDetail();
      } else if (stateParamsDet.whId) {
        getWHDetail();
      }
      vm.getMfgSearch();
      vm.isPending = true;
      vm.isAccepted = true;
      vm.isAcceptedWithDeviation = true;
      vm.isRejected = true;
    }

    init();

    vm.searchSupplierList = () => {
      const supplierListToFilter = angular.copy(vm.supplierCodeDetail);
      vm.supplierCodeListToDisplay = vm.supplierSearchText ? _.filter(supplierListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.supplierSearchText.toLowerCase())) : supplierListToFilter;
    };

    vm.clearSupplierSearchText = () => {
      vm.supplierSearchText = undefined;
      vm.searchSupplierList();
    };

    vm.advanceFilterSearch = () => {
      vm.callLoadData = true;
      if (!vm.nonUMIDStockForm.$valid && BaseService.focusRequiredField(vm.nonUMIDStockForm)) {
        return;
      }
      initPageInfo();
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
          if (!_.isEmpty(col.filters[0].term)) {
            vm.callLoadData = false;
            col.filters[0].term = undefined;
          }
        });
      }
      vm.loadData();
    };

    vm.resetFilter = (isClearAll) => {
      stateParamsDet = {
        whId: 0,
        binId: 0,
        keywords: ''
      };
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
          if (!_.isEmpty(col.filters[0].term)) {
            vm.callLoadData = false;
            col.filters[0].term = undefined;
          }
        });
      }
      vm.filter.searchPidMfgPNType = CORE.CustomSearchTypeForList.Contains;
      vm.filter.searchPackingslipType = CORE.CustomSearchTypeForList.Contains;
      vm.filter.searchWareHouseType = CORE.CustomSearchTypeForList.Contains;
      vm.isPending = vm.isAccepted = vm.isAcceptedWithDeviation = vm.isRejected = !isClearAll;
      vm.filter.searchPidMfgPN = null;
      vm.filter.searchPackingSlip = null;
      vm.filter.searchWarehouseBin = null;
      vm.filter.supplierCodeDetailModel = [];
      vm.callLoadData = true;
      vm.resetDateFilter();
      initPageInfo();
      vm.NonUMIDListTextFilter = {};
      vm.clearSupplierSearchText();
      $state.transitionTo(TRANSACTION.TRANSACTION_NONUMIDSTOCK_STATE, { whId: 0, binId: 0, keywords: '' }, { location: true, inherit: true, relative: $state.$current, notify: false });
      vm.loadData();
    };

    // Clear selected master filters from boxes
    vm.clearSelection = () => {
      vm.clearSupplierFilter();
      vm.resetDateFilter();
      vm.filter.searchPackingslipType = vm.CustomSearchTypeForList.Contains;
      vm.filter.searchPackingSlip = null;
      vm.isPending = vm.isAccepted = vm.isRejected = vm.isAcceptedWithDeviation = false;
      vm.filter.searchWareHouseType = vm.CustomSearchTypeForList.Contains;
      vm.filter.searchWarehouseBin = null;
      vm.filter.searchPidMfgPNType = vm.CustomSearchTypeForList.Contains;
      vm.filter.searchPidMfgPN = null;
      vm.packingSlipFromDate = vm.packingSlipToDate = null;
      initPageInfo();
      vm.loadData();
    };

    vm.removeAppliedFilter = (item) => {
      if (item) {
        item.isDeleted = true;
        switch (item.value) {
          case vm.NonUMIDListAdvancedFilter.Supplier.value:
            vm.clearSupplierFilter();
            break;
          case vm.NonUMIDListAdvancedFilter.SearchPackingSlip.value:
            vm.filter.searchPackingslipType = vm.CustomSearchTypeForList.Contains;
            vm.filter.searchPackingSlip = null;
            break;
          case vm.NonUMIDListAdvancedFilter.ReceivedStatus.value:
            vm.isPending = vm.isAccepted = vm.isRejected = vm.isAcceptedWithDeviation = true;
            break;
          case vm.NonUMIDListAdvancedFilter.SearchWarehouseBin.value:
            vm.filter.searchWareHouseType = vm.CustomSearchTypeForList.Contains;
            vm.filter.searchWarehouseBin = null;
            break;
          case vm.NonUMIDListAdvancedFilter.SearchPidMfrPn.value:
            vm.filter.searchPidMfgPNType = vm.CustomSearchTypeForList.Contains;
            vm.filter.searchPidMfgPN = null;
            break;
          case vm.NonUMIDListAdvancedFilter.PackingSlipDate.value:
            vm.packingSlipFromDate = vm.packingSlipToDate = null;
            break;
          case vm.NonUMIDListAdvancedFilter.ClearAll.value:
            vm.resetFilter(true);
            break;
          default:
            break;
        }
        initPageInfo();
        vm.loadData();
      }
    };

    vm.clearSupplierFilter = () => {
      vm.filter.supplierCodeDetailModel = [];
      vm.getMfgSearch();
      if (vm.pagingInfo.supplierIds) {
        vm.advanceFilterSearch();
      }
    };

    vm.removePidMfgPN = () => {
      vm.filter.searchPidMfgPN = null;
      vm.loadData();
    };

    vm.removeWarehouseBin = () => {
      vm.filter.searchWarehouseBin = null;
      vm.loadData();
    };

    vm.removePackingSlip = () => {
      vm.filter.searchPackingSlip = null;
      vm.loadData();
    };

    vm.scanSearchKey = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          vm.loadData();
        }
      });
    };

    vm.isClearSelectionDisabled = () => (!vm.filter.searchPackingSlip && !vm.filter.searchPidMfgPN && !vm.filter.searchWarehouseBin && !vm.packingSlipFromDate && !vm.packingSlipToDate
      && !vm.isPending && !vm.isAccepted && !vm.isRejected && !vm.isAcceptedWithDeviation
      && !(vm.filter.supplierCodeDetailModel && vm.filter.supplierCodeDetailModel.length > 0)
    );

    vm.showDescription = (object, ev) => {
      const data = {
        title: vm.CORE.LabelConstant.MFG.MFGPNDescription,
        description: object.mfgPNDescription
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.sourceHeader = [
      {
        field: 'Action',
        displayName: 'Action',
        width: '80',
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
        pinnedLeft: true,
        enableSorting: false,
        enableCellEdit: false
      }, {
        field: 'receivedStatusValue',
        displayName: 'Received Status',
        width: '185',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                              ng-class="{\'label-success\':row.entity.receivedStatus == \'A\', \
                                  \'label-warning\':row.entity.receivedStatus == \'P\', \
                                  \'light-green-bg\':row.entity.receivedStatus == \'AD\', \
                                  \'label-danger\':row.entity.receivedStatus == \'R\'}"> \
                                        {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'supplierCodeName',
        width: 200,
        displayName: 'Supplier',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierCodeID);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.Supplier" text="row.entity.supplierCodeName"></copy-text>\
                           </div>'
      },
      {
        field: 'poNumber',
        width: '150',
        displayName: 'PO#',
        cellTemplate: '<div class="ui-grid-cell-contents">\
                              <span ng-if="!row.entity.poID">{{COL_FIELD}}</span>\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetail(row.entity);" tabindex="-1" ng-if="row.entity.poID">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.PURCHASE_ORDER.PO" text="row.entity.poNumber"></copy-text>\
                           </div>'
      },
      {
        field: 'packingSlipNumber',
        width: '180',
        displayName: vm.CORE.LabelConstant.UMIDManagement.PackingSlipNumber,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManagePackingSlipDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.UMIDManagement.PackingSlipNumber" text="row.entity.packingSlipNumber"></copy-text>\
                           </div>'
      },
      {
        field: 'packingSlipModeStatusValue',
        displayName: 'Packing Slip Posting Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="{\'label-warning\':row.entity.packingSlipModeStatus == grid.appScope.$parent.vm.PackingSlipModeStatus[0].ID ,\
                        \'label-primary\':row.entity.packingSlipModeStatus == grid.appScope.$parent.vm.PackingSlipModeStatus[1].ID }"> \
                            {{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: 120,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.packingSlipModeStatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'packingSlipName',
        displayName: vm.CORE.LabelConstant.UMIDManagement.COFC,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToPackingSlipDocument(row.entity)" class="cursor-pointer">{{COL_FIELD}}</a></div>',
        width: '180',
        allowCellFocus: false
      },
      {
        field: 'packingSlipDate',
        displayName: 'Packing Slip Date',
        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        type: 'date'
      },
      {
        field: 'packagingType',
        displayName: 'Packaging Type',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140',
        allowCellFocus: false
      },
      {
        field: 'mfgCodeName',
        width: 200,
        displayName: vm.CORE.LabelConstant.MFG.MFG,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgCodeID);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFG" text="row.entity.mfgCodeName"></copy-text>\
                           </div>'
      },
      {
        field: 'mfgPN',
        displayName: vm.CORE.LabelConstant.MFG.MFGPN,
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.PartId" \
                                    component-id="row.entity.PartId" \
                                    label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.ID" \
                                    value="row.entity.mfgPN" \
                                    is-copy="true" \
                                    rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                    rohs-status="row.entity.rohsName" \
                                    is-custom-part="row.entity.isCustom" \
                                    is-search-digi-key="true"\
                                    is-search-findchip="true"></common-pid-code-label-link></div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'pidCode',
        displayName: CORE.LabelConstant.MFG.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.PartId" \
                                        label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.PID" \
                                        value="row.entity.pidCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        is-custom-part="row.entity.isCustom"\
                                        mfg-label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-copy-ahead-label="true" \
                                        is-search-digi-key="true" \
                                        is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        allowCellFocus: false
      },
      {
        field: 'mfgPNDescription',
        displayName: vm.CORE.LabelConstant.MFG.MFGPNDescription,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.mfgPNDescription && row.entity.mfgPNDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>',
        width: '200',
        allowCellFocus: false
      },
      {
        field: 'nickname',
        displayName: 'Nickname',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '140',
        allowCellFocus: false
      },
      {
        field: 'binName',
        displayName: 'Location/Bin',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '180',
        allowCellFocus: false

      },
      {
        field: 'warehouseName',
        displayName: 'Warehouse',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '180',
        allowCellFocus: false
      },
      {
        field: 'departmentName',
        displayName: 'Department',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '200',
        allowCellFocus: false
      },
      {
        field: 'InQty',
        displayName: 'Received Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '100',
        allowCellFocus: false
      },
      {
        field: 'UMIDCreatedQty',
        displayName: 'UMID Created Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '100',
        allowCellFocus: false
      },
      {
        field: 'returnQty',
        displayName: 'Returned Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '100',
        allowCellFocus: false
      },
      {
        field: 'BalanceQty',
        displayName: 'UMID pending Qty',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '90',
        allowCellFocus: false
      },
      {
        field: 'noOfPackage',
        displayName: 'No of Possible UMID',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: '90',
        allowCellFocus: false
      }];

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Non-UMIDStockList.csv',
      CurrentPage: CORE.PAGENAME_CONSTANT[56].PageName,
      rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-non-umid-rejected-bgcolor\': row.entity.receivedStatus === \'R\' }" role="gridcell" ui-grid-cell="">'
    };


    // Get Tool tip for selected filters
    function getFilterTooltip(displayList, selectedModdel, idFieldName, valueFieldName, optionalLabel) {
      var maxTooltipLimit = 10;
      var isTooltipGreatrtthenLimit = false;
      var moreTooltipText = '<br />more...';
      if (displayList && displayList.length && selectedModdel && ((Array.isArray(selectedModdel) ? selectedModdel.length : true))) {
        let toolTipText;
        if (Array.isArray(selectedModdel)) {
          toolTipText = displayList.filter((item) => item[idFieldName] && selectedModdel.includes(item[idFieldName].toString()));
        }
        else {
          toolTipText = displayList.filter((item) => item[idFieldName] === selectedModdel);
        }
        if (toolTipText && toolTipText.length > maxTooltipLimit) {
          toolTipText = toolTipText.splice(0, maxTooltipLimit);
          isTooltipGreatrtthenLimit = true;
        }
        toolTipText = toolTipText.map((a) => a[valueFieldName]);
        return (optionalLabel ? (optionalLabel + ': ') : '') + toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '') + (optionalLabel ? '<br />' : '');
      }
      else {
        return '';
      }
    }

    function setDataAfterGetAPICall(stock, isGetDataDown) {
      if (stock && stock.data.stockList) {
        if (!isGetDataDown) {
          vm.sourceData = stock.data.stockList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (stock.data.stockList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(stock.data.stockList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        _.each(vm.sourceData, (item) => {
          if (item.packingSlipModeStatus === vm.PackingSlipModeStatus[0].ID) {
            item.isDisableCreateRMA = true;
            item.isDisableGoToUMIDManagement = true;
          } else if (item.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[0].value || item.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[2].value) {
            item.isDisableGoToUMIDManagement = true;
          }
        });

        // must set after new data comes
        vm.totalSourceDataCount = stock.data.Count;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.generateFilterChip) {
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

    function generateSearchCriteria() {
      vm.generateFilterChip = false;
      if (vm.filter.supplierCodeDetailModel && vm.filter.supplierCodeDetailModel.length > 0) {
        vm.pagingInfo.supplierIds = vm.filter.supplierCodeDetailModel.join(',');
        vm.generateFilterChip = true;
        vm.NonUMIDListAdvancedFilter.Supplier.isDeleted = false;
        vm.NonUMIDListAdvancedFilter.Supplier.tooltip = getFilterTooltip(vm.supplierCodeListToDisplay, vm.filter.supplierCodeDetailModel, 'id', 'mfgCodeName');
      } else {
        vm.pagingInfo.supplierIds = null;
        vm.NonUMIDListAdvancedFilter.Supplier.isDeleted = true;
      }

      if (vm.filter.searchPidMfgPN) {
        vm.pagingInfo.isMPNExactSearch = vm.filter.searchPidMfgPNType === CORE.CustomSearchTypeForList.Exact ? true : false;
        vm.pagingInfo.scanMPNPID = vm.filter.searchPidMfgPN;
        vm.generateFilterChip = true;
        vm.NonUMIDListAdvancedFilter.SearchPidMfrPn.isDeleted = false;
        vm.NonUMIDListAdvancedFilter.SearchPidMfrPn.tooltip = vm.filter.searchPidMfgPN;
      } else {
        vm.pagingInfo.scanMPNPID = null;
        vm.NonUMIDListAdvancedFilter.SearchPidMfrPn.isDeleted = true;
      }

      if (vm.filter.searchWarehouseBin) {
        vm.pagingInfo.isBinExactSearch = vm.filter.searchWareHouseType === CORE.CustomSearchTypeForList.Exact ? true : false;
        vm.pagingInfo.binWarehouse = vm.filter.searchWarehouseBin;
        vm.generateFilterChip = true;
        vm.NonUMIDListAdvancedFilter.SearchWarehouseBin.isDeleted = false;
        vm.NonUMIDListAdvancedFilter.SearchWarehouseBin.tooltip = vm.filter.searchWarehouseBin;
      } else {
        vm.pagingInfo.binWarehouse = null;
        vm.NonUMIDListAdvancedFilter.SearchWarehouseBin.isDeleted = true;
      }

      if (vm.filter.searchPackingSlip) {
        vm.pagingInfo.isPackingSlipExactSearch = vm.filter.searchPackingslipType === CORE.CustomSearchTypeForList.Exact ? true : false;
        vm.pagingInfo.packingSlip = vm.filter.searchPackingSlip;
        vm.generateFilterChip = true;
        vm.NonUMIDListAdvancedFilter.SearchPackingSlip.isDeleted = false;
        vm.NonUMIDListAdvancedFilter.SearchPackingSlip.tooltip = vm.filter.searchPackingSlip;
      } else {
        vm.pagingInfo.packingSlip = null;
        vm.NonUMIDListAdvancedFilter.SearchPackingSlip.isDeleted = true;
      }

      let strFilter = '';
      const ReceviedStatusTooltip = [];
      if (vm.isPending && vm.isAccepted && vm.isRejected && vm.isAcceptedWithDeviation) {
        vm.NonUMIDListAdvancedFilter.ReceivedStatus.isDeleted = false;
        vm.generateFilterChip = true;
        vm.pagingInfo.receivedFilterStatus = '';
      } else {
        if (vm.isPending) {
          strFilter = stringFormat('{0},{1}', strFilter, TRANSACTION.PackingSlipReceivedStatus[0].value);
          ReceviedStatusTooltip.push(TRANSACTION.PackingSlipReceivedStatus[0].key);
        }
        if (vm.isAccepted) {
          strFilter = stringFormat('{0},{1}', strFilter, TRANSACTION.PackingSlipReceivedStatus[1].value);
          ReceviedStatusTooltip.push(TRANSACTION.PackingSlipReceivedStatus[1].key);
        }
        if (vm.isRejected) {
          strFilter = stringFormat('{0},{1}', strFilter, TRANSACTION.PackingSlipReceivedStatus[2].value);
          ReceviedStatusTooltip.push(TRANSACTION.PackingSlipReceivedStatus[2].key);
        }
        if (vm.isAcceptedWithDeviation) {
          strFilter = stringFormat('{0},{1}', strFilter, TRANSACTION.PackingSlipReceivedStatus[3].value);
          ReceviedStatusTooltip.push(TRANSACTION.PackingSlipReceivedStatus[3].key);
        }
      }
      if (strFilter.length > 0) {
        vm.NonUMIDListAdvancedFilter.ReceivedStatus.isDeleted = false;
        vm.generateFilterChip = true;
        vm.pagingInfo.receivedFilterStatus = strFilter.substring(1);
      } else {
        vm.pagingInfo.receivedFilterStatus = '';
      }
      vm.NonUMIDListAdvancedFilter.ReceivedStatus.tooltip = vm.isPending && vm.isAccepted && vm.isRejected && vm.isAcceptedWithDeviation ? 'All' : `${ReceviedStatusTooltip.join('<br />')}`;
      vm.NonUMIDListAdvancedFilter.PackingSlipDate.isDeleted = !(vm.packingSlipFromDate || vm.packingSlipToDate);
      if (vm.packingSlipFromDate) {
        vm.pagingInfo.packingSlipFromDate = (BaseService.getAPIFormatedDate(vm.packingSlipFromDate));
      }
      else {
        vm.pagingInfo.packingSlipFromDate = null;
      }
      if (vm.packingSlipToDate) {
        vm.pagingInfo.packingSlipToDate = (BaseService.getAPIFormatedDate(vm.packingSlipToDate));
      }
      else {
        vm.pagingInfo.packingSlipToDate = null;
      }

      if (vm.pagingInfo.packingSlipFromDate && vm.pagingInfo.packingSlipToDate) {
        vm.NonUMIDListAdvancedFilter.PackingSlipDate.tooltip = 'From:' + $filter('date')(new Date(vm.pagingInfo.packingSlipFromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.pagingInfo.packingSlipToDate), vm.DefaultDateFormat);
      } else {
        if (vm.pagingInfo.packingSlipFromDate) {
          vm.NonUMIDListAdvancedFilter.PackingSlipDate.tooltip = 'From: ' + $filter('date')(new Date(vm.pagingInfo.packingSlipFromDate), vm.DefaultDateFormat);
        }
        if (vm.pagingInfo.packingSlipToDate) {
          vm.NonUMIDListAdvancedFilter.PackingSlipDate.tooltip = 'To: ' + $filter('date')(new Date(vm.pagingInfo.packingSlipToDate), vm.DefaultDateFormat);
        }
      }

      vm.generateFilterChip = vm.generateFilterChip ? vm.generateFilterChip : !vm.NonUMIDListAdvancedFilter.PackingSlipDate.isDeleted;
      vm.NonUMIDListAdvancedFilter.ClearAll.isDeleted = !vm.generateFilterChip;
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
      }
    }

    /* Retrieve verification history*/
    vm.loadData = () => {
      if (vm.callLoadData === false) {
        vm.callLoadData = true;
        return;
      }
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      generateSearchCriteria();
      vm.cgBusyLoading = ReceivingMaterialFactory.getNonUMIDStockList().query(vm.pagingInfo).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(response, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = ReceivingMaterialFactory.getNonUMIDStockList().query(vm.pagingInfo).$promise.then((response) => {
        if (response) {
          setDataAfterGetAPICall(response, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Go to UMID Management screen
    vm.goToUMIDManagement = (row) => {
      if (row && row.entity) {
        const objBin = {
          id: row.entity.BinID,
          Name: row.entity.binName,
          WarehouseID: row.entity.WarehouseID,
          WarehouseName: row.entity.warehouseName,
          parentWHID: row.entity.departmentId,
          parentWHName: row.entity.departmentName,
          nickName: row.entity.nickname
        };
        setLocalStorageValue('PendingUMIDMFRPN', { mfrpn: row.entity.mfgPN, FromBinForUMID: objBin, prefix: row.entity.nickname });
      }
      BaseService.goToUMIDDetail();
    };

    // open Create Supplier RMA popup
    vm.createSupplierRMA = (row, ev) => {
      if (row) {
        const objData = {
          mfgCodeID: row.supplierCodeID,
          supplierCodeName: row.supplierCodeName,
          PartId: row.PartId,
          mfgPN: row.mfgPN,
          pidCode: row.pidCode,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsName,
          packingSlipID: row.packingSlipID,
          packingSlipNumber: row.packingSlipNumber
        };
        DialogFactory.dialogService(
          TRANSACTION.SUPPLIER_RMA_CREATE_POPUP_CONTROLLER,
          TRANSACTION.SUPPLIER_RMA_CREATE_POPUP_VIEW,
          ev,
          objData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.goToPackingSlipDocument = (row) => {
      BaseService.goToPackingSlipDocument(row.packingSlipID);
    };

    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };

    vm.goToSupplier = (supplierId) => {
      if (supplierId) {
        BaseService.goToSupplierDetail(supplierId);
      }
    };

    vm.goToPurchaseOrderDetail = (row) => {
      if (row) {
        BaseService.goToPurchaseOrderDetail(row.poID);
      }
    };

    vm.goToManagePackingSlipDetail = (row, type) => {
      if (row) {
        BaseService.goToManagePackingSlipDetail(row.packingSlipID, type);
      }
    };

    vm.goToManufacturer = (mfgCodeID) => {
      BaseService.goToManufacturer(mfgCodeID);
    };
  }
})();
