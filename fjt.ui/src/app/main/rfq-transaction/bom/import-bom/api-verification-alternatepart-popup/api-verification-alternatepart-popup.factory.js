(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('APIVerificationAlternatePopupFactory', APIVerificationAlternatePopupFactory);

    /** @ngInject */
    function APIVerificationAlternatePopupFactory($resource, CORE) {
        return {
            getApiVerifiedAlternateParts: (param) =>  $resource(CORE.API_URL + 'rfqlineitems/getApiVerifiedAlternateParts/:rfqAssyID', {
                rfqAssyID: '@_rfqAssyID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveGoodBadPartMapping: () => $resource(CORE.API_URL + 'component/saveGoodBadPartMapping', {
                goodBadPartOBj: '@_goodBadPartOBj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }
})();