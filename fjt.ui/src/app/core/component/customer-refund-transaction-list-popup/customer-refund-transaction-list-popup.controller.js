(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CustomerRefundTransactionListPopupController', CustomerRefundTransactionListPopupController);

  /** @ngInject */
  function CustomerRefundTransactionListPopupController(TRANSACTION, $mdDialog, DialogFactory, data, BaseService, CORE, USER, $timeout, $filter, CustomerRefundFactory, uiGridGroupingConstants) {
    const vm = this;
    vm.isHideDelete = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_REFUND;
    vm.gridConfig = CORE.gridConfig;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.popupParamData = angular.copy(data) || {};
    vm.sourceHeader = [];
    const isEnablePagination = false; //(vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.GenericTransModeName = CORE.GenericTransModeName;
    vm.popupTitle = vm.popupParamData.isDisplayAllTransWhereCreditUsed ? 'Customer Credit Applied Details' : 'Customer Refund Details';

    let paymentNumberGHLbl, paymentAmountGHLbl, bankAccountCodeGHLbl, paymentDateGHLbl = null;
    if (vm.popupParamData.isDisplayAllTransWhereCreditUsed) {
      paymentNumberGHLbl = 'Payment# or Check# or Transaction#';
      paymentAmountGHLbl = 'Refund Amt or Appied CM Amt';
      bankAccountCodeGHLbl = 'Bank Account Code';
      paymentDateGHLbl = 'Applied Date';
    } else {
      paymentNumberGHLbl = 'Payment# or Check#';
      paymentAmountGHLbl = 'Refund Amount';
      bankAccountCodeGHLbl = 'Refund From (Bank Account Code)';
      paymentDateGHLbl = 'Refund Date';
    }

    vm.sourceHeader = [
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'modeName',
        displayName: 'Transaction Mode',
        width: 155,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >Total</div>'
      },
      {
        field: 'paymentNumber',
        displayName: paymentNumberGHLbl,
        width: 165,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerRefundDetail(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text ng-if="row.entity.paymentNumber" label="grid.appScope.$parent.paymentNumberGHLbl" text="row.entity.paymentNumber" ></copy-text>\
                          </div> ',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'paymentAmountForPaymentCM',
        displayName: paymentAmountGHLbl,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: 135,
        enableFiltering: true,
        enableSorting: true,
        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
        footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer grid-cell-text-right" >{{grid.appScope.$parent.vm.getRefundAmountSum()}}</div>'
      },
      {
        field: 'bankAccountNo',
        displayName: bankAccountCodeGHLbl,
        width: '190',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.bankAccountNo">\
                                            {{COL_FIELD}}\
                                        </div>',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'bankName',
        displayName: 'Bank Name',
        width: '135',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.bankName">\
                                            {{COL_FIELD}}\
                                        </div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'refundDate',
        displayName: paymentDateGHLbl,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 120,
        enableFiltering: false,
        enableSorting: true,
        type: 'date'
      },
      {
        field: 'paymentMethod',
        displayName: 'Payment Method',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.paymentMethod">\
                                            <a class="cm-text-decoration underline" ng-if="row.entity.systemGeneratedPaymentMethod === 0 "\
                                                ng-click="grid.appScope.$parent.vm.goToPaymentMethodDetail(row.entity);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                                            <span ng-if="row.entity.systemGeneratedPaymentMethod === 1">{{COL_FIELD}}</span>\
                      <copy-text label="\'Payment Method\'" text="row.entity.paymentMethod"></copy-text>\
                                        </div>',
        width: 145,
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'commentForPaymentCM',
        displayName: 'Reason',
        cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.commentForPaymentCM" ng-click="grid.appScope.$parent.vm.showComment(row, $event, false)"> \
                                        View \
                                    </md-button>',
        enableFiltering: false,
        enableSorting: false,
        width: '100'
      },
      {
        field: 'updatedAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'updatedby',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'updatedbyRole',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      },
      {
        field: 'createdAt',
        displayName: CORE.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableFiltering: false,
        enableSorting: true,
        type: 'datetime'
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
        enableFiltering: true
      }
    ];

    vm.getRefundAmountSum = () => {
      const sum = CalcSumofArrayElement(_.map(vm.sourceData, 'paymentAmountForPaymentCM'), _amountFilterDecimal);
      return $filter('amount')(sum);
    };

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: 0, //CORE.UIGrid.Page(),
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [],
        SearchColumns: [],
        paymentCMMstID: data.id || null,
        refPaymentModeForRefund: TRANSACTION.ReceivableRefPaymentMode.Refund.code || null,
        transModeType: data.refGencTransModeID || null,
        isDisplayAllTransWhereCreditUsed: vm.popupParamData.isDisplayAllTransWhereCreditUsed || false
      };
    };

    initPageInfo();
    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: true,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: vm.popupTitle + '.csv',
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return CustomerRefundFactory.retrieveCustRefundedListByRefTrans().query(pagingInfoOld).$promise.then((respOfRefundData) => {
          if (respOfRefundData && respOfRefundData.data && respOfRefundData.data.refundDetails) {
            return respOfRefundData.data.refundDetails;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (refundListDetails, isGetDataDown) => {
      if (refundListDetails && refundListDetails.data && refundListDetails.data.refundDetails) {
        _.map(refundListDetails.data.refundDetails, (data) => {
          data.refundDate = BaseService.getUIFormatedDate(data.refundDate, vm.DefaultDateFormat);
        });

        if (!isGetDataDown) {
          vm.sourceData = refundListDetails.data.refundDetails;
          vm.currentdata = vm.sourceData.length;
        }
        else if (refundDetails.data.refundDetails.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(refundListDetails.data.refundDetails);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }

        // must set after new data comes
        vm.totalSourceDataCount = refundListDetails.data.Count;
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

    // go to payment method detail page
    vm.goToPaymentMethodDetail = (row) => {
      BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: row.paymentType });
    };

    // get data from API
    vm.loadData = () => {
      vm.cgBusyLoading = CustomerRefundFactory.retrieveCustRefundedListByRefTrans().query(vm.pagingInfo).$promise.then((refundListDetails) => {
        if (refundListDetails && refundListDetails.data) {
          setDataAfterGetAPICall(refundListDetails, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CustomerRefundFactory.retrieveCustRefundedListByRefTrans().query(vm.pagingInfo).$promise.then((refundListDetails) => {
        if (refundListDetails && refundListDetails.data) {
          setDataAfterGetAPICall(refundListDetails, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //go to customer list page
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    // go to payment list page
    vm.goToCustomerPaymentList = () => {
      BaseService.goToCustomerPaymentList();
    };

    /* go to at customer refund page  */
    vm.goToCustomerRefundDetail = (rowEntity) => {
      if (rowEntity.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code) {
        BaseService.goToApplyCustCreditMemoToPayment(vm.popupParamData.id, rowEntity.custPaymentDBMstID);
      } else if (rowEntity.refPaymentMode === TRANSACTION.ReceivableRefPaymentMode.Refund.code) {
        BaseService.goToCustomerRefundDetail(rowEntity.custPaymentDBMstID);
      }
    };
    // go to customer detail page
    vm.goToCustomerDetail = () => {
      BaseService.goToCustomer(data.mfgCodeID);
    };

    //go to customer payment detail page
    vm.goToCustomerPaymentDetail = () => {
      BaseService.goToCustomerPaymentDetail(vm.popupParamData.id);
    };

    /* go to at customer refund list page */
    vm.goToCustomerRefundList = () => {
      BaseService.goToCustomerRefundList();
    };

    //go to customer credit memo list page
    vm.goToCreditMemoList = () => {
      BaseService.goToCustomerCreditMemoList();
    };

    /* go to at customer credit memo detail page  */
    vm.goToCustCreditMemoDetail = () => {
      BaseService.goToCustomerCreditMemoDetail(vm.popupParamData.id);
    };

    // view reason for customer payment or credit memo.
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
        label: paymentNumberGHLbl,
        value: row.entity.paymentNumber,
        displayOrder: 2,
        labelLinkFn: () => {
          BaseService.goToCustomerRefundList();
        },
        valueLinkFn: () => {
          vm.goToCustomerRefundDetail(row.entity);
        }
      },
      {
        label: paymentDateGHLbl,
        value: row.entity.refundDate,
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

    // pop up header data
    vm.headerData = [
      {
        label: vm.LabelConstant.MFG.Customer,
        value: vm.popupParamData.customerName,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomerDetail
      },
      {
        label: vm.popupParamData.refGencTransModeID === vm.GenericTransModeName.RefundPayablePayRefund.id ? 'Payment# or Check#' : 'Credit Memo #',
        value: vm.popupParamData.paymentCMNumber,
        displayOrder: 2,
        labelLinkFn: vm.popupParamData.refGencTransModeID === vm.GenericTransModeName.RefundPayablePayRefund.id ? vm.goToCustomerPaymentList : vm.goToCreditMemoList,
        valueLinkFn: vm.popupParamData.refGencTransModeID === vm.GenericTransModeName.RefundPayablePayRefund.id ? vm.goToCustomerPaymentDetail : vm.goToCustCreditMemoDetail
      },
      {
        label: 'Original Amount',
        value: data.totalPaymentAmount ? $filter('amount')(data.totalPaymentAmount) : 0,
        displayOrder: 3
      },
      {
        label: 'Agreed Refund amount',
        value: data.agreedRefundAmount ? $filter('amount')(data.agreedRefundAmount) : 0,
        displayOrder: 4
      }
    ];
    if (vm.popupParamData.isDisplayAllTransWhereCreditUsed) {
      vm.headerData.push({
        label: 'Applied CM + Refunded Amt.',
        value: data.sumAppliedCMRefundedAmount ? $filter('amount')(data.sumAppliedCMRefundedAmount) : 0,
        displayOrder: 5
      });
    } else {
      vm.headerData.push({
        label: 'Total Refunded Amount',
        value: data.totalRefundIssuedAmount ? $filter('amount')(data.totalRefundIssuedAmount) : 0,
        displayOrder: 5
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
