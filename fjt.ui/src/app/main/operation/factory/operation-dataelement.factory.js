(function () {
    'use strict';

    angular
        .module('app.operation')
        .factory('OperationDataelementFactory', OperationDataelementFactory);

    /** @ngInject */
    function OperationDataelementFactory($resource, CORE) {
        return {
            operation_dataelement: (param) =>  $resource(CORE.API_URL + 'operation_dataelement/:id', {
                id: '@_id',
            }, {
                query: {
                    isArray: false,
                    params: {
                        page: param && param.page ? param.page : 0,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.order ? JSON.stringify(param.order) : null,
                        search: param && param.search ? JSON.stringify(param.search) : null,
                    }
                },
                update: {
                    method: 'PUT',
                },
            }),
            createOperation_DataElementList: () => $resource(CORE.API_URL + 'operation_dataelement/createOperation_DataElementList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveOperationDataElementList: () => $resource(CORE.API_URL + 'operation_dataelement/retrieveOperationDataElementList/:opID', {
                opID: '@_opID',
            },
            {
                query: {
                    isArray: false,
                    method: 'GET',
                }
            }),
            deleteOperation_DataElementList: () => $resource(CORE.API_URL + 'operation_dataelement/deleteOperation_DataElementList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveWorkorderOperationDataElementList: () => $resource(CORE.API_URL + 'workorder_operation_dataelement/retrieveWorkorderOperationDataElementList/:woOPID/:woID', {
                woOPID: '@_woOPID',
                woID: '@_woID'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
        }
    }
})();