(function () {
  'use strict';

  angular
    .module('app.configuration.entity')
    .controller('EntityEmployeePopupController', EntityEmployeePopupController);

  /** @ngInject */
  function EntityEmployeePopupController(EntityFactory, RoleFactory, $mdDialog, data, BaseService,
    CONFIGURATION, CORE, USER, $timeout, $scope, uiSortableMultiSelectionMethods, $state, $filter, $q, DialogFactory) {
    var selectedPermission;
    const vm = this;
    const entityID = data.entityID;
    vm.entityCreatedByEmployeeID = data.createdBy;  /* for not removing user that created widget even by */
    vm.EmptyMesssageEmployees = CONFIGURATION.CONFIGURATION_EMPTYSTATE.ASSIGNEMPLOYEES;
    let _employeeAddedList = [];
    let _employeeNoAddedList = [];
    vm.SearchAddedListEmployee = null;
    vm.SearchNoAddedListEmployee = null;
    const loginUserDetails = BaseService.loginUser;
    vm.isContainMasterEmployee = false;
    vm.debounceConstant = CORE.Debounce;
    vm.entityPermission = CORE.ENTITY_FORM_PERMISSION;
    vm.headerdata = data.entityStatus ? [
      {
        label: 'Form Name',
        value: data.entityName,
        displayOrder: 1
      },
      {
        label: 'Status',
        value: data.entityStatus,
        displayOrder: 2
      }
    ] : null;
    vm.saveDisable = false;

    /* get all roles to show in drop down selection */
    const getRoles = () => {
      vm.cgBusyLoading = RoleFactory.rolePermission().query().$promise.then((res) => {
        vm.roles = res.data;
        const activeRole = _.filter(vm.roles, (data) => {
          if (data.isActive) {
            return data;
          }
        });
        vm.roles = activeRole;
        vm.roles.unshift({ id: 0, name: 'All' });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //call back
    vm.getEntityPermission = () => vm.entityPermission;

    //initialize auto complete.
    const init = () => {
      vm.getEntityPermission();
      //auto complete for entity permission
      vm.autoCompletePermission = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: null,//vm.entityPermission ? vm.entityPermission.id : null,
        inputName: 'entityPermission',
        placeholderName: '',
        isRequired: true,
        isAddnew: false,
        callbackFn: null, //vm.getEntityPermission,
        onSelectCallbackFn: null,// onSelectEntityPermission,
        callbackFnParam: null
      };
    };

    /* get all employees to add/remove from access widget */
    const getEntityAllEmployees = () => {
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;

      vm.cgBusyLoading = EntityFactory.retrieveEntityAllEmployeeDetails().save({
        entityID: entityID
      }).$promise.then((res) => {
        if (res.data) {
          /* remove self employee from drag-drop */
          _.remove(res.data, (item) => item.id === loginUserDetails.employee.id);
          _employeeAddedList = vm.employeeAddedList = [];
          _employeeNoAddedList = vm.employeeNoAddedList = [];
          _.each(res.data, (itemData) => {
            //itemData.name = (itemData.firstName ? itemData.firstName : "") + " " + (itemData.lastName ? itemData.lastName : "");
            // itemData.employeeDepartment = _.first(itemData.employeeDepartment);
            if (itemData.employeeDepartment) {
              itemData.employeeDepartment = _.first(itemData.employeeDepartment);
            }
            let deptName = '';
            let gencCategoryName = '';
            if (itemData.employeeDepartment && itemData.employeeDepartment.department) {
              deptName = ' (' + itemData.employeeDepartment.department.deptName + ')';
            }
            if (itemData.employeeDepartment && itemData.employeeDepartment.genericCategory) {
              gencCategoryName = ' ' + itemData.employeeDepartment.genericCategory.gencCategoryName;
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
              itemData.entityPermissionList = angular.copy(vm.entityPermission);
              itemData.autoCompletePermission = angular.copy(vm.autoCompletePermission);
              itemData.autoCompletePermission.keyColumnId = itemData.dynamicReportAccess.entityPermission || null;
              itemData.autoCompletePermission.callbackFnParam = itemData;
              vm.employeeAddedList.push(itemData);
            }
            else {
              vm.employeeNoAddedList.push(itemData);
            }
          });
          reorderList();
          _employeeAddedList = angular.copy(vm.employeeAddedList);

          // Filter active Employee only in _EmployeeNoAddedList
          vm.employeeNoAddedList = _.filter(vm.employeeNoAddedList, (emp) => emp.isActive);
          _employeeNoAddedList = angular.copy(vm.employeeNoAddedList);

          if (_employeeNoAddedList.length === 0 && _employeeAddedList.length === 0) {
            vm.isContainMasterEmployee = false;
          }
          else {
            vm.isContainMasterEmployee = true;
          }
          setSelectableListItem();
          $timeout(() => {
            vm.SelectEntityEmployee.$setPristine();
            vm.SelectEntityEmployee.$dirty = false;
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.refreshDataEmployee = () => {
      vm.RoleVal = 0;
      vm.isHideSearchButtonEmployee = false;
      getEntityAllEmployees();
    };

    vm.addDataEmployee = (data, ev) => {
      var data = {};
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
          USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
          ev,
          data).then(() => { // empty
          }, (data) => {
            if (data) {
              vm.refreshDataEmployee();
            }
          },
            () => { //error
            });
      }
      //var url = $state.href(USER.ADMIN_EMPLOYEE_MANAGE_STATE, null);
      //window.open(url, '_blank');
    };

    const reorderList = () => {
      _employeeAddedList = _.sortBy(_employeeAddedList, 'name');
      _employeeNoAddedList = _.sortBy(_employeeNoAddedList, 'name');
      vm.employeeAddedList = _.sortBy(vm.employeeAddedList, 'name');
      vm.employeeNoAddedList = _.sortBy(vm.employeeNoAddedList, 'name');
    };

    if (entityID) {
      init();
      getRoles();
      getEntityAllEmployees();
    } else {
      vm.cancel();
    }

    $scope.selectedEmployeeListNoAdded = [];
    $scope.selectedEmployeeListAdded = [];
    //#region sortable option common for all list
    $scope.sortableOptionsEmployee = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow, :input',
      placeholder: 'beingDragged',
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      start: (e, ui) => { //empty
      },
      sort: (e, ui) => { //empty
      },
      handle: ':not(input)',
      stop: (e, ui) => {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded != DestinationDivAdded) {
            if (SourceDivAdded == false && DestinationDivAdded == true) {
              if ($scope.selectedEmployeeListNoAdded.length === 0) {
                $scope.selectedEmployeeListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAddedEmployee('Add');
              return;
            }
            else if (SourceDivAdded == true && DestinationDivAdded == false) {
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


    //#region reset value of selected element
    const ResetSelectedEmployee = () => {
      $scope.selectedEmployeeListNoAdded = [];
      $scope.selectedEmployeeListAdded = [];
      $scope.selectAnyNoAddedEmployee = false;
      $scope.selectAnyAddedEmployee = false;
    };
    //#endregion

    //#region check for selected employee
    const checkSelectAllFlagEmployee = () => {
      $scope.selectAnyNoAddedEmployee = $scope.selectedEmployeeListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAddedEmployee = $scope.selectedEmployeeListAdded.length > 0 ? true : false;
    };
    //#endregion

    //#region unselect all element list
    const UnSelectAllEmployee = () => {
      angular.element('[ui-sortable]#employeeNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#employeeAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedEmployee();
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

    //#region  set item selectable
    const SetEmployeeSelectable = () => {
      angular.element('[ui-sortable]#employeeAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectEmployee('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedEmployeeListAdded = _.map(selectedItemIndexes, function (i) {
          return vm.employeeAddedList[i];
        });
        checkSelectAllFlagEmployee();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#employeeNoAddedList').on('ui-sortable-selectionschanged', function (e, args) {
        UnSelectEmployee('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(function () {
          return $(this).index();
        }).toArray();
        $scope.selectedEmployeeListNoAdded = _.map(selectedItemIndexes, function (i) {
          return vm.employeeNoAddedList[i];
        });
        checkSelectAllFlagEmployee();
        $scope.$applyAsync();
      });
    };

    const setSelectableListItem = () => {
      $timeout(() => {
        SetEmployeeSelectable();
      }, _configSelectListTimeout);
    };
    //#endregion

    //#region for destroy selection
    const DestroyEmployeeSelection = () => {
      angular.element('[ui-sortable]#employeeNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#employeeAddedList').off('ui-sortable-selectionschanged');
    };

    const DestroyAllSelectionEmployee = () => {
      DestroyEmployeeSelection();
    };
    //#endregion

    //#region On change of tab
    $scope.$on('$destroy', () => {
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
            vm.employeeNoAddedList = $filter('filter')(_employeeNoAddedList, (item) => _.find((_.first(item.user).roles), (userroleitem) => userroleitem.id == RoleVal));
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
          const empList = $filter('filter')(_employeeNoAddedList, (item) => _.find((_.first(item.user).roles), (userroleitem) => userroleitem.id == RoleVal));
          vm.employeeNoAddedList = searchText ? ($filter('filter')(empList, { name: searchText })) : empList;
        }
        vm.FilterEmployeeNotAdded = vm.employeeNoAddedList.length > 0;
      }

    };

    const updateAddedEmployee = (addType, event) => {
      if (addType === 'Add') {
        const promises = [saveEntityEmployee($scope.selectedEmployeeListNoAdded)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each($scope.selectedEmployeeListNoAdded, (item) => {
              const added = _.find(_employeeAddedList, (element) => item.id == element.id);

              if (!added) {
                item.entityPermissionList = angular.copy(vm.entityPermission);
                item.autoCompletePermission = angular.copy(vm.autoCompletePermission);
                item.autoCompletePermission.keyColumnId = selectedPermission ? selectedPermission : null;
                item.autoCompletePermission.callbackFnParam = item;
                _employeeAddedList.push(item);
              }
            });
            _.each($scope.selectedEmployeeListNoAdded, (item) => {
              _employeeNoAddedList = _.without(_employeeNoAddedList,
                _.find(_employeeNoAddedList, (valItem) => valItem.id == item.id)
              );
            });
            UnSelectAllEmployee();
            setEntityEmployeeDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'Remove') {

        const promises = [deleteEntityEmployee($scope.selectedEmployeeListAdded)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each($scope.selectedEmployeeListAdded, (item) => {
              const added = _.find(_employeeNoAddedList, (element) => item.id == element.id);
              if (!added) {
                //if employee is active then it store back to to _EmployeeNoAddedList
                if (item.isActive) {
                  _employeeNoAddedList.push(item);
                }
              }
            });
            _.each($scope.selectedEmployeeListAdded, (item) => {
              _employeeAddedList = _.without(_employeeAddedList,
                _.find(_employeeAddedList, (valItem) => valItem.id == item.id)
              );
            });
            UnSelectAllEmployee();
            setEntityEmployeeDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'AddAll') {
        const promises = [saveEntityEmployee(vm.employeeNoAddedList)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each(vm.employeeNoAddedList, (item) => {
              const added = _.find(_employeeAddedList, (element) => item.id == element.id);
              if (!added) {
                item.entityPermissionList = angular.copy(vm.entityPermission);
                item.autoCompletePermission = angular.copy(vm.autoCompletePermission);
                item.autoCompletePermission.keyColumnId = selectedPermission ? selectedPermission : null;
                item.autoCompletePermission.callbackFnParam = item;
                _employeeAddedList.push(item);
              }
            });
            _.each(_employeeAddedList, (item) => {
              _employeeNoAddedList = _.without(_employeeNoAddedList,
                _.find(_employeeNoAddedList, (valItem) => valItem.id == item.id)
              );
            });
            UnSelectAllEmployee();
            setEntityEmployeeDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else if (addType === 'RemoveAll') {
        const widgetCreatedEmpData = _.find(vm.employeeAddedList, (removeItem) => removeItem.id == vm.entityCreatedByEmployeeID);
        if (widgetCreatedEmpData && vm.employeeAddedList.length === 1) {
          const model = {
            title: USER.USER_INFORMATION_LABEL,
            textContent: WIDGET.WIDGET_DELETE_NOT_ALLOWED_CREATED_EMP,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return;
        }
        const employeeAddedListWithOutCreatedEmp = _.filter(vm.employeeAddedList, (removeItem) => removeItem.id != vm.entityCreatedByEmployeeID);
        const promises = [deleteEntityEmployee(employeeAddedListWithOutCreatedEmp)];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          if (responses[0] && responses[0].status === CORE.ApiResponseTypeStatus.SUCCESS) {
            //_.each(vm.employeeAddedList, (item) => {
            _.each(employeeAddedListWithOutCreatedEmp, (item) => {
              const added = _.find(_employeeNoAddedList, (element) => item.id == element.id);
              if (!added) {
                _employeeNoAddedList.push(item);
              }
            });
            _.each(_employeeNoAddedList, (item) => {
              _employeeAddedList = _.without(_employeeAddedList,
                _.find(_employeeAddedList, (valItem) => valItem.id == item.id)
              );
            });
            //Filter only Active Employee from _employeeNoAddedList once Remove All employee
            _employeeNoAddedList = _.filter(_employeeNoAddedList, (emp) => emp.isActive);
            UnSelectAllEmployee();
            setEntityEmployeeDragDropDetails();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //selectedPermission = '';
    };
    //#region modify employee Added based on selection from both list
    vm.ModifyPageAddedEmployee = (addType, event) => {
      if (event) {
        event.preventDefault();
      }
      if (addType === 'Add' || addType === 'AddAll') {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ENTITY_PERMISSION_CONFIRMATION);
        const buttonsList = [{ name: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL },
          { name: CORE.MESSAGE_CONSTANT.BUTTON_ADD_ONLY },
          { name: CORE.MESSAGE_CONSTANT.BUTTON_ALL }
       ];

        const data = {
          messageContent: messageContent,
          buttonsList: buttonsList,
          buttonIndexForFocus: 1
        };

        DialogFactory.dialogService(
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
          null,
          data).then(() => {
            // action
          }, (response) => {
            if (response === buttonsList[1].name) {
              selectedPermission = 'A';
              updateAddedEmployee(addType, event);
            } else if (response === buttonsList[2].name) {
              selectedPermission = 'F';
              updateAddedEmployee(addType, event);
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
      }
      else if (addType === 'Remove' || addType === 'RemoveAll') {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Personnel', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then(() => {
          selectedPermission = '';
          updateAddedEmployee(addType, event);
        }, () => {
          selectedPermission = '';
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //0 convert existing logic in one function
      // 1. if condition for add / add all
      //1.1 ask confirmation
      //1.2 once confirmed execute existing
      // 2.  else function which execute all existing logic
    };
    //#endregion

    const setEntityEmployeeDragDropDetails = () => {
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
    };

    /* save employees for entity form access */
    const saveEntityEmployee = (newListToSave) => {
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;
      const saveObj = [];
      _.each(newListToSave, (item) => {
        if (item.id) {
          const _object = {};
          _object.refTransID = entityID;
          _object.EmployeeID = item.id;
          _object.refTableName = CORE.DBTableName.Entity;
          _object.entityPermission = selectedPermission;
          saveObj.push(_object);
        }
      });

      const listObj = {
        entityID: entityID,
        employeeList: saveObj
      };

      return EntityFactory.createEntityEmployeeList().save({ listObj: listObj }).$promise.then((res) => {
        //selectedPermission = '';
        return res;
        vm.SelectEntityEmployee.$setPristine();
        vm.SelectEntityEmployee.$dirty = false;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* delete employee from access entity form */
    const deleteEntityEmployee = (listToDelete) => {
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;

      return EntityFactory.deleteEntityEmployeeList().save({
        refTransID: entityID,
        EmployeeIDs: _.map(listToDelete, (obj) => obj.id)
      }).$promise.then((res) => res).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = BaseService.checkFormDirty(vm.SelectEntityEmployee);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.SelectEntityEmployee
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.setFocus = (text) => {
      const someElement = angular.element(document.querySelector('#' + text));
      if (someElement && someElement.length > 0) {
        someElement[0].focus();
      }
    };

    vm.saveEntityPermission = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.SelectEntityEmployee, false)) {
        vm.saveDisable = false;
        return;
      }

      const updateList = [];
      if (vm.SelectEntityEmployee.$valid) {
        if (vm.employeeAddedList && vm.employeeAddedList.length > 0) {
          _.each(vm.employeeAddedList, (item) => {
            if (item.id) {
              const _object = {};
              _object.refTransID = entityID;
              _object.EmployeeID = item.id;
              _object.refTableName = CORE.DBTableName.Entity;
              _object.entityPermission = item.autoCompletePermission.keyColumnId;
              updateList.push(_object);
            }
          });
          vm.SearchAddedListEmployee = null;
          vm.SearchNoAddedListEmployee = null;

          return EntityFactory.updateEntityEmployeePermission().save({ updateList }).$promise.then((res) => {
            vm.saveDisable = false;
            vm.SelectEntityEmployee.$setPristine();
            return res;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* to move at employee update page */
    vm.goToUpdatePersonnel = (employeeID) => {
      BaseService.goToManagePersonnel(employeeID);
    };
  }
})();
