(function () {
    'use strict';

    angular
        .module('app.transaction.shipped', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, TRANSACTION, CORE) {
        // State
        $stateProvider.state(TRANSACTION.TRANSACTION_SHIPPED_STATE, {
            url: TRANSACTION.TRANSACTION_SHIPPED_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRANSACTION.TRANSACTION_SHIPPED_VIEW,
                    controller: TRANSACTION.TRANSACTION_SHIPPED_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        }).state(TRANSACTION.TRANSACTION_MANAGESHIPPED_STATE, {
            url: TRANSACTION.TRANSACTION_MANAGESHIPPED_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRANSACTION.TRANSACTION_MANAGESHIPPED_VIEW,
                    controller: TRANSACTION.TRANSACTION_MANAGESHIPPED_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
            parentState: TRANSACTION.TRANSACTION_SHIPPED_STATE
        })
    }

})();