(function () {
    'use strict';

    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope, BaseService, $rootScope) {
        var vm = this;

        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        //vm.PinMenu = (obj) => {
        //    $rootScope.IsPinned = !$rootScope.IsPinned;
        //}
        let isPin;
        vm.PinMenu = (obj) => {
            $rootScope.IsPinned = !$rootScope.IsPinned;
            $scope.addcls = $rootScope.IsPinned ? "pin-is-add" : "pin-is-remove";
            BaseService.setDashboardPin($rootScope.IsPinned);
        }

        let getDashboardPin = () => {
            isPin = BaseService.getDashboardPin();
            if (isPin) {
                $rootScope.IsPinned = true;
                $scope.addcls = "pin-is-add";
            }
            else {
                $rootScope.IsPinned = false;
                $scope.addcls = "pin-is-remove";
            }
        }
        getDashboardPin();

        //////////

        /**
         * Toggle folded status
         */
        let toggleMsNavigationFolded = () => {
            vm.folded = !vm.folded;
        }

        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $scope.IsManageDataElement = false;
            BaseService.currentRoute = toState.name;
            if (toState.name.indexOf('elementmanage') > -1) {
                $rootScope.IsManageDataElement = true;
            }
            else {
                $rootScope.IsManageDataElement = false;
            }
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });

        $rootScope.$on('toogleMenu', function (event, data) {
            toggleMsNavigationFolded();
        });
    }

})();