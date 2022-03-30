(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierInvoicePaymentGrid', supplierInvoicePaymentGrid);

  /** @ngInject */
  function supplierInvoicePaymentGrid(BaseService, $timeout, $q, CORE, USER, ManufacturerFactory, SupplierInvoiceFactory, TRANSACTION, DialogFactory, $filter, GenericCategoryFactory, BankFactory, ReportMasterFactory, PackingSlipFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
      },
      templateUrl: 'app/directives/custom/supplier-invoice-payment-grid/supplier-invoice-payment-grid.html',
      controller: supplierInvoicePaymentGridCtrl,
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
    function supplierInvoicePaymentGridCtrl($scope) {
      const vm = this;
      vm.isHideDelete = vm.isViewLockCustomerPayment = vm.editFeatureBased = vm.isUpdatable = vm.isVoidAndReIssuePayment = vm.isVoidPaymentAndReleaseInvoiceGroup =
        vm.isPaymentHistory = vm.isViewInvoiceDetails = vm.isPrintCheck = vm.isPrintRemittance = vm.isPrintCheckWithRemittance = vm.isReadyToLock = true;
      vm.isDisabledLockBtn = vm.isDisabledUnlockBtn = vm.isLocked = false;
      vm.historyActionButtonText = 'Payment History';
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.SupplierInvoicePaymentAdvanceFilters = angular.copy(CORE.SupplierInvoicePaymentAdvanceFilters);
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_INVOICE_PAYMENT;
      vm.EmptyFilterMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.configTimeout = _configTimeout;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.loginUser = BaseService.loginUser;
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.invoiceAmountSearchType = vm.CheckSearchTypeList[1].id;
      vm.selectedRowsList = [];
      vm.TRANSACTION = TRANSACTION;
      vm.invoiceAmount = null;
      vm.SupplierPaymentLockStatus = vm.TRANSACTION.SupplierPaymentLockStatus;
      vm.dateTypeList = vm.TRANSACTION.SupplierPaymentDateFilterList;
      vm.selectedDateType = vm.dateTypeList[4].key;

      vm.reTryCount = 0;
      vm.filter = {
        supplier: [],
        paymentMethod: [],
        bankAccountCode: [],
        paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
        paymentNumber: null,
        paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
        invoiceNumber: null,
        amount: null,
        fromDate: null,
        toDate: null
      };

      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          refPaymentMode: CORE.RefPaymentModeForInvoicePayment.Payable,
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: []
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
        allowToExportAllData: true,
        CurrentPage: CORE.PAGENAME_CONSTANT[23].PageName,
        exporterCsvFilename: 'Supplier Invoice Payments History.csv',
        hideMultiDeleteButton: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return SupplierInvoiceFactory.retrieveSupplierInvoicePayments().query(pagingInfoOld).$promise.then((invoicePayment) => {
            if (invoicePayment && invoicePayment.data) {
              setDataAfterGetAPICall(invoicePayment, false);
              return invoicePayment.data.invoicePayment;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //set Filter Labels
      function setFilteredLabels(canReGenerateTootip) {
        vm.SupplierInvoicePaymentAdvanceFilters.Supplier.isDeleted = !(vm.filter && vm.filter.supplier && vm.filter.supplier.length > 0);
        vm.SupplierInvoicePaymentAdvanceFilters.PaymentMethod.isDeleted = !(vm.filter && vm.filter.paymentMethod && vm.filter.paymentMethod.length > 0);
        vm.SupplierInvoicePaymentAdvanceFilters.BankAccountCode.isDeleted = !(vm.filter && vm.filter.bankAccountCode && vm.filter.bankAccountCode.length > 0);
        vm.SupplierInvoicePaymentAdvanceFilters.PaymentOrCheckNumber.isDeleted = !(vm.filter && vm.filter.paymentNumber);
        vm.SupplierInvoicePaymentAdvanceFilters.InvoiceNumber.isDeleted = !(vm.filter && vm.filter.invoiceNumber);
        vm.SupplierInvoicePaymentAdvanceFilters.PaymentAmount.isDeleted = !(vm.filter && (vm.filter.amount || vm.filter.amount === 0));
        vm.SupplierInvoicePaymentAdvanceFilters.LockStatus.isDeleted = !(vm.isReadyToLock || vm.isLocked);
        vm.SupplierInvoicePaymentAdvanceFilters.SearchComments.isDeleted = !(vm.paymentComments);
        vm.SupplierInvoicePaymentAdvanceFilters.InvoiceAmount.isDeleted = !(vm.invoiceAmount || vm.invoiceAmount === 0);
        if (vm.filter && (vm.filter.fromDate || vm.filter.toDate)) {
          vm.SupplierInvoicePaymentAdvanceFilters.PODate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[0].key);
          vm.SupplierInvoicePaymentAdvanceFilters.MaterialReceiptDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[1].key);
          vm.SupplierInvoicePaymentAdvanceFilters.PackingSlipDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[2].key);
          vm.SupplierInvoicePaymentAdvanceFilters.InvoiceDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[3].key);
          vm.SupplierInvoicePaymentAdvanceFilters.PaymentDate.isDeleted = !(vm.selectedDateType === vm.dateTypeList[4].key);
        } else {
          vm.SupplierInvoicePaymentAdvanceFilters.PODate.isDeleted = true;
          vm.SupplierInvoicePaymentAdvanceFilters.MaterialReceiptDate.isDeleted = true;
          vm.SupplierInvoicePaymentAdvanceFilters.PackingSlipDate.isDeleted = true;
          vm.SupplierInvoicePaymentAdvanceFilters.InvoiceDate.isDeleted = true;
          vm.SupplierInvoicePaymentAdvanceFilters.PaymentDate.isDeleted = true;
        }

        //==>>>Set filter tool-tip
        if (canReGenerateTootip) {
          vm.SupplierInvoicePaymentAdvanceFilters.Supplier.tooltip = getFilterTooltip(vm.supplierListToDisplay, vm.filter.supplier, 'id', 'mfgCodeName');
          vm.SupplierInvoicePaymentAdvanceFilters.PaymentMethod.tooltip = getFilterTooltip(vm.paymentMethodListToDisplay, vm.filter.paymentMethod, 'gencCategoryID', 'gencCategoryName');
          vm.SupplierInvoicePaymentAdvanceFilters.BankAccountCode.tooltip = getFilterTooltip(vm.bankAccountCodeListToDisplay, vm.filter.bankAccountCode, 'id', 'accountCode');
          vm.SupplierInvoicePaymentAdvanceFilters.SearchComments.tooltip = vm.paymentComments || null;

          if (vm.filter) {
            if (vm.filter.paymentNumber) {
              vm.SupplierInvoicePaymentAdvanceFilters.PaymentOrCheckNumber.tooltip = vm.filter.paymentNumber;
            }

            let tooltip = null;
            vm.pagingInfo.fromDate = null;
            vm.pagingInfo.toDate = null;
            vm.pagingInfo.selectedDateType = vm.selectedDateType;
            if (vm.filter.fromDate && vm.filter.toDate) {
              vm.pagingInfo.fromDate = (BaseService.getAPIFormatedDate(vm.filter.fromDate));
              vm.pagingInfo.toDate = (BaseService.getAPIFormatedDate(vm.filter.toDate));
              tooltip = 'From: ' + $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat) + ' To: ' + $filter('date')(new Date(vm.filter.toDate), vm.DefaultDateFormat);
            }
            else if (vm.filter.fromDate) {
              vm.pagingInfo.fromDate = (BaseService.getAPIFormatedDate(vm.filter.fromDate));
              tooltip = $filter('date')(new Date(vm.filter.fromDate), vm.DefaultDateFormat);
            }
            if (vm.selectedDateType === vm.dateTypeList[0].key) {
              vm.SupplierInvoicePaymentAdvanceFilters.PODate.tooltip = tooltip;
            } else if (vm.selectedDateType === vm.dateTypeList[1].key) {
              vm.SupplierInvoicePaymentAdvanceFilters.MaterialReceiptDate.tooltip = tooltip;
            } else if (vm.selectedDateType === vm.dateTypeList[2].key) {
              vm.SupplierInvoicePaymentAdvanceFilters.PackingSlipDate.tooltip = tooltip;
            } else if (vm.selectedDateType === vm.dateTypeList[3].key) {
              vm.SupplierInvoicePaymentAdvanceFilters.InvoiceDate.tooltip = tooltip;
            } else if (vm.selectedDateType === vm.dateTypeList[4].key) {
              vm.SupplierInvoicePaymentAdvanceFilters.PaymentDate.tooltip = tooltip;
            }

            if (vm.filter.invoiceNumber) {
              vm.SupplierInvoicePaymentAdvanceFilters.InvoiceNumber.tooltip = vm.filter.invoiceNumber;
            }
            if (vm.filter.amount || vm.filter.amount === 0) {
              vm.SupplierInvoicePaymentAdvanceFilters.PaymentAmount.tooltip = vm.filter.amount.toString();
            }
            if (vm.invoiceAmount || vm.invoiceAmount === 0) {
              vm.SupplierInvoicePaymentAdvanceFilters.InvoiceAmount.tooltip = vm.invoiceAmount.toString();
            }
          }

          if (vm.isReadyToLock && vm.isLocked) {
            vm.pagingInfo.lockStatusFilter = null;
            vm.SupplierInvoicePaymentAdvanceFilters.LockStatus.tooltip = 'All';
          } else if (!vm.isReadyToLock && !vm.isLocked) {
            vm.SupplierInvoicePaymentAdvanceFilters.LockStatus.tooltip = vm.pagingInfo.lockStatusFilter = null;
          } else {
            if (vm.isReadyToLock) {
              vm.pagingInfo.lockStatusFilter = vm.SupplierPaymentLockStatus.ReadyToLock.id;
              vm.SupplierInvoicePaymentAdvanceFilters.LockStatus.tooltip = vm.SupplierPaymentLockStatus.ReadyToLock.value;
            } else if (vm.isLocked) {
              vm.pagingInfo.lockStatusFilter = vm.SupplierPaymentLockStatus.Locked.id;
              vm.SupplierInvoicePaymentAdvanceFilters.LockStatus.tooltip = vm.SupplierPaymentLockStatus.Locked.value;
            }
          }
        }
        //<<<==Set filter tool-tip

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }

        vm.numberOfMasterFiltersApplied = _.filter(vm.SupplierInvoicePaymentAdvanceFilters, (num) => num.isDeleted === false).length;
      }

      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.SupplierInvoicePaymentAdvanceFilters.Supplier.value:
              vm.filter.supplier = [];
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.PaymentMethod.value:
              vm.filter.paymentMethod = [];
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.BankAccountCode.value:
              vm.filter.bankAccountCode = [];
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.PaymentOrCheckNumber.value:
              vm.filter.paymentNumber = null;
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.PODate.value:
            case vm.SupplierInvoicePaymentAdvanceFilters.MaterialReceiptDate.value:
            case vm.SupplierInvoicePaymentAdvanceFilters.PackingSlipDate.value:
            case vm.SupplierInvoicePaymentAdvanceFilters.InvoiceDate.value:
            case vm.SupplierInvoicePaymentAdvanceFilters.PaymentDate.value:
              vm.filter.fromDate = null;
              vm.filter.toDate = null;
              vm.resetDateFilter();
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.InvoiceNumber.value:
              vm.filter.invoiceNumber = null;
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.PaymentAmount.value:
              vm.filter.amount = null;
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.LockStatus.value:
              vm.isReadyToLock = vm.isLocked = false;
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.SearchComments.value:
              vm.paymentComments = null;
              break;
            case vm.SupplierInvoicePaymentAdvanceFilters.InvoiceAmount.value:
              vm.invoiceAmount = null;
              break;
          }
          vm.loadData();
        }
      };

      vm.removePaymentFilter = () => {
        vm.filter.paymentNumber = null;
        vm.loadData();
      };

      vm.removeCommentFilter = () => {
        vm.paymentComments = null;
        vm.loadData();
      };

      vm.removeInvoiceFilter = () => {
        vm.filter.invoiceNumber = null;
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

      vm.getSupplier = () => {
        vm.supplierSearchText = null;
        return ManufacturerFactory.getAllManufacturerWithFormattedCodeList({
          mfgType: CORE.MFG_TYPE.DIST
        }).query().$promise.then((response) => {
          if (response && response.data) {
            vm.supplierList = vm.supplierListToDisplay = response.data;
            return $q.resolve(vm.supplierList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

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

      vm.getBankAccountCode = () => {
        vm.bankAccountCodeSearchText = null;
        return BankFactory.getBankList().query().$promise.then((response) => {
          if (response && response.data) {
            vm.bankAccountCodeList = vm.bankAccountCodeListToDisplay = response.data;
            return $q.resolve(vm.bankAccountCodeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const init = () => {
        const promises = [vm.getSupplier(), vm.getPaymentMethod(), vm.getBankAccountCode()];
        vm.cgBusyLoading = $q.all(promises).then(() => {

        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();

      const getAllRights = () => {
        vm.enableInvoicePayment = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToModifyPaymentDetails);
        vm.allowToVoidAndReIssuePaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToVoidAndReIssuePayment);
        vm.allowToLockSupplierPaymentFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockSupplierPayment);
        if ((vm.enableInvoicePayment === null || vm.enableInvoicePayment === undefined ||
          vm.allowToVoidAndReIssuePaymentFeature === null || vm.allowToVoidAndReIssuePaymentFeature === undefined ||
          vm.allowToLockSupplierPaymentFeature === null || vm.allowToLockSupplierPaymentFeature === undefined) &&
          (vm.reTryCount < _configGetFeaturesRetryCount)) {
          vm.reTryCount++;
          getAllRights(); // put for hard reload option as it will not get data from feature rights
        }
      };

      getAllRights();

      vm.sourceHeader = [
        {
          field: 'Action',
          displayName: 'Action',
          width: '180',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4" row-entity="row.entity"></grid-action-view>',
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
          displayName: vm.LabelConstant.COMMON.SystemID,
          width: 135,
          cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'accountReference',
          displayName: 'Account Reference',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'supplierCodeName',
          displayName: 'Supplier',
          width: '200',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Supplier" text="row.entity.supplierCodeName"></copy-text>\
                        </div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentMethod',
          displayName: 'Payment Method',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-if="row.entity.systemGeneratedPaymentMethod === 0 " ng-click="grid.appScope.$parent.vm.goToPaymentMethodDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <span ng-if="row.entity.systemGeneratedPaymentMethod === 1">{{COL_FIELD}}</span>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SupplierInvoice.PaymentMethod" text="row.entity.paymentMethod"></copy-text>\
                        </div>',
          width: 175,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentNumber',
          displayName: 'Payment# or Check#',
          width: '220',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateRecord(row);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="\'Payment# or Check#\'" text="row.entity.paymentNumber"></copy-text>\
                        </div>',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'bankAccountNo',
          displayName: vm.LabelConstant.Bank.BankAccountCode,
          width: 160,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.updateBank(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.Bank.BankAccountCode" text="row.entity.bankAccountNo"></copy-text>\
                        </div>',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'bankName',
          displayName: 'Bank Name',
          width: '250',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentDate',
          displayName: 'Payment Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat }}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        },
        {
          field: 'paymentAmount',
          displayName: 'Payment Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '150',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'remark',
          displayName: 'Comment',
          cellTemplate: '<md-button class="md-warn margin-0" ng-class="{\'md-hue-1\': !row.entity.remark }" ng-disabled="!row.entity.remark" ng-click="grid.appScope.$parent.vm.showRemark(row, $event)"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: 100
        },
        {
          field: 'payToName',
          displayName: 'Pay To Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'payToAddress',
          displayName: vm.LabelConstant.Address.PayToAddress,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'billToAddress',
          displayName: 'Bil To Address',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'isPaymentVoidedConvertedValue',
          displayName: 'Payment Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isPaymentVoidedConvertedValue ==\'Paid\', \
                            \'label-warning\':row.entity.isPaymentVoidedConvertedValue == \'Voided\'}"> \
                                {{ COL_FIELD }}'
            + '</span>'
            + '</div>',
          width: 100,
          enableCellEdit: false,
          enableFiltering: true
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
          enableFiltering: false
        },
        {
          field: 'refVoidedPaymentNumber',
          displayName: 'Ref Voided Payment# Or Check#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}\
                          <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.refVoidedPaymentLockStatus === grid.appScope.$parent.vm.SupplierPaymentLockStatus.Locked.id" style="margin-left:5px !important;"> </md-icon>\
                        </div>',
          width: '220',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'voidPaymentReason',
          displayName: 'Void Payment Reason',
          cellTemplate: '<md-button class="md-warn margin-0" ng-class="{\'md-hue-1\': !row.entity.voidPaymentReason }" ng-disabled="!row.entity.voidPaymentReason" ng-click="grid.appScope.$parent.vm.showRemark(row, $event, true)"> \
                                        View \
                                    </md-button>',
          width: 175,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'invoiceAmount',
          displayName: vm.LabelConstant.SupplierInvoice.ExtendedInvoiceAmount,
          width: '150',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          enableFiltering: true,
          enableSorting: true
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
          field: 'updatedAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
          field: 'updatedby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
        },
        {
          field: 'updatedbyRole',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
        },
        {
          field: 'createdAt',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        }
        , {
          field: 'createdby',
          displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
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
            item.isDisabledDelete = true;
            item.isDisabledUpdate = vm.enableInvoicePayment ? false : true;
            item.isDisableVoidAndReIssuePayment = (item.isPaymentVoided || !vm.allowToVoidAndReIssuePaymentFeature || (item.lockStatus === vm.SupplierPaymentLockStatus.Locked.id && !vm.loginUser.isUserSuperAdmin));
            item.isDisableVoidPaymentAndReleaseInvoiceGroup = (item.isPaymentVoided || !vm.allowToVoidAndReIssuePaymentFeature || (item.lockStatus === vm.SupplierPaymentLockStatus.Locked.id && !vm.loginUser.isUserSuperAdmin));
            item.paymentDate = BaseService.getUIFormatedDate(item.paymentDate, vm.DefaultDateFormat);
            if (!vm.allowToLockSupplierPaymentFeature) {
              item.isDisableLockUnlockTransaction = true;
            }
            item.isPrintLoader = false;
            item.isPrintRemittDisabled = false;
            if (item.lockStatus === vm.SupplierPaymentLockStatus.Locked.id) {
              item.lockUnlockTransactionBtnText = 'Unlock Supplier Invoice Payment';
            } else {
              item.lockUnlockTransactionBtnText = 'Lock Supplier Invoice Payment';
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
            if (vm.pagingInfo.SearchColumns.length > 0 || vm.pagingInfo.supplierIDs || vm.pagingInfo.paymentMethodIDs || vm.pagingInfo.bankAccountCodeIDs || vm.isReadyToLock || vm.isLocked || vm.pagingInfo.paymentNumber || vm.pagingInfo.invoiceNumber || vm.pagingInfo.amount || vm.pagingInfo.amount === 0 || vm.pagingInfo.fromDate || vm.pagingInfo.toDate || vm.paymentComments || vm.invoiceAmount || vm.invoiceAmount === 0) {
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

      vm.applyFiltersOnEnter = (event) => {
        if (event.keyCode === 13) {
          vm.loadData();
        }
      };

      /* retrieve supplier invoice payment history list*/
      vm.loadData = () => {
        if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
          return;
        }
        vm.pagingInfo.supplierIDs = vm.filter.supplier.join(',');
        vm.pagingInfo.paymentMethodIDs = vm.filter.paymentMethod.join(',');
        vm.pagingInfo.bankAccountCodeIDs = vm.filter.bankAccountCode.join(',');

        vm.pagingInfo.exactPaymentNumberSearch = (vm.filter.paymentNumberSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.paymentNumber = BaseService.convertSpecialCharToSearchString(vm.filter.paymentNumber);

        vm.pagingInfo.paymentComments = BaseService.convertSpecialCharToSearchString(vm.paymentComments);
        vm.pagingInfo.exactPaymentAmountSearch = (vm.filter.paymentAmountSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.invoiceNumber = BaseService.convertSpecialCharToSearchString(vm.filter.invoiceNumber);
        vm.pagingInfo.amount = vm.filter.amount || vm.filter.amount === 0 ? vm.filter.amount : null;
        vm.pagingInfo.invoiceAmount = vm.invoiceAmount || vm.invoiceAmount === 0 ? vm.invoiceAmount : null;
        vm.pagingInfo.exactInvoiceAmountSearch = (vm.invoiceAmountSearchType === vm.CheckSearchTypeList[0].id);

        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        setFilteredLabels(true);
        vm.cgBusyLoading = SupplierInvoiceFactory.retrieveSupplierInvoicePayments().query(vm.pagingInfo).$promise.then((invoicePayment) => {
          if (invoicePayment && invoicePayment.data) {
            setDataAfterGetAPICall(invoicePayment, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = SupplierInvoiceFactory.retrieveSupplierInvoicePayments().query(vm.pagingInfo).$promise.then((invoicePayment) => {
          if (invoicePayment && invoicePayment.data) {
            setDataAfterGetAPICall(invoicePayment, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.updateRecord = (row, ev) => BaseService.goToSupplierPaymentDetail(row.entity.id);

      vm.viewInvoiceDetails = (row, ev) => {
        const PopupData = {
          packingSlipData: {
            paymentId: row.entity.id,
            fromPaymentHistory: true,
            viewOnly: true
          },
          supplierDet: {
            supplierCode: row.entity.supplier,
            mfgCodeID: row.entity.mfgcodeID
          },
          skipFocusOnFirstElement: true
        };

        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
          ev,
          PopupData).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.paymentHistory = (row, ev) => {
        row.entity.refPaymentMode = angular.copy(CORE.RefPaymentModeForInvoicePayment.Payable);
        DialogFactory.dialogService(
          CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER,
          CORE.SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW,
          ev,
          row.entity).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.lockUnlockCustomerPayment = (item) => {
        item.isDisabledLockUnlockBtn = true;
        vm.lockUnlockPayment(item, item.lockStatus !== vm.SupplierPaymentLockStatus.Locked.id ? false : true);
      };

      vm.lockUnlockPayment = (item, isLockRecord) => {
        var selectedIds = [];
        if (!vm.allowToLockSupplierPaymentFeature) {
          if (item) {
            item.isDisabledLockUnlockBtn = false;
          }
          return;
        }
        vm.isDisabledLockBtn = !item && !isLockRecord;
        vm.isDisabledUnlockBtn = !item && isLockRecord;
        if (isLockRecord) {
          // going to unlock record
          if (item) {
            if (item.lockStatus !== vm.SupplierPaymentLockStatus.Locked.id) {
              item.isDisabledLockUnlockBtn = false;
              return DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PAYMENT_REFUND_TRANSACTION_IS_ALREADY_UNLOCKED
              });
            }
            selectedIds.push(item.id);
          } else {
            if (!(vm.selectedRowsList && vm.selectedRowsList.length > 0)) {
              vm.isDisabledUnlockBtn = false;
              return;
            }
            const inValidRecords = _.find(vm.selectedRowsList, (a) => a.lockStatus !== vm.SupplierPaymentLockStatus.Locked.id);
            if (inValidRecords) {
              vm.isDisabledUnlockBtn = false;
              return DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PAYMENT_REFUND_TRANSACTION_IS_ALREADY_UNLOCKED
              });
            }
            selectedIds = vm.selectedRowsList.map((item) => item.id);
          }
        } else {
          // going to lock record
          if (item) {
            if (item.lockStatus !== vm.SupplierPaymentLockStatus.ReadyToLock.id) {
              item.isDisabledLockUnlockBtn = false;
              DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
              });
              return;
            }
            selectedIds.push(item.id);
          } else {
            if (!(vm.selectedRowsList && vm.selectedRowsList.length > 0)) {
              vm.isDisabledLockBtn = false;
              return;
            }
            const inValidRecords = _.find(vm.selectedRowsList, (a) => a.lockStatus !== vm.SupplierPaymentLockStatus.ReadyToLock.id);
            if (inValidRecords) {
              vm.isDisabledLockBtn = false;
              DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
              });
              return;
            }
            selectedIds = vm.selectedRowsList.map((item) => item.id);
          }
        }
        /*if no record selected then return*/
        if (!selectedIds || selectedIds.length === 0) {
          if (item) {
            item.isDisabledLockUnlockBtn = false;
          } else {
            vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
          }
          return;
        }
        const obj = {
          messageContent: isLockRecord ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNLOCK_RECORD_CONFIRMATION : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOCK_RECORD_CONFIRMATION,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.cgBusyLoading = PackingSlipFactory.lockTransaction().query({
            receiptType: 'SUPPLIER_PAYMENT_LOCK',
            ids: selectedIds,
            isLockRecord
          }).$promise.then((response) => {
            if (item) {
              item.isDisabledLockUnlockBtn = false;
            } else {
              vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
            }
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.loadData();
            }
          }).catch((error) => {
            if (item) {
              item.isDisabledLockUnlockBtn = false;
            } else {
              vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
            }
            BaseService.getErrorLog(error);
          });
        }, () => {
          if (item) {
            item.isDisabledLockUnlockBtn = false;
          } else {
            vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
          }
        });
      };

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
            }, () => {
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      //vm.changeReasonHistory = (row, ev) => {
      //  const headerData = [{
      //    label: vm.LabelConstant.MFG.Supplier,
      //    value: row.entity.supplier,
      //    displayOrder: 1,
      //    labelLinkFn: () => {
      //      BaseService.goToSupplierList();
      //    },
      //    valueLinkFn: () => {
      //      BaseService.goToSupplierDetail(row.entity.mfgcodeID);
      //    }
      //  },
      //  {
      //    label: vm.LabelConstant.Bank.BankAccountCode,
      //    value: row.entity.bankAccountNo,
      //    displayOrder: 2,
      //    labelLinkFn: () => {
      //      BaseService.goToBankList();
      //    },
      //    valueLinkFn: vm.updateBank,
      //    valueLinkFnParams: { bankAccountMasID: row.entity.bankAccountMasID }
      //  },
      //  {
      //    label: vm.LabelConstant.Bank.PaymentDate,
      //    value: $filter('date')(row.entity.paymentDate, vm.DefaultDateFormat),
      //    displayOrder: 3
      //  }];
      //  const PopupData = {
      //    refID: row.entity.id,
      //    confirmationType: CORE.Generic_Confirmation_Type.SUPPLIER_INVOICE_PAYMENT_VOID,
      //    refTableName: CORE.TABLE_NAME.PACKINGSLIP_INVOICE_PAYMENT,
      //    title: 'Change Reason History',
      //    headerData: headerData,
      //    EmptyMesssage: TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_INVOICE_REASON_HISTORY
      //  };
      //  DialogFactory.dialogService(
      //    CORE.SHOW_GENERIC_CONFIRMATION_CONTROLLER,
      //    CORE.SHOW_GENERIC_CONFIRMATION_VIEW,
      //    ev,
      //    PopupData).then(() => {
      //    }, () => {
      //    }, (err) => BaseService.getErrorLog(err));
      //};

      vm.showRemark = (row, ev, isShowVoidReason) => {
        const headerData = [{
          label: vm.LabelConstant.MFG.Supplier,
          value: row.entity.supplier,
          displayOrder: 1,
          labelLinkFn: () => {
            BaseService.goToSupplierList();
          },
          valueLinkFn: () => {
            BaseService.goToSupplierDetail(row.entity.mfgcodeID);
          }
        },
        {
          label: vm.LabelConstant.Bank.BankAccountCode,
          value: row.entity.bankAccountNo,
          displayOrder: 2,
          labelLinkFn: () => {
            BaseService.goToBankList();
          },
          valueLinkFn: vm.updateBank,
          valueLinkFnParams: { bankAccountMasID: row.entity.bankAccountMasID }
        },
        {
          label: vm.LabelConstant.Bank.PaymentDate,
          value: $filter('date')(row.entity.paymentDate, vm.DefaultDateFormat),
          displayOrder: 3
        }];
        const PopupData = {
          title: isShowVoidReason ? 'Void Payment Reason' : 'Comment',
          description: isShowVoidReason ? row.entity.voidPaymentReason : row.entity.remark,
          headerData: headerData
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          PopupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.printCheck = (row, ev, isRemittanceReport) => {
        if (!row || !row.entity || !row.entity.id) {
          return;
        }
        if ((!isRemittanceReport || isRemittanceReport === false) && (!row.entity.paymentAmount || row.entity.paymentAmount === 0)) {
          const alertModel = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.IN_CASE_OF_ZERO_PAYMENT_CHECK_PRINT_NOT_REQUIRED
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const isDownload = false;
        if (isRemittanceReport) {
          row.entity.isPrintRemittDisabled = true;
        } else {
          row.entity.isPrintLoader = true;
        }
        const paramObj = {
          paymentId: row.entity.id,
          isRemittanceReport: isRemittanceReport ? isRemittanceReport : false,
          reportAPI: 'PackingSlip/checkPrintAndRemittanceReport'
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

      vm.printRemittance = (row, ev) => vm.printCheck(row, ev, true);

      vm.resetFilters = (isReset) => {
        vm.filter = {
          supplier: [],
          paymentMethod: [],
          bankAccountCode: [],
          paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
          paymentNumber: null,
          paymentAmountSearchType: vm.CheckSearchTypeList[1].id,
          invoiceNumber: null,
          amount: null,
          fromDate: null,
          toDate: null
        };
        vm.invoiceAmount = null;
        vm.invoiceAmountSearchType = vm.CheckSearchTypeList[1].id;
        vm.isLocked = false;
        vm.selectedDateType = vm.dateTypeList[4].key;
        vm.isReadyToLock = isReset ? true : false;
        vm.paymentComments = null;
        vm.resetDateFilter();
        vm.clearSupplierSearchText();
        vm.clearPaymentMethodSearchText();
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      };

      vm.voidPaymentAndReleaseInvoiceGroup = (row, event) => {
        const loginUser = BaseService.loginUser;
        const invoicePaymentChange = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Void ' + CORE.PageName.SupplierInvoicePayment,
          confirmationType: CORE.Generic_Confirmation_Type.SUPPLIER_INVOICE_PAYMENT_VOID,
          isOnlyPassword: true,
          createdBy: loginUser.userid,
          updatedBy: loginUser.userid
        };
        return DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          event,
          invoicePaymentChange).then((pswConfirmation) => {
            if (pswConfirmation) {
              const objData = {
                id: row.entity.id,
                isPaymentVoided: true,
                voidPaymentReason: pswConfirmation.approvalReason,
                refPaymentModeOfInvPayment: CORE.RefPaymentModeForInvoicePayment.Payable
              };
              vm.cgBusyLoading = PackingSlipFactory.voidSupplierInvoicePayment().query(objData).$promise.then((response) => {
                if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.loadData();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.voidAndReIssuePayment = (row, event) => {
        const PopupData = {
          packingSlipData: {
            paymentId: row.entity.id,
            isVoidAndReIssuePayment: true,
            refVoidPaymentOrCheckNumber: row.entity.paymentNumber
          },
          supplierDet: {
            supplierCode: row.entity.supplier,
            mfgCodeID: row.entity.mfgcodeID
          }
        };

        DialogFactory.dialogService(
          TRANSACTION.PAID_VERIFICATION_PACKAGING_CONTROLLER,
          TRANSACTION.PAID_VERIFICATION_PACKAGING_VIEW,
          event,
          PopupData).then(() => {
          }, (resp) => {
            if (resp) {
              //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              vm.loadData();
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.searchSupplierList = () => {
        const supplierFilter = angular.copy(vm.supplierList);
        vm.supplierListToDisplay = vm.supplierSearchText ? _.filter(supplierFilter, (item) => item.mfgCodeName.toLowerCase().contains(vm.supplierSearchText.toLowerCase())) : supplierFilter;
      };

      vm.searchPaymentMethodList = () => {
        const paymentMethodFilter = angular.copy(vm.paymentMethodList);
        vm.paymentMethodListToDisplay = vm.paymentMethodSearchText ? _.filter(paymentMethodFilter, (item) => item.gencCategoryName.toLowerCase().contains(vm.paymentMethodSearchText.toLowerCase())) : paymentMethodFilter;
      };

      vm.searchBankAccountCodeList = () => {
        const bankAccountCodeFilter = angular.copy(vm.bankAccountCodeList);
        vm.bankAccountCodeListToDisplay = vm.bankAccountCodeSearchText ? _.filter(bankAccountCodeFilter, (item) => item.accountCode.toLowerCase().contains(vm.bankAccountCodeSearchText.toLowerCase())) : bankAccountCodeFilter;
      };

      /* to get/apply class for Supplier transaction lock status */
      vm.getSupplierTransactionLockStatusClassName = (lockStatus) => BaseService.getCustPaymentLockStatusClassName(lockStatus);

      $scope.$on(USER.SupplierInvoicePaymentHistoryRefreshBroadcast, () => vm.loadData());

      vm.clearSupplierSearchText = () => {
        vm.supplierSearchText = null;
        vm.searchSupplierList();
      };

      vm.clearPaymentMethodSearchText = () => {
        vm.paymentMethodSearchText = null;
        vm.searchPaymentMethodList();
      };

      vm.clearBankAccountCodeSearchText = () => {
        vm.bankAccountCodeSearchText = null;
        vm.searchBankAccountCodeList();
      };

      vm.clearSupplierFilter = () => {
        vm.filter.supplier = [];
      };

      vm.clearPaymentMethodFilter = () => {
        vm.filter.paymentMethod = [];
      };

      vm.clearBankAccountCodeFilter = () => {
        vm.filter.bankAccountCode = [];
      };

      vm.goToSupplierDetail = (row) => BaseService.goToSupplierDetail(row.mfgcodeID);
      vm.goToSupplierList = () => BaseService.goToSupplierList();
      vm.goToPaymentMethod = () => BaseService.goToGenericCategoryPayablePaymentMethodList();
      vm.goToPaymentMethodDetail = (row) => BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: row.paymentType });
      vm.goToBankList = () => BaseService.goToBankList();
    }
  }
})();
