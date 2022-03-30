(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customerRefundGrid', customerRefundGrid);

  /** @ngInject */
  function customerRefundGrid(BaseService, $timeout, $q, CORE, USER, MasterFactory, TRANSACTION, CustomerRefundFactory,
    DialogFactory, $filter, GenericCategoryFactory, BankFactory, CustomerPaymentFactory, TransactionModesFactory, PackingSlipFactory, ReportMasterFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        /* directive is for >> Customer Refund Details List*/
        pRecvRefundRefPaymentMode: '='
      },
      templateUrl: 'app/directives/custom/customer-refund-grid/customer-refund-grid.html',
      controller: customerRefundGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function customerRefundGridCtrl($scope) {
      const vm = this;
      vm.pRecvRefundRefPaymentMode = $scope.pRecvRefundRefPaymentMode;
      vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
      vm.isUpdatable = vm.isVoidPaymentAndReleaseInvoiceGroup = vm.isPaymentHistory = vm.isPrintRemittance = vm.isPrintCheck = vm.isViewLockCustomerPayment = true;
      vm.historyActionButtonText = 'Refund History';
      vm.voidPaymentAndReleaseInvoiceGroupActionButtonText = 'Void Customer Refund';
      vm.isHideDelete = true;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmptyFilterMesssage = CORE.EMPTYSTATE.EMPTY_SEARCH;
      vm.debounceTimeInterval = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachType = vm.CheckSearchTypeList[1].id;
      vm.custRefundAdvanceFiltersConst = TRANSACTION.CustomerRefundAdvanceFilters;
      vm.custRefundSubStatusIDDetListCont = vm.refundSubStatusListToDisplay = _.values(angular.copy(TRANSACTION.CustomerRefundSubStatusIDDet));
      vm.custRefundSubStatusListGHDropdown = angular.copy(vm.custRefundSubStatusIDDetListCont);
      vm.custRefundSubStatusListGHDropdown.unshift({ id: null, value: 'All' });
      vm.custRefundMarkAsPaidStatusList = _.values(angular.copy(TRANSACTION.CustRefundMarkAsPaidStatusDet));
      vm.custRefundMarkAsPaidStatusList.unshift({ id: null, value: 'All' });
      vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;

      vm.dateOption = {
        fromDateOpenFlag: false,
        toDateOpenFlag: false
      };
      vm.dateCMPaymentOption = {
        fromDateCMPaymentOpenFlag: false,
        toDateCMPaymentOpenFlag: false
      };

      /* get all feature rights for customer refund */
      const getAllFeatureRights = () => {
        vm.allowToVoidCustRefundFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidCustomerRefund);
        vm.allowToLockUnlockCustRefundFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockUnlockCustomerRefund);
      };
      getAllFeatureRights();

      vm.reTryCount = 0;
      vm.filter = {
        customer: [],
        paymentMethod: [],
        bankAccountCode: [],
        transactionMode: [],
        refundSubStatus: [],
        paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
        paymentNumber: null,
        paymentCMNumber: null,
        amount: null,
        refundAmountSearchType: vm.CheckSearchTypeList[1].id,
        fromDate: null,
        toDate: null,
        isIncludeVoidedTransaction: false
      };

      // vm.isViewPaymentCMDetails = true;
      const paymentEntityNmForLock = 'customer refund';
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_REFUND;

      vm.payCheckNumSHColNm = 'Payment# or Check#';
      vm.payCheckNumSHColWidth = '230';
      vm.payAmountSHColNm = 'Refund Amount ($)';
      vm.payAmountSHColWidth = '165';
      vm.paymentDateSHColNm = 'Refund Date';
      vm.paymentCMDateSHColNm = 'CM Date or Payment Date';
      vm.paymentDateSHColWidth = '100';
      vm.paymentMethodSHColWidth = '200';
      vm.voidPaymentReasonSHColNm = 'Void Refund Reason';

      vm.fromPaymentDateOptions = {
        //minDate: new Date(),
        appendToBody: true
      };

      vm.toPaymentDateOptions = {
        //minDate: new Date(),
        appendToBody: true
      };

      vm.fromPaymentCMDateOptions = {
        //minDate: new Date(),
        appendToBody: true
      };

      vm.toPaymentCMDateOptions = {
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

      vm.fromPaymentCMDateChange = () => {
        if (vm.filter.fromCMPaymentDate) {
          vm.toPaymentCMDateOptions.minDate = (vm.filter.fromCMPaymentDate ? vm.filter.fromCMPaymentDate : new Date());
          if (new Date(vm.filter.fromCMPaymentDate) > new Date(vm.filter.toCMPaymentDate)) {
            vm.filter.toCMPaymentDate = null;
          }
        } else {
          vm.filter.toCMPaymentDate = null;
        }
      };

      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          refPaymentModeForRefund: vm.pRecvRefundRefPaymentMode
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
        exporterCsvFilename: 'Customer Refund Summary.csv',
        hideMultiDeleteButton: true,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerRefundFactory.retrieveCustomerRefunds().query(pagingInfoOld).$promise.then((respOfRefundData) => {
            if (respOfRefundData && respOfRefundData.data && respOfRefundData.data.refundDetails) {
              formatDataForExport(respOfRefundData.data.refundDetails);
              formatPaymentCMListOfGridData(respOfRefundData.data.refundDetails);
              return respOfRefundData.data.refundDetails;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //set Filter Labels
      function setFilteredLabels() {
        vm.custRefundAdvanceFiltersConst.Customer.isDeleted = !(vm.filter && vm.filter.customer && vm.filter.customer.length > 0);
        vm.custRefundAdvanceFiltersConst.PaymentMethod.isDeleted = !(vm.filter && vm.filter.paymentMethod && vm.filter.paymentMethod.length > 0);
        vm.custRefundAdvanceFiltersConst.BankAccountCode.isDeleted = !(vm.filter && vm.filter.bankAccountCode && vm.filter.bankAccountCode.length > 0);
        vm.custRefundAdvanceFiltersConst.TransactionMode.isDeleted = !(vm.filter && vm.filter.transactionMode && vm.filter.transactionMode.length > 0);
        vm.custRefundAdvanceFiltersConst.SubStatus.isDeleted = !(vm.filter && vm.filter.refundSubStatus && vm.filter.refundSubStatus.length > 0);
        vm.custRefundAdvanceFiltersConst.PaymentOrCheckNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
        vm.custRefundAdvanceFiltersConst.RefundAmount.isDeleted = !(vm.filter && vm.filter.amount);
        vm.custRefundAdvanceFiltersConst.RefundDate.isDeleted = !(vm.filter && (vm.filter.fromDate || vm.filter.toDate));
        vm.custRefundAdvanceFiltersConst.CMPaymentDate.isDeleted = !(vm.filter && (vm.filter.fromCMPaymentDate || vm.filter.toCMPaymentDate));
        vm.custRefundAdvanceFiltersConst.PaymentCMNumber.isDeleted = !(vm.filter && vm.filter.paymentCMNumber);
        vm.custRefundAdvanceFiltersConst.IsIncludeVoidedTransaction.isDeleted = !(vm.filter && vm.filter.isIncludeVoidedTransaction);

        //==>>>Set filter tool-tip
        vm.custRefundAdvanceFiltersConst.Customer.tooltip = getFilterTooltip(vm.customerListToDisplay, vm.filter.customer, 'id', 'mfgName');
        vm.custRefundAdvanceFiltersConst.PaymentMethod.tooltip = getFilterTooltip(vm.paymentMethodListToDisplay, vm.filter.paymentMethod, 'gencCategoryID', 'gencCategoryName');
        vm.custRefundAdvanceFiltersConst.BankAccountCode.tooltip = getFilterTooltip(vm.bankAccountCodeListToDisplay, vm.filter.bankAccountCode, 'id', 'accountCode');
        vm.custRefundAdvanceFiltersConst.TransactionMode.tooltip = getFilterTooltip(vm.transactionModeToDisplay, vm.filter.transactionMode, 'id', 'modeName');
        vm.custRefundAdvanceFiltersConst.SubStatus.tooltip = getFilterTooltip(vm.refundSubStatusListToDisplay, vm.filter.refundSubStatus, 'code', 'name');

        if (vm.filter) {
          if (vm.filter.paymentNumber) {
            vm.custRefundAdvanceFiltersConst.PaymentOrCheckNumber.tooltip = vm.filter.paymentNumber;
          }
          if (vm.filter.fromDate && vm.filter.toDate) {
            vm.custRefundAdvanceFiltersConst.RefundDate.tooltip = vm.custRefundAdvanceFiltersConst.RefundDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.filter.toDate), vm.DefaultDateFormat);
          }
          else if (vm.filter.fromDate && !vm.filter.toDate) {
            vm.custRefundAdvanceFiltersConst.RefundDate.tooltip = vm.custRefundAdvanceFiltersConst.RefundDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat);
          }
          if (vm.filter.fromCMPaymentDate && vm.filter.toCMPaymentDate) {
            vm.custRefundAdvanceFiltersConst.CMPaymentDate.tooltip = vm.custRefundAdvanceFiltersConst.CMPaymentDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromCMPaymentDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.filter.toCMPaymentDate), vm.DefaultDateFormat);
          }
          else if (vm.filter.fromCMPaymentDate && !vm.filter.toCMPaymentDate) {
            vm.custRefundAdvanceFiltersConst.CMPaymentDate.tooltip = vm.custRefundAdvanceFiltersConst.CMPaymentDate.value + ' From: ' + $filter('date')(new Date(vm.filter.fromCMPaymentDate), vm.DefaultDateFormat);
          }
          if (vm.filter.paymentCMNumber) {
            vm.custRefundAdvanceFiltersConst.PaymentCMNumber.tooltip = vm.filter.paymentCMNumber;
          }
          if (vm.filter.amount) {
            vm.custRefundAdvanceFiltersConst.RefundAmount.tooltip = vm.filter.amount;
          }
          if (vm.filter.isIncludeVoidedTransaction) {
            vm.custRefundAdvanceFiltersConst.IsIncludeVoidedTransaction.tooltip = vm.filter.isIncludeVoidedTransaction;
          }
        }

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }
        vm.numberOfMasterFiltersApplied = _.filter(vm.custRefundAdvanceFiltersConst, (num) => num.isDeleted === false).length;
      }

      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.custRefundAdvanceFiltersConst.Customer.value:
              vm.filter.customer = [];
              break;
            case vm.custRefundAdvanceFiltersConst.PaymentMethod.value:
              vm.filter.paymentMethod = [];
              break;
            case vm.custRefundAdvanceFiltersConst.BankAccountCode.value:
              vm.filter.bankAccountCode = [];
              break;
            case vm.custRefundAdvanceFiltersConst.TransactionMode.value:
              vm.filter.transactionMode = [];
              break;
            case vm.custRefundAdvanceFiltersConst.SubStatus.value:
              vm.filter.refundSubStatus = [];
              break;
            case vm.custRefundAdvanceFiltersConst.PaymentOrCheckNumber.value:
              vm.filter.paymentNumber = null;
              break;
            case vm.custRefundAdvanceFiltersConst.RefundDate.value:
              vm.filter.fromDate = null;
              vm.filter.toDate = null;
              break;
            case vm.custRefundAdvanceFiltersConst.PaymentCMNumber.value:
              vm.filter.paymentCMNumber = null;
              break;
            case vm.custRefundAdvanceFiltersConst.RefundAmount.value:
              vm.filter.amount = null;
              break;
            case vm.custRefundAdvanceFiltersConst.CMPaymentDate.value:
              vm.filter.fromCMPaymentDate = null;
              vm.filter.toCMPaymentDate = null;
              break;
            case vm.custRefundAdvanceFiltersConst.IsIncludeVoidedTransaction.value:
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
          GencCategoryType: [CORE.CategoryType.PayablePaymentMethods.Name],
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


      /* get Generic Transaction Mode list from master */
      vm.getTransactionModeList = () => {
        vm.transactionModeSearchText = null;
        const transInfo = { modeType: CORE.GenericTransMode.RefundPayable };
        return TransactionModesFactory.getTransModeList().query({ transInfo: transInfo }).$promise.then((response) => {
          if (response && response.data && response.data.customerTransModeNameList) {
            vm.transactionModeList = vm.transactionModeToDisplay = response.data.customerTransModeNameList;
            return $q.resolve(vm.transactionModeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getTransactionModeList();

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: 130,
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
          field: 'refundSubStatusText',
          displayName: 'Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustRefundSubStatusClassName(row.entity.subStatus)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '170',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'refundSubStatusLogicalText',
          displayName: 'Refund Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustRefundSubStatusClassName(row.entity.subStatus)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '160',
          enableFiltering: true,
          enableSorting: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.custRefundSubStatusListGHDropdown
          }
        },
        {
          field: 'isMarkAsPaidBooleanConverted',
          displayName: 'Mark As Paid',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':row.entity.isMarkAsPaid === 0,\
                        \'label-box label-success\':row.entity.isMarkAsPaid === 1, \
                        \'label-box label-primary\':row.entity.isMarkAsPaid === null }"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '130',
          enableFiltering: true,
          enableSorting: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.custRefundMarkAsPaidStatusList
          }
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
          field: 'modeName',
          displayName: 'Transaction Mode',
          width: 180,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToTransactionModeDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text ng-if="row.entity.modeName" label="\'Transaction Mode\'" text="row.entity.modeName"></copy-text>\
                        </div>',
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
          field: 'paymentNumber',
          displayName: 'Payment# or Check#',
          width: vm.payCheckNumSHColWidth,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerRefundDetail(row.entity.id);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text ng-if="row.entity.paymentNumber" label="grid.appScope.$parent.vm.payCheckNumSHColNm" text="row.entity.paymentNumber"></copy-text>\
                         </div> ',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'bankAccountNo',
          displayName: 'Refund From (Bank Account Code)',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.bankAccountNo">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.updateBank(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text text="row.entity.bankAccountNo"></copy-text>\
                                        </div>',
          enableFiltering: false,
          enableSorting: true
        },
        {
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
        },
        {
          field: 'totalRefundIssuedAmount',
          displayName: 'Refund Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: vm.payAmountSHColWidth,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'offsetAmount',
          displayName: 'Offset Refund Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: 150,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'refundDate',
          displayName: 'Refund Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 90,
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
          field: 'totDetLevelSelectedPaymentCMCount',
          displayName: 'No Of Item',
          cellTemplate: '<div class="ui-grid-cell-contents text-center">\
                                  <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerRefundDetailList(row.entity);$event.preventDefault();">{{row.entity.totDetLevelSelectedPaymentCMCount}}</a>',
          width: 80,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentCMList',
          displayName: 'CM# or Payment#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-repeat="item in row.entity.paymentCMListWithNewLine track by $index"><a class="cm-text-decoration underline" \
                                                ng-click="grid.appScope.$parent.vm.goToPaymentCreditMemoDetails(item.custPaymentMstID,row.entity.refGencTransModeID);"\
                                                tabindex="-1">{{item.paymentCMNumber}}</a>\
                                  <span ng-if="row.entity.paymentCMListWithNewLine.length - 1 > $index">,</span>\
          </div> ',
          width: '350',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'billToName',
          displayName: 'Billing Address/Remit To Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 120
        },
        {
          field: 'billToAddress',
          displayName: 'Billing Address/Remit To Address',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 300
        },
        {
          field: 'billToContactPerson',
          displayName: 'Billing Address/Remit To Contact Person',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 300
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
                                                ng-click="grid.appScope.$parent.vm.goToCustomerRefundDocument(row.entity.id);"\
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
          cellTemplate: '<md-button class="md-warn margin-0" ng-class="{\'md-hue-1\': !row.entity.voidPaymentReason }" ng-disabled="!row.entity.voidPaymentReason" ng-click="grid.appScope.$parent.vm.showVoidRefundReason(row, $event)"> \
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
          enableFiltering: false
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
          enableFiltering: true
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

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (refundDetails, isGetDataDown) => {
        if (refundDetails && refundDetails.data && refundDetails.data.refundDetails) {
          if (!isGetDataDown) {
            vm.sourceData = refundDetails.data.refundDetails;
            vm.currentdata = vm.sourceData.length;
          }
          else if (refundDetails.data.refundDetails.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(refundDetails.data.refundDetails);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          _.each(vm.sourceData, (item) => {
            item.lockUnlockTransactionBtnText = item.lockStatus === vm.CustPaymentLockStatusConst.Locked ? 'Unlock Customer Refund' : 'Lock Customer Refund';
            item.refundDate = BaseService.getUIFormatedDate(item.refundDate, vm.DefaultDateFormat);
            item.isDisableVoidPaymentAndReleaseInvoiceGroup = (item.isPaymentVoided === 1) || (!vm.allowToVoidCustRefundFeature);
            item.isDisablePrintCheck = ((item.paymentMethod !== TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryName) || (item.isPaymentVoided === 1)) ? true : false;
            item.isDisableLockUnlockTransaction = (!vm.allowToLockUnlockCustRefundFeature || item.isPaymentVoided);
            item.isRowSelectable = item.isPaymentVoided === 1 ? false : true;
          });
          formatPaymentCMListOfGridData(vm.sourceData);

          // must set after new data comes
          vm.totalSourceDataCount = refundDetails.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.customerIDs || vm.pagingInfo.paymentMethodIDs || vm.pagingInfo.bankAccountCodeIDs || vm.pagingInfo.transactionModeIDs || vm.pagingInfo.refundSubStatusIDs || vm.pagingInfo.paymentNumber || vm.pagingInfo.paymentCMNumber || vm.pagingInfo.amount || vm.pagingInfo.fromDate || vm.pagingInfo.toDate || vm.pagingInfo.fromCMPaymentDate || vm.pagingInfo.toCMPaymentDate || vm.pagingInfo.isIncludeVoidedTransaction) {
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

      /* retrieve customer Refund list */
      vm.loadData = () => {
        vm.pagingInfo.customerIDs = vm.filter.customer.join(',');
        vm.pagingInfo.paymentMethodIDs = vm.filter.paymentMethod.join(',');
        vm.pagingInfo.bankAccountCodeIDs = vm.filter.bankAccountCode.join(',');
        vm.pagingInfo.transactionModeIDs = vm.filter.transactionMode.join(',');
        vm.pagingInfo.refundSubStatusIDs = vm.filter.refundSubStatus.join(',');

        vm.pagingInfo.exactPaymentNumberSearch = (vm.filter.paymentNumberSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.paymentNumber = vm.filter.paymentNumber;

        vm.pagingInfo.exactRefundAmountSearch = (vm.filter.refundAmountSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.amount = vm.filter.amount;

        vm.pagingInfo.paymentCMNumber = vm.filter.paymentCMNumber;
        vm.pagingInfo.fromDate = (BaseService.getAPIFormatedDate(vm.filter.fromDate));
        vm.pagingInfo.toDate = (BaseService.getAPIFormatedDate(vm.filter.toDate));

        vm.pagingInfo.fromCMPaymentDate = (BaseService.getAPIFormatedDate(vm.filter.fromCMPaymentDate));
        vm.pagingInfo.toCMPaymentDate = (BaseService.getAPIFormatedDate(vm.filter.toCMPaymentDate));
        vm.pagingInfo.isIncludeVoidedTransaction = vm.filter.isIncludeVoidedTransaction || false;

        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        setFilteredLabels();
        vm.cgBusyLoading = CustomerRefundFactory.retrieveCustomerRefunds().query(vm.pagingInfo).$promise.then((refundDetails) => {
          if (refundDetails && refundDetails.data) {
            setDataAfterGetAPICall(refundDetails, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerRefundFactory.retrieveCustomerRefunds().query(vm.pagingInfo).$promise.then((refundDetails) => {
          if (refundDetails && refundDetails.data) {
            setDataAfterGetAPICall(refundDetails, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //format Alias (all in new line) Of Grid Data
      const formatPaymentCMListOfGridData = (custRefundList) => {
        _.each(custRefundList, (item) => {
          if (item.paymentCMList) {
            item.paymentCMListWithNewLine = item.paymentCMList.split('@@@@@') || [];
            _.each(item.paymentCMListWithNewLine, (aliasSplit, index) => {
              const paymentCMSplitList = aliasSplit.split('#####');
              if (Array.isArray(paymentCMSplitList) && paymentCMSplitList.length > 0) {
                const objRefDet = {
                  paymentCMNumber: paymentCMSplitList[0],
                  custPaymentMstID: paymentCMSplitList[1]
                };
                item.paymentCMListWithNewLine[index] = objRefDet;
              }
            });
            item.paymentCMList = item.paymentCMList ? item.paymentCMList.replace(/#####\d+@@@@@/g, ', ').replace(/#####\d+/g, '') : null;
          }
        });
      };

      const formatDataForExport = (custRefundList) => {
        _.each(custRefundList, (item) => {
          item.refundDate = BaseService.getUIFormatedDate(item.refundDate, vm.DefaultDateFormat);
        });
      };

      vm.updateRecord = (row, ev) => {
        BaseService.goToCustomerRefundDetail(row.entity.id);
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

      /* display void refund reason */
      vm.showVoidRefundReason = (row, ev) => {
        const PopupData = {
          title: vm.voidPaymentReasonSHColNm,
          description: row.entity.voidPaymentReason
        };
        displayComment(row, ev, PopupData);
      };

      /* display comments added for refund */
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
          label: vm.payCheckNumSHColNm,
          value: row.entity.paymentNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            BaseService.goToCustomerRefundList();
          },
          valueLinkFn: () => {
            BaseService.goToCustomerRefundDetail(row.entity.id);
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


      vm.resetFilters = () => {
        vm.filter = {
          customer: [],
          paymentMethod: [],
          bankAccountCode: [],
          transactionMode: [],
          refundSubStatus: [],
          paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
          paymentNumber: null,
          paymentCMNumber: null,
          amount: null,
          fromDate: null,
          toDate: null,
          fromCMPaymentDate: null,
          toCMPaymentDate: null,
          refundAmountSearchType: vm.CheckSearchTypeList[1].id,
          isIncludeVoidedTransaction: false
        };
        vm.clearCustomerSearchText();
        vm.clearPaymentMethodSearchText();
        vm.clearBankAccountCodeSearchText();
        vm.clearTransactionModeFilter();
        vm.clearStatusFilter();
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

      vm.searchTransactionModeList = () => {
        const transactionModeFilter = angular.copy(vm.transactionModeList);
        vm.transactionModeToDisplay = vm.transactionModeSearchText ? _.filter(transactionModeFilter, (item) => item.modeName.toLowerCase().contains(vm.transactionModeSearchText.toLowerCase())) : transactionModeFilter;
      };

      vm.searchSubStatusList = () => {
        const subStatusFilter = angular.copy(vm.custRefundSubStatusIDDetListCont);
        vm.refundSubStatusListToDisplay = vm.subStatusSearchText ? _.filter(subStatusFilter, (item) => item.name.toLowerCase().contains(vm.subStatusSearchText.toLowerCase())) : subStatusFilter;
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

      vm.clearTransactionModeSearchText = () => {
        vm.transactionModeSearchText = null;
        vm.searchTransactionModeList();
      };

      vm.clearSubStatusSearchText = () => {
        vm.subStatusSearchText = null;
        vm.searchSubStatusList();
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

      vm.clearTransactionModeFilter = () => {
        vm.filter.transactionMode = [];
      };

      vm.clearStatusFilter = () => {
        vm.filter.refundSubStatus = [];
      };

      /* Void Customer refund functionality (common grid action button with supplier so name like voidPaymentAndReleaseInvoiceGroup) */
      vm.voidPaymentAndReleaseInvoiceGroup = (row, event) => {
        if ((row.entity.isPaymentVoided === 1) || (!vm.allowToVoidCustRefundFeature)) {
          return;
        }

        if (row.entity.lockStatus === vm.CustPaymentLockStatusConst.Locked) {
          displayCustRefundLockedWithNoAccess(row);
          return;
        }

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
            BaseService.goToCustomerRefundList();
          },
          valueLinkFn: () => {
            BaseService.goToCustomerRefundDetail(row.entity.id);
          }
        }
        ];

        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void Customer Refund',
          confirmationType: CORE.Generic_Confirmation_Type.CUSTOMER_REFUND_VOID,
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
                refPaymentModeOfInvPayment: TRANSACTION.ReceivableRefPaymentMode.Refund.code
              };
              vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.loadData();
                } else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors && response.errors.data && response.errors.data.isPaymentAlreadyVoided) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_VOIDED);
                  messageContent.message = stringFormat(messageContent.message, row.entity.paymentNumber || '', 'customer refund', 'payment# or check#');
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

      const displayCustRefundLockedWithNoAccess = (row) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
        messageContent.message = stringFormat(messageContent.message, row.entity.paymentNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      };

      // display refund payment history
      vm.paymentHistory = (row, ev) => {
        const data = {
          id: row.entity.id,
          mfgcodeID: row.entity.mfgcodeID,
          customerCodeName: row.entity.customerCodeName,
          bankAccountNo: row.entity.bankAccountNo,
          paymentDate: row.entity.paymentDate,
          paymentNumber: row.entity.paymentNumber,
          refPaymentMode: vm.pRecvRefundRefPaymentMode
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

      /* print refund Remittance/Check Report */
      vm.printRemittance = (row, ev) => {
        vm.printCheck(row, ev, true);
        //printRefundCheckRemittReport(row, true);
      };

      /* print refund Check Report */
      vm.printCheck = (row, event, isRemittanceReport) => {
        if (!row || !row.entity || !row.entity.id) {
          return;
        }

        // if payment number added then direct print otherwise display popup to add payment number
        if (row.entity.paymentNumber) {
          printRefundCheckRemittReport(row, isRemittanceReport);
        } else {
          const refundData = {
            custRefundMstID: row.entity.id
          };

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
            label: 'Transaction Mode',
            value: row.entity.modeName,
            displayOrder: 2
          },
          {
            label: vm.paymentDateSHColNm,
            value: row.entity.refundDate,
            displayOrder: 3
          }];
          refundData.headerData = headerData;


          return DialogFactory.dialogService(
            TRANSACTION.CUST_REFUND_DETAILS_POPUP_CONTROLLER,
            TRANSACTION.CUST_REFUND_DETAILS_POPUP_VIEW,
            event,
            refundData).then((resp) => {
              // success block
              if (resp) {
                vm.loadData();
              }
            }, () => {
              // cancel block
            }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* common function to print refund Remittance/Check Report */
      const printRefundCheckRemittReport = (row, isRemittanceReport) => {
        const isDownload = false;
        if (isRemittanceReport) {
          row.entity.isPrintRemittDisabled = true;
        } else {
          row.entity.isPrintLoader = true;
        }

        const paramObj = {
          paymentId: row.entity.id,
          isRemittanceReport: isRemittanceReport ? isRemittanceReport : false,
          reportAPI: 'InvoicePayment/checkPrintAndRemittanceReport'
        };
        ReportMasterFactory.generateReport(paramObj).then((response) => {
          const model = {
            multiple: true
          };
          if (isRemittanceReport) {
            row.entity.isPrintRemittDisabled = false;
          } else {
            row.entity.isPrintLoader = false;
          }
          if (response.status === 404) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 204) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NOCONTENT);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 403) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === 401) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
            DialogFactory.messageAlertDialog(model);
          } else if (response.status === -1) {
            model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
            DialogFactory.messageAlertDialog(model);
          } else {
            const blob = new Blob([response.data], {
              type: 'application/pdf'
            });
            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(blob, 'CheckPrintReport.pdf');
            } else {
              const TimeStamp = $filter('date')(new Date(), CORE.DateFormatArray[0].format);
              const link = document.createElement('a');
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                if (isDownload) {
                  link.setAttribute('download', 'CheckPrintReport' + TimeStamp + '.pdf');
                } else {
                  link.setAttribute('target', '_blank');
                }
                link.style = 'visibility:hidden';
                document.body.appendChild(link);
                $timeout(() => {
                  link.click();
                  document.body.removeChild(link);
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // lock/unlock customer refund record from grid action
      vm.lockUnlockCustomerPayment = (rowEntity, ev, isLockTransactionAction) => {
        vm.lockUnlockCustomerPaymentDet(rowEntity, isLockTransactionAction);
      };

      /* to lock/unlock transaction - lock/unlock customer refund */
      vm.lockUnlockCustomerPaymentDet = (rowEntity, isLockTransactionAction) => {
        if (!vm.allowToLockUnlockCustRefundFeature) {
          return;
        }

        const isLockTransactionOnRecords = (rowEntity && rowEntity.lockStatus !== vm.CustPaymentLockStatusConst.Locked) || isLockTransactionAction ? true : false;

        if (isLockTransactionOnRecords) { // make transaction lock
          // check for any record already in locked mode
          let isAnyLockedCustRefund = false;
          if (rowEntity) {
            isAnyLockedCustRefund = rowEntity.lockStatus === vm.CustPaymentLockStatusConst.Locked;
          } else {
            isAnyLockedCustRefund = _.some(vm.selectedRowsList, (payItem) => payItem.lockStatus === vm.CustPaymentLockStatusConst.Locked);
          }
          if (isAnyLockedCustRefund) {
            displayAlreadyLockedPMTMsg(rowEntity);
            return;
          }
        } else {  // make transaction unlock
          // check for any record already in unlocked mode
          let isAnyLockedCustRefund = false;
          if (rowEntity) {
            isAnyLockedCustRefund = rowEntity.lockStatus !== vm.CustPaymentLockStatusConst.Locked;
          } else {
            isAnyLockedCustRefund = _.some(vm.selectedRowsList, (payItem) => payItem.lockStatus !== vm.CustPaymentLockStatusConst.Locked);
          }
          if (isAnyLockedCustRefund) {
            displayAlreadyUnlockedPMTMsg(rowEntity);
            return;
          }
        }

        const selectedRowListForLockUnlock = [];
        if (rowEntity) {
          selectedRowListForLockUnlock.push({
            invPaymentMstID: rowEntity.id
          });
        } else {
          if (vm.selectedRowsList.length > 0) {
            _.each(vm.selectedRowsList, (rowItem) => {
              const _obj = {
                invPaymentMstID: rowItem.id
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
            refPaymentMode: vm.pRecvRefundRefPaymentMode,
            isViewToBeLockUnlockRecords: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              lockUnlockTransaction(objCustPaymentLock, rowEntity, isLockTransactionOnRecords);
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // lock/unlock actual transaction
      const lockUnlockTransaction = (objCustPaymentLock, rowEntity, isLockTransactionOnRecords) => {
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
                    lockUnlockTransaction(objCustPaymentLock, rowEntity, isLockTransactionOnRecords);
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            } else {
              //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              //vm.gridOptions.clearSelectedRows();
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
            } else if (resp.errors.data.isAnyNotAllowedToLockRecord) {
              const refundLockData = {
                custRefundValidatedList: resp.errors.data.custRefundValidatedList || []
              };

              DialogFactory.dialogService(
                TRANSACTION.VALIDATED_CUST_REFUND_LIST_FOR_LOCK_MODAL_CONTROLLER,
                TRANSACTION.VALIDATED_CUST_REFUND_LIST_FOR_LOCK_MODAL_VIEW,
                event,
                refundLockData).then((resp) => {
                  // response block
                  if (resp && resp.custRefundValidatedListToCont && resp.custRefundValidatedListToCont.length > 0) {
                    const allowedLockRefundList = _.filter(resp.custRefundValidatedListToCont, (refundItem) => refundItem.isLockedAllowed === true);
                    if (allowedLockRefundList && allowedLockRefundList.length > 0) {
                      objCustPaymentLock.custPaymentListForLock = objCustPaymentLock.custPaymentListForLock.filter((o1) => allowedLockRefundList.some((o2) => o1.invPaymentMstID === o2.custRefundMstID));
                      lockUnlockTransaction(objCustPaymentLock, rowEntity, isLockTransactionOnRecords);
                    }
                  }
                }, () => {
                  // cancel block
                }, (err) => BaseService.getErrorLog(err));
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

      /* go to customer refund detail list tab with filter */
      vm.goToCustomerRefundDetailList = (rowEntity) => {
        BaseService.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_LIST_STATE,
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

      vm.goToPaymentMethodList = () => {
        BaseService.goToGenericCategoryPayablePaymentMethodList();
      };

      vm.goToPaymentMethodDetail = (paymentType) => {
        BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: paymentType });
      };

      vm.goToBankList = () => {
        BaseService.goToBankList();
      };

      /* go to Transaction Mode list page */
      vm.goToTransactionModeList = () => {
        BaseService.goToTransactionModesList(USER.TransactionModesTabs.Payable.Name, false);
      };
      vm.goToTransactionModeDetail = (row) => {
        BaseService.goToManageTransactionModes(USER.TransactionModesTabs.Payable.Name, row.refGencTransModeID, false);
      };

      /* go To Payment detail or Credit memo deatil page*/
      vm.goToPaymentCreditMemoDetails = (custPaymentMstID, refTransModeID) => {
        if (refTransModeID && refTransModeID === CORE.GenericTransModeName.RefundPayablePayRefund.id) {
          BaseService.goToCustomerPaymentDetail(custPaymentMstID);
        } else if (refTransModeID && refTransModeID === CORE.GenericTransModeName.RefundPayableCMRefund.id) {
          BaseService.goToCustomerCreditMemoDetail(custPaymentMstID);
        }
      };

      vm.goToCustomerRefundDocument = (custPaymentMstID) => {
        BaseService.goToCustomerRefundDocument(custPaymentMstID);
      };

      vm.goToCustCreditMemoDetail = (creditMemoMstID) => {
        BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
      };

      /* to get/apply class for customer status status */
      vm.getCustRefundStatusClassName = (refundStatus) => BaseService.getCustRefundStatusClassName(refundStatus);

      /* called for min date validation */
      vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

      /* to go at customer bill to address page */
      vm.goToCustomerBillToPage = (customerID) => {
        BaseService.goToCustomer(customerID, false);
      };

      /* go To Refund Detail page */
      vm.goToCustomerRefundDetail = (custRefundMstID) => {
        BaseService.goToCustomerRefundDetail(custRefundMstID);
      };

      /* to get/apply class for customer status status */
      vm.getCustRefundSubStatusClassName = (statusID) => BaseService.getCustRefundSubStatusClassName(statusID);
    }
  }
})();
