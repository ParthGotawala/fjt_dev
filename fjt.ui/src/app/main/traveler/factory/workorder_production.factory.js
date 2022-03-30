(function () {
    'use strict';

    angular
        .module('app.traveler')
        .factory('WorkorderTransProductionFactory', WorkorderTransProductionFactory);

    /** @ngInject */
    function WorkorderTransProductionFactory($resource, CORE) {
        return {
            workorder_trans_production: (param) =>  $resource(CORE.API_URL + 'workorder_trans_production/:id', {
                id: '@_id'
            }, {
                query: {
                },
                update: {
                    method: 'PUT',
                },
            }),

            retrieveWorkorderTransactionDetails: () => $resource(CORE.API_URL + 'workorder_trans_production/retrieveWorkorderTransactionDetails', {
                operationObj: '@_operationObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            retrieveWorkorderTransReadyStock: () => $resource(CORE.API_URL + 'workorder_trans_production/retrieveWorkorderTransReadyStock', {
                operationObj: '@_operationObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            saveReprocessQtyForOperation: () => $resource(CORE.API_URL + 'workorder_trans_production/saveReprocessQtyForOperation', {
                opTransObj: '@_opTransObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }
})();