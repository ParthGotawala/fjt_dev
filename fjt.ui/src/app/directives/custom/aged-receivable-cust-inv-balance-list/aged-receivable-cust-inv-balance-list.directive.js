(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('agedReceivableCustInvBalanceList', agedReceivableCustInvBalanceList);

  /** @ngInject */
  function agedReceivableCustInvBalanceList($filter, $timeout, CORE, TRANSACTION, BaseService, CustomerPackingSlipFactory, $interval) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
      },
      templateUrl: 'app/directives/custom/aged-receivable-cust-inv-balance-list/aged-receivable-cust-inv-balance-list.html',
      controller: agedReceivableCustInvBalanceListCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function agedReceivableCustInvBalanceListCtrl($scope) {
      const vm = this;
      vm.isHideDelete = true;
      vm.isApplyDueDateFilters = true;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.gridConfig = CORE.gridConfig;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INV_CURR_BALANCE_AND_PAST_DUE;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.parentMultiColumnGroupHeader = [];
      vm.custInvPayAgedReceivableTabsConst = TRANSACTION.CustInvPayAgedReceivableTabs;
      const gridAgedRecvAsOfDateFormat = CORE.DateFormatArray[17].format;
      const gridDynamicGroupColForAgedReceivableAsof = 'Aged Receivable As of: ';
      vm.customerPaymentNotesConst = TRANSACTION.CustomerPaymentNotes;

      vm.agedReceivablesAsOfDateOptions = {
        agedReceivablesAsOfDateOpenFlag: false,
        appendToBody: true
      };
      vm.filter = {
        isIncludeZeroValueInvoices: false
      };

      const setAgedReceivableAsOfDateAsCurr = () => {
        vm.agedReceivablesAsOfDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat);
      };
      setAgedReceivableAsOfDateAsCurr();

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: 0,
          SortColumns: [],
          SearchColumns: []
        };
      };
      initPageInfo();

      vm.gridOptions = {
        showColumnFooter: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Customer Aged Receivable Details.csv'
      };

      // set footer total for UI grid amount column
      vm.getFooterCreditMemoAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalCreditMemoAmount)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterOutstandingAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterCreditAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalCreditAmount)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterAdjustmentPendingAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalAdjustmentPendingAmount)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterBalanceAfterTotCreditUsedTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.balanceAfterTotCreditUsed)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterAmountOfAgedReceivableTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalAmountOfAgedDueReceivable)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooter0To30AmountOfAgedReceivableTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs0To30)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooter31To60AmountOfAgedReceivableTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs31To60)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooter61To90AmountOfAgedReceivableTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs61To90)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooter90To120AmountOfAgedReceivableTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs91To120)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooter121PlusAmountOfAgedReceivableTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs121More)) || 0;
        return $filter('amount')(sum);
      };

      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          group: '#'
        },
        {
          field: 'customerCodeName',
          displayName: 'Customer',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomerDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Customer" text="row.entity.customerCodeName"></copy-text>\
                        </div>',
          width: '370',
          enableFiltering: true,
          enableSorting: true,
          group: 'Customer'
        },
        {
          field: 'totalInvCount',
          displayName: 'Invoice Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '100',
          group: 'Invoice Count'
        },
        {
          field: 'custCurrTermDays',
          displayName: 'Current Terms (Days)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '165',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >Total:</div>',
          group: 'Current Terms Days'
        },
        {
          field: 'totalCreditMemoAmount',
          displayName: 'Credit Memo Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterCreditMemoAmountTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Credit Amount'
        },
        {
          field: 'totalAdjustmentPendingAmount',
          displayName: 'Unapplied Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterAdjustmentPendingAmountTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Credit Amount'
        },
        {
          field: 'totalCreditAmount',
          displayName: 'Total Credit Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterCreditAmountTotal()}}</div>',
          group: 'Credit Amount'
        },
        {
          field: 'totalOutstandingAmount',
          displayName: 'Total Outstanding Amount ($) (Invoiced Only)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '220',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterOutstandingAmountTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Total Outstanding Amount'
        },
        {
          field: 'balanceAfterTotCreditUsed',
          displayName: 'Balance If Credit Used ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterBalanceAfterTotCreditUsedTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Balance If Credit Used'
        },
        {
          field: 'totalAmountOfAgedDueReceivable',
          displayName: 'Total Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '140',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterAmountOfAgedReceivableTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs0To30',
          displayName: '0-30',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '170',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter0To30AmountOfAgedReceivableTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs31To60',
          displayName: '31-60',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '170',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter31To60AmountOfAgedReceivableTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs61To90',
          displayName: '61-90',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '170',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter61To90AmountOfAgedReceivableTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs91To120',
          displayName: '91-120',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '170',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter90To120AmountOfAgedReceivableTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs121More',
          displayName: '120+',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '170',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter121PlusAmountOfAgedReceivableTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        }
      ];

      // to set filter date for getting defined data
      function calculateFilterDynamicDate() {
        vm.filterdDate = null;
        if (vm.agedReceivablesAsOfDate) {
          vm.filterdDate = $filter('date')(new Date(vm.agedReceivablesAsOfDate), gridAgedRecvAsOfDateFormat);
        }
        else {
          vm.filterdDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), gridAgedRecvAsOfDateFormat);
        }
        const agedReceivableAmountColumn = _.filter(vm.sourceHeader, (item) => item.groupNameToApplyDynamic === gridDynamicGroupColForAgedReceivableAsof);
        if (agedReceivableAmountColumn && agedReceivableAmountColumn.length > 0) {
          _.each(agedReceivableAmountColumn, (item) => {
            item.group = gridDynamicGroupColForAgedReceivableAsof + (vm.filterdDate ? vm.filterdDate : '');
          });
        }
      }

      // to load customer current balance and past due data
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        if (!vm.agedReceivablesAsOfDate) {
          setAgedReceivableAsOfDateAsCurr();
        }
        vm.pagingInfo.agedReceivablesDueAsOfDate = BaseService.getAPIFormatedDate(vm.agedReceivablesAsOfDate);
        vm.pagingInfo.requestType = vm.custInvPayAgedReceivableTabsConst.AgedReceivable.requestType;
        vm.pagingInfo.isIncludeZeroValueInvoices = vm.filter.isIncludeZeroValueInvoices;

        // to set filter date for getting defined data
        calculateFilterDynamicDate();

        vm.cgBusyLoading = CustomerPackingSlipFactory.retrieveCustInvCurrBalanceAndPastDue().query(vm.pagingInfo).$promise.then((respOfCustPayList) => {
          if (respOfCustPayList && respOfCustPayList.data) {
            setDataAfterGetAPICall(respOfCustPayList, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // on scroll or pagination get more data
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CustomerPackingSlipFactory.retrieveCustInvCurrBalanceAndPastDue().query(vm.pagingInfo).$promise.then((respOfCustPayList) => {
          if (respOfCustPayList && respOfCustPayList.data) {
            setDataAfterGetAPICall(respOfCustPayList, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (respOfCustPayList, isGetDataDown) => {
        if (respOfCustPayList && respOfCustPayList.data && respOfCustPayList.data.balanceDueList) {
          if (!isGetDataDown) {
            vm.sourceData = respOfCustPayList.data.balanceDueList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (respOfCustPayList.data.balanceDueList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(respOfCustPayList.data.balanceDueList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          _.map(vm.sourceData, (data) => {
            data.isDisabledDelete = true;
          });

          // must set after new data comes
          vm.totalSourceDataCount = respOfCustPayList.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0) {
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

      // to reset/clear all filters
      vm.resetAllFilters = () => {
        vm.filterdDate = null;
        vm.agedReceivablesAsOfDate = setAgedReceivableAsOfDateAsCurr();
        vm.filter.isIncludeZeroValueInvoices = false;
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        //vm.loadData();
      };

      // to move at customer details page
      vm.goToCustomerDetail = (row) => {
        BaseService.goToCustomer(row.customerID);
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();
