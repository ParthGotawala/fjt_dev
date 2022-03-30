(function () {
    'use strict';
    /** @ngInject */
    var HOME = {

        //Home
        HOME_CONTROLLER: 'HomeController',
        HOME_VIEW: 'app/main/home/home.html',
        HOME_STATE: 'app.home',
        HOME_ROUTE: '/home',

    };

    angular
       .module('app.home')
       .constant('HOME', HOME);
})();
