(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SelectSupplierInvoicePopupController', SelectSupplierInvoicePopupController);

  /** @ngInject */
  function SelectSupplierInvoicePopupController($scope, $filter, TRANSACTION, $mdDialog, DialogFactory, data, BaseService, CORE, USER) {
    const vm = this;
    vm.isHideDelete = true;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.memoTypeList = CORE.InvoiceVerificationReceiptTypeOptionsGridHeaderDropdown;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.packingSlipData = data ? data : [];

    function setInvoiceType() {
      if (vm.packingSlipData) {
        _.map(vm.packingSlipData, (data) => {
          const obj = _.find(vm.memoTypeList, (item) => item.code === data.receiptType);
          data.receiptName = obj && obj.value ? obj.value : null;
        });
      }
    }

    setInvoiceType();

    vm.selectAllReceipt = () => {
      if (vm.isAllSelect) {
        _.map(vm.packingSlipData, (data) => {
          if (!data.isSelected) {
            data.isSelected = true;
          }
        });
        vm.anyItemSelect = true;
      } else {
        _.map(vm.packingSlipData, (data) => {
          data.isSelected = false;
        });
        vm.anyItemSelect = false;
      }
    };
    vm.selectReceipt = (item) => {
      _.each(vm.packingSlipData, (d) => {
        if (d.refParentCreditDebitInvoiceno === item.id) {
          d.isSelected = item.isSelected;
        }
      });
      if (item.isSelected) {
        const checkAnyDeSelect = _.some(vm.packingSlipData, (data) => data.isSelected === false);
        if (checkAnyDeSelect) {
          vm.isAllSelect = false;
        }
        else {
          vm.isAllSelect = true;
        }
      } else {
        vm.isAllSelect = false;
      }
      vm.anyItemSelect = _.some(vm.packingSlipData, (data) => data.isSelected === true);
    };

    vm.supplierInvoiceDetail = (item, isRefInvoice) => {
      if (isRefInvoice) {
        BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, item.refParentCreditDebitInvoiceno);
      } else if (item.receiptType === CORE.packingSlipReceiptType.I.Key) {
        BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, item.id);
      } else if (item.receiptType === CORE.packingSlipReceiptType.C.Key) {
        BaseService.goToCreditMemoDetail(null, item.id);
      } else if (item.receiptType === CORE.packingSlipReceiptType.D.Key) {
        BaseService.goToDebitMemoDetail(null, item.id);
      }
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
    vm.getTotalPaidAmount = () => {
      vm.grandTotalPaidAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'totalPaidAmount'), _amountFilterDecimal);
      return $filter('amount')(vm.grandTotalPaidAmount);
    };

    vm.getTotalExtendedAmount = () => {
      vm.grandTotalExtendedAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'totalExtendedAmount'), _amountFilterDecimal);
      return $filter('amount')(vm.grandTotalExtendedAmount);
    };

    vm.getTotalBalancetoPayAmount = () => {
      vm.grandTotalBalanceToPayAmount = CalcSumofArrayElement(_.map(vm.packingSlipData, 'balanceToPayAmount'), _amountFilterDecimal);
      return $filter('amount')(vm.grandTotalBalanceToPayAmount);
    };


    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.addSelectedInvoiceToPayment = () => {
      var selectedInvoice = _.filter(vm.packingSlipData, (data) => data.isSelected === true);
      const checkDraftPackingSlip = _.map(_.filter(selectedInvoice, (data) => data.packingSlipModeStatus === 'D'), 'packingSlipNumber').join(', ');
      if (checkDraftPackingSlip) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DRAFT_INVOICE_PS_NOT_PAY);
        messageContent.message = stringFormat(messageContent.message, checkDraftPackingSlip);
        DialogFactory.messageAlertDialog({ messageContent: messageContent });
        return;
      }
      $mdDialog.cancel(selectedInvoice);
    };
  }
})();
