(function () {
    'use strict';
    /** @ngInject */
    var DIFFCHECKER = {

        DIFFCHECKER_ROUTE: '/diffchecker',
        DIFFCHECKER_STATE: 'app.diffchecker',
        DIFFCHECKER_CONTROLLER: 'DiffCheckerController',
        DIFFCHECKER_VIEW: 'app/main/diff-checker/diff-checker.html',

    };
    angular
       .module('app.diffchecker')
       .constant('DIFFCHECKER', DIFFCHECKER);
})();