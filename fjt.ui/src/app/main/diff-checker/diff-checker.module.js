(function () {
    'use strict';

    angular
        .module('app.diffchecker', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, DIFFCHECKER, CORE) {
        // State
        $stateProvider.state(DIFFCHECKER.DIFFCHECKER_STATE, {
            url: DIFFCHECKER.DIFFCHECKER_ROUTE,
            views: {
                'main@': {
                    templateUrl: CORE.CONTENT_ONLY_VIEW,
                    controller: CORE.MAIN_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                },
                'content@app.diffchecker': {
                    templateUrl: DIFFCHECKER.DIFFCHECKER_VIEW,
                    controller: DIFFCHECKER.DIFFCHECKER_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
        });
    }

})();