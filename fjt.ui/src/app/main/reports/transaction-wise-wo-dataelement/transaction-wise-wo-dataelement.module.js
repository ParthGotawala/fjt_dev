(function () {
    'use strict';
    angular
        .module('app.reports.tranwisewodataelement', ['flow'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, REPORTS, CORE) {
        $stateProvider.state(REPORTS.TRAN_WISE_WO_DATAELEMENT_STATE, {
            url: REPORTS.TRAN_WISE_WO_DATAELEMENT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: REPORTS.TRAN_WISE_WO_DATAELEMENT_ENTITY_VIEW,
                    controller: REPORTS.TRAN_WISE_WO_DATAELEMENT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
    }
})();
