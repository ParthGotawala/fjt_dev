(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('employeeDepartment', employeeDepartment);
  /** @ngInject */
  function employeeDepartment(CORE, DialogFactory, $q, $timeout, USER, EmployeeDepartmentFactory, BaseService, DepartmentFactory,
    GenericCategoryFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        employeeId: '='
      },
      templateUrl: 'app/directives/custom/employee-department/employee-department.html',
      controller: employeeDepartmentCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function employeeDepartmentCtrl($scope) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmployeeTitle = CORE.CategoryType.EmployeeTitle;
      vm.EmptyMesssageDepartment = USER.ADMIN_EMPTYSTATE.ASSIGN_DEPARTMENT;

      const employeeId = $scope.employeeId ? parseInt($scope.employeeId) : null;
      vm.employeeId = employeeId;
      vm.GenericCategoryList = [];
      vm.DepartmentList = [];

      const defaultEmpDept = {
        id: null,
        empDeptID: null,
        employeeID: null,
        departmentID: null,
        titleID: null,
        selectedGenericCategory: null,
        selectedDepartment: null,
        isEditClicked: false,
        autoCompleteTitle: {},
        autoCompleteDepartment: {}
        //autoCompleteRole: {},
      };

      vm.depApprovalEditClicked = (empDeptItem) => {
        empDeptItem.isEditClicked = true;
      };

      vm.addEmptyDeptApproval = () => {
        const DeptApprovedObj = angular.copy(defaultEmpDept);
        DeptApprovedObj.autoCompleteTitle = angular.copy(defaultAutoCompleteTitle);
        DeptApprovedObj.autoCompleteDepartment = angular.copy(defaultAutoCompleteDepartment);
        //DeptApprovedObj.autoCompleteRole = angular.copy(defaultAutoCompleteRole);
        DeptApprovedObj.isEditClicked = true;
        vm.EmployeeDepartmentList.push(DeptApprovedObj);
      };

      vm.cancelEmptyDept = () => {
        vm.EmployeeDepartmentList.splice(-1, 1);
        vm.employeeDepartmentForm.$setPristine();
      };

      /* GenericCategory get all (by "WorkArea") and dropdown fill up */
      const getAllGenericCategoryByCategoryType = (empDeptItem, newlyAddedGCFromAutoComplete) => GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({ categoryType: CORE.CategoryType.EmployeeTitle.Name }).$promise
        .then((genericcategorylist) => {
          vm.GenericCategoryList = [];
          if (genericcategorylist && genericcategorylist.data) {
            vm.GenericCategoryList = genericcategorylist.data;
            if (vm.EmployeeDepartmentList.length > 0) {
              _.each(vm.EmployeeDepartmentList, (item) => {
                item.selectedGenericCategory = _.find(vm.GenericCategoryList, (gcitem) => gcitem.gencCategoryID === item.titleID);
                item.selectedDepartment = _.find(vm.DepartmentList, (dptitem) => dptitem.deptID === item.departmentID);
              });
            }

            if (vm.GenericCategoryList.length > 0 && empDeptItem && newlyAddedGCFromAutoComplete) {
              empDeptItem.selectedGenericCategory = _.find(vm.GenericCategoryList, (gcitem) => gcitem.gencCategoryName === newlyAddedGCFromAutoComplete);
            }
          }
          return $q.resolve(vm.GenericCategoryList);
        }).catch((error) => BaseService.getErrorLog(error));

      /* Department dropdown fill up */
      const getDepartmentList = (empDeptItem, newlyAddedDeptIDFromAutoComplete) => DepartmentFactory.getAllDepartment().query().$promise.then((departments) => {
        vm.DepartmentList = departments.data;

        if (vm.DepartmentList.length > 0 && empDeptItem && newlyAddedDeptIDFromAutoComplete) {
          empDeptItem.selectedDepartment = _.find(vm.DepartmentList, (deptItem) => deptItem.deptID === newlyAddedDeptIDFromAutoComplete);
        }
        return $q.resolve(vm.DepartmentList);
        //return vm.DepartmentList;
      }).catch((error) => BaseService.getErrorLog(error));

      const defaultAutoCompleteTitle = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: vm.EmployeeTitle.Name,
        placeholderName: vm.EmployeeTitle.Title,
        addData: { headerTitle: CORE.CategoryType.EmployeeTitle.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getAllGenericCategoryByCategoryType
      };

      const defaultAutoCompleteDepartment = {
        columnName: 'deptName',
        controllerName: USER.ADMIN_DEPARTMENT_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_DEPARTMENT_ADD_MODAL_VIEW,
        keyColumnName: 'deptID',
        keyColumnId: null,
        inputName: 'Department',
        placeholderName: 'Department',
        isRequired: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_DEPARTMENT_STATE],
          pageNameAccessLabel: CORE.PageName.department
        },
        isAddnew: true,
        callbackFn: getDepartmentList
      };

      /* get department list of employee  */
      vm.getEmployeeDepartmentList = () => {
        vm.EmployeeDepartmentList = [];
        if (vm.employeeId) {
          return EmployeeDepartmentFactory.getEmployeeAllDepartment().query({ employeeID: vm.employeeId }).$promise.then((employeedepartments) => $q.resolve(employeedepartments.data)).catch((error) => BaseService.getErrorLog(error));
        }
      };

      function getDeptApprovalDetails() {
        const promises = [vm.getEmployeeDepartmentList(), getAllGenericCategoryByCategoryType(), getDepartmentList()];
        vm.cgBusyLoading = $q.all(promises).then((responses) => {
          const getEmployeeDepartmentListResp = responses[0];
          const getAllGenericCategoryByCategoryTypeResp = responses[1];
          const getDepartmentListResp = responses[2];
          //var getRoleListResp = responses[3];

          if (getEmployeeDepartmentListResp && getAllGenericCategoryByCategoryTypeResp && getDepartmentListResp) {
            getEmployeeDepartmentListResp.forEach((x) => {
              const getEmployeeDepartmentObj = angular.copy(defaultEmpDept);
              getEmployeeDepartmentObj.empDeptID = x.empDeptID;
              getEmployeeDepartmentObj.employeeID = x.employeeID;
              getEmployeeDepartmentObj.titleID = x.titleID;
              getEmployeeDepartmentObj.departmentID = x.departmentID;
              //getEmployeeDepartmentObj.roleID = x.roleID;
              getEmployeeDepartmentObj.isDefault = x.isDefault;

              getEmployeeDepartmentObj.autoCompleteTitle = angular.copy(defaultAutoCompleteTitle);
              getEmployeeDepartmentObj.autoCompleteTitle.keyColumnId = getEmployeeDepartmentObj.titleID;

              getEmployeeDepartmentObj.autoCompleteDepartment = angular.copy(defaultAutoCompleteDepartment);
              getEmployeeDepartmentObj.autoCompleteDepartment.keyColumnId = getEmployeeDepartmentObj.departmentID;

              //getEmployeeDepartmentObj.autoCompleteRole = angular.copy(defaultAutoCompleteRole);
              //getEmployeeDepartmentObj.autoCompleteRole.keyColumnId = getEmployeeDepartmentObj.roleID;

              getEmployeeDepartmentObj.isSavedData = true;
              vm.EmployeeDepartmentList.push(getEmployeeDepartmentObj);
            });
            //addEmptyDeptApproval();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      getDeptApprovalDetails();

      //redirect to employee title master
      vm.goToTitleList = () => {
        BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EMPTITLE_STATE, {});
      };

      //redirect to Department master
      vm.goToDepartmentList = () => {
        BaseService.openInNew(USER.ADMIN_DEPARTMENT_STATE, {});
      };

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      const manageFormDirty = (index) => {
        const form = vm['employeeDepartmentForm_' + index];
        form.$setPristine();
        form.$setUntouched();
        $timeout(() => {
          const isFormDirty = _.some(vm.employeeDepartmentForm.$$controls, (control) => control.$dirty);
          if (!isFormDirty) {
            vm.employeeDepartmentForm.$setPristine();
            vm.employeeDepartmentForm.$setUntouched();
          }
        });
      };

      /* save-update department list of employee  */
      vm.SaveEmployeeDepartment = (empDept, index) => {
        const isSelectTitle = empDept.autoCompleteTitle ? !empDept.autoCompleteTitle.keyColumnId : true;
        const isSelectDepartment = empDept.autoCompleteDepartment ? !empDept.autoCompleteDepartment.keyColumnId : true;
        if (isSelectTitle || isSelectDepartment) {
          BaseService.focusRequiredField(vm.employeeDepartmentForm);
          return;
        }
        const employeeDepartmentInfo = {
          empDeptID: empDept.empDeptID,
          employeeID: vm.employeeId,
          departmentID: empDept.autoCompleteDepartment.keyColumnId ? empDept.autoCompleteDepartment.keyColumnId : null,
          titleID: empDept.autoCompleteTitle.keyColumnId ? empDept.autoCompleteTitle.keyColumnId : null,
          isActive: true
          //roleID: empDept.autoCompleteRole.keyColumnId ? empDept.autoCompleteRole.keyColumnId : null,
        };

        if (employeeDepartmentInfo && employeeDepartmentInfo.empDeptID) {
          vm.cgBusyLoading = EmployeeDepartmentFactory.employeeDepartment().update({
            id: employeeDepartmentInfo.empDeptID
          }, employeeDepartmentInfo).$promise.then((res) => {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              empDept.isSavedData = true;
              empDept.isEditClicked = false;
              manageFormDirty(index);
              //getDeptApprovalDetails();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.cgBusyLoading = EmployeeDepartmentFactory.employeeDepartment().save(employeeDepartmentInfo).$promise.then((res) => {
            if (res.data && res.data.empDeptID) {
              empDept.isSavedData = true;
              empDept.isEditClicked = false;
              empDept.empDeptID = res.data.empDeptID;
              manageFormDirty(index);
              //getDeptApprovalDetails();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* remove employee from department */
      vm.DeleteEmployeeDepartment = (row) => {
        if (row && row.empDeptID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Personnel department', 1);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = EmployeeDepartmentFactory.employeeDepartment().delete({
                id: row.empDeptID
              }).$promise.then(() => {
                vm.EmployeeDepartmentList.splice(_.indexOf(vm.EmployeeDepartmentList, _.find(vm.EmployeeDepartmentList, (item) => item.empDeptID === row.empDeptID)), 1);
                //getDeptApprovalDetails();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { // Empty Block
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.EmployeeDepartmentList.splice(_.indexOf(vm.EmployeeDepartmentList, _.find(vm.EmployeeDepartmentList, (item) => !item.empDeptID)), 1);
          //getDeptApprovalDetails();
        }
      };

      // To set department as default one to given employee
      vm.setAsDefaultEmpDept = (empDeptItemData) => {
        const setDefaultDepartmentAs = {
          empDeptID: empDeptItemData.empDeptID,
          employeeID: vm.employeeId
        };

        vm.cgBusyLoading = EmployeeDepartmentFactory.setDefaultDepartmentToEmployee().update({
        }, setDefaultDepartmentAs).$promise.then(() => {
          const defaultEmpDep = _.find(vm.EmployeeDepartmentList, (item) => item.isDefault);
          defaultEmpDep.isDefault = false;
          const setDefaultEmpDep = _.find(vm.EmployeeDepartmentList, (item) => item.empDeptID === empDeptItemData.empDeptID);
          setDefaultEmpDep.isDefault = true;
          //getDeptApprovalDetails();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      angular.element(() => {
        BaseService.currentPageForms.push(vm.employeeDepartmentForm);
        $scope.$parent.vm.employeeDepartmentForm = vm.employeeDepartmentForm;
      });
    }
  }
})();
