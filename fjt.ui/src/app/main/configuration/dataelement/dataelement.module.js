(function () {
    'use strict';
    angular
        .module('app.configuration.dataelement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        // State
        $stateProvider.state(CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_STATE, {
            url: CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            parentState: CONFIGURATION.CONFIGURATION_ENTITY_STATE
        }).state(CONFIGURATION.CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE, {
            url: CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            parentState: CONFIGURATION.CONFIGURATION_MANUAL_ENTITY_STATE
        }).state(CONFIGURATION.CONFIGURATION_DATAELEMENT_VIEW_STATE, {
            url: CONFIGURATION.CONFIGURATION_DATAELEMENT_VIEW_ROUTE,
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_DATAELEMENT_VIEW_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_DATAELEMENT_VIEW_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();