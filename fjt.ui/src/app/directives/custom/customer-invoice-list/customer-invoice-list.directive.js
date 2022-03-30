(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('customerInvoiceList', customerInvoiceList);

  /** @ngInject */
  function customerInvoiceList() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
      },
      templateUrl: 'app/directives/custom/customer-invoice-list/customer-invoice-list.html',
      controller: customerInvoiceListDirectiveCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function customerInvoiceListDirectiveCtrl() {
      // var vm = this;
      // just render directive
    }
  }
})();
