(function () {
    'use strict';
    angular
        .module('app.configuration.settings', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        // State
        $stateProvider.state(CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_STATE, {
            url: CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_ROUTE,
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }
})();