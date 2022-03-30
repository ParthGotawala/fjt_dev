(function () {
    'use strict';
    angular
        .module('app.admin.eco', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, USER, CORE) {
        // State
        $stateProvider.state(USER.ADMIN_ECO_CATEGORY_STATE, {
            url: USER.ADMIN_ECO_CATEGORY_ROUTE,
            params: {
                categoryType: '1'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ECO_CATEGORY_VIEW,
                    controller: USER.ADMIN_ECO_CATEGORY_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        $stateProvider.state(USER.ADMIN_ECO_CATEGORY_VALUES_STATE, {
            url: USER.ADMIN_ECO_CATEGORY_VALUES_ROUTE,
            params: {
                categoryType: '1'
            },
            views: {
                'content@app': {
                    templateUrl: USER.ADMIN_ECO_CATEGORY_VALUES_VIEW,
                    controller: USER.ADMIN_ECO_CATEGORY_VALUES_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
        //$stateProvider.state(USER.ADMIN_ECO_CATEGORY_STATE, {
        //    url: USER.ADMIN_ECO_CATEGORY_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_ECO_CATEGORY_VIEW,
        //            controller: USER.ADMIN_ECO_CATEGORY_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});
        //$stateProvider.state(USER.ADMIN_ECO_CATEGORY_Values_STATE, {
        //    url: USER.ADMIN_ECO_CATEGORY_Values_ROUTE,
        //    views: {
        //        'content@app': {
        //            templateUrl: USER.ADMIN_ECO_CATEGORY_Values_VIEW,
        //            controller: USER.ADMIN_ECO_CATEGORY_Values_CONTROLLER,
        //            controllerAs: CORE.CONTROLLER_AS
        //        }
        //    }
        //});
    }

})();