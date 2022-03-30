(function () {
    'use strict';

    angular
        .module('app.helpblogdetail', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, HELP_BLOG_DETAIL, CORE) {
        // State
        $stateProvider.state(HELP_BLOG_DETAIL.HELPBLOGDETAIL_STATE, {
            url: HELP_BLOG_DETAIL.HELPBLOGDETAIL_ROUTE,
            views: {
                'content@app': {
                    templateUrl: HELP_BLOG_DETAIL.HELPBLOGDETAIL_VIEW,
                    controller: HELP_BLOG_DETAIL.HELPBLOGDETAIL_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }
})();
