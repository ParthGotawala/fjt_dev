(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('checkUniqueOnBlur', checkUniqueOnBlur);

    /** @ngInject */
    function checkUniqueOnBlur($state) {
        var directive = {
            restrict: 'E',
            scope: {
                label: "=",
                text: '='
            },
            replace:true,
            templateUrl: 'app/directives/custom/check-unique-on-blur/check-unique-on-blur.html',
            link: function (scope, element, attrs) {
            },
        };
        return directive;
    }
})();



