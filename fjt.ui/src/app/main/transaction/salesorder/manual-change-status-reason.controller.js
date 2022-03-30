(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('ManualChangeStatusReasonController', ManualChangeStatusReasonController);

  /** @ngInject */
  function ManualChangeStatusReasonController($filter, $q, $mdDialog, data, CORE, SalesOrderFactory, BaseService) {
    const vm = this;
    vm.SalesOrderStatus = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.SalesOrderStatus.id);
      return false;
    };

    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.SalesOrderStatus.partID);
      return false;
    };

    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };
    vm.headerdata = [
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.SalesOrderStatus.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.SalesOrderStatus.salesOrderNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.goToManageSalesOrder
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.SalesOrderStatus.PIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.SalesOrderStatus.rohsIcon,
          imgDetail: vm.SalesOrderStatus.rohs
        }
      }];


    // Change Internal PO status manually
    vm.ChangeStatus = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.SOChangeStatusForm, false)) {
        vm.saveDisable = false;
        return;
      }

      const salesObj = {
        type: 'ManualUpdate',
        salesOrderDetID: vm.SalesOrderStatus.salesOrderDetailId,
        salesOrderDetStatus: CORE.SalesOrderDetStatus.COMPLETED,
        completeStatusReason: vm.SalesOrderStatus.completeStatusReason
      };
      vm.cgBusyLoading = SalesOrderFactory.updateSalesOrderDetailStatusManual().query({ salesObj: salesObj }).$promise.then((res) => {
        if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide();
        }
        vm.saveDisable = false;
      }, (error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    // cancel popup for reason
    vm.cancel = () => {
      // let isdirty = ;
      if (vm.checkFormDirty(vm.SOChangeStatusForm)) {
        const data = {
          form: vm.SOChangeStatusForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // check dirty form object while close
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.SOChangeStatusForm);
    });
  }
})();
