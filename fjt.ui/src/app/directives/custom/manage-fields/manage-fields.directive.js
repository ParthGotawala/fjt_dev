(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('manageFields',manageFieldsDirective);

    /** @ngInject */
    function manageFieldsDirective(BaseService) {
        return {
            restrict: 'E',
            scope: {
               entityId: '=',
            },
            templateUrl: 'app/directives/custom/manage-fields/manage-fields.html',
            controllerAs: 'vm',
            controller: function ($scope, $element, $attrs) {
                var vm = this;
                //redirect to element manage page
                vm.moveToDataFields = () => {
                    if ($scope.entityId) {
                        BaseService.goToElementManage($scope.entityId);
                    }
                }
            }
        };
        return directive;
    }
})();