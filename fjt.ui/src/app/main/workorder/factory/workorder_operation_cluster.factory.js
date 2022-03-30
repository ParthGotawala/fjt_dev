(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderOperationClusterFactory', WorkorderOperationClusterFactory);

    /** @ngInject */
    function WorkorderOperationClusterFactory($resource, CORE) {
        return {
            workorder_operation_cluster: (param) =>  $resource(CORE.API_URL + 'workorder_operation_cluster/:id', {
                id: '@_id',
            }, {
                query: {
                    isArray: false,
                    params: {
                        page: param && param.Page ? param.Page : 1,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                    }
                },
                update: {
                    method: 'PUT',
                },
            }),
            deleteClusterOperationFromWorkOrder: () => $resource(CORE.API_URL + 'workorder_operation_cluster/deleteClusterOperationFromWorkOrder', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }
})();