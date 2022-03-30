(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('NotificationSocketFactory', NotificationSocketFactory);

    /** @ngInject */
    function NotificationSocketFactory($resource, CORE) {
        return {
            sendNotification: (param) =>  $resource(CORE.API_URL + 'notificationmst/sendNotification', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            ackNotification: (param) =>  $resource(CORE.API_URL + 'notificationmst/ackNotification', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            })
        }
    }

})();