(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('companyProfileBillto', companyProfileBillto);

  /** @ngInject */
  function companyProfileBillto() {
    var directive = {
      restrict: 'E',
      scope: {
        mfgcodeId: '=?'
      },
      templateUrl: 'app/directives/custom/company-profile-billto/company-profile-billto.html',
      controller: companyProfileBilltoCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of company profile billing address
    *
    * @param
    */
    function companyProfileBilltoCtrl($scope, CORE, USER) {
      var vm = this;
      vm.emptyMesssage = USER.ADMIN_EMPTYSTATE.CUSTOMERBILLINGADDRESS;
      vm.mfgCodeId = $scope.mfgcodeId;
      vm.addressType = CORE.AddressType.BillingAddress;
    }
  }
})();
