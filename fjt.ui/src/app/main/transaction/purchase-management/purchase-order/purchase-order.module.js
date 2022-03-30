(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      //data: {
      //  autoActivateChild: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE
      //}
    }).state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_ROUTE,
      views: {
        'detail': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_ROUTE,
      views: {
        'partdetail': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE,
      views: {
        'details': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_ROUTE,
      views: {
        'documents': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_STATE, {
      url: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_ROUTE,
      views: {
        'misc': {
          templateUrl: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_VIEW,
          controller: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    });
  }
})();
