(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RFQListController', RFQListController);

  /** @ngInject */
  function RFQListController(RFQTRANSACTION, BaseService) {
    const vm = this;
    vm.addRecord = () => {
      BaseService.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: null, rfqAssyId: null });
    };
  }
})();
