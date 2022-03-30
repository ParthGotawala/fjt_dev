(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('umidLineitemList', umidLineitemList);

    /** @ngInject */
    function umidLineitemList(CORE, $state, BaseService, $compile) {
        var directive = {
            restrict: 'E',
            scope: {
                selectLineitemList: "=",
                setUmidLineitem: "&",
                isVerify: "="
            },
            link: function (scope, element, attrs) {
                scope.LabelConstant = CORE.LabelConstant;
            },
            templateUrl: 'app/directives/custom/umid-lineitem-list/umid-lineitem-list.html',
        };
        return directive;
    }
})();