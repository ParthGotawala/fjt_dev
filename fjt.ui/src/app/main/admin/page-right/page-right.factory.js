(function () {
    'use strict';

    angular
        .module('app.admin.pageright')
        .factory('PageRightFactory', PageRightFactory);

    /** @ngInject */
    function PageRightFactory($resource, CORE) {

        return {
            getUserList: (param) => $resource(CORE.API_URL + 'users/getUserList', {}, {
                query: {
                    isArray: false,
                    method: 'GET',
                },
            }),
        }
    }

})();