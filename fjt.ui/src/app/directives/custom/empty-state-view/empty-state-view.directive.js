(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('emptyStateView', emptyStateView);

    /** @ngInject */
    function emptyStateView($state, CORE) {
        var directive = {
            restrict: 'E',
            scope: {
                emptyStateDetail: "=?",
                name:"=?"
            },
            templateUrl: 'app/directives/custom/empty-state-view/empty-state-view.html',
            link: function (scope, element, attrs) {
                //let emptyState = angular.copy(CORE.EMPTYSTATE.COMMON);
                //emptyState.MESSAGE = stringFormat(emptyState.MESSAGE, scope.name);
                //scope.emptyStateDetail = scope.emptyStateDetail ? scope.emptyStateDetail : emptyState;
            },
        };
        return directive;
    }
})();



