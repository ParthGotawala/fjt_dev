(function () {
    'use strict';

    angular
        .module('app.admin.assemblyStock', [])
        .config(config);
    function config($stateProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_ASSEMBLYSTOCK_STATE, {
            url: USER.ADMIN_ASSEMBLYSTOCK_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ASSEMBLYSTOCK_VIEW,
                    controller: USER.ADMIN_ASSEMBLYSTOCK_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();