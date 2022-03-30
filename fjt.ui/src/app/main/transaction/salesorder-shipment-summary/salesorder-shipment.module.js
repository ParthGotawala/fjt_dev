(function () {
  'use strict';

  angular
    .module('app.transaction.salesordershipmentmain', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_STATE, {
      url: TRANSACTION.TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_ROUTE,
      params: {},
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
    $stateProvider.state(TRANSACTION.TRANSACTION_MATERIALMGMT_SHIPMENT_SUMMARY_STATE, {
      url: TRANSACTION.TRANSACTION_MATERIALMGMT_SHIPMENT_SUMMARY_ROUTE,
      params: {},
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_VIEW,
          controller: TRANSACTION.TRANSACTION_SALESORDER_SHIPMENT_SUMMARY_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }
})();
