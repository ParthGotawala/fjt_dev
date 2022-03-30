(function () {
    'use strict';

    angular
        .module('app.admin.role', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_USER_ROLE_STATE, {
            url: USER.ADMIN_USER_ROLE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_USER_ROLE_VIEW,
                    controller: USER.ADMIN_USER_ROLE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
        .state(USER.ADMIN_USER_ROLE_UPDATE_STATE, {
            url: USER.ADMIN_USER_ROLE_UPDATE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_USER_ROLE_UPADTE_VIEW,
                    controller: USER.ADMIN_USER_ROLE_UPADTE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();