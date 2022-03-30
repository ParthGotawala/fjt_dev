(function () {
    'use strict';

    angular
        .module('app.admin.assignrightsandfetures', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State

        $stateProvider.state(USER.ADMIN_ASSIGNRIGHTSANDFETURES_STATE, {
            url: USER.ADMIN_ASSIGNRIGHTSANDFETURES_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ASSIGNRIGHTSANDFETURES_VIEW,
                    controller: USER.ADMIN_ASSIGNRIGHTSANDFETURES_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })

    }

})();