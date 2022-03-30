(function () {
  'use strict';
  angular
    .module('app.transaction.supplierquote', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_STATE, {
      url: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_VIEW,
          controller: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, {
      url: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_VIEW,
          controller: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_DOCUMENTS_STATE, {
      url: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_DOCUMENTS_ROUTE,
      params: {
        selectedTab: TRANSACTION.SupplierQuoteTabs.Documents.Name
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_VIEW,
          controller: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_STATE, {
      url: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_ROUTE,
      views: {
        'summarylist': {
          templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_VIEW,
          controller: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_SUMMARYLIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_STATE, {
      url: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_ROUTE,
      views: {
        'detaillist': {
          templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_VIEW,
          controller: TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_DETAILLIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    });
  }
})();
