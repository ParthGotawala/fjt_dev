(function () {
    'use strict';

    angular
        .module('app.dbscript', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, DBSCRIPT, CORE) {
        // State
        $stateProvider.state(DBSCRIPT.DBSCRIPT_STATE, {
            url: DBSCRIPT.DBSCRIPT_ROUTE,
            views: {
                'main@': {
                    templateUrl: CORE.CONTENT_ONLY_VIEW,
                    controller: CORE.MAIN_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                },
                'content@app.dbscript': {
                    templateUrl: DBSCRIPT.DBSCRIPT_VIEW,
                    controller: DBSCRIPT.DBSCRIPT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            },
        });
    }

})();