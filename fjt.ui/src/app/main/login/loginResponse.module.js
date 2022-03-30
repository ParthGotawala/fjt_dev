// (function () {
//     'use strict';

//     angular
//         .module('app.loginresponse', [])
//         .config(config);

//     /** @ngInject */
//     function config($stateProvider, msNavigationServiceProvider, CORE) {
//         // State
//         $stateProvider.state(CORE.LOGIN_RESPONSE_STATE, {
//             url: CORE.LOGIN_RESPONSE_ROUTE,
//             views: {
//                 'main@': {
//                     templateUrl: CORE.CONTENT_ONLY_VIEW,
//                     controller: CORE.MAIN_CONTROLLER,
//                     controllerAs: CORE.CONTROLLER_AS
//                 },
//                 'content@app.loginresponse': {
//                     templateUrl: CORE.LOGIN_RESPONSE_VIEW,
//                     controller: CORE.LOGIN_RESPONSE_CONTROLLER,
//                     controllerAs: CORE.CONTROLLER_AS
//                 }
//             },
//             bodyClass: 'login theme-body',
//             onEnter: function ($state, BaseService) {
//                 BaseService.completeLoginResponse();
//             }
//         });
//     }

// })();