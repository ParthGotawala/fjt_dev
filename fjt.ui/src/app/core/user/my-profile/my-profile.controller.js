(function () {
  'use strict';

  angular
    .module('app.userprofile')
    .controller('MyProfileController', MyProfileController);

  /** @ngInject */
  function MyProfileController(DialogFactory, $scope, $timeout, $state, $stateParams, $q, BaseService, CORE, USER, DASHBOARD, EmployeeFactory, GenericCategoryFactory, UserFactory, RoleFactory, EmployeeCertificationFactory) {
    const vm = this;
    var autocompletePromise;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.loginUser = BaseService.loginUser;
    vm.saveDisable = false;
    // set theme class dynamically on each popup element as theme is not apply on popup if opened from popup
    vm.themeClass = CORE.THEME;
    vm.LabelConstant = CORE.LabelConstant;
    vm.employee = {};
    vm.loginUserID = BaseService.loginUser.userid;
    vm.userID = BaseService.loginUser.employee.id;
    vm.DetailsTabName = CORE.UserProfileTabs.Detail;   // "Details"
    vm.RoleTabName = CORE.UserProfileTabs.Security; // "RolesAndRights";
    vm.UserSettings = CORE.UserProfileTabs.Settings; // "UserSettings";
    vm.UserPreTabName = CORE.UserProfileTabs.Preferences;  // 'UserPreferences';
    vm.UserSignUpAgreementTabName = CORE.UserProfileTabs.UserSignUpAgreement; // 'UserSignupAgreement';
    vm.pageName = CORE.USER_PROFILE_LABEL;
    vm.isRoleTab = false;
    vm.isUserPreTab = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.isRightChange = false;
    vm.isFeatureChange = false;
    vm.isRoleChange = false;
    vm.isAgreeemntTab = false;
    vm.GoToHome = () => {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      BaseService.currentPageForms = [];
    };
    vm.tabName = $stateParams.selectedTab;
    vm.pageTabRights =
    {
      DetailTab: false,
      SecurityTab: false,
      SettingTab: false,
      PreferenceTab: false,
      AgreementTab: false
    };

    if (vm.tabName) {
      const tab = _.find(CORE.UserProfileTabs, (item) => item.Name === vm.tabName);
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    };


    /* Employee dropdown fill up */
    const getemployeeList = () => EmployeeFactory.employeeList().query()
      .$promise.then((employees) => {
        vm.employeeList = angular.copy(employees.data);
        _.each(vm.employeeList, (item) => {
          if (item.employeeDepartment) {
            item.employeeDepartment = _.first(item.employeeDepartment);
          }
          let deptName = '';
          let gencCategoryName = '';
          if (item.employeeDepartment && item.employeeDepartment.department) {
            deptName = ' (' + item.employeeDepartment.department.deptName + ')';
          }
          if (item.employeeDepartment && item.employeeDepartment.genericCategory) {
            gencCategoryName = ' ' + item.employeeDepartment.genericCategory.gencCategoryName;
          }
          item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
          if (item.profileImg) {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        return $q.resolve(vm.employeeList);
      }).catch((error) => BaseService.getErrorLog(error));

    const getEmployeeDetail = () => {
      vm.cgBusyLoading = EmployeeFactory.employee().query({ id: vm.userID }).$promise.then((employees) => {
        vm.employee = angular.copy(employees.data);
        vm.employeeMain = angular.copy(vm.employee);
        //Check Employee is active in any transaction or not
        vm.EmployeeActiveTrans = _.find(employees.data.workorderTransEmpinout, (emp) => emp.checkinTime && !emp.checkoutTime);
        vm.userId = vm.employee.userID;
        vm.identityUserId = vm.employee.IdentityUserId;
        vm.selectedRole = vm.employee.selectedRole;
        if (vm.selectedRole && vm.selectedRole.length > 0) {
          vm.selectedRole = _.first(vm.selectedRole);
        }
        vm.isCreateMode = false;
        if (vm.employee.isUser === true) {
          vm.isUser = true;
        }
        else {
          vm.isUser = false;
        }
        if (vm.employee && vm.employee.profileImg) {
          vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.employee.profileImg;
          // oldImgfile = vm.imagefile;
        }
        else {
          vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
        if (vm.employee && vm.employee.managerID) {
          const employee = _.find(vm.employeeList, (emp) => emp.id === vm.employee.managerID);
          if (employee) {
            //vm.employee.managerName = employee.firstName + " " + employee.lastName;
            vm.employee.managerName = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, employee.initialName, employee.firstName, employee.lastName);
          }
        }

        $timeout(() => {
          if (vm.userID && vm.employeeDetail) {
            BaseService.checkFormValid(vm.employeeDetail, false);
            vm.checkDirtyObject = {
              columnName: ['contact', 'profileImg'],
              oldModelName: vm.employeeMain,
              newModelName: vm.employee
            };
          }
        }, 0);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get printer format and printer detail
    /* GenericCategory dropdown fill up */
    const getAllGenericCategoryByCategoryType = () => {
      const GencCategoryType = [];
      let GenericCategoryAllData = [];
      GencCategoryType.push(CategoryTypeObjList.Printer.Name);
      const listObj = {
        GencCategoryType: GencCategoryType
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories.data;
        //get printer list
        vm.PrinterList = _.filter(GenericCategoryAllData, (item) => item.categoryType === CategoryTypeObjList.Printer.Name && item.isActive === true);
        return $q.resolve(vm.PrinterList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const InitautoComplete = () => {
      vm.autoCompletePrinter = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.user ? vm.user.printerID : null,
        inputName: CategoryTypeObjList.Printer.Name,
        placeholderName: CategoryTypeObjList.Printer.Title,
        addData: { headerTitle: CategoryTypeObjList.Printer.Title },
        isRequired: false,
        isAddnew: true,
        callbackFn: getAllGenericCategoryByCategoryType,
        onSelectCallbackFn: (item) => {
          if (item && item.gencCategoryID !== (vm.PrintDetail ? vm.PrintDetail.gencCategoryID : null)) {
            vm.PrintDetail = item;
            vm.user.printerID = item ? item.gencCategoryID : null;
            if (vm.showprinterdropdown) {
              vm.ischange = true;
            }
            if (item) {
              vm.autoCompletePrinter.keyColumnId = item.gencCategoryID;
              vm.showprinterdropdown = false;
              vm.userSettingsForm.$dirty = true;
            }
          }
          else {
            vm.ischange = false;
            vm.userSettingsForm.$dirty = false;
          }
        }
      };
      vm.autoCompleteDefaultRole = {
        columnName: 'roleName',
        keyColumnName: 'roleId',
        keyColumnId: vm.user ? vm.user.defaultLoginRoleID : null,
        inputName: 'Select Default Role',
        placeholderName: '',
        isRequired: false,
        isAddnew: false,
        callbackFn: getRoleList,
        onSelectCallbackFn: (item) => {
          if (item && item.roleId !== (vm.RoleDetail ? vm.RoleDetail.roleId : null)) {
            vm.RoleDetail = item;
            vm.user.defaultLoginRoleID = item ? item.roleId : null;
            if (vm.showroledropdown) {
              vm.ischange = true;
            }
            if (item) {
              vm.autoCompleteDefaultRole.keyColumnId = item.roleId;
              vm.showroledropdown = false;
            }
          }
          else {
            vm.ischange = false;
          }
        }
      };
    };

    const getUserDetail = () => UserFactory.user().query({ id: vm.loginUserID })
      .$promise.then((users) => {
        if (users.data && users.data.user.length > 0) {
          vm.user = users.data.user[0];
          vm.userCopy = _.clone(vm.user);
          vm.checkDirtyObjectDet = {
            columnName: ['printerID', 'defaultLoginRoleID'],
            oldModelName: vm.userCopy,
            newModelName: vm.user
          };
          return users.data.user;
        } else { // added for error case
          return (users.errors && users.errors.data) ? users.errors.data : '';// return in case of error , if any data passed from API
        }
      });

    /* Role dropdown fill up */
    const getRoleList = () => RoleFactory.getRolesByUser().query({ id: vm.loginUserID })
      .$promise.then((userRole) => {
        if (userRole.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          const roleList = [];
          _.map(userRole.data, (data) => {
            const roleData = {};
            roleData.userId = data.userId;
            roleData.roleId = data.roleId;
            roleData.roleName = data.role ? data.role.name : null;
            roleList.push(roleData);
          });
          vm.RoleList = roleList;
          return $q.resolve(roleList);
        } else {
          return $q.resolve({});
        }
      }).catch((error) => BaseService.getErrorLog(error));

    //get employee responsibility
    const getEmployeeResponsibilityList = () => EmployeeFactory.getEmployeeResponsibility().query({ employeeID: vm.userID }).$promise.then((res) => {
      if (res && res.data) {
        vm.employeeResponsibilityList = res.data;
      }
      return $q.resolve(res);
    }).catch((error) => BaseService.getErrorLog(error));

    const getEmployeeCertificationList = () => EmployeeCertificationFactory.getCertifiedStandardListOfEmployee().save({ employeeID: vm.userID })
      .$promise.then((res) => {
        if (res && res.data) {
          vm.employeeCertificationList = [];
          _.each(res.data, (stdwithclassItem) => {
            const stdwithclassObj = {
              allClassList: []
            };
            _.each(stdwithclassItem.employeeCertification, (empCertiItem) => {
              if (empCertiItem.classID) {
                const classObj = {};
                const selectedClassItem = _.find(stdwithclassItem.CertificateStandard_Class, (classitem) => empCertiItem.classID === classitem.classID);
                classObj.class = selectedClassItem ? selectedClassItem.className : null;
                classObj.colorCode = selectedClassItem ? (selectedClassItem.colorCode ? selectedClassItem.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
                stdwithclassObj.allClassList.push(classObj);
              }
            });
            stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;
            stdwithclassObj.standard = stdwithclassItem.fullName;
            stdwithclassObj.priority = stdwithclassItem.priority;
            vm.employeeCertificationList.push(stdwithclassObj);
          });
          vm.employeeCertificationList.sort(sortAlphabatically('priority', 'standard', true));
        }
        return $q.resolve(res);
      }).catch((error) => BaseService.getErrorLog(error));


    autocompletePromise = [getemployeeList(), getAllGenericCategoryByCategoryType(), getUserDetail(), getRoleList(), getEmployeeResponsibilityList(), getEmployeeCertificationList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      if (vm.userID) {
        getEmployeeDetail();
        InitautoComplete();
        vm.PrintDetail = _.find(vm.PrinterList, (item) => item.gencCategoryID === vm.user.printerID);
        vm.RoleDetail = _.find(vm.RoleList, (item) => item.roleId === vm.user.defaultLoginRoleID);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //transfer route as per tab change --Kinjal
    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(CORE.UserProfileTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        switch (itemTabName.Name) {
          case CORE.UserProfileTabs.Detail.Name:
            $state.go(CORE.USER_PROFILE_DETAIL_STATE);
            break;
          case CORE.UserProfileTabs.Security.Name:
            $state.go(CORE.USER_PROFILE_SECURITY_STATE);
            break;
          case CORE.UserProfileTabs.Settings.Name:
            $state.go(CORE.USER_PROFILE_SETTINGS_STATE);
            break;
          case CORE.UserProfileTabs.Preferences.Name:
            $state.go(CORE.USER_PROFILE_PREFERENCE_STATE);
            break;
          case CORE.UserProfileTabs.UserSignUpAgreement.Name:
            $state.go(CORE.USER_PROFILE_SIGNUP_AGREEMENT_STATE);
            break;
          default: break;
        }
      }
    };

    /* Manually put as load "ViewDataElement directive" only on other details tab  */
    vm.onTabChanges = (TabName, msWizard) => {
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);

      if (TabName === vm.RoleTabName) {
        vm.isRoleTab = true;
      } else if (TabName === vm.UserSignUpAgreementTabName) {
        vm.isAgreeemntTab = true;
      } else if (TabName === vm.UserPreTabName) {
        vm.isUserPreTab = true;
      } else {
        vm.isRoleTab = false;
        vm.isUserPreTab = false;
        if (TabName === vm.UserSettings) {
          vm.PrintDetail = _.find(vm.PrinterList, (item) => item.gencCategoryID === vm.user.printerID);
          vm.RoleDetail = _.find(vm.RoleList, (item) => item.roleId === vm.loginUser.defaultLoginRoleID);
        }
      }
      vm.showprinterdropdown = false;
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = (step) => {
      switch (step) {
        case 2: {
          if (vm.ischange) {
            // return showWithoutSavingAlertforGoback($scope.msWizard);
            return showWithoutSavingAlertforTabChange(step);
          }
          else { return true; }
        }
        case 3: {
          if (vm.ischange) {
            // return showWithoutSavingAlertforGoback($scope.msWizard);
            return showWithoutSavingAlertforTabChange(step);
          }
          else { return true; }
        }
      }
    };

    /* Next Step Click */
    vm.CheckStepAndAction = (msWizard, isUnique, isSave) => {
      if (msWizard.selectedIndex === 0) {
        msWizard.selectedIndex = msWizard.selectedIndex + 1;
      }
      else if (msWizard.selectedIndex === 1) {
        msWizard.selectedIndex = msWizard.selectedIndex + 1;
      }
      else if (msWizard.selectedIndex === 2) {
        if (vm.ischange && isSave) {
          vm.saveUserDetail();
        } else if (!vm.ischange) {
          if (BaseService.focusRequiredField(vm.userSettingsForm)) {
            return;
          }
        } else if (vm.ischange && !isSave) {
          showWithoutSavingAlertforGoback(msWizard);
        }
      }
      else if (msWizard.selectedIndex === 3) {
        vm.saveDisable = true;
        $scope.$broadcast('saveUserConfigChanges', vm.userPreferencesForm);
        vm.saveDisable = false;
      } else if (msWizard.selectedIndex === 4) {
        msWizard.selectedIndex = msWizard.selectedIndex + 1;
      }
    };

    /* Not used so commented (- By Kinjal) */
    //vm.loadPreviousStep = (msWizard) => {
    //    if (msWizard.selectedIndex == 1)
    //        msWizard.selectedIndex = msWizard.selectedIndex - 1;
    //    else if (msWizard.selectedIndex == 2) {
    //        if (vm.ischange) {
    //            showWithoutSavingAlertforGoback(msWizard);
    //        } else {
    //            msWizard.selectedIndex = msWizard.selectedIndex - 1;
    //        }
    //    }
    //}

    const setTabWisePageRights = (pageList) => {
      if (pageList && pageList.length > 0) {
        let tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.USER_PROFILE_DETAIL_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.DetailTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.USER_PROFILE_SECURITY_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.SecurityTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.USER_PROFILE_SETTINGS_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.SettingTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.USER_PROFILE_PREFERENCE_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.PreferenceTab = true;
        }
        tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === CORE.USER_PROFILE_SIGNUP_AGREEMENT_STATE);
        if (tab && tab.isActive) {
          vm.pageTabRights.AgreementTab = true;
        }
      }
    };

    // for setting tab wise page rights on page reload
    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
    });

    // Set tab wise page rights on first load
    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    const showWithoutSavingAlertforGoback = (msWizard) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.ischange = false;
          if (!msWizard) {
            return true;
          }
          else {
            msWizard.selectedIndex = msWizard.selectedIndex - 1;
          }
        }
      }, () => {
        vm.ischange = true;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Show save alert popup when performing tab change*/
    const showWithoutSavingAlertforTabChange = (step) => {
      var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.ischange = false;
          if (step === 2) {
            vm.userSettingsForm.$setPristine();
            return true;
          } else if (step === 3) {
            vm.userPreferencesForm.$setPristine();
            return true;
          }
        }
      }, () => {
        vm.ischange = true;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //set printer flag
    vm.editPrinter = () => {
      vm.showprinterdropdown = true;
      vm.autoCompletePrinter.keyColumnId = vm.PrintDetail ? vm.PrintDetail.gencCategoryID : null;
    };

    //set default role flag
    vm.editDefaultRole = () => {
      vm.showroledropdown = true;
      vm.autoCompleteDefaultRole.keyColumnId = vm.RoleDetail ? vm.RoleDetail.roleId : null;
    };

    //save user detail
    vm.saveUserDetail = () => {
      vm.saveDisable = true;
      const userObject = {
        printerID: vm.user.printerID,
        defaultLoginRoleID: vm.user.defaultLoginRoleID,
        id: vm.loginUserID
      };
      vm.cgBusyLoading = UserFactory.updateUserSetting().query({ userObj: userObject }).$promise.then(() => {
        vm.saveDisable = false;
        vm.ischange = false;
        vm.loginUser.defaultLoginRoleID = userObject.defaultLoginRoleID;
        console.log('Set Loginuser: myProfile');
                /* only for debug purpose - [S]*/
const tractActivityLog = getLocalStorageValue('tractActivityLog');
if (tractActivityLog && Array.isArray(tractActivityLog)) {
  const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'setLoginUser: fro myProfile.' };
  tractActivityLog.push(obj);
  setLocalStorageValue('tractActivityLog', tractActivityLog);
}
/* [E]*/
        BaseService.setLoginUser(vm.loginUser, null);
        vm.userSettingsForm.$setPristine();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPageForms = [vm.userPreferencesForm, vm.userSettingsForm];
    });
  }
})();
