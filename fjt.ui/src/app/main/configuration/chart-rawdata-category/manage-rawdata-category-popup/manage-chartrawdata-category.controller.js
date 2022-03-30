(function () {
    'use strict';

    angular
        .module('app.configuration.chartrawdatacategory')
        .controller('ManagerawdatacategoryPopupController', ManagerawdatacategoryPopupController);

    /** @ngInject */
    function ManagerawdatacategoryPopupController($mdDialog, CORE, data, BaseService, RawdataCategoryFactory,
                              $q, RawdataCategoryAccessRoleFactory, DialogFactory, RoleFactory) {

        const vm = this;
        vm.isSubmit = false;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.roles = [];
        let rawDataAccessRoleList = [];
        let oldRawDataCategoryName = '';
        //let oldRawDataDbViewName = '';

        vm.managerawdatacategory = {
            chartRawDataCatID: data == null ? null : data.chartRawDataCatID,
            name: data == null ? null : data.name,
            //dbViewName: data == null ? null : data.dbViewName
        };


        // retrieve all role list
        let getRoleList = () => {
            vm.roles = [];
            return RoleFactory.rolePermission().query().$promise.then((res) => {
                return vm.roles = res && res.data ? res.data : vm.roles;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        // retrieve all role list
        let getChartRoleAccessList = () => {
            rawDataAccessRoleList = [];
            return RawdataCategoryAccessRoleFactory.getAccessRoleByChartRawDataCategory().save({
                chartRawDataCatID: vm.managerawdatacategory.chartRawDataCatID
            }).$promise.then((res) => {
                return rawDataAccessRoleList = res && res.data ? res.data : rawDataAccessRoleList;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        //select All Role
        vm.selectAllRoles = () => {
            _.each(vm.roles, function (item) {
                item.isChecked = vm.isAllSelected;
            })
        }

        vm.checkChange = () => {
            let isAnyUnChecked = _.some(vm.roles, (o) => {
                return o.isChecked == false && o.isActive;
            });
            vm.isAllSelected = !isAnyUnChecked;
        }

        var pageLoadAllPromise = [getRoleList()];
        if (vm.managerawdatacategory && vm.managerawdatacategory.chartRawDataCatID) {
            pageLoadAllPromise.push(getChartRoleAccessList())
        }
        vm.cgBusyLoading = $q.all(pageLoadAllPromise).then((responses) => {

            _.map(vm.roles, function (item) {
                item.isChecked = false;
            });

            if (rawDataAccessRoleList && rawDataAccessRoleList.length > 0) {

                _.map(rawDataAccessRoleList, function (data) {
                    let roleMstObj = _.find(vm.roles, function (item) {
                        return data.roleID == item.id;
                    });
                    if (roleMstObj) {
                        roleMstObj.isChecked = true;
                    }
                });

                vm.roles = _.filter(vm.roles, function (data) {
                    if ((data.isActive) || data.isChecked && !data.isActive) {
                        return data;
                    }
                });

                let isAnyUnChecked = _.some(vm.roles, (o) => {
                    return !o.isChecked && o.isActive;
                });
                vm.isAllSelected = !isAnyUnChecked;
            }
            else {
                vm.roles = _.filter(vm.roles, function (roleObj) {
                    return roleObj.isActive;
                });
            }
            vm.roles = _.sortBy(vm.roles, 'accessLevel');
        }).catch((error) => {
            return BaseService.getErrorLog(error);
        });

        vm.saveRawdatacategory = () => {
            vm.isSubmit = false;
            if (!vm.ManagechartrawdatacategoryForm.$valid) {
                BaseService.focusRequiredField(vm.ManagechartrawdatacategoryForm);
                vm.isSubmit = true;
                return;
            }

            let selectedRoles = _.filter(vm.roles, function (item) { return item.isChecked });
            vm.managerawdatacategory.rawDataAccessRoleIDs = _.map(selectedRoles, function (item) { return item.id; })

            vm.cgBusyLoading = RawdataCategoryFactory.saveRawdataCategory().save(vm.managerawdatacategory).$promise.then((response) => {
                if (response && response.data) {
                    BaseService.currentPagePopupForm.pop();
                    $mdDialog.hide(response.data);
                }
            }).catch((error) => {
                BaseService.getErrorLog(error);
            });
        }

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.ManagechartrawdatacategoryForm);
            if (isdirty) {
                let data = {
                    form: vm.ManagechartrawdatacategoryForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPagePopupForm.push(vm.ManagechartrawdatacategoryForm);
      });

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };

        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        // Function call on Raw data Category name blue event and check name exist 
        vm.checkDuplicateRawCategoryName = () => {
            if (oldRawDataCategoryName != vm.managerawdatacategory.name) {
                if (vm.ManagechartrawdatacategoryForm &&
                    (vm.ManagechartrawdatacategoryForm.name.$dirty && vm.managerawdatacategory.name)) {

                    vm.cgBusyLoading = RawdataCategoryFactory.checkDuplicateRawDataCategoryDetails().save({
                        chartRawDataCatID: vm.managerawdatacategory.chartRawDataCatID,
                        name:  vm.managerawdatacategory.name,
                    }).$promise.then((res) => {
                        vm.cgBusyLoading = false;
                        oldRawDataCategoryName = angular.copy(vm.managerawdatacategory.name);
                        if (res && res.status == CORE.ApiResponseTypeStatus.FAILED) {
                            oldRawDataCategoryName = '';
                            vm.managerawdatacategory.name = '';
                          if (checkResponseHasCallBackFunctionPromise(res)) {
                              res.alretCallbackFn.then(() => {
                                setFocusByName('name');
                              });
                            }
                        }
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }
            }
        }

        //// Function call on Raw data db view name blue event and check name exist 
        //vm.checkDuplicateDbViewName = () => {
        //    if (oldRawDataDbViewName != vm.managerawdatacategory.dbViewName) {
        //        if (vm.ManagechartrawdatacategoryForm &&
        //            (vm.ManagechartrawdatacategoryForm.dbViewName.$dirty && vm.managerawdatacategory.dbViewName)) {

        //            vm.cgBusyLoading = RawdataCategoryFactory.checkDuplicateRawDataCategoryDetails().save({
        //                chartRawDataCatID: vm.managerawdatacategory.chartRawDataCatID,
        //                dbViewName: vm.managerawdatacategory.dbViewName 
        //            }).$promise.then((res) => {
        //                vm.cgBusyLoading = false;
        //                oldRawDataDbViewName = angular.copy(vm.managerawdatacategory.dbViewName);
        //                if (res && res.status == CORE.ApiResponseTypeStatus.FAILED) {
        //                    oldRawDataDbViewName = '';
        //                    vm.managerawdatacategory.dbViewName = '';
        //                    let dbViewNameEle = angular.element(document.querySelector('#dbViewName'));
        //                    dbViewNameEle.focus();
        //                }
        //            }).catch((error) => {
        //                return BaseService.getErrorLog(error);
        //            });
        //        }
        //    }
        //}
    }

})();
