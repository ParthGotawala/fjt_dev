(function () {
    'use strict';
    angular
        .module('app.configuration',
            [
                'app.configuration.entity',
                'app.configuration.chartrawdatacategory',
                'app.configuration.dataelement',
                'app.configuration.managetemplate',
                'app.configuration.settings',
                'app.configuration.helpblog',
                'app.configuration.charttype',
                'app.configuration.configuresearch',
                 'textAngular'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, CONFIGURATION, CORE) {
        $stateProvider.state(CONFIGURATION.CONFIGURATION_STATE, {
            url: CONFIGURATION.CONFIGURATION_ROUTE,
            views: {
                'content@app': {
                    template: '<div ui-view></div>'
                }
            }
        });
        // Navigation
        //msNavigationServiceProvider.saveItem('configuration', {
        //    title: CONFIGURATION.CONFIGURATION_LABEL,
        //    icon: 'icon-tile-four',
        //    weight: 2
        //});
    }
})();