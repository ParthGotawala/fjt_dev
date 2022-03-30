(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('receivingMaterial', receivingMaterial);

  /** @ngInject */
  function receivingMaterial(BaseService, $q, $mdDialog, $timeout, $state, $stateParams, CORE, USER, EmployeeFactory, TRANSACTION, ReceivingMaterialFactory, DialogFactory, $rootScope, RFQTRANSACTION, ComponentFactory, KitAllocationFactory, CertificateStandardFactory, BinFactory, WarehouseBinFactory, socketConnectionService, PRICING, ManufacturerFactory, ImportExportFactory, NotificationFactory, MasterFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        partId: '=?',
        isFilterHidden: '=?',
        isShowPackagingAlias: '=?',
        assyIds: '=?',
        customerId: '=?'
      },
      templateUrl: 'app/directives/custom/receiving-material/receiving-material.html',
      controller: receivingMaterialCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function receivingMaterialCtrl($scope, $element, $attrs, $filter) {
      const vm = this;
      vm.CORE = CORE;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.isFilterHidden = $scope.isFilterHidden ? $scope.isFilterHidden : false;
      vm.warehouseType = TRANSACTION.warehouseType;
      vm.miscFilter = TRANSACTION.miscFilter;
      vm.InventoryType = TRANSACTION.InventoryType;
      vm.isUpdatable = true;
      vm.showTransfer = true;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.RECEIVINGMATERIAL;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      vm.configTimeout = _configTimeout;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.pricecategory = true;
      vm.showcamera = false;
      vm.showTransferLabel = true;
      vm.showUMIDHistory = true;
      vm.umidHistoryIcon = CORE.UMID_HISTORY_ICON;
      vm.actionButtonName = vm.LabelConstant.UMIDManagement.History;
      vm.colorStatus = true;
      vm.isPrintLabel = true;
      vm.isIdenticalUID = true;
      vm.CPNDropDown = CORE.CPNDropDown;
      vm.UMIDReserved = CORE.UMIDReserved;
      vm.MFGAvailable = CORE.MFGAvailable;
      vm.UMIDRestricted = CORE.UMIDRestricted;
      vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
      vm.isMoreFilterVisible = false;
      vm.isShowRestrictUMIDHistory = true;
      vm.isSplitUID = true;
      vm.gridConfig = CORE.gridConfig;
      vm.searchflag = false;
      vm.currentState = $state.current.name;
      vm.UMIDListAdvanceFilter = angular.copy(TRANSACTION.UMIDListAdvancedFilters);
      vm.UMIDListTextFilter = {};
      vm.generateFilterChip = false;
      vm.callLoadData = false;
      if (vm.currentState === TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
        vm.refSalesOrderDetID = $stateParams.id ? parseInt($stateParams.id) : 0;
      } else {
        vm.refSalesOrderDetID = $stateParams.refSalesOrderDetID ? parseInt($stateParams.refSalesOrderDetID) : 0;
      }
      let UMID_COLUMN_MAPPING = CORE.UMID_COLUMN_MAPPING;
      let dataElementList = [];
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.UMIDTextAdvanceFilterTypeDropDown = TRANSACTION.UMIDTextAdvanceFilterTypeDropDown;
      vm.umidTextAdvanceFilterType = vm.UMIDTextAdvanceFilterTypeDropDown[0].id;
      vm.UMID_LIST_SUPPLIER_FILTER = CORE.UMID_LIST_SUPPLIER_FILTER;
      vm.UMID_LIST_CUSTOMER_STOCK_FILTER = CORE.UMID_LIST_CUSTOMER_STOCK_FILTER;
      vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
      vm.UMID_TEXT_BOX_ADVANCE_FILTER_SEARCH_HELPER_TEXT = 'Enter Description or Detailed Description and press Enter to add search criteria and get the search results.';
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      vm.filter = {
        isInStock: true,
        searchType: vm.CustomSearchTypeForList.Contains,
        functionalType: [],
        mountingType: [],
        refSalesOrderDetID: [],
        assyID: [],
        standard: [],
        costCategory: [],
        department: [],
        warehouseType: [],
        warehouse: [],
        miscType: [],
        rohsStatus: [],
        expiredDay: 0,
        fromDate: null,
        toDate: null,
        isNonCofc: false
      };
      let SearchColumnsDynamicColumn = [];
      vm.isCustomerStockNotSelected = false;

      //Get details of site map crumb
      $timeout(() => {
        vm.crumbs = BaseService.getCrumbs();
      }, _configBreadCrumbTimeout);

      let stateParamsDet = {
        whId: parseInt($stateParams.whId || 0),
        binId: parseInt($stateParams.binId || 0),
        refSalesOrderDetID: vm.refSalesOrderDetID,
        assyID: parseInt($stateParams.assyID || 0),
        keywords: $stateParams.keywords
      };

      if (stateParamsDet.keywords) {
        vm.filter.searchPidUmidMfgPN = decodeURIComponent(stateParamsDet.keywords);
      }

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: '180',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true,
          allowCellFocus: false
        },
        {
          field: '#',
          displayName: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          pinnedLeft: true,
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'inovexStatus',
          displayName: 'Smart Cart Status',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
          width: '120',
          maxWidth: '250',
          allowCellFocus: false,
          visible: false,
          isConditionallyVisibleColumn: true
        },
        {
          field: 'uid',
          displayName: 'UMID',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.id,row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.UMID" text="row.entity.uid"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'fromUID',
          displayName: vm.LabelConstant.UMIDManagement.FromUMID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.fromUIDId,row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text ng-if="row.entity.fromUIDId" label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.FromUMID" text="row.entity.fromUID"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'parentUID',
          displayName: vm.LabelConstant.UMIDManagement.ParentUMID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> \
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToUIDManage(row.entity.parentUIDId,row.entity)" class="cm-text-decoration underline cursor-pointer">{{COL_FIELD | uppercase}}</a> \
                        <copy-text ng-if="row.entity.parentUIDId" label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.ParentUMID" text="row.entity.parentUID"></copy-text></div>',
          width: '170',
          allowCellFocus: false
        },
        {
          field: 'isTransit',
          displayName: 'In Transit (Bin to Bin)',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><b>{{COL_FIELD}}</b></div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'searchUser',
          displayName: 'Searched By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><b>{{COL_FIELD}}</b></div>',
          width: '140',
          allowCellFocus: false
        },
        {
          field: 'displayStockInventoryType',
          displayName: 'Inventory Type',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-warning\':row.entity.stockInventoryType == grid.appScope.$parent.vm.InventoryType[0].value,\
                        \'label-success\':row.entity.stockInventoryType == grid.appScope.$parent.vm.InventoryType[1].value,\
                        \'label-primary\':row.entity.stockInventoryType == grid.appScope.$parent.vm.InventoryType[2].value, \
                        \'label-info\':row.entity.stockInventoryType == grid.appScope.$parent.vm.InventoryType[3].value}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '210',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: TRANSACTION.InventoryTypeDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'displayReceiveMaterialType',
          displayName: 'Receive Parts to Stock',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.receiveMaterialType == grid.appScope.$parent.vm.CORE.ReceivingMatirialTab.PartToStock.Code,\
                        \'label-primary\':row.entity.receiveMaterialType == grid.appScope.$parent.vm.CORE.ReceivingMatirialTab.CPNReceive.Code}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '210',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: TRANSACTION.ReceiveMaterialTypeDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'UMIDrohsStatus',
          displayName: 'UMID RoHS Status',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '150',
          allowCellFocus: false
        },
        {
          field: 'PIDCode',
          displayName: CORE.LabelConstant.MFG.PID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.refcompid" \
                                        label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-copy-ahead-label="true" \
                                        is-custom-part="row.entity.isCustom"\
                                        cust-part-number="row.entity.custAssyPN"\
                                        restrict-use-permanently="row.entity.restrictUsePermanently" \
                                        restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                        restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                        restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" > \
                                    </common-pid-code-label-link></div>',
          width: '300',
          allowCellFocus: false
        },
        {
          field: 'allocatedToKit',
          displayName: 'Allocated In Kit',
          cellTemplate: ' <div class="ui-grid-cell-contents text-left">\
                          <a ng-click="grid.appScope.$parent.vm.allocatedKit(row.entity)" class="cursor-pointer" tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.AllocatedInKit" text="COL_FIELD" ng-if="COL_FIELD"></copy-text></div>\
                          </div>',
          width: '330',
          allowCellFocus: false
        },
        {
          field: 'expiryDate',
          displayName: vm.LabelConstant.UMIDManagement.DateOfExpiration,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '120',
          allowCellFocus: false,
          type: 'datetime'
        },
        {
          field: 'expiredStatus',
          displayName: 'Expired Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-if="row.entity.expiredStatus" \
                        ng-class="{\'label-danger\':row.entity.expiredStatus == \'Expired\'}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '100',
          allowCellFocus: false,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'side',
          displayName: 'Current Side',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.InovaxeSideDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true

        },
        {
          field: 'location',
          displayName: CORE.LabelConstant.TransferStock.CurrentLocation,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'warehouse',
          displayName: 'Current Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '140',
          allowCellFocus: false
        },
        {
          field: 'department',
          displayName: 'Current Department',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'spq',
          displayName: 'SPQ',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'orgQty',
          displayName: 'Initial Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'orgPkgUnit',
          displayName: 'Initial Units',
          cellTemplate: '<div class="ui-grid-cell-contents  grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'pkgQty',
          displayName: 'Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'totalScrapUnit',
          displayName: 'Scrapped Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'perScrapQty',
          displayName: 'Scrapped Qty (%)',
          cellTemplate: '<div>'
            + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.perScrapQty || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span>{{(row.entity.perScrapQty || 0)}}%</span></span>'
            + '<md-tooltip md-direction="top">Scrapped Qty (%)</md-tooltip>'
            + '</md-button>'
            + '</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'costScrapQty',
          displayName: 'Scrap Qty Cost ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD }}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'pkgUnit',
          displayName: 'Units',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{row.entity.uomClassID === grid.appScope.$parent.vm.MEASUREMENT_TYPES_COUNT.ID ? (COL_FIELD)  : (COL_FIELD | unit)}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'uomName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'packingSlipName',
          displayName: 'COFC',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToCofC(row.entity)" class="cursor-pointer">{{COL_FIELD}}</a>\
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.COFC" text="COL_FIELD" ng-if="COL_FIELD"></copy-text></div>\
                        </div> ',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'packingSupplierName',
          displayName: 'PS Supplier',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity)" class= "cursor-pointer">{{ COL_FIELD }}</a>\
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.PSSupplier" text="COL_FIELD" ng-if="COL_FIELD"></copy-text></div>\
                        </div> ',
          width: '150',
          allowCellFocus: false
        },
        {
          field: 'packingSlipNumber',
          displayName: vm.LabelConstant.UMIDManagement.PackingSlipNumber,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                              <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                              <copy-text ng-if="row.entity.packingSlipNumber" label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.PackingSlipNumber" text="row.entity.packingSlipNumber"></copy-text>\
                           </div>',
          width: '150',
          allowCellFocus: false
        },
        {
          field: 'mfrDateCode',
          displayName: 'MFR Label Date Code From Reel',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'mfrDateCodeFormat',
          displayName: 'MFR Label Date Code Format',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'dateCode',
          displayName: 'Internal Date Code',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '80',
          allowCellFocus: false
        },
        {
          field: 'lotCode',
          displayName: 'Lot Code',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'costCategory',
          displayName: 'Cost Category',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'pcbPerArray',
          displayName: 'PCB Per Array',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'mslLevel',
          displayName: 'MSL',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'externalPartPackage',
          displayName: stringFormat('{0}(External)', vm.LabelConstant.PartAttribute.Package),
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'partPackage',
          displayName: stringFormat('{0}(Internal)', vm.LabelConstant.PartAttribute.Package),
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'pictureCount',
          displayName: 'Number Of Pictures',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a tabindex="-1" ng-click="grid.appScope.$parent.vm.verifyBarcodeLabel($event, row.entity)" class="cursor-pointer">{{COL_FIELD | numberWithoutDecimal}}</a></div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'mfg',
          displayName: CORE.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeID);">{{COL_FIELD}}</a>\
                                        </span> <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" text="row.entity.mfg" ng-if="row.entity.mfg"></copy-text></div>',
          width: '145',
          allowCellFocus: false
        },
        {
          field: 'mfgPN',
          displayName: CORE.LabelConstant.MFG.MPNCPN,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                    component-id="row.entity.refcompid" \
                                    label="grid.appScope.$parent.vm.CORE.LabelConstant.MFG.MFGPN" \
                                    value="row.entity.mfgPN" \
                                    is-copy="true" \
                                    rohs-icon="row.entity.rohsIcon" \
                                    rohs-status="row.entity.rohsName" \
                                    is-search-digi-key="true" \
                                    is-custom-part="row.entity.isCustom"\
                                    restrict-use-permanently="row.entity.restrictUsePermanently" \
                                    restrict-use-with-permission="row.entity.restrictUSEwithpermission" \
                                    restrict-packaging-use-permanently="row.entity.restrictPackagingUsePermanently" \
                                    restrict-packaging-use-with-permission="row.entity.restrictPackagingUseWithpermission" \
                                </common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: false
        },
        {
          field: 'mfgPNDescription',
          displayName: 'Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.mfgPNDescription && row.entity.mfgPNDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event, \'Description\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'detailDescription',
          displayName: 'Detailed Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.detailDescription && row.entity.detailDescription !== \'-\'" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event, \'DetailDescription\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '200',
          allowCellFocus: false
        },
        {
          field: 'cpn',
          displayName: CORE.LabelConstant.MFG.CPN + ' Available',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.cpn == \'Yes\',\
                        \'label-warning\':row.entity.cpn == \'No\' }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.CPNDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false,
          width: '100'
        },
        {
          field: 'customerConsign',
          displayName: 'Customer Consigned',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.customerConsign == \'Yes\',\
                        \'label-warning\':row.entity.customerConsign == \'No\' }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.CPNDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false,
          width: '100'
        },
        {
          field: 'reservedStock',
          displayName: 'Reserve STK',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                        ng-class="{\'label-success\':row.entity.reservedStock == \'Yes\',\
                        \'label-warning\':row.entity.reservedStock == \'No\' }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.UMIDReserved
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false,
          width: '100'
        },
        {
          field: 'customer',
          displayName: 'Customer',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '240',
          allowCellFocus: false
        },
        {
          field: 'assembly',
          displayName: 'Assy ID',
          cellTemplate: '<div class="ui-grid-cell-contents">\
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToPartDetails(row.entity.assyID)" class="cursor-pointer">{{COL_FIELD}}</a>\
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.AssyID" text="COL_FIELD" ng-if="COL_FIELD"></copy-text></div>\
                        </div>',
          width: '250',
          allowCellFocus: false
        },
        {
          field: 'nickName',
          displayName: 'Nickname',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '130',
          allowCellFocus: false
        },
        {
          field: 'mfgAvailable',
          displayName: 'Original MFR Label Visible For Customer Consigned Parts',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.mfgAvailable == \'Yes\',\
                            \'label-warning\':row.entity.mfgAvailable == \'No\' }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.MFGAvailable
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false,
          width: '220'
        },
        {
          field: 'cpnMFGCode',
          displayName: CORE.LabelConstant.UMIDManagement.CPNPartMFR,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToManufacturer(row.entity.cpnMFGCodeID);">{{COL_FIELD}}</a>\
                                        </span> <copy-text label="grid.appScope.$parent.vm.CORE.LabelConstant.UMIDManagement.CPNPartMFR" text="row.entity.cpnMFGCode" ng-if="row.entity.cpnMFGCode"></copy-text></div>',
          width: '145',
          allowCellFocus: false
        },
        {
          field: 'cpnMFGPN',
          displayName: CORE.LabelConstant.UMIDManagement.CPNPartMPN,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToPartDetails(row.entity.refCPNMFGPNID)" class="cursor-pointer">{{COL_FIELD}}</a>\
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.UMIDManagement.CPNPartMPN" text="COL_FIELD" ng-if="COL_FIELD"></copy-text></div>\
                        </div>',
          width: '250',
          allowCellFocus: false
        },
        {
          field: 'packagingName',
          displayName: 'Packaging',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'supplierMFGCode',
          displayName: 'Supplier Code',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '155',
          allowCellFocus: false
        },
        {
          field: 'supplieMFGPN',
          displayName: 'Supplier PN',
          cellTemplate: '<div class="ui-grid-cell-contents">\
                        <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToSupplierPartDetails(row.entity.refSupplierPartId)" class="cursor-pointer">{{COL_FIELD}}</a>\
                        <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.SupplierPN" text="COL_FIELD" ng-if="COL_FIELD"></copy-text></div>\
                        </div>',
          width: '250',
          allowCellFocus: false
        },
        {
          field: 'fromSide',
          displayName: 'From Side',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.InovaxeSideDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'fromBinName',
          displayName: 'From Location/Bin',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false

        },
        {
          field: 'fromWHName',
          displayName: 'From Warehouse',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'fromDepartmentName',
          displayName: 'From Department',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false
        },
        {
          field: 'woNumber',
          displayName: 'WO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '150',
          allowCellFocus: false
        },
        {
          field: 'scanlabel',
          displayName: 'Scanned Label',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300',
          allowCellFocus: false
        },
        {
          field: 'umidPrefix',
          displayName: 'UMID Prefix',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false
        },
        {
          field: 'UMIDRestricted',
          displayName: 'Restrict UMID',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.UMIDRestricted == \'Yes\',\
                            \'label-warning\':row.entity.UMIDRestricted == \'No\' }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.UMIDRestricted
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false,
          width: '100'
        },
        {
          field: 'reasonUMIDRestricted',
          displayName: 'Reason For Restricted UMID',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.reasonUMIDRestricted" ng-click="grid.appScope.$parent.vm.showReasonUMIDRestricted(row.entity, $event)"> \
                                View \
                            </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'countOfRestrictUMID',
          displayName: 'Restriction Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="COL_FIELD > 0" tabindex="-1" ng-click="grid.appScope.$parent.vm.restrictUMIDHistory(row, $event)" class="cursor-pointer">{{COL_FIELD | numberWithoutDecimal}}</a><span ng-if="COL_FIELD <= 0">{{COL_FIELD | numberWithoutDecimal}}</span></div>',
          width: '100',
          allowCellFocus: false
        },
        {
          field: 'specialNote',
          displayName: 'Special Note',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.specialNote" ng-click="grid.appScope.$parent.vm.showDescription(row.entity, $event, \'SpecialNote\')"> \
                                View \
                            </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: '120',
          enableCellEdit: false
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          allowCellFocus: false,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
          field: 'umidModifiedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          type: 'StringEquals',
          enableSorting: true,
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
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          enableSorting: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        },
        {
          field: 'createdByName',
          displayName: 'Created By',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
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
        }];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [['id', 'DESC']],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[7].PageName,
          isPrint: false,
          whId: stateParamsDet.whId,
          binId: stateParamsDet.binId,
          customerId: $stateParams.cid
        };
      };

      initPageInfo();

      vm.gridOptions = {
        /* added by kinjal for pagination */
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        allowToExportAllData: true,
        exporterCsvFilename: 'UMID List.csv',
        allowCellFocus: false,
        checkDeleteRoleWise: true,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return ReceivingMaterialFactory.getUMIDList().query(pagingInfoOld).$promise.then((receivingmaterial) => {
            if (receivingmaterial.status === CORE.ApiResponseTypeStatus.SUCCESS && receivingmaterial.data) {
              return receivingmaterial.data.component;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        },
        rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-restrict-umid-bgcolor\': row.entity.isUMIDRestrict }" role="gridcell" ui-grid-cell="">'
      };

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
      // search list page for supplier
      vm.searchEmployeeList = () => {
        const employeeListToFilter = angular.copy(vm.employeeList);
        vm.employeeListToDisplay = vm.employeeSearchText ? _.filter(employeeListToFilter, (item) => item.initialName.toLowerCase().contains(vm.employeeSearchText.toLowerCase())) : employeeListToFilter;
      };

      vm.clearEmployeeSearchText = () => {
        vm.employeeSearchText = undefined;
        vm.searchEmployeeList();
      };

      vm.clearEmployeeFilter = () => {
        vm.filter.employeeDetailModel = [];
        if (vm.pagingInfo.employeeIds) {
          vm.advanceFilterSearch();
        }
      };

      /* get Personnel List */
      vm.getEmployeeList = () => {
        vm.employeeSearchText = undefined;
        return EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
          vm.employeeList = employees.data;
          vm.employeeListToDisplay = angular.copy(vm.employeeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getEmployeeList();
      vm.checkDuplicateTextChip = (text) => {
        if (text) {
          const checkChipExists = _.find(SearchColumnsDynamicColumn, (data) => data === text);
          if (checkChipExists) {
            vm.filtersInfo.textSearch.$setValidity('duplicate', false);
            return false;
          } else {
            vm.filtersInfo.textSearch.$setValidity('duplicate', true);
            return true;
          }
        } else {
          vm.filtersInfo.textSearch.$setValidity('duplicate', true);
          return false;
        }
      };

      vm.createChipForTextSearch = (event, text) => {
        if ((!event || event.keyCode === 13) && vm.filtersInfo.$valid) {
          if (vm.umidTextAdvanceFilterType === vm.UMIDTextAdvanceFilterTypeDropDown[1].id) {
            const checkDuplicateTextChip = vm.checkDuplicateTextChip(text);
            if (checkDuplicateTextChip) {
              SearchColumnsDynamicColumn.push(text);
              vm.UMIDListTextFilter[text] = {
                value: text, isDeleted: false
              };
            }
          } else {
            const splitChip = text.split(' ');
            _.map(splitChip, (data) => {
              const checkDuplicateTextChip = vm.checkDuplicateTextChip(data);
              if (checkDuplicateTextChip) {
                SearchColumnsDynamicColumn.push(data);
                vm.UMIDListTextFilter[data] = {
                  value: data, isDeleted: false
                };
              }
            });
          }

          SearchColumnsDynamicColumn = _.map(SearchColumnsDynamicColumn, (item) => item.replace('\\', '\\\\\\\\\\'));
          SearchColumnsDynamicColumn = _.map(SearchColumnsDynamicColumn, (item) => item.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]').replace(/\(/g, '\\\\(').replace(/\)/g, '\\\\)').replace(/\+/g, '\\\\+').replace(/\$/g, '\\\\$').replace(/\^/g, '\\\\^').replace(/}/g, '\\\\}').replace(/{/g, '\\\\{').replace(/\*/g, '\\\\*').replace(/\|/g, '\\\\|').replace(/\?/g, '\\\\?'));
          vm.attributesSearch = null;
          vm.loadData();
        } else {
          console.log(vm.UMIDListTextFilter);
        }
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

      function generateSearchCriteria() {
        // added by - Kinjal
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.generateFilterChip = false;

        if (vm.pagingInfo.partId) {
          vm.pagingInfo.isInStock = true;
        }

        vm.pagingInfo.partId = $scope.partId;
        vm.pagingInfo.isShowPackagingAlias = $scope.isShowPackagingAlias;

        vm.pagingInfo.SearchColumns = _.filter(vm.pagingInfo.SearchColumns, (columns) => !columns.isExternalSearch);
        vm.pagingInfo.SearchDynamicTextColumns = [];

        if (vm.filter.mfgCodeDetailModel && vm.filter.mfgCodeDetailModel.length > 0) {
          vm.pagingInfo.mfgcodeID = vm.filter.mfgCodeDetailModel.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.MfgCode.isDeleted = false;
          vm.UMIDListAdvanceFilter.MfgCode.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.filter.mfgCodeDetailModel, 'id', 'mfgCodeName');
        } else {
          vm.pagingInfo.mfgcodeID = null;
          vm.UMIDListAdvanceFilter.MfgCode.isDeleted = true;
        }

        if (vm.filter.supplierCodeDetailModel && vm.filter.supplierCodeDetailModel.length > 0) {
          vm.pagingInfo.supplierID = vm.filter.supplierCodeDetailModel.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.SupplierCode.isDeleted = false;
          vm.UMIDListAdvanceFilter.SupplierCode.tooltip = getFilterTooltip(vm.supplierCodeListToDisplay, vm.filter.supplierCodeDetailModel, 'id', 'mfgCodeName');
        } else {
          vm.pagingInfo.supplierID = null;
          vm.UMIDListAdvanceFilter.SupplierCode.isDeleted = true;
        }
        if (vm.filter.functionalType && vm.filter.functionalType.length > 0) {
          vm.pagingInfo.functionalType = vm.filter.functionalType.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.FunctionalType.isDeleted = false;
          vm.UMIDListAdvanceFilter.FunctionalType.tooltip = getFilterTooltip(vm.functionalTypeListToDisplay, vm.filter.functionalType, 'id', 'partTypeName');
        } else {
          vm.pagingInfo.functionalType = null;
          vm.UMIDListAdvanceFilter.FunctionalType.isDeleted = true;
        }

        if (vm.filter.mountingType && vm.filter.mountingType.length > 0) {
          vm.pagingInfo.mountingType = vm.filter.mountingType.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.MountingType.isDeleted = false;
          vm.UMIDListAdvanceFilter.MountingType.tooltip = getFilterTooltip(vm.mountingTypeListToDisplay, vm.filter.mountingType, 'id', 'name');
        } else {
          vm.pagingInfo.mountingType = null;
          vm.UMIDListAdvanceFilter.MountingType.isDeleted = true;
        }

        if ((vm.filter.allocatedKit && vm.filter.allocatedKit.length > 0) || (vm.refSalesOrderDetID)) {
          vm.pagingInfo.refSalesOrderDetID = _.map(vm.filter.allocatedKit, 'refSalesOrderDetID').join(',') || (vm.refSalesOrderDetID || '').toString();
          vm.pagingInfo.assyID = _.map(vm.filter.allocatedKit, 'assyID').join(',') || ($scope.assyIds || '').toString();
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.AllocatedKit.isDeleted = false;
          const selectedModelKit = _.map(vm.filter.allocatedKit, 'uniqKitID');
          vm.UMIDListAdvanceFilter.AllocatedKit.tooltip = getFilterTooltip(vm.allocatedKitListToDisplay, selectedModelKit, 'uniqKitID', 'kitName');
        } else {
          vm.pagingInfo.refSalesOrderDetID = null;
          vm.pagingInfo.assyID = null;
          vm.UMIDListAdvanceFilter.AllocatedKit.isDeleted = true;
        }

        if (vm.filter.employeeDetailModel && vm.filter.employeeDetailModel.length > 0) {
          vm.pagingInfo.employeeIds = vm.filter.employeeDetailModel.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.CreatedBy.isDeleted = false;
          vm.UMIDListAdvanceFilter.CreatedBy.tooltip = getFilterTooltip(vm.employeeListToDisplay, vm.filter.employeeDetailModel, 'userID', 'initialName');
        } else {
          vm.pagingInfo.employeeIds = null;
          vm.UMIDListAdvanceFilter.CreatedBy.isDeleted = true;
        }

        const warehouseTypeTooltip = [];
        if (vm.filter.warehouseType && vm.filter.warehouseType.length > 0) {
          vm.pagingInfo.warehouseType = vm.filter.warehouseType.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.WarehouseType.isDeleted = false;
          if (vm.filter.warehouseType.toString().contains(vm.warehouseType.SmartCart.key)) {
            warehouseTypeTooltip.push(vm.warehouseType.SmartCart.value);
          }
          if (vm.filter.warehouseType.toString().contains(vm.warehouseType.ShelvingCart.key)) {
            warehouseTypeTooltip.push(vm.warehouseType.ShelvingCart.value);
          }
          if (vm.filter.warehouseType.toString().contains(vm.warehouseType.Equipment.key)) {
            warehouseTypeTooltip.push(vm.warehouseType.Equipment.value);
          }
          vm.UMIDListAdvanceFilter.WarehouseType.tooltip = `${warehouseTypeTooltip.join('<br />')}`;
        } else {
          vm.pagingInfo.warehouseType = null;
          vm.UMIDListAdvanceFilter.WarehouseType.isDeleted = true;
        }
        const inventoryTypeTooltip = [];
        if (vm.filter.inventoryType && vm.filter.inventoryType.length > 0) {
          vm.pagingInfo.inventoryType = vm.filter.inventoryType.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.InventoryType.isDeleted = false;
          if (vm.filter.inventoryType.toString().contains(vm.InventoryType[0].value)) {
            inventoryTypeTooltip.push(vm.InventoryType[0].Name);
          }
          if (vm.filter.inventoryType.toString().contains(vm.InventoryType[1].value)) {
            inventoryTypeTooltip.push(vm.InventoryType[1].Name);
          }
          if (vm.filter.inventoryType.toString().contains(vm.InventoryType[2].value)) {
            inventoryTypeTooltip.push(vm.InventoryType[2].Name);
          }
          if (vm.filter.inventoryType.toString().contains(vm.InventoryType[3].value)) {
            inventoryTypeTooltip.push(vm.InventoryType[3].Name);
          }
          vm.UMIDListAdvanceFilter.InventoryType.tooltip = `${inventoryTypeTooltip.join('<br />')}`;
        } else {
          vm.pagingInfo.inventoryType = null;
          vm.UMIDListAdvanceFilter.InventoryType.isDeleted = true;
        }

        const miscTypeTooltip = [];
        const objRestrictPart = _.find(vm.filter.miscType, (data) => data === vm.miscFilter[0].Name);
        const objAvailableToSell = _.find(vm.filter.miscType, (data) => data === vm.miscFilter[1].Name);
        const objRestrictUMID = _.find(vm.filter.miscType, (data) => data === vm.miscFilter[2].Name);
        const objInternalStock = _.find(vm.filter.miscType, (data) => data === vm.miscFilter[3].Name);
        const objCustomerStock = _.find(vm.filter.miscType, (data) => data === vm.miscFilter[4].Name);

        if (objRestrictPart || objAvailableToSell || objRestrictUMID || objInternalStock || objCustomerStock) {
          vm.pagingInfo.restrictPart = objRestrictPart ? true : null;
          if (vm.pagingInfo.restrictPart) {
            miscTypeTooltip.push(vm.miscFilter[0].Name);
          }
          vm.pagingInfo.isAvailableToSell = objAvailableToSell ? true : null;
          if (vm.pagingInfo.isAvailableToSell) {
            miscTypeTooltip.push(vm.miscFilter[1].Name);
          }
          vm.pagingInfo.isRestrictedUMID = objRestrictUMID ? true : null;
          if (vm.pagingInfo.isRestrictedUMID) {
            miscTypeTooltip.push(vm.miscFilter[2].Name);
          }
          vm.pagingInfo.isInternalStock = objInternalStock ? true : null;
          if (vm.pagingInfo.isInternalStock) {
            miscTypeTooltip.push(vm.miscFilter[3].Name);
          }
          vm.pagingInfo.isCustomerStock = objCustomerStock ? true : null;
          if (vm.pagingInfo.isCustomerStock) {
            miscTypeTooltip.push(vm.miscFilter[4].Name);
          }
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.Misc.isDeleted = false;
          vm.UMIDListAdvanceFilter.Misc.tooltip = `${miscTypeTooltip.join('<br />')}`;
        } else {
          vm.pagingInfo.restrictPart = null;
          vm.pagingInfo.isAvailableToSell = null;
          vm.pagingInfo.isRestrictedUMID = null;
          vm.pagingInfo.isInternalStock = null;
          vm.pagingInfo.isCustomerStock = null;
          vm.UMIDListAdvanceFilter.Misc.isDeleted = true;
        }

        vm.pagingInfo.restrictPart = objRestrictPart ? true : null;
        vm.pagingInfo.isAvailableToSell = objAvailableToSell ? true : null;
        vm.pagingInfo.isRestrictedUMID = objRestrictUMID ? true : null;
        vm.pagingInfo.isInternalStock = objInternalStock ? true : null;
        vm.pagingInfo.isCustomerStock = objCustomerStock ? true : null;

        if (vm.filter.costCategory && vm.filter.costCategory.length > 0) {
          vm.pagingInfo.costCategory = vm.filter.costCategory.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.CostCategory.isDeleted = false;
          vm.UMIDListAdvanceFilter.CostCategory.tooltip = getFilterTooltip(vm.costCategoryListToDisplay, vm.filter.costCategory, 'id', 'displayName');
        } else {
          vm.pagingInfo.costCategory = null;
          vm.UMIDListAdvanceFilter.CostCategory.isDeleted = true;
        }

        if (vm.filter.standard && vm.filter.standard.length > 0) {
          const standards = [];
          const standardsClass = [];
          _.each(vm.filter.standard, (item) => {
            if (item.contains(':')) {
              standardsClass.push(item.split(':')[1]);
            }
            else {
              standards.push(item);
            }
          });
          vm.pagingInfo.standards = standards.join(',');
          vm.pagingInfo.standardsClass = standardsClass.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.Standard.isDeleted = false;
          vm.UMIDListAdvanceFilter.Standard.tooltip = getFilterTooltip(vm.standardsListToDisplay, vm.filter.standard, 'certificateStandardID', 'fullName');
        } else {
          vm.pagingInfo.standards = null;
          vm.pagingInfo.standardsClass = null;
          vm.UMIDListAdvanceFilter.Standard.isDeleted = true;
        }

        if (vm.filter.department && vm.filter.department.length > 0) {
          vm.pagingInfo.department = vm.filter.department.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.ParentWarehouse.isDeleted = false;
          vm.UMIDListAdvanceFilter.ParentWarehouse.tooltip = getFilterTooltip(vm.parentWarehouseListToDisplay, vm.filter.department, 'ID', 'Name');
        } else {
          vm.pagingInfo.department = null;
          vm.UMIDListAdvanceFilter.ParentWarehouse.isDeleted = true;
        }

        if (vm.filter.warehouse && vm.filter.warehouse.length > 0) {
          vm.pagingInfo.warehouse = vm.filter.warehouse.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.Warehouse.isDeleted = false;
          vm.UMIDListAdvanceFilter.Warehouse.tooltip = getFilterTooltip(vm.warehouseListToDisplay, vm.filter.warehouse, 'ID', 'Name');
        } else {
          vm.pagingInfo.warehouse = null;
          vm.UMIDListAdvanceFilter.Warehouse.isDeleted = true;
        }

        if (vm.filter.rohsStatus && vm.filter.rohsStatus.length > 0) {
          vm.pagingInfo.rohsStatus = vm.filter.rohsStatus.join(',');
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.Rohs.isDeleted = false;
          vm.UMIDListAdvanceFilter.Rohs.tooltip = getFilterTooltip(vm.rohsListToDisplay, vm.filter.rohsStatus, 'id', 'value');
        } else {
          vm.pagingInfo.rohsStatus = null;
          vm.UMIDListAdvanceFilter.Rohs.isDeleted = true;
        }

        if (vm.filter.searchPidUmidMfgPN) {
          let columnDataType = null;
          if (vm.filter.searchType === CORE.CustomSearchTypeForList.Exact) {
            columnDataType = 'StringEquals';
          }
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'uid', SearchString: vm.filter.searchPidUmidMfgPN, ColumnDataType: columnDataType, isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'parentUID', SearchString: vm.filter.searchPidUmidMfgPN, ColumnDataType: columnDataType, isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'fromUID', SearchString: vm.filter.searchPidUmidMfgPN, ColumnDataType: columnDataType, isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'PIDCode', SearchString: vm.filter.searchPidUmidMfgPN, ColumnDataType: columnDataType, isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'mfgPN', SearchString: vm.filter.searchPidUmidMfgPN, ColumnDataType: columnDataType, isExternalSearch: true });
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.SearchUmidPidMfrPn.isDeleted = false;
          vm.UMIDListAdvanceFilter.SearchUmidPidMfrPn.tooltip = vm.filter.searchPidUmidMfgPN;
        } else {
          vm.UMIDListAdvanceFilter.SearchUmidPidMfrPn.isDeleted = true;
        }

        if (vm.filter.dateCode) {
          vm.pagingInfo.dateCode = vm.filter.dateCode;
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.SearchInternalDateCode.isDeleted = false;
          vm.UMIDListAdvanceFilter.SearchInternalDateCode.tooltip = vm.filter.dateCode;
        } else {
          vm.pagingInfo.dateCode = null;
          vm.UMIDListAdvanceFilter.SearchInternalDateCode.isDeleted = true;
        }

        if (vm.filter.scanLabel) {
          vm.pagingInfo.scanLabel = vm.filter.scanLabel;
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.ScanLocationBINWarehouse.isDeleted = false;
          vm.UMIDListAdvanceFilter.ScanLocationBINWarehouse.tooltip = vm.filter.scanLabel;
        } else {
          vm.pagingInfo.scanLabel = null;
          vm.UMIDListAdvanceFilter.ScanLocationBINWarehouse.isDeleted = true;
        }

        const objSearchClm = { ColumnName: 'isTransit', SearchString: 'Yes', ColumnDataType: 'StringEquals', isExternalSearch: true };
        if (vm.filter.inTransist) {
          vm.pagingInfo.SearchColumns.push(objSearchClm);
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.InTransit.isDeleted = false;
          vm.UMIDListAdvanceFilter.InTransit.tooltip = vm.UMIDListAdvanceFilter.InTransit.value;
        } else {
          const objIndex = vm.pagingInfo.SearchColumns.indexOf(objSearchClm);
          if (objIndex !== -1) {
            vm.pagingInfo.SearchColumns.splice(objIndex, 1);
          }
          vm.UMIDListAdvanceFilter.InTransit.isDeleted = true;
        }

        if (vm.filter.expireMaterial) {
          vm.pagingInfo.expireMaterial = vm.filter.expireMaterial ? true : null;
          vm.pagingInfo.expiredDay = vm.filter.expiredDay;
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.ExpiredMaterial.isDeleted = false;
          vm.UMIDListAdvanceFilter.ExpiredMaterial.tooltip = vm.UMIDListAdvanceFilter.ExpiredMaterial.value;
        } else {
          vm.pagingInfo.expireMaterial = null;
          vm.pagingInfo.expiredDay = null;
          vm.UMIDListAdvanceFilter.ExpiredMaterial.isDeleted = true;
        }

        vm.pagingInfo.isInStock = vm.filter.isInStock;
        if (vm.filter.isInStock === 'All') {
          vm.pagingInfo.isInStock = null;
        }
        vm.generateFilterChip = true;
        vm.UMIDListAdvanceFilter.StockStatus.isDeleted = false;
        vm.UMIDListAdvanceFilter.StockStatus.tooltip = vm.filter.isInStock === true ? 'In-Stock UMID' : vm.filter.isInStock === false ? 'Empty UMID' : 'All';

        vm.pagingInfo.isNonCofc = vm.filter.isNonCofc;
        if (vm.filter.isNonCofc) {
          vm.UMIDListAdvanceFilter.NonCOFC.isDeleted = false;
          vm.UMIDListAdvanceFilter.NonCOFC.tooltip = vm.UMIDListAdvanceFilter.NonCOFC.value;
        } else {
          vm.UMIDListAdvanceFilter.NonCOFC.isDeleted = true;
        }

        if (vm.filter.fromDate || vm.filter.toDate) {
          vm.pagingInfo.fromDate = vm.filter.fromDate ? $filter('date')(vm.filter.fromDate, CORE.DateFormatArray[11].format) : null;
          vm.pagingInfo.toDate = vm.filter.toDate ? $filter('date')(vm.filter.toDate, CORE.DateFormatArray[11].format) : null;
          vm.generateFilterChip = true;
          vm.UMIDListAdvanceFilter.CreatedOn.isDeleted = false;
          if (vm.filter.fromDate && vm.filter.toDate) {
            vm.UMIDListAdvanceFilter.CreatedOn.tooltip = 'From:' + $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat);
          } else {
            if (vm.pagingInfo.fromDate) {
              vm.UMIDListAdvanceFilter.CreatedOn.tooltip = 'From: ' + $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat);
            }
            if (vm.pagingInfo.toDate) {
              vm.UMIDListAdvanceFilter.CreatedOn.tooltip = 'To: ' + $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat);
            }
          }
        } else {
          vm.pagingInfo.fromDate = null;
          vm.pagingInfo.toDate = null;
          vm.UMIDListAdvanceFilter.CreatedOn.isDeleted = true;
        }

        if (SearchColumnsDynamicColumn && SearchColumnsDynamicColumn.length > 0) {
          vm.pagingInfo.searchTextAttribute = SearchColumnsDynamicColumn.join(_groupConcatSeparatorValue);
        } else {
          vm.pagingInfo.searchTextAttribute = null;
        }

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }

        vm.UMIDListAdvanceFilter.ClearAll.isDeleted = !vm.generateFilterChip;
      }

      /* retrieve Receiving Material list*/
      vm.loadData = () => {
        if (vm.callLoadData === false) {
          vm.callLoadData = true;
          return;
        }
        if (vm.transactionID && vm.gridOptions && vm.gridOptions.data) {
          cancelRequest();
        }
        if (vm.currentState === TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE && vm.pagingInfo && !vm.pagingInfo.refSalesOrderDetID) {
          vm.pagingInfo.refSalesOrderDetID = vm.refSalesOrderDetID.toString();
          vm.pagingInfo.assyID = $scope.assyIds;
        }
        generateSearchCriteria();
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
        const iswh = _.find(vm.filter.warehouseType, (wh) => wh === vm.warehouseType.SmartCart.key);
        if (iswh) {
          vm.gridOptions.enableFiltering = false;
          vm.gridOptions.enableSorting = false;
          vm.pagingInfo.Page = 0;
          vm.pagingInfo.pageSize = 0;
        } else {
          vm.gridOptions.enableFiltering = true;
          vm.gridOptions.enableSorting = true;
          // added by - Kinjal
          BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        }
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDList().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
          vm.sourceData = [];
          if (receivingmaterial.data) {
            vm.sourceData = receivingmaterial.data.component;
            if (vm.searchflag) {
              vm.WarehouseList = vm.warehouseListToDisplay = receivingmaterial.data.warehouse;
              vm.mfgCodeDetail = vm.mfgCodeListToDisplay = receivingmaterial.data.manufacturer;
              vm.supplierCodeDetail = vm.supplierCodeListToDisplay = receivingmaterial.data.supplier;
            } else {
              vm.WarehouseList = vm.warehouseListToDisplay = vm.tempStoreWH;
              vm.mfgCodeDetail = vm.mfgCodeListToDisplay = vm.tempStoreManufacturer;
              vm.supplierCodeDetail = vm.supplierCodeListToDisplay = vm.tempStoreSupplier;
            }

            vm.totalSourceDataCount = receivingmaterial.data.Count;
          }


          _.map(vm.sourceData, (data) => {
            data.rohsIcon = stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, data.rohsIcon);
            data.isSplitUID = true;
            data.isIdenticalUID = data.fromUIDId ? false : true;
            if (data.isUMIDRestrict) {
              data.isShowUnrestrictUMID = true;
            } else {
              data.isShowRestrictUMID = true;
            }
          });
          $scope.$emit('UMIDCount', vm.totalSourceDataCount);
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            $timeout(() => {
              celledit();
            }, true);
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDList().query(vm.pagingInfo).$promise.then((receivingmaterial) => {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(receivingmaterial.data.component);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();

          _.map(receivingmaterial.data.component, (data) => {
            data.rohsIcon = stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, data.rohsIcon);
            if (data.isUMIDRestrict) {
              data.isShowUnrestrictUMID = true;
            } else {
              data.isShowRestrictUMID = true;
            }
          });

          $timeout(() => vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false));
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.updateRecord = (row) => {
        $scope.$emit('changeTab');
        $state.go(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: row.entity.id });
      };

      vm.deleteRecord = (componentstock) => {
        let selectedIDs = [];
        let selectedObject = [];
        let selectedUIDs = [];
        if (componentstock) {
          selectedIDs.push(componentstock.id);
          selectedUIDs.push(componentstock.id);
          selectedObject.push({ id: componentstock.id, pkgQty: componentstock.pkgQty });
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
            selectedUIDs = vm.selectedRows.map((item) => item.uid);
            selectedObject = _.map(vm.selectedRows, (data) => ({
              id: data.id,
              pkgQty: data.pkgQty
            }));
          }
        }
        if (selectedIDs) {
          vm.cgBusyLoading = ReceivingMaterialFactory.checkDeleteUIDValidation().query({ objIDs: selectedIDs }).$promise.then((res) => {
            if (res && res.data && res.data.ErrorCode !== 0) {
              const objData = {
                UIDList: res.data.UIDList,
                errorCode: res.data.ErrorCode,
                selectedUIDs: selectedUIDs.join(',')
              };
              DialogFactory.dialogService(
                TRANSACTION.REMOVE_UID_VALIDATION_POPUP_CONTROLLER,
                TRANSACTION.REMOVE_UID_VALIDATION_POPUP_VIEW,
                null,
                objData).then(() => {
                }, () => {
                  vm.gridOptions.clearSelectedRows();
                }, (err) => BaseService.getErrorLog(err));
            } else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, vm.CORE.LabelConstant.TransferStock.UMID, selectedIDs.length);
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
                  vm.cgBusyLoading = ReceivingMaterialFactory.deleteComponentSidStock().query({ objIDs: objIDs, selectedObject: selectedObject }).$promise.then((res) => {
                    if (res && res.data) {
                      if (res.data.length > 0 || res.data.transactionDetails) {
                        const data = {
                          TotalCount: res.data.transactionDetails[0].TotalCount,
                          pageName: CORE.PageName.UMIDManagement
                        };
                        BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                          const IDs = {
                            id: selectedIDs,
                            CountList: true
                          };
                          return ReceivingMaterialFactory.deleteComponentSidStock().query({
                            objIDs: IDs
                          }).$promise.then((res) => {
                            let data = {};
                            data = res.data;
                            data.pageTitle = componentstock ? componentstock.uid : null;
                            data.PageName = CORE.PageName.component_sid_stock;
                            data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                            if (res.data) {
                              DialogFactory.dialogService(
                                USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                                USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                                ev,
                                data).then(() => {
                                }, () => {
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
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          const alertModel = {
            title: USER.USER_ERROR_LABEL,
            textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Receiving Material')
          };
          DialogFactory.alertDialog(alertModel);
        }
      };

      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      $scope.$on('PrintDocument', (name, data) => {
        if (data && data.length === 1) {
          $scope.PrintDocument(data[0], false);
        } else {
          $scope.PrintDocument(data, true);
        }
      });

      vm.printLabelRecord = (row, ev) => $scope.PrintDocument(row.entity, false, ev);

      $scope.PrintDocument = (data, isRenderList) => {
        const renderUMIDList = [];
        let rowData = {};
        if (isRenderList) {
          _.map(data, (umidDetail) => {
            renderUMIDList.push({
              id: umidDetail.id,
              uid: umidDetail.uid,
              PIDCode: umidDetail.PIDCode,
              mfgCodeName: umidDetail.mfg,
              refcompid: umidDetail.refcompid,
              mfgPN: umidDetail.mfgPN,
              rohsIcon: umidDetail.rohsIcon,
              partRohsName: umidDetail.rohsName,
              isCustom: umidDetail.isCustom,
              binName: umidDetail.location,
              warehouseName: umidDetail.warehouse,
              parentWHName: umidDetail.department,
              packagingName: umidDetail.packagingName,
              unitName: umidDetail.uomName,
              uomClassID: umidDetail.uomClassID,
              pkgQty: umidDetail.orgQty,
              pkgUnit: umidDetail.orgPkgUnit,
              mfgPNDescription: umidDetail.mfgPNDescription,
              custAssyPN: umidDetail.custAssyPN
            });
          });
          rowData = {
            selectedRecord: data,
            pageName: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL,
            printSingleRecord: !isRenderList,
            renderUMIDList: renderUMIDList
          };
        } else {
          rowData = data;
          rowData.pageName = TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL;
        }
        DialogFactory.dialogService(
          CORE.PRINT_BARCODE_LABEL_MODAL_CONTROLLER,
          CORE.PRINT_BARCODE_LABEL_MODAL_VIEW,
          null,
          rowData).then(() => {
          }, (printerDetailList) => {
            if (printerDetailList) {
              const printList = [];
              let printObj;

              _.each(printerDetailList, (data) => {
                printObj = {
                  'uid': data.UID,
                  'id': data.id,
                  'numberOfPrint': data.noPrint,
                  'reqName': 'Print',
                  'PrinterName': data.PrinterName,
                  'ServiceName': data.ServiceName,
                  'printType': data.printType,
                  'pageName': TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LABEL
                };
                printList.push(printObj);
              });

              vm.cgBusyLoading = ReceivingMaterialFactory.getDataForPrintLabelTemplate().query({ printList: printList }).$promise.then(() => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      //get price category from api call
      vm.getPriceCategory = (row) => {
        const material = {
          mfgPN: row.mfgPN,
          qty: row.pkgQty,
          id: row.id
        };
        ReceivingMaterialFactory.getPriceCategory().query({ objMaterial: material }).$promise.then((res) => {
          if (res && res.status === TRANSACTION.SHIPPING.FAILED) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVAID_CATEGORY);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        }).catch((err) => BaseService.getErrorLog(err));
      };

      //open popup to set image and zoomin/zoomout
      vm.zoomInOutImage = (event, data) => {
        DialogFactory.dialogService(
          CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
          CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
          event,
          data).then((res) => {
            if (res) {
              checkBarcodeLabelPicture();
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      //check barcode images for continous
      const checkBarcodeLabelPicture = () => {
        const obj = {
          title: TRANSACTION.BARCODE_PICTURE_CONTINUE,
          textContent: '',
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            vm.takePicture(vm.event);
          }
        }, () => {
          $mdDialog.hide(false, {
            closeAll: true
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //search part from digikey
      vm.searchToDigikey = (part) => {
        BaseService.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + part);
      };

      //open pop-up to transfer bin of UMID
      vm.transferStock = (row) => {
        var data = {
          uid: row.uid,
          updateStock: false,
          transactionID: vm.transactionID
        };
        vm.transferOpen = true;
        DialogFactory.dialogService(
          TRANSACTION.UID_TRANSFER_CONTROLLER,
          TRANSACTION.UID_TRANSFER_VIEW,
          event,
          data).then((res) => {
            if (res && !vm.showStatus) {
              vm.transferOpen = false;
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (transfer) => {
            vm.transferOpen = false;
            if (transfer && !vm.showStatus) { BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData); }
          }, (err) => BaseService.getErrorLog(err));
      };

      //open pop-up to transfer bin of UMID and change count
      vm.countMaterial = (row) => {
        var data = {
          uid: row.uid,
          updateStock: true
        };
        DialogFactory.dialogService(
          TRANSACTION.UID_TRANSFER_CONTROLLER,
          TRANSACTION.UID_TRANSFER_VIEW,
          event,
          data).then((res) => {
            if (res && !vm.transactionID) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (transfer) => {
            if (transfer && !vm.transactionID) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      //verify uid and scan label
      vm.verifyBarcodeLabel = (event, rowEntity) => {
        const data = { Title: 'Label Verification', UMID: rowEntity.uid, ID: rowEntity.id, PageType: TRANSACTION.VerifyPictureType.TakePicture, isViewOnly: true };
        DialogFactory.dialogService(
          CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
          CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
          event,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      const celledit = () => {
        vm.gridOptions.gridApi.selection.on.rowSelectionChanged($scope, callbackFunction);
        vm.gridOptions.gridApi.selection.on.rowSelectionChangedBatch($scope, callbackFunction);
      };

      const callbackFunction = () => {
        const selectedRows = vm.gridOptions.gridApi.selection.getSelectedRows();
        $scope.$emit('selectReceivingRow', selectedRows);
      };

      vm.transferLabel = (row) => {
        DialogFactory.dialogService(
          CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
          CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
          event,
          { Title: 'Transfer Label', PageType: TRANSACTION.VerifyPictureType.TransferLabel, ID: row.id, UMID: row.uid, receiveMaterialType: row.receiveMaterialType }).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      $scope.$on('CallRemoveFromReserve', (event, data) => {
        if (data) {
          const checkWithoutReserve = _.some(data, (item) => item.isReservedStock === 0);
          if (checkWithoutReserve) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WITHOUT_RESERVE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
            },
              () => {
              }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNRESERVE_CONFIMATION);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                unReserveStock(data);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      });

      const unReserveStock = (data) => {
        const ReceivingMaterial = {};
        ReceivingMaterial.selectedRow = data;
        vm.cgBusyLoading = ReceivingMaterialFactory.RemoveFromReserveStock().query(ReceivingMaterial).$promise.then((res) => {
          if (res) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      $scope.$on('CallAddInReserve', (event, data) => {
        if (data) {
          const checkReserve = _.some(data, (item) => item.isReservedStock || item.customerConsign === 'Yes');
          if (checkReserve) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.WITH_RESERVE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then(() => {
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            DialogFactory.dialogService(
              TRANSACTION.ADD_RESERVE_STOCK_MODAL_CONTROLLER,
              TRANSACTION.ADD_RESERVE_STOCK_MODAL_VIEW,
              event,
              data).then(() => {
              }, () => {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }, (err) => BaseService.getErrorLog(err));
          }
        }
      });

      vm.allocatedKit = (rowData) => {
        const data = rowData;
        data.refUMIDId = data.id;
        DialogFactory.dialogService(
          TRANSACTION.ALLOCATED_KIT_CONTROLLER,
          TRANSACTION.ALLOCATED_KIT_VIEW,
          event,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.addRecord = () => {
        $scope.$emit('changeTab');
        $state.go(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { type: CORE.ReceivingMatirialTab.PartToStock.Name, id: null });
      };

      $scope.$on('RefreshUMIDGrid', (event, data) => {
        if (!data) {
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }
      });

      vm.showDescription = (object, ev, callFrom) => {
        let data = {};
        if (callFrom === 'Description') {
          data = {
            title: 'Description',
            description: object.mfgPNDescription,
            name: object.uid
          };
        } else if (callFrom === 'DetailDescription') {
          data = {
            title: 'Detail Description',
            description: object.detailDescription,
            name: object.uid
          };
        } else if (callFrom === 'SpecialNote') {
          data = {
            title: 'UMID Management',
            description: object.specialNote,
            name: object.uid
          };
        }

        data.label = 'UMID';
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.showReasonUMIDRestricted = (object, ev) => {
        const obj = {
          title: 'Reason For Restricted UMID',
          description: object.reasonUMIDRestricted,
          name: object.uid
        };
        const data = obj;
        data.label = 'UMID';
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => {

          }, (err) => BaseService.getErrorLog(err));
      };

      vm.UMIDHistory = (row) => {
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_CONTROLLER,
          TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_VIEW,
          event,
          row).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // create uid with identical details popup
      vm.CreateIdenticalDetailUID = (row) => {
        const uidData = {
          uid: row.uid,
          uidId: row.id
        };
        DialogFactory.dialogService(
          TRANSACTION.IDENTICAL_UMID_POPUP_CONTROLLER,
          TRANSACTION.IDENTICAL_UMID_POPUP_VIEW,
          null,
          uidData).then((umidDetail) => {
            if (umidDetail) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }, (umidDetail) => {
            if (umidDetail) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      // Split UMID popup
      vm.SplitUID = (row) => {
        const data = {
          id: row.id,
          uid: row.uid,
          mfgPN: row.mfgPN,
          mfgPNId: row.refcompid,
          mfg: row.mfg,
          mfgCodeId: row.mfgcodeID,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsName
        };
        DialogFactory.dialogService(
          TRANSACTION.SPLIT_UID_POPUP_CONTROLLER,
          TRANSACTION.SPLIT_UID_POPUP_VIEW,
          null,
          data).then((umidDetail) => {
            BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: umidDetail ? umidDetail.id : null });
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.advanceFilterSearch = () => {
        vm.searchflag = true;
        vm.callLoadData = true;
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
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

      vm.resetPidUmidMfgPN = () => {
        stateParamsDet = {
          whId: 0,
          binId: 0,
          refSalesOrderDetID: 0,
          assyID: 0
        };

        vm.pagingInfo.whId = stateParamsDet.whId;
        vm.pagingInfo.binId = stateParamsDet.binId;

        vm.filter.searchPidUmidMfgPN = null;
        vm.filter.searchType = CORE.CustomSearchTypeForList.Contains;
        vm.filter.isInStock = true;
        vm.filter.scanLabel = null;
        vm.filter.restrictPart = null;
        vm.filter.expireMaterial = null;
        vm.filter.mfgCodeDetailModel = [];
        vm.filter.supplierCodeDetailModel = [];
        vm.filter.functionalType = [];
        vm.filter.mountingType = [];
        vm.filter.allocatedKit = [];
        vm.filter.standard = [];
        vm.filter.miscType = [];
        vm.filter.costCategory = [];
        vm.filter.department = [];
        vm.filter.warehouseType = [];
        vm.filter.inventoryType = [];
        vm.filter.warehouse = [];
        vm.resetDateFilter();
        vm.filter.expiredDay = 0;
        vm.filter.rohsStatus = [];
        vm.filter.isNonCofc = false;
        vm.searchflag = false;
        vm.filter.isAvailableToSell = false;
        vm.filter.isRestrictedUMID = false;
        vm.filter.inTransist = false;
        vm.filter.expireMaterial = false;
        vm.filter.expiredDay = null;
        vm.filter.dateCode = null;
        vm.clearMfrSearchText();
        vm.clearsupplierSearchText();
        vm.clearFunctionalTypeSearchText();
        vm.clearMountingTypeSearchText();
        vm.clearAllocatedKitSearchText();
        vm.clearCostCategorySearchText();
        vm.clearStandardsSearchText();
        vm.clearParentWarehouseSearchText();
        vm.clearWarehouseSearchText();
        vm.clearRohsSearchText();
        vm.clearMISCFilter();
        vm.employeeSearchText = undefined;
        vm.clearEmployeeSearchText();
        vm.filter.employeeDetailModel = [];
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.generateFilterChip = false;
        vm.attributesSearch = null;
        vm.umidTextAdvanceFilterType = vm.UMIDTextAdvanceFilterTypeDropDown[0].id;
        SearchColumnsDynamicColumn = [];
        vm.UMIDListAdvanceFilter = angular.copy(TRANSACTION.UMIDListAdvancedFilters);
        vm.UMIDListTextFilter = {};
        vm.filtersInfo.textSearch.$setValidity('duplicate', true);
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              col.filters[0].term = undefined;
            }
          });
        }
        vm.loadData();
      };

      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.UMIDListAdvanceFilter.MfgCode.value:
              vm.clearManufacturerFilter();
              break;
            case vm.UMIDListAdvanceFilter.FunctionalType.value:
              vm.clearFunctionalTypeFilter();
              break;
            case vm.UMIDListAdvanceFilter.SupplierCode.value:
              vm.clearSupplierFilter();
              break;
            case vm.UMIDListAdvanceFilter.MountingType.value:
              vm.clearMountingTypeFilter();
              break;
            case vm.UMIDListAdvanceFilter.AllocatedKit.value:
              vm.clearKitFilter();
              break;
            case vm.UMIDListAdvanceFilter.WarehouseType.value:
              vm.clearWarehouseFilter();
              break;
            case vm.UMIDListAdvanceFilter.InventoryType.value:
              vm.clearInventoryTypeFilter();
              break;
            case vm.UMIDListAdvanceFilter.Misc.value:
              vm.clearMISCFilter();
              break;
            case vm.UMIDListAdvanceFilter.CostCategory.value:
              vm.clearCostCategoryFilter();
              break;
            case vm.UMIDListAdvanceFilter.Standard.value:
              vm.clearStandardFilter();
              break;
            case vm.UMIDListAdvanceFilter.ParentWarehouse.value:
              vm.clearDepartmentFilter();
              break;
            case vm.UMIDListAdvanceFilter.Warehouse.value:
              vm.clearWarehouseListFilter();
              break;
            case vm.UMIDListAdvanceFilter.Rohs.value:
              vm.clearRohsFilter();
              break;
            case vm.UMIDListAdvanceFilter.SearchUmidPidMfrPn.value:
              vm.filter.searchType = vm.CustomSearchTypeForList.Contains;
              vm.filter.searchPidUmidMfgPN = null;
              break;
            case vm.UMIDListAdvanceFilter.SearchInternalDateCode.value:
              vm.filter.dateCode = null;
              break;
            case vm.UMIDListAdvanceFilter.ScanLocationBINWarehouse.value:
              vm.filter.scanLabel = null;
              break;
            case vm.UMIDListAdvanceFilter.InTransit.value:
              vm.filter.inTransist = false;
              break;
            case vm.UMIDListAdvanceFilter.ExpiredMaterial.value:
              vm.filter.expireMaterial = false;
              vm.filter.expiredDay = 0;
              break;
            case vm.UMIDListAdvanceFilter.NonCOFC.value:
              vm.filter.isNonCofc = false;
              break;
            case vm.UMIDListAdvanceFilter.CreatedOn.value:
              vm.filter.fromDate = vm.filter.toDate = null;
              vm.resetDateFilter();
              break;
            case vm.UMIDListAdvanceFilter.CreatedBy.value:
              vm.clearEmployeeFilter();
              break;
            default:
              SearchColumnsDynamicColumn = _.reject(SearchColumnsDynamicColumn, (data) => data === item.value);
              vm.UMIDListTextFilter = _.reject(vm.UMIDListTextFilter, (data) => data.value === item.value);
              vm.UMIDListTextFilter = vm.UMIDListTextFilter.length === 0 ? {} : vm.UMIDListTextFilter;
              break;
          }
          vm.loadData();
        }
      };

      vm.changeStockStatus = () => {
        vm.loadData();
      };

      vm.removeDateCode = () => {
        vm.filter.dateCode = null;
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };

      vm.removeScanLabel = () => {
        vm.filter.scanLabel = null;
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };

      vm.removePidUmidMfgPN = () => {
        vm.filter.searchPidUmidMfgPN = null;
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };

      //Clear selected master filters from boxes
      vm.clearSelection = () => {
        vm.clearManufacturerFilter();
        vm.clearSupplierFilter();
        vm.clearKitFilter();
        vm.clearWarehouseFilter();
        vm.clearInventoryTypeFilter();
        vm.clearMISCFilter();
        vm.clearFunctionalTypeFilter();
        vm.clearMountingTypeFilter();
        vm.clearCostCategoryFilter();
        vm.clearStandardFilter();
        vm.clearDepartmentFilter();
        vm.clearWarehouseListFilter();
        vm.clearRohsFilter();
        vm.clearMfrSearchText();
        vm.clearsupplierSearchText();
        vm.clearAllocatedKitSearchText();
        vm.clearFunctionalTypeSearchText();
        vm.clearMountingTypeSearchText();
        vm.clearCostCategorySearchText();
        vm.clearStandardsSearchText();
        vm.clearParentWarehouseSearchText();
        vm.clearWarehouseSearchText();
        vm.clearRohsSearchText();
        vm.filter.searchType = vm.CustomSearchTypeForList.Contains;
        vm.filter.searchPidUmidMfgPN = null;
        vm.filter.dateCode = null;
        vm.filter.scanLabel = null;
        vm.attributesSearch = null;
        vm.filter.inTransist = false;
        vm.filter.expireMaterial = false;
        vm.filter.expiredDay = 0;
        vm.filter.isNonCofc = false;
        vm.filter.fromDate = vm.filter.toDate = null;
        vm.resetDateFilter();
        vm.clearEmployeeFilter();
        vm.umidTextAdvanceFilterType = vm.UMIDTextAdvanceFilterTypeDropDown[0].id;
        SearchColumnsDynamicColumn = [];
        vm.UMIDListTextFilter = {};
        initPageInfo();
        vm.loadData();
      };

      //vm.isClearSelectionDisabled = () => (!vm.draft && !vm.publish && !vm.posoNumber && !vm.pending && !vm.completed && !vm.canceled && !vm.planned && !vm.unPlanned && !vm.partiallyPlanned &&
      //  !vm.kitReturnNA && !vm.KitReturnReady && !vm.kitReturnNot && !vm.kitReturnPartially && !vm.kitReturnFully && !vm.kitReturnedWithShortage &&
      //  !vm.kitReadyRelease && !vm.kitNotRelease && !vm.kitPartialRelease && !vm.kitFullyRelease && !vm.isRushJob && !vm.fromDate && !vm.toDate
      //  && !(vm.partIds && vm.partIds.length > 0) && !(vm.woIds && vm.woIds.length > 0) && !vm.CustomerSearchText && !(vm.customer && vm.customer.length)
      //);

      /* manufacturer/supplier drop-down fill up */
      vm.getMfgSearch = (isMfgSearch) => {
        if (isMfgSearch) {
          vm.mfrSearchText = undefined;
        } else {
          vm.supplierSearchText = undefined;
        }
        const searchObj = {
          mfgType: isMfgSearch ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
          isCodeFirst: true
        };

        return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          if (isMfgSearch) {
            vm.mfgCodeListToDisplay = vm.searchflag ? angular.copy(vm.mfgCodeDetail) : mfgcodes.data;
            if (!vm.searchflag) {
              vm.tempStoreManufacturer = vm.mfgCodeDetail = vm.mfgCodeListToDisplay = mfgcodes.data;
            }
          } else {
            vm.supplierCodeListToDisplay = vm.searchflag ? angular.copy(vm.supplierCodeDetail) : mfgcodes.data;
            if (!vm.searchflag) {
              vm.tempStoreSupplier = vm.supplierCodeDetail = vm.supplierCodeListToDisplay = mfgcodes.data;
            }
          }
          return $q.resolve(vm.mfgCodeListToDisplay);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* get customer for auto-complete values */
      const getCustomerSearch = (searchObj) => MasterFactory.getCustomerList().query(searchObj).$promise.then((customers) => {
        if (customers.data) {
          return customers.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      /* mountingType drop-down fill up */
      vm.getMountingTypeList = () => {
        vm.mountingTypeSearchText = undefined;
        return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
          vm.mountingTypeList = vm.mountingTypeListToDisplay = res.data;
          return $q.resolve(vm.mountingTypeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Functional Type drop-down fill up */
      vm.getFunctionalType = () => {
        vm.functionalTypeSearchText = undefined;
        return ComponentFactory.getPartTypeList().query().$promise.then((res) => {
          vm.functionalTypeList = vm.functionalTypeListToDisplay = res.data;
          return $q.resolve(vm.functionalTypeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Allocated Kit drop-down fill up */
      vm.getAllocatedKitList = () => {
        vm.allocatedKitSearchText = undefined;
        return KitAllocationFactory.getAllocatedKitList().query().$promise.then((res) => {
          vm.allocatedKitList = res.data;
          _.map(vm.allocatedKitList, (data, index) => {
            let kitName = stringFormat('{0}, {1}, {2}, {3}', data.parenetPIDCode, data.poNumber, data.salesOrderNumber, data.qty);
            if (data.assyLevel > 0) {
              kitName = stringFormat('{0} [Sub: {1}]', kitName, data.PIDCode);
            }
            data.kitName = kitName;
            data.uniqKitID = data.uniqKitID ? data.uniqKitID : ((index + 1) * -1).toString();
          });
          vm.allocatedKitListToDisplay = vm.allocatedKitList;
          if (vm.currentState === TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
            vm.filter.allocatedKit = vm.allocatedKitList = vm.allocatedKitListToDisplay = _.filter(vm.allocatedKitList, (data) => data.refSalesOrderDetID === vm.refSalesOrderDetID);
          } else {
            vm.filter.allocatedKit = _.filter(vm.allocatedKitList, { refSalesOrderDetID: stateParamsDet.refSalesOrderDetID, assyID: stateParamsDet.assyID });
          }
          if (vm.currentState === USER.ADMIN_MANAGECUSTOMER_INVENTORY_STATE) {
            vm.allocatedKitList = vm.allocatedKitListToDisplay = _.filter(vm.allocatedKitList, (data) => data.customerID === $stateParams.cid);
          }
          return $q.resolve(vm.allocatedKitList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Standard Type drop-down fill up */
      vm.getStandard = () => {
        vm.standardsSearchText = undefined;
        return CertificateStandardFactory.getCertificateStandardRole().query().$promise.then((response) => {
          if (response && response.data) {
            vm.standardsList = [];
            vm.standardClass = [];
            _.each(response.data, (item) => {
              if (item.isActive) {
                const certificateStandards = {
                  certificateStandardID: item.certificateStandardID,
                  fullName: item.fullName,
                  displayOrder: item.displayOrder
                };
                vm.standardsList.push(certificateStandards);
                if (item.CertificateStandard_Class.length > 0) {
                  _.each(item.CertificateStandard_Class, (standardClass) => {
                    if (item.isActive) {
                      vm.standardClass.push(standardClass);
                      const standardsClass = {
                        certificateStandardID: stringFormat('{0}:{1}', item.certificateStandardID, standardClass.classID),
                        fullName: stringFormat('{0} {1}', item.fullName, standardClass.className),
                        displayOrder: item.displayOrder
                      };
                      vm.standardsList.push(standardsClass);
                    }
                  });
                }
              }
            });
            vm.standardsListToDisplay = angular.copy(vm.standardsList);
            if (vm.standardsList.length > 0) {
              vm.standardsList = _.sortBy(vm.standardsList, ['displayOrder', 'fullName']);
            }
            if (vm.standardClass.length > 0) {
              vm.standardClass = _.sortBy(vm.standardClass, ['className']);
            }
          }
          return $q.resolve(vm.standardsList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Cost Category drop-down fill up */
      vm.getCostCategoryFromUMID = () => {
        vm.costCategorySearchText = undefined;
        return ReceivingMaterialFactory.getCostCategoryFromUMID().query({ id: 0 }).$promise.then((response) => {
          if (response && response.data) {
            vm.costCategoryList = vm.costCategoryListToDisplay = response.data;
            _.map(vm.costCategoryList, (data) => {
              data.displayName = stringFormat('{0} ({1} - {2})', data.categoryName, data.from, data.to);
            });
          }
          return $q.resolve(vm.costCategoryList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get warehouse department list
      vm.getKitDepartment = (isDepartment) => BinFactory.getAllWarehouse({ isDepartment: isDepartment }).query().$promise.then((whlist) => {
        if (whlist && whlist.data) {
          if (isDepartment) {
            vm.parentWarehouseSearchText = undefined;
            vm.WarehouseDepartmentList = vm.parentWarehouseListToDisplay = whlist.data;
          } else {
            vm.warehouseSearchText = undefined;
            vm.warehouseListToDisplay = vm.searchflag ? angular.copy(vm.WarehouseList) : whlist.data;
            if (!vm.searchflag) {
              vm.tempStoreWH = vm.warehouseListToDisplay = vm.WarehouseList = whlist.data;
            }
          }
        }
        return $q.resolve(whlist.data);
      }).catch((error) => BaseService.getErrorLog(error));

      vm.getRoHSList = () => {
        vm.rohsSearchText = undefined;
        vm.rohsList = [];
        return MasterFactory.getRohsList().query().$promise.then((res) => {
          if (res && res.data) {
            _.each(res.data, (item) => {
              const obj = {
                id: item.id,
                value: item.name
              };
              vm.rohsList.push(obj);
            });
            vm.rohsListToDisplay = angular.copy(vm.rohsList);
          }
          return $q.resolve(vm.rohsList);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.clearManufacturerFilter = () => {
        vm.filter.mfgCodeDetailModel = [];
        if (vm.pagingInfo.mfgcodeID) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearSupplierFilter = () => {
        vm.filter.supplierCodeDetailModel = [];
        if (vm.pagingInfo.supplierID) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearMountingTypeFilter = () => {
        vm.filter.mountingType = [];
        if (vm.pagingInfo.mountingType) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearFunctionalTypeFilter = () => {
        vm.filter.functionalType = [];
        if (vm.pagingInfo.functionalType) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearKitFilter = () => {
        vm.filter.allocatedKit = [];
        if (vm.pagingInfo.refSalesOrderDetID || vm.pagingInfo.assyID) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearStandardFilter = () => {
        vm.filter.standard = [];
        if (vm.pagingInfo.standards || vm.pagingInfo.standardsClass) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearCostCategoryFilter = () => {
        vm.filter.costCategory = [];
        if (vm.pagingInfo.costCategory) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearDateCodeFilter = () => {
        vm.filter.dateCode = [];
        if (vm.pagingInfo.dateCode) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearDepartmentFilter = () => {
        vm.filter.department = [];
        if (vm.pagingInfo.department) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearWarehouseListFilter = () => {
        vm.filter.warehouse = [];
        if (vm.pagingInfo.warehouse) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearWarehouseFilter = () => {
        vm.filter.warehouseType = [];
        if (vm.pagingInfo.warehouseType) {
          vm.advanceFilterSearch();
        }
      };
      vm.clearInventoryTypeFilter = () => {
        vm.filter.inventoryType = [];
        if (vm.pagingInfo.inventoryType) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearRohsFilter = () => {
        vm.filter.rohsStatus = [];
        if (vm.pagingInfo.rohsStatus) {
          vm.advanceFilterSearch();
        }
      };

      vm.clearMISCFilter = () => {
        if (vm.autoCompletecustomer) {
          $scope.$broadcast(vm.autoCompletecustomer.inputName, null);
        }
        vm.isCustomerStockNotSelected = false;
        vm.filter.miscType = [];
        if (vm.pagingInfo.restrictPart || vm.pagingInfo.isAvailableToSell || vm.pagingInfo.isRestrictedUMID) {
          vm.advanceFilterSearch();
        }
      };

      const initAutoComplete = () => {
        vm.autoCompletecustomer = {
          columnName: 'mfgCodeName',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: 'Search Customer',
          placeholderName: 'Search Customer',
          isAddnew: false,
          isRequired: false,
          onSelectCallbackFn: (item) => {
            if (item && item.id) {
              vm.pagingInfo.customerId = item.id;
            } else {
              vm.pagingInfo.customerId = null;
            }
          },
          onSearchFn: function (query) {
            const searchObj = {
              searchQuery: query,
              type: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompletecustomer.inputName,
              isCustomer: true
            };
            return getCustomerSearch(searchObj);
          }
        };
      };

      vm.scanSearchKey = ($event) => {
        vm.searchflag = true;
        $timeout(() => {
          if ($event.keyCode === 13) {
            vm.advanceFilterSearch();
          }
        });
      };

      vm.goToCofC = (row) => {
        BaseService.goToCofC(row.id);
      };

      vm.setCustomerStock = () => {
        vm.isCustomerStockNotSelected = _.sumBy(vm.filter.miscType, (item) => item === vm.miscFilter[4].Name);
        if (!vm.isCustomerStockNotSelected && vm.autoCompletecustomer) {
          vm.autoCompletecustomer.searchText = null;
          vm.pagingInfo.customerId = null;
        }
      };

      vm.restrictUMID = (row, event) => {
        DialogFactory.dialogService(
          TRANSACTION.RESTRICT_UMID_POPUP_CONTROLLER,
          TRANSACTION.RESTRICT_UMID_POPUP_VIEW,
          event,
          row.entity).then(() => {
          }, (restrictUMID) => {
            if (restrictUMID) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.scanAndRestrictUMID = (event) => {
        DialogFactory.dialogService(
          TRANSACTION.RESTRICT_UMID_POPUP_CONTROLLER,
          TRANSACTION.RESTRICT_UMID_POPUP_VIEW,
          event,
          null).then(() => {
          }, (restrictUMID) => {
            if (restrictUMID) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.restrictUMIDHistory = (row, event) => {
        DialogFactory.dialogService(
          TRANSACTION.RESTRICT_UMID_HISTORY_POPUP_CONTROLLER,
          TRANSACTION.RESTRICT_UMID_HISTORY_POPUP_VIEW,
          event,
          row.entity).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      //check parts are selected or not and if selected than its smart cart or not
      vm.checkPartForSearch = () => {
        if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
          return false;
        } else {
          return true;
        }
      };

      //search by umid api call from here on changeof checkbox
      vm.searchbyUMID = (ev) => {
        vm.event = ev;
        const smartCartList = _.filter(vm.selectedRowsList, (carts) => carts.warehouseType === vm.warehouseType.SmartCart.key);
        if (smartCartList.length > 0) {
          const dept = getLocalStorageValue(vm.loginUser.employee.id);
          if (_.find(vm.selectedRowsList, (selectDept) => selectDept.departmentID !== dept.department.ID) && !vm.isComapnyLevel) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_DEPARTMENT_VALIDATION);
            messageContent.message = stringFormat(messageContent.message, dept.department.Name);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            vm.showStatus = false;
            vm.transactionID = null;
            $scope.$emit('transferMaterial', vm.transactionID);
            vm.clickButton = false;
            return;
          } else {
            checkColorAvailibility(vm.isComapnyLevel ? 0 : dept.department.ID);
          }
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_ONLY_SMART_CART_UMID);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, commonCancelFunction);
        }
      };

      //cancel Request for search by umid
      vm.cancelSearch = () => {
        cancelRequest();
      };

      const cancelRequest = (isManualCancel) => {
        if (vm.transactionID) {
          const objTrans = {
            TransactionID: vm.transactionID,
            ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
            ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
          };
          if (isManualCancel) {
            objTrans.isManualCancel = true;
          }
          WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
            if (isManualCancel) {
              commonCancelFunction();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          commonCancelFunction();
        }
      };

      //get search time out
      const getSearchTime = () => {
        vm.cgBusyLoading = MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [TRANSACTION.AUDITPAGE.SearchRequestTimeout] }).$promise.then((response) => {
          if (response && response.data) {
            _.each(response.data, (item) => {
              switch (item.key) {
                case TRANSACTION.AUDITPAGE.SearchRequestTimeout:
                  vm.TimeOut = item.values ? parseInt(item.values) : CORE.CANCEL_REQUSET_TIMEOUT;
                  break;
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      getSearchTime();

      //check color availability to prompt in cart
      const checkColorAvailibility = (departmentID) => {
        ReceivingMaterialFactory.getPromptIndicatorColor().query({
          pcartMfr: CORE.InoautoCart, prefDepartmentID: departmentID
        }).$promise.then((res) => {
          if (res && res.data && res.data.promptColors.length > 0) {
            vm.promptColorDetails = res.data.promptColors[0];
            vm.TimeOut = res.data.defaultTimeout && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
            funSearchByUMID(departmentID);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            return;
            //color is not available message prompt
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const funSearchByUMID = (departmentID) => {
        vm.transactionID = getGUID();
        $scope.$emit('transferMaterial', vm.transactionID);
        const objSearchPartUMID = {
          UIDs: _.map(vm.selectedRowsList, 'uid'),
          PromptIndicator: vm.promptColorDetails.ledColorValue,
          ledColorID: vm.promptColorDetails.id,
          Priority: 0,
          TimeOut: vm.TimeOut,
          UserName: vm.loginUser.username,
          InquiryOnly: 0,
          departmentID: departmentID ? departmentID : null,
          TransactionID: vm.transactionID,
          Department: departmentID ? vm.selectedRowsList[0].department : '*',
          ReelBarCode: null
        };
        WarehouseBinFactory.sendRequestToSearchPartByUMID().query(objSearchPartUMID).$promise.then((response) => {
          if (response.status === 'FAILED') {
            vm.showStatus = false;
            vm.transactionID = null;
            $scope.$emit('transferMaterial', vm.transactionID);
            vm.clickButton = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //show ligh option for click
      vm.showLightForUMID = (row, ev) => {
        if (!vm.clickButton) {
          vm.gridOptions.gridApi.selection.selectRow(row);
          $timeout(() => {
            vm.clickButton = true;
            vm.changeEvent(true, ev);
          });
        }
      };

      const updateForceDeliverRequest = (request) => {
        var objUMID = _.find(vm.sourceData, (umid) => umid.uid === request.UID);
        if (objUMID) {
          objUMID.ledColorCssClass = null;
          objUMID.ledColorName = null;
          objUMID.inovexStatus = CORE.InoAuto_Search_Status.InTransit;
          objUMID.isTransit = 'Yes';
          if (!vm.transferOpen && request.OriginalTransactionID === vm.transactionID) {
            vm.transferStock({ transactionID: request.OriginalTransactionID, uid: objUMID.uid });
            if (vm.success) {
              vm.success = false;
              commonCancelFunction();
            }
          }
        }
      };

      const updateUMIDRequest = (response) => {
        if (vm.transactionID === response.response.TransactionID && !vm.showStatus) {
          $scope.$broadcast('showlight-receive', true);
          vm.showStatus = true;
          vm.response = response.response;
          const selectedPkg = response.response.ChosenPackages;
          const notFoundedPkg = response.response.UIDNotFound;
          const notAvailablePkg = response.response.UnavailablePackages;
          //add color for selected pkg Department
          _.each(selectedPkg, (item) => {
            var objUMID = _.find(vm.sourceData, (umid) => umid.uid === item.UID);
            if (objUMID) {
              objUMID.ledColorCssClass = vm.promptColorDetails.ledColorCssClass;
              objUMID.ledColorName = vm.promptColorDetails.ledColorName;
            }
          });
          _.map(selectedPkg, funChoosen);
          _.map(notFoundedPkg, funNotFound);
          _.map(notAvailablePkg, funNotAvailable);
          const sourceInovaxeHeader = _.find(vm.sourceHeader, (inoHeader) => inoHeader.field === 'inovexStatus');
          if (sourceInovaxeHeader) {
            vm.sourceHeader[vm.sourceHeader.indexOf(sourceInovaxeHeader)].visible = true;
          }
          $timeout(() => { vm.resetSourceGrid(); });
          if (selectedPkg.length === 0) {
            vm.clickButton = true;

            let messageContent = null;
            if (notAvailablePkg.length === 0) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_UIDNOTFOUND);
            } else {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_NOTAVAILABLE);
            }

            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, commonCancelFunction);
            return;
          }
        }
      };
      const funChoosen = (row) => {
        var Chosen = _.find(vm.sourceData, (Chosen) => Chosen.uid === row.UID);
        if (Chosen) {
          Chosen.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
        }
      };

      const funNotFound = (row) => {
        const notFound = _.find(vm.sourceData, (notFound) => notFound.uid === row);
        if (notFound) {
          notFound.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
        }
      };

      const funNotAvailable = (row) => {
        const notAvailable = _.find(vm.sourceData, (notAvailable) => notAvailable.uid === row.UID);
        if (notAvailable) {
          notAvailable.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
        }
      };

      //received details for cancel request
      const updateCancelRequestStatus = (req) => {
        if (req.transactionID === vm.transactionID && !vm.open) {
          cancelRequestAlert(req);
        }
      };

      //cancel request
      const cancelRequestAlert = (req) => {
        if (req.code === CORE.INO_AUTO_RESPONSE.SUCCESS) {
          NotificationFactory.success(req.message);
          if (vm.transferOpen) {
            callbackCancel();
            commonCancelFunction();
          } else { vm.success = true; }
          return;
        } else {
          commonCancelFunction();
          vm.open = true;
          let messageContent = null;
          if (req.code === CORE.INO_AUTO_RESPONSE.CANCEL) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_MANUALLY);
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_TIMEOUT);
          }
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model, callbackCancel);
          return;
        }
      };

      const commonCancelFunction = () => {
        vm.gridOptions.clearSelectedRows();
        _.map(vm.sourceData, funUMIDList);
        const objStatus = _.find(vm.sourceHeader, (pheader) => pheader.field === 'inovexStatus');
        if (objStatus) {
          const index = _.indexOf(vm.sourceHeader, objStatus);
          vm.sourceHeader[index].visible = false;
        }
        $scope.$broadcast('showlight-receive', false);
        vm.showStatus = false;
        vm.transactionID = null;
        $scope.$emit('transferMaterial', vm.transactionID);
        vm.clickButton = false;
      };

      const callbackCancel = () => {
        vm.open = false;
      };

      const funUMIDList = (row) => {
        row.inovexStatus = null;
        row.ledColorCssClass = null;
        row.ledColorName = null;
      };

      // method to update pricing status loader
      const removeUMIDStatus = $rootScope.$on(PRICING.EventName.RemoveUMIDFrmList, (name, data) => {
        const iswh = _.find(vm.filter.warehouseType, (wh) => wh === vm.warehouseType.SmartCart.key);
        if (iswh) {
          const umidStatus = _.find(vm.sourceData, (item) => item.uid === data.UID);
          if (umidStatus) {
            const index = _.indexOf(vm.sourceData, umidStatus);
            vm.sourceData.splice(index, 1);
            vm.totalSourceDataCount = vm.sourceData.length;
            vm.currentdata = vm.sourceData.length;
            $timeout(() => { vm.resetSourceGrid(); });
          }
        }
      });

      vm.clickButton = false;

      //change button event
      vm.changeEvent = (button, ev) => {
        if (button) {
          vm.searchbyUMID(ev);
        } else {
          vm.cancelSearch(ev);
        }
      };

      const getWHDetail = () => {
        if (stateParamsDet.whId > 0) {
          vm.cgBusyLoading = WarehouseBinFactory.retriveWarehouse().query({ id: stateParamsDet.whId }).$promise.then((response) => {
            if (response.data && response.data) {
              vm.filter.scanLabel = response.data.Name;
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
              vm.filter.scanLabel = response.data.Name;
              stateParamsDet.binId = 0;
              vm.pagingInfo.binId = stateParamsDet.binId;
              stateParamsDet.whId = 0;
              vm.pagingInfo.whId = stateParamsDet.whId;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.goToManufacturer = (id) => {
        BaseService.goToManufacturer(id);
      };

      vm.goToManufacturerList = () => {
        BaseService.goToManufacturerList();
      };

      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };

      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      };

      vm.goToFunctionalTypeList = () => {
        BaseService.goToFunctionalTypeList();
      };

      vm.goToMountingTypeList = () => {
        BaseService.goToMountingTypeList();
      };

      vm.goToKitDataList = () => {
        BaseService.goToKitDataList();
      };

      vm.goToWHList = () => {
        BaseService.goToWHList();
      };

      vm.goToCostCategoryList = () => {
        BaseService.openInNew(USER.ADMIN_COST_CATEGORY_STATE, {});
      };

      vm.goToStandardCaregoryList = () => {
        BaseService.goToStandardCaregoryList();
      };

      const init = () => {
        if (stateParamsDet.binId) {
          getBinDetail();
        } else if (stateParamsDet.whId) {
          getWHDetail();
        }
        initAutoComplete();
        const autocompletePromise = [vm.getMfgSearch(true), vm.getMfgSearch(false), vm.getKitDepartment(true), vm.getKitDepartment(false), vm.getRoHSList(), vm.getMountingTypeList(),
        vm.getFunctionalType(), vm.getAllocatedKitList(), vm.getStandard(), vm.getCostCategoryFromUMID()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
          vm.callLoadData = true;
          vm.loadData();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();

      vm.exportTemplate = () => {
        const fileName = CORE.modulesForExportSampleTemplate.UMIDMANAGEMENT;
        vm.cgBusyLoading = ManufacturerFactory.exportSampleMFGTemplate({ mfgType: fileName }).then((response) => {
          let messageContent = null;
          if (response.status === 404) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
          } else if (response.status === 403) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
          } else if (response.status === 401) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
          } else {
            exportFileDetail(response, fileName + '.xlsx');
          }

          if (messageContent) {
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const exportFileDetail = (res, name) => {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, name);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', name);
            link.style = 'visibility:hidden';
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              document.body.removeChild(link);
            });
          }
        }
      };

      const getDataElementValueOfUMID = () => ReceivingMaterialFactory.getDataElementValueOfUMID().query().$promise.then((response) => {
        if (response && response.data) {
          dataElementList = response.data;
          return dataElementList;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      vm.importUMIDData = () => {
        getDataElementValueOfUMID();
        angular.element('#fiexcel').trigger('click');
      };

      vm.eroOptions = {
        workstart: function () {
        },
        workend: function () { },
        sheet: function (json, sheetnames, select_sheet_cb, file) {
          var type = file.name.split('.');
          if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
            getDataElementValueOfUMID().then((response) => {
              UMID_COLUMN_MAPPING = [];
              UMID_COLUMN_MAPPING = angular.copy(CORE.UMID_COLUMN_MAPPING);
              _.map(response, (item) => {
                const fieldDet = {
                  fieldName: item.dataElementName
                };
                UMID_COLUMN_MAPPING.push(fieldDet);
              });
              const data = {
                headers: UMID_COLUMN_MAPPING,
                excelHeaders: json[0],
                notquote: true,
                headerName: vm.LabelConstant.UMIDManagement.UMID
              };
              DialogFactory.dialogService(
                RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
                RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
                vm.event,
                data).then((result) => {
                  json[0] = result.excelHeaders;
                  generateModel(json, result.model, data.excelHeaders);
                }, (err) => BaseService.getErrorLog(err));
            });
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        },
        badfile: () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
          var model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        pending: () => {
        },
        failed: () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        large: () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        multiplefile: function () {

        }
      };

      const generateModel = (uploadedUMID, umidHeaders, excelHeader) => {
        const umidmodel = [];
        // loop through excel data and bind into model
        for (let i = 1, len = uploadedUMID.length; i < len; i++) {
          const item = uploadedUMID[i];
          const modelRow = {};
          uploadedUMID[0].forEach((column, index) => {
            if (!column) {
              return;
            }
            const obj = umidHeaders.find((x) => x.column && x.column.toUpperCase() === column.toUpperCase());
            if (!obj) {
              return;
            }
            const field = UMID_COLUMN_MAPPING.find((x) => x === obj.header);
            if (!modelRow[field]) {
              modelRow[field] = item[index] ? item[index] : null;
            }
          });
          umidmodel.push(modelRow);
        };
        checkUploadedUMID(umidmodel, uploadedUMID, umidHeaders, excelHeader);
      };

      const checkUploadedUMID = (umidmodel, data, umidHeaders) => {
        const notMappedColumn = _.filter(umidHeaders, (data) => {
          if (_.findIndex(CORE.UMID_COLUMN_MAPPING_REQUIRE, (item) => item.fieldName === data.header) !== -1 && !data.column) {
            return data;
          }
        });
        if (notMappedColumn.length > 0) {
          const columnString = _.map(notMappedColumn, 'header').join(', ');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_IMPORT_COLUMN_NOT_MAPPED);
          messageContent.message = stringFormat(messageContent.message, columnString);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const modelList = [];
        _.each(umidmodel, (model) => {
          var modelObject = {
            prefix: model[vm.LabelConstant.UMIDManagement.UMIDPrefix],
            uid: model[vm.LabelConstant.UMIDManagement.UMID],
            mfrCode: model[vm.LabelConstant.UMIDManagement.MFR],
            mfrPnName: model[vm.LabelConstant.UMIDManagement.MFRPN],
            pkgQty: model[vm.LabelConstant.UMIDManagement.Count],
            orgQty: null,
            pkgUnit: null,
            orgPkgUnit: null,
            costCategoryID: null,
            costCategoryName: model[vm.LabelConstant.UMIDManagement.CostCategory],
            lotCode: model[vm.LabelConstant.UMIDManagement.LotCode],
            dateCode: model[vm.LabelConstant.UMIDManagement.InternalDateCode],
            binID: null,
            binName: model[vm.LabelConstant.UMIDManagement.ToLocationBIN],
            orgRecBin: null,
            orgRecWarehouse: null,
            orgRecDepartment: null,
            spq: null,
            stockInventoryType: TRANSACTION.InventoryType[1].value,
            receiveMaterialType: CORE.ReceivingMatirialTab.PartToStock.Code,
            uom: null,
            packaging: null,
            packagingName: model[vm.LabelConstant.UMIDManagement.Packaging],
            refSupplierPartId: null,
            fromBin: CORE.SystemGenratedWarehouseBin.bin.OpeningBin.id,
            fromWarehouse: CORE.SystemGenratedWarehouseBin.warehouse.OpeningWarehouse.id,
            pcbPerArray: model[vm.LabelConstant.UMIDManagement.pcbPerArray],
            sealDate: model[vm.LabelConstant.UMIDManagement.sealDate],
            MFGorExpiryDate: model[vm.LabelConstant.UMIDManagement.MFGorExpiryDate],
            mfgDate: model[vm.LabelConstant.UMIDManagement.mfgDate],
            expiryDate: model[vm.LabelConstant.UMIDManagement.expiryDate],
            specialNote: model[vm.LabelConstant.UMIDManagement.specialNote],
            dataElement: []
          };

          _.map(dataElementList, (data) => {
            if (model[data.dataElementName]) {
              data.value = model[data.dataElementName];
              modelObject.dataElement.push(data);
            }
          });

          modelList.push(modelObject);
        });

        if (modelList.length > 0) {
          vm.cgBusyLoading = ReceivingMaterialFactory.importUMIDDetail().query({ umidImportedDetail: modelList }).$promise.then((umid) => {
            if (umid && umid.status === CORE.ApiResponseTypeStatus.FAILED) {
              const exportList = _.filter(umid.data, (fStatus) => fStatus.status === CORE.ApiResponseTypeStatus.FAILED);
              const errorUMIDList = [];
              _.each(exportList, (errUMID) => {
                var objErrUMID = {};
                objErrUMID[vm.LabelConstant.UMIDManagement.UMIDPrefix] = errUMID.prefix;
                objErrUMID[vm.LabelConstant.UMIDManagement.UMID] = errUMID.uid;
                objErrUMID[vm.LabelConstant.UMIDManagement.MFR] = errUMID.mfrCode;
                objErrUMID[vm.LabelConstant.UMIDManagement.MFRPN] = errUMID.mfrPnName;
                objErrUMID[vm.LabelConstant.UMIDManagement.Count] = errUMID.pkgQty;
                objErrUMID[vm.LabelConstant.UMIDManagement.ToLocationBIN] = errUMID.binName;
                objErrUMID[vm.LabelConstant.UMIDManagement.Packaging] = errUMID.packagingName;
                objErrUMID[vm.LabelConstant.UMIDManagement.CostCategory] = errUMID.costCategoryName;
                objErrUMID[vm.LabelConstant.UMIDManagement.InternalDateCode] = errUMID.dateCode;
                objErrUMID[vm.LabelConstant.UMIDManagement.LotCode] = errUMID.lotCode;
                objErrUMID[vm.LabelConstant.UMIDManagement.pcbPerArray] = errUMID.pcbPerArray;
                objErrUMID[vm.LabelConstant.UMIDManagement.sealDate] = errUMID.sealDate;
                objErrUMID[vm.LabelConstant.UMIDManagement.mfgDate] = errUMID.mfgDate;
                objErrUMID[vm.LabelConstant.UMIDManagement.expiryDate] = errUMID.expiryDate;
                objErrUMID[vm.LabelConstant.UMIDManagement.specialNote] = errUMID.specialNote;

                if (errUMID.dataElement.length > 0) {
                  _.map(errUMID.dataElement, (data) => {
                    objErrUMID[data.dataElementName] = data.value;
                  });
                }

                objErrUMID.Error = errUMID.message;
                errorUMIDList.push(objErrUMID);
              });

              vm.cgBusyLoading = ImportExportFactory.importFile(errorUMIDList).then((res) => {
                if (res.data && errorUMIDList.length > 0) {
                  vm.loadData();
                  exportFileDetail(res, 'UMID_Management_error.xls');
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              vm.loadData();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.binTransfer = () => {
        DialogFactory.dialogService(
          TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
          TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
          null,
          null).then(() => {
          }, () => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.searchMfrList = () => {
        const mfrListToFilter = angular.copy(vm.mfgCodeDetail);
        vm.mfgCodeListToDisplay = vm.mfrSearchText ? _.filter(mfrListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.mfrSearchText.toLowerCase())) : mfrListToFilter;
      };

      vm.searchsupplierList = () => {
        const supplierListToFilter = angular.copy(vm.supplierCodeDetail);
        vm.supplierCodeListToDisplay = vm.supplierSearchText ? _.filter(supplierListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.supplierSearchText.toLowerCase())) : supplierListToFilter;
      };

      vm.searchFunctionalTypeList = () => {
        const functionalTypeListToFilter = angular.copy(vm.functionalTypeList);
        vm.functionalTypeListToDisplay = vm.functionalTypeSearchText ? _.filter(functionalTypeListToFilter, (item) => item.partTypeName.toLowerCase().contains(vm.functionalTypeSearchText.toLowerCase())) : functionalTypeListToFilter;
      };

      vm.searchMountingTypeList = () => {
        const mountingTypeListToFilter = angular.copy(vm.mountingTypeList);
        vm.mountingTypeListToDisplay = vm.mountingTypeSearchText ? _.filter(mountingTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.mountingTypeSearchText.toLowerCase())) : mountingTypeListToFilter;
      };

      vm.searchAllocatedKitList = () => {
        const allocatedKitListToFilter = angular.copy(vm.allocatedKitList);
        vm.allocatedKitListToDisplay = vm.allocatedKitSearchText ? _.filter(allocatedKitListToFilter, (item) => item.kitName.toLowerCase().contains(vm.allocatedKitSearchText.toLowerCase())) : allocatedKitListToFilter;
      };

      vm.searchCostCategoryList = () => {
        const costCategoryListToFilter = angular.copy(vm.costCategoryList);
        vm.costCategoryListToDisplay = vm.costCategorySearchText ? _.filter(costCategoryListToFilter, (item) => item.displayName.toLowerCase().contains(vm.costCategorySearchText.toLowerCase())) : costCategoryListToFilter;
      };

      vm.searchStandardsList = () => {
        const standardsListToFilter = angular.copy(vm.standardsList);
        vm.standardsListToDisplay = vm.standardsSearchText ? _.filter(standardsListToFilter, (item) => item.fullName.toLowerCase().contains(vm.standardsSearchText.toLowerCase())) : standardsListToFilter;
      };

      vm.searchParentWarehouseList = () => {
        const parentWarehouseListToFilter = angular.copy(vm.WarehouseDepartmentList);
        vm.parentWarehouseListToDisplay = vm.parentWarehouseSearchText ? _.filter(parentWarehouseListToFilter, (item) => item.Name.toLowerCase().contains(vm.parentWarehouseSearchText.toLowerCase())) : parentWarehouseListToFilter;
      };
      vm.searchWarehouseList = () => {
        const warehouseListToFilter = angular.copy(vm.WarehouseList);
        vm.warehouseListToDisplay = vm.warehouseSearchText ? _.filter(warehouseListToFilter, (item) => item.Name.toLowerCase().contains(vm.warehouseSearchText.toLowerCase())) : warehouseListToFilter;
      };
      vm.searchRohsList = () => {
        const rohsListToFilter = angular.copy(vm.rohsList);
        vm.rohsListToDisplay = vm.rohsSearchText ? _.filter(rohsListToFilter, (item) => item.value.toLowerCase().contains(vm.rohsSearchText.toLowerCase())) : rohsListToFilter;
      };

      vm.clearMfrSearchText = () => {
        vm.mfrSearchText = undefined;
        vm.searchMfrList();
      };
      vm.clearsupplierSearchText = () => {
        vm.supplierSearchText = undefined;
        vm.searchsupplierList();
      };
      vm.clearFunctionalTypeSearchText = () => {
        vm.functionalTypeSearchText = undefined;
        vm.searchFunctionalTypeList();
      };
      vm.clearMountingTypeSearchText = () => {
        vm.mountingTypeSearchText = undefined;
        vm.searchMountingTypeList();
      };
      vm.clearAllocatedKitSearchText = () => {
        vm.allocatedKitSearchText = undefined;
        vm.searchAllocatedKitList();
      };
      vm.clearCostCategorySearchText = () => {
        vm.costCategorySearchText = undefined;
        vm.searchCostCategoryList();
      };
      vm.clearStandardsSearchText = () => {
        vm.standardsSearchText = undefined;
        vm.searchStandardsList();
      };
      vm.clearParentWarehouseSearchText = () => {
        vm.parentWarehouseSearchText = undefined;
        vm.searchParentWarehouseList();
      };
      vm.clearWarehouseSearchText = () => {
        vm.warehouseSearchText = undefined;
        vm.searchWarehouseList();
      };
      vm.clearRohsSearchText = () => {
        vm.rohsSearchText = undefined;
        vm.searchRohsList();
      };
      vm.goToRoHSStatusList = () => {
        BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
      };

      vm.goToUIDManage = (id) => BaseService.goToUMIDDetail(id);

      $scope.$on('exportTemplate', () => {
        vm.exportTemplate();
      });

      $scope.$on('importUMIDData', () => {
        vm.importUMIDData();
      });
      //filter for in transit data
      vm.changeToTransit = () => {
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };
      $scope.$on('updatetransferopenflag', (event, data) => {
        vm.transferOpen = data;
      });
      //get data key page
      vm.goDatakeysPage = () => {
        BaseService.gotoDataKeyList();
      };

      vm.goToPartDetails = (partID) => {
        BaseService.goToComponentDetailTab(null, partID);
        return false;
      };

      vm.goToSupplierPartDetails = (partID) => {
        BaseService.goToSupplierPartDetails(partID);
        return false;
      };

      vm.goToPackingSlip = (row) => {
        if (row) {
          BaseService.goToManagePackingSlipDetail(row.packingSlipId);
          return false;
        }
      };

      // [S] Socket Listeners
      const connectSocket = () => {
        socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
        socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
        socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      };

      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      const removeSocketListener = () => {
        socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      };

      $scope.$on('$destroy', () => {
        // Remove socket listeners
        cancelRequest();
        removeUMIDStatus();
        removeSocketListener();
        $mdDialog.hide(false, { closeAll: true });
      });

      // on disconnect socket
      socketConnectionService.on('disconnect', () => {
        // Remove socket listeners
        removeSocketListener();
      });
    }
  }
})();
