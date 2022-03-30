(function () {
  'use strict';
  angular
    .module('app.transaction.salesordershipmentmain')
    .controller('SalesOrderShipmentSummaryController', SalesOrderShipmentSummaryController);

  /** @ngInject */
  function SalesOrderShipmentSummaryController($scope,CORE) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;

  }
})();
