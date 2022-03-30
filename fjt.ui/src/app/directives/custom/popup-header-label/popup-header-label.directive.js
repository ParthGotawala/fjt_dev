(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('popupHeaderLabel', popupHeaderLabel);

  /** @ngInject */
  function popupHeaderLabel() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        labelData: '='
      },
      templateUrl: 'app/directives/custom/popup-header-label/popup-header-label.html',
      controller: labelHeaderCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function labelHeaderCtrl($scope) {
      $scope.$watch('labelData', (newValue) => {
        $scope.headerData = newValue;
      });
    }
  }
})();
