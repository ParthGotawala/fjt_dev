(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('UserService', ['store', UserService]);

    /** @ngInject */
    function UserService(store) {
        let currentUser = null;
        return {
            setCurrentUser: (user) => {
                currentUser = user;
                store.set('user', user);
                return currentUser;
            },

            setCurrentUserToken: (token) => {
                store.set('token', token);
                return currentUser;
            },

            getCurrentUserToken: () => (
                store.get('token')
            ),

            getCurrentUser: () => {
                if (!currentUser) {
                    currentUser = store.get('user');
                }
                return currentUser;
            },
        };
    }

})();