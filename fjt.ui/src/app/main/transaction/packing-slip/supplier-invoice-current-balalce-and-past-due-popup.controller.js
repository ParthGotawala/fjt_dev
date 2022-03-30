(function () {
  'use strict';

  angular
    .module('app.transaction.packingSlip')
    .controller('SupplierInvoiceCurrentBalanceAndPastDuePopup', SupplierInvoiceCurrentBalanceAndPastDuePopup);

  function SupplierInvoiceCurrentBalanceAndPastDuePopup($scope, $filter, $mdDialog, $timeout, CORE, TRANSACTION, BaseService, data, PackingSlipFactory) {
    const vm = this;
    vm.isHideDelete = true;
    vm.isApplyDueDateFilters = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.gridConfig = CORE.gridConfig;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_INVOICE_BALANCE_DUE;
    vm.SUPPLIER_INVOICE_BALANCE_DUE_DATE_FILTERS_TOOLTIP = CORE.SUPPLIER_INVOICE_BALANCE_DUE_DATE_FILTERS_TOOLTIP;
    vm.DefaultDateFormat = _dateDisplayFormat;
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: 0,
        SortColumns: [['totalBalanceAmount', 'DESC'], ['mfgCodeName', 'ASC']],
        SearchColumns: [],
        isCodeFirst: true
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
      exporterCsvFilename: 'SupplierCurrentBalanceAndPastDue.csv'
    };

    vm.getFooterCreditAmountTotal = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalCreditAmount)) || 0;
      return $filter('amount')(sum);
    };
    vm.getFooterTotalApprovedToPayBalanceAmount = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalApprovedToPayBalanceAmount)) || 0;
      return $filter('amount')(sum);
    };
    vm.getFooterTotalUnderInvestigateBalanceAmount = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalUnderInvestigateBalanceAmount)) || 0;
      return $filter('amount')(sum);
    };
    vm.getFooterBalanceAmountTotal = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalBalanceAmount)) || 0;
      return $filter('amount')(sum);
    };
    vm.getFooterTotalApprovedPastDueAmount = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalApprovedPastDueAmount)) || 0;
      return $filter('amount')(sum);
    };
    vm.getFooterTotalUnderInvestigatePastDueAmount = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalUnderInvestigatePastDueAmount)) || 0;
      return $filter('amount')(sum);
    };
    vm.getFooterPastDueAmountTotal = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.pastDueAmount)) || 0;
      return $filter('amount')(sum);
    };

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'mfgCodeName',
        displayName: 'Supplier',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSupplierDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Supplier" text="row.entity.mfgCodeName"></copy-text>\
                        </div>',
        width: '340',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >Total:</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'totalCreditAmount',
        displayName: 'Total CM+DM Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: '150',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterCreditAmountTotal()}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'totalApprovedToPayBalanceAmount',
        displayName: 'Approved To Pay Balance Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: '180',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotalApprovedToPayBalanceAmount()}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'totalUnderInvestigateBalanceAmount',
        displayName: 'Under Investigation Balance Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: '180',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotalUnderInvestigateBalanceAmount()}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'totalBalanceAmount',
        displayName: 'Total Balance Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: '180',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterBalanceAmountTotal()}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'totalApprovedPastDueAmount',
        displayName: 'Past Due Approved to Pay Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': row.entity.totalApprovedPastDueAmount}">{{COL_FIELD | amount}}</div>',
        width: '170',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotalApprovedPastDueAmount()}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'totalUnderInvestigatePastDueAmount',
        displayName: 'Past Due Under Investigation Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'grid-cell-text-danger\': row.entity.totalUnderInvestigatePastDueAmount}">{{COL_FIELD | amount}}</div>',
        width: '170',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotalUnderInvestigatePastDueAmount()}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'pastDueAmount',
        displayName: 'Total Past Due Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                          <a class="cursor-pointer underline"\
                              ng-class="{\'grid-cell-text-danger\': row.entity.pastDueAmount, \'cm-text-decoration\': !row.entity.pastDueAmount}"\
                              ng-click="grid.appScope.$parent.vm.goToSupplierInvoiceList(row.entity);"\
                              tabindex="-1">{{COL_FIELD | amount}}</a>\
                      </div>',
        width: '180',
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterPastDueAmountTotal()}}</div>',
        enableFiltering: true,
        enableSorting: true
      }
    ];

    function calculateFilterDateBasedOnTermsDays() {
      vm.filterdDate = null;
      if (vm.dueDate) {
        const date = new Date(moment(vm.dueDate).add(vm.additionalDays || 0, 'days'));
        vm.filterdDate = $filter('date')(date, vm.DefaultDateFormat);
      }
      else {
        const date = new Date(moment().add(vm.termsAndAboveDays || 0, 'days'));
        vm.filterdDate = $filter('date')(date, vm.DefaultDateFormat);
      }

      const pastDueAmountColumn = _.find(vm.sourceHeader, (item) => item.field === 'pastDueAmount');
      if (pastDueAmountColumn) {
        pastDueAmountColumn.displayName = 'Total Past Due Amount' + (vm.filterdDate ? (' as on ' + vm.filterdDate) : '');
      }
    }

    vm.loadData = () => {
      if (vm.dueDate) {
        vm.pagingInfo.dueDate = (BaseService.getAPIFormatedDate(vm.dueDate));
      }
      else {
        vm.pagingInfo.dueDate = null;
      }
      vm.pagingInfo.Page = 0;
      vm.pagingInfo.additionalDays = vm.additionalDays;
      vm.pagingInfo.termsAndAboveDays = null;
      if (vm.isApplyDueDateFilters) {
        vm.pagingInfo.termsAndAboveDays = vm.termsAndAboveDays ? vm.termsAndAboveDays : 0;
      }

      calculateFilterDateBasedOnTermsDays();

      vm.cgBusyLoading = PackingSlipFactory.retrieveSupplierPaymentBalanceAndPastDue().query(vm.pagingInfo).$promise.then((response) => {
        vm.sourceData = [];
        if (response.data) {
          vm.sourceData = response.data.balanceDueList;
          vm.totalSourceDataCount = response.data.Count;
        }

        _.map(vm.sourceData, (data) => {
            data.isDisabledDelete = true;
        });

        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }
        vm.gridOptions.clearSelectedRows();
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
          vm.resetSourceGrid();
          if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PackingSlipFactory.retrieveSupplierPaymentBalanceAndPastDue().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data && response.data.balanceDueList) {
          vm.sourceData = vm.sourceData.concat(response.data.balanceDueList);
          vm.totalSourceDataCount = response.data.Count;
          vm.currentdata = vm.sourceData.length;
          _.map(vm.sourceData, (data) => {
            data.isDisabledDelete = true;
          });
        }

        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.applyDueDateFiltersChange = () => {
      vm.dueDate = undefined;
      vm.additionalDays = undefined;
      vm.termsAndAboveDays = undefined;
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

    vm.goToSupplierDetail = (row) => {
      BaseService.goToSupplierDetail(row.mfgCodeID);
    };

    vm.goToSupplierInvoiceList = (row) => {
      const searchData = {
        mfgCodeID: row.mfgCodeID,
        termsAndAboveDays: row.filterTermsAndAboveDays,
        dueDate: row.filterDueDate,
        additionalDays: row.filterAdditionalDays
      };

      BaseService.goToSupplierInvoiceList(searchData);
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
        $mdDialog.cancel();
    };
  }
})();
