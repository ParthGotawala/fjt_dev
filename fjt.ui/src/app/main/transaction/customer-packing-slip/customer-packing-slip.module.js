(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_ROUTE,
      views: {
        'summarylist': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_DETL_ROUTE,
      views: {
        'detaillist': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_ROUTE,
      views: {
        'details': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_ROUTE,
      views: {
        'documents': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_ROUTE,
      views: {
        'misc': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    });
  }
})();
