(function () {
    'use strict';

    angular
       .module('app.reports.misreport')
        .controller('MISReportEmployeePopupController', MISReportEmployeePopupController);

    /** @ngInject */
    function MISReportEmployeePopupController(DynamicReportAccessFactory, RoleFactory, $mdDialog, data, BaseService,
                CORE, USER, REPORTS, $timeout, $scope, uiSortableMultiSelectionMethods, $filter, $q, DialogFactory) {
        const vm = this;
        let dynamicReportID = data.dynamicReportID;
        vm.reportName = data.reportName;
        vm.reportCreatedByEmployeeID = data.reportCreatedByUserDet.employeeID;  /* for not removing user that created reoprt even by */
        vm.EmptyMesssageEmployees = REPORTS.REPORTS_EMPTYSTATE.ASSIGNEMPLOYEES;
        let _employeeAddedList = [];
        let _employeeNoAddedList = [];
        vm.SearchAddedListEmployee = null;
        vm.SearchNoAddedListEmployee = null;
        let loginUserDetails = BaseService.loginUser;
        //vm.EmptyMesssageForOpDataFields = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEMPLOYEES;
        vm.isContainOpMasterEmployee = false;
        vm.debounceConstant = CORE.Debounce;

        vm.headerdata = [
            { label: 'Report Name', value: vm.reportName, displayOrder: 1 }
        ]

        /* get all roles to show in drop down selection */
        let getRoles = () => {
            vm.cgBusyLoading = RoleFactory.rolePermission().query().$promise.then((res) => {
                vm.roles = res.data;
                var activeRole = _.filter(vm.roles, function (data) {
                    if (data.isActive)
                        return data;
                });
                vm.roles = activeRole;
                vm.roles.unshift({ id: 0, name: 'All' });
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /* get all employees to add/remove from access reports */
        let retrieveEmployeeReportDetails = () => {
            vm.SearchAddedListEmployee = null;
            vm.SearchNoAddedListEmployee = null;

            vm.cgBusyLoading = DynamicReportAccessFactory.retrieveEmployeesOfMISReportDetails().save({ 
                refTransID: dynamicReportID ,
                refTableName:CORE.DBTableName.DynamicReportMst
            }).$promise.then((res) => {
                if (res.data) {
                    /* remove self employee from drag-drop */
                    _.remove(res.data, function (item) {
                        return item.id == loginUserDetails.employee.id;
                    });
                    _employeeAddedList = vm.employeeAddedList = [];
                    _employeeNoAddedList = vm.employeeNoAddedList = [];
                    _.each(res.data, (itemData) => {
                        //itemData.name = (itemData.firstName ? itemData.firstName : "") + " " + (itemData.lastName ? itemData.lastName : "");
                        // itemData.employeeDepartment = _.first(itemData.employeeDepartment);
                        if (itemData.employeeDepartment) {
                            itemData.employeeDepartment = _.first(itemData.employeeDepartment);
                        }
                        let deptName = "";
                        let gencCategoryName = "";
                        if (itemData.employeeDepartment && itemData.employeeDepartment.department) {
                            deptName = " (" + itemData.employeeDepartment.department.deptName + ")";
                        }
                        if (itemData.employeeDepartment && itemData.employeeDepartment.genericCategory) {
                            gencCategoryName = " " + itemData.employeeDepartment.genericCategory.gencCategoryName;
                        }
                        //itemData.name = (itemData.firstName ? itemData.firstName : "") + " " + (itemData.lastName ? itemData.lastName : "") + deptName + gencCategoryName;
                        itemData.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, itemData.initialName, itemData.firstName, itemData.lastName) + deptName + gencCategoryName;
                        if (itemData.profileImg) {
                            itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + itemData.profileImg;
                        }
                        else {
                            itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                        }
                        itemData.dynamicReportAccess = _.first(itemData.dynamicReportAccess);
                        if (itemData.dynamicReportAccess) {
                            vm.employeeAddedList.push(itemData);
                        }
                        else {
                            vm.employeeNoAddedList.push(itemData);
                        }
                    });
                    reorderList();
                    _employeeAddedList = angular.copy(vm.employeeAddedList);

                    // Filter active Employee only in _EmployeeNoAddedList
                    vm.employeeNoAddedList = _.filter(vm.employeeNoAddedList, (emp) => {
                        return emp.isActive;
                    });
                    _employeeNoAddedList = angular.copy(vm.employeeNoAddedList);

                    if (_employeeNoAddedList.length == 0 && _employeeAddedList.length == 0) {
                        vm.isContainOpMasterEmployee = false;
                    }
                    else {
                        vm.isContainOpMasterEmployee = true;
                    }
                    setSelectableListItem();
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }


        vm.refreshDataEmployee = () => {
            vm.RoleVal = 0;
            vm.isHideSearchButtonEmployee = false;
            retrieveEmployeeReportDetails();
        }

        vm.addDataEmployee = (data, ev) => {
            var data = {};
          let popUpData = { popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName };
            let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
            if (isAccessPopUp) {
                DialogFactory.dialogService(
                USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
                USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
                ev,
                data).then(() => {
                }, (data) => {
                    if (data) {
                        vm.refreshDataEmployee();
                    }
                },
                 (err) => {
                 });
            }
        }

        let reorderList = () => {
            _employeeAddedList = _.sortBy(_employeeAddedList, 'name');
            _employeeNoAddedList = _.sortBy(_employeeNoAddedList, 'name');
            vm.employeeAddedList = _.sortBy(vm.employeeAddedList, 'name');
            vm.employeeNoAddedList = _.sortBy(vm.employeeNoAddedList, 'name');
        }

        if (dynamicReportID) {
            getRoles();
            retrieveEmployeeReportDetails();
        } else {
            vm.cancel();
        }

        $scope.selectedEmployeeListNoAdded = [];
        $scope.selectedEmployeeListAdded = [];
        //#region sortable option common for all list
        $scope.sortableOptionsEmployee = uiSortableMultiSelectionMethods.extendOptions({
            cancel: ".cursor-not-allow",
            placeholder: "beingDragged",
            'ui-floating': true,
            cursorAt: {
                top: 0, left: 0
            },
            start: (e, ui) => {
            },
            sort: (e, ui) => {
            },
            stop: (e, ui) => {
                let sourceModel = ui.item.sortable.model;
                if (ui.item.sortable.droptarget) {
                    let sourceTarget = ui.item.sortable.source[0];
                    let dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
                    let SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
                    let DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
                    if (SourceDivAdded != DestinationDivAdded) {
                        if (SourceDivAdded == false && DestinationDivAdded == true) {
                            if ($scope.selectedEmployeeListNoAdded.length == 0) {
                                $scope.selectedEmployeeListNoAdded.push(sourceModel);
                            }
                            vm.ModifyPageAddedEmployee("Add");
                            return;
                        }
                        else if (SourceDivAdded == true && DestinationDivAdded == false) {
                            if ($scope.selectedEmployeeListAdded.length == 0) {
                                $scope.selectedEmployeeListAdded.push(sourceModel);
                            }
                            vm.ModifyPageAddedEmployee("Remove");
                            return;
                        }
                    }
                }
            },
            connectWith: '.items-container'
        });
        //#endregion


        //#region reset value of selected element
        let ResetSelectedEmployee = () => {
            $scope.selectedEmployeeListNoAdded = [];
            $scope.selectedEmployeeListAdded = [];
            $scope.selectAnyNoAddedEmployee = false;
            $scope.selectAnyAddedEmployee = false;
        }
        //#endregion

        //#region check for selected employee
        let checkSelectAllFlagEmployee = () => {
            $scope.selectAnyNoAddedEmployee = $scope.selectedEmployeeListNoAdded.length > 0 ? true : false;
            $scope.selectAnyAddedEmployee = $scope.selectedEmployeeListAdded.length > 0 ? true : false;
        }
        //#endregion

        //#region unselect all element list
        let UnSelectAllEmployee = () => {
            angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
            angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
            ResetSelectedEmployee();
        }
        //#endregion

        //#region unselect single element list
        let UnSelectEmployee = (unSelectFrom) => {
            if (unSelectFrom == "NoAdded") {
                angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
            }
            else {
                angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
            }
            ResetSelectedEmployee();
        }
        //#endregion

        //#region  set item selectable
        let SetEmployeeSelectable = () => {
            angular.element('[ui-sortable]#employeeAddedList').on('ui-sortable-selectionschanged', function (e, args) {
                UnSelectEmployee("NoAdded");
                let $this = $(this);
                let selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
                    return $(this).index();
                }).toArray();
                $scope.selectedEmployeeListAdded = _.map(selectedItemIndexes, function (i) {
                    return vm.employeeAddedList[i];
                });
                checkSelectAllFlagEmployee();
                $scope.$applyAsync();
            });
            angular.element('[ui-sortable]#employeeNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
                UnSelectEmployee("Added");
                let $this = $(this);
                let selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
                    return $(this).index();
                }).toArray();
                $scope.selectedEmployeeListNoAdded = _.map(selectedItemIndexes, function (i) {
                    return vm.employeeNoAddedList[i];
                });
                checkSelectAllFlagEmployee();
                $scope.$applyAsync();
            });
        }

        let setSelectableListItem = () => {
            $timeout(() => {
                SetEmployeeSelectable();
            }, _configSelectListTimeout);
        }
        //#endregion

        //#region for destroy selection
        let DestroyEmployeeSelection = () => {
            angular.element('[ui-sortable]#employeeNoAddedList').off('ui-sortable-selectionschanged');
            angular.element('[ui-sortable]#employeeAddedList').off('ui-sortable-selectionschanged');
        }

        let DestroyAllSelectionEmployee = () => {
            DestroyEmployeeSelection();
        }
        //#endregion

        //#region On change of tab
        $scope.$on('$destroy', (e) => {
            DestroyAllSelectionEmployee();
        });
        //#endregion

        vm.SearchEmployee = (list, searchText, RoleVal, IsAdded) => {
            UnSelectAllEmployee();
            if (!searchText && (RoleVal == 0 || !RoleVal)) {
                if (IsAdded) {
                    vm.SearchAddedListEmployee = null;
                    vm.isHideSearchButtonaddedEmployee = false;
                    vm.employeeAddedList = _employeeAddedList;
                    vm.FilterEmployeeAdded = true;
                } else {
                    vm.RoleVal = 0;
                    vm.SearchNoAddedListEmployee = null;
                    vm.isHideSearchButtonEmployee = false;
                    vm.FilterEmployeeNotAdded = true;
                    if (RoleVal == 0 || !RoleVal) {
                        vm.employeeNoAddedList = _employeeNoAddedList;
                    }
                    else {
                        vm.employeeNoAddedList = $filter('filter')(_employeeNoAddedList, (item) => {
                            return _.find((_.first(item.user).roles), (userroleitem) => {
                                return userroleitem.id == RoleVal;
                            });
                        });
                    }
                }
                return;
            }
            else {
                if (IsAdded) {
                    vm.isHideSearchButtonaddedEmployee = true;
                }
                else {
                    vm.isHideSearchButtonEmployee = true;
                }
            }
            if (IsAdded) {
                vm.employeeAddedList = searchText ? ($filter('filter')(_employeeAddedList, { name: searchText })) : _employeeAddedList;
                vm.FilterEmployeeAdded = vm.employeeAddedList.length > 0;
            }
            else {
                if (RoleVal == 0) {
                    vm.employeeNoAddedList = searchText ? ($filter('filter')(_employeeNoAddedList, { name: searchText })) : _employeeNoAddedList;
                }
                else {
                    //vm.employeeNoAddedList = $filter('filter')(_employeeNoAddedList, { roleId: RoleVal, name: searchText });
                    let empList = $filter('filter')(_employeeNoAddedList, (item) => {
                        return _.find((_.first(item.user).roles), (userroleitem) => {
                            return userroleitem.id == RoleVal;
                        });
                    });
                    vm.employeeNoAddedList = searchText ? ($filter('filter')(empList, { name: searchText })) : empList;
                }
                vm.FilterEmployeeNotAdded = vm.employeeNoAddedList.length > 0;
            }

        }


        //#region modify employee Added based on selection from both list
        vm.ModifyPageAddedEmployee = (addType, event) => {
            if (event) {
                event.preventDefault();
            }
            if (addType == "Add") {
                var promises = [saveMISReportEmployees($scope.selectedEmployeeListNoAdded)];
                vm.cgBusyLoading = $q.all(promises).then(function (responses) {
                    if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        _.each($scope.selectedEmployeeListNoAdded, (item) => {
                            let added = _.find(_employeeAddedList, (element) => {
                                return item.id == element.id
                            });
                            if (!added) {
                                _employeeAddedList.push(item);
                            }
                        });
                        _.each($scope.selectedEmployeeListNoAdded, (item) => {
                            _employeeNoAddedList = _.without(_employeeNoAddedList,
                                       _.find(_employeeNoAddedList, (valItem) => {
                                           return valItem.id == item.id;
                                       })
                                );
                        });
                        UnSelectAllEmployee();
                        setMISReportEmployeeDragDropDetails();
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else if (addType == "Remove") {

                var promises = [deleteMISReportEmployee($scope.selectedEmployeeListAdded)];
                vm.cgBusyLoading = $q.all(promises).then(function (responses) {
                    if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        _.each($scope.selectedEmployeeListAdded, (item) => {
                            let added = _.find(_employeeNoAddedList, (element) => {
                                return item.id == element.id
                            });
                            if (!added) {
                                //if employee is active then it store back to to _EmployeeNoAddedList
                                if (item.isActive)
                                    _employeeNoAddedList.push(item);
                            }
                        });
                        _.each($scope.selectedEmployeeListAdded, (item) => {
                            _employeeAddedList = _.without(_employeeAddedList,
                                     _.find(_employeeAddedList, (valItem) => {
                                         return valItem.id == item.id;
                                     })
                                );
                        });
                        UnSelectAllEmployee();
                        setMISReportEmployeeDragDropDetails();
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else if (addType == "AddAll") {
                var promises = [saveMISReportEmployees(vm.employeeNoAddedList)];
                vm.cgBusyLoading = $q.all(promises).then(function (responses) {
                    if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        _.each(vm.employeeNoAddedList, (item) => {
                            let added = _.find(_employeeAddedList, (element) => {
                                return item.id == element.id
                            });
                            if (!added) {
                                _employeeAddedList.push(item);
                            }
                        });
                        _.each(_employeeAddedList, (item) => {
                            _employeeNoAddedList = _.without(_employeeNoAddedList,
                                     _.find(_employeeNoAddedList, (valItem) => {
                                         return valItem.id == item.id;
                                     })
                                );
                        });
                        UnSelectAllEmployee();
                        setMISReportEmployeeDragDropDetails();
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else if (addType == "RemoveAll") {
                let reportCreatedEmpData = _.find(vm.employeeAddedList, (removeItem) => {
                    return removeItem.id == vm.reportCreatedByEmployeeID;
                });
              if (reportCreatedEmpData && vm.employeeAddedList.length == 1) {                
                let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.EMP_DELETE_NOT_ALLOWED_BY_CREATED_EMP);
                var model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
                return;

                }
                let employeeAddedListWithOutCreatedEmp = _.filter(vm.employeeAddedList, (removeItem) => {
                    return removeItem.id != vm.reportCreatedByEmployeeID;
                });
                var promises = [deleteMISReportEmployee(employeeAddedListWithOutCreatedEmp)];
                vm.cgBusyLoading = $q.all(promises).then(function (responses) {
                    if (responses[0] && responses[0].status == CORE.ApiResponseTypeStatus.SUCCESS) {
                        //_.each(vm.employeeAddedList, (item) => {
                        _.each(employeeAddedListWithOutCreatedEmp, (item) => {
                            let added = _.find(_employeeNoAddedList, (element) => {
                                return item.id == element.id
                            });
                            if (!added) {
                                _employeeNoAddedList.push(item);
                            }
                        });
                        _.each(_employeeNoAddedList, (item) => {
                            _employeeAddedList = _.without(_employeeAddedList,
                                        _.find(_employeeAddedList, (valItem) => {
                                            return valItem.id == item.id;
                                        })
                                );
                        });
                        //Filter only Active Employee from _employeeNoAddedList once Remove All employee
                        _employeeNoAddedList = _.filter(_employeeNoAddedList, (emp) => {
                            return emp.isActive;
                        });
                        UnSelectAllEmployee();
                        setMISReportEmployeeDragDropDetails();
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
        }
        //#endregion

        let setMISReportEmployeeDragDropDetails = () => {
            vm.RoleVal = 0; // default 0 - "All" selected in role drop down
            vm.SearchAddedListEmployee = null;
            vm.SearchNoAddedListEmployee = null;
            vm.isHideSearchButtonEmployee = false;
            vm.isHideSearchButtonaddedEmployee = false;
            vm.employeeAddedList = _employeeAddedList;
            vm.employeeNoAddedList = _employeeNoAddedList;
            vm.FilterEmployeeAdded = vm.employeeAddedList.length > 0;
            vm.FilterEmployeeNotAdded = vm.employeeNoAddedList.length > 0;
            reorderList();
        }

        /* save employees for mis report access */
        let saveMISReportEmployees = (newListToSave) => {
            vm.SearchAddedListEmployee = null;
            vm.SearchNoAddedListEmployee = null;
            const saveObj = [];
            _.each(newListToSave, (item) => {
                if (item.id) {
                    const _object = {};
                    _object.refTransID = dynamicReportID;
                    _object.refTableName = CORE.DBTableName.DynamicReportMst;
                    _object.EmployeeID = item.id;
                    saveObj.push(_object);
                }
            });
            let listObj = {
                refTransID: dynamicReportID,
                employeeList: saveObj
            }

            return DynamicReportAccessFactory.createMISReportEmployeeList().save({ listObj: listObj }).$promise.then((res) => {
                return res;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        /* delete employee from access mis report */
        let deleteMISReportEmployee = (listToDelete) => {
            vm.SearchAddedListEmployee = null;
            vm.SearchNoAddedListEmployee = null;

            let _deleteObj = {
                refTransID: dynamicReportID,
                refTableName: CORE.DBTableName.DynamicReportMst,
                employeeIDs: _.map(listToDelete, (obj) => { return obj.id })
            }
            return DynamicReportAccessFactory.deleteMISReportEmployeeList().save({
                deleteObj: _deleteObj
            }).$promise.then((res) => {
                return res;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };

        vm.setFocus = (text) => {
            let someElement = angular.element(document.querySelector('#' + text));
            if (someElement && someElement.length > 0) {
                someElement[0].focus();
            }
        }

        /* to move at employee update page */
        vm.goToUpdatePersonnel = (employeeID) => {
          BaseService.goToManagePersonnel(employeeID);
        }

    }
})();
