(function () {
    'use strict';

    angular
        .module('app.admin.employee')
        .controller('EmployeeTimelineController', EmployeeTimelineController);

    /** @ngInject */
    function EmployeeTimelineController($rootScope, $scope, $state, $stateParams, $timeout, BaseService, USER) {
        const vm = this;
        vm.userID = $stateParams.id;

        vm.backToEmployee = () => {
            $state.go(USER.ADMIN_EMPLOYEE_STATE);
        };
    }

})();