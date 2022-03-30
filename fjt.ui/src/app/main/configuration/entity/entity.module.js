(function () {
    'use strict';
    angular
        .module('app.configuration.entity', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        // State
        $stateProvider.state(CONFIGURATION.CONFIGURATION_ENTITY_STATE, {
            url: CONFIGURATION.CONFIGURATION_ENTITY_ROUTE,
            params: {
                systemGenerated: '1'
            },
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_ENTITY_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_ENTITY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(CONFIGURATION.CONFIGURATION_MANUAL_ENTITY_STATE, {
            url: CONFIGURATION.CONFIGURATION_MANUAL_ENTITY_ROUTE,
            params: {
                systemGenerated: '0'
            },
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_ENTITY_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_ENTITY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });

        //msNavigationServiceProvider.saveItem('configuration.entity', {
        //    title: CONFIGURATION.CONFIGURATION_ENTITY_LABEL,
        //    icon: 'icon-spotlight',
        //    state: CONFIGURATION.CONFIGURATION_ENTITY_STATE
        //});
    }

})();