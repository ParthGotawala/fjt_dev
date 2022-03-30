(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .factory('CustomerInvoiceFactory', CustomerInvoiceFactory);

  /** @ngInject */
  function CustomerInvoiceFactory($resource, CORE) {
    return {
    };
  }
})();
