(function () {
    'use strict';

    angular
        .module('app.admin.page', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_PAGE_STATE, {
            url: USER.ADMIN_PAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PAGE_VIEW,
                    controller: USER.ADMIN_PAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
        .state(USER.ADMIN_MANAGEPAGE_STATE, {
            url: USER.ADMIN_MANAGEPAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANAGEPAGE_VIEW,
                    controller: USER.ADMIN_MANAGEPAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();