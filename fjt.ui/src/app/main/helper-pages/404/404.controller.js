(function () {
    'use strict';

    angular
        .module('app.helperpage')
        .controller('NotfoundController', NotfoundController);

    /** @ngInject */
    function NotfoundController($scope, $interval, $mdSidenav, $timeout, BaseService, HELPER_PAGE) {
        var vm = this;
        vm.EmptyMesssage = HELPER_PAGE.ERROR404;
        vm.Logout = () => {
            // console.log('Logout');
            console.log("logout from Logout");
            BaseService.logout();
        }
    }
})();
