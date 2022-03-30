(function () {
    'use strict';

    angular
        .module('app.admin.customer')
        .factory('CustomerPersonnelMappingFactory', CustomerPersonnelMappingFactory);

    /** @ngInject */
    function CustomerPersonnelMappingFactory($resource, CORE) {
        return {
            retrieveNotAddedCustomerListForEmployee: () => $resource(CORE.API_URL + 'employeemfgmapping/retrieveNotAddedCustomerListForEmployee', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveAddedCustomerListForEmployee: () => $resource(CORE.API_URL + 'employeemfgmapping/retrieveAddedCustomerListForEmployee', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            createCustomerEmployeesMapping: () => $resource(CORE.API_URL + 'employeemfgmapping/createCustomerEmployeesMapping', {
                listObj: '@_listObj',
            }, {
                    query: {
                        method: 'POST',
                        isArray: false
                    }
                }),
            deleteCustomerEmployeeMapping: () => $resource(CORE.API_URL + 'employeemfgmapping/deleteCustomerEmployeeMapping', {
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
