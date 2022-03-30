(function () {
    'use strict';

    angular
        .module('app.operation')
        .factory('ComponentDataelementFactory', ['$resource', 'CORE', ComponentDataelementFactory]);

    /** @ngInject */
    function ComponentDataelementFactory($resource, CORE) {
        return {
            createEquipment_DataElementList: () => $resource(CORE.API_URL + 'component_dataelement/createComponent_DataElementList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteEquipment_DataElementList: () => $resource(CORE.API_URL + 'component_dataelement/deleteComponent_DataElementList', {
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