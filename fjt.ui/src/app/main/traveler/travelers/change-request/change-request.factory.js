(function () {
    'use strict';

    angular.module('app.traveler.travelers').factory('ChangeRequestFactory', ChangeRequestFactory);

    /** @ngInject */
    function ChangeRequestFactory($resource, CORE) {
        return {
            getWorkorderOperationDetails: () => $resource(CORE.API_URL + 'workorder_request_for_review/getWorkorderOperationDetails/:woID/:opID', {
                woID: '@_woID',
                opID: '@_opID'
            },
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveChangeRequest: () => $resource(CORE.API_URL + 'workorder_request_for_review', {
            },
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            })
        }
    }
})();