(function () {
    'use strict';

    angular
    .module('app.core').factory('contextMenuService', contextMenuService);

    /** @ngInject */
    function contextMenuService($http) {
        var service = {
            contextMenuItem: {
                AssignOperationToCluster: {
                    Label: 'Move To Cluster',
                },
                DeleteOperationFromCluster: {
                    Label: 'Remove From Cluster',
                },
            },
        };

        return service;
    }
})();