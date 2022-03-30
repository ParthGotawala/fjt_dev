(function () {
    'use strict';

    angular
        .module('app.admin.manufacturer', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_MANUFACTURER_STATE, {
            url: USER.ADMIN_MANUFACTURER_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_MANUFACTURER_VIEW,
                    controller: USER.ADMIN_MANUFACTURER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();