(function () {
    'use strict';

    //angular.module('app.core').directive('draggable', ['$timeout',
    //  /** @ngInject */
    //function ($timeout) {
    //    return {
    //        restrict: 'A',
    //        replace: true,
    //        scope: {

    //        },
    //         /** @ngInject */
    //        controller: ($scope, $element, $attrs) => {
    //            $element.draggable({
    //                cursor: "move",
    //                containment: "parent"
    //            });
    //        }
    //    }
    //}])

    angular
      .module('app.core')
      .directive('draggable', draggable);
    /** @ngInject */
    function draggable($timeout) {
        var directive = {
            restrict: 'A',
            replace: true,
            scope: {

            },
            controller: draggablectrl
        };
        return directive;
        /** @ngInject */
        function draggablectrl($scope, $element, $attrs) {
            //angular.element(document).ready(function () {
            $timeout(function () {
                $element.draggable({
                    handle: "md-toolbar,md-dialog-actions",
                    cursor: "move",
                    containment: "parent"
                });
            }, _configWOTimeout);
            //});
        }
    }
})();
