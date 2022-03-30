(function () {
    'use strict';

    angular
        .module('app.pricing', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, PRICING, CORE) {
        // State
        $stateProvider.state(PRICING.PRICING_STATE, {
            url: PRICING.PRICING_ROUTE,
            views: {
                'main@': {
                    templateUrl: CORE.CONTENT_ONLY_VIEW,
                    controller: CORE.MAIN_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                },
                'content@app.pricing': {
                    templateUrl: PRICING.PRICING_VIEW,
                    controller: PRICING.PRICING_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();