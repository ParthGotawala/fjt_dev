(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderOperationPartFactory', WorkorderOperationPartFactory);

    /** @ngInject */
    function WorkorderOperationPartFactory($resource, CORE) {
        return {
            retrivePartListbyWoID: () => $resource(CORE.API_URL + 'workorder_operation_part/retrivePartListbyWoID', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrivePartDetailsbyPartID: () => $resource(CORE.API_URL + 'workorder_operation_part/retrivePartDetailsbyPartID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            addPartToWorkOrder: () => $resource(CORE.API_URL + 'workorder_operation_part/addPartToWorkOrder', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteWorkorderOperation_PartList: () => $resource(CORE.API_URL + 'workorder_operation_part/deleteWorkorderOperation_PartList', {
                listObj: '@_listObj',
            }, {
                query: {
                    isArray: false
                }
            }),
            saveSMTQPADetails: () => $resource(CORE.API_URL + 'workorder_operation_part/saveSMTQPADetails', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getNotAddedSMTPartListInWO: () => $resource(CORE.API_URL + 'workorder_operation_part/getNotAddedSMTPartListInWO', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }), 
        }
    }
})();