(function () {
    'use strict';

    angular
        .module('app.login')
        .factory('UserLogoutFactory', UserLogoutFactory);

    /** @ngInject */
    function UserLogoutFactory($resource, CORE) {
        return $resource(CORE.API_URL + 'logout', {
            username: '@_username',
        }, {
            query: {
                isArray: false,
                method: 'POST',
            },
        });
    }

})();