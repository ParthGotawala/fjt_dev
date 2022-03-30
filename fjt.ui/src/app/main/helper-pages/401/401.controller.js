(function () {
  'use strict';

  angular
    .module('app.helperpage')
    .controller('UnauthorizedController', UnauthorizedController);

  /** @ngInject */
  function UnauthorizedController($scope, CORE, $interval, $state, $stateParams, $mdSidenav, $timeout, BaseService, USER, UnauthorizedFactory, HELPER_PAGE, $sce) {
    var vm = this;
    vm.pageRoute = $stateParams.pageRoute;
    if (vm.pageRoute) {
      vm.cgBusyLoading = UnauthorizedFactory.getPageName().query({ pageRoute: vm.pageRoute }).$promise.then((response) => {
        if (response && response.data && Array.isArray(response.data)) {
          vm.pageName = response.data[0].pageTreeMenu;
          vm.message = stringFormat(HELPER_PAGE.ERROR401.MESSAGE, vm.pageName ? vm.pageName : "this");
        }
      });
    } else {
      console.log("logout from UnauthorizedController");
      return $state.go(CORE.LOGIN_STATE, {}, { reload: true });
    }
    vm.EmptyMesssage = HELPER_PAGE.ERROR401;
    vm.Logout = () => {
      console.log("logout from Logout");
      BaseService.logout();
    };

    angular.element(() => {
      $timeout(() => {
        $("#viewRolePage").click(() => {
          var loginUser = BaseService.loginUser;
          var userid = loginUser && loginUser.employee ? loginUser.employee.id : null;
          BaseService.openInNew(USER.ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_STATE, { id: userid });
        });
      }, _configTimeout);
    });
  }
})();
