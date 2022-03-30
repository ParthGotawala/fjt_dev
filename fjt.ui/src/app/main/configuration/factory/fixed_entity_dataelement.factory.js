(function () {
    'use strict';

    angular
        .module('app.configuration.dataelement')
        .factory('FixedEntityDataElementFactory', FixedEntityDataElementFactory);

    /** @ngInject */
    function FixedEntityDataElementFactory($resource, CORE) {
        return {
            retrieveFixedEntityDataelementList: (param) => $resource(CORE.API_URL + 'fixed_entity_dataelement/retrieveFixedEntityDataelementList', {
                
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getDataElementByDisplayEntityName: () => $resource(CORE.API_URL + 'fixed_entity_dataelement/getDataElementByDisplayEntityName', {},
            {
              query: {
                isArray: false,
                method: 'POST'
              }
            })
        };
    }
})();