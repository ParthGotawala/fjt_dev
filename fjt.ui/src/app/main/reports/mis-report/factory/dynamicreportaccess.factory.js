(function () {
    'use strict';

    angular
        .module('app.reports.misreport')
        .factory('DynamicReportAccessFactory', DynamicReportAccessFactory);

    /** @ngInject */
    function DynamicReportAccessFactory($resource, $http, CORE) {
        return {

            getAccessEmployeeList: () => $resource(CORE.API_URL + 'dynamicreportaccess/getAccessEmployeeList/:refTableName/:refTransID', {},
            {
                query: {
                    isArray: false,
                    method: 'GET',
                }
            }),
            retrieveEmployeesOfMISReportDetails: () => $resource(CORE.API_URL + 'dynamicreportaccess/retrieveEmployeesOfMISReportDetails', {},
            {
                query: {
                    isArray: false,
                    method: 'POST',
                }
            }),
            createMISReportEmployeeList: () => $resource(CORE.API_URL + 'dynamicreportaccess/createMISReportEmployeeList', {},
            {
                query: {
                    isArray: false,
                    method: 'POST',
                }
            }),
            deleteMISReportEmployeeList: () => $resource(CORE.API_URL + 'dynamicreportaccess/deleteMISReportEmployeeList', {},
            {
                query: {
                    isArray: false,
                    method: 'POST',
                }
            }),
            
        }
    }
})();