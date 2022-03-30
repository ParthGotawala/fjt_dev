(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('SelectAddressesPopupController', SelectAddressesPopupController);

  /** @ngInject */
  function SelectAddressesPopupController($mdDialog, data, CORE, BaseService) {
    const vm = this;
    vm.data = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.companyNameWithCode = data && data.companyNameWithCode ? data.companyNameWithCode : null;
    vm.selectedAddress = data && data.selectedAddress;
    if (data.addressType) {
      switch (data.addressType) {
        case CORE.AddressType.BillingAddress:
          vm.addressTypeTitle = vm.LabelConstant.Address.BillingAddress;
          break;
        case CORE.AddressType.ShippingAddress:
          vm.addressTypeTitle = vm.data && vm.data.mfgType === CORE.MFG_TYPE.DIST ? vm.LabelConstant.Address.ShippingFromAddress : vm.LabelConstant.Address.ShippingAddress;
          break;
        case CORE.AddressType.RMAShippingAddress:
          vm.addressTypeTitle = vm.data && vm.data.mfgType === CORE.MFG_TYPE.DIST ? vm.LabelConstant.COMMON.RMAShippingAddress : vm.LabelConstant.Address.RMAShippingAddress;
          break;
        case CORE.AddressType.PayToInformation:
          vm.addressTypeTitle = vm.LabelConstant.Address.PayToAddress;
          break;
        case CORE.AddressType.IntermediateAddress:
          vm.addressTypeTitle = vm.LabelConstant.Address.MarkForAddress;
          break;
        case CORE.AddressType.WireTransferAddress:
          vm.addressTypeTitle = vm.LabelConstant.Address.WireTransferAddress;
          break;
        case CORE.AddressType.BusinessAddress:
          vm.addressTypeTitle = vm.LabelConstant.Address.BusinessAddress;
          break;
        case CORE.AddressType.RMAIntermediateAddress:
          vm.addressTypeTitle = vm.LabelConstant.Address.RMAIntermediateAddress;
          break;
      }
    }
    /* apply selected address */
    vm.applyDefalutAddress = () => {
      if (!vm.isdirty) {
        if (BaseService.focusRequiredField(vm.customerBillingAddressForm)) {
          return;
        }
      } else {
        $mdDialog.cancel(vm.selectedAddress ? vm.selectedAddress : null);
      }
    };
    vm.selectCallback = (selectedAddress) => {
      vm.isdirty = true;
      vm.selectedAddress = selectedAddress;
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
