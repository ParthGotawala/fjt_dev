(function () {
    'use strict';

    angular
        .module('app.admin.defectCategory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_DEFECTCATEGORY_STATE, {
            url: USER.ADMIN_DEFECTCATEGORY_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_DEFECTCATEGORY_VIEW,
                    controller: USER.ADMIN_DEFECTCATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();