(function () {
    'use strict';

    angular
        .module('app.helperpage')
        .controller('ApiAccessController', ApiAccessController);

    /** @ngInject */
    function ApiAccessController(BaseService, HELPER_PAGE) {
        var vm = this;
        vm.EmptyMesssage = HELPER_PAGE.ERROR501;
      vm.Logout = () => {
        // console.log('Logout');
        console.log("logout from Logout");
        BaseService.logout();
      };
    }
})();
