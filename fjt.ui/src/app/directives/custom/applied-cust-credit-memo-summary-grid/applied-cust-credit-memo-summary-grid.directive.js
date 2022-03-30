(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('appliedCustCreditMemoSummaryGrid', appliedCustCreditMemoSummaryGrid);

  /** @ngInject */
  function appliedCustCreditMemoSummaryGrid(BaseService, $timeout, $q, CORE, USER, MasterFactory, TRANSACTION, CustomerPaymentFactory, DialogFactory, $filter, GenericCategoryFactory, EmployeeFactory, PackingSlipFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
      },
      templateUrl: 'app/directives/custom/applied-cust-credit-memo-summary-grid/applied-cust-credit-memo-summary-grid.html',
      controller: appliedCustCreditMemoSummaryGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function appliedCustCreditMemoSummaryGridCtrl() {
      const vm = this;
      vm.loginUser = BaseService.loginUser;
      vm.isUpdatable = true;
      vm.isHideDelete = true;
      vm.isVoidAndReleaseInvoiceGroup = vm.isViewLockCustomerPayment = true;
      vm.isApplyCustCMHistory = true;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.APPLY_CREDIT_MEMO_TO_INV_PAYMENT;
      vm.EmptyFilterMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
      vm.debounceTimeInterval = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachType = vm.CheckSearchTypeList[1].id;
      vm.custPaymentAdvanceFiltersConst = TRANSACTION.CustomerPaymentAdvanceFilters;
      vm.ApplyCustCreditMemoStatusTextConst = TRANSACTION.ApplyCustomerCreditMemoStatusText;
      const paymentEntityNmForLock = 'applied customer credit memo';

      vm.dateOption = {
        fromAppliedDateOpenFlag: false,
        toAppliedDateOpenFlag: false
      };

      vm.reTryCount = 0;
      vm.filter = {
        customer: [],
        paymentMethod: [],
        paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
        paymentNumber: null,
        invoiceNumber: null,
        amount: null,
        paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
        fromAppliedDate: null,
        toAppliedDate: null,
        isIncludeVoidedTransaction: false
      };

      vm.fromAppliedDateOptions = {
        appendToBody: true
      };

      vm.toAppliedDateOptions = {
        appendToBody: true
      };

      vm.fromAppliedDateChange = () => {
        if (vm.filter.fromAppliedDate) {
          vm.toAppliedDateOptions.minDate = (vm.filter.fromAppliedDate ? vm.filter.fromAppliedDate : new Date());
          if (new Date(vm.filter.fromAppliedDate) > new Date(vm.filter.toAppliedDate)) {
            vm.filter.toAppliedDate = null;
          }
        } else {
          vm.filter.toAppliedDate = null;
        }
      };

      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          refPaymentModeForInvoicePayment: TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code
        };
      };
      initPageInfo();
      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Applied Customer Credit Memo.csv',
        hideMultiDeleteButton: true,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerPaymentFactory.retrieveCustomerPayments().query(pagingInfoOld).$promise.then((respOfPMTData) => {
            if (respOfPMTData && respOfPMTData.data && respOfPMTData.data.invoicePayment) {
              formatDataForExport(respOfPMTData.data.invoicePayment);
              formatInvoiceNumberListOfGridData(respOfPMTData.data.invoicePayment);
              return respOfPMTData.data.invoicePayment;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //set Filter Labels
      function setFilteredLabels() {
        vm.custPaymentAdvanceFiltersConst.Customer.isDeleted = !(vm.filter && vm.filter.customer && vm.filter.customer.length > 0);
        vm.custPaymentAdvanceFiltersConst.PaymentMethod.isDeleted = !(vm.filter && vm.filter.paymentMethod && vm.filter.paymentMethod.length > 0);
        vm.custPaymentAdvanceFiltersConst.TransactionOrCreditMemoNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
        vm.custPaymentAdvanceFiltersConst.AppliedDate.isDeleted = !(vm.filter && (vm.filter.fromAppliedDate || vm.filter.toAppliedDate));
        vm.custPaymentAdvanceFiltersConst.InvoiceNumber.isDeleted = !(vm.filter && vm.filter.invoiceNumber);
        vm.custPaymentAdvanceFiltersConst.AppliedCreditMemoAmount.isDeleted = !(vm.filter && vm.filter.amount);
        vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.isDeleted = !(vm.filter && vm.filter.isIncludeVoidedTransaction);

        //==>>>Set filter tool-tip
        vm.custPaymentAdvanceFiltersConst.Customer.tooltip = getFilterTooltip(vm.customerListToDisplay, vm.filter.customer, 'id', 'mfgName');
        vm.custPaymentAdvanceFiltersConst.PaymentMethod.tooltip = getFilterTooltip(vm.paymentMethodListToDisplay, vm.filter.paymentMethod, 'gencCategoryID', 'gencCategoryName');

        if (vm.filter) {
          if (vm.filter.paymentNumber) {
            vm.custPaymentAdvanceFiltersConst.TransactionOrCreditMemoNumber.tooltip = vm.filter.paymentNumber;
          }

          if (vm.filter.fromAppliedDate && vm.filter.toAppliedDate) {
            vm.custPaymentAdvanceFiltersConst.AppliedDate.tooltip = vm.custPaymentAdvanceFiltersConst.AppliedDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromAppliedDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.filter.toAppliedDate), vm.DefaultDateFormat);
          }
          else if (vm.filter.fromAppliedDate && !vm.filter.toAppliedDate) {
            vm.custPaymentAdvanceFiltersConst.AppliedDate.tooltip = vm.custPaymentAdvanceFiltersConst.AppliedDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromAppliedDate), vm.DefaultDateFormat);
          }

          if (vm.filter.invoiceNumber) {
            vm.custPaymentAdvanceFiltersConst.InvoiceNumber.tooltip = vm.filter.invoiceNumber;
          }
          if (vm.filter.amount) {
            vm.custPaymentAdvanceFiltersConst.AppliedCreditMemoAmount.tooltip = vm.filter.amount;
          }
          if (vm.filter.isIncludeVoidedTransaction) {
            vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.tooltip = vm.filter.isIncludeVoidedTransaction;
          }
        }

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }
        vm.numberOfMasterFiltersApplied = _.filter(vm.custPaymentAdvanceFiltersConst, (num) => num.isDeleted === false).length;
      }

      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.custPaymentAdvanceFiltersConst.Customer.value:
              vm.filter.customer = [];
              break;
            case vm.custPaymentAdvanceFiltersConst.PaymentMethod.value:
              vm.filter.paymentMethod = [];
              break;
            case vm.custPaymentAdvanceFiltersConst.TransactionOrCreditMemoNumber.value:
              vm.filter.paymentNumber = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.AppliedDate.value:
              vm.filter.fromAppliedDate = null;
              vm.filter.toAppliedDate = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.InvoiceNumber.value:
              vm.filter.invoiceNumber = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.AppliedCreditMemoAmount.value:
              vm.filter.amount = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.value:
              vm.filter.isIncludeVoidedTransaction = false;
              break;
          }
          vm.loadData();
        }
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

      /* get all customer list */
      vm.getCustomer = () => {
        vm.customerSearchText = null;
        return MasterFactory.getCustomerList().query().$promise.then((response) => {
          if (response && response.data) {
            _.each(response.data, (item) => {
              item.mfgName = item.mfgCodeName;
            });
            vm.customerList = vm.customerListToDisplay = response.data;
            return $q.resolve(vm.customerList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getCustomer();

      /* get payment method - generic category */
      vm.getPaymentMethod = () => {
        vm.paymentMethodSearchText = null;
        const listObj = {
          GencCategoryType: [CORE.CategoryType.ReceivablePaymentMethods.Name],
          isActive: true
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((response) => {
          if (response && response.data) {
            vm.paymentMethodList = vm.paymentMethodListToDisplay = response.data;
            return $q.resolve(vm.paymentMethodList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getPaymentMethod();

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: '150',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3" row-entity="row.entity"></grid-action-view>',
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
          field: 'systemId',
          displayName: 'SystemID',
          width: 150,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'isTransLockedConvertedValue',
          displayName: 'Locked',
          width: 100,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':!row.entity.isTransLocked,\
                        \'label-box label-success\':row.entity.isTransLocked }"> \
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
          field: 'creditAppliedStatus',
          displayName: 'Credit Applied Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span ng-if="row.entity.creditAppliedStatus" class="label-box" ng-class="grid.appScope.$parent.vm.getClassNameForApplyCreditMemo(row.entity.creditAppliedStatus)">'
            + '{{row.entity.creditAppliedStatus}}'
            + '</span> </div> ',
          enableSorting: true,
          enableFiltering: true,
          width: '190',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: _.values(vm.ApplyCustCreditMemoStatusTextConst)
          }
        },
        {
          field: 'isPaymentVoidedBooleanConverted',
          displayName: 'Voided',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':!row.entity.isPaymentVoided,\
                        \'label-box label-success\':row.entity.isPaymentVoided }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '100',
          enableFiltering: true,
          enableSorting: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.MasterTemplateDropdown
          }
        },
        {
          field: 'customerCodeName',
          displayName: vm.LabelConstant.MFG.Customer,
          width: '320',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerDetail(row.entity.mfgcodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Customer" text="row.entity.customerCodeName"></copy-text>\
                                        </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentNumber',
          displayName: 'Transaction#',
          width: '190',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.updateRecord(row, null);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="\'Transaction#\'" text="row.entity.paymentNumber" ></copy-text>\
                          </div> ',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'creditMemoNumber',
          displayName: 'Credit Memo#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerCreditMemoDetail(row.entity.refCustCreditMemoID);" tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="\'Credit Memo#\'" text="row.entity.creditMemoNumber"></copy-text></div>',
          width: '170',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'creditMemoDate',
          displayName: 'Credit Memo Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        },
        {
          field: 'creditMemoAmount',
          displayName: 'Credit Memo Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '145',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentAmount',
          displayName: 'Applied Credit Memo Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '135',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'agreedRefundAmtCM',
          displayName: 'Agreed Refund Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '145',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'adjustmenPendingAmtOfCM',
          displayName: 'Remaining CM Amount ($) (Incl. Amt. to be Refunded)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '155',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'selectedInvoiceTotPaymentAmount',
          displayName: 'Selected Invoice Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '145',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'isMarkRefundConvertedValueCM',
          displayName: 'Mark For Refund',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':!row.entity.isMarkForRefundCM,\
                        \'label-box label-success\':row.entity.isMarkForRefundCM }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '145',
          enableFiltering: true,
          enableSorting: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.MasterTemplateDropdown
          }
        },
        {
          field: 'totRefundIssuedAgainstCreditMemo',
          displayName: 'Refunded Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.showTotRefundIssueDetAgainstCM(row.entity);"\
                                                tabindex="-1">{{COL_FIELD | amount }}</a></div>',
          width: '125',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'accountReference',
          displayName: 'Account Reference',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline" \
                                                ng-click="grid.appScope.$parent.vm.goToCustomerBillToPage(row.entity.mfgcodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a></div>',
          width: '200',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentMethod',
          displayName: 'Payment Method',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.paymentMethod">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.systemGeneratedPaymentMethod === 0 "\
                                                ng-click="grid.appScope.$parent.vm.goToPaymentMethodDetail(row.entity.paymentType);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <span ng-if="row.entity.systemGeneratedPaymentMethod === 1">{{COL_FIELD}}</span>\
                      <copy-text label="\'Payment Method\'" text="row.entity.paymentMethod"></copy-text>\
                                        </div>',
          width: '170',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'remark',
          displayName: 'Comments',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.remark" ng-click="grid.appScope.$parent.vm.showComment(row, $event, false)"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: '120'
        },
        {
          field: 'totDetLevelSelectedInvCount',
          displayName: 'No Of Item',
          cellTemplate: '<div class="ui-grid-cell-contents text-center">\
                                  <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToApplyCustCMDetailList(row.entity);$event.preventDefault();">{{row.entity.totDetLevelSelectedInvCount}}</a>',
          width: 80,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'invoiceNumberList',
          displayName: 'Invoice#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-repeat="item in row.entity.invListWithNewLine track by $index"><a class="cm-text-decoration underline" \
                                                ng-click="grid.appScope.$parent.vm.goToCustInvoiceDetail(item.invoiceMstID);"\
                                                tabindex="-1">{{item.invoiceNumber}}</a>\
                                  <span ng-if="row.entity.invListWithNewLine.length - 1 > $index">,</span>\
        </div> ',
          width: '350',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'totalDocuments',
          displayName: 'Documents',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cursor-pointer underline" \
                                                ng-if="row.entity.totalDocuments > 0" \
                                                ng-click="grid.appScope.$parent.vm.goToAppliedCreditMemoDocument(row.entity.refCustCreditMemoID, row.entity.id);"\
                                                tabindex="-1">{{COL_FIELD}}</a></div>',
          width: '120'
        },
        {
          field: 'lockedAt',
          displayName: 'Locked Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'lockedBy',
          displayName: 'Locked By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true
        },
        {
          field: 'lockedByRole',
          displayName: 'Locked By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true
        },
        {
          field: 'voidPaymentReason',
          displayName: 'Applied CM Void Reason',
          cellTemplate: '<md-button class="md-warn margin-0" ng-class="{\'md-hue-1\': !row.entity.voidPaymentReason }" ng-disabled="!row.entity.voidPaymentReason" ng-click="grid.appScope.$parent.vm.showVoidCustAppliedCMReason(row, $event)"> \
                                        View \
                                    </md-button>',
          width: 140,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'voidedAt',
          displayName: 'Voided Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          type: 'datetime',
          enableFiltering: false,
          visible: false
        },
        {
          field: 'voidedBy',
          displayName: 'Voided By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true
        },
        {
          field: 'voidedByRole',
          displayName: 'Voided By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true,
          visible: false
        },
        {
          field: 'updatedAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          type: 'datetime',
          enableFiltering: false,
          visible: false
        },
        {
          field: 'updatedby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          visible: false
        },
        {
          field: 'updatedbyRole',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: false
        },
        {
          field: 'createdAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
        }
        , {
          field: 'createdby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: false
        }
      ];

      //get rights for allow void applied CM and lock/unlock allowed or not
      vm.allowToVoidCMFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReleaseCustCM);
      vm.allowToLockUnlockCustAppliedCMFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockUnlockCustomerAppliedCM);

      //Void applied CM
      vm.voidAndReleaseInvoiceGroup = (row, event) => {
        if ((row.entity.isPaymentVoided === 1) || (!vm.allowToVoidCMFeature)) {
          return;
        }

        if (row.entity.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
          displayCustPayLockedWithNoAccess(row);
          return;
        }

        voidAndReleaseInvoiceDet(row, event);
      };

      const voidAndReleaseInvoiceDet = (row, event) => {
        const headerData = [{
          label: vm.LabelConstant.MFG.Customer,
          value: row.entity.customerCodeName,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToCustomerList();
          },
          valueLinkFn: () => {
            BaseService.goToCustomer(row.entity.mfgcodeID);
          }
        },
        {
          label: 'Transaction#',
          value: row.entity.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            BaseService.goToAppliedCustCreditMemoToInvList();
          },
          valueLinkFn: () => {
            BaseService.goToApplyCustCreditMemoToPayment(row.entity.refCustCreditMemoID, row.entity.id);
          }
        }
        ];

        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void Applied CM & Release Invoice Group',
          confirmationType: CORE.Generic_Confirmation_Type.APPLIED_CUST_CREDIT_MEMO_VOID,
          isOnlyPassword: true,
          createdBy: vm.loginUser.userid,
          updatedBy: vm.loginUser.userid,
          headerDisplayData: headerData,
          isShowHeaderData: true
        };
        return DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          event,
          invoicePaymentChange).then((pswConfirmation) => {
            if (pswConfirmation) {
              const objData = {
                id: row.entity.id,
                voidPaymentReason: pswConfirmation.approvalReason,
                refPaymentModeOfInvPayment: TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code
              };
              vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.loadData();
                } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                  messageContent.message = stringFormat(messageContent.message, row.entity.paymentNumber, 'applied credit memo', 'transaction#');
                  const model = {
                    messageContent: messageContent
                  };
                  DialogFactory.messageAlertDialog(model).then(() => {
                    vm.loadData();
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      };

      /* display customer payment locked message. not allowed to void */
      const displayCustPayLockedWithNoAccess = (row) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
        messageContent.message = stringFormat(messageContent.message, row.entity.paymentNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      };

      // display Apply Customer CM detail history
      vm.applyCustCMHistory = (row, ev) => {
        const data = {
          id: row.entity.id,
          mfgcodeID: row.entity.mfgcodeID,
          customerCodeName: row.entity.customerCodeName,
          paymentNumber: row.entity.paymentNumber,
          refCustCreditMemoID: row.entity.refCustCreditMemoID,
          refPaymentMode: CORE.RefPaymentModeForInvoicePayment.CreditMemoApplied
        };
        DialogFactory.dialogService(
          CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
          CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (invoicePayment, isGetDataDown) => {
        if (invoicePayment && invoicePayment.data && invoicePayment.data.invoicePayment) {
          if (!isGetDataDown) {
            vm.sourceData = invoicePayment.data.invoicePayment;
            vm.currentdata = vm.sourceData.length;
          }
          else if (invoicePayment.data.invoicePayment.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(invoicePayment.data.invoicePayment);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          _.each(vm.sourceData, (item) => {
            item.lockUnlockTransactionBtnText = item.lockStatus === vm.CustPaymentLockStatusConst.Locked ? 'Unlock Applied Customer Credit Memo' : 'Lock Applied Customer Credit Memo';
            item.isDisableVoidAndReleaseInvoiceGroup = (item.isPaymentVoided === 1) || (!vm.allowToVoidCMFeature);
            item.isDisabledDelete = item.isPaymentVoided === 1 ? true : false;
            item.isRowSelectable = item.isPaymentVoided === 1 ? false : true;
            item.creditMemoDate = BaseService.getUIFormatedDate(item.creditMemoDate, vm.DefaultDateFormat);
            item.isRowSelectable = item.isPaymentVoided === 1 ? false : true;
            item.isDisableLockUnlockTransaction = (!vm.allowToLockUnlockCustAppliedCMFeature || item.isPaymentVoided);
          });
          formatInvoiceNumberListOfGridData(vm.sourceData);

          // must set after new data comes
          vm.totalSourceDataCount = invoicePayment.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.customerIDs || vm.pagingInfo.paymentMethodIDs || vm.pagingInfo.paymentNumber || vm.pagingInfo.invoiceNumber || vm.pagingInfo.amount || vm.pagingInfo.fromAppliedDate || vm.pagingInfo.toAppliedDate || vm.pagingInfo.isIncludeVoidedTransaction) {
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

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      /* retrieve customer payment list */
      vm.loadData = () => {
        vm.pagingInfo.customerIDs = vm.filter.customer.join(',');
        vm.pagingInfo.paymentMethodIDs = vm.filter.paymentMethod.join(',');

        vm.pagingInfo.exactPaymentNumberSearch = (vm.filter.paymentNumberSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.paymentNumber = vm.filter.paymentNumber;

        vm.pagingInfo.exactPaymentAmountSearch = (vm.filter.paymentAmountSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.amount = vm.filter.amount;

        vm.pagingInfo.invoiceNumber = vm.filter.invoiceNumber;
        vm.pagingInfo.fromAppliedDate = (BaseService.getAPIFormatedDate(vm.filter.fromAppliedDate));
        vm.pagingInfo.toAppliedDate = (BaseService.getAPIFormatedDate(vm.filter.toAppliedDate));
        vm.pagingInfo.isIncludeVoidedTransaction = vm.filter.isIncludeVoidedTransaction || false;

        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        setFilteredLabels();
        vm.cgBusyLoading = CustomerPaymentFactory.retrieveCustomerPayments().query(vm.pagingInfo).$promise.then((invoicePayment) => {
          if (invoicePayment && invoicePayment.data) {
            setDataAfterGetAPICall(invoicePayment, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerPaymentFactory.retrieveCustomerPayments().query(vm.pagingInfo).$promise.then((invoicePayment) => {
          if (invoicePayment && invoicePayment.data) {
            setDataAfterGetAPICall(invoicePayment, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //format Alias (all in new line) Of Grid Data
      const formatInvoiceNumberListOfGridData = (custPaymentList) => {
        _.each(custPaymentList, (item) => {
          if (item.invoiceNumberList) {
            item.invListWithNewLine = item.invoiceNumberList.split('@@@@@') || [];
            _.each(item.invListWithNewLine, (aliasSplit, index) => {
              const invSplitList = aliasSplit.split('#####');
              if (Array.isArray(invSplitList) && invSplitList.length > 0) {
                const objInvDet = {
                  invoiceNumber: invSplitList[0],
                  invoiceMstID: invSplitList[1]
                };
                item.invListWithNewLine[index] = objInvDet;
              }
            });
            item.invoiceNumberList = item.invoiceNumberList ? item.invoiceNumberList.replace(/#####\d+@@@@@/g, ', ').replace(/#####\d+/g, '') : null;
          }
        });
      };

      const formatDataForExport = (custPaymentList) => {
        _.each(custPaymentList, (item) => {
          item.creditMemoDate = BaseService.getUIFormatedDate(item.creditMemoDate, vm.DefaultDateFormat);
        });
      };

      vm.updateRecord = (row) => {
        BaseService.goToApplyCustCreditMemoToPayment(row.entity.refCustCreditMemoID, row.entity.id);
      };

      vm.showComment = (row, ev) => {
        const PopupData = {
          title: 'Comments',
          description: row.entity.remark
        };
        displayComment(row, ev, PopupData);
      };

      const displayComment = (row, ev, PopupData) => {
        const headerData = [{
          label: vm.LabelConstant.MFG.Customer,
          value: row.entity.customerCodeName,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToCustomerList();
          },
          valueLinkFn: () => {
            BaseService.goToCustomer(row.entity.mfgcodeID);
          }
        },
        {
          label: 'Transaction#',
          value: row.entity.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            BaseService.goToAppliedCustCreditMemoToInvList();
          },
          valueLinkFn: () => {
            BaseService.goToApplyCustCreditMemoToPayment(row.entity.refCustCreditMemoID, row.entity.id);
          }
        },
        {
          label: vm.LabelConstant.Bank.PaymentDate,
          value: row.entity.paymentDate,
          displayOrder: 3
        }];
        PopupData.headerData = headerData;

        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          PopupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.resetFilters = () => {
        vm.filter = {
          customer: [],
          paymentMethod: [],
          paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
          paymentNumber: null,
          invoiceNumber: null,
          amount: null,
          fromAppliedDate: null,
          toAppliedDate: null,
          paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
          isIncludeVoidedTransaction: false
        };
        vm.clearCustomerSearchText();
        vm.clearPaymentMethodSearchText();
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      };

      vm.searchCustomerList = () => {
        const customerFilter = angular.copy(vm.customerList);
        vm.customerListToDisplay = vm.customerSearchText ? _.filter(customerFilter, (item) => item.mfgName.toLowerCase().contains(vm.customerSearchText.toLowerCase())) : customerFilter;
      };

      vm.searchPaymentMethodList = () => {
        const paymentMethodFilter = angular.copy(vm.paymentMethodList);
        vm.paymentMethodListToDisplay = vm.paymentMethodSearchText ? _.filter(paymentMethodFilter, (item) => item.gencCategoryName.toLowerCase().contains(vm.paymentMethodSearchText.toLowerCase())) : paymentMethodFilter;
      };


      /* display refunded amount popup to display all refunded transaction against current payment */
      vm.showTotRefundIssueDetAgainstCM = (rowEntity) => {
        const data =
        {
          id: rowEntity.refCustCreditMemoID,
          mfgCodeID: rowEntity.mfgcodeID,
          paymentCMNumber: rowEntity.creditMemoNumber,
          customerName: rowEntity.customerCodeName,
          totalPaymentAmount: rowEntity.creditMemoAmount,
          totalRefundIssuedAmount: rowEntity.totRefundIssuedAgainstCreditMemo,
          agreedRefundAmount: rowEntity.agreedRefundAmtCM,
          refGencTransModeID: CORE.GenericTransModeName.RefundPayableCMRefund.id,
          isDisplayAllTransWhereCreditUsed: false
        };

        DialogFactory.dialogService(
          TRANSACTION.CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_CONTROLLER,
          TRANSACTION.CUSTOMER_REFUND_TRANSACTION_LIST_POPUP_VIEW,
          event,
          data
        ).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      };

      // lock customer payment record from grid action
      vm.lockUnlockCustomerPayment = (rowEntity, ev, isLockTransactionAction) => {
        vm.lockUnlockCustAppliedCMDet(rowEntity, isLockTransactionAction);
      };

      /* to lock/unlock transaction - lock/unlock customer payment */
      vm.lockUnlockCustAppliedCMDet = (rowEntity, isLockTransactionAction) => {
        if (!vm.allowToLockUnlockCustAppliedCMFeature) {
          return;
        }

        const isLockTransactionOnRecords = (rowEntity && rowEntity.lockStatus !== vm.CustPaymentLockStatusConst.Locked) || isLockTransactionAction ? true : false;

        if (isLockTransactionOnRecords) { // make transaction lock
          // check for any record already in locked mode
          let isAnyLockedCustPayment = false;
          if (rowEntity) {
            isAnyLockedCustPayment = rowEntity.lockStatus === vm.CustPaymentLockStatusConst.Locked;
          } else {
            isAnyLockedCustPayment = _.some(vm.selectedRowsList, (payItem) => payItem.lockStatus === vm.CustPaymentLockStatusConst.Locked);
          }
          if (isAnyLockedCustPayment) {
            displayAlreadyLockedPMTMsg(rowEntity);
            return;
          }
        } else {  // make transaction unlock
          // check for any record already in unlocked mode
          let isAnyUnlockedCustPayment = false;
          if (rowEntity) {
            isAnyUnlockedCustPayment = rowEntity.lockStatus !== vm.CustPaymentLockStatusConst.Locked;
          } else {
            isAnyUnlockedCustPayment = _.some(vm.selectedRowsList, (payItem) => payItem.lockStatus !== vm.CustPaymentLockStatusConst.Locked);
          }
          if (isAnyUnlockedCustPayment) {
            displayAlreadyUnlockedPMTMsg(rowEntity);
            return;
          }
        }

        const selectedRowListForLockUnlock = [];
        if (rowEntity) {
          selectedRowListForLockUnlock.push({
            invPaymentMstID: rowEntity.id,
            invCMMstID: rowEntity.refCustCreditMemoID
          });
        } else {
          if (vm.selectedRowsList.length > 0) {
            _.each(vm.selectedRowsList, (rowItem) => {
              const _obj = {
                invPaymentMstID: rowItem.id,
                invCMMstID: rowItem.refCustCreditMemoID
              };
              selectedRowListForLockUnlock.push(_obj);
            });
          }
        }

        if (selectedRowListForLockUnlock && selectedRowListForLockUnlock.length > 0) {
          let msgCntForLockUnlockTrans = null;
          if (isLockTransactionOnRecords) {
            msgCntForLockUnlockTrans = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOCK_RECORD_CONFIRMATION);
          } else {
            msgCntForLockUnlockTrans = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNLOCK_RECORD_CONFIRMATION);
          }
          const obj = {
            messageContent: msgCntForLockUnlockTrans,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objCustPaymentLock = {
            custPaymentListForLock: selectedRowListForLockUnlock,
            isLockTransaction: isLockTransactionOnRecords,
            refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code,
            isViewToBeLockUnlockRecords: true
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              lockUnlockDefinedTrans(objCustPaymentLock, rowEntity, isLockTransactionOnRecords);
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // to be lock unlock definded transaction api call
      const lockUnlockDefinedTrans = (objCustPaymentLock, rowEntity, isLockTransactionOnRecords) => {
        vm.cgBusyLoading = CustomerPaymentFactory.lockUnlockAppliedCustCreditMemo().query({ objCustPayDet: objCustPaymentLock }).$promise.then((resp) => {
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (objCustPaymentLock.isViewToBeLockUnlockRecords && resp.data && resp.data.toBeLockUnlockInvCMPMTList && resp.data.toBeLockUnlockInvCMPMTList.length > 0) {
              // open popup to display to Be Lock Unlock InvCMPMTList and then continue
              const invCMPMTListData = {
                toBeLockUnlockInvCMPMTList: resp.data.toBeLockUnlockInvCMPMTList,
                isLockTransaction: isLockTransactionOnRecords
              };

              DialogFactory.dialogService(
                TRANSACTION.VIEW_CUST_TRANS_LIST_TO_BE_LOCK_UNLOCK_MODAL_CONTROLLER,
                TRANSACTION.VIEW_CUST_TRANS_LIST_TO_BE_LOCK_UNLOCK_MODAL_VIEW,
                event,
                invCMPMTListData).then((isContinueToLockUnlock) => {
                  if (isContinueToLockUnlock && objCustPaymentLock.isViewToBeLockUnlockRecords) {
                    objCustPaymentLock.isViewToBeLockUnlockRecords = false;
                    lockUnlockDefinedTrans(objCustPaymentLock, rowEntity, isLockTransactionOnRecords);
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.loadData();
            }
          } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
            if (resp.errors.data.isSomePMTAlreadyVoided) {
              const msgContentForAlreadyLock = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED_FOR_LOCK_UNLOCK);
              msgContentForAlreadyLock.message = stringFormat(msgContentForAlreadyLock.message, ((rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected'), paymentEntityNmForLock);
              const obj = {
                messageContent: msgContentForAlreadyLock,
                multiple: true
              };
              DialogFactory.messageAlertDialog(obj);
              return;
            } else if (resp.errors.data.isSomePMTAlreadyLockedUnlocked) {
              if (isLockTransactionOnRecords) {
                displayAlreadyLockedPMTMsg(rowEntity);
              } else {
                displayAlreadyUnlockedPMTMsg(rowEntity);
              }
            } else if (resp.errors.data.isAnyInvCMWhichNotFullyApplied) {
              displayCMAdjustmentPendingAmtMsg(rowEntity);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // display message for transactions already locked
      const displayAlreadyLockedPMTMsg = (rowEntity) => {
        const msgContentForAlreadyLock = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_LOCKED_FOR_LOCK);
        msgContentForAlreadyLock.message = stringFormat(msgContentForAlreadyLock.message, ((rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected'), paymentEntityNmForLock);
        const obj = {
          messageContent: msgContentForAlreadyLock,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      };

      // display message for transactions already unlocked
      const displayAlreadyUnlockedPMTMsg = (rowEntity) => {
        const msgContentForAlreadyLock = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_UNLOCKED_FOR_UNLOCK);
        msgContentForAlreadyLock.message = stringFormat(msgContentForAlreadyLock.message, ((rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected'), paymentEntityNmForLock);
        const obj = {
          messageContent: msgContentForAlreadyLock,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      };

      // display adjustment pending amount for applied Credit memo
      const displayCMAdjustmentPendingAmtMsg = (rowEntity) => {
        const msgContentForPendingAdjustmentAmt = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_CM_PENDING_ADJUSTMENT_AMT_FOR_LOCK);
        msgContentForPendingAdjustmentAmt.message = stringFormat(msgContentForPendingAdjustmentAmt.message, (rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected');
        const obj = {
          messageContent: msgContentForPendingAdjustmentAmt,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      };

      vm.showVoidCustAppliedCMReason = (row, ev) => {
        const PopupData = {
          title: 'Void Customer Applied CM Reason',
          description: row.entity.voidPaymentReason
        };
        displayComment(row, ev, PopupData);
      };
      vm.clearCustomerSearchText = () => {
        vm.customerSearchText = null;
        vm.searchCustomerList();
      };

      vm.clearPaymentMethodSearchText = () => {
        vm.paymentMethodSearchText = null;
        vm.searchPaymentMethodList();
      };

      vm.clearCustomerFilter = () => {
        vm.filter.customer = [];
      };

      vm.clearPaymentMethodFilter = () => {
        vm.filter.paymentMethod = [];
      };

      /* go to customer applied credit memo detail list tab with filter */
      vm.goToApplyCustCMDetailList = (rowEntity) => {
        BaseService.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE,
          {
            paymentMstID: rowEntity.id,
            paymentNumber: rowEntity.paymentNumber
          });
      };

      vm.goToCustomerDetail = (mfgcodeID) => {
        BaseService.goToCustomer(mfgcodeID);
      };

      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      };

      vm.goToPaymentMethod = () => {
        BaseService.goToGenericCategoryReceivablePaymentMethodList();
      };

      vm.goToPaymentMethodDetail = (paymentType) => {
        BaseService.openInNew(USER.ADMIN_RECEIVABLE_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: paymentType });
      };

      vm.goToAppliedCreditMemoDocument = (custCreditMemoMstID, custPaymentMstID) => {
        BaseService.goToAppliedCustCreditMemoDocument(custCreditMemoMstID, custPaymentMstID);
      };

      /* to go at customer invoice page  */
      vm.goToCustInvoiceDetail = (invoiceMstID) => {
        BaseService.goToManageCustomerInvoice(invoiceMstID);
      };

      //go to customer credit memo detail page
      vm.goToCustomerCreditMemoDetail = (creditMemoMstID) => {
        BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
      };

      /* to get/apply class for customer payment status */
      vm.getCustPaymentStatusClassName = (paymentStatus) => BaseService.getCustPaymentStatusClassName(paymentStatus);

      /* to go at customer bill to address page */
      vm.goToCustomerBillToPage = (customerID) => {
        BaseService.goToCustomer(customerID, true);
      };

      // get class for applying credit memo
      vm.getClassNameForApplyCreditMemo = (statusText) => {
        const status = _.find(_.values(vm.ApplyCustCreditMemoStatusTextConst), (item) => item.value === statusText);
        return status ? status.ClassName : '';
      };

      /* to add new transaction record */
      vm.addRecord = () => {
        BaseService.goToApplyCustCreditMemoToPayment();
      };
    }
  }
})();
