(function () {
    'use strict';
    angular
        .module('app.admin.user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        $stateProvider.state(USER.ADMIN_USER_STATE, {
            url: USER.ADMIN_USER_ROUTE,
            views: {
                'content@app': {
                    template: '<div ui-view></div>'
                }
            }
        });
     
        $stateProvider.state(USER.ADMIN_USER_USER_STATE, {
            url: USER.ADMIN_USER_USER_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_USER_USER_VIEW,
                    controller: USER.ADMIN_USER_USER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_MANAGEUSER_STATE, {
            url: USER.ADMIN_MANAGEUSER_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEUSER_VIEW,
                    controller: USER.ADMIN_MANAGEUSER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();