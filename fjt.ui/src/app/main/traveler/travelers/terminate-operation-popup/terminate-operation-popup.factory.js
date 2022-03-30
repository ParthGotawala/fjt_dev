(function () {
    'use strict';

    angular.module('app.traveler.travelers').factory('TerminateOperationPopupFactory', TerminateOperationPopupFactory);

    /** @ngInject */
    function TerminateOperationPopupFactory($resource, CORE) {
        return {
            getWorkorderQtyDetail: (param) =>  $resource(CORE.API_URL + 'workordertransfer/getWorkorderQtyDetail/:woID/:woOPID', {
                woID: '@_woID',
                woOPID: '@_woOPID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getWorkorderOperationDetail: (param) =>  $resource(CORE.API_URL + 'workordertransfer/getWorkorderOperationDetail/:woID', {
                woID: '@_woID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveTransferWorkorderDetail: (param) =>  $resource(CORE.API_URL + 'workordertransfer/saveTransferWorkorderDetail', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getWorkorderTransferDetail: (param) =>  $resource(CORE.API_URL + 'workordertransfer/getWorkorderTransferDetail/:woID', {
                woID: '@_woID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            })
        }
    }
})();