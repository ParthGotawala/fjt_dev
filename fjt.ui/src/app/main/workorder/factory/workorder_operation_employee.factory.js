(function () {
    'use strict';

    angular
        .module('app.workorder')
        .factory('WorkorderOperationEmployeeFactory', WorkorderOperationEmployeeFactory);

    /** @ngInject */
    function WorkorderOperationEmployeeFactory($resource, CORE) {
        return {
            saveWorkorderOperation_Employee: () => $resource(CORE.API_URL + 'workorder_operation_employee/saveWorkorderOperation_Employee', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getWorkorderEmployeeByOpID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderEmployeeByOpID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteOperationFromWorkOrder: () => $resource(CORE.API_URL + 'workorder_operation_employee/deleteOperationFromWorkOrder', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            addEmployeeToWorkOrder: () => $resource(CORE.API_URL + 'workorder_operation_employee/addEmployeeToWorkOrder', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retriveOperationListbyWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/retriveOperationListbyWoID/:woID', {
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            retriveEmployeeListbyWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/retriveEmployeeListbyWoID/:woID', {
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            retriveEmployeeDetailsbyEmpID: () => $resource(CORE.API_URL + 'workorder_operation_employee/retriveEmployeeDetailsbyEmpID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            // getWorkorderEmployeeDetailsByEmpCodeOld: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderEmployeeDetailsByEmpCodeOld', {
            //     listObj: '@_listObj',
            // }, {
            //     query: {
            //         method: 'POST',
            //         isArray: false
            //     }
            // }),
            getWorkorderEmployeeDetailsByEmpCode: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderEmployeeDetailsByEmpCode', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getOperationListByWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getOperationListByWoID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            
            getWorkorderEmployeeOperationByWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderEmployeeOperationByWoID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            getWorkorderDocumentsByWoID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getWorkorderDocumentsByWoID', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),

            deleteWorkorderOperation_EmployeeList: () => $resource(CORE.API_URL + 'workorder_operation_employee/deleteWorkorderOperation_EmployeeList', {
                listObj: '@_listObj',
            }, {
                query: {
                    isArray: false
                }
            }),
            getEmployeeForAuditLogByWoOpEmployeeID: () => $resource(CORE.API_URL + 'workorder_operation_employee/getEmployeeForAuditLogByWoOpEmployeeID/:woOpEmployeeID', {
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            retrieveNotAddedEmployeeListForWoOp: () => $resource(CORE.API_URL + 'workorder_operation_employee/retrieveNotAddedEmployeeListForWoOp', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveAddedEmployeeListForWoOp: () => $resource(CORE.API_URL + 'workorder_operation_employee/retrieveAddedEmployeeListForWoOp', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            retrieveAddedEmployeeListForWO: () => $resource(CORE.API_URL + 'workorder_operation_employee/retrieveAddedEmployeeListForWO', {}, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        } 
    }
})();