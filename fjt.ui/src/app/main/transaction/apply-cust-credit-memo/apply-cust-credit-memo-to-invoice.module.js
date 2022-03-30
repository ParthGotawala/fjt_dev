(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomercreditmemo', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE, {
      url: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        },
        'tabContent@app.transaction.applycustomercreditmemo': {
          templateUrl: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_VIEW,
          controller: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }, data: {
        autoActivateChild: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE
      }
    }).state(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_STATE, {
      url: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_ROUTE,
      views: {
        'summary': {
          templateUrl: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_VIEW,
          controller: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_SUMMARY_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_STATE, {
      url: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_ROUTE,
      views: {
        'detail': {
          templateUrl: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_VIEW,
          controller: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_DETAIL_LIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_STATE, {
      url: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, {
      url: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_ROUTE,
      views: {
        'details': {
          templateUrl: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_VIEW,
          controller: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_STATE, {
      url: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_ROUTE,
      views: {
        'documents': {
          templateUrl: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_VIEW,
          controller: TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    });
  }
})();
