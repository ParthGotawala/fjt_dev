(function () {
    'use strict';

    angular
       .module('app.core')
       .controller('CoreController', CoreController);

    /** @ngInject */
    function CoreController($scope, $rootScope, BaseService) {

        // ms-navigation directive will emit data when breadcrumb found on page reload
        $scope.$on('msNavigation.breadcrumb', function () {
            $scope.$broadcast('breadcrumb');
        });
    }
})();