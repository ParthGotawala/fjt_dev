(function () {
    'use strict';

    angular
        .module('app.admin.componentLogicalGroup', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_COMPONENT_LOGICAL_GROUP_STATE, {
            url: USER.ADMIN_COMPONENT_LOGICAL_GROUP_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_COMPONENT_LOGICAL_GROUP_VIEW,
                    controller: USER.ADMIN_COMPONENT_LOGICAL_GROUP_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();