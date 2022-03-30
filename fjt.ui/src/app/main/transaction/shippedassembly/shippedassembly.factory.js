(function () {
    'use strict';

    angular
        .module('app.transaction')
        .factory('ShippedFactory', ShippedFactory);

    /** @ngInject */
    function ShippedFactory($resource, CORE) {
        return {
            shipped: (param) =>  $resource(CORE.API_URL + 'shipped/:id', {
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
                    }
                },
                update: {
                    method: 'PUT',
                },
            }),
            getWorkorderList: () => $resource(CORE.API_URL + 'shipped/getWorkorderList', {
                workorderObj: '@_workorderObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteShippedAssembly: () => $resource(CORE.API_URL + 'shipped/deleteShippedAssembly', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getExportControlledAssyPartOfWO: () => $resource(CORE.API_URL + 'shipped/getExportControlledAssyPartOfWO', {
                
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }), 
        }
    }
})();