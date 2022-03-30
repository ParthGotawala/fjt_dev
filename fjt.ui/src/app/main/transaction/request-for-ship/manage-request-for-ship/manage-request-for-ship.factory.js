(function () {
    'use strict';

    angular
        .module('app.transaction.requestforship')
        .factory('ManageRequestForShipFactory', ManageRequestForShipFactory);

    /** @ngInject */
    function ManageRequestForShipFactory($resource, CORE) {
        return {
            
            saveShippingRequestDet: (param) => $resource(CORE.API_URL + 'shippingrequestdet/saveShippingRequestDet', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            deleteRequestForShip: () => $resource(CORE.API_URL + 'shippingrequestdet/deleteRequestForShip/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'DELETE'
                }
            }),
            saveShippingRequestEmpDet: (param) => $resource(CORE.API_URL + 'shippingrequestempdet/saveShippingRequestEmpDet', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getShippingRequestEmpDet: () => $resource(CORE.API_URL + 'shippingrequestempdet/getShippingRequestEmpDet/:shippingRequestID', {
                shippingRequestID: '@_shippingRequestID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            deleteShippingRequestEmpDet: () => $resource(CORE.API_URL + 'shippingrequestempdet/deleteShippingRequestEmpDet/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'DELETE'
                }
            }),
            ackShippingRequestEmpDet: () => $resource(CORE.API_URL + 'shippingrequestempdet/ackShippingRequestEmpDet', {                
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            })
        }
    }
})();
