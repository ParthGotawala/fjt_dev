(function () {
    'use strict';

    angular
        .module('app.transaction.inhouseassemblystock', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, TRANSACTION, CORE) {
        
        $stateProvider.state(TRANSACTION.TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_STATE, {
            url: TRANSACTION.TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TRANSACTION.TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_VIEW,
                    controller: TRANSACTION.TRANSACTION_IN_HOUSE_ASSEMBLY_STOCK_LIST_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();