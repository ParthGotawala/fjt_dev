(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ForgotPasswordPopupFactory', ForgotPasswordPopupFactory);

    /** @ngInject */
    function ForgotPasswordPopupFactory($resource, CORE) {
        return {
            forgotPassword: (param) =>  $resource(CORE.API_URL + 'forgotPassword', {
                username: '@_username',
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
        }
    }
})();