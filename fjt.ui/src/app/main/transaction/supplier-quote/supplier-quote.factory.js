(function () {
  'use strict';

  angular.module('app.transaction').factory('SupplierQuoteFactory', SupplierQuoteFactory);
  /** @ngInject */
  function SupplierQuoteFactory($resource, CORE) {
    return {
      isPricingChange: false,
      retrieveSupplierQuoteList: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuoteList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveSupplierQuotePartList: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuotePartList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getSupplierQuoteByID: () => $resource(CORE.API_URL + 'supplierQuote/getSupplierQuoteByID/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      manageSupplierQuoteDetail: () => $resource(CORE.API_URL + 'supplierQuote/manageSupplierQuoteDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveSupplierQuotePartDetail: () => $resource(CORE.API_URL + 'supplierQuote/saveSupplierQuotePartDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteSupplierQuote: () => $resource(CORE.API_URL + 'supplierQuote/deleteSupplierQuote', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteSupplierQuotePartDetail: () => $resource(CORE.API_URL + 'supplierQuote/deleteSupplierQuotePartDetail', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkUniqueSupplierQuoteNumber: () => $resource(CORE.API_URL + 'supplierQuote/checkUniqueSupplierQuoteNumber', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkUniqueSupplierQuotePart: () => $resource(CORE.API_URL + 'supplierQuote/checkUniqueSupplierQuotePart', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getSupplierQuotePartPriceHeaderDetails: () => $resource(CORE.API_URL + 'supplierQuote/getSupplierQuotePartPriceHeaderDetails/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retrieveSupplierQuotePartPricingDetails: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuotePartPricingDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getSupplierQuoteNumberList: () => $resource(CORE.API_URL + 'supplierQuote/getSupplierQuoteNumberList', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveSupplierQuotePartPricingDetails: () => $resource(CORE.API_URL + 'supplierQuote/saveSupplierQuotePartPricingDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      importSupplierQuotePartPricingDetails: () => $resource(CORE.API_URL + 'supplierQuote/importSupplierQuotePartPricingDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      copySupplierQuote: () => $resource(CORE.API_URL + 'supplierQuote/copySupplierQuote', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkSupplierQuoteQuoteNumberAndPartID: () => $resource(CORE.API_URL + 'supplierQuote/checkSupplierQuoteQuoteNumberAndPartID', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkSupplierQuotePartDetailLinePricingAttributes: () => $resource(CORE.API_URL + 'supplierQuote/checkSupplierQuotePartDetailLinePricingAttributes', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveSupplierQuoteAttributes: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuoteAttributes', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveSupplierQuotePartPricingHistory: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuotePartPricingHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      removeSupplierQuotePartPricingLines: () => $resource(CORE.API_URL + 'supplierQuote/removeSupplierQuotePartPricingLines', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkSupplierQuotePartPricingValidations: () => $resource(CORE.API_URL + 'supplierQuote/checkSupplierQuotePartPricingValidations', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveSupplierAttributeTemplate: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierAttributeTemplate', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveSupplierQuotePartPricingWhereUsed: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuotePartPricingWhereUsed', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveSupplierQuoteNegotiatePriceDetails: () => $resource(CORE.API_URL + 'supplierQuote/saveSupplierQuoteNegotiatePriceDetails', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getSupplierList: () => $resource(CORE.API_URL + 'supplierQuote/getSupplierList', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      retrieveSupplierQuotePricingDetailsByPartID: () => $resource(CORE.API_URL + 'supplierQuote/retrieveSupplierQuotePricingDetailsByPartID', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      checkInActivePartOfSupplierQuote: () => $resource(CORE.API_URL + 'supplierQuote/checkInActivePartOfSupplierQuote', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
