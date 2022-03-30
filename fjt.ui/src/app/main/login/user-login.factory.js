(function () {
    'use strict';

    angular
        .module('app.login')
        .factory('UserLoginFactory', UserLoginFactory);

    /** @ngInject */
    // function UserLoginFactory($resource, CORE) {
    //     return $resource(CORE.API_URL + 'login', {
    //         username: '@_username',
    //     }, {
    //         query: {
    //             isArray: false,
    //             method: 'POST',
    //         },
    //     });
    // }

    function UserLoginFactory($resource, CORE) {
        return $resource(CORE.API_URL + 'loginWithIdentityUserId', {
            username: '@_username',
        }, {
            query: {
                isArray: false,
                method: 'POST',
            },
        });
    }



})();