(function () {
    'use strict';

    angular
        .module('app.helperpage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, HELPER_PAGE, CORE) {
        $stateProvider.state(HELPER_PAGE.COMING_SOON_STATE, {
            url: HELPER_PAGE.COMING_SOON_ROUTE,
            views: {
                'content@app': {
                    templateUrl: HELPER_PAGE.COMING_SOON_VIEW,
                    controller: HELPER_PAGE.COMING_SOON_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            resolve: {
            },
        }).state(HELPER_PAGE.UNAUTHORIZED_STATE, {
            url: HELPER_PAGE.UNAUTHORIZED_ROUTE,
            params: {
                pageRoute: null
            },
            views: {
                'content@app': {
                    templateUrl: HELPER_PAGE.UNAUTHORIZED_VIEW,
                    controller: HELPER_PAGE.UNAUTHORIZED_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            resolve: {
            },
        }).state(HELPER_PAGE.NOT_FOUND_STATE, {
            url: HELPER_PAGE.NOT_FOUND_ROUTE,
            views: {
                'content@app': {
                    templateUrl: HELPER_PAGE.NOT_FOUND_VIEW,
                    controller: HELPER_PAGE.NOT_FOUND_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            resolve: {
            },
        }).state(HELPER_PAGE.API_ACCESS_STATE, {
            url: HELPER_PAGE.API_ACCESS_ROUTE,
            views: {
                'content@app': {
                    templateUrl: HELPER_PAGE.API_ACCESS_VIEW,
                    controller: HELPER_PAGE.API_ACCESS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            resolve: {
            },
        });
    }

})();