(function () {
  'use strict';

  angular
    .module('app.configuration.entity')
    .factory('EntityFactory', EntityFactory);

  /** @ngInject */
  function EntityFactory($resource, CORE) {
    return {
      entity: (param) => $resource(CORE.API_URL + 'entities/:id/:systemGenerated/:entityName', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET',
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
              isUserSuperAdmin: param && param.isUserSuperAdmin ? JSON.stringify(param.isUserSuperAdmin) : 0,
              loginEmployeeID: param && param.loginEmployeeID ? JSON.stringify(param.loginEmployeeID) : null,
              isSystemGeneratedEntity: param && param.isSystemGeneratedEntity ? param.isSystemGeneratedEntity : 0
            }
          },
          update: {
            method: 'PUT'
          }
        }),
      retriveEntitiesList: () => $resource(CORE.API_URL + 'entities/retriveEntitiesList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getEntityByName: () => $resource(CORE.API_URL + 'entities/detail/:name', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getAllEntityWithUniqueDataElement: () => $resource(CORE.API_URL + 'entities/getAllEntityWithUniqueDataElement', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getAllEntityWithDataElements: () => $resource(CORE.API_URL + 'entities/getAllEntityWithDataElements', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getWithDataElementsByEntityIds: () => $resource(CORE.API_URL + 'entities/getWithDataElementsByEntityIds/:EntityIds', {
        EntityIds: '@_EntityIds'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      deleteEntity: () => $resource(CORE.API_URL + 'entities/deleteEntity', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllCustomFormEntityByAccessPermissionOfEmployee: () => $resource(CORE.API_URL + 'entities/getAllCustomFormEntityByAccessPermissionOfEmployee', {

      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retrieveEntityAllEmployeeDetails: () => $resource(CORE.API_URL + 'entities/retrieveEntityAllEmployeeDetails', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      createEntityEmployeeList: () => $resource(CORE.API_URL + 'entities/createEntityEmployeeList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteEntityEmployeeList: () => $resource(CORE.API_URL + 'entities/deleteEntityEmployeeList', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),
      checkDuplicateEntityName: () => $resource(CORE.API_URL + 'entities/checkDuplicateEntityName', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllEntity: () => $resource(CORE.API_URL + 'entities/getAllEntity', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      updateEntityEmployeePermission: () => $resource(CORE.API_URL + 'entities/updateEntityEmployeePermission', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),
      retrieveGenericReportCategories: () => $resource(CORE.API_URL + 'entities/retrieveGenericReportCategories', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveSystemGeneratedEntities: () => $resource(CORE.API_URL + 'entities/retrieveSystemGeneratedEntities', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
  }
})();
