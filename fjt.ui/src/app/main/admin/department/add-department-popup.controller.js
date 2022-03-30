(function () {
  'use strict';

  angular
    .module('app.admin.department')
    .controller('AddDepartmentPopupController', AddDepartmentPopupController);

  /** @ngInject */
  function AddDepartmentPopupController($mdDialog, $q, $scope, $timeout, data, CORE, USER, DepartmentFactory, EmployeeFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.isSubmit = false;
    vm.addDepartment = {};
    vm.addDepartment.deptName = data.Name;
    let oldDepartmentName = '';
    //vm.isSaveDisable = false;

    /* Manager (Employee) dropdown fill up */
    const getEmployeeList = (insertedDataFromPopup) => EmployeeFactory.GetEmployeeDetail().query({ isOnlyActive: true }).$promise.then((employees) => {
      _.each(employees.data, (item) => {
        let deptName = '';
        let gencCategoryName = '';
        if (item.deptName) {
          deptName = ' (' + item.deptName + ')';
        }
        if (item.gencCategoryName) {
          gencCategoryName = ' ' + item.gencCategoryName;
        }
        item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
        if (item.profileImg && item.profileImg !== 'null') {
          item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
        }
        else {
          item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
      });
      vm.EmployeeList = employees.data;
      if (insertedDataFromPopup && insertedDataFromPopup.id) {
        const selectedObject = _.find(vm.EmployeeList, (emp) => emp.id === insertedDataFromPopup.id);
        vm.selectedEmployee = selectedObject;
      }
      return $q.resolve(vm.EmployeeList);
    }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [getEmployeeList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteEmployee = {
        columnName: 'name',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.addDepartment.deptMngrID ? vm.addDepartment.deptMngrID : null,
        inputName: 'Manager',
        placeholderName: 'Manager',
        isRequired: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isAddnew: true,
        callbackFn: getEmployeeList
      };
    };

    // Reset addDepartment model.
    const resetAddDeptModel = () => {
      $scope.$broadcast(vm.autoCompleteEmployee.inputName + 'searchText', null);
      $timeout(() => {
        vm.addDepartment = {};
        vm.AddDepartmentForm.$setPristine();
        vm.AddDepartmentForm.$setUntouched();
      });
    };

    /* create department */
    vm.SaveDepartment = (ev, isCheckUnique, buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddDepartmentForm)) {
        if (vm.addDepartment.deptID && !vm.checkFormDirty(vm.AddDepartmentForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.addDepartment);
        }
        return;
      }
      if (vm.AddDepartmentForm.$invalid || !vm.checkFormDirty(vm.AddDepartmentForm)) {
        BaseService.focusRequiredField(vm.AddDepartmentForm);
        return;
      }
      vm.isSubmit = false;
      if (!vm.AddDepartmentForm.$valid) {
        vm.isSubmit = true;
        return;
      }
      const departmentInfo = {
        deptName: vm.addDepartment.deptName,
        deptMngrID: vm.autoCompleteEmployee.keyColumnId ? vm.autoCompleteEmployee.keyColumnId : null,
        isActive: true,
        isCheckUnique: isCheckUnique ? isCheckUnique : false
      };

      if (vm.addDepartment && vm.addDepartment.deptID) {
        vm.cgBusyLoading = DepartmentFactory.department().update({
          id: vm.addDepartment.deptID
        }, departmentInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveAndProceed(buttonCategory, res.data);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.cgBusyLoading = DepartmentFactory.department({}).save(departmentInfo).$promise.then((res) => {
          if (res && res.data && res.data.deptID) {
            vm.saveAndProceed(buttonCategory, res.data);
          }
          // Commented as not found code on API side.
          //else {
          //  if (res.data && res.data.fieldName) {
          //    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
          //    messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
          //    const obj = {
          //      messageContent: messageContent,
          //      btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
          //      canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          //    };

          //    DialogFactory.messageConfirmDialog(obj).then((yes) => {
          //      if (yes) {
          //        vm.SaveDepartment(ev, false);
          //      }
          //    }, () => {
          //    }).catch((error) => BaseService.getErrorLog(error));
          //  }
          //}
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Manage Add Category Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddDepartmentForm.$setPristine();
        vm.AddDepartmentForm.$setUntouched();
        vm.addDepartment.deptID = data.deptID;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.AddDepartmentForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            resetAddDeptModel();
            setFocus('deptName');
          }, () => { // Empty Block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          resetAddDeptModel();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
      setFocus('deptName');
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddDepartmentForm);
      if (isdirty) {
        const data = {
          form: vm.AddDepartmentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //redirect Employees Master
    vm.goToEmployeesList = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };

    // Function call on department name blue event and check code exist or not
    vm.checkDuplicateDeptName = () => {
      if (oldDepartmentName !== vm.addDepartment.deptName) {
        if (vm.AddDepartmentForm && vm.AddDepartmentForm.deptName.$dirty && vm.addDepartment.deptName) {
          vm.cgBusyLoading = DepartmentFactory.checkDuplicateDepartmentName().save({
            deptID: vm.addDepartment && vm.addDepartment.deptID ? vm.addDepartment.deptID : null,
            deptName: vm.addDepartment.deptName
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldDepartmentName = angular.copy(vm.addDepartment.deptName);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateDeptName) {
              oldDepartmentName = '';

              vm.addDepartment.deptName = null;

              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
              messageContent.message = stringFormat(messageContent.message, 'Department name');
              const obj = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(obj).then(() => {
                setFocus('deptName');
                //used set focus by id to protect in case added from parent dept. drop down
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.AddDepartmentForm);
    });
  }
})();
