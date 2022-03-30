(function () {
    'use strict';

    angular
        .module('app.operation')
        .factory('MasterTemplateFactory', MasterTemplateFactory);

    /** @ngInject */
    function MasterTemplateFactory($resource, CORE) {
        return $resource(CORE.API_URL + 'jobs/masterTemplates', {
        }, {
            query: {
                isArray: false,
                method: 'GET',
            },
            update: {
                method: 'PUT',
            },
        });
    }

})();