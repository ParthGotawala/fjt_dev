(function () {
    'use strict';

    angular
        .module('app.operation')
        .factory('OperationFileFactory', OperationFileFactory);

    /** @ngInject */
    function OperationFileFactory($resource, CORE) {
        return $resource(CORE.API_URL + 'operations/deleteFile/:id', {
            id: '@_id',
        }, {
            query: {
                isArray: false,
            },
            update: {
                method: 'PUT',
            },
        });
    }

})();