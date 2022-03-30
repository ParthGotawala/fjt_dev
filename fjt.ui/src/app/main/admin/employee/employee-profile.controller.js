(function () {
    'use strict';

    angular
        .module('app.admin.employee')
        .controller('EmployeeProfileController', EmployeeProfileController);

    /** @ngInject */
    function EmployeeProfileController($scope, $state, $stateParams, $timeout, EmployeeFactory, CORE, $mdDialog, DialogFactory, USER, Upload, PathService, DepartmentFactory, $filter, $window, DataElementTransactionValueFactory, OperationFactory, WorkorderFactory, BaseService, OPERATION, WORKORDER) {
        const vm = this;
        vm.dataElementList = [];
        vm.entityID = 0;
        vm.Entity = CORE.Entity;
        vm.EmailPattern = CORE.EmailPattern;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        let FileAllow = CORE.FileTypeList;
        vm.FileTypeList = _.map(FileAllow, 'extension').join(',');
        vm.dateFormate = _dateDisplayFormat;
        vm.isOtherField = true;
        vm.DisplayStatus = CORE.DisplayStatus;
        vm.WoStatus = CORE.WoStatus;
        vm.RoHSLeadFreeText = CORE.RoHSLeadFreeText;
        vm.OtherDetailTitle = CORE.OtherDetail.TabName;
        vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
        vm.LabelConstant = angular.copy(CORE.LabelConstant);
        vm.debounceConstant = CORE.Debounce;

        /*Move to equipment page*/
        vm.goToManageEquipmentWorkstation = (equip) => {
            BaseService.goToManageEquipmentWorkstation(equip.eqpID);
        }

        /*Get operation status from baseservice*/
        vm.getOpStatus = (statusID) => {
            return BaseService.getOpStatus(statusID);
        }
        /*Get workorder status from baseservice*/
        vm.getWoStatus = (statusID) => {
            return BaseService.getWoStatus(statusID);
        }
        /*Get workorder status class from baseservice*/
        vm.getWoStatusClassName = (statusID) => {
            return BaseService.getWoStatusClassName(statusID);
        }

        vm.employee = {
            //paymentMode: 'Fixed'
            paymentMode: CORE.PaymentMode.Exempt
        };
        vm.emailArray = [];
        vm.contactArray = [];
        vm.employeeId = $stateParams.id;
        vm.workStation = [];
        vm.selectedItems = [];

        //if set pagination from controller set true to here
        //vm.ispagination = true;

        vm.queryDepartment = {
            order: '',
            department_search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };
        vm.queryWorktation = {
            order: '',
            workstation_search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };

        vm.queryWorkOrder = {
            order: '',
            workorder_search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };
        vm.queryOperation = {
            order: '',
            operation_search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };
        vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH

        /* retreive employee profile details*/

        if (vm.employeeId) {
            let IDs = [];
            // let StandardClass = [];
          vm.cgBusyLoading = EmployeeFactory.retrieveEmployeeProfile().query({ id: vm.employeeId }).$promise.then((employees) => {            
                vm.employee = employees.data;
                vm.workorder = [];
                vm.operationEmployee = [];
                vm.employee.employeeProfile.operationEmployee.forEach((value) => {
                    value.Operations.opDescription = vm.htmlToPlaintext(value.Operations.opDescription);
                    value.Operations.opDoes = vm.htmlToPlaintext(value.Operations.opDoes);
                    value.Operations.opDonts = vm.htmlToPlaintext(value.Operations.opDonts);
                    value.Operations.opStatus = vm.getOpStatus(value.Operations.opStatus);
                });
                vm.employeeOperation = vm.employee.employeeProfile.operationEmployee;

                if (vm.employee.employeeProfile.profileImg) {
                    vm.profilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.employee.employeeProfile.profileImg;
                }
                else {
                    vm.profilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                }

                if (vm.employee.employeeProfile.employeeDepartment.length > 0) {
                    vm.defaultDepartment = _.find(vm.employee.employeeProfile.employeeDepartment, (listItem) => {
                        return listItem.isDefault == true;
                    });
                    vm.employeeDepartment = vm.employee.employeeProfile.employeeDepartment;
                }
                if (vm.employee.employeeProfile.employeeEquipment.length > 0) {
                    _.each(vm.employee.employeeProfile.employeeEquipment, (itemData) => {
                        if (itemData.equipment)
                            vm.workStation.push(itemData.equipment);

                    });
                }


                //if (vm.employee.employeeProfile.employeeDepartment.length > 0) {
                //    _.each(vm.employee, (itemData) => {
                //        itemData.employeeDepartment = _.find(itemData.employeeDepartment, (listItem) => {
                //            return listItem.isDefault == true;
                //        });

                //    });
                //}
                /*Check empty state*/
                if (vm.employee.employeeProfile.workorderOperationEmployee.length != 0) {
                    vm.isWorkorder = true;
                    vm.employee.employeeProfile.workorderOperationEmployee.forEach((value) => {
                        if (value.workorder) {

                            // update child table data to workorder obj
                            if (value.workorder.componentAssembly) {
                                value.workorder.PIDCode = value.workorder.componentAssembly.PIDCode;
                                value.workorder.nickName = value.workorder.componentAssembly.nickName;
                                value.workorder.mfgPN = value.workorder.componentAssembly.mfgPN;
                                value.workorder.mfgPNDescription = value.workorder.componentAssembly.mfgPNDescription;
                            }

                            value.workorder.className = vm.getWoStatusClassName(value.workorder.woSubStatus);
                            value.workorder.woStatus = vm.getWoStatus(value.workorder.woSubStatus);
                            vm.workorder.push(value);
                        }

                    });
                }
                else
                    vm.isWorkorder = false;

                vm.employeeWorkOrder = vm.workorder = _.uniqBy(vm.workorder, function (e) {
                    return e.woID;
                });
                if (vm.employee.employeeProfile.operationEmployee.length != 0)
                    vm.isOperation = true
                else
                    vm.isOperation = false
                if (vm.employee.employeeProfile.employeeDepartment.length != 0)
                    vm.isDepartment = true
                else
                    vm.isDepartment = false
                if (vm.employee.employeeProfile.employeeEquipment.length != 0)
                    vm.isemployeeEquipment = true
                else
                    vm.isemployeeEquipment = false

                if (vm.employee.employeeProfile.workorderOperationEmployee) {
                    vm.employee.employeeProfile.workorderOperationEmployee = _.uniqBy(vm.employee.employeeProfile.workorderOperationEmployee, 'woID');
                    _.each(vm.employee.employeeProfile.workorderOperationEmployee, (item) => {
                        var priority = null;

                        if (item.workorder) {
                            _.each(item.workorder.workorderCertification, (certificate) => {
                                if (priority == null) {
                                    priority = certificate.certificateStandards.priority;
                                    item.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
                                    item.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
                                }
                                else {
                                    if (priority > certificate.certificateStandards.priority) {
                                        priority = certificate.certificateStandards.priority;
                                        item.colorCode = certificate.standardsClass ? certificate.standardsClass.colorCode ? certificate.standardsClass.colorCode : null : null;
                                        item.className = certificate.standardsClass ? certificate.standardsClass.className ? certificate.standardsClass.className : null : null;
                                    }

                                }
                            });

                            if (item.workorder.RoHSStatusID != null && item.workorder.rohs) {
                                item.rohsText = item.workorder.rohs.name;
                                item.rohsIcon = vm.rohsImagePath + item.workorder.rohs.rohsIcon;
                            }
                            _.remove(item.workorder.workorderCertification);
                            _.remove(item.selectedClasses);
                        }
                    })
                }

            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });

        }


        vm.searchDepartment = (item) => {
            if (item) {
                let searchTxt = angular.copy(item).toLowerCase();
                vm.employeeDepartment = []
                vm.employeeDepartment = _.filter(vm.employee.employeeProfile.employeeDepartment, (department) => {
                    return department.genericCategory.gencCategoryName.toLowerCase().indexOf(searchTxt) != -1
                        || department.department.deptName.toLowerCase().indexOf(searchTxt) != -1;
                });
            }
            else {
                vm.employeeDepartment = vm.employee.employeeProfile.employeeDepartment;
            }
        }

        vm.searchOperation = (item) => {
            if (item) {
                let searchTxt = angular.copy(item).toLowerCase();
                vm.employeeOperation = []
                vm.employeeOperation = _.filter(vm.employee.employeeProfile.operationEmployee, (operation) => {
                    return operation.Operations.opName.toLowerCase().indexOf(searchTxt) != -1
                        || operation.Operations.opStatus.toLowerCase().indexOf(searchTxt) != -1;
                });
            }
            else {
                vm.employeeOperation = vm.employee.employeeProfile.operationEmployee;
            }
        }

        vm.searchWorkOrder = (item) => {
            if (item) {
                let searchTxt = angular.copy(item).toLowerCase();
                vm.employeeWorkOrder = []
                vm.employeeWorkOrder = _.filter(vm.workorder, (workorder) => {
                    return workorder.workorder.woNumber.toLowerCase().indexOf(searchTxt) != -1
                        || workorder.workorder.woVersion.toLowerCase().indexOf(searchTxt) != -1
                        || workorder.workorder.PIDCode.toLowerCase().indexOf(searchTxt) != -1
                        || workorder.workorder.nickName.toLowerCase().indexOf(searchTxt) != -1
                        || workorder.workorder.woStatus.toLowerCase().indexOf(searchTxt) != -1
                        || workorder.workorder.mfgPNDescription.toLowerCase().indexOf(searchTxt) != -1
                        || workorder.workorder.mfgPN.toLowerCase().indexOf(searchTxt) != -1;
                });
            }
            else {
                vm.employeeWorkOrder = vm.workorder;
            }
        }

        vm.htmlToPlaintext = (text) => {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }

        vm.setHeight = () => {
            setTimeout(() => {
                var ControlBox = document.getElementsByClassName("manage-customer-tabing");
                _.each(ControlBox, (item) => {
                    item.setAttribute("style", "min-height:" + (window.innerHeight - item.offsetTop - 150) + "px");
                });
            }, 0);
        }
        vm.setHeight();

        vm.backToEmployee = () => {
            $state.go(USER.ADMIN_EMPLOYEE_STATE);
        };

        /* operation profile*/
        vm.operationProfile = (row, ev) => {
            BaseService.goToOperationProfile(row.opID);
        };

        ///* workorder profile*/
        vm.workorderProfile = (row, ev) => {
            BaseService.goToWorkorderProfile(row.woID);
        };

        /* workstation profile*/
        vm.workstationProfile = (row, ev) => {
            BaseService.goToEquipmentProfile(row.eqpID);
        };
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }

})();
