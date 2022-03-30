(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('umidFeederList', umidFeederList);

    /** @ngInject */
    function umidFeederList(CORE, $state, BaseService, $compile) {
        var directive = {
            restrict: 'E',
            scope: {
                selectFeederList: "=",
                setFeederLocation: "&",
                isVerify: "="
            },
            link: function (scope, element, attrs) {
                scope.LabelConstant = CORE.LabelConstant;
            },
            templateUrl: 'app/directives/custom/umid-feeder-list/umid-feeder-list.html',
        };
        return directive;
    }
})();