(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .directive('customerPackingSlipGrid', customerPackingSlipGrid);
  /** @ngInject */
  function customerPackingSlipGrid($q, $state, MasterFactory, $timeout, BaseService, DialogFactory, USER, CORE, TRANSACTION, CustomerPackingSlipFactory, GenericCategoryFactory, ComponentFactory, $filter, DYNAMIC_REPORTS, ReportMasterFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        isNoDataFound: '='
      },
      templateUrl: 'app/directives/custom/customer-packing-slip-grid/customer-packing-slip-grid.html',
      controller: customerPackingSlipGridCtrl,
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

    function customerPackingSlipGridCtrl($scope) {
      const vm = this;
      vm.gridConfig = CORE.gridConfig;
      vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_PACKING_SLIP;
      vm.packingSlipStatus = CORE.CustomerPackingSlipStatusGridHeaderDropdown;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.LabelConstant = CORE.LabelConstant;
      vm.setScrollClass = 'gridScrollHeight_CustomerPackingSlip';
      vm.addInvoiceActionButtonName = 'Add Customer Invoice';
      vm.isUpdatable = true;
      vm.isPrinted = true;
      vm.isHideDelete = true;
      vm.isPrintedReportingTool = true;
      vm.isDownload = true;
      vm.isDownloadReportingTool = true;
      vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
      vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
      vm.isAddModifyReport = true;
      vm.isAddInvoice = true;
      vm.customerpackingsliphistory = true;
      vm.historyactionButtonName = CORE.LabelConstant.CustomerPackingSlip.HistoryButtonName;
      vm.debounce = _configTimeout;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachPSType = vm.CheckSearchTypeList[1].id;
      vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.packingSlipStatusList = CORE.CustomerPackingSlipStatus;
      vm.statusListToDisplay = angular.copy(vm.packingSlipStatusList);
      //get customer packing slip status
      vm.getCoPackingSlipStatusClassName = (statusID) => BaseService.getCustomerPackingSlipStatusClassName(statusID);
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
      vm.isViewCustomerInvoiceDetails = true;
      vm.DATE_PICKER = angular.copy(CORE.DATE_PICKER);
      vm.packingslip = {};
      //vm.IsFromPickerOpen = {};
      //vm.IsFromPickerOpen[vm.DATE_PICKER.fromDate] = false;
      //vm.IsToPickerOpen = {};
      //vm.IsToPickerOpen[vm.DATE_PICKER.toDate] = false;
      vm.isViewLock = false;
      // vm.isUpdateTrackingNumber = true;
      vm.enableLockTransaction = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockCustomerPackingSlip);
      vm.transTypeText = 'Customer Packing Slip';
      vm.isTrackingNumberUpdationPermission = !BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToChangeCustPackingSlipAndInvoiceTrackingNumber);
      vm.entityId = CORE.AllEntityIDS.Customer_PackingSlip.ID;
      vm.entityName = CORE.AllEntityIDS.Customer_PackingSlip.Name;
      vm.userId = vm.loginUser.userid;
      vm.roleId = vm.loginUser.defaultLoginRoleID;
      vm.showUnitPriceField = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToAddUnitPriceAtCustomerPackingSlip);
      vm.CustPackingSlipAdvancedFilters = CORE.CustPackingSlipAdvancedFilters;
      vm.advanceSearchPoSoPsInv = $state.params.psNumber;
      vm.CustPackingSlipAdvancedFilters = angular.copy(CORE.CustPackingSlipAdvancedFilters);
      vm.invoiceStatusList = angular.copy(CORE.CustomerInvoiceVerificationStatusOptionsGridHeaderDropdown);
      vm.invoiceStatusListToDisplay = angular.copy(vm.invoiceStatusList);
      vm.invStatusDetailModel = ['0'];
      vm.partIds = [];
      vm.cpsDateFilterList = TRANSACTION.CustomerPackingSlipDateFilterList;
      vm.selectedDateType = vm.cpsDateFilterList[0].key;
      vm.isAllFilterClear = false;

      vm.getCoInvoiceStatusClassName = (statusID) => {
        let className = BaseService.getCustInvStatusClassName(statusID, 'I');
        if (!className) {
          className = 'label-warning';
        }
        return className;
      };
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
      //};
      // initDateOption();
      vm.CustPaymentStatusInPackingSlipGridHeaderDropdown = angular.copy(CORE.CustPaymentStatusInPackingSlipGridHeaderDropdown);
      /*get Payment Terms list data for header filter in grid */
      const getPaymentTermsList = () => GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
        categoryType: CORE.CategoryType.Terms.Name
      }).$promise.then((respOfTerms) => {
        vm.paymentTermsList = [];
        if (respOfTerms && respOfTerms.data) {
          vm.paymentTermsList = [{ id: null, value: 'All' }];
          _.each(respOfTerms.data, (item) => {
            const obj = {
              id: item.gencCategoryName,
              value: item.gencCategoryName
            };
            vm.paymentTermsList.push(obj);
          });
        }
        return respOfTerms;
      }).catch((error) => BaseService.getErrorLog(error));
      /*get shipping list data for header filter*/
      const getShippingList = () => GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
        categoryType: CORE.CategoryType.ShippingType.Name
      }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingList = [{ id: null, value: 'All' }];
          _.each(shipping.data, (item) => {
            const obj = {
              id: item.gencCategoryCode,
              value: item.gencCategoryCode
            };
            vm.ShippingList.push(obj);
          });
          return vm.ShippingList;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const packingSlipPromise = [getPaymentTermsList(), getShippingList()];
      vm.cgBusyLoading = $q.all(packingSlipPromise).then(() => {
        LoadSourceData();
      }).catch((error) => BaseService.getErrorLog(error));

      vm.getMaterialStatusClass = (rowValue) => {
        if (rowValue.subStatus === 5 && rowValue.invoiceSubstatus === 4) {
          return 'label-warning';
        } else {
          return 'label-primary';
        }
      };
      const unitPriceColumn =
      {
        field: 'unitPrice',
        width: '140',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | unitPrice}}</div>',
        displayName: 'Unit Price ($)'
        //footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("unitPrice")}}</div>'
      };
      const extendedPriceColumn = {
        field: 'extendedPrice',
        width: '140',
        displayName: 'Ext. Price ($)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount}}</div>'
        // footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right">{{grid.appScope.$parent.vm.getFooterTotal("extendedPrice")}}</div>'
      };
      const quoteFromTextColumn = {
        field: 'quoteFromText',
        displayName: 'Quote From',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
        width: 150,
        enableFiltering: true,
        enableSorting: true,
        maxWidth: 200
      };
      const quoteGroupColumn = {
        field: 'refRFQGroupID',
        displayName: 'Quote Group',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  style="padding:0px !important">{{COL_FIELD}}</div>',
        width: 90,
        enableFiltering: true,
        enableSorting: true,
        maxWidth: '200'
      };
      const quoteNumberColumn = {
        field: 'quoteNumber',
        displayName: 'Quote#',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-center"  style="padding:0px !important">{{COL_FIELD}}</div>',
        width: 120,
        enableFiltering: true,
        enableSorting: true,
        maxWidth: '200'
      };
      const qtyTurnTimeColumn = {
        field: 'qtyTurnTime',
        displayName: 'Quote Qty Turn Time',
        cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{row.entity.assyQtyTurnTimeText}}</div>',
        width: 200,
        enableFiltering: true,
        enableSorting: true,
        maxWidth: '300'
      };
      const LoadSourceData = () => {
        vm.sourceHeader = [
          {
            field: 'Action',
            cellClass: 'layout-align-center-center',
            displayName: 'Action',
            width: '200',
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
            field: 'systemID',
            displayName: 'SystemID',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '150'
          },
          {
            field: 'materialStatus',
            displayName: 'Material & Invoice Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span ng-if="row.entity.materialStatus" class="label-box" ng-class="grid.appScope.$parent.vm.getMaterialStatusClass(row.entity)">'
              + '{{row.entity.materialStatus}}'
              + '</span> </div>',
            width: '200',
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'statusConvertedValue',
            displayName: 'Status',
            width: 240,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCoPackingSlipStatusClassName(row.entity.subStatus)">'
              + '{{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableFiltering: false,
            enableSorting: true
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
            field: 'packingSlipStatusValue',
            displayName: 'Customer Invoice Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCoInvoiceStatusClassName(row.entity.invoiceSubstatus)"> \
                                                    {{ COL_FIELD }}'
              + '</span>'
              + '</div>',
            enableSorting: true,
            enableFiltering: false,
            width: '200'
          },
          {
            field: 'paymentStatusValue',
            displayName: 'Customer Payment Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getPaymentStatusClassName(row.entity.paymentStatusCode)">'
              + '{{row.entity.paymentStatusValue}}'
              + '</span> </div > ',
            enableSorting: true,
            enableFiltering: true,
            width: '200',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.CustPaymentStatusInPackingSlipGridHeaderDropdown
            },
            ColumnDataType: 'StringEquals'
          },
          {
            field: 'packingTypeText',
            displayName: 'Packing Slip Type',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-success\':row.entity.packingSlipType == 2 ,\
                                                \'label-box label-warning\':row.entity.packingSlipType == 1 }"> \
                                                    {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            width: '120',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.CUSTOMER_PACKING_SLIP_TYPE_FILTER
            },
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'customerName',
            displayName: 'Customer',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);$event.preventDefault();">{{row.entity.customerName}}</a>\
                            <copy-text label="\'Customer\'" text="row.entity.customerName" ng-if="row.entity.customerName"></copy-text></div>',
            width: '280'
          },
          {
            field: 'packingSlipNumber',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                       <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToPackingSlip(row.entity);$event.preventDefault();">{{row.entity.packingSlipNumber}}</a>\
                                        <copy-text label="\'Packing Slip#\'" text="row.entity.packingSlipNumber"></copy-text>\
                                    <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.isLocked === 1" style="margin-left:5px !important;"> </md-icon>\
                                    </div>',
            displayName: 'Packing Slip#',
            width: '180'
          },
          {
            field: 'revision',
            displayName: vm.LabelConstant.COMMON.Version,
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '100'
          },
          {
            field: 'packingslipDate',
            displayName: 'Packing Slip Date',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '120',
            type: 'date',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'poNumber',
            displayName: 'PO#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.refSalesOrderID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrder(row.entity.refSalesOrderID);$event.preventDefault();">{{row.entity.poNumber}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.refSalesOrderID">\
                                        {{row.entity.poNumber}}\
                                    </span>\
                       <copy-text label="\'PO#\'" text="row.entity.poNumber" ng-if="row.entity.poNumber"></copy-text></div>',
            width: '230'
          },
          {
            field: 'poRevision',
            displayName: 'PO Revision',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '120'
          },
          {
            field: 'poDate',
            displayName: 'PO Date',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '100',
            type: 'date',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'soNumber',
            displayName: CORE.LabelConstant.SalesOrder.SO,
            cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.refSalesOrderID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrder(row.entity.refSalesOrderID);$event.preventDefault();">{{row.entity.soNumber}}</a>\
                                    </span>\
                              <span ng-if="!row.entity.refSalesOrderID">\
                                        {{row.entity.soNumber}}\
                                    </span>\
                            <copy-text label="\'SO#\'" text="row.entity.soNumber" ng-if="row.entity.soNumber"></copy-text></div>',
            width: '150'
          },
          {
            field: 'sorevision',
            displayName: 'SO Version',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '110'
          },
          {
            field: 'soDate',
            displayName: CORE.LabelConstant.SalesOrder.SODate,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '100',
            type: 'date',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'isRmaPOText',
            displayName: 'RMA PO',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':(row.entity.isRmaPO === 0),\
                        \'label-box label-success\':(row.entity.isRmaPO === 1),\
                        \'label-box label-info\':(!row.entity.isRmaPO) }"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            width: '120',
            allowCellFocus: false,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.KeywordWithNAGridHeaderDropDown
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
            field: 'invoiceNumber',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                       <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToInvoiceNumber(row.entity.invoiceID);$event.preventDefault();">{{row.entity.invoiceNumber}}</a>\
                                        <copy-text label="\'Invoice#\'" text="row.entity.invoiceNumber" ng-if="row.entity.invoiceNumber"></copy-text>\
                                    </div>',
            displayName: 'Invoice#',
            width: '150'
          },
          {
            field: 'custPOLineID',
            displayName: 'Cust PO Line#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '100'
          },
          {
            field: 'releaseNumber',
            displayName: 'Release Line#',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '100'
          },
          {
            field: 'poReleaseNumber',
            displayName: 'PO Release#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '140'
          },
          {
            field: 'mfrName',
            displayName: vm.LabelConstant.MFG.MFG,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgCodeID);$event.preventDefault();">{{row.entity.mfrName}}</a>\
                            <copy-text label="\'MFR\'" text="row.entity.mfrName" ng-if="row.entity.mfrName"></copy-text></div>',
            width: '300'
          },
          {
            field: 'assyName',
            displayName: vm.LabelConstant.MFG.MFGPN,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.partId"><common-pid-code-label-link  \
                                component-id="row.entity.partId" \
                                label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                value="row.entity.assyName" \
                                is-copy="true" \
                                 is-custom-part = row.entity.isCustom \
                                cust-part-number = row.entity.customPartNumber\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-assembly="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID
          },
          {
            field: 'assyId',
            displayName: vm.LabelConstant.SalesOrder.AssyIDPID,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.partId"><common-pid-code-label-link  \
                                component-id="row.entity.partId" \
                                label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.AssyIDPID" \
                                value="row.entity.assyId" \
                                is-copy="true" \
                                is-mfg="true" \
                                mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                mfg-value="row.entity.assyName" \
                                is-custom-part = row.entity.isCustom \
                                cust-part-number = row.entity.customPartNumber\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath + row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsName" \
                                is-copy-ahead-label="true" \
                                is-assembly="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID
          },
          {
            field: 'assyDescription',
            width: '300',
            displayName: vm.LabelConstant.MFG.MFGPNDescription,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}<md-tooltip md-direction="top" ng-if="row.entity.assyDescription">{{COL_FIELD}}</md-tooltip></div>'
          },
          {
            field: 'poQty',
            displayName: 'Original PO Line Order Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '80'
          },
          {
            field: 'remainingQty',
            width: '110',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            displayName: 'Remaining PO Line Qty'
            // footerCellTemplate: '<div layout="row" layout-align="end center" class="ui-grid-cell-contents summary-footer padding-right-0-imp">Total: </div>'
          },
          {
            field: 'releaseLineQty',
            width: 120,
            displayName: 'Original PO Release Line Order Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>'
          },
          {
            field: 'shipQty',
            displayName: 'Shipment Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '120'
          },
          {
            field: 'uom',
            displayName: 'UOM',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '90'
          },
          {
            field: 'termsDisplayText',
            displayName: 'Terms',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.termsID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToTerms(row.entity.termsID);$event.preventDefault();">{{row.entity.termsDisplayText}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.termsID">\
                                        {{row.entity.termsDisplayText}}\
                                    </span>\
                       <copy-text label="\'Terms\'" text="row.entity.termsDisplayText" ng-if="row.entity.termsDisplayText"></copy-text></div>',
            width: '160',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.paymentTermsList
            }
          },
          {
            field: 'shippingMethod',
            displayName: 'Shipping Method',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.shippingmethodid">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToShippingMethod(row.entity.shippingmethodid);$event.preventDefault();">{{row.entity.shippingMethod}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.shippingmethodid">\
                                        {{row.entity.shippingMethod}}\
                                    </span>\
                       <copy-text label="\'Shipping Method\'" text="row.entity.shippingMethod" ng-if="row.entity.shippingMethod"></copy-text></div>',
            width: '160',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.ShippingList
            }
          },
          {
            field: 'salesCommissionTo',
            displayName: 'Sales Commission To',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '200'
          },
          {
            field: 'shippingNotes',
            displayName: 'Line Shipping Comments',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
              '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
              '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.shippingNotes && row.entity.shippingNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showShipDescriptionPopUp(row.entity, $event)">' +
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
              '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.internalComment && row.entity.internalComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showLineDescriptionPopUp(row.entity, $event)">' +
              '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
              '<md-tooltip>View</md-tooltip>' +
              '</button>' +
              '</div>',
            width: '130',
            enableFiltering: false
          },
          {
            field: 'releaseNotes',
            displayName: vm.LabelConstant.CustomerPackingSlip.ReleaseNotes,
            cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
              '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
              '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.releaseNotes && row.entity.releaseNotes !== \'-\'" ng-click="grid.appScope.$parent.vm.showLineDescriptionPopUp(row.entity, $event)">' +
              '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
              '<md-tooltip>View</md-tooltip>' +
              '</button>' +
              '</div>',
            width: '130',
            enableFiltering: false
          },
          {
            field: 'isLockedConvertedValue',
            displayName: 'Locked',
            width: 100,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':!row.entity.isLocked,\
                        \'label-box label-success\':row.entity.isLocked }"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableSorting: true,
            enableFiltering: true,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: CORE.MasterTemplateDropdown
            }
          },
          {
            field: 'lockedAt',
            displayName: 'Locked Date',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
          }, {
            field: 'lockedBy',
            displayName: 'Locked By',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true
          }, {
            field: 'lockedByRole',
            displayName: 'Locked By Role',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true,
            visible: false
          },
          {
            field: 'refBlanketPONumber',
            displayName: 'Ref. Blanket PO#',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '140'
          },
          {
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
          },
          {
            field: 'createdby',
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
        if (vm.showUnitPriceField) {
          vm.sourceHeader.splice(34, 0, unitPriceColumn);
          vm.sourceHeader.splice(35, 0, extendedPriceColumn);
          vm.sourceHeader.splice(36, 0, quoteFromTextColumn);
          vm.sourceHeader.splice(37, 0, quoteGroupColumn);
          vm.sourceHeader.splice(38, 0, quoteNumberColumn);
          vm.sourceHeader.splice(39, 0, qtyTurnTimeColumn);
        }
      };

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['systemID', 'DESC']],
          SearchColumns: []
        };
      };
      initPageInfo();

      //format data for export
      const formatDataForExport = (allData) => {
        _.map(allData, (data) => {
          data.soDate = BaseService.getUIFormatedDate(data.soDate, vm.DefaultDateFormat);
          data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
          data.packingslipDate = BaseService.getUIFormatedDate(data.packingslipDate, vm.DefaultDateFormat);
          data.systemGenerated = false; //data.refCustInvoiceID ? true : false;
        });
      };

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Customer Packing Slip.csv',
        allowToExportAllData: true,
        /* Calls everytime for Export All Data [rowType = ALL] */
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerPackingSlipFactory.getCustomerPackingSlipDetail().query(pagingInfoOld).$promise.then((responseSales) => {
            if (responseSales.status === CORE.ApiResponseTypeStatus.SUCCESS && responseSales.data) {
              formatDataForExport(responseSales.data.packingSlipDet);
              return responseSales.data.packingSlipDet;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //bind source disabled details
      const bindGridDetails = (sourceData) => {
        _.map(sourceData, (data) => {
          data.isDisabledDelete = data.refCustInvoiceID ? true : false;
          data.soDate = BaseService.getUIFormatedDate(data.soDate, vm.DefaultDateFormat);
          data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
          data.packingslipDate = BaseService.getUIFormatedDate(data.packingslipDate, vm.DefaultDateFormat);
          data.systemGenerated = false; //data.refCustInvoiceID ? true : false;
          data.isDisabledAddInvoice = data.refCustInvoiceID || data.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft ? true : false;
          data.isDisabledViewCustomerInvoice = !data.refCustInvoiceID;
          data.isDisableLockTransaction = !vm.enableLockTransaction; //(data.isLocked === 1 || data.subStatus === CORE.CustomerPackingSlipSubStatusID.Draft || !vm.enableLockTransaction);
          data.isDisableManageTrackingNumber = vm.isTrackingNumberUpdationPermission;
          data.isPrintDisable = false;
          data.isDownloadDisabled = false;
          data.isPrintDisableReportingTool = false;
          data.isDownloadDisabledReportingTool = false;
        });
      };

      function setDataAfterGetAPICall(customerPackingSlip, isGetDataDown) {
        if (customerPackingSlip && customerPackingSlip.data.packingSlipDet) {
          vm.isAllFilterClear = false;
          if (!isGetDataDown) {
            vm.sourceData = customerPackingSlip.data.packingSlipDet;
            vm.currentdata = vm.sourceData.length;
          }
          else if (customerPackingSlip.data.packingSlipDet.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(customerPackingSlip.data.packingSlipDet);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = customerPackingSlip.data.Count;
          if (vm.sourceData && vm.sourceData.length > 0) {
            bindGridDetails(vm.sourceData);
          }
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
            if (vm.pagingInfo.SearchColumns.length > 0 || vm.pagingInfo.mfgCodeIds || vm.pagingInfo.mfgPartID || vm.pagingInfo.advanceSearchPoSoPsInv || vm.pagingInfo.statusIds || vm.pagingInfo.pfromDate || vm.pagingInfo.ptoDate || vm.pagingInfo.filterStatus || vm.pagingInfo.searchComments) {
              $scope.isNoDataFound = vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              $scope.isNoDataFound = vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          } else {
            $scope.isNoDataFound = vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          if (vm.gridOptions && vm.gridOptions.gridApi) {
            vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
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

      /* retrieve Customer packing slip detail list*/
      vm.loadData = () => {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['packingSlipNumber', 'DESC']];
        };
        filterSelectOption();
        setFilteredLabels(true);
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = CustomerPackingSlipFactory.getCustomerPackingSlipDetail().query(vm.pagingInfo).$promise.then((customerPackingSlip) => {
          if (customerPackingSlip.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(customerPackingSlip, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //call when user scroll down on list page
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerPackingSlipFactory.getCustomerPackingSlipDetail().query(vm.pagingInfo).$promise.then((customerPackingSlip) => {
          if (customerPackingSlip) {
            setDataAfterGetAPICall(customerPackingSlip, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //update record
      vm.updateRecord = (row) => {
        BaseService.goToManageCustomerPackingSlip(row.entity.customerslipId, row.entity.refSalesOrderID || 0);
      };

      //go to sales order
      vm.goToSalesOrder = (id) => {
        BaseService.goToManageSalesOrder(id);
        return;
      };
      //open log for customer packing slip
      vm.opencustomerpackingSlipChangesHistoryAuditLog = (row, ev) => {
        const data = {
          customerPackingId: row.entity.customerslipId,
          customerPackingDetID: row.entity.customerSlipDetID,
          packingSlipNumber: row.entity.packingSlipNumber,
          refSalesOrderID: row.entity.refSalesOrderID,
          transType: CORE.TRANSACTION_TYPE.PACKINGSLIP
        };
        DialogFactory.dialogService(
          CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_CONTROLLER,
          CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
      };
      //add invoice customer packing slip details
      vm.addInvoiceInPackingSlip = (row) => {
        if (row.entity) {
          BaseService.goToAddCustomerInvoice(row.entity.packingSlipNumber, true);
          // $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, {
          //   id: 0,
          //   packingSlipNumber: row.entity.packingSlipNumber
          // });
        }
      };

      //filter based on status selection
      const filterSelectOption = () => {
        // Customer Filter
        if (vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0) {
          vm.pagingInfo.mfgCodeIds = vm.mfgCodeDetailModel.join(',');
        }
        else {
          vm.pagingInfo.mfgCodeIds = null;
        }
        //Packing Slip Status Filter
        if (vm.statusDetailModel && vm.statusDetailModel.length > 0) {
          vm.pagingInfo.statusIds = vm.statusDetailModel.join(',');
        } else {
          vm.pagingInfo.statusIds = null;
        }
        //Invoice Status Filter
        if (vm.invStatusDetailModel && vm.invStatusDetailModel.length > 0) {
          vm.pagingInfo.filterStatus = vm.invStatusDetailModel.join(',');
        } else {
          vm.pagingInfo.filterStatus = null;
        }

        // Multiple Part filter
        if (vm.partIds && vm.partIds.length > 0) {
          vm.pagingInfo.mfgPartID = _.map(vm.partIds, 'id').join(',');
        } else {
          vm.pagingInfo.mfgPartID = null;
        }
        vm.pagingInfo.psSearchType = vm.checkSerachPSType;
        vm.pagingInfo.advanceSearchPoSoPsInv = vm.advanceSearchPoSoPsInv;
        vm.pagingInfo.selectedDateType = vm.selectedDateType;
        if (vm.packingslip.fromDate) {
          vm.pagingInfo.pfromDate = BaseService.getAPIFormatedDate(vm.packingslip.fromDate);
        } else {
          vm.pagingInfo.pfromDate = null;
        }
        if (vm.packingslip.toDate) {
          vm.pagingInfo.ptoDate = BaseService.getAPIFormatedDate(vm.packingslip.toDate);
        } else {
          vm.pagingInfo.ptoDate = null;
        }
        vm.pagingInfo.searchComments = vm.searchComments;
      };

      //status filter for customer invoice
      //vm.statusFilter = () => {
      //  if (vm.isCheckSNotInv && vm.isCheckInvd && vm.isCheckCrrInv && vm.isCheckPending && vm.isCheckDraft && vm.isCheckPublish) {
      //    vm.isCheckAll = true;
      //  } else if (!vm.isCheckSNotInv && !vm.isCheckInvd && !vm.isCheckCrrInv && !vm.isCheckPending && !vm.isCheckPublish && !vm.isCheckDraft) {
      //    vm.isCheckAll = true;
      //  } else {
      //    vm.isCheckAll = false;
      //  }
      //};

      // go to packing slip number
      vm.goToPackingSlip = (objPackingSlip) => {
        BaseService.goToManageCustomerPackingSlip(objPackingSlip.customerslipId, objPackingSlip.refSalesOrderID || 0);
      };
      ////show description for detail
      //vm.showDescriptionPopUp = (object, ev) => {
      //  const description = object && object.packingslipcomment ? angular.copy(object.packingslipcomment).replace(/\r/g, '<br/>') : null;
      //  const headerData = [
      //    {
      //      label: vm.LabelConstant.CustomerPackingSlip.PackingSlipNumber,
      //      value: object.packingSlipNumber,
      //      displayOrder: 1,
      //      labelLinkFn: () => {
      //        BaseService.goToCustomerPackingSlipList();
      //      },
      //      valueLinkFn: () => {
      //        BaseService.goToManageCustomerPackingSlip(object.customerslipId, object.refSalesOrderID || 0);
      //      }
      //    }];
      //  const obj = {
      //    title: vm.LabelConstant.CustomerPackingSlip.ShippingCommentPS,
      //    description: description,
      //    headerData: headerData
      //  };
      //  openCommonDescriptionPopup(ev, obj);
      //};
      //show description for shipping comment
      vm.showShipDescriptionPopUp = (object, ev) => {
        const description = object && object.shippingNotes ? angular.copy(object.shippingNotes).replace(/\r/g, '<br/>') : null;
        const headerData = [
          {
            label: vm.LabelConstant.CustomerPackingSlip.PackingSlipNumber,
            value: object.packingSlipNumber,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToCustomerPackingSlipList();
            },
            valueLinkFn: () => {
              BaseService.goToManageCustomerPackingSlip(object.customerslipId, object.refSalesOrderID || 0);
            }
          }];
        const obj = {
          title: vm.LabelConstant.CustomerPackingSlip.ShippingCommentLine,
          description: description,
          headerData: headerData
        };
        openCommonDescriptionPopup(ev, obj);
      };
      // show description for line level comment
      //vm.showLinePSDescriptionPopUp = (object, ev) => {
      //  const description = object && object.headerComment ? angular.copy(object.headerComment).replace(/\r/g, '<br/>') : null;
      //  const headerData = [
      //    {
      //      label: vm.LabelConstant.CustomerPackingSlip.PackingSlipNumber,
      //      value: object.packingSlipNumber,
      //      displayOrder: 1,
      //      labelLinkFn: () => {
      //        BaseService.goToCustomerPackingSlipList();
      //      },
      //      valueLinkFn: () => {
      //        BaseService.goToManageCustomerPackingSlip(object.customerslipId, object.refSalesOrderID || 0);
      //      }
      //    }];
      //  const obj = {
      //    title: vm.LabelConstant.CustomerPackingSlip.InternalNotes,
      //    description: description,
      //    headerData: headerData
      //  };
      //  openCommonDescriptionPopup(ev, obj);
      //};
      // show description for line level comment for line level
      vm.showLineDescriptionPopUp = (object, ev) => {
        const description = object && object.internalComment ? angular.copy(object.internalComment).replace(/\r/g, '<br/>') : null;
        const headerData = [
          {
            label: vm.LabelConstant.CustomerPackingSlip.PackingSlipNumber,
            value: object.packingSlipNumber,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToCustomerPackingSlipList();
            },
            valueLinkFn: () => {
              BaseService.goToManageCustomerPackingSlip(object.customerslipId, object.refSalesOrderID || 0);
            }
          }];
        const obj = {
          title: vm.LabelConstant.CustomerPackingSlip.InternalNotesLine,
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

      // show description for release notes
      vm.showReleaseNotes = (object, ev) => {
        const description = object && object.releaseNotes ? angular.copy(object.releaseNotes).replace(/\r/g, '<br/>') : null;
        const headerData = [
          {
            label: vm.LabelConstant.CustomerPackingSlip.PackingSlipNumber,
            value: object.packingSlipNumber,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToCustomerPackingSlipList();
            },
            valueLinkFn: () => {
              BaseService.goToManageCustomerPackingSlip(object.customerslipId, object.refSalesOrderID || 0);
            }
          }];
        const obj = {
          title: vm.LabelConstant.CustomerPackingSlip.ReleaseNotes,
          description: description,
          headerData: headerData
        };
        openCommonDescriptionPopup(ev, obj);
      };

      // to move at customer invoice page
      vm.viewCustomerInvoice = (rowData) => {
        if (rowData.refCustInvoiceID) {
          BaseService.goToManageCustomerInvoice(rowData.refCustInvoiceID);
        }
      };
      // go to customer list page
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      };
      // search list page for customer
      vm.searchMfrList = () => {
        vm.mfgCodeDetailModel = [];
        const mfrListToFilter = angular.copy(vm.mfgCodeDetail);
        vm.mfgCodeListToDisplay = vm.mfrSearchText ? _.filter(mfrListToFilter, (item) => item.mfgName.toLowerCase().contains(vm.mfrSearchText.toLowerCase())) : mfrListToFilter;
      };
      // clear customer
      vm.clearMfrSearchText = () => {
        vm.mfrSearchText = undefined;
        vm.searchMfrList();
      };
      // clear customerlist
      vm.clearManufacturerFilter = () => {
        vm.mfgCodeDetailModel = [];
      };

      // search list page for status
      vm.searchStatusList = () => {
        vm.statusDetailModel = [];
        const statusListToFilter = angular.copy(vm.packingSlipStatusList);
        vm.statusListToDisplay = vm.statusSearchText ? _.filter(statusListToFilter, (item) => item.Name.toLowerCase().contains(vm.statusSearchText.toLowerCase())) : statusListToFilter;
      };
      // clear status
      vm.clearstatusSearchText = () => {
        vm.statusSearchText = undefined;
        vm.searchStatusList();
      };
      // clear statuslist
      vm.clearStatusFilter = () => {
        vm.statusDetailModel = [];
      };

      // search list page for inv status
      vm.searchInvStatusList = () => {
        vm.invStatusDetailModel = [];
        const invStatusListToFilter = angular.copy(vm.invoiceStatusList);
        vm.invoiceStatusListToDisplay = vm.statusInvSearchText ? _.filter(invStatusListToFilter, (item) => item.Name.toLowerCase().contains(vm.statusInvSearchText.toLowerCase())) : invStatusListToFilter;
      };
      // clear inv status
      vm.clearInvStatusSearchText = () => {
        vm.statusInvSearchText = undefined;
        vm.searchInvStatusList();
      };
      // clear invoice status list
      vm.clearInvStatusFilter = () => {
        vm.invStatusDetailModel = [];
      };
      // get customer
      vm.getMfgSearch = () => {
        vm.mfrSearchText = undefined;
        vm.cgBusyLoading = MasterFactory.getCustomerList().query().$promise.then((mfgcodes) => {
          vm.mfgCodeDetail = vm.mfgCodeListToDisplay = [];
          if (mfgcodes && mfgcodes.data) {
            _.each(mfgcodes.data, (item) => {
              item.mfgactualName = item.mfgName;
              item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
            });
            vm.mfgCodeDetail = mfgcodes.data;
            vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
          }
          return vm.mfgCodeDetail;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getMfgSearch();

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      // init auto complete
      //const initAutoComplete = () => {
      //  vm.autoCompletecomponent = {
      //    columnName: 'mfgPN',
      //    keyColumnName: 'id',
      //    keyColumnId: null,
      //    inputName: CORE.LabelConstant.MFG.MFGPN,
      //    placeholderName: CORE.LabelConstant.MFG.MFGPN,
      //    isAddnew: false,
      //    isRequired: false,
      //    onSelectCallbackFn: (item) => {
      //      if (item && item.id) {
      //        vm.pagingInfo.mfrPnId = item.id;
      //        vm.pagingInfo.mfrPN = item.mfgPN;
      //      } else {
      //        vm.pagingInfo.mfrPnId = null;
      //        vm.pagingInfo.mfrPN = null;
      //      }
      //    },
      //    onSearchFn: function (query) {
      //      const searchObj = {
      //        query: query,
      //        inputName: vm.autoCompletecomponent.inputName,
      //        isContainCPN: true,
      //        mfgType: CORE.MFG_TYPE.MFG
      //      };
      //      return searchMfrPn(searchObj);
      //    }
      //  };
      //};
      // const searchMfrPn = (searchObj) => ComponentFactory.getComponentMFGPIDCodeAliasSearch().query({ listObj: searchObj }).$promise.then((component) => component.data.data).catch((error) => BaseService.getErrorLog(error));

      vm.searchMfrPn = (query) => {
        const searchObj = {
          query: query,
          mfgType: CORE.MFG_TYPE.MFG
        };
        return ComponentFactory.getComponentMFGPIDCodeAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
          if (component && component.data) {
            component.data.data = _.differenceWith(component.data.data, vm.partIds, (arrValue, othValue) => arrValue.id === othValue.id);
            return component.data.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // go to part list page
      vm.goToPartList = () => {
        BaseService.goToPartList();
      };
      // search filter detail
      vm.searchAdvanceFilter = () => {
        if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
          return;
        }
        vm.loadData();
      };

      // add new record
      vm.addCustomerPackingSlip = () => {
        BaseService.goToManageCustomerPackingSlip(0, 0);
      };

      // // add new record
      // vm.addCustomerPackingSlip = () => {
      //   $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, { sdetid: 0, id: 0 });
      // };

      //reset filter
      vm.resetAdvanceFilter = () => {
        vm.mfrSearchText = undefined;
        vm.clearMfrSearchText();
        vm.mfgCodeDetailModel = [];
        vm.statusDetailModel = [];
        vm.advanceSearchPoSoPsInv = null;
        vm.pagingInfo.mfrPnId = null;
        vm.packingslip.fromDate = null;
        vm.packingslip.toDate = null;
        vm.searchComments = null;
        vm.selectedDateType = vm.cpsDateFilterList[0].key;
        vm.resetDateFilter();
        vm.invStatusDetailModel = ['0'];
        vm.partIds = [];
        vm.checkSerachPSType = vm.CheckSearchTypeList[1].id;
        vm.loadData();
      };
      // go to customer manage page
      vm.goToCustomer = (id) => {
        BaseService.goToCustomer(id);
      };
      // go to manufacturer
      vm.goToManufacturer = (id) => {
        BaseService.goToManufacturer(id);
      };
      // go to terms
      vm.goToTerms = (id) => {
        BaseService.goToGenericCategoryManageTerms(id);
      };
      // go to shipping method
      vm.goToShippingMethod = (id) => {
        BaseService.goToManageGenericCategoryShippingType(id);
      };
      // go to personnel
      vm.gotoManagePersonal = (id) => {
        BaseService.goToManagePersonnel(id);
      };
      ////Set from date
      //vm.fromDateChanged = () => {
      //  initDateOption();
      //  vm.checkDateValidation(true);
      //};
      ////Set to date
      //vm.toDateChanged = () => {
      //  initDateOption();
      //  vm.checkDateValidation(false);
      //};     
      // go to invoice page
      vm.goToInvoiceNumber = (id) => {
        BaseService.goToManageCustomerInvoice(id);
      };
      // get class for payment status
      vm.getPaymentStatusClassName = (code) => {
        const status = _.find(CORE.Customer_Payment_Status, (item) => item.Code === code);
        return status ? status.ClassName : '';
      };

      // get default report By entity.
      function getDefaultReportByEntity(searchObj) {
        vm.deafultEntityReport = null;
        return ReportMasterFactory.getDefaultReportByEntity().query({ listObj: searchObj }).$promise.then((response) => {
          if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
            vm.deafultEntityReport = response.data;
          }
          //return $q.resolve(response);
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.goToCustomerPackingSlipList = () => {
        BaseService.goToCustomerPackingSlipList();
      };
      vm.goToManageCustomerPackingSlip = (parameterObj) => {
        if (parameterObj && parameterObj.customerslipId) {
          BaseService.goToManageCustomerPackingSlip(parameterObj.customerslipId, (parameterObj.refSalesOrderID || 0));
        }
      };

      // Open Entity-Report Popup.
      vm.addModifyReport = (row) => {
        const headerdata = [{
          value: row.customerName,
          label: 'Customer',
          displayOrder: 1,
          labelLinkFn: vm.goToCustomerList,
          valueLinkFn: vm.goToCustomer,
          valueLinkFnParams: row.customerID
        }, {
          value: row.packingSlipNumber,
          label: 'Packing Slip#',
          displayOrder: 2,
          labelLinkFn: vm.goToCustomerPackingSlipList,
          valueLinkFn: vm.goToManageCustomerPackingSlip,
          valueLinkFnParams: { customerslipId: row.customerslipId, refSalesOrderID: row.refSalesOrderID }
        }];

        const packingslipDetails = {
          parameterValueJson: stringFormat('{"{0}":"{1}"}', CORE.ReportParameterFilterDbColumnName.PackingSlipId, Number(row.customerslipId)),
          entityId: vm.entityId,
          entityName: vm.entityName,
          reportName: stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_PACKINGSLIP, row.packingSlipNumber, row.revision, row.custCode, row.statusConvertedValue === CORE.DisplayStatus.Draft.Value ? `-${row.statusConvertedValue.toUpperCase()}` : ''),
          skipFocusOnFirstElement: true,
          headerdata: headerdata
        };

        DialogFactory.dialogService(
          DYNAMIC_REPORTS.VIEW_ENTITY_REPORT_MODAL_CONTROLLER,
          DYNAMIC_REPORTS.VIEW_ENTITY_REPORT_MODAL_VIEW,
          null,
          packingslipDetails);
      };

      // Print Default Entity Report.
      vm.printRecordFromReportingTool = (row, isDownload) => {
        if (isDownload) {
          row.entity.isDownloadDisabledReportingTool = true;
        } else {
          row.entity.isPrintDisableReportingTool = true;
        }
        const entityInfo = {
          entityId: vm.entityId
        };
        const promise = [getDefaultReportByEntity(entityInfo)];
        $q.all(promise).then(() => {
          if (vm.deafultEntityReport) {
            const parameterValueJson = stringFormat('{"{0}":"{1}"}', CORE.ReportParameterFilterDbColumnName.PackingSlipId, Number(row.entity.customerslipId));
            const reportInfo = {
              id: vm.deafultEntityReport.id,
              parameterValueJson: parameterValueJson,
              reportName: stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_PACKINGSLIP, row.entity.packingSlipNumber, row.entity.revision, row.entity.custCode, row.entity.statusConvertedValue === CORE.DisplayStatus.Draft.Value ? `-${row.entity.statusConvertedValue.toUpperCase()}` : ''),
              createdBy: vm.userId.toString(),
              updatedBy: vm.userId.toString(),
              createByRoleId: vm.roleId,
              updateByRoleId: vm.roleId
            };
            viewReport(row.entity, reportInfo, isDownload);
          }
          else {
            row.entity.isDownloadDisabledReportingTool = false;
            row.entity.isPrintDisableReportingTool = false;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          row.entity.isDownloadDisabledReportingTool = false;
          row.entity.isPrintDisableReportingTool = false;
        });
      };

      function viewReport(rowEntity, reportFilterDetails, isDownload) {
        ReportMasterFactory.saveReportViewerParameter(reportFilterDetails).then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (isDownload) {
              ReportMasterFactory.downloadReport({ ParameterGuid: response.data }).then((downloadReportRes) => {
                BaseService.downloadReportFromReportingTool(downloadReportRes, reportFilterDetails.reportName, true);
                rowEntity.isDownloadDisabledReportingTool = false;
              }).catch((error) => {
                BaseService.getErrorLog(error);
                rowEntity.isDownloadDisabledReportingTool = false;
              });
            }
            else {
              rowEntity.isPrintDisableReportingTool = false;
              BaseService.redirectToViewer(response.data);
            }
          }
          else {
            rowEntity.isPrintDisableReportingTool = false;
            rowEntity.isDownloadDisabledReportingTool = false;
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          rowEntity.isDownloadDisabledReportingTool = false;
          rowEntity.isPrintDisableReportingTool = false;
        });
      }

      //print customer packingslip report
      vm.printRecord = (row, isDownload) => {
        if (isDownload) {
          row.entity.isDownloadDisabled = true;
        } else {
          row.entity.isPrintDisable = true;
        }
        const packingslipDetails = {
          id: row.entity.customerslipId,
          COFCReportDisclaimer: CORE.COFC_Report_Disclaimer,
          PACKINGSLIPReportDisclaimer: CORE.PACKINGSLIP_Report_Disclaimer,
          DECLARATIONOFRoHSCOMPLIANCE: CORE.DECLARATION_OF_RoHS_COMPLIANCE,
          RoHSReportDisclaimer: CORE.RoHS_Report_Disclaimer,
          PSData: {
            packingSlipNumber: row.entity.packingSlipNumber,
            revision: row.entity.revision,
            custCode: row.entity.custCode,
            statusName: row.entity.statusConvertedValue === CORE.DisplayStatus.Draft.Value ? `-${row.entity.statusConvertedValue.toUpperCase()}` : ''
          }
        };
        CustomerPackingSlipFactory.customerPackingSlipReport(packingslipDetails).then((response) => {
          const PSData = response.config.data.PSData;
          if (isDownload) {
            row.entity.isDownloadDisabled = false;
          } else {
            row.entity.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_PACKINGSLIP, PSData.packingSlipNumber, PSData.revision, PSData.custCode, PSData.statusName), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //page load then it will add forms in page forms
      angular.element(() => {
        setFocus('pendingStatus');
      });


      // download print
      vm.onDownload = (row) => {
        vm.printRecord(row, true);
      };

      // Download Report
      vm.onDownloadReportFromReportingTool = (row) => {
        vm.printRecordFromReportingTool(row, true);
      };

      const refreshGrid = $scope.$on('refreshCustomerPackingSlip', () => vm.loadData());
      $scope.$on('$destroy', () => { refreshGrid(); });

      // set applied filter chip with tool tip
      const setFilteredLabels = (canReGenerateTootip) => {
        vm.CustPackingSlipAdvancedFilters.Customer.isDeleted = !(vm.pagingInfo.mfgCodeIds && vm.pagingInfo.mfgCodeIds.length > 0);
        vm.CustPackingSlipAdvancedFilters.Status.isDeleted = !(vm.pagingInfo.statusIds && vm.pagingInfo.statusIds.length > 0);
        vm.CustPackingSlipAdvancedFilters.CustomerInvoiceStatus.isDeleted = !(vm.pagingInfo.filterStatus && vm.pagingInfo.filterStatus.length > 0);
        vm.CustPackingSlipAdvancedFilters.SearchPoNumber.isDeleted = !(vm.pagingInfo.advanceSearchPoSoPsInv);
        vm.CustPackingSlipAdvancedFilters.PartId.isDeleted = !(vm.pagingInfo.mfgPartID);
        vm.CustPackingSlipAdvancedFilters.PackingSlipDate.isDeleted = !(vm.pagingInfo.pfromDate || vm.pagingInfo.ptoDate);
        vm.CustPackingSlipAdvancedFilters.Comments.isDeleted = !(vm.pagingInfo.searchComments);
        if (vm.pagingInfo.pfromDate || vm.pagingInfo.ptoDate) {
          vm.CustPackingSlipAdvancedFilters.PackingSlipDate.isDeleted = !(vm.selectedDateType === vm.cpsDateFilterList[0].key);
          vm.CustPackingSlipAdvancedFilters.PODate.isDeleted = !(vm.selectedDateType === vm.cpsDateFilterList[1].key);
          vm.CustPackingSlipAdvancedFilters.SODate.isDeleted = !(vm.selectedDateType === vm.cpsDateFilterList[2].key);
        } else {
          vm.CustPackingSlipAdvancedFilters.PackingSlipDate.isDeleted = true;
          vm.CustPackingSlipAdvancedFilters.PODate.isDeleted = true;
          vm.CustPackingSlipAdvancedFilters.SODate.isDeleted = true;
        }
        const selectedDateTypeText = _.find(vm.cpsDateFilterList, (item) => item.key === vm.selectedDateType).value;
        // set tool tip  if filter applied
        if (canReGenerateTootip) {
          const fromDateFormatted = vm.pagingInfo.pfromDate ? $filter('date')(new Date(vm.pagingInfo.pfromDate), vm.DefaultDateFormat) : null;
          const toDateFormatted = vm.pagingInfo.ptoDate ? $filter('date')(new Date(vm.pagingInfo.ptoDate), vm.DefaultDateFormat) : null;

          vm.CustPackingSlipAdvancedFilters.Status.tooltip = getFilterTooltip(vm.statusListToDisplay, vm.statusDetailModel, 'ID', 'Name');
          vm.CustPackingSlipAdvancedFilters.Customer.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.mfgCodeDetailModel, 'id', 'mfgCodeName');
          vm.CustPackingSlipAdvancedFilters.CustomerInvoiceStatus.tooltip = getFilterTooltip(vm.invoiceStatusListToDisplay, vm.invStatusDetailModel, 'id', 'value');
          vm.CustPackingSlipAdvancedFilters.SearchPoNumber.tooltip = vm.pagingInfo.advanceSearchPoSoPsInv ? vm.pagingInfo.advanceSearchPoSoPsInv : '';
          vm.CustPackingSlipAdvancedFilters.Comments.tooltip = vm.pagingInfo.searchComments ? vm.pagingInfo.searchComments : '';
          vm.CustPackingSlipAdvancedFilters.PartId.tooltip = getFilterTooltipWithoutModel(vm.partIds, 'mfgPN');
          if (vm.selectedDateType === 'P') {
            vm.CustPackingSlipAdvancedFilters.PackingSlipDate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} {1} {2}', selectedDateTypeText, ' From: ', fromDateFormatted) : (selectedDateTypeText + ' Date');
            vm.CustPackingSlipAdvancedFilters.PackingSlipDate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.CustPackingSlipAdvancedFilters.PackingSlipDate.tooltip, '<br/> To: ', toDateFormatted) : vm.CustPackingSlipAdvancedFilters.PackingSlipDate.tooltip;
          } else if (vm.selectedDateType === 'PO') {
            vm.CustPackingSlipAdvancedFilters.PODate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} {1} {2}', selectedDateTypeText, ' From: ', fromDateFormatted) : (selectedDateTypeText + ' Date');
            vm.CustPackingSlipAdvancedFilters.PODate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.CustPackingSlipAdvancedFilters.PODate.tooltip, '<br/> To: ', toDateFormatted) : vm.CustPackingSlipAdvancedFilters.PODate.tooltip;
          } else if (vm.selectedDateType === 'SO') {
            vm.CustPackingSlipAdvancedFilters.SODate.tooltip = vm.pagingInfo.pfromDate ? stringFormat('{0} {1} {2}', selectedDateTypeText, ' From: ', fromDateFormatted) : (selectedDateTypeText + ' Date');
            vm.CustPackingSlipAdvancedFilters.SODate.tooltip = vm.pagingInfo.ptoDate ? stringFormat('{0} {1} {2}', vm.CustPackingSlipAdvancedFilters.SODate.tooltip, '<br/> To: ', toDateFormatted) : vm.CustPackingSlipAdvancedFilters.SODate.tooltip;
          }
        }
        vm.numberOfFiltersApplied = _.filter(vm.CustPackingSlipAdvancedFilters, (num) => num.isDeleted === false).length;
      };

      //remove selected filter chip
      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.CustPackingSlipAdvancedFilters.Status.value:
              vm.statusDetailModel = null;
              break;
            case vm.CustPackingSlipAdvancedFilters.Customer.value:
              vm.mfgCodeDetailModel = null;
              break;
            case vm.CustPackingSlipAdvancedFilters.CustomerInvoiceStatus.value:
              vm.invStatusDetailModel = null;
              break;
            case vm.CustPackingSlipAdvancedFilters.SearchPoNumber.value:
              vm.advanceSearchPoSoPsInv = null;
              break;
            case vm.CustPackingSlipAdvancedFilters.PartId.value:
              vm.partIds = [];
              break;
            case vm.CustPackingSlipAdvancedFilters.PackingSlipDate.value:
            case vm.CustPackingSlipAdvancedFilters.PODate.value:
            case vm.CustPackingSlipAdvancedFilters.SODate.value:
              vm.packingslip.fromDate = null;
              vm.packingslip.toDate = null;
              vm.resetDateFilter();
              break;
            case vm.CustPackingSlipAdvancedFilters.Comments.value:
              vm.searchComments = null;
              break;
          }
          vm.searchAdvanceFilter();
        }
      };

      // clear all filters including defulat filters
      vm.clearAllFilter = () => {
        vm.statusDetailModel = null;
        vm.mfgCodeDetailModel = null;
        vm.invStatusDetailModel = null;
        vm.advanceSearchPoSoPsInv = null;
        vm.partIds = [];
        vm.searchComments = null;
        vm.packingslip.fromDate = null;
        vm.packingslip.toDate = null;
        vm.selectedDateType = vm.cpsDateFilterList[0].key;
        vm.resetDateFilter();
        vm.clearManufacturerFilter();
        vm.clearStatusFilter();
        vm.clearstatusSearchText();
        vm.clearInvStatusSearchText();
        vm.isAllFilterClear = true;
        vm.isNoDataFound = true;
        vm.emptyState = null;
        filterSelectOption();
        setFilteredLabels(false);
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        // vm.loadData();
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

      // press enter on search input
      vm.applyFiltersOnEnter = (event,err) => {
        if (event.keyCode === 13 && _.isEmpty(err)) {
          vm.searchAdvanceFilter();
        }
      };

      //clear PO filter
      vm.removeSearchPOFilter = () => {
        vm.advanceSearchPoSoPsInv = null;
        vm.searchAdvanceFilter();
      };
      // clear comment filter
      vm.removeSearchCommentFilter = () => {
        vm.searchComments = null;
        vm.searchAdvanceFilter();
      };
    }
  }
})();
