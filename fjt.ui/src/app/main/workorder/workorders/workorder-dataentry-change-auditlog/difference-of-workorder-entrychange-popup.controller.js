(function () {
    'use strict';

    angular
        .module('app.workorder.workorders')
        .controller('DiffOfWorkorderEntryChangeController', DiffOfWorkorderEntryChangeController);
    function DiffOfWorkorderEntryChangeController(data, $mdDialog, BaseService, $scope, $filter, WorkorderOperationEmployeeFactory) {
        const vm = this;
        if (data) {
            vm.auditLog = data;
            $scope.left = [$filter('htmlToPlaintext')(vm.auditLog.Oldval)].join('\n');
            $scope.right = [$filter('htmlToPlaintext')(vm.auditLog.Newval)].join('\n');
        }
        else {
            vm.close();
        }

        if (vm.auditLog.Tablename && vm.auditLog.RefTransID && vm.auditLog.Colname == "ISDELETED") {
            if (vm.auditLog.Tablename.toLowerCase() == "workorder_operation_employee") {
                vm.cgBusyLoading = WorkorderOperationEmployeeFactory.getEmployeeForAuditLogByWoOpEmployeeID().query({ woOpEmployeeID: vm.auditLog.RefTransID }).$promise.then((employeedetails) => {
                    vm.empDetails = employeedetails.data;
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }

        //$scope.options = {
        //    editCost: 4,
        //    interLineDiff: true,
        //    ignoreTrailingNewLines: true,
        //    attrs: {
        //        insert: {
        //            'data-attr': 'insert',
        //            'class': 'insertion'
        //        },
        //        delete: {
        //            'data-attr': 'delete'
        //        },
        //        equal: {
        //            'data-attr': 'equal'
        //        }
        //    }
        //};

        vm.close = () => {
            $mdDialog.cancel();
        };

    }
})();