(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('employeeCredential', employeeCredential);
  /** @ngInject */
  function employeeCredential(CORE, DialogFactory, EmployeeFactory, BaseService, UserFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        employeeId: '='
      },
      templateUrl: 'app/directives/custom/employee-credential/employee-credential.html',
      controller: employeeCredenialCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function employeeCredenialCtrl($scope) {
      var vm = this;
      vm.UserPasswordPattern = CORE.UserPasswordPattern;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

      const employeeId = $scope.employeeId ? parseInt($scope.employeeId) : null;
      vm.employeeId = employeeId;

      function getEmployeeDetail() {
        vm.cgBusyLoading = EmployeeFactory.employee().query({ id: vm.employeeId }).$promise.then((employees) => {
          vm.employee = angular.copy(employees.data);
          vm.userId = vm.employee.userID;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      getEmployeeDetail();

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      // destory on event on controller destroy
      $scope.$on('$destroy', () => {
        //saveStandardComponent();
      });


      angular.element(() => {
        BaseService.currentPageForms.push(vm.userForm);
        $scope.$parent.vm.userForm = vm.userForm;
      });

      $scope.$on('savePasswordChanges', () => {
        vm.savePassword();
      });

      vm.savePassword = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.CHANGE_EMP_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.employee.initialName);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LOGOUT_CHANGE_CREDENTIAL,
          canbtnText: CORE.MESSAGE_CONSTANT.KEEP_OLD_CREDENTIAL
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.UpdateUser();
          }
        }, () => {
          $scope.$parent.vm.saveDisable = false;
        }).catch((error) => {
          $scope.$parent.vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      };

      // update user basic info
      vm.UpdateUser = () => {
        if (vm.employee.password && vm.employee.passwordConfirmation) {
          const encryptedPassword = encryptAES(vm.employee.password);
          const encryptedPasswordConfirmation = encryptAES(vm.employee.passwordConfirmation);
          const identityUserId = encryptAES(vm.employee.IdentityUserId);
          const objPassword = {
            userId: identityUserId.toString(),
            NewPassword: encryptedPassword.toString(),
            ConfirmNewPassword: encryptedPasswordConfirmation.toString()
          };

          BaseService.setLoginUserChangeDetail(true);
          $scope.$parent.vm.cgBusyLoading = UserFactory.updateOtherUserPasswordViaIdentity(objPassword).then((result) => {
            if (result.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              const objReuest = { userid: vm.employee.userID };
              $scope.$parent.vm.cgBusyLoading = UserFactory.logOutUserFromAllDevices().query(objReuest).$promise.then((user) => {
                if (user && user.data && !user.errors) {
                  vm.employee.password = null;
                  vm.employee.passwordConfirmation = null;
                  vm.userForm.$setPristine();
                }
                $scope.$parent.vm.saveDisable = false;
              }).catch((error) => {
                $scope.$parent.vm.saveDisable = false;
                return BaseService.getErrorLog(error);
              });
            }
            else {
              $scope.$parent.vm.saveDisable = false;
            }
          });
        }
        else {
          $scope.$parent.vm.saveDisable = false;
          vm.userForm.$setPristine();
          return;
        }
      };
    }
  }
})();
