(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ManageMFGCodePopupFactory', ManageMFGCodePopupFactory);

    /** @ngInject */
    function ManageMFGCodePopupFactory($resource, CORE) {
        return {
            Mfgcode: (param) =>  $resource(CORE.API_URL + 'mfgcode/saveManufacturer', {},
            {
                query: {
                    isArray: false,
                },
                update: {
                    method: 'PUT',
                },
            }),

            retriveMfgCode: () => $resource(CORE.API_URL + 'mfgcode/retriveMfgCode', {
                id: '@_id'
            },
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getMappedManufacturerList: () => $resource(CORE.API_URL + 'mfgcode/getMappedManufacturerList/:mfgCodeAliasID', {
                mfgCodeAliasID: '@_mfgCodeAliasID',
            },
            {
                query: {
                    isArray: false,
                    method: 'GET',
                }
            }),

            getMfgcodeList: () => $resource(CORE.API_URL + 'mfgcode/getMfgcodeList', {},
           {
               query: {
                   isArray: false,
                   method: 'GET',
               }
           }),
            checkMFGAliasRemovable: () => $resource(CORE.API_URL + 'mfgcode/checkMFGAliasRemovable', {},
           {
               query: {
                   isArray: false,
                   method: 'POST',
               }
           }),
            checkUniqueMFGAlias: () => $resource(CORE.API_URL + 'mfgcode/checkUniqueMFGAlias', {},
           {
               query: {
                   isArray: false,
                   method: 'POST',
               }
           }),

            saveMappedManufacturer: () => $resource(CORE.API_URL + 'mfgcode/saveMappedManufacturer', { mappedManufacturerLst: '@_mappedManufacturerLst', },
           {
               query: {
                   isArray: false,
                   method: 'POST',
               }
           }),
        }
    }

})();
