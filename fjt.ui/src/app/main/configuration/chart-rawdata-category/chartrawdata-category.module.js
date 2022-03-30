(function () {
    'use strict';
    angular
        .module('app.configuration.chartrawdatacategory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        // State
        $stateProvider.state(CONFIGURATION.CONFIGURATION_RAWDATACATEGORY_STATE, {
            url: CONFIGURATION.CONFIGURATION_RAWDATACATEGORY_ROUTE,
            //params: {
            //    systemGenerated: '1'
            //},
            views: {
                'content@app': {
                    templateUrl: CONFIGURATION.CONFIGURATION_RAWDATACATEGORY_VIEW,
                    controller: CONFIGURATION.CONFIGURATION_RAWDATACATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();