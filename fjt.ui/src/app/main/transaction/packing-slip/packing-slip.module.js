(function () {
    'use strict';

    angular
      .module('app.transaction.packingSlip', [])
      .config(config);

    /** @ngInject */
    function config($stateProvider, TRANSACTION, CORE) {
        // State
      $stateProvider.state(TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_STATE, {
        url: TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_ROUTE,
        params: {
          type: TRANSACTION.PackingSlipTabType.PackingSlip
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_VIEW,
            controller: TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, {
        url: TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_ROUTE,
        params: {
          slipType: TRANSACTION.PackingSlipTabType.PackingSlip
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_VIEW,
            controller: TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
        //.state(TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_STATE, {
        //    url: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_ROUTE,
        //    params: {
        //        type: TRANSACTION.PackingSlipTabType.InvoiceVerification
        //    },
        //    views: {
        //        'content@app': {
        //            templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
        //            controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    },
        //})
        //.state(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, {
        //    url: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_ROUTE,
        //    params: {
        //        slipType: TRANSACTION.PackingSlipTabType.PackingSlip
        //    },
        //    views: {
        //        'content@app': {
        //            templateUrl: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_VIEW,
        //            controller: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //})
    }

})();
