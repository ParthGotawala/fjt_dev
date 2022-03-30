(function () {
    'use strict';
    /** @ngInject */
    var HELPER_PAGE = {
        /**
         * ROUTES
         * STATES
         * CONTROLLERS
         * VIEWS / TEMPLATES
         * STRINGS
         */

        COMING_SOON_LABEL: 'Coming Soon',
        COMING_SOON_ROUTE: '/comingsoon',
        COMING_SOON_STATE: 'app.comingsoon',
        COMING_SOON_CONTROLLER: 'ComingSoonController',
        COMING_SOON_VIEW: 'app/main/helper-pages/coming-soon/coming-soon.html',

        UNAUTHORIZED_LABEL: '401',
        UNAUTHORIZED_ROUTE: '/401?pageRoute',
        UNAUTHORIZED_STATE: 'app.401',
        UNAUTHORIZED_CONTROLLER: 'UnauthorizedController',
        UNAUTHORIZED_VIEW: 'app/main/helper-pages/401/401.html',

        NOT_FOUND_LABEL: '404',
        NOT_FOUND_ROUTE: '/404',
        NOT_FOUND_STATE: 'app.404',
        NOT_FOUND_CONTROLLER: 'NotfoundController',
        NOT_FOUND_VIEW: 'app/main/helper-pages/404/404.html',

        API_ACCESS_LABEL: '501',
        API_ACCESS_ROUTE: '/501',
        API_ACCESS_STATE: 'app.501',
        API_ACCESS_CONTROLLER: 'ApiAccessController',
        API_ACCESS_VIEW: 'app/main/helper-pages/501/501.html',
        HELPER_PAGE_EMPTYSTATE: {
            COMING_SOON: {
                IMAGEURL: 'assets/images/emptystate/smile.png',
                MESSAGE: 'Coming Soon!',
                ADDNEWMESSAGE: 'We are working on something new !!'
            },
          
        },
        ERROR401: {
            MESSAGE: 'You do not have permission to access "<a id="viewRolePage">{0}</a>" page.',
            CONTETMESSAGE: 'Please contact to Administrator'
        },
        ERROR501: {
            MESSAGE: 'Oops looks likes something has gone wrong.',
            CONTETMESSAGE: 'Please contact to Administrator'
        },        
        ERROR404: {
           MESSAGE: 'Let’s try again.',
           CONTETMESSAGE: 'The page you requested is unavailable.'
        }
    };

    angular
       .module('app.helperpage')
       .constant('HELPER_PAGE', HELPER_PAGE);
})();
