(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('CustRefundDuplicatePaymentNumPopupController', CustRefundDuplicatePaymentNumPopupController);

  function CustRefundDuplicatePaymentNumPopupController($mdDialog, BaseService, data, $scope, CustomerRefundFactory, TRANSACTION, CORE, $timeout, DialogFactory, USER) {
    const vm = this;
    vm.popupParamData = angular.copy(data);
    vm.isHideDelete = true;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.loginUser = BaseService.loginUser;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_REFUND;
    vm.duplicatePMTConfmMsg = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_REFUND_PMT_DUPLICATE_CONFM.message);
    vm.duplicatePMTConfmMsg = stringFormat(vm.duplicatePMTConfmMsg, vm.popupParamData.paymentNumber);

    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

    const initPageInfo = () => {
      vm.pagingInfo = {
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
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Customer Refund - Duplicate Payment# or Check#.csv',
      hideMultiDeleteButton: true,
      allowToExportAllData: true,
      exporterAllDataFn: () => {
        const pagingInfoOld = _.clone(vm.pagingInfo);
        pagingInfoOld.pageSize = 0;
        pagingInfoOld.Page = 1;
        vm.gridOptions.isExport = pagingInfoOld.isExport = true;
        return CustomerRefundFactory.getCustSuppRefundListByPaymentNum().query(pagingInfoOld).$promise.then((respOfRefundData) => {
          if (respOfRefundData && respOfRefundData.data && respOfRefundData.data.refundDetails) {
            return respOfRefundData.data.refundDetails;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
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
        field: 'systemId',
        displayName: 'SystemID',
        width: 135,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'entityNameInApplied',
        displayName: 'Transaction',
        width: 165,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'customerCodeName',
        displayName: vm.LabelConstant.MFG.Customer,
        width: '320',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                            <a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerDetail(row.entity.refPaymentMode, row.entity.mfgcodeID);"\
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
                                                ng-click="grid.appScope.$parent.vm.goToBillToPage(row.entity.refPaymentMode, row.entity.mfgcodeID);"\
                                                tabindex="-1">{{COL_FIELD}}</a></div>',
        width: '200',
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'paymentNumber',
        displayName: 'Payment# or Check#',
        width: 230,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><a class="cm-text-decoration underline"\
                                                ng-click="grid.appScope.$parent.vm.goToCustomerRefundDetail(row.entity.refPaymentMode, row.entity.id);"\
                                                tabindex="-1">{{COL_FIELD}}</a>\
                          <copy-text ng-if="row.entity.paymentNumber" label="\'Payment# or Check#\'" text="row.entity.paymentNumber"></copy-text>\
                         </div> ',
        enableFiltering: false,
        enableSorting: true
      },
      {
        field: 'bankAccountNo',
        displayName: 'Bank Account Code',
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
        displayName: 'Amount',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: 165,
        enableFiltering: true,
        enableSorting: true
      },
      {
        field: 'refundDate',
        displayName: 'Refund/Payment Date',
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
          if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode) || vm.pagingInfo.paymentNumber) {
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

    /* retrieve customer Refund list */
    vm.loadData = () => {
      vm.pagingInfo.custRefundMstID = vm.popupParamData.custRefundMstID || null;
      vm.pagingInfo.paymentNumber = vm.popupParamData.paymentNumber;
      vm.pagingInfo.bankAccountNo = vm.popupParamData.bankAccountNo;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = CustomerRefundFactory.getCustSuppRefundListByPaymentNum().query(vm.pagingInfo).$promise.then((refundDetails) => {
        if (refundDetails && refundDetails.data) {
          setDataAfterGetAPICall(refundDetails, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = CustomerRefundFactory.getCustSuppRefundListByPaymentNum().query(vm.pagingInfo).$promise.then((refundDetails) => {
        if (refundDetails && refundDetails.data) {
          setDataAfterGetAPICall(refundDetails, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
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
        label: 'Payment# or Check#',
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
        label: 'Refund/Payment Date',
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

    vm.goToCustomerDetail = (refPaymentMode, mfgcodeID) => {
      if (refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
        BaseService.goToCustomer(mfgcodeID);
      } else if (refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable) {
        BaseService.goToSupplierDetail(mfgcodeID);
      }
    };

    vm.goToPaymentMethodDetail = (paymentType) => {
      BaseService.openInNew(USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE, { gencCategoryID: paymentType });
    };

    /* to go at customer bill to address page */
    vm.goToBillToPage = (refPaymentMode, mfgcodeID) => {
      if (refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
        BaseService.goToCustomer(mfgcodeID, false);
      } else if (refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable) {
        BaseService.goToSupplierDetail(mfgcodeID, false);
      }
    };

    /* go To Refund Detail page */
    vm.goToCustomerRefundDetail = (refPaymentMode, custRefundMstID) => {
      if (refPaymentMode === CORE.RefPaymentModeForInvoicePayment.CustomerRefund) {
        BaseService.goToCustomerRefundDetail(custRefundMstID);
      } else if (refPaymentMode === CORE.RefPaymentModeForInvoicePayment.Payable) {
        BaseService.goToSupplierPaymentList();
      }
    };

    /* continue to save payment# or check# which is duplicate */
    vm.continue = () => {
      // if payment method is check and global key setting true for authentication required then need to take password confirmation otherwise not
      if (vm.popupParamData.isCheckTypePaymentMtdSelected && vm.popupParamData.authenticateCheckNumberDuplication) {
        const refundPayNumVerification = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          isAllowSaveDirect: false,
          popupTitle: 'Verification For Duplicate Payment# or Check#',
          confirmationType: CORE.Generic_Confirmation_Type.VERIFY_CUST_REFUND_DUPLICATE_PAYMENT_NUM,
          isOnlyPassword: true,
          createdBy: vm.loginUser.userid,
          updatedBy: vm.loginUser.userid,
          headerDisplayData: null,
          isShowHeaderData: false,
          refTableName: CORE.TABLE_NAME.PACKINGSLIP_INVOICE_PAYMENT,
          refID: vm.popupParamData.custRefundMstID || 0,
          approveFromPage: CORE.PageName.CustomerRefund,
          transactionType: 'Customer Refund - Verification For Duplicate Payment# or Check#'
        };
        return DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          event,
          refundPayNumVerification).then((pswConfirmationDet) => {
            if (pswConfirmationDet) {
              const refundPayNumVerificationDet = _.omit(pswConfirmationDet, ['isAllowSaveDirect', 'popupTitle', 'isShowHeaderData', 'headerDisplayData']);
              const verifyResp = {
                isVerified: true,
                refundPayNumVerificationDet: refundPayNumVerificationDet
              };
              $mdDialog.hide(verifyResp);
            }
          }, () => {
            // cancel block
          }).catch((error) => BaseService.getErrorLog(error));
      } else {
        const verifyResp = {
          isVerified: true,
          refundPayNumVerificationDet: null
        };
        $mdDialog.hide(verifyResp);
      }
    };

    /* to close popup */
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
