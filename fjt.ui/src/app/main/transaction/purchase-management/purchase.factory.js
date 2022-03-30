(function () {
  'use strict';

  angular.module('app.transaction.purchase').factory('PurchaseFactory', PurchaseFactory);
  /** @ngInject */
  function PurchaseFactory($resource, CORE) {
    return {

      getPurchaseList: () => $resource(CORE.API_URL + 'purchase/getPurchaseList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      kitAllocationAssyList: () => $resource(CORE.API_URL + 'purchase/kitAllocationAssyList/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),

      getPurchaseConsolidatedList: () => $resource(CORE.API_URL + 'purchase/getPurchaseConsolidatedList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getPurchasePIDcodeSearch: () => $resource(CORE.API_URL + 'purchase/getPurchasePIDcodeSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createPurchaseParts: () => $resource(CORE.API_URL + 'purchase/createPurchaseParts', {
        purchaseObj: '@_purchaseObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchasePartsDetailList: () => $resource(CORE.API_URL + 'purchase/getPurchasePartsDetailList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      updatePurchasePartsDetails: () => $resource(CORE.API_URL + 'purchase/updatePurchasePartsDetails/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      deletePurchasePartsDetails: () => $resource(CORE.API_URL + 'purchase/deletePurchasePartsDetails', {
        purchaseObj: '@_purchaseObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getComponnetMfgDescription: () => $resource(CORE.API_URL + 'purchase/getComponnetMfgDescription/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getPONumberSearch: () => $resource(CORE.API_URL + 'purchase/getPONumberSearch', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPurchaseSelectedPartsList: () => $resource(CORE.API_URL + 'purchase/getPurchaseSelectedPartsList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      savePurchasePrice: () => $resource(CORE.API_URL + 'purchase/savePurchasePrice', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
