(function () {
  'use strict';

  angular
    .module('app.admin.transactionmodes', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_TRANSACTION_MODES_METHODS_STATE, {
      url: USER.ADMIN_TRANSACTION_MODES_METHODS_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_TRANSACTION_MODES_VIEW,
          controller: USER.ADMIN_TRANSACTION_MODES_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      data: {
        autoActivateChild: USER.ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_STATE
      }
    });

    $stateProvider
      .state(USER.ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_STATE, {
        url: USER.ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_ROUTE,
        params: {
          tabName: USER.TransactionModesTabs.Payable.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_TRANSACTION_MODES_VIEW,
            controller: USER.ADMIN_TRANSACTION_MODES_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_STATE, {
        url: USER.ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGE_TRANSACTION_MODES_VIEW,
            controller: USER.ADMIN_MANAGE_TRANSACTION_MODES_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_STATE, {
        url: USER.ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_ROUTE,
        params: {
          tabName: USER.TransactionModesTabs.Receivable.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_TRANSACTION_MODES_VIEW,
            controller: USER.ADMIN_TRANSACTION_MODES_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(USER.ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_STATE, {
        url: USER.ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGE_TRANSACTION_MODES_VIEW,
            controller: USER.ADMIN_MANAGE_TRANSACTION_MODES_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }
})();
