(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('formInputFields', formInputFields);

  /** @ngInject */
  function formInputFields(CORE) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        id: '@',
        valueId: '@'
      },
      templateUrl: 'app/directives/custom/form-input-fields/form-input-fields.html',
      link: link,
      controller: formInputFieldsCtrl
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for text-angular define before load directive
    *
    * @param
    */
    function formInputFieldsCtrl($scope) {
      $scope.taToolbar = CORE.Toolbar;
      $scope.InputeFieldKeys = CORE.InputeFieldKeys;
    }

    /** @ngInject */
    /**
    * Directive link
    *
    * @param
    */
    function link($scope) {
      var vm = $scope;
    }
  }
})();
