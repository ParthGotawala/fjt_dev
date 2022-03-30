(function () {
    'use strict';
    angular
        .module('app.configuration.charttype', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        // State
        $stateProvider.state(CONFIGURATION.CONFIGURATION_CHARTTYPE_STATE, {
            url: CONFIGURATION.CONFIGURATION_CHARTTYPE_ROUTE,
            //params: {
            //    systemGenerated: '1'
            //},
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_CHARTTYPE_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_CHARTTYPE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();