(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ToleranceQtyConfirmationPopupController', ToleranceQtyConfirmationPopupController);
  /** @ngInject */
  function ToleranceQtyConfirmationPopupController($mdDialog, data, CORE, BaseService, TRANSACTION) {
    const vm = this;
    vm.POvsMRPQtyTolerancePer = data.POvsMRPQtyTolerancePer;
    vm.iskitQty = data.iskitQty;
    vm.msg = vm.iskitQty ? stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_KITQUANTITY.message, vm.POvsMRPQtyTolerancePer):stringFormat(TRANSACTION.INVALID_MRPQUANTITY, vm.POvsMRPQtyTolerancePer);
    vm.listAssabelyDetail = data.listAssabelyDetail;
    vm.LabelConstant = CORE.LabelConstant;
    vm.MfgLabelConstant = vm.LabelConstant.MFG;
    const toleranceQtypercentage = parseFloat(vm.listAssabelyDetail.qty) * vm.POvsMRPQtyTolerancePer / 100;
    const toleranceQtymore = toleranceQtypercentage + parseFloat(vm.listAssabelyDetail.qty);
    const toleranceQtyless = parseFloat(vm.listAssabelyDetail.qty) - toleranceQtypercentage;
    if (parseFloat(vm.listAssabelyDetail.mrpQty) > toleranceQtymore || parseFloat(vm.listAssabelyDetail.kitQty) > toleranceQtymore) {
      vm.status = stringFormat('{0}{1}{2}{3}', 'more than', ' ', vm.POvsMRPQtyTolerancePer, '%');
    } else if (parseFloat(vm.listAssabelyDetail.mrpQty) < toleranceQtyless || parseFloat(vm.listAssabelyDetail.kitQty) < toleranceQtyless) {
      vm.status = stringFormat('{0}{1}{2}{3}', 'less than', ' ', vm.POvsMRPQtyTolerancePer, '%');
    }
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };
    vm.goToSalesOrderDetails = (data) => {
      BaseService.goToManageSalesOrder(data.id);
      return false;
    };
    vm.headerdata = [];
    vm.headerdata.push({
      label: CORE.LabelConstant.SalesOrder.SO,
      value: data.salesOrderNumber,
      displayOrder: 1,
      labelLinkFn: vm.listAssabelyDetail.isOpenInOtherWindow ? vm.goToSalesOrderList : null,
      valueLinkFn: vm.listAssabelyDetail.isOpenInOtherWindow ? vm.goToSalesOrderDetails : null,
      valueLinkFnParams: vm.listAssabelyDetail.isOpenInOtherWindow ? { id: vm.listAssabelyDetail.salesOrderId } : null
    }, {
        label: CORE.LabelConstant.SalesOrder.Revision,
        value: data.revision,
        displayOrder: 2
      });
    // Assembly
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    };
    vm.save = () => {
      $mdDialog.hide(true);
    };
    vm.cancel = () => {
      $mdDialog.hide(false);
    };
  }
})();
