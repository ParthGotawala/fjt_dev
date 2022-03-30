(function () {
    'use strict';
    /** @ngInject */
    var NOTIFICATION = {

        NOTIFICATION_ROUTE: '/notification',
        NOTIFICATION_STATE: 'app.notification',
        NOTIFICATION_CONTROLLER: 'NotificationController',
        NOTIFICATION_VIEW: 'app/main/notification/notification.html',

    };

    angular
       .module('app.notification')
       .constant('NOTIFICATION', NOTIFICATION);
})();
