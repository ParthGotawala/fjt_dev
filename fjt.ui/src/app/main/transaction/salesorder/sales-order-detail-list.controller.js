(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrderDetailController', SalesOrderDetailController);

  /** @ngInject */
  function SalesOrderDetailController($mdDialog, $timeout, CORE, USER, TRANSACTION, $scope,
    SalesOrderFactory, DialogFactory, BaseService, GenericCategoryFactory,
    $q, $stateParams, CONFIGURATION, MasterFactory, $filter, $state, PurchaseOrderFactory) {
    const vm = this;
    vm.listType = parseInt($stateParams.listType); // 0 - sales order list, 1 - Pending customer paking slip list
    vm.type = $state.current.name;
    vm.isUpdatable = vm.listType === 0 ? true : false;
    vm.isCreateDuplicateSO = vm.listType === 0 ? true : false;
    vm.configTimeout = _configTimeout;
    vm.isDownload = true;
    vm.partType = CORE.PartType.Other;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SALESORDER;
    vm.EmptyMesssageForPECustPackingSlip = TRANSACTION.TRANSACTION_EMPTYSTATE.PENDING_CUSTOMER_PACKING_SLIP_CREATION;
    vm.DisplayStatus = CORE.DisplayStatus;
    vm.woStatusDetail = CORE.WorkOrderStatus;
    vm.WoStatus = CORE.SalesOrderStatusGridHeaderDropdown;
    vm.CompelteStatus = CORE.SalesOrderCompleteStatusGridHeaderDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.gridId = vm.listType === 0 ? vm.gridConfig.gridSalesSummaryOrder : vm.gridConfig.gridPendingCustomerPackingSlipSummary;
    vm.SOWorkingStatus = CORE.SOWorkingStatus;
    vm.isPrinted = true;
    vm.isfocus = true;
    vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
    vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
    vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
    vm.EmptyMesssages = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
    vm.SalesOrderAdvanceFilter = angular.copy(CORE.SalesOrderAdvancedFilters);
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.salesorderChangesHistory = vm.listType === 0 ? true : false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isAddCustPackingSlip = vm.listType === 1 ? true : false;
    vm.isHideDelete = vm.listType === 1 ? true : false;
    vm.publish = vm.listType === 0 ? false : true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);
    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.pending = true;
    vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
    vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
    vm.checkSerachAmountType = vm.CheckSearchTypeList[1].id;
    vm.salesOrderDateFilterList = angular.copy(TRANSACTION.SalesOrderDateFilterList);
    vm.selectedDateType = vm.salesOrderDateFilterList[0].key;
    vm.isAllFilterClear = false;


    vm.customer = [];
    vm.shippingMethods = [];
    vm.terms = [];
    vm.partIds = [];
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.WOSTATUS = CORE.WOSTATUS;
    // for copy icon into ui-grid action column

    /*load source header after getting shipping detail list*/
    function LoadSourceData() {
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: (vm.listType === 0 && vm.type === TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_STATE ? '180' : vm.listType === 0 && vm.type !== TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_STATE ? '230' : '200'),
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="5"></grid-action-view>',
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
            + '<div class="cm-quote-progress" style="width:{{(row.entity.soCompletionPercentage || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'cursor-pointer\': row.entity.soCompletionPercentage > 0 , \'underline\':row.entity.soCompletionPercentage > 0}"> '
            + '{{(row.entity.soCompletionPercentage || 0)}}%</span></span>'
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
            options: CORE.ShippingInsuranceDropDown
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
          field: 'legacyPOText',
          displayName: 'Legacy PO',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isLegacyPO),\
                        \'label-box label-success\':(row.entity.isLegacyPO)}"> \
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
        },
        {
          field: 'poRevisionDate',
          displayName: 'PO Revision Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '110'
        },
        //{
        //  field: 'originalPODate',
        //  displayName: 'Orig. PO Date',
        //  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        //  width: '100',
        //  type: 'date',
        //  enableFiltering: false,
        //  enableSorting: true
        //},
        {
          field: 'companyName',
          displayName: vm.LabelConstant.SalesOrder.Customer,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Customer" text="row.entity.companyName" ng-if="row.entity.companyName"></copy-text>\
                        </div>',
          width: '280',
          enableFiltering: false
        },
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
          field: 'fullName',
          displayName: 'Contact Person',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
        },
        {
          field: 'termsDisplayText',
          displayName: vm.LabelConstant.SalesOrder.Terms,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToGenericCategoryManageTerms(row.entity.termsID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Terms" text="row.entity.termsDisplayText" ng-if="row.entity.termsDisplayText"></copy-text>\
                        </div>',
          width: '180',
          enableFiltering: false
        },
        {
          field: 'salesCommName',
          displayName: vm.LabelConstant.SalesOrder.SalesCommissionTo,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManagePersonnel(row.entity.salesCommissionTo);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.SalesCommissionTo" text="row.entity.salesCommName" ng-if="row.entity.salesCommName"></copy-text>\
                        </div>',
          width: '180',
          enableFiltering: false
        },
        {
          field: 'genCategoryCode',
          displayName: vm.LabelConstant.SalesOrder.ShippingMethod,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryShippingType(row.entity.shippingMethodID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ShippingMethod" text="row.entity.genCategoryCode" ng-if="row.entity.genCategoryCode"></copy-text>\
                        </div>',
          width: '180',
          enableFiltering: false
        },
        {
          field: 'carrierName',
          displayName: 'Carrier',
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryCarrier(row.entity.carrierID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ShippingMethod" text="row.entity.carrierName" ng-if="row.entity.carrierName"></copy-text>\
                        </div>',
          width: '150'
        },
        {
          field: 'carrierAccountNumber',
          displayName: 'Carrier Acoount#',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          width: '150'
        },
        {
          field: 'freeOnBoardName',
          displayName: 'FOB',
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToFOB();" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.FreeOnBoard" text="row.entity.freeOnBoardName" ng-if="row.entity.freeOnBoardName"></copy-text>\
                        </div>',
          width: '150'
        },
        {
          field: 'billingAddressText',
          displayName: vm.LabelConstant.Address.BillingAddress,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'billToContactPerson',
          displayName: vm.LabelConstant.COMMON.BillingAddressContactPerson,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'shippingAddressText',
          displayName: vm.LabelConstant.Address.ShippingAddress,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'shipToToContactPerson',
          displayName: vm.LabelConstant.COMMON.ShippingAddressContactPerson,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'intermediateText',
          displayName: vm.LabelConstant.Address.MarkForAddress,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'markToToContactPerson',
          displayName: vm.LabelConstant.COMMON.MarkForContactPerson,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '300'
        },
        {
          field: 'shippingComment',
          displayName: 'Header Shipping Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shippingComment && row.entity.shippingComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showSOLevelDescriptionPopUp(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '160',
          enableFiltering: false
        },
        {
          field: 'internalCommentSo',
          displayName: 'Header Internal Notes',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalCommentSo && row.entity.internalCommentSo !== \'-\'" ng-click="grid.appScope.$parent.vm.showSOLevelNotesDescriptionPopUp(row.entity, $event)">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>',
          width: '100',
          enableFiltering: false
        }, {
          field: 'totalSOLines',
          displayName: 'Total SO Line(s)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                                      <span ng-if="row.entity.totalSOLines">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrderDetail(row.entity);$event.preventDefault();">{{row.entity.totalSOLines}}</a>\
                                        <md-tooltip>{{row.entity.totalSOLines}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.totalSOLines">\
                                        {{row.entity.totalSOLines}}\
                                    </span>\
                                    </div>',
          width: '140',
          enableFiltering: true,
          enableSorting: true
        }, {
          field: 'totalCompletedSOLines',
          displayName: 'Total Completed SO Line(s)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                                      <span ng-if="row.entity.totalCompletedSOLines">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrderCompletedDetail(row.entity);$event.preventDefault();">{{row.entity.totalCompletedSOLines}}</a>\
                                        <md-tooltip>{{row.entity.totalCompletedSOLines}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.totalCompletedSOLines">\
                                        {{row.entity.totalCompletedSOLines}}\
                                    </span>\
                                    </div>',
          width: '140',
          enableFiltering: true,
          enableSorting: true
        }, {
          field: 'soTotalPrice',
          displayName: 'Total SO Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>',
          width: '140',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'soInvoicePrice',
          displayName: 'Total Customer Invoice Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount }}</div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true
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
    };
    initPageInfo();

    const formatDataForExport = (allData) => {
      _.each(allData, (item) => {
        item.copyRohsIcon = item.rohsIcon;
        item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
        item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
        item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
        item.poRevisionDate = BaseService.getUIFormatedDate(item.poRevisionDate, vm.DefaultDateFormat);
        item.nextShipDate = BaseService.getUIFormatedDate(item.nextShipDate, vm.DefaultDateFormat);
        item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
        item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
        if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < new Date()) {
          item.isPastMaterialDocDate = true;
        }
        item.extPriceDisplayValue = item.extPriceDisplayValue ? parseFloat((item.extPriceDisplayValue).toFixed(5)) : '';
        item.totalextPriceDisplayValue = ((item.totalextPriceDisplayValue) || '');
      });
    };

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: vm.listType === 0 ? true : false,
      enableFullRowSelection: false,
      enableRowSelection: vm.listType === 0 ? true : false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      CurrentPage: CORE.PAGENAME_CONSTANT[6].PageName,
      exporterMenuCsv: true,
      exporterCsvFilename: vm.listType === 0 ? 'Sales Order.csv' : 'Pending Customer Packing Slip Creation List.csv',
      allowToExportAllData: true,
      /* Calls everytime for Export All Data [rowType = ALL] */
      exporterAllDataFn: () => {
        /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return SalesOrderFactory.retrieveSalesOrderSummaryList().query(pagingInfoOld).$promise.then((responseSales) => {
          if (responseSales.status === CORE.ApiResponseTypeStatus.SUCCESS && responseSales.data) {
            formatDataForExport(responseSales.data.salesorders);
            return responseSales.data.salesorders;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // generate filter for sales order list page
    const generateSearchFilter = () => {
      vm.generateFilter = false;
      //vm.SalesOrderAdvanceFilter.ClearAll.isDeleted = true;
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
          vm.SalesOrderAdvanceFilter.SOStatus.isDeleted = false;
          // vm.SalesOrderAdvanceFilter.ClearAll.isDeleted = false;
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
      if (vm.isRmaPO) {
        vm.pagingInfo.isRmaPO = true;
      } else {
        vm.pagingInfo.isRmaPO = false;
      }
      if (vm.partIds && vm.partIds.length > 0) {
        vm.pagingInfo.partIds = _.map(vm.partIds, 'id').join(',');
        vm.generateFilter = true;
      } else {
        vm.pagingInfo.partIds = null;
      }
      vm.pagingInfo.searchComments = vm.searchComments;
      if (vm.gridOptions && vm.gridOptions.gridApi) {
        vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
      }
    };
    // set filter visible and tool tip based on filter selection
    const setFilteredLabels = (canReGenerateTootip) => {
      vm.SalesOrderAdvanceFilter.Customer.isDeleted = !(vm.pagingInfo.customerID && vm.pagingInfo.customerID.length > 0);
      vm.SalesOrderAdvanceFilter.ShippingMethod.isDeleted = !(vm.pagingInfo.shippingMethodId && vm.pagingInfo.shippingMethodId.length > 0);
      vm.SalesOrderAdvanceFilter.Parts.isDeleted = !(vm.pagingInfo.partIds && vm.pagingInfo.partIds.length > 0);
      vm.SalesOrderAdvanceFilter.WorkOrder.isDeleted = !(vm.pagingInfo.woIds && vm.pagingInfo.woIds.length > 0);
      vm.SalesOrderAdvanceFilter.Terms.isDeleted = !(vm.pagingInfo.termsIds && vm.pagingInfo.termsIds.length > 0);
      vm.SalesOrderAdvanceFilter.POSO.isDeleted = !(vm.pagingInfo.posoSearch);
      vm.SalesOrderAdvanceFilter.TotalSOExt.isDeleted = !(vm.pagingInfo.searchextPricetext);
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
          vm.SalesOrderAdvanceFilter.PODate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} From: {1} ', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
          vm.SalesOrderAdvanceFilter.PODate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.SalesOrderAdvanceFilter.PODate.tooltip, ' To: ', toDateFormatted) : '';
        } else if (vm.selectedDateType === 'SO') {
          vm.SalesOrderAdvanceFilter.SODate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} From: {1} ', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
          vm.SalesOrderAdvanceFilter.SODate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.SalesOrderAdvanceFilter.SODate.tooltip, ' To: ', toDateFormatted) : '';
        } else if (vm.selectedDateType === 'PR') {
          vm.SalesOrderAdvanceFilter.PORevDate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
          vm.SalesOrderAdvanceFilter.PORevDate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.SalesOrderAdvanceFilter.PORevDate.tooltip, ' To: ', toDateFormatted) : '';
        }
        vm.SalesOrderAdvanceFilter.POSO.tooltip = vm.pagingInfo.posoSearch;
        vm.SalesOrderAdvanceFilter.TotalSOExt.tooltip = vm.pagingInfo.searchextPricetext;

        vm.SalesOrderAdvanceFilter.RushJob.tooltip = vm.pagingInfo.isRushJob ? 'Rush Job' : '';
        vm.SalesOrderAdvanceFilter.RmaPO.tooltip = vm.pagingInfo.isRmaPO ? 'RMA PO' : '';
        vm.SalesOrderAdvanceFilter.Comments.tooltip = vm.pagingInfo.searchComments;
      }

      vm.numberOfMasterFiltersApplied = _.filter(vm.SalesOrderAdvanceFilter, (num) => num.isDeleted === false).length;
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
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
          item.copyRohsIcon = item.rohsIcon;
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
          item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
          item.poRevisionDate = BaseService.getUIFormatedDate(item.poRevisionDate, vm.DefaultDateFormat);
          item.nextShipDate = BaseService.getUIFormatedDate(item.nextShipDate, vm.DefaultDateFormat);
          item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
          item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
          item.isDisabledAddInvoice = item.salesOrderDetailId ? false : true;
          if (parseInt(item.status) !== CORE.WOSTATUS.DRAFT && parseInt(item.status) !== CORE.WOSTATUS.PUBLISHED) {
            item.isRowSelectable = false;
          }
          if (item.totalSOLines > 0) {
            item.isDisabledDelete = true;
          };
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
          if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < new Date()) {
            item.isPastMaterialDocDate = true;
          }
          item.extPriceDisplayValue = item.extPriceDisplayValue ? parseFloat((item.extPriceDisplayValue).toFixed(5)) : '';
          item.totalextPriceDisplayValue = ((item.totalextPriceDisplayValue) || '');
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
        //vm.isNoDataFound = true;
        //vm.emptyState = null;
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
      vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderSummaryList().query(vm.pagingInfo).$promise.then((salesorder) => {
        vm.sourceData = [];
        if (salesorder && salesorder.data) {
          setDataAfterGetAPICall(salesorder, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderSummaryList().query(vm.pagingInfo).$promise.then((salesorder) => {
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
    vm.deleteRecord = (salesorder) => {
      let refSalesOrderIDs = [];
      if (salesorder) {
        refSalesOrderIDs.push(salesorder.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          refSalesOrderIDs = vm.selectedRows.map((item) => item.id);
        }
      }

      if (refSalesOrderIDs && refSalesOrderIDs.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Sales order', refSalesOrderIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: [],
          salesOrderID: refSalesOrderIDs,
          CountList: false
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = SalesOrderFactory.deleteSalesOrder().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                const datas = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.sales_order
                };
                BaseService.deleteAlertMessageWithHistory(datas, (ev) => {
                  const IDs = {
                    id: [],
                    salesOrderID: refSalesOrderIDs,
                    CountList: true
                  };
                  return SalesOrderFactory.deleteSalesOrder().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = salesorder ? salesorder.salesOrderNumber : null;
                    data.PageName = CORE.PageName.sales_order;
                    data.selectedIDs = stringFormat('{0}{1}', (refSalesOrderIDs.length), ' Selected');
                    data.id = refSalesOrderIDs;
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
              } else {
                vm.loadData();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE_LABEL);
        messageContent.message = stringFormat(messageContent.message, 'Sales order');
        const obj = {
          multiple: true,
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(obj);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };
    //open sales order change history popup
    vm.opensalesorderChangesHistoryAuditLog = (row, $event) => {
      var data = {
        Tablename: 'SALESORDERMST',
        RefTransID: row.entity.id,
        salesOrderNumber: row.entity.salesOrderNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_CHANGE_HISTORY_VIEW,
        $event,
        data).then(() => {

        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };
    vm.woStatusIds = [];
    /* go to po status report for selected sales order assembly */
    vm.openPOStatusReport = (rowData) => {
      if (rowData.id && rowData.customerID && rowData.soCompletionPercentage) {
        BaseService.goToPOStatusSalseOrderReport(rowData.customerID, rowData.id);
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

    vm.goToManagePersonnel = (id) => BaseService.goToManagePersonnel(id);

    vm.goToFOB = () => BaseService.goToFOB();

    vm.goToManageGenericCategoryCarrier = (id) => BaseService.goToManageGenericCategoryCarrier(id);

    //print sales order report
    vm.printRecord = (row, isDownload) => {
      let dataKeyvalue;
      _.each(vm.dataKey, (item) => {
        if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
          return dataKeyvalue = item.values;
        }
      });
      if (!row.entity.totalSOLines) {
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
          case vm.SalesOrderAdvanceFilter.TotalSOExt.value:
            vm.amount = null;
            break;
          case vm.SalesOrderAdvanceFilter.RmaPO.value:
            vm.isRmaPO = false;
            break;
          case vm.SalesOrderAdvanceFilter.Parts.value:
            vm.partIds = [];
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
      vm.amount = null;
      vm.isCheckAllStatus = false;
      vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
      vm.checkSerachAmountType = vm.CheckSearchTypeList[1].id;
      vm.generateFilter = false;
      vm.fromDate = vm.toDate = null;
      vm.pending = vm.completed = vm.canceled = false;
      vm.isRmaPO = false;
      vm.partIds = [];
      vm.searchComments = null;
      vm.selectedDateType = vm.salesOrderDateFilterList[0].key;
      vm.resetDateFilter();
      if (vm.listType === 1 || !isfromClear) {
        vm.pending = true;
      }
      vm.draft = vm.publish = false;
      if (vm.listType === 1) {
        vm.publish = true;
      }
      if (vm.gridOptions.gridApi) {
        vm.gridOptions.gridApi.core.clearAllFilters();
      }
      setFilteredLabels(true);
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
    // check po status filter
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

    // go to sales order detail page
    vm.goToSalesOrderDetail = (row) => {
      BaseService.salesOrderNumber = row.salesOrderNumber;
      BaseService.goToSalesOrderPartList(row.salesOrderNumber);
    };
    // go to sales order detail page
    vm.goToSalesOrderCompletedDetail = (row) => {
      BaseService.salesOrderNumber = row.salesOrderNumber;
      BaseService.goToSalesOrderPartList(row.salesOrderNumber, 1);
    };

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
    // press enter on search input
    vm.applyFiltersOnEnter = (event, err) => {
      if (event.keyCode === 13 && _.isEmpty(err)) {
        vm.advanceFilterSearch();
      }
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
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
