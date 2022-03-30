(function () {
    'use strict';

    angular
        .module('app.reports.workordernarrativehistory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, REPORTS, CORE) {
        // State
        $stateProvider.state(REPORTS.WORKORDER_NARRATIVE_HISTORY_STATE, {
            url: REPORTS.WORKORDER_NARRATIVE_HISTORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: REPORTS.WORKORDER_NARRATIVE_HISTORY_VIEW,
                    controller: REPORTS.WORKORDER_NARRATIVE_HISTORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            params: {
                woID: null
            },
        });
    }

})();