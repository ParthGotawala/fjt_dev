(function () {
    'use strict';

    angular
        .module('app.helperpage')
        .controller('ComingSoonController', ComingSoonController);

    /** @ngInject */
    function ComingSoonController($scope, $interval, $mdSidenav, $timeout, BaseService, HELPER_PAGE) {
        var vm = this;
        vm.EmptyMesssage = HELPER_PAGE.HELPER_PAGE_EMPTYSTATE.COMING_SOON;
    }
})();