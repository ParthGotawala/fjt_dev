(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .factory('LaborFactory', LaborFactory);

    /** @ngInject */
    function LaborFactory($resource, $http, CORE) {
        return {
            isChanged:false,
            getLaborAssyQty: (param) => $resource(CORE.API_URL + 'laborassyqpa/getLaborAssyQty/:pPartID/:prfqAssyID', {
                pPartID: '@_pPartID', prfqAssyID: '@_prfqAssyID',
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),

         
            exportLaborTemplate: (laborIds) => $http.post(CORE.API_URL + 'laborassyqpa/exportLaborTemplate', {
                laborIds: laborIds,
            }, { responseType: 'arraybuffer' }).then(function (response) {
                return response;
            }, function (error) {
                return error;
            }),

            getLaborMountingTypeDetails: (param) => $resource(CORE.API_URL + 'laborassyqpa/getLaborMountingTypeDetails/:pPartID/:prfqAssyID', {
                pPartID: '@_pPartID', prfqAssyID: '@_prfqAssyID',
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveLaborDetail: () => $resource(CORE.API_URL + 'laborassyqpa/saveLaborDetail', {
                objLaborDet: '@_objLaborDet',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getLaborTemplateWisePriceDetail: (param) => $resource(CORE.API_URL + 'laborCostTemplate/getLaborTemplateWisePriceDetail/:laborTemplateID', {
                laborTemplateID: '@_laborTemplateID',
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
        }
    }
})();