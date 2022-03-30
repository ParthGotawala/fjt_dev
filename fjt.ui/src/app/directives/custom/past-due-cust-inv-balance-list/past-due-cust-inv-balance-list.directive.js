(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('pastDueCustInvBalanceList', pastDueCustInvBalanceList);

  /** @ngInject */
  function pastDueCustInvBalanceList($filter, $timeout, CORE, TRANSACTION, BaseService, CustomerPackingSlipFactory, DialogFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
      },
      templateUrl: 'app/directives/custom/past-due-cust-inv-balance-list/past-due-cust-inv-balance-list.html',
      controller: pastDueCustInvBalanceListCtrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;
    /** @ngInject */
    function pastDueCustInvBalanceListCtrl() {
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
      const gridDynamicGroupColForAgedReceivableAsof = 'Aged Receivables Details (Invoiced Only)';
      vm.custInvoiceSubStatusListConst = CORE.CUSTINVOICE_SUBSTATUS;
      vm.custCMSubStatusListConst = CORE.CUSTCRNOTE_SUBSTATUS;
      vm.LabelConstant = CORE.LabelConstant;

      vm.agedReceivablesAsOfDateOptions = {
        appendToBody: true
      };
      vm.filter = {
        isIncludeZeroValueInvoices: false
      };

      const setDueDateAsOfDateAsCurr = () => {
        vm.dueDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat);
      };
      setDueDateAsOfDateAsCurr();

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
        exporterCsvFilename: 'Customer Aged Receivable Details.csv',
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 0;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return CustomerPackingSlipFactory.retrieveCustInvCurrBalanceAndPastDue().query(pagingInfoOld).$promise.then((respOfPMTData) => {
            if (respOfPMTData && respOfPMTData.data && respOfPMTData.data.balanceDueList) {
              return respOfPMTData.data.balanceDueList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // set footer total for UI grid amount column
      vm.getFooterInvTotalCount = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalInvCount)) || 0;
        return sum;
      };
      vm.getFooterUnInvTotalCount = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalUnInvCount)) || 0;
        return sum;
      };
      vm.getFooterDraftCMTotalCount = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalDraftCreditMemoCount)) || 0;
        return sum;
      };
      vm.getFooterPackingSlipTotalCount = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.packingSlipNotInvoicedCount)) || 0;
        return sum;
      };

      vm.getFooterCreditMemoAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalCreditMemoAmount)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterOutstandingAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterOutstandingAmountWithoutCreditMemoTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalOutStandingWithoutCreditMemo)) || 0;
        return $filter('amount')(sum);
      };
      vm.getFooterOutstandingNotInvoicedAmountTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalNotInvoicedAmount)) || 0;
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
      vm.getFooterAmountWithinTermsTotal = () => {
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalAmountWithinTerms)) || 0;
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
      vm.getFooterAmountOfAgedReceivablePercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalAmountOfAgedDueReceivable)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
      };
      vm.getFooterAmountWithinTermsPercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.totalAmountWithinTerms)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
      };
      vm.getFooter0To30AmountOfAgedReceivablePercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs0To30)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
      };
      vm.getFooter31To60AmountOfAgedReceivablePercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs31To60)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
      };
      vm.getFooter61To90AmountOfAgedReceivablePercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs61To90)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
      };
      vm.getFooter90To120AmountOfAgedReceivablePercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs91To120)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
      };
      vm.getFooter121PlusAmountOfAgedReceivablePercentage = () => {
        const totalAmountAfterCreditApplied = (_.sumBy(vm.sourceData, (data) => data.totalOutstandingAmount)) || 0;
        const sum = (_.sumBy(vm.sourceData, (data) => data.agedAmountAs121More)) || 0;
        const perc = ((sum * 100) / totalAmountAfterCreditApplied).toFixed(2);
        return isNaN(perc) ? 0 : perc;
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
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >Total:</div>',
          group: 'Customer'
        },
        {
          field: 'totalInvCount',
          displayName: 'Invoice Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
            <a ng-if="row.entity.totalInvCount" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.moveToInvoiceListPageWithFilter(row.entity);" tabindex="-1">{{COL_FIELD}}</a> \
            <span ng-if="!row.entity.totalInvCount">{{COL_FIELD}}</span></div> ',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right"><a ng-if="grid.appScope.$parent.vm.getFooterInvTotalCount() > 0"  class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(null, $event, null, \'isAllCustAllInvOnly\');" tabindex="-1">{{grid.appScope.$parent.vm.getFooterInvTotalCount()}}</a><span ng-if="grid.appScope.$parent.vm.getFooterInvTotalCount() == 0">0</span></div>',
          width: '100',
          group: 'Invoice Count'
        },
        {
          field: 'custCurrTermDays',
          displayName: 'Current Terms (Days)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '100',
          group: 'Curr. Terms',
          visible: false
        },
        {
          field: 'totalAmountOfAgedDueReceivable',
          displayName: 'Total Past Due ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.totalAmountOfAgedDueReceivable" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'TotPastDue\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.totalAmountOfAgedDueReceivable">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterAmountOfAgedReceivableTotal()}} <br/> {{grid.appScope.$parent.vm.getFooterAmountOfAgedReceivablePercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Total Past Due'
        },
        {
          field: 'totalAmountWithinTerms',
          displayName: 'Current (Amount Within Terms) ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.totalAmountWithinTerms" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'CurrAmtWithinTerms\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.totalAmountWithinTerms">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterAmountWithinTermsTotal()}} <br/> {{grid.appScope.$parent.vm.getFooterAmountWithinTermsPercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs0To30',
          displayName: '0-30',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.agedAmountAs0To30" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'0-30\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.agedAmountAs0To30">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter0To30AmountOfAgedReceivableTotal()}} <br/> {{grid.appScope.$parent.vm.getFooter0To30AmountOfAgedReceivablePercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs31To60',
          displayName: '31-60',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.agedAmountAs31To60" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'31-60\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.agedAmountAs31To60">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter31To60AmountOfAgedReceivableTotal()}} <br/> {{grid.appScope.$parent.vm.getFooter31To60AmountOfAgedReceivablePercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs61To90',
          displayName: '61-90',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.agedAmountAs61To90" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'61-90\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.agedAmountAs61To90">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter61To90AmountOfAgedReceivableTotal()}} <br/> {{grid.appScope.$parent.vm.getFooter61To90AmountOfAgedReceivablePercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs91To120',
          displayName: '91-120',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.agedAmountAs91To120" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'91-120\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.agedAmountAs91To120">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter90To120AmountOfAgedReceivableTotal()}} <br/> {{grid.appScope.$parent.vm.getFooter90To120AmountOfAgedReceivablePercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'agedAmountAs121More',
          displayName: '120+',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a ng-if="row.entity.agedAmountAs121More" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(row.entity, $event, \'120+\', null);" tabindex="-1">{{COL_FIELD | amount}}</a><span ng-if="!row.entity.agedAmountAs121More">{{COL_FIELD | amount}}</span></div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooter121PlusAmountOfAgedReceivableTotal()}} <br/> {{grid.appScope.$parent.vm.getFooter121PlusAmountOfAgedReceivablePercentage()}}%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: gridDynamicGroupColForAgedReceivableAsof,
          groupNameToApplyDynamic: gridDynamicGroupColForAgedReceivableAsof
        },
        {
          field: 'totalOutstandingAmount',
          displayName: 'Outstanding Bal.(Invoiced Only) ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '240',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterOutstandingAmountTotal()}} <br/> 100.00%</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Outstanding Bal. (Incl. Open Credits)'
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
          headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
            '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
            '<div class="ui-grid-cell-contents" col-index="renderIndex">Total Credit Amount ($)<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sum of Credit Memo Amount ($) and Unapplied Amount ($)</md-tooltip></span>' +
            '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
            '&nbsp;' +
            '</span>' +
            '</div>' +
            '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
            '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
            '</div>' +
            '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
            '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
            '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
            '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
            '</div>' +
            '</div>' +
            '</div>',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '130',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterCreditAmountTotal()}}</div>',
          group: 'Credit Amount'
        },
        {
          field: 'totalOutStandingWithoutCreditMemo',
          displayName: 'Invoiced',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterOutstandingAmountWithoutCreditMemoTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Outstanding Bal. (Excl. Open Credits)'
        },
        {
          field: 'totalNotInvoicedAmount',
          displayName: 'Not Invoiced',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
            '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
            '<div class="ui-grid-cell-contents" col-index="renderIndex">Not Invoiced<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Draft, Published and Shipped-Not Invoiced Invoice</md-tooltip></span>' +
            '<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">' +
            '&nbsp;' +
            '</span>' +
            '</div>' +
            '<div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)">' +
            '<i class="ui-grid-icon-angle-down">&nbsp;</i>' +
            '</div>' +
            '<div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
            '<input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" />' +
            '<div class="margin-top-4 ui-grid-filter-button" ng-click="colFilter.term = null">' +
            '<i class="icon icon-close margin-right-0" ng-show="!!colFilter.term">&nbsp;</i>' +
            '</div>' +
            '</div>' +
            '</div>',
          width: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterOutstandingNotInvoicedAmountTotal()}}</div>',
          enableFiltering: true,
          enableSorting: true,
          group: 'Outstanding Bal. (Excl. Open Credits)'
        },
        {
          field: 'totalUnInvCount',
          displayName: 'Uninvoiced Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
            <a ng-if="row.entity.totalUnInvCount" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.moveToInvListWithUnInvCnt(row.entity);" tabindex="-1">{{COL_FIELD}}</a> \
            <span ng-if="!row.entity.totalUnInvCount">{{COL_FIELD}}</span></div>',
          width: '115',
          enableFiltering: true,
          enableSorting: true,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right"><a ng-if="grid.appScope.$parent.vm.getFooterUnInvTotalCount() > 0"  class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(null, $event, null, \'isAllCustAllUninvOnly\');" tabindex="-1">{{grid.appScope.$parent.vm.getFooterUnInvTotalCount()}}</a><span ng-if="grid.appScope.$parent.vm.getFooterUnInvTotalCount() == 0">0</span></div>',
          group: 'Uninvoiced Count'
        },
        {
          field: 'totalDraftCreditMemoCount',
          displayName: 'Draft CM Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
            <a ng-if="row.entity.totalDraftCreditMemoCount" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.moveToCMListWithDraftCMCnt(row.entity);" tabindex="-1">{{COL_FIELD}}</a> \
            <span ng-if="!row.entity.totalDraftCreditMemoCount">{{COL_FIELD}}</span></div>',
          width: '100',
          enableFiltering: true,
          enableSorting: true,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right"><a ng-if="grid.appScope.$parent.vm.getFooterDraftCMTotalCount() > 0"  class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(null, $event, null, \'isAllCustAllDraftCMOnly\');" tabindex="-1">{{grid.appScope.$parent.vm.getFooterDraftCMTotalCount()}}</a><span ng-if="grid.appScope.$parent.vm.getFooterDraftCMTotalCount() == 0">0</span></div>',
          group: 'Uninvoiced Count'
        },
        {
          field: 'packingSlipNotInvoicedCount',
          displayName: 'Packing Slip Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
            <a ng-if="row.entity.packingSlipNotInvoicedCount" class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.moveToCustPackingSlipListSummForTotCnt(row.entity);" tabindex="-1">{{COL_FIELD}}</a> \
            <span ng-if="!row.entity.packingSlipNotInvoicedCount">{{COL_FIELD}}</span></div>',
          width: '115',
          enableFiltering: true,
          enableSorting: true,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right"><a ng-if="grid.appScope.$parent.vm.getFooterPackingSlipTotalCount() > 0"  class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.viewCustAgedRecvRangeDet(null, $event, null, \'isAllCustAllPSWithOutInv\');" tabindex="-1">{{grid.appScope.$parent.vm.getFooterPackingSlipTotalCount()}}</a><span ng-if="grid.appScope.$parent.vm.getFooterPackingSlipTotalCount() == 0">0</span></div>',
          group: 'Uninvoiced Count'
        }
      ];

      // to set filter date for getting defined data
      function calculateFilterDateBasedOnTermsDays() {
        vm.filterdDate = null;
        if (vm.dueDate) {
          const date = new Date(moment(vm.dueDate).add(vm.additionalDays || 0, 'days'));
          vm.filterdDate = $filter('date')(date, gridAgedRecvAsOfDateFormat);
        }
        else {
          const date = new Date(moment().add(vm.termsAndAboveDays || 0, 'days'));
          vm.filterdDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(date, gridAgedRecvAsOfDateFormat);
        }

        //const agedReceivableAmountColumn = _.filter(vm.sourceHeader, (item) => item.groupNameToApplyDynamic === gridDynamicGroupColForAgedReceivableAsof);
        //if (agedReceivableAmountColumn && agedReceivableAmountColumn.length > 0) {
        //  _.each(agedReceivableAmountColumn, (item) => {
        //    //item.group = gridDynamicGroupColForAgedReceivableAsof + (vm.filterdDate ? vm.filterdDate : '');
        //  });
        //}
      }

      // to load customer current balance and past due data
      vm.loadData = () => {
        //BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        if (!vm.dueDate) {
          setDueDateAsOfDateAsCurr();
        }
        vm.pagingInfo.dueDate = (BaseService.getAPIFormatedDate(vm.dueDate));
        vm.pagingInfo.requestType = vm.custInvPayAgedReceivableTabsConst.PastDue.requestType;
        vm.pagingInfo.additionalDays = vm.additionalDays;
        vm.pagingInfo.termsAndAboveDays = null;
        if (vm.isApplyDueDateFilters) {
          vm.pagingInfo.termsAndAboveDays = vm.termsAndAboveDays ? vm.termsAndAboveDays : 0;
        }
        vm.pagingInfo.isIncludeZeroValueInvoices = vm.filter.isIncludeZeroValueInvoices;

        // to set filter date for getting defined data
        calculateFilterDateBasedOnTermsDays();

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

      // called when we change aged Receivables As Of Date changed
      vm.agedReceivablesAsOfDateChanged = () => {
        vm.agedReceivablesAsOfDateOptions = {
          agedReceivablesAsOfDateOpenFlag: false
        };
        if (!vm.agedReceivablesAsOfDate) {
          vm.additionalDays = undefined;
        }
        vm.termsAndAboveDays = undefined;
      };

      // called when we change due date changed
      vm.dueDateChanged = () => {
        vm.dueDateOptions = {
          dueDateOpenFlag: false
        };
        if (!vm.dueDate) {
          vm.additionalDays = undefined;
        }
        vm.termsAndAboveDays = undefined;
      };

      vm.onChangeTermsAndAboveDays = () => {
        setDueDateAsOfDateAsCurr();
      };

      // to reset/clear all filters
      vm.resetAllFilters = () => {
        vm.filterdDate = null;
        vm.termsAndAboveDays = null;
        vm.additionalDays = null;
        vm.filter.isIncludeZeroValueInvoices = false;
        vm.dueDate = setDueDateAsOfDateAsCurr();
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        //vm.loadData();
      };

      /* open popup to display range details */
      vm.viewCustAgedRecvRangeDet = (entityData, ev, agedRecvAmtInRange, defindedKeyData) => {
        const data = {
          dueDate: vm.dueDate,
          additionalDays: vm.additionalDays,
          termsAndAboveDays: vm.termsAndAboveDays,
          isIncludeZeroValueInvoices: vm.filter.isIncludeZeroValueInvoices,
          customerID: entityData ? [entityData.customerID] : null,
          agedRecvAmtWithIn: agedRecvAmtInRange,
          isFooterColumnDetailData: !entityData && defindedKeyData ? true : false,
          rangeDetPopupTitle: 'Aged Receivables Detail Data',
          rangeDetPopupTag: null
        };
        if (!entityData && defindedKeyData) {
          data[defindedKeyData] = true;
          data.customerID = _.uniq(_.map(vm.sourceData, 'customerID'));
          // when footer column click for detail data records and if any search text in customer column (Invoice Count footer Field)
          if (vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length > 0) {
            const custSearchColDet = _.find(vm.pagingInfo.SearchColumns, (srhItem) => srhItem.ColumnName === 'customerCodeName');
            if (custSearchColDet && custSearchColDet.SearchString) {
              data.custGridSearchStr = custSearchColDet.SearchString;
            }
          }
        }

        // set range detail popup title
        if (agedRecvAmtInRange) {
          switch (agedRecvAmtInRange) {
            case 'TotPastDue':
              data.rangeDetPopupTitle = 'Total Past Due';
              data.rangeDetPopupTag = 'Total Past Due';
              break;
            case 'CurrAmtWithinTerms':
              data.rangeDetPopupTitle = 'Aged Receivables Details (Invoiced Only)';
              data.rangeDetPopupTag = 'Current (Amount Within Terms)';
              break;
            case '0-30':
              data.rangeDetPopupTitle = 'Aged Receivables Details (Invoiced Only)';
              data.rangeDetPopupTag = '0-30';
              break;
            case '31-60':
              data.rangeDetPopupTitle = 'Aged Receivables Details (Invoiced Only)';
              data.rangeDetPopupTag = '31-60';
              break;
            case '61-90':
              data.rangeDetPopupTitle = 'Aged Receivables Details (Invoiced Only)';
              data.rangeDetPopupTag = '61-90';
              break;
            case '91-120':
              data.rangeDetPopupTitle = 'Aged Receivables Details (Invoiced Only)';
              data.rangeDetPopupTag = '91-120';
              break;
            case '120+':
              data.rangeDetPopupTitle = 'Aged Receivables Details (Invoiced Only)';
              data.rangeDetPopupTag = '120+';
              break;
            default:
              break;
          }
        } else if (defindedKeyData) {
          switch (defindedKeyData) {
            case 'isAllCustAllInvOnly':
              data.rangeDetPopupTitle = 'Customer Invoice Details';
              data.rangeDetPopupTag = 'Invoiced Only';
              break;
            case 'isAllCustAllUninvOnly':
              data.rangeDetPopupTitle = 'Customer Invoice Details';
              data.rangeDetPopupTag = 'Uninvoiced';
              break;
            case 'isAllCustAllDraftCMOnly':
              data.rangeDetPopupTitle = 'Customer Credit Memo Details';
              data.rangeDetPopupTag = 'Draft Credit Memo';
              break;
            case 'isAllCustAllPSWithOutInv':
              data.rangeDetPopupTitle = 'Customer Packing Slip Details';
              data.rangeDetPopupTag = 'Uninvoiced Packing Slip';
              break;
          }
        }

        const headerData = [{
          label: 'Applied Filter',
          value: data.rangeDetPopupTag,
          displayOrder: 2
        }];
        if (entityData && entityData.customerID) {
          headerData.push({
            label: vm.LabelConstant.MFG.Customer,
            value: entityData.customerCodeName,
            displayOrder: 1,
            labelLinkFn: () => {
              BaseService.goToCustomerList();
            },
            valueLinkFn: () => {
              BaseService.goToCustomer(entityData.customerID);
            }
          });
        }
        data.headerData = headerData;

        DialogFactory.dialogService(
          TRANSACTION.VIEW_CUST_AGED_RECV_RANGE_DET_MODAL_CONTROLLER,
          TRANSACTION.VIEW_CUST_AGED_RECV_RANGE_DET_MODAL_VIEW,
          ev,
          data).then(() => { }, () => { }, (error) => BaseService.getErrorLog(error));
      };

      // to move at invoice list page with filter data
      vm.moveToInvoiceListPageWithFilter = (entityData) => {
        const searchData = {
          customerID: entityData.customerID,
          isIncludeZeroValueInv: vm.filter.isIncludeZeroValueInvoices,
          custInvSubStatusList: [vm.custInvoiceSubStatusListConst.INVOICED, vm.custInvoiceSubStatusListConst.CORRECTEDINVOICED]
        };
        BaseService.goToCustInvListWithTermsDueDateSearch(searchData);
      };

      // to move at customer invoice list page for uninvoice count filter data
      vm.moveToInvListWithUnInvCnt = (entityData) => {
        const searchData = {
          customerID: entityData.customerID,
          isIncludeZeroValueInv: vm.filter.isIncludeZeroValueInvoices,
          custInvSubStatusList: [vm.custInvoiceSubStatusListConst.SHIPPEDNOTINVOICED, vm.custInvoiceSubStatusListConst.DRAFT, vm.custInvoiceSubStatusListConst.PUBLISHED]
        };
        BaseService.goToCustInvListWithTermsDueDateSearch(searchData);
      };

      // to move at customer credit memo list page with draft substatus filter data
      vm.moveToCMListWithDraftCMCnt = (entityData) => {
        const searchData = {
          customerID: entityData.customerID,
          custCMSubStatusList: [vm.custCMSubStatusListConst.DRAFT]
        };
        BaseService.goToCustCMListWithTermsDueDateSearch(searchData);
      };

      // to move at customer packing slip list page
      vm.moveToCustPackingSlipListSummForTotCnt = (entityData) => {
        const searchData = {
          customerID: entityData.customerID
        };
        BaseService.loadAllCustPackingSlipListSummByCust(searchData);
      };

      // to move at customer details page
      vm.goToCustomerDetail = (row) => {
        BaseService.goToCustomer(row.customerID);
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
  }
})();
