(function () {
    'use strict';

    angular
        .module('app.operation',
            [
                'app.operation.operations',
                'app.operation.masterTemplate',
                'textAngular',
               
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, OPERATION) {

        $stateProvider.state(OPERATION.OPERATION_STATE, {
            url: OPERATION.OPERATION_ROUTE,
            views: {
                'content@app': {
                    template: '<div ui-view></div>'
                }
            }
        });

        //// Navigation
        //msNavigationServiceProvider.saveItem('operation', {
        //    title: OPERATION.OPERATION_LABEL,
        //    icon: 'icon-cog-box',
        //    weight: 3
        //});

        //msNavigationServiceProvider.saveItem('operation.template', {
        //    title: OPERATION.OPERATION_OPERATIONS_LABEL,
        //    icon: 'icon-cog',
        //    state: OPERATION.OPERATION_OPERATIONS_STATE
        //});

        //msNavigationServiceProvider.saveItem('operation.masterTemplate', {
        //    title: OPERATION.OPERATION_MASTER_TEMPLATE_LABEL,
        //    icon: 'icon-book-multiple-variant',
        //    state: OPERATION.OPERATION_MASTER_TEMPLATE_STATE
        //});
    }

})();