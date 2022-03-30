(function () {
    'use strict';

    angular
        .module('app.widget')
        .factory('WidgetEmployeePopupFactory', WidgetEmployeePopupFactory);

    /** @ngInject */
    function WidgetEmployeePopupFactory($resource, CORE) {
        return {
            retrieveEmployeeChartTemplateDetails: () => $resource(CORE.API_URL + 'chart_template_access/retrieveEmployeeChartTemplateDetails/:chartTemplateID', {
                chartTemplateID: '@_chartTemplateID',
            },
           {
               query: {
                   isArray: false,
                   method: 'GET',
               }
           }),
            createChartTemplateEmployeeList: () => $resource(CORE.API_URL + 'chart_template_access/createChartTemplateEmployeeList', {
                listObj: '@_listObj',
            }, {
                query: {
                    method: 'POST',
                    isArray: false
                }
            }),
            deleteChartTemplateEmployeeList: () => $resource(CORE.API_URL + 'chart_template_access/deleteChartTemplateEmployeeList', {
                listObj: '@_listObj',
            }, {
                query: {
                    isArray: false
                }
            }),
        }
    }
})();