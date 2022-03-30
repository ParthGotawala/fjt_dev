(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('customerInvoiceListSummary', customerInvoiceListSummary);

  /** @ngInject */
  function customerInvoiceListSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
      },
      templateUrl: 'app/directives/custom/customer-invoice-list-summary/customer-invoice-list-summary.html',
      controller: customerInvoiceListSummaryDirectiveCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function customerInvoiceListSummaryDirectiveCtrl($scope, $rootScope, $timeout, CORE, TRANSACTION, BaseService, CustomerPackingSlipFactory, $state, DialogFactory, ManufacturerFactory, USER, GenericCategoryFactory, ComponentFactory, SalesOrderFactory, CONFIGURATION, $filter, $location, $q) {
      var vm = this;
      vm.transType = $state.params.transType;
      vm.gridConfig = CORE.gridConfig;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.LabelConstant = CORE.LabelConstant;
      vm.isDownload = true;
      vm.setScrollClass = 'gridScrollHeight_CustomerInvoice';
      vm.isUpdatable = true;
      vm.customerpackingsliphistory = true;
      vm.isPageInitAllDataLoaded = false;
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        vm.historyactionButtonName = CORE.LabelConstant.CustomerPackingInvoice.HistoryButtonName;
        vm.listDateFilterList = TRANSACTION.CustomerInvoiceDateFilterList;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INVOICE;
      } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
        vm.historyactionButtonName = CORE.LabelConstant.CustomerCreditMemo.HistoryButtonName;
        vm.isApplyCustCreditMemo = true;
        vm.listDateFilterList = TRANSACTION.CustomerCrNoteDateFilterList;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_CREDIT_MEMO;
      } else {
        vm.historyactionButtonName = '';
      }

      //get customer packing slip status
      vm.getCoInvoiceStatusClassName = (statusID) => BaseService.getCustInvStatusClassName(statusID, vm.transType);
      vm.getCustomerPackingSlipStatusClassName = (statusID) => BaseService.getCustomerPackingSlipStatusClassName(statusID);
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachType = vm.POSerachType = vm.CheckSearchTypeList[1].id;
      vm.isCheckAll = true;
      vm.isShippedNotInv = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
      vm.isInvoiced = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
      vm.isCorctInv = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
      vm.isDraft = true;
      vm.isPublished = true;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.CUSTOMER_INVOICE_PAID_FILTERS_TOOLTIP = CORE.CUSTOMER_INVOICE_PAID_FILTERS_TOOLTIP;
      vm.isViewLockUnlockTransaction = true;
      vm.CORE = CORE;
      vm.isNotInvoiced = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
      vm.isWaitingForPayment = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
      vm.isPartialPayment = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
      vm.isPaymentRec = false;
      vm.paramSearchObj = $location.search();
      vm.hasUrlSearchData = (vm.paramSearchObj && vm.paramSearchObj.customerID) ? true : false;
      vm.ConfirmingZeroValueHeaderLable = stringFormat(vm.LabelConstant.CustomerPackingSlip.ConfirmingZeroValueHeader, vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Invoice' : 'Credit Memo');
      vm.statusSearchText = undefined;
      vm.ApplyCustCreditMemoStatusTextConst = TRANSACTION.ApplyCustomerCreditMemoStatusText;
      vm.CustomerCreditMemoRefundStatusTextConst = TRANSACTION.CustomerCreditMemoRefundStatusText;
      vm.isTrackingNumberUpdationPermission = !BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToChangeCustPackingSlipAndInvoiceTrackingNumber);
      vm.CustomerInvAdvancedFilters = angular.copy(CORE.CustomerInvAdvancedFilters);
      vm.partIds = [];
      let invCMEntityNmForLock = null;
      vm.selectedDateType = vm.listDateFilterList[0].key;
      vm.isAllFilterClear = false;

      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        //vm.transTypeText = 'Customer Invoice';
        vm.enableLockTransaction = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockCustomerInvoice);
        vm.CustomerInvAdvancedFilters.ZeroAmountInv.value = stringFormat(vm.CustomerInvAdvancedFilters.ZeroAmountInv.value, 'Invoice');
        vm.isUpdateTrackingNumber = true;
        invCMEntityNmForLock = 'customer invoice';
      } else {
        //vm.transTypeText = 'Customer Credit Memo';
        vm.enableLockTransaction = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockCustomerCreditMemo);
        vm.isUnappliedCredit = true;
        vm.isPartialCreditApplied = true;
        vm.isFullCreditApplied = vm.isNoPendingCredit = false;
        vm.isRefundNotApplicable = vm.isPendingRefund = vm.isPartialCMRefunded = true;
        vm.CustomerInvAdvancedFilters.ZeroAmountInv.value = stringFormat(vm.CustomerInvAdvancedFilters.ZeroAmountInv.value, 'Credit Memo');
        vm.isUpdateTrackingNumber = false;
        invCMEntityNmForLock = 'customer credit memo';
      }

      if (vm.transType === vm.CORE.TRANSACTION_TYPE.CREDITNOTE || vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) {
        vm.isPrinted = true;
      } else {
        vm.isPrinted = false;
      }
      // vm.isDisableLockTransaction = false;
      vm.gridId = (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE ? vm.gridConfig.gridCustomerInvoiceSummary : vm.gridConfig.gridCustomerCreditNoteSummary);
      vm.dateOption = {
        fromDateOpenFlag: false,
        toDateOpenFlag: false
      };
      vm.CustPaymentStatusInInvoice = CORE.CustPaymentStatusInInvoice;

      //go to customer list page
      vm.goToSCustomerList = () => {
        BaseService.goToCustomerList();
      };

      //go to Packing Slip Document Page
      vm.goToPackingSlipDocument = (invoiceID) => {
        BaseService.goToCustomerInvoicePackingSlipDocument(invoiceID);
      };

      //go to Packing Slip Document Page
      vm.goToCustomerInvoiceDocument = (invoiceId) => {
        BaseService.goToCustomerInvoiceDocument(invoiceId);
      };

      vm.goToCustomer = (id) => {
        BaseService.goToCustomer(id);
      };

      //go to manage customer invoice
      vm.goToManageCustomerInvoice = (id) => {
        BaseService.goToManageCustomerInvoice(id);
      };
      // go to manage packing slip
      vm.goToManageCustomerPackingSlip = (packingSlipId, SoId) => {
        BaseService.goToManageCustomerPackingSlip(packingSlipId, SoId || 0);
      };
      // go to customer credit memo
      vm.goToCustomerCreditMemoDetail = (id) => {
        BaseService.goToCustomerCreditMemoDetail(id);
      };

      // get class for payment status
      vm.getPaymentStatusClassName = (statusText) => {
        const status = _.find(CORE.Customer_Payment_Status, (item) => item.Name === statusText);
        return status ? status.ClassName : '';
      };

      // get class for applying credit memo
      vm.getClassNameForApplyCreditMemo = (status) => {
        const appliedCreditStatusDet = _.find(_.values(vm.ApplyCustCreditMemoStatusTextConst), (item) => item.Code === status);
        return appliedCreditStatusDet ? appliedCreditStatusDet.ClassName : '';
        //BaseService.getCustCreditAppliedStatusClassName(status);
      };

      // get class for packing slip status
      vm.getCustomerPackingSlipStatusInInvoice = (statusId) => {
        const status = _.find(CORE.CustomerPackingSlipStatusInInvoice, (item) => item.ID === statusId);
        return status ? status.ClassName : '';
      };

      // get class for Invoice Type
      vm.getCustomeInvoiceTypeClassName = (statusText) => {
        const status = _.find(CORE.CustomerInvoiceType, (item) => item.Name === statusText);
        return status ? status.ClassName : '';
      };

      vm.getMaterialStatusClass = (rowValue) => {
        if (rowValue.packingSlipStatusID === 5 && rowValue.subStatus === 4) {
          return 'label-warning';
        } else {
          return 'label-primary';
        }
      };

      /* to get/apply class for customer credit memo refund status */
      vm.getCustCreditMemoRefundStatusClassName = (refundStatus) => BaseService.getCustCreditMemoRefundStatusClassName(refundStatus);

      //==> Search within filter boxes
      vm.searchMfrList = () => {
        var mfrListToFilter;
        if (vm.timeoutWatch) {
          $timeout.cancel(vm.timeoutWatch);
        }
        vm.timeoutWatch = $timeout(() => {
          vm.mfgCodeDetailModel = [];
          mfrListToFilter = angular.copy(vm.mfgCodeDetail);
          vm.mfgCodeListToDisplay = vm.mfrSearchText ? _.filter(mfrListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.mfrSearchText.toLowerCase())) : mfrListToFilter;
        }, _configTimeout);
      };

      vm.searchTermList = () => {
        var termsListToFilter;
        if (vm.timeoutWatch) {
          $timeout.cancel(vm.timeoutWatch);
        }
        vm.timeoutWatch = $timeout(() => {
          vm.paymentTermsDetailModel = [];
          termsListToFilter = angular.copy(vm.paymentTermsList);
          vm.paymentTermsListToDisplay = vm.termSearchText ? _.filter(termsListToFilter, (item) => item.gencCategoryName.toLowerCase().contains(vm.termSearchText.toLowerCase())) : termsListToFilter;
        }, _configTimeout);
      };

      vm.searchStatusList = () => {
        var statusListToFilter;
        vm.statusModel = [];
        statusListToFilter = angular.copy(vm.statusList);
        vm.statusListToDisplay = vm.statusSearchText ? _.filter(statusListToFilter, (item) => item.Name.toLowerCase().contains(vm.statusSearchText.toLowerCase())) : statusListToFilter;
      };

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
      //      } else {
      //        vm.pagingInfo.mfrPnId = null;
      //      }
      //    },
      //    onSearchFn: function (query) {
      //      const searchObj = {
      //        query: query,
      //        inputName: vm.autoCompletecomponent.inputName,
      //        isContainCPN: true
      //      };
      //      return searchMfrPn(searchObj);
      //    }
      //  };
      //};

      //initAutoComplete();
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

      //==> Clear search within filter boxes
      vm.clearManufacturerFilter = () => {
        vm.mfgCodeDetailModel = [];
      };

      vm.clearTermsFilter = () => {
        vm.paymentTermsDetailModel = [];
      };

      vm.clearStatusFilter = () => {
        vm.statusModel = [];
      };

      //Apply due data filter
      vm.applyDueDateFiltersChange = () => {
        vm.dueDate = undefined;
        vm.additionalDays = undefined;
        vm.termsAndAboveDays = undefined;
      };

      //get data for mfgcode -customer
      vm.getMfgSearch = () => {
        vm.mfrSearchText = undefined;
        const searchObj = {
          mfgType: CORE.MFG_TYPE.MFG,
          isCodeFirst: true
        };
        return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.mfgCodeDetail = vm.mfgCodeListToDisplay = [];
          if (mfgcodes && mfgcodes.data) {
            vm.mfgCodeDetail = mfgcodes.data;
            vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
          }
          return vm.mfgCodeDetail;
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //vm.getMfgSearch();

      // Payment Terms List
      vm.getPaymentTermsList = () => {
        vm.termSearchText = undefined;
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.Terms.Name);
        const listObj = {
          GencCategoryType: GencCategoryType
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentTerms) => {
          if (paymentTerms && paymentTerms.data) {
            vm.paymentTermsList = paymentTerms.data;
            vm.paymentTermsListToDisplay = angular.copy(vm.paymentTermsList);
            return vm.paymentTermsList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //vm.getPaymentTermsList();

      //get data for status
      vm.getStatusSearch = () => {
        vm.statusSearchText = undefined;
        vm.statusList = angular.copy(vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? CORE.Customer_Invoice_SubStatus : CORE.Customer_CrMemo_SubStatus);
        vm.statusList = _.sortBy(vm.statusList, [(o) => o.DisplayOrder]);
        vm.statusListToDisplay = angular.copy(vm.statusList);
        if (vm.hasUrlSearchData && vm.paramSearchObj && vm.paramSearchObj.custInvCMSubStatusList) {
          if (Array.isArray(vm.paramSearchObj.custInvCMSubStatusList) && vm.paramSearchObj.custInvCMSubStatusList.length > 0) {
            vm.statusModel = vm.paramSearchObj.custInvCMSubStatusList;
          } else if (typeof (vm.paramSearchObj.custInvCMSubStatusList) === 'string') {
            vm.statusModel = [vm.paramSearchObj.custInvCMSubStatusList];
          }
        } else {
          vm.statusModel = _.map(vm.statusList, (item) => item.ID.toString());
        }
      };
      vm.getStatusSearch();

      const init = () => {
        const promises = [vm.getMfgSearch(), vm.getPaymentTermsList()];
        vm.cgBusyLoading = $q.all(promises).then(() => {
          vm.isPageInitAllDataLoaded = true;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // if external search contain data then first load all master data
      if (vm.hasUrlSearchData && vm.paramSearchObj && vm.paramSearchObj.customerID) {
        init();
      } else {
        vm.isPageInitAllDataLoaded = true;
        vm.getMfgSearch();
        vm.getPaymentTermsList();
      }


      vm.fromDateOptions = {
        //minDate: new Date(),
        appendToBody: true
      };

      vm.toDateOptions = {
        //minDate: new Date(),
        appendToBody: true
      };
      // on change of invoice from data filter
      vm.fromDateChange = () => {
        const fromDate = vm.fromDate ? new Date($filter('date')(vm.fromDate, vm.DefaultDateFormat)) : vm.filtersInfo.fromDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromDate.$viewValue, vm.DefaultDateFormat)) : null;
        const toDate = vm.toDate ? new Date($filter('date')(vm.toDate, vm.DefaultDateFormat)) : vm.filtersInfo.toDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toDate.$viewValue, vm.DefaultDateFormat)) : null;
        if (vm.fromDate) {
          vm.toDateOptions.minDate = (vm.fromDate ? vm.fromDate : new Date());
        } else {
          vm.toDateOptions.minDate = null;
        }
        if (vm.toDate) {
          vm.fromDateOptions.maxDate = (vm.toDate ? vm.toDate : new Date());
        } else {
          vm.fromDateOptions.maxDate = null;
        }
        if (fromDate <= toDate) {
          vm.filtersInfo.toDate.$setValidity('minvalue', true);
          vm.filtersInfo.fromDate.$setValidity('maxvalue', true);
        }
      };

      // on change of invoice to data filter
      vm.toDateChange = () => {
        const fromDate = vm.fromDate ? new Date($filter('date')(vm.fromDate, vm.DefaultDateFormat)) : vm.filtersInfo.fromDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromDate.$viewValue, vm.DefaultDateFormat)) : null;
        const toDate = vm.toDate ? new Date($filter('date')(vm.toDate, vm.DefaultDateFormat)) : vm.filtersInfo.toDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toDate.$viewValue, vm.DefaultDateFormat)) : null;
        if (vm.fromDate) {
          vm.fromDateOptions.maxDate = (vm.toDate ? vm.toDate : new Date());
        } else {
          vm.toDateOptions.minDate = null;
        }
        if (vm.toDate) {
          vm.toDateOptions.minDate = (vm.fromDate ? vm.fromDate : new Date());
        } else {
          vm.fromDateOptions.maxDate = null;
        }
        if (fromDate <= toDate) {
          vm.filtersInfo.toDate.$setValidity('minvalue', true);
          vm.filtersInfo.fromDate.$setValidity('maxvalue', true);
        }
      };

      /* get footer total amount */
      vm.getFooterInvAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalAmount)) || 0;
        return $filter('amount')(sum);
      };

      vm.getFooterReceivedAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.receivedAmount)) || 0;
        return $filter('amount')(sum);
      };

      vm.getFooterPendingAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.pendingAmount)) || 0;
        return $filter('amount')(sum);
      };

      vm.getFooterAgreedRefundAmtCMTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.agreedRefundAmtCM)) || 0;
        return $filter('amount')(sum);
      };

      vm.getFooterRefundIssuedAgainstCMTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totRefundIssuedAgainstCreditMemo)) || 0;
        return $filter('amount')(sum);
      };

      const PackingSlipStatusColumn = {
        field: 'packingSlipStatus',
        displayName: 'Customer Packing Slip Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center"> '
          + '<span ng-if="row.entity.packingSlipStatus" class="label-box" ng-class="grid.appScope.$parent.vm.getCustomerPackingSlipStatusInInvoice(row.entity.packingSlipStatusID)">'
          + '{{COL_FIELD}}'
          + '</span>'
          //+ '<span ng-if ="!row.entity.packingSlipStatusID">'
          //+ '{{COL_FIELD}}'
          //+ '</span>'
          + '</div>',
        enableSorting: true,
        enableFiltering: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.CustomerPackingSlipStatusForInvoiceGridHeaderDropdown
        },
        width: '160'
      };
      const invoiceTypeColumn = {
        field: 'invoiceType',
        displayName: 'Invoice Type',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustomeInvoiceTypeClassName(row.entity.invoiceType)"> '
          + '{{row.entity.invoiceType}}'
          + '</span>'
          + '</div> ',
        width: '150',
        enableSorting: true,
        enableFiltering: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.CustomerInvoiceTypeGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals'
      };
      const paymentStatusColumn = {
        field: 'paymentStatusValue',
        displayName: 'Customer Payment Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span ng-if="row.entity.paymentStatusValue" class="label-box" ng-class="grid.appScope.$parent.vm.getPaymentStatusClassName(row.entity.paymentStatusValue)">'
          + '{{row.entity.paymentStatusValue}}'
          + '</span> </div> ',
        enableSorting: true,
        enableFiltering: true,
        width: '210',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: CORE.CustPaymentStatusInInvoiceGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals'
      };

      const creditNoteNumberColumn = {
        field: 'creditMemoNumber',
        displayName: 'Credit Memo#',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerCreditMemoDetail(row.entity.id);$event.preventDefault();">{{ row.entity.creditMemoNumber }}</a>'
          + '<copy-text ng-if="row.entity.creditMemoNumber" label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerCreditMemo.CustomerCreditMemoNumer" text="row.entity.creditMemoNumber"> </copy-text>'
          + '<md-tooltip ng-if="row.entity.creditMemoNumber">{{ row.entity.creditMemoNumber }}</md-tooltip>'
          + '<md-icon  md-font-icon=""  class="material-icons mat-icon icon-lock" ng-if= "row.entity.isLocked === 1 && grid.appScope.$parent.vm.transType === \'C\'" style ="margin-left:5px !important;"> </md-icon> '
          + '</div>',
        width: '170'
      };
      const creditNoteDateColumn = {
        field: 'creditMemoDate',
        displayName: 'Credit Memo Date', cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '120',
        type: 'date',
        enableFiltering: false
      };

      const refDebitMemoNumberColumn = {
        field: 'refDebitMemoNumber',
        displayName: 'Ref. Debit Memo#',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">{{COL_FIELD}}</div>',
        width: '150'
      };
      const refDebitMemoDateColumn = {
        field: 'refDebitMemoDate',
        displayName: 'Ref. Debit Memo Date', cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '120',
        type: 'date',
        enableFiltering: false
      };
      const rmaNumberColumn = {
        field: 'rmaNumber',
        displayName: 'RMA#',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">{{COL_FIELD}}</div>',
        width: '120'
      };
      const packingSlipNumberColumn = {
        field: 'packingSlipNumber',
        displayName: 'Packing Slip#',
        cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.packingSlipId"> \
                            <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageCustomerPackingSlip(row.entity.packingSlipId,row.entity.refSalesOrderID);$event.preventDefault();">{{COL_FIELD}}</a> \
                            <copy-text  label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerPackingSlip.PackingSlipNumber" text="row.entity.packingSlipNumber"> </copy-text>\
                            <md-tooltip>{{row.entity.packingSlipNumber}}</md-tooltip> \
                         </div> \
                         <div ng-if="!row.entity.packingSlipId" class= "ui-grid-cell-contents text-left"> {{COL_FIELD}}</div> ',
        width: '140'
      };
      const packingSlipDateColumn = {
        field: 'packingslipDate',
        displayName: 'Packing Slip Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '120',
        type: 'date',
        enableFiltering: false,
        enableSorting: true
      };
      const termDaysColumn = {
        field: 'termDays',
        displayName: 'Terms Days',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '120'
      };
      const paymentDueDateColumn = {
        field: 'paymentDueDate',
        displayName: 'Payment Due Date',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<span ng-class="{\'red\': (row.entity.isPaymentDueDatePassed === 1 && row.entity.paymentStatus !== \'RE\') }">'
          + '                                           {{COL_FIELD}}'
          + '</span>'
          + '</div > ',
        width: '100',
        enableFiltering: false,
        type: 'date'
      };
      const lastRcvdPaymentDateColumn = {
        field: 'lastRcvdPaymentDate',
        displayName: 'Last Received Payment Date',
        width: '130',
        enableFiltering: false,
        type: 'date'
      };
      const salesCommissionToNameColumn = {
        field: 'salesCommissionToName',
        displayName: 'Sales Commission To',
        cellTemplate: '<div class="ui-grid-cell-contents">' +
          '<a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManagePersonnel(row.entity.salesCommissionTo);" tabindex="-1">{{COL_FIELD}}</a>' +
          '<copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.SalesCommissionTo" text="row.entity.salesCommissionToName" ng-if="row.entity.salesCommissionToName"></copy-text>' +
          '</div>',
        width: '150'
      };
      const freeOnBoardNameColumn = {
        field: 'freeOnBoardName',
        displayName: 'FOB',
        cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToFOB();" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.FreeOnBoard" text="row.entity.freeOnBoardName" ng-if="row.entity.freeOnBoardName"></copy-text>\
                        </div>',
        width: '150'
      };
      const paymentTermsColumn = {
        field: 'paymentTerms',
        displayName: 'Payment Terms',
        cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToGenericCategoryManageTerms(row.entity.termsID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Terms" text="row.entity.paymentTerms" ng-if="row.entity.paymentTerms"></copy-text>\
                        </div>',
        width: '150'
      };
      const materialStatusColumn = {
        field: 'materialStatus',
        displayName: 'Material & Invoice Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span ng-if="row.entity.materialStatus" class="label-box" ng-class="grid.appScope.$parent.vm.getMaterialStatusClass(row.entity)">'
          + '{{row.entity.materialStatus}}'
          + '</span> </div>',
        width: '200',
        enableFiltering: true,
        enableSorting: true
      };
      const isZeroValueColumn = {
        field: 'isZeroValueConverted',
        displayName: vm.ConfirmingZeroValueHeaderLable,
        width: 150,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span  ng-class="{\'label-box label-warning\':!row.entity.isZeroValue,\
                        \'label-box label-success\':row.entity.isZeroValue }"> \
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
      const revisionColumn = {
        field: 'revision',
        displayName: vm.LabelConstant.COMMON.Version,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '100'
      };
      const applyCMStatusColumn = {
        field: 'creditAppliedStatus',
        displayName: 'Credit Applied Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span ng-if="row.entity.creditAppliedStatus" class="label-box" ng-class="grid.appScope.$parent.vm.getClassNameForApplyCreditMemo(row.entity.paymentStatus)">'
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
      const isLockedStatusColumn = {
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
      };
      const isMarkForRefundCMColumn = {
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
      };
      const agreedRefunAmtCMColumn = {
        field: 'agreedRefundAmtCM',
        displayName: 'Agreed Refund Amount ($)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterAgreedRefundAmtCMTotal()}}</div>',
        width: '145',
        enableFiltering: true,
        enableSorting: true
      };
      const totRefundIssuedAgainstCreditMemoColumn = {
        field: 'totRefundIssuedAgainstCreditMemo',
        displayName: 'Refunded Amt. ($)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterRefundIssuedAgainstCMTotal()}}</div>',
        width: '125',
        enableFiltering: true,
        enableSorting: true
      };
      const creditMemoRefundStatusColumn = {
        field: 'creditMemoRefundStatusText',
        displayName: 'Credit Memo Refund Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCustCreditMemoRefundStatusClassName(row.entity.refundStatus)">'
          + '{{COL_FIELD}}'
          + '</span>'
          + '</div>',
        width: 190,
        enableFiltering: false
      };

      const LoadSourceData = () => {
        vm.sourceHeader = [
          {
            field: 'Action',
            cellClass: 'layout-align-center-center',
            displayName: 'Action',
            width: '150',
            cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="3"></grid-action-view>',
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
            field: 'transTypeText',
            displayName: 'List Type',
            width: 140,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box label-primary">'
              + '{{COL_FIELD}}'
              + '</span>'
              + '</div>',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'systemId',
            displayName: 'SystemID',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '150',
            enableFiltering: true
          },
          {
            field: 'statusConvertedValue',
            displayName: 'Status',
            width: 200,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getCoInvoiceStatusClassName(row.entity.subStatus)">'
              + '{{row.entity.statusConvertedValue}}'
              + '</span>'
              + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.transType === 'I' ? CORE.CustInvoiceStatusGridHeaderDropdown : CORE.CustCrNoteStatusGridHeaderDropdown
            },
            enableFiltering: true,
            enableSorting: true,
            ColumnDataType: 'StringEquals'
          },
          {
            field: 'customerName',
            displayName: 'Customer',
            cellTemplate: '<div class="ui-grid-cell-contents"><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);$event.preventDefault();">{{row.entity.customerName}}</a>\
                            <copy-text label="\'Customer\'" text="row.entity.customerName" ng-if="row.entity.customerName"></div>',
            width: '280'
          },
          {
            field: 'invoiceNumber',
            displayName: 'Invoice#',
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-if="grid.appScope.$parent.vm.transType === \'I\'" tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageCustomerInvoice(row.entity.id);$event.preventDefault();">{{row.entity.invoiceNumber}}</a> \
                          <span ng-if="grid.appScope.$parent.vm.transType === \'C\'" class="ui-grid-cell-contents" > {{row.entity.invoiceNumber}}</span> \
                          <copy-text  label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber" text="row.entity.invoiceNumber" ng-if="row.entity.invoiceNumber"> </copy-text>\
                                        <md-tooltip ng-if="row.entity.invoiceNumber">{{row.entity.invoiceNumber}}</md-tooltip> \
                      <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.isLocked === 1 && grid.appScope.$parent.vm.transType === \'I\'" style="margin-left:5px !important;"> </md-icon></div>',
            width: '150'
          },
          {
            field: 'invoiceDate',
            displayName: 'Invoice Date', cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '150',
            type: 'date',
            enableFiltering: false
          },
          {
            field: 'poNumber',
            displayName: 'PO#',
            width: 170,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.refSalesOrderID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrder(row.entity.refSalesOrderID);$event.preventDefault();">{{row.entity.poNumber}}</a>\
                                        <copy-text ng-if="row.entity.poNumber"  label="grid.appScope.$parent.vm.CORE.LabelConstant.SalesOrder.PO" text="row.entity.poNumber"> </copy-text>\
                                        <md-tooltip  ng-if="row.entity.poNumber">{{row.entity.poNumber}}</md-tooltip>\
                                </div>\
                        <div class="ui-grid-cell-contents" ng-if="!row.entity.refSalesOrderID">\
                                        {{row.entity.poNumber}}\
                                    </div>',
            enableFiltering: true,
            enableSorting: true
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
            width: '120',
            type: 'date',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'soNumber',
            displayName: 'SO#',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.refSalesOrderID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSalesOrder(row.entity.refSalesOrderID);$event.preventDefault();">{{row.entity.soNumber}}</a>\
                                  <copy-text  ng-if="row.entity.soNumber" label="grid.appScope.$parent.vm.CORE.LabelConstant.SalesOrder.SO" text="row.entity.soNumber"> </copy-text>\
                                          <md-tooltip ng-if="row.entity.soNumber" > {{ row.entity.soNumber }}</md-tooltip >\
                                    </div>\
                              <div class="ui-grid-cell-contents" ng-if="!row.entity.refSalesOrderID">\
                                        {{row.entity.soNumber}}\
                                    </div>',
            width: '150',
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'totalNumber',
            displayName: 'No of Items',
            cellTemplate: '<div class="ui-grid-cell-contents text-center">\
                                      <span ng-if="row.entity.totalNumber">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerInvoiceDetailList(row.entity);$event.preventDefault();">{{row.entity.totalNumber}}</a>\
                                        <md-tooltip>{{row.entity.totalNumber}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.totalNumber">\
                                        {{row.entity.packingSlipCnt}}\
                                    </span>\
                                    </div>',
            width: '100',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'totalAmount',
            displayName: 'Total Amount ($)',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount}}</div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterInvAmountTotal()}}</div>',
            width: '150'
          },
          {
            field: 'receivedAmount',
            displayName: vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE ? 'Applied CM Amount ($)' : 'Received Amount ($)',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.receivedAmount != null && row.entity.receivedAmount != undefined">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': row.entity.receivedAmount < 0, \'cm-text-decoration\': row.entity.receivedAmount>=0}" \
                              ng-click="grid.appScope.$parent.vm.showPaymentTransactions(row.entity, $event);" tabindex="-1"> \
                                  {{COL_FIELD | amount}} \
                          </a> \
                          <copy-text label="grid.appScope.$parent.vm.LabelConstant.CustomerInvoice.Received" text="COL_FIELD"></copy-text>\
                        </div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterReceivedAmountTotal()}}</div>',
            width: '160'
          },
          {
            field: 'pendingAmount',
            displayName: vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE ? 'Remaining Amt. ($) (Incl. Amt. to be Refunded)' : 'Open Balance ($)',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'color- red\': COL_FIELD < 0}" \
             ng-if= "row.entity.pendingAmount != null && row.entity.pendingAmount != undefined" > \
            {{COL_FIELD | amount }}</div> ',
            footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterPendingAmountTotal()}}</div>',
            width: vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE ? '165' : '150'
          },
          {
            field: 'packingslipDocumentCount',
            displayName: 'Packing Slip Document',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">'
              + '<span ng-if="row.entity.packingslipDocumentCount > 0"> '
              + '<a tabindex="-1" class= "cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToPackingSlipDocument(row.entity.id);$event.preventDefault();" > {{ COL_FIELD  }}</a >'
              + ' <md-tooltip>Packing Slip Document</md-tooltip> </span>'
              + '<span ng-if="row.entity.packingslipDocumentCount === 0"> '
              + '{{ COL_FIELD }}</span>'
              + '</div > ',
            width: '120'
          },
          {
            field: 'shippingMethodName',
            displayName: 'Shipping Method',
            cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryShippingType(row.entity.shippingMethodId);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ShippingMethod" text="row.entity.shippingMethodName" ng-if="row.entity.shippingMethodName"></copy-text>\
                        </div>',
            width: '150'
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
            field: 'invoiceDocumentCount',
            displayName: 'Invoice Document',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">'
              + '<span ng-if="row.entity.invoiceDocumentCount > 0"> '
              + '<a tabindex="-1" class= "cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerInvoiceDocument(row.entity.id);$event.preventDefault();" > {{ COL_FIELD  }}</a >'
              + ' <md-tooltip>Invoice Document</md-tooltip> </span>'
              + '<span ng-if="row.entity.invoiceDocumentCount === 0"> '
              + '{{ COL_FIELD }}</span>'
              + '</div > ',
            width: '150'
          },
          {
            field: 'paymentNumber',
            displayName: 'Payment# or Check#',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '150',
            enableFiltering: false
          },
          {
            field: 'billingAddress',
            displayName: vm.LabelConstant.Address.BillingAddress,
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '280',
            enableFiltering: false
          },
          {
            field: 'billToContactPerson',
            displayName: vm.LabelConstant.COMMON.BillingAddressContactPerson,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '300',
            enableFiltering: false
          },
          {
            field: 'shippingAddress',
            displayName: vm.LabelConstant.Address.ShippingAddress,
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '280',
            enableFiltering: false
          },
          {
            field: 'shipToToContactPerson',
            displayName: vm.LabelConstant.COMMON.ShippingAddressContactPerson,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '300',
            enableFiltering: false
          },
          {
            field: 'intermediateAddress',
            displayName: vm.LabelConstant.Address.MarkForAddress,
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '280',
            enableFiltering: false
          },
          {
            field: 'markToToContactPerson',
            displayName: vm.LabelConstant.COMMON.MarkForContactPerson,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: '300',
            enableFiltering: false
          },
          {
            field: 'packingSlipComment',
            displayName: 'Header Shipping Comments',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
              '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
              '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.packingSlipComment && row.entity.packingSlipComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showHeaderShippingComments(row, $event)">' +
              '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
              '<md-tooltip>View</md-tooltip>' +
              '</button>' +
              '</div>',
            width: '140',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'headerComment',
            displayName: 'Header Internal Notes',
            cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
              '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
              '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.headerComment && row.entity.headerComment !== \'-\'" ng-click="grid.appScope.$parent.vm.showHeaderInternalNotes(row, $event)">' +
              '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
              '<md-tooltip>View</md-tooltip>' +
              '</button>' +
              '</div>',
            width: '140',
            enableFiltering: false,
            enableSorting: true
          },
          {
            field: 'invoiceTrackNumber',
            displayName: 'Tracking# Count',
            cellTemplate: '<div flex class="text-center"> <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.showTrackingNumber(row, $event,true);$event.preventDefault();">{{row.entity.cpTrackNumberCount}}</a></div>',
            width: '150',
            enableFiltering: false,
            enableSorting: true
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
            field: 'updatedAt',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false,
            visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
          },
          {
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
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableSorting: true,
            enableFiltering: true,
            visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
          }
        ];
        if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          vm.sourceHeader.splice(5, 0, applyCMStatusColumn);
          vm.sourceHeader.splice(6, 0, creditMemoRefundStatusColumn);
          vm.sourceHeader.splice(7, 0, isLockedStatusColumn);
          vm.sourceHeader.splice(8, 0, creditNoteNumberColumn);
          vm.sourceHeader.splice(9, 0, revisionColumn);
          vm.sourceHeader.splice(10, 0, creditNoteDateColumn);
          vm.sourceHeader.splice(11, 0, refDebitMemoNumberColumn);
          vm.sourceHeader.splice(12, 0, refDebitMemoDateColumn);
          vm.sourceHeader.splice(13, 0, rmaNumberColumn);
          vm.sourceHeader.splice(18, 0, paymentTermsColumn);
          vm.sourceHeader.splice(19, 0, termDaysColumn);
          vm.sourceHeader.splice(20, 0, paymentDueDateColumn);
          vm.sourceHeader.splice(28, 0, isMarkForRefundCMColumn);
          vm.sourceHeader.splice(29, 0, agreedRefunAmtCMColumn);
          vm.sourceHeader.splice(30, 0, totRefundIssuedAgainstCreditMemoColumn);
        } else {
          vm.sourceHeader.splice(4, 0, materialStatusColumn);
          vm.sourceHeader.splice(5, 0, paymentStatusColumn);
          vm.sourceHeader.splice(6, 0, PackingSlipStatusColumn);
          vm.sourceHeader.splice(7, 0, isLockedStatusColumn);
          vm.sourceHeader.splice(9, 0, invoiceTypeColumn);
          vm.sourceHeader.splice(12, 0, revisionColumn);
          vm.sourceHeader.splice(16, 0, packingSlipNumberColumn);
          vm.sourceHeader.splice(17, 0, packingSlipDateColumn);
          vm.sourceHeader.splice(18, 0, paymentTermsColumn);
          vm.sourceHeader.splice(19, 0, termDaysColumn);
          vm.sourceHeader.splice(20, 0, paymentDueDateColumn);
          vm.sourceHeader.splice(21, 0, lastRcvdPaymentDateColumn);
          vm.sourceHeader.splice(29, 0, freeOnBoardNameColumn);
          vm.sourceHeader.splice(30, 0, salesCommissionToNameColumn);
          // vm.sourceHeader.splice(31, 0, shippingMethodName);
          vm.sourceHeader.splice(42, 0, isZeroValueColumn);
        }
      };
      LoadSourceData();

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? [['paymentDueDate', 'ASC']] : [['id', 'DESC']],
          SearchColumns: [],
          transType: vm.transType,
          isSummary: true
        };
      };
      initPageInfo();

      // set search data get from state parameters query string
      if (vm.hasUrlSearchData && vm.paramSearchObj && vm.paramSearchObj.customerID) {
        vm.mfgCodeDetailModel = [vm.paramSearchObj.customerID];
        vm.dueDate = $state.params.dueDate || null;
        vm.additionalDays = (vm.paramSearchObj.additionalDays && vm.paramSearchObj.additionalDays !== '0') ? parseInt(vm.paramSearchObj.additionalDays) : null;
        vm.termsAndAboveDays = (vm.paramSearchObj.termsAndAboveDays && vm.paramSearchObj.termsAndAboveDays !== '0') ? parseInt(vm.paramSearchObj.termsAndAboveDays) : null;
        vm.isApplyDueDateFilters = (vm.dueDate || vm.termsAndAboveDays) ? true : false;
        if (vm.paramSearchObj.isIncludeZeroValueInv && vm.paramSearchObj.isIncludeZeroValueInv === 'false') { // get invoice greater than 0 value amount
          const ghTotalAmountFieldDet = _.find(vm.sourceHeader, (shItem) => shItem.field === 'totalAmount');
          if (ghTotalAmountFieldDet) {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'totalAmount', SearchString: 0.01, ColumnDataType: 'Grater' });
          }
        }
        vm.hasUrlSearchData = false;
      }

      const formatDataForExport = (allData) => {
        _.map(allData, (data) => {
          data.soDate = BaseService.getUIFormatedDate(data.soDate, vm.DefaultDateFormat);
          data.paymentDueDate = BaseService.getUIFormatedDate(data.paymentDueDate, vm.DefaultDateFormat);
          data.lastRcvdPaymentDate = BaseService.getUIFormatedDate(data.lastRcvdPaymentDate, vm.DefaultDateFormat);
          data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
          data.packingslipDate = BaseService.getUIFormatedDate(data.packingslipDate, vm.DefaultDateFormat);
          data.invoiceDate = BaseService.getUIFormatedDate(data.invoiceDate, vm.DefaultDateFormat);
          data.creditMemoDate = BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat);
          data.refDebitMemoDate = BaseService.getUIFormatedDate(data.refDebitMemoDate, vm.DefaultDateFormat);
        });
      };

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: true,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: (vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Customer Invoice Summary.csv' : 'Customer Credit Memo Summary.csv'),
        CurrentPage: CORE.PAGENAME_CONSTANT[36].PageName,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          /* For scrolling pagination vm.pagingInfo.Page is increase everytime so we have to set API side pagePerReocrds as NULL for Export All Data */
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerPackingSlipFactory.retriveInvoicelist().query(pagingInfoOld).$promise.then((customerInvoice) => {
            if (customerInvoice.status === CORE.ApiResponseTypeStatus.SUCCESS && customerInvoice.data) {
              formatDataForExport(customerInvoice.data.invoice);
              return customerInvoice.data.invoice;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //bind source disabled details
      const bindGridDetails = (sourceData) => {
        _.map(sourceData, (data) => {
          data.soDate = BaseService.getUIFormatedDate(data.soDate, vm.DefaultDateFormat);
          data.paymentDueDate = BaseService.getUIFormatedDate(data.paymentDueDate, vm.DefaultDateFormat);
          data.lastRcvdPaymentDate = BaseService.getUIFormatedDate(data.lastRcvdPaymentDate, vm.DefaultDateFormat);
          data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
          data.packingslipDate = BaseService.getUIFormatedDate(data.packingslipDate, vm.DefaultDateFormat);
          data.invoiceDate = BaseService.getUIFormatedDate(data.invoiceDate, vm.DefaultDateFormat);
          data.creditMemoDate = BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat);
          data.refDebitMemoDate = BaseService.getUIFormatedDate(data.refDebitMemoDate, vm.DefaultDateFormat);
          data.isDisableManageTrackingNumber = vm.isTrackingNumberUpdationPermission;
          //data.isDisabledDelete = data.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT ? true : false;
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE && data.subStatus !== CORE.CUSTINVOICE_SUBSTATUS.DRAFT) {
            data.isDisabledDelete = true;
          } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE && data.subStatus !== CORE.CUSTCRNOTE_SUBSTATUS.DRAFT) {
            data.isDisabledDelete = true;
            data.isDisabledApplyCustCreditMemo = false;
          } else {
            data.isDisabledDelete = false;
            data.isDisabledApplyCustCreditMemo = true;
          }
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
            data.lockUnlockTransactionBtnText = data.isLocked ? 'Unlock Customer Invoice' : 'Lock Customer Invoice';
            data.isDisableLockUnlockTransaction = !vm.enableLockTransaction;
          } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
            data.lockUnlockTransactionBtnText = data.isLocked ? 'Unlock Customer Credit Memo' : 'Lock Customer Credit Memo';
            data.isDisableLockUnlockTransaction = !vm.enableLockTransaction;
          };
          data.lockUnlockTransactionIcon = data.isLocked ? 'icon-lock-unlocked' : 'icon-lock';
          data.isPrintDisable = false;
          data.isDownloadDisabled = false;
        });
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (customerInvoice, isGetDataDown) => {
        if (customerInvoice && customerInvoice.data && customerInvoice.data.invoice) {
          vm.isAllFilterClear = false;
          bindGridDetails(customerInvoice.data.invoice);
          if (!isGetDataDown) {
            vm.sourceData = customerInvoice.data.invoice;
            vm.currentdata = vm.sourceData.length;
          }
          else if (customerInvoice.data.invoice.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(customerInvoice.data.invoice);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = customerInvoice.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || vm.pagingInfo.chequeNumber || vm.pagingInfo.filterStatus.length > 0
              || vm.pagingInfo.paymentStatusFilter || vm.pagingInfo.creditAppliedStatusFilter) {
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

      /* retrieve Customer invoice detail list*/
      vm.loadData = () => {
        if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
          return;
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        filterSelectOption();
        setFilteredLabels(true);
        if (vm.pagingInfo.SortColumns.length === 0) {
          // vm.pagingInfo.SortColumns = [['id', 'DESC']];
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
            vm.pagingInfo.SortColumns = [['paymentDueDate', 'ASC']];
          } else {
            vm.pagingInfo.SortColumns = [['id', 'DESC']];
          }
        };
        vm.cgBusyLoading = CustomerPackingSlipFactory.retriveInvoicelist().query(vm.pagingInfo).$promise.then((customerInvoice) => {
          vm.sourceData = [];
          if (customerInvoice && customerInvoice.data) {
            setDataAfterGetAPICall(customerInvoice, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //call when user scroll down on list page
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerPackingSlipFactory.retriveInvoicelist().query(vm.pagingInfo).$promise.then((customerInvoice) => {
          if (customerInvoice && customerInvoice.data) {
            setDataAfterGetAPICall(customerInvoice, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* delete customer packing slip*/
      vm.deleteRecord = (customerInvoice) => {
        let selectedIDs = [];
        let lockInv;
        const checkForStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT);
        const refCustomerInvoiceIDs = [];
        if (customerInvoice) {
          if (customerInvoice.id) {
            if (customerInvoice.isLocked === 1 || (customerInvoice.subStatus !== checkForStatus) || customerInvoice.paymentStatus !== 'PE') {
              locInv = customerInvoice;
            } else {
              selectedIDs.push(customerInvoice.id);
            }
          }
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            lockInv = _.filter(vm.selectedRows, (det) => det.isLocked === 1 || (det.subStatus !== checkForStatus) || det.paymentStatus !== 'PE');
            selectedIDs = (_.filter(vm.selectedRows, (detID) => detID.id)).map((item) => item.id);
          }
        }

        if (lockInv && lockInv.length > 0) {
          let messageContent;
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVOICE_LOCKED_FOR_PAYMENT);
            messageContent.message = stringFormat(messageContent.message, _.map(lockInv, (item) => item.invoiceNumber));
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CREDIT_MEMO_NOT_ALLOW_DELETE);
            messageContent.message = stringFormat(messageContent.message, _.map(lockInv, (item) => item.creditMemoNumber));
          }
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);
          return;
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.transType === 'C' ? 'Credit Memo Details' : 'Invoice Details', (selectedIDs.length));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CustomerPackingSlipID: refCustomerInvoiceIDs,
            CountList: false,
            transType: vm.transType
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = CustomerPackingSlipFactory.deleteCustomerInvoice().query({ objIDs: objIDs }).$promise.then(() => {
                vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
                vm.loadData();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      // Get Term and Condition from Data key for invoice report
      const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
        if (dataKey) {
          vm.dataKey = dataKey.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
      getDataKey();

      //print Customer Invoice report/ Credit Memo Report
      vm.printRecord = (row, isDownload) => {
        if (isDownload) {
          row.entity.isDownloadDisabled = true;
        } else {
          row.entity.isPrintDisable = true;
        }
        let dataKeyvalue;
        _.each(vm.dataKey, (item) => {
          if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
            return dataKeyvalue = item.values;
          }
        });
        const reportDetails = {
          id: row.entity.id,
          termsAndCondition: dataKeyvalue, //As per discussion with DP sir no need to show for invoice report but we need to get for future backup
          invoiceDisclaimer: CORE.Invoice_Report_Disclaimer,
          custData: {
            creditMemoNumber: row.entity.creditMemoNumber,
            invoiceNumber: row.entity.invoiceNumber,
            revision: row.entity.revision,
            customerCode: row.entity.customerCode,
            statusName: CORE.CustInvoiceStatusGridHeaderDropdown[1].value === row.entity.statusConvertedValue ? `-${row.entity.statusConvertedValue.toUpperCase()}` : ''
          }
        };
        if (vm.transType === vm.CORE.TRANSACTION_TYPE.CREDITNOTE) {
          reportName = CORE.REPORT_NAME.Credit_Memo;
          CustomerPackingSlipFactory.getCustomerCreditMemoReportDetails(reportDetails).then((response) => {
            const custData = response.config.data.custData;
            if (isDownload) {
              row.entity.isDownloadDisabled = false;
            } else {
              row.entity.isPrintDisable = false;
            }
            BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_CREDIT_MEMO, custData.creditMemoNumber, custData.revision, custData.customerCode, custData.statusName), isDownload, true);
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) {
          reportName = CORE.REPORT_NAME.Customer_Invoice;
          CustomerPackingSlipFactory.getCustomerInvoiceReportDetails(reportDetails).then((response) => {
            const custData = response.config.data.custData;
            if (isDownload) {
              row.entity.isDownloadDisabled = false;
            } else {
              row.entity.isPrintDisable = false;
            }
            BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_INVOICE, custData.invoiceNumber, custData.revision, custData.customerCode, custData.statusName), isDownload, true);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // add new record
      vm.addCustomerInvoice = () => {
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { id: 0 });
      };
      //update record
      vm.updateRecord = (row) => {
        if (row.entity.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          BaseService.goToManageCustomerInvoice(row.entity.id);
        } else if (row.entity.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          BaseService.goToCustomerCreditMemoDetail(row.entity.id);
        }
      };
      //go to sales order
      vm.goToSalesOrder = (id) => {
        BaseService.goToManageSalesOrder(id);
        return;
      };

      // go to  payment terms
      vm.goToTermsList = () => {
        BaseService.goToGenericCategoryTermsList();
      };

      //open log for customer packing slip
      vm.opencustomerpackingSlipChangesHistoryAuditLog = (row, ev) => {
        const data = {
          customerPackingId: row.entity.id
        };
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          data.invoiceNumber = row.entity.invoiceNumber;
          data.refSalesOrderID = row.entity.refSalesOrderID;
          data.transType = vm.transType;
        } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          data.invoiceNumber = null;
          data.refSalesOrderID = null;
          data.transType = vm.transType;
          data.creditMemoNumber = row.entity.creditMemoNumber;
        }
        DialogFactory.dialogService(
          CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_CONTROLLER,
          CORE.CUSTOMER_TRANSACTION_CHANGE_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
      };

      //search chequenumber
      vm.SearchData = () => {
        vm.pagingInfo.chequeNumber = null;
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };

      //restet filter details
      vm.resetSearch = () => {
        vm.chequeNumber = null;
        vm.pagingInfo.SearchColumns = [];
        vm.pagingInfo.chequeNumber = null;
        vm.checkSerachType = vm.POSerachType = vm.CheckSearchTypeList[1].id;
        vm.isCheckAll = true;
        vm.statusModel = [];
        vm.getStatusSearch();
        vm.isApplyDueDateFilters = false;
        vm.dueDate = vm.additionalDays = vm.termsAndAboveDays = vm.mfrSearchText = vm.invoiceNumber = undefined;
        vm.mfrSearchText = null;
        vm.mfgCodeDetailModel = [];
        mfrListToFilter = angular.copy(vm.mfgCodeDetail);
        vm.mfgCodeListToDisplay = vm.mfrSearchText ? _.filter(mfrListToFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.mfrSearchText.toLowerCase())) : mfrListToFilter;
        vm.clearTermSearchText();
        vm.paymentTermsDetailModel = [];
        vm.poNumber = null;
        vm.fromDate = null;
        vm.toDate = null;
        vm.isNotInvoiced = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
        vm.isWaitingForPayment = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
        vm.isPartialPayment = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? true : false;
        vm.isPaymentRec = false;
        vm.isUnappliedCredit = vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE ? true : false;
        vm.isPartialCreditApplied = vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE ? true : false;
        if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          vm.isRefundNotApplicable = vm.isPendingRefund = vm.isPartialCMRefunded = true;
          vm.isFullCMRefunded = false;
        } else if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          vm.isRefundNotApplicable = vm.isPendingRefund = vm.isPartialCMRefunded = vm.isFullCMRefunded = false;
        }
        vm.isFullCreditApplied = false;
        vm.isNoPendingCredit = false;
        vm.isFilterZeroAmount = false;
        vm.selectedDateType = vm.listDateFilterList[0].key;
        vm.searchComments = null;

        vm.clearManufacturerFilter();
        vm.clearTermsFilter();
        //vm.clearStatusFilter();
        vm.resetDateFilter();
        vm.partIds = [];
        vm.gridOptions.gridApi.grid.clearAllFilters();
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };
      //==> Clear search within filter boxes
      vm.clearMfrSearchText = () => {
        vm.mfrSearchText = undefined;
        vm.searchMfrList();
      };

      vm.clearTermSearchText = () => {
        vm.termSearchText = undefined;
        vm.searchTermList();
      };

      vm.clearStatusSearchText = () => {
        vm.statusSearchText = undefined;
        vm.searchStatusList();
      };

      //status filter for customer invoice
      vm.statusFilter = () => {
        if (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) {
          if (vm.isShippedNotInv && vm.isInvoiced && vm.isCorctInv) {
            vm.isCheckAll = true;
          } else if (!vm.isShippedNotInv || !vm.isInvoiced || !vm.isCorctInv) {
            vm.isCheckAll = false;
          } else if (!vm.isShippedNotInv && !vm.isInvoiced && !vm.isCorctInv) {
            vm.isCheckAll = true;
          }
          if (!vm.isCheckPaid) {
            vm.chequeNumber = undefined;
          }
        }
      };

      //filter based on status selection
      const filterSelectOption = () => {
        let strFilter = 0;// = ',AL';
        // filter out selected status
        if (vm.statusModel && vm.statusModel.length > 0) {
          vm.pagingInfo.filterStatus = vm.statusModel.join(',');
        }
        else {
          vm.pagingInfo.filterStatus = null;
        }

        // filter based on due date
        if (vm.dueDate) {
          vm.pagingInfo.dueDate = (BaseService.getAPIFormatedDate(vm.dueDate));
        }
        else {
          vm.pagingInfo.dueDate = null;
        }

        vm.pagingInfo.additionalDays = vm.additionalDays;

        vm.pagingInfo.termsAndAboveDays = null;
        if (vm.isApplyDueDateFilters) {
          vm.pagingInfo.termsAndAboveDays = vm.termsAndAboveDays ? vm.termsAndAboveDays : 0;
        }

        // filter out PO Number
        vm.pagingInfo.poNumber = vm.poNumber;
        // console.log(vm.POSerachType);
        vm.pagingInfo.isExactSearchPO = vm.POSerachType === vm.CheckSearchTypeList[0].id ? true : false;

        // filter out selected customer
        if (vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0) {
          vm.pagingInfo.mfgCodeIds = vm.mfgCodeDetailModel.join(',');
        }
        else {
          vm.pagingInfo.mfgCodeIds = null;
        }
        // filter out selected terms
        if (vm.paymentTermsDetailModel && vm.paymentTermsDetailModel.length > 0) {
          vm.pagingInfo.paymentTermsIds = vm.paymentTermsDetailModel.join(',');
        }
        else {
          vm.pagingInfo.paymentTermsIds = null;
        }
        // filter out check  number
        if (vm.checkSerachType === vm.CheckSearchTypeList[0].id) {
          vm.pagingInfo.chequeNumber = vm.chequeNumber ? vm.chequeNumber : null;
        } else if (vm.checkSerachType === vm.CheckSearchTypeList[1].id) {
          if (vm.chequeNumber) {
            const itemIndexCheque = _.findIndex(vm.pagingInfo.SearchColumns, (data) => data.ColumnName === 'paymentNumber');
            if (itemIndexCheque !== -1) {
              vm.pagingInfo.SearchColumns.splice(itemIndexCheque, 1);
            }
            vm.pagingInfo.SearchColumns.push({
              ColumnName: 'paymentNumber', SearchString: vm.chequeNumber ? vm.chequeNumber : null
            });
          } else {
            const itemIndexCheque = _.findIndex(vm.pagingInfo.SearchColumns, (data) => data.ColumnName === 'paymentNumber');
            if (itemIndexCheque !== -1) {
              vm.pagingInfo.SearchColumns.splice(itemIndexCheque, 1);
            }
          }
        } else {
          vm.pagingInfo.chequeNumber = null;
          const itemIndexCheque = _.findIndex(vm.pagingInfo.SearchColumns, (data) => data.ColumnName === 'paymentNumber');
          if (itemIndexCheque !== -1) {
            vm.pagingInfo.SearchColumns.splice(itemIndexCheque, 1);
          }
        }
        // filter from date to date
        vm.pagingInfo.selectedDateType = vm.selectedDateType;
        if (vm.fromDate) {
          vm.pagingInfo.fromDate = BaseService.getAPIFormatedDate(vm.fromDate);
        } else {
          vm.pagingInfo.fromDate = null;
        }
        if (vm.toDate) {
          vm.pagingInfo.toDate = BaseService.getAPIFormatedDate(vm.toDate);
        } else {
          vm.pagingInfo.toDate = null;
        }

        //filter payment status
        strFilter = 'NA';
        if (vm.isNotInvoiced) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CustPaymentStatusInInvoice[1].id);
        }
        if (vm.isWaitingForPayment) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CustPaymentStatusInInvoice[2].id);
        }
        if (vm.isPartialPayment) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CustPaymentStatusInInvoice[3].id);
        }
        if (vm.isPaymentRec) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CustPaymentStatusInInvoice[4].id);
        }
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE && !vm.isNotInvoiced && !vm.isWaitingForPayment && !vm.isPartialPayment && !vm.isPaymentRec) {
          strFilter = null;
        }
        if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          strFilter = null;
        }
        vm.pagingInfo.paymentStatusFilter = strFilter;

        vm.pagingInfo.creditAppliedStatusFilter = null;
        vm.pagingInfo.creditMemoRefundStatusFilter = null;
        if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          // Credit Applied Status filter
          strCreditAppliedStatusFilter = null;
          if (vm.isUnappliedCredit) {
            strCreditAppliedStatusFilter = stringFormat('{0},{1}', strCreditAppliedStatusFilter, vm.ApplyCustCreditMemoStatusTextConst.UnappliedCredit.Code);
          }
          if (vm.isPartialCreditApplied) {
            strCreditAppliedStatusFilter = stringFormat('{0},{1}', strCreditAppliedStatusFilter, vm.ApplyCustCreditMemoStatusTextConst.PartialCreditApplied.Code);
          }
          if (vm.isFullCreditApplied) {
            strCreditAppliedStatusFilter = stringFormat('{0},{1}', strCreditAppliedStatusFilter, vm.ApplyCustCreditMemoStatusTextConst.FullCreditApplied.Code);
          }
          if (vm.isNoPendingCredit) {
            strCreditAppliedStatusFilter = stringFormat('{0},{1}', strCreditAppliedStatusFilter, vm.ApplyCustCreditMemoStatusTextConst.NoPendingCredit.Code);
          }
          vm.pagingInfo.creditAppliedStatusFilter = strCreditAppliedStatusFilter;

          // Credit memo refund Status filter
          let strCMRefundStatusFilter = null;
          if (vm.isRefundNotApplicable) {
            strCMRefundStatusFilter = stringFormat('{0},{1}', strCMRefundStatusFilter, vm.CustomerCreditMemoRefundStatusTextConst.NotApplicable.Code);
          }
          if (vm.isPendingRefund) {
            strCMRefundStatusFilter = stringFormat('{0},{1}', strCMRefundStatusFilter, vm.CustomerCreditMemoRefundStatusTextConst.PendingRefund.Code);
          }
          if (vm.isPartialCMRefunded) {
            strCMRefundStatusFilter = stringFormat('{0},{1}', strCMRefundStatusFilter, vm.CustomerCreditMemoRefundStatusTextConst.PartialCMRefunded.Code);
          }
          if (vm.isFullCMRefunded) {
            strCMRefundStatusFilter = stringFormat('{0},{1}', strCMRefundStatusFilter, vm.CustomerCreditMemoRefundStatusTextConst.FullCMRefunded.Code);
          }
          vm.pagingInfo.creditMemoRefundStatusFilter = strCMRefundStatusFilter;
        }

        // filter zero amount invoice{}
        if (vm.isFilterZeroAmount) {
          vm.pagingInfo.isFilterZeroAmount = true;
        } else {
          vm.pagingInfo.isFilterZeroAmount = null;
        }
        vm.pagingInfo.searchComments = vm.searchComments || null;
      };

      //paid customer invoice detail
      vm.paidCustomerPackingSlip = (event) => {
        let messageContent;
        let alertModel;
        const checkApprove = _.some(vm.selectedRowsList, (data) => data.packingSlipStatus !== 'A');


        if (checkApprove) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.NOT_PAID_INVOICE);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }
        const checkCustomer = _.uniqBy(vm.selectedRowsList, 'customerName');
        if (checkCustomer.length > 1) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MUST_BE_SAME_CUSTOMER);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }
        const containAllRecord = angular.copy(vm.selectedRowsList);
        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_CUSTOMER_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_CUSTOMER_PACKAGING_VIEW,
          event,
          containAllRecord).then(() => {
          }, (paid) => {
            if (paid) {
              vm.gridOptions.clearSelectedRows();
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      };
      // lock record from grid action
      vm.lockUnlockRecord = (row, ev, isLockTransactionAction) => {
        vm.lockUnlockData(row.entity, isLockTransactionAction);
      };
      // lock multiple records
      vm.lockUnlockData = (rowEntity, isLockTransactionAction) => {
        if (!vm.enableLockTransaction) {
          return;
        }

        const isLockTransactionOnRecords = (rowEntity && rowEntity.isLocked !== 1) || isLockTransactionAction ? true : false;

        let messageContent;
        let lockInv;
        // vm.selectedRows = [];
        if (rowEntity) {
          vm.selectedRows = [rowEntity];
        } else {
          vm.selectedRows = vm.selectedRowsList;
        }
        let statusText;
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          statusText = stringFormat('{0} or {1} or {2}', CORE.CUSTINVOICE_SUBSTATUS_TEXT.DRAFT, CORE.CUSTINVOICE_SUBSTATUS_TEXT.PUBLISHED, CORE.CUSTINVOICE_SUBSTATUS_TEXT.SHIPPEDNOTINVOICED);
        } else {
          statusText = 'Draft';
        }

        if (isLockTransactionOnRecords) { // make transaction lock
          // const statusText = stringFormat('{0} or {1} or {2}', CORE.CUSTINVOICE_SUBSTATUS_TEXT.DRAFT, CORE.CUSTINVOICE_SUBSTATUS_TEXT.PUBLISHED, CORE.CUSTINVOICE_SUBSTATUS_TEXT.SHIPPEDNOTINVOICED);
          if (rowEntity && (rowEntity.isLocked === 1 ||
            (vm.transType === CORE.TRANSACTION_TYPE.INVOICE &&
              (rowEntity.subStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT || rowEntity.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED || rowEntity.subStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED))
            || (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE && rowEntity.subStatus === CORE.CUSTCRNOTE_SUBSTATUS.DRAFT))) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SINGLE_LOCK_RECORD_ERROR);
            if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
              messageContent.message = stringFormat(messageContent.message, statusText, 'Invoice');
            } else {
              messageContent.message = stringFormat(messageContent.message, CORE.CUSTCRNOTE_SUBSTATUS_TEXT.DRAFT, 'Credit Memo');
            }
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            return;
          } else if (vm.selectedRows.length > 0) {
            lockInv = _.filter(vm.selectedRows, (det) => det.subStatus === CORE.CUSTINVOICE_SUBSTATUS.DRAFT || det.subStatus === CORE.CUSTINVOICE_SUBSTATUS.PUBLISHED || det.subStatus === CORE.CUSTINVOICE_SUBSTATUS.SHIPPEDNOTINVOICED || det.isLocked === 1);
          }
          if (lockInv && lockInv.length > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PUBLISH_TRANSACTION_BEFORE_LOCK);
            if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
              messageContent.message = stringFormat(messageContent.message, statusText, 'Invoice');
            } else {
              messageContent.message = stringFormat(messageContent.message, CORE.CUSTCRNOTE_SUBSTATUS_TEXT.DRAFT, 'Credit Memo');
            }
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            return;
          }

          /* check all credit used/refunded for credit memo */
          if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
            let isAnyAdjustmentPendingAmtOfCustCM = false;
            if (rowEntity) {
              isAnyAdjustmentPendingAmtOfCustCM = rowEntity.adjustmenPendingAmt && rowEntity.pendingAmount > 0;
            } else {
              isAnyAdjustmentPendingAmtOfCustCM = _.some(vm.selectedRowsList, (payItem) => Math.abs(payItem.pendingAmount) && Math.abs(payItem.pendingAmount) > 0);
            }
            if (isAnyAdjustmentPendingAmtOfCustCM) {
              displayCMAdjustmentPendingAmtMsg(rowEntity);
              return;
            }
          }

          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOCK_RECORD_CONFIRMATION);
        } else {
          // check for any record already in unlocked mode
          let isAnyUnlockedCustPayment = false;
          if (rowEntity) {
            isAnyUnlockedCustPayment = rowEntity.isLocked !== 1;
          } else {
            isAnyUnlockedCustPayment = _.some(vm.selectedRowsList, (invCMItem) => invCMItem.isLocked !== 1);
          }
          if (isAnyUnlockedCustPayment) {
            displayAlreadyUnlockedInvCMMsg(rowEntity);
            return;
          }
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNLOCK_RECORD_CONFIRMATION);
        }

        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const selectedIds = [];
            _.each(vm.selectedRows, (item) => {
              selectedIds.push({
                invCMMstID: item.id
              });
            });
            // selectedIds = angular.copy(vm.selectedRows);
            const objCustTransLock = {
              packingSlipObj: selectedIds,
              transType: vm.transType,
              isLockTransaction: isLockTransactionOnRecords,
              isViewToBeLockUnlockRecords: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? false : true
            };
            lockDefinedTransaction(objCustTransLock, rowEntity, isLockTransactionOnRecords);
          }
        }, () => { // cancel section
        });
      };

      const lockDefinedTransaction = (objCustTransLock, rowEntity, isLockTransactionOnRecords) => {
        vm.cgBusyLoading = CustomerPackingSlipFactory.updateInvoiceLockStatus().query(objCustTransLock).$promise.then((resp) => {
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (objCustTransLock.isViewToBeLockUnlockRecords && resp.data && resp.data.toBeLockUnlockInvCMPMTList && resp.data.toBeLockUnlockInvCMPMTList.length > 0) {
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
                  if (isContinueToLockUnlock && objCustTransLock.isViewToBeLockUnlockRecords) {
                    objCustTransLock.isViewToBeLockUnlockRecords = false;
                    lockDefinedTransaction(objCustTransLock, rowEntity, isLockTransactionOnRecords);
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
              vm.loadData();
            }
          } else if (resp && resp.status === CORE.ApiResponseTypeStatus.FAILED && resp.errors && resp.errors.data) {
            if (resp.errors.data.isAnyInvCMWhichNotFullyApplied) {
              if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
                displayInvPMTReceivePendingAmtMsg();
              } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
                displayCMAdjustmentPendingAmtMsg(rowEntity);
              }
              return;
            } else if (resp.errors.data.isSomeInvCMAlreadyLockedUnlocked) {
              if (isLockTransactionOnRecords) {
                displayAlreadyLockedPMTMsg(rowEntity);
              } else {
                displayAlreadyUnlockedInvCMMsg(rowEntity);
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // display message for transactions already unlocked
      const displayAlreadyUnlockedInvCMMsg = (rowEntity) => {
        const msgContentForAlreadyLock = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAYMENT_ALREADY_UNLOCKED_FOR_UNLOCK);
        msgContentForAlreadyLock.message = stringFormat(msgContentForAlreadyLock.message, ((rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected'), invCMEntityNmForLock);
        const obj = {
          messageContent: msgContentForAlreadyLock,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      };

      // display pending payment for invoice so not allowed to lock
      const displayInvPMTReceivePendingAmtMsg = (rowEntity) => {
        const msgContentForInvPMTReceivePending = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_INV_PENDING_RECEIVE_AMT_FOR_LOCK);
        msgContentForInvPMTReceivePending.message = stringFormat(msgContentForInvPMTReceivePending.message, (rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected', 'customer invoice');
        const obj = {
          messageContent: msgContentForInvPMTReceivePending,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      };

      const displayCMAdjustmentPendingAmtMsg = (rowEntity) => {
        const msgContentForPendingAdjustmentAmt = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_CM_PENDING_ADJUSTMENT_AMT_FOR_LOCK);
        msgContentForPendingAdjustmentAmt.message = stringFormat(msgContentForPendingAdjustmentAmt.message, (rowEntity || (vm.selectedRowsList && vm.selectedRowsList.length === 1)) ? 'Selected' : 'Some of selected', 'customer credit memo');
        const obj = {
          messageContent: msgContentForPendingAdjustmentAmt,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      };

      /* to display header shipping comments */
      vm.showHeaderShippingComments = (row, ev) => {
        const popupData = {
          title: 'Header Shipping Comments',
          description: row.entity.packingSlipComment
        };
        showDescription(popupData, ev);
      };

      const showDescription = (popupData, ev) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          popupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      /* to display header internal notes */
      vm.showHeaderInternalNotes = (row, ev) => {
        const popupData = {
          title: 'Header Internal Notes',
          description: row.entity.headerComment
        };
        showDescription(popupData, ev);
      };

      /* to display tracking number */
      vm.showTrackingNumber = (row, ev, isOnlyView) => {
        if (row.entity.isLocked) {
          displayTransactionLockedWithNoAccess(row);
          return;
        }

        const popupData = {
          custPackingSlipID: row.entity.packingSlipId,
          custInvoiceID: row.entity.id,
          custInvoiceValue: row.entity.invoiceNumber,
          custPackingSlipValue: row.entity.packingSlipNumber,
          custSalesOrderID: row.entity.refSalesOrderID,
          isInvoice: true,
          IsLocked: row.entity.isLocked,
          CustomerName: row.entity.customerName,
          CustomerID: row.entity.customerID,
          custInvoiceSubstatus: row.entity.subStatus,
          SubStatus: row.entity.packingSlipStatusID,
          custInvoiceStatusValue: row.entity.statusConvertedValue,
          custPackingSlipStatusalue: row.entity.packingSlipStatus,
          isOnlyView: isOnlyView
        };
        DialogFactory.dialogService(
          CORE.CUSTOMER_TRACKING_NUMBER_CONTROLLER,
          CORE.CUSTOMER_TRACKING_NUMBER_POPUP_VIEW,
          ev, popupData).then(() => {
            vm.loadData();
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      // display message like transaction locked, not allowed to change
      const displayTransactionLockedWithNoAccess = (row) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PAY_LOCKED_WITH_NO_ACCESS);
        messageContent.message = stringFormat(messageContent.message, row.entity.invoiceNumber);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      };

      const refreshGrid = $scope.$on('refreshCustomerInvoice', () => vm.loadData());
      $scope.$on('$destroy', () => { refreshGrid(); });

      /* called for min date validation */
      //vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);
      //vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);
      /* Show Payment Details */
      vm.showPaymentTransactions = (row, event) => {
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          if (row) {
            row.refPaymentMode = null;
            row.isCustPaymentEntity = true;
            row.totalExtendedAmount = row.totalAmount;
            row.balanceAmount = row.pendingAmount;
            row.mfgCodeID = row.customerID;
          }
          DialogFactory.dialogService(
            TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER,
            TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW,
            event,
            row
          ).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
        } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          BaseService.goToApplyCustCreditMemoToPayment(row.id, row.custPaymentMstID);
        }
      };

      /* to move at apply credit memo on invoice page */
      vm.applyCustCreditMemo = (rowEntity) => {
        if (rowEntity && rowEntity.id) {
          BaseService.goToApplyCustCreditMemoToPayment(rowEntity.id, null);
        }
      };

      // download print
      vm.onDownload = (row) => vm.printRecord(row, true);

      // set applied filter chip with tool tip
      // set applied filter chip with tool tip
      const setFilteredLabels = (canReGenerateTootip) => {
        vm.CustomerInvAdvancedFilters.Customer.isDeleted = !(vm.pagingInfo.mfgCodeIds && vm.pagingInfo.mfgCodeIds.length > 0);
        vm.CustomerInvAdvancedFilters.Status.isDeleted = !(vm.pagingInfo.filterStatus && vm.pagingInfo.filterStatus.length > 0);
        vm.CustomerInvAdvancedFilters.CurrentPaymentTerm.isDeleted = !(vm.pagingInfo.paymentTermsIds && vm.pagingInfo.paymentTermsIds.length > 0);
        vm.CustomerInvAdvancedFilters.PaymentStatus.isDeleted = !(vm.pagingInfo.paymentStatusFilter && vm.pagingInfo.paymentStatusFilter.length > 0);
        vm.CustomerInvAdvancedFilters.DueDateFilter.isDeleted = !(vm.pagingInfo.dueDate);
        vm.CustomerInvAdvancedFilters.SearchPaymentNumber.isDeleted = !(vm.chequeNumber);
        vm.CustomerInvAdvancedFilters.SearchPoNumber.isDeleted = !(vm.pagingInfo.poNumber);
        vm.CustomerInvAdvancedFilters.PartId.isDeleted = !(vm.pagingInfo.mfrPNId);
        vm.CustomerInvAdvancedFilters.ZeroAmountInv.isDeleted = !(vm.pagingInfo.isFilterZeroAmount);
        vm.CustomerInvAdvancedFilters.ZeroAmountLine.isDeleted = !(vm.pagingInfo.isFilterZeroAmountLine);
        vm.CustomerInvAdvancedFilters.SalesCommIncluded.isDeleted = !(vm.pagingInfo.isCommissionIncluded);
        vm.CustomerInvAdvancedFilters.OtherChargesIncluded.isDeleted = !(vm.pagingInfo.isLineOtherChargesIncluded);
        vm.CustomerInvAdvancedFilters.CreditMemoAppliedStatus.isDeleted = !(vm.pagingInfo.creditAppliedStatusFilter && vm.pagingInfo.creditAppliedStatusFilter.length > 0);
        vm.CustomerInvAdvancedFilters.CreditMemoRefundStatus.isDeleted = !(vm.pagingInfo.creditMemoRefundStatusFilter && vm.pagingInfo.creditMemoRefundStatusFilter.length > 0);
        vm.CustomerInvAdvancedFilters.Comments.isDeleted = !(vm.pagingInfo.searchComments);
        if (vm.pagingInfo.fromDate || vm.pagingInfo.toDate) {
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
            vm.CustomerInvAdvancedFilters.InvoiceDate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[0].key);
            vm.CustomerInvAdvancedFilters.PackingSlipDate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[1].key);
            vm.CustomerInvAdvancedFilters.PODate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[2].key);
            vm.CustomerInvAdvancedFilters.SODate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[3].key);
          } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
            vm.CustomerInvAdvancedFilters.CreditDate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[0].key);
            vm.CustomerInvAdvancedFilters.DebitDate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[1].key);
            vm.CustomerInvAdvancedFilters.InvoiceDate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[2].key);
            vm.CustomerInvAdvancedFilters.PODate.isDeleted = !(vm.selectedDateType === vm.listDateFilterList[3].key);
          }
        } else {
          vm.CustomerInvAdvancedFilters.InvoiceDate.isDeleted = true;
          vm.CustomerInvAdvancedFilters.PackingSlipDate.isDeleted = true;
          vm.CustomerInvAdvancedFilters.PODate.isDeleted = true;
          vm.CustomerInvAdvancedFilters.SODate.isDeleted = true;
          vm.CustomerInvAdvancedFilters.CreditDate.isDeleted = true;
          vm.CustomerInvAdvancedFilters.InvoiceDate.isDeleted = true;
        }
        // set tool tip  if filter applied
        if (canReGenerateTootip) {
          vm.CustomerInvAdvancedFilters.Status.tooltip = getFilterTooltip(vm.statusListToDisplay, vm.statusModel, 'ID', 'Name');
          vm.CustomerInvAdvancedFilters.Customer.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.mfgCodeDetailModel, 'id', 'mfgCodeName');
          vm.CustomerInvAdvancedFilters.CurrentPaymentTerm.tooltip = getFilterTooltip(vm.paymentTermsListToDisplay, vm.paymentTermsDetailModel, 'gencCategoryID', 'gencCategoryName');
          vm.CustomerInvAdvancedFilters.PartId.tooltip = getFilterTooltip(vm.partIds, 'mfgPN');
          let statusText = '';
          if (vm.pagingInfo.paymentStatusFilter && vm.pagingInfo.paymentStatusFilter.length > 0) {
            if (vm.isNotInvoiced) {
              statusText = vm.CustPaymentStatusInInvoice[1].value;
            }
            if (vm.isWaitingForPayment) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CustPaymentStatusInInvoice[2].value);
            }
            if (vm.isPartialPayment) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CustPaymentStatusInInvoice[3].value);
            }
            if (vm.isPaymentRec) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CustPaymentStatusInInvoice[4].value);
            }
          }
          vm.CustomerInvAdvancedFilters.PaymentStatus.tooltip = statusText;
          // const DateFrom = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? 'Customer Invoice Date From: ' : 'Customer Credit Memo Date From: ';
          const selectedDateTypeText = _.find(vm.listDateFilterList, (item) => item.key === vm.selectedDateType).value;
          vm.CustomerInvAdvancedFilters.SearchPaymentNumber.tooltip = vm.chequeNumber ? vm.chequeNumber : '';
          vm.CustomerInvAdvancedFilters.SearchPoNumber.tooltip = vm.pagingInfo.poNumber ? vm.pagingInfo.poNumber : '';
          vm.CustomerInvAdvancedFilters.ZeroAmountInv.tooltip = vm.pagingInfo.isFilterZeroAmount ? (vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Zero Amount Invoice Only' : 'Zero Amount Credit Memo Only') : '';
          vm.CustomerInvAdvancedFilters.Comments.tooltip = vm.pagingInfo.searchComments;

          const fromDateFormatted = vm.pagingInfo.fromDate ? $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat) : null;
          const toDateFormatted = vm.pagingInfo.toDate ? $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat) : null;

          if (vm.selectedDateType === 'I') {
            vm.CustomerInvAdvancedFilters.InvoiceDate.tooltip = vm.pagingInfo.fromDate ? stringFormat('{0} From: {1} ', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
            vm.CustomerInvAdvancedFilters.InvoiceDate.tooltip = vm.pagingInfo.toDate ? stringFormat('{0} {1} {2}', vm.CustomerInvAdvancedFilters.InvoiceDate.tooltip, ' To: ', toDateFormatted) : '';
          } else if (vm.selectedDateType === 'P') {
            vm.CustomerInvAdvancedFilters.PackingSlipDate.tooltip = vm.pagingInfo.fromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
            vm.CustomerInvAdvancedFilters.PackingSlipDate.tooltip = vm.pagingInfo.toDate ? stringFormat('{0} {1} {2}', vm.CustomerInvAdvancedFilters.PackingSlipDate.tooltip, ' To: ', toDateFormatted) : '';
          } else if (vm.selectedDateType === 'PO') {
            vm.CustomerInvAdvancedFilters.PODate.tooltip = vm.pagingInfo.fromDate ? stringFormat('{0} From:{1} ', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
            vm.CustomerInvAdvancedFilters.PODate.tooltip = vm.pagingInfo.toDate ? stringFormat('{0} {1} {2}', vm.CustomerInvAdvancedFilters.PODate.tooltip, ' To: ', toDateFormatted) : '';
          } else if (vm.selectedDateType === 'SO') {
            vm.CustomerInvAdvancedFilters.SODate.tooltip = vm.pagingInfo.fromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
            vm.CustomerInvAdvancedFilters.SODate.tooltip = vm.pagingInfo.toDate ? stringFormat('{0} {1} {2}', vm.CustomerInvAdvancedFilters.SODate.tooltip, ' To: ', toDateFormatted) : '';
          } else if (vm.selectedDateType === 'C') {
            vm.CustomerInvAdvancedFilters.CreditDate.tooltip = vm.pagingInfo.fromDate ? stringFormat('{0} From: {1}', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
            vm.CustomerInvAdvancedFilters.CreditDate.tooltip = vm.pagingInfo.toDate ? stringFormat('{0} {1} {2}', vm.CustomerInvAdvancedFilters.CreditDate.tooltip, ' To: ', toDateFormatted) : '';
          } else if (vm.selectedDateType === 'D') {
            vm.CustomerInvAdvancedFilters.DebitDate.tooltip = vm.pagingInfo.fromDate ? stringFormat('{0} {1} From:', selectedDateTypeText, fromDateFormatted) : selectedDateTypeText;
            vm.CustomerInvAdvancedFilters.DebitDate.tooltip = vm.pagingInfo.toDate ? stringFormat('{0} {1} {2}', vm.CustomerInvAdvancedFilters.DebitDate.tooltip, ' To: ', toDateFormatted) : '';
          }
          let dueDateText;
          if (vm.pagingInfo.dueDate) {
            dueDateText = stringFormat('{0} {1}', 'Due Date: ', vm.pagingInfo.dueDate);
          } else {
            dueDateText = vm.isApplyDueDateFilters ? 'Due Date ' : '';
          }
          dueDateText = vm.pagingInfo.additionalDays ? stringFormat('{0} <br/> Additional Days: {1}', dueDateText, vm.pagingInfo.additionalDays) : dueDateText;
          dueDateText = vm.pagingInfo.termsAndAboveDays ? stringFormat('{0} <br/> Terms and Above Days: {1}', dueDateText, vm.pagingInfo.termsAndAboveDays) : dueDateText;
          vm.CustomerInvAdvancedFilters.DueDateFilter.tooltip = dueDateText;
          // CM Applied Status
          statusText = '';
          if (vm.pagingInfo.creditAppliedStatusFilter && vm.pagingInfo.creditAppliedStatusFilter.length > 0) {
            if (vm.isUnappliedCredit) {
              statusText = vm.ApplyCustCreditMemoStatusTextConst.UnappliedCredit.value;
            }
            if (vm.isPartialCreditApplied) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.ApplyCustCreditMemoStatusTextConst.PartialCreditApplied.value);
            }
            if (vm.isFullCreditApplied) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.ApplyCustCreditMemoStatusTextConst.FullCreditApplied.value);
            }
            if (vm.isNoPendingCredit) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.ApplyCustCreditMemoStatusTextConst.NoPendingCredit.value);
            }
          }
          vm.CustomerInvAdvancedFilters.CreditMemoAppliedStatus.tooltip = statusText;
          // CM Refund Applied Status
          statusText = '';
          if (vm.pagingInfo.creditMemoRefundStatusFilter && vm.pagingInfo.creditMemoRefundStatusFilter.length > 0) {
            if (vm.isRefundNotApplicable) {
              statusText = vm.CustomerCreditMemoRefundStatusTextConst.NotApplicable.value;
            }
            if (vm.isPendingRefund) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CustomerCreditMemoRefundStatusTextConst.PendingRefund.value);
            }
            if (vm.isPartialCMRefunded) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CustomerCreditMemoRefundStatusTextConst.PartialCMRefunded.value);
            }
            if (vm.isFullCMRefunded) {
              statusText = stringFormat('{0}{1}{2}', statusText, statusText.length > 0 ? '<br/>' : ' ', vm.CustomerCreditMemoRefundStatusTextConst.FullCMRefunded.value);
            }
          }
          vm.CustomerInvAdvancedFilters.CreditMemoRefundStatus.tooltip = statusText;
        }
        vm.numberOfMasterFiltersApplied = _.filter(vm.CustomerInvAdvancedFilters, (num) => num.isDeleted === false).length;
      };
      // setFilteredLabels(true);

      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.CustomerInvAdvancedFilters.Status.value:
              vm.statusModel = null;
              break;
            case vm.CustomerInvAdvancedFilters.Customer.value:
              vm.mfgCodeDetailModel = null;
              break;
            case vm.CustomerInvAdvancedFilters.CurrentPaymentTerm.value:
              vm.paymentTermsDetailModel = null;
              break;
            case vm.CustomerInvAdvancedFilters.PaymentStatus.value:
              vm.isNotInvoiced = false;
              vm.isWaitingForPayment = false;
              vm.isPartialPayment = false;
              vm.isPaymentRec = false;
              break;
            case vm.CustomerInvAdvancedFilters.DueDateFilter.value:
              vm.additionalDays = null;
              vm.termsAndAboveDays = null;
              vm.dueDate = false;
              break;
            case vm.CustomerInvAdvancedFilters.SearchPaymentNumber.value:
              vm.chequeNumber = null;
              break;
            case vm.CustomerInvAdvancedFilters.SearchPoNumber.value:
              vm.poNumber = null;
              break;
            case vm.CustomerInvAdvancedFilters.PartId.value:
              vm.partIds = [];
              break;
            case vm.CustomerInvAdvancedFilters.ZeroAmountInv.value:
              vm.isFilterZeroAmount = false;
              break;
            case vm.CustomerInvAdvancedFilters.CreditMemoAppliedStatus.value:
              vm.isUnappliedCredit = false;
              vm.isPartialCreditApplied = false;
              vm.isFullCreditApplied = false;
              vm.isNoPendingCredit = false;
              break;
            case vm.CustomerInvAdvancedFilters.CreditMemoRefundStatus.value:
              vm.isRefundNotApplicable = false;
              vm.isPendingRefund = false;
              vm.isPartialCMRefunded = false;
              vm.isFullCMRefunded = false;
              break;
            case vm.CustomerInvAdvancedFilters.PackingSlipDate.value:
            case vm.CustomerInvAdvancedFilters.PODate.value:
            case vm.CustomerInvAdvancedFilters.SODate.value:
            case vm.CustomerInvAdvancedFilters.InvoiceDate.value:
            case vm.CustomerInvAdvancedFilters.CreditDate.value:
            case vm.CustomerInvAdvancedFilters.DebitDate.value:
              vm.fromDate = null;
              vm.toDate = null;
              vm.selectedDateType = vm.listDateFilterList[0].key;
              vm.resetDateFilter();
              break;
            case vm.CustomerInvAdvancedFilters.Comments.value:
              vm.searchComments = null;
              break;
          }
          vm.SearchData();
        }
      };

      // clear all filters including defulat filters
      vm.clearAllFilter = () => {
        vm.statusModel = null;
        vm.mfgCodeDetailModel = null;
        vm.paymentTermsDetailModel = null;
        vm.isNotInvoiced = false;
        vm.isWaitingForPayment = false;
        vm.isPartialPayment = false;
        vm.isPaymentRec = false;
        vm.additionalDays = null;
        vm.termsAndAboveDays = null;
        vm.dueDate = false;
        vm.chequeNumber = null;
        vm.poNumber = null;
        vm.partIds = [];
        vm.fromDate = null;
        vm.toDate = null;
        vm.isFilterZeroAmount = false;
        vm.isUnappliedCredit = false;
        vm.isPartialCreditApplied = false;
        vm.isFullCreditApplied = false;
        vm.isNoPendingCredit = false;
        vm.isRefundNotApplicable = false;
        vm.isPendingRefund = false;
        vm.isPartialCMRefunded = false;
        vm.isFullCMRefunded = false;
        vm.selectedDateType = vm.listDateFilterList[0].key;
        vm.searchComments = null;

        vm.resetDateFilter();
        vm.clearMfrSearchText();
        vm.clearTermSearchText();
        vm.clearStatusSearchText();
        vm.isAllFilterClear = true;
        vm.isNoDataFound = true;
        vm.emptystate = null;
        filterSelectOption();
        setFilteredLabels(false);
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        //vm.loadData();
      };
      // go to invoice detail list
      vm.goToCustomerInvoiceDetailList = (data) => {
        //BaseService.salesOrderNumber = row.salesOrderNumber;
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          BaseService.goToCustomerInvoiceDetailList(data.invoiceNumber, vm.transType);
        } else {
          BaseService.goToCustomerInvoiceDetailList(data.creditMemoNumber, vm.transType);
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

      // press enter on search input
      vm.applyFiltersOnEnter = (event, err) => {
        if (event.keyCode === 13 && _.isEmpty(err)) {
          vm.SearchData();
        }
      };

      // get total of selected invoice
      vm.getTotalAmountForSelectedRows = () => {
        var selectedTotalAmount = 0;
        if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
          selectedTotalAmount = CalcSumofArrayElement(_.map(vm.selectedRowsList, (data) => data.pendingAmount), _amountFilterDecimal);
        }
        return $filter('amount')(selectedTotalAmount);
      };

      //clear PO filter
      vm.removeSearchPOFilter = () => {
        vm.poNumber = null;
        vm.SearchData();
      };
      // clear comment filter
      vm.removeSearchCommentFilter = () => {
        vm.searchComments = null;
        vm.SearchData();
      };
      //clear Chq# filter
      vm.removeSearchChqFilter = () => {
        vm.chequeNumber = null;
        vm.SearchData();
      };
      //check max length validation
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      vm.goToGenericCategoryManageTerms = (id) => BaseService.goToGenericCategoryManageTerms(id);

      vm.goToManageGenericCategoryShippingType = (id) => BaseService.goToManageGenericCategoryShippingType(id);

      vm.goToManagePersonnel = (id) => BaseService.goToManagePersonnel(id);

      vm.goToFOB = () => BaseService.goToFOB();

      vm.goToManageGenericCategoryCarrier = (id) => BaseService.goToManageGenericCategoryCarrier(id);
    }
  }
})();
