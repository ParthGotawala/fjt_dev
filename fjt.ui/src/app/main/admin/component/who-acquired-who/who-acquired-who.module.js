(function () {
    'use strict';

    angular
        .module('app.admin.whoacquiredwho', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_WHO_ACQUIRED_WHO_STATE, {
            url: USER.ADMIN_WHO_ACQUIRED_WHO_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_WHO_ACQUIRED_WHO_VIEW,
                    controller: USER.ADMIN_WHO_ACQUIRED_WHO_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();