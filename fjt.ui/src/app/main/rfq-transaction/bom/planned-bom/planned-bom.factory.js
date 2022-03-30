(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .factory('PlannedBOMFactory', PlannedBOMFactory);

  /** @ngInject */
  function PlannedBOMFactory($resource, CORE) {
    return {
      updateVerifyBOM: (param) => $resource(CORE.API_URL + 'rfqlineitems/updateVerifyBOM', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      //not in use
      copyVerifiedBOM: (param) => $resource(CORE.API_URL + 'rfqlineitems/copyVerifiedBOM', {
      }, {
        query: {
          isArray: false,
          params: param,
          method: 'POST'
        }
      }),
      //not in use
      updatePricingStatus: (param) => $resource(CORE.API_URL + 'rfqAssemblies/updatePricingStatus', {
        id: '@_id',
      }, {
        query: {
          isArray: false,
          params: param,
          method: 'POST'
        }
      }),
      getAssyBOMList: (param) => $resource(CORE.API_URL + 'rfqAssyBOM/getAssyBOMList', {},
        {
          query: {
            isArray: false,
            method: 'GET',
            params: param ? {
              rfqAssyID: param && param.rfqAssyID ? param.rfqAssyID : null
            } : null
          }
        }),
      getConsolidateLineItems: (param) => $resource(CORE.API_URL + 'rfqlineitems/getConsolidateLineItems/:rfqAssyID', { rfqAssyID: '@_rfqAssyID' },
        {
          query: {
            isArray: false,
            method: 'GET',
          }
        }),
      updateReadyForPricingAssy: () => $resource(CORE.API_URL + 'rfqlineitems/updateReadyForPricingAssy', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
