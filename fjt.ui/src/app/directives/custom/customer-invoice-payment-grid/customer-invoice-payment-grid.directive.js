(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customerInvoicePaymentGrid', customerInvoicePaymentGrid);

  /** @ngInject */
  function customerInvoicePaymentGrid(BaseService, $timeout, $q, CORE, USER, MasterFactory, TRANSACTION, CustomerPaymentFactory,
    DialogFactory, $filter, GenericCategoryFactory, BankFactory, PackingSlipFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        /* directive is for >> Customer Payment , Customer Applied Write Off */
        pRecvRefPaymentMode: '='
      },
      templateUrl: 'app/directives/custom/customer-invoice-payment-grid/customer-invoice-payment-grid.html',
      controller: customerInvoicePaymentGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function customerInvoicePaymentGridCtrl($scope) {
      const vm = this;
      vm.pRecvRefPaymentMode = $scope.pRecvRefPaymentMode;
      vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
      vm.isUpdatable = true;
      vm.isHideDelete = true;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyFilterMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
      vm.debounceTimeInterval = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachType = vm.CheckSearchTypeList[1].id;
      vm.custPaymentAdvanceFiltersConst = TRANSACTION.CustomerPaymentAdvanceFilters;
      vm.CustomerPaymentRefundStatusTextConst = TRANSACTION.CustomerPaymentRefundStatusText;
      let paymentEntityNmForLock = null;
      vm.dateOption = {
        fromDateOpenFlag: false,
        toDateOpenFlag: false
      };

      vm.filter = {
        customer: [],
        paymentMethod: [],
        bankAccountCode: [],
        paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
        paymentNumber: null,
        invoiceNumber: null,
        amount: null,
        paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
        fromDate: null,
        toDate: null,
        isDisplayZeroPaymentDataOnly: false,
        isIncludeVoidedTransaction: false
      };

      // set default display tab
      if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
        vm.isViewInvoiceDetails = vm.isVoidAndReReceivePayment = vm.isVoidPaymentAndReleaseInvoiceGroup = vm.isPaymentHistory = vm.isViewLockCustomerPayment = true;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_PAYMENT;
        vm.paymentGridID = CORE.gridConfig.gridCustomerPaymentSummary;
        vm.historyActionButtonText = 'Payment History';
        paymentEntityNmForLock = 'customer payment(s)';

        vm.payCheckNumSHColNm = 'Payment# or Check#';
        vm.payCheckNumSHColWidth = '230';
        vm.payAmountSHColNm = 'Payment Amount ($)';
        vm.payAmountSHColWidth = '165';
        vm.paymentDateSHColNm = 'Payment Date';
        vm.paymentDateSHColWidth = '100';
        vm.paymentMethodSHColWidth = '200';
        vm.voidPaymentReasonSHColNm = 'Void Payment Reason';
        vm.addNewTransactionFor = 'Receive Payment';

        vm.allowToLockUnlockCustPaymentTransFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockUnlockCustomerPayment);
      } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
        vm.isVoidWOFFAndReleaseInvoiceGroup = vm.isPaymentHistory = vm.isViewLockCustomerPayment = true;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.APPLY_WRITE_OFF_TO_INV_PAYMENT;
        vm.paymentGridID = CORE.gridConfig.gridCustomerWriteOffSummary;
        vm.historyActionButtonText = 'Write Off History';
        paymentEntityNmForLock = 'customer Write Off(s)';

        vm.payCheckNumSHColNm = 'Write Off#';
        vm.payCheckNumSHColWidth = '180';
        vm.payAmountSHColNm = 'Write Off Amount ($)';
        vm.payAmountSHColWidth = '120';
        vm.paymentDateSHColNm = 'Write Off Date';
        vm.paymentDateSHColWidth = '100';
        vm.paymentMethodSHColWidth = '110';
        vm.voidPaymentReasonSHColNm = 'Write Off Void Reason';
        vm.addNewTransactionFor = 'Apply Write Off To Invoice';

        vm.allowToLockUnlockCustPaymentTransFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockUnlockCustomerWriteOff);
      }

      vm.fromPaymentDateOptions = {
        //minDate: new Date(),
        appendToBody: true
      };

      vm.toPaymentDateOptions = {
        //minDate: new Date(),
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

      /* get all feature rights for customer payment / write off */
      const getAllFeatureRights = () => {
        vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssueCustomerPayment);
        vm.allowToVoidCustWriteOffAndReleaseInv = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidCustWriteOffAndReleaseInv);
      };
      getAllFeatureRights();

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
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Customer Payment Summary.csv',
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

      if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
        vm.gridOptions.exporterCsvFilename = 'Applied Write Off Summary.csv';
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
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          vm.custPaymentAdvanceFiltersConst.WriteOffNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
          vm.custPaymentAdvanceFiltersConst.WriteOffAmount.isDeleted = !(vm.filter && vm.filter.amount);
          vm.custPaymentAdvanceFiltersConst.WriteOffDate.isDeleted = !(vm.filter && (vm.filter.fromDate || vm.filter.toDate));
        }
        vm.custPaymentAdvanceFiltersConst.InvoiceNumber.isDeleted = !(vm.filter && vm.filter.invoiceNumber);
        vm.custPaymentAdvanceFiltersConst.IsShowZeroPaymentOnly.isDeleted = !(vm.filter && vm.filter.isDisplayZeroPaymentDataOnly);
        vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.isDeleted = !(vm.filter && vm.filter.isIncludeVoidedTransaction);
        vm.custPaymentAdvanceFiltersConst.PaymentRefundStatus.isDeleted = !(vm.isRefundNotApplicable || vm.isPendingRefund || vm.isPartialCMRefunded || vm.isFullCMRefunded);

        //==>>>Set filter tool-tip
        vm.custPaymentAdvanceFiltersConst.Customer.tooltip = getFilterTooltip(vm.customerListToDisplay, vm.filter.customer, 'id', 'mfgName');
        vm.custPaymentAdvanceFiltersConst.PaymentMethod.tooltip = getFilterTooltip(vm.paymentMethodListToDisplay, vm.filter.paymentMethod, 'gencCategoryID', 'gencCategoryName');
        vm.custPaymentAdvanceFiltersConst.BankAccountCode.tooltip = getFilterTooltip(vm.bankAccountCodeListToDisplay, vm.filter.bankAccountCode, 'id', 'accountCode');

        if (vm.filter) {
          if (vm.filter.paymentNumber) {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              vm.custPaymentAdvanceFiltersConst.PaymentOrCheckNumber.tooltip = vm.filter.paymentNumber;
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
          if (vm.filter.invoiceNumber) {
            vm.custPaymentAdvanceFiltersConst.InvoiceNumber.tooltip = vm.filter.invoiceNumber;
          }
          if (vm.filter.amount) {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              vm.custPaymentAdvanceFiltersConst.PaymentAmount.tooltip = vm.filter.amount;
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              vm.custPaymentAdvanceFiltersConst.WriteOffAmount.tooltip = vm.filter.amount;
            }
          }
          if (vm.filter.isDisplayZeroPaymentDataOnly) {
            vm.custPaymentAdvanceFiltersConst.IsShowZeroPaymentOnly.tooltip = vm.filter.isDisplayZeroPaymentDataOnly;
          }
          if (vm.filter.isIncludeVoidedTransaction) {
            vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.tooltip = vm.filter.isIncludeVoidedTransaction;
          }
          // Payment refund Status filter
          vm.pagingInfo.paymentRefundStatusFilter = null;
          if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
            let strPaymentRefundStatusFilter = null;
            if (vm.isRefundNotApplicable) {
              strPaymentRefundStatusFilter = stringFormat('{0},{1}', strPaymentRefundStatusFilter, vm.CustomerPaymentRefundStatusTextConst.NotApplicable.Code);
            }
            if (vm.isPendingRefund) {
              strPaymentRefundStatusFilter = stringFormat('{0},{1}', strPaymentRefundStatusFilter, vm.CustomerPaymentRefundStatusTextConst.PendingRefund.Code);
            }
            if (vm.isPartialCMRefunded) {
              strPaymentRefundStatusFilter = stringFormat('{0},{1}', strPaymentRefundStatusFilter, vm.CustomerPaymentRefundStatusTextConst.PartialPaymentRefunded.Code);
            }
            if (vm.isFullCMRefunded) {
              strPaymentRefundStatusFilter = stringFormat('{0},{1}', strPaymentRefundStatusFilter, vm.CustomerPaymentRefundStatusTextConst.FullPaymentRefunded.Code);
            }
            vm.pagingInfo.paymentRefundStatusFilter = strPaymentRefundStatusFilter;
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
            case vm.custPaymentAdvanceFiltersConst.PaymentDate.value:
            case vm.custPaymentAdvanceFiltersConst.WriteOffDate.value:
              vm.filter.fromDate = null;
              vm.filter.toDate = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.InvoiceNumber.value:
            case vm.custPaymentAdvanceFiltersConst.WriteOffAmount.value:
              vm.filter.invoiceNumber = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.PaymentAmount.value:
              vm.filter.amount = null;
              break;
            case vm.custPaymentAdvanceFiltersConst.IsShowZeroPaymentOnly.value:
              vm.filter.isDisplayZeroPaymentDataOnly = false;
              break;
            case vm.custPaymentAdvanceFiltersConst.IsIncludeVoidedTransaction.value:
              vm.filter.isIncludeVoidedTransaction = false;
              break;
            case vm.custPaymentAdvanceFiltersConst.PaymentRefundStatus.value:
              vm.isRefundNotApplicable = vm.isPendingRefund = vm.isPartialCMRefunded = vm.isFullCMRefunded = false;
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
          field: 'systemId',
          displayName: 'SystemID',
          width: 135,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
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
          field: 'paymentAmount',
          displayName: vm.payAmountSHColNm,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: vm.payAmountSHColWidth,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentNumber',
          displayName: vm.payCheckNumSHColNm,
          width: vm.payCheckNumSHColWidth,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerPaymentDetailPage(row.entity.id);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="grid.appScope.$parent.vm.payCheckNumSHColNm" text="row.entity.paymentNumber" ></copy-text>\
                          <md-icon md-font-icon="" class="material-icons mat-icon icon-lock" style="margin-left:5px !important;"  \
                                ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.CustPaymentLockStatusConst.Locked">\
                                <md-tooltip ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.CustPaymentLockStatusConst.Locked">Payment Locked</md-tooltip>\
                          </md- icon ></div> ',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'paymentDate',
          displayName: vm.paymentDateSHColNm,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: vm.paymentDateSHColWidth,
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
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
          field: 'totDetLevelSelectedInvCount',
          displayName: 'No Of Item',
          cellTemplate: '<div class="ui-grid-cell-contents text-center">\
                                  <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerInvPaymentDetailList(row.entity);$event.preventDefault();">{{row.entity.totDetLevelSelectedInvCount}}</a>',
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
          field: 'totalDocuments',
          displayName: 'Documents',
          cellTemplate: '<div class="ui-grid-cell-contents text-right"><a class="cursor-pointer underline" \
                                                ng-if="row.entity.totalDocuments > 0" \
                                                ng-click="grid.appScope.$parent.vm.goToCustomerPaymentDocument(row.entity.id);"\
                                                tabindex="-1">{{COL_FIELD}}</a></div>',
          width: '110'
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
          displayName: vm.voidPaymentReasonSHColNm,
          cellTemplate: '<md-button class="md-warn margin-0" ng-class="{\'md-hue-1\': !row.entity.voidPaymentReason }" ng-disabled="!row.entity.voidPaymentReason" ng-click="grid.appScope.$parent.vm.showVoidPaymentReason(row, $event)"> \
                                        View \
                                    </md-button>',
          width: 130,
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
          visible: false
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
        const lockStatusConvertedValueSHCol = {
          field: 'lockStatusConvertedValue',
          displayName: 'Lock Status',
          width: 145,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustPaymentLockStatusClassName(row.entity.lockStatus)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          enableSorting: true,
          enableFiltering: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: TRANSACTION.CustomerPaymentLockStatusGridHeaderDropdown
          }
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
        const selectedInvoiceTotPaymentAmountSHCol = {
          field: 'selectedInvoiceTotPaymentAmount',
          displayName: 'Selected Invoice Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true
        };
        const adjustmenPendingAmtSHCol = {
          field: 'adjustmenPendingAmt',
          displayName: 'Remaining Amt. ($) (Incl. Amt. to be Refunded)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '165',
          enableFiltering: true,
          enableSorting: true,
          ColumnDataType: 'StringEquals'
        };
        const isMarkRefundConvertedValueCPSHCol = {
          field: 'isMarkRefundConvertedValueCP',
          displayName: 'Mark For Refund',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':!row.entity.isMarkForRefundCP,\
                        \'label-box label-success\':row.entity.isMarkForRefundCP }"> \
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
        };
        const agreedRefundAmtCPSHCol = {
          field: 'agreedRefundAmtCP',
          displayName: 'Agreed Refund Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '135',
          enableFiltering: true,
          enableSorting: true
        };
        const totRefundIssuedOfPaymentCPSHCol = {
          field: 'totRefundIssuedOfPayment',
          displayName: 'Refunded Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.showTotRefundIssueDetAgainstPayment(row.entity);"\
                                                tabindex="-1">{{COL_FIELD | amount }}</a></div>',
          width: '125',
          enableFiltering: true,
          enableSorting: true
        };
        const depositBatchNumberSHCol = {
          field: 'depositBatchNumber',
          displayName: 'Deposit Batch#',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '130',
          ColumnDataType: 'StringEquals'
        };

        const refVoidedPaymentNumberSHCol = {
          field: 'refVoidedPaymentNumber',
          displayName: 'Ref Voided Payment# Or Check#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.refVoidedPaymentNumber"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerPaymentDetailPage(row.entity.refVoidedPaymentId);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="\'Ref Voided Payment# Or Check#\'" text="row.entity.refVoidedPaymentNumber"></copy-text></div> ',
          width: '190',
          enableFiltering: true,
          enableSorting: true
        };

        vm.sourceHeader.splice(3, 0, isPaymentVoidedConvertedValueSHCol);
        vm.sourceHeader.splice(4, 0, lockStatusConvertedValueSHCol);
        vm.sourceHeader.splice(5, 0, RefundPaymentStatusSHCol);
        vm.sourceHeader.splice(7, 0, bankAccountNoSHCol);
        vm.sourceHeader.splice(8, 0, bankNameSHCol);
        vm.sourceHeader.splice(10, 0, selectedInvoiceTotPaymentAmountSHCol);
        vm.sourceHeader.splice(11, 0, adjustmenPendingAmtSHCol);
        vm.sourceHeader.splice(17, 0, isMarkRefundConvertedValueCPSHCol);
        vm.sourceHeader.splice(18, 0, agreedRefundAmtCPSHCol);
        vm.sourceHeader.splice(19, 0, totRefundIssuedOfPaymentCPSHCol);
        vm.sourceHeader.splice(20, 0, depositBatchNumberSHCol);
        vm.sourceHeader.splice(27, 0, refVoidedPaymentNumberSHCol);
      } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
        const isTransLockedConvertedValueSHCol = {
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
        };
        const isVoidedConvertedValueSHCol = {
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
        };
        const refGencTransModeIDTextSHCol = {
          field: 'refGencTransModeIDText',
          displayName: 'Transaction Mode',
          width: '110',
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        };
        vm.sourceHeader.splice(2, 0, isTransLockedConvertedValueSHCol);
        vm.sourceHeader.splice(3, 0, isVoidedConvertedValueSHCol);
        vm.sourceHeader.splice(10, 0, refGencTransModeIDTextSHCol);
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
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              item.lockUnlockTransactionBtnText = item.lockStatus === vm.CustPaymentLockStatusConst.Locked ? 'Unlock Customer Payment' : 'Lock Customer Payment';
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              item.lockUnlockTransactionBtnText = item.lockStatus === vm.CustPaymentLockStatusConst.Locked ? 'Unlock Write Off' : 'Lock Write Off';
            }
            item.isDisableVoidAndReIssuePayment = (item.isPaymentVoided === 1) || (!vm.allowToVoidAndReIssuePaymentFeature);
            item.isDisableVoidPaymentAndReleaseInvoiceGroup = item.isDisableVoidAndReleaseInvoiceGroup = (item.isPaymentVoided === 1) || (!vm.allowToVoidAndReIssuePaymentFeature);
            item.isDisableVoidWOFFAndReleaseInvoiceGroup = (item.isPaymentVoided === 1) || (!vm.allowToVoidCustWriteOffAndReleaseInv);
            item.isDisabledDelete = item.isPaymentVoided === 1 ? true : false;
            item.isRowSelectable = item.isPaymentVoided === 1 ? false : true;
            item.paymentDate = BaseService.getUIFormatedDate(item.paymentDate, vm.DefaultDateFormat);
            item.isDisableLockUnlockTransaction = (!vm.allowToLockUnlockCustPaymentTransFeature || item.isPaymentVoided);
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
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.customerIDs || vm.pagingInfo.paymentMethodIDs || vm.pagingInfo.bankAccountCodeIDs || vm.pagingInfo.paymentNumber || vm.pagingInfo.invoiceNumber || vm.pagingInfo.amount || vm.pagingInfo.fromDate || vm.pagingInfo.toDate || vm.pagingInfo.isDisplayZeroPaymentDataOnly || vm.pagingInfo.isIncludeVoidedTransaction || vm.pagingInfo.paymentRefundStatusFilter) {
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

      const formatDataForExport = (custPaymentList) => {
        _.each(custPaymentList, (item) => {
          item.paymentDate = BaseService.getUIFormatedDate(item.paymentDate, vm.DefaultDateFormat);
        });
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      /* retrieve customer payment list */
      vm.loadData = () => {
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
        vm.pagingInfo.isDisplayZeroPaymentDataOnly = vm.filter.isDisplayZeroPaymentDataOnly;
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

      /* to add new transaction record */
      vm.addRecord = () => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(0);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(0);
        }
      };

      vm.updateRecord = (row, ev) => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(row.entity.id);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(row.entity.id);
        }
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

      vm.showComment = (row, ev) => {
        const PopupData = {
          title: 'Comments',
          description: row.entity.remark
        };
        displayComment(row, ev, PopupData);
      };

      vm.showVoidPaymentReason = (row, ev) => {
        const PopupData = {
          title: vm.voidPaymentReasonSHColNm,
          description: row.entity.voidPaymentReason
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
          label: vm.payCheckNumSHColNm,
          value: row.entity.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              BaseService.goToCustomerPaymentList();
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              BaseService.goToAppliedCustWriteOffToInvList();
            }
          },
          valueLinkFn: () => {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              BaseService.goToCustomerPaymentDetail(row.entity.id);
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              BaseService.goToApplyCustWriteOffToPayment(row.entity.id);
            }
          }
        },
        {
          label: vm.paymentDateSHColNm,
          value: row.entity.paymentDate,
          displayOrder: 3
        }];
        PopupData.headerData = headerData;

        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          PopupData).then(() => {
            // response block
          }, (err) => BaseService.getErrorLog(err));
      };

      /* delete customer payment */
      vm.deleteRecord = (row) => {
        let isAnyLockedCustPayment = false;
        if (row) {
          isAnyLockedCustPayment = row.lockStatus === vm.CustPaymentLockStatusConst.Locked;
        } else {
          isAnyLockedCustPayment = _.some(vm.selectedRowsList, (payItem) => payItem.lockStatus === vm.CustPaymentLockStatusConst.Locked);
        }
        if (isAnyLockedCustPayment) {
          const obj = {
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_ALREADY_LOCKED_DELETE_DENIED),
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);
          return;
        }

        let selectedIDs = [];
        if (row) {
          selectedIDs.push(row.id);
        } else {
          if (vm.selectedRowsList.length > 0) {
            selectedIDs = vm.selectedRowsList.map((item) => item.id);
          }
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Customer payment', selectedIDs.length);
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
              vm.cgBusyLoading = CustomerPaymentFactory.deleteCustomerPayment().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data) {
                  if (res.data.length > 0 || res.data.transactionDetails) {
                    const data = {
                      TotalCount: res.data.transactionDetails[0].TotalCount,
                      pageName: CORE.PageName.CustomerPayment
                    };
                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                      const objIDs = {
                        id: selectedIDs,
                        CountList: true
                      };
                      return CustomerPaymentFactory.deleteCustomerPayment().query({ objIDs: objIDs }).$promise.then((res) => {
                        let data = {};
                        data = res.data;
                        data.pageTitle = row ? row.firstName : null;
                        data.PageName = CORE.PageName.CustomerPayment;
                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                        if (res.data) {
                          DialogFactory.dialogService(
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                            ev,
                            data).then(() => {
                              // response block
                            }, () => {
                              // cancel block
                            });
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    });
                  }
                  else {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    vm.gridOptions.clearSelectedRows();
                  }
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.resetFilters = () => {
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
          paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
          isDisplayZeroPaymentDataOnly: false,
          isIncludeVoidedTransaction: false,
          paymentRefundStatusFilter: null
        };
        vm.isRefundNotApplicable = vm.isPendingRefund = vm.isPartialCMRefunded = vm.isFullCMRefunded = false;
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

      // lock customer payment record from grid action
      vm.lockUnlockCustomerPayment = (rowEntity, ev, isLockTransactionAction) => {
        vm.lockUnlockCustomerPaymentDet(rowEntity, isLockTransactionAction);
      };

      /* to lock/unlock transaction - lock/unlock customer payment */
      vm.lockUnlockCustomerPaymentDet = (rowEntity, isLockTransactionAction) => {
        if (!vm.allowToLockUnlockCustPaymentTransFeature) {
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

          // check for any record having adjustment pending amount (Payment Variance)
          let isAnyAdjustmentPendingAmtOfCustPay = false;
          if (rowEntity) {
            isAnyAdjustmentPendingAmtOfCustPay = rowEntity.adjustmenPendingAmt && rowEntity.adjustmenPendingAmt > 0;
          } else {
            isAnyAdjustmentPendingAmtOfCustPay = _.some(vm.selectedRowsList, (payItem) => payItem.adjustmenPendingAmt && payItem.adjustmenPendingAmt > 0);
          }
          if (isAnyAdjustmentPendingAmtOfCustPay) {
            const msgContentForPendingAdjustmentAmt = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_PENDING_ADJUSTMENT_AMT_FOR_LOCK);
            msgContentForPendingAdjustmentAmt.message = stringFormat(msgContentForPendingAdjustmentAmt.message, (rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected');
            const obj = {
              messageContent: msgContentForPendingAdjustmentAmt,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
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
            lockStatus: vm.CustPaymentLockStatusConst.Locked
          });
        } else {
          if (vm.selectedRowsList.length > 0) {
            _.each(vm.selectedRowsList, (rowItem) => {
              const _obj = {
                invPaymentMstID: rowItem.id,
                lockStatus: isLockTransactionOnRecords ? vm.CustPaymentLockStatusConst.Locked : vm.CustPaymentLockStatusConst.ReadyToLock
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
            refPaymentMode: vm.pRecvRefPaymentMode,
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
        vm.cgBusyLoading = CustomerPaymentFactory.lockUnlockCustomerPayment().query({ objCustPayDet: objCustPaymentLock }).$promise.then((resp) => {
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

      /* Void Write off & Release Invoice Group functionality */
      vm.voidAndReleaseInvoiceGroup = (row, event) => {
        vm.voidPaymentAndReleaseInvoiceGroup(row, event);
      };

      /* Void Payment & Release Invoice Group functionality */
      vm.voidPaymentAndReleaseInvoiceGroup = (row, event) => {
        if ((row.entity.isPaymentVoided === 1) || (!vm.allowToVoidAndReIssuePaymentFeature)) {
          return;
        }

        if (row.entity.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
          displayCustPayLockedWithNoAccess(row);
          return;
        }

        voidPaymentAndReleaseInvoiceDet(row, event);
      };

      const voidPaymentAndReleaseInvoiceDet = (row, event) => {
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
          label: vm.payCheckNumSHColNm,
          value: row.entity.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              BaseService.goToCustomerPaymentList();
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              BaseService.goToAppliedCustWriteOffToInvList();
            }
          },
          valueLinkFn: () => {
            if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
              BaseService.goToCustomerPaymentDetail(row.entity.id);
            } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
              BaseService.goToApplyCustWriteOffToPayment(row.entity.id);
            }
          }
        }
        ];

        let voidAndReleasePaymentHeaderText = null;
        let refPaymentModeForVoid = null;
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          voidAndReleasePaymentHeaderText = 'Void Payment & Release Invoice Group';
          refPaymentModeForVoid = CORE.RefPaymentModeForInvoicePayment.Receivable;
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          voidAndReleasePaymentHeaderText = 'Void WOFF & Release Invoice Group';
          refPaymentModeForVoid = TRANSACTION.ReceivableRefPaymentMode.Writeoff.code;
        }

        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: voidAndReleasePaymentHeaderText,
          confirmationType: CORE.Generic_Confirmation_Type.CUSTOMER_PAYMENT_VOID,
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
                refPaymentModeOfInvPayment: refPaymentModeForVoid
              };
              vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.loadData();
                } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                  let voidForEntity = null;
                  let paymentNumFieldText = null;
                  if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
                    voidForEntity = 'customer payment';
                    paymentNumFieldText = 'payment# or check#';
                  } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
                    voidForEntity = 'applied write off';
                    paymentNumFieldText = 'write off#';
                  }

                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                  messageContent.message = stringFormat(messageContent.message, row.entity.paymentNumber, voidForEntity, paymentNumFieldText);
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
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
      };

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

      /* Void current payment and reissue new payment */
      vm.voidAndReIssuePayment = (row, event) => {
        if ((row.entity.isPaymentVoided === 1) || (!vm.allowToVoidAndReIssuePaymentFeature)) {
          return;
        }

        if (row.entity.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
          displayCustPayLockedWithNoAccess(row);
          return;
        }

        voidAndReIssuePaymentDet(row, event);
      };

      const voidAndReIssuePaymentDet = (row, event) => {
        if (row.entity && row.entity.id) {
          const PopupParamData = {
            popupTitle: 'Void & Re-Receive Payment',
            custPaymentMstID: row.entity.id,
            mfgcodeID: row.entity.mfgcodeID,
            customerFullName: row.entity.customerCodeName,
            paymentNumber: row.entity.paymentNumber,
            isReadOnlyMode: false
          };

          DialogFactory.dialogService(
            TRANSACTION.VOID_REISSUE_CUST_PAYMENT_MODAL_CONTROLLER,
            TRANSACTION.VOID_REISSUE_CUST_PAYMENT_MODAL_VIEW,
            event,
            PopupParamData).then(() => {
              // response block
            }, (resp) => {
              if (resp) {
                //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.loadData();
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      // display payment detail history
      vm.paymentHistory = (row, ev) => {
        const data = {
          id: row.entity.id,
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

      /* to view all selected (paid) invoice  */
      vm.viewInvoiceDetails = (row) => {
        if (row.entity && row.entity.id) {
          const PopupParamData = {
            popupTitle: 'View Invoice Details',
            custPaymentMstID: row.entity.id,
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


      /* display refunded amount popup to display all refunded transaction against current payment */
      vm.showTotRefundIssueDetAgainstPayment = (rowEntity) => {
        const data =
        {
          id: rowEntity.id,
          mfgCodeID: rowEntity.mfgcodeID,
          paymentCMNumber: rowEntity.paymentNumber,
          customerName: rowEntity.customerCodeName,
          totalPaymentAmount: rowEntity.paymentAmount,
          totalRefundIssuedAmount: rowEntity.totRefundIssuedOfPayment,
          agreedRefundAmount: rowEntity.agreedRefundAmtCP,
          refGencTransModeID: CORE.GenericTransModeName.RefundPayablePayRefund.id,
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
      vm.goToCustomerPaymentDetailPage = (custPaymentMstID) => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDetail(custPaymentMstID);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToApplyCustWriteOffToPayment(custPaymentMstID);
        }
      };

      vm.goToCustomerPaymentDocument = (custPaymentMstID) => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.goToCustomerPaymentDocument(custPaymentMstID);
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.goToAppliedCustWriteOffDocument(custPaymentMstID);
        }
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

      /* go to customer invoice detail list tab with filter */
      vm.goToCustomerInvPaymentDetailList = (rowEntity) => {
        if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.ReceivablePayment.code) {
          BaseService.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE,
            {
              paymentMstID: rowEntity.id,
              paymentNumber: rowEntity.paymentNumber
            });
        } else if (vm.pRecvRefPaymentMode === vm.receivableRefPaymentModeConst.Writeoff.code) {
          BaseService.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_DETAIL_LIST_STATE,
            {
              paymentMstID: rowEntity.id,
              paymentNumber: rowEntity.paymentNumber
            });
        }
      };

      /* to go at customer bill to address page */
      vm.goToCustomerBillToPage = (customerID) => {
        BaseService.goToCustomer(customerID, false);
      };
    }
  }
})();
