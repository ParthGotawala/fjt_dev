(function () {
  'use strict';

  angular
    .module('app.admin.employee')
    .factory('EmployeeFactory', EmployeeFactory);

  /** @ngInject */
  function EmployeeFactory($resource, $http, CORE) {
    return {
      employee: (param) => $resource(CORE.API_URL + 'employees/:id/:isPermanentDelete', {
        id: '@_id',
        isPermanentDelete: '@_isPermanentDelete'
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          }
        },
        update: {
          method: 'PUT'
        }
      }),
      retrieveEmployeeList: () => $resource(CORE.API_URL + 'employees/retrieveEmployeeList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getEmployees: () => $resource(CORE.API_URL + 'employees/getEmployees', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      retrieveEmployeeOperations: () => $resource(CORE.API_URL + 'employees/retrieveEmployeeOperations/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      employeeList: () => $resource(CORE.API_URL + 'employees/employeeList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getAllDepartment: () => $resource(CORE.API_URL + 'getAllDepartment', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      createOperation_EmployeeList: () => $resource(CORE.API_URL + 'employees/createOperation_EmployeeList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveEmployeeProfile: () => $resource(CORE.API_URL + 'employees/retrieveEmployeeProfile/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      retrieveWorkStationDetail: () => $resource(CORE.API_URL + 'employees/retrieveWorkStationDetail/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      createWorkstation_EquipmentList: () => $resource(CORE.API_URL + 'employees/createWorkstation_EquipmentList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteWorkstation_EquipmentListFromEmployee: () => $resource(CORE.API_URL + 'employees/deleteWorkstation_EquipmentListFromEmployee', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),
      deleteOperationsOfEmployee: () => $resource(CORE.API_URL + 'employees/deleteOperationsOfEmployee', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),
      isactiveTrans_Employee: () => $resource(CORE.API_URL + 'employees/isactiveTransEmployee/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      deleteEmployee: () => $resource(CORE.API_URL + 'employees/deleteEmployee', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      updateEmployeeDefaultChartCategory: () => $resource(CORE.API_URL + 'employees/updateEmployeeDefaultChartCategory', null,
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      checkEmailIDAlreadyExists: () => $resource(CORE.API_URL + 'employees/checkEmailIDAlreadyExists',
        { objs: '@_objs' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      downloadPersonnelTemplate: (module) => $http.get(CORE.API_URL + 'employees/downloadPersonnelTemplate/' + module, { responseType: 'arraybuffer' })
        .then((response) => response
          , (error) => error),
      getEmployeeResponsibility: () => $resource(CORE.API_URL + 'employeeResponsibility/getEmployeeResponsibility/:employeeID', {
        employeeID: '@_employeeID'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      saveEmployeeResponsibility: () => $resource(CORE.API_URL + 'employeeResponsibility/saveEmployeeResponsibility', {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
      getResponsibilityWiseEmployeeList: () => $resource(CORE.API_URL + 'employeeResponsibility/getResponsibilityWiseEmployeeList/:gencCategoryType', {
        gencCategoryType: '@_gencCategoryType'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getEmployeeListByCustomer: () => $resource(CORE.API_URL + 'employees/getEmployeeListByCustomer', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      GetEmployeeDetail: () => $resource(CORE.API_URL + 'employees/GetEmployeeDetail', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      GerCurrentContactPersonByEmpId: () => $resource(CORE.API_URL + 'employees/GerCurrentContactPersonByEmpId', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }), releaseContactPersonById: () => $resource(CORE.API_URL + 'employees/releaseContactPersonById', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }), deleteEmployeeContactPerson: () => $resource(CORE.API_URL + 'employees/deleteEmployeeContactPerson', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
