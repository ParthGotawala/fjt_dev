(function () {
    'use strict';

    angular.module('app.traveler.travelers').factory('BoxSerialsFactory', BoxSerialsFactory);

    /** @ngInject */
    function BoxSerialsFactory($resource, CORE) {
        return {
            BoxSerials: (param) =>  $resource(CORE.API_URL + 'woTransPackagingDet/:id', {
                id: '@_id',
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {
                        page: param && param.Page ? param.Page : 1,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                        woId: param && param.woId ? JSON.stringify(param.woId) : null,
                        opId: param && param.opId ? JSON.stringify(param.opId) : null
                    }
                },
                update: {
                    method: 'PUT',
                },
            }),

            deleteWoTranspackaging: () => $resource(CORE.API_URL + 'woTransPackagingDet/deleteWoTranspackaging', {
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