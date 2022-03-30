(function () {
    'use strict';

    angular
        .module('app.admin.standardmessage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.STANDARDMESSAGE_STATE, {
            url: USER.STANDARDMESSAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.STANDARDMESSAGE_VIEW,
                    controller: USER.STANDARDMESSAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
        .state(USER.MANAGE_STANDARDMESSAGE_STATE, {
            url: USER.MANAGE_STANDARDMESSAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.MANAGE_STANDARDMESSAGE_VIEW,
                    controller: USER.MANAGE_STANDARDMESSAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();