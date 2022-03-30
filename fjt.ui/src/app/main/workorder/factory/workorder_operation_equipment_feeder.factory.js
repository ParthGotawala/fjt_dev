(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderOperationEquipmentFeederFactory', WorkorderOperationEquipmentFeederFactory);

    /** @ngInject */
    function WorkorderOperationEquipmentFeederFactory($resource, CORE) {
        return {
            feeder: (param) =>  $resource(CORE.API_URL + 'feeder/:id', {
                id: '@_id'
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {
                        page: 0,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                        woOpEqpID: param && param.woOpEqpID ? param.woOpEqpID : null,
                    }
                },
                update: {
                    method: 'PUT',
                },
            }),

            deleteFeederDetails: () => $resource(CORE.API_URL + 'feeder/deleteFeederDetails', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            updateFeederMergedDetails: () => $resource(CORE.API_URL + 'feeder/updateFeederMergedDetails', {
                objLineitem: '@_objLineitem',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            checkDuplicateFeeder: () => $resource(CORE.API_URL + 'feeder/checkDuplicateFeeder', {
                objFeeder: '@_objFeeder',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }
})();