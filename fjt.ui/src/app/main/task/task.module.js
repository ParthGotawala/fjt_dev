(function () {
    'use strict';

    angular
        .module('app.task',
            [
                'app.task.tasklist',
                'textAngular'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, TASK) {
        $stateProvider.state(TASK.TASK_STATE, {
            url: TASK.TASK_ROUTE,
            views: {
                'content@app': {
                    template: '<div ui-view></div>'
                }
            }
        });
        //// Navigation
        //msNavigationServiceProvider.saveItem('TASK', {
        //    title: TASK.TASK_LABEL,
        //    icon: 'icon-barcode',
        //    weight: 3
        //});

        //msNavigationServiceProvider.saveItem('TASK.manage', {
        //    title: TASK.TASK_MANAGE_LABEL,
        //    icon: 'icon-barcode',
        //    state: TASK.TASK_MANAGE_STATE
        //});
    }
})();