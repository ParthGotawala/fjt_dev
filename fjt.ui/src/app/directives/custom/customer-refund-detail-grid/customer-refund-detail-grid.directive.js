(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('customerRefundDetailGrid', customerRefundDetailGrid);

  /** @ngInject */
  function customerRefundDetailGrid(BaseService, $timeout, $q, CORE, USER, MasterFactory, TRANSACTION, CustomerRefundFactory,
    DialogFactory, $filter, GenericCategoryFactory, BankFactory, TransactionModesFactory, $location, ReportMasterFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        /* directive is for >> Customer Refund Details List*/
        pRecvRefundRefPaymentMode: '='
      },
      templateUrl: 'app/directives/custom/customer-refund-detail-grid/customer-refund-detail-grid.html',
      controller: customerRefundDetailGridCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function customerRefundDetailGridCtrl($scope) {
      const vm = this;
      vm.pRecvRefundRefPaymentMode = $scope.pRecvRefundRefPaymentMode;
      vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
      vm.isHideDelete = true;
      vm.isUpdatable = vm.isPaymentHistory = vm.isPrintRemittance = vm.isPrintCheck = true;
      vm.historyActionButtonText = 'Refund History';
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
      vm.paramSearchObj = angular.copy($location.search());

      if (vm.paramSearchObj && vm.paramSearchObj.paymentMstID) {
        vm.paramSearchObj.paymentMstID = vm.paramSearchObj.paymentMstID ? parseInt(vm.paramSearchObj.paymentMstID) : null;
      }

      vm.dateOption = {
        fromDateOpenFlag: false,
        toDateOpenFlag: false
      };
      vm.dateCMPaymentOption = {
        fromDateCMPaymentOpenFlag: false,
        toDateCMPaymentOpenFlag: false
      };

      vm.filter = {
        customer: [],
        paymentMethod: [],
        bankAccountCode: [],
        transactionMode: [],
        paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
        paymentNumber: vm.paramSearchObj ? vm.paramSearchObj.paymentNumber : null,
        paymentCMNumber: null,
        amount: null,
        refundAmountSearchType: vm.CheckSearchTypeList[1].id,
        fromDate: null,
        toDate: null,
        isIncludeVoidedTransaction: false
      };

      // set default display tab
      if (vm.pRecvRefundRefPaymentMode === vm.receivableRefPaymentModeConst.Refund.code) {
        // vm.isViewPaymentCMDetails = true;
        vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_REFUND;

        vm.payCheckNumSHColNm = 'Payment# or Check#';
        vm.payCheckNumSHColWidth = '230';
        vm.payAmountSHColNm = 'Refund Amount ($)';
        vm.payAmountSHColWidth = '165';
        vm.paymentDateSHColNm = 'Refund Date';
        vm.paymentCMDateSHColNm = 'CM Date or Payment Date';
        vm.paymentDateSHColWidth = '100';
        vm.gridActionViewSHColWidth = '90';
        vm.paymentMethodSHColWidth = '200';
        vm.voidPaymentReasonSHColNm = 'Void Refund Reason';
      }

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

      // from Date for Payment Date
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

      // from date for Credit memo date
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
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Customer Refund Details.csv',
        hideMultiDeleteButton: true,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerRefundFactory.retrieveCustomerRefundsDetailList().query(pagingInfoOld).$promise.then((respOfRefundData) => {
            if (respOfRefundData && respOfRefundData.data && respOfRefundData.data.refundDetails) {
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
            case vm.custRefundAdvanceFiltersConst.PaymentOrCheckNumber.value:
              vm.filter.paymentNumber = null;
              break;
            case vm.custRefundAdvanceFiltersConst.RefundDate.value:
              vm.filter.fromDate = null;
              vm.filter.toDate = null;
              break;
            case vm.custRefundAdvanceFiltersConst.paymentCMNumber.value:
              vm.filter.paymentCMNumber = null;
              break;
            case vm.custRefundAdvanceFiltersConst.RefundAmount.value:
              vm.filter.amount = null;
              break;
            case vm.custRefundAdvanceFiltersConst.CMPaymentDate.value:
              vm.filter.fromCMPaymentDate = null;
              vm.filter.toCMPaymentDate = null;
              break;
            case vm.custRefundAdvanceFiltersConst.TransactionMode.value:
              vm.filter.transactionMode = [];
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
          field: 'modeName',
          displayName: 'Transaction Mode',
          width: 155,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToTransactionModeDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text ng-if="row.entity.modeName" label="\'Transaction Mode\'" text="row.entity.modeName"></copy-text>\
                        </div>',
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
          field: 'totalRefundIssuedAmount',
          displayName: 'Refund Issued Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: 150,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentAmountForPaymentCM',
          displayName: 'Refund Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: vm.payAmountSHColWidth,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'refundDate',
          displayName: 'Refund Date',
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
          field: 'paymentCMNumber',
          displayName: 'CM# or Payment#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline" \
                                                ng-if="row.entity.paymentCMNumber" \
                                                ng-click="grid.appScope.$parent.vm.goToPaymentCreditMemoDetails(row.entity.paymentCMMstID, row.entity.refGencTransModeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                                <copy-text label="grid.appScope.$parent.vm.payCheckNumSHColNm" text="row.entity.paymentCMNumber" ng-if="row.entity.paymentCMNumber"></copy- text >\
                                                </div> ',
          width: vm.payCheckNumSHColWidth,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'paymentCMAmount',
          displayName: 'CM# or Payment# Org. Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: vm.payAmountSHColWidth,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'paymentCMDate',
          displayName: 'CM# or Payment# Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: vm.paymentDateSHColWidth,
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        },
        {
          field: 'commentForPaymentCM',
          displayName: 'Reason',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.commentForPaymentCM" ng-click="grid.appScope.$parent.vm.showComment(row, $event, false)"> \
                                        View \
                                    </md-button>',
          enableFiltering: false,
          enableSorting: false,
          width: '120'
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
            item.refundDate = BaseService.getUIFormatedDate(item.refundDate, vm.DefaultDateFormat);
            item.paymentCMDate = BaseService.getUIFormatedDate(item.paymentCMDate, vm.DefaultDateFormat);
            item.isDisablePrintCheck = ((item.paymentMethod !== TRANSACTION.PayablePaymentMethodGenericCategory.Check.gencCategoryName) || (item.isPaymentVoided === 1)) ? true : false;
          });

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
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.customerIDs || vm.pagingInfo.paymentMethodIDs || vm.pagingInfo.bankAccountCodeIDs || vm.pagingInfo.transactionModeIDs || vm.pagingInfo.paymentNumber || vm.pagingInfo.paymentCMNumber || vm.pagingInfo.amount || vm.pagingInfo.fromDate || vm.pagingInfo.fromCMPaymentDate || vm.pagingInfo.toCMPaymentDate || vm.pagingInfo.toDate) {
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

      /* retrieve customer refund list */
      vm.loadData = () => {
        vm.pagingInfo.refPaymentMstID = vm.paramSearchObj ? vm.paramSearchObj.paymentMstID : null;
        vm.pagingInfo.customerIDs = vm.filter.customer.join(',');
        vm.pagingInfo.paymentMethodIDs = vm.filter.paymentMethod.join(',');
        vm.pagingInfo.bankAccountCodeIDs = vm.filter.bankAccountCode.join(',');
        vm.pagingInfo.transactionModeIDs = vm.filter.transactionMode.join(',');

        vm.pagingInfo.exactPaymentNumberSearch = (vm.filter.paymentNumberSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.paymentNumber = vm.filter.paymentNumber;

        vm.pagingInfo.exactRefundAmountSearch = (vm.filter.refundAmountSearchType === vm.CheckSearchTypeList[0].id);
        vm.pagingInfo.amount = vm.filter.amount;

        vm.pagingInfo.paymentCMNumber = vm.filter.paymentCMNumber;
        vm.pagingInfo.fromDate = (BaseService.getAPIFormatedDate(vm.filter.fromDate));
        vm.pagingInfo.toDate = (BaseService.getAPIFormatedDate(vm.filter.toDate));

        vm.pagingInfo.fromCMPaymentDate = (BaseService.getAPIFormatedDate(vm.filter.fromCMPaymentDate));
        vm.pagingInfo.toCMPaymentDate = (BaseService.getAPIFormatedDate(vm.filter.toCMPaymentDate));

        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        setFilteredLabels();
        vm.cgBusyLoading = CustomerRefundFactory.retrieveCustomerRefundsDetailList().query(vm.pagingInfo).$promise.then((refundDetails) => {
          if (refundDetails && refundDetails.data) {
            setDataAfterGetAPICall(refundDetails, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerRefundFactory.retrieveCustomerRefundsDetailList().query(vm.pagingInfo).$promise.then((refundDetails) => {
          if (refundDetails && refundDetails.data) {
            setDataAfterGetAPICall(refundDetails, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.showComment = (row, ev) => {
        const PopupData = {
          title: 'Reason',
          description: row.entity.commentForPaymentCM
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
        vm.paramSearchObj = null;
        vm.filter = {
          customer: [],
          paymentMethod: [],
          bankAccountCode: [],
          transactionMode: [],
          paymentNumberSearchType: vm.CheckSearchTypeList[1].id,
          paymentNumber: null,
          paymentCMNumber: null,
          amount: null,
          fromDate: null,
          toDate: null,
          fromCMPaymentDate: null,
          toCMPaymentDate: null,
          refundAmountSearchType: vm.CheckSearchTypeList[1].id
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

      vm.searchTransactionModeList = () => {
        const transactionModeFilter = angular.copy(vm.transactionModeList);
        vm.transactionModeToDisplay = vm.transactionModeSearchText ? _.filter(transactionModeFilter, (item) => item.modeName.toLowerCase().contains(vm.transactionModeSearchText.toLowerCase())) : transactionModeFilter;
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

      vm.clearCustomerFilter = () => {
        vm.filter.customer = [];
      };

      vm.clearPaymentMethodFilter = () => {
        vm.filter.paymentMethod = [];
      };

      vm.clearBankAccountCodeFilter = () => {
        vm.filter.bankAccountCode = [];
      };

      vm.updateRecord = (row, ev) => {
        BaseService.goToCustomerRefundDetail(row.entity.id);
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

      vm.clearTransactionModeFilter = () => {
        vm.filter.transactionMode = [];
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

      /* to go at customer Payment detail or credit memo details page */
      vm.goToPaymentCreditMemoDetails = (custPaymentMstID, refTransModeID) => {
        if (refTransModeID && refTransModeID === CORE.GenericTransModeName.RefundPayablePayRefund.id) {
          BaseService.goToCustomerPaymentDetail(custPaymentMstID);
        } else if (refTransModeID && refTransModeID === CORE.GenericTransModeName.RefundPayableCMRefund.id) {
          BaseService.goToCustomerCreditMemoDetail(custPaymentMstID);
        }
      };

      /* to go at customer refund document page */
      vm.goToCustomerRefundDocument = (custPaymentMstID) => {
        BaseService.goToCustomerRefundDocument(custPaymentMstID);
      };

      /* to go at customer credit memo detail page */
      vm.goToCustCreditMemoDetail = (creditMemoMstID) => {
        BaseService.goToCustomerCreditMemoDetail(creditMemoMstID);
      };

      /* to get/apply class for customer refund status */
      vm.getCustRefundStatusClassName = (refundStatus) => BaseService.getCustRefundStatusClassName(refundStatus);

      /* called for min date validation */
      vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

      /* to go at customer refund detail page */
      vm.goToCustomerRefundDetail = (custRefundMstID) => {
        BaseService.goToCustomerRefundDetail(custRefundMstID);
      };
    }
  }
})();
