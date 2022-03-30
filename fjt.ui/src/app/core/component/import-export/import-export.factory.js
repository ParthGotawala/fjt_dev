(function () {
    'use strict';

    angular.module('app.core').factory('ImportExportFactory', ['$resource', '$http', 'CORE', ImportExportFactory]);

    /** @ngInject */
    function ImportExportFactory($resource, $http, CORE) {
        return {
            getFieldList: () =>  $resource(CORE.API_URL + 'ImportExport/getFieldList/:entity', {
                entity: '@_entity',
            }, {
                query: {
                    isArray: false
                }
            }),

            createEntity: (param) =>  $resource(CORE.API_URL + 'ImportExport/createEntity', {}, {
                query: {
                    isArray: false,
                    params: {
                       
                    }
                },
              
            }),
            importFile: (invalidEntryList) => $http.post(CORE.API_URL + "ImportExport/importFile", { data: invalidEntryList }, { responseType: 'arraybuffer' }).then(function (response) {
                return response;
            }, function (error) {
                return error;
            }),

            getEntityFieldListByTableName: () =>  $resource(CORE.API_URL + 'ImportExport/getEntityFieldListByTableName/:entityTableName', {
                entityTableName: '@_entityTableName',
            }, {
                query: {
                    isArray: false
                }
            }),
        

        };

    }
})();