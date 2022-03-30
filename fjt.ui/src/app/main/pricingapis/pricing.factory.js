(function () {
  'use strict';

  angular
    .module('app.pricing')
    .factory('PricingFactory', PricingFactory);

  /** @ngInject */
  function PricingFactory($resource, CORE) {
    return {
      getDigikeyAccessToken: () => $resource(CORE.API_URL + 'pricing/getDigikeyAccessToken/:code', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getAndUpdateAccessToken: () => $resource(CORE.API_URL + 'pricing/getAndUpdateAccessToken/:code', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getDigikeyExternalCardential: () => $resource(CORE.API_URL + 'pricing/getDigikeyExternalCardential/:appID', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getAndUpdateAccessTokenExternalDK: () => $resource(CORE.API_URL + 'pricing/getAndUpdateAccessTokenExternalDK', { setting: '@_setting' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDigikeyPartDetail: () => $resource(CORE.API_URL + 'pricing/getPartDetail', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getPartDetailVersion3: () => $resource(CORE.API_URL + 'pricing/getPartDetailVersion3', {
        pricingObj: '@_pricingObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAvnetPartDetail: () => $resource(CORE.API_URL + 'pricing/getAvnetPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getNewarkPartDetail: () => $resource(CORE.API_URL + 'pricing/getNewarkPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getMouserPartDetail: () => $resource(CORE.API_URL + 'pricing/getMouserPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getArrowPartDetail: () => $resource(CORE.API_URL + 'pricing/getArrowPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getTTIPartDetail: () => $resource(CORE.API_URL + 'pricing/getTTIPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getOctoPartDetail: () => $resource(CORE.API_URL + 'pricing/getOctoPartDetail', { pricingObj: '@_pricingObj'}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPackingSlipDetails: () => $resource(CORE.API_URL + 'pricing/getPackingSlipDetails/:salesorderID', { salesorderID: '@_salesorderID' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getHeilindPartDetail: () => $resource(CORE.API_URL + 'pricing/getHeilindPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getMouserJsonPartDetail: () => $resource(CORE.API_URL + 'pricing/getMouserJsonPartDetail', { pricingObj: '@_pricingObj' }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
