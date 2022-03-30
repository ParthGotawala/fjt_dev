(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderOperationEquipmentFactory', WorkorderOperationEquipmentFactory);

    /** @ngInject */
    function WorkorderOperationEquipmentFactory($resource, $http, CORE) {
        return {
            retriveEquipmentListbyWoID: () => $resource(CORE.API_URL + 'workorder_operation_equipment/retriveEquipmentListbyWoID/:woID', {
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            retriveEquipmentDetailsbyEqpID: () => $resource(CORE.API_URL + 'workorder_operation_equipment/retriveEquipmentDetailsbyEqpID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            addEquipmentToWorkOrder: () => $resource(CORE.API_URL + 'workorder_operation_equipment/addEquipmentToWorkOrder', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteWorkorderOperation_EquipmentList: () => $resource(CORE.API_URL + 'workorder_operation_equipment/deleteWorkorderOperation_EquipmentList', {
                listObj: '@_listObj',
            }, {
                query: {
                    isArray: false
                }
            }),
            updateWOEquipmentQty: () => $resource(CORE.API_URL + 'workorder_operation_equipment/updateWOEquipmentQty', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            updateAllWOEquipmentQty: () => $resource(CORE.API_URL + 'workorder_operation_equipment/updateAllWOEquipmentQty', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getAssemblyPartListByAssyID: () => $resource(CORE.API_URL + 'workorder_operation_equipment/getAssemblyPartListByAssyID', {
                obj: '@_obj',
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                }
            }),
            saveImportFeeder: () => $resource(CORE.API_URL + 'workorder_operation_equipment/saveImportFeeder', {
                objFeeder: '@_objFeeder',
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                }
            }),

            downloadEquipmentFeederTemplate: (fileType) => $http.get(CORE.API_URL + "workorder_operation_equipment/downloadEquipmentFeederTemplate/" + fileType, { responseType: 'arraybuffer' })
                .then((response) => {
                    return response;
                }, (error) => {
                    return error;
                }),
        }
    }
})();