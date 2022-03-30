(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('operationEmployees', operationEmployees);

  /** @ngInject */
  function operationEmployees(OPERATION, $q, BaseService, OperationFactory, CORE, USER, $timeout, DialogFactory,
    uiSortableMultiSelectionMethods) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        operationId: '='
      },
      templateUrl: 'app/directives/custom/operation-employees/operation-employees.html',
      controller: operationEmployeesCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function operationEmployeesCtrl($scope) {
      var vm = this;

      vm.EmptyMesssageEmployees = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEMPLOYEES;
      vm.EmptyMesssageForOpEmployee = OPERATION.OPERATION_EMPTYSTATE.ASSIGNEMPLOYEES;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;

      const operationId = $scope.operationId ? parseInt($scope.operationId) : null;

      let _employeeAddedList = [];
      let _employeeNoAddedList = [];
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;

      vm.isContainMasterEmployee = false;

      $scope.selectedEmployeeListNoAdded = [];
      $scope.selectedEmployeeListAdded = [];

      //#region check for selected employee
      const checkSelectAllFlagEmployee = () => {
        $scope.selectAnyNoAddedEmployee = $scope.selectedEmployeeListNoAdded.length > 0 ? true : false;
        $scope.selectAnyAddedEmployee = $scope.selectedEmployeeListAdded.length > 0 ? true : false;
      };
      //#endregion

      //#region reset value of selected element
      const ResetSelectedEmployee = () => {
        $scope.selectedEmployeeListNoAdded = [];
        $scope.selectedEmployeeListAdded = [];
        $scope.selectAnyNoAddedEmployee = false;
        $scope.selectAnyAddedEmployee = false;
      };
      //#endregion

      //#region unselect all element list
      const UnSelectAllEmployee = () => {
        angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
        ResetSelectedEmployee();
      };
      //#endregion

      //Get all employees data
      vm.employeeOperationDetails = () => {
        UnSelectAllEmployee();

        vm.SearchAddedListEmployee = null;
        vm.SearchNoAddedListEmployee = null;

        const opEmpPromises = [getAllEmployeesNotAddedInOperation(), getAllEmployeesAddedInOperation()];
        vm.cgBusyLoading = $q.all(opEmpPromises).then((responses) => {
            if (responses && responses.length > 0) {
              setDetailsForOpEmp();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      //Get list of all employees which are not added into operation
      const getAllEmployeesNotAddedInOperation = () => OperationFactory.retrieveNotAddedEmployeeListForOp().save({
        opID: operationId,
        searchText: vm.SearchNoAddedListEmployee ? vm.SearchNoAddedListEmployee : null
      }).$promise.then((res) => {
        if (res && res.data && res.data.empMasterList) {
          _employeeNoAddedList = vm.employeeNoAddedList = [];
          _.each(res.data.empMasterList, (itemData) => {
            if (itemData.profileImg) {
              itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + itemData.profileImg;
            }
            else {
              itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
            itemData.empCertificationDetList = [];
            if (itemData.empCertifications) {
              setEmployeeCertificationDet(itemData);
            }
            vm.employeeNoAddedList.push(itemData);
          });

          // Filter active Employee only in _EmployeeNoAddedList
          vm.employeeNoAddedList = _.filter(vm.employeeNoAddedList, (emp) => emp.isActive);
          reorderList();
          _employeeNoAddedList = angular.copy(vm.employeeNoAddedList);
        }
        return $q.resolve(res);
      }).catch((error) => BaseService.getErrorLog(error));

      //Get list of all employees added into operation
      const getAllEmployeesAddedInOperation = () => OperationFactory.retrieveAddedEmployeeListForOp().save({
        opID: operationId,
        searchText: vm.SearchAddedListEmployee ? vm.SearchAddedListEmployee : null
      }).$promise.then((res) => {
        if (res && res.data && res.data.operationEmpList) {
          _employeeAddedList = vm.employeeAddedList = [];
          _.each(res.data.operationEmpList, (itemData) => {
            if (itemData.profileImg) {
              itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + itemData.profileImg;
            }
            else {
              itemData.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
            itemData.empCertificationDetList = [];
            if (itemData.empCertifications) {
              setEmployeeCertificationDet(itemData);
            }
            vm.employeeAddedList.push(itemData);
          });

          // Filter active Employee only in _EmployeeNoAddedList
          vm.employeeNoAddedList = _.filter(vm.employeeNoAddedList, (emp) => emp.isActive);
          reorderList();
          _employeeAddedList = angular.copy(vm.employeeAddedList);
        }
        return $q.resolve(res);
      }).catch((error) => BaseService.getErrorLog(error));

      //Check if tab has Employee data or not
      const setDetailsForOpEmp = () => {
        if (_employeeNoAddedList.length === 0 && _employeeAddedList.length === 0
          && !vm.SearchNoAddedListEmployee && !vm.SearchAddedListEmployee) {
          vm.isContainMasterEmployee = false;
        }
        else {
          vm.isContainMasterEmployee = true;
        }
        setSelectableListItemEmployee();
      };

      //convert employee certificate detail with color code
      const setEmployeeCertificationDet = (EmpItemData) => {
        const classWithColorCode = EmpItemData.empCertifications.split('@@@@@@');
        _.each(classWithColorCode, (item) => {
          if (item) {
            const objItem = item.split('######');
            const standardClassObj = {};
            standardClassObj.stdClassName = objItem[0].trim();
            standardClassObj.colorCode = objItem[1] ? objItem[1] : CORE.DefaultStandardTagColor;
            EmpItemData.empCertificationDetList.push(standardClassObj);
          }
        });
      };

      //Reset order of list
      const reorderList = () => {
        _employeeAddedList = _.sortBy(_employeeAddedList, 'name');
        _employeeNoAddedList = _.sortBy(_employeeNoAddedList, 'name');
        vm.employeeAddedList = _.sortBy(vm.employeeAddedList, 'name');
        vm.employeeNoAddedList = _.sortBy(vm.employeeNoAddedList, 'name');
      };

      //set class for item to be selectable
      const setSelectableListItemEmployee = () => {
        $timeout(() => {
          SetEmployeeSelectable();
        }, _configSelectListTimeout);
      };

      //#region  set item selectable
      const SetEmployeeSelectable = () => {
          angular.element('[ui-sortable]#employeeAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectEmployee('NoAdded');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedEmployeeListAdded = _.map(selectedItemIndexes, (i) => vm.employeeAddedList[i]);
          checkSelectAllFlagEmployee();
          $scope.$applyAsync();
        });
        angular.element('[ui-sortable]#employeeNoAddedList').on('ui-sortable-selectionschanged', function () {
          UnSelectEmployee('Added');
          const $this = $(this);
          const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
            return $(this).index();
          }).toArray();
          $scope.selectedEmployeeListNoAdded = _.map(selectedItemIndexes, (i) => vm.employeeNoAddedList[i]);
          checkSelectAllFlagEmployee();
          $scope.$applyAsync();
        });
      };
      //#endregion

      //#region unselect single element list
      const UnSelectEmployee = (unSelectFrom) => {
        if (unSelectFrom === 'NoAdded') {
          angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        else {
          angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
        }
        ResetSelectedEmployee();
      };
      //#endregion

      /* search employee details from not added list  */
      vm.searchEmployeeFromNoAddedList = () => {
        UnSelectAllEmployee();
        const notAddedEmpPromises = [getAllEmployeesNotAddedInOperation()];
        vm.cgBusyLoading = $q.all(notAddedEmpPromises).then((responses) => {
            if (responses && responses.length > 0) {
              setDetailsForOpEmp();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      /* search employee details from added list  */
      vm.searchEmployeeFromAddedList = () => {
        UnSelectAllEmployee();
        const addedEmpPromises = [getAllEmployeesAddedInOperation()];
        vm.cgBusyLoading = $q.all(addedEmpPromises).then((responses) => {
            if (responses && responses.length > 0) {
              setDetailsForOpEmp();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      //Reload Data
      vm.refreshDataEmployee = () => {
        vm.employeeOperationDetails();
      };

      //Add new Employee
      vm.addDataEmployee = (data, ev) => {
        var data = {};
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER, USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW, ev, data).then(() => { // empty
          }, (data) => {
            if (data) {
              vm.refreshDataEmployee();
            }
          }, () => { //empty
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //#region sortable option common for all list
      $scope.sortableOptionsEmployee = uiSortableMultiSelectionMethods.extendOptions({
        cancel: '.cursor-not-allow',
        placeholder: 'beingDragged',
        'ui-floating': true,
        cursorAt: {
          top: 0, left: 0
        },
        start: (e, ui) => {
        },
        sort: (e, ui) => {
        },
        stop: (e, ui) => {
          const sourceModel = ui.item.sortable.model;
          if (ui.item.sortable.droptarget) {
            const sourceTarget = ui.item.sortable.source[0];
            const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
            const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
            const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
            if (SourceDivAdded !== DestinationDivAdded) {
              if (SourceDivAdded === false && DestinationDivAdded === true) {
                if ($scope.selectedEmployeeListNoAdded.length === 0) {
                  $scope.selectedEmployeeListNoAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEmployee('Add');
                return;
              }
              else if (SourceDivAdded === true && DestinationDivAdded === false) {
                if ($scope.selectedEmployeeListAdded.length === 0) {
                  $scope.selectedEmployeeListAdded.push(sourceModel);
                }
                vm.ModifyPageAddedEmployee('Remove');
                return;
              }
            }
          }
        },
        connectWith: '.items-container'
      });
      //#endregion

      //#region modify employee Added based on selection from both list
      vm.ModifyPageAddedEmployee = (addType) => {
        if (addType === 'Remove' || addType === 'RemoveAll') {
          confirmEmpDeleteDragDrop(addType);
        }
        else {
          checkAndUpdateModifiedEmpDragDrop(addType);
        }
      };

      // check add/remove employee from drag drop
      const checkAndUpdateModifiedEmpDragDrop = (addType) => {
        if (addType === 'Add') {
          const promises = [saveOperationEmployee($scope.selectedEmployeeListNoAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedEmployeeListNoAdded, (item) => {
                  const added = _.find(_employeeAddedList, (element) => item.id === element.id);
                  if (!added) {
                    _employeeAddedList.push(item);
                  }
                });
                _.each($scope.selectedEmployeeListNoAdded, (item) => {
                  _employeeNoAddedList = _.without(_employeeNoAddedList,
                    _.find(_employeeNoAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllEmployee();
                setOperationEmployeeDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'Remove') {
          const promises = [deleteOperationEmployee($scope.selectedEmployeeListAdded)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each($scope.selectedEmployeeListAdded, (item) => {
                  const added = _.find(_employeeNoAddedList, (element) => item.id === element.id);
                  if (!added) {
                    //if employee is active then it store back to to _EmployeeNoAddedList
                    if (item.isActive){
                      _employeeNoAddedList.push(item);
                    }
                  }
                });
                _.each($scope.selectedEmployeeListAdded, (item) => {
                  _employeeAddedList = _.without(_employeeAddedList,
                    _.find(_employeeAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllEmployee();
                setOperationEmployeeDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'AddAll') {
          const promises = [saveOperationEmployee(vm.employeeNoAddedList)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(vm.employeeNoAddedList, (item) => {
                  const added = _.find(_employeeAddedList, (element) => item.id === element.id);
                  if (!added) {
                    _employeeAddedList.push(item);
                  }
                });
                _.each(_employeeAddedList, (item) => {
                  _employeeNoAddedList = _.without(_employeeNoAddedList,
                    _.find(_employeeNoAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                UnSelectAllEmployee();
                setOperationEmployeeDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (addType === 'RemoveAll') {
          const promises = [deleteOperationEmployee(vm.employeeAddedList)];
          vm.cgBusyLoading = $q.all(promises).then((responses) => {
              if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
                _.each(vm.employeeAddedList, (item) => {
                  const added = _.find(_employeeNoAddedList, (element) => item.id === element.id);
                  if (!added) {
                    _employeeNoAddedList.push(item);
                  }
                });
                _.each(_employeeNoAddedList, (item) => {
                  _employeeAddedList = _.without(_employeeAddedList,
                    _.find(_employeeAddedList, (valItem) => valItem.id === item.id)
                  );
                });
                //Filter only Active Employee from _employeeNoAddedList once Remove All employee
                _employeeNoAddedList = _.filter(_employeeNoAddedList, (emp) => emp.isActive);
                UnSelectAllEmployee();
                setOperationEmployeeDragDropDetails();
              }
            }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //#endregion

      // take confirmation for remove employee items from drag drop options
      const confirmEmpDeleteDragDrop = (addType) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, CORE.MainTitle.Employee);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((res) => {
          if (res) {
            checkAndUpdateModifiedEmpDragDrop(addType);
          }
        }, () => {
          return false;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* save employees in operation */
      const saveOperationEmployee = (newListToSave) => {
        vm.SearchAddedListEmployee = null;
        vm.SearchNoAddedListEmployee = null;
        const saveObj = [];
        _.each(newListToSave, (item) => {
          if (item.id) {
            const _object = {};
            _object.opID = operationId,
              _object.employeeID = item.id,
              saveObj.push(_object);
          }
        });
        const listObj = {
          opID: operationId,
          employeeList: saveObj
        };
        return OperationFactory.createOperation_EmployeeList().save({ listObj: listObj }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
      };

      const setOperationEmployeeDragDropDetails = () => {
        vm.SearchAddedListEmployee = null;
        vm.SearchNoAddedListEmployee = null;
        vm.employeeAddedList = _employeeAddedList;
        vm.employeeNoAddedList = _employeeNoAddedList;
        vm.employeeOperationDetails();
      };

      /* delete employee in operation */
      const deleteOperationEmployee = (listToDelete) => {
        vm.SearchAddedListEmployee = null;
        vm.SearchNoAddedListEmployee = null;

        return OperationFactory.deleteOperation_EmployeeList().delete({
          opID: operationId,
          employeeIDs: _.map(listToDelete, (obj) => { return obj.id; })
        }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
      };

      /* to move at employee update page */
      vm.goToUpdatePersonnel = (employeeID) => {
        BaseService.goToManagePersonnel(employeeID);
      };

      vm.employeeOperationDetails();
    }
  }
})();
