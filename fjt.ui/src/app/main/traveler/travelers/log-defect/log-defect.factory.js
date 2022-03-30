(function () {
    'use strict';

    angular.module('app.traveler.travelers').factory('LogDefectFactory', LogDefectFactory);

    /** @ngInject */
    function LogDefectFactory($resource, CORE) {
        return {
            getAllDefectCategoryWithList: () => $resource(CORE.API_URL + 'workorder_trasn_assy_defectdet/getAllDefectCategoryWithList/:woID/:isRework', {
                woID: '@_woID',
                isRework:'@_isRework'
            },
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getWorkOrderOperationDefects: () => $resource(CORE.API_URL + 'workorder_operation_defect/getWorkOrderOperationDefects/:woOPID', {
                woOPID: '@_woOPID'
            },
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            manageWorkOrderOperationDefect: () => $resource(CORE.API_URL + 'workorder_operation_defect/manageWorkOrderOperationDefect',
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            //manageWorkOrderAssyDesignators: (param) => $resource(CORE.API_URL + 'workorder_assy_designators/:wodesignatorID', null, null),
            deleteWorkOrderAssyDesignators: () => $resource(CORE.API_URL + 'workorder_assy_designators/deleteDesignator', null, null),
            manageWorkOrderAssyDefectDesignators: () => $resource(CORE.API_URL + 'workorder_trasn_assy_defectdet', null, null),
            getWODefectDesigantorWithList: () => $resource(CORE.API_URL + 'workorder_trasn_assy_defectdet/getWorkOrderTransAssyDesignators', {
            },
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            calculateAndGetDPMOForWoAssy: () => $resource(CORE.API_URL + 'workorder_trasn_assy_defectdet/calculateAndGetDPMOForWoAssy',
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            createWorkOrderAssyDesignator: () => $resource(CORE.API_URL + 'workorder_assy_designators/createWorkOrderAssyDesignator', {
            },
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            updateWorkOrderAssyDesignator: () => $resource(CORE.API_URL + 'workorder_assy_designators/updateWorkOrderAssyDesignator', {
            },
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            })
        };
    }
})();