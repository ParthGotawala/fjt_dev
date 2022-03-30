(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('VerificationHistoryController', VerificationHistoryController);

  /** @ngInject */
  function VerificationHistoryController($scope, $stateParams, CORE) {
    const vm = this;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.VerificationHistory.Name;
    vm.umidId = $stateParams.id;
  }
})();
