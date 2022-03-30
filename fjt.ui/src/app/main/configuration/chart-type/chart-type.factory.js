(function () {
    'use strict';

    angular
        .module('app.configuration.charttype')
        .factory('ChartTypeFactory', ChartTypeFactory);

    /** @ngInject */
    function ChartTypeFactory($resource, CORE) {
        return {
            chartType: (param) =>  $resource(CORE.API_URL + 'charttypemst/saveChartType/', {},
            {
                query: {
                    isArray: false,
                },
                update: {
                    method: 'PUT',
                },
            }),

            retriveChartType: (param) => $resource(CORE.API_URL + 'charttypemst/retriveChartType', {},
            {
                query: {
                    isArray: false,
                    params: {
                        page: param && param.Page ? param.Page : 1,
                        pageSize: CORE.UIGrid.ItemsPerPage(),
                        order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
                        search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
                    }
                },
            }),

            getChartTypeList: () => $resource(CORE.API_URL + 'charttypemst/getChartTypeList', {},
           {
               query: {
                   isArray: false,
                   method: 'GET',
               }
           }),

            deleteChartType: () => $resource(CORE.API_URL + 'charttypemst/deleteChartType', {
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