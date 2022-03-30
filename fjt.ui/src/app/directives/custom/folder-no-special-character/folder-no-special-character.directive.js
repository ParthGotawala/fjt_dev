(function () {
    'use strict';
    angular
        .module('app.core')
      .directive('folderNoSpecialCharacter', folderNoSpecialCharacter);

    /** @ngInject */
  function folderNoSpecialCharacter() {
        function link($scope, $element, attrs, ngModel) {
          ngModel.$parsers.push(function (viewValue) {
              /* ^\\/:*?"<>|  >>> this all not allowed in folder creation
                  #  >>> this stop access/load any url from angularjs */
                let reg = /^[^\\/:*?"<>|#]*$/;
                // if view values matches regexp, update model value
                if (viewValue && viewValue.match(reg)) {
                    return viewValue;
                }
                // keep the model value as it is
                if (viewValue) {
                    let transformedValue = ngModel.$modelValue;
                    ngModel.$setViewValue(transformedValue);
                    ngModel.$render();
                    return transformedValue;
                } else {
                    return null;
                }
                
            });
        }

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
        return directive;
    }
})();
