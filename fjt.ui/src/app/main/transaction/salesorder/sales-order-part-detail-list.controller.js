(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrderPartDetailController', SalesOrderPartDetailController);

  /** @ngInject */
  function SalesOrderPartDetailController($mdDialog, $timeout, CORE, USER, TRANSACTION, $scope,
    SalesOrderFactory, DialogFactory, BaseService, GenericCategoryFactory, RFQTRANSACTION,
    $q, socketConnectionService, WORKORDER, $stateParams, CONFIGURATION, MasterFactory, PurchaseOrderFactory, $filter) {
    const vm = this;
    vm.listType = parseInt($stateParams.listType); // 0 - sales order list, 1 - Pending customer paking slip list
    vm.isUpdatable = vm.listType === 0 ? true : false;
    vm.isCreateDuplicateSO = vm.listType === 0 ? true : false;
    vm.isUsageMaterial = vm.listType === 0 ? true : false;
    vm.isManualStatusChange = vm.listType === 0 ? true : false;
    vm.configTimeout = _configTimeout;
    vm.isDownload = true;
    vm.partType = CORE.PartType.Other;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SALESORDER;
    vm.EmptyMesssageForPECustPackingSlip = TRANSACTION.TRANSACTION_EMPTYSTATE.PENDING_CUSTOMER_PACKING_SLIP_CREATION;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.HaltResumePopUp = CORE.HaltResumePopUp;
    vm.haltImagePath = vm.HaltResumePopUp.stopImagePath;
    vm.resumeImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, vm.HaltResumePopUp.resumeFileName);
    vm.woStatusDetail = CORE.WorkOrderStatus;
    vm.WoStatus = CORE.SalesOrderStatusGridHeaderDropdown;
    vm.CompelteStatus = CORE.SalesOrderCompleteStatusGridHeaderDropdown;
    vm.GoodBadPartHeaderDropdown = CORE.GoodBadPartHeaderDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.gridId = vm.listType === 0 ? vm.gridConfig.gridSalesOrder : vm.gridConfig.gridPendingCustomerPackingSlip;
    vm.isAssyAtGlance = vm.listType === 0 ? true : false;
    vm.isCheckKitFeasibility = vm.listType === 0 ? true : false;
    vm.isKitRelease = vm.listType === 0 ? true : false;
    vm.isWorkOrder = vm.listType === 0 ? true : false;
    vm.SOWorkingStatus = CORE.SOWorkingStatus;
    vm.isHaltResumeHistory = vm.listType === 0 ? true : false;
    vm.isHaltResumeSalesOrder = vm.listType === 0 ? true : false;
    vm.isPrinted = true;
    vm.isfocus = true;
    vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
    vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
    vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
    vm.EmptyMesssages = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
    vm.SalesOrderAdvanceFilter = angular.copy(CORE.SalesOrderAdvancedFilters);
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.salesOrderList = vm.listType === 0 ? true : false;
    vm.salesorderChangesHistory = vm.listType === 0 ? true : false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.iscancle = vm.listType === 0 ? true : false;
    vm.isAddCustPackingSlip = vm.listType === 1 ? true : false;
    vm.isHideDelete = vm.listType === 1 ? true : false;
    vm.isViewAssembly = vm.listType === 0 ? true : false;
    vm.publish = vm.listType === 0 ? false : true;
    vm.kitRelease = true;
    vm.entityID = CORE.AllEntityIDS.SalesOrder.ID;
    vm.LabelConstant = CORE.LabelConstant;
    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);
    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.pending = true;
    vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
    vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
    vm.checkSerachAmountType = vm.CheckSearchTypeList[1].id;
    vm.isHideDelete = true;// as discuss with VS on 29/11/2021 Delete should be hidded in case of Detail tab of List -Global
    vm.salesOrderDateFilterList = angular.copy(TRANSACTION.SalesOrderDateFilterList);
    vm.selectedDateType = vm.salesOrderDateFilterList[0].key;
    vm.isAllFilterClear = false; 
    //vm.partType = CORE.PartType;
    //const initDateOption = () => {
    //  vm.fromDateOptions = {
    //    appendToBody: true,
    //    fromDateOpenFlag: false,
    //    maxDate: vm.toDate
    //  };
    //  vm.toDateOptions = {
    //    appendToBody: true,
    //    toDateOpenFlag: false,
    //    minDate: vm.fromDate
    //  };
    //  vm.fromPODateOptions = {
    //    appendToBody: true,
    //    fromPODateOpenFlag: false,
    //    maxDate: vm.toPODate
    //  };
    //  vm.toPODateOptions = {
    //    appendToBody: true,
    //    toPODateOpenFlag: false,
    //    minDate: vm.fromPODate
    //  };
    //};
    //initDateOption();
    vm.customer = [];
    vm.shippingMethods = [];
    vm.terms = [];
    vm.partIds = [];
    vm.woIds = [];
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.WOSTATUS = CORE.WOSTATUS;
    vm.posoNumber = $stateParams.soNumber;
    vm.completed = $stateParams.soStatus ? true : false;
    if (vm.completed || vm.posoNumber) {
      vm.pending = false;
    }
    // for copy icon into ui-grid action column

    const kitStatusPercentageColumn = {
      field: 'kitStatusPercentage',
      width: '130',
      minWidth: '130',
      displayName: 'Kit Allocation % (Component)',
      cellTemplate: '<div>'
        + '<md-button ng-disabled="!row.entity.salesOrderDetailId || row.entity.isSkipKitCreation || row.entity.partType===grid.appScope.$parent.vm.partType" class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openkitAllocation(row)">'
        + '<div class="cm-quote-progress" style="width:{{(row.entity.kitStatusPercentage || 0) +\'%\'}}"></div>'
        + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'underline\':row.entity.salesOrderDetailId && row.entity.partType!==grid.appScope.$parent.vm.partType}" class="cursor-pointer"><span ng-if="row.entity.partType===grid.appScope.$parent.vm.partType">N/A</span><span ng-if="row.entity.partType!==grid.appScope.$parent.vm.partType">A-{{(row.entity.kitStatusPercentage || 0)}}%</span></span></span>'
        + '<md-tooltip md-direction="top">Kit Allocation % (Component)</md-tooltip>'
        + '</md-button>'
        + '</div>'
        + '<span class="ml-5 margin-top-2">'
        + '<img class="wo-stop-image" ng-if="row.entity.haltStatusKA == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
        + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusKA == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonKA}}</md-tooltip></span>',
      ColumnDataType: 'StringEquals',
      enableFiltering: false,
      allowCellFocus: false,
      cellClass: function (grid, row) {
        if (row.entity.kitReturnStatus == TRANSACTION.KIT_RETURN_STATUS.FR.name) {
          return 'label-light-green';
        }
      }
    };

    const subKitStatusPercentageColumn =
    {
      field: 'subKitStatusPercentage',
      width: '110',
      minWidth: '110',
      displayName: 'Kit Allocation % (With Sub Assembly)',
      cellTemplate: '<div>'
        + '<md-button ng-disabled="!row.entity.salesOrderDetailId || row.entity.isSkipKitCreation || row.entity.partType===grid.appScope.$parent.vm.partType" class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openkitAllocation(row)">'
        + '<div class="cm-quote-progress" style="width:{{(row.entity.subKitStatusPercentage || 0) +\'%\'}}"></div>'
        + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'underline\':row.entity.salesOrderDetailId && row.entity.partType!==grid.appScope.$parent.vm.partType}" class="cursor-pointer"><span ng-if="row.entity.partType===grid.appScope.$parent.vm.partType">N/A</span><span ng-if="row.entity.partType!==grid.appScope.$parent.vm.partType">A-{{(row.entity.subKitStatusPercentage || 0)}}%</span></span></span>'
        + '<md-tooltip md-direction="top">Kit Allocation % (With Sub Assembly)</md-tooltip>'
        + '</md-button>'
        + '</div>',
      ColumnDataType: 'StringEquals',
      enableSorting: false,
      enableFiltering: false,
      allowCellFocus: false
    };

    const cancleReasonColumn = {
      field: 'cancleReason',
      displayName: 'Cancellation / Undo Reason',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '250'
    };

    const kitQtyColumn = {
      field: 'kitQty',
      displayName: 'Kit Qty',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      width: '120'
    };

    const kitReleasePlanCountColumn = {
      field: 'kitReleasePlanCount',
      displayName: 'Plan Count',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                            <a tabindex="-1" ng-if="row.entity.isKitPlanAllowed === 1" ng-class="{\'red\': row.entity.kitReleasePlanCount <= 0}" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPlannPurchase(row, $event)"> \
                              {{ COL_FIELD }} \
                            </a> \
                            <span ng-if="row.entity.isKitPlanAllowed === 0">{{ COL_FIELD }}</span>\
                        <md-tooltip md-direction="top">Plan Kit</md-tooltip> \
                        </div > ',
      width: '80',
      allowCellFocus: true
    };

    const kitNumberColumn = {
      field: 'kitNumber',
      displayName: 'Kit Number',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '170',
      allowCellFocus: true
    };

    const isSkipKitCreationColumn = {
      field: 'isSkipKitCreation',
      displayName: vm.LabelConstant.SalesOrder.DoNotCreateKit,
      cellTemplate: '<div class="ui-grid-cell-contents text-center width-100p"><md-checkbox ng-model="row.entity.isSkipKitCreation" ng-disabled="true"/></div>',
      width: 170,
      enableCellEdit: false,
      enableFiltering: false,
      enableSorting: false,
      allowCellFocus: false,
      maxWidth: '300'
    };

    const balancePOQtyColumn = {
      field: 'balancePoQty',
      displayName: 'Balance Qty',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      width: '120',
      allowCellFocus: true
    };

    const shippedQtyColumn = {
      field: 'custPackingSlipShippedQty',
      displayName: 'Shipped Qty',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><span ng-class="{\'underline cursor-pointer\':row.entity.custPackingSlipShippedQty} " ng-click="row.entity.custPackingSlipShippedQty?grid.appScope.$parent.vm.openBifurcationQtyPopup(row.entity,$event):null">{{COL_FIELD | numberWithoutDecimal}}</span></div>',
      width: '120',
      allowCellFocus: true
    };
    const priceColumn = {
      field: 'price',
      displayName: 'Price ($)',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>',
      width: '100'
    };

    const mrpQtyColumn =
    {
      field: 'mrpQty',
      displayName: 'MRP Qty',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
      width: '120'
    };

    const extPriceDisplayValueColumn =
    {
      field: 'extPriceDisplayValue',
      displayName: 'Ext. Price ($)',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>',
      width: '150',
      enableFiltering: false,
      enableSorting: true
    };

    const otherChargesTotalColumn = {
      field: 'otherChargesTotal',
      displayName: 'Total Other Charges Price ($)',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>',
      width: '130'
    };

    const totalextPriceDisplayValueColumn = {
      field: 'totalextPriceDisplayValue',
      displayName: 'Total Ext. Price ($)',
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>',
      width: '150',
      enableFiltering: false,
      enableSorting: true
    };

    const promisedShipDateColumn = {
      field: 'promisedShipDate',
      displayName: 'Next Promised Delivery Date',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: '130',
      enableFiltering: false
    };

    /*load source header after getting shipping detail list*/
    function LoadSourceData() {
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: (vm.listType === 0 ? '230' : '140'),
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="6"></grid-action-view>',
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
          enableSorting: false,
          pinnedLeft: true
        },
        {
          field: 'serialNumber',
          displayName: 'SystemID',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '{{COL_FIELD}}'
            + '</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'statusConvertedValue',
          displayName: 'SO Posting Status',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getWoStatusClassName(row.entity.status)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.WoStatus
          },
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'soCompletionPercentage',
          width: '100',
          minWidth: '100',
          displayName: 'SO Completion Status',
          cellTemplate: '<div>'
            + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openPOStatusReport(row.entity)">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.Completed?100:row.entity.soCompletionPercentage && (row.entity.soCompletionPercentage>100)?100: (row.entity.soCompletionPercentage|| 0)) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'cursor-pointer\': row.entity.soCompletionPercentage > 0 , \'underline\':row.entity.soCompletionPercentage > 0}"> '
            + '{{row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.Completed?100:(row.entity.soCompletionPercentage && (row.entity.soCompletionPercentage>100)?100: (row.entity.soCompletionPercentage|| 0))}}%</span></span>'
            + '<md-tooltip md-direction="top">{{grid.appScope.$parent.vm.LabelConstant.Shipped.ShippedQty}}: {{row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.Completed?row.entity.qty:row.entity.shippedQty}}</md-tooltip>'
            + '</md-button>'
            + '</div>',
          enableFiltering: true,
          allowCellFocus: false
        },
        {
          field: 'salesOrderDetStatusConvertedValues',
          displayName: 'SO Working Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.InProgress, \'label-success\':row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.Completed ,\'label-danger\' :row.entity.salesOrderDetStatusConvertedValues ==grid.appScope.$parent.vm.SOWorkingStatus.Canceled }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '<span class="ml-5">'
            + '<img class="wo-stop-image wo-stop-image-margin" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonPO}}</md-tooltip>'
            + '</span>'
            + '</div>',
          width: '150',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'blanketPOText',
          displayName: 'Blanket PO',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isBlanketPO),\
                        \'label-box label-success\':(row.entity.isBlanketPO)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.ShippingInsuranceDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'blanketPOOptionText',
          displayName: 'Blanket PO Option',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box light-green-bg\':(row.entity.blanketPOOption==1),\
                        \'label-box light-blue-bg\':(row.entity.blanketPOOption==2),\
                        \'label-box light-pink-bg\':(row.entity.blanketPOOption==3)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '270',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.BlanketPOOptionDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'rmaPOText',
          displayName: 'RMA PO',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isRmaPO),\
                        \'label-box label-success\':(row.entity.isRmaPO)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.MasterTemplateDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'rmaNumber',
          displayName: CORE.LabelConstant.SalesOrder.RMANumber,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            {{COL_FIELD}}\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.RMANumber" text="row.entity.rmaNumber" ng-if="row.entity.rmaNumber"></copy-text>\
                        </div>',
          width: '130'
        },
        {
          field: 'linkToBlanketPOText',
          displayName: 'Link To Blanket PO',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.linkToBlanketPO),\
                        \'label-box label-success\':(row.entity.linkToBlanketPO)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.ShippingInsuranceDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'isHotJobValue',
          displayName: 'Rush Job',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isHotJobValue == \'Yes\',\
                            \'label-warning\':row.entity.isHotJobValue == \'No\' }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          ColumnDataType: 'StringEquals',
          enableFiltering: false,
          enableSorting: true,
          width: '95'
        },
        {
          field: 'salesOrderNumber',
          displayName: CORE.LabelConstant.SalesOrder.SO,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.SO" text="row.entity.salesOrderNumber" ng-if="row.entity.salesOrderNumber"></copy-text>\
                        </div>',
          width: '130'
        },
        {
          field: 'soDate',
          displayName: CORE.LabelConstant.SalesOrder.SODate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'revision',
          displayName: 'SO Version',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '110'
        },
        {
          field: 'poNumber',
          displayName: vm.LabelConstant.SalesOrder.PO,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"></copy-text>\
                        </div>',
          width: '150'
        },
        {
          field: 'poDate',
          displayName: 'PO Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        }, {
          field: 'poRevision',
          displayName: 'PO Revision',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '110'
        }, {
          field: 'poRevisionDate',
          displayName: 'PO Revision Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '110'
        }, {
          field: 'companyName',
          displayName: vm.LabelConstant.SalesOrder.Customer,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Customer" text="row.entity.companyName" ng-if="row.entity.companyName"></copy-text>\
                        </div>',
          width: '280',
          enableFiltering: false
        },
        //{
        //  field: 'fullName',
        //  displayName: 'Contact Person',
        //  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        //  width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
        //},
        //{
        //  field: 'termsDisplayText',
        //  displayName: vm.LabelConstant.SalesOrder.Terms,
        //  cellTemplate: '<div class="ui-grid-cell-contents">\
        //                    <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToGenericCategoryManageTerms(row.entity.termsID);" tabindex="-1">{{COL_FIELD}}</a>\
        //                    <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Terms" text="row.entity.termsDisplayText" ng-if="row.entity.termsDisplayText"></copy-text>\
        //                </div>',
        //  width: '140',
        //  enableFiltering: false
        //},
        {
          field: 'debitedByCustText',
          displayName: vm.LabelConstant.SalesOrder.IsDebitedByCustomer,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(row.entity.isDebitedByCustomer === 0),\
                        \'label-box label-success\':(row.entity.isDebitedByCustomer === 1)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.MasterTemplateDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'rmaOrgPONumber',
          displayName: vm.LabelConstant.SalesOrder.OrgPONumber,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-if="row.entity.orgSalesOrderID" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.orgSalesOrderID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <span ng-if="!row.entity.orgSalesOrderID">{{COL_FIELD}}</span>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.OrgPONumber" text="row.entity.poNumber" ng-if="row.entity.rmaOrgPONumber"></copy-text>\
                        </div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'reworkReqText',
          displayName: vm.LabelConstant.SalesOrder.IsReworkRequired,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(row.entity.isReworkRequired === 0),\
                        \'label-box label-success\':(row.entity.isReworkRequired === 1)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.MasterTemplateDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'reworkPONumber',
          displayName: vm.LabelConstant.SalesOrder.ReworkPONumber,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            {{COL_FIELD}}\
                            <copy-text ng-if="row.entity.reworkPONumber" label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ReworkPONumber" text="row.entity.reworkPONumber" ng-if="row.entity.rmaOrgPONumber"></copy-text>\
                        </div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'genCategoryCode',
          displayName: vm.LabelConstant.SalesOrder.ShippingMethod,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryShippingType(row.entity.shippingMethodID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ShippingMethod" text="row.entity.genCategoryCode" ng-if="row.entity.genCategoryCode"></copy-text>\
                        </div>',
          width: '100',
          enableFiltering: false
        },
        {
          field: 'PIDCode',
          displayName: 'Assy ID/PID',
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="\'Assy ID/ PID\'" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-custom-part="(row.entity.isCustomPart || row.entity.partType === grid.appScope.$parent.vm.partType)" \
                                rohs-icon="row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue" \
                                is-assembly="(row.entity.isCustomPart || row.entity.partType === grid.appScope.$parent.vm.partType)"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
          enableFiltering: false
        }, {
          field: 'mfgPN',
          displayName: vm.LabelConstant.MFG.MFGPN,
          enableCellEdit: false,
          enableCellEditOnFocus: true,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsComplientConvertedValue" \
                                        is-custom-part="(row.entity.isCustomPart || row.entity.partType === grid.appScope.$parent.vm.partType)" \
                                        is-assembly="(row.entity.isCustomPart || row.entity.partType === grid.appScope.$parent.vm.partType)"></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: true,
          enableFiltering: false
        },
        {
          field: 'nickName',
          displayName: vm.LabelConstant.Assembly.NickName,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
        },
        {
          field: 'partDescription',
          displayName: 'Part Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '230'
        },
        {
          field: 'originalPOQty',
          displayName: 'Orig. PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '80'
        },
        {
          field: 'qty',
          displayName: 'PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '80'
        },
        {
          field: 'shippedQty',
          displayName: 'Shipped Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><span ng-class="{\'underline cursor-pointer\':row.entity.shippedQty && !row.entity.assignBlanketPOQty} " ng-click="row.entity.shippedQty && !row.entity.assignBlanketPOQty?grid.appScope.$parent.vm.openBifurcationQtyPopup(row.entity,$event):null">{{COL_FIELD | numberWithoutDecimal}}</span></div>',
          width: '80'
        },
        {
          field: 'openQty',
          displayName: 'Open Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD<0?0:COL_FIELD | numberWithoutDecimal}}</div>',
          width: '75'
        },
        {
          field: 'openBlanketPOQty',
          displayName: 'Open Blanket PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{(row.entity.isBlanketPO)?(COL_FIELD<0?0:COL_FIELD | numberWithoutDecimal):""}}</div>',
          width: '100'
        },
        {
          field: 'assignBlanketPOQty',
          displayName: 'Assigned Blanket PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{(row.entity.isBlanketPO)?(COL_FIELD<0?0:COL_FIELD | numberWithoutDecimal):""}}</div>',
          width: '100'
        },
        {
          field: 'custPOLineNumber',
          displayName: 'PO Line#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: true
        },
        {
          field: 'liveVersion',
          displayName: vm.LabelConstant.BOM.InternalVersion,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120'
        },
        {
          field: 'releasedWorkorder',
          displayName: vm.LabelConstant.Workorder.ReleasedWO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">\
                            <span ng-repeat="releasedWorkorder in row.entity.releasedWorkorderDets track by $index">\
                                <a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.gotoWorkOrder($index,row.entity.releasedWorkorderDetIds);" tabindex="-1">{{releasedWorkorder}}</a>{{row.entity.releasedWorkorderDets[row.entity.releasedWorkorderDets.length-1]===releasedWorkorder?\'\':\' , \'}}\
                            </span>\
                        </div>',
          width: '200',
          allowCellFocus: true
        },
        //removed qty column
        {
          field: 'materialTentitiveDocDate',
          displayName: 'Customer Consigned Material Promised Dock Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          enableFiltering: false
        },
        {
          field: 'materialDueDate',
          displayName: 'Purchased Material Dock Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><label  ng-class="{\'red\': row.entity.isPastMaterialDocDate}">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</label></div>',
          width: '110',
          enableFiltering: false
        },
        {
          field: 'requestedBPOStartDate',
          displayName: 'Requested Blanket PO Start Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><label >{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</label></div>',
          width: '155',
          enableFiltering: false
        },
        {
          field: 'blanketPOEndDate',
          displayName: 'Blanket PO End Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><label  ng-class="{\'red\': row.entity.isBlanketPOEndDate}">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</label></div>',
          width: '115',
          enableFiltering: false
        },
        {
          field: 'prcNumberofWeek',
          displayName: 'Build Weeks',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80'
        },
        {
          field: 'shippingQty',
          displayName: 'Total Releases',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80'
        },
        {
          field: 'remark',
          displayName: 'Line Shipping Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.remark && row.entity.remark !== \'-\'" ng-click="grid.appScope.$parent.vm.showLineLevelDescriptionPopUp(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '120',
          enableFiltering: false
        },
        {
          field: 'internalComment',
          displayName: 'Line Internal Notes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalComment && row.entity.internalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showLineLevelNotesDescriptionPopUp(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '100',
          enableFiltering: false
        },
        {
          field: 'nextShipDate',
          displayName: 'Next Ship Plan Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '130'
        },
        {
          field: 'workOrders',
          displayName: 'WO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">\
                            <span ng-repeat="workorder in row.entity.workorderDets track by $index">\
                                <a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.gotoWorkOrder($index,row.entity.workorderIds);" tabindex="-1">{{workorder}}</a>{{row.entity.workorderDets[row.entity.workorderDets.length-1]===workorder?\'\':\' , \'}}\
                            </span>\
                        </div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: false,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'completeStatusReason',
          displayName: 'Reason for Completed status',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
        },
        {
          field: 'salesAssy',
          displayName: 'Selected Assy ID/PID',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'salesRelease',
          displayName: 'Release Line#',
          width: '180',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'frequencyName',
          displayName: 'Charge Frequency',
          width: '110',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'frequencyTypeName',
          displayName: 'Charge Frequency Type',
          width: '110',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'releaseLevelComment',
          displayName: 'Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releaseLevelComment && row.entity.releaseLevelComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showReleaseLevelComment(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '175',
          enableFiltering: false,
          maxWidth: '250'
        },
        {
          field: 'modifyDate',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        }, {
          field: 'soModifiedBy',
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
          field: 'createdDate',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        },
        {
          field: 'soCreatedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true,
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
        }
      ];

      if (vm.listType === 0) {
        vm.sourceHeader.splice(3, 0, kitStatusPercentageColumn);
        vm.sourceHeader.splice(4, 0, subKitStatusPercentageColumn);
        vm.sourceHeader.splice(8, 0, cancleReasonColumn);
        vm.sourceHeader.splice(26, 0, priceColumn);
        vm.sourceHeader.splice(27, 0, extPriceDisplayValueColumn);
        vm.sourceHeader.splice(28, 0, otherChargesTotalColumn);
        vm.sourceHeader.splice(29, 0, totalextPriceDisplayValueColumn);
        vm.sourceHeader.splice(30, 0, mrpQtyColumn);
        vm.sourceHeader.splice(31, 0, kitQtyColumn);
        vm.sourceHeader.splice(35, 0, kitReleasePlanCountColumn);
        vm.sourceHeader.splice(36, 0, isSkipKitCreationColumn);
        vm.sourceHeader.splice(37, 0, kitNumberColumn);
      } else if (vm.listType === 1) {
        vm.sourceHeader.splice(11, 0, shippedQtyColumn);
        vm.sourceHeader.splice(12, 0, balancePOQtyColumn);
        vm.sourceHeader.splice(13, 0, promisedShipDateColumn);
      }
    }
    // Get Term and Condition from Data key for Sales Order Report
    const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
      if (dataKey) {
        vm.dataKey = dataKey.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const gridHeaderFilterPromise = [getDataKey()];
    vm.cgBusyLoading = $q.all(gridHeaderFilterPromise).then(() => {
      LoadSourceData();
    }).catch((error) => BaseService.getErrorLog(error));

    //refersh sales order
    vm.refreshSalesOrder = () => {
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        isKitList: false,
        isPendingCustPackingSlipList: vm.listType
      };
      if (vm.listType === 1) {
        vm.pagingInfo.SortColumns = [['promisedShipDate', 'ASC']];
      }
    };
    initPageInfo();

    const formatDataForExport = (allData) => {
      _.each(allData, (item) => {
        //item.ledColorCssClass = item.shippingQty > 1 || item.pendingAssignQty;
        item.isBuildWiseHotJob = item.isBuildWiseHotJob ? JSON.parse(item.isBuildWiseHotJob) : 0;
        item.isSkipKitCreation = item.isSkipKitCreation ? true : false;
        item.copyRohsIcon = item.rohsIcon;
        item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
        item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
        item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
        item.poRevisionDate = BaseService.getUIFormatedDate(item.poRevisionDate, vm.DefaultDateFormat);
        item.nextShipDate = BaseService.getUIFormatedDate(item.nextShipDate, vm.DefaultDateFormat);
        item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
        item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
        item.workorderDets = item.workorders ? item.workorders.split(',') : [];
        //if (item.refTypePO === vm.HaltResumePopUp.refTypePO) {
        //  if (item.haltStatusPO === vm.HaltResumePopUp.HaltStatus) {
        //    item.salesOrderHaltImage = vm.resumeImagePath;
        //    item.salesOrderHalt = vm.HaltResumePopUp.ResumeSalesOrder;
        //  } else {
        //    item.salesOrderHaltImage = vm.haltImagePath;
        //    item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
        //  }
        //}
        //if (item.refTypePO === null) {
        //  item.salesOrderHaltImage = vm.haltImagePath;
        //  item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
        //}
        if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < new Date()) {
          item.isPastMaterialDocDate = true;
        }
        item.extPriceDisplayValue = item.extPriceDisplayValue ? parseFloat((item.extPriceDisplayValue).toFixed(5)) : '';
        item.totalextPriceDisplayValue = ((item.totalextPriceDisplayValue) || '');
        //if (item.partCategory !== CORE.PartCategory.SubAssembly) {
        //  item.isHiddenAddWorkOrder = true;
        //}
        //if (parseInt(item.status) !== 1 || item.salesOrderDetStatus !== 1) {
        //  item.isHiddenAddWorkOrder = true;
        //}
        //if (item.salesOrderDetStatus === -1) {
        //  item.isHiddenAddWorkOrder = true;
        //}
      });
    };

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: false, //vm.listType === 0 ? true : false,
      enableFullRowSelection: false,
      enableRowSelection: vm.listType === 0 ? true : false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      CurrentPage: CORE.PAGENAME_CONSTANT[6].PageName,
      exporterCsvFilename: vm.listType === 0 ? 'Sales Order Detail.csv' : 'Pending Customer Packing Slip Creation List.csv',
      rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-salesorder-hotjob-bgcolor\': row.entity.isBuildWiseHotJob }" role="gridcell" ui-grid-cell="">',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return SalesOrderFactory.retrieveSalesOrderList().query(pagingInfoOld).$promise.then((responseSales) => {
          if (responseSales.status === CORE.ApiResponseTypeStatus.SUCCESS && responseSales.data) {
            formatDataForExport(responseSales.data.salesorders);
            return responseSales.data.salesorders;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      },
      hideMultiDeleteButton: true
    };
    // generate filter for sales order list page
    const generateSearchFilter = () => {
      vm.generateFilter = false;

      if (vm.customer.length > 0) {
        vm.pagingInfo.customerID = _.map(vm.customer).join();
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.customerID = null;
      }
      if (vm.shippingMethods.length > 0) {
        vm.pagingInfo.shippingMethodId = _.map(vm.shippingMethods).join();
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.shippingMethodId = null;
      }
      if (vm.partIds && vm.partIds.length > 0) {
        vm.pagingInfo.partIds = _.map(vm.partIds, 'id').join(',');
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.partIds = null;
      }
      if (vm.woIds && vm.woIds.length > 0) {
        vm.pagingInfo.woIds = _.map(vm.woIds, 'woNumber').join(',');
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.woIds = null;
      }
      if (vm.terms && vm.terms.length > 0) {
        vm.pagingInfo.termsIds = _.map(vm.terms).join();
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.termsIds = null;
      }
      if (vm.posoNumber) {
        vm.pagingInfo.posoSearch = vm.posoNumber;
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.posoSearch = null;
      }
      vm.pagingInfo.posoSearchType = vm.checkSerachPOType;
      vm.pagingInfo.searchextPricetype = vm.checkSerachAmountType;
      if (vm.amount) {
        vm.pagingInfo.searchextPricetext = vm.amount;
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.searchextPricetext = null;
      }
      let strFilter = '';
      if (vm.isCheckAll) {
        strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[1].value);
        strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[2].value);
        strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[3].value);
      } else {
        if (vm.pending) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[1].value);
        }
        if (vm.completed) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[2].value);
        }
        if (vm.canceled) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[3].value);
        }
      }
      if (strFilter.length > 0) {
        if (vm.listType === 0) {
          vm.generateFilter = true;
        }
        vm.pagingInfo.filterStatus = strFilter.substring(1);
      } else {
        vm.pagingInfo.filterStatus = '';
      }
      let strpoStatusFilter = '';
      if (vm.isCheckAllStatus) {
        strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.WoStatus[1].value);
        strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.WoStatus[2].value);
      } else {
        if (vm.draft) {
          strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.WoStatus[1].value);
        }
        if (vm.publish) {
          strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.WoStatus[2].value);
        }
      }
      if (strpoStatusFilter.length > 0) {
        if (vm.listType === 0) {
          vm.generateFilter = true;
        }
        vm.pagingInfo.filterPOStatus = strpoStatusFilter.substring(1);
      } else {
        vm.pagingInfo.filterPOStatus = '';
      }
      // selected Date filter
      vm.pagingInfo.selectedDateType = vm.selectedDateType;
      if (vm.fromDate) {
        vm.pagingInfo.pfromDate = BaseService.getAPIFormatedDate(vm.fromDate);
      } else {
        vm.pagingInfo.pfromDate = null;
      }
      if (vm.toDate) {
        vm.pagingInfo.ptoDate = BaseService.getAPIFormatedDate(vm.toDate);
      } else {
        vm.pagingInfo.ptoDate = null;
      }
      vm.pagingInfo.isRushJob = false;
      if (vm.isRushJob) {
        vm.pagingInfo.isRushJob = true;
      }
      vm.pagingInfo.isRmaPO = false;
      if (vm.isRmaPO) {
        vm.pagingInfo.isRmaPO = true;
      }
      vm.pagingInfo.searchComments = vm.searchComments;
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
      }
    };


    const setFilteredLabels = (canReGenerateTootip) => {
      vm.SalesOrderAdvanceFilter.Customer.isDeleted = !(vm.pagingInfo.customerID && vm.pagingInfo.customerID.length > 0);
      vm.SalesOrderAdvanceFilter.ShippingMethod.isDeleted = !(vm.pagingInfo.shippingMethodId && vm.pagingInfo.shippingMethodId.length > 0);
      vm.SalesOrderAdvanceFilter.Parts.isDeleted = !(vm.pagingInfo.partIds && vm.pagingInfo.partIds.length > 0);
      vm.SalesOrderAdvanceFilter.WorkOrder.isDeleted = !(vm.pagingInfo.woIds && vm.pagingInfo.woIds.length > 0);
      vm.SalesOrderAdvanceFilter.Terms.isDeleted = !(vm.pagingInfo.termsIds && vm.pagingInfo.termsIds.length > 0);
      vm.SalesOrderAdvanceFilter.POSO.isDeleted = !(vm.pagingInfo.posoSearch);
      vm.SalesOrderAdvanceFilter.TotalExt.isDeleted = !(vm.pagingInfo.searchextPricetext);
      vm.SalesOrderAdvanceFilter.SOStatus.isDeleted = !(vm.pagingInfo.filterStatus || vm.pagingInfo.filterStatus !== '');
      vm.SalesOrderAdvanceFilter.SOPOSTStatus.isDeleted = !(vm.pagingInfo.filterPOStatus || vm.pagingInfo.filterPOStatus !== '');
      vm.SalesOrderAdvanceFilter.RushJob.isDeleted = !(vm.pagingInfo.isRushJob);
      vm.SalesOrderAdvanceFilter.RmaPO.isDeleted = !(vm.pagingInfo.isRmaPO);
      vm.SalesOrderAdvanceFilter.Comments.isDeleted = !(vm.pagingInfo.searchComments);
      if (vm.pagingInfo.pfromDate || vm.pagingInfo.ptoDate) {
        vm.SalesOrderAdvanceFilter.PODate.isDeleted = !(vm.selectedDateType === vm.salesOrderDateFilterList[0].key);
        vm.SalesOrderAdvanceFilter.SODate.isDeleted = !(vm.selectedDateType === vm.salesOrderDateFilterList[1].key);
        vm.SalesOrderAdvanceFilter.PORevDate.isDeleted = !(vm.selectedDateType === vm.salesOrderDateFilterList[2].key);
      } else {
        vm.SalesOrderAdvanceFilter.PORevDate.isDeleted = true;
        vm.SalesOrderAdvanceFilter.PODate.isDeleted = true;
        vm.SalesOrderAdvanceFilter.SODate.isDeleted = true;
      }
      if (canReGenerateTootip) {
        const fromDateFormatted = vm.pagingInfo.pfromDate ? $filter('date')(new Date(vm.pagingInfo.pfromDate), vm.DefaultDateFormat) : null;
        const toDateFormatted = vm.pagingInfo.ptoDate ? $filter('date')(new Date(vm.pagingInfo.ptoDate), vm.DefaultDateFormat) : null;

        vm.SalesOrderAdvanceFilter.Customer.tooltip = getFilterTooltip(vm.customerListToDisplay, vm.customer, 'id', 'mfgName');
        vm.SalesOrderAdvanceFilter.ShippingMethod.tooltip = getFilterTooltip(vm.shippingListToDisplay, vm.shippingMethods, 'gencCategoryID', 'gencCategoryDisplayName');
        vm.SalesOrderAdvanceFilter.Terms.tooltip = getFilterTooltip(vm.termsListToDisplay, vm.terms, 'gencCategoryID', 'gencCategoryDisplayName');

        let statusText = '';
        if (vm.pagingInfo.filterStatus && vm.pagingInfo.filterStatus.length > 0) {
          if (vm.pending || vm.isCheckAll) {
            statusText = vm.CompelteStatus[1].value;
          }
          if (vm.completed || vm.isCheckAll) {
            statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CompelteStatus[2].value);
          }
          if (vm.canceled || vm.isCheckAll) {
            statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CompelteStatus[3].value);
          }
        }
        vm.SalesOrderAdvanceFilter.SOStatus.tooltip = angular.copy(statusText);

        statusText = '';
        if (vm.pagingInfo.filterPOStatus && vm.pagingInfo.filterPOStatus.length > 0) {
          if (vm.draft || vm.isCheckAllStatus) {
            statusText = vm.WoStatus[1].value;
          }
          if (vm.publish || vm.isCheckAllStatus) {
            statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.WoStatus[2].value);
          }
        }
        vm.SalesOrderAdvanceFilter.SOPOSTStatus.tooltip = angular.copy(statusText);
        const selectedDateTypeText = _.find(vm.salesOrderDateFilterList, (item) => item.key === vm.selectedDateType).value;
        if (vm.selectedDateType === 'PO') {
          vm.SalesOrderAdvanceFilter.PODate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
          vm.SalesOrderAdvanceFilter.PODate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.SalesOrderAdvanceFilter.PODate.tooltip, ' To: ', toDateFormatted) : '';
        } else if (vm.selectedDateType === 'SO') {
          vm.SalesOrderAdvanceFilter.SODate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
          vm.SalesOrderAdvanceFilter.SODate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.SalesOrderAdvanceFilter.SODate.tooltip, ' To: ', toDateFormatted) : '';
        } else if (vm.selectedDateType === 'PR') {
          vm.SalesOrderAdvanceFilter.PORevDate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
          vm.SalesOrderAdvanceFilter.PORevDate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.SalesOrderAdvanceFilter.PORevDate.tooltip, ' To: ', toDateFormatted) : '';
        }
      }
      vm.SalesOrderAdvanceFilter.POSO.tooltip = vm.pagingInfo.posoSearch;
      vm.SalesOrderAdvanceFilter.TotalExt.tooltip = vm.pagingInfo.searchextPricetext;

      vm.SalesOrderAdvanceFilter.RushJob.tooltip = vm.pagingInfo.isRushJob ? 'Rush Job' : '';
      vm.SalesOrderAdvanceFilter.RmaPO.tooltip = vm.pagingInfo.isRmaPO ? 'RMA PO' : '';
      vm.SalesOrderAdvanceFilter.Comments.tooltip = vm.pagingInfo.searchComments;

      vm.numberOfMasterFiltersApplied = _.filter(vm.SalesOrderAdvanceFilter, (num) => num.isDeleted === false).length;
    };
    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
      removeSocketListener();
    });



    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (salesorder, isGetDataDown) => {
      if (salesorder && salesorder.data && salesorder.data.salesorders) {
        vm.isAllFilterClear = false;
        if (!isGetDataDown) {
          vm.sourceData = salesorder.data.salesorders;
          vm.currentdata = vm.sourceData.length;
        }
        else if (salesorder.data.salesorders.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(salesorder.data.salesorders);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = salesorder.data.Count;

        _.each(vm.sourceData, (item) => {
          item.ledColorCssClass = item.shippingQty > 1 || item.pendingAssignQty;
          item.isBuildWiseHotJob = item.isBuildWiseHotJob ? JSON.parse(item.isBuildWiseHotJob) : 0;
          item.isSkipKitCreation = item.isSkipKitCreation ? true : false;
          item.copyRohsIcon = item.rohsIcon;
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
          item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
          item.poRevisionDate = BaseService.getUIFormatedDate(item.poRevisionDate, vm.DefaultDateFormat);
          item.nextShipDate = BaseService.getUIFormatedDate(item.nextShipDate, vm.DefaultDateFormat);
          item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
          item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
          item.isDisabledAddInvoice = item.salesOrderDetailId ? false : true;
          const releasedWorkorderDets = item.releasedWorkorderNmberAndId ? item.releasedWorkorderNmberAndId.split(',') : [];
          item.releasedWorkorderDetIds = _.map(releasedWorkorderDets, (data) => data.split('###')[0].trim()).join(',');
          item.releasedWorkorderDets = _.map(releasedWorkorderDets, (data) => data.split('###')[1]);
          item.workorderDets = item.workorders ? item.workorders.split(',') : [];
          if ((parseInt(item.status) !== CORE.WOSTATUS.DRAFT && parseInt(item.status) !== CORE.WOSTATUS.PUBLISHED) || item.assignBlanketPOQty) {
            item.isDisabledDelete = true;
            item.isRowSelectable = false;
          }
          if (item.wosalesOrderDetail || item.salesOrderDetStatusConvertedValues === vm.SOWorkingStatus.Canceled || item.salesOrderDetStatusConvertedValues === vm.SOWorkingStatus.Completed) {
            item.isDisabledCancle = true;
          }
          if (vm.listType === 1) {
            item.isDisabledDelete = true;
            item.promisedShipDate = BaseService.getUIFormatedDate(item.promisedShipDate, vm.DefaultDateFormat);
          } else {
            item.isPrintDisable = false;
            item.isDownloadDisabled = false;
          }
          if (!item.salesOrderDetailId) {
            item.disableAssyAtGlance = true;
            item.isDisabledCheckKitFeasibility = true;
            item.isDisabledKitRelease = true;
            item.isDisabledHaltResumeSalesOrder = true;
            item.isDisabledHaltResumeHistory = true;
          }
          if (item.partType === vm.partType) {
            item.isDisabledHaltResumeSalesOrder = true;
          }
          if (item.isSkipKitCreation) {
            item.disableAssyAtGlance = /*item.isDisabledCheckKitFeasibility =*/ item.isDisabledKitRelease = item.isDisableUsageMaterialReport = true;
          }

          if (item.refTypePO === vm.HaltResumePopUp.refTypePO) {
            if (item.haltStatusPO === vm.HaltResumePopUp.HaltStatus) {
              item.salesOrderHaltImage = vm.resumeImagePath;
              item.salesOrderHalt = vm.HaltResumePopUp.ResumeSalesOrder;
            } else {
              item.salesOrderHaltImage = vm.haltImagePath;
              item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
            }
          }
          if (item.refTypePO === null) {
            item.salesOrderHaltImage = vm.haltImagePath;
            item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
          }
          if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < new Date()) {
            item.isPastMaterialDocDate = true;
          }
          if (item.blanketPOEndDate && item.openBlanketPOQty && new Date(item.blanketPOEndDate) < new Date()) {
            item.isBlanketPOEndDate = true;
          }
          item.extPriceDisplayValue = item.extPriceDisplayValue ? parseFloat((item.extPriceDisplayValue).toFixed(5)) : '';
          item.totalextPriceDisplayValue = ((item.totalextPriceDisplayValue) || '');
          if (item.internalPO === 0 || item.salesOrderDetStatus === 2 || item.salesOrderDetStatus === -1) {
            item.isDisableManualStatusChange = true;
          } else {
            item.isDisableManualStatusChange = false;
          }
          if (item.isBlanketPO && item.salesOrderDetStatus !== 2 && item.salesOrderDetStatus !== -1) {
            item.isDisableManualStatusChange = false;
          }
          if (item.partCategory !== CORE.PartCategory.SubAssembly) {
            item.isHiddenAddWorkOrder = true;
          }
          if (parseInt(item.status) !== 1 || item.salesOrderDetStatus !== 1) {
            item.isHiddenAddWorkOrder = true;
          }
          if (item.salesOrderDetStatus === -1) {
            item.isHiddenAddWorkOrder = true;
          }
        });
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.generateFilter) {
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
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
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

    /* retrieve sales order detail list*/
    vm.loadData = () => {
      //vm.pagingInfo.Page = 1;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.pagingInfo.SortColumns.length === 0) {
        if (vm.listType === 1) {
          vm.pagingInfo.SortColumns = [['promisedShipDate', 'ASC']];
        } else {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
      }
      // Added custome filter for salesorder status
      //filterStatus();
      generateSearchFilter();
      setFilteredLabels(true);
      vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((salesorder) => {
        vm.sourceData = [];
        if (salesorder && salesorder.data) {
          setDataAfterGetAPICall(salesorder, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((salesorder) => {
        if (salesorder && salesorder.data && salesorder.data.salesorders) {
          setDataAfterGetAPICall(salesorder, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.selectedWorkorder = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.fab = {
      Status: false
    };

    vm.AddSalesOrderButtonObj = {
      buttonText: 'Add Sales Order',
      buttonRoute: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE,
      buttonParams: { sID: 0 }
    };

    //vm.addRecord = () => {
    //  $state.go(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, { sID: 0 });
    //};

    vm.updateRecord = (row) => {
      BaseService.goToManageSalesOrder(row.entity.id);
      return false;
    };

    /* delete salesorder*/
    //vm.deleteRecord = (salesorder) => {
    //  let selectedIDs = [];
    //  let refSalesOrderIDs = [];
    //  let selectedDetail = [];
    //  if (salesorder) {
    //    if (salesorder.salesOrderDetailId) {
    //      selectedIDs.push(salesorder.salesOrderDetailId);
    //    }
    //    selectedDetail.push(salesorder);
    //    refSalesOrderIDs.push(salesorder.id);
    //  } else {
    //    vm.selectedRows = vm.selectedRowsList;
    //    selectedDetail = vm.selectedRows;
    //    if (vm.selectedRows.length > 0) {
    //      selectedIDs = (_.filter(vm.selectedRows, (detID) => detID.salesOrderDetailId)).map((item) => item.salesOrderDetailId);
    //      refSalesOrderIDs = vm.selectedRows.map((item) => item.id);
    //    }
    //  }

    //  if (selectedIDs || refSalesOrderIDs) {
    //    const assyList = _.filter(selectedDetail, (det) => det.initialStockCount > 0);
    //    if (assyList && assyList.length > 0) {
    //      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_DETAIL_NOT_DELETED_INITIAL_STOCK_CREATED);
    //      messageContent.message = stringFormat(messageContent.message, _.map(assyList, (det) => det.salesOrderNumber + ' | ' + det.PIDCode + ' | ' + det.lineID).join(', '));
    //      const model = {
    //        messageContent: messageContent,
    //        multiple: true
    //      };
    //      DialogFactory.messageAlertDialog(model);
    //      return;
    //    }
    //    checkValidationForDeleteRecord(selectedIDs).then((cellresponse) => {
    //      if (cellresponse) {
    //        if ((_.some(vm.salesDetStatus, (data) => data.vQtyRelease) || _.some(vm.salesDetStatus, (data) => data.vQtyWprkorder)) || (_.some(vm.salesShippedStatus, (data) => data.shippedqty))) {
    //          const pidArray = [];

    //          const listReleaseQty = _.filter(vm.salesDetStatus, (data) => data.vQtyRelease);
    //          if (listReleaseQty.length > 0) {
    //            _.each(listReleaseQty, (data) => {
    //              const obj = _.find(vm.sourceData, (item) => item.salesOrderDetailId === data.vSalesOrderDetailIdOfRelease);
    //              if (obj) {
    //                pidArray.push(obj.PIDCode);
    //              }
    //            });
    //          }

    //          const listWOQty = _.filter(vm.salesDetStatus, (data) => data.vQtyWprkorder);
    //          if (listWOQty.length > 0) {
    //            _.each(listWOQty, (data) => {
    //              const obj = _.find(vm.sourceData, (item) => item.salesOrderDetailId === data.vSalesOrderDetailIdOfWO);
    //              if (obj) {
    //                pidArray.push(obj.PIDCode);
    //              }
    //            });
    //          }

    //          const listCustPSQty = _.filter(vm.salesShippedStatus, (data) => data.shippedqty);
    //          if (listCustPSQty.length > 0) {
    //            _.each(listCustPSQty, (data) => {
    //              const obj = _.find(vm.sourceData, (item) => item.salesOrderDetailId === data.vSalesOrderDetailIdOfCustPS);
    //              if (obj) {
    //                pidArray.push(obj.PIDCode);
    //              }
    //            });
    //          }

    //          const pidString = _.uniq(pidArray).join(', ');

    //          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INFORMATION_DELETE_SALES_ORDER_DETAIL);
    //          messageContent.message = stringFormat(messageContent.message, pidString);
    //          const model = {
    //            multiple: true,
    //            messageContent: messageContent
    //          };
    //          return DialogFactory.messageAlertDialog(model);
    //        }
    //      } else {
    //        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CONFIRMATION_DELETE_SALES_ORDER_DETAIL);
    //        messageContent.message = stringFormat(messageContent.message, 'Sales order', (selectedIDs.length + (refSalesOrderIDs.length - selectedIDs.length)));
    //        const obj = {
    //          messageContent: messageContent,
    //          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
    //          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
    //        };
    //        const objIDs = {
    //          id: selectedIDs,
    //          salesOrderID: refSalesOrderIDs,
    //          CountList: false
    //        };
    //        DialogFactory.messageConfirmDialog(obj).then((yes) => {
    //          if (yes) {
    //            vm.cgBusyLoading = SalesOrderFactory.deleteSalesOrder().query({ objIDs: objIDs }).$promise.then((data) => {
    //              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
    //                const datas = {
    //                  TotalCount: data.data.transactionDetails[0].TotalCount,
    //                  pageName: CORE.PageName.sales_order
    //                };
    //                BaseService.deleteAlertMessageWithHistory(datas, (ev) => {
    //                  const IDs = {
    //                    id: selectedIDs,
    //                    salesOrderID: refSalesOrderIDs,
    //                    CountList: true
    //                  };
    //                  return SalesOrderFactory.deleteSalesOrder().query({
    //                    objIDs: IDs
    //                  }).$promise.then((res) => {
    //                    let data = {};
    //                    data = res.data;
    //                    data.pageTitle = salesorder ? salesorder.salesOrderNumber : null;
    //                    data.PageName = CORE.PageName.sales_order;
    //                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length + (refSalesOrderIDs.length - selectedIDs.length), ' Selected');
    //                    data.id = selectedIDs;
    //                    if (res.data) {
    //                      DialogFactory.dialogService(
    //                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
    //                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
    //                        ev,
    //                        data).then(() => {
    //                        }, () => {
    //                        });
    //                    }
    //                  }).catch((error) => BaseService.getErrorLog(error));
    //                });
    //              } else {
    //                vm.loadData();
    //              }
    //            }).catch((error) => BaseService.getErrorLog(error));
    //          }
    //        }, () => {
    //        }).catch((error) => BaseService.getErrorLog(error));
    //      }
    //    });
    //  }
    //  else {
    //    //show validation message no data selected
    //    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE_LABEL);
    //    messageContent.message = stringFormat(messageContent.message, 'Sales order');
    //    const obj = {
    //      multiple: true,
    //      messageContent: messageContent
    //    };
    //    DialogFactory.messageAlertDialog(obj);
    //  }
    //};

    //* delete multiple data called from directive of ui-grid*/
    //vm.deleteMultipleData = () => {
    //  vm.deleteRecord();
    //};

    //const checkValidationForDeleteRecord = (ids) => SalesOrderFactory.retrieveSalesOrderDetailStatus().query({ id: ids }).$promise.then((salesDet) => {
    //  if (salesDet && salesDet.data) {
    //    vm.salesDetStatus = salesDet.data.soReleaseStatus;
    //    vm.salesShippedStatus = salesDet.data.soShipStatus;
    //    if ((_.some(vm.salesDetStatus, (data) => data.vQtyRelease) || _.some(vm.salesDetStatus, (data) => data.vQtyWprkorder)) || (_.some(vm.salesShippedStatus, (data) => data.shippedqty))) {
    //      return true;
    //    } else {
    //      return false;
    //    }
    //  }
    //}).catch((error) => BaseService.getErrorLog(error));

    //open sales order change history popup
    vm.opensalesorderChangesHistoryAuditLog = (row, $event) => {
      var data = {
        Tablename: 'SALESORDERMST',
        RefTransID: row.entity.id
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_VIEW,
        $event,
        data).then(() => {

        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.isCancleReason = (row, $event) => {
      if (!row.entity.isCancle) {
        if (row.entity.blanketPOOption === TRANSACTION.BLANKETPOOPTIONDET.LINKBLANKETPO) {
          vm.getusedBlanketPODetails(row.entity.salesOrderDetailId).then(() => {
            if (vm.soBlanketPOlist.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BLANKET_PO_CANCEL_ALERT);
              messageContent.message = stringFormat(messageContent.message, row.entity.poNumber, _.map(_.uniqBy(vm.soBlanketPOlist, 'poNumber'), 'poNumber').join(', '));
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              return DialogFactory.messageAlertDialog(model);
            } else {
              commonBlanketPOCheck(row, $event);
            }
          });
        } else {
          commonBlanketPOCheck(row, $event);
        }
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.UNDO_CANCELLATION_SO_DETAIL);
        messageContent.message = stringFormat(messageContent.message, row.entity.custPOLineNumber || 1, row.entity.salesOrderNumber);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const data = {
              poID: row.entity.salesOrderDetailId,
              title: vm.LabelConstant.PURCHASE_ORDER.POUndoReason,
              isPurchaseOrder: true,
              poNumber: row.entity.salesOrderNumber,
              type: 'R', //for Undo cancellation so,
              refSalesOrderID: row.entity.id,
              completedStatus: row.entity.completedStatus || null
            };
            openCancellationReasonPopup(data, $event);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // common check option for blanket PO
    const commonBlanketPOCheck = (row, $event) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CANCLE_REASON_CONTROLLER,
        TRANSACTION.TRANSACTION_CANCLE_REASON_VIEW,
        $event,
        row.entity).then(() => {
          vm.loadData();
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    const openCancellationReasonPopup = (data, $event) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CANCLE_REASON_CONTROLLER,
        TRANSACTION.TRANSACTION_CANCLE_REASON_VIEW,
        $event,
        data).then((response) => {
          if (response) {
            const formField = {
              id: response.poID,
              refSalesOrderID: data.refSalesOrderID,
              cancleReason: response.cancleReason,
              isCancle: false,
              completedStatus: data.completedStatus
            };
            vm.cgBusyLoading = SalesOrderFactory.salsorderCancleReason().query(formField).$promise.then((res) => {
              if (res && res.data) { vm.loadData(); }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    vm.woStatusIds = [];

    vm.openkitRelease = (row) => {
      BaseService.goToKitList(row.entity.salesOrderDetailId, 0, null);
    };

    vm.openkitAllocation = (row) => {
      BaseService.goToKitList(row.entity.salesOrderDetailId, 0, null);
    };

    //purchase plann for sales order issue
    vm.goToPlannPurchase = (row, event) => {
      var data = {
        salesOrderDetailId: row.entity.salesOrderDetailId,
        qty: row.entity.qty,
        partID: row.entity.partID,
        poNumber: row.entity.poNumber,
        salesOrderNumber: row.entity.salesOrderNumber,
        rohsIcon: row.entity.rohsIcon,
        rohsComplientConvertedValue: row.entity.rohsComplientConvertedValue,
        mfgPN: row.entity.mfgPN,
        PIDCode: row.entity.PIDCode,
        PODate: row.entity.poDate,
        kitQty: row.entity.kitQty,
        soId: row.entity.id,
        version: row.entity.revision,
        blanketPOOption: row.entity.blanketPOOption
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_CONTROLLER,
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_VIEW,
        event,
        data).then(() => {
        }, (data) => {
          if (data && row && row.entity) {
            updateOneRowOfGrid(row.entity.salesOrderDetailId);
          }
        }, (err) => BaseService.getErrorLog(err));
    };



    /*Assembly at glance*/
    vm.getAssyAtGlance = (row, ev) => {
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        ev,
        row).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };


    /* kit Feasibility pop-up */

    vm.checkKitFeasibility = (row, ev) => {
      const salesOrderDetails = {
        poNumber: row.entity.poNumber,
        soNumber: row.entity.salesOrderNumber,
        SubAssy: row.entity.PIDCode,
        assyPIDCode: row.entity.PIDCode,
        assyName: row.entity.mfgPN,
        rohsIcon: row.entity.copyRohsIcon,
        nickName: row.entity.nickName,
        rohs: row.entity.rohsComplientConvertedValue,
        kitQty: row.entity.kitQty,
        poQty: row.entity.qty,
        soQty: row.entity.mrpQty,
        soId: row.entity.id,
        partId: row.entity.partID,
        SalesOrderDetailId: row.entity.salesOrderDetailId
      };
      const feasibilityDetail = {
        refSalesOrderDetID: row.entity.salesOrderDetailId,
        assyID: parseInt(row.entity.partID || 0),
        isConsolidated: false,
        inputQty: 0,
        salesOrderDetail: salesOrderDetails
      };

      DialogFactory.dialogService(
        TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
        ev,
        feasibilityDetail).then(() => {
        }, () => {

        }, (err) => BaseService.getErrorLog(err));
    };

    /* ki release po-up*/
    vm.kitRelease = (row, ev) => {
      const assyID = parseInt(row.entity.partID || 0);
      const salesOrderDetails = {
        poNumber: row.entity.poNumber,
        soNumber: row.entity.salesOrderNumber,
        SubAssy: row.entity.PIDCode,
        assyPIDCode: row.entity.PIDCode,
        assyName: row.entity.mfgPN,
        rohsIcon: row.entity.copyRohsIcon,
        nickName: row.entity.nickName,
        rohs: row.entity.rohsComplientConvertedValue,
        kitQty: row.entity.kitQty,
        poQty: row.entity.qty,
        soQty: row.entity.mrpQty,
        soId: row.entity.id,
        partId: row.entity.partID,
        SalesOrderDetailId: row.entity.salesOrderDetailId
      };
      var kitDetail = {
        salesOrderDetail: salesOrderDetails,
        refSalesOrderDetID: salesOrderDetails.SalesOrderDetailId,
        assyID: (assyID || salesOrderDetails.partId),
        isConsolidated: true
      };

      DialogFactory.dialogService(
        TRANSACTION.KIT_RELEASE_POPUP_CONTROLLER,
        TRANSACTION.KIT_RELEASE_POPUP_VIEW,
        ev,
        kitDetail).then(() => {

        }, (data) => {
          if (data && row && row.entity) {
            updateOneRowOfGrid(row.entity.salesOrderDetailId);
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.haltResumeHistoryList = (row, $event) => {
      const rowData = row.entity;
      const data = {
        refTransId: rowData.salesOrderDetailId,
        poNumber: rowData.poNumber,
        soNumber: rowData.salesOrderNumber,
        assyName: rowData.PIDCode,
        rohsIcon: rowData.copyRohsIcon,
        rohs: rowData.rohsComplientConvertedValue,
        soId: rowData.id,
        assyID: rowData.partID
      };
      DialogFactory.dialogService(
        CORE.HALT_RESUME_HISTORY_CONTROLLER,
        CORE.HALT_RESUME_HISTORY_VIEW,
        $event,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    vm.haltResumeSalesOrder = (row, ev) => {
      const rowData = row.entity;
      if (rowData) {
        const haltResumeObj = {
          salesOrderid: rowData.id,
          refTransId: rowData.salesOrderDetailId,
          isHalt: rowData.haltStatusPO ? (rowData.haltStatusPO === vm.HaltResumePopUp.HaltStatus ? false : true) : true,
          module: vm.HaltResumePopUp.refTypePO,
          refType: vm.HaltResumePopUp.refTypePO,
          poNumber: rowData.poNumber,
          soNumber: rowData.salesOrderNumber,
          assyName: rowData.PIDCode,
          rohsIcon: rowData.copyRohsIcon,
          rohs: rowData.rohsComplientConvertedValue,
          soId: rowData.id,
          assyID: rowData.partID
        };
        DialogFactory.dialogService(
          CORE.HALT_RESUME_CONTROLLER,
          CORE.HALT_RESUME_VIEW,
          ev,
          haltResumeObj).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    /* go to po status report for selected sales order assembly */
    vm.openPOStatusReport = (rowData) => {
      if (rowData.partID && rowData.salesOrderDetailId && rowData.soCompletionPercentage) {
        BaseService.goToPOStatusAssemblyReport(rowData.customerID, rowData.salesOrderDetailId, rowData.partID);
      }
    };
    const updateOneRowOfGrid = (salesOrderDetailId) => {
      if (salesOrderDetailId) {
        vm.pagingInfo.SalesOrderDetailId = salesOrderDetailId;
        vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((salesorder) => {
          vm.pagingInfo.SalesOrderDetailId = null;
          if (salesorder && salesorder.data) {
            vm.unPlannedCount = salesorder.data.UnPlannedCount;
            _.each(salesorder.data.salesorders, (item) => {
              item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
              if (parseInt(item.status) !== CORE.WOSTATUS.DRAFT) {
                item.isDisabledDelete = true;
                item.isRowSelectable = false;
              }
              if (item.wosalesOrderDetail) {
                item.isDisabledCancle = true;
              }
              if (item.refTypePO === vm.HaltResumePopUp.refTypePO) {
                if (item.haltStatusPO === vm.HaltResumePopUp.HaltStatus) {
                  item.salesOrderHaltImage = vm.resumeImagePath;
                  item.salesOrderHalt = vm.HaltResumePopUp.ResumeSalesOrder;
                } else {
                  item.salesOrderHaltImage = vm.haltImagePath;
                  item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
                }
              }
              if (item.refTypePO === null) {
                item.salesOrderHaltImage = vm.haltImagePath;
                item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
              }
              if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < vm.currentDate) {
                item.isPastMaterialDocDate = true;
              }
            });

            if (salesorder.data.salesorders && salesorder.data.salesorders.length > 0) {
              _.map(vm.gridOptions.data, (data, $index) => {
                if (data.salesOrderDetailId === salesorder.data.salesorders[0].salesOrderDetailId) {
                  vm.sourceData.splice($index, 1);
                  vm.sourceData.splice($index, 0, salesorder.data.salesorders[0]);
                }
              });
            } else {
              const index = _.findIndex(vm.gridOptions.data, (data) => data.salesOrderDetailId === rowData.salesOrderDetailId);
              if (index !== -1) {
                vm.sourceData.splice(index, 1);
              }
            }
            $timeout(() => {
              vm.resetSourceGrid();
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.updateOneRecord = (responseData) => {
      if (responseData.refTransId) {
        updateOneRowOfGrid(responseData.refTransId);
      }
    };
    function socketListener(responseData) { $timeout(() => { vm.updateOneRecord(responseData); }); }
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, socketListener);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, socketListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
    }
    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    // Usage Material Reprot- Open filter pop up
    vm.usageMaterialReport = (row, ev) => {
      const data = {
        soId: row.id,
        soDtlID: row.salesOrderDetailId,
        soNumber: row.salesOrderNumber,
        poNumber: row.poNumber,
        fromGenerated: CORE.UsageReportGeneratedFrom.SO, //generated from required at SP level
        PIDCode: row.PIDCode,
        rohsIcon: row.rohsIcon,
        rohsName: row.rohsComplientConvertedValue,
        partID: row.partID
      };
      DialogFactory.dialogService(
        WORKORDER.USAGE_MATERIAL_REPORT_POPUP_CONTROLLER,
        WORKORDER.USAGE_MATERIAL_REPORT_POPUP_VIEW,
        ev,
        data).then(() => {
        }, (() => {
        }), (error) => BaseService.getErrorLog(error));
    };
    //view assy details
    vm.ViewAssemblyStockStatus = (row, event) => {
      const data = row.entity;
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    //go to workorder page
    vm.gotoWorkOrder = (index, workOrderIds) => {
      if (workOrderIds) {
        const rowDetails = workOrderIds.split(',');
        if (rowDetails.length > 0) {
          BaseService.goToWorkorderDetails(rowDetails[index]);
        }
      }
    };
    vm.addCustomerPackingSlip = (row) => {
      BaseService.goToManageCustomerPackingSlip(0, row.entity.id);
    };
    // show so level shipping comments
    vm.showSOLevelDescriptionPopUp = (object, ev) => {
      const description = object && object.shippingComment ? angular.copy(object.shippingComment).replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: object.salesOrderNumber,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSalesOrderList();
          },
          valueLinkFn: () => {
            BaseService.goToManageSalesOrder(object.id);
          }
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.ShippingComments,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    // show so line level shipping comments
    vm.showLineLevelDescriptionPopUp = (object, ev) => {
      const description = object && object.remark ? angular.copy(object.remark).replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: object.salesOrderNumber,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSalesOrderList();
          },
          valueLinkFn: () => {
            BaseService.goToManageSalesOrder(object.id);
          }
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.ShippingCommentsLine,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    // show so level internal comments
    vm.showSOLevelNotesDescriptionPopUp = (object, ev) => {
      const description = object && object.internalCommentSo ? angular.copy(object.internalCommentSo).replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: object.salesOrderNumber,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSalesOrderList();
          },
          valueLinkFn: () => {
            BaseService.goToManageSalesOrder(object.id);
          }
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.InternalNotes,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    // show comments
    vm.showReleaseLevelComment = (object, ev) => {
      const description = object && object.releaseLevelComment ? angular.copy(object.releaseLevelComment).replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: object.salesOrderNumber,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSalesOrderList();
          },
          valueLinkFn: () => {
            BaseService.goToManageSalesOrder(object.id);
          }
        }];
      const obj = {
        title: 'Comments',
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    //show so line level internal comments
    vm.showLineLevelNotesDescriptionPopUp = (object, ev) => {
      const description = object && object.internalComment ? angular.copy(object.internalComment).replace(/\r/g, '<br/>') : null;
      const headerData = [
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: object.salesOrderNumber,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSalesOrderList();
          },
          valueLinkFn: () => {
            BaseService.goToManageSalesOrder(object.id);
          }
        }];
      const obj = {
        title: vm.LabelConstant.SalesOrder.InternalNotesLine,
        description: description,
        headerData: headerData
      };
      openCommonDescriptionPopup(ev, obj);
    };
    const openCommonDescriptionPopup = (ev, data) => {
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    //change SO status to completed for Internal PO
    vm.manualStatusChange = (row, ev) => {
      const data = angular.copy(row.entity);
      if (data.status === CORE.WOSTATUS.DRAFT.toString()) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.BEFORE_COMPLETE_PUBLISH_SO);
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      } else {
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_MANUAL_CHANGE_STATUS_REASON_CONTROLLER,
          TRANSACTION.TRANSACTION_MANUAL_CHANGE_STATUS_REASON_VIEW,
          ev,
          data).then(() => { // Success Section
            vm.loadData();
          }, () => { // Cancel Section
          });
      }
    };

    vm.goToManageSalesOrder = (id) => {
      if (id) {
        BaseService.goToManageSalesOrder(id);
      }
    };

    vm.goToCustomer = (id) => {
      if (id) {
        BaseService.goToCustomer(id);
      }
    };

    vm.goToGenericCategoryManageTerms = (id) => {
      if (id) {
        BaseService.goToGenericCategoryManageTerms(id);
      }
    };

    vm.goToManageGenericCategoryShippingType = (id) => {
      if (id) {
        BaseService.goToManageGenericCategoryShippingType(id);
      }
    };
    //print sales order report
    vm.printRecord = (row, isDownload) => {
      let dataKeyvalue;
      _.each(vm.dataKey, (item) => {
        if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
          return dataKeyvalue = item.values;
        }
      });
      if (!row.entity.salesOrderDetailId) {
        const obj = {
          multiple: true,
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_REPORT_GENERATE)
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      } else {
        const salesOrderReportDetails = {
          id: row.entity.id,
          termsAndCondition: dataKeyvalue,
          SOData: {
            salesOrderNumber: row.entity.salesOrderNumber,
            revision: row.entity.revision,
            mfgCode: row.entity.mfgCode,
            statusName: !vm.listType && row.entity.statusConvertedValue === vm.DisplayStatus.Draft.Value ? `-${row.entity.statusConvertedValue.toUpperCase()}` : ''
          }
        };
        if (!vm.listType) {
          if (isDownload) {
            row.entity.isDownloadDisabled = true;
          } else {
            row.entity.isPrintDisable = true;
          }
        }
        SalesOrderFactory.salesOrderReport(salesOrderReportDetails).then((response) => {
          const SOData = response.config.data.SOData;
          if (!vm.listType) {
            if (isDownload) {
              row.entity.isDownloadDisabled = false;
            } else {
              row.entity.isPrintDisable = false;
            }
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.SALES_ORDER, SOData.salesOrderNumber, SOData.revision, SOData.mfgCode, SOData.statusName), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.addWorkOrder = (row, event) => {
      const pageRightsAccessDet = {
        popupAccessRoutingState: [WORKORDER.MANAGE_WORKORDER_DETAILS_STATE],
        pageNameAccessLabel: CORE.PageName.Workorder
      };
      if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
        let data = {};
        if (row && row.entity) {
          data = {
            customerID: row.entity.customerID ? row.entity.customerID : null,
            subAssy: {
              id: row.entity.PIDCode ? row.entity.partID : null
            },
            salesOrderDetailId: row.entity.salesOrderDetailId ? row.entity.salesOrderDetailId : null,
            isFromList: 1
          };
        }
        DialogFactory.dialogService(
          WORKORDER.ADD_WORKORDER_CONTROLLER,
          WORKORDER.ADD_WORKORDER_VIEW,
          event,
          data).then(() => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData),
            (error) => BaseService.getErrorLog(error));
      }
    };

    // download print
    vm.onDownload = (row) => vm.printRecord(row, true);
    // get customer list
    vm.getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      // Added by Vaibhav - For display company name with customer code
      if (customer && customer.data) {
        _.each(customer.data, (item) => {
          item.mfgactualName = item.mfgName;
          item.mfgName = item.mfgCodeName;
        });
        vm.CustomerList = vm.customerListToDisplay = customer.data;
        return vm.CustomerList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //clear customer filter
    vm.clearCustomerFilter = () => {
      vm.customer = [];
    };

    //clear customer search text
    vm.clearCustomerSearchText = () => {
      vm.CustomerSearchText = undefined;
      vm.searchCustomerList();
    };

    //search customer list
    vm.searchCustomerList = () => {
      const customerListToFilter = angular.copy(vm.CustomerList);
      vm.customerListToDisplay = vm.CustomerSearchText ? _.filter(customerListToFilter, (item) => item.mfgName.toLowerCase().contains(vm.CustomerSearchText.toLowerCase())) : customerListToFilter;
    };
    // go to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    //get shipping list detail
    vm.getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          vm.ShippingTypeList = vm.shippingListToDisplay = shipping.data;
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //clear shipping filter
    vm.clearShippingFilter = () => {
      vm.shippingMethods = [];
    };
    //clear shipping search text
    vm.clearShippingSearchText = () => {
      vm.ShippingSearchText = undefined;
      vm.searchShippingList();
    };
    //search shipping list
    vm.searchShippingList = () => {
      const shippingListToFilter = angular.copy(vm.ShippingTypeList);
      vm.shippingListToDisplay = vm.ShippingSearchText ? _.filter(shippingListToFilter, (item) => item.gencCategoryDisplayName.toLowerCase().contains(vm.ShippingSearchText.toLowerCase())) : shippingListToFilter;
    };
    //go to shipping method
    vm.goToShippingList = () => {
      BaseService.goToGenericCategoryShippingTypeList();
    };
    //get terms list detail
    vm.getTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          _.each(terms.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          vm.TermsList = vm.termsListToDisplay = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //clear terms filter
    vm.clearTermsFilter = () => {
      vm.terms = [];
    };
    //clear terms search text
    vm.clearTermsSearchText = () => {
      vm.TermsSearchText = undefined;
      vm.searchTermsList();
    };
    //search terms list
    vm.searchTermsList = () => {
      const termsListToFilter = angular.copy(vm.TermsList);
      vm.termsListToDisplay = vm.TermsSearchText ? _.filter(termsListToFilter, (item) => item.gencCategoryDisplayName.toLowerCase().contains(vm.TermsSearchText.toLowerCase())) : termsListToFilter;
    };
    //go to terms
    vm.goToTermsList = () => {
      BaseService.goToGenericCategoryTermsList();
    };
    //search component list
    vm.querycomponentSearch = (criteria) => {
      const searchObj = {
        searchString: returnCommonSearch(criteria),
        isFromSalesOrder: true
      };
      return PurchaseOrderFactory.getComponentFilterList().query(searchObj).$promise.then((compresponse) => {
        if (compresponse && compresponse.data) {
          compresponse.data = _.differenceWith(compresponse.data, vm.partIds, (arrValue, othValue) => arrValue.id === othValue.id);
          return compresponse.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //give common search
    const returnCommonSearch = (criteria) => {
      const replacedString = criteria.replace('\\', '\\\\');
      criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
      return criteria.length > 255 ? criteria.substring(0, 255) : criteria;
    };

    //Set from date
    vm.fromDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(true);
    };
    //Set to date
    vm.toDateChanged = () => {
      initDateOption();
      vm.checkDateValidation(false);
    };
    // check date vallidation
    vm.checkDateValidation = (type) => {
      const fromDate = vm.fromDate ? new Date($filter('date')(vm.fromDate, vm.DefaultDateFormat)) : vm.filtersInfo.fromDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromDate.$viewValue, vm.DefaultDateFormat)) : null;
      const toDate = vm.toDate ? new Date($filter('date')(vm.toDate, vm.DefaultDateFormat)) : vm.filtersInfo.toDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toDate.$viewValue, vm.DefaultDateFormat)) : null;
      if (vm.filtersInfo) {
        if (vm.filtersInfo.fromDate && vm.filtersInfo.toDate && fromDate && toDate) {
          if (type && fromDate <= toDate) {
            vm.toDate = toDate;
            vm.filtersInfo.toDate.$setValidity('minvalue', true);
          }
          if (type && fromDate > toDate) {
            vm.fromDate = fromDate;
            vm.filtersInfo.fromDate.$setValidity('maxvalue', false);
          }
          if (!type && fromDate <= toDate) {
            vm.fromDate = fromDate;
            vm.filtersInfo.fromDate.$setValidity('maxvalue', true);
          }
          if (!type && fromDate > toDate) {
            vm.toDate = toDate;
            vm.filtersInfo.toDate.$setValidity('minvalue', false);
          }
        }
      }
    };

    //Set PO from date
    vm.fromPODateChanged = () => {
      initDateOption();
      vm.checkPODateValidation(true);
    };
    //Set PO to date
    vm.toPODateChanged = () => {
      initDateOption();
      vm.checkPODateValidation(false);
    };

    // check date vallidation
    vm.checkPODateValidation = (type) => {
      const fromPODate = vm.fromPODate ? new Date($filter('date')(vm.fromPODate, vm.DefaultDateFormat)) : vm.filtersInfo.fromPODate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromPODate.$viewValue, vm.DefaultDateFormat)) : null;
      const toPODate = vm.toPODate ? new Date($filter('date')(vm.toPODate, vm.DefaultDateFormat)) : vm.filtersInfo.toPODate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toPODate.$viewValue, vm.DefaultDateFormat)) : null;
      if (vm.filtersInfo) {
        if (vm.filtersInfo.fromPODate && vm.filtersInfo.toPODate && fromPODate && toPODate) {
          if (type && fromPODate <= toPODate) {
            vm.toPODate = toPODate;
            vm.filtersInfo.toPODate.$setValidity('minvalue', true);
          }
          if (type && fromPODate > toPODate) {
            vm.fromPODate = fromPODate;
            vm.filtersInfo.fromPODate.$setValidity('maxvalue', false);
          }
          if (!type && fromPODate <= toPODate) {
            vm.fromPODate = fromPODate;
            vm.filtersInfo.fromPODate.$setValidity('maxvalue', true);
          }
          if (!type && fromPODate > toPODate) {
            vm.toPODate = toPODate;
            vm.filtersInfo.toPODate.$setValidity('minvalue', false);
          }
        }
      }
    };

    //search workorder list
    vm.queryworkorderSearch = (criteria) => {
      const searchObj = {
        searchString: returnCommonSearch(criteria),
        customerID: vm.customer.join(',')
      };
      return PurchaseOrderFactory.getWorkOrderFilterList().query(searchObj).$promise.then((woresponse) => {
        if (woresponse && woresponse.data) {
          woresponse.data = _.differenceWith(woresponse.data, vm.woIds, (arrValue, othValue) => arrValue.woNumber === othValue.woNumber);
          return woresponse.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //remove filter
    vm.removeAppliedFilter = (item) => {
      if (item) {
        item.isDeleted = true;
        switch (item.value) {
          case vm.SalesOrderAdvanceFilter.Customer.value:
            vm.clearCustomerFilter();
            break;
          case vm.SalesOrderAdvanceFilter.ShippingMethod.value:
            vm.clearShippingFilter();
            break;
          case vm.SalesOrderAdvanceFilter.Terms.value:
            vm.clearTermsFilter();
            break;
          case vm.SalesOrderAdvanceFilter.SOStatus.value:
            vm.pending = vm.completed = vm.canceled = false;
            if (vm.listType === 1) {
              vm.pending = true;
            }
            break;
          case vm.SalesOrderAdvanceFilter.SOPOSTStatus.value:
            vm.draft = vm.publish = false;
            if (vm.listType === 1) {
              vm.publish = true;
            }
            break;
          case vm.SalesOrderAdvanceFilter.POSO.value:
            vm.posoNumber = null;
            break;
          case vm.SalesOrderAdvanceFilter.TotalExt.value:
            vm.amount = null;
            break;
          case vm.SalesOrderAdvanceFilter.Parts.value:
            vm.partIds = [];
            break;
          case vm.SalesOrderAdvanceFilter.WorkOrder.value:
            vm.woIds = [];
            break;
          case vm.SalesOrderAdvanceFilter.RushJob.value:
            vm.isRushJob = false;
            break;
          case vm.SalesOrderAdvanceFilter.RmaPO.value:
            vm.isRmaPO = false;
            break;
          case vm.SalesOrderAdvanceFilter.PODate.value:
          case vm.SalesOrderAdvanceFilter.SODate.value:
          case vm.SalesOrderAdvanceFilter.PORevDate.value:
            vm.fromDate = vm.toDate = null;
            vm.selectedDateType = vm.salesOrderDateFilterList[0].key;
            vm.resetDateFilter();
            break;
          case vm.SalesOrderAdvanceFilter.Comments.value:
            vm.searchComments = null;
            break;
          case vm.SalesOrderAdvanceFilter.ClearAll.value:
            vm.reset(true);
            break;
        }
        if ((vm.numberOfMasterFiltersApplied - 1) > 0) {
          vm.loadData();
        } else {
          vm.reset(true);
        }
      }
    };

    //reset filter
    vm.reset = (isfromClear) => {
      vm.isfocus = false;
      vm.clearCustomerFilter();
      vm.clearShippingFilter();
      vm.clearTermsFilter();
      vm.clearShippingSearchText();
      vm.clearCustomerSearchText();
      vm.clearTermsSearchText();
      vm.posoNumber = null;
      vm.isCheckAll = false;
      vm.isCheckAllStatus = false;
      vm.amount = null;
      vm.partIds = [];
      vm.woIds = [];
      vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
      vm.checkSerachAmountType = vm.CheckSearchTypeList[1].id;
      vm.generateFilter = false;
      vm.fromDate = vm.toDate = null;
      vm.isRushJob = false;
      vm.isRmaPO = false;
      vm.pending = vm.completed = vm.canceled = false;
      if (vm.listType === 1 || !isfromClear) {
        vm.pending = true;
      }
      vm.draft = vm.publish = false;
      if (vm.listType === 1) {
        vm.publish = true;
      }
      vm.searchComments = null;
      vm.selectedDateType = vm.salesOrderDateFilterList[0].key;
      vm.resetDateFilter();
      setFilteredLabels(true);
      if (vm.gridOptions.gridApi) {
        vm.gridOptions.gridApi.core.clearAllFilters();
      }
      if (!isfromClear) {
        vm.loadData();
      } else {
        vm.isNoDataFound = true;
        vm.emptyState = null;
        vm.isAllFilterClear = true;
      }
      vm.isfocus = true;
    };
    //advance search
    vm.advanceFilterSearch = () => {
      vm.loadData();
    };
    // check status filter
    vm.statusFilter = () => {
      if (vm.pending && vm.completed && vm.canceled) {
        vm.isCheckAll = true;
      } else if (!vm.pending && !vm.completed && !vm.canceled) {
        vm.isCheckAll = true;
      } else {
        vm.isCheckAll = false;
      }
    };
    vm.postingStatusFilter = () => {
      if (vm.draft && vm.publish) {
        vm.isCheckAllStatus = true;
      } else if (!vm.draft && !vm.publish) {
        vm.isCheckAllStatus = true;
      } else {
        vm.isCheckAllStatus = false;
      }
    };
    const autocompleteSOPromise = [vm.getCustomerList(), vm.getShippingList(), vm.getTermsList()];
    vm.cgBusyLoading = $q.all(autocompleteSOPromise).then(() => {

    }).catch((error) => BaseService.getErrorLog(error));

    //Clear grid Column Filter
    vm.clearGridColumnFilter = (item) => {
      if (item) {
        item.filters[0].term = undefined;
        if (!item.isFilterDeregistered) {
          //refresh data grid
          vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
        }
      }
    };

    // open release line popup
    vm.goToReleaseDetail = (row, ev) => {
      const rowDetail = {
        id: row.entity.salesOrderDetailId,
        salesOrderDetStatus: row.entity.salesOrderDetStatus,
        qty: row.entity.qty,
        poDate: row.entity.poDate,
        mfrID: row.entity.mfgcodeID,
        partID: row.entity.partID,
        lineID: row.entity.lineID,
        mfrName: row.entity.manufacturerName,
        mfgPN: row.entity.mfgPN,
        isCustom: row.entity.isCustomPart,
        rohsIcon: row.entity.rohsIcon,
        rohsText: row.entity.rohsComplientConvertedValue,
        PIDCode: row.entity.PIDCode,
        materialTentitiveDocDate: row.entity.materialTentitiveDocDate
      };
      const data = {
        rowDetail: _.clone(rowDetail),
        customerID: row.entity.customerID,
        soID: row.entity.id,
        soNumber: row.entity.salesOrderNumber,
        soDate: row.entity.soDate,
        poDate: row.entity.poDate,
        isDisable: row.entity.completedStatus === CORE.SalesOrderDetStatusText.CANCELED || row.entity.completedStatus === CORE.SalesOrderDetStatusText.COMPLETED,
        poNumber: row.entity.poNumber,
        companyNameWithCode: row.entity.companyName,
        companyName: row.entity.companyName,
        isLegacyPO: row.entity.isLegacyPO,
        status: row.entity.status,
        oldstatus: row.entity.status,
        version: row.entity.revision,
        blanketPOOption: row.entity.blanketPOOption
      };
      DialogFactory.dialogService(
        CORE.SO_RELEASE_LINE_MODAL_CONTROLLER,
        CORE.SO_RELEASE_LINE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (response) => {
          if (response) {
            vm.loadData();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // open duplicate po
    vm.createDuplicateSO = (row, event) => {
      vm.cgBusyLoading = SalesOrderFactory.checkPartStatusOfSalesOrder().query({ id: row.id }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (res.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CONTAINST_INACTIVE_PART);
            messageContent.message = stringFormat(messageContent.message, redirectToSOAnchorTag(row.id, row.salesOrderNumber));
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                vm.openDuplicateSOpopup(row, event);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.openDuplicateSOpopup(row, event);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const redirectToSOAnchorTag = (soID, soNumber) => {
      const redirectToSOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_SALESORDER_DETAIL_ROUTE.replace(':id', soID);
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToSOUrl, soNumber);
    };

    vm.openDuplicateSOpopup = (row, event) => {
      const data = {
        salesID: row.id,
        status: parseInt(row.status) ? CORE.PO_WORKING_STATUS.PUBLISH : CORE.PO_WORKING_STATUS.DRAFT,
        soNumber: row.salesOrderNumber,
        companyName: row.companyName
      };
      DialogFactory.dialogService(
        TRANSACTION.DUPLICATE_SO_POPUP_CONTROLLER,
        TRANSACTION.DUPLICATE_SO_POPUP_VIEW,
        event,
        data).then(() => {
        }, (res) => {
          if (res) {
            BaseService.goToManageSalesOrder(res.id, false);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // open qty bifurcation popup
    vm.openBifurcationQtyPopup = (entity, ev) => {
      const data = {
        id: entity.salesOrderDetailId,
        pidCode: entity.PIDCode,
        partID: entity.partID,
        rohsName: entity.rohsComplientConvertedValue,
        rohsIcon: entity.rohsIcon,
        soID: entity.id,
        partType: entity.partType,
        poQty: entity.qty,
        shippedQty: entity.shippedQty || entity.custPackingSlipShippedQty,
        custPOLineNumber: entity.custPOLineNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_SALESORDER_QTY_CONTROLLER,
        TRANSACTION.TRANSACTION_SALESORDER_QTY_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    vm.getusedBlanketPODetails = (ID) => SalesOrderFactory.getBlanketPOUsedQtyForAssy().query({ id: ID }).$promise.then((response) => {
      if (response && response.data) {
        vm.soBlanketPOlist = response.data;
        return vm.soBlanketPOlist;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // press enter on search input
    vm.applyFiltersOnEnter = (event , err) => {
      if (event.keyCode === 13 && _.isEmpty(err)) {
        vm.advanceFilterSearch();
      }
    };

    //clear PO filter
    vm.removeSearchPOFilter = () => {
      vm.posoNumber = null;
      vm.advanceFilterSearch();
    };
    // clear comment filter
    vm.removeSearchCommentFilter = () => {
      vm.searchComments = null;
      vm.advanceFilterSearch();
    };
    //check max length validation
    vm.getMaxLengthValidation = (maxLength, enterTextLength) =>  BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
