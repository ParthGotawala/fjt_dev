(function () {
    'use strict';

    angular
        .module('app.notification', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, NOTIFICATION, CORE) {
        $stateProvider.state(NOTIFICATION.NOTIFICATION_STATE, {
            url: NOTIFICATION.NOTIFICATION_ROUTE,
            views: {
                'content@app': {
                    templateUrl: NOTIFICATION.NOTIFICATION_VIEW,
                    controller: NOTIFICATION.NOTIFICATION_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
    }

})();