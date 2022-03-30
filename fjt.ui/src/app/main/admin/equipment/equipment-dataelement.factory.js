(function () {
    'use strict';

    angular
        .module('app.operation')
        .factory('EquipmentDataelementFactory', ['$resource', 'CORE', EquipmentDataelementFactory]);

    /** @ngInject */
    function EquipmentDataelementFactory($resource, CORE) {
        return {
            //operation_dataelement: (param) =>  $resource(CORE.API_URL + 'operation_dataelement/:id', {
            //    id: '@_id',
            //}, {
            //    query: {
            //        isArray: false,
            //        params: {
            //            page: param && param.page ? param.page : 0,
            //            pageSize: CORE.UIGrid.ItemsPerPage(),
            //            order: param && param.order ? JSON.stringify(param.order) : null,
            //            search: param && param.search ? JSON.stringify(param.search) : null,
            //        }
            //    },
            //    update: {
            //        method: 'PUT',
            //    },
            //}),
            createEquipment_DataElementList: () => $resource(CORE.API_URL + 'equipment_dataelement/createEquipment_DataElementList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteEquipment_DataElementList: () => $resource(CORE.API_URL + 'equipment_dataelement/deleteEquipment_DataElementList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            //retrieveOperationDataElementList: () => $resource(CORE.API_URL + 'operation_dataelement/retrieveOperationDataElementList/:opID', {
            //    opID: '@_opID',
            //},
            //{
            //    query: {
            //        isArray: false,
            //        method: 'GET',
            //    }
            //}),
        }
    }
})();