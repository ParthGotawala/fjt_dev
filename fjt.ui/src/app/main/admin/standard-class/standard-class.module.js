(function () {
    'use strict';

    angular
        .module('app.admin.standardClass', [])
        .config(config);
    function config($stateProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.STANDARD_CLASS_STATE, {
            url: USER.STANDARD_CLASS_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.STANDARD_CLASS_VIEW,
                    controller: USER.STANDARD_CLASS_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
    }

})();