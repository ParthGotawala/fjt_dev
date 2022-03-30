(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('PaidVerificationCustomerPackingController', PaidVerificationCustomerPackingController);

  function PaidVerificationCustomerPackingController($mdDialog, DialogFactory, CORE, BaseService, data, CustomerPackingSlipFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.paidPackingSlip = {};
    vm.packingSlipData = angular.copy(data);
    vm.saveBtnDisableFlag = false;
    vm.todayDate = new Date();
    vm.paidPackingSlip.totalPayableAmount = parseFloat(_.sumBy(vm.packingSlipData, (data) => {
      if (data.isSelected) {
        return data.totalAmount;
      }
      else {
        return 0;
      }
    }).toFixed(2));
    const minDate = _.minBy(vm.packingSlipData, (o) => (new Date(o.invoiceDate)));
    if (minDate) {
      vm.paidPackingSlip.minInvoiceDate = BaseService.getUIFormatedDate(minDate.invoiceDate, vm.DefaultDateFormat);
    };
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.chequeDateOptions = {
      appendToBody: true,
      checkoutTimeOpenFlag: false,
      minDate: vm.paidPackingSlip.minInvoiceDate,
      maxDate: vm.todayDate
    };
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.chequeDate]: false
    };
    vm.query = {
      order: ''
    };
    vm.anyItemSelect = true;

    if (_.some(vm.packingSlipData, (data) => !data.isSelected)) {
      vm.isAllSelect = false;
    } else {
      vm.isAllSelect = true;
    }

    vm.headerdata = [];

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.paidAmount = () => {
      if (BaseService.focusRequiredField(vm.formPaidPackaging)) {
        return;
      }
      vm.saveBtnDisableFlag = true;
      let messageContent;
      let alertModel;
      if (vm.paidPackingSlip && parseFloat(vm.paidPackingSlip.totalPayableAmount) !== parseFloat(vm.paidPackingSlip.chequeAmount)) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MISMATCH_AMOUNT);
        alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel).then((yes) => {
          if (yes) {
            vm.paidPackingSlip.chequeAmount = null;
            const myEl = angular.element(document.querySelector('#chequeAmount'));
            myEl.focus();
            vm.saveBtnDisableFlag = false;
            return false;
          }
        }, () => {
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
        vm.saveBtnDisableFlag = false;
        return false;
      }
      const paidPackingList = [];
      _.map(vm.packingSlipData, (data) => {
        if (data.isSelected) {
          const obj = {};
          obj.id = data.id;
          obj.paymentNumber = vm.paidPackingSlip.chequeNumber;
          const convertApiChequeDate = vm.paidPackingSlip.chequeDate ? (BaseService.getAPIFormatedDate(vm.paidPackingSlip.chequeDate)) : null;
          obj.paymentDate = convertApiChequeDate;
          obj.bankName = vm.paidPackingSlip.bankName;
          obj.paymentAmount = vm.paidPackingSlip.chequeAmount;
          obj.paymentStatus = 'P';
          paidPackingList.push(obj);
        }
      });

      if (paidPackingList.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'invoice');
        alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        vm.saveBtnDisableFlag = false;
        return;
      }
      vm.cgBusyLoading = CustomerPackingSlipFactory.paidCustomerPackingSlip().query(paidPackingList).$promise.then((response) => {
        if (response) {
          vm.saveBtnDisableFlag = false;
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel(true);
        } else {
          if (checkResponseHasCallBackFunctionPromise(response)) {
            response.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formPaidPackaging);
            });
          }
          vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.selectAllReceipt = () => {
      if (vm.isAllSelect) {
        _.map(vm.packingSlipData, (data) => {
          data.isSelected = true;
        });
        vm.anyItemSelect = true;
      } else {
        _.map(vm.packingSlipData, (data) => {
          data.isSelected = false;
        });
        vm.anyItemSelect = false;
      }
      vm.paidPackingSlip.totalPayableAmount = parseFloat(_.sumBy(vm.packingSlipData, (data) => {
        if (data.isSelected) {
          return data.totalAmount;
        }
        else {
          return 0;
        }
      }).toFixed(2));
      const minDate = _.minBy(vm.packingSlipData, (o) => (new Date(o.invoiceDate)));
      if (minDate) {
        vm.paidPackingSlip.minInvoiceDate = BaseService.getUIFormatedDate(minDate.invoiceDate, vm.DefaultDateFormat);;
        vm.chequeDateOptions = {
          appendToBody: true,
          checkoutTimeOpenFlag: false,
          minDate: vm.paidPackingSlip.minInvoiceDate,
          maxDate: vm.todayDate
        };
      }
    };
    //select receipt details
    vm.selectReceipt = (item) => {
      if (item.isSelected) {
        const checkAnyDeSelect = _.some(vm.packingSlipData, (data) => !data.isSelected);
        if (checkAnyDeSelect) {
          vm.isAllSelect = false;
        }
        else {
          vm.isAllSelect = true;
        }
      } else {
        vm.isAllSelect = false;
      }
      vm.anyItemSelect = _.some(vm.packingSlipData, (data) => data.isSelected);
      vm.paidPackingSlip.totalPayableAmount = parseFloat(_.sumBy(vm.packingSlipData, (data) => {
        if (data.isSelected) {
          return data.totalAmount;
        }
        else {
          return 0;
        }
      }).toFixed(2));
      const minDate = _.minBy(vm.packingSlipData, (o) => (new Date(o.invoiceDate)));
      if (minDate) {
        vm.paidPackingSlip.minInvoiceDate = BaseService.getUIFormatedDate(minDate.invoiceDate, vm.DefaultDateFormat);;
        vm.chequeDateOptions = {
          appendToBody: true,
          checkoutTimeOpenFlag: false,
          minDate: vm.paidPackingSlip.minInvoiceDate,
          maxDate: vm.todayDate
        };
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formPaidPackaging];
    });
    //cancel popup
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formPaidPackaging, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formPaidPackaging.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };
  }
})();
