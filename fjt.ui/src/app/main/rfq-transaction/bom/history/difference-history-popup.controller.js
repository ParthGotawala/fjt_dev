(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('DiffOfBomEntryChangeController', DiffOfBomEntryChangeController);
    function DiffOfBomEntryChangeController(data, $mdDialog, BaseService, $scope, $filter) {
        const vm = this;
        if (data) {
            vm.auditLog = data;
            $scope.left = [$filter('htmlToPlaintext')(vm.auditLog.Oldval)].join('\n');
            $scope.right = [$filter('htmlToPlaintext')(vm.auditLog.Newval)].join('\n');
        }
        else {
            vm.close();
        }

        vm.close = () => {
            $mdDialog.cancel();
        };

    }
})();