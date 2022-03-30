(function () {
    'use strict';
    angular
        .module('app.widget', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, WIDGET, CORE) {
        $stateProvider.state(WIDGET.WIDGET_STATE, {
            url: WIDGET.WIDGET_ROUTE,
            views: {
                'content@app': {
                    template: '<div ui-view></div>'
                }
            }
        }).state(WIDGET.WIDGET_DASHBOARD_STATE, {
            url: WIDGET.WIDGET_DASHBOARD_ROUTE,
            views: {
                'content@app': {
                    templateUrl: WIDGET.WIDGET_DASHBOARD_VIEW,
                    controller: WIDGET.WIDGET_DASHBOARD_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(WIDGET.WIDGET_DETAIL_STATE, {
            url: WIDGET.WIDGET_DETAIL_ROUTE,
            views: {
                'content@app': {
                    templateUrl: WIDGET.WIDGET_DETAIL_VIEW,
                    controller: WIDGET.WIDGET_DETAIL_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            parentState: WIDGET.WIDGET_DASHBOARD_STATE
        })
    }
})();