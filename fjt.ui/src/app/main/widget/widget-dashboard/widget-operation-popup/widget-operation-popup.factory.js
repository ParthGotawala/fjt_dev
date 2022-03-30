(function () {
    'use strict';

    angular
        .module('app.widget')
        .factory('WidgetOperationPopupFactory', WidgetOperationPopupFactory);

    /** @ngInject */
    function WidgetOperationPopupFactory($resource, CORE) {
        return {
            saveChartTempOperation: () => $resource(CORE.API_URL + 'ChartTemplateOperations/saveChartTemplateOperations', null,
            {
                query: {
                    isArray: false,
                    method: 'POST'
                }
            }),
            getChartTempOperation: () => $resource(CORE.API_URL + 'ChartTemplateOperations/getChartTemplateOperationsList/:chartTemplateID', {
                chartTemplateID: '@_chartTemplateID'
            },
            {
                query: {
                    isArray: false,
                    method: 'GET'
                }
            })
        }
    }
})();