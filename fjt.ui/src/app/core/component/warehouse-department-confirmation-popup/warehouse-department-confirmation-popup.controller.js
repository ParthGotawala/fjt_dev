(function () {
    'use strict';
    angular
        .module('app.core')
        .controller('WareHouseDepartmentConfirmationPopupController', WareHouseDepartmentConfirmationPopupController);
    /** @ngInject */
    function WareHouseDepartmentConfirmationPopupController($mdDialog, $q, data, CORE, BaseService, $timeout, DialogFactory, TRANSACTION) {
        const vm = this;
        vm.departmentType = TRANSACTION.Department_Search;
        vm.departmentSelectType = vm.departmentType.Department.key;
        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.save = () => {
            var whData = {
                key: vm.departmentSelectType
            };
            $mdDialog.cancel(whData);
        }
        
    };
})();