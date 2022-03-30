(function () {
    'use strict';

    angular
        .module('app.reports.misreport', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, REPORTS, CORE) {
        // State
        $stateProvider.state(REPORTS.MIS_REPORT_STATE, {
            url: REPORTS.MIS_REPORT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: REPORTS.MIS_REPORT_VIEW,
                    controller: REPORTS.MIS_REPORT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();