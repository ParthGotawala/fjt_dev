(function () {
    'use strict';

    angular.module('app.admin.user')
        .controller('UserOtherPermissionPopupController', UserOtherPermissionPopupController);

    function UserOtherPermissionPopupController($mdDialog, data, RoleFactory) {

        const vm = this;

        if (data.selectedRoles && data.selectedRoles.length > 0) {
            var selectedRolesIds = data.selectedRoles
                .map((role) => role.id)
        }

        vm.getOtherPersmissionList = () => {
            vm.cgBusyLoading = RoleFactory.otherActivePermissionsWithRoleOtherPermission().query({ roleIds: selectedRolesIds ? selectedRolesIds : 0 })
            .$promise.then((response) => {
                vm.otherPermissionList = response.data.otherpermission;
                const rolesOtherPermission = response.data.rolesOtherPermission;

                vm.otherPermissionList.map(item=> {
                    item.permissionId = data.permissionId;
                })

                // select other permissions role wise that is default (that given from role page)
                let selectedOtherPermissionsRole = vm.otherPermissionList.forEach((otherPermission, key) => {
                    let objSelectedOtherPerm = rolesOtherPermission.find(item=> {
                        return item.otherPermissionId == otherPermission.id && item.permissionId == data.permissionId;
                    });
                    if (objSelectedOtherPerm) {
                        otherPermission.isChecked = true;
                        otherPermission.isDisabled = true;

                    }
                    else {
                        otherPermission.isChecked = false;
                        otherPermission.isDisabled = false;
                    }
                });


                // select other permissions user wise (that given explicitly)
                let selectedOtherPermissionsExp = data.otherPermissions.forEach((item, key) => {
                    let objSelectedOtherPerm = vm.otherPermissionList.find(otherPermission=> {
                        return item.otherPermissionId == otherPermission.id && item.permissionId == data.permissionId;
                    });

                    if (objSelectedOtherPerm) {
                        objSelectedOtherPerm.isChecked = true;
                        //objSelectedOtherPerm.isDisabled = false;
                    }

                });


                if (vm.otherPermissionList.filter((otherPermission) => otherPermission.isChecked).length == vm.otherPermissionList.length) {
                    vm.checkAll = true;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            }); 
        };

        vm.getOtherPersmissionList();

        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.addOtherPermissionForRole = () => {
            let selectedPerm = vm.otherPermissionList.filter((otherPermission) => otherPermission.isChecked && !otherPermission.isDisabled);

            let selectedOtherPermissions = selectedPerm.forEach((otherPermission, key) => {
                let objExistOtherPerm = data.otherPermissions.find((item) =>item.permissionId == data.permissionId && item.otherPermissionId == otherPermission.id);

                if (!objExistOtherPerm) {
                    data.otherPermissions.push({
                        permissionId: data.permissionId,
                        otherPermissionId: otherPermission.id
                    });
                }
            });
            $mdDialog.cancel();
        }

        vm.checkUncheckOtherPermissionForRole = (objOtherPermission) => {
            var objOthePerm = data.otherPermissions.find((objPerm) =>objPerm.permissionId == objOtherPermission.permissionId && objPerm.otherPermissionId == objOtherPermission.id);
            var index = data.otherPermissions.indexOf(objOthePerm);
            if (!objOtherPermission.isChecked) {
                if (index != -1) {
                    data.otherPermissions.splice(index, 1);
                }
            }
        };

        vm.checkAllPermission = () => {
            vm.otherPermissionList.forEach((otherPermission) => {
                if (!otherPermission.isDisabled) {
                    otherPermission.isChecked = vm.checkAll;
                }
                if (!vm.checkAll) {
                    var objOthePerm = data.otherPermissions.find((objPerm) =>objPerm.permissionId == otherPermission.permissionId && objPerm.otherPermissionId == otherPermission.id);
                    var index = data.otherPermissions.indexOf(objOthePerm);
                    if (index != -1) {
                        data.otherPermissions.splice(index, 1);
                    }
                }
            });
        };
    }
})();