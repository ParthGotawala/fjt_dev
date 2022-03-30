(function () {
    'use strict';
    /** @ngInject */
    var DBSCRIPT = {

        DBSCRIPT_ROUTE: '/dbscript',
        DBSCRIPT_STATE: 'app.dbscript',
        DBSCRIPT_CONTROLLER: 'DbScriptController',
        DBSCRIPT_VIEW: 'app/main/db-script/db-script.html',

    };
    angular
       .module('app.dbscript')
       .constant('DBSCRIPT', DBSCRIPT);
})();
