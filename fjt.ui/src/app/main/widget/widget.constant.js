(function () {
    'use strict';
    /** @ngInject */
    var WIDGET = {

        // Base route
        WIDGET_LABEL: 'Widget',
        WIDGET_ROUTE: '/widget',
        WIDGET_STATE: 'app.widget',
        WIDGET_CONTROLLER: '',
        WIDGET_VIEW: '',

        WIDGET_DASHBOARD_LABEL: 'Widget Dashboard',
        WIDGET_DASHBOARD_ROUTE: '/dashboard',
        WIDGET_DASHBOARD_STATE: 'app.widget.dashboard',
        WIDGET_DASHBOARD_CONTROLLER: 'WidgetDashboardController',
        WIDGET_DASHBOARD_VIEW: 'app/main/widget/widget-dashboard/widget-dashboard.html',

        WIDGET_ADD_MODAL_CONTROLLER: 'AddWidgetPopupController',
        WIDGET_ADD_MODAL_VIEW: 'app/main/widget/widget-dashboard/add-widget-popup.html',

        WIDGET_CATEGORY_MODAL_CONTROLLER: 'WidgetCategoryPopupController',
        WIDGET_CATEGORY_MODAL_VIEW: 'app/main/widget/widget-category-popup/widget-category-popup.html',

        WIDGET_DETAIL_LABEL: 'Widget Detail',
        WIDGET_DETAIL_ROUTE: '/detail/:chartTemplateID',
        WIDGET_DETAIL_STATE: 'app.widget.detail',
        WIDGET_DETAIL_CONTROLLER: 'WidgetDetailController',
        WIDGET_DETAIL_VIEW: 'app/main/widget/widget-detail/widget-detail.html',

        MANAGE_WIDGET_EMPLOYEE_CONTROLLER: 'WidgetEmployeePopupController',
        MANAGE_WIDGET_EMPLOYEE_VIEW: 'app/main/widget/widget-dashboard/widget-employee-popup/widget-employee-popup.html',

        WIDGET_EMPTYSTATE: {
            WIDGET: {
                IMAGEURL: 'assets/images/emptystate/widget-list.png',
                MESSAGE: 'No widget is added yet!',
                ADDNEWMESSAGE: 'Click below to add a widget.'
            },
            DETAIL: {
                IMAGEURL: 'assets/images/emptystate/widget-list.png',
                MESSAGE: 'No detail to display!'
            },
            ASSIGNEMPLOYEES: {
                IMAGEURL: 'assets/images/emptystate/employee.png',
                MESSAGE: 'No personnel are assigned.',
                ALL_ASSIGNED: 'All personnel are assigned.',
                EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
            }
        },
        WIDGET_TYPE: {
            SINGLE_OPERATION: {
                ID: 1,
                Name: 'Single operation chart'
            },
            MULTIPLE_OPERATION: {
                ID: 2,
                Name: 'Multiple operation chart'
            }
        },
        CHART_TYPE: {
            BAR: 1,
            LINE: 2,
            PIE: 3,
            PARETO: 4,
            DOTPLOT: 5,
            DONUT: 6
        },
        CHART_NAME: {
            BAR: 'column',
            LINE: 'line',
            PIE: 'pie',
            PARETO: 'pareto',
            DOTPLOT: 'dot plot',
            DONUT: 'donut'
        },
        CHART_RAWDATA_CATEGORY: {
            WORKORDER_PRODUCTION: 2,
        },
        CHART_TYPE_ICON: [
            { ID: 1, Type: 'Bar', IconClass: "icon-chart-bar" },
            { ID: 2, Type: 'Line', IconClass: "icon-chart-line" },
            { ID: 3, Type: 'Pie', IconClass: "icon-chart-pie" },
            { ID: 4, Type: 'Pareto', IconClass: "" },
            { ID: 5, Type: 'Dot Plot', IconClass: "" },
            { ID: 6, Type: 'Donut', IconClass: "" }
        ]
    };
    angular
       .module('app.widget')
       .constant('WIDGET', WIDGET);
})();
