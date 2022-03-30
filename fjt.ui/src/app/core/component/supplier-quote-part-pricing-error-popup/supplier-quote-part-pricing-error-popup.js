(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierQuotePartPricingErrorPopupController', SupplierQuotePartPricingErrorPopupController);

  /** @ngInject */
  function SupplierQuotePartPricingErrorPopupController(data, CORE, $mdDialog) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.pricingErrorData = data;
    
    vm.cancel = () => {      
      $mdDialog.cancel();
    };
  }

})();
