(function () {
    'use strict';

    angular
        .module('app.admin.employee')
        .factory('EmployeeCertificationFactory', EmployeeCertificationFactory);

    /** @ngInject */
    function EmployeeCertificationFactory($resource, CORE) {
        return {

            getEmployeeAllCertificationList: (param) => $resource(CORE.API_URL + 'employee_certification/getEmployeeAllCertificationList',
                { id: '@_id' },
             {
                 query: {
                     method: 'POST',
                     isArray: false
                 }
             }),
            saveEmployeeCertification: () => $resource(CORE.API_URL + 'employee_certification/saveEmployeeCertification', {},
                {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            retrieveAssignedStandardEmployees: (param) => $resource(CORE.API_URL + 'employee_certification/retrieveAssignedStandardEmployees',
                { id: '@_id' },
             {
                 query: {
                     method: 'POST',
                     isArray: false
                 }
             }),

            saveStandardPersonnelCertification: () => $resource(CORE.API_URL + 'employee_certification/savePersonnelStandard', {},
               {
                   query: {
                       method: 'POST',
                       isArray: false
                   }
               }),

            deleteStandardPersonnelCertification: () => $resource(CORE.API_URL + 'employee_certification/removePersonnelStandard', {},
               {
                   query: {
                       method: 'POST',
                       isArray: false
                   }
               }),

            getCertifiedStandardListOfEmployee: (param) => $resource(CORE.API_URL + 'employee_certification/getCertifiedStandardListOfEmployee',
                {

                },
             {
                 query: {
                     method: 'POST',
                     isArray: false
                 }
              }),
          retrieveEmployeeListGeneric: () => $resource(CORE.API_URL + 'employee_certification/retrieveEmployeeListGeneric', {},
            {
              query: {
                method: 'POST',
                isArray: false
              }
            }),
        }
    }

})();
