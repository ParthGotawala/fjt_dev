(function () {
    'use strict';

    angular
       .module('app.workorder.workorders')
       .controller('ManageWorkorderDocumentsController', ManageWorkorderDocumentsController);

    /** @ngInject */
    function ManageWorkorderDocumentsController($scope) {
        // Don't Remove this code
        // Don't add any code before this
        if (!$scope.$parent.$parent.vm.workorder || !$scope.$parent.$parent.vm.workorder.woID) {
            $state.go(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: null });
            return;
        }
        $scope.vm = $scope.$parent.$parent.vm;
        //Add form name for check form dirty
        $scope.vm.CurrentForm = null;
        const vm = $scope.vm;
        // add code after this only
        // Don't Remove this code
        vm.IsDocumentTab = true;
    };
})();
