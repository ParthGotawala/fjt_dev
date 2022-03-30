(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ViewAssyChangeStatusListController', ViewAssyChangeStatusListController);

  /** @ngInject */
  function ViewAssyChangeStatusListController($mdDialog, CORE, USER, RFQTRANSACTION, data) {
    const vm = this;

    vm.rfqAssyList = angular.copy(data);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.unitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    // close pop up
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
