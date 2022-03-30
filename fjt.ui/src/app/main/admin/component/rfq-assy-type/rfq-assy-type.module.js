(function () {
    'use strict';

    angular
        .module('app.admin.assyType', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_ASSYTYPE_STATE, {
            url: USER.ADMIN_ASSYTYPE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ASSYTYPE_VIEW,
                    controller: USER.ADMIN_ASSYTYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();