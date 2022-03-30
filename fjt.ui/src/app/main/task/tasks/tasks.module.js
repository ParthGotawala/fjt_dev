(function () {
    'use strict';

    angular
        .module('app.task.tasklist', ['flow'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, TASK, CORE) {
        // State
        // $stateProvider.state(TASK.TASK_MANAGE_STATE, {
        //     url: TASK.TASK_MANAGE_ROUTE,
        //     views: {
        //         'content@app': {
        //             templateUrl: TASK.TASK_MANAGE_VIEW,
        //             controller: TASK.TASK_MANAGE_CONTROLLER,
        //             controllerAs: CORE.CONTROLLER_AS
        //         }
        //     }
        // });

        $stateProvider.state(TASK.TASK_MANAGE_STATE, {
            url: TASK.TASK_MANAGE_ROUTE,
            views: {
                'content@app': {
                    templateUrl: TASK.TASK_MANAGE_NEW_VIEW,
                    controller: TASK.TASK_MANAGE_NEW_CONTROLLER,
                    controllerAs: CORE.CONTROLLER_AS
                }
            }
        });
    }

})();