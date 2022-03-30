(function () {
    'use strict';

    angular
        .module('app.configuration.chartrawdatacategory')
        .factory('RawdataCategoryAccessRoleFactory', RawdataCategoryAccessRoleFactory);

    /** @ngInject */
    function RawdataCategoryAccessRoleFactory($resource, CORE) {
        return {
            getAccessRoleByChartRawDataCategory: () => $resource(CORE.API_URL + 'chartrawdatacategoryaccessrole/getAccessRoleByChartRawDataCategory',
         {
             query: {
                 isArray: false,
                 method: 'POST'
             }
         }),
        }
    }
})();