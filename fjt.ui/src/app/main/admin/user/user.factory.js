(function () {
  'use strict';

  angular
    .module('app.admin.user')
    .factory('UserFactory', UserFactory);

  /** @ngInject */
  function UserFactory($resource, CORE, $http) {
    return {
      user: (param) => $resource(CORE.API_URL + 'users/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET',
          params: param ? {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null
          } : null
        },
        update: {
          method: 'PUT'
        }
      }),
      assignRolePermissionToUser: () => $resource(CORE.API_URL + 'users/assignRolePermissionToUser', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      resetUserCredential: (param) => $resource(CORE.API_URL + 'usersaccount/resetUserCredential', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

      getUserDetailsByPasswordToken: (param) => $resource(CORE.API_URL + 'usersaccount/getUserDetailsByPasswordToken', {
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      //forgotUserPassword: (param) => $resource(CORE.API_URL + 'usersaccount/forgotUserPassword', {
      //},
      //    {
      //        query: {
      //            isArray: false,
      //            method: 'POST',
      //        }
      //    }),
      updateUserSetting: (param) => $resource(CORE.API_URL + 'users/updateUserSetting', {
        userObj: '@_userObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updateUserByDefaultRole: (param) => $resource(CORE.API_URL + 'users/updateUserByDefaultRole', {
        userObj: '@_userObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updateUserWithIdentityUserId: (param) => $resource(CORE.API_URL + 'utility/updateUsersWithUserID', {
        userObj: '@_userObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      updateUserPasswordResponse: (param) => $resource(CORE.API_URL + 'users/updateUserPasswordResponse', {
        userObj: '@_userObj',
        param
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      logOutUserFromAllDevices: (param) => $resource(CORE.API_URL + 'users/logOutUserFromAllDevices', {
        userObj: '@_userObj',
        param
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      reloadPreviousPages: (param) => $resource(CORE.API_URL + 'users/reloadPreviousPages', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
      }),
      updateLoginuser: () => $resource(CORE.API_URL + 'users/updateLoginuser', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
      }),
      updateUserPasswordViaIdentity: (param) => $http.post(CORE.IDENTITY_URL + 'api/account/UpdateUserPassword', param, null).then((response) => response.data, (error) => error),
      updateOtherUserPasswordViaIdentity: (param) => $http.post(CORE.IDENTITY_URL + 'api/account/UpdateOtherUserPassword', param, null).then((response) => response.data, (error) => error),
      validatePassword: (param) => $http.post(CORE.IDENTITY_URL + 'api/account/ValidatePassword', param).then((response) => response.data, (error) => error)

      // sendMailWithAttachement: (param) => $resource(CORE.API_URL + 'users/sendMailWithAttachement', {
      //     userObj: '@_userObj',
      // },
      //    {
      //        query: {
      //            isArray: false,
      //            method: 'POST',
      //        }
      //    }),
    };
  }
})();
