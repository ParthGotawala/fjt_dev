(function () {
  'use strict';

  angular
    .module('app.admin.department')
    .factory('DepartmentFactory', DepartmentFactory);

  /** @ngInject */
  function DepartmentFactory($resource, CORE) {
    return {
      department: () => $resource(CORE.API_URL + 'department/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveDepartmentList: () => $resource(CORE.API_URL + 'department/retriveDepartmentList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllDepartment: () => $resource(CORE.API_URL + 'department/getAllDepartment', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getDepartmentWithEmployees: () => $resource(CORE.API_URL + 'department/getDepartmentWithEmployees', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      deleteDepartment: () => $resource(CORE.API_URL + 'department/deleteDepartment', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateDepartmentName: () => $resource(CORE.API_URL + 'department/checkDuplicateDepartmentName', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createLocationList: () => $resource(CORE.API_URL + 'department/createLocationList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getLocationAddedList: () => $resource(CORE.API_URL + 'department/getLocationAddedList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteLocation: () => $resource(CORE.API_URL + 'department/deleteLocation', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      })
    };
  }
})();
