(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('HaltResumePopupController', HaltResumePopupController);

  /** @ngInject */
  function HaltResumePopupController($mdDialog, data, CORE, SalesOrderFactory, BaseService, USER, TRANSACTION) {
    const vm = this;
    vm.haltResumeStatus = data;
    vm.HaltResumePopUp = CORE.HaltResumePopUp;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.saveBtnDisableFlag = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.haltResumeStatus.soId);
      return false;
    };

    vm.goToPurchaseOrderList = () => {
      BaseService.goToPurchaseOrderList();
      return false;
    };
    vm.goToPurchaseOrderDetail = () => {
      BaseService.goToPurchaseOrderDetail(vm.haltResumeStatus.poId);
      return false;
    };

    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.haltResumeStatus.assyID);
      return false;
    };
    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.goToSupplierInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
      return false;
    };
    vm.goToSupplierInvoiceDetail = () => {
      BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.haltResumeStatus.invoiceId);
      return false;
    };

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };

    vm.goToPackingSlipDetail = () => {
      BaseService.goToManagePackingSlipDetail(vm.haltResumeStatus.packingSlipId);
      return false;
    },

    vm.goToSupplierRefInvoiceDetail = () => {
      BaseService.goToSupplierInvoiceDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.haltResumeStatus.refInvoiceId);
      return false;
    };

    vm.goToCreditMemoList = () => {
      BaseService.goToCreditMemoList();
    };
    vm.goToCreditMemoDetail = () => {
      BaseService.goToCreditMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.haltResumeStatus.invoiceId);
      return false;
    };

    vm.goToDebitMemoDetail = () => {
      BaseService.goToDebitMemoDetail(TRANSACTION.SupplierInvoiceType.Detail, vm.haltResumeStatus.invoiceId);
      return false;
    };
    vm.goToDebitMemoList = () => {
      BaseService.goToDebitMemoList();
    };


    vm.headerdata = [
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.haltResumeStatus.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.haltResumeStatus.poId ? vm.goToPurchaseOrderList : (vm.haltResumeStatus.soId ? vm.goToSalesOrderList : null),
        valueLinkFn: vm.haltResumeStatus.poId ? vm.goToPurchaseOrderDetail : (vm.haltResumeStatus.soId ? vm.goToManageSalesOrder : null)
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.haltResumeStatus.soNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: CORE.LabelConstant.SalesOrder.AssyIDPID,
        value: vm.haltResumeStatus.assyName,
        displayOrder: 3,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.haltResumeStatus.rohsIcon,
          imgDetail: vm.haltResumeStatus.rohs
        }
      },
      {
        label: vm.LabelConstant.SupplierInvoice.PackingSlipNumber,
        value: vm.haltResumeStatus.invoiceNumber ? vm.haltResumeStatus.packingSlipNumber : null,// added null to hide incase of other then invoice
        displayOrder: 4,
        labelLinkFn: vm.goToPackingSlipList,
        valueLinkFn: vm.goToPackingSlipDetail
      },
      {
        label: vm.LabelConstant.SupplierInvoice.InvoiceNumber,
        value: vm.haltResumeStatus.invoiceNumber,
        displayOrder: 5,
        labelLinkFn: vm.goToSupplierInvoiceList,
        valueLinkFn: vm.goToSupplierInvoiceDetail
      },
      {
        label: vm.LabelConstant.SupplierInvoice.CreditMemoNumber,
        value: vm.haltResumeStatus.creditMemoNumber,
        displayOrder: 6,
        labelLinkFn: vm.goToCreditMemoList,
        valueLinkFn: vm.goToCreditMemoDetail
      },
      {
        label: vm.LabelConstant.SupplierInvoice.DebitMemoNumber,
        value: vm.haltResumeStatus.debitMemoNumber,
        displayOrder: 7,
        labelLinkFn: vm.goToDebitMemoList,
        valueLinkFn: vm.goToDebitMemoDetail
      },
      {
        label: vm.LabelConstant.PACKING_SLIP.RefInvoiceNumber,
        value: vm.haltResumeStatus.refInvoiceNumber,
        displayOrder: 8,
        labelLinkFn: vm.goToSupplierInvoiceList,
        valueLinkFn: vm.goToSupplierRefInvoiceDetail
      }
    ];



    vm.holdUnhold = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.HaltResumeForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      vm.cgBusyLoading = SalesOrderFactory.holdResumeTrans().query({ dataObj: vm.haltResumeStatus}).$promise.then((response) => {
        if (response.data) {
          vm.saveBtnDisableFlag = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(true);
        }
        else {
          vm.saveBtnDisableFlag = false;
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(response.errors);
        }
      }, (error) => {
          vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.HaltResumeForm);
      if (isdirty) {
        let data = {
          form: vm.HaltResumeForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
   
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.HaltResumeForm);
    });
  }
})();
