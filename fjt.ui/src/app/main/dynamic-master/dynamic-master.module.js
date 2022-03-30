(function () {
    'use strict';
    angular
        .module('app.customforms',
            [
                'app.customforms.entity',
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, CUSTOMFORMS, CORE) {
        //$stateProvider.state(CUSTOMFORMS.CUSTOMFORMS_STATE, {
        //    url: CUSTOMFORMS.CUSTOMFORMS_ROUTE,
        //    views: {
        //        'content@app': {
        //            template: '<div ui-view></div>'
        //        }
        //    }
        //});
    }
})();