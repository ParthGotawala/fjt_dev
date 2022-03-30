(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($rootScope, $state, $timeout, CORE, DASHBOARD, BaseService, WORKORDER, USER, OPERATION, REPORTS, TASK, TRANSACTION, TRAVELER,
    RFQTRANSACTION, MasterFactory, WIDGET, CONFIGURATION) {
    const vm = this;
    $rootScope.pageTitle = 'Login';

    if (BaseService.loginUser && vm.isRedirectDashboard) {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      return;
    }

    //If login page open then on load close all panel
    $timeout(function () {
      $rootScope.$broadcast('ClosePanel', { isLoginPage: true });
    });

    //vm.state = DASHBOARD.DASHBOARD_STATE;
    if ($rootScope.previousState) {
      vm.state = $rootScope.previousState;
    }

    const loadMessageConstantData = () => {
      vm.cgBusyLoading = MasterFactory.getAllModuleDynamicMessages().query().$promise.then((response) => {
        if (response.data && response.data.dynamicMessageList) {
          CORE.MESSAGE_CONSTANT = _.assign(CORE.MESSAGE_CONSTANT, response.data.dynamicMessageList.CORE);
          WORKORDER = _.assign(WORKORDER, response.data.dynamicMessageList.WORKORDER);
          USER = _.assign(USER, response.data.dynamicMessageList.USER);
          OPERATION = _.assign(OPERATION, response.data.dynamicMessageList.OPERATION);
          REPORTS = _.assign(REPORTS, response.data.dynamicMessageList.REPORTS);
          TASK = _.assign(TASK, response.data.dynamicMessageList.TASK);
          TRANSACTION = _.assign(TRANSACTION, response.data.dynamicMessageList.TRANSACTION);
          TRAVELER = _.assign(TRAVELER, response.data.dynamicMessageList.TRAVELER);
          RFQTRANSACTION = _.assign(RFQTRANSACTION, response.data.dynamicMessageList.RFQTRANSACTION);
          WIDGET = _.assign(WIDGET, response.data.dynamicMessageList.WIDGET);
          CONFIGURATION = _.assign(CONFIGURATION, response.data.dynamicMessageList.CONFIGURATION);
        }
      }).catch((error) => { BaseService.getErrorLog(error); });

      // added for dynamic message configuration
      vm.cgBusyLoading = MasterFactory.getAllCategoryDynamicMessages().query().$promise.then((response) => {
        if (response.data && response.data.dynamicMessageList) {
          CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE = _.assign(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE, response.data.dynamicMessageList);
        }
      }).catch((error) => { BaseService.getErrorLog(error); });
    };

    loadMessageConstantData();
  }
})();
