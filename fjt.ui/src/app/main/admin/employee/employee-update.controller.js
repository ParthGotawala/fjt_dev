
(function () {
  'use strict';

  angular
    .module('app.admin.employee')
    .controller('EmployeeUpdateController', EmployeeUpdateController);

  /** @ngInject */
  function EmployeeUpdateController($scope, $state, $stateParams, $timeout, $mdDialog, $mdMenu, CORE, USER, EmployeeFactory, DialogFactory, DataElementTransactionValueFactory, BaseService) {
    const vm = this;
    vm.IsOtherDetailTab = false;
    vm.OtherDetailTabName = CORE.OtherDetailTabName;
    vm.dataElementList = [];
    vm.entityID = 0;
    vm.Entity = CORE.Entity;
    vm.isUpdatePagePermison = true;
    vm.entityName = CORE.AllEntityIDS.Employee;
    vm.EmailPattern = CORE.EmailPattern;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.documentTabName = 'Documents';
    vm.deptTabName = 'Department';
    vm.RoleTabName = 'RolesAndRights';
    vm.WorkstationTab = 'Workstations';
    vm.CustomerMappingTab = 'CustomerMapping';
    vm.UserAgreementTab = 'UserAgreementTab';
    vm.isUser = true;
    vm.roles = [];
    vm.permissionGroup = {};
    vm.roleAssigned = false;
    vm.pagepermision = [];
    vm.selectedRole = [];
    vm.TimePattern = CORE.TimePattern;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.USERSELECTEDROLE;
    vm.isRoleTab = false;
    vm.isDeptTab = false;
    vm.EmployeeMasterTabs = USER.EmployeeMasterTabs;
    vm.isWorkstationTab = false;
    vm.isCustomerMappingTab = false;
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.pageName = USER.ADMIN_EMPLOYEE_LABEL;
    vm.IsUserHaveRole = false;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.isHideSearchButton = false;
    vm.isHideSearchButtonadded = false;
    vm.phoneNumberNote = null;
    vm.faxNumberNote = null;
    vm.EmailIDAlreadyExists = null;
    vm.isRightChange = false;
    vm.isFeatureChange = false;
    vm.isRoleChange = false;
    vm.isSetPaymentChange = false;
    vm.loginUser = BaseService.loginUser;
    vm.stateNote = CORE.General_Notes.State;
    vm.employeeTitle = '';

    vm.pageTabRights =
    {
      DetailTab: false,
      CredentialTab: false,
      SecurityTab: false,
      RightsSummaryTab: false,
      DepartmentTab: false,
      DocumentTab: false,
      WorkstationsTab: false,
      CustomerMappingTab: false,
      OtherDetailTab: false,
      PreferenceTab: false,
      UserAgreementTab: false
    };

    const FileAllow = CORE.FileTypeList;
    vm.FileTypeList = _.map(FileAllow, 'extension').join(',');

    vm.selectedDepartment = null;

    vm.selectedGenericCategory = null;

    vm.employee = {
      paymentMode: CORE.PaymentMode.Exempt,
      isExternalEmployee: false,
      isActive: true
    };

    vm.employeeDepartment = {};

    vm.emailArray = [];
    vm.contactArray = [];

    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(USER.EmployeeMasterTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        switch (itemTabName.Name) {
          case USER.EmployeeMasterTabs.Detail.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.Credential.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_CREDENTIAL_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.Security.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.RightsSummary.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_RIGHTS_SUMMARY_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.Department.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DEPARTMENT_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.Documents.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DOCUMENTS_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.Workstations.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_WORKSTATIONS_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.CustomerMapping.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_CUSTOMERMAPPING_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.OtherDetail.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_OTHERDETAIL_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.Preference.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_PREFERENCE_STATE, { id: vm.employeeId });
            break;
          case USER.EmployeeMasterTabs.UserAgreement.Name:
            $state.go(USER.ADMIN_EMPLOYEE_MANAGE_USERAGREEMENT_STATE, { id: vm.employeeId });
            break;
          default:
        }
      }
    };

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        let tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DetailTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_CREDENTIAL_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.CredentialTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.SecurityTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_RIGHTS_SUMMARY_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.RightsSummaryTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_DEPARTMENT_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DepartmentTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_DOCUMENTS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.DocumentTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_WORKSTATIONS_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.WorkstationsTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_CUSTOMERMAPPING_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.CustomerMappingTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_OTHERDETAIL_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.OtherDetailTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_PREFERENCE_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.PreferenceTab = true;
        }
        tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_EMPLOYEE_MANAGE_USERAGREEMENT_STATE);
        if (tab && tab.length > 0 && tab[0].isActive) {
          vm.pageTabRights.UserAgreementTab = true;
        }
      }
    }

    function getEmployeeDetail() {
      vm.cgBusyLoading = EmployeeFactory.employee().query({ id: vm.employeeId }).$promise.then((employees) => {
        vm.employeeMain = angular.copy(employees.data);
        vm.employee = angular.copy(employees.data);
        if (vm.employee) {
          vm.employeeTitle = ': ' + vm.employee.formattedName;
          vm.employeeName = vm.employee.formattedName;
        }

        vm.userId = vm.employee.userID;
        vm.identityUserId = vm.employee.IdentityUserId;
        vm.selectedRole = vm.employee.selectedRole;
        if (vm.selectedRole && vm.selectedRole.length > 0) {
          vm.selectedRole = _.first(vm.selectedRole);
        }
        if (vm.employee.isUser) {
          vm.isUser = true;
        }
        else {
          vm.isUser = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.loginuserpagelist = $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
      var menudata = data;
      setTabWisePageRights(menudata);
      $scope.$applyAsync();
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    vm.employeeId = $stateParams.id;
    vm.tabName = $stateParams.selectedTab;
    vm.selectedTabIndex = 0;
    if (vm.tabName) {
      if (!vm.employeeId) {
        if (USER.EmployeeMasterTabs.Detail.Name !== vm.tabName) {
          $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, { id: vm.employeeId });
        }
      } else {
        const tab = _.find(USER.EmployeeMasterTabs, (item) => item.Name === vm.tabName);
        if (tab) {
          vm.selectedTabIndex = tab.ID;
        }
        getEmployeeDetail();
      }
    }

    const selectPersonnel = (item) => {
      if (item) {
        $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, { id: item.id });
        $timeout(() => {
          vm.autoCompletePersonnel.keyColumnId = null;
        }, true);
      }
    };

    /* get employee List*/
    const getPersonnelSearch = (searchObj) => EmployeeFactory.employeeList().query(searchObj).$promise.then((employees) => {
      vm.employeeList = angular.copy(employees.data);
      _.each(vm.employeeList, (item) => {
        item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName);
        if (item.profileImg && item.profileImg) {
          item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
        }
        else {
          item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
      });
      return vm.employeeList;
    }).catch((error) => BaseService.getErrorLog(error));

    /*Auto-complete for Search personnel */
    vm.autoCompletePersonnel = {
      columnName: 'name',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'Personnel',
      placeholderName: 'Personnel',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectPersonnel,
      onSearchFn: function (query) {
        const searchobj = {
          searchquery: query
        };
        return getPersonnelSearch(searchobj);
      }
    };

    // check form dirty on back button
    vm.backToEmployee = () => {
      if (BaseService.checkFormDirty(vm.employeeDetail, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton();
      }
      else if (vm.userForm && vm.userForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      }
      else if (vm.isRightChange || vm.isFeatureChange || vm.isRoleChange) {
        showWithoutSavingAlertforBackButton();
      }
      else if (vm.employeeDepartmentForm && vm.employeeDepartmentForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      }
      else if (vm.employeeOtherDetail && vm.employeeOtherDetail.$dirty) {
        showWithoutSavingAlertforBackButton();
      }
      else if (vm.employeePreferencesForm && vm.employeePreferencesForm.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        BaseService.currentPageForms = [];
        $state.go(USER.ADMIN_EMPLOYEE_STATE);
      }
    };

    function showWithoutSavingAlertforBackButton() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };

      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.tabName === USER.EmployeeMasterTabs.Detail.Name) {
            vm.employeeDetail.$setPristine();
          } else if (vm.tabName === USER.EmployeeMasterTabs.Credential.Name) {
            vm.userForm.$setPristine();
          } else if (vm.tabName === USER.EmployeeMasterTabs.Security.Name) {
            vm.isRightChange = false;
            //vm.isHBChange = false;
            vm.isFeatureChange = false;
            vm.isRoleChange = false;
            if (vm.rolePagePermisionForm) {
              vm.rolePagePermisionForm.$setPristine();
            }
          } else if (vm.tabName === USER.EmployeeMasterTabs.Department.Name) {
            vm.employeeDepartmentForm.$setPristine();
          } else if (vm.tabName === USER.EmployeeMasterTabs.OtherDetail.Name) {
            vm.employeeOtherDetail.$setPristine();
          } else if (vm.tabName === USER.EmployeeMasterTabs.Preference.Name) {
            vm.employeePreferencesForm.$setPristine();
          }
          $state.go(USER.ADMIN_EMPLOYEE_STATE);
          return true;
        }
        $state.go(USER.ADMIN_EMPLOYEE_STATE);
      }, (error) => BaseService.getErrorLog(error));
    }

    /*-----Documents-----------*/
    vm.description = null;

    vm.cancel = () => {
      vm.employee.profileImg = null;
      vm.imagefile = null;
      vm.croppedImage = null;
      $mdDialog.cancel();
    };

    /*To save other value detail
        Note:If any step added after other detail just remove function body and add logic of last step
    */
    vm.fileList = {};
    vm.finish = () => {
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.employeeId,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        //msWizard.resetForm();
        // commented as per last discussion on 18/09/2018, no need to move to list will press back button
        //$state.go(USER.ADMIN_EMPLOYEE_STATE);

        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.employeeOtherDetail.$setPristine();

        /* code for rebinding document to download - (actually all other details) */
        //if (vm.fileList && !_.isEmpty(vm.fileList)) {
        vm.fileList = {};
        vm.tabName = null;
        $timeout(() => {
          vm.tabName = vm.EmployeeMasterTabs.OtherDetail.Name;
        }, 0);
        //}
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };


    /* Manually put as load 'ViewDataElement directive' only on other details tab   */
    vm.onTabChanges = (TabName, msWizard) => {
      BaseService.setLoginUserChangeDetail(false);

      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);

      /* for chack form Dirty popup on tab change */

      vm.ischangePage = false;
    };

    /* Show save alert popup when performing next and previous*/
    function showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, isPrevious) {
      const selectedIndex = msWizard.selectedIndex;
      if (isSave) {
        if (selectedIndex === 0) {
          if (vm.employeeDetail.$valid) {
            $scope.$broadcast('saveEmployeeDetailChanges');
          }
        }
        else if (selectedIndex === 1) {
          $scope.$broadcast('savePasswordChanges');
        }
        else if (selectedIndex === 2) {
          $scope.$broadcast('SaveRoleRight');
        }
        else if (selectedIndex === 3) {
          vm.employeeDepartmentForm.$setPristine();
        }
      }
      else {
        if (isChanged) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (selectedIndex === 0) {
                if (!vm.employeeMain.profileImg) {
                  vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                } else {
                  vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.employeeMain.profileImg;
                }
                oldImgfile = vm.imagefile;
                getEmployeeDetail(vm.employeeId);
                //vm.employeeDetail.$setPristine();
              }
              else if (selectedIndex === 1) {
                vm.employee.password = null;
                vm.employee.passwordConfirmation = null;
                vm.userForm.$setPristine();
                // vm.getPageList();
              }
              else if (selectedIndex === 2) {
                /*Bellow code commented by Azim Kazi
                as no need of this here because we are asking confirmation pop-up in case of dirty state
                */
                //if (vm.selectedRole.length == 0) {
                //    let alertModel = {
                //        title: USER.USER_ERROR_LABEL,
                //        textContent: CORE.MESSAGE_CONSTANT.SELECT_ROLE_ALERT_MESSAGE
                //    };
                //    DialogFactory.alertDialog(alertModel);
                //    return false;
                //} else {
                if (vm.rolePagePermisionForm) {
                  vm.rolePagePermisionForm.$setPristine();
                }
              }
              else if (selectedIndex === 3) {
                vm.employeeDepartmentForm.$setPristine();
              }
              else if (selectedIndex === 6) {
                vm.employeeOtherDetail.$setPristine();
              }
              if (isPrevious) {
                msWizard.previousStep();
              } else {
                msWizard.nextStep();
              }
            }
          }, () => { // Empty block.
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (isPrevious) {
            msWizard.previousStep();
          } else {
            msWizard.nextStep();
          }
        }
      }
    }

    const savedRoleRight = $scope.$on('savedRoleRight', (evt, data) => {
      if (data) {
        if (vm.rolePagePermisionForm) {
          vm.rolePagePermisionForm.$setPristine();
        }
        vm.ischangePage = false;
      }
    });

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    /* Next Step Click */
    vm.CheckStepAndAction = (msWizard, isUnique, isSave) => {
      let isChanged = false;
      msWizard.selectedIndex = vm.selectedTabIndex;
      if (vm.tabName === vm.EmployeeMasterTabs.Detail.Name) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.employeeDetail)) {
            vm.saveDisable = false;
            return;
          }
        }
        isChanged = BaseService.checkFormDirty(vm.employeeDetail, vm.checkDirtyObject);
        if (!isChanged) {
          isChanged = vm.ischangePage;
        }
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
      else if (vm.tabName === vm.EmployeeMasterTabs.Credential.Name) {
        // Credential Tab
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.userForm)) {
            vm.saveDisable = false;
            return;
          }
        }
        isChanged = BaseService.checkFormDirty(vm.userForm, null, null, null);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
        //  vm.getPageList();
        //vm.getRoleList();
      }
      else if (vm.tabName === vm.EmployeeMasterTabs.Security.Name) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(msWizard.currentStepForm(), vm.isRightChange ? vm.isRightChange : vm.isFeatureChange)) {
            vm.saveDisable = false;
            return;
          }
        }
        if (vm.rolePagePermisionForm) {
          isChanged = BaseService.checkFormDirty(msWizard.currentStepForm(), null, null, null);
        }
        if (!isChanged) {
          isChanged = vm.isRightChange ? vm.isRightChange : (vm.isFeatureChange ? vm.isFeatureChange : vm.isRoleChange);
        }
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
      else if (vm.tabName === vm.EmployeeMasterTabs.Department.Name) {
        isChanged = BaseService.checkFormDirty(vm.employeeDepartmentForm, null, null, null);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
      else if (vm.tabName === vm.EmployeeMasterTabs.Documents.Name) {
        msWizard.nextStep();
      }
      else if (vm.tabName === vm.EmployeeMasterTabs.Workstations.Name) {
        msWizard.nextStep();
      }
      else if (vm.tabName === vm.EmployeeMasterTabs.CustomerMapping.Name) {
        msWizard.nextStep();
      } else if (vm.tabName === vm.EmployeeMasterTabs.OtherDetail.Name) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.employeeOtherDetail)) {
            vm.saveDisable = false;
            return;
          }
          vm.finish();
        }
      } else if (vm.tabName === vm.EmployeeMasterTabs.Preference.Name) {
        if (isSave) {
          vm.saveDisable = true;
          $scope.$broadcast('saveUserConfigChanges', vm.employeePreferencesForm);
          vm.saveDisable = false;
        }
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      BaseService.setLoginUserChangeDetail(false);
      savedRoleRight();
      vm.loginuserpagelist();
      $mdDialog.hide(false, { closeAll: true });
    });

    /* fun to check form dirty on tab change */
    vm.isStepValid = function () {
      var isDirty = false;
      switch (vm.tabName) {
        case vm.EmployeeMasterTabs.Detail.Name: {
          isDirty = BaseService.checkFormDirty(vm.employeeDetail, vm.checkDirtyObject);
          return isDirty ? showWithoutSavingAlertforTabChange() : true;
          break;
        }
        case vm.EmployeeMasterTabs.Credential.Name: {
          isDirty = vm.userForm.$dirty;
          return isDirty ? showWithoutSavingAlertforTabChange() : true;
          break;
        }
        case vm.EmployeeMasterTabs.Security.Name: {
          isDirty = (vm.isRightChange || vm.isFeatureChange || vm.isRoleChange) ? true : false;
          return isDirty ? showWithoutSavingAlertforTabChange() : true;
          break;
        }
        case vm.EmployeeMasterTabs.Department.Name: {
          isDirty = vm.employeeDepartmentForm.$dirty;
          return isDirty ? showWithoutSavingAlertforTabChange() : true;
          break;
        }
        case vm.EmployeeMasterTabs.OtherDetail.Name: {
          isDirty = vm.employeeOtherDetail.$dirty;
          return isDirty ? showWithoutSavingAlertforTabChange() : true;
          break;
        }
        case vm.EmployeeMasterTabs.Preference.Name: {
          isDirty = vm.employeePreferencesForm.$dirty;
          return isDirty ? showWithoutSavingAlertforTabChange() : true;
          break;
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          if (vm.tabName === USER.EmployeeMasterTabs.Detail.Name) {
            vm.employeeDetail.$setPristine();
            return true;
          } else if (vm.tabName === USER.EmployeeMasterTabs.Credential.Name) {
            vm.employee.password = null;
            vm.employee.passwordConfirmation = null;
            vm.userForm.$setPristine();
            return true;
          } else if (vm.tabName === USER.EmployeeMasterTabs.Security.Name) {
            vm.isRightChange = false;
            //vm.isHBChange = false;
            vm.isFeatureChange = false;
            vm.isRoleChange = false;
            if (vm.rolePagePermisionForm) {
              vm.rolePagePermisionForm.$setPristine();
            }
            return true;
          } else if (vm.tabName === USER.EmployeeMasterTabs.Department.Name) {
            vm.employeeDepartmentForm.$setPristine();
            return true;
          } else if (vm.tabName === USER.EmployeeMasterTabs.OtherDetail.Name) {
            vm.employeeOtherDetail.$setPristine();
            return true;
          } else if (vm.tabName === USER.EmployeeMasterTabs.Preference.Name) {
            vm.employeePreferencesForm.$setPristine();
            return true;
          }
        }
      }, () => { // Empty Block.
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.EmployeeTypeChange = () => {
      if (!vm.employee.isExternalEmployee) {
        vm.autoCompleteSupplier.keyColumnId = null;
      }
    };

    /* open menu of delete Personnel. */
    vm.openMenu = function ($mdMenu, ev) {
      $mdMenu.open(ev);
    };

    /* delete Employee */
    vm.deleteRecord = () => {
      if (!vm.employeeId) {
        return;
      }
      const selectedIDs = [vm.employeeId];
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE_DET);
      messageContent.message = stringFormat(messageContent.message, 'Personnel');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      const objIDs = {
        id: selectedIDs,
        CountList: false
      };
      $mdMenu.hide();
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = EmployeeFactory.deleteEmployee().query({ objIDs: objIDs }).$promise.then((res) => {
            if (res) {
              if (res.data && (res.data.length > 0 || res.data.transactionDetails)) {
                const data = {
                  TotalCount: res.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.employees
                };
                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                  const IDs = {
                    id: selectedIDs,
                    CountList: true
                  };
                  return EmployeeFactory.deleteEmployee().query({
                    objIDs: IDs
                  }).$promise.then((res) => {
                    let data = {};
                    data = res.data;
                    data.pageTitle = vm.employeeName;
                    data.PageName = CORE.PageName.employees;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then(() => {
                        }, () => {
                        });
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                });
              } else {
                BaseService.currentPageForms = [];
                vm.goToPersonnelList(true);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };


    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToPersonnelList = (openINSameTab) => {
      BaseService.goToPersonnelList(openINSameTab);
    };

    // Add Personnel
    vm.addPersonnel = (openINSameTab) => {
      BaseService.goToManagePersonnel(null, openINSameTab);
    };

    // Asign Operation to Employee
    vm.showOperationAssigned = () => {
      BaseService.openInNew(USER.MANAGE_EMPLOYEE_OPERATIONS_STATE, { id: vm.employeeId });
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.employeePreferencesForm];
    });
  }
})();
