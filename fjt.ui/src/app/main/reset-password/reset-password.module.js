// (function () {
//     'use strict';

//     angular
//         .module('app.resetpassword', [])
//         .config(config);

//     /** @ngInject */
//     function config($stateProvider, msNavigationServiceProvider, CORE) {
//         // State
//         $stateProvider.state(CORE.RESET_PASSWORD_STATE, {
//             url: CORE.RESET_PASSWORD_ROUTE,
//             views: {
//                 'main@': {
//                     templateUrl: CORE.CONTENT_ONLY_VIEW,
//                     controller: CORE.MAIN_CONTROLLER,
//                     controllerAs: CORE.CONTROLLER_AS
//                 },
//                 'content@app.resetpassword': {
//                     templateUrl: CORE.RESET_PASSWORD_VIEW,
//                     controller: CORE.RESET_PASSWORD_CONTROLLER,
//                     controllerAs: CORE.CONTROLLER_AS
//                 }
//             },
//             bodyClass: 'login theme-body'
//         });
//     }

// })();