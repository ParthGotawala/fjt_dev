(function () {
    'use strict';

    angular
        .module('app.admin.dynamicmessage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_DYNAMICMESSAGE_STATE, {
            url: USER.ADMIN_DYNAMICMESSAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_DYNAMICMESSAGE_VIEW,
                    controller: USER.ADMIN_DYNAMICMESSAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();