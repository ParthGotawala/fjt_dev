(function () {
    'use strict';
    angular
        .module('app.admin.role')
        .controller('ManageRolePopupController', ManageRolePopupController);
    /** @ngInject */
    function ManageRolePopupController($mdDialog, data, CORE, RoleFactory, BaseService) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

        vm.role = {
            name: null,
            accessLevel: null
        };
        if (data && data.id) {
            vm.role.id = data.id;
        }
        if (vm.role.id) {
            vm.cgBusyLoading = RoleFactory.role().query({ id: vm.role.id }).$promise.then((response) => {
                if (response && response.data) {
                    vm.role.name = response.data.name;
                    vm.role.accessLevel = response.data.accessLevel;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        // save role details
        vm.saveRole = () => {
            RoleFactory.role().save(vm.role).$promise.then((res) => {
                if (res.data) {
                    if (res.data.id) {
                        $mdDialog.cancel(res.data);
                    }
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.roleForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };
    }
})();