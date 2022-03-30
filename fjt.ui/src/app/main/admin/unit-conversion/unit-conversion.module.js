(function () {
    'use strict';

    angular
        .module('app.admin.unitconversion', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {

        // State
        $stateProvider.state(USER.ADMIN_UNIT_CONVERSION_STATE, {
            url: USER.ADMIN_UNIT_CONVERSION_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_UNIT_CONVERSION_VIEW,
                    controller: USER.ADMIN_UNIT_CONVERSION_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

    }
})();