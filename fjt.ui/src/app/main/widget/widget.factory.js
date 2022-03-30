(function () {
    'use strict';

    angular
        .module('app.widget')
        .factory('WidgetFactory', WidgetFactory);

    /** @ngInject */
    function WidgetFactory($resource, CORE) {
        return {
            getChartTypeList: () => $resource(CORE.API_URL + 'charttypemst', null,
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getChartRawDataList: () => $resource(CORE.API_URL + 'chartrawdatacategory', null,
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getChartRawViewColumns: () => $resource(CORE.API_URL + 'chartrawdatacategory/getChartRawViewColumns/:id', {
                id: '@_id'
            },
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getChartTemplateDetail: () => $resource(CORE.API_URL + 'charttemplatemst/:chartTemplateID', {
                chartTemplateID: '@_chartTemplateID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            getChartDetailsByChartTemplateID: () => $resource(CORE.API_URL + 'charttemplatemst/getChartDetailsByChartTemplateID', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getChartDrilldownDetails: () => $resource(CORE.API_URL + 'charttemplatemst/getChartDrilldownDetails', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            saveChartTemplateDetail: () =>  $resource(CORE.API_URL + 'charttemplatemst', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),
            deleteChartTemplete: () =>  $resource(CORE.API_URL + 'charttemplatemst/deleteChartTemplete', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),
            getAllChartTemplete: () =>  $resource(CORE.API_URL + 'charttemplatemst/getAllChartTemplete', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),
            setWidgetToDashboard: () =>  $resource(CORE.API_URL + 'charttemplatemst/setWidgetToDashboard', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),
            setWidgetToTraveler: () =>  $resource(CORE.API_URL + 'charttemplatemst/setWidgetToTraveler', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),
            getChartCategoryList: () =>  $resource(CORE.API_URL + 'chartcategory/getChartCategoryList', {
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                },
            }),
            getEmployeewiseAllChartTemplete: () =>  $resource(CORE.API_URL + 'charttemplatemst/getEmployeewiseAllChartTemplete', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),

            getChartTemplateEmployeeList: () => $resource(CORE.API_URL + 'charttempalteemployee/getChartTemplateEmployeeList/:employeeID', {
                employeeID: '@_employeeID'
            }, {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            }),
            saveChartTemplateEmployeeList: () =>  $resource(CORE.API_URL + 'charttempalteemployee/saveChartTemplateEmployeeList', {
                templateEmployeeList: '@_templateEmployeeList'
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }),
            getChartRawDataListByAccessRole: () =>  $resource(CORE.API_URL + 'chartrawdatacategory/getChartRawDataListByAccessRole', {
            }, {
                query: {
                    isArray: false,
                    method: 'POST',
                },
            }), 
        }
    }
})();