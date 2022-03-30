(function () {
    'use strict';

    angular
        .module('app.admin.user')
        .factory('UnauthorizedFactory', UnauthorizedFactory);

    /** @ngInject */
    function UnauthorizedFactory($resource, CORE) {
        return {
            getPageName: (param) => $resource(CORE.API_URL + 'pages/getPageName', {}, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: param ? {
                        pageRoute: param && param.pageRoute ? param.pageRoute : null
                    } : null
                },
                update: {
                    method: 'PUT',
                },
            }),
        }
        return
    }

})();