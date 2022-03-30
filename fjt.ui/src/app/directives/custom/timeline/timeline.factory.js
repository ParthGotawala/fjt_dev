(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('TimelineFactory', TimelineFactory);

    /** @ngInject */
    function TimelineFactory($resource, CORE) {
        return {
            timeline: (param) =>  $resource(CORE.API_URL + 'timeline/:id', {
                id: '@_id',
            }, {
                query: {
                    isArray: false,
                    method: 'GET',
                    params: {
                        page: param && param.Page ? param.Page : 1,
                        pageSize: 10,
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                    }
                },
                update: {
                    method: 'PUT',
                },
            })
        }
    }
})();