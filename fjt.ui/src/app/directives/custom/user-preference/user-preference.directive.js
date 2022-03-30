(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('userPreference', userPreference);

  /** @ngInject */
  function userPreference(BaseService, MyProfileFactory, DialogFactory, RolePagePermisionFactory, USER, CORE, $q) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        userId: '=?',
        employeeId: '=?',
        pageName: '=?'
      },
      templateUrl: 'app/directives/custom/user-preference/user-preference.html',
      controller: userPreferenceCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function userPreferenceCtrl($scope) {
      var vm = this;
      vm.pageName = $scope.pageName;
      vm.userId = $scope.userId;
      vm.selectEmployeeId = $scope.employeeId;
      vm.loginUser = BaseService.loginUser;
      vm.userConfig = {};
      vm.userProfilePage = CORE.USER_PROFILE_LABEL;
      vm.EmployeePage = USER.ADMIN_EMPLOYEE_LABEL;
      vm.popup = {
        logout_user: false
      };
      vm.radioButtonGroup = {
        isUserPref: {
          array: CORE.UserPrefRadioGroup.isUserPref
        }
      };

      const userConfigDetail = () => {
        /* Get user Config details */
        if (vm.userId) {
          return MyProfileFactory.getUserPreference().query({
            userId: vm.userId,
            configurationID: CORE.ConfigurationMasterKeyList.UIGridPreference.id
          }).$promise.then((resp) => {
            if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (resp.data) {
                vm.userConfig = angular.copy(resp.data);
                vm.userConfig.uiGridPreference = vm.userConfig.configurationValue;
              } else {
                vm.userConfig.uiGridPreference = CORE.UIGridPreferences.Scrolling; // default value
              }
              return $q.resolve(vm.userConfig);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      autocompletePromise = [userConfigDetail()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        vm.ValRadiobutton = (vm.userConfig.uiGridPreference === CORE.UIGridPreferences.Scrolling) ? true : false;
        // setFocus(vm.ValRadiobutton);
      }).catch((error) => BaseService.getErrorLog(error));

      //Check pagination/scrolling on radio button click change
      vm.CheckUserPref = () => {
        vm.userConfig.uiGridPreference = vm.ValRadiobutton ? CORE.UIGridPreferences.Scrolling : CORE.UIGridPreferences.Pagination;
        //$scope.$parent.vm.ischange = (vm.pageName === vm.userProfilePage) ? true : false;
        $scope.$parent.vm.ischange = true;
      };

      vm.SaveUserConfig = () => {
        const userPrefConfiguration = {
          userId: vm.userId,
          configurationID: CORE.ConfigurationMasterKeyList.UIGridPreference.id,
          configurationValue: vm.userConfig.uiGridPreference
        };

        return MyProfileFactory.saveUserConfiguration().query(userPrefConfiguration).$promise.then((resp) => {
          if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            clearFormData();
            if (vm.loginUser && vm.loginUser.userid === vm.userId) {
              showInformationForReLoginOfCurrentUser();
            } else {
              showInformationForSendNotificationOfOtherUser();
            }
          } else {
            BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.userConfigDetail);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      $scope.$on('saveUserConfigChanges', (evt, data) => {
        let isChanged = false;
        vm.isRecordSaved;
        /* check form dirty for existing entry of save if entry doesn't exists can save without checking dirty */
        if (vm.userConfig.ID || vm.isRecordSaved) {
          isChanged = BaseService.checkFormDirty(data);
          if (!isChanged) {
            if (BaseService.focusRequiredField(data)) {
              return;
            }
          } else {
            vm.SaveUserConfig();
          }
        } else {
          // call directly save function
          vm.SaveUserConfig();
          vm.isRecordSaved = true;
        }
      });

      // Function of show information popup for logout of current user after save
      const showInformationForReLoginOfCurrentUser = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_LOGOUT);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            BaseService.logoutWithOperationConfirmation(vm);
          }
        }, () => {
          clearFormData();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function of show information popup for send notification of other user after save
      const showInformationForSendNotificationOfOtherUser = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_SEND_NOTIFICATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_SEND_NOTIFICATION,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            sendNotificationAllActiveSession();
          }
        }, () => {
          clearFormData();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function for send notification when user change the other user role-right-permiddion
      const sendNotificationAllActiveSession = () => {
        RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.selectEmployeeId }).$promise.then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const clearFormData = () => {
        if (vm.pageName === vm.userProfilePage) {
          $scope.$parent.vm.userPreferencesForm.$setPristine();
          $scope.$parent.vm.ischange = false;
        }
        else if (vm.pageName === vm.EmployeePage) {
          $scope.$parent.vm.employeePreferencesForm.$setPristine();
          $scope.$parent.vm.ischange = false;
        }
      };
    };
  }
})();
