(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        },
        'tabContent@app.transaction.customerpayment': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }, data: {
        autoActivateChild: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE
      }
    })
      .state(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_ROUTE,
        views: {
          'summary': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_SUMMARY_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      })
      .state(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_ROUTE,
        views: {
          'detail': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      })
      .state(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_MANAGE_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_ROUTE,
        params: {
          packingSlipNumber: null
        },
        views: {
          'details': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_ROUTE,
        views: {
          'documents': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      });
  }
})();
