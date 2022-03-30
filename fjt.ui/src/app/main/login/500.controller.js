(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('InternalServerErrorController', InternalServerErrorController);

  /** @ngInject */
  function InternalServerErrorController($scope, CORE, $state, $stateParams, $timeout, BaseService, HELPER_PAGE) {
    var vm = this;
    vm.EmptyMesssage = HELPER_PAGE.ERROR501;
    vm.message = $stateParams.errorMessage && $stateParams.errorMessage !== 'true'? $stateParams.errorMessage : HELPER_PAGE.ERROR501.MESSAGE;

    if ($stateParams.errorMessage) {
      _.find(CORE.OIDC_CLIENT_RESPONSE_MESSAGES, (resMessage) => {
        if (resMessage.KEY === $stateParams.errorMessage) {
          vm.message = resMessage.DISPLAY_MESSAGE;
        }
      });
    }

    vm.Logout = () => {
      console.log('logout from Logout.');
      BaseService.logout();
    };

    vm.Login = () => {
      BaseService.loginIDS();
    };

    angular.element(() => {
      vm.isUserLoggedIn = JSON.parse(localStorage.getItem('loginuser')) ? true : false;
    });
  }
})();
