(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierInvoiceGrid', supplierInvoiceGrid);

  /** @ngInject */
  function supplierInvoiceGrid(BaseService, $q, $timeout, $state, $filter, $location, $mdDialog, CORE, USER, TRANSACTION, DialogFactory, SupplierInvoiceFactory, PackingSlipFactory, ManufacturerFactory, GenericCategoryFactory, ReportMasterFactory, ComponentFactory, socketConnectionService) {
    var directive = {
      restrict: 'E',
      replace: false,
      scope: {
        invoiceType: '=?'
      },
      templateUrl: 'app/directives/custom/supplier-invoice-grid/supplier-invoice-grid.html',
      controller: supplierInvoiceGridCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function supplierInvoiceGridCtrl($scope) {
      var vm = this;
      vm.hasUrlSearchData = true;
      vm.selectedDateType = '';
      vm.transaction = TRANSACTION;
      vm.invoiceType = $scope.invoiceType;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SupplierInvoiceAdvanceFilters = angular.copy(CORE.SupplierInvoiceAdvanceFilters);
      vm.CORE_MFG_TYPE = CORE.MFG_TYPE;
      vm.gridName = CORE.gridConfig.gridSupplierInvoiceList;
      vm.SUPPLIER_INVOICE_PAID_FILTERS_TOOLTIP = CORE.SUPPLIER_INVOICE_PAID_FILTERS_TOOLTIP;
      vm.SUPPLIER_INVOICE_PAYMENT_METHOD_FILTERS_TOOLTIP = CORE.SUPPLIER_INVOICE_PAYMENT_METHOD_FILTERS_TOOLTIP;
      vm.SUPPLIER_INVOICE_LIST_DUE_DATE_FILTERS_TOOLTIP = CORE.SUPPLIER_INVOICE_LIST_DUE_DATE_FILTERS_TOOLTIP;
      vm.searchObj = $location.search();
      vm.hasUrlSearchData = (vm.searchObj && vm.searchObj.mfgCodeID) ? true : false;
      vm.HaltResumePopUp = CORE.HaltResumePopUp;
      vm.haltImagePath = vm.HaltResumePopUp.stopImagePath;
      vm.resumeImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, vm.HaltResumePopUp.resumeFileName);
      vm.refPaymentModeForInvoicePayment = CORE.RefPaymentModeForInvoicePayment;

      vm.PackingSlipInvoiceTabName = TRANSACTION.PackingSlipInvoiceTabName;

      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachType = vm.paymentSerachType = vm.CheckSearchTypeList[1].id;
      vm.extendedAmountSearchType = vm.CheckSearchTypeList[1].id;
      vm.paidAmountSearchType = vm.CheckSearchTypeList[1].id;

      vm.statusTypeList = CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown;
      vm.markedForRefundStatusList = CORE.InvoiceMarkedForRefundGridHeaderDropdown;
      vm.ReceiptTypeOptionsGridHeaderDropdown = CORE.InvoiceVerificationReceiptTypeOptionsGridHeaderDropdown;
      vm.InvoiceApprovalStatusOptionsGridHeaderDropdown = CORE.InvoiceApprovalStatusOptionsGridHeaderDropdown;
      vm.InvoiceRequireManagementApprovalGridHeaderDropdown = CORE.InvoiceRequireManagementApprovalGridHeaderDropdown;
      vm.InvoiceMarkedForRefundGridHeaderDropdown = CORE.InvoiceMarkedForRefundGridHeaderDropdown;
      vm.ConfirmedZeroInvoiceGridHeaderDropdown = CORE.ConfirmedZeroInvoiceGridHeaderDropdown;

      vm.isHideDelete = false;
      vm.isUpdatable = true;
      vm.isViewLock = true;
      vm.isApplyDueDateFilters = false;
      vm.isShowApproveInvoice = true;
      vm.isHaltResumeSalesOrder = true;
      vm.isHaltResumeHistory = true;
      vm.isSupplierPaymentHistory = true;
      vm.isSupplierRefundHistory = true;
      vm.isAddSupplierRefund = true;
      vm.isConfirmedZeroValueInvoicesOnly = false;

      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;

      vm.EmptyMesssage = angular.copy(USER.ADMIN_EMPTYSTATE.SUPPLIER_INVOICE);
      vm.EmptyMesssageFilter = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.selectedRowsList = [];
      vm.loginUser = BaseService.loginUser;
      vm.customerpackingsliphistory = true;

      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      const toolipInvoiceTabAndInvestigate = 'Go to Invoice tab and select Investigate Supplier Invoice/Packing Slip Status to enable';
      const toolipInvoiceTab = 'Go to Invoice tab to enable';
      const toolipInvoiceTabOrDebitMemoTab = 'Go to Invoice tab or Debit Memo tab to enable';
      const toolipInvoiceTabOrCreditMemoTab = 'Go to Invoice tab or Credit Memo tab to enable';

      vm.SupplierInvoiceAdvanceFilters.InvPaymentTerms.value = (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo ? vm.LabelConstant.SupplierInvoice.CMPaymentTerms : vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.DebitMemo ? vm.LabelConstant.SupplierInvoice.DMPaymentTerms : vm.LabelConstant.SupplierInvoice.InvPaymentTerms);

      vm.filterLabels = {
        //SupplierInvoiceStatus: 'Supplier Invoice Status',
        TermsAndAboveDaysFromToday: 'Terms and Above Days (From Today)',
        DueDate: 'Due Date',
        AdditionalDays: 'Additional Days'
      };

      switch (vm.invoiceType) {
        case vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices:
          vm.isPrintDebitMemoReport = true;
          vm.isDownload = true;
          vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, 'supplier invoice');
          vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, 'supplier invoice');
          vm.EmptyMesssage.REFRESHMESSAGE = stringFormat(vm.EmptyMesssage.REFRESHMESSAGE, 'packing invoice');
          vm.transTypeText = 'Supplier Invoice';
          vm.featureName = CORE.FEATURE_NAME.AllowToLockSupplierInvoice;
          vm.gridName = CORE.gridConfig.gridSupplierInvoiceList;
          vm.haltStatusTextColumnHeaderText = 'SINV / SCM / SDM Halt Status';
          vm.dateTypeList = vm.transaction.SupplierInvoiceDateFilterList;
          vm.selectedDateType = vm.dateTypeList[3].key;
          break;
        case vm.transaction.PackingSlipInvoiceTabName.CreditMemo:
          vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, 'credit memo');
          vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, 'credit memo');
          vm.EmptyMesssage.REFRESHMESSAGE = stringFormat(vm.EmptyMesssage.REFRESHMESSAGE, 'credit memo');
          vm.transTypeText = 'Supplier Credit Memo';
          vm.featureName = CORE.FEATURE_NAME.AllowToLockSupplierCreditMemo;
          vm.gridName = CORE.gridConfig.gridSupplierCreditMemoList;
          vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.value = 'Supplier Credit Memo Status';
          vm.haltStatusTextColumnHeaderText = 'SCM Halt Status';
          vm.dateTypeList = vm.transaction.SupplierCreditMemoDateFilterList;
          vm.selectedDateType = vm.dateTypeList[3].key;
          break;
        case vm.transaction.PackingSlipInvoiceTabName.DebitMemo:
          vm.isPrintDebitMemoReport = true;
          vm.isDownload = true;
          vm.EmptyMesssage.MESSAGE = stringFormat(vm.EmptyMesssage.MESSAGE, 'debit memo');
          vm.EmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.EmptyMesssage.ADDNEWMESSAGE, 'debit memo');
          vm.EmptyMesssage.REFRESHMESSAGE = stringFormat(vm.EmptyMesssage.REFRESHMESSAGE, 'debit memo');
          vm.transTypeText = 'Supplier Debit Memo';
          vm.featureName = CORE.FEATURE_NAME.AllowToLockSupplierDebitMemo;
          vm.gridName = CORE.gridConfig.gridSupplierDebitMemoList;
          vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.value = 'Supplier Debit Memo Status';
          vm.haltStatusTextColumnHeaderText = 'SDM Halt Status';
          vm.dateTypeList = vm.transaction.SupplierDebitMemoDateFilterList;
          vm.selectedDateType = vm.dateTypeList[3].key;
          break;
      }

      let reTryCount = 0;
      const getAllRights = () => {
        vm.allowSupplierInvoiceApproval = BaseService.checkFeatureRights(CORE.FEATURE_NAME.SupplierInvoiceApproval);
        vm.allowToLockSupplierTransactionFeature = BaseService.checkFeatureRights(vm.featureName);
        if (((vm.allowSupplierInvoiceApproval === null || vm.allowSupplierInvoiceApproval === undefined) ||
          (vm.allowToLockSupplierTransactionFeature === null || vm.allowToLockSupplierTransactionFeature === undefined))
          && reTryCount < _configGetFeaturesRetryCount) {
          reTryCount++;
          getAllRights(); //put for hard reload option as it will not get data from feature rights
        }
      };

      $timeout(() => {
        getAllRights();
      });

      function setDefaultStatusFilters() {
        vm.isCheckPE = true; //vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? true : false;
        vm.isCheckInv = true; // vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? true : false;
        vm.isCheckPartiallyPaid = vm.isCheckATP = true;
        vm.isCheckInvApproval = vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices;
        vm.isCheckPaid = false;
        vm.isNotApplicable = vm.isReadyToLock = true;
        vm.isLocked = false;
      };
      setDefaultStatusFilters();

      //set Filter Labels
      function setFilteredLabels(canReGenerateTootip) {
        vm.SupplierInvoiceAdvanceFilters.Supplier.isDeleted = !(vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0);
        vm.SupplierInvoiceAdvanceFilters.PaymentMethod.isDeleted = !(vm.paymentMethodTypeModel && vm.paymentMethodTypeModel.length > 0);
        vm.SupplierInvoiceAdvanceFilters.PaymentTerms.isDeleted = !(vm.paymentTermsModel && vm.paymentTermsModel.length > 0);
        vm.SupplierInvoiceAdvanceFilters.InvPaymentTerms.isDeleted = !(vm.invoicePaymentTermsModel && vm.invoicePaymentTermsModel.length > 0);
        vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.isDeleted = !(vm.isCheckPE || vm.isCheckInv || vm.isCheckATP || vm.isCheckPartiallyPaid || vm.isCheckPaid || vm.isCheckInvApproval);
        vm.SupplierInvoiceAdvanceFilters.SupplierMarkedForRefundStatus.isDeleted = !(vm.isRefundNA || vm.isRefundWR || vm.isRefundPR || vm.isRefundFR);
        vm.SupplierInvoiceAdvanceFilters.DueDateFilter.isDeleted = !(vm.isApplyDueDateFilters);
        vm.SupplierInvoiceAdvanceFilters.PaidPaymentOrCheckNumber.isDeleted = !(vm.chequeNumber);
        vm.SupplierInvoiceAdvanceFilters.PurchaseSalesPackingSlipInvoiceNumber.isDeleted = !(vm.invoiceNumber);
        vm.SupplierInvoiceAdvanceFilters.MFRPN.isDeleted = !(vm.filterMFRPNText);
        vm.SupplierInvoiceAdvanceFilters.Search_Invoice_Comments.isDeleted = !(vm.invoiceComments);
        vm.SupplierInvoiceAdvanceFilters.LockStatus.isDeleted = !(vm.isNotApplicable || vm.isReadyToLock || vm.isLocked);
        vm.SupplierInvoiceAdvanceFilters.ConfirmedZeroValueInvoicesOnly.isDeleted = !(vm.isConfirmedZeroValueInvoicesOnly);
        vm.SupplierInvoiceAdvanceFilters.ExtendedAmount.isDeleted = !(vm.extendedAmount);
        vm.SupplierInvoiceAdvanceFilters.PaidAmount.isDeleted = !(vm.paidAmount);
        if (vm.invoiceFromDate || vm.invoiceToDate) {
          vm.SupplierInvoiceAdvanceFilters.InvoiceDate.isDeleted = !(vm.selectedDateType === 'I');
          vm.SupplierInvoiceAdvanceFilters.MaterialReceiptDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[1].key);
          vm.SupplierInvoiceAdvanceFilters.PODate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[0].key);
          vm.SupplierInvoiceAdvanceFilters.CreditMemoDate.isDeleted = !(vm.selectedDateType === 'C');
          vm.SupplierInvoiceAdvanceFilters.DebitMemoDate.isDeleted = !(vm.selectedDateType === 'D');
          vm.SupplierInvoiceAdvanceFilters.PackingSlipDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[2].key);
        } else {
          vm.SupplierInvoiceAdvanceFilters.InvoiceDate.isDeleted = true;
          vm.SupplierInvoiceAdvanceFilters.MaterialReceiptDate.isDeleted = true;
          vm.SupplierInvoiceAdvanceFilters.PODate.isDeleted = true;
          vm.SupplierInvoiceAdvanceFilters.CreditMemoDate.isDeleted = true;
          vm.SupplierInvoiceAdvanceFilters.DebitMemoDate.isDeleted = true;
          vm.SupplierInvoiceAdvanceFilters.PackingSlipDate.isDeleted = true;
        }
        //==>>>Set filter tool-tip
        if (canReGenerateTootip) {
          vm.SupplierInvoiceAdvanceFilters.Supplier.tooltip = getFilterTooltip(vm.mfgCodeListToDisplay, vm.mfgCodeDetailModel, 'id', 'mfgCodeName');
          vm.SupplierInvoiceAdvanceFilters.PaymentMethod.tooltip = getFilterTooltip(vm.paymentMethodTypeListToDisplay, vm.paymentMethodTypeModel, 'gencCategoryID', 'gencCategoryName');
          vm.SupplierInvoiceAdvanceFilters.PaymentTerms.tooltip = getFilterTooltip(vm.paymentTermsListToDisplay, vm.paymentTermsModel, 'gencCategoryID', 'gencCategoryName');
          vm.SupplierInvoiceAdvanceFilters.InvPaymentTerms.tooltip = getFilterTooltip(vm.invPaymentTermsListToDisplay, vm.invoicePaymentTermsModel, 'gencCategoryID', 'gencCategoryName');

          vm.SupplierInvoiceAdvanceFilters.Search_Invoice_Comments.tooltip = vm.invoiceComments || null;

          if (vm.chequeNumber) {
            vm.SupplierInvoiceAdvanceFilters.PaidPaymentOrCheckNumber.tooltip = vm.chequeNumber;
          }
          if (vm.paidAmount) {
            vm.SupplierInvoiceAdvanceFilters.PaidAmount.tooltip = vm.paidAmount;
          }
          if (vm.extendedAmount) {
            vm.SupplierInvoiceAdvanceFilters.ExtendedAmount.tooltip = vm.extendedAmount;
          }
          if (vm.invoiceNumber) {
            vm.SupplierInvoiceAdvanceFilters.PurchaseSalesPackingSlipInvoiceNumber.tooltip = vm.invoiceNumber;
          }
          let tooltip = null;
          if (vm.invoiceFromDate && vm.invoiceToDate) {
            tooltip = 'From: ' + $filter('date')(new Date(vm.invoiceFromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.invoiceToDate), vm.DefaultDateFormat);
          }
          else if (vm.invoiceFromDate) {
            tooltip = $filter('date')(new Date(vm.invoiceFromDate), vm.DefaultDateFormat);
          }
          if (vm.selectedDateType === 'I') {
            vm.SupplierInvoiceAdvanceFilters.InvoiceDate.tooltip = tooltip;
          } else if (vm.selectedDateType === vm.dateTypeList[1].key) {
            vm.SupplierInvoiceAdvanceFilters.MaterialReceiptDate.tooltip = tooltip;
          } else if (vm.selectedDateType === vm.dateTypeList[0].key) {
            vm.SupplierInvoiceAdvanceFilters.PODate.tooltip = tooltip;
          } else if (vm.selectedDateType === 'D') {
            vm.SupplierInvoiceAdvanceFilters.DebitMemoDate.tooltip = tooltip;
          } else if (vm.selectedDateType === 'C') {
            vm.SupplierInvoiceAdvanceFilters.CreditMemoDate.tooltip = tooltip;
          } else if (vm.selectedDateType === vm.dateTypeList[2].key) {
            vm.SupplierInvoiceAdvanceFilters.PackingSlipDate.tooltip = tooltip;
          }
          if (vm.filterMFRPNText) {
            vm.SupplierInvoiceAdvanceFilters.MFRPN.tooltip = vm.filterMFRPNText;
          }

          if (vm.isApplyDueDateFilters) {
            if (vm.dueDate) {
              vm.SupplierInvoiceAdvanceFilters.DueDateFilter.tooltip = vm.filterLabels.DueDate + ': ' + $filter('date')(new Date(vm.dueDate), vm.DefaultDateFormat);
              if (vm.additionalDays) {
                vm.SupplierInvoiceAdvanceFilters.DueDateFilter.tooltip += '<br>' + vm.filterLabels.AdditionalDays + ': ' + vm.additionalDays;
              }
            } else if (vm.termsAndAboveDays) {
              vm.SupplierInvoiceAdvanceFilters.DueDateFilter.tooltip = vm.filterLabels.TermsAndAboveDaysFromToday + ': ' + vm.termsAndAboveDays;
            }
            else {
              vm.SupplierInvoiceAdvanceFilters.DueDateFilter.tooltip = '';
            }
          }

          if (vm.isReadyToLock && vm.isNotApplicable && vm.isLocked) {
            vm.pagingInfo.lockStatusFilter = null;
            vm.SupplierInvoiceAdvanceFilters.LockStatus.tooltip = 'All';
          } else if (!vm.isReadyToLock && !vm.isNotApplicable && !vm.isLocked) {
            vm.SupplierInvoiceAdvanceFilters.LockStatus.tooltip = vm.pagingInfo.lockStatusFilter = null;
          } else {
            const searchLockStatus = [];
            const searchLockStatusTooltip = [];
            if (vm.isNotApplicable) {
              searchLockStatus.push(vm.transaction.SupplierInvoiceLockStatus.NA.id);
              searchLockStatusTooltip.push(vm.transaction.SupplierInvoiceLockStatus.NA.value);
            }
            if (vm.isReadyToLock) {
              searchLockStatus.push(vm.transaction.SupplierInvoiceLockStatus.ReadyToLock.id);
              searchLockStatusTooltip.push(vm.transaction.SupplierInvoiceLockStatus.ReadyToLock.value);
            }
            if (vm.isLocked) {
              searchLockStatus.push(vm.transaction.SupplierInvoiceLockStatus.Locked.id);
              searchLockStatusTooltip.push(vm.transaction.SupplierInvoiceLockStatus.Locked.value);
            }
            vm.pagingInfo.lockStatusFilter = `'${searchLockStatus.join('\',\'')}'`;
            vm.SupplierInvoiceAdvanceFilters.LockStatus.tooltip = `${searchLockStatusTooltip.join('<br />')}`;
          }

          vm.pagingInfo.isConfirmedZeroValueInvoicesOnly = vm.isConfirmedZeroValueInvoicesOnly;

          if (vm.isRefundNA && vm.isRefundWR && vm.isRefundPR && vm.isRefundFR) {
            vm.pagingInfo.markedForRefundStatus = null;
            vm.SupplierInvoiceAdvanceFilters.SupplierMarkedForRefundStatus.tooltip = 'All';
          } else if (!vm.isRefundNA && !vm.isRefundWR && !vm.isRefundPR && !vm.isRefundFR) {
            vm.SupplierInvoiceAdvanceFilters.SupplierMarkedForRefundStatus.tooltip = vm.pagingInfo.markedForRefundStatus = null;
          } else {
            vm.pagingInfo.markedForRefundStatus = [];
            const markForRefundStatusTooltip = [];
            if (vm.isRefundNA) {
              vm.pagingInfo.markedForRefundStatus.push(vm.markedForRefundStatusList[1].value);
              markForRefundStatusTooltip.push(vm.markedForRefundStatusList[1].value);
            }
            if (vm.isRefundWR) {
              vm.pagingInfo.markedForRefundStatus.push(vm.markedForRefundStatusList[2].value);
              markForRefundStatusTooltip.push(vm.markedForRefundStatusList[2].value);
            }
            if (vm.isRefundPR) {
              vm.pagingInfo.markedForRefundStatus.push(vm.markedForRefundStatusList[3].value);
              markForRefundStatusTooltip.push(vm.markedForRefundStatusList[3].value);
            }
            if (vm.isRefundFR) {
              vm.pagingInfo.markedForRefundStatus.push(vm.markedForRefundStatusList[4].value);
              markForRefundStatusTooltip.push(vm.markedForRefundStatusList[4].value);
            }
            vm.pagingInfo.markedForRefundStatus = `'${vm.pagingInfo.markedForRefundStatus.join('\',\'')}'`;
            vm.SupplierInvoiceAdvanceFilters.SupplierMarkedForRefundStatus.tooltip = `${markForRefundStatusTooltip.join('<br />')}`;
          }

          if (vm.isCheckPE && vm.isCheckInv && vm.isCheckATP && vm.isCheckPartiallyPaid && vm.isCheckPaid && vm.isCheckInvApproval) {
            vm.pagingInfo.whereStatus = vm.pagingInfo.SearchColumnName = null;
            vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.tooltip = 'All';
          } else if (!vm.isCheckPE && !vm.isCheckInv && !vm.isCheckATP && !vm.isCheckPartiallyPaid && !vm.isCheckPaid && !vm.isCheckInvApproval) {
            vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.tooltip = vm.pagingInfo.whereStatus = vm.pagingInfo.SearchColumnName = null;
          }
          else {
            const searchCol = [];
            const supplierInvoiceStatusTooltip = [];
            if (vm.isCheckPE) {
              searchCol.push(vm.statusTypeList[6].code);
              supplierInvoiceStatusTooltip.push(vm.statusTypeList[6].value);
            }

            const findItemDisapprove = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.ItemDisapprove);

            if (vm.isCheckInv) {
              if (findItemDisapprove) {
                findItemDisapprove.visible = true;
                findItemDisapprove.isMenuItemDisabled = false;
              }
              searchCol.push(vm.statusTypeList[1].code);
              supplierInvoiceStatusTooltip.push(vm.statusTypeList[1].value);
            }
            else {
              if (findItemDisapprove) {
                findItemDisapprove.visible = false;
                findItemDisapprove.isMenuItemDisabled = true;
              }
            }

            if (vm.isCheckInvApproval) {
              searchCol.push(vm.statusTypeList[8].code);
              supplierInvoiceStatusTooltip.push(vm.statusTypeList[8].value);
            }
            if (vm.isCheckATP) {
              searchCol.push(vm.statusTypeList[4].code);
              supplierInvoiceStatusTooltip.push(vm.statusTypeList[4].value);
            }
            if (vm.isCheckPartiallyPaid) {
              searchCol.push(vm.statusTypeList[7].code);
              supplierInvoiceStatusTooltip.push(vm.statusTypeList[7].value);
            }

            if (vm.isCheckPaid) {
              searchCol.push(vm.statusTypeList[5].code);
              supplierInvoiceStatusTooltip.push(vm.statusTypeList[5].value);
            }
            vm.pagingInfo.whereStatus = searchCol;
            vm.pagingInfo.SearchColumnName = TRANSACTION.PackingSlipColumn.Status;
            vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.tooltip = `${supplierInvoiceStatusTooltip.join('<br />')}`;
          }
        }
        //<<<==Set filter tool-tip

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }

        vm.numberOfMasterFiltersApplied = _.filter(vm.SupplierInvoiceAdvanceFilters, (num) => num.isDeleted === false).length;
      }

      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.SupplierInvoiceAdvanceFilters.Supplier.value:
              vm.mfgCodeDetailModel = [];
              break;
            case vm.SupplierInvoiceAdvanceFilters.PaymentMethod.value:
              vm.paymentMethodTypeModel = [];
              break;
            case vm.SupplierInvoiceAdvanceFilters.PaymentTerms.value:
              vm.paymentTermsModel = [];
              break;
            case vm.SupplierInvoiceAdvanceFilters.InvPaymentTerms.value:
              vm.invoicePaymentTermsModel = [];
              break;
            case vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.value:
              vm.isCheckPE = vm.isCheckInv = vm.isCheckATP = vm.isCheckPartiallyPaid = vm.isCheckPaid = vm.isCheckInvApproval = false;
              break;
            case vm.SupplierInvoiceAdvanceFilters.SupplierMarkedForRefundStatus.value:
              vm.isRefundNA = vm.isRefundWR = vm.isRefundPR = vm.isRefundFR = false;
              break;
            case vm.SupplierInvoiceAdvanceFilters.DueDateFilter.value:
              vm.isApplyDueDateFilters = false;
              vm.applyDueDateFiltersChange();
              break;
            case vm.SupplierInvoiceAdvanceFilters.PaidPaymentOrCheckNumber.value:
              vm.chequeNumber = null;
              break;
            case vm.SupplierInvoiceAdvanceFilters.PurchaseSalesPackingSlipInvoiceNumber.value:
              vm.invoiceNumber = null;
              break;
            case vm.SupplierInvoiceAdvanceFilters.InvoiceDate.value:
            case vm.SupplierInvoiceAdvanceFilters.MaterialReceiptDate.value:
            case vm.SupplierInvoiceAdvanceFilters.PODate.value:
            case vm.SupplierInvoiceAdvanceFilters.CreditMemoDate.value:
            case vm.SupplierInvoiceAdvanceFilters.DebitMemoDate.value:
            case vm.SupplierInvoiceAdvanceFilters.PackingSlipDate.value:
              vm.invoiceFromDate = vm.invoiceToDate = null;
              vm.resetDateFilter();
              break;
            case vm.SupplierInvoiceAdvanceFilters.MFRPN.value:
              clearMFRPN();
              break;
            case vm.SupplierInvoiceAdvanceFilters.Search_Invoice_Comments.value:
              vm.invoiceComments = null;
              break;
            case vm.SupplierInvoiceAdvanceFilters.LockStatus.value:
              vm.isNotApplicable = vm.isReadyToLock = vm.isLocked = false;
              break;
            case vm.SupplierInvoiceAdvanceFilters.ConfirmedZeroValueInvoicesOnly.value:
              vm.isConfirmedZeroValueInvoicesOnly = false;
              break;
            case vm.SupplierInvoiceAdvanceFilters.ExtendedAmount.value:
              vm.extendedAmount = null;
              break;
            case vm.SupplierInvoiceAdvanceFilters.PaidAmount.value:
              vm.paidAmount = null;
              break;
          }
          vm.loadData();
        }
      };

      vm.removeChequeFilter = () => {
        vm.chequeNumber = null;
        vm.loadData();
      };

      vm.removeInvoiceFilter = () => {
        vm.invoiceNumber = null;
        vm.loadData();
      };

      vm.removeCommentFilter = () => {
        vm.invoiceComments = null;
        vm.loadData();
      };

      vm.removeExtendedAmountFilter = () => {
        vm.extendedAmount = null;
        vm.loadData();
      };

      vm.removePaidAmountFilter = () => {
        vm.paidAmount = null;
        vm.loadData();
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

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['paymentDueDate', 'ASC'], ['supplierCode', 'ASC']],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[7].PageName
        };
      };
      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        allowToExportAllData: true,
        exporterCsvFilename: vm.transTypeText + '.csv',
        rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-halted-row-grid-background-color\': (row.entity.haltStatus === grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus) }" role="gridcell" ui-grid-cell="">',
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return SupplierInvoiceFactory.getSupplierInvoiceList().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (response && response.data.supplierInvoice) {
                setDataAfterGetAPICall(response, false);
                return response.data.supplierInvoice;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.editSupplier = (mfgcodeID) => {
        BaseService.goToSupplierDetail(mfgcodeID);
      };

      vm.goToGenericCategoryManageTerms = (id) => {
        BaseService.goToGenericCategoryManageTerms(id);
      };

      vm.goToPackingSlip = (row) => {
        if (row && row.receiptType === CORE.packingSlipReceiptType.I.Key) {
          if (row.isTariffInvoice) {
            BaseService.goToSupplierInvoiceDetail(null, row.id);
          } else {
            BaseService.goToManagePackingSlipDetail(row.packingSlipId);
          }
        } else if (row && row.receiptType === CORE.packingSlipReceiptType.C.Key) {
          BaseService.goToCreditMemoDetail(null, row.packingSlipId);
        } else if (row && row.receiptType === CORE.packingSlipReceiptType.D.Key) {
          BaseService.goToDebitMemoDetail(null, row.packingSlipId);
        }
      };

      vm.goToInvoiceDetail = (id, type) => {
        BaseService.goToSupplierInvoiceDetail(type, id);
      };

      vm.goToDocumentDetail = (receiptType, id, type) => {
        if (receiptType === vm.transaction.PackingSlipReceiptType.SupplierInvoice) {
          BaseService.goToSupplierInvoiceDetail(type, id);
        } else if (receiptType === vm.transaction.PackingSlipReceiptType.CreditMemo) {
          BaseService.goToCreditMemoDetail(type, id);
        } else if (receiptType === vm.transaction.PackingSlipReceiptType.DebitMemo) {
          BaseService.goToDebitMemoDetail(type, id);
        }
      };

      vm.goToCreditMemoDetail = (id) => {
        BaseService.goToCreditMemoDetail(null, id);
      };

      vm.goToDebitMemoDetail = (id) => {
        BaseService.goToDebitMemoDetail(null, id);
      };

      vm.goToSupplierBillTo = (mfgcodeID) => {
        BaseService.goToSupplierBillTo(mfgcodeID);
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          //width: vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo ? 120 : 180,
          width: 160,
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: '#',
          width: '50',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'systemId',
          displayName: vm.LabelConstant.COMMON.SystemID,
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'receiptMemoType',
          displayName: 'Type',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.receiptType == \'I\' ,\
                            \'label-primary\':row.entity.receiptType == \'C\' ,\
                            \'label-warning\':row.entity.receiptType == \'D\' }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.ReceiptTypeOptionsGridHeaderDropdown
          },
          width: 150,
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? true : false,
          enableSorting: true
        },
        {
          field: 'subTypeValue',
          displayName: 'Sub Type',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                 ng-class="{\'label-warning\':row.entity.creditMemoType == \'IC\' ,\
                            \'bg-purple\':row.entity.creditMemoType == \'MC\' ,\
                            \'bg-pink\':row.entity.creditMemoType == \'RC\' ,\
                            \'bg-brown\':row.entity.creditMemoType == \'ID\' ,\
                            \'bg-teal\':row.entity.creditMemoType == \'MD\' ,\
                            \'label-success\':(row.entity.receiptType == \'I\' && row.entity.isTariffInvoice == \'0\') ,\
                            \'label-primary\':(row.entity.receiptType == \'I\' && row.entity.isTariffInvoice == \'1\') \
                           }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 200,
          enableSorting: true,
          enableFiltering: true
        },
        {
          field: 'invoiceVerificationStatus',
          displayName: vm.SupplierInvoiceAdvanceFilters.SupplierInvoiceStatus.value,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.status == \'A\' ,\
                                                \'label-danger\':row.entity.status == \'I\' ,\
                                                \'bg-purple\':row.entity.status == \'PP\' ,\
                                                \'label-primary\':row.entity.status == \'P\' ,\
                                                \'bg-brown\':row.entity.status == \'PM\' ,\
                                                \'label-warning\':row.entity.status == \'PE\' }"> \
                                                    {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 230,
          enableSorting: true,
          enableFiltering: false
        },
        {
          field: 'lockStatusValue',
          displayName: 'Lock Status',
          width: 145,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getSupplierTransactionLockStatusClassName(row.entity.lockStatus)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          enableSorting: true,
          enableFiltering: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: TRANSACTION.SupplierInvoiceLockStatusGridHeaderDropdown
          }
        },
        {
          field: 'supplierCode',
          width: 200,
          displayName: 'Supplier',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.editSupplier(row.entity.mfgCodeID);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Supplier" text="row.entity.supplierCode" ng-if="row.entity.supplierCode"></copy-text>\
              </div>'
        },
        {
          field: TRANSACTION.PackingSlipColumn.InvoiceNoField,
          width: 190,
          displayName: 'Invoice#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.receiptType == \'I\'">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToInvoiceDetail(row.entity.id);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.InvoiceNumber" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                  <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.invoiceLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                  <span class= "ml-5" ng-if="row.entity.haltStatus == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus"> \
                    <img class="wo-stop-image wo-stop-image-margin" src="assets/images/logos/stopped.png" />\
                    <md-tooltip md-direction="top" class="tooltip-multiline">{{row.entity.haltReason}}</md-tooltip>\
                  </span>\
              </div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTab
        },
        {
          field: 'paymentDueDate',
          displayName: 'Payment Due Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span ng-class="{\'red\':row.entity.isPaymentDueDatePassed === 1 }"> \
                                                    {{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}'
            + '</span>'
            + '</div>',
          type: 'date',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTab,
          visible: true,
          isMenuItemDisabled: false,
          enableFiltering: false
        },
        {
          field: 'paymentDate',
          displayName: 'Paid Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span> \
                  {{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}'
            + '</span>'
            + '</div>',
          type: 'date',
          enableFiltering: false
        },
        {
          field: 'paymentTermName',
          width: '100',
          displayName: vm.LabelConstant.SupplierInvoice.PaymentTerms,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToGenericCategoryManageTerms(row.entity.paymentTermsID);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.PaymentTerms" text="row.entity.paymentTermName" ng-if="row.entity.paymentTermName"></copy-text>\
              </div>',
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'invPaymentTermName',
          width: vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices ? 120 : 100,
          displayName: vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices ? vm.LabelConstant.SupplierInvoice.InvPaymentTerms : vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo ? vm.LabelConstant.SupplierInvoice.CMPaymentTerms : vm.LabelConstant.SupplierInvoice.DMPaymentTerms,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToGenericCategoryManageTerms(row.entity.invPaymentTermsID);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.InvPaymentTerms" text="row.entity.invPaymentTermName" ng-if="row.entity.invPaymentTermName"></copy-text>\
              </div>',
          visible: true,
          isMenuItemDisabled: false
        },
        {
          field: 'poNumber',
          width: '140',
          displayName: 'PO# / RMA#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                         <span ng-if="!row.entity.poId">{{COL_FIELD}}</span>\
                         <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetail(row.entity);" tabindex="-1" ng-if="row.entity.poId">{{COL_FIELD}}</a>\
                         <copy-text label="\'PO# / RMA#\'" text="row.entity.poNumber"></copy-text>\
                         </div>'
        },
        {
          field: 'poDate',
          displayName: 'PO / RMA Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          enableFiltering: false
        },
        {
          field: 'packingSlipNumber',
          width: '140',
          displayName: 'Packing Slip#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.PackingSlipNumber" text="row.entity.packingSlipNumber" ng-if="row.entity.packingSlipNumber"></copy-text>\
                  <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.packingSlipLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
              </div>'
        },
        {
          field: 'packingSlipDate',
          displayName: 'Packing Slip Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          enableFiltering: false
        },
        {
          field: TRANSACTION.PackingSlipColumn.InvoiceDate,
          displayName: 'Invoice Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left grid-cell-text-bold" ng-if="row.entity.receiptType == \'I\'">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTab,
          enableFiltering: false
        },
        {
          field: TRANSACTION.PackingSlipColumn.CreditNoField,
          width: 190,
          displayName: 'Credit Memo#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.receiptType == \'C\'">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToCreditMemoDetail(row.entity.id);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.CreditMemoNumber" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                  <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.creditMemoLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                  <span class= "ml-5" ng-if="row.entity.haltStatus == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus"> \
                    <img class="wo-stop-image wo-stop-image-margin" src="assets/images/logos/stopped.png" />\
                    <md-tooltip md-direction="top" class="tooltip-multiline">{{row.entity.haltReason}}</md-tooltip>\
                  </span>\
              </div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: TRANSACTION.PackingSlipColumn.CreditDate,
          displayName: 'Credit Memo Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left grid-cell-text-bold" ng-if="row.entity.receiptType == \'C\'">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab,
          enableFiltering: false
        },
        {
          field: TRANSACTION.PackingSlipColumn.DebitNoField,
          width: 190,
          displayName: 'Debit Memo#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.receiptType == \'D\'">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToDebitMemoDetail(row.entity.id);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.DebitMemoNumber" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                  <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.debitMemoLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                  <span class= "ml-5" ng-if="row.entity.haltStatus == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus"> \
                    <img class="wo-stop-image wo-stop-image-margin" src="assets/images/logos/stopped.png" />\
                    <md-tooltip md-direction="top" class="tooltip-multiline">{{row.entity.haltReason}}</md-tooltip>\
                  </span>\
              </div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrDebitMemoTab
        },
        {
          field: TRANSACTION.PackingSlipColumn.DebitDate,
          displayName: 'Debit Memo Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left grid-cell-text-bold" ng-if="row.entity.receiptType == \'D\'">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrDebitMemoTab,
          enableFiltering: false
        },
        {
          field: 'refSupplierCreditMemoNumber',
          width: 190,
          displayName: 'Ref. Supplier Credit Memo#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrDebitMemoTab
        },
        {
          field: 'refInvoiceNumber',
          width: 190,
          displayName: 'Ref. Invoice#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                  <a class="cm-text-decoration underline"\
                      ng-click="grid.appScope.$parent.vm.goToInvoiceDetail(row.entity.refParentCreditDebitInvoiceno);"\
                      tabindex="-1">{{COL_FIELD}}</a>\
                  <copy-text label="grid.appScope.$parent.vm.LabelConstant.PACKING_SLIP.RefInvoiceNumber" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                  <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.refInvoiceLockStatus === grid.appScope.$parent.vm.transaction.CustomerPaymentLockStatus.Locked" style="margin-left:5px !important;"> </md-icon>\
                  <span class= "ml-5" ng-if="row.entity.haltStatusRefInv == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus"> \
                    <img class="wo-stop-image wo-stop-image-margin" src="assets/images/logos/stopped.png" />\
                    <md-tooltip md-direction="top" class="tooltip-multiline">{{row.entity.haltReasonRefInv}}</md-tooltip>\
                  </span>\
              </div>'
        },
        {
          field: 'packingSlipDocCount',
          width: '120',
          displayName: 'Packing Slip Documents',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': !COL_FIELD, \'cm-text-decoration\': COL_FIELD}" ng-click="grid.appScope.$parent.vm.goToInvoiceDetail(row.entity.id, grid.appScope.$parent.vm.transaction.SupplierInvoiceType.PackingSlipDocument);" tabindex="-1">{{COL_FIELD | numberWithoutDecimal }}</a> \
                        </div>'
        },
        {
          field: 'invoiceDocCount',
          width: '120',
          displayName: 'Documents',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': !COL_FIELD, \'cm-text-decoration\': COL_FIELD}" ng-click="grid.appScope.$parent.vm.goToDocumentDetail(row.entity.receiptType, row.entity.id, grid.appScope.$parent.vm.transaction.SupplierInvoiceType.Document);" tabindex="-1">{{COL_FIELD | numberWithoutDecimal }}</a> \
                        </div>'
        },
        {
          field: 'supplierSONumber',
          width: '120',
          displayName: CORE.LabelConstant.SalesOrder.SO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'soDate',
          displayName: 'So Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          enableFiltering: false
        },
        {
          field: 'receiptDate',
          displayName: vm.LabelConstant.SupplierInvoice.MaterialReceiptDate,
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          type: 'date',
          enableFiltering: false
        },
        {
          field: 'itemReceived',
          width: 100,
          displayName: 'Items Received',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
        },
        {
          field: 'otherChargesItemReceived',
          width: 120,
          displayName: 'Other Charges Items Received',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>'
        },
        {
          field: TRANSACTION.PackingSlipColumn.ItemDisapprove,
          width: 100,
          displayName: 'Items Disapproved',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal }}</div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabAndInvestigate
        },
        {
          field: 'totalExtendedAmount',
          displayName: vm.LabelConstant.SupplierInvoice.ExtendedAmount,
          width: '130',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': row.entity.refParentCreditDebitInvoiceno}">{{COL_FIELD | amount }}</div>',
          enableFiltering: false
        },
        {
          field: 'totalDiscount',
          displayName: vm.LabelConstant.SupplierInvoice.Discount,
          width: '130',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right grid-cell-text-danger" ng-if="row.entity.totalDiscount">{{COL_FIELD | amount }}</div>'
        },
        {
          field: TRANSACTION.PackingSlipColumn.TotalCreditAmount,
          displayName: 'Total Credit Memo Amount',
          width: '130',
          //cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.totalCreditAmount" ng-class="{\'grid-cell-text-danger\': row.entity.totalCreditAmount}">{{COL_FIELD | amount }}</div>',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.totalCreditAmount">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': row.entity.totalCreditAmount}" \
                              ng-click="grid.appScope.$parent.vm.showCreatedCreditDebitMemo(row.entity, $event,\'C\');" tabindex="-1"> \
                                  {{COL_FIELD | amount}} \
                          </a> \
                          <copy-text label="\'Total Credit Memo Amount\'" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                        </div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTab
        },
        {
          field: TRANSACTION.PackingSlipColumn.TotalDebitAmount,
          displayName: 'Total Debit Memo Amount',
          width: '140',
          //cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.totalDebitAmount" ng-class="{\'grid-cell-text-danger\': row.entity.totalDebitAmount}">{{COL_FIELD | amount }}</div>',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.totalDebitAmount">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': row.entity.totalDebitAmount}" \
                              ng-click="grid.appScope.$parent.vm.showCreatedCreditDebitMemo(row.entity, $event,\'D\');" tabindex="-1"> \
                                  {{COL_FIELD | amount}} \
                          </a> \
                          <copy-text label="\'Total Debit Memo Amount\'" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                        </div>',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTab
        },
        {
          field: 'paidAmount',
          displayName: vm.LabelConstant.SupplierInvoice.PaidAmount,
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.paidAmount">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': row.entity.paidAmount < 0, \'cm-text-decoration\': row.entity.paidAmount>0}" \
                              ng-click="grid.appScope.$parent.vm.showPaymentTransactions(row.entity, grid.appScope.$parent.vm.refPaymentModeForInvoicePayment.Payable, $event);" tabindex="-1"> \
                                  {{COL_FIELD | amount}} \
                          </a> \
                          <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.PaidAmount" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                        </div>',
          isConditionallyVisibleColumn: true,
          enableFiltering: false
        },
        {
          field: 'refundAmount',
          displayName: 'Refund Amount',
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.refundAmount">\
                          <a class="cursor-pointer underline" ng-class="{\'grid-cell-text-danger\': row.entity.refundAmount < 0, \'cm-text-decoration\': row.entity.refundAmount>0}" \
                              ng-click="grid.appScope.$parent.vm.showPaymentTransactions(row.entity, grid.appScope.$parent.vm.refPaymentModeForInvoicePayment.SupplierRefund, $event);" tabindex="-1"> \
                                  {{COL_FIELD | amount}} \
                          </a> \
                          <copy-text label="\'Refund Amount\'" text="COL_FIELD" ng-if="COL_FIELD"></copy-text>\
                        </div>',
          isConditionallyVisibleColumn: true
        },
        {
          field: 'balanceToPayAmount',
          displayName: 'Balance To Pay',
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': row.entity.balanceToPayAmount < 0 }">{{COL_FIELD | amount }}</div>',
          enableFiltering: false,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTab
        },
        {
          field: 'invoiceVariance',
          displayName: 'Variance',
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right grid-cell-text-danger" ng-if="row.entity.invoiceVariance">{{COL_FIELD | amount }}</div>'

        },
        {
          field: 'markedForRefundValue',
          displayName: 'Marked for Refund Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-primary\':row.entity.markedForRefundValue == \'N/A\' ,\
                            \'label-warning\':row.entity.markedForRefundValue == \'Waiting for Refund\' , \
                            \'bg-brown\':row.entity.markedForRefundValue == \'Partially Refunded\' , \
                            \'label-success\':row.entity.markedForRefundValue == \'Fully Refunded\'}"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.InvoiceMarkedForRefundGridHeaderDropdown
          },
          width: 155,
          ColumnDataType: 'StringEquals',
          enableSorting: true
        },
        {
          field: 'markedForRefundAmt',
          displayName: 'Marked for Refund Amount ($)',
          width: 130,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.markedForRefundAmt">{{COL_FIELD | amount }}</div>',
          enableFiltering: true
        },
        {
          field: TRANSACTION.PackingSlipColumn.PackingDetailNote,
          displayName: 'Line Comments',
          cellTemplate: '<md-button class="md-warn margin-0 height-20" ng-class="{\'md-hue-1\': !row.entity.packingDetailNote }" ng-disabled="!row.entity.packingDetailNote" ng-click="grid.appScope.$parent.vm.showApproveNote(row.entity, $event)"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: 100,
          enableCellEdit: false,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'internalRemark',
          displayName: 'Internal Notes',
          cellTemplate: '<md-button class="md-warn margin-0 height-20" ng-class="{\'md-hue-1\': !row.entity.internalRemark }" ng-disabled="!row.entity.internalRemark" ng-click="grid.appScope.$parent.vm.showComment(row.entity, $event, row.entity.internalRemark, \'Internal Notes\')"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: 105,
          enableCellEdit: false,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'remark',
          displayName: 'Comments',
          cellTemplate: '<md-button class="md-warn margin-0 height-20" ng-class="{\'md-hue-1\': !row.entity.remark }" ng-disabled="!row.entity.remark" ng-click="grid.appScope.$parent.vm.showComment(row.entity, $event, row.entity.remark, \'Comments\')"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: 105,
          enableCellEdit: false,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'isZeroValueText',
          displayName: 'Confirmed Zero Value Invoices Only',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.isZeroValue == 1 ,\
                              \'label-warning\':row.entity.isZeroValue == 0 }"> \
                                  {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.ConfirmedZeroInvoiceGridHeaderDropdown
          },
          width: 150,
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? true : false,
          enableSorting: true,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'invoiceRequireManagementApprovalValue',
          displayName: 'Require Management Approval',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.invoiceRequireManagementApproval == 1 ,\
                            \'label-warning\':row.entity.invoiceRequireManagementApproval == 0 }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.InvoiceRequireManagementApprovalGridHeaderDropdown
          },
          width: 170,
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? true : false,
          enableSorting: true,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'invoiceApprovalStatusValue',
          displayName: 'Approval Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-success\':row.entity.invoiceApprovalStatus == 1 ,\
                            \'label-warning\':row.entity.invoiceApprovalStatus == 2 ,\
                            \'label-primary\':row.entity.invoiceApprovalStatus == 3 }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.InvoiceApprovalStatusOptionsGridHeaderDropdown
          },
          width: 170,
          ColumnDataType: 'StringEquals',
          enableFiltering: vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? true : false,
          enableSorting: true,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'invoiceApprovedByName',
          displayName: 'Approved By',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'invoiceApprovalDate',
          displayName: 'Approved Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          type: 'datetime',
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab,
          enableFiltering: false
        },
        {
          field: 'invoiceApprovalComment',
          displayName: 'Approval Comments',
          cellTemplate: '<md-button class="md-warn margin-0 height-20" ng-class="{\'md-hue-1\': !row.entity.invoiceApprovalComment }" ng-disabled="!row.entity.invoiceApprovalComment" ng-click="grid.appScope.$parent.vm.showComment(row.entity, $event, row.entity.invoiceApprovalComment, \'Approval Comment\')"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: 100,
          enableCellEdit: false,
          isConditionallyVisibleColumn: true,
          menuDisabledHint: toolipInvoiceTabOrCreditMemoTab
        },
        {
          field: 'lockedAt',
          displayName: 'Locked Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_LOCKED_AT
        },
        {
          field: 'lockByName',
          displayName: 'Locked By',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true
        },
        {
          field: 'lockedByRoleName',
          displayName: 'Locked By Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_LOCKED_BYROLE
        },
        {
          field: 'haltStatusText',
          displayName: vm.haltStatusTextColumnHeaderText,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box label-danger" ng-if="row.entity.haltStatus === grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 150,
          visible: false,
          enableFiltering: true
        },
        {
          field: 'haltReasonRefInvText',
          displayName: 'Ref. Invoice# Halt Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box label-danger" ng-if="row.entity.haltStatusRefInv === grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 150,
          visible: false,
          enableFiltering: true
        },
        {
          field: 'updatedAt',
          displayName: 'Modified Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
          field: 'updatedByName',
          displayName: 'Modified By',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
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
          displayName: 'Created Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
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
        }
      ];

      vm.showComment = (row, ev, commentText, popupTitle) => {
        const headerData = [{
          label: vm.LabelConstant.MFG.Supplier,
          value: row.supplierCode,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSupplierList();
          },
          valueLinkFn: () => {
            BaseService.goToSupplierDetail(row.mfgCodeID);
          }
        },
        {
          label: 'Invoice#',
          value: row.invoiceNumber,
          displayOrder: 2,
          labelLinkFn: () => {
            BaseService.goToSupplierInvoiceList();
          },
          valueLinkFn: () => {
            BaseService.goToSupplierInvoiceDetail(null, row.id);
          }
        },
        {
          label: 'Debit Memo#',
          value: row.debitMemoNumber,
          displayOrder: 3,
          labelLinkFn: () => {
            BaseService.goToDebitMemoList();
          },
          valueLinkFn: () => {
            BaseService.goToDebitMemoDetail(null, row.id);
          }
        },
        {
          label: 'Credit Memo#',
          value: row.creditMemoNumber,
          displayOrder: 4,
          labelLinkFn: () => {
            BaseService.goToCreditMemoList();
          },
          valueLinkFn: () => {
            BaseService.goToCreditMemoDetail(null, row.id);
          }
        }];
        const PopupData = {
          title: popupTitle,
          description: commentText, // isApprovalComment ? row.invoiceApprovalComment : row.internalRemark,
          headerData: headerData
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          PopupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      const findIndexCreadit = _.findIndex(vm.gridOptions.columnDefs, (data) => data.field === TRANSACTION.PackingSlipColumn.ReceiptType);
      if (findIndexCreadit !== -1) {
        vm.gridOptions.columnDefs.splice(findIndexCreadit, 1);
      }

      function formatListData(pSourceData) {
        if (pSourceData) {
          _.map(pSourceData, (data) => {
            data.invoiceDate = BaseService.getUIFormatedDate(data.invoiceDate, vm.DefaultDateFormat);
            data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
            data.paymentDueDate = BaseService.getUIFormatedDate(data.paymentDueDate, vm.DefaultDateFormat);
            data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
            data.receiptDate = BaseService.getUIFormatedDate(data.receiptDate, vm.DefaultDateFormat);
            data.creditMemoDate = BaseService.getUIFormatedDate(data.creditMemoDate, vm.DefaultDateFormat);
            data.debitMemoDate = BaseService.getUIFormatedDate(data.debitMemoDate, vm.DefaultDateFormat);
            if (data.status === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[5].code ||
              data.status === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[7].code ||
              data.parentInvoiceStatus === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[5].code ||
              data.parentInvoiceStatus === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[7].code ||
              data.totalPaidAmountToDisableDelete !== 0) {
              data.isDisabledDelete = true;
            }
            if (!vm.allowToLockSupplierTransactionFeature) {
              data.isDisableLockTransaction = true;
            }
            if (data.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked) {
              data.isDisableLockTransaction = true;
              if (!vm.loginUser.isUserSuperAdmin) {
                data.isDisabledDelete = true;
              }
            }
            if (data.haltStatus === vm.HaltResumePopUp.HaltStatus) {
              data.isDisabledDelete = true;
              data.salesOrderHaltImage = vm.resumeImagePath;
              data.salesOrderHalt = data.receiptType === CORE.packingSlipReceiptType.I.Key ? vm.HaltResumePopUp.ResumeInvoice : (data.receiptType === CORE.packingSlipReceiptType.C.Key ? vm.HaltResumePopUp.ResumeCreditMemo : (data.receiptType === CORE.packingSlipReceiptType.D.Key ? vm.HaltResumePopUp.ResumeDebitMemo : ''));
            } else {
              data.salesOrderHaltImage = vm.haltImagePath;
              data.salesOrderHalt = data.receiptType === CORE.packingSlipReceiptType.I.Key ? vm.HaltResumePopUp.HaltInvoice : (data.receiptType === CORE.packingSlipReceiptType.C.Key ? vm.HaltResumePopUp.HaltCreditMemo : (data.receiptType === CORE.packingSlipReceiptType.D.Key ? vm.HaltResumePopUp.HaltDebitMemo : ''));
            }
            if (data.markedForRefund === 1) {
              data.isDisabledDelete = true;
            }

            if (data.receiptType === CORE.packingSlipReceiptType.D.Key) {
              data.isDisabledPrintDebitMemoReport = false;
              data.isDownloadDisabled = false;
              data.historyactionButtonName = 'Debit Memo Change History';
              data.lockButtonNameText = 'Supplier Debit Memo';
            } else {
              data.isDisabledPrintCreditMemoAndInvoice = true;
              data.isDownloadDisabled = true;
              if (data.receiptType === CORE.packingSlipReceiptType.C.Key) {
                data.historyactionButtonName = 'Credit Memo Change History';
                data.lockButtonNameText = 'Supplier Credit Memo';
              } else if (data.receiptType === CORE.packingSlipReceiptType.I.Key) {
                data.historyactionButtonName = 'Supplier Invoice Change History';
                data.lockButtonNameText = 'Supplier Invoice';
              }
            }
          });
        }
      }

      function setDataAfterGetAPICall(response, isGetDataDown) {
        if (response && response.data && response.data.supplierInvoice) {
          if (!isGetDataDown) {
            vm.sourceData = response.data.supplierInvoice;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.supplierInvoice.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.supplierInvoice);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          formatListData(vm.sourceData);
          // must set after new data comes
          vm.totalSourceDataCount = response.data.Count;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || vm.pagingInfo.mfgCodeIds || vm.pagingInfo.paymentMethodTypeIds || vm.pagingInfo.paymentTermsIds || vm.pagingInfo.invPaymentTermsIds ||
              vm.isCheckPE || vm.isCheckInv || vm.isCheckATP || vm.isCheckPartiallyPaid || vm.isCheckPaid || vm.isCheckInvApproval || vm.paidAmount || vm.extendedAmount || vm.isConfirmedZeroValueInvoicesOnly ||
              vm.isNotApplicable || vm.isReadyToLock || vm.isLocked || vm.invoiceComments || vm.filterMFRPNText || vm.invoiceToDate || vm.invoiceFromDate ||
              (vm.invoiceType !== TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices && (vm.isRefundNA || vm.isRefundWR || vm.isRefundPR || vm.isRefundFR)) ||
              (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices && (vm.chequeNumber || vm.invoiceNumber || vm.isApplyDueDateFilters))
            ) {
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
      }

      vm.loadData = () => {
        if (vm.callLoadData === false) {
          vm.callLoadData = true;
          return;
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);

        vm.pagingInfo.paymentNumber = BaseService.convertSpecialCharToSearchString(vm.chequeNumber);
        vm.pagingInfo.exactPaymentNumberSearch = vm.checkSerachType === vm.CheckSearchTypeList[0].id;

        vm.pagingInfo.invoiceComments = BaseService.convertSpecialCharToSearchString(vm.invoiceComments);

        vm.pagingInfo.paidAmount = vm.paidAmount;
        vm.pagingInfo.exactPaidAmountSearch = vm.paidAmountSearchType === vm.CheckSearchTypeList[0].id;

        vm.pagingInfo.extendedAmount = vm.extendedAmount || vm.extendedAmount === 0 ? vm.extendedAmount : null;
        vm.pagingInfo.exactExtendedAmountSearch = vm.extendedAmountSearchType === vm.CheckSearchTypeList[0].id;

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

        if (vm.invoiceFromDate) {
          vm.pagingInfo.invoiceFromDate = (BaseService.getAPIFormatedDate(vm.invoiceFromDate));
        }
        else {
          vm.pagingInfo.invoiceFromDate = null;
        }

        if (vm.invoiceToDate) {
          vm.pagingInfo.invoiceToDate = (BaseService.getAPIFormatedDate(vm.invoiceToDate));
        }
        else {
          vm.pagingInfo.invoiceToDate = null;
        }
        vm.pagingInfo.selectedDateType = vm.selectedDateType;
        vm.pagingInfo.invoiceNumber = BaseService.convertSpecialCharToSearchString(vm.invoiceNumber);
        vm.pagingInfo.isExactSearch = vm.paymentSerachType === vm.CheckSearchTypeList[0].id;

        if (vm.mfgCodeDetailModel && vm.mfgCodeDetailModel.length > 0) {
          vm.pagingInfo.mfgCodeIds = vm.mfgCodeDetailModel.join(',');
        }
        else {
          vm.pagingInfo.mfgCodeIds = null;
        }
        if (vm.paymentMethodTypeModel && vm.paymentMethodTypeModel.length > 0) {
          vm.pagingInfo.paymentMethodTypeIds = vm.paymentMethodTypeModel.join(',');
        }
        else {
          vm.pagingInfo.paymentMethodTypeIds = null;
        }

        if (vm.paymentTermsModel && vm.paymentTermsModel.length > 0) {
          vm.pagingInfo.paymentTermsIds = vm.paymentTermsModel.join(',');
        }
        else {
          vm.pagingInfo.paymentTermsIds = null;
        }

        if (vm.invoicePaymentTermsModel && vm.invoicePaymentTermsModel.length > 0) {
          vm.pagingInfo.invPaymentTermsIds = vm.invoicePaymentTermsModel.join(',');
        }
        else {
          vm.pagingInfo.invPaymentTermsIds = null;
        }

        const findItemDisapprove = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.ItemDisapprove);

        const findInvoiceNoField = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.InvoiceNoField);
        const findInvoiceDate = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.InvoiceDate);
        const findDebitMemoNo = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.DebitNoField);
        const findRefSupplierCreditMemoNo = _.find(vm.sourceHeader, (data) => data.field === 'refSupplierCreditMemoNumber');
        const findDebitMemoDate = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.DebitDate);
        const findTotalCreditAmount = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.TotalCreditAmount);
        const findTotalDebitAmount = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.TotalDebitAmount);
        const findAmountToPay = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.AmountToPay);

        const findPaymentDueDate = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.PaymentDueDate);
        // const findPaymentTermName = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.PaymentTermName);


        if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo) {
          if (findInvoiceNoField) {
            findInvoiceNoField.visible = false;
            findInvoiceNoField.isMenuItemDisabled = true;
          }
          if (findInvoiceDate) {
            findInvoiceDate.visible = false;
            findInvoiceDate.isMenuItemDisabled = true;
          }
          if (findDebitMemoNo) {
            findDebitMemoNo.visible = false;
            findDebitMemoNo.isMenuItemDisabled = true;
          }
          if (findDebitMemoDate) {
            findDebitMemoDate.visible = false;
            findDebitMemoDate.isMenuItemDisabled = true;
          }
          if (findRefSupplierCreditMemoNo) {
            findRefSupplierCreditMemoNo.visible = false;
            findRefSupplierCreditMemoNo.isMenuItemDisabled = true;
          }
          if (findItemDisapprove) {
            findItemDisapprove.visible = false;
            findItemDisapprove.isMenuItemDisabled = true;
          }
          if (findTotalCreditAmount) {
            findTotalCreditAmount.visible = false;
            findTotalCreditAmount.isMenuItemDisabled = true;
          }
          if (findTotalDebitAmount) {
            findTotalDebitAmount.visible = false;
            findTotalDebitAmount.isMenuItemDisabled = true;
          }
          if (findAmountToPay) {
            findAmountToPay.visible = false;
            findAmountToPay.isMenuItemDisabled = true;
          }
          if (findPaymentDueDate) {
            findPaymentDueDate.visible = false;
            findPaymentDueDate.isMenuItemDisabled = true;
          }
          /*if (findPaymentTermName) {
            findPaymentTermName.visible = false;
            findPaymentTermName.isMenuItemDisabled = true;
          }*/

          vm.pagingInfo.receiptType = '"C"';
        }
        else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.DebitMemo) {
          if (findInvoiceNoField) {
            findInvoiceNoField.visible = false;
            findInvoiceNoField.isMenuItemDisabled = true;
          }

          if (findInvoiceDate) {
            findInvoiceDate.visible = false;
            findInvoiceDate.isMenuItemDisabled = true;
          }

          const findCreditMemoNo = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.CreditNoField);
          if (findCreditMemoNo) {
            findCreditMemoNo.visible = false;
            findCreditMemoNo.isMenuItemDisabled = true;
          }

          const findCreditMemoDate = _.find(vm.sourceHeader, (data) => data.field === TRANSACTION.PackingSlipColumn.CreditDate);
          if (findCreditMemoDate) {
            findCreditMemoDate.visible = false;
            findCreditMemoDate.isMenuItemDisabled = true;
          }

          if (findItemDisapprove) {
            findItemDisapprove.visible = false;
            findItemDisapprove.isMenuItemDisabled = true;
          }

          if (findTotalCreditAmount) {
            findTotalCreditAmount.visible = false;
            findTotalCreditAmount.isMenuItemDisabled = true;
          }

          if (findTotalDebitAmount) {
            findTotalDebitAmount.visible = false;
            findTotalDebitAmount.isMenuItemDisabled = true;
          }

          if (findAmountToPay) {
            findAmountToPay.visible = false;
            findAmountToPay.isMenuItemDisabled = true;
          }

          if (findPaymentDueDate) {
            findPaymentDueDate.visible = false;
            findPaymentDueDate.isMenuItemDisabled = true;
          }

          /*if (findPaymentTermName) {
            findPaymentTermName.visible = false;
            findPaymentTermName.isMenuItemDisabled = true;
          }*/

          vm.pagingInfo.receiptType = '"D"';
        }
        else {
          // vm.pagingInfo.receiptType = 'I,C,D';
          vm.pagingInfo.receiptType = '"I","C","D"';
        }

        setFilteredLabels(true);

        vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoiceList().query(vm.pagingInfo).$promise.then((response) => {
          vm.sourceData = [];
          setDataAfterGetAPICall(response, false);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoiceList().query(vm.pagingInfo).$promise.then((response) => {
          setDataAfterGetAPICall(response, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.applyFiltersOnEnter = (event) => {
        if (event.keyCode === 13) {
          vm.searchChequeNumber();
        }
      };

      vm.searchChequeNumber = () => {
        vm.callLoadData = true;
        if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
          return;
        }
        vm.loadData();
      };

      function clearMFRPN() {
        vm.pagingInfo.mfrPnId = null;
        vm.filterMFRPNText = null;
        $scope.$broadcast(vm.autoCompletecomponent.inputName + 'searchText', null);
      }

      vm.resetChequeNumber = (isReset) => {
        // vm.callLoadData = false;
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.invoiceComments = vm.chequeNumber = vm.extendedAmount = vm.paidAmount = null;
        vm.pagingInfo.SearchColumns = [];
        // vm.pagingInfo.chequeNumber = null;
        vm.checkSerachType = vm.CheckSearchTypeList[1].id;
        vm.extendedAmountSearchType = vm.CheckSearchTypeList[1].id;
        vm.paidAmountSearchType = vm.CheckSearchTypeList[1].id;
        vm.isCheckPE = vm.isCheckInv = vm.isCheckATP = vm.isCheckPartiallyPaid = vm.isCheckPaid = vm.isCheckInvApproval = false;
        vm.isNotApplicable = vm.isReadyToLock = vm.isLocked = false;
        vm.isConfirmedZeroValueInvoicesOnly = false;
        vm.isRefundNA = vm.isRefundWR = vm.isRefundPR = vm.isRefundFR = false;
        vm.isApplyDueDateFilters = false;
        vm.dueDate = vm.additionalDays = vm.termsAndAboveDays = vm.mfrSearchText = vm.invoiceNumber = undefined;
        vm.invoiceFromDate = vm.invoiceToDate = undefined;
        vm.selectedDateType = vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices ? 'I' : vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.CreditMemo ? 'C' : 'D';
        // vm.materialReceiptFromDate = vm.materialReceiptToDate = null;
        // if (vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices) {
        vm.resetDateFilter();
        // vm.resetMaterialDateFilter();
        //}
        vm.clearMfrSearchText();
        vm.mfgCodeDetailModel = [];
        vm.paymentMethodTypeModel = [];
        vm.paymentTermsModel = [];
        vm.invoicePaymentTermsModel = [];
        clearMFRPN();
        if (isReset) {
          setDefaultStatusFilters();
        }
        //$scope.$broadcast(vm.autoCompletecomponent.inputName, null);
        // vm.gridOptions.gridApi.grid.clearAllFilters();
        $timeout(() => vm.loadData());
        /*vm.isNoDataFound = true;
        vm.emptyState = null;*/
      };

      vm.showApproveNote = (row, event) => {
        DialogFactory.dialogService(
          TRANSACTION.INVOICE_DETAIL_NOTE_POPUP_CONTROLLER,
          TRANSACTION.INVOICE_DETAIL_NOTE_POPUP_VIEW,
          event,
          row
        ).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      };

      vm.showPaymentTransactions = (row, pRefPaymentMode, event) => {
        if (row) {
          row.refPaymentMode = pRefPaymentMode;
        }
        DialogFactory.dialogService(
          TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_CONTROLLER,
          TRANSACTION.SUPPLIER_INVOICE_PAYMENT_TRANSACTION_LIST_POPUP_VIEW,
          event,
          row
        ).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
      };

      vm.showCreatedCreditDebitMemo = (row, ev, pReceiptType) => {
        const data = {};
        data.packingSlipData = angular.copy(row);
        data.packingSlipId = row.id;
        data.id = null;
        data.poNumber = row.poNumber;
        data.packingSlipData.invoiceId = row.id;
        data.packingSlipData.invoiceNumber = row.invoiceNumber;
        data.packingSlipData.invoiceDate = row.invoiceDate;
        data.packingSlipData.mfgFullName = row.supplierCode;
        data.packingSlipData.mfgCodeID = row.mfgCodeID;

        data.receiptType = pReceiptType;
        data.action = 'ViewMemo';
        DialogFactory.dialogService(
          TRANSACTION.VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.VERIFICATION_PACKAGING_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.paidPackingSlip = () => {
        let messageContent;
        let alertModel;

        if (!vm.selectedRowsList || vm.selectedRowsList.length === 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE_LABEL);
          messageContent.message = stringFormat(messageContent.message, 'Invoice to Pay Now');
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const checkDraftPackingSlip = _.map(_.filter(vm.selectedRowsList, (data) => data.packingSlipModeStatus === 'D'), 'packingSlipNumber').join(', ');
        if (checkDraftPackingSlip) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DRAFT_INVOICE_PS_NOT_PAY);
          messageContent.message = stringFormat(messageContent.message, checkDraftPackingSlip);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const checkApprove = _.some(vm.selectedRowsList, (data) => data.status !== 'A' && data.status !== 'PP');
        if (checkApprove) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_PAID);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }
        const checkHalt = _.some(vm.selectedRowsList, (data) => data.haltStatus === vm.HaltResumePopUp.HaltStatus);
        if (checkHalt) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_PAY_HALTED_INVOICE);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const checkSupplier = _.uniqBy(vm.selectedRowsList, 'mfgCodeID');
        if (checkSupplier && checkSupplier.length > 1) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_PAID_OTHER_SUPPLIER);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const checkMemo = _.some(vm.selectedRowsList, (data) => data.receiptType === 'I');
        if (!checkMemo) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_PACKING_INVOICE);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const checkDebitMemoInvoiceApprove = _.filter(vm.selectedRowsList, (data) => data.receiptType === 'D' && data.creditMemoType === vm.transaction.debitMemoType[0].value && data.parentInvoiceStatus && (data.parentInvoiceStatus !== vm.transaction.PackingSlipStatus.APPROVEDTOPAY && data.parentInvoiceStatus !== vm.transaction.PackingSlipStatus.PARTIALLY_PAID && data.parentInvoiceStatus !== vm.transaction.PackingSlipStatus.PAID));
        if (checkDebitMemoInvoiceApprove && checkDebitMemoInvoiceApprove.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_PAY_DEBIT_MEMO_PARENT_INVOICE_NOT_APPROVE);
          messageContent.message = stringFormat(messageContent.message, _.map(checkDebitMemoInvoiceApprove, 'debitMemoNumber').join(', '));
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        /*as per discussion on 16-12-2020 with Dixitbhai and Kevalbhai have to add fix 25 records validation for payment, no need to add dynamic validation*/
        if (vm.selectedRowsList.length > _maxRecordsForSupplierInvoice) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INVOICE_PAYMENT_MAX_RECORDS_VALIDATION_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, _maxRecordsForSupplierInvoice, vm.selectedRowsList.length);
          alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const selectRow = angular.copy(vm.selectedRowsList);
        _.map(selectRow, (data) => {
          data.isSelected = true;
        });
        const containAllRecord = selectRow;
        _.filter(selectRow, (data) => {
          _.each(vm.sourceData, (item) => {
            if (data.id === item.refParentCreditDebitInvoiceno) {
              containAllRecord.push(item);
            }
          });
        });

        const objSupplier = _.first(containAllRecord);

        const paymentForDet = {
          paymentForIds: _.map(_.uniqBy(containAllRecord, 'id'), 'id'),
          supplierDet: {
            supplierName: objSupplier ? objSupplier.supplierName : null,
            supplierCode: objSupplier ? objSupplier.supplierCode : null,
            mfgCodeID: objSupplier ? objSupplier.mfgCodeID : null
          }
        };

        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
          event,
          paymentForDet).then(() => {
          }, (resp) => {
            //vm.gridOptions.clearSelectedRows();
            //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            if (resp) {
              vm.loadData();
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.approveInvoice = (row, event) => {
        var invoiceIds = [];
        var messageContent;

        if (!vm.allowSupplierInvoiceApproval) {
          return;
        }

        if (row) {
          invoiceIds.push(row.id);
        }
        else if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
          let invalidInvoice = _.find(vm.selectedRowsList, (item) => item.receiptType !== 'I');
          if (invalidInvoice) {
            const alertModel = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SELECT_ONLY_SUPPLIER_INVOICE_FOR_APPROVAL
            };
            DialogFactory.messageAlertDialog(alertModel);
            return;
          }

          invalidInvoice = _.find(vm.selectedRowsList, (item) => item.status === vm.transaction.PackingSlipStatus.PAID);
          if (invalidInvoice) {
            const alertModel = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PAID_INVOICE_NOT_REQUIRE_FOR_APPROVAL
            };
            DialogFactory.messageAlertDialog(alertModel);
            return;
          }

          invalidInvoice = _.find(vm.selectedRowsList, (item) => item.invoiceApprovalStatus !== 2);
          if (invalidInvoice) {
            const alertModel = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SELECT_ONLY_PENDING_SUPPLIER_INVOICE_FOR_APPROVAL
            };
            DialogFactory.messageAlertDialog(alertModel);
            return;
          }
          invoiceIds = _.map(vm.selectedRowsList, (item) => item.id);
        }
        else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, 'Invoice');
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const loginUser = BaseService.loginUser;
        const invoiceApprovalData = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Approve Supplier Invoice',
          isOnlyPassword: true,
          createdBy: loginUser.userid,
          updatedBy: loginUser.userid,
          isInvoiceApprovedMsgBtn: true
        };

        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          event,
          invoiceApprovalData).then((pswConfirmation) => {
            if (pswConfirmation) {
              const objData = {
                ids: invoiceIds,
                invoiceApprovalComment: pswConfirmation.approvalReason
              };
              vm.cgBusyLoading = PackingSlipFactory.approveSupplierInvoice().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  vm.loadData();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.updateRecord = (row) => {
        if (row.entity) {
          if (row.entity.receiptType === CORE.packingSlipReceiptType.I.Key) {
            //$state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: row.entity.id, slipType: CORE.PackingSlipInvoiceTabName });
            BaseService.goToSupplierInvoiceDetail(null, row.entity.id);
          } else if (row.entity.receiptType === CORE.packingSlipReceiptType.C.Key) {
            //$state.go(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: row.entity.id, slipType: CORE.PackingSlipInvoiceTabName });
            BaseService.goToCreditMemoDetail(null, row.entity.id);
          } else if (row.entity.receiptType === CORE.packingSlipReceiptType.D.Key) {
            //$state.go(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: TRANSACTION.SupplierInvoiceType.Detail, id: row.entity.id, slipType: CORE.PackingSlipInvoiceTabName });
            BaseService.goToDebitMemoDetail(null, row.entity.id);
          }
        }
      };

      const deleteInvoice = (invoice) => {
        let selectedIDs = [];
        if (invoice) {
          let messageContent = '';
          if (invoice.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Locked');
          } else if (invoice.haltStatus === vm.HaltResumePopUp.HaltStatus) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Halted');
          }
          if (messageContent && messageContent !== '') {
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          selectedIDs.push(invoice.id);
        } else {
          let inValidRecords = null;
          let messageContent = '';
          if (!vm.loginUser.isUserSuperAdmin) {
            inValidRecords = _.filter(vm.selectedRowsList, (a) => a.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked);
            if (inValidRecords && inValidRecords.length > 0) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
              messageContent.message = stringFormat(messageContent.message, 'Locked');
            }
          }
          inValidRecords = null;
          inValidRecords = _.filter(vm.selectedRowsList, (a) => a.haltStatus === vm.HaltResumePopUp.HaltStatus);
          if (inValidRecords && inValidRecords.length > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Halted');
          }

          if (messageContent && messageContent !== '') {
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }
        if (selectedIDs && selectedIDs.length) {
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices) {
            messageContent.message = stringFormat(messageContent.message, 'Supplier Invoice', selectedIDs.length);
            objIDs.isSupplier = true;
          } else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo) {
            messageContent.message = stringFormat(messageContent.message, 'Credit Memo', selectedIDs.length);
            objIDs.isCreditMemo = true;
          } else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.DebitMemo) {
            messageContent.message = stringFormat(messageContent.message, 'Debit Memo', selectedIDs.length);
            objIDs.isDebitMemo = true;
          }

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = PackingSlipFactory.deleteSupplierInvoiceAndMemo().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.supplier_invoice
                  };

                  if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices) {
                    data.pageName = CORE.PageName.supplier_invoice;
                  } else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo) {
                    data.pageName = CORE.PageName.credit_memo;
                  } else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.DebitMemo) {
                    data.pageName = CORE.PageName.debit_memo;
                  }

                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true,
                      isSupplier: true
                    };
                    return PackingSlipFactory.deleteSupplierInvoiceAndMemo().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = invoice ? invoice.packingSlipNumber : null;
                      data.PageName = CORE.PageName.supplier_invoice;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      data.id = selectedIDs;
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
                } else if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const deleteMemo = (invoice) => {
        let selectedIDs = [];
        let messageContent = null;
        if (invoice) {
          if (invoice.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked && !vm.loginUser.isUserSuperAdmin) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Locked');
          } else if (invoice.haltStatus === vm.HaltResumePopUp.HaltStatus) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Halted');
          } else if (invoice.markedForRefund === 1) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Marked for Refund');
          }
          if (messageContent && messageContent !== '') {
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          selectedIDs.push(invoice.id);
        } else {
          let inValidRecords = null;
          if (!vm.loginUser.isUserSuperAdmin) {
            inValidRecords = _.filter(vm.selectedRowsList, (a) => a.lockStatus === TRANSACTION.CustomerPaymentLockStatus.Locked);
            if (inValidRecords && inValidRecords.length > 0) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
              messageContent.message = stringFormat(messageContent.message, 'Locked');
            }
          }
          inValidRecords = null;
          inValidRecords = _.filter(vm.selectedRowsList, (a) => a.haltStatus === vm.HaltResumePopUp.HaltStatus);
          if (inValidRecords && inValidRecords.length > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Halted');
          }
          inValidRecords = null;
          inValidRecords = _.filter(vm.selectedRowsList, (a) => a.markedForRefund === 1);
          if (inValidRecords && inValidRecords.length > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS);
            messageContent.message = stringFormat(messageContent.message, 'Marked for Refund');
          }
          if (messageContent && messageContent !== '') {
            const model = {
              messageContent: messageContent
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }

        if (selectedIDs && selectedIDs.length) {
          const objIDs = {
            id: selectedIDs,
            CountList: true
          };
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.SupplierInvoices) {
            messageContent.message = stringFormat(messageContent.message, 'Supplier Invoice', selectedIDs.length);
          } else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.CreditMemo) {
            messageContent.message = stringFormat(messageContent.message, 'Credit Memo', selectedIDs.length);
            objIDs.isCreditMemo = true;
          } else if (vm.invoiceType === TRANSACTION.PackingSlipInvoiceTabName.DebitMemo) {
            messageContent.message = stringFormat(messageContent.message, 'Debit Memo', selectedIDs.length);
            objIDs.isDebitMemo = true;
          }

          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = SupplierInvoiceFactory.deleteInvoiceMemo().query({ objIDs: objIDs }).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                } else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.deleteRecord = (invoice) => {
        let findInvoiceData = null;
        if (invoice) {
          findInvoiceData = invoice;
        } else {
          findInvoiceData = _.find(vm.selectedRowsList, (data) => data.receiptType === TRANSACTION.PackingSlipReceiptType.SupplierInvoice);
          if (!findInvoiceData) {
            findInvoiceData = _.find(vm.selectedRowsList, (data) => data.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo || data.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo);
          }
        }

        if (findInvoiceData && findInvoiceData.receiptType === TRANSACTION.PackingSlipReceiptType.SupplierInvoice) {
          deleteInvoice(invoice);
        } else if (findInvoiceData && (findInvoiceData.receiptType === TRANSACTION.PackingSlipReceiptType.CreditMemo || findInvoiceData.receiptType === TRANSACTION.PackingSlipReceiptType.DebitMemo)) {
          deleteMemo(invoice);
        }
      };

      vm.deleteMultipleData = () => {
        const getApproveCount = _.filter(vm.selectedRowsList, (data) =>
          data.status === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[5].code ||
          data.status === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[7].code ||
          data.parentInvoiceStatus === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[5].code ||
          data.parentInvoiceStatus === CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown[7].code ||
          (data.totalPaidAmountToDisableDelete && data.totalPaidAmountToDisableDelete !== 0));
        if (getApproveCount.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_DELETE_RECORD_AS_STATUS_PAID);
          const obj = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(obj);
          return;
        } else {
          vm.deleteRecord();
        }
      };
      // get transaction type text to display in message
      function getTransactionTypeText(pReceiptType) {
        return (pReceiptType === 'I' ? 'Supplier Invoice#' : (pReceiptType === 'C' ? 'Supplier Credit Memo#' : (pReceiptType === 'D' ? 'Supplier Debit Memo#' : '')));
      }

      vm.lockRecord = (row, event) => {
        var selectedIds = [];
        let transactionTypeText = '';
        if (!vm.allowToLockSupplierTransactionFeature) {
          return;
        }
        if (row && row.entity) {
          if (row.entity.lockStatus !== TRANSACTION.CustomerPaymentLockStatus.ReadyToLock) {
            const model = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
            };
            DialogFactory.messageAlertDialog(model);
            return;
          }
          if (row.entity.haltStatus === vm.HaltResumePopUp.HaltStatus) {
            transactionTypeText = getTransactionTypeText(row.entity.receiptType);

            const invoiceNumber = row.entity.invoiceNumber || row.entity.creditMemoNumber || row.entity.debitMemoNumber;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.LOCK_AND_HALT_VALIDATION_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, transactionTypeText, invoiceNumber, 'halted', 'lock');
            DialogFactory.messageAlertDialog({ messageContent: messageContent });
            return;
          }
          selectedIds.push(row.entity.id);
        } else {
          if (vm.selectedRowsList.length > 0) {
            let inValidRecords = _.filter(vm.selectedRowsList, (a) => a.lockStatus !== TRANSACTION.CustomerPaymentLockStatus.ReadyToLock);
            if (inValidRecords && inValidRecords.length > 0) {
              const model = {
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
              };
              DialogFactory.messageAlertDialog(model);
              return;
            }
            inValidRecords = _.filter(vm.selectedRowsList, (a) => a.haltStatus === vm.HaltResumePopUp.HaltStatus);
            if (inValidRecords && inValidRecords.length > 0) {
              transactionTypeText = getTransactionTypeText(inValidRecords[0].receiptType);
              const invoiceNumber = inValidRecords[0].invoiceNumber || inValidRecords[0].creditMemoNumber || inValidRecords[0].debitMemoNumber;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.LOCK_AND_HALT_VALIDATION_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, transactionTypeText, invoiceNumber, 'halted', 'lock');
              DialogFactory.messageAlertDialog({ messageContent: messageContent });
              return;
            }

            selectedIds = vm.selectedRowsList.map((item) => item.id);
          }
        }
        /*if no record selected then return*/
        if (!selectedIds || selectedIds.length === 0) {
          return;
        }
        const obj = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOCK_RECORD_CONFIRMATION,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const objData = {
              receiptType: (row && row.entity) ? row.entity.receiptType : vm.selectedRowsList[0].receiptType,
              ids: selectedIds
            };
            vm.cgBusyLoading = PackingSlipFactory.lockTransaction().query(objData).$promise.then((response) => {
              if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.loadData();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
          // Cancel
        });
      };

      //get data for mfgcode
      vm.getMfgSearch = () => {
        vm.mfrSearchText = undefined;
        const searchObj = {
          mfgType: CORE.MFG_TYPE.DIST,
          isCodeFirst: true
        };

        $scope.$parent.vm.cgBusyLoading = ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
          vm.mfgCodeDetail = vm.mfgCodeListToDisplay = [];
          if (mfgcodes && mfgcodes.data) {
            vm.mfgCodeDetail = mfgcodes.data;
            vm.mfgCodeListToDisplay = angular.copy(vm.mfgCodeDetail);
          }
          return vm.mfgCodeDetail;
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // vm.getMfgSearch();

      /* Get payable payment method*/
      vm.paymentMethodTypeList = [];
      vm.getPaymentMethodTypeSearch = () => {
        vm.paymentMethodTypeSearchText = undefined;
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.PayablePaymentMethods.Name);
        const listObj = {
          GencCategoryType: GencCategoryType
        };

        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentmethod) => {
          if (paymentmethod && paymentmethod.data) {
            vm.paymentMethodTypeList = paymentmethod.data;
            vm.paymentMethodTypeListToDisplay = angular.copy(vm.paymentMethodTypeList);
            return $q.resolve(vm.paymentMethodTypeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // vm.getPaymentMethodTypeSearch();

      /* Get payment Terms*/
      vm.paymentTermsList = [];
      vm.getPaymentTermsSearch = (type) => {
        if (!type || type === 'SUPPLIER') {
          vm.paymentTermsSearchText = undefined;
        }
        if (!type || type === 'INV') {
          vm.invPaymentTermsSearchText = undefined;
        }
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.Terms.Name);
        const listObj = {
          GencCategoryType: GencCategoryType
        };

        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentterms) => {
          if (paymentterms && paymentterms.data) {
            if (!type || type === 'SUPPLIER') {
              vm.paymentTermsList = paymentterms.data;
              vm.paymentTermsListToDisplay = angular.copy(vm.paymentTermsList);
            }
            if (!type || type === 'INV') {
              vm.invPaymentTermsList = paymentterms.data;
              vm.invPaymentTermsListToDisplay = angular.copy(vm.invPaymentTermsList);
            }
            return $q.resolve(vm.paymentTermsList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //  vm.getPaymentTermsSearch();

      $scope.$parent.vm.cgBusyLoading = $q.all([vm.getMfgSearch(), vm.getPaymentMethodTypeSearch(), vm.getPaymentTermsSearch()]).then(() => {
        if (vm.hasUrlSearchData && vm.searchObj) {
          vm.isCheckPartiallyPaid = vm.isCheckPE = vm.isCheckInv = vm.isCheckATP = true;
          vm.isCheckInvApproval = vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices;
          vm.isNotApplicable = vm.isReadyToLock = true;
          vm.isApplyDueDateFilters = true;
          vm.mfgCodeDetailModel = [vm.searchObj.mfgCodeID];
          vm.termsAndAboveDays = (vm.searchObj.termsAndAboveDays && vm.searchObj.termsAndAboveDays !== '0') ? parseInt(vm.searchObj.termsAndAboveDays) : null;
          vm.dueDate = vm.searchObj.dueDate ? new Date(vm.searchObj.dueDate) : null;
          vm.additionalDays = (vm.searchObj.additionalDays && vm.searchObj.additionalDays !== '0') ? parseInt(vm.searchObj.additionalDays) : null;

          vm.hasUrlSearchData = false;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });


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
      vm.searchPaymentMethodTypeList = () => {
        var paymentMethodTypeListToFilter;
        if (vm.timeoutWatchPaymentMethod) {
          $timeout.cancel(vm.timeoutWatchPaymentMethod);
        }
        vm.timeoutWatchPaymentMethod = $timeout(() => {
          vm.paymentMethodTypeModel = [];
          paymentMethodTypeListToFilter = angular.copy(vm.paymentMethodTypeList);
          vm.paymentMethodTypeListToDisplay = vm.paymentMethodTypeSearchText ? _.filter(paymentMethodTypeListToFilter, (item) => item.gencCategoryName.toLowerCase().contains(vm.paymentMethodTypeSearchText.toLowerCase())) : paymentMethodTypeListToFilter;
        }, _configTimeout);
      };

      vm.searchPaymentTermsList = () => {
        var paymentTermsListToFilter;
        if (vm.timeoutWatchPaymentTerms) {
          $timeout.cancel(vm.timeoutWatchPaymentTerms);
        }
        vm.timeoutWatchPaymentTerms = $timeout(() => {
          vm.paymentTermsModel = [];
          paymentTermsListToFilter = angular.copy(vm.paymentTermsList);
          vm.paymentTermsListToDisplay = vm.paymentTermsSearchText ? _.filter(paymentTermsListToFilter, (item) => item.gencCategoryName.toLowerCase().contains(vm.paymentTermsSearchText.toLowerCase())) : paymentTermsListToFilter;
        }, _configTimeout);
      };

      vm.searchInvPaymentTermsList = () => {
        var invPaymentTermsListToFilter;
        if (vm.timeoutWatchInvPaymentTerms) {
          $timeout.cancel(vm.timeoutWatchInvPaymentTerms);
        }
        vm.timeoutWatchInvPaymentTerms = $timeout(() => {
          vm.invoicePaymentTermsModel = [];
          invPaymentTermsListToFilter = angular.copy(vm.invPaymentTermsList);
          vm.invPaymentTermsListToDisplay = vm.invPaymentTermsSearchText ? _.filter(invPaymentTermsListToFilter, (item) => item.gencCategoryName.toLowerCase().contains(vm.invPaymentTermsSearchText.toLowerCase())) : invPaymentTermsListToFilter;
        }, _configTimeout);
      };

      vm.getTotalAmountForSelectedRows = () => {
        var selectedTotalAmount = 0;
        if (vm.selectedRowsList && vm.selectedRowsList.length > 0) {
          selectedTotalAmount = CalcSumofArrayElement(_.map(vm.selectedRowsList, (data) => data.balanceToPayAmount), _amountFilterDecimal);
        }
        return $filter('amount')(selectedTotalAmount);
      };

      vm.dueDateChanged = () => {
        vm.dueDateOptions = {
          dueDateOpenFlag: false
        };
        if (!vm.dueDate) {
          vm.additionalDays = undefined;
        }

        vm.termsAndAboveDays = undefined;
      };


      $scope.$watch('vm.dueDate', (newValue) => {
        if (!newValue) {
          vm.additionalDays = undefined;
        }
      });

      //==> Clear search within filter boxes
      vm.clearMfrSearchText = () => {
        vm.mfrSearchText = undefined;
        vm.searchMfrList();
      };
      vm.clearPaymentMethodTypeSearchText = () => {
        vm.paymentMethodTypeSearchText = undefined;
        vm.searchPaymentMethodTypeList();
      };
      vm.clearPaymentTermsSearchText = () => {
        vm.paymentTermsSearchText = undefined;
        vm.searchPaymentTermsList();
      };

      vm.clearInvPaymentTermsSearchText = () => {
        vm.invPaymentTermsSearchText = undefined;
        vm.searchInvPaymentTermsList();
      };

      //==> Clear search within filter boxes
      vm.clearManufacturerFilter = () => {
        vm.mfgCodeDetailModel = [];
      };
      vm.clearPaymentMethodTypeFilter = () => {
        vm.paymentMethodTypeModel = [];
      };
      vm.clearPaymentTermsFilter = () => {
        vm.paymentTermsModel = [];
      };

      vm.clearInvPaymentTermsFilter = () => {
        vm.invoicePaymentTermsModel = [];
      };

      vm.applyDueDateFiltersChange = () => {
        vm.dueDate = undefined;
        vm.additionalDays = undefined;
        vm.termsAndAboveDays = undefined;
        if (vm.isApplyDueDateFilters) {
          vm.isCheckATP = vm.isCheckPartiallyPaid = true;
        }
      };

      vm.onCheckNumberChange = () => {
        if (vm.chequeNumber || vm.paidAmount || vm.paidAmount === 0) {
          vm.isCheckPartiallyPaid = vm.isCheckPaid = true;
        }
      };

      const initAutoComplete = () => {
        vm.autoCompletecomponent = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          keyColumnId: null,
          inputName: CORE.LabelConstant.MFG.MFGPN,
          placeholderName: CORE.LabelConstant.MFG.MFGPN,
          isAddnew: false,
          isRequired: false,
          isUppercaseSearchText: true,
          onSelectCallbackFn: (item) => {
            if (item && item.id) {
              vm.pagingInfo.mfrPnId = item.id;
              vm.filterMFRPNText = item.mfgPN;
            } else {
              vm.pagingInfo.mfrPnId = null;
              vm.filterMFRPNText = null;
            }
          },
          onSearchFn: function (query) {
            const searchObj = {
              query: query,
              inputName: vm.autoCompletecomponent.inputName,
              isContainCPN: true
            };
            return searchMfrPn(searchObj);
          }
        };
      };

      initAutoComplete();

      const searchMfrPn = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => component.data.data).catch((error) => BaseService.getErrorLog(error));

      /* to get/apply class for Supplier transaction lock status */
      vm.getSupplierTransactionLockStatusClassName = (lockStatus) => BaseService.getCustPaymentLockStatusClassName(lockStatus);

      vm.printDebitMemoReport = (row, isDownload) => {
        if (isDownload) {
          row.entity.isDownloadDisabled = true;
        } else {
          row.entity.isDisabledPrintDebitMemoReport = true;
        }
        const debitMemoReportDetails = {
          receiptID: row.entity.id,
          employeeID: BaseService.loginUser.employee.id,
          reportAPI: 'PackingSlip/debitMemoReport',
          fileData: {
            debitMemoNumber: row.entity.debitMemoNumber,
            supplierCodeName: row.entity.supplierCodeName
          }
        };
        ReportMasterFactory.generateReport(debitMemoReportDetails).then((response) => {
          const fileData = response.config.data.fileData;
          if (isDownload) {
            row.entity.isDownloadDisabled = false;
          } else {
            row.entity.isDisabledPrintDebitMemoReport = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}', CORE.REPORT_SUFFIX.SUPPLIER_DEBIT_MEMO, fileData.debitMemoNumber, fileData.supplierCodeName), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.opencustomerpackingSlipChangesHistoryAuditLog = (row, ev) => {
        const data = row.entity;
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_CONTROLLER,
          TRANSACTION.TRANSACTION_PACKING_SLIP_CHANGE_HISTORY_VIEW,
          ev,
          data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
      };

      vm.haltResumeHistoryList = (row, $event) => {
        const data = {
          isHideHaltType: true,
          refTransId: row.entity.id,
          poNumber: row.entity.poNumber,
          poId: row.entity.poId,
          invoiceNumber: row.entity.invoiceNumber,
          invoiceId: row.entity.id,
          creditMemoNumber: row.entity.creditMemoNumber,
          debitMemoNumber: row.entity.debitMemoNumber,
          refInvoiceNumber: row.entity.refInvoiceNumber,
          refInvoiceId: row.entity.refParentCreditDebitInvoiceno,
          packingSlipNumber: row.entity.packingSlipNumber,
          packingSlipId: row.entity.packingSlipId
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
        if (row.entity) {
          if (row.entity.lockStatus === vm.transaction.CustomerPaymentLockStatus.Locked &&
            row.entity.haltStatus !== vm.HaltResumePopUp.HaltStatus) {
            const transactionTypeText = getTransactionTypeText(row.entity.receiptType);
            const invoiceNumber = row.entity.invoiceNumber || row.entity.creditMemoNumber || row.entity.debitMemoNumber;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.LOCK_AND_HALT_VALIDATION_MESSAGE);
            messageContent.message = stringFormat(messageContent.message, transactionTypeText, invoiceNumber, 'locked', 'halt');
            DialogFactory.messageAlertDialog({ messageContent: messageContent });
            return;
          }
          let vRefType = vm.HaltResumePopUp.refTypeSINV;
          if (row.entity.receiptType === CORE.packingSlipReceiptType.C.Key) {
            vRefType = vm.HaltResumePopUp.refTypeSCM;
          } else if (row.entity.receiptType === CORE.packingSlipReceiptType.D.Key) {
            vRefType = vm.HaltResumePopUp.refTypeSDM;
          }
          const haltResumeObj = {
            refTransId: row.entity.id,
            isHalt: row.entity.haltStatus ? (row.entity.haltStatus === vm.HaltResumePopUp.HaltStatus ? false : true) : true,
            module: vRefType,
            refType: vRefType,
            poNumber: row.entity.poNumber,
            poId: row.entity.poId,
            invoiceNumber: row.entity.invoiceNumber,
            invoiceId: row.entity.id,
            creditMemoNumber: row.entity.creditMemoNumber,
            debitMemoNumber: row.entity.debitMemoNumber,
            refInvoiceNumber: row.entity.refInvoiceNumber,
            refInvoiceId: row.entity.refParentCreditDebitInvoiceno,
            packingSlipNumber: row.entity.packingSlipNumber,
            packingSlipId: row.entity.packingSlipId,
            receiptType: row.entity.receiptType
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

      vm.addSupplierRefund = (row) => {
        if (row.receiptType === 'C' || row.receiptType === 'D') {
          if (row.markedForRefundAmt === row.refundAmount) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_CM_DM_ALREADY_REFUNDED);
            messageContent.message = stringFormat(messageContent.message, (row.receiptType === 'C' ? 'Credit Memo#' : 'Debit Memo#'), (row.receiptType === 'C' ? row.creditMemoNumber : row.debitMemoNumber));
            DialogFactory.messageAlertDialog({ messageContent: messageContent });
            return;
          }
          BaseService.openInNew(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: null, mfgcodeid: row.mfgCodeID, memoid: row.id });
        }
      };

      function socketListenerHaltResume(responseData) {
        if (responseData.refTransId) {
          const criteria = {
            Page: CORE.UIGrid.Page(),
            SortColumns: [],
            SearchColumns: [],
            pageName: CORE.PAGENAME_CONSTANT[7].PageName,
            invoiceIds: responseData.refTransId
          };

          vm.cgBusyLoading = SupplierInvoiceFactory.getSupplierInvoiceList().query(criteria).$promise.then((response) => {
            if (response && response.data && response.data.supplierInvoice) {
              formatListData(response.data.supplierInvoice);

              if (response.data.supplierInvoice && response.data.supplierInvoice.length > 0) {
                _.map(vm.gridOptions.data, (data, $index) => {
                  if (data.id === response.data.supplierInvoice[0].id) {
                    vm.sourceData.splice($index, 1);
                    vm.sourceData.splice($index, 0, response.data.supplierInvoice[0]);
                  } else if (data.refParentCreditDebitInvoiceno === response.data.supplierInvoice[0].id) {
                    data.haltRefTypeRefInv = response.data.supplierInvoice[0].haltRefType;
                    data.haltStatusRefInv = response.data.supplierInvoice[0].haltStatus;
                    data.haltReasonRefInv = response.data.supplierInvoice[0].haltReason;
                  }
                });
              } else {
                const index = _.findIndex(vm.gridOptions.data, (data) => data.id === responseData.refTransId);
                if (index !== -1) {
                  vm.sourceData.splice(index, 1);
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      function connectSocket() {
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_START, socketListenerHaltResume);
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_STOP, socketListenerHaltResume);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      function removeSocketListener() {
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_START);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.SupplierInvoice_STOP);
      }
      // on disconnect socket
      socketConnectionService.on('disconnect', () => {
        removeSocketListener();
      });

      const approveInvoiceBroadcastCall = $scope.$on(USER.ApproveSupplierInvoiceBroadcast, () => {
        vm.approveInvoice();
      });

      const invoicePayNowBroadcastCall = $scope.$on(USER.SupplierInvoicePayNowBroadcast, () => {
        vm.paidPackingSlip();
      });

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      //==>> master redirection links
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };
      vm.goToPaymentMethodTypeList = () => {
        BaseService.goToGenericCategoryPayablePaymentMethodList();
      };
      vm.goToPartList = () => {
        BaseService.goToPartList();
      };

      vm.goToGenericCategoryTermsList = () => {
        BaseService.goToGenericCategoryTermsList();
      };

      vm.goToPurchaseOrderDetail = (row) => {
        if (row) {
          BaseService.goToPurchaseOrderDetail(row.poId);
        }
      };

      vm.addRecords = () => {
        if (vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.SupplierInvoices) {
          BaseService.goToSupplierInvoiceDetail();
        } else if (vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.CreditMemo) {
          BaseService.goToCreditMemoDetail();
        } else if (vm.invoiceType === vm.transaction.PackingSlipInvoiceTabName.DebitMemo) {
          BaseService.goToDebitMemoDetail();
        }
      };

      // download print
      vm.onDownload = (row) => vm.printDebitMemoReport(row, true);

      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
        approveInvoiceBroadcastCall();
        invoicePayNowBroadcastCall();
        removeSocketListener();
      });
    }
  }
})();
