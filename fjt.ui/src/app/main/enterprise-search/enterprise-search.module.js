(function () {
    'use strict';

    angular
        .module('app.enterprisesearch', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, ENTERPRISE_SEARCH, CORE) {
        // State
        $stateProvider.state(ENTERPRISE_SEARCH.ENTERPRISE_SEARCH_STATE, {
            url: ENTERPRISE_SEARCH.ENTERPRISE_SEARCH_ROUTE,
            params:{
                searchText: ''
            },
            views: {
                'content@app': {
                    templateUrl: ENTERPRISE_SEARCH.ENTERPRISE_SEARCH_VIEW,
                    controller: ENTERPRISE_SEARCH.ENTERPRISE_SEARCH_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }
})();
