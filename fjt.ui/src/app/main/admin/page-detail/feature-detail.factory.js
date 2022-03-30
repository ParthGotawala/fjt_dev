(function () {
    'use strict';

    angular
        .module('app.admin.page')
        .factory('FeatureDetailFactory', FeatureDetailFactory);

    /** @ngInject */
    function FeatureDetailFactory($resource, CORE) {

        return {
            featureRoleMapping: (param) => $resource(CORE.API_URL + 'featureRoleMapping/:id', {
                role: '@_role',
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                },
                update: {
                    method: 'PUT',
                },
            }),

            featureUserMapping: (param) => $resource(CORE.API_URL + 'featureUserMapping/:id', {
                role: '@_role',
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                },
                update: {
                    method: 'PUT',
                },
            }),

            getFeaturesList: (param) => $resource(CORE.API_URL + 'feature/getFeaturesList', {}, {
                query: {
                    isArray: false,
                    method: 'GET',
                },
            }),

            AssignFeaturePageRights: () => $resource(CORE.API_URL + 'feature/AssignFeaturePageRights', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
        }
    }

})();