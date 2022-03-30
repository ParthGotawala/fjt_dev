(function () {
    'use strict';

    angular
        .module('app.admin.role')
        .factory('RolePagePermisionFactory', RolePagePermisionFactory);

    /** @ngInject */
    function RolePagePermisionFactory($resource, CORE) {
        return {
            rolePagePermision: () => $resource(CORE.API_URL + 'rolePagePermision/:id', {
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
            pagePermission: (param) => $resource(CORE.API_URL + 'rolePagePermision/getPageListByRole', {},
            {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {
                        page: param && !_.isNull(param.Page) ? param.Page : 1,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                        tabName: param && param.TabName ? param.TabName : null,
                        userId: param && param.UserId ? param.UserId : 0,
                        roleId: param && param.RoleId ? param.RoleId : 0,
                        isShowDefault: param.isShowDefault
                    }
                }
            }),
            saveRoleRightPage: () =>  $resource(CORE.API_URL + 'rolePagePermision/saveRoleRightPage', {},
            {
                isArray: false,
                method: 'POST'
            }),
            updateRoleRight: () => $resource(CORE.API_URL + 'rolePagePermision/updateRoleRight', {},
            {
                isArray: false,
                method: 'POST'
            }),
            sendNotificationOfRightChanges: () => $resource(CORE.API_URL + 'rolePagePermision/sendNotificationOfRightChanges/:id/:isSelectMultipleUser', {}, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getDefaultPageRightsByRole: () => $resource(CORE.API_URL + 'rolePagePermision/getDefaultPageRightsByRole', {},
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
           }),
           getRightsSummary: () =>  $resource(CORE.API_URL + 'rolePagePermision/getRightsSummary', {},
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            deleteRolesRights: () => $resource(CORE.API_URL + 'rolePagePermision/deleteRolesRights', {}, {
                query: {
                  method: 'POST',
                  isArray: false
                }
              })
        };
    }
})();