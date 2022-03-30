(function () {
    'use strict';

    angular
        .module('app.operation.masterTemplate', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, OPERATION, CORE) {
        // State
        $stateProvider.state(OPERATION.OPERATION_MASTER_TEMPLATE_STATE, {
            url: OPERATION.OPERATION_MASTER_TEMPLATE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: OPERATION.OPERATION_MASTER_TEMPLATE_VIEW,
                    controller: OPERATION.OPERATION_MASTER_TEMPLATE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_STATE, {
            url: OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_VIEW,
                    controller: OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();