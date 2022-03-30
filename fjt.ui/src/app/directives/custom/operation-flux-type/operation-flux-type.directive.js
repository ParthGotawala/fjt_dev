(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationFluxTypeIcon', operationFluxTypeIcon);

  /** @ngInject */
  function operationFluxTypeIcon() {
    var directive = {
      restrict: 'E',
      scope: {
        fluxType: '='
      },
      replace: true,
      templateUrl: 'app/directives/custom/operation-flux-type/operation-flux-type.html',
      link: function (scope, element, attrs) {
        var vm = this;
        vm.fluxTypeList = scope.fluxType;
      }
    };
    return directive;
  }
})();
