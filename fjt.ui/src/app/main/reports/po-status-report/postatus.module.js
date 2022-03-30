(function () {
    'use strict';

    angular
        .module('app.reports.postatusreport', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, REPORTS, CORE) {
        // State
        $stateProvider.state(REPORTS.PO_STATUS_REPORT_STATE, {
            url: REPORTS.PO_STATUS_REPORT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: REPORTS.PO_STATUS_REPORT_VIEW,
                    controller: REPORTS.PO_STATUS_REPORT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(REPORTS.PO_STATUS_CUSTOMER_REPORT_STATE, {
            url: REPORTS.PO_STATUS_CUSTOMER_REPORT_ROUTE,
            data:{
                displayReportFor: CORE.PO_STATUS_REPORT.displayReportFor.customer
            },
            views: {
                'customerpostatus': {
                    templateUrl: REPORTS.PO_STATUS_CUSTOMER_REPORT_VIEW,
                    controller: REPORTS.PO_STATUS_CUSTOMER_REPORT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(REPORTS.PO_STATUS_PO_REPORT_STATE, {
            url: REPORTS.PO_STATUS_PO_REPORT_ROUTE,
            data: {
                displayReportFor: CORE.PO_STATUS_REPORT.displayReportFor.po
            },
            views: {
                'customerpostatus': {
                    templateUrl: REPORTS.PO_STATUS_PO_REPORT_VIEW,
                    controller: REPORTS.PO_STATUS_PO_REPORT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(REPORTS.PO_STATUS_ASSY_REPORT_STATE, {
            url: REPORTS.PO_STATUS_ASSY_REPORT_ROUTE,
            data: {
                displayReportFor: CORE.PO_STATUS_REPORT.displayReportFor.assembly
            },
            views: {
                'customerpostatus': {
                    templateUrl: REPORTS.PO_STATUS_ASSY_REPORT_VIEW,
                    controller: REPORTS.PO_STATUS_ASSY_REPORT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(REPORTS.PO_STATUS_WORKORDER_REPORT_STATE, {
            url: REPORTS.PO_STATUS_WORKORDER_REPORT_ROUTE,
            data: {
                displayReportFor: CORE.PO_STATUS_REPORT.displayReportFor.workorder
            },
            views: {
                'customerpostatus': {
                    templateUrl: REPORTS.PO_STATUS_WORKORDER_REPORT_VIEW,
                    controller: REPORTS.PO_STATUS_WORKORDER_REPORT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();