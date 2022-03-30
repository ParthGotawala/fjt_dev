(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('CustAgedRecvRangeDetPopupController', CustAgedRecvRangeDetPopupController);

  /** @ngInject */
  function CustAgedRecvRangeDetPopupController(data, $mdDialog, $timeout, CORE, TRANSACTION, BaseService, CustomerPackingSlipFactory, $filter) {
    const vm = this;
    vm.popupParamData = angular.copy(data);
    vm.isHideDelete = true;
    vm.gridConfig = CORE.gridConfig;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_INV_CURR_BALANCE_AND_PAST_DUE;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.transactionTypeConst = CORE.TRANSACTION_TYPE;
    vm.receivableRefPaymentModeConst = TRANSACTION.ReceivableRefPaymentMode;
    vm.LabelConstant = CORE.LabelConstant;

    const TransactionTypeList = [{
      ClassName: 'light-blue-bg',
      Code: 'I'
    },
    {
      ClassName: 'label-primary',
      Code: 'C'
    },
    {
      ClassName: 'light-green-bg',
      Code: 'R'
    },
    {
      ClassName: 'light-blue-bg',
      Code: 'P'
    }
    ];

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
      exporterCsvFilename: 'Customer Aged Receivable Detail Data.csv',
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 0;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return CustomerPackingSlipFactory.getCustAgedRecvRangeDetails().query(pagingInfoOld).$promise.then((respOfPMTData) => {
          if (respOfPMTData && respOfPMTData.data && respOfPMTData.data.balanceDueList) {
            return respOfPMTData.data.balanceDueList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getFooterCreditMemoAmountTotal = (field) => {
      const sum = (_.sumBy(vm.sourceData, (data) => data[field])) || 0;
      return $filter('amount')(sum);
    };

    vm.getFooterUnappliedAmountTotal = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalUnappliedAmount)) || 0;
      return $filter('amount')(sum);
    };

    vm.getFooterCreditAmountTotal = () => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.totalCreditAmount)) || 0;
      return $filter('amount')(sum);
    };

    vm.getFooterOutstandingAmountTotal = (field) => {
      const sum = (_.sumBy(vm.sourceData, (data) => data.transType !== vm.receivableRefPaymentModeConst.ReceivablePayment.code ? data[field] : 0)) || 0;
      return $filter('amount')(sum);
    };

    // when footer column click for detail data records and if any search text in customer column from prev popup (Invoice Count footer Field)
    if (vm.popupParamData.isFooterColumnDetailData && vm.popupParamData.custGridSearchStr) {
      vm.pagingInfo.SearchColumns.push({ ColumnName: 'customerCodeName', SearchString: vm.popupParamData.custGridSearchStr });
    }

    vm.sourceHeader = [{
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
      enableFiltering: false,
      enableSorting: false
    },
    {
      field: 'customerCodeName',
      displayName: 'Customer',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomerDetail(row.entity);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.MFG.Customer" text="row.entity.customerCodeName"></copy-text>\
                        </div>',
      width: '370',
      filter: {
        term: angular.copy(vm.popupParamData.custGridSearchStr) || null
      },
      enableFiltering: true,
      enableSorting: true
    },
    {
      field: 'transTypeText',
      displayName: 'Transaction Type',
      cellTemplate: '<div class="ui-grid-cell-contents">'
        + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getTransTypeClassName(row.entity.transType)"> '
        + '{{row.entity.transTypeText}}'
        + '</span>'
        + '</div> ',
      width: '180',
      enableSorting: true,
      enableFiltering: true
    }];

    // first display all invoice details
    if (!vm.popupParamData.isAllCustAllDraftCMOnly && !vm.popupParamData.isAllCustAllPSWithOutInv) {
      vm.sourceHeader.push(
        {
          field: 'transNumber',
          displayName: 'Invoice#',
          cellTemplate: '<span ng-if="row.entity.transType === grid.appScope.$parent.vm.transactionTypeConst.INVOICE">'
            + '<a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageCustomerInvoice(row.entity.transMstID);$event.preventDefault();">{{row.entity.transNumber}}</a> \
                          <copy-text ng-if="row.entity.transNumber"  label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber" text="row.entity.transNumber"> </copy-text>\
                          <md-tooltip ng-if="row.entity.transNumber">{{row.entity.transNumber}}</md-tooltip>'
            + '</span>',
          width: '140'
        },
        {
          field: 'DocDate',
          displayName: 'Invoice Date',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.transType === grid.appScope.$parent.vm.transactionTypeConst.INVOICE">{{COL_FIELD}}</div>',
          width: '90',
          type: 'date',
          enableFiltering: false
        },
        {
          field: 'termsDays',
          displayName: 'Terms Days',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '90'
        },
        {
          field: vm.popupParamData.isAllCustAllUninvOnly ? 'totalDraftAmount' : 'totalCustomerInvoicedAmount',
          displayName: 'Total Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{\'color- red\': COL_FIELD < 0}">{{COL_FIELD | amount}}</div>',
          width: '140'
        },
        {
          field: 'totalRecievedAmount',
          displayName: 'Received Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '145'
        },
        {
          field: vm.popupParamData.isAllCustAllUninvOnly ? 'totalDraftAmount' : 'totalOutstandingAmount',
          displayName: 'Open Balance ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.transType !== grid.appScope.$parent.vm.receivableRefPaymentModeConst.ReceivablePayment.code">{{COL_FIELD | amount}}</div>',
          width: '145',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterOutstandingAmountTotal(grid.appScope.$parent.vm.popupParamData.isAllCustAllUninvOnly ? \'totalDraftAmount\' : \'totalOutstandingAmount\')}}</div>',
          enableFiltering: true,
          enableSorting: true
        }
      );
    }

    // if specific customer then need to define all fields otherwise invoice fields
    if (vm.popupParamData.isAllCustAllDraftCMOnly) {
      vm.sourceHeader.push(
        {
          field: 'transNumber',
          displayName: 'Credit Memo#',
          cellTemplate: '<span ng-if="row.entity.transType === grid.appScope.$parent.vm.transactionTypeConst.CREDITNOTE">'
            + '<a tabindex="-1"  class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCustomerCreditMemoDetail(row.entity.transMstID);$event.preventDefault();">{{row.entity.transNumber}}</a>'
            + '<copy-text ng-if="row.entity.transNumber" label="grid.appScope.$parent.vm.CORE.LabelConstant.CustomerCreditMemo.CustomerCreditMemoNumer" text="row.entity.transNumber"> </copy-text>'
            + '<md-tooltip ng-if="row.entity.transNumber">{{row.entity.transNumber}}</md-tooltip>'
            + '</span>',
          width: '140'
        },
        {
          field: 'DocDate',
          displayName: 'Credit Memo Date',
          cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.transType === grid.appScope.$parent.vm.transactionTypeConst.CREDITNOTE">{{COL_FIELD}}</div>',
          width: '90',
          type: 'date',
          enableFiltering: false
        },
        {
          field: vm.popupParamData.isAllCustAllDraftCMOnly ? 'totalDraftAmount' : 'totalCreditMemoAmount',
          displayName: 'Unapplied Credit Memo Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterCreditMemoAmountTotal(grid.appScope.$parent.vm.popupParamData.isAllCustAllDraftCMOnly ? \'totalDraftAmount\' : \'totalCreditMemoAmount\')}}</div>',
          width: '140',
          enableFiltering: true,
          enableSorting: true
        }
      );
    }

    if (vm.popupParamData.agedRecvAmtWithIn) {
      vm.sourceHeader.push(
        {
          field: 'totalUnappliedAmount',
          displayName: 'Unapplied Payment Amount ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterUnappliedAmountTotal()}}</div>',
          width: '135',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'totalCreditAmount',
          displayName: 'Total Credit Amount ($)',
          headerCellTemplate: '<div ng-class="{ \'sortable\': sortable }">' +
            '<div class="ui-grid-vertical-bar">&nbsp;</div>' +
            '<div class="ui-grid-cell-contents" col-index="renderIndex">Total Credit Amount ($)<span class="icon-question-mark-circle help-icon">\
                            <md-tooltip md-direction="top">Sum of Unapplied Credit Memo Amount ($) and Unapplied Payment Amount ($)</md-tooltip></span>' +
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
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterCreditAmountTotal()}}</div>',
          width: '140'
        }
      );
    }

    if (!vm.popupParamData.isAllCustAllInvOnly && !vm.popupParamData.isAllCustAllUninvOnly && !vm.popupParamData.isAllCustAllDraftCMOnly && !vm.popupParamData.isAllCustAllPSWithOutInv) {
      vm.sourceHeader.push(
        {
          field: 'transNumber',
          displayName: 'Payment# or Check#',
          width: '200',
          cellTemplate: '<div ng-if="row.entity.transType === grid.appScope.$parent.vm.receivableRefPaymentModeConst.ReceivablePayment.code" class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerPaymentDetailPage(row.entity.transMstID);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text label="grid.appScope.$parent.vm.payCheckNumSHColNm" text="row.entity.paymentNumber" ></copy-text>\
                          </div> ',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'DocDate',
          displayName: 'Payment Date',
          cellTemplate: '<div ng-if="row.entity.transType === grid.appScope.$parent.vm.receivableRefPaymentModeConst.ReceivablePayment.code" class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: 90,
          enableFiltering: false,
          enableSorting: true,
          type: 'date'
        }
      );
    }

    if (vm.popupParamData.isAllCustAllPSWithOutInv) {
      vm.sourceHeader.push(
        {
          field: 'packingSlipNumber',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                       <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity.cpsMstID, row.entity.refSalesOrderID);$event.preventDefault();">{{row.entity.packingSlipNumber}}</a>\
                                        <copy-text label="\'Packing Slip#\'" text="row.entity.packingSlipNumber"></copy-text>\
                                    </div>',
          displayName: 'Packing Slip#',
          width: '180'
        },
        {
          field: 'packingSlipDate',
          displayName: 'Packing Slip Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        }
      );
    }

    // to load customer current balance and past due data
    vm.loadData = () => {
      //BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (!vm.popupParamData.dueDate) {
        vm.pagingInfo.dueDate = BaseService.getUIFormatedDateTimeInCompanyTimeZone(new Date(), vm.DefaultDateFormat);
      } else {
        vm.pagingInfo.dueDate = (BaseService.getAPIFormatedDate(vm.popupParamData.dueDate));
      }
      vm.pagingInfo.additionalDays = vm.popupParamData.additionalDays;
      vm.pagingInfo.termsAndAboveDays = null;
      vm.pagingInfo.termsAndAboveDays = vm.popupParamData.termsAndAboveDays || 0;
      vm.pagingInfo.isIncludeZeroValueInvoices = vm.popupParamData.isIncludeZeroValueInvoices;
      vm.pagingInfo.customerID = vm.popupParamData.customerID || null;
      vm.pagingInfo.agedRecvAmtWithIn = vm.popupParamData.agedRecvAmtWithIn || null;
      vm.pagingInfo.isAllCustAllInvOnly = vm.popupParamData.isAllCustAllInvOnly || false;
      vm.pagingInfo.isAllCustAllUninvOnly = vm.popupParamData.isAllCustAllUninvOnly || false;
      vm.pagingInfo.isAllCustAllDraftCMOnly = vm.popupParamData.isAllCustAllDraftCMOnly || false;
      vm.pagingInfo.isAllCustAllPSWithOutInv = vm.popupParamData.isAllCustAllPSWithOutInv || false;

      /* when footer column click for detail data records and if any search text in customer column from prev popup ,
       now user remove search text then we need to get all records (Invoice Count footer Field)  */
      if (vm.popupParamData.isFooterColumnDetailData && vm.popupParamData.custGridSearchStr) {
        if (vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length > 0) {
          const custSearchColDet = _.find(vm.pagingInfo.SearchColumns, (srhItem) => srhItem.ColumnName === 'customerCodeName');
          if (!custSearchColDet) {
            vm.pagingInfo.customerID = [];
          }
        } else {
          vm.pagingInfo.customerID = [];
        }
      }

      //// to set filter date for getting defined data
      //calculateFilterDateBasedOnTermsDays();

      vm.cgBusyLoading = CustomerPackingSlipFactory.getCustAgedRecvRangeDetails().query(vm.pagingInfo).$promise.then((respOfCustPayList) => {
        if (respOfCustPayList && respOfCustPayList.data) {
          setDataAfterGetAPICall(respOfCustPayList, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // on scroll or pagination get more data
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CustomerPackingSlipFactory.getCustAgedRecvRangeDetails().query(vm.pagingInfo).$promise.then((respOfCustPayList) => {
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
          data.DocDate = BaseService.getUIFormatedDate(data.DocDate, vm.DefaultDateFormat);
          data.packingSlipDate = BaseService.getUIFormatedDate(data.packingSlipDate, vm.DefaultDateFormat);
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

    vm.getTransTypeClassName = (transType) => {
      const status = _.find(TransactionTypeList, (item) => item.Code === transType);
      return status ? status.ClassName : '';
    };

    //go to manage customer invoice
    vm.goToManageCustomerInvoice = (id) => {
      BaseService.goToManageCustomerInvoice(id);
    };

    // go to customer credit memo
    vm.goToCustomerCreditMemoDetail = (id) => {
      BaseService.goToCustomerCreditMemoDetail(id);
    };

    // to go at customer payment detail page
    vm.goToCustomerPaymentDetailPage = (custPaymentMstID) => {
      BaseService.goToCustomerPaymentDetail(custPaymentMstID);
    };

    // to move at customer details page
    vm.goToCustomerDetail = (row) => {
      BaseService.goToCustomer(row.customerID);
    };

    /* to move at customer packing slip */
    vm.goToPackingSlip = (cpsMstID, refSalesOrderID) => {
      BaseService.goToManageCustomerPackingSlip(cpsMstID, refSalesOrderID || 0);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
