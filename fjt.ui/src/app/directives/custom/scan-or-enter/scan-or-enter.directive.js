(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('scanOrEnter', scanOrEnter);

  /** @ngInject */
  function scanOrEnter($state) {
    var directive = {
      restrict: 'E',
      scope: {
        label: "=",
        text: '='
      },
      replace: true,
      templateUrl: 'app/directives/custom/scan-or-enter/scan-or-enter.html',
      link: function (scope, element, attrs) {
      },
    };
    return directive;
  }
})();



