(function () {
    'use strict';

    angular
        .module('app.admin.pageright', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        
        $stateProvider.state(USER.ADMIN_PAGERIGHT_STATE, {
            url: USER.ADMIN_PAGERIGHT_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_PAGERIGHT_VIEW,
                    controller: USER.ADMIN_PAGERIGHT_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        })
 
    }

})();