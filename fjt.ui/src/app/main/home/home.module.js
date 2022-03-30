(function () {
    'use strict';

    angular
        .module('app.home', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, HOME, CORE) {
        // State
        $stateProvider.state(HOME.HOME_STATE, {
            url: HOME.HOME_ROUTE,
            views: {
                'content@app': {
                    templateUrl: HOME.HOME_VIEW,
                    controller: HOME.HOME_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }
})();