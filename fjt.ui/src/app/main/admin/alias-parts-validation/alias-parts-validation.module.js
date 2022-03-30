(function () {
    'use strict';
    angular
        .module('app.admin.aliasPartsValidation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_ALIAS_PARTS_VALIDATION_STATE, {
            url: USER.ADMIN_ALIAS_PARTS_VALIDATION_ROUTE,
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ALIAS_PARTS_VALIDATION_VIEW,
                    controller: USER.ADMIN_ALIAS_PARTS_VALIDATION_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();