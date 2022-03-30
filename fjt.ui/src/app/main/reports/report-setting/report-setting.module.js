(function () {
    'use strict';

    angular
        .module('app.reports.report', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, REPORTS, CORE) {
        // State
        $stateProvider.state(REPORTS.REPORT_SETTING_LIST_STATE, {
            url: REPORTS.REPORT_SETTING_LIST_ROUTE,
            views: {
                'content@app': {
                    templateUrl: REPORTS.REPORT_SETTING_LIST_VIEW,
                    controller: REPORTS.REPORT_SETTING_LIST_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            resolve: {
            },
        });
    }

})();