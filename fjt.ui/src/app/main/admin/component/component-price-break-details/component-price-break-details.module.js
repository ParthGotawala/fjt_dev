(function () {
    'use strict';

    angular
        .module('app.admin.componentpricebreakdetails', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_COMPONENT_PRICE_BREAK_DETAILS_STATE, {
            url: USER.ADMIN_COMPONENT_PRICE_BREAK_DETAILS_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_COMPONENT_PRICE_BREAK_DETAILS_VIEW,
                    controller: USER.ADMIN_COMPONENT_PRICE_BREAK_DETAILS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }
})();