(function () {
    'use strict';
    angular
       .module('app.workorder.workorders')
       .controller('WorkorderOperationStatusController', WorkorderOperationStatusController);

    /** @ngInject */
    function WorkorderOperationStatusController($scope, WorkorderOperationFactory, BaseService, CORE) {
        // Don't Remove this code
        // Don't add any code before this
        $scope.vm = $scope.$parent.$parent.vm;
        //Add form name for check form dirty
        $scope.vm.CurrentForm = 'operationStatusForm';
        let vm = $scope.vm;
        // add code after this only
        // Don't Remove this code

        // Restrict changes into all fields if work order status is 'under termination'        
        //vm.isWOUnderTermination = (vm.operation.workorder.woStatus == CORE.WOSTATUS.UNDER_TERMINATION || vm.operation.workorder.woStatus == CORE.WOSTATUS.TERMINATED);

        // Save Work Order Operation Status
        vm.SaveWorkorderOperationStatus = () => {
            const operationStatus = {
                woOPID: vm.operation.woOPID,
                woID: vm.operation.woID,
                opID: vm.operation.opID,
                opStatus: vm.operation.opStatus,
                woNumber: vm.operation.workorder.woNumber,
                opName: vm.operation.opName,
                opTypeForWOOPTimeLineLog: CORE.Operations_Type_For_WOOPTimeLineLog.WoOpStatus
            }
            if (vm.operation.opID) {
                vm.cgBusyLoading = WorkorderOperationFactory.updateOperation().update({
                    id: vm.operation.woOPID,
                }, operationStatus).$promise.then((res) => {
                    vm.operationStatusForm.$setPristine();
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }
    };
    //angular
    //   .module('app.workorder.workorders').WorkorderOperationOtherDetailController = function () {
    //   };

})();