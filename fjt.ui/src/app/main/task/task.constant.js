(function () {
    'use strict';
    /** @ngInject */
    var TASK = {

        TASK_LABEL: 'Task ',
        TASK_ROUTE: '/task',
        TASK_STATE: 'app.task',
        TASK_CONTROLLER: '',
        TASK_VIEW: '',

        TASK_MANAGE_LABEL: 'Task List',
        TASK_MANAGE_ROUTE: '/tasklist',
        TASK_MANAGE_STATE: 'app.task.tasklist',
        TASK_MANAGE_CONTROLLER: 'ManageTasksController',
        TASK_MANAGE_VIEW: 'app/main/task/tasks/manage-tasks.html',
        
        TASK_MANAGE_NEW_CONTROLLER: 'ManageTasksController',
        TASK_MANAGE_NEW_VIEW: 'app/main/task/tasks/manage-tasks.html',
        
        RUNNING_OPERATION: 'is-running',
        HALT_OPERATION: 'stop-chip',

        /**
		 * CONTROLLERS
		 */

        TASK_EMPTYSTATE: {
            TASK: {
                IMAGEURL: 'assets/images/emptystate/task.png',
                MESSAGE: 'No task is listed yet!',
                ADDNEWMESSAGE: 'Click below to add a task'
            },
            WORKORDER: {
                IMAGEURL: 'assets/images/emptystate/workorder.png',
                MESSAGE: 'No work order is listed yet!',
            },
            ACTIVEOPERATION: {
                IMAGEURL: 'assets/images/emptystate/operation.png',
                MESSAGE: 'No active operations available.',
            },
            OPERATION: {
                IMAGEURL: 'assets/images/emptystate/operation.png',
                MESSAGE: 'No operations available.',
            },
        },
    };
    angular
       .module('app.task.tasklist')
       .constant('TASK', TASK);
})();
