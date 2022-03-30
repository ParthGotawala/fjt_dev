(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_SALESORDER_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_ROUTE,
      params: {
        listType: '0' //0- for sales order list
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_ROUTE,
      params: {
        listType: '0' //0- for sales order list
      },
      views: {
        'detail': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_ROUTE,
      params: {
        listType: '0' //0- for sales order list
      },
      views: {
        'partdetail': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_SALESORDER_MAIN_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_MAIN_ROUTE,
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_ROUTE,
      views: {
        'details': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_ROUTE,
      views: {
        'documents': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_SALESORDER_MISC_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_MISC_ROUTE,
      views: {
        'misc': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_MISC_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_MISC_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_ROUTE,
      params: {
        listType: '1'
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_DETAIL_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_DETAIL_ROUTE,
      params: {
        listType: '1' //1- for pending csp
      },
      views: {
        'detail': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    }).state(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_PART_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_PO_PART_ROUTE,
      params: {
        listType: '1' //1- for pending csp
      },
      views: {
        'partdetail': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
