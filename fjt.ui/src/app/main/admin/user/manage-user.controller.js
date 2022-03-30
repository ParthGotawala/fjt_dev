(function () {
    'use strict';

    angular
        .module('app.admin.user')
        .controller('ManageUserController', ManageUserController);

    /** @ngInject */
    function ManageUserController($state, $stateParams, BaseService, $mdDialog, $timeout, CORE, USER,
		UserFactory, DialogFactory,$scope, RoleFactory,  PageDetailFactory, RolePagePermisionFactory, UserPagePermisionFactory) {
        const vm = this;
        vm.uid = $stateParams.uid ? $stateParams.uid : null;
        if (vm.uid)
            vm.isUpdatePagePermison = true
        else
            vm.isUpdatePagePermison = false
        vm.isCreateMode = $stateParams.uid ? false : true;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.USERSELECTEDROLE;
        vm.EmailPattern = CORE.EmailPattern;
        vm.UserPasswordPattern = CORE.UserPasswordPattern;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.issetRole = true;
        vm.activeType = false; 
        const userTemplate = {
            username: '',
            password: '',
            passwordConfirmation: '',
            emailAddress: '',
            firstName: '',
            lastName: ''
        };

        vm.user = Object.assign({}, userTemplate);
        vm.roles = [];
        vm.permissions = [];
        vm.permissionGroup = {};
        vm.otherPermissions = [];
        vm.pagepermision = [];
        vm.goBack = () => {
            $state.go(USER.ADMIN_USER_USER_STATE);
        }

        //vm.setHeight = () => {
        //    $timeout(() => {
        //        let ControlBox = document.getElementById("userlist");
        //        ControlBox.setAttribute("style", "min-height:" + (window.innerHeight - ControlBox.offsetTop - 80) + "px");
        //    }, 0);
        //}
        //vm.setHeight();
        // retrieve role
        vm.cgBusyLoading = RoleFactory.rolePermission().query().$promise.then((d) => {
           vm.roles = d.data;
        }).catch((error) => {
            return BaseService.getErrorLog(error);
        });

        //// retrieve permissions
        //vm.cgBusyLoading = PermissionFactory.permission()
        //    .query()
        //    .$promise
        //    .then((res) => {
        //        vm.permissions = res.data.map((permission) => (
        //            Object.assign(permission, {
        //                header: permission.name.split(':')[0],
        //                isChecked: false,
        //                permission: permission.name.split(':')[1],
        //                otherPermission: permission.otherPermission
        //            })
        //        ));
           
        //    }).catch((error) => {
        //        return BaseService.getErrorLog(error);
        //    });

        // retrieve other permissions

        vm.otherPermission = (permissionId, event) => {
            vm.permissionId = permissionId;
            vm.openAddEditOtherPermsisionPopup(vm, event);

        };

        // Open other permission popup
        vm.openAddEditOtherPermsisionPopup = (data, ev) => {

            DialogFactory.dialogService(
                USER.ADMIN_USER_ROLE_USEROTHERPERMISSION_CONTROLLER,
                USER.ADMIN_USER_ROLE_OTHERPERMISSION_VIEW,
                ev,
                data).then(() => {

                }, (err) => {
                    return BaseService.getErrorLog(err);
                });
        };

        // Called when any role selected
        vm.roleSelected = () => {
            const selectedRoles = vm.roles.filter((role) => role.isChecked);
            vm.selectedRoles = selectedRoles;
            // get all the selected permission, unique only
            const selectedPermissions =
                    selectedRoles.reduce((acc, role) => _.unionBy(acc, role.permissions, 'id'), []); // eslint-disable-line
                vm.permissions.forEach((permission) => {
                    const p = selectedPermissions.find((selectedPermission) => selectedPermission.id === permission.id);
                    if (p) {
                        permission.isChecked = true;
                        permission.isDisabled = true;
                    } else if (permission.isChecked && !permission.isDisabled) {
                        permission.isChecked = true;
                    } else {
                        permission.isChecked = false;
                        permission.isDisabled = false;
                    }
                });
        };
       
        //Called when select any Role at page permission Tab
        vm.pageroleSelected = (selectedRole, msWizard) => {
            const selectedRoles = vm.roles.filter((role) => role.isChecked);
            vm.selectedRoles = selectedRoles;
            vm.issetRole = true;
            // get all the selected permission, unique only
            const selectedPermissions =
                    selectedRoles.reduce((acc, role) => _.unionBy(acc, role.permissions, 'id'), []); // eslint-disable-line
                vm.getPagePermisionList(msWizard);
                let selected = selectedRoles.map((role) => {
                    return role.id;
                });
                let totalRoles = vm.roles.map((role) => {
                    return role.id;
                });
                let diff = _.difference(totalRoles, selected);
                vm.pageList.forEach((permission) => {
                    if (permission.roleID && _.includes(diff, permission.roleID)) {
                        vm.list = _.filter(vm.pageList, function (page) { return page.roleID == selectedRole.id; });
                        vm.list.forEach((page) => {
                            page.RO = false;
                            page.RW = false;
                            page.isActive = false;
                        });
                    }
                });

            
        };

        //Called when Checked any page permission
        vm.permissionSelected = (permissions, key) => {
            const checked = permissions.filter((permission) => permission.isChecked);
            if (checked.length === permissions.length) {
                vm.permissionGroup[key] = true;
            } else {
                vm.permissionGroup[key] = false;
            }
        };
        let getUserSpecificPermissions = () => {
            return vm.permissions
                .filter((permission) => permission.isChecked && !permission.isDisabled)
                .map((permission) => permission.id);
        }

        // get selected user for edit
        vm.getSelectedUser = () => {
            if (vm.uid) {
                vm.cgBusyLoading = UserFactory.user().query({ id: vm.uid })
                .$promise.then((users) => {
                
                    vm.user = users.data.user;
                    if (users.data.otherPermissions && users.data.otherPermissions.length > 0) {
                        users.data.otherPermissions.forEach((otherPermission, key) => {
                            let objExistOtherPerm = vm.otherPermissions.find((item) =>item.permissionId == otherPermission.permissionId && item.otherPermissionId == otherPermission.otherPermissionId);
                            if (!objExistOtherPerm) {
                                vm.otherPermissions.push({
                                    permissionId: otherPermission.permissionId,
                                    otherPermissionId: otherPermission.otherPermissionId
                                });
                            }
                        });
                    }

                    if (vm.user.roles.length > 0) {
                        vm.roles.forEach((role) => {
                            const selectedRole = vm.user.roles.find((r) => role.id === r.id);
                            if (selectedRole) {
                                role.isChecked = true;
                            } else {
                                role.isChecked = false;
                            }
                        });

                        // Set default permission given on specific role
                        vm.roleSelected();

                        // set user defined extra permission for selected role
                        if (vm.user.permissions.length > 0) {
                            vm.permissions.forEach((permission) => {
                                const selectedPermission = vm.user.permissions.find((p) => permission.id === p.id);
                                if (selectedPermission && !permission.isDisabled) {
                                    permission.isChecked = true;
                                } else if (!permission.isDisabled) {
                                    permission.isChecked = false;
                                }
                            });
                        } else {
                            vm.permissions.forEach((p) => { if (!p.isDisabled) { p.isChecked = false; } });
                        }

                    } else {
                        vm.roles.forEach((role) => { role.isChecked = false; });
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                $state.go(USER.ADMIN_USER_USER_STATE);
            }
        };

        if (vm.uid) {
            vm.getSelectedUser();
        }

        vm.user.isSync = false;
        vm.user.isUpdate = false;

        // save user basic info
        vm.CreateUser = (msWizard, isCheckUnique) => {
            if (vm.wizardStep1UserInfo.$valid) {
                vm.user.isCheckUnique = isCheckUnique ? isCheckUnique : false;
                vm.cgBusyLoading = UserFactory.user().save(Object.assign(vm.user, {})).$promise.then((user) => {
                    if (user.data.id) {
                        vm.user.isSync = false;
                        vm.user.isUpdate = false;
                        vm.user.id = user.data.id;
                        vm.uid = user.data.id;
                        vm.otherPermissions = [];
                        msWizard.nextStep();
                        $state.transitionTo($state.$current, { uid: vm.uid }, { location: true, inherit: true, notify: false });
                    } else {
                        if (user.data.isSync == false) {
                            let obj = {
                                title: stringFormat(CORE.MESSAGE_CONSTANT.USER_ISSYNC_TITLE, user.data.fieldName),
                                textContent: stringFormat(CORE.MESSAGE_CONSTANT.USER_ISSYNC_TEXTCONTENT),
                                btnText: CORE.MESSAGE_CONSTANT.USER_ISSYNC_BTNTEXT,
                                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                            };
                            DialogFactory.confirmDiolog(obj).then((yes) => {
                                if (yes) {
                                    vm.user.isSync = true;
                                    vm.CreateUser(msWizard, false);
                                }
                                
                            }, (cancel) => {
                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                        }
                        else if (user.data.isUpdate == false) {
                            let obj = {
                                title: stringFormat(CORE.MESSAGE_CONSTANT.USER_ISUPDATE_TITLE, user.data.fieldName),
                                textContent: stringFormat(CORE.MESSAGE_CONSTANT.USER_ISUPDATE_TEXTCONTENT),
                                btnText: CORE.MESSAGE_CONSTANT.USER_ISUPDATE_BTNTEXT,
                                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                            };
                            DialogFactory.confirmDiolog(obj).then((yes) => {
                                if (yes) {
                                    vm.user.isUpdate = true;
                                    vm.user.empId = user.data.empId;
                                    vm.CreateUser(msWizard, false);
                                }
                                
                            }, (cancel) => {
                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                        }
                        else {
                            let obj = {
                                title: stringFormat(CORE.MESSAGE_CONSTANT.ACTIVE_ALERT_MESSAGE, user.data.fieldName),
                                textContent: stringFormat(CORE.MESSAGE_CONSTANT.UNIQUE_CONFIRM_MESSAGE),
                                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                            };
                            DialogFactory.confirmDiolog(obj).then((yes) => {
                                if(yes)
                                vm.CreateUser(msWizard, false);
                            }, (cancel) => {
                            }).catch((error) => {
                                return BaseService.getErrorLog(error);
                            });
                        }
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                })
            }
        };

        //Called When checked on Active ALL
        vm.changeActiveType = (type, list) => {
            if (type) {
                _.each(list, (e) => {
                    e.isActive = true;
                    e.isChecked = true;
                });
            } else {
                _.each(list, (e) => {
                    e.isActive = false;
                    e.isChecked = true;
                });
            }
            // vm.getPageList();
        }

        // update user basic info
        vm.UpdateUser = (msWizard) => {
            if (vm.wizardStep1UserInfo.$valid) {
                let userEditTemplate = {
                    id: vm.user.id,
                    emailAddress: vm.user.emailAddress,
                    firstName: vm.user.firstName,
                    lastName: vm.user.lastName,
                    username: vm.user.username ? vm.user.username : "",
                };
                vm.cgBusyLoading = UserFactory.user().update({ id: vm.user.id }, Object.assign(userEditTemplate, {})).$promise.then((user) => {
                    if (user && !user.errors) {
                        userEditTemplate = Object.assign({}, userTemplate);
                       // msWizard.nextStep();
                    }
                    //msWizard.nextStep();
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        };

        // Create/Update role,permission,other permission for user
        vm.AssignRolePermissionToUser = () => {
            const roles = vm.roles
            .filter((role) => role.isChecked)
            .map((role) => role.id);
            const specificPermissions = getUserSpecificPermissions();
            const otherPermissions = vm.otherPermissions;
            if (roles && roles.length > 0)
            {
                if (vm.isCreateMode == false && !vm.user.id) {
                    let alertModel = {
                        title: USER.USER_ERROR_LABEL,
                        textContent: stringFormat(USER.SELECT_ONE_LABEL, "user")
                    };
                    DialogFactory.alertDialog(alertModel);
                $state.go(USER.ADMIN_USER_USER_STATE);
                return;
            }
            else if (vm.isCreateMode == true && (!vm.user.id || roles.length == 0)) {
                vm.user.userID = vm.user.id;
                let alertModel = {
                    title: USER.USER_ERROR_LABEL,
                    textContent: USER.CONTACT_TO_ADMIN_LABEL
                };
                DialogFactory.alertDialog(alertModel);
                $state.go(USER.ADMIN_USER_USER_STATE);
                return;
            }
            vm.user.userID = vm.user.id;
            vm.cgBusyLoading = UserFactory.assignRolePermissionToUser().save(Object.assign(vm.user, { roles, specificPermissions, otherPermissions })).$promise.then((user) => {
                vm.otherPermissions = [];
                // $state.go(USER.ADMIN_USER_USER_STATE);
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
         
        };

        //Get All Page List
        vm.getPageList = (msWizard) => {
            PageDetailFactory.getPageList().query().$promise.then((res) => {
                vm.pageList = res.data.map((page) => (
                  Object.assign(page, {
                      isChecked: false,
                      RO: false,
                      RW: false,
                      roleID: vm.roleId,
                      isChange: false,
                      isActive: false,
                  })
                ));
                vm.issetRole = true;
                vm.list = angular.copy(vm.pageList);
                vm.getuserPagePermisionList(msWizard);
                vm.getPagePermisionList(msWizard);
            });
        }

        //Get role wise Page permision List
        vm.getPagePermisionList = (msWizard) => {
            const roles = vm.roles
            .filter((role) => role.isChecked)
            .map((role) => role.id);
            if(roles.length > 0){
                vm.cgBusyLoading = RolePagePermisionFactory.rolePagePermision().query({ id: roles }).$promise.then((permisionList) => {
                    let PermisonList = permisionList.data;
                    if (PermisonList.length > 0 && vm.issetRole) {
                    _.each(PermisonList, (permissions) => {
                        //if (permissions.RW == true || permissions.RO == true) {
                            let selectedPage = _.find(vm.pageList, (page) => {
                                return page.pageID == permissions.PageID;
                            });
                            if (selectedPage) {
                                selectedPage.RO = !selectedPage.RO ? permissions.RO : selectedPage.RO;
                                selectedPage.RW = !selectedPage.RW ? permissions.RW : selectedPage.RW;
                                selectedPage.isChecked = true;
                                selectedPage.isActive = !selectedPage.isActive ? permissions.isActive : selectedPage.isActive;
                                selectedPage.roleID = permissions.roleID
                            }
                        //}
                    });
                    if (vm.pageList) {
                        let inactiveData = _.find(vm.pageList, (y) => { return !y.isActive });
                        if (inactiveData)
                            vm.activeType = false;
                        else
                            vm.activeType = true;
                    }
                    vm.issetRole = false;
                }

            });
        }
        }

        //Get User Page Permision
        vm.getuserPagePermisionList = (msWizard) => {
            return UserPagePermisionFactory.userPagePermision().query({ id: vm.uid }).$promise.then((permisionList) => {
                vm.PermisonList = permisionList.data;
               
                if (vm.PermisonList.length > 0) {
                    _.each(vm.PermisonList, (permissions) => {
                        //if (permissions.RW == true || permissions.RO == true) {
                            let selectedPage = _.find(vm.pageList, (page) => {
                                return page.pageID == permissions.PageID;
                            });
                            if (selectedPage) {
                                selectedPage.RO = permissions.RO;
                                selectedPage.RW = permissions.RW;
                                selectedPage.isChecked = true;
                                selectedPage.isActive = permissions.isActive;
                            }
                        //}
                    });
                }
                if (vm.pageList) {
                    let inactiveData = _.find(vm.pageList, (y) => { return !y.isActive });
                    if (inactiveData)
                        vm.activeType = false;
                    else
                        vm.activeType = true;
                }

            });

        }

        vm.CheckStepAndAction = (msWizard) => {
            //(vm.uid ? vm.UpdateUser(msWizard) : vm.CreateUser(msWizard, true))
            if (msWizard.selectedIndex == 0) {
                if (vm.uid)
                    vm.UpdateUser(msWizard)
                else
                    vm.CreateUser(msWizard, true)
            }
            else {
                vm.AssignRolePermissionToUser();
               // msWizard.resetForm();
            }
            msWizard.nextStep();
        }

        vm.pagepermissionSelected = (permissions, key) => {
            permissions.isChecked = true;
            let ActiveCount = _.filter(vm.pageList, (page) => {
                return !page.isActive;
            });
            vm.activeType = ActiveCount.length > 0 ? false : true;
            
        }

        //Assign Page permision to user
        vm.AssignPagePermissionToUser = () => {
            const roles = vm.roles
            .filter((role) => role.isChecked)
            .map((role) => role.id);
            vm.pageList = _.filter(vm.pageList, function (o) { return o.isChecked; });
            if (roles.length > 0) {
                vm.AssignRolePermissionToUser();
            }
            if (vm.isUpdatePagePermison) {
                _.each(vm.pageList, (permissions) => {
                    let obj = { 'PageID': permissions.pageID, 'userID': vm.user.id, 'RO': permissions.RO, 'RW': permissions.RW, 'isActive': permissions.isActive };
                    vm.pagepermision.push(obj);
                });
                vm.cgBusyLoading = UserPagePermisionFactory.userPagePermision().update({
                    id: vm.user.id,
                }, vm.pagepermision).$promise.then(() => {
                    $state.go(USER.ADMIN_USER_USER_STATE);
                });
            }
            else {
                _.each(vm.pageList, (permissions) => {
                    if (permissions.isActive) {
                        let obj = { 'PageID': permissions.pageID, 'userID': vm.user.id, 'RO': permissions.RO, 'RW': permissions.RW };
                        vm.pagepermision.push(obj);
                    }
                });
                vm.cgBusyLoading = UserPagePermisionFactory.userPagePermision().save(vm.pagepermision).$promise.then((res) => {
                    $state.go(USER.ADMIN_USER_USER_STATE);

                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }

        };

        vm.onTabChanges = (TabName, msWizard) => {
            if (msWizard.selectedIndex == 2)
                vm.getPageList(msWizard);
        }

        //close popup on page destroy 
        $scope.$on('$destroy', function () {
            $mdDialog.hide('', { closeAll: true });
        });
    }


})();
