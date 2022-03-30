(function () {
    'use strict';
    angular
        .module('app.configuration.configuresearch', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        // State
        $stateProvider.state(CONFIGURATION.CONFIGURATION_SEARCH_STATE, {
            url: CONFIGURATION.CONFIGURATION_SEARCH_ROUTE,
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_SEARCH_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_SEARCH_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();