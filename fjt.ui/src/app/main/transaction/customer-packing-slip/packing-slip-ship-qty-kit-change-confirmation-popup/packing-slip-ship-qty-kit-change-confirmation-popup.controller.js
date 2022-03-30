(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('CustomerPackingSlipQtyKitChangePopupController', CustomerPackingSlipQtyKitChangePopupController);

  /** @ngInject */
  function CustomerPackingSlipQtyKitChangePopupController($mdDialog, data, BaseService, CORE, USER) {
    const vm = this;
    vm.popupParamData = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.confmMsgForUMIDKitDeallocate = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PACKING_SLIP_UMID_DEALLOCATE_FROM_OTHER_KIT_CONFM.message;
    vm.shipQtyNotAvailableMsg = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CUST_PACKING_SLIP_MISMATCH_AVAILABLE_QTY.message;
    if (vm.popupParamData.notAvailableQtyShipList && vm.popupParamData.notAvailableQtyShipList.length > 0) {
      vm.isNotAvailableQtyCase = true;
      vm.displayShipListOfVerify = vm.popupParamData.notAvailableQtyShipList;
      vm.popupTitle = 'Qty Mismatch Alert';
    }
    else if (vm.popupParamData.UMIDKitConfmRequireShipList && vm.popupParamData.UMIDKitConfmRequireShipList.length > 0) {
      vm.isDeallocateKitCase = true;
      vm.displayShipListOfVerify = vm.popupParamData.UMIDKitConfmRequireShipList;
      vm.popupTitle = 'Kit Deallocation Confirmation';
    }

    // apply kit changes after confirmation
    vm.applyChanges = () => {
      $mdDialog.hide(true);
    };

    //go to customer Shipping address list page
    vm.goToCustShippingAddressList = () => {
      BaseService.goToCustomerShippingAddressList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.popupParamData.customerID);
    };

    //go to Shipping Method - generic category list page
    vm.goToShippingMethodList = () => {
      BaseService.goToGenericCategoryShippingTypeList();
    };

    // go to sales order list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };

    // go to manage sales order page
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.popupParamData.refSalesOrderID);
    };

    /** Redirect to part master page */
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    //go to work order list page
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
    };

    // go to assembly list
    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
    };

    // go to UMID list page
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    // go to UMID list page
    vm.goToUMIDDetails = (refsidid) => BaseService.goToUMIDDetail(refsidid);

    // go to manage work order page
    vm.goToWorkOrder = (id) => {
      BaseService.goToWorkorderDetails(id);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
