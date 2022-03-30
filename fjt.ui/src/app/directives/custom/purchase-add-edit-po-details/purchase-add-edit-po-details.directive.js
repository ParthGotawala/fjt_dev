(function () {

  'use sctrict';
  angular
    .module('app.core')
    .directive('purchaseAddEditPoDetails', purchaseAddEditPoDetails);

  /** @ngInject */
  function purchaseAddEditPoDetails(CORE, $mdDialog, $filter) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
      },
      templateUrl: 'app/directives/custom/purchase-add-edit-po-details/purchase-add-edit-po-details.html',
      controller: PurchaseAddEditPoDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function PurchaseAddEditPoDetailsCtrl($scope, CORE) {
      var vm = this;

    }
  }
})();
