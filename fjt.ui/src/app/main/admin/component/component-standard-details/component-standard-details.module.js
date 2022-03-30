(function () {
    'use strict';

    angular
        .module('app.admin.componentStandardDetails', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        //$stateProvider.state(USER.ADMIN_COMPONENT_STANDARD_STATE, {
        //    url: USER.ADMIN_COMPONENT_STANDARD_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_COMPONENT_STANDARD_VIEW,
        //            controller: USER.ADMIN_COMPONENT_STANDARD_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});
    }

})();