(function () {
    'use strict';

    angular.module('app.traveler.travelers').factory('TerminateOperationHistoryPopupFactory', TerminateOperationHistoryPopupFactory);

    /** @ngInject */
    function TerminateOperationHistoryPopupFactory($resource, CORE) {
        return {           
            getWorkorderTransferHistory: (param) =>  $resource(CORE.API_URL + 'workordertransfer/getWorkorderTransferHistory/:woOPID', {
                woOPID: '@_woOPID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            })
        }
    }
})();