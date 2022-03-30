(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('APIVerificationErrorPopupFactory', APIVerificationErrorPopupFactory);

    /** @ngInject */
    function APIVerificationErrorPopupFactory($resource, CORE) {
        return {
            getAPIVerificationErrors: (param) =>  $resource(CORE.API_URL + 'rfqlineitems/getAPIVerificationErrors', {
                objApiError: '@_objApiError'
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            removebomstatus: (param) =>  $resource(CORE.API_URL + 'rfqlineitems/removebomstatus/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            
      }
    }
})();