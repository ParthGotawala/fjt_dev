(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('companyProfileShippingadress', companyProfileShippingadress);

  /** @ngInject */
  function companyProfileShippingadress() {
    var directive = {
      restrict: 'E',
      scope: {
        mfgcodeId: '=?'
      },
      templateUrl: 'app/directives/custom/company-profile-shippingadress/company-profile-shippingadress.html',
      controller: companyProfileShippingaddressCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of company profile shipping address
    *
    * @param
    */
    function companyProfileShippingaddressCtrl($scope, CORE, USER) {
      var vm = this;
      vm.mfgCodeId = $scope.mfgcodeId;
      vm.emptyMesssage = USER.ADMIN_EMPTYSTATE.CUSTOMERSHIPPINGADDRESS;
      vm.addressType = CORE.AddressType.ShippingAddress;
    }
  }
})();
