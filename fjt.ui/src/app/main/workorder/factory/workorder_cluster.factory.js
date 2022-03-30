(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderClusterFactory', WorkorderClusterFactory);

    /** @ngInject */
    function WorkorderClusterFactory($resource, CORE) {
        return {
            workorder_cluster: (param) =>  $resource(CORE.API_URL + 'workorder_cluster/:id', {
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
            retriveClusterListbyWoID: () => $resource(CORE.API_URL + 'workorder_cluster/retriveClusterListbyWoID/:woID', {
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
          checkDuplicateWOClusterName: () => $resource(CORE.API_URL + 'workorder_cluster/checkDuplicateWOClusterName', {
          }, {
            query: {
              method: 'POST',
              isArray: false
            }
          }),
        }
    }
})();
