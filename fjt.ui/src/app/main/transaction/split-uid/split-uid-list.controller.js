(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('SplitUIDController', SplitUIDController);

  /** @ngInject */
  function SplitUIDController($scope, CORE, $stateParams) {
    const vm = this;
    $scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.SplitUMIDList.Name;
    vm.umidId = $stateParams.id;
  }
})();
