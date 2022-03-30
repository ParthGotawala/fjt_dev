(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('addButtonLinkable', addButtonLinkableDirective);

  /** @ngInject */
  function addButtonLinkableDirective(BaseService, $state) {
    return {
      restrict: 'E',
      scope: {
        buttonObj: '='
      },
      templateUrl: 'app/directives/custom/add-button-linkable/add-button-linkable.html',
      controllerAs: 'vm',
      controller: function ($scope) {
        var vm = this;
        vm.OpenInSameTab = false;
        vm.button = $scope.buttonObj;
        //redirect to respective page
        if (vm.button.buttonParams) {
          vm.button.buttonParamsJson = '(' + JSON.stringify(vm.button.buttonParams) + ')';
        }

        // Go To Menu
        vm.GoToMenu = () => {
          if (vm.OpenInSameTab) {
            $state.go(vm.button.buttonRoute, vm.button.buttonParams);
          } else {
            BaseService.openInNew(vm.button.buttonRoute, vm.button.buttonParams);
          }
        };
      }
    };
  }
})();
