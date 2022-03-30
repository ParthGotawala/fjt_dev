(function () {
    'use strict';

    angular
        .module('app.traveler',
            [
                'app.traveler.travelers',
                'textAngular'
            ]
        )
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $stateProvider, TRAVELER) {
        $stateProvider.state(TRAVELER.TRAVELER_STATE, {
            url: TRAVELER.TRAVELER_ROUTE,
            views: {
                'content@app': {
                    template: '<div></div>'
                }
            }
        });
    }
})();