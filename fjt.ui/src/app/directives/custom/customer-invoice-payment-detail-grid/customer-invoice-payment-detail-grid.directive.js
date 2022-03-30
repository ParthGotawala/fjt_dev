(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customerInvoicePaymentDetailGrid', customerInvoicePaymentDetailGrid);

  /** @ngInject */
  function customerInvoicePaymentDetailGrid(BaseService, $timeout, $q, CORE, USER, MasterFactory, TRANSACTION, CustomerPaymentFactory, DialogFactory, $filter, GenericCategoryFactory, BankFactory, EmployeeFactory, $location) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        /* directive is for >> Customer Payment , Customer Applied Credit Memo , Customer Applied Write Off */
        pRecvRefPaymentMode: '='
      },
      templateUrl: 'app/directives/custom/customer-invoice-payment-detail-grid/customer-invoice-payment-detail-grid.html',
      controller: customerInvoicePaymentDetailGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function customerInvoicePaymentDetailGridCtrl($scope) {
      const vm = this;
      vm.loginUser = BaseService.loginUser;
      vm.isHideDelete = true;
      vm.isUpdatable = true;
      vm.pRecvRefPaymentMode = $scope.pRecvRefPaymentMode;
      vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.paramSearchObj = $location.search();
      vm.ApplyCustCreditMemoStatusTextConst = TRANSACTION.ApplyCustomerCreditMemoStatusText;

      if (vm.paramSearchObj) {
        vm.paramSearchObj.paymentMstID = vm.paramSearchObj.paymentMstID ? parseInt(vm.paramSearchObj.paymentMstID) : null;
      }

      // set grid header label,  width and other details based on reference payment type
      if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
        vm.isViewInvoiceDetails = vm.isPaymentHistory = true;

        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_PAYMENT;
        vm.paymentGridID = CORE.gridConfig.gridCustomerPaymentDetail;
        vm.historyActionButtonText = 'Payment History';

        vm.payCheckNumSHColNm = 'Payment# or Check#';
        vm.payCheckNumSHColWidth = '230';
        vm.payCheckNumAFLbl = 'Payment# or Check#';
        vm.payAmountSHColNm = 'Payment Amount ($)';
        vm.payAmountSHColWidth = '165';
        vm.paymentDateSHColNm = 'Payment Date';
        vm.paymentDateSHColWidth = '100';
        vm.paymentMethodSHColWidth = '200';
        vm.invoiceDepositAmountSHColNm = 'Invoice Deposit Amount ($)';
        vm.addNewTransactionFor = 'Receive Payment';
      } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
        vm.isApplyCustCMHistory = true;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.APPLY_CREDIT_MEMO_TO_INV_PAYMENT;
        vm.paymentGridID = CORE.gridConfig.gridAppliedCustCreditMemoToInvDetail;

        vm.payCheckNumSHColNm = 'Transaction#';
        vm.payCheckNumSHColWidth = '180';
        vm.payCheckNumAFLbl = 'Transaction# or Credit Memo#';
        vm.payAmountSHColNm = 'Total Applied Credit Memo Amount ($)';
        vm.payAmountSHColWidth = '160';
        vm.paymentMethodSHColWidth = '200';
        vm.invoiceDepositAmountSHColNm = 'Invoice Applied CM Amount ($)';
        vm.addNewTransactionFor = 'Apply Credit Memo To Invoice';
      } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
        vm.isPaymentHistory = true;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.APPLY_WRITE_OFF_TO_INV_PAYMENT;
        vm.paymentGridID = CORE.gridConfig.gridAppliedCustWriteOffToInvDetail;
        vm.historyActionButtonText = 'Write Off History';

        vm.payCheckNumSHColNm = 'Write Off#';
        vm.payCheckNumSHColWidth = '180';
        vm.payCheckNumAFLbl = 'Write Off#';
        vm.payAmountSHColNm = 'Total Write Off Amount ($)';
        vm.payAmountSHColWidth = '120';
        vm.paymentDateSHColNm = 'Write Off Date';
        vm.paymentDateSHColWidth = '100';
        vm.paymentMethodSHColWidth = '110';
        vm.invoiceDepositAmountSHColNm = 'Write Off Amount Applied to Invoice ($)';
        vm.addNewTransactionFor = 'Apply Write Off To Invoice';
      }

      vm.EmptyFilterMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
      vm.debounceTimeInterval = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachType = vm.CheckSearchTypeList[1].id;
      vm.custPaymentAdvanceFiltersConst = TRANSACTION.CustomerPaymentAdvanceFilters;

      vm.dateOption = {
        fromDateOpenFlag: false,
        toDateOpenFlag: false,
        fromInvoiceDateOpenFlag: false,
        toInvoiceDateOpenFlag: false,
        fromAppliedDateOpenFlag: false,
        toAppliedDateOpenFlag: false
      };

      vm.reTryCount = 0;
      vm.filter = {
        customer: [],
        paymentMethod: [],
        bankAccountCode: [],
        paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
        paymentNumber: vm.paramSearchObj ? vm.paramSearchObj.paymentNumber : null,
        invoiceNumber: null,
        amount: null,
        paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
        fromDate: null,
        toDate: null,
        fromInvoiceDate: null,
        toInvoiceDate: null,
        fromAppliedDate: null,
        toAppliedDate: null,
        isDisplayZeroPaymentDataOnly: false,
        isIncludeVoidedTransaction: false
      };

      vm.fromPaymentDateOptions = {
        appendToBody: true
      };

      vm.toPaymentDateOptions = {
        appendToBody: true
      };

      vm.fromInvoiceDateOptions = {
        appendToBody: true
      };

      vm.toInvoiceDateOptions = {
        appendToBody: true
      };

      vm.fromAppliedDateOptions = {
        appendToBody: true
      };

      vm.toAppliedDateOptions = {
        appendToBody: true
      };

      vm.fromPaymentDateChange = () => {
        if (vm.filter.fromDate) {
          vm.toPaymentDateOptions.minDate = (vm.filter.fromDate ? vm.filter.fromDate : new Date());
          if (new Date(vm.filter.fromDate) > new Date(vm.filter.toDate)) {
            vm.filter.toDate = null;
          }
        } else {
          vm.filter.toDate = null;
        }
      };

      vm.fromInvoiceDateChange = () => {
        if (vm.filter.fromInvoiceDate) {
          vm.toInvoiceDateOptions.minDate = (vm.filter.fromInvoiceDate ? vm.filter.fromInvoiceDate : new Date());
          if (new Date(vm.filter.fromInvoiceDate) > new Date(vm.filter.toInvoiceDate)) {
            vm.filter.toInvoiceDate = null;
          }
        } else {
          vm.filter.toInvoiceDate = null;
        }
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
          refPaymentModeForInvoicePayment: vm.pRecvRefPaymentMode
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
        exporterCsvFilename: 'Customer Invoice Payment Details.csv',
        hideMultiDeleteButton: true,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerPaymentFactory.retrieveCustInvPaymentDetailList().query(pagingInfoOld).$promise.then((respOfPMTData) => {
            if (respOfPMTData && respOfPMTData.data && respOfPMTData.data.invoicePayment) {
              return respOfPMTData.data.invoicePayment;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
        vm.gridOptions.exporterCsvFilename = 'Applied Credit Memo Details.csv';
      } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
        vm.gridOptions.exporterCsvFilename = 'Applied Write Off Details.csv';
      }

      //set Filter Labels
      function setFilteredLabels() {
        vm.custPaymentAdvanceFiltersConst.Customer.isDeleted = !(vm.filter && vm.filter.customer && vm.filter.customer.length > 0);
        vm.custPaymentAdvanceFiltersConst.PaymentMethod.isDeleted = !(vm.filter && vm.filter.paymentMethod && vm.filter.paymentMethod.length > 0);
        vm.custPaymentAdvanceFiltersConst.BankAccountCode.isDeleted = !(vm.filter && vm.filter.bankAccountCode && vm.filter.bankAccountCode.length > 0);
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          vm.custPaymentAdvanceFiltersConst.PaymentOrCheckNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
          vm.custPaymentAdvanceFiltersConst.PaymentAmount.isDeleted = !(vm.filter && vm.filter.amount);
          vm.custPaymentAdvanceFiltersConst.PaymentDate.isDeleted = !(vm.filter && (vm.filter.fromDate || vm.filter.toDate));
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
          vm.custPaymentAdvanceFiltersConst.TransactionOrCreditMemoNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
          vm.custPaymentAdvanceFiltersConst.TotAppliedCMAmount.isDeleted = !(vm.filter && vm.filter.amount);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          vm.custPaymentAdvanceFiltersConst.WriteOffNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
          vm.custPaymentAdvanceFiltersConst.WriteOffAmount.isDeleted = !(vm.filter && vm.filter.amount);
          vm.custPaymentAdvanceFiltersConst.WriteOffDate.isDeleted = !(vm.filter && (vm.filter.fromDate || vm.filter.toDate));
        }

        vm.custPaymentAdvanceFiltersConst.InvoiceDate.isDeleted = !(vm.filter && (vm.filter.fromInvoiceDate || vm.filter.toInvoiceDate));
        vm.custPaymentAdvanceFiltersConst.AppliedDate.isDeleted = !(vm.filter && (vm.filter.fromAppliedDate || vm.filter.toAppliedDate));
        vm.custPaymentAdvanceFiltersConst.InvoiceNumber.isDeleted = !(vm.filter && vm.filter.invoiceNumber);
        vm.custPaymentAdvanceFiltersConst.IsShowZeroPaymentOnly.isDeleted = !(vm.filter && vm.filter.isDisplayZeroPaymentDataOnly);
        vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.isDeleted = !(vm.filter && vm.filter.isIncludeVoidedTransaction);

        //==>>>Set filter tool-tip
        vm.custPaymentAdvanceFiltersConst.Customer.tooltip = getFilterTooltip(vm.customerListToDisplay, vm.filter.customer, 'id', 'mfgName');
        vm.custPaymentAdvanceFiltersConst.PaymentMethod.tooltip = getFilterTooltip(vm.paymentMethodListToDisplay, vm.filter.paymentMethod, 'gencCategoryID', 'gencCategoryName');
        vm.custPaymentAdvanceFiltersConst.BankAccountCode.tooltip = getFilterTooltip(vm.bankAccountCodeListToDisplay, vm.filter.bankAccountCode, 'id', 'accountCode');

        if (vm.filter) {
          if (vm.filter.paymentNumber) {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              vm.custPaymentAdvanceFiltersConst.PaymentOrCheckNumber.tooltip = vm.filter.paymentNumber;
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
              vm.custPaymentAdvanceFiltersConst.TransactionOrCreditMemoNumber.tooltip = vm.filter.paymentNumber;
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              vm.custPaymentAdvanceFiltersConst.WriteOffNumber.tooltip = vm.filter.paymentNumber;
            }
          }
          if (vm.filter.fromDate && vm.filter.toDate) {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              vm.custPaymentAdvanceFiltersConst.PaymentDate.tooltip = vm.custPaymentAdvanceFiltersConst.PaymentDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.filter.toDate), vm.DefaultDateFormat);
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              vm.custPaymentAdvanceFiltersConst.WriteOffDate.tooltip = vm.custPaymentAdvanceFiltersConst.WriteOffDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.filter.toDate), vm.DefaultDateFormat);
            }
          }
          else if (vm.filter.fromDate && !vm.filter.toDate) {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              vm.custPaymentAdvanceFiltersConst.PaymentDate.tooltip = vm.custPaymentAdvanceFiltersConst.PaymentDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat);
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              vm.custPaymentAdvanceFiltersConst.WriteOffDate.tooltip = vm.custPaymentAdvanceFiltersConst.WriteOffDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat);
            }
          }

          if (vm.filter.fromInvoiceDate && vm.filter.toInvoiceDate) {
            vm.custPaymentAdvanceFiltersConst.InvoiceDate.tooltip = vm.custPaymentAdvanceFiltersConst.InvoiceDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromInvoiceDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.filter.toInvoiceDate), vm.DefaultDateFormat);
          }
          else if (vm.filter.fromInvoiceDate && !vm.filter.toInvoiceDate) {
            vm.custPaymentAdvanceFiltersConst.InvoiceDate.tooltip = vm.custPaymentAdvanceFiltersConst.InvoiceDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromInvoiceDate), vm.DefaultDateFormat);
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
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              vm.custPaymentAdvanceFiltersConst.PaymentAmount.tooltip = vm.filter.amount;
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
              vm.custPaymentAdvanceFiltersConst.TotAppliedCMAmount.tooltip = vm.filter.amount;
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              vm.custPaymentAdvanceFiltersConst.WriteOffAmount.tooltip = vm.filter.amount;
            }
          }
          if (vm.filter.isDisplayZeroPaymentDataOnly) {
            vm.custPaymentAdvanceFiltersConst.IsShowZeroPaymentOnly.tooltip = vm.filter.isDisplayZeroPaymentDataOnly;
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
            case vm.custPaymentAdvanceFiltersConst.BankAccountCode.value:
              vm.filter.bankAccountCode = [];
              break;
            case vm.custPaymentAdvanceFiltersConst.PaymentOrCheckNumber.value:
            case vm.custPaymentAdvanceFiltersConst.WriteOffNumber.value:
              vm.filter.paymentNumber = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.TransactionOrCreditMemoNumber.value:
              vm.filter.paymentNumber = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.PaymentDate.value:
            case vm.custPaymentAdvanceFiltersConst.WriteOffDate.value:
              vm.filter.fromDate = null;
              vm.filter.toDate = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.InvoiceDate.value:
              vm.filter.fromInvoiceDate = null;
              vm.filter.toInvoiceDate = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.AppliedDate.value:
              vm.filter.fromAppliedDate = null;
              vm.filter.toAppliedDate = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.InvoiceNumber.value:
              vm.filter.invoiceNumber = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.PaymentAmount.value:
              vm.filter.amount = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.TotAppliedCMAmount.value:
              vm.filter.amount = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.IsShowZeroPaymentOnly.value:
              vm.filter.isDisplayZeroPaymentDataOnly = false;
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

      /* get bank account code list from master */
      vm.getBankAccountCode = () => {
        vm.bankAccountCodeSearchText = null;
        return BankFactory.getBankList().query().$promise.then((response) => {
          if (response && response.data) {
            vm.bankAccountCodeList = vm.bankAccountCodeListToDisplay = response.data;
            return $q.resolve(vm.bankAccountCodeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getBankAccountCode();

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: 125,
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
          displayName: vm.payCheckNumSHColNm,
          width: vm.payCheckNumSHColWidth,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerPaymentDetailPage(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="\'Payment# or Check#\'" text="row.entity.paymentNumber" ></copy-text>\
                          </div> ',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'paymentAmount',
          displayName: vm.payAmountSHColNm,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: vm.payAmountSHColWidth,
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
          width: vm.paymentMethodSHColWidth,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'invoiceNumber',
          displayName: 'Invoice#',
          cellTemplate: '<div class="ui-grid-cell-contents"><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustInvoiceDetail(row.entity.invoiceMstID);$event.preventDefault();">{{row.entity.invoiceNumber}}</a> \
                          <copy-text  label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber" text="row.entity.invoiceNumber" ng-if="row.entity.invoiceNumber"> </copy-text>\
                               <md-tooltip ng-if="row.entity.invoiceNumber">{{row.entity.invoiceNumber}}</md-tooltip></div>',
          width: '150'
        },
        {
          field: 'invoiceDate',
          displayName: 'Invoice Date',
          width: '90',
          type: 'date',
          enableFiltering: false
        },
        {
          field: 'invoiceOrgAmount',
          displayName: 'Invoice Org. Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '130',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'invoiceDepositAmount',
          displayName: vm.invoiceDepositAmountSHColNm,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '130',
          enableFiltering: true,
          enableSorting: true
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
          visible: vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code ? true : false
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

      /* add fields conditional for >> Customer Payment , Customer Applied Credit Memo , Customer Applied Write Off */
      if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code || vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
        const paymentDateSHCol = {
          field: 'paymentDate',
          displayName: vm.paymentDateSHColNm,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: vm.paymentDateSHColWidth,
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        };
        vm.sourceHeader.splice(4, 0, paymentDateSHCol);

        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          const isPaymentVoidedConvertedValueSHCol = {
            field: 'isPaymentVoidedConvertedValue',
            displayName: 'Payment Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustPaymentStatusClassName(row.entity.isPaymentVoidedConvertedValue)">'
              + '{{COL_FIELD}}'
              + '</span>'
              + '</div>',
            width: 160,
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            ColumnDataType: 'StringEquals',
            filter: {
              term: null,
              options: CORE.CustPaymentStatusGridHeaderDropdown
            }
          };
          const RefundPaymentStatusSHCol = {
            field: 'refundPaymentStatusText',
            displayName: 'Payment Refund Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustRefundPaymentStatusClassName(row.entity.refundStatus)">'
              + '{{COL_FIELD}}'
              + '</span>'
              + '</div>',
            width: 190,
            enableFiltering: false
          };
          const depositBatchNumberSHCol = {
            field: 'depositBatchNumber',
            displayName: 'Deposit Batch#',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
            width: '130',
            ColumnDataType: 'StringEquals'
          };
          const bankAccountNoSHCol = {
            field: 'bankAccountNo',
            displayName: vm.LabelConstant.Bank.BankAccountCode,
            width: '200',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.bankAccountNo">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.updateBank(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="grid.appScope.$parent.vm.LabelConstant.Bank.BankAccountCode" text="row.entity.bankAccountNo"></copy-text>\
                                        </div>',
            enableFiltering: false,
            enableSorting: true
          };
          const bankNameSHCol = {
            field: 'bankName',
            displayName: 'Bank Name',
            width: '250',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.bankName">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.updateBank(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="\'Bank Name\'" text="row.entity.bankName"></copy-text>\
                                        </div>',
            enableFiltering: true,
            enableSorting: true
          };
          vm.sourceHeader.splice(1, 0, isPaymentVoidedConvertedValueSHCol);
          vm.sourceHeader.splice(2, 0, RefundPaymentStatusSHCol);
          vm.sourceHeader.splice(3, 0, depositBatchNumberSHCol);
          vm.sourceHeader.splice(9, 0, bankAccountNoSHCol);
          vm.sourceHeader.splice(10, 0, bankNameSHCol);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          const refGencTransModeIDTextSHCol = {
            field: 'refGencTransModeIDText',
            displayName: 'Transaction Mode',
            width: '110',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            enableFiltering: true,
            enableSorting: true
          };
          vm.sourceHeader.splice(10, 0, refGencTransModeIDTextSHCol);
        }
      } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
        const creditAppliedStatusSHCol = {
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
        };
        const creditMemoNumberSHCol = {
          field: 'creditMemoNumber',
          displayName: 'Credit Memo#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerCreditMemoDetail(row.entity.refCustCreditMemoID);" tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="\'Credit Memo#\'" text="row.entity.creditMemoNumber"></copy-text></div>',
          width: '170',
          enableFiltering: false,
          enableSorting: true
        };
        const creditMemoDateSHCol = {
          field: 'creditMemoDate',
          displayName: 'Credit Memo Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        };
        const creditMemoAmountSHCol = {
          field: 'creditMemoAmount',
          displayName: 'Credit Memo Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '145',
          enableFiltering: true,
          enableSorting: true
        };
        const appliedDateSHCol = {
          field: 'appliedDate',
          displayName: 'Applied Date',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '90',
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        };
        vm.sourceHeader.splice(3, 0, creditAppliedStatusSHCol);
        vm.sourceHeader.splice(4, 0, creditMemoNumberSHCol);
        vm.sourceHeader.splice(5, 0, creditMemoDateSHCol);
        vm.sourceHeader.splice(6, 0, creditMemoAmountSHCol);
        vm.sourceHeader.splice(13, 0, appliedDateSHCol);
      }


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
            item.invoiceDate = BaseService.getUIFormatedDate(item.invoiceDate, vm.DefaultDateFormat);
            if (item.paymentDate) {
              item.paymentDate = BaseService.getUIFormatedDate(item.paymentDate, vm.DefaultDateFormat);
            }
            if (item.creditMemoDate) {
              item.creditMemoDate = BaseService.getUIFormatedDate(item.creditMemoDate, vm.DefaultDateFormat);
            }
            if (item.appliedDate) {
              item.appliedDate = BaseService.getUIFormatedDate(item.appliedDate, vm.DefaultDateFormat);
            }
          });

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
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.customerIDs || vm.pagingInfo.paymentMethodIDs || vm.pagingInfo.bankAccountCodeIDs || vm.pagingInfo.paymentNumber || vm.pagingInfo.invoiceNumber || vm.pagingInfo.amount || vm.pagingInfo.fromDate || vm.pagingInfo.toDate || vm.pagingInfo.fromInvoiceDate || vm.pagingInfo.toInvoiceDate || vm.pagingInfo.fromAppliedDate || vm.pagingInfo.toAppliedDate || vm.pagingInfo.isDisplayZeroPaymentDataOnly) {
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
        vm.pagingInfo.refPaymentMstID = vm.paramSearchObj ? vm.paramSearchObj.paymentMstID : null;
        vm.pagingInfo.customerIDs = vm.filter.customer.join(',');
        vm.pagingInfo.paymentMethodIDs = vm.filter.paymentMethod.join(',');
        vm.pagingInfo.bankAccountCodeIDs = vm.filter.bankAccountCode.join(',');

        vm.pagingInfo.exactPaymentNumberSearch = (vm.filter.paymentNumberSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.paymentNumber = vm.filter.paymentNumber;

        vm.pagingInfo.exactPaymentAmountSearch = (vm.filter.paymentAmountSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.amount = vm.filter.amount;

        vm.pagingInfo.invoiceNumber = vm.filter.invoiceNumber;
        vm.pagingInfo.fromDate = (BaseService.getAPIFormatedDate(vm.filter.fromDate));
        vm.pagingInfo.toDate = (BaseService.getAPIFormatedDate(vm.filter.toDate));
        vm.pagingInfo.fromInvoiceDate = (BaseService.getAPIFormatedDate(vm.filter.fromInvoiceDate));
        vm.pagingInfo.toInvoiceDate = (BaseService.getAPIFormatedDate(vm.filter.toInvoiceDate));
        vm.pagingInfo.fromAppliedDate = (BaseService.getAPIFormatedDate(vm.filter.fromAppliedDate));
        vm.pagingInfo.toAppliedDate = (BaseService.getAPIFormatedDate(vm.filter.toAppliedDate));
        vm.pagingInfo.isDisplayZeroPaymentDataOnly = vm.filter.isDisplayZeroPaymentDataOnly;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        setFilteredLabels();
        vm.cgBusyLoading = CustomerPaymentFactory.retrieveCustInvPaymentDetailList().query(vm.pagingInfo).$promise.then((invoicePayment) => {
          if (invoicePayment && invoicePayment.data) {
            setDataAfterGetAPICall(invoicePayment, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerPaymentFactory.retrieveCustInvPaymentDetailList().query(vm.pagingInfo).$promise.then((invoicePayment) => {
          if (invoicePayment && invoicePayment.data) {
            setDataAfterGetAPICall(invoicePayment, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to add new transaction record */
      vm.addRecord = () => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(0);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
          BaseService.goToApplyCustCreditMemoToPayment(0, null);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(0);
        }
      };

      vm.resetFilters = () => {
        vm.paramSearchObj = null;
        vm.filter = {
          customer: [],
          paymentMethod: [],
          bankAccountCode: [],
          paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
          paymentNumber: null,
          invoiceNumber: null,
          amount: null,
          fromDate: null,
          toDate: null,
          fromInvoiceDate: null,
          toInvoiceDate: null,
          fromAppliedDate: null,
          toAppliedDate: null,
          paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
          isDisplayZeroPaymentDataOnly: false
        };
        vm.clearCustomerSearchText();
        vm.clearPaymentMethodSearchText();
        vm.clearBankAccountCodeSearchText();
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

      vm.searchBankAccountCodeList = () => {
        const bankAccountCodeFilter = angular.copy(vm.bankAccountCodeList);
        vm.bankAccountCodeListToDisplay = vm.bankAccountCodeSearchText ? _.filter(bankAccountCodeFilter, (item) => item.accountCode.toLowerCase().contains(vm.bankAccountCodeSearchText.toLowerCase())) : bankAccountCodeFilter;
      };

      vm.clearCustomerSearchText = () => {
        vm.customerSearchText = null;
        vm.searchCustomerList();
      };

      vm.clearPaymentMethodSearchText = () => {
        vm.paymentMethodSearchText = null;
        vm.searchPaymentMethodList();
      };

      vm.clearBankAccountCodeSearchText = () => {
        vm.bankAccountCodeSearchText = null;
        vm.searchBankAccountCodeList();
      };

      vm.clearCustomerFilter = () => {
        vm.filter.customer = [];
      };

      vm.clearPaymentMethodFilter = () => {
        vm.filter.paymentMethod = [];
      };

      vm.clearBankAccountCodeFilter = () => {
        vm.filter.bankAccountCode = [];
      };

      // to update bank details
      vm.updateBank = (row) => {
        const loginUserAllAccessPageRoute = _.map(BaseService.loginUserPageList, (item) => item.PageDetails && item.PageDetails.pageRoute);
        if (!_.find(loginUserAllAccessPageRoute, (item) => item === USER.ADMIN_BANK_STATE)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
          messageContent.message = stringFormat(messageContent.message, USER.ADMIN_BANK_LABEL.toLowerCase());
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        } else {
          const PopupData = {
            id: row.bankAccountMasID
          };
          DialogFactory.dialogService(
            USER.ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER,
            USER.ADMIN_BANK_ADD_UPDATE_MODAL_VIEW,
            event,
            PopupData).then(() => {
              // response block
            }, () => {
              // cancel block
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      vm.updateRecord = (row, ev) => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(row.entity.paymentMstID);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.CreditMemoApplied.code) {
          BaseService.goToApplyCustCreditMemoToPayment(row.entity.refCustCreditMemoID, row.entity.paymentMstID);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(row.entity.paymentMstID);
        }
      };

      // display payment detail history
      vm.paymentHistory = (row, ev) => {
        const data = {
          id: row.entity.paymentMstID,
          mfgcodeID: row.entity.mfgcodeID,
          customerCodeName: row.entity.customerCodeName,
          bankAccountNo: row.entity.bankAccountNo,
          paymentDate: row.entity.paymentDate,
          paymentNumber: row.entity.paymentNumber,
          refPaymentMode: vm.pRecvRefPaymentMode
        };
        DialogFactory.dialogService(
          CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
          CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
          ev,
          data).then(() => {
            // response block
          }, () => {
            // cancel block
          }, (err) => BaseService.getErrorLog(err));
      };

      // display Apply Customer CM detail history
      vm.applyCustCMHistory = (row, ev) => {
        const data = {
          id: row.entity.paymentMstID,
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

      /* to view all selected (paid) invoice  */
      vm.viewInvoiceDetails = (row) => {
        if (row.entity && row.entity.paymentMstID) {
          const PopupParamData = {
            popupTitle: 'View Invoice Details',
            custPaymentMstID: row.entity.paymentMstID,
            mfgcodeID: row.entity.mfgcodeID,
            customerFullName: row.entity.customerCodeName,
            paymentNumber: row.entity.paymentNumber,
            isReadOnlyMode: true
          };

          DialogFactory.dialogService(
            TRANSACTION.VOID_REISSUE_CUST_PAYMENT_MODAL_CONTROLLER,
            TRANSACTION.VOID_REISSUE_CUST_PAYMENT_MODAL_VIEW,
            event,
            PopupParamData).then(() => {
              // response block
            }, () => {
              // success block
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      // get class for applying credit memo
      vm.getClassNameForApplyCreditMemo = (statusText) => {
        const status = _.find(_.values(vm.ApplyCustCreditMemoStatusTextConst), (item) => item.value === statusText);
        return status ? status.ClassName : '';
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

      vm.goToBankList = () => {
        BaseService.goToBankList();
      };

      // to go at customer payment detail page
      vm.goToCustomerPaymentDetailPage = (rowEntity) => {
        if (rowEntity.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(rowEntity.paymentMstID);
        } else if (rowEntity.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code) {
          BaseService.goToApplyCustCreditMemoToPayment(rowEntity.refCustCreditMemoID, rowEntity.paymentMstID);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(rowEntity.paymentMstID);
        }
      };

      vm.goToCustomerPaymentDocument = (custPaymentMstID) => {
        BaseService.goToCustomerPaymentDocument(custPaymentMstID);
      };

      /* to go at customer invoice page  */
      vm.goToCustInvoiceDetail = (invoiceMstID) => {
        BaseService.goToManageCustomerInvoice(invoiceMstID);
      };

      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* to get/apply class for customer payment lock status */
      vm.getCustPaymentLockStatusClassName = (lockStatus) => BaseService.getCustPaymentLockStatusClassName(lockStatus);

      /* to get/apply class for customer payment status */
      vm.getCustPaymentStatusClassName = (paymentStatus) => BaseService.getCustPaymentStatusClassName(paymentStatus);

      /* to get/apply class for customer refund payment status */
      vm.getCustRefundPaymentStatusClassName = (refundStatus) => BaseService.getCustRefundPaymentStatusClassName(refundStatus);

      /* called for min date validation */
      vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

      /* to go at customer bill to address page */
      vm.goToCustomerBillToPage = (customerID) => {
        BaseService.goToCustomer(customerID, false);
      };

      // go to customer credit memo
      vm.goToCustomerCreditMemoDetail = (creditMemoMstID) => {
        BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
      };
    }
  }
})();
