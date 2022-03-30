(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('copyText', copyText);

  /** @ngInject */
  function copyText() {
    var directive = {
      restrict: 'E',
      scope: {
        label: '=',
        text: '=',
        hideCopyTooltip: '=?'
      },
      templateUrl: 'app/directives/custom/copy-text/copy-text.html',
      link: function (scope) {
        scope.copyText = ($event, item) => {
          $event.stopPropagation();
          copyTextForWindow(item);
          scope.showstatus = true;
        };
        scope.checkStatus = () => {
          scope.showstatus = false;
        };
      }
    };
    return directive;
  }
})();



