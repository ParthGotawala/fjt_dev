(function () {
  'use strict';

  angular
    .module('app.admin.componentpricebreakdetails')
    .factory('ComponentPriceBreakDetailsFactory', ComponentPriceBreakDetailsFactory);

  /** @ngInject */

  function ComponentPriceBreakDetailsFactory($resource, CORE) {
    return {
      getComponentPriceBreakDetailsList: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/:id',
        {
          id: '@_id'
        },
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        }),
      retrieveComponentPriceBreakDetailsList: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/retrieveComponentPriceBreakDetailsList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deletePriceBreakDetails: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/deletePriceBreakDetails', {
        objIDs: '@_objIDs'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveAssySalesPrice: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/saveAssySalesPrice', {
        salesPriceObj: '@_salesPriceObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssySalesPriceListByAssyId: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/getAssySalesPriceListByAssyId', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getSalesCommissionDetailsFromRfq: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/getSalesCommissionDetailsFromRfq', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getSalesCommissionHistoryList: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/getSalesCommissionHistoryList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSalesCommissionHistoryDetList: () => $resource(CORE.API_URL + 'componentPriceBreakDetails/getSalesCommissionHistoryDetList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
