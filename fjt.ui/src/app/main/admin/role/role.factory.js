(function () {
  'use strict';

  angular
    .module('app.admin.role')
    .factory('RoleFactory', RoleFactory);

  /** @ngInject */
  function RoleFactory($resource, CORE) {
    return {
      role: () => $resource(CORE.API_URL + 'roles/:id', {
        role: '@_role'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveRolesList: () => $resource(CORE.API_URL + 'roles/retriveRolesList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      rolePermission: () => $resource(CORE.API_URL + 'roles/getRoles', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      otherActivePermission: () => $resource(CORE.API_URL + 'OtherActivePermissions', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      otherActivePermissionsWithRoleOtherPermission: () => $resource(CORE.API_URL + 'otherActivePermissionsWithRoleOtherPermission/:roleIds', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      deleteRole: () => $resource(CORE.API_URL + 'roles/deleteRole', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getRolesByUser: () => $resource(CORE.API_URL + 'roles/getRolesByUser/:id', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      SaveRoleFeature: () => $resource(CORE.API_URL + 'roles/SaveRoleFeature', {},
        {
          isArray: false,
          method: 'POST'
        }),
      checkDuplicateRoleName: () => $resource(CORE.API_URL + 'roles/checkDuplicateRoleName', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getRolesById: () => $resource(CORE.API_URL + 'roles/getRolesById', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
