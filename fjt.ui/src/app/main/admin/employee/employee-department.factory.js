(function () {
    'use strict';

    angular
        .module('app.admin.employee')
        .factory('EmployeeDepartmentFactory', EmployeeDepartmentFactory);

    /** @ngInject */
    function EmployeeDepartmentFactory($resource, $http, CORE) {
        return {
            employeeDepartment: (param) =>  $resource(CORE.API_URL + 'employee_department/:id', {
                id: '@_id',
            }, {
                update: {
                    method: 'PUT',
                },
            }),
            getEmployeeAllDepartment: () => $resource(CORE.API_URL + 'employee_department/getEmployeeAllDepartment/:employeeID', {
                employeeID: '@_employeeID',
            },
           {
               query: {
                   isArray: false,
               }
           }),

            getEmployeeListInDepartment: () => $resource(CORE.API_URL + 'employee_department/getEmployeeListInDepartment/:departmentID', {
                departmentID: '@_departmentID',
            },
           {
               query: {
                   isArray: false,
               }
           }),
            addEmployeeInDepartment: (param) =>  $resource(CORE.API_URL + 'employee_department/addEmployeeInDepartment', {
            }),
            updateEmployeeInDepartment: (param) =>  $resource(CORE.API_URL + 'employee_department/updateEmployeeInDepartment/:id', {
                id: '@_id',
            }, {
                update: {
                    method: 'PUT',
                }
            }),


            setDefaultDepartmentToEmployee: () => $resource(CORE.API_URL + 'employee_department/setDefaultDepartmentToEmployee', {
            }, {
                query: {
                    isArray: false
                },
                update: {
                    method: 'PUT',
                },
            }),
        }
    }
})();