(function () {
    'use strict';

    angular
        .module('app.admin.country', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {

        // State
        $stateProvider.state(USER.ADMIN_COUNTRY_STATE, {
            url: USER.ADMIN_COUNTRY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_COUNTRY_VIEW,
                    controller: USER.ADMIN_COUNTRY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

    }
})();