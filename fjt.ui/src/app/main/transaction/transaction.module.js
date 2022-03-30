(function () {
  'use strict';

  angular
    .module('app.transaction',
      [
        'app.transaction.salesorder',
        'app.transaction.supplierquote',
        'app.transaction.shipped',
        'app.transaction.receivingmaterial',
        'app.transaction.requestforship',
        'app.transaction.inhouseassemblystock',
        'app.transaction.warehousebin',
        'app.transaction.transferstock',
        'app.transaction.packingSlip',
        'app.transaction.kitAllocation',
        'app.transaction.reserveStockRequest',
        'app.transaction.purchase',
        'app.transaction.supplierInvoice',
        'app.transaction.rack',
        'app.transaction.customerpacking',
        'app.transaction.stockadjustment',
        'app.transaction.customerinvoice',
        'app.transaction.boxserialnumbers',
        'app.transaction.searchMaterial',
        'app.transaction.supplierRMA',
        'app.transaction.purchaseorder',
        'app.transaction.customerpayment',
        'app.transaction.applycustomercreditmemo',
        'app.transaction.applycustomerwriteoff',
        'app.transaction.customerrefund',
        'app.transaction.salesordershipmentmain',
        'app.transaction.manualentry',
        'app.transaction.kitlist'
      ]
    )
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION) {
    $stateProvider.state(TRANSACTION.TRANSACTION_STATE, {
      url: TRANSACTION.TRANSACTION_ROUTE,
      views: {
        'content@app': {
          template: '<div ui-view></div>'
        }
      }
    });
  }
})();
