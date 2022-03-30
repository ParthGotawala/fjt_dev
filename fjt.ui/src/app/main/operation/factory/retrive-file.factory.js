(function () {
    'use strict';

    angular
        .module('app.operation')
        .factory('RetriveFileFactory', RetriveFileFactory);

    /** @ngInject */
    function RetriveFileFactory($resource, CORE) {
        return $resource(CORE.API_URL + 'operations/retriveFiles/:id', {
            id: '@_id',
        }, {
            query: {
                isArray: false,
            },
        });
    }

})();