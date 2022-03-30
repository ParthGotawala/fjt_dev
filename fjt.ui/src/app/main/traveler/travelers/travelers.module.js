(function () {
    'use strict';

    angular
        .module('app.traveler.travelers', ['flow'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, TRAVELER, CORE) {
        // State
        $stateProvider.state(TRAVELER.TRAVELER_MANAGE_STATE, {
            url: TRAVELER.TRAVELER_MANAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRAVELER.TRAVELER_MANAGE_VIEW,
                    controller: TRAVELER.TRAVELER_MANAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(TRAVELER.TRAVELER_MANAGE_ALL_STATE, {
            url: TRAVELER.TRAVELER_MANAGE_ALL_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRAVELER.TRAVELER_MANAGE_VIEW,
                    controller: TRAVELER.TRAVELER_MANAGE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();