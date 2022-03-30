(function () {
    'use strict';

    angular
        .module('app.reports.workorderdataelement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, REPORTS, CORE) {
        // State
        $stateProvider.state(REPORTS.WORKORDER_DATAELEMENT_STATE, {
            url: REPORTS.WORKORDER_DATAELEMENT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: REPORTS.WORKORDER_DATAELEMENT_VIEW,
                    controller: REPORTS.WORKORDER_DATAELEMENT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();