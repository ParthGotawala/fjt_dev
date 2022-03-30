(function () {
    'use strict';

    angular
    .module('app.core')
        .factory('NotificationDirFactory', NotificationDirFactory);

    /** @ngInject */
    function NotificationDirFactory($resource, CORE) {
        return {
            getNotificationList: () => $resource(CORE.API_URL + 'notificationmst/getNotificationList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getNotificationCount: () => $resource(CORE.API_URL + 'notificationmst/getNotificationCount/:receiverID', {
                receiverID: '@_receiverID'
            }, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            }),
            clearNotificationCount: () => $resource(CORE.API_URL + 'notificationmst/clearNotificationCount', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getEmployeeWiseInboxNotificationList: () => $resource(CORE.API_URL + 'notificationmst/getEmployeeWiseInboxNotificationList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getEmployeeWiseSendboxNotificationList: () => $resource(CORE.API_URL + 'notificationmst/getEmployeeWiseSendboxNotificationList', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            updateNotificationAsReadUnread: () => $resource(CORE.API_URL + 'notificationmst/updateNotificationAsReadUnread', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            getAllReceiversOfSenderNotification: () => $resource(CORE.API_URL + 'notificationmst/getAllReceiversOfSenderNotification', {
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
          getNotificationWithReceiversByTableRefID: (param) => $resource(CORE.API_URL + 'notificationmst/getNotificationWithReceiversByTableRefID', {
          }, {
              query: {
              method: 'POST',
              isArray: false,
              params: {
                page: param && param.Page ? param.Page : 1,
                pageSize: CORE.UIGrid.ItemsPerPage(),
                order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
              }
            },
          }),
            
        }
    }

})();
