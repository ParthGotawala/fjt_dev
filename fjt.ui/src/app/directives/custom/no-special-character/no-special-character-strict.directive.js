(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('noSpecialCharacterStrict', noSpecialCharacterStrict);

    /** @ngInject */
    function noSpecialCharacterStrict() {
        function link($scope, $element, attrs, ngModel) {
            ngModel.$parsers.push(function (viewValue) {
                let reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/;
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